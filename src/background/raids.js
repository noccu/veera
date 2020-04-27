// Raids:
// http://game.granbluefantasy.jp/#quest/supporter/300041/1
// http://game.granbluefantasy.jp/#quest/supporter/300501/1/0/41
// supporter/QUEST_ID/1 [/0/HOSTMAT_ID]

// Solo quests:
// http://game.granbluefantasy.jp/#quest/supporter/102961/3
// http://game.granbluefantasy.jp/#quest/supporter/QUEST_ID/QUEST_TYPE
// const SORT_METHODS;

function RaidEntry(id, trackingObj) {
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
        for (let mat of list) { // Need to regen with updates on every query.
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
    else { // defaults
        this.hosts = {
            today: 0,
            total: 0,
            last: null
        };
        this.active = true;
    }
    RaidEntry.updHostState(this);
}

RaidEntry.updHostState = function(obj) {
    obj.haveHosts = obj.hosts.today < obj.data.dailyHosts;
    obj.haveRank = Profile.status.level ? obj.data.minHostRank <= Profile.status.level : true;
    obj.haveAp = Profile.status.ap.current ? obj.data.apCost <= Profile.status.ap.current : true;
    obj.canHost = obj.haveAp && obj.haveHosts && obj.haveRank;
};

window.Raids = {
    SORT_METHODS: {elements: 0, difficulty: 1},
    NO_HOST_MAT: "noMat",
    list: {},
    pendingHost: {},
    lastHost: {},
    load: function() {
        return new Promise ( (r, x) => {
            function parse(idx) {
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
                deverror(e);
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
        @arg {Raids.SORT_METHODS} sort
        @arg {function} filter
    **/
    getList: function(sort, filter) {
        // function sortByElement(a, b) {
        //     return a.element - b.element;
        // }
        // function sortByDifficulty(a, b) {
        //     return a.diff - b.diff;
        // }

        let output = [];
        for (let rd of RaidList) {
            output.push(this.get(rd));
        }

        if (filter) {
            output = output.filter(filter);
        }
        // switch (sort) {
        //     case this.SORT_METHODS.elements:
        //         output = output.sort(sortByElement);
        //         break;
        //     case this.SORT_METHODS.difficulty:
        //         output = output.sort(sortByDifficulty);
        //         break;
        // }
        return output;
    },
    set: function(raidEntry) {
        return this.list[raidEntry.data.id] = {
            hosts: raidEntry.hosts,
            active: raidEntry.active
        };
    },
    // Updates the tracking object for tracked raids. No effect for others.
    update: function({action, id, matId, raidEntry}) {
        // pendingHost is used here as setLastHost is called afterwards, and copies from it.
        // raidEntry is just a way to skip the lookup when we already have the data, but it loses class when transfered from UI. Maybe it's more potential harm than good long term...
        if (!raidEntry) {
            if (!id) {
                deverror(`Invalid data format, can't update raid ${id}.`);
                return;
            }
            raidEntry = this.get(id);
            if (!raidEntry.data) { return }
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
        RaidEntry.updHostState(raidEntry);
        this.set(raidEntry);
        this.save();
        updateUI("updRaid", raidEntry);
    },
    // Implements all checks and data setup for starting a tracked raid. (AP, mats, etc)
    start: function(id, hostMats) {
        let raid = this.get(id),
            sufficientMats = true,
            hostMatId, usedMats;
        if (raid.data.matCost) { // Need mats?
            if (!hostMats) {
                // Use default mat.
                hostMats = raid.data.matCost[0].id || raid.data.matCost[0].map(x => x.id);
            }
            if (!Array.isArray(hostMats)) { // Normalise to array
                hostMats = [hostMats];
            }
            hostMats.forEach((val, idx) => hostMats[idx] = parseInt(val)); // Strings from html dataset, generally.
            usedMats = this.checkUsedMats(hostMats, raid.data.matCost);
            hostMatId = usedMats.ids[0]; // Only used for visual cue in game.
            sufficientMats = usedMats.ids.length == hostMats.length;
        }
        let url = raid.data.urls[hostMatId || this.NO_HOST_MAT];
        if (url
        && (sufficientMats || !State.settings.blockHostByMats)
        && (raid.haveAp || !State.settings.blockHostByAP)
        && (raid.haveRank || !State.settings.hideRaidsByRank)
        && (raid.haveHosts || !State.settings.blockHostByDailyNum)) {
            this.pendingHost.internalStart = true;
            this.pendingHost.mats = hostMatId ? usedMats.items : [];
            State.game.navigateTo(url);
            if (hostMatId) {
                // eslint-disable-next-line no-undef
                storePendingRaidsTreasure({
                    quest_id: id,
                    treasure_id: usedMats.ids,
                    treasure_kind: usedMats.types,
                    consume: usedMats.nums
                });
            }
        }
        else {
            updateUI("updRaid", raid); // update the hostmat display
            printError(`Can't start raid ${raid.data.name} (${id}). Sufficient mats: ${sufficientMats}, Sufficient AP: ${raid.haveAp}, Sufficient Rank: ${raid.haveRank}, Sufficient hosts: ${raid.haveHosts}, url: ${url}`);
        }
    },
    checkUsedMats(used, costs) {
        let data = {ids: [], types: [], nums: [], items: []};
        // Go through cost array once instead of looping through it for every used mat.
        for (let mat of costs) {
            if (Array.isArray(mat)) {
                data = this.checkUsedMats(used, mat);
            }
            else if (used.includes(mat.id) && (!State.settings.blockHostByMats || mat.num <= mat.supplyData.count)) {
                data.ids.push(mat.id);
                data.types.push(mat.supplyData.type);
                data.nums.push(mat.num);
                // Create update-style objects. Raid objects are not re-used in this context.
                mat.supplyData.count = - mat.num;
                data.items.push(mat.supplyData);
            }
        }
        return data;
    },
    createUrl(id, type, hostmat) {
        return `${GAME_URL.baseGame}${GAME_URL.questStart}${id}/${type}${hostmat ? "/0/" + hostmat : ""}`;
    },
    // Called on page change to a quest, and on starting a quest.
    setPendingHost(data) {
        devlog("pending", data);
        // This is used by Veera's own code on page change to detect setup requirements.
        if (data.url) {
            let match = data.url.match(/supporter\/(?:.+_treasure\/)?(\d+)/);
            let id = match[1];
            // Don't update triggers.
            if (this.triggeredQuest && (id == this.triggeredQuest.id || this.triggeredQuest.isGroup)) {
                this.pendingHost.skip = true;
            }
            else {
                this.pendingHost.skip = false;
                this.pendingHost.url = data.url;
                this.pendingHost.id = id;
            }
        }
        // This is used after starting a raid, but before initializing it. This is the only data is provides aside from ID in the URL.
        // Luckily updates after url.
        else if (data.json && !this.pendingHost.skip) {
            this.pendingHost.name = data.json.chapter_name;
            this.pendingHost.ap = parseInt(data.json.action_point); // Triggers never use AP afaik so we can leave this. Same in setLastHost below.
        }
    },
    // Called on initialization of quest.
    setLastHost() {
        if (!this.pendingHost.skip) {
            devlog(`Updating last hosted quest to: ${this.pendingHost.name}.`);
            this.lastHost.url = this.pendingHost.url;
            this.lastHost.name = this.pendingHost.name;
            this.lastHost.id = this.pendingHost.id;
            this.lastHost.internalStart = this.pendingHost.internalStart;
            this.lastHost.mats = Supplies.pendingRaidHost.hasOwnProperty(this.pendingHost.id) ? Supplies.pendingRaidHost[this.pendingHost.id].items : [];
            Profile.status.ap.current -= this.lastHost.ap = this.pendingHost.ap;

            // Last function called on host, reset some data.
            this.pendingHost.internalStart = false;

            updateUI("setLastHosted", this.lastHost.name);
            updateUI("updStatus", Profile.status);
        }
    },
    repeatLast() {
        if (this.lastHost.url) {
            if (this.lastHost.internalStart) {
                this.start(this.lastHost.id, this.lastHost.mats.map(x => x.id)); // lasthost stores SupplyItems but start expects string or string[] from the UI.
            }
            else {
                if (!State.settings.blockHostByAP || Profile.status.ap.current > this.lastHost.ap) {
                    if (!State.settings.blockHostByMats || !this.lastHost || this.lastHost.mats.every(item => {
                        // We could use item.count as it updates on every host, but this will miss edge cases where the required item is lowered between repeats, so we fetch "new" data.
                        // eg. hosting Nezha with whorls, using up too many whorls in a craft, and then trying to repeat the host.
                        // last.mats stores an update-style object, hence count = delta
                        let sd = Supplies.get(item.type, item.id, true);
                        if (sd) { return sd.count + item.count >= 0 }
                        else return false;
                    } )) {
                        State.game.navigateTo(this.lastHost.url);
                        // Supplies.pendingRaidHost = {[Supplies.lastRaidHost.id]: {items: Supplies.lastRaidHost.items}};
                    }
                    else { printError("Can't repeat quest due to lack of materials.") }
                }
                else { printError("Can't repeat quest due to lack of AP.") }
            }
        }
    },
    // NM Triggers etc
    checkNextQuest(json) {
        if (json.appearance && json.appearance.is_quest) {
            let data = json.appearance,
                name = data.quest_name;
            // Triggered quests never cost hostmats afaik.
            Raids.triggeredQuest = {type: data.quest_type, id: data.quest_id};

            if (data.title && json.url) { // Events with multiple nm quests.
                Raids.triggeredQuest.url = `${GAME_URL.baseGame}#${json.url}`;
                Raids.triggeredQuest.isGroup = true;
                name = data.title;
            }
            if (State.settings.notifyNmTrigger) {
                showNotif("Triggered quest!", {text: name, onclick: Raids.playTriggered});
            }
            updateUI("nextQuestTriggered", {nextQuest: name});
        }
        else { // This would happen when raidLoot updates the UI but it's good to be explicit.
            Raids.triggeredQuest = null;
            updateUI("nextQuestTriggered", {nextQuest: false});
        }
    },
    playTriggered() { // called directly
        if (Raids.triggeredQuest) {
            State.game.navigateTo(Raids.triggeredQuest.isGroup ? Raids.triggeredQuest.url : Raids.createUrl(Raids.triggeredQuest.id, Raids.triggeredQuest.type));
        }
    },
    reset() {
        for (let id in this.list) {
            this.list[id].hosts.today = 0;
        }
        updateUI("updRaid", this.getList());
        this.save();
    },
    evhCheckRaidSupplyData(upd) {
        for (let item of upd.detail) {
            if (IDX_ITEM_TO_RAIDS.has(item.id)) {
                for (let raidId of IDX_ITEM_TO_RAIDS.get(item.id)) {
                    // Auto fetches new supply data.
                    updateUI("updRaid", Raids.get(raidId));
                }
            }
        }
    },
    evhPageChanged(url) {
        if (url.ismatch("#quest/supporter/")) {
            this.setPendingHost({url});
        }
    }
};
