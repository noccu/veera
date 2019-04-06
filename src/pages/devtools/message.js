window.BackgroundPage = {
    query: function(key) {
        return new Promise(r => chrome.runtime.sendMessage({source: "dt", query: key}, ret => r(ret.value)));
    },
    connection: null,
    connect: function() {
        chrome.runtime.onMessage.addListener(hearQuery);
        this.connection = chrome.runtime.connect({
            name: "devtools-page"
        });
        this.connection.onMessage.addListener(this.hear);
    },
    send: function(action, data) {
        if (!this.connection) {
            console.error("No connection to extension established.");
            return;
        }
        this.connection.postMessage({action, data});
    },
    hear: function(msg){
        if (DEBUG) { console.debug("[devtools] Heard:", msg); }
        switch (msg.action){
            case "sayHi":
                console.log("Onee-sama gokigenyou! 	(´ ∀ ` *)");
                break;
            case "sayBye":
                console.log("Iya da onee-sama!! ＼(º □ º l|l)");
                break;
            case "init":
                initialize(msg.data);
                break;
            case "updPendants":
                updatePendants(msg.data);
                break;
            case "updStatus":
                updateStatus(msg.data);
                break;
            case "updSupplies":
                updateSupplies(msg.data);
                syncPlanner(msg.data);
                break;
            case "newPlannerSeriesOptions":
                updateSeriesOptions(msg.data);
                break;
            case "newPlanCreated":
                UI.planner.displayPlan(msg.data);
                break;
            case "updUnfEdition":
                Unf.setEdition(msg.data);
                break;
            case "updUnfAreas":
                updUnfAreas(msg.data);
                break;
            case "updBattleData":
                UI.battle.update(msg.data);
                break;
            case "updBattleNewRaid":
                UI.battle.reset();
                UI.battle.setPartyNames(msg.data.characters.list);
                break;
            case "updRaidLoot":
            case "nextQuestTriggered":
                updCurrentRaidInfo(msg.data);
                break;
            case "updRaid":
                UI.raids.update(msg.data);
                break;
            default:
                window.dispatchEvent(msg.action, msg.data);
        }
    }
};

function hearQuery (data, sender, respond) {
    if (data.source == "bg") {
        var retValue;
        switch (data.query) {
            case "tabId":
                retValue = chrome.devtools.inspectedWindow.tabId;
        }

        respond({query: data.query,
                 value: retValue});
    }
}
