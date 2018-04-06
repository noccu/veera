/*globals DevTools: true, State: true*/
var UPDATED = false;

DevTools.init(); //Listen for devtools conn
State.options.theme.current = 0; //TODO: Replace with proper options parsing and defaults setting

function updateUI (type, value) {
    DevTools.send({
            action: type, 
            value: value
        });
}
