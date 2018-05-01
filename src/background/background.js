/*globals DevTools: true, State: true, Supplies*/
const UPDATED = false;
const EVENTS = {
    connected: new Event("veeraConnected")
};

window.addEventListener("veeraConnected", MainInit);
DevTools.wait(); //Listen for devtools conn
loadSettings();
//Adding a last item in array macro
Object.defineProperty(Array.prototype, "last", {get: function(){ 
    return this.length == 0 ? 0 : this[this.length - 1]; 
}});

function MainInit() {
    Supplies.load();
}

//Old function, kept for now due to ease of reading intended use.
function updateUI (type, value) {
    DevTools.send(type, value);
}
