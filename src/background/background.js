const UPDATED = false;
const EVENTS = {
    connected: new Event("veeraConnected"),
//    newBattle: new Event("newBattle")
};

window.addEventListener("veeraConnected", MainInit);
//window.addEventListener("newBattle", );

DevTools.wait(); //Listen for devtools conn
//Adding a last item in array macro
Object.defineProperty(Array.prototype, "last", {
    get: function () {
        return this.length == 0 ? 0 : this[this.length - 1];
    }
});

function MainInit() {
    State.load()
        .then(() => State.game.linkToTab())
        .then(Supplies.load)
        .then(Raids.load)
        .then(() => {
            updateUI("init_theme", State.theme.current);
            updateUI("init_plannerSeriesList", Planner.listSeries());
            updateUI("init_unfEdition", State.unfEdition);
            updateUI("init_raidList", Raids.getList());
        })
        .then(checkReset);
}

//Old function, kept for now due to ease of reading intended use.
function updateUI (type, value) {
    DevTools.send(type, value);
}
