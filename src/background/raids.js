//Raids:
// http://game.granbluefantasy.jp/#quest/supporter/300041/1
// http://game.granbluefantasy.jp/#quest/supporter/300501/1/0/41
// supporter/QUEST_ID/1 [/0/HOSTMAT_ID]

//Solo quests:
// http://game.granbluefantasy.jp/#quest/supporter/102961/3
//const SORT_METHODS;
window.Raids = {
    SORT_METHODS: {elements: 0, difficulty: 1},
    init: function() {
        this.list = Array.from(RaidData);
        for (let raid of this.list) {
            raid.urls = this.createURLs(raid.id, raid.matCost);
            raid.currentHosts = raid.maxHosts;
//            raid.done = false;
            raid.active = true;
        }
    },
    getID: function(id) {
        if (Raids.list){ return Raids.list.find(x => x.id == id); }
        else { State.deverror("Raid data not loaded."); }
    },
    getList: function(sort, filter) {
        let output;
        
        //switch filter here?
        switch (sort) {
            case this.SORT_METHODS.elements:
                output = Array.from(this.list.sort(sortByElement));
                break;
            case this.SORT_METHODS.difficulty:
                output = Array.from(this.list.sort(sortByDifficulty));
                break;
            default:
                output = Array.from(this.list);
        }
        
        
        
        return output;
    },
    createURLs: function(id, mats) {
        var ret = [];
        if (!mats) {
            ret.push(`http://game.granbluefantasy.jp/#quest/supporter/${id}/1`);
        }
        else {
            for (let mat of mats) {
                ret.push(`http://game.granbluefantasy.jp/#quest/supporter/${id}/1/0/${mat.id}`);
            }
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