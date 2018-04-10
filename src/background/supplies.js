const SUPPLYTYPE = {treasure: "article", recovery: "normal", evolution: "evolution", skill: "skillplus", augment: "npcaugment"};
//const treasureCategory = {primal: 0, world: 1, uncap: 2, coop: 3, event: 4, showdown: 5, other: 6};
//const consCategory = {recovery: 0, evolution: 1, skill: 2, augment: 3};

window.Supplies = {
    treasure: {
        index: {},
        set: function (json) {
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
        set: function (json) {
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
                return this.index[type][id];
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
    update: function(type, id, delta) {
        var isTreasure = type == SUPPLYTYPE.treasure;
        var idx = isTreasure ? this.treasure.index : this.consumable.index[type];
        idx[id].count += delta;
        
        if (isTreasure) { updateUI("setTreasure", this.treasure.index); }
        else { updateUI("setConsumables", this.consumable.index); }
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