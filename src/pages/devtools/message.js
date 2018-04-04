window.BackgroundPage = {
    connection: null,
    connect: function() {
        this.connection = chrome.runtime.connect({
            name: "devtools-page"
        });
        this.connection.onMessage.addListener(this.hear);
    },
    send: function(data) {
        if (!this.connection) {
            console.error("No connection to extension established.");
            return;
        }
        this.connection.postMessage(data);
    },
    hear: function(data){
        console.log("[devtools] Heard:", data);
        switch (data.action){
            case "sayHi":
                console.log("Onee-sama!");
                break;
            case "sayBye":
                console.log("Onee-sama?");
                break;
            case "updPendants":
                updatePendants(data.value);
                break;
            case "updStatus":
                updateStatus(data.value);
                break;
            case "queryResult":
                switch (data.query) {
                    case "theme":
                        UI.setTheme(data.value.fname);
                        break;
                }
                break;
            case "setTreasure":
                updateTreasure(data.value);
                break;
        }
    }
};
