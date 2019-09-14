window.State = {
    store: {
        config: {version: 5, updDelta: 4},
        strikeTime: {},
        lastReset: 0,
        lastUpdate: 0,
        lastCommit: "17b3c6dd879848aac3ccc5964c84b98333ffecef", // Initial commit
        unfEdition: "",
        isInit: {
            treasure: false,
            tickets: false,
            consumables: false,
            home: false,
            crew: false
        }
    },
    URL_HOMEPAGE: "https://github.com/noccu/veera",
    URL_MANIFEST: "https://raw.githubusercontent.com/noccu/veera/master/manifest.json",
    URL_COMMITS: "https://api.github.com/repos/noccu/veera/commits?sha=master&per_page=3",
    DEV_URL_COMMITS: "https://api.github.com/repos/noccu/veera/commits?sha=develop&per_page=3",
    UPDATE_INTERVAL: 86400000, // ms - 1 day
    settings: {
        debug: false,
        dbgNotifyErrors: false,
        dbgNotifyWarnings: false,
        checkUpdates: true,
        useDevBranch: false,

        theme: 0,
        raids: {sortByDiff: true},

        colorCodeDrops: true,

        notifyWeaponDrop: true,
        notifyPlannerItem: true,
        notifyNmTrigger: true,

        focusGameOnAction: true,
        focusOnlyMinimized: false,

        hideRaidsByRank: true,
        blockHostByAP: true
    },

    theme: {
        list: [
            {name: "Tiamat Night", fname: "night"},
            {name: "Anichra Day", fname: "day"}
        ],
        get current() {
            return this.list[State.settings.theme];
        },
        set current(idx) {
            State.settings.theme = idx;
        }
    },
    game: {
        tabId: undefined,
        windowId: undefined,
        linkToTab(id) {
            return new Promise ((r, x) => {
                chrome.tabs.get(id, t => {
                    if (/game\.granbluefantasy\.jp|gbf\.game\.mbga\.jp/.test(t.url)) {
                        devlog(`Ufufu... onee-sama ha tab ${id} wo mite imasu ne.`);
                        this.tabId = id;
                        this.windowId = t.windowId;
                        r();
                    }
                    else {
                        x("Onee-sama wo damasu to ha ii dokyou desu wa!");
                    }
                });
            });
        },
        navigateTo(url) {
            if (this.tabId && url) {
                chrome.tabs.update(this.tabId, {url: url}, () => console.log("Navigated to " + url));
                this.focus();
            }
        },
        // Bring to front
        focus() {
            if (State.settings.focusGameOnAction && this.windowId) {
                chrome.windows.get(this.windowId, w => {
                    if (State.settings.focusOnlyMinimized && w.state != "minimized") {
                        return;
                    }
                    chrome.windows.update(this.windowId, {focused: true});
                });
            }
        },
        evhTabUpdated(id, changes) {
            if (id == State.game.tabId) {
                if (changes.hasOwnProperty("url")) {
                    fireEvent(EVENTS.pageChanged, changes.url);
                }
            }
        }
    },

    updSetting({name, val}) {
        this.settings[name] = val;
        this.save();
    },
    save: function() {
        let o = {store: this.store, settings: this.settings};
        Storage.set({state: o});
        devlog("State saved.");
    },
    load: function() { // Called out of context
        return new Promise((r, x) => {
            function _load(data) {
                if (!data.state) {
                    printWarn("No saved state, initializing from defaults.");
                    State.save();
                }
                else if (data.state.store && data.state.store.config) {
                    if (data.state.store.config.version == State.store.config.version) {
                        for (let key in data.state) {
                            State[key] = data.state[key];
                        }
                        console.info("State loaded.");
                    }
                    else if (State.store.config.version - data.state.store.config.version <= State.store.config.updDelta) {
                        console.log("Attempting state update from older version.");
                        for (let obj of ["store", "settings"]) {
                            for (let key in data.state[obj]) {
                                if (State[obj].hasOwnProperty(key) && key != "config") {
                                    State[obj][key] = data.state[obj][key];
                                }
                            }
                        }
                        State.save();
                    }
                    else {
                        printWarn("Unable to update state, loading defaults.");
                        State.save();
                    }
                }
                else {
                    printWarn("Invalid stored state, loading defaults.");
                    State.save();
                }
                r();
            }
            try {
                Storage.get("state", _load);
            }
            catch (e) {
                x(e);
            }
        });
    },
    checkUpdate() {
        if (Date.now() - this.store.lastUpdate > this.UPDATE_INTERVAL) {
            console.group("Checking for updates...");
            this.store.lastUpdate = Date.now();
            return fetch(this.URL_MANIFEST, {cache: "no-cache"})
                .then(resp => {
                    if (resp.ok) {
                        return resp.json();
                    }
                })
                .then(json => {
                    let localVersion = chrome.runtime.getManifest().version;
                    if (json.version != localVersion) {
                        console.log("Updates found");
                        showNotif("Update available.", {text: `New version: ${json.version}\nYour version: ${localVersion}`, onclick: () => openTab(this.URL_HOMEPAGE)});
                    }
                    else {
                        console.log("No (larger) updates. Checking for commits...");
                        return this.checkCommits();
                    }
                })
                .then(() => {
                    console.groupEnd();
                    this.save();
                })
                .catch(e => printError("Failed update check: ", e));
        }
        else {
            return Promise.resolve();
        }
    },
    checkCommits() {
        return fetch(this.settings.useDevBranch ? this.DEV_URL_COMMITS : this.URL_COMMITS, {cache: "no-store"})
            .then(r => {
                if (r.ok) {
                    return r.json();
                }
            })
            .then(json => {
                // We only notify once, for various reasons but we can't check what commit a user is on anyway or if they have local modifications.
                let list = [],
                    numNew = 0;
                for (let entry of json) {
                    if (entry.sha == this.store.lastCommit) {
                        break;
                    }
                    numNew++;
                    list.push("- " + entry.commit.message.slice(0, entry.commit.message.indexOf("\n")));
                }
                if (numNew > 0) {
                    if (numNew == 3 && json[2].parents[0].sha != this.store.lastCommit) {
                        numNew = "3+";
                    }
                    this.store.lastCommit = json[0].sha;
                    console.log(`There were ${numNew} new commits since last check.`);
                    showNotif(`New commits (${numNew}):`, {text: list.join("\n"), onclick: () => openTab(this.URL_HOMEPAGE)});
                }
                else {
                    console.log("No new commits since last check.");
                }
            })
            .catch(e => {
                deverror("Failed to get commit info: ", e);
            });
    },
    haveInit(state) {
        if (!this.store.isInit[state]) {
            this.store.isInit[state] = true;
            this.save();
        }
    },
    reset() {
        if (confirm("Clear all stored data and settings?")) {
            Supplies.clear();
            Storage.clear();
            console.log("Cleared all stored data and settings.");
        }
    }
};

function toggleDebug() {
    State.settings.debug = !State.settings.debug;
}
function devlog() {
    if (State.settings.debug) { console.debug(... arguments) }
}
function devwarn() {
    if (State.settings.debug) { console.warn(... arguments) }
}
function deverror() {
    if (State.settings.debug) { console.error(... arguments) }
}
function printError(... args) {
    if (State.settings.dbgNotifyErrors) {
        showNotif("Error", {text: args.join("\n")});
    }
    console.error(... args);
}
function printWarn(... args) {
    if (State.settings.dbgNotifyWarnings) {
        showNotif("Warning", {text: args.join("\n")});
    }
    console.warn(... args);
}