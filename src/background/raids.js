/*globals RaidData, Supplies, Raids*/
// http://game.granbluefantasy.jp/#quest/supporter/300041/1
// http://game.granbluefantasy.jp/#quest/supporter/300501/1/0/41
// supporter/QUEST_ID/1 [/0/HOSTMAT_ID]
//const SORT_METHODS;
window.Raids = {
    SORT_METHODS: {elements: 0, difficulty: 1},
    init: function() {
        this.list = Array.from(RaidData);
        for (let raid of this.list) {
            raid.url = [];
            for (let mat of raid.matCost) {
                raid.url.push( this.createURL(raid.id, mat.id) );
            }
            raid.currentHosts = raid.maxHosts;
//            raid.done = false;
            raid.active = true;
        }
    },
    getID: function(id) {
        if (Raids.list){ return Raids.list.find(x => x.id == id); }
        else { State.deverror("Raid data not loaded."); }
    },
    getList: function(sort) {
        switch (sort) {
            case this.SORT_METHODS.elements:
                return Array.from(this.list.sort(sortByElement));
                break;
            case this.SORT_METHODS.difficulty:
                return Array.from(this.list.sort(sortByDifficulty));
            default:
                return this.list;  
        }
    },
    createURL: function(id, mats) {
        var ret = [];
        for (let mat of mats) {
            ret.push(`http://game.granbluefantasy.jp/#quest/supporter/${id}/1/0/${mat}`);
        }
        return ret;
    }
};

//import("/src/background/data/raidlist.js").then(o => Raids.List = o.raidInfo);
//console.log(Raids.List);

function sortByElement (a, b) {
    return a.element - b.element;
}

function sortByDifficulty (a, b) {
    return a.diff - b.diff;
}