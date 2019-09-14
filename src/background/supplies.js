// commonly used type shorthand. TODO: merge with ITEM_KIND somehow usefully.
const SUPPLYTYPE = {treasure: 10, recovery: 4, evolution: 17, skill: 67, augment: 73, vessels: 75, crystals: 9, rupie: 7, drawTickets: 8, Untracked: [1, 2, 22, 37, 38, 39, 50, 82]}; // jshint ignore:line
SUPPLYTYPE.Consumables = [SUPPLYTYPE.recovery, SUPPLYTYPE.evolution, SUPPLYTYPE.augment, SUPPLYTYPE.skill, SUPPLYTYPE.vessels]; // types that make up "consumables" I think skill = 10000 sometimes?
SUPPLYTYPE.Currencies = [SUPPLYTYPE.crystals, SUPPLYTYPE.rupie, 19, 31];

// const treasureCategory = {primal: 0, world: 1, uncap: 2, coop: 3, event: 4, showdown: 5, other: 6};
// const consCategory = {recovery: 0, evolution: 1, skill: 2, augment: 3};
// item_kind, kind, and type are used interchangeably here.
// TODO: split off data to different file
// ITEM KIND gotten from game response in crate, but incomplete. Manual entries marked.
const ITEM_KIND = {// jshint ignore:line
    1: {
        name: "Weapon",
        class: "Weapon",
        path: "weapon"
    },
    2: {
        name: "Summon",
        class: "Summon",
        path: "summon"
    },
    3: {
        name: "Character",
        class: "Npc",
        path: "npc",
        suffix: "_01"
    },
    4: {
        name: "Item",
        class: "Normal",
        path: "item/normal"
    },
    6: {
        name: "Wonder",
        class: "Memorial",
        path: "item/memorial"
    },
    7: {
        name: "Rupie",
        class: "Money",
        path: "item/normal",
        specialId: {0: "lupi"}
    },
    8: {
        name: "Draw Ticket",
        class: "Ticket",
        path: "item/ticket",
        size: ""
    },
    9: {
        name: "Crystal",
        class: "Stone",
        path: "item/normal",
        specialId: {0: "gem"}
    },
    10: {
        name: "Treasure",
        class: "Article",
        path: "item/article"
    },
    16: {
        name: "Lucky Draw Ticket",
        class: "Raffleticket",
        path: "item/ticket"
    },
    17: {
        name: "Power-up",
        class: "Evolution",
        path: "item/evolution"
    },
    19: {
        name: "CP",
        class: "JobPoint",
        path: "item/normal",
        specialId: {0: "jp"}
    },
    22: {
        name: "Token",
        class: "Tickets",
        path: "item/ticket",
        manual: true
    },
    23: {
        name: "Pick Ticket",
        class: "Exchangeticket",
        path: "item/campaign"
    },
    25: {
        name: "Event Item",
        class: "Event\\Temporary",
        path: "item/event/temporary"
    },
    26: {
        name: "ROTB Xuanwu Badges",
        class: "ROTB",
        path: "item/event/defeat/copper",
        manual: true
    },
    27: {
        name: "ROTB Qinglong Badges",
        class: "ROTB",
        path: "item/event/defeat/silver",
        manual: true
    },
    28: {
        name: "ROTB Baihu Badges",
        class: "ROTB",
        path: "item/event/defeat/gold",
        manual: true
    },
    31: {
        name: "Casino Chip",
        class: "Medal",
        path: "item/normal",
        specialId: {0: "casino_medal"}
    },
    32: {
        name: "Origin Crystal",
        class: "RawStone",
        path: "item/normal"
    },
    34: {
        name: "Event Pick Ticket",
        class: "Eventexchangeticket",
        path: "item/campaign"
    },
    37: {
        name: "Weapon",
        class: "Additionalweapon",
        path: "weapon"
    },
    38: {
        name: "Summon",
        class: "Additionalsummon",
        path: "summon"
    },
    39: {
        name: "Character",
        class: "Additionalnpc",
        path: "npc"
    },
    40: {
        name: "EMP",
        class: "Limitpoint",
        path: "item/normal"
    },
    41: {
        name: "Gem",
        class: "Gem",
        path: "item/normal"
    },
    43: {
        name: "Miscellaneous",
        class: "Specialitem",
        path: "item/specialitem"
    },
    49: {
        name: "ROTB pendants",
        class: "ROTB",
        path: "item/event/article",
        manual: true,
        convert(item) {
            item.count = item.count * parseInt(item.id);
            item.type = 10;
            item.id = 90001;
            item.name = "Four Symbols Pendant";
        }
    },
    50: {
        name: "Class Outfit",
        class: "Job\\Skin",
        path: "leader"
    },
    55: {
        name: "Sweepstake",
        class: "Lottery",
        path: "item/lottery"
    },
    58: {
        name: "Defense Item",
        class: "Defendorder",
        path: "item/defendorder"
    },
    59: {
        name: "Siege Shield",
        class: "Defendorderpoint",
        path: "item/article"
    },
    62: {
        name: "Sticker",
        class: "Stamp",
        path: "item/stamp"
    },
    63: {
        name: "ROTB Zhuque Badges",
        class: "ROTB",
        path: "item/event/defeat/platinum",
        manual: true
    },
    65: {
        name: "Arcarum Items",
        class: "Arcarum",
        path: "item/arcarum",
        prefix: "item_"
        // specialId: {
        //     1002: "item_1002" // 1000 pts from event shop
        // }
    },
    67: {
        name: "Gauph Keys",
        class: "Keys",
        path: "item/skillplus",
        manual: true
    },
    73: {
        name: "Rings",
        class: "Npcaugment",
        path: "item/npcaugment"
    },
    75: {
        name: "Recycling",
        class: "Recycling",
        path: "item/recycling"
    },
    82: {
        name: "Badges",
        path: "item/event/newdefeat",
        manual: true,
        specialId: {
            rename(id) {
                id = id.toString().slice(-2, -1);
                if (id === "0") {
                    return "gold";
                }
                else if (id == "1") {
                    return "silver";
                }
                else {
                    return false;
                }
            },
            304401: "gold"
        },
        size: "m/"
    }
};
// list of item id -> quest id, quest name for farming. TODO: add IDs also move these 2 consts to own file.
const TREASURE_SOURCES = {
    2: {id: -1, name: "Scattered Cargo (1/115)"},
    3: {id: -1, name: "Scattered Cargo (1/115)"},
    5: {id: -1, name: "Special Op's Request (8) or Lucky Charm Hunt (6)"},
    6: {id: -1, name: "Threat to the Fisheries (9)"},
    8: {id: -1, name: "Whiff of Danger (13/39/52) or The Fruit of Lumacie (13/39/52)"},
    17: {id: -1, name: "Whiff of Danger (13/39/52) or The Fruit of Lumacie (13/39/52)"},
    22: {id: -1, name: "What's in the Box? (20) or I Challenge You! (17, use Belle Sylphid)"},
    24: {id: -1, name: "Strength and Chivalry (18) or What's in the Box? (20)"},
    28: {id: -1, name: "Playing Cat and Mouse (22) or For Whom the Bell Tolls (22)"},
    29: {id: -1, name: "Playing Cat and Mouse (22) or For Whom the Bell Tolls (22)"},
    39: {id: -1, name: "Miscongeniality (32/41) or New Leaf (30/44/65) or The Dungeon Diet (30/44/65)"},
    40: {id: -1, name: "Miscongeniality (32/41) or New Leaf (30/44/65) or The Dungeon Diet (30/44/65)"}
};

function SupplyItem(type = SUPPLYTYPE.treasure, id = 0, count = 0, name = undefined, uniqueId = undefined) {
    this.type = parseInt(type);
    this.id = id = id === "" ? 0 : parseInt(id);
    this.count = parseInt(count);
    if (Number.isNaN(this.type) || Number.isNaN(this.id) || Number.isNaN(this.count)) {
        deverror("Given: ", type, id, count);
        throw new TypeError("[SupplyItem] Type, id, or count does not resolve to number.");
    }
    let data = ITEM_KIND[type];
    if (data) {
        this.typeName = data.name;
        let fname = id;
        if (data.specialId) {
            if (data.specialId.rename) { // try dynamic rename
                fname = data.specialId.rename(id) || id;
            }
            if (fname == id && data.specialId[id]) { // fall back to static or leave unchanged
                fname = data.specialId[id];
            }
        }
        if (fname === 0) { // id 0 and not a special id
            devwarn("Invalid item, removing from data: ", this);
            delete Supplies.index[type][id];
            Supplies.save();
            return {invalid: true};
        }
        else if (!fname) { // don't want any undefined.jpg in their server logs lmao
            devwarn("[SupplyItem] Invalid path, nuking: ", fname, this);
            this.path = "";
        }
        else {
            this.path = `${GAME_URL.baseGame}${GAME_URL.assets}${data.path}/${data.hasOwnProperty("size") ? data.size : GAME_URL.size.small}${data.prefix || ""}${fname}${data.suffix || ""}.jpg`;
        }
        // Redirect some special cases to be more user-friendly.
        if (data.convert) {
            devlog("Converting item: ", this);
            data.convert(this);
            devlog("Converted item: ", this);
        }
    }
    else {
        this.typeName = "Unknown";
    }

    // name can already be set when converted
    this.name = this.name || name || (Supplies.has(type, id) ? Supplies.index[type][id].name : "Unknown");
    if (uniqueId) { this.uniqueId = uniqueId }

    for (let t in SUPPLYTYPE) {
        if (Array.isArray(SUPPLYTYPE[t]) && SUPPLYTYPE[t].includes(this.type)) {
            this.metaType = t;
            break;
        }
    }

    if (type == SUPPLYTYPE.treasure && TREASURE_SOURCES[id]) {
        this.location = TREASURE_SOURCES[id].name;
    }
    this.track = !SUPPLYTYPE.Untracked.includes(this.type);
}
// TODO: For weapon planner we need items we may not have yet. So gotta init a basic array from a datastore.
window.Supplies = {
    index: {},
    has(type, id) {
        return this.index[type] && this.index[type][id];
    },
    find(name, type) {
        let list = type ? this.getType(type) : this.getAll();
        return list.find(x => x.name.match(name));
    },
    /** Look up information on a specific supply item or list of items.
    @arg {(number|{type: number, id: number}[])} type - The {@link ITEM_KIND} to look up, or a list of items with type and id set.
    @arg {number} id - The id to look up.
    @returns {(SupplyItem|SupplyItem[])} The SupplyItem or array of SupplyItems if found, undefined otherwise.
    */
    get: function(type, id) {
        if (Array.isArray(arguments[0])) {
            let ret = [];
            for (let entry of arguments[0]) {
                let item = this.get(entry.type, entry.id);
                if (item) {
                    ret.push(item);
                }
            }
            return ret;
        }
        else {
            if (!this.index[type]) {
                devwarn("[Supplies] No such type: " + type);
                return;
            }

            let item = this.index[type][id];
            if (item) {
                item = new SupplyItem(type, id, item.count, item.name);
                if (!item.invalid) { // is instanceof faster? somehow doubt it
                    return item;
                }
            }
        }
    },
    /** Set or create information on a specific supply item or list of items.
    @arg {(SupplyItem|SupplyItem[])} data - The {@link SupplyItem} to add, or an array of them.
    */
    set: function(data) {
        if (Array.isArray(data)) {
            for (let entry of data) {
                this.set(entry);
            }
        }
        else {
            if (data.track) { // if invalid, that's the only prop so this is undef
                if (!this.index.hasOwnProperty(data.type)) {
                    this.index[data.type] = {};
                    devlog("Created new type index: " + data.type);
                }
                this.index[data.type][data.id] = {
                    name: data.name,
                    count: data.count
                };
            }
        }
    },
    /** Gets the list of items belonging to a specific {@link ITEM_KIND}.
    @arg {number} type
    @returns {SupplyItem[]}
    */
    getType: function(type) {
        let ret = [];
        if (Array.isArray(type)) {
            for (let t of type) {
                ret = ret.concat(this.getType(t) || []);
            }
        }
        else {
            if (SUPPLYTYPE.Untracked.includes(parseInt(type))) { return } // TODO: temp quiet currently awkward data
            for (let id in this.index[type]) {
                let item = this.get(type, id);
                if (item) {
                    ret.push(item);
                }
            }
        }
        return ret;
    },
    getAll() {
        return this.getType(Object.keys(this.index));
    },
    /** Set the full treasure index, for use with game's supplies page.*/
    setTreasure: function(json) {
        if (!json) { return }

        let upd = [];
        for (let item of json) {
            upd.push( new SupplyItem(SUPPLYTYPE.treasure, item.item_id, parseInt(item.number), item.name));
        }

        State.haveInit("treasure");
        this.update(upd, true);
    },
    /** Set the full consumables index, for use with game's supplies page.*/
    setConsumables: function(json) {
        if (!json) { return }

        let data = {},
            upd = [];
        data[SUPPLYTYPE.recovery] = json[0]; // AP/EP
        data[SUPPLYTYPE.evolution] = json[1]; // Bars, etc
        data[SUPPLYTYPE.skill] = json[2]; // Atma keys
        data[SUPPLYTYPE.augment] = json[3]; // Rings
        data[SUPPLYTYPE.vessels] = json[4]; // EXP vessels

        /** Parses list into index
        @arg {Object[]} list
        @arg {Object} idx
        */
        function parse(list, type) {
            for (let item of list) {
                if (Array.isArray(item)) {
                    parse(item, type);
                }
                else {
                    upd.push(new SupplyItem(type, item.item_id, parseInt(item.number), item.name));
                }
            }
        }

        for (let type in data) {
            parse(data[type], type);
        }

        State.haveInit("consumables");
        this.update(upd, true);
    },
    setTickets(json) {
        if (json) {
            let upd = [];
            for (let arr of json) {
                for (let item of arr) {
                    upd.push( new SupplyItem(SUPPLYTYPE.drawTickets, item.item_id, item.number, item.name) );
                }
            }
            State.haveInit("tickets");
            this.update(upd, true);
        }
    },
    /** Updates supply item data, adding if new. Used for incremental updates, use set() otherwise.
    @arg {(SupplyItem|SupplyItem[])} updArr - Array of items to update. Uses count prop as delta.
    @arg {boolean} overwrite - Overwrites the item info instead of updating.
    **/
    update: function(updArr, overwrite) {
        let currenciesUpdated = false;
        if (!Array.isArray(updArr)) { updArr = [updArr] }

        updArr = updArr.filter(item => item.track);
        for (let item of updArr) {
            let typeData = ITEM_KIND[item.type];
            if (!typeData || typeData.manual) {
                devwarn("Uncertain item type, errors may occur.", item);
            }

            if (overwrite) {
                this.set(item);
            }
            else {
                if (this.index[item.type] && this.index[item.type][item.id]) { // Update
                    item.delta = item.count; // Save change
                    item.count = this.index[item.type][item.id].count += item.delta;
                }
                else { // Add new
                    this.set(item);
                }
                // fireEvent(EVENTS.updatedSupplyItem, item);
            }

            if (item.metaType == "Currencies") {
                currenciesUpdated = true;
            }
        }

        this.save();
        fireEvent(EVENTS.suppliesUpdated, updArr);
        if (currenciesUpdated) { updateUI("updCurrencies", Profile.currencies) }
        updateUI("updSupplies", updArr);
    },
    save: function() {
        Storage.set({sup_idx: this.index});
        devlog("Supply index saved.");
    },
    load: function() { // Called out of context
        return new Promise((r, x) => {
            function _load(data) {
                if (data.sup_idx) {
                    Supplies.index = data.sup_idx;

                    console.info("Supply index loaded.");
                }
                else {
                    // TODO: Load basic store or consider xhr
                    printWarn("Supply index not found, some functionality will be dodgy until you visit game supplies page and reload Veera.");
                }
                r();
            }
            try {
                Storage.get("sup_idx", _load);
            }
            catch (e) {
                deverror(e);
                x("Failed to load supplies.");
            }
        });
    },
    clear: function() {
        this.index = {};
    }
};

function gotQuestLoot(json) {
    let upd = [],
        loot;
    function addUpdItem(entry, chestType) {
        let type = entry.item_kind || entry.kind,
            id = entry.id || entry.item_id,
            count = entry.count || entry.num || entry.item_num || entry.amount,
            name = entry.name || entry.item_name;

        let item = new SupplyItem(type, id, count, name);
        if (entry.item_image) {
            item.path = item.path.replace(/\/\d+\./, `/${entry.item_image}.`);
        }
        if (entry.rarity) {
            item.rarity = parseInt(entry.rarity);
            if (State.settings.notifyWeaponDrop && item.rarity > 3 && (item.type == 1 || item.type == 37)) {
                showNotif("SSR Weapon drop!", {text: item.name, img: item.path});
            }
        }
        if (State.settings.colorCodeDrops && chestType) {
            item.chestType = chestType;
        }

        upd.push(item);
        return item;
    }

    if (json) {
        // Arcarum pts;
        if (json.arcarum_info) {
            Profile.updArca(0, json.arcarum_info.point);
        }
        // Event rewards
        if (json.popup_data) {
            if (json.popup_data.daily_mission && json.popup_data.daily_mission.is_complete) {
                loot = json.popup_data.daily_mission.item_list;
                if (loot.length) {
                    for (let item of loot) {
                        addUpdItem(item);
                    }
                    devlog(`[Loot] Got ${loot.length} items from event mission reward.`);
                    fireEvent(EVENTS.evMissionDone, upd);
                }
            }
            // Stage clear rewards
            if (json.popup_data.clear_reward && json.popup_data.clear_reward.item.id) {
                let item = json.popup_data.clear_reward.item;
                let sd = Supplies.find(item.name);
                if (sd) {
                    upd.push(new SupplyItem(sd.type, sd.id, item.amount, item.name));
                }
            }
        }
        // Drops
        if (json.rewards) {
            // Non-chest, side-scrolling
            loot = json.rewards.article_list;
            if (loot.length == undefined) { // It's an array when empty apparently...
                let content = Object.keys(loot);
                for (let key of content) {
                    let entry = loot[key];
                    addUpdItem(entry);
                }
                devlog(`[Loot] Got ${content.length} items from side-scroll.`);
            }

            // Chest drops
            loot = json.rewards.reward_list;
            if (loot.length == undefined) { // An object when not
                let numItems = 0;
                for (let chestType of Object.keys(loot)) {
                    let chest = loot[chestType];
                    // BOXTYPES? 1: bronze, 2: silver, 3: gold, 4: red, 11: blue. rarity >= 4: flip
                    for (let item of Object.keys(chest)) {
                        addUpdItem(chest[item], chestType);
                        numItems++;
                    }
                }
                devlog(`[Loot] Got ${numItems} items from chests.`);
            }
        }
        // Arcarum chests
        else if (json.result) {
            loot = json.result.contents;
            if (loot) { // Is actually an array or undef/missing.
                for (let item of loot) {
                    let si = addUpdItem(item);
                    si.chestType = json.result.chest_type;
                    si.chestColor = json.result.chest_color;
                }
                devlog(`[Loot] Got ${loot.length} items from arcarum chest.`);
            }
        }
        // Special event loot (PG so far)
        else if (json.data) {
            let dom = parseDom(json.data);
            loot = dom.getElementById("json-reward-list");
            if (loot) { loot = JSON.parse(loot.textContent) }
            if (loot.length) {
                for (let item of loot) {
                    addUpdItem(item);
                }
                devlog(`[Loot] Got ${loot.length} items from sortie completion.`);
            }
        }
        if (upd.length > 0) {
            fireEvent(EVENTS.gotLoot, upd);
            Supplies.update(upd);
        }
        DevTools.send("updRaidLoot", {loot: upd});
    }
}

function startAcra(json) {
    Profile.setArca({
        tickets: parseInt(json.passport_num),
        points: parseInt(json.point)
    });
}
function skipArca(data) {
    let upd = [];
    for (let item of data.reward_list) {
        upd.push(new SupplyItem(item.item_kind, item.item_id, item.item_num));
    }

    if (data.point_info && data.point_info.reward_point) {
        Profile.updArca(0, data.point_info.reward_point);
    }
    fireEvent(EVENTS.gotLoot, upd);
    Supplies.update(upd);
}

function purchaseItem(data) {
    let json = data.json,
        upd = [],
        item; // Supply update func expects array.
    // Only ever buy 1 (type of) item at once... I think?
    if (json.article.item_ids) {
        // The item we get.
        let nBought = parseInt(json.purchase_number) || parseInt(data.postData.num);
        item = new SupplyItem(json.article.item_kind[0], json.article.item_ids[0], nBought, json.article.name_en);
        upd.push(item);
        fireEvent(EVENTS.shopPurchase, item);

        let nReq = json.article.use_coin_number; // Casino
        if (nReq) {
            item = new SupplyItem(31, 0, - (parseInt(nReq) * nBought));
            upd.push(item);
        }
        else { // Normal shops
            // The items we trade in. Max 4, 1-indexed
            for (let i = 1; i < 5; i++) {
                let ingr = json.article["article" + i];
                if (ingr) {
                    nReq = parseInt(json.article["article" + i + "_number"]);
                    item = new SupplyItem(ingr.master.item_kind, ingr.master.id, -(nReq * nBought), ingr.master.name_en);
                    upd.push (item);
                }
                else { break } // assuming ordered list
            }
        }

        // fireEvent(EVENTS.shopPurchase, upd);
        Supplies.update(upd);
    }
}

function cratePickup(data) { // single item pick up TODO: check multi
    let upd = [];
    function parse(entry) {
        let si = new SupplyItem(entry.item_kind_id, entry.regular_id || entry.item_id, entry.number, entry.item_name);
        if (entry.regular_id) { si.uniqueId = entry.item_id }
        upd.push(si);
    }

    if (Array.isArray(data.presents)) { // Pickup all
        for (let item of data.presents) {
            parse(item);
        }
    }
    else { // pickup single
        parse(data.presents);
    }

    Supplies.update(upd);
}
function rewardsPickup(json) {
    let upd = [],
        si, id, name,
        loot = json.reward || json.common.reward;
    for (let key in loot) { // Sometimes obj, sometimes array... this works on both.
        let item = loot[key];
        name = item.item || item.item_name;
        let check = key.lastIndexOf("_");
        if (check != -1) {
            id = key.slice(check + 1);
        }
        else {
            id = item.item_id;
            if (!id) {
                let data = Supplies.find(name, item.item_kind);
                if (data) {
                    id = data.id;
                }
                else {
                    devlog("Picked up an unrecognized item.");
                    continue;
                }
            }
        }
        si = new SupplyItem(item.item_kind, id, item.number, name);
        upd.push(si);
    }

    Supplies.update(upd);
}

function reduce(data) {
    if (data && data.articles) {
        let upd = [];
        for (let item of data.articles) {
            let si = new SupplyItem(item.item_kind_id, item.item_id, item.item_number + item.bonus_number, item.item_name);
            upd.push(si);
        }
        upd.push( new SupplyItem(SUPPLYTYPE.rupie, 0, - parseInt(data.requirement_money), "Rupie") );

        Supplies.update(upd);
    }
}

function storePendingRaidsTreasure(data) {
    let store = {items: []};

    // normal raids
    if (data.quest_id) {
        for (let i = 0; i < data.treasure_id.length; i++) {
            store.id = data.quest_id;
            if (data.action_point) { store.ap = - parseInt(data.action_point) }
            store.items.push( new SupplyItem(data.treasure_kind[i], data.treasure_id[i], - parseInt(data.consume[i]), data.treasure_name) );
        }
    }
    // event raids
    else if (data.option) {
        data = parseDom(data.option.quest.list);
        let list = data.querySelectorAll("[id*=raid]");

        for (let entry of list) {
            entry = parseDom(entry.innerHTML, {decode: false});
            let itemNum = entry.querySelector(".consume .txt-article-num"),
                questData = entry.querySelector("[data-treasure-id]");
            if (itemNum && questData && questData.dataset.treasureId) {
                store.id = questData.dataset.questId;
                store.items.push( new SupplyItem(SUPPLYTYPE.treasure, questData.dataset.treasureId, - parseInt(itemNum.textContent)) );
            }
        }
    }

    Supplies.pendingRaidHost = store;
}

function consumePendingRaidsTreasure(data) {
    if (Supplies.pendingRaidHost && Supplies.pendingRaidHost.id == data.postData.quest_id) {
        let consumedItems;
        if (Array.isArray(data.postData.use_item_id)) { // This is an assumption. I don't want to host Luci just to check rn.
            consumedItems = Supplies.pendingRaidHost.items.filter(item => data.postData.use_item_id.includes(item.id));
        }
        else {
            consumedItems = Supplies.pendingRaidHost.items.filter(item => item.id == data.postData.use_item_id);
        }
        Supplies.update(consumedItems);
        delete Supplies.pendingRaidHost;
    }
}

function weaponUncapStart(data) {
    var update = {
        id: data.url.pathname.match(/materials\/(\d+)/)[1],
        items: []
    };

    for (let key of Object.keys(data.json)) {
        if (key == "options") { continue }

        let item = data.json[key],
            si;
        si = new SupplyItem(item.item_kind, item.item_id, - parseInt(item.item_number));
        update.items.push(si);
    }

    Supplies.pendingUncap = update;
}

function npcUncapStart(data) {
    var update = {
        id: data.url.pathname.match(/materials\/(\d+)/)[1],
        items: []
    };

    for (let item of data.json.requirements) {
        let si = new SupplyItem(item.item_kind.id, item.item_id, - parseInt(item.item_number));
        update.items.push(si);
    }

    Supplies.pendingUncap = update;
}

function uncapEnd(json) {
    if (Supplies.pendingUncap && Supplies.pendingUncap.id == json.new.id) {
        Supplies.update(Supplies.pendingUncap.items);
        delete Supplies.pendingUncap;
    }
}

function storePendingJobUnlock(data) {
    let items = [],
        si;
    for (let item of data.json.job.use_item) {
        si = new SupplyItem(item.article_kind || SUPPLYTYPE.treasure, item.master.id, - parseInt(item.use_item_number), item.master.name_en);
        items.push(si);
    }

    Supplies.pendingJob = {
        id: data.master.id,
        cp: parseInt(data.job.use_job_point),
        items
    };
}

function consumePendingJobUnlock(data) {
    if (Supplies.pendingJob && data.json.success && data.postData.job_id == Supplies.pendingJob.id) {
        Supplies.update(Supplies.pendingJob.items);
        delete Supplies.pendingJob;
    }
}

function storePendingForgeCCW(data) {
    Supplies.pendingForge = {
        newWeapId: data.weapon_new.weapon_id,
        items: []
    };
    for (let item of data.list) {
        let si = new SupplyItem(item.kind, item.id, - parseInt(item.article_num), item.item_name);
        Supplies.pendingForge.items.push(si);
    }
}
function consumePendingForgeCCW(data) {
    if (Supplies.pendingForge && (data.new_weapon || data.get_weapon) == Supplies.pendingForge.newWeapId) {
        Supplies.update(Supplies.pendingForge.items);
        delete Supplies.pendingForge;
    }
}

// Events. Temp I guess

function setRotbPendants(json) {
    let dom = parseDom(json.data),
        pts;
    if (dom.getElementById("title").value == "Rise of the Beasts") {
        pts = dom.querySelector("#cnt-event .prt-point");
        if (pts) {
            pts = parseInt(pts.textContent.slice(0, pts.textContent.indexOf("/")));
        }
    }
    Supplies.update(new SupplyItem(SUPPLYTYPE.treasure, 90001, pts, "Four Symbols Pendant"), true);
}
