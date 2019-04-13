window.DEBUG = true; //TODO: remove/replace with proper thing

//Adding a last item in array macro
Object.defineProperty(Array.prototype, "last", {get: function(){
    return this.length === 0 ? 0 : this[this.length - 1];
}});

if (chrome.runtime) {
    BackgroundPage.connect();
}

function initialize(data) {
    document.getElementById("inactive").style.display = "none";
    UI.setTheme(data.theme);
    Unf.edition = data.unfEdition;
    populateRaids(data.raids);
    UI.planner.init(data.planner);

    UI.initButtons();
    UI.time.keep();
    UI.time.initTimers();
    Unf.areaInfo.init();

    Network.listen();
}

function devLog() {
    if (DEBUG) {
        console.log(...arguments);
    }
}

function updatePendants (data) {
    UI.setValue([
        {id: "display-renown-total", value: data.renown.total.current},
        {id: "panel-renown-weekly", value: data.renown.weekly.current},
        {id: "panel-renown-daily", value: data.renown.daily.current},
        {id: "panel-renown-sr", value: data.renown.sr.current},
        {id: "panel-renown-r", value: data.renown.r.current},
        {id: "display-prestige-total", value: data.prestige.total.current},
        {id: "panel-prestige-weekly", value: data.prestige.weekly.current},
        {id: "panel-prestige-crew", value: data.prestige.crew.current}
    ]);
    UI.setValue([
        {id: "display-renown-max", value: data.renown.total.max},
        {id: "panel-renown-weekly-max", value: data.renown.weekly.max},
        {id: "panel-renown-daily-max", value: data.renown.daily.max},
        {id: "panel-renown-sr-max", value: data.renown.sr.max},
        {id: "panel-renown-r-max", value: data.renown.r.max},
        {id: "display-prestige-max", value: data.prestige.total.max},
        {id: "panel-prestige-weekly-max", value: data.prestige.weekly.max},
        {id: "panel-prestige-crew-max", value: data.prestige.crew.max}
    ]);
}
function updateStatus (data) {
    UI.setValue([
        {id: "ap-current", value: data.ap.current},
        {id: "bp-current", value: data.bp.current},
        {id: "ap-max", value: data.ap.max},
        {id: "rank", value: data.level}
        /*,{
            id: "",
            value: data.lvlP
            }*/
        //TODO: level bar
    ], true);

    var d = document.getElementById("ap-bp-display");
    d.classList.toggle("highlight", data.ap > data.apMax || data.bp > 10);
}
function updateArca(data) {
    UI.setValue([
        {id: "num-arc-tck", value: data.tickets.current},
        {id: "max-arc-tck", value: data.tickets.max},
        {id: "num-arc-pts", value: data.points.current},
        {id: "max-arc-pts", value: data.points.max}
    ], true);
}
function updateCurrencies(data) {
    UI.setValue([
        {id: "num-rupies", value: data.rupie.count},
        {id: "num-cp", value: data.cp.count},
        {id: "num-crystal", value: data.crystals.count},
        {id: "num-chips", value: data.casinoChips.count}
    ], true);

    updateSupplies([
        data.rupie,
        data.cp,
        data.crystals,
        data.casinoChips
    ]);
}

function updateSupplies (idx) {
    if (idx) {
        var list = document.getElementById("supplies-list");
        var newItems;

        for (let item of idx) {
            let entry = document.getElementById(`${item.type}_${item.id}`);
            if (entry) { //update
                entry.title = item.name;
                entry.getElementsByClassName("collection-data")[0].textContent = item.count;
            }
            else { //add new
                if (!newItems) { newItems = document.createElement("template"); }
                newItems.content.appendChild(createSupplyItem(item));
            }
        }
        if (newItems) {
            list.appendChild(newItems.content);
        }
    }
}

function createSupplyItem (data, idPrefix) {
    if (data.id === undefined) { //id = 0 is a thing
        console.warn("No id for item: ", data);
        return;
    }
    var t = document.getElementById("template-supply-item");
    let item = t.content.firstElementChild;
    item.id = `${idPrefix || ""}${data.type}_${data.id}`;
    item.title = data.location ? `${data.name}\nGet from: ${data.location}`: data.name;
    item.getElementsByClassName("collection-icon")[0].src = data.path;
    item.getElementsByClassName("collection-data")[0].textContent = data.count;

    let newEle = document.importNode(t.content, true);
    newEle.firstElementChild.dataset.type = data.type;
    if (data.metaType) {
        newEle.firstElementChild.dataset.metaType = data.metaType;
    }

    return newEle;
}

//Planner functions
function createPlannerItem (item) {
        let li = createSupplyItem(item, "p");
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
    var plan = {series: UI.planner.dom.series.value,
                type: UI.planner.dom.type.value,
                element: UI.planner.dom.element.value,
                start: UI.planner.dom.start.selectedIndex,
                end: UI.planner.dom.end.selectedIndex};
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

    function addMaterial(mat, container) {
        if (Array.isArray(mat)) {
            let subCont = document.createElement("div");
            subCont.className = "raid-mat mat-group";
            for (let item of mat) {
                addMaterial(item, subCont);
            }
            container.appendChild(subCont);
        }
        else {
            let matEle = newRaidMat.content.querySelector(".raid-mat");
            matEle.dataset.matId = mat.id;
            matEle.title = mat.supplyData.name;
            newRaidMat.content.querySelector(".max-value").textContent = mat.num;
            newRaidMat.content.querySelector(".raid-mat-icon").src = mat.supplyData.path;
            container.appendChild(document.importNode(newRaidMat.content, true));
        }
    }

    if (raidEntry.data.matCost) {
        let matContainer = newRaid.querySelector(".raid-host-mats");
        for (let mat of raidEntry.data.matCost) {
            addMaterial(mat, matContainer);
        }
    }
    updateRaidTrackingDisplay(newRaid.firstElementChild);

    return newRaid;
}

function updateRaidTrackingDisplay(raidEle) {
    let raidEntry = raidEle.entryObj;

    let hostsLeft = raidEntry.data.dailyHosts - raidEntry.hosts.today;
    raidEle.querySelector(".raid-hosts .current-value").textContent = hostsLeft;
    let outOfMats = false;

    function updMats (list) {
        for (let mat of list) {
            if (Array.isArray(mat)) {
                updMats(mat);
            }
            else {
                raidEle.querySelector(`[data-mat-id='${mat.id}'] .current-value`).textContent = mat.supplyData.count;
                outOfMats = outOfMats || mat.supplyData.count < mat.num;
            }
        }
    }
    if (raidEntry.data.matCost) {
        updMats(raidEntry.data.matCost);
    }

    //CSS
    if (raidEntry.active) {
        raidEle.classList.remove("hidden");
    }
    else {
        raidEle.classList.add("hidden");
    }

    if (hostsLeft == 0 || outOfMats) {
        raidEle.classList.add("host-limit");
    }
    else {
        raidEle.classList.remove("host-limit");
    }
}

function populateRaids (raids) {
    let list = document.getElementById("raids-list");
    UI.setList(list, raids, createRaid);
    UI.raids.list = list.children;
}
