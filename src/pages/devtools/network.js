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
    logRequest: async function(entry) {
        if (entry.request.url.indexOf("game.granbluefantasy.jp") != -1) {
            let data = {url: entry.request.url};
            let success = false,
                content;

            try {
                data.postData = entry.request.postData ? JSON.parse(entry.request.postData.text) : null;
                switch (entry.response.content.mimeType) {
                    case "application/json":
                        content = await Network.getData(entry);
                        if (content) {
                            data.json = JSON.parse(content);
                            success = true;
                        }
                        break;
                    case "text/html":
                        content = await Network.getData(entry);
                        if (content) {
                            data.html = content;
                            success = true;
                        }
                        break;
                }
            }
            catch (e) {
                success = false;
                console.error(e);
            }

            if (success) {
                BackgroundPage.send("request", data);
            }
        }
    },
    getData(harEntry) {
        return new Promise(
            (r, x) => {
                try {
                    harEntry.getContent((content, encoding) => r(encoding == "base64" ? atob(content) : content));
                }
                catch (e) {
                    x(e);
                }
            }
        );
    },
    toggle: function() {
        if (Network.logging) {
            Network.deafen();
        }
        else {
            Network.listen();
        }
    }
};
