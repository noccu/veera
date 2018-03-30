// http://game.granbluefantasy.jp/#quest/supporter/300041/1
// http://game.granbluefantasy.jp/#quest/supporter/300501/1/0/41
// supporter/QUEST_ID/1 [/0/HOSTMAT_ID]


window.Elements = {fire:1, water:2, earth:3, wind:4, light:5, dark:6};
window.Raids = {};

import("/src/background/data/raidlist.js").then(o => Raids.List = o.raidInfo);
//console.log(Raids.List);

Raids.getID = function(id) {
    if (!Raids.List) throw "Raid data not loaded.";
    return Raids.List.find(x => x.id == id);
};

function sortByElement (a, b) {
    return Raids.getID(a).element -  Raids.getID(b).element;
  }

function sortByDifficulty (a, b) {
    return Raids.List.find(x => x.id == a).diff - Raids.List.find(x => x.id == b).diff;
  }