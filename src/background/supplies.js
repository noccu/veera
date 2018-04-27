/*globals Supplies, Storage, updateUI*/
const SUPPLYTYPE = {treasure: "article", recovery: "normal", evolution: "evolution", skill: "skillplus", augment: "npcaugment"};
//const treasureCategory = {primal: 0, world: 1, uncap: 2, coop: 3, event: 4, showdown: 5, other: 6};
//const consCategory = {recovery: 0, evolution: 1, skill: 2, augment: 3};

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
            var isTreasure = (type == SUPPLYTYPE.treasure);
            var idx = isTreasure ? Supplies.treasure.index : Supplies.consumable.index[type]; //TODO: this doesn't work here, figure out why just for learning
            if (idx[id]) { //Update
                idx[id].count += delta;
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
        State.devlog("Supply indices saved.");
    },
    load: function() {
        function _load(data) {
            Supplies.treasure.index = data.sup_idx_treasure;
            Supplies.consumable.index = data.sup_idx_consumable;
            
            State.devlog("Supply indices loaded.");
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
        return {type: translateItemKind(item.item_kind), 
                id: item.id, 
                delta: parseInt(item.count),
                //In case of new mats
                name: item.name,
                category: item.category_type};
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
            for (let key of Object.keys(boxType)) {
                let item = boxType[key];
                upd.push(makeUpd(item));
            }
        }
    }
    Supplies.update(upd);
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
            return SUPPLYTYPE.treasure;
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