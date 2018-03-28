(function () {
  var cache = {};
  window.Storage = {

    Set: function (key, value) {
      //chrome.storage.sync.set({[key]: value});
      chrome.storage.local.set({
        [key]: value
      });
    },
    SetLocal: function (key, value) {
      chrome.storage.local.set({
        [key]: value
      });
    },
    GetSync: function (key, sendResponse) {
      chrome.storage.sync.get(key, function (response) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        } else {
          sendResponse(response);
        }
      });
    },
    Get: function (key, sendResponse) {
      chrome.storage.local.get(key, function (response) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        } else {
          if (Object.keys(response).length === 0 && response.constructor === Object) {
            Storage.GetSync(key, sendResponse);
          } else {
            sendResponse(response);
          }
        }
      });
    },
    GetMultipleSync: function (key, sendResponse) {
      chrome.storage.sync.get(key, function (response) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        } else {
          for (var i = 0; i < key.length; i++) {
            cache[key[i]] = response[key[i]];
            Storage.Set(key[i], response[key[i]]);
          }
          sendResponse(response);
        }
      });
    },
    GetMultiple: function (key, sendResponse) {
      chrome.storage.local.get(key, function (response) {
        if (chrome.runtime.lastError) {
          console.log(chrome.runtime.lastError);
        } else {
          for (var i = 0; i < key.length; i++) {
            cache[key[i]] = response[key[i]];
          }
          if (Object.keys(response).length === 0 && response.constructor === Object) {
            Storage.GetMultipleSync(key, sendResponse);
          } else {
            sendResponse(response);
          }
        }
      });
    }
  }
})();