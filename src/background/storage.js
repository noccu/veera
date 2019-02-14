window.Storage = {
    set: function (value, cb) {
        chrome.storage.local.set(value, res => this.response(res, cb, value));       
    },
    get: function(key, cb) {
        chrome.storage.local.get(key, res => this.response(res, cb));
    },
    response: function(result, cb, v) {
        if (chrome.runtime.lastError) {
            console.error("[Storage] Error:", chrome.runtime.lastError);
            return;
        }
        
        if (result) {
            devlog("Data loaded: ", ...Object.keys(result));
            if (cb) { cb(result); }
        }
        else {
            devlog("Data saved: ", ...Object.keys(v));
            if (cb) { cb(); }
        }
    }
};