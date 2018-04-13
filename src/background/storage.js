/*globals chrome*/
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
            console.log("Data loaded: %s", ... Object.keys(result));
            if (cb) cb(result);
        }
        else {
            console.log("Data saved: %s", ... Object.keys(v));
            if (cb) cb();
        }
    }
};