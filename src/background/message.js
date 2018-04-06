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
    send: function(data) {
        if (!this.devToolsConnection) {
            console.error("No active connection to DevTools.");
            return;
        }
        this.devToolsConnection.postMessage(data);
    }
};

//Add a simple fast boolean return match function just cause I like it better :>
String.prototype.ismatch = function(s){ return this.indexOf(s) != -1;};
// function ismatch (s) { return this.indexOf(s) != -1};

function hear (data) {
    //console.log("Processing:", data);
    if (data.request) {
        var url = data.request.url;
        // var req = u.slice(30, u.lastIndexOf("/"));
        switch (true) {
            case url.ismatch("user/content/index"): //Homepage
                Profile.pendants.set(data.request.json);
                Profile.status.set(data.request.json.option.mydata_assets.mydata.status);
                break;
            case url.ismatch("user/status"):
                Profile.status.set(data.request.json.status);
                break;
            case url.ismatch("profile/content/index"):
                Profile.pendants.set(data.request.json);
                break;
            case url.ismatch("resultmulti/data"): //Raid loot screen
                //TODO: supplies/treasure!
                Profile.pendants.add(data.request.json);
                break;
            case url.ismatch("item/article_list"):
                Supplies.treasure.set(data.request.json);
                break;
            case url.ismatch("item/recovery_and_evolution_list"):
                Supplies.consumable.set(data.request.json);
        }
    }
}

function hearQuery (data, sender, respond) {
    switch (data.query) {
        case "theme":
            respond({query: data.query, 
                     value: State.options.theme.current});
    }
}
