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
        deverror("No raid data for raid ID " + id);
        return {};
    }
    if (this.data.matCost) {
        for (let mat of this.data.matCost) { //Need to regen with updates on every query.
            mat.supplyData = Supplies.get(SUPPLYTYPE.treasure, mat.id) || {};
        }
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
    /*            for (let raid of idx) {
                    this.list[raid.id] = raid;
                    //Link data to raid, is not saved.
    //                Object.defineProperty(this.getID(rd.id), "data", {
    //                    enumerable: true,
    //                    value: rd
    //                });
                }*/
                Raids.list = idx.raid_list || {};
                devlog(`Raid list loaded, ${Object.keys(Raids.list).length} stored raids of ${RaidList.length} total.`);
                r();
            }

            try {
                Storage.get("raid_list", parse);
            }
            catch (e) {
                deverror("Failed to load raid list.", e);
                x();

    /*            devlog("Attempting initialization.");
                parse({});
                if (Object.keys(this.list).length > 0) { //TODO: p sure there's a more efficient way to check
                    devlog("Initiliazation success.");
                }
                else {
                    devwarn("Failed raid initialization.");
                }*/
            }
        });
    },
    save: function() {
        Storage.set({raid_list: this.list});
    },
    get: function(input) {
        let id = input instanceof RaidData ? input.id : input;
        let raid = this.list[id];
        if (raid) {
            return new RaidEntry(input, raid);
        }
        else {
            return new RaidEntry(input);
        }
//        return this.list[id];
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
//            let entry = new RaidEntry(rd);
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
        return this.list[raidEntry.data.id] = {hosts: raidEntry.hosts,
                                               active: raidEntry.active};

/*        let raid = this.getID(id);
        raid.hosts.today = daily;
        raid.hosts.total = total;
        updateUI("raidListUpdated", raid);*/
    },
    //Updates the tracking object.
    update: function ({action, id, raidEntry}) {
        if (!raidEntry) {
            if (!id) {
                deverror("Invalid data format, can't update raid.");
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
        let raid = this.get(id);
        if (!hostMat && raid.data.matCost) { hostMat = raid.data.matCost[0].id; } //Use default mat.
        let url = raid.data.urls[hostMat || this.NO_HOST_MAT];
        if (url) {
            State.game.navigateTo(url);
//            devlog(url);
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