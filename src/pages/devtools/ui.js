/*globals BackgroundPage: true, UI*/
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
    },
    
    time: {
        display: {jst: {},
                  strike: {},
                  daily: {},
                  weekly: {},
                  monthly: {}},
        timers: {
            daily: {},
            weekly: {},
            monthly: {}
        },
        current: {},
        
        format: function(t) {
            var options = {hour: 'numeric', 
                          minute: 'numeric',
                          second: 'numeric', 
                          timeZone: 'Asia/Tokyo'};
            return Intl.DateTimeFormat('jp-JP', options).formatToParts(t);
            },
        initJST: function () {
            this.display.jst = {
                h: document.getElementById("jst-h"),
                m: document.getElementById("jst-m"),
                s: document.getElementById("jst-s")
            };
            this.updateJST();
            setInterval(this.updateJST, 1000);
        },
        updateJST: function() {
            var time = UI.time.format(Date.now());
            UI.time.display.jst.h.textContent = time[0].value;
            UI.time.display.jst.m.textContent = time[2].value;
            UI.time.display.jst.s.textContent = time[4].value;
        },
        setStrike: function() {
            
        },
        initResets: function() {
            for (let timer of Object.keys(this.timers)) {
                this.display[timer] = {d: document.getElementById(`${timer}-d`),
                                       h: document.getElementById(`${timer}-h`),
                                       m: document.getElementById(`${timer}-m`),
                                       s: document.getElementById(`${timer}-s`)};
            }
            this.setResets();
            this.updateResets();
            setInterval(this.updateResets, 1000);
        },
        setResets: function () {
            //TODO actuall just store them as diffs and decrement them, reset when one is 0. Much eaiser
            var current = new Date();
            current.setHours(current.getUTCHours() + 9);
            this.current = current;
            
            var daily = new Date(current);
            daily.setHours(5);
            daily.setMinutes(0);
            daily.setSeconds(0);
            var weekly = new Date(daily);
            var monthly = new Date(daily);
            var timers = {daily, weekly, monthly};
            
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
            
            for (let timer in timers) {
                if (timers.hasOwnProperty(timer)) {
                    this.timers[timer] = timers[timer];
                }
            }
        },
        updateResets: function() {
/*            var current = new Date();
            current.setHours(current.getUTCHours() + 9);
            UI.time.current = current;*/
            UI.time.current.setSeconds(UI.time.current.getSeconds() + 1);
            
            for (let timer of Object.keys(UI.time.timers)) {
                var diff = new Date(UI.time.timers[timer] - UI.time.current);

                if (UI.time.display[timer].d) {UI.time.display[timer].d.textContent = diff.getUTCDate() - 1;}
                UI.time.display[timer].h.textContent = diff.getUTCHours();
                UI.time.display[timer].m.textContent = ('0' + diff.getUTCMinutes()).slice(-2);
                UI.time.display[timer].s.textContent = ('0' + diff.getUTCSeconds()).slice(-2);
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
    }
};

function clearDropdown(el) {
    for (let i = el.options.length -1; i >= 0; i--) {
        el.options.remove(i);
    }
}

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
    var list = document.querySelectorAll("#planner-list li");
//    var isTreasure = type == "treasure";
    if (type != "treasure") { return; }
    var cur;
    for (let item of list) {
        if (item.dataset.type == "article") {
            cur = item.getElementsByClassName("planner-current")[0];
            cur.textContent = index[item.dataset.id].count;
    //        cur.textContent = isTreasure ? index[item.dataset.id].count : index[type][item.dataset.id].count;
            stylePlanItem(item, item.dataset.count, item.dataset.needed);
        }
    }
    
}