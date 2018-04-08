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
        if (entry.response.content.mimeType == "application/json" && entry.request.url.includes("game.granbluefantasy.jp")) {
            entry.getContent(data => {
                if (window.DEBUG) console.log(entry.request.url.slice(30), JSON.parse(data));
                BackgroundPage.send("request", {url: entry.request.url,
                                                json: JSON.parse(data),
                                                postData: entry.request.postData ? JSON.parse(entry.request.postData.text) : null
                                               });
            });
}
    },
    toggle: function(){
        Network.logging ? Network.deafen() : Network.listen();
    }
}
