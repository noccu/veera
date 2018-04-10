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
        console.log("[devtools] Heard:", msg);
        switch (msg.action){
            case "sayHi":
                console.log("Onee-sama!");
                break;
            case "sayBye":
                console.log("Onee-sama?");
                break;
            case "updPendants":
                updatePendants(msg.data);
                break;
            case "updStatus":
                updateStatus(msg.data);
                break;
            case "setTreasure":
                updateTreasure(msg.data);
                syncPlanner(msg.data, "treasure");
                break;
            case "setConsumables":
                updateConsumables(msg.data);
//                syncPlanner(msg.data, "consumable");
                break;
            case "newPlannerSeriesOptions":
                updateSeriesOptions(msg.data);
                break;
            case "newPlanCreated":
                UI.planner.displayPlan(msg.data);
        }
    }
};
