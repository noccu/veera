//commonly used type shorthand. TODO: merge with ITEM_KIND somehow usefully.
const SUPPLYTYPE = {treasure: 10, recovery: 4, evolution: 17, skill: 67, augment: 73, vessels: 75, crystals: 9, rupie: 7, drawTickets: 8, Untracked: [1,2,37,38,39,50,82]}; //jshint ignore:line
SUPPLYTYPE.Consumables = [SUPPLYTYPE.recovery, SUPPLYTYPE.evolution, SUPPLYTYPE.augment, SUPPLYTYPE.skill, SUPPLYTYPE.vessels]; //types that make up "consumables" I think skill = 10000 sometimes?
SUPPLYTYPE.Currencies = [SUPPLYTYPE.crystals, SUPPLYTYPE.rupie, 19, 31];

const GAME_URL = {//jshint ignore:line
    baseGame: "http://game.granbluefantasy.jp/",
    assets: "assets_en/img/sp/assets/",
    assets_light: "assets_en/img_light/sp/assets/",
    size: {
        small: "s/",
        medium: "m/",
        questMedium: "qm/"
    }
};
//const treasureCategory = {primal: 0, world: 1, uncap: 2, coop: 3, event: 4, showdown: 5, other: 6};
//const consCategory = {recovery: 0, evolution: 1, skill: 2, augment: 3};
//item_kind, kind, and type are used interchangeably here.
//TODO: split off data to different file
//ITEM KIND gotten from game response in crate, but incomplete. Manual entries marked.
const ITEM_KIND = {//jshint ignore:line
    1: {
        name: "Weapon",
        class: "Weapon",
        path: "weapon"
    },
    2: {
        name: "Summon",
        class: "Summon",
        path: "summon"
    },
    3: {
        name: "Character",
        class: "Npc",
        path: "npc",
        suffix: "_01"
    },
    4: {
        name: "Item",
        class: "Normal",
        path: "item/normal"
    },
    6: {
        name: "Wonder",
        class: "Memorial",
        path: "item/memorial"
    },
    7: {
        name: "Rupie",
        class: "Money",
        path: "item/normal"
    },
    8: {
        name: "Draw Ticket",
        class: "Ticket",
        path: "item/ticket",
        noSize: true
    },
    9: {
        name: "Crystal",
        class: "Stone",
        path: "item/normal"
    },
    10: {
        name: "Treasure",
        class: "Article",
        path: "item/article"
    },
    16: {
        name: "Lucky Draw Ticket",
        class: "Raffleticket",
        path: "item/ticket"
    },
    17: {
        name: "Power-up",
        class: "Evolution",
        path: "item/evolution"
    },
    19: {
        name: "CP",
        class: "JobPoint",
        path: "item/normal"
    },
    23: {
        name: "Pick Ticket",
        class: "Exchangeticket",
        path: "item/campaign"
    },
    25: {
        name: "Event Item",
        class: "Event\\Temporary",
        path: "item/event/temporary"
    },
    31: {
        name: "Casino Chip",
        class: "Medal",
        path: "item/normal"
    },
    32: {
        name: "Origin Crystal",
        class: "RawStone",
        path: "item/normal"
    },
    34: {
        name: "Event Pick Ticket",
        class: "Eventexchangeticket",
        path: "item/campaign"
    },
    37: {
        name: "Weapon",
        class: "Additionalweapon",
        path: "weapon"
    },
    38: {
        name: "Summon",
        class: "Additionalsummon",
        path: "summon"
    },
    39: {
        name: "Character",
        class: "Additionalnpc",
        path: "npc"
    },
    40: {
        name: "EMP",
        class: "Limitpoint",
        path: "item/normal"
    },
    41: {
        name: "Gem",
        class: "Gem",
        path: "item/normal"
    },
    43: {
        name: "Miscellaneous",
        class: "Specialitem",
        path: "item/specialitem"
    },
    49: { //manual
        name: "ROTB pendants",
        class: "ROTB",
        path: "item/event/article",
        manual: true
    },
    50: {
        name: "Class Outfit",
        class: "Job\\Skin",
        path: "leader"
    },
    55: {
        name: "Sweepstake",
        class: "Lottery",
        path: "item/lottery"
    },
    58: {
        name: "Defense Item",
        class: "Defendorder",
        path: "item/defendorder"
    },
    59: {
        name: "Siege Shield",
        class: "Defendorderpoint",
        path: "item/article"
    },
    62: {
        name: "Sticker",
        class: "Stamp",
        path: "item/stamp"
    },
    63: { //manual entry
        name: "ROTB badges",
        class: "ROTB",
        path: "item/event/defeat/platinum",
        manual: true
    },
    65: {
        name: "Arcarum Items",
        class: "Arcarum",
        path: "item/arcarum"
    },
    67: { //manual entry
        name: "Gauph Keys",
        class: "Keys",
        path: "item/skillplus",
        manual: true
    },
    73: {
        name: "Rings",
        class: "Npcaugment",
        path: "item/npcaugment"
    },
    75: {
        name: "Recycling",
        class: "Recycling",
        path: "item/recycling"
    }
};
const TREASURE_SOURCES = { //list of item id -> quest id, quest name for farming. TODO: add IDs also move these 2 consts to own file.
    2: {id: -1, name: "Scattered Cargo (1/115)"},
    3: {id: -1, name: "Scattered Cargo (1/115)"},
    5: {id: -1, name: "Special Op's Request (8) or Lucky Charm Hunt (6)"},
    6: {id: -1, name: "Threat to the Fisheries (9)"},
    8: {id: -1, name: "Whiff of Danger (13/39/52) or The Fruit of Lumacie (13/39/52)"},
    17: {id: -1, name: "Whiff of Danger (13/39/52) or The Fruit of Lumacie (13/39/52)"},
    22: {id: -1, name: "What's in the Box? (20) or I Challenge You! (17, use Belle Sylphid)"},
    24: {id: -1, name: "Strength and Chivalry (18) or What's in the Box? (20)"},
    28: {id: -1, name: "Playing Cat and Mouse (22) or For Whom the Bell Tolls (22)"},
    29: {id: -1, name: "Playing Cat and Mouse (22) or For Whom the Bell Tolls (22)"},
    39: {id: -1, name: "Miscongeniality (32/41) or New Leaf (30/44/65) or The Dungeon Diet (30/44/65)"},
    40: {id: -1, name: "Miscongeniality (32/41) or New Leaf (30/44/65) or The Dungeon Diet (30/44/65)"}
};
//Pathnames that don't follow the usual pattern, organized as item_kind -> item_id -> filename
const ITEM_SPECIAL_ID = {
    //Just a note: type 9, id 0 = rupie icon
    9: {
        0: "gem" //Crystals
    },
    7: {
        0: "lupi"
    },
    19: {
        0: "jp"
    },
    31: {
        0: "casino_medal"
    }
};

function SupplyItem (type = SUPPLYTYPE.treasure, id = 0, count = 0, name = "Unknown") {
    this.type = parseInt(type);
    this.id = parseInt(id);
    this.count = parseInt(count);
    if (Number.isNaN(this.type) || Number.isNaN(this.id) || Number.isNaN(this.count)) {
        throw new TypeError("[SupplyItem] Type, id, or count does not resolve to number.");
    }
    let data = ITEM_KIND[type];
    this.name = name;
    this.typeName = data ? data.name : "Unknown";

    for (let t in SUPPLYTYPE) {
        if (Array.isArray(SUPPLYTYPE[t]) && SUPPLYTYPE[t].includes(this.type)) {
            this.metaType = t;
            break;
        }
    }
    if (data) {
        let fname = id;
        if (ITEM_SPECIAL_ID[type] && ITEM_SPECIAL_ID[type][id]) {
            fname = ITEM_SPECIAL_ID[type][id];
        }
        if (!fname) { //don't want any undefined.jpg in their server logs lmao
            devwarn("[SupplyItem] Invalid path, nuking: ", this);
            this.path = "";
        }
        else {
            this.path = `${GAME_URL.baseGame}${GAME_URL.assets_light}${data.path}/${data.noSize ? "" : GAME_URL.size.small}${fname}${data.suffix || ""}.jpg`;
        }
    }
    if (type == SUPPLYTYPE.treasure && TREASURE_SOURCES[id]) {
        this.location = TREASURE_SOURCES[id].name;
    }
    this.track = !SUPPLYTYPE.Untracked.includes(type);
}
//TODO: For weapon planner we need items we may not have yet. So gotta init a basic array from a datastore.
window.Supplies = {
    index: {},
    /** Look up information on a specific supply item or list of items.
    @arg {(number=10|{type: number, id: number}[])} type - The {@link ITEM_KIND} to look up, or a list of items with type and id set.
    @arg {number} id - The id to look up.
    @returns {Object|Object[]} The item's data or array of item data.
    */
    get: function (type, id) {
        if (Array.isArray(arguments[0])) {
            let ret = [];
            for (let entry of arguments[0]) {
                ret.push( this.get(entry.type, entry.id) );
            }
            return ret;
        }
        else {
            if (!this.index[type]) {
                console.warn("[Supplies] No such type: " + type);
                return;
            }
            let item = this.index[type][id];
            if (item) {
                return new SupplyItem(type, id, item.count, item.name);
            }
        }
    },
    /** Set or create information on a specific supply item or list of items.
    @arg {(number=10|{type: number, id: number, data: Object}[])} type - The {@link ITEM_KIND} to add, or a list of items with set()'s arguments as properties.
    @arg {number} id - The id to add.
    */
    set: function (data) {
        if (Array.isArray(data)) {
            for (let entry of data) {
                this.set(entry);
            }
        }
        else {
            if (data.track) {
                if (!this.index.hasOwnProperty(data.type)) {
                    this.index[data.type] = {};
                    devlog("Created new type index: " + data.type);
                }
                this.index[data.type][data.id] = {
                    name: data.name,
                    count: data.count
                };
            }
        }
    },
    /**Gets the list of items belonging to a specific {@link SUPPLY_TYPES}.
    @arg {SUPPLY_TYPES} type
    @returns {Object[]}
    */
    getType: function (type) {
        let ret = [];
        if (Array.isArray(type)) {
            for (let t of type) {
                ret = ret.concat(this.getType(t) || []);
            }
        }
        else {
            if (SUPPLYTYPE.Untracked.includes(parseInt(type))) { return; } //TODO: temp quiet currently awkward data
            for (let id in this.index[type]) {
                ret.push(this.get(type, id));
            }
        }
        return ret;
    },
    getAll() {
        return this.getType(Object.keys(this.index));
    },
    /**Set the full treasure index, for use with game's supplies page.*/
    setTreasure: function (json) {
        if (!json) {return;}

        let upd = [];
        for (let item of json) {
            upd.push( new SupplyItem(SUPPLYTYPE.treasure, item.item_id, parseInt(item.number), item.name));
        }

        this.set(upd);
        this.save();
        updateUI("updSupplies", upd);
    },
    /**Set the full consumables index, for use with game's supplies page.*/
    setConsumables: function (json) {
        if (!json) {return;}

        let data = {},
            upd = [];
        data[SUPPLYTYPE.recovery] = json[0]; //AP/EP
        data[SUPPLYTYPE.evolution] = json[1]; //Bars, etc
        data[SUPPLYTYPE.skill] = json[2]; //Atma keys
        data[SUPPLYTYPE.augment] = json[3]; //Rings
        data[SUPPLYTYPE.vessels] = json[4]; //EXP vessels

        /** Parses list into index
        @arg {Object[]} list
        @arg {Object} idx
        */
        function parse(list, type) {
            for (let item of list) {
                if (Array.isArray(item)) {
                    parse(item, type);
                }
                else {
                    upd.push(new SupplyItem(type, item.item_id, parseInt(item.number), item.name));
                }
            }
        }

        for (let type in data) {
            parse(data[type], type);
        }

        this.set(upd);
        this.save();
        updateUI("updSupplies", upd);
    },
    setTickets (json) {
        if (json) {
            let upd = [];
            for (let arr of json) {
                for (let item of arr) {
                    upd.push( new SupplyItem(SUPPLYTYPE.drawTickets, item.item_id, item.number, item.name) );
                }
            }
            this.set(upd);
            this.save();
            updateUI("updSupplies", upd);
        }
    },
    /**Updates supply item data, adding if new. Used for incremental updates, use set() otherwise.
    @arg {SupplyItem[]]} updArr - Array of items to update. Uses count prop as delta.**/
    update: function(updArr) {
        function _upd(item) {
            if (item.track) {
                if (!ITEM_KIND[item.type] || ITEM_KIND[item.type].manual) {
                    devwarn("Uncertain item type, errors may occur.", JSON.parse(JSON.stringify(item)));
                }

                if (this.index[item.type] && this.index[item.type][item.id]) { //Update
                    item.count = this.index[item.type][item.id].count += item.count;
                }
                else { //Add new
                    this.set(item);
                }
            }
        }
        for (let item of updArr) {
            _upd.call(this, item);
        }

        updateUI("updSupplies", updArr);
        this.save();
    },
    save: function() {
        Storage.set({sup_idx: this.index});
        devlog("Supply index saved.");
    },
    load: function() { //Called out of context
        return new Promise((r,x) => {
            function _load(data) {
                if (data.sup_idx) {
                    Supplies.index = data.sup_idx;

                    console.info("Supply index loaded.");
                }
                else {
                    //TODO: Load basic store or consider xhr
                    console.warn("Supply index not found, some functionality will be dodgy until you visit game supplies page and reload Veera.");
                }
                r();
            }
            try {
                Storage.get(["sup_idx"], _load);
            }
            catch (e) {
                console.error(e);
                x("Failed to load supplies.");
        }
        });
    },
    clear: function() {
        this.index = {};
    }
};

function gotQuestLoot(data) {
    var upd = [];
    function addUpdItem(entry) {
        let type = entry.item_kind || entry.kind,
            id = entry.id || entry.item_id,
            count = entry.count || entry.num,
            name = entry.name || entry.item_name;

        let item = new SupplyItem(type, id, count, name);
        if (entry.rarity) {
            item.rarity = parseInt(entry.rarity);
        }
        if (!item.path) {
            //Read path from response (entry.type) or default to treasure, seems most common.
            item.path = type && type.includes("item") ? type : ITEM_KIND[SUPPLYTYPE.treasure].path;
        }
        upd.push(item);
    }

    //Non-box, side-scrolling
    let loot = data.rewards.article_list,
        content;
    if (loot.length == undefined) { //It's an array when empty apparently...
        content = Object.keys(loot);
        for (let key of content) {
            let entry = loot[key];
            addUpdItem(entry);
        }
        devlog(`[Loot] Got ${content.length} items from side-scroll.`);
    }

    //Box drops
    loot = data.rewards.reward_list;
    if (loot.length == undefined) { //An object when not
        let numItems = 0;
        for (let key of Object.keys(loot)) {
            let boxType = loot[key];
            //BOXTYPES? 1: bronze, 2: silver, 3: gold, 4: red, 11: blue. rarity >= 4: flip
            for (let entry of Object.keys(boxType)) {
                addUpdItem(boxType[entry]);
                numItems++;
            }
        }
        devlog(`[Loot] Got ${numItems} items from boxes.`);
    }

    //Arcarum chests
    loot = data.contents;
    if (loot) { //Is actually an array or undef/missing.
        for (let item of loot) {
            addUpdItem(item);
        }
        devlog(`[Loot] Got ${loot.length} items from arcarum chest.`);
    }
    Supplies.update(upd);
    DevTools.send("updRaidLoot", {loot: upd});
}

function purchaseItem(data) {
    let upd = [],
        item; //Supply update func expects array.
    //Only ever buy 1 (type of) item at once... I think?
    if (data.article.item_ids) {
        //The item we get.
        let nBought = parseInt(data.purchase_number);
        item = new SupplyItem(data.article.item_kind[0], data.article.item_ids[0], nBought, data.article.name_en);
        upd.push(item);

        //The items we trade in. Max 4, 1-indexed
        for (let i = 1; i < 5; i++) {
            let ingr = data.article["article" + i];
            if (ingr) {
                let nReq = parseInt(data.article["article" + i + "_number"]);
                item = new SupplyItem(ingr.master.item_kind, ingr.master.id, -(nReq * nBought), ingr.master.name_en);
                upd.push (item);
            }
            else { break; } //assuming ordered list
        }

        Supplies.update(upd);
    }
}

function cratePickup(data) { //single item pick up TODO: check multi
    let upd = [];
    function parse(entry) {
        let si = new SupplyItem(entry.item_kind_id, entry.item_id, entry.number, entry.item_name);
        upd.push(si);
    }

    if (Array.isArray(data.presents)) { //Pickup all
        for (let item of data.presents) {
            parse(item);
        }
    }
    else { //pickup single
        parse(data.presents);
    }

    Supplies.update(upd);
}
function trophyPickup(data) {
    let upd = [],
        si, id;
    for (let item in data.reward) {
        id = item.slice(item.lastIndexOf("_") + 1);
        item = data.reward[item];
        si = new SupplyItem(item.item_kind, id, item.number, item.item);
        upd.push(si);
    }

    Supplies.update(upd);
}

function reduce (data) {
    if (data && data.articles) {
        let upd = [];
        for (let item of data.articles) {
            let si = new SupplyItem(item.item_kind_id, item.item_id, item.item_number + item.bonus_number, item.item_name);
            upd.push(si);
        }
        upd.push( new SupplyItem(SUPPLYTYPE.rupie, 0, - parseInt(data.requirement_money), "Rupie") );
        
        Supplies.update(upd);
    }
}

function storePendingRaidsTreasure (data) {
    function parseHtml (s, decode) {
        let p = new DOMParser();
        return p.parseFromString(decode ? decodeURIComponent(s) : s, "text/html");
    }
    let store = [];

    //normal raids
    if (data.json.quest_id) {
        for (let i = 0; i < data.json.treasure_id.length; i++) {
            store.push({questId: data.json.quest_id,
                        itemId: data.json.treasure_id[i],
                        type: data.json.treasure_kind[i],
                        num: parseInt(data.json.consume[i]) });
        }
    }
    //event raids
    else if (data.json.option) {
        data = parseHtml(data.json.option.quest.list, true);
        let list = data.querySelectorAll("[id*=raid]");

        for (let entry of list) {
            entry = parseHtml(entry.innerHTML, false);
            let itemNum = entry.querySelector(".consume .txt-article-num"),
                questData = entry.querySelector("[data-treasure-id]");
            if (itemNum && questData && questData.dataset.treasureId) {
                store.push({questId:questData.dataset.questId,
                            itemId: questData.dataset.treasureId,
                            num: parseInt(itemNum.textContent),
                            type: SUPPLYTYPE.treasure });
            }
        }
    }

    Supplies.pendingRaidHost = store;
    //lmao I could actually just store and save a whole list of raids slowly accrued and use that for speed. Even useful for building Raids/RaidList functionality!
}

function consumePendingRaidsTreasure (data) {
    if (data.json.result == "ok" && Supplies.pendingRaidHost) {
        let itemData = Supplies.pendingRaidHost.find(x => x.questId == data.postData.quest_id && x.itemId == data.postData.use_item_id);
        if (itemData) {
            let si = new SupplyItem(itemData.type, itemData.itemId, itemData.num);
            Supplies.update([si]);
        }
    }
}

function weaponUncapStart(data) {
    var update = { id: data.url.match(/materials\/(\d+)/)[1],
                   items: [] };

//    update.id = data.url.match(/materials\/(\d+)\?/)[1];
    for (let key of Object.keys(data.json)) {
        if (key == "options") { continue; }

        let item = data.json[key],
            si;
        si = new SupplyItem(item.item_kind, item.item_id, - parseInt(item.item_number));
        update.items.push(si);
    }

    Supplies.pendingUncap = update;
}

function npcUncapStart(data) {
    var update = { id: data.url.match(/materials\/(\d+)/)[1],
                   items: [] };

//    update.id = data.url.match(/materials\/(\d+)\?/)[1];
    for (let item of data.json.requirements) {
        let si = new SupplyItem(item.item_kind.id, item.item_id, - parseInt(item.item_number));
        update.items.push(si);
    }

    Supplies.pendingUncap = update;
}

function uncapEnd(json) {
    if (Supplies.pendingUncap.id == json.new.id) {
        Supplies.update(Supplies.pendingUncap.items);
        delete Supplies.pendingUncap;
    }
}

function storePendingJobUnlock(data) {
    let items = [],
        si;
    for (let item of data.json.job.use_item) {
        si = new SupplyItem(item.article_kind || SUPPLYTYPE.treasure, item.master.id, - parseInt(item.use_item_number), item.master.name_en);
        items.push(si);
    }

    Supplies.pendingJob = {id: data.master.id,
                            cp: parseInt(data.job.use_job_point),
                            items};
}

function consumePendingJobUnlock(data) {
    if (data.json.success && data.postData.job_id == Supplies.pendingJob.id) {
        Supplies.update(Supplies.pendingJob.items);
        delete Supplies.pendingJob;
    }
}

function storePendingForgeCCW (data) {
    Supplies.pendingForge = {newWeapId: data.weapon_new.weapon_id,
                            items: []};
    for (let item of data.list) {
        let si = new SupplyItem(item.kind, item.id,  - parseInt(item.article_num), item.item_name);
        Supplies.pendingForge.items.push(si);
    }
}
function consumePendingForgeCCW (data) {
    if ((data.new_weapon || data.get_weapon) == Supplies.pendingForge.newWeapId) {
        Supplies.update(Supplies.pendingForge.items);
        delete Supplies.pendingForge;
    }
}