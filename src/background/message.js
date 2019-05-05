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
        window.dispatchEvent(new Event(EVENTS.connected));
    },
    listen: function(data) {
        hear(data);
    },
    deafen: function() {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        }
        //Apparently devToolsConnection is already null at this point. Thanks chrome? Nice docs.
    },
    disconnect () {
        DevTools.devToolsConnection.onMessage.removeListener(this.listen);
        chrome.runtime.onMessage.removeListener(hearQuery);
        DevTools.devToolsConnection.disconnect();
        DevTools.devToolsConnection = null;
    },
    send: function(action, data) {
        if (!this.devToolsConnection) {
            console.error("No active connection to DevTools.");
            return;
        }
        this.devToolsConnection.postMessage({action, data});
    },
    query: function(key) {
        return new Promise(r => chrome.runtime.sendMessage({source: "bg", query: key}, ret => r(ret.value)));
    }
};

function hear (msg) {
    //Convert to util object. Makes it easier to deal with and is in the end likely faster since we can check much smaller strings.
    let path = "";
    if (msg.action == "request") {
        msg.data.url = new URL(msg.data.url);
        path = msg.data.url.pathname;
    }
    devlog("[background] Heard:", msg, path);
    switch (msg.action) {
        case "request":
            //JSON
            if (msg.data.hasOwnProperty("json")) {
                switch (true) {
                    case path.ismatch("user/content/index"): //Homepage
                    case path.ismatch("profile/content/index"): //Profile
                    case path.ismatch("user/status"):
                        Profile.update(msg.data.json);
                        break;
                    case path.ismatch("casino/content/index"):
                    case path.ismatch("casino/content/list"):
                        Profile.setCasino(msg.data.json);
                        break;
                    case path.ismatch("item/article_list")://Treasure list
                        Supplies.setTreasure(msg.data.json);
                        break;
                    case path.ismatch("item/recovery_and_evolution_list")://Consumables list
                        Supplies.setConsumables(msg.data.json);
                        break;
                    case path.ismatch("item/gacha_ticket_and_others_list_by_filter_mode"):
                        Supplies.setTickets(msg.data.json);
                        break;
                    case path.ismatch("resultmulti/data")://Raid loot screen
                    case path.ismatch("result/data"): //Quest loot screen
                    case path.ismatch("arcarum/open_chest"):
                        gotQuestLoot(msg.data.json);
                        getPendantsRaid(msg.data.json);
                        checkNextQuest(msg.data.json);
                        break;
                    case path.ismatch("rest/arcarum/stage"):
                        if (msg.data.json.notice_effect) {
                            gotQuestLoot(msg.data.json.notice_effect.show_open_red_chest);
                        }
                        break;
                    case path.ismatch("rest/arcarum/start_stage"):
                        Profile.arcarum.tickets.current = msg.data.json.passport_num;
                        updateUI("updArca", Profile.arcarum);
                        break;
                    case path.ismatch("weapon/evolution_materials"):
                        weaponUncapStart(msg.data);//TBH Just xhr the supplies lmao
                        break;
                    case path.ismatch("npc/evolution_materials"):
                        npcUncapStart(msg.data);//TBH Just xhr the supplies lmao
                        break;
                    case path.ismatch("evolution_weapon/item_evolution"):
                    case path.ismatch("evolution_npc/item_evolution"):
                        uncapEnd(msg.data.json);
                        break;
                    case /teamraid\d+\//.test(path):
                        DevTools.send("updUnfEdition", msg.data.url.href);
                        break;
                    case path.ismatch("/bookmaker/content/top"): //bookmaker is only in unf r-right?
                        DevTools.send("updUnfAreas", msg.data.json);
                        break;
                    case path.ismatch("rest/raid/ability_result.json"):
                    case path.ismatch("rest/multiraid/ability_result.json"):
                        battleUseAbility(msg.data.json);
                        break;
                    case path.ismatch("rest/raid/normal_attack_result.json"):
                    case path.ismatch("rest/multiraid/normal_attack_result.json"):
                        battleAttack(msg.data.json);
                        break;
                    case path.ismatch("rest/raid/summon_result"):
                    case path.ismatch("rest/multiraid/summon_result"):
                        battleUseSummon(msg.data.json);
                        break;
                    case path.ismatch("quest/treasure_raid"):
                    case /treasureraid\d+\/top\/content\/newindex/.test(path):
                        storePendingRaidsTreasure(msg.data.json);
                        break;
                    case path.ismatch("quest/create_quest"):
                        if (msg.data.json.result == "ok" && msg.data.json.is_host) {
                            consumePendingRaidsTreasure(msg.data);
                            Raids.update({
                                action: "hosted",
                                id: msg.data.postData.quest_id
                            });
                            Raids.setLastHost();
                        }
                        break;
                    case path.ismatch("quest/quest_data"):
                        Raids.setPendingHost({json: msg.data.json});
                        break;
                    case path.ismatch("quest/user_action_point"):
                        Profile.update(msg.data.json);
                        break;
                    case path.ismatch("quest/user_item"):
                        useRecoveryItem(msg.data.json);
                        break;
                    case path.ismatch("rest/raid/start"):
                    case path.ismatch("rest/multiraid/start"):
                        Battle.reset(msg.data.json);
                        break;
                    case path.ismatch("shop_exchange/purchase"):
                        purchaseItem(msg.data.json);
                        //TODO: May need to ignore the next item/article_list request cause some items go to crate, causing the data in the response to not be updated...
                        break;
                    case path.ismatch("summon/decompose_multi"):
                    case path.ismatch("weapon/decompose_multi"):
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
                    case path.ismatch("disabled_job/"):
                        storePendingJobUnlock(msg.data.json);
                        break;
                    case path.ismatch("party/release_job"):
                        consumePendingJobUnlock(msg.data);
                        break;
                    case path.ismatch("archaic/job/replica_exchange/"):
                    case path.ismatch("archaic/job/original_exchange/"):
                    case path.ismatch("archaic/job/rebuilt_exchange/"):
                        storePendingForgeCCW(msg.data.json);
                        break;
                    case path.ismatch("archaic/job/replica_exchange_result"):
                    case path.ismatch("archaic/job/original_exchange_result"):
                    case path.ismatch("archaic/job/rebuilt_exchange_result"):
                        consumePendingForgeCCW(msg.data.postData);
                        break;
                    //There is a confirm for _all which triggers if not checking end of path, hence split.
                    case path.ismatch("present/receive?"):
                    case path.ismatch("present/receive_all?"):
                    case path.ismatch("present/term_receive?"):
                    case path.ismatch("present/term_receive_all?"):
                        //is  normally followed by article list but that only shows treasure. There's more to pick up than that...
                        cratePickup(msg.data.json);
                        break;
                    case path.ismatch("rest/title/par_claim"): //trophy pickup
                        trophyPickup(msg.data.json);
                        break;
                    case path.ismatch("advent/top/content/newindex"):
                        setRotbPendants(msg.data.json);
                        break;
                    case path.ismatch("guild_main/content/index"):
                        updStrikeTime(msg.data.json);
                        break;
                    case path.ismatch("rest/guild/main/guild_info"):
                        updateGuildInfo(msg.data.json);
                        break;
                    case path.ismatch("guild_main/support_all_info/"):
                        Time.setCrewBuffs(msg.data.json);
                        break;
                    case path.ismatch("shop_exchange/activated_personal_supports"):
                        Time.setJdBuffs(msg.data.json);
                        break;
                    case path.ismatch("shop_exchange/personal_support"):
                    case path.ismatch("shop_exchange/activate_personal_support"):
                        Time.addJdBuff(msg.data);
                        break;
                }
            }
            break;
        case "plannerSeriesChange":
            DevTools.send("newPlannerSeriesOptions", Planner.getSeriesOptions(msg.data.newValue));
            break;
        case "newPlanRequest":
            DevTools.send("newPlanCreated", Planner.createPlan(msg.data));
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
        case "updRaid":
            Raids.update(msg.data);
            break;
        case "hostRaid":
            Raids.start(msg.data.raidId, msg.data.matId);
            break;
        case "navigateTo":
            if (msg.data) {
                State.game.navigateTo(GAME_URL.baseGame + msg.data);
            }
            break;
        case "repeatQuest":
            Raids.repeatLast();
            break;
        case "playTriggeredQuest":
            Raids.playTriggered();
    }
}

function hearQuery (data, sender, respond) {
    if (data.source == "dt") {
        var retValue;
        switch (data.query) {
            //Nothing so far since change.
        }

        respond({query: data.query,
                 value: retValue});
    }
}
