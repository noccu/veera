window.BackgroundPage = {
    connection: null,
    connect: function() {
        this.connection = chrome.runtime.connect({
            name: "devtools-page"
        });
        this.connection.onMessage.addListener(this.listen);
    },
    send: function(data) {
        if (!this.connection) {
            console.error("No connection to extension established.");
            return;
        }
        this.connection.postMessage(data);
    },
    listen: function(data){
        switch (data.action){
            case "sayHi":
                console.log("Onee-sama!");
            break;
            case "sayBye":
                console.log("Onee-sama?");
            break;
            case "updatePendants":
                updatePendants(data);
            break;
        }
    }
};
