(function () {
    var man = chrome.runtime.getManifest();
  chrome.devtools.panels.create(man ? man.name : "Veera",
    "assets/images/icon.png",
    "src/pages/devtools/panel.html",
    function (panel) {});
})();