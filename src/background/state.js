/*globals State, Storage*/
window.State = {
    debug: true,
    devlog: function() {
        if (this.debug) { console.log(... arguments); }
    },
    deverror: function() {
        if (this.debug) { console.error(... arguments); }
    },
    
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
    }
};

function setVeeraDefaults() {
    State.settings.theme.current = 0;
}

function loadSettings() { //TODO: proper update handling, versions etc
    function load(loadedSettings) {
        if (loadedSettings.theme) {
            State.settings = loadedSettings;
        }
        else {
            setVeeraDefaults();
            saveSettings();
        }
        Stats.devlog("Settings loaded", loadedSettings);
    }
    
    Storage.get("settings", load);
}

function saveSettings() {
    Storage.set({settings: State.settings});
    Stats.devlog("Settings saved.");
}

function toggleDebug() {
    State.debug = !State.debug;
}