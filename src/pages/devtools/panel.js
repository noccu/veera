/*globals BackgroundPage: true*/
window.UI = {
    getTheme: function() {
        BackgroundPage.send({
            query: "theme"
        });
    },
    setTheme: function (fname) {
        var sheet = document.getElementById("theme");
        if (!fname) {console.log("No theme file given, using default."); fname = "night";}
        sheet.href = `../stylesheets/${fname}.css`;
    },

    //Input: {id, value} optionally in Array
    //Updates every id in upd with the given value.
    setValue: function (upd) {
        if (Array.isArray(upd)) {
            for (let entry of upd) {
                this.setValue({id: entry.id, value: entry.value});
            }
        }
        else {
            var ele = document.getElementById(upd.id);
            ele.textContent = upd.value;
        }
    }
};

function createSupplyItem (name, num, thumb) {
        var t = document.getElementById("template-supply-item");
        t.content.querySelector("li").title = name;
        t.content.querySelector("img").src = thumb;
        t.content.querySelector("div").textContent = num;
        return document.importNode(t.content, true);
    }

function updatePendants (data) {
    UI.setValue([{
        id: "display-renown-total", 
        value: data.renown.total.current
        },{
        id: "panel-renown-weekly", 
        value: data.renown.weekly.current
        },{
        id: "panel-renown-daily", 
        value: data.renown.daily.current
        },{
        id: "panel-renown-sr", 
        value: data.renown.sr.current
        },{
        id: "panel-renown-r", 
        value: data.renown.r.current
        },{
        id: "display-prestige-total", 
        value: data.prestige.total.current
        },{
        id: "panel-prestige-weekly", 
        value: data.prestige.weekly.current
        },{
        id: "panel-prestige-crew", 
        value: data.prestige.crew.current
        }
    ]);
    UI.setValue([{
        id: "display-renown-max", 
        value: data.renown.total.max
        },{
        id: "panel-renown-weekly-max", 
        value: data.renown.weekly.max
        },{
        id: "panel-renown-daily-max", 
        value: data.renown.daily.max
        },{
        id: "panel-renown-sr-max", 
        value: data.renown.sr.max
        },{
        id: "panel-renown-r-max", 
        value: data.renown.r.max
        },{
        id: "display-prestige-max", 
        value: data.prestige.total.max
        },{
        id: "panel-prestige-weekly-max", 
        value: data.prestige.weekly.max
        },{
        id: "panel-prestige-crew-max", 
        value: data.prestige.crew.max
        }
    ]);
}

function updateStatus (data) {
    UI.setValue([{
        id: "ap-current",
        value: data.ap
    },{
        id: "bp-current",
        value: data.bp
    },{
        id: "ap-max",
        value: data.apMax
    },{
        id: "rank",
        value: data.lvl
    }/*,{
        id: "",
        value: data.lvlP
    }*/
    //TODO: level bar
    ]);
    
    var d = document.getElementById("ap-bp-display");
//    if (data.ap > data.apMax || data.bp > 10) {
//        d.classList.add("highlight");
//    } else {
//        d.classList.remove("highlight");
//    }
    d.classList.toggle("highlight", data.ap > data.apMax || data.bp > 10);
}

function updateTreasure (data) {
    var tlist = document.getElementById("treasure-list");
    var temp = document.createElement("template");
    for (let id in data) {
        if (data.hasOwnProperty(id)) {
            var li = createSupplyItem(data[id].name, data[id].count, createSupplyURL(id, "article"));
            tlist.appendChild(li);
        }
    }
    tlist.appendChild(temp.content);
}

function updateConsumables (data) {
    var tlist = document.getElementById("consumable-list");
    var temp = document.createElement("template");
    for (let idx in data) {
        if (data.hasOwnProperty(idx)) {
            for (let id in data[idx]) {
                if (data[idx].hasOwnProperty(id)) {
                    var li = createSupplyItem(data[idx][id].name, 
                                                 data[idx][id].count, 
                                                 createSupplyURL(id, idx));
                    temp.content.appendChild(li);
//                    console.log("id:", id, "name:", data[idx][id].name, "data:", data,"idx:", idx);
                }
            }
        }
    }
    tlist.appendChild(temp.content);
}

function updateSupply (data, list) {

}

function createSupplyURL (id, type) {
    return `http://game-a.granbluefantasy.jp/assets_en/img_low/sp/assets/item/${type}/s/${id}.jpg`;
/*    switch (type) {
        case "recovery": //AP/EP
            return `http://game-a.granbluefantasy.jp/assets_en/img_low/sp/assets/item/normal/s/${id}.jpg`;
        case "evolution": //Bars, etc
            return `http://game-a.granbluefantasy.jp/assets_en/img_low/sp/assets/item/evolution/s/${id}.jpg`;
        case "skillplus": //Atma keys
            return `http://game-a.granbluefantasy.jp/assets_en/img_low/sp/assets/item/skillplus/s/${id}.jpg`;
        case "augment": //Rings
            return `http://game-a.granbluefantasy.jp/assets_en/img_low/sp/assets/item/npcaugment/s/${id}.jpg`;
        case "treasure": //Loot drops
            return `http://game-a.granbluefantasy.jp/assets_en/img_low/sp/assets/item/article/s/${id}.jpg`;
    }*/
}
