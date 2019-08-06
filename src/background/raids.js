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
    pendingHost: {},
    lastHost: {},
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
    createUrl(id, type, hostmat) {
        return `${GAME_URL.baseGame}${GAME_URL.questStart}${id}/${type}${hostmat ? "/0/" + hostmat : ""}`;
    },
    setPendingHost(data) {
        devlog("pending", data);
        //They are set separately anyway.
        if (data.url) {
            let id = data.url.match(/supporter\/(?:.+_treasure\/)?(\d+)/)[1];
            //Don't update triggers.
            if (this.triggeredQuest && (id == this.triggeredQuest.id || this.triggeredQuest.isGroup)) {
                this.pendingHost.skip = true;
            }
            else {
                this.pendingHost.skip = false;
                this.pendingHost.url = data.url;
                this.pendingHost.id = id;
            }
        }
        //Luckily updates after url.
        else if (data.json && !this.pendingHost.skip) {
            this.pendingHost.name = data.json.chapter_name;
            this.pendingHost.ap = parseInt(data.json.action_point); //Triggers never use AP afaik so we can leave this. Same in setLastHost below.
        }
    },
    setLastHost(json) {
        if (!this.pendingHost.skip) {
            devlog(`Updating last hosted quest to: ${this.pendingHost.name}.`);
            this.lastHost.url = this.pendingHost.url;
            this.lastHost.name = this.pendingHost.name;
            this.lastHost.id = this.pendingHost.id;
            Profile.status.ap.current -= this.pendingHost.ap;
            updateUI("setLastHosted", this.lastHost.name);
            updateUI("updStatus", Profile.status);
        }
    },
    repeatLast() {
        if (this.lastHost.url) {
            State.game.navigateTo(this.lastHost.url);
        }
    },
    playTriggered() { //called directly
        if (Raids.triggeredQuest) {
            State.game.navigateTo(Raids.triggeredQuest.isGroup ? Raids.triggeredQuest.url : Raids.createUrl(Raids.triggeredQuest.id, Raids.triggeredQuest.type));
        }
    },
    reset: function() {
        for (let id in this.list) {
            this.list[id].hosts.today = 0;
        }
        updateUI("updRaid", this.getList());
        this.save();
    },
    evhPageChanged (url) {
        if (url.ismatch("#quest/supporter/")) {
            this.setPendingHost({url});
        }
    }
};


function evhCheckRaidSupplyData (upd) {
    for (let item of upd.detail) {
        if (IDX_ITEM_TO_RAIDS.has(item.id)) {
            for (let raidId of IDX_ITEM_TO_RAIDS.get(item.id)) {
                //Auto fetches new supply data.
                updateUI("updRaid", Raids.get(raidId));
            }
        }
    }
}

//NM Triggers etc
function checkNextQuest(json) {
    if (json.appearance && json.appearance.is_quest) {
        let data = json.appearance,
            name = data.quest_name;
        //Triggered quests never cost hostmats afaik.
        Raids.triggeredQuest = {type: data.quest_type, id: data.quest_id};

        if (data.title && json.url) { //Events with multiple nm quests.
            Raids.triggeredQuest.url = `${GAME_URL.baseGame}#${json.url}`;
            Raids.triggeredQuest.isGroup = true;
            name = data.title;
        }
        showNotif("Triggered quest!", {text: name, onclick: Raids.playTriggered});
        updateUI("nextQuestTriggered", {nextQuest: name});
    }
    else { //This would happen when raidLoot updates the UI but it's good to be explicit.
        Raids.triggeredQuest = null;
        updateUI("nextQuestTriggered", {nextQuest: false});
    }
}
