/*globals chrome:false, Profile: true, Supplies: true, State: true*/
window.DevTools = {
    devToolsConnection: null,
    init: function() {
        console.log("Onee-sama?");
        chrome.runtime.onConnect.addListener(function(port) {
            console.log("Onee-sama!", port);
            DevTools.devToolsConnection = port;
            port.onMessage.addListener(DevTools.listen);
            port.onDisconnect.addListener(this.deafen);
        });
        chrome.runtime.onMessage.addListener(hearQuery);
    },
    listen: function(data) {
        console.log("[background] Heard:", data);
        hear(data);
    },
    deafen: function() {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        }
        this.devToolsConnection.onMessage.removeListener(this.listen);
        this.devToolsConnection = null;
    },
    send: function(action, data) {
        if (!this.devToolsConnection) {
            console.error("No active connection to DevTools.");
            return;
        }
        this.devToolsConnection.postMessage({action, data});
    }
};

//Add a simple fast boolean return match function just cause I like it better :>
String.prototype.ismatch = function(s){ return this.indexOf(s) != -1;};
// function ismatch (s) { return this.indexOf(s) != -1};

function hear (msg) {
    //console.log("Processing:", data);
    switch (msg.action) {
        case "request":
            var url = msg.data.url;
            // var req = u.slice(30, u.lastIndexOf("/"));
            switch (true) {
                case url.ismatch("user/content/index"): //Homepage
                    Profile.pendants.set(msg.data.json);
                    Profile.status.set(msg.data.json.option.mydata_assets.mydata.status);
                    break;
                case url.ismatch("user/status"):
                    Profile.status.set(msg.data.json.status);
                    break;
                case url.ismatch("profile/content/index"):
                    Profile.pendants.set(msg.data.json);
                    break;
                case url.ismatch("resultmulti/data"): //Raid loot screen
                    //TODO: supplies/treasure!
                    Profile.pendants.add(msg.data.json);
                    break;
                case url.ismatch("item/article_list"):
                    Supplies.treasure.set(msg.data.json);
                    break;
                case url.ismatch("item/recovery_and_evolution_list"):
                    Supplies.consumable.set(msg.data.json);
            }
            break;
        case "plannerSeriesChange":
            DevTools.send("newPlannerSeriesOptions", Planner.getSeriesOptions(msg.data.newValue));
            break;
        case "newPlanRequest":
            DevTools.send("newPlanCreated", Planner.createPlan(msg.data.series,
                                                               msg.data.type,
                                                               msg.data.element,
                                                               msg.data.start,
                                                               msg.data.end));
    }
}

function hearQuery (data, sender, respond) {
    var retValue;
    
    switch (data.query) {
        case "theme":
            retValue =  State.options.theme.current;
            break;
        case "plannerSeriesList":
            retValue = Planner.listSeries();
    }
    
    respond({query: data.query, 
             value: retValue});
}
