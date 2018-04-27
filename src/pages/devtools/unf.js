/*globals Chart, chrome, CONSTANTS*/
window.Unf = {
    areaInfo: {
        graph: null,
        logging: false,
        init: function(){
          document.getElementById("unf-graph-start").addEventListener("click", this.startLog);
          document.getElementById("unf-graph-stop").addEventListener("click", this.stopLog);
          document.getElementById("unf-graph-save").addEventListener("click", this.save);
          document.getElementById("unf-graph-load").addEventListener("click", this.load);
          document.getElementById("unf-graph-upd").addEventListener("click", xhrUnfAreaData);
        },
        create: function () {
            var ctx = document.getElementById("unf-area-chart").getContext("2d");
            
            this.graph = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [createUnfDataset("North", 'rgb(87, 129, 61)'),
                               createUnfDataset("West", 'rgb(98, 98, 75)'),
                               createUnfDataset("East", 'rgb(61, 79, 129)'),
                               createUnfDataset("South", 'rgb(129, 61, 61)')]
                },
                options: {
                    elements: {
                        line: { tension: 0 }
                    }
                }
            });
        },
        update: function (honorsArr) {
            if (honorsArr.length != 4) {
                console.error("UNF area update: Invalid arguments");
                return;
            }
            if (!this.graph) { this.create(); }
         
            for (let i = 0; i < honorsArr.length; i++) {
                let data = this.graph.config.data.datasets[i].data;
                let last = data[data.length - 1];
                //Data not yet updated.
                if (last == honorsArr[i]) {//should only be called on first iteration really
                    return;
                }
                //New day/fight
                if (last > honorsArr[i]) {
                    data = [];
                    if (this.graph.config.data.labels.length > 0) {
                        this.graph.config.data.labels = [];
                    }
                }
                
                data.push(honorsArr[i]);
            }
            var date = new Date();
            this.graph.config.data.labels.push(date.toLocaleString(navigator.language, {hour: "numeric", minute: "numeric"}));
            this.graph.update();
        },
        startLog: function() {
            if (!Unf.areaInfo.logging) {
                Unf.areaInfo.iv = setInterval(xhrUnfAreaData, 1000*60*21);
            }
        },
        stopLog: function(){
            if (Unf.areaInfo.logging) {
                clearInterval(Unf.areaInfo.iv);
                Unf.areaInfo.logging = false;
            }
        },
        save: function () {
            var ds_data = [];
            for (let set of Unf.areaInfo.graph.config.data.datasets) {
                ds_data.push(set.data);
            }
            
            chrome.storage.local.set({ 
                unf: {
                    areaInfo: {
                        honors: ds_data,
                        times: Unf.areaInfo.graph.config.data.labels
                    }
                }
            });
        },
        load: function () {
            function _load(loadedData) {
                 if (!Unf.areaInfo.graph) { Unf.areaInfo.create(); }
                 Unf.areaInfo.graph.config.data.labels = loadedData.unf.areaInfo.times;
                 
                 for (let i = 0; i < loadedData.unf.areaInfo.honors.length; i++) {
                     Unf.areaInfo.graph.config.data.datasets[i].data = loadedData.unf.areaInfo.honors[i]; 
                 }
                 Unf.areaInfo.graph.update();
             }
             chrome.storage.local.get("unf", _load);
        }
    }
};

function createUnfDataset (area, color) {
    return {label: area,
            data: [],
            borderColor: color,
            borderWidth: 1,
            fill: false};
}

function updUnfAreas(json) {
    var p = new DOMParser();
    var input = p.parseFromString(decodeURIComponent(json.data), "text/html");
    
    var pts = [];
    var data = input.body.querySelectorAll(".lis-area .point");
    for (let el of data) {
        pts.push(parseInt(el.textContent));
    }
    
    Unf.areaInfo.update(pts);
}

function xhrUnfAreaData() {
    if (DEBUG) { console.log("[xhr] UNF Area Data") ;}
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        updUnfAreas(xhr.response);
    };
    xhr.open("GET", `${CONSTANTS.baseGameUrl}teamraid037/bookmaker/content/top`);
//    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
//    xhr.setRequestHeader("X-VERSION", "1524565238");
    xhr.responseType = "json";
    xhr.send();
}