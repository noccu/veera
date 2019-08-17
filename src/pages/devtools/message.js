/* eslint-disable no-undef */
window.BackgroundPage = {
    query: function(key, val) {
        return new Promise(r => chrome.runtime.sendMessage({source: "ui", query: key, val}, ret => r(ret.value)));
    },
    connection: null,
    connect: function() {
        chrome.runtime.onMessage.addListener(hearQuery);
        this.connection = chrome.runtime.connect({name: "devtools-page"});
        this.connection.onMessage.addListener(this.hear);
    },
    send: function(action, data) {
        if (!this.connection) {
            console.error("No connection to extension established.");
            return;
        }
        this.connection.postMessage({action, data});
    },
    hear: function(msg) {
        if (DEBUG) { console.debug("[devtools] Heard:", msg) }
        switch (msg.action) {
            case "sayHi":
                console.log("Onee-sama gokigenyou! (´ ∀ ` *)");
                break;
            case "sayBye":
                console.log("Iya da onee-sama!! ＼(º □ º l|l)");
                break;
            case "init":
                initialize(msg.data);
                break;
            case "updStatus":
                updateStatus(msg.data);
                break;
            case "updPendants":
                updatePendants(msg.data);
                break;
            case "updCurrencies":
                updateCurrencies(msg.data);
                break;
            case "updArca":
                updateArca(msg.data);
                break;
            case "updSupplies":
                updateSupplies(msg.data);
                syncPlanner(msg.data);
                break;
            case "newPlannerSeriesOptions":
                updateSeriesOptions(msg.data);
                break;
            case "newPlanCreated":
                UI.planner.displayPlan(msg.data);
                break;
            case "updUnfAreas":
                UI.unf.areaInfo.update(msg.data);
                break;
            case "updBattleData":
                UI.battle.update(msg.data);
                break;
            case "updBattleNewRaid":
                UI.battle.reset(msg.data);
                UI.battle.setPartyNames(msg.data.characters.list);
                UI.battle.setBossNames(msg.data.bosses.list);
                break;
            case "updBattleArchive":
                UI.battle.updArchive(msg.data);
                break;
            case "updRaidLoot":
            case "nextQuestTriggered":
                updCurrentRaidInfo(msg.data);
                break;
            case "updRaid":
                UI.raids.update(msg.data);
                break;
            case "syncTime":
                UI.time.sync(msg.data);
                break;
            case "updGuild":
                setGuildLink(msg.data);
                break;
            case "setLastHosted":
                UI.setValue({id: "last-hosted-quest", value: msg.data});
                break;
            case "logSupport":
                updLastSupport(msg.data);
                break;
            default:
                window.dispatchEvent(new CustomEvent(msg.action, {detail: msg.data}));
        }
    }
};

function hearQuery(data, sender, respond) {
    devlog("Query rcv: ", data);
    if (data.source == "bg") {
        var retValue;
        switch (data.query) {
            case "tabId":
                retValue = chrome.devtools.inspectedWindow.tabId;
        }

        respond({
            query: data.query,
            value: retValue
        });
    }
}
