window.DevTools = {
    devToolsConnection: null,
    wait: function() {
        console.log("Onee-sama?");
        chrome.runtime.onConnect.addListener(this.connected);
        chrome.runtime.onMessage.addListener(hearQuery);
    },
    connected: function(port) {
        console.log("Onee-sama!", port);
        DevTools.devToolsConnection = port;
        port.onMessage.addListener(DevTools.listen);
        port.onDisconnect.addListener(DevTools.deafen);
        window.dispatchEvent(EVENTS.connected);
    },
    listen: function(data) {
        devlog("[background] Heard:", data);
        hear(data);
    },
    deafen: function() {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        }
        DevTools.devToolsConnection.onMessage.removeListener(DevTools.listen);
        DevTools.devToolsConnection = null;
    },
    send: function(action, data) {
        if (!this.devToolsConnection) {
            console.error("No active connection to DevTools.");
            return;
        }
        this.devToolsConnection.postMessage({action, data});
    }
};

//Add a simple fast boolean return match function just cause I like it better :>
String.prototype.ismatch = function(s){ return this.indexOf(s) != -1;};
// function ismatch (s) { return this.indexOf(s) != -1};

function hear (msg) {
//    console.log("Processing:", data);
    switch (msg.action) {
        case "request":
            var url = msg.data.url;
            // var req = u.slice(30, u.lastIndexOf("/"));
            switch (true) {
                case url.ismatch("user/content/index"): //Homepage
                    Profile.pendants.set(msg.data.json);
                    Profile.status.set(msg.data.json.option.mydata_assets.mydata.status);
                    break;
                case url.ismatch("user/status"):
                    Profile.status.set(msg.data.json.status);
                    break;
                case url.ismatch("profile/content/index"):
                    Profile.pendants.set(msg.data.json);
                    break;
                case url.ismatch("item/article_list")://Treasure list
                    Supplies.setTreasure(msg.data.json);
                    break;
                case url.ismatch("item/recovery_and_evolution_list")://Consumables list
                    Supplies.setConsumables(msg.data.json);
                    break;
                case url.ismatch("resultmulti/data")://Raid loot screen
                case url.ismatch("result/data"): //Quest loot screen
                    gotQuestLoot(msg.data.json.rewards);
                    getPendantsRaid(msg.data.json);
                    checkNextQuest(msg.data.json);
                    break;
                case url.ismatch("weapon/evolution_materials"):
                    weaponUncapStart(msg.data);//TBH Just xhr the supplies lmao
                    break;
                case url.ismatch("npc/evolution_materials"):
                    npcUncapStart(msg.data);//TBH Just xhr the supplies lmao
                    break;
                case url.ismatch("evolution_weapon/item_evolution"):
                case url.ismatch("evolution_npc/item_evolution"):
                    uncapEnd(msg.data.json);
                    break;
                case /\/teamraid\d+\//.test(url):
                    DevTools.send("updUnfEdition", url);
                    break;
                case url.ismatch("/bookmaker/content/top"): //bookmaker is only in unf r-right?
                    DevTools.send("updUnfAreas", msg.data.json);
                    break;
                case url.ismatch("rest/raid/ability_result.json"):
                case url.ismatch("rest/multiraid/ability_result.json"):
                    battleUseAbility(msg.data.json);
                    break;
                case url.ismatch("rest/raid/normal_attack_result.json"):
                case url.ismatch("rest/multiraid/normal_attack_result.json"):
                    battleAttack(msg.data.json);
                    break;
                case url.ismatch("rest/raid/summon_result"):
                case url.ismatch("rest/multiraid/summon_result"):
                    battleUseSummon(msg.data.json);
                    break;
                case url.ismatch("rest/raid/start"):
                case url.ismatch("rest/multiraid/start"):
                    Battle.log.reset(msg.data.json);
                    break;
                case url.ismatch("shop_exchange/purchase"):
                    purchaseItem(msg.data.json);
                    //TODO: May need to ignore the next item/article_list request cause some items go to crate, causing the data in the response to not be updated...
                    break;
                case url.ismatch("summon/decompose_multi"):
                case url.ismatch("weapon/decompose_multi"):
                    reduce(msg.data.json);
                    break;
                    //quest/user_action_point  ==> before usage
                    /*
                    json:
                        action_point: 141
                        action_point_limit: 999
                        elixir_half_recover_value: 56
                        elixir_recover_value: 113
                        max_action_point: "113"
                    */
                    //quest/quest_data ==> info
                    /*
                    json:
                        action_point: "40"
                        chapter_name: "Belial Impossible"
                    */
                case url.ismatch("quest/treasure_raid"):
                case /treasureraid\d+\/top\/content\/newindex/.test(url):
                    storeImminentRaidsTreasure(msg.data);
                    break;
                case url.ismatch("quest/create_quest"):
                    consumeImminentRaidsTreasure(msg.data);
            }
            break;
        case "plannerSeriesChange":
            DevTools.send("newPlannerSeriesOptions", Planner.getSeriesOptions(msg.data.newValue));
            break;
        case "newPlanRequest":
            DevTools.send("newPlanCreated", Planner.createPlan(msg.data.series,
                                                               msg.data.type,
                                                               msg.data.element,
                                                               msg.data.start,
                                                               msg.data.end));
            break;
        case "saveData":
            Storage.set(msg.data);
            break;
        case "setUnfEdition":
            if (State.unfEdition != msg.data) {
                State.unfEdition = msg.data;
                State.save();
            }
            break;
    }
}

function hearQuery (data, sender, respond) {
    var retValue;
    
    switch (data.query) {
        case "theme":
            retValue = State.settings.theme.current;
            break;
        case "plannerSeriesList":
            retValue = Planner.listSeries();
            break;
        case "loadData":
            Storage.get(data, respond);
            break;
        case "unfEdition":
            retValue = State.unfEdition;
            break;
    }
    
    respond({query: data.query, 
             value: retValue});
}
