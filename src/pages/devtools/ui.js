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
        display: {},
        init: function(seriesList) {
            this.display.series = document.getElementById("planner-craftSeries");
            this.display.type = document.getElementById("planner-craftType");
            this.display.element = document.getElementById("planner-craftElement");
            this.display.start = document.getElementById("planner-craftStart");
            this.display.end = document.getElementById("planner-craftEnd");
            
            this.populateSelection("series", seriesList);//Msg

            var dummy = document.createElement("option");
            dummy.value = "";//empty value !important
            dummy.textContent = "Select...";
            this.display.series.options.add(dummy, 0);
            dummy.selected = true;
            
            this.display.series.onchange = changeSeries;
            
            this.display.type.onchange = updatePlan;
            this.display.element.onchange = updatePlan;
            this.display.start.onchange = updatePlan;
            this.display.end.onchange = updatePlan;
        },
        //String, Array
        populateSelection: function(name, list) {
            var display = this.display[name];
            clearDropdown(display);
            if (!list) {return;}
            for (let option of list) {
                var el = document.createElement("option");
                el.value = el.textContent = option;
//                console.log(option);
                display.options.add(el);
            }
        },
        displayPlan: function(plan) {
            var list = document.getElementById("planner-list");
            list.innerHTML = "";
            
            var entry;
            for (let item of plan) {
//                console.log(item);
                
                entry = createPlannerItem(item);
                entry.firstElementChild.dataset.id = item.id;
                entry.firstElementChild.dataset.needed = item.needed;
//                entry.firstElementChild.dataset.type = item.type;
                stylePlanItem(entry, item.count, item.needed);

//                entry = createPlannerItem(item.name, item.current, item.needed, "../../assets/images/anchiraicon.png");
                list.appendChild(entry);
            }
        }
    },
    raids: {
        add: function() {
            var t = document.getElementById("template-raid-item");
        }
    }
};

function clearDropdown(el) {
    for (let i = el.options.length -1; i >= 0; i--) {
        el.options.remove(i);
    }
}

//UI funcitonality
function evhGlobalClick (e) {
    if (e.target.dataset) {
        switch (e.target.dataset.event) {
            case "collapse":
                e.target.nextElementSibling.classList.toggle('hidden');
                break;
            case "filter":
                let activeFilters = [];
                if (e.target.dataset.value == "All") {
                    for (let filter of e.target.parentElement.children) {
                        filter.classList.remove("active");
                    }
                    e.target.classList.add("active");
                    activeFilters.push(e.target.dataset.value);
                }
                else {
                    e.target.classList.toggle("active");
                    //Special casing the "all" filter
                    let list = e.target.parentElement,
                        defaultFilter = list.firstElementChild;
                    defaultFilter.classList.remove("active");
                    
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
    let filters = e.detail,
        showAll = filters[0] == "All";
    
    for (let item of list.children) {
        if (showAll || filters.includes(item.dataset.type) || (item.dataset.metaType && filters.includes(item.dataset.metaType)) ) {
            item.classList.remove("hidden");
        }
        else {
            item.classList.add("hidden");
        }
    }
}

//Planner
function stylePlanItem(el, current, needed) {
    if(el.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
        el = el.firstElementChild;
    }
    
    if (current >= needed) {
        el.dataset.done = "";
    }
    else if(current < Math.floor(needed/10)) {
        el.dataset.low = "";
    }
}

function syncPlanner(index, type) { //TODO: make it work with consumables
    if (type != "treasure") { return; }
    
    var list = document.getElementById("planner-list").getElementsByClassName("collection-item");
//    var isTreasure = type == "treasure";
    var curDisp;
    for (let item of list) {
        if (item.dataset.type == "article") {
            curDisp = item.getElementsByClassName("planner-current")[0];
            curDisp.textContent = index[item.dataset.id].count;
    //        cur.textContent = isTreasure ? index[item.dataset.id].count : index[type][item.dataset.id].count;
            stylePlanItem(item, index[item.dataset.id].count, item.dataset.needed);
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

