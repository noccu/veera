window.DevTools = {
    devToolsConnection: null,
    init: function() {
        console.log("Waiting on DevTools connection.");
        chrome.runtime.onConnect.addListener(function(port) {
            console.log("Devtools connnected.", port);
            DevTools.devToolsConnection = port;
            port.onMessage.addListener(DevTools.listen);
            port.onDisconnect.addListener(this.deafen);
        });
    },
    listen: function(data) {
        console.log("Heard:", data);
        hearMessageDT(data);
    },
    deafen: function(port) {
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