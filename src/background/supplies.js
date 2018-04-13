const SUPPLYTYPE = {treasure: "article", recovery: "normal", evolution: "evolution", skill: "skillplus", augment: "npcaugment"};
//const treasureCategory = {primal: 0, world: 1, uncap: 2, coop: 3, event: 4, showdown: 5, other: 6};
//const consCategory = {recovery: 0, evolution: 1, skill: 2, augment: 3};

window.Supplies = {
    treasure: {
        index: {},
        set: function (json) {//TODO: should rename to parse or something prob cause that's what it really does
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
            
            var i = 0;
            for ( let type of Object.keys(index) ) {
                let idx = {};
                if (type == "evolution") { //because ??? thanks cygames
                    for (let arr of index[type]) {
                        parse(arr, idx);
                    }
                } else {
                    parse(index[type], idx);
                }
                this.index[type] = idx;
                i++;
            }
            
            Supplies.save("c");
            updateUI("setConsumables", this.index);
        },
        get: function (type, id) {
            if (Array.isArray(id)) {
                var ret = [];
                for (let entry of id) {
                    ret.push( this.get(entry) );
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
    update: function(type, id, delta) { //TODO: fuck me I'm too lazy lel
        
        function _upd (type, id, delta) {
            var isTreasure = (type == SUPPLYTYPE.treasure);
            var idx = isTreasure ? this.treasure.index : this.consumable.index[type];
            idx[id].count += delta;
        }
        
        if (Array.isArray(type)) {
            for (let item of type) {
                _upd(item.type, item.id, item.delta);
            }
        }
        else {
             _upd(type, id, delta);
        }
                
        if (isTreasure) { updateUI("setTreasure", this.treasure.index); }
        else { updateUI("setConsumables", this.consumable.index); }
    },
    save: function(mode) {
        //TODO: Just xhr it from game on startup.
        var o = {};
        if (!mode || mode == "t") { o.sup_idx_treasure = this.treasure.index; }
        if (!mode || mode == "c") { o.sup_idx_consumable = this.consumable.index; }
        
        Storage.set(o);
    },
    load: function() {
        function _load(data) {
            Supplies.treasure.index = data.sup_idx_treasure;
            Supplies.consumable.index = data.sup_idx_consumable;
            
            console.log("Supply indices loaded");
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
    //Non-box, side-scrolling
    for (let key of Object.keys(data.article_list)) {
        let item = data.article_list[key];
        Supplies.update(SUPPLYTYPE.treasure, item.id, parseInt(item.count));
    }
    
    //Box drops
    for (let key of Object.keys(data.reward_list)) {
        let boxType = data.reward_list[key];
        for (let key of Object.keys(boxType)) {
            let item = boxType[key];
            Supplies.update(translateItemKind(item.item_kind), item.id, parseInt(item.count));
        }
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
            return SUPPLYTYPE.treasure;
    }
}

function weaponUncapStart(data) {
    var update = { items: [] };
    
    update.id = data.url.match(/materials\/(\d+)\?/)[1];
    
    for (let key of Object.keys(data.json)) {
        if (key == "options") { continue; }
        
        let item = data.json[key];
        update.items.push({type: translateItemKind(item.item_kind),
                        id: item.item_id, 
                        delta: item.item_number});
    }
    
    Supplies.queuedUncap = update.items;
}

function weaponUncapEnd(json) {
    if (Supplies.queuedUncap.id == json.new.id) {
        Supplies.update(Supplies.queuedUncap.items);
    }
}