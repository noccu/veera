window.Unf = {
    honors: [],
    times: [],
    setUnfEdition(url) {
        let m = url.match(/\/teamraid(\d+)\//);
        if (m && State.store.unfEdition != m[1]) { // Prevent uselessly saving all the time
            State.store.unfEdition = m[1];
            State.save();
        }
    },
    getAreaData() {
        devlog("[xhr] UNF Area Data");
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            Unf.updUnfAreas(xhr.response);
        };
        xhr.open("GET", `${GAME_URL.baseGame}teamraid${State.store.unfEdition}/bookmaker/content/top`);
        xhr.responseType = "json";
        xhr.send();
    },
    setAreaData(area, honors) {
        if (!this.honors[area]) {
            this.honors[area] = [];
        }
        this.honors[area].push(honors);
    },
    updUnfAreas(json) {
        let dom = parseDom(json.data);
        let newHonors = dom.body.querySelectorAll(".lis-area .point");
        if (newHonors.length == 4) {
            for (let area = 0; area < newHonors.length; area++) {
                let pts = parseInt(newHonors[area].textContent.replace(/,/g, ""));
                // let data = graphData.datasets[i].data;
                let lastHonors = this.honors[area].last;
                // Early term on first iteration/area
                if (lastHonors == newHonors[area]) {
                    return;
                }
                // New day/fight
                else if (lastHonors > newHonors[area]) {
                    this.honors = [];
                    this.times = [];
                }

                this.setAreaData(area, pts);
            }
            this.times.push((new Date()).toLocaleString(navigator.language, {hour: "numeric", minute: "numeric"}));
        }
        else {
            deverror("UNF area update: Invalid arguments");
        }

        updateUI("updUnfAreas", {honors: this.honors, times: this.times});
    },
    startLog() {
        if (!this.logging) {
            this.iv = setInterval(this.getAreaData, 1000 * 60 * 20 + 10);
            this.logging = true;
        }
    },
    stopLog() {
        if (this.logging) {
            clearInterval(this.iv);
            this.logging = false;
        }
    },
    control(data) {
        switch (data.cmd) {
            case "getUnfData":
                this.getAreaData();
                break;
            case "startLog":
                this.startLog();
                break;
            case "stopLog":
                this.stopLog();
                break;
            case "save":
                this.save();
                break;
            case "load":
                this.load().then(() => updateUI("updUnfAreas", {honors: this.honors, times: this.times}));
                break;
        }
    },
    save() {
        Storage.set({
            unf: {
                areaInfo: {
                    honors: this.honors,
                    times: this.times
                }
            }
        });
    },
    load() {
        return new Promise((r, x) => {
            function _load(loadedData) {
                if (loadedData.unf) {
                    Unf.times = loadedData.unf.areaInfo.times;

                    for (let i = 0; i < loadedData.unf.areaInfo.honors.length; i++) {
                        Unf.setAreaData(i, loadedData.unf.areaInfo.honors[i]);
                    }
                    r();
                }
                else { x("Failed to load UNF Area data.") }
            }
            Storage.get("unf", _load);
        });
    }
};