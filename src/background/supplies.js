const category = {primal: 0, world: 1, uncap: 2, coop: 3, event: 4, showdown: 5, other: 6};

window.Supplies = {
    treasure: {
        index: {},
        set: function (json) {
            //TODO: For weapon planner we need items we may not have yet. So gotta init a basic array from a datastore.
            this.index = {};
            for (let item of json) {
                this.index[item.item_id] = {
                    name: item.name, 
                    desc: item.comment, 
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
        getCategory: function (item) {
            if (item.category_type.length == 1) {
                return item.category_type[0];
            } else {
                return item.category_type;
            }
        }
    },
    consumable: {
        index: {
            idx_recovery: {},
            idx_evolution: {},
            idx_augment: {}
        },
        
        set: function (json) {
            var evo = {
                pwrup: json[1], 
                atma: json[2], 
                rings: json[3]
            };
            //types should be order-matched with this.index (help)
            var types = [
                json[0], //recovery
                evo.pwrup[0].concat(evo.pwrup[1], evo.pwrup[2], evo.pwrup[3], evo.atma, evo.rings), //powerups
                evo.pwrup[4].concat(evo.pwrup[5], evo.pwrup[5]) //exp items
            ];
                
            var i = 0;
            for ( let key of Object.keys(this.index) ) {
                var idx = {};
                for (var item of types[i]) {
                    idx[item.item_id] = {name: item.name, desc: item.comment, count: parseInt(item.number)};
                }
                this.index[key] = idx;
                i++;
            }
            // for (item of recovery) {
                // idx_recovery[item.item_id] = {name: item.name, desc: item.comment, count: parseInt(item.number)}
            // }
            // for (item of evolution) {
                // idx_evolution[item.item_id] = {name: item.name, desc: item.comment, count: parseInt(item.number)}
            // }
            // for (item of atma) {
                // idx_atma[item.item_id] = {name: item.name, desc: item.comment, count: parseInt(item.number)}
            // }
            // for (item of rings) {
                // idx_rings[item.item_id] = {name: item.name, desc: item.comment, count: parseInt(item.number)}
            // }
        }
    }
};