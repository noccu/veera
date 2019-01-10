/*globals BackgroundPage: true, UI, changeSeries, updatePlan, createPlannerItem, createSupplyURL*/
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
                this.setValue({id: entry.id, value: entry.value});
            }
        }
        else {
            var ele = document.getElementById(upd.id);
            ele.textContent = upd.value;
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
        document.getElementById("tabs").addEventListener("click", evhGlobalClick);
        document.getElementById("treasure-search").addEventListener("change", evhTreasureSearch);
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
            daily.setHours(5);
            daily.setMinutes(0);
            daily.setSeconds(0);
            var weekly = new Date(daily);
            var monthly = new Date(daily);
            
            //Daily
            if (current.getHours() >= 5) {
                daily.setDate(daily.getDate() + 1);
            }
            //Weekly
            if (current.getDay() === 0) {
                weekly.setDate(current.getDay() + 1);
            }
            else if (current.getDay() != 1 || current.getHours() >= 5) {
                weekly.setDate(current.getDate() + (8 - current.getDay()));
            }
            //Monthly
            if (current.getDate() > 1 || current.getHours() >= 5) {
                monthly.setDate(1);
                monthly.setMonth(current.getMonth() + 1);
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
                
                entry = createPlannerItem(item.name, item.current, item.needed, createSupplyURL(item.id, item.type));
                entry.firstElementChild.dataset.id = item.id;
                entry.firstElementChild.dataset.needed = item.needed;
                entry.firstElementChild.dataset.type = item.type;
                stylePlanItem(entry, item.current, item.needed);

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
                if (e.target.dataset.value == "all") {
                    for (let opt of e.target.parentElement.children) {
                        opt.classList.remove("active");
                    }
                    e.target.classList.add("active");
                }
                else {
                    e.target.classList.toggle("active");
                    //Special casing the "all" filter
                    if (e.target.parentElement.getElementsByClassName("active").length === 0) {
                        e.target.parentElement.firstElementChild.classList.add("active");
                    } 
                    else {
                        e.target.parentElement.firstElementChild.classList.remove("active");
                    }
                }
                break;
        }
    }
}

function evhTreasureSearch(e) { //just treasure for now
    var list = document.getElementById("treasure-list");

    var r = new RegExp(e.target.value, "i"); //Faster
    for (let item of list.children) {
        if (r.test(item.title)) {
            item.classList.remove("hidden");
        } else {
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
    timer.setSeconds(timer.getSeconds() + delta);
}
function updateTimerDisplay (name, timer) {
    if (UI.time.display[name].d) {UI.time.display[name].d.textContent = timer.getDate() - 1;}
    UI.time.display[name].h.textContent = ('0' + timer.getHours()).slice(-2);
    UI.time.display[name].m.textContent = ('0' + timer.getMinutes()).slice(-2);
    UI.time.display[name].s.textContent = ('0' + timer.getSeconds()).slice(-2);
}
    //Maintenance
function startMaintTimer(html) {
    document.getElementById("timer-maint").classList.toggle("hidden");
    UI.time.timers.maint = new Date(getMaintEnd(html) - UI.time.jst);
    UI.time.initTimers();
}

function getMaintEnd(html) {
    var doc = document.implementation.createHTMLDocument("");
    doc.documentElement.innerHTML = html;
    var info = doc.querySelector(".prt-maintenance-infomation");
    var date = info.firstElementChild.textContent.match(/(?:\d+\/?)+ (?:\d+:?)+$/m)[0];
    return new Date(date);
}
function endMaintTimer() {
    document.getElementById("timer-maint").classList.toggle("hidden");
    delete UI.time.timers.maint;
    UI.time.initTimers();
}

    //Helpers
function translateDate(date, tz) { //lucky JST doesn't observe DST
    switch (tz) {
        case "toJST":
            date.setHours(date.getUTCHours() + 9);
            break;
        case "fromJST":
            date.setUTCHours(date.getHours() - 9);
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

