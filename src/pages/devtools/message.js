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
            case "setTreasure":
                updateTreasure(data.value);
                break;
            case "setConsumables":
                updateConsumables(data.value);
                break;
        }
    }
};
