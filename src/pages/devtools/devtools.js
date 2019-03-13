(function () {
    var man = chrome.runtime.getManifest();
  chrome.devtools.panels.create(man ? man.name : "Veera-dev",
    "assets/images/icon.png",
    "src/pages/devtools/ui.html");
})();