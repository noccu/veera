function updateUI(data) {
    for (let entry of data) {
        var ele = document.getElementById(entry.id);
        ele.textContent = entry.value;
    }
}

function updatePendants(data) {
    switch(data.method) {
        case "set": //TODO: add Inc and Dec
            updateUI([
                {id: "display-renown-total", value: data.value.renown.total},
                {id: "display-prestige-total", value: data.value.prestige.total},
                
                {id: "panel-renown-total", value: data.value.renown.total},
                {id: "panel-renown-weekly", value: data.value.renown.weekly},
                {id: "panel-renown-daily", value: data.value.renown.daily},
                {id: "panel-renown-prestige", value: data.value.prestige},
                {id: "panel-renown-crew", value: data.value.prestige_crew}
            ]);
            break;
        default:
            console.log("Pendants are now:", data.value.renown.total);
    }
}

