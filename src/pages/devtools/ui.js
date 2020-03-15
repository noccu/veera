const NUMBER_FORMAT = new Intl.NumberFormat(navigator.language, {maximumFractionDigits: 3});

window.UI = {
    setTheme: function(theme) {
        var sheet = document.getElementById("theme");
        if (!theme.fname) { console.log("No theme file given, using default."); theme.fname = "night" }
        sheet.href = `../stylesheets/${theme.fname}.css`;
    },

    // Input: {id, value} optionally in Array
    // Updates every id in upd with the given value.
    setValue: function(upd, format) {
        if (Array.isArray(upd)) {
            for (let entry of upd) {
                this.setValue(entry, format);
            }
        }
        else {
            var ele = document.getElementById(upd.id);
            if (ele) {
                ele.textContent = format ? NUMBER_FORMAT.format(upd.value) : upd.value;
            }
        }
    },
    /** (re)Creates a DOM list, adding each entry in entryArray to list, optionally passed through the function f
    @arg {HTMLElement} list - A DOM element to serve as list root.
    @arg {Array} - Array of items to add to list.
    @arg {function} f - Defines transform of each entryArray item, given item.
    **/
    setList(list, entryArray, f) {
        list.innerHTML = "";
        let frag = document.createDocumentFragment();
        for (let entry of entryArray) {
            frag.appendChild(f ? f(entry) : entry);
        }
        list.appendChild(frag);
    },

    switchNav: function(ev) {
        if (!ev.target.dataset.navpage) { return }
        var oldNav = this.getElementsByClassName("active")[0];
        oldNav.classList.remove("active");
        var oldTab = document.getElementById(oldNav.dataset.navpage);
        oldTab.classList.remove("active");

        ev.target.classList.add("active");
        document.getElementById(ev.target.dataset.navpage).classList.add("active");
    },
    initButtons: function() {
        var nl = document.getElementsByClassName("navlist");
        for (let nav of nl) {
            nav.addEventListener("click", this.switchNav);
        }
        // Global filters
        document.addEventListener("click", evhGlobalClick);
        document.getElementById("supplies-search").addEventListener("change", evhSuppliesSearch);
        // Specific filters
        document.getElementById("supplies-panel").addEventListener("filter", evhSuppliesFilter);
        document.getElementById("raids-panel").addEventListener("filter", evhRaidsFilter);

        document.addEventListener("change", evhGlobalSettingChange);
    },

    time: {
        display: undefined,
        times: [],
        activeSt: 0,
        init: function() {
            let buffList = document.getElementById("buffTimers"),
                buffTemplate = document.getElementById("t-buffTimers");
            buffList.innerHTML = "";
            this.display = {};
            for (let timer of this.times) {
                timer.time = new Date(timer.time); // Convert timestamp back to date obj.
                if (timer.type == "buff") {
                    buffTemplate.content.firstElementChild.title = timer.name;
                    buffTemplate.content.firstElementChild.id = `timer-${timer.name}`;
                    buffTemplate.content.querySelector("img").src = timer.img;
                    buffTemplate.content.querySelector(".buff-d").id = `${timer.name}-d`;
                    buffTemplate.content.querySelector(".buff-h").id = `${timer.name}-h`;
                    buffTemplate.content.querySelector(".buff-m").id = `${timer.name}-m`;
                    buffList.appendChild(document.importNode(buffTemplate.content, true));
                }
                this.display[timer.name] = {
                    element: document.getElementById(`timer-${timer.name}`),
                    d: document.getElementById(`${timer.name}-d`),
                    h: document.getElementById(`${timer.name}-h`),
                    m: document.getElementById(`${timer.name}-m`),
                    s: document.getElementById(`${timer.name}-s`)
                };
            }
            this.display.st = document.getElementById("timer-st-time");
            if (this.display.maint) {
                this.display.maint.element.classList.remove("hidden");
            }
            else {
                document.getElementById("timer-maint").classList.add("hidden");
            }
        },
        tick() {
            for (let time of UI.time.times) {
                UI.time.update(time, time.delta);
                UI.time.updateDisplay(time);
            }
        },
        update(timer, delta) {
            if (timer.time.getTime() > 0) {
                timer.time.setUTCSeconds(timer.time.getUTCSeconds() + delta);
            }
        },
        updateDisplay(timer) {
            if (this.display[timer.name].d) {
                let d = timer.time.getUTCDate() - 1;
                if (d > 0) {
                    this.display[timer.name].d.textContent = d;
                    this.display[timer.name].d.nextSibling.textContent = "d ";
                    this.display[timer.name].d.classList.remove("hidden");
                }
                else {
                    this.display[timer.name].d.nextSibling.textContent = ""; // Text part
                    this.display[timer.name].d.classList.add("hidden");
                    this.display[timer.name].d = undefined; // Don't re-check until re-exposed during sync.
                }
            }
            this.display[timer.name].h.textContent = ("0" + timer.time.getUTCHours()).slice(-2);
            this.display[timer.name].m.textContent = ("0" + timer.time.getUTCMinutes()).slice(-2);
            if (this.display[timer.name].s) {
                this.display[timer.name].s.textContent = ("0" + timer.time.getUTCSeconds()).slice(-2);
            }

            // Could use an object for clarity but since this fires every second, this is prob much faster.
            if (timer.name == "st1") {
                if (timer.time.getUTCHours() == 23) {
                    this.activeSt |= 1;
                }
                else {
                    this.activeSt &= 2;
                }
            }
            else if (timer.name == "st2") {
                if (timer.time.getUTCHours() == 23) {
                    this.activeSt |= 2;
                }
                else {
                    this.activeSt &= 1;
                }
            }
            if (this.activeSt) {
                this.display.st.classList.add("highlight");
            }
            else {
                this.display.st.classList.remove("highlight");
            }

            if (timer.type == "buff" && timer.time.getTime() < 600000) { // 10m
                this.display[timer.name].element.classList.add("warn");
            }
            else if (timer.type == "buff") {
                this.display[timer.name].element.classList.remove("warn");
            }
        },
        sync(times) {
            if (this.int) { clearInterval(this.int) }
            this.times = times;
            this.init();
            this.int = setInterval(this.tick, 1000);
        }
    },
    planner: {
        dom: {},
        init: function(seriesList) {
            this.dom.series = document.getElementById("planner-craftSeries");
            this.dom.type = document.getElementById("planner-craftType");
            this.dom.element = document.getElementById("planner-craftElement");
            this.dom.start = document.getElementById("planner-craftStart");
            this.dom.end = document.getElementById("planner-craftEnd");
            this.dom.options = document.getElementById("planner-craftOptions");
            this.dom.list = document.getElementById("planner-list");
            this.dom.plan = this.dom.list.getElementsByClassName("collection-item");

            UI.planner.populateSelection("series", seriesList);

            var dummy = document.createElement("option");
            dummy.value = "";// empty value !important
            dummy.textContent = "Select...";
            this.dom.series.options.add(dummy, 0);
            dummy.selected = true;

            this.dom.series.onchange = changeSeries;
            this.dom.type.onchange = updatePlan;
            this.dom.element.onchange = updatePlan;
            this.dom.start.onchange = updatePlan;
            this.dom.end.onchange = updatePlan;
            this.dom.options.addEventListener("change", updatePlan);
        },
        // String, Array
        populateSelection: function(name, list) {
            var display = this.dom[name];
            if (list && list.length > 1) {
                display.classList.remove("hidden");
                clearDropdown(display);
                populateDropdown(display, list);
            }
            else {
                display.classList.add("hidden");
            }
        },
        displayPlan: function(plan) {
            // this.display.list.innerHTML = "";
            this.dom.list.createdPlan = plan;

            UI.setList(this.dom.list, plan, item => {
                let ele = createPlannerItem(item);
                ele.firstElementChild.plannerData = item;
                stylePlanItem(ele, item);
                return ele;
            });
        }
    },
    raids: {
        list: null,
        evhStartRaid(ev) {
            if (!ev.target.dataset.event && ev.currentTarget.entryObj) {
                let raidId = ev.currentTarget.entryObj.data.id,
                    matId = ev.target.dataset.matId; // undef is handled in the bg page function
                BackgroundPage.send("hostRaid", {raidId, matId});
            }
        },
        evhToggle(raid) {
            // raid.classList.toggle("hidden");
            BackgroundPage.send("updRaid", {
                action: "toggleActive",
                raidEntry: raid.entryObj
            });
        },
        update(raidEntry, loop) {
            if (raidEntry) {
                if (!loop && Array.isArray(raidEntry)) {
                    for (let re of raidEntry) {
                        this.update(re, true);
                    }
                }
                else {
                    let el = document.getElementById(raidEntry.data.id);
                    el.entryObj = raidEntry;
                    this.updDisplay(el);
                    if (loop) { return }
                }
            }
            else {
                this.list.forEach(raid => this.updDisplay(raid));
            }

            document.getElementById("raids-filter").click();
        },
        updDisplay(raidEle) {
            let raidEntry = raidEle.entryObj;

            let hostsLeft = raidEntry.data.dailyHosts - raidEntry.hosts.today;
            raidEle.querySelector(".raid-hosts .current-value").textContent = hostsLeft;
            let outOfMats = false;

            function updMats(list) {
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

            // CSS
            if (raidEntry.active && (raidEntry.haveRank || !SETTINGS.hideRaidsByRank) ) {
                raidEle.classList.remove("hidden");
            }
            else {
                raidEle.classList.add("hidden");
            }

            if (!raidEntry.haveHosts || outOfMats) {
                raidEle.classList.add("fade");
            }
            else {
                raidEle.classList.remove("fade");
                if (raidEntry.haveAp) {
                    raidEle.getElementsByClassName("raid-cost")[0].classList.remove("warn");
                }
                else {
                    raidEle.getElementsByClassName("raid-cost")[0].classList.add("warn");
                }
            }
        },
        updCode(code) {
            UI.setValue({id: "raid-code", value: code});
        },
        copyCode() {
            let code = document.getElementById("raid-code").textContent;
            if (code) {
                navigator.clipboard.writeText(code);
            }
        }
    }
};

// UI functionality
function evhGlobalClick(e) {
    if (e.target.dataset.event) { // dataset is always accesible
        switch (e.target.dataset.event) {
            case "collapse":
                // collapse all in <parent> for <id>
                if (e.target.dataset.in && e.path) { // chrome only but so is gbf (technically)
                    let cId = e.target.dataset.id;
                    for (let parent of e.path) { // Go up hierarchy
                        if (parent.classList && parent.classList.contains(e.target.dataset.in)) { // Find <parent>/root in which all occurences are affected
                            let cList = parent.querySelectorAll(`[data-id='${cId}']`); // Get all instances of specific collapse control (<id>) in root (<parent>)
                            for (let node of cList) { // Affect them all
                                collapseElement(node);
                            }
                        }
                    }
                }
                else {
                    collapseElement(e.target);
                }
                break;
            case "filter":
                var activeFilters = [];
                if (e.target.dataset.value == "ALL") {
                    for (let filter of e.target.parentElement.children) {
                        filter.classList.remove("active");
                    }
                    e.target.classList.add("active");
                    activeFilters.push(e.target.dataset);
                }
                else {
                    let list,
                        defaultFilter;
                    // Special action on the list parent to trigger filter with same values.
                    if (e.target.dataset.value == "REFILTER") {
                        list = e.target;
                        defaultFilter = list.firstElementChild;
                    }
                    else {
                        // Special casing the "all" filter
                        list = e.target.parentElement;
                        e.target.classList.toggle("active");
                        defaultFilter = list.firstElementChild;
                        defaultFilter.classList.remove("active");
                    }

                    for (let entry of list.getElementsByClassName("active")) {
                        activeFilters.push(entry.dataset);
                    }
                    if (activeFilters.length === 0) {
                        defaultFilter.classList.add("active");
                        activeFilters.push(defaultFilter.dataset);
                    }
                    // else {
                    // defaultFilter.classList.remove("active");
                    // }
                }

                e.target.dispatchEvent( new CustomEvent("filter", {bubbles: true, detail: activeFilters}) );
                break;
            case "toggleRaid":
                UI.raids.evhToggle(e.target.parentElement);
                break;
            case "navigate":
                BackgroundPage.send("navigateTo", e.target.dataset.value);
                break;
            case "repeatQuest":
                BackgroundPage.send("repeatQuest");
                break;
            case "playTriggeredQuest":
                BackgroundPage.send("playTriggeredQuest");
                break;
            case "copyRaidCode":
                // We do this here because the document needs focus. Implementing clipboard actions in bg page does not work. At least not in a straightforward manner because lolwebextensions.
                UI.raids.copyCode();
        }
    }
}
function collapseElement(target) {
    if (target.dataset.dir == "up") {
        target.previousElementSibling.classList.toggle("hidden");
    }
    else {
        target.nextElementSibling.classList.toggle("hidden");
    }
}
function evhSuppliesSearch(e) { // just treasure for now
    var list = document.getElementById("supplies-list");

    var r = new RegExp(e.target.value, "i"); // Faster
    for (let item of list.children) {
        if (r.test(item.title)) {
            item.classList.remove("hidden");
        }
        else {
            item.classList.add("hidden");
        }
    }
}
function evhSuppliesFilter(e) {
    var list = document.getElementById("supplies-list");
    // var r = new RegExp(e.target.dataset.value, "i"); //Faster
    let filters = e.detail;
    function filter(item) {
        return filters.some(f => {
            switch (f.value) {
                case "ALL":
                case item.dataset.type:
                case item.dataset.metaType:
                    return true;
            }
        });
    }
    for (let item of list.children) {
        if (filter(item)) {
            item.classList.remove("hidden");
        }
        else {
            item.classList.add("hidden");
        }
    }
}
function evhRaidsFilter(e) {
    let filters = e.detail;
    function filter(raid) {
        // [do check, value of check]
        let check = {
            elementName: [false, false],
            tierName: [false, false]
        };
        let ret = raid.entryObj.active == true;
        filters.forEach(f => {
            if (f.group == "special") { // Always checked first
                switch (f.value) {
                    case "ALL": // Actually more like ACTIVE
                        ret = raid.entryObj.active == true;
                        break;
                    case "INACTIVE":
                        ret = raid.entryObj.active == false;
                        break;
                    case "HL":
                        ret &= raid.entryObj.data.isHl;
                        break;
                }
            }
            else {
                check[f.group][0] = true;
                check[f.group][1] |= raid.entryObj.data[f.group] == f.value;
            }
        });
        if (SETTINGS.hideRaidsByRank) { ret = ret && raid.entryObj.haveRank }
        if (ret) {
            for (let c in check) {
                if (check[c][0]) {
                    ret &= check[c][1];
                }
            }
        }

        return ret;
    }

    for (let raid of UI.raids.list) {
        if (filter(raid)) {
            raid.classList.remove("hidden");
        }
        else {
            raid.classList.add("hidden");
        }
    }
}

// Planner
function stylePlanItem(el, item) {
    if(el.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
        el = el.firstElementChild;
    }

    if (item.count >= el.plannerData.needed) {
        el.classList.add("fade");
    }
    else if(item.count < Math.ceil(el.plannerData.needed / 10)) {
        el.classList.add("warn");
        el.classList.remove("warn");
    }
    else {
        el.classList.remove("fade", "low");
    }
}
function syncPlanner(index) {
    if (UI.planner.dom.list.createdPlan) {
        let ele;
        for (let item of index) {
            ele = UI.planner.dom.plan.namedItem(`p${item.type}_${item.id}`);
            if (ele) {
                ele.getElementsByClassName("planner-current")[0].textContent = item.count;
                stylePlanItem(ele, item);
            }
        }
    }
}

// Charts, Graphs
function clearGraph(graph) {
    graph.config.data.labels = [];
    for (let set of graph.config.data.datasets) {
        set.data = [];
    }
    graph.update();
}

// Helpers
function clearDropdown(el) {
    for (let i = el.options.length - 1; i >= 0; i--) {
        el.options.remove(i);
    }
}
function populateDropdown(list, data, f) {
    for (let option of data) {
        let el = document.createElement("option");
        if (option.val) {
            el.value = option.val;
            el.textContent = option.name;
        }
        else {
            el.value = el.textContent = option;
        }

        if (f) { // post-process
            f(el, option);
        }
        list.options.add(el);
    }
}

function evhGlobalSettingChange(ev) {
    if (ev.target.dataset.globalSetting) {
        let setting = ev.target;
        let name = setting.name,
            val;
        switch (setting.type) {
            case "radio":
            case "checkbox":
                val = setting.checked;
                break;
            default:
                val = setting.value;
        }
        BackgroundPage.send("updGlobalSetting", {name, val});
    }
}

// Misc
function setGuildLink(path) {
    document.getElementById("guild-link").dataset.value = path;
}
