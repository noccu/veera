/*globals DEBUG, chrome, UI, BackgroundPage, Network, Unf*/
window.DEBUG = true; //TODO: remove/replace with proper thing
const CONSTANTS = {
    url: {
        baseGame: "http://game.granbluefantasy.jp/",
        assets: "http://game.granbluefantasy.jp/assets_en/img/sp/assets/",
        size: {
            small: "s/",
            medium: "m/"
        }
    },
};
//Adding a last item in array macro
Object.defineProperty(Array.prototype, "last", {get: function(){ 
    return this.length === 0 ? 0 : this[this.length - 1]; 
}});

if (chrome.runtime) {
    //Start logging network requests.
    BackgroundPage.connect();
    Network.listen();
    //TODO: Query options and adjust UI.
    BackgroundPage.query("theme", resp => UI.setTheme(resp.value));
    BackgroundPage.query("plannerSeriesList", resp => UI.planner.init(resp.value));
    BackgroundPage.query("unfEdition", resp => Unf.edition = resp.value);
    
    UI.initButtons();
    UI.time.keep();
    UI.time.initTimers();
    Unf.areaInfo.init();
    //UI.battle.init();
}


function devLog() {
    if (DEBUG) {
        console.log(arguments);
    }
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
    d.classList.toggle("highlight", data.ap > data.apMax || data.bp > 10);
}

function updateTreasure (idx) {
    var list = document.getElementById("treasure-list");
//    list.innerHTML = "";
    var temp = document.createElement("template");
    for (let id of Object.keys(idx)) {
        let entry = document.getElementById("t-" + id);
        if (entry) {
            entry.getElementsByClassName("collection-data")[0].textContent = idx[id].count;
        }
        else {
            var li = createSupplyItem("t-" + id,
                                      idx[id].name, 
                                      idx[id].count, 
                                      createSupplyURL(id, "article"));
            temp.content.appendChild(li);
        }
    }
    list.appendChild(temp.content);
}

//TODO: Can probably merge with above? And clean it up, Just lazy rn
function updateConsumables (data) {
    var list = document.getElementById("consumable-list");
    list.innerHTML = "";
    var temp = document.createElement("template");
    for (let idx of Object.keys(data)) {
        for (let id of Object.keys(data[idx])) {
            var li = createSupplyItem(idx+"-"+id,
                                      data[idx][id].name, 
                                      data[idx][id].count, 
                                      createSupplyURL(id, idx));
            temp.content.appendChild(li);
//                    console.log("id:", id, "name:", data[idx][id].name, "data:", data,"idx:", idx);
        }
    }
    list.appendChild(temp.content);
}

function createSupplyItem (id, name, num, thumb) {
    var t = document.getElementById("template-supply-item");
/*    t.content.querySelector("li").title = name;
    t.content.querySelector("img").src = thumb;
    t.content.querySelector("div").textContent = num;*/
    let item = t.content.firstElementChild;
    item.id = id;
    item.title = name;
    item.getElementsByClassName("collection-icon")[0].src = thumb;
    item.getElementsByClassName("collection-data")[0].textContent = num;
    
    return document.importNode(t.content, true);
}
function createSupplyURL (id, type) {
    return `http://game-a.granbluefantasy.jp/assets_en/img_low/sp/assets/item/${type}/s/${id}.jpg`;
}

//TODO: merge with above, see Supply refactor. Path is set in Supplies based on constant.
function createSupplyURLkind (id, path) {
    return `${CONSTANTS.url.assets}${path}/${CONSTANTS.url.size.medium}${id}.jpg`;
}

//Planner functions
function createPlannerItem (name, current, needed, thumb) {
        var t = document.getElementById("template-supply-item");
        t.content.querySelector("li").title = name;
        t.content.querySelector("img").src = thumb;
        t.content.querySelector("div").innerHTML = `<span class="planner-current">${current}</span> /<span class="planner-needed">${needed}</span>`;
        return document.importNode(t.content, true);
}

function changeSeries(ev) { //Event handler, updates type and element list when series changes
    BackgroundPage.send("plannerSeriesChange", {newValue: ev.target.value});
}

function updateSeriesOptions (data) { //receives list of each option type.
    UI.planner.populateSelection("type", data.types);
    UI.planner.populateSelection("element", data.elements);
    UI.planner.populateSelection("start", data.steps);
    UI.planner.populateSelection("end", data.steps);
}

function updatePlan () {  //Event handler       
    var plan = {series: UI.planner.display.series.value, 
                type: UI.planner.display.type.value, 
                element: UI.planner.display.element.value, 
                start: UI.planner.display.start.selectedIndex, 
                end: UI.planner.display.end.selectedIndex};
    BackgroundPage.send("newPlanRequest", plan);
}

//Raids
function updRaidInfo (data) {
    //Just drops for now.
    let list = document.getElementById("raid-current-drop-list"),
        temp = document.getElementById("t-raid-current-drop"),
        ssr_only = document.getElementById("raids-current-filter").children[1].classList.contains("active");
    
    list.innerHTML = "";
    for (let item of data) {
        if (ssr_only && item.rarity < 4) { continue; }
        
        let disp = temp.content.firstElementChild;
        disp.dataset.rarity = item.rarity;
        disp.getElementsByTagName("span")[0].textContent = item.delta > 1 ? item.name+" x"+item.delta : item.name;
        disp.getElementsByTagName("img")[0].src = createSupplyURLkind(item.id, item.path);
        
        list.appendChild(document.importNode(temp.content, true));
    }
}

function createRaid(name, mat, url, thumb) {
    var newRaid = document.getElementById("template-raid-item");
    var newRaidMat = document.getElementById("template-raid-material");
    newRaid.content.querySelector(".raid-name").title = name;
    newRaid.content.querySelector(".raid-icon").src = thumb;
    t.content.querySelector("div").textContent = num;
    return document.importNode(t.content, true);
}