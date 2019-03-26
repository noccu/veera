window.BackgroundPage = {
    query: function(key, response){
      chrome.runtime.sendMessage({
                                    source: "devtools",
                                    query: key
                                 },
                                 response) ; 
    },
    connection: null,
    connect: function() {
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
            case "init_theme":
                UI.setTheme(msg.data);
                break;
            case "init_plannerSeriesList":
                UI.planner.init(msg.data);
                break;
            case "init_unfEdition":
                Unf.edition = msg.data;
                break;
            case "init_raidList":
                populateRaids(msg.data);
                break;
            case "updPendants":
                updatePendants(msg.data);
                break;
            case "updStatus":
                updateStatus(msg.data);
                break;
            case "setTreasure":
            case "setConsumables":
                updateSupplies(msg.data);
//                updateConsumables(msg.data);
                syncPlanner(msg.data, "treasure");
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
        }
    }
};
