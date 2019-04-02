var UNF_CHART;

window.UI = {
    setTheme: function (theme) {
        var sheet = document.getElementById("theme");
        if (!theme.fname) {console.log("No theme file given, using default."); theme.fname = "night";}
        sheet.href = `../stylesheets/${theme.fname}.css`;
    },

    //Input: {id, value} optionally in Array
    //Updates every id in upd with the given value.
    setValue: function (upd) {
        if (Array.isArray(upd)) {
            for (let entry of upd) {
                this.setValue(entry);
            }
        }
        else {
            var ele = document.getElementById(upd.id);
            if (ele) {
                ele.textContent = upd.value;
            }
        }
    },
    /**(re)Creates a DOM list, adding each entry in entryArray to list, optionally passed through the function f
    @arg {HTMLElement} list - A DOM element to serve as list root.
    @arg {Array} - Array of items to add to list.
    @arg {function} f - Defines transform of each entryArray item, given item.
    **/
    setList (list, entryArray, f) {
        list.innerHTML = "";
        let frag = document.createDocumentFragment();
        for (let entry of entryArray) {
            frag.appendChild(f ? f(entry) : entry);
        }
        list.appendChild(frag);
    },

    switchNav: function (ev) {
        if (!ev.target.dataset.navpage) {return;}
        var oldNav = this.getElementsByClassName("active")[0];
        oldNav.classList.remove("active");
        var oldTab = document.getElementById(oldNav.dataset.navpage);
        oldTab.classList.remove("active");

        ev.target.classList.add("active");
        document.getElementById(ev.target.dataset.navpage).classList.add("active");
    },
    initButtons: function () {
        var nl = document.getElementsByClassName("navlist");
        for (let nav of nl) {
            nav.addEventListener("click", this.switchNav);
        }
        //Global filters
        document.getElementById("tabs").addEventListener("click", evhGlobalClick);
        document.getElementById("supplies-search").addEventListener("change", evhSuppliesSearch);
        //Specific filters
        document.getElementById("supplies-panel").addEventListener("filter", evhSuppliesFilter);
        document.getElementById("raids-panel").addEventListener("filter", evhRaidsFilter);
    },

    time: {
        display: {},
        timers: {},
        jst: {}, //Current time
        int: {},

        keep: function() {
            function tick() {
                updateTimer(UI.time.jst, 1);
                updateTimerDisplay("jst", UI.time.jst);
            }

            this.display.jst = {
                h: document.getElementById("jst-h"),
                m: document.getElementById("jst-m"),
                s: document.getElementById("jst-s")
            };

            this.jst = new Date();
            translateDate(this.jst, "toJST");
            updateTimerDisplay("jst", this.jst);
            this.int.jst = setInterval(tick, 1000);
        },
        initTimers: function () {
            if (this.int.resets) { clearInterval(this.int.resets); }
            this.setTimers();
            for (let timer of Object.keys(this.timers)) {
                this.display[timer] = {d: document.getElementById(`${timer}-d`),
                                       h: document.getElementById(`${timer}-h`),
                                       m: document.getElementById(`${timer}-m`),
                                       s: document.getElementById(`${timer}-s`)};
                updateTimerDisplay(timer, UI.time.timers[timer]);
            }
            this.int.resets = setInterval(this.updateTimers, 1000);
        },
        setStrike: function() {

        },
        setTimers: function () {
            var current = this.jst;
//            translateDate(current, "toJST");

            var daily = new Date(current);
            daily.setUTCHours(5);
            daily.setUTCMinutes(0);
            daily.setUTCSeconds(0);
            var weekly = new Date(daily);
            var monthly = new Date(daily);

            //Daily
            if (current.getUTCHours() >= 5) {
                daily.setUTCDate(daily.getUTCDate() + 1);
            }
            //Weekly
            if (current.getUTCDay() === 0) {
                weekly.setUTCDate(current.getUTCDay() + 1);
            }
            else if (current.getUTCDay() != 1 || current.getUTCHours() >= 5) {
                weekly.setUTCDate(current.getUTCDate() + (8 - current.getUTCDay()));
            }
            //Monthly
            if (current.getUTCDate() > 1 || current.getUTCHours() >= 5) {
                monthly.setUTCDate(1);
                monthly.setUTCMonth(current.getUTCMonth() + 1);
            }

            this.timers.daily = new Date(daily - current);
            this.timers.weekly = new Date(weekly - current);
            this.timers.monthly = new Date(monthly - current);
//            this.timers.strike = new Date(daily - current);
        },
        updateTimers: function() {
            for (let timer of Object.keys(UI.time.timers)) {
                if (UI.time.timers[timer].getTime() <= 0) {
                    if (timer == "maint") {
                        endMaintTimer();
                        continue;
                    }
                    UI.time.setTimers();
                }

                updateTimer(UI.time.timers[timer], -1);
                updateTimerDisplay(timer, UI.time.timers[timer]);
            }
        }
    },
    planner: {
        dom: {
        },
        init: function(seriesList) {
            this.dom.series = document.getElementById("planner-craftSeries");
            this.dom.type = document.getElementById("planner-craftType");
            this.dom.element = document.getElementById("planner-craftElement");
            this.dom.start = document.getElementById("planner-craftStart");
            this.dom.end = document.getElementById("planner-craftEnd");
            this.dom.list = document.getElementById("planner-list");
            this.dom.plan = this.dom.list.getElementsByClassName("collection-item");

            UI.planner.populateSelection("series", seriesList);
            
            var dummy = document.createElement("option");
            dummy.value = "";//empty value !important
            dummy.textContent = "Select...";
            this.dom.series.options.add(dummy, 0);
            dummy.selected = true;

            this.dom.series.onchange = changeSeries;
            this.dom.type.onchange = updatePlan;
            this.dom.element.onchange = updatePlan;
            this.dom.start.onchange = updatePlan;
            this.dom.end.onchange = updatePlan;
        },
        //String, Array
        populateSelection: function(name, list) {
            if (!list) {return;}
            var display = this.dom[name];
            clearDropdown(display);
            for (let option of list) {
                var el = document.createElement("option");
                el.value = el.textContent = option;
//                console.log(option);
                display.options.add(el);
            }
        },
        displayPlan: function(plan) {
//            this.display.list.innerHTML = "";
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
        evhStartRaid (ev) {
            if (!ev.target.dataset.event && ev.currentTarget.entryObj) {
                let raidId = ev.currentTarget.entryObj.data.id,
                    matId = ev.target.dataset.matId; //undef is handled in the bg page function
                BackgroundPage.send("hostRaid", {raidId, matId});
            }
        },
        evhToggle (raid) {
//            raid.classList.toggle("hidden");
            BackgroundPage.send("updRaid", {action: "toggleActive",
                                            raidEntry: raid.entryObj});
        },
        update (raidEntry) {
            if (Array.isArray(raidEntry)) {
                for (let re of raidEntry) {
                    this.update(re);
                }
            }
            else {
                let el = document.getElementById(raidEntry.data.id);
                el.entryObj = raidEntry;
                updateRaidTrackingDisplay(el);
            }

            document.getElementById("raids-filter").click();
        }
    }
};

function clearDropdown(el) {
    for (let i = el.options.length -1; i >= 0; i--) {
        el.options.remove(i);
    }
}

//UI functionality
function evhGlobalClick (e) {
    if (e.target.dataset.event) { //dataset is always accesible
        switch (e.target.dataset.event) {
            case "collapse":
                //collapse all in <parent> for <id>
                if (e.target.dataset.in && e.path) { //chrome only but so is gbf (technically)
                    let cId = e.target.dataset.id;
                    for (let parent of e.path) {
                        if (parent.classList && parent.classList.contains(e.target.dataset.in)) {
                            let cList = parent.querySelectorAll(`[data-id='${cId}']`);
                            for (let node of cList) {
                                node.nextElementSibling.classList.toggle('hidden');
                            }
                        }
                    }
                }
                else {
                    e.target.nextElementSibling.classList.toggle('hidden');
                }
                break;
            case "filter":
                let activeFilters = [];
                if (e.target.dataset.value == "ALL") {
                    for (let filter of e.target.parentElement.children) {
                        filter.classList.remove("active");
                    }
                    e.target.classList.add("active");
                    activeFilters.push(e.target.dataset.value);
                }
                else {
                    let list,
                        defaultFilter;
                    //Special action on the list parent to trigger filter with same values.
                    if (e.target.dataset.value == "REFILTER") {
                        list = e.target;
                        defaultFilter = list.firstElementChild;
                    }
                    else {
                        //Special casing the "all" filter
                        list = e.target.parentElement;
                        e.target.classList.toggle("active");
                        defaultFilter = list.firstElementChild;
                        defaultFilter.classList.remove("active");
                    }

                    for (let entry of list.getElementsByClassName("active")) {
                        activeFilters.push(entry.dataset.value);
                    }
                    if (activeFilters.length === 0) {
                        defaultFilter.classList.add("active");
                        activeFilters.push(defaultFilter.dataset.value);
                    }
//                    else {
//                        defaultFilter.classList.remove("active");
//                    }
                }

                e.target.dispatchEvent( new CustomEvent("filter", {bubbles: true, detail: activeFilters}) );
                break;
            case "toggleRaid":
                UI.raids.evhToggle(e.target.parentElement);
                break;
        }
    }
}
function evhSuppliesSearch (e) { //just treasure for now
    var list = document.getElementById("supplies-list");

    var r = new RegExp(e.target.value, "i"); //Faster
    for (let item of list.children) {
        if (r.test(item.title)) {
            item.classList.remove("hidden");
        } else {
            item.classList.add("hidden");
        }
    }
}
function evhSuppliesFilter (e) {
    var list = document.getElementById("supplies-list");
//    var r = new RegExp(e.target.dataset.value, "i"); //Faster
    let filters = e.detail;
    function filter (item){
        return filters.some(f => {
            switch (f) {
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
function evhRaidsFilter (e) {
    let filters = e.detail;
    let filterables = ["elementName", "tierName"];

    let check = {hl: {do: false},
                 inactive: {do: false},
                 active: {do: true}};
    function filter (raid) {
        let specialCasesFound = 0; //Allow Special cases to AND each other when they are the only filters.
        check.active.val = raid.entryObj.active == true;

        let ret = filters.some(f => { //This requires special case filters to be before general ones. If unwanted then update to do a full loop.
            switch (f) {
                case "ALL": //Actually more like ACTIVE
                    return true;
                case "INACTIVE":
                    //Delay actual checking so we can AND with other filters if needed.
                    check.inactive.do = true;
                    check.active.do = false;
                    check.inactive.val = !check.active.val;
                    specialCasesFound++;
                    if (filters.length == specialCasesFound) {return true;} //Allow to check other filters if they exist, return if not.
                    break;
                case "HL":
                    check.hl.do = true;
                    check.hl.val = raid.entryObj.data.isHl;
                    specialCasesFound++;
                    if (filters.length == specialCasesFound) {return true;}
                    break;
                default:
                    return filterables.some(k => raid.entryObj.data[k] == f);
            }
        });
        if (ret) { //AND special cases
            for (let c in check) {
                if (check[c].do) {
                    ret = ret && check[c].val;
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

//Planner
function stylePlanItem(el, item) {
    if(el.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
        el = el.firstElementChild;
    }

    if (item.count >= el.plannerData.needed) {
        el.classList.add("done");
    }
    else if(item.count < Math.floor(el.plannerData.needed/10)) {
        el.classList.add("low");
        el.classList.remove("done");
    }
    else {
        el.classList.remove("done", "low");
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

//Timing functions
function updateTimer (timer, delta) {
    timer.setUTCSeconds(timer.getUTCSeconds() + delta);
}
function updateTimerDisplay (name, timer) {
    if (UI.time.display[name].d) {UI.time.display[name].d.textContent = timer.getUTCDate() - 1;}
    UI.time.display[name].h.textContent = ('0' + timer.getUTCHours()).slice(-2);
    UI.time.display[name].m.textContent = ('0' + timer.getUTCMinutes()).slice(-2);
    UI.time.display[name].s.textContent = ('0' + timer.getUTCSeconds()).slice(-2);
}
    //Maintenance
function startMaintTimer(html) {
    document.getElementById("timer-maint").classList.remove("hidden");
    UI.time.timers.maint = new Date(getMaintEnd(html) - UI.time.jst);
    UI.time.initTimers();
}

function getMaintEnd(html) {
    var doc = document.implementation.createHTMLDocument("");
    doc.documentElement.innerHTML = html;
    var info = doc.querySelector(".prt-maintenance-infomation");
    var dateMatch = info.firstElementChild.textContent.match(/(\d+)\/(\d+)\/(\d+) (\d+)(?::\d+)+$/m);
    var endDate = new Date(dateMatch[0]);
    endDate.setUTCFullYear(parseInt(dateMatch[1]));
    endDate.setUTCMonth(parseInt(dateMatch[2]));
    endDate.setUTCDate(parseInt(dateMatch[3]));
    endDate.setUTCHours(parseInt(dateMatch[4]));
    return endDate;
}
function endMaintTimer() {
    document.getElementById("timer-maint").classList.add("hidden");
    delete UI.time.timers.maint;
    UI.time.initTimers();
}

    //Helpers
function translateDate(date, tz) { //lucky JST doesn't observe DST
    switch (tz) {
        case "toJST":
            date.setUTCHours(date.getUTCHours() + 9);
            break;
        case "fromJST":
            date.setUTCHours(date.getUTCHours() - 9);
            break;
    }
    return date;
}


//Charts, Graphs
function clearGraph(graph) {
    graph.config.data.labels = [];
    for (let set of graph.config.data.datasets) {
        set.data = [];
    }
    graph.update();
}

