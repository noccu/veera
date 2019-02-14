window.State = {
    debug: true,
    unfEdition: "",
    
    settings: {
        theme: {
            list: [
                {name: "Tiamat Night", fname: "night"},
                {name: "Anichra Day", fname: "day"}
                ],
            get current() {
                return this.list[this._current];
            },
            set current(idx) {
                this._current = idx;
            }
            //set: function(n) {this.current = n};
        },
        raids: {
            sortByDiff: true
        }
    },
    
    save: function() {
        let o = {};
        for (let e of Object.keys(this)) {
            if (!["save", "load"].includes(e)) {
                o[e] = State[e];
            }
        }
        Storage.set({state: o});
        devlog("State saved.");
    },
    load: function() {
        function l(data) {
            if (!data.state) {
                devlog("No saved state, initializing from defaults.");
                setVeeraDefaults();
                State.save();
                return;
            }
            for (let e of Object.keys(data.state)) {
                State[e] = data.state[e];
                devlog("State loaded.");
            }
        }
        Storage.get("state", l);
    }
};

function setVeeraDefaults() {
    State.settings.theme.current = 0;
}

function toggleDebug() {
    State.debug = !State.debug;
}

function devlog() {
    if (State.debug) { console.debug(... arguments); }
}

function devwarn() {
    if (State.debug) { console.warn(... arguments); }
}

function deverror() {
    console.error(... arguments);
}