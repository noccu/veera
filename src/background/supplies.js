/*globals Supplies, Storage, updateUI, devlog*/
const SUPPLYTYPE = {treasure: "article", recovery: "normal", evolution: "evolution", skill: "skillplus", augment: "npcaugment", NOT_TRACKED: -1};
//const treasureCategory = {primal: 0, world: 1, uncap: 2, coop: 3, event: 4, showdown: 5, other: 6};
//const consCategory = {recovery: 0, evolution: 1, skill: 2, augment: 3};
//ITEM KIND gotten from game response in crate, but incomplete. Manual entries marked.
const ITEM_KIND = {
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
}

window.Supplies = {
    treasure: {
        index: {},
        set: function (json) {//Set the full index, for use with game's supply page.
            //TODO: For weapon planner we need items we may not have yet. So gotta init a basic array from a datastore.
            this.index = {};
            for (let item of json) {
                this.index[item.item_id] = {
                    name: item.name, 
//                    desc: item.comment, 
                    category: item.category_type, 
                    count: parseInt(item.number)
                    };
            }
            
            Supplies.save("t");
            updateUI("setTreasure", this.index);
        },
        get: function (id) {
            if (Array.isArray(id)) {
                var ret = [];
                for (let entry of id) {
                    ret.push( this.get(entry) );
                }
                return ret;
            } else {
                return this.index[id];
            }
        },
    },
    consumable: {
        index: {},       
        set: function (json) {//TODO: should rename to parse or something prob cause that's what it really does
            var index = {
                normal: json[0], //AP/EP
                evolution: json[1], //Bars, etc
                skillplus: json[2], //Atma keys
                npcaugment: json[3] //Rings
            };
                
            //Parses list into index
            function parse(list, idx) {
                for (let item of list) {
                    idx[item.item_id] = {name: item.name, 
//                                         desc: item.comment,
                                         count: parseInt(item.number)};
                }
            }
            
            for ( let type of Object.keys(index) ) {
                let idx = {};
                if (type == SUPPLYTYPE.evolution) { //because ??? thanks cygames
                    for (let arr of index[type]) {
                        parse(arr, idx);
                    }
                } 
                else {
                    parse(index[type], idx);
                }
                this.index[type] = idx;
            }
            
            Supplies.save("c");
            updateUI("setConsumables", this.index);
        },
        get: function (type, id) {
            if (Array.isArray(type)) {
                var ret = [];
                for (let entry of type) {
                    ret.push( this.get(entry.type, entry.id) );
                }
                return ret;
            } else {
                if (this.index[type]) {
                    return this.index[type][id];
                }
            }
        }
    },
    getData: function (type, id) {
        if (type == SUPPLYTYPE.treasure) {
                return this.treasure.get(id); 
        }
        else {
            return this.consumable.get(type, id);
        }
    },
    update: function(updArr) { //[ {type, id, delta} ]
        var treasureUpdated = false,
            consumabledUpdated = false;
        
        function _upd (type, id, delta, name, category) {
            if (type == SUPPLYTYPE.NOT_TRACKED) { return; }
            var isTreasure = (type == SUPPLYTYPE.treasure);
            var idx = isTreasure ? Supplies.treasure.index : Supplies.consumable.index[type];
            if (idx[id]) { //Update
                idx[id].count += delta;
                
                //Check data and fill gaps. Kinda weird but eyy. TODO: can prob optimize.
                //Disabled because so far only category is missing... on every single item.
                //day after: idk I'm p sure this is a bad idea actually but I'll leave it to remind myself category isn't set anywhere apparently.
/*                for (let k of Object.keys(idx[id])) {
                    let i = idx[id][k];
                    if (i == undefined || i == null) {
                        let o = {count: delta,
                                 name,
                                 category};
                        if (o[k]) {
                            i = o[k];
                        }
                    }
                }*/
            }
            else { //Add new
                idx[id] = {name,
                           category,
                           count: delta};
            }
            
            treasureUpdated = treasureUpdated || isTreasure;
            consumabledUpdated = consumabledUpdated || !isTreasure;
        }
        
        for (let item of updArr) {
            _upd(item.type, item.id, item.delta, item.name, item.category);
        }

        if (treasureUpdated) { updateUI("setTreasure", this.treasure.index); }
        if (consumabledUpdated) { updateUI("setConsumables", this.consumable.index); }
    },
    save: function(mode) {
        //TODO: Just xhr it from game on startup.
        var o = {};
        if (!mode || mode == "t") { o.sup_idx_treasure = this.treasure.index; }
        if (!mode || mode == "c") { o.sup_idx_consumable = this.consumable.index; }
        
        Storage.set(o);
        devlog("Supply indices saved.");
    },
    load: function() {
        function _load(data) {
            Supplies.treasure.index = data.sup_idx_treasure;
            Supplies.consumable.index = data.sup_idx_consumable;
            
            devlog("Supply indices loaded.");
            updateUI("setTreasure", Supplies.treasure.index);
            updateUI("setConsumables", Supplies.consumable.index);
        }
        
        Storage.get(["sup_idx_treasure", "sup_idx_consumable"], _load);
    },
    clear: function() {
        this.treasure.index = {};
        this.consumable.index= {};
    }
};

function gotQuestLoot(data) {
    var upd = [];
    function makeUpd(item) {
        let itemData = ITEM_KIND[item.item_kind];
        if (!itemData || itemData.manual) {
            console.warn("Uncertain item type, errors may occur.", JSON.parse(JSON.stringify(item)));
            if (!itemData) { itemData = {path: item.type && item.type.includes("item") ? item.type : ITEM_KIND[10].path} } //default to treasure/article, seems most common. also path's the only thing used so far...
        }
        return {type: translateItemKind(item.item_kind), //TODO: Supply refactor
                id: item.id, 
                delta: parseInt(item.count),
                //In case of new mats
                name: item.name,
                category: item.category_type,
                kind: item.item_kind, //string
                //only for loot?
                path: itemData.path,
                rarity: parseInt(item.rarity)}; 
    }
    
    //Non-box, side-scrolling
    if (data.article_list) {
        for (let key of Object.keys(data.article_list)) {
            let item = data.article_list[key];
            upd.push(makeUpd(item));
        }
    }
    
    //Box drops
    if (data.reward_list) {
        for (let key of Object.keys(data.reward_list)) {
            let boxType = data.reward_list[key]; 
            //BOXTYPES? 1: bronze, 2: silver, 3: gold, 4: red, 11: blue. rarity >= 4 = flip
            for (let item of Object.keys(boxType)) {
                upd.push(makeUpd(boxType[item]));
            }
        }
    }
    Supplies.update(upd);
    DevTools.send("updRaidLoot", upd);
}

function purchaseItem(data) {    
    let upd = []; //Supply update func expects array.
    //Only ever buy 1 item at once... I think?
    if (data.article.item_ids) {
        //The item we get.
        let nBought = parseInt(data.purchase_number);
        upd.push({type: translateItemKind(data.article.item_kind[0]), 
                  id: parseInt(data.article.item_ids[0]), 
                  delta: nBought,
                  //In case of new mats
                  name: data.article.name_en,
                  category: null}); //TODO: figure out what and where... and why
        
        //The items we trade in. Max 4, 1-indexed
        for (let i = 1; i < 5; i++) {
            let ingr = data.article["article" + i];
            if (ingr) {
                let nReq = parseInt(data.article["article" + i + "_number"]);
                upd.push ({type: translateItemKind(ingr.master.item_kind),
                           id: ingr.master.id,
                           delta: -(nReq * nBought),
                           name: ingr.master.name_en,
                           category: null});
            }
        }
        
        Supplies.update(upd);
    }
}

function translateItemKind(kind) {
    switch (parseInt(kind)) {
        case 10:
            return SUPPLYTYPE.treasure;
        case 4:
            return SUPPLYTYPE.recovery;
        case 17:
            return SUPPLYTYPE.evolution; //TODO: check?
        default:
            return SUPPLYTYPE.NOT_TRACKED;
    }
}

function weaponUncapStart(data) {
    var update = { id: data.url.match(/materials\/(\d+)\?/)[1],
                   items: [] };
    
//    update.id = data.url.match(/materials\/(\d+)\?/)[1]; 
    for (let key of Object.keys(data.json)) {
        if (key == "options") { continue; }
        
        let item = data.json[key];
        update.items.push({type: translateItemKind(item.item_kind),
                           id: item.item_id, 
                           delta: (- parseInt(item.item_number)) });
    }
    
    Supplies.pendingUncap = update;
}

function npcUncapStart(data) {
    var update = { id: data.url.match(/materials\/(\d+)\?/)[1],
                   items: [] };
    
//    update.id = data.url.match(/materials\/(\d+)\?/)[1];
    for (let item of data.json.requirements) {        
        update.items.push({type: translateItemKind(item.item_kind.id),
                           id: item.item_id, 
                           delta: (- parseInt(item.item_number)) });
    }
    
    Supplies.pendingUncap = update;
}

function uncapEnd(json) {
    if (Supplies.pendingUncap.id == json.new.id) {
        Supplies.update(Supplies.pendingUncap.items);
    }
}