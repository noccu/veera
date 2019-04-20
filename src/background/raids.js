//Raids:
// http://game.granbluefantasy.jp/#quest/supporter/300041/1
// http://game.granbluefantasy.jp/#quest/supporter/300501/1/0/41
// supporter/QUEST_ID/1 [/0/HOSTMAT_ID]

//Solo quests:
// http://game.granbluefantasy.jp/#quest/supporter/102961/3
// http://game.granbluefantasy.jp/#quest/supporter/QUEST_ID/QUEST_TYPE
//const SORT_METHODS;

function RaidEntry (id, trackingObj) {
    if (id instanceof RaidData) {
        this.data = id;
    }
    else {
        this.data = RaidList.find(x => x.id == id);
    }
    if (!this.data) {
        devwarn("No raid data for raid ID " + id);
        return {};
    }

    function addSupplyData(list) {
        for (let mat of list) { //Need to regen with updates on every query.
            if (Array.isArray(mat)) {
                addSupplyData(mat);
            }
            else {
                mat.supplyData = Supplies.get(SUPPLYTYPE.treasure, mat.id) || {};
            }
        }
    }
    if (this.data.matCost) {
        addSupplyData(this.data.matCost);
    }

    if (trackingObj) {
        this.hosts = trackingObj.hosts;
        this.active = trackingObj.active;
    }
    else { //defaults
        this.hosts = {today: 0,
                      total: 0,
                      last: null};
        this.active = true;

    }
}
RaidEntry.prototype.canHost = function() {
    return this.hosts.today < this.data.dailyHosts;
};

window.Raids = {
    SORT_METHODS: {elements: 0, difficulty: 1},
    NO_HOST_MAT: "noMat",
    list: {},
    load: function() {
        return new Promise ( (r,x) => {
            function parse (idx) {
                if (idx.raid_list) {
                    Raids.list = idx.raid_list;
                    console.info(`Raid list loaded, ${Object.keys(Raids.list).length} stored raids of ${RaidList.length} total.`);
                }
                else {
                    console.info("No tracked raids.");
                }
                r();
            }

            try {
                Storage.get("raid_list", parse);
            }
            catch (e) {
                console.error(e);
                x("Failed to load raid list.");
            }
        });
    },
    save: function() {
        Storage.set({raid_list: this.list});
    },
    get: function(input) {
        return new RaidEntry(input, this.list[input.id || input]);
    },
    /** Returns the list of raids, optionally filtered and sorted.
        @arg {this.SOORT_METHODS} sort
        @arg {function} filter
    **/
    getList: function(sort, filter) {
        function sortByElement (a, b) {
            return a.element - b.element;
        }
        function sortByDifficulty (a, b) {
            return a.diff - b.diff;
        }

        let output = [];
        for (let rd of RaidList) {
            output.push(this.get(rd));
        }

        if (filter) {
            output = output.filter(filter);
        }
        switch (sort) {
            case this.SORT_METHODS.elements:
                output = output.sort(sortByElement);
                break;
            case this.SORT_METHODS.difficulty:
                output = output.sort(sortByDifficulty);
                break;
        }
        return output;
    },
    set: function (raidEntry) {
        return this.list[raidEntry.data.id] = {hosts: raidEntry.hosts, //jshint ignore:line
                                               active: raidEntry.active};
    },
    //Updates the tracking object.
    update: function ({action, id, raidEntry}) {
        if (!raidEntry) {
            if (!id) {
                deverror(`Invalid data format, can't update raid ${id}.`);
                return;
            }
            raidEntry = this.get(id);
            if (!raidEntry.data) { return; }
        }

        switch (action) {
            case "toggleActive":
                raidEntry.active = !raidEntry.active;
                break;
            case "hosted":
                raidEntry.hosts.today++;
                raidEntry.hosts.total++;
                raidEntry.hosts.last = Date.now();
                break;
        }
        let raid = this.set(raidEntry);

        this.save();
        updateUI("updRaid", raidEntry);
    },
    start: function (id, hostMat) {
        function filterUsedMats(costs) {
            let data = [];
            for (let mat of costs) {
                if (Array.isArray(mat)) {
                    for (let subMat of mat) {
                        if (hostMat.includes(subMat.id)) {
                            data.push(subMat);
                        }
                    }
                }
                else if (hostMat.includes(mat.id)) {
                    data.push(mat);
                }
            }
            return data;
        }

        let raid = this.get(id),
            sufficientMats = true,
            hostMatId, usedMats,
            matIds = [], matTypes = [], matNums = [];
        if (raid.data.matCost) { //Need mats?
            if (!hostMat) {
                //Use default mat.
                hostMat = raid.data.matCost[0].id || raid.data.matCost[0].map(x => x.id);
            }
            if (!Array.isArray(hostMat)) { //Normalise to array
                hostMat = [hostMat];
            }
            usedMats = filterUsedMats(raid.data.matCost);
            if (usedMats.length) { //should always trigger
                hostMatId = usedMats[0].id;
                sufficientMats = usedMats.every(mat => {
                    //Cheat in some data gathering.
                    matIds.push(mat.id);
                    matTypes.push(mat.supplyData.type);
                    matNums.push(mat.num);
                    //What we came for
                    return mat.num <= mat.supplyData.count;});
                //Every can be in lookup since we go through the array anyway. optimize TODO
            }
            else {
                throw "[raid start] can't find hostmats";
            }
        }
        let url = raid.data.urls[hostMatId || this.NO_HOST_MAT];
        if (url && sufficientMats) {
            State.game.navigateTo(url);
            if (hostMatId) {
                storePendingRaidsTreasure({quest_id: id,
                                           treasure_id: matIds,
                                           treasure_kind: matTypes,
                                           consume: matNums});
            }
        }
        else {
            updateUI("updRaid", raid); //update the hostmat display
            deverror(`Can't start raid ${id}. Sufficient mats: ${sufficientMats}, url: ${url}`);
        }
    },
    reset: function() {
        for (let id in this.list) {
            this.list[id].hosts.today = 0;
        }
        updateUI("updRaid", this.getList());
        this.save();
    }
};

//Temporary until proper timing functions
function checkReset () {
    function setResetTime(time) {
        if (time.getUTCHours() < 20) {
            time.setUTCDate(time.getUTCDate() - 1);
        }
        time.setUTCHours(20, 0, 0, 0);
    }
    function setLastReset(time) {
        setResetTime(time);
        State.store.lastReset = time.getTime();
        State.save();
        return time;
    }

    let now = new Date();
    let lastReset = State.store.lastReset;
    if (!lastReset) { //init a new date
        lastReset = setLastReset(new Date());
    }
    else {
        lastReset = new Date(lastReset); //create date obj from timestamp
    }

    if (now - lastReset > 86400000) {
        devlog("Resetting raids...");
        Raids.reset();
        lastReset = setLastReset(new Date(now));
    }
    let newReset = new Date(lastReset.getTime() + 86401000);
     setTimeout(checkReset, newReset - now);
}

//import("/src/background/data/raidlist.js").then(o => Raids.List = o.raidInfo);
//console.log(Raids.List);


//NM Triggers etc
function checkNextQuest(data) {
    if (data.appearance) {
        DevTools.send("nextQuestTriggered", {nextQuest: data.appearance.quest_name});
    }

    /* data dump
        appearance:
            chapter_id: "51005"
        group_id: "100"
        is_normal_hell: {
            type: true
        }
        is_quest: true
        location_id: "10000"
        open_chapter_id: "51005"
        quest_id: "510051"
        quest_name: "Dimension Halo"
        quest_type: "5"
    */
}