//commonly used type shorthand. TODO: merge with ITEM_KIND somehow usefully.
const SUPPLYTYPE = {treasure: 10, recovery: 4, evolution: 17, skill: 67, augment: 73, vessels: 75, Untracked: [1,2,3,19,37,38,39,50,82]}; //jshint ignore:line
SUPPLYTYPE.Consumables = [SUPPLYTYPE.recovery, SUPPLYTYPE.evolution, SUPPLYTYPE.augment, SUPPLYTYPE.skill, SUPPLYTYPE.vessels]; //types that make up "consumables" I think skill = 10000 sometimes?

const GAME_URL = {
    baseGame: "http://game.granbluefantasy.jp/",
    assets: "http://game.granbluefantasy.jp/assets_en/img/sp/assets/",
    size: {
        small: "s/",
        medium: "m/"
    }
};
//const treasureCategory = {primal: 0, world: 1, uncap: 2, coop: 3, event: 4, showdown: 5, other: 6};
//const consCategory = {recovery: 0, evolution: 1, skill: 2, augment: 3};
//item_kind/kind and type are used interchangeably here.
//TODO: split off data to different file
//ITEM KIND gotten from game response in crate, but incomplete. Manual entries marked.
const ITEM_KIND = {//jshint ignore:line
    "1": {
        "name": "Weapon",
        "class": "Weapon",
        "path": "weapon"
    },
    "2": {
        "name": "Summon",
        "class": "Summon",
        "path": "summon"
    },
    "3": {
        "name": "Character",
        "class": "Npc",
        "path": "npc"
    },
    "4": {
        "name": "Item",
        "class": "Normal",
        "path": "item/normal"
    },
    "6": {
        "name": "Wonder",
        "class": "Memorial",
        "path": "item/memorial"
    },
    "7": {
        "name": "Rupie",
        "class": "Money",
        "path": "item/normal"
    },
    "8": {
        "name": "Draw Ticket",
        "class": "Ticket",
        "path": "item/ticket"
    },
    "9": {
        "name": "Crystal",
        "class": "Stone",
        "path": "item/normal"
    },
    "10": {
        "name": "Treasure",
        "class": "Article",
        "path": "item/article"
    },
    "16": {
        "name": "Lucky Draw Ticket",
        "class": "Raffleticket",
        "path": "item/ticket"
    },
    "17": {
        "name": "Power-up",
        "class": "Evolution",
        "path": "item/evolution"
    },
    "19": {
        "name": "CP",
        "class": "JobPoint",
        "path": "item/normal"
    },
    "23": {
        "name": "Pick Ticket",
        "class": "Exchangeticket",
        "path": "item/campaign"
    },
    "25": {
        "name": "Event Item",
        "class": "Event\\Temporary",
        "path": "item/event/temporary"
    },
    "31": {
        "name": "Casino Chip",
        "class": "Medal",
        "path": "item/normal"
    },
    "32": {
        "name": "Origin Crystal",
        "class": "RawStone",
        "path": "item/normal"
    },
    "34": {
        "name": "Event Pick Ticket",
        "class": "Eventexchangeticket",
        "path": "item/campaign"
    },
    "37": {
        "name": "Weapon",
        "class": "Additionalweapon",
        "path": "weapon"
    },
    "38": {
        "name": "Summon",
        "class": "Additionalsummon",
        "path": "summon"
    },
    "39": {
        "name": "Character",
        "class": "Additionalnpc",
        "path": "npc"
    },
    "40": {
        "name": "EMP",
        "class": "Limitpoint",
        "path": "item/normal"
    },
    "41": {
        "name": "Gem",
        "class": "Gem",
        "path": "item/normal"
    },
    "43": {
        "name": "Miscellaneous",
        "class": "Specialitem",
        "path": "item/specialitem"
    },
    "49": { //manual
        "name": "ROTB pendants",
        "class": "ROTB",
        "path": "item/event/article",
        manual: true
    },
    "50": {
        "name": "Class Outfit",
        "class": "Job\\Skin",
        "path": "leader"
    },
    "55": {
        "name": "Sweepstake",
        "class": "Lottery",
        "path": "item/lottery"
    },
    "58": {
        "name": "Defense Item",
        "class": "Defendorder",
        "path": "item/defendorder"
    },
    "59": {
        "name": "Siege Shield",
        "class": "Defendorderpoint",
        "path": "item/article"
    },
    "62": {
        "name": "Sticker",
        "class": "Stamp",
        "path": "item/stamp"
    },
    "63": { //manual entry
        "name": "ROTB badges",
        "class": "ROTB",
        "path": "item/event/defeat/platinum",
        manual: true
    },
    "65": {
        "name": "Arcarum Items",
        "class": "Arcarum",
        "path": "item/arcarum"
    },
    "67": { //manual entry
        "name": "Gauph Keys",
        "class": "Keys",
        "path": "item/skillplus",
        manual: true
    },
    "73": {
        "name": "Rings",
        "class": "Npcaugment",
        "path": "item/npcaugment"
    },
    "75": {
        "name": "Recycling",
        "class": "Recycling",
        "path": "item/recycling"
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

function SupplyItem (type, id, count, name) {
    this.type = parseInt(type) || SUPPLYTYPE.treasure;
    this.id = id;
    this.name = name;
    this.count = count;
    this.typeName = ITEM_KIND[type] ? ITEM_KIND[type].name : "Unknown";
    
    for (let t in SUPPLYTYPE) { //TODO: If consumables is always the only type we have then just use that...
        if (Array.isArray(SUPPLYTYPE[t]) && SUPPLYTYPE[t].includes(this.type)) {
//            this.metaType = t[0].toUpperCase() + t.slice(1); 
            this.metaType = t; 
        }
    }
    if (ITEM_KIND[type] && id) {
        this.path = `${GAME_URL.assets}${ITEM_KIND[type].path}/${GAME_URL.size.small}${id}.jpg`;
    }
    if (type == SUPPLYTYPE.treasure && TREASURE_SOURCES[id]) {
        this.location = TREASURE_SOURCES[id].name;
    }
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
            if (typeof arguments[0][0] != "object") {
                deverror("Use getType to look up meta types");
                return;
            }
            let ret = [];
            for (let entry of arguments[0]) {
                ret.push( this.get(entry.type, entry.id) );
            }
            return ret;
        }
        else {
            if (!this.index[type]) {
                deverror("Invalid type lookup: " + type);
                return;
            }
            let item = this.index[type][id];
            if (item) {
                return new SupplyItem(type, id, item.count, item.name);
            }
            else {
                return undefined;
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
            if (SUPPLYTYPE.Untracked.includes(data.type)) { return; }
            
            if (!this.index.hasOwnProperty(data.type)) {
                this.index[data.type] = {};
                devlog("Created new type index: " + data.type);
            }
            this.index[data.type][data.id] = {name: data.name,
                                              count: data.count};
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
                ret = ret.concat(this.getType(t));
            }
        }
        else {
            for (let id in this.index[type]) {
                ret.push(this.get(type, id));
            }
        }
        return ret;
    },
    /**Set the full treasure index, for use with game's supplies page.*/
    setTreasure: function (json) {
        //TODO: For weapon planner we need items we may not have yet. So gotta init a basic array from a datastore.
        if (!json) {return;}
        
        let upd = [];
        for (let item of json) {
            upd.push( new SupplyItem(SUPPLYTYPE.treasure, item.item_id, parseInt(item.number), item.name));
        }

        this.set(upd);
        this.save();
        updateUI("setTreasure", upd); //TODO: merge the event to "update supplies" as it now sends through the type explicitly
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
        updateUI("setConsumables", upd);
    },
    /** Updates supply item data, adding if new. Note: only used for incremental updates, use set() otherwise.
    @arg {{type, id, delta:number, name:string}[]} updArr
    */
    update: function(updArr) {    
        function _upd(item) {
            //            let itemData = ITEM_KIND[type];
            //            if (!ITEM_KIND.hasOwnProperty(type) || UNTRACKED_TYPES.includes(type)) { return; }
            if (!ITEM_KIND[item.type] || ITEM_KIND[item.type].manual) {
                devwarn("Uncertain item type, errors may occur.", JSON.parse(JSON.stringify(item)));
            }

            if (this.index[item.type] && this.index[item.type][item.id]) { //Update
                item.count = this.index[item.type][item.id].count += item.delta;
            }
            else { //Add new
                item.count = item.delta;
                this.set(item); //_upd not called with object = no this
            }
        }
        for (let item of updArr) {
            _upd.call(this, item);
        }

        updateUI("setTreasure", updArr.filter(e => e.type == SUPPLYTYPE.treasure));
        updateUI("setConsumables", updArr.filter(e => SUPPLYTYPE.Consumables.includes(e.type)));
        this.save();
    },
    save: function() {
        //TODO: Just xhr it from game on startup maybe? Violates no-req policy tho.
        Storage.set({sup_idx: this.index});
        devlog("Supply index saved.");
    },
    load: function() {
        function _load(data) {
            this.index = data.sup_idx || {};
            
            devlog("Supply index loaded.");
            updateUI("setTreasure", this.getType(SUPPLYTYPE.treasure));
            updateUI("setConsumables", this.getType(SUPPLYTYPE.Consumables));
        }
        
        Storage.get(["sup_idx"], _load.bind(this));
    },
    clear: function() {
        this.index = {};
    }
};

function gotQuestLoot(data) {
    var upd = [];
    function addUpdItem(entry) {
        let type = entry.item_kind || entry.kind;
        let item = new SupplyItem(type, entry.id, 0, entry.name);
        item.delta = parseInt(entry.count);
        item.rarity = parseInt(entry.rarity);
        if (!item.path) {
            //Read path from response (item.type) or default to treasure, seems most common.
            item.path = entry.type && entry.type.includes("item") ? entry.type : ITEM_KIND[SUPPLYTYPE.treasure].path;
        }
        upd.push(item);
    }
    
    //Non-box, side-scrolling
    if (data.article_list) {
        for (let key of Object.keys(data.article_list)) {
            let entry = data.article_list[key];
            addUpdItem(entry);
        }
    }
    
    //Box drops
    if (data.reward_list) {
        for (let key of Object.keys(data.reward_list)) {
            let boxType = data.reward_list[key]; 
            //BOXTYPES? 1: bronze, 2: silver, 3: gold, 4: red, 11: blue. rarity >= 4: flip
            for (let entry of Object.keys(boxType)) {
                addUpdItem(boxType[entry]);
            }
        }
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
        item = new SupplyItem(data.article.item_kind[0], data.article.item_ids[0], 0, data.article.name_en);
        item.delta = nBought;
        upd.push(item);
        
        //The items we trade in. Max 4, 1-indexed
        for (let i = 1; i < 5; i++) {
            let ingr = data.article["article" + i];
            if (ingr) {
                let nReq = parseInt(data.article["article" + i + "_number"]);
                item = new SupplyItem(ingr.master.item_kind, ingr.master.id, 0, ingr.master.name_en);
                item.delta = -(nReq * nBought);
                upd.push (item);
            }
            else { break; } //assuming ordered list
        }
        
        Supplies.update(upd);
    }
}

function reduce (data) {
    if (data && data.articles) {
        let upd = [];
        for (let item of data.articles) {
            let si = new SupplyItem(item.item_kind_id, item.item_id, 0, item.item_name);
            si.delta = item.item_number + item.bonus_number;
            upd.push(si);
        }
        if (upd) { Supplies.update(upd); }
        
        //upd( rupie, -data.requirement_money);
    }
}

function storeImminentRaidsTreasure (data) {
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
    
    Supplies.currentImminentRaids = store;
    //lmao I could actually just store and save a whole list of raids slowly accrued and use that for speed. Even useful for building Raids/RaidList functionality!
}

function consumeImminentRaidsTreasure (data) {
    if (data.json.result == "ok" && Supplies.currentImminentRaids) {
        let itemData = Supplies.currentImminentRaids.find(x => x.questId == data.postData.quest_id);
        if (itemData) {
            let si = new SupplyItem(itemData.type, itemData.itemId, 0);
            si.delta = - itemData.num;
            Supplies.update([si]);
        }
    }
}

function weaponUncapStart(data) {
    var update = { id: data.url.match(/materials\/(\d+)\?/)[1],
                   items: [] };
    
//    update.id = data.url.match(/materials\/(\d+)\?/)[1]; 
    for (let key of Object.keys(data.json)) {
        if (key == "options") { continue; }
        
        let item = data.json[key],
            si;
        si = new SupplyItem(item.item_kind, item.item_id);
        si.delta = (- parseInt(item.item_number));
        update.items.push(si);
    }
    
    Supplies.pendingUncap = update;
}

function npcUncapStart(data) {
    var update = { id: data.url.match(/materials\/(\d+)\?/)[1],
                   items: [] };
    
//    update.id = data.url.match(/materials\/(\d+)\?/)[1];
    for (let item of data.json.requirements) {
        let si = new SupplyItem(item.item_kind.id, item.item_id);
        si.delta = (- parseInt(item.item_number));
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