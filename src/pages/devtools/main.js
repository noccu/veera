window.DEBUG = true; //TODO: remove/replace with proper thing

//Adding a last item in array macro
Object.defineProperty(Array.prototype, "last", {get: function(){
    return this.length === 0 ? 0 : this[this.length - 1];
}});

if (chrome.runtime) {
    //Start logging network requests.
    BackgroundPage.connect();
    Network.listen();

    UI.initButtons();
    UI.time.keep();
    UI.time.initTimers();
    Unf.areaInfo.init();
    //UI.battle.init();
}

function devLog() {
    if (DEBUG) {
        console.log(...arguments);
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

function updateSupplies (idx) {
    if (idx) {
        var list = document.getElementById("supplies-list");
        var temp;

        for (let item of idx) {
            let entry = document.getElementById(`${item.type}_${item.id}`);
            if (entry) {
                entry.getElementsByClassName("collection-data")[0].textContent = item.count;
            }
            else {
                if (!temp) { temp = document.createElement("template"); }
                var li = createSupplyItem(item);
                temp.content.appendChild(li);
            }
        }
        if (temp) {
            list.appendChild(temp.content);
        }
    }
}

function createSupplyItem (data) {
    if (!data.id) {
        console.warn("No id for item: ", data);
        return;
    }
    var t = document.getElementById("template-supply-item");
/*    t.content.querySelector("li").title = name;
    t.content.querySelector("img").src = thumb;
    t.content.querySelector("div").textContent = num;*/
    let item = t.content.firstElementChild;
    item.id = `${data.type}_${data.id}`;
    let loc = data.location,
        name = data.name;
    item.title = loc ? `${name}\nGet from: ${loc}`: name;
    item.getElementsByClassName("collection-icon")[0].src = data.path;
    item.getElementsByClassName("collection-data")[0].textContent = data.count;
    item.dataset.type = data.typeName;
    if (data.metaType) {
        item.dataset.metaType = data.metaType;
    }
//    item.classList.add(data.typeName.replace(" ",""));

    return document.importNode(t.content, true);
}

//Planner functions
function createPlannerItem (item) {
        let li = createSupplyItem(item);//TODO: uguu
        li.querySelector(".collection-data").innerHTML = `<span class="planner-current">${item.count}</span> /<span class="planner-needed">${item.needed}</span>`;
        return li;
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
function updCurrentRaidInfo (data) {
    //Just drops for now.
    if (data.hasOwnProperty("loot")) {
        let list = document.getElementById("raid-current-drop-list"),
            temp = document.getElementById("t-raid-current-drop"),
            ssr_only = document.getElementById("raids-current-filter").children[1].classList.contains("active");

        list.innerHTML = "";
        for (let item of data.loot) {
            if (ssr_only && item.rarity < 4) { continue; }

            let disp = temp.content.firstElementChild,
                name = disp.getElementsByTagName("span")[0];
            disp.dataset.rarity = item.rarity;
            name.textContent = name.title = item.delta > 1 ? item.name+" x"+item.delta : item.name;
            disp.getElementsByTagName("img")[0].src = item.path;

            list.appendChild(document.importNode(temp.content, true));
        }
    }
    UI.setValue({id: "raid-next-quest", value: data.nextQuest || ""});
}

function createRaid(raidEntry) {
    var newRaid = document.getElementById("template-raid");
    var newRaidMat = document.getElementById("template-raid-material");

    newRaid.content.querySelector(".raid").id = raidEntry.data.id;
    newRaid.content.querySelector(".raid-name").textContent = raidEntry.data.name;
    newRaid.content.querySelector(".raid-icon").src = raidEntry.data.img;
//    newRaid.content.querySelector(".raid-icon").src = "../../assets/images/quests/"+raidEntry.data.img.split('/').pop();
//    devLog(raidEntry.data.img);
    newRaid.content.querySelector(".raid-cost").textContent = raidEntry.data.apCost;
    
//    newRaid.content.querySelector(".raid-hosts .current-value").textContent = raidEntry.data.dailyHosts - raidEntry.hosts.today;
    newRaid.content.querySelector(".raid-hosts .max-value").textContent = raidEntry.data.dailyHosts;

    newRaid = document.importNode(newRaid.content, true);
    newRaid.firstElementChild.entryObj = raidEntry;
    newRaid.firstElementChild.addEventListener("click", UI.raids.evhStartRaid);
    updateRaidTrackingDisplay(newRaid.firstElementChild);

    if (raidEntry.data.matCost) {
        let matCost = newRaid.querySelector(".raid-host-mats");
        for (let mat of raidEntry.data.matCost) {
            newRaidMat.content.querySelector(".current-value").textContent = mat.supplyData.count;
            newRaidMat.content.querySelector(".max-value").textContent = mat.num;
            newRaidMat.content.querySelector(".raid-mat-icon").src = mat.supplyData.path;
            newRaidMat.content.querySelector(".raid-mat").dataset.matId = mat.id;
//            newRaid.querySelector(".raid-name").dataset.url = raidEntry.data.urls[Object.keys(raidEntry.data.urls)[0]];
            matCost.appendChild(document.importNode(newRaidMat.content, true));
        }
    }

    return newRaid;
}

function updateRaidTrackingDisplay(raidEle) {
    let raidEntry = raidEle.entryObj;
    
    let hostsLeft = raidEntry.data.dailyHosts - raidEntry.hosts.today;
    raidEle.querySelector(".raid-hosts .current-value").textContent = hostsLeft;

    if (raidEntry.active) {
        raidEle.classList.remove("hidden");
    }
    else {
        raidEle.classList.add("hidden");
    }
    
    if (hostsLeft == 0) {
        raidEle.classList.add("host-limit");
    }
    else {
        raidEle.classList.remove("host-limit");
    }
}

function populateRaids (raids) { //called when bg page sends response to reqRaidList.
    let list = document.getElementById("raids-list");
    let frag = document.createDocumentFragment();
    for (let raid of raids) {
        frag.appendChild(createRaid(raid));
    }
    list.appendChild(frag);
    UI.raids.list = list.children;
}

function evhFilterRaids(e) { //called on changing filters
    let filterData = e.dothings(); //TODO
    BackgroundPage.send("reqRaidList", filterData);
}