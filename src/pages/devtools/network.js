window.Network = {
    logging: false,
    listen: function() {
        chrome.devtools.network.onRequestFinished.addListener(this.logRequest);
        this.logging = true;
        console.log("Request listener set.");
    },
    deafen: function() {
        chrome.devtools.network.onRequestFinished.removeListener(this.logRequest);
        this.logging = false;
        console.log("Request listener removed.");
    },
    logRequest: function(entry) {
        //Ignore anything that isn't JSON from gbf site.
        if (entry.request.url.indexOf("game.granbluefantasy.jp") != -1) {
            if (entry.response.content.mimeType == "application/json") {
                entry.getContent(data => {
                    if (DEBUG) { console.debug(entry.request.url.slice(30), JSON.parse(data)); }
                    BackgroundPage.send("request", {url: entry.request.url,
                                                    json: JSON.parse(data),
                                                    postData: entry.request.postData ? JSON.parse(entry.request.postData.text) : null
                                                   });
                });
            }
            else if (entry.request.url.indexOf("maintenance") != -1 && entry.response.content.mimeType == "text/html") {
                entry.getContent(data => startMaintTimer(data));
                if (DEBUG) { console.debug(entry); }
            }
        }
    },
    toggle: function(){
        if (Network.logging) {
            Network.deafen();
        }
        else {
            Network.listen();
        }
    }
};
