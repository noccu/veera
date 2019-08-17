const BATTLE_ACTION_TYPES = {
    dmgDealt: 1,
    dmgTaken: 2,
    heal: 3
};
const BATTLE_ACTIONS = {
    attack: {name: "Attack"},
    skill: {name: "Skill"},
    triggerSkill: {name: "Triggered skill"},
    // postAtkTrigger: {name: "Post-attack skill trigger"},
    ougi: {name: "Ougi"},
    ougiEcho: {name: "Ougi echo"},
    effect: {name: "Effect (Reflect, DoT, ...)"},
    healFffect: {name: "Heal effect (Refresh, Revitalize, ...)"},
    counter: {name: "Counter"},
    chain: {name: "Chain burst"},
    bossAtk: {name: "Boss attack"},
    bossOugi: {name: "Boss ougi"},
    bossSkill: {name: "Boss skill"}
}; // As objects for faster/easier(??) comparison while keeping a name string.

function BattleData(id, name, turn, chars, bosses) {
    this.turn = turn;
    this.id = id;
    this.name = name;
    this.log = [];
    this.startTime = Date.now();

    this.stats = {
        // TODO: This SHOULD be optimized like Object.create(), hopefully...
        __proto__: battleStatsShared, // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Prototype_mutation
        highestDmg: 0,
        totalHits: 0,
        totalCrits: 0,
        totalDa: 0,
        totalTa: 0,
        totalDmg: 0
    };
    Object.defineProperty(this.stats, "instance", {
        enumerable: false,
        writable: false,
        value: this
    });
    this.characters = {
        __proto__: unitsShared,
        current: [0, 1, 2, 3], // pos = id
        list: [],
        swap: function(pos, id) {
            this.current[pos] = id;
        }
    };

    this.bosses = {
        __proto__: unitsShared,
        list: [],
        current: [0, 1, 2]
    };
    // Init chars
    chars.forEach((entry, idx) => this.characters.list[idx] = new BattleUnitData(this, idx, entry.name));
    bosses.forEach((entry, idx) => {
        let boss = new BattleUnitData(this, idx, entry.name.en);
        boss.currentHp = entry.hp;
        boss.maxHp = entry.hpmax;
        boss.isBoss = true;
        // boss.charge = parseInt(entry.recast);
        // boss.chargeMax = parseInt(entry.recastmax);
        this.bosses.list.push(boss);
    });
}
Object.defineProperties(BattleData.prototype, {
    addTurn: {
        value: function(jsonTurn) {
            devlog("Start turn ", jsonTurn);
            this.turn = jsonTurn;
            this.log.push(new BattleTurnData(jsonTurn));
            return this.log.last;

        }
    },
    getTotalDamage: {// don't think this is actually used, in favour of stats.totalDmg
        enumerable: false,
        value: function(pos) {
            let total = 0;
            for (let turn of this.log) {
                total += turn.getTotalDmg(pos);
            }
            return total;
        }
    },
    currentTurn: {
        get() {
            return this.getTurn(this.turn);
        }
    },
    getTurn: {
        value: function(turn) {
            if (turn == this.log.last.turn) { // shortcut
                return this.log.last;
            }
            else {
                return this.log.find(t => t.turn == turn) || this.addTurn(turn);
            }
        }
    },
    activeTurns: {
        get() {
            return this.log.length || 1;
            // return this.log.reduce(x => x + 1, 0);
        }
    }
});
// Computed stat functions, used as prototype for battle stats.
const battleStatsShared = {
    get autoTurns() {
        let n = 0;
        for (let char of this.instance.characters.list) {
            if (char.activeTurns) {
                n += (char.activeTurns - char.stats.ougis);
            }
        }
        return n;
    },
    get turnDmg() {
        return this.instance.currentTurn.getTotalDmg();
    },
    get turnCritRate() {
        return this.instance.currentTurn.getCritRate();
    },
    get totalHonor() {
        let total = 0;
        for (let turn of this.instance.log) {
            total += turn.honor;
        }
        return total;
    },
    get avgCritRate() {
        return safeDivide(this.totalCrits, this.totalHits) * 100;
    },
    get avgTurnHonor() {
        return Math.floor(this.totalHonor / this.instance.activeTurns);
    },
    get avgTurnDmg() {
        return Math.floor(this.totalDmg / this.instance.activeTurns);
    },
    get avgDaRate() {
        return safeDivide(this.totalDa, this.autoTurns) * 100;
    },
    get avgTaRate() {
        return safeDivide(this.totalTa, this.autoTurns) * 100;
    },
    get dps() {
        return safeDivide(this.totalDmg / (((this.instance.endTime || Date.now()) - this.instance.startTime) / 1000)) | 0; // float -> int
    },
    get ownDmgRatio() {
        return this.totalDmg / this.instance.bosses.list.reduce((acc, boss) => acc += boss.maxHp, 0) * 100;
    }

};
Object.defineProperty(battleStatsShared, "toJSON", {
    enumerable: false, // should be default, but just to be explicit
    value: prepJson
});
const unitsShared = {
    get active() {
        let n = 0;
        this.list.forEach(function(entry) {
            if (entry.activeTurns) {
                n++;
            }
        });
        return n;
    },
    getAtPos: function(pos) {
        return this.list[this.current[pos]];
    },
    getById: function(id) {
        return this.list[id];
    }
};

window.Battle = {
    MAX_STORED: 30,
    archive: new Map(),
    get current() {
        if (this._currentId) {
            return this.archive.get(this._currentId);
        }
        else {
            return undefined;
        }
    },
    set current(id) {
        this._currentId = id;
    },
    packageData: function(target) {
        if (!target) { target = this.current }
        // let data = JSON.parse(JSON.stringify(target));

        // for (let stat in target.stats) {
        //     data.stats[stat] = target.stats[stat];
        // }
        // // JSON doesn't iterate over prototypes.
        // for (let char of Object.keys(target.characters.list)) {
        //     for (let stat in target.characters.list[char].stats) {
        //         data.characters.list[char].stats[stat] = target.characters.list[char].stats[stat];
        //     }
        // }
        // return data;
        return JSON.parse(JSON.stringify(target));
    },
    reset(json) { // Called on every battle entry (incl refresh)
        if (json) {
            let id, name;
            if (json.multi) {
                id = json.twitter.battle_id;
                name = json.twitter.monster;
            }
            else {
                // raid id changes between stages
                // also need string for archive selection (select->option returns strings)
                id = (json.battle && json.battle.total > 1) ? json.quest_id : json.raid_id.toString();
                name = Raids.lastHost.name || json.boss.param[0].monster;
            }
            let logged = this.archive.has(id);
            this.current = id;
            // Unlogged raid, or new host/join of logged raid
            if (!logged || logged && json.turn < this.archive.get(id).turn) {
                this.archive.set(id, new BattleData(id, name, json.turn, json.player.param, json.boss.param));

                // Limit number of archived raids. TODO: find better way cause this sux
                if (this.archive.size > this.MAX_STORED) {
                    this.archive.delete(this.archive.keys().next().value);
                }

                fireEvent(EVENTS.newBattle);
                updateUI("updBattleNewRaid", this.packageData());
                let archList = [];
                for (let v of this.archive.values()) {
                    let b = {val: v.id, name: v.name};
                    if (v.id == id) { b.current = true }
                    archList.push(b);
                }
                // Array.from(Battle.archive.values()).map(cur => { return {id: cur.id, name: cur.name} });
                updateUI("updBattleArchive", archList);
            }
            else {
                json.boss.param.forEach((entry, idx) => {
                    this.current.bosses.getById(idx).currentHp = entry.hp;
                });
                updateUI("updBattleData", Battle.packageData());
            }
            this.current.raidId = json.raid_id;
        }
    },
    load(id) {
        // TODO: This is very inefficient but requires big changes to improve.
        let archivedBattle = this.archive.get(id),
            lastTurn = archivedBattle.turn;
        let fullArch = [];
        for (let turnData of archivedBattle.log) {
            archivedBattle.turn = turnData.turn;
            fullArch.push(this.packageData(archivedBattle));
        }
        archivedBattle.turn = lastTurn;

        return fullArch;
    },
    checkResultScreen(data) {
        let match = data.url.pathname.match(/data\/(\d+)/);
        if (match) {
            for (let battle of this.archive.values()) {
                if (battle.raidId == match[1]) {
                    this.endBattle(battle);
                    return;
                }
            }
        }
    },
    endBattle(battle) {
        if (!battle.endTime) {
            battle.endTime = Date.now();
        }
    }
};
document.addEventListener(EVENTS.battleOver, ev => Battle.endBattle(ev.detail));
document.addEventListener(EVENTS.playerDeath, ev => Battle.endBattle(ev.detail));

function safeDivide(a, b) {
    return a / (b || 1);
}

function BattleActionData(action) {
    this.action = action;
    this.char = -1;// not every action has a chara assigned! TODO: why not just point to the unit object?
    this.isBoss = false;
    this.dmg = 0;
    this.hits = 0;
    this.echoDmg = 0;
    this.echoHits = 0;
    this.skillDmg = 0;
    this.ougiDmg = 0;
    this.crits = 0;
    this.critDmg = 0;
    this.misses = 0;
    this.honor = 0;
    this.dmgTaken = {};
    this.selfHealing = 0;
    this.teamHealing = 0;
}
Object.defineProperties(BattleActionData.prototype, {
    totalDmg: {
        get() {
            return this.dmg + this.echoDmg + this.skillDmg + this.ougiDmg;
        }
    },
    totalHits: {
        get() {
            return this.hits + this.echoHits;
        }
    }
});

function BattleTurnData(turn) {
    this.actions = [];
    this.honor = 0;
    this.turn = turn;
}

Object.defineProperties(BattleTurnData.prototype, {
    getTotalHits: {
        value: function(char, isBoss = false) {
            let total = 0;
            for (let action of this.actions) {
                if (action.isBoss == isBoss && (char === undefined || action.char == char)) {
                    total += action.totalHits;
                }
            }
            return total;
        }
    },
    getTotalDmg: {
        value: function(char, isBoss = false) {
            let total = 0;
            for (let action of this.actions) {
                if (action.isBoss == isBoss && (char === undefined || action.char == char)) {
                    total += action.totalDmg;
                }
            }
            return total;
        }
    },
    getDmg: {
        value: function(char, isBoss = false) {
            let total = 0;
            for (let action of this.actions) {
                if (action.isBoss == isBoss && (char === undefined || action.char == char)) {
                    total += action.dmg;
                }
            }
            return total;
        }
    },
    getEchoDmg: {
        value: function(char, isBoss = false) {
            let total = 0;
            for (let action of this.actions) {
                if (action.isBoss == isBoss && (char === undefined || action.char == char)) {
                    total += action.echoDmg;
                }
            }
            return total;
        }
    },
    getCritRate: {
        value: function(char, isBoss = false) {
            let crits = 0;
            for (let action of this.actions) {
                if (action.isBoss == isBoss && (char === undefined || action.char == char)) {
                    crits += action.crits;
                }
            }
            return safeDivide(crits, this.getTotalHits(char)) * 100;
        }
    },
    getCritDmg: {
        value: function(char, isBoss = false) {
            let total = 0;
            for (let action of this.actions) {
                if (action.isBoss == isBoss && (char === undefined || action.char == char)) {
                    total += action.critDmg;
                }
            }
            return total;
        }
    },
    getDamageTaken: {
        value: function(char) {
            let dmg = 0;
            for (let action of this.actions) {
                for (let charHit in action.dmgTaken) {
                    if (char === undefined || charHit == char) {
                        dmg += action.dmgTaken[charHit];
                    }
                }
            }
            return dmg;
        }
    }
});

function BattleUnitData(battle, id, name = "") {
    this.char = id;
    this.name = name;
    this.activeTurns = 0;
    this.currentHp = 0;
    this.maxHp = 0;
    this.isBoss = false;
    this.currentTurnOugi = {triggered: false};

    this.stats = {
        __proto__: battleUnitStatsShared,
        dmg: 0,
        hits: 0,
        echoDmg: 0,
        echoHits: 0,
        skillDmg: 0,
        skillDetails: {},
        ougiDmg: 0,
        crits: 0,
        da: 0,
        ta: 0,
        ougis: 0,
        dmgTaken: 0,
        selfHealing: 0,
        teamHealing: 0
    };
    Object.defineProperty(this.stats, "instance", {
        enumerable: false,
        writable: false,
        value: this
    });
    Object.defineProperty(this, "battleInstance", {
        enumerable: false,
        writable: false,
        value: battle
    });
}

Object.defineProperties(BattleUnitData.prototype, {
    toJSON: {
        enumerable: false,
        value: prepJson
    },
    hpToNextPerc: {
        enumerable: true,
        get() {
            let percInHp = (this.maxHp / 100 * 5);
            // -1 in case current hp is an exact multiple of 5% (like start of battle), show hp to next 5% rather than 0 in such cases.
            // I figured I add 1 again but that doesn't behave right and it works perfectly like this, so... Someone teach me maths.
            // Must be cause of the floor() in a subtrahend.
            return this.currentHp - Math.floor(Math.floor((this.currentHp - 1) / percInHp) * percInHp);
        }
    },
    ownDmgRatio: {
        enumerable: true,
        get() {
            return this.battleInstance.stats.totalDmg / this.maxHp * 100;
        }
    }
});

const battleUnitStatsShared = {
    get critRate() {
        return safeDivide(this.crits, this.totalHits) * 100;
    },
    get autoTurns() {
        return this.instance.activeTurns - this.ougis;
    },
    get daRate() {
        return safeDivide(this.da, this.autoTurns) * 100;
    },
    get taRate() {
        return safeDivide(this.ta, this.autoTurns) * 100;
    },
    get ougiRate() {
        return safeDivide(this.ougis, this.instance.activeTurns) * 100;
    },
    get totalDmg() {
        return this.dmg + this.echoDmg + this.skillDmg + this.ougiDmg;
    },
    get skillDmgPerc() {
        return safeDivide(this.skillDmg, this.totalDmg) * 100;
    },
    get echoDmgPerc() {
        return safeDivide(this.echoDmg, this.totalDmg) * 100;
    },
    get ougiDmgPerc() {
        return safeDivide(this.ougiDmg, this.totalDmg) * 100;
    },
    get totalHits() {
        return this.hits + this.echoHits;
    },
    get avgDmg() {
        return Math.floor(safeDivide(this.totalDmg, this.instance.activeTurns));
    },
    get turnDmg() {
        return this.instance.battleInstance.currentTurn.getTotalDmg(this.instance.char, this.instance.isBoss);
    },
    get turnCritRate() {
        return this.instance.battleInstance.currentTurn.getCritRate(this.instance.char, this.instance.isBoss);
    },
    get turnDmgTaken() {
        return this.instance.battleInstance.currentTurn.getDamageTaken(this.instance.char, this.instance.isBoss);
    },
    get turnCritDmg() {
        return this.instance.battleInstance.currentTurn.getCritDmg(this.instance.char, this.instance.isBoss);
    }
};
Object.defineProperty(battleUnitStatsShared, "toJSON", {
    enumerable: false,
    value: prepJson
});

function battleParseDamage(input, actionData, type) {
    function parse(entry) {
        if (entry.hasOwnProperty("value")) { // single target, entry = hit/dmg instance
            switch (type) {
                case BATTLE_ACTION_TYPES.heal:
                    actionData[actionData.char == entry.pos ? "selfHealing" : "teamHealing"] += parseInt(entry.value);
                    break;
                case BATTLE_ACTION_TYPES.dmgTaken:
                    var char = Battle.current.characters.getAtPos(entry.pos).char;
                    if (!actionData.dmgTaken[char]) { // init value so we can add to it
                        actionData.dmgTaken[char] = 0;
                    }
                    var dmg = parseInt(entry.value); // vars are block-scoped so it can fall-through
                    actionData.dmgTaken[char] += dmg;
                // eslint-disable-next-line no-fallthrough
                case BATTLE_ACTION_TYPES.dmgDealt:
                    dmg = dmg || parseInt(entry.value); // Scoped var is visible even if not initialized. Skip parseInt on fall-through.
                    if (entry.concurrent_attack_count > 0) { // echo
                        actionData.echoDmg += dmg;
                        actionData.echoHits++;
                    }
                    else {
                        switch(actionData.action) {
                            case BATTLE_ACTIONS.skill:
                            case BATTLE_ACTIONS.triggerSkill:
                            case BATTLE_ACTIONS.bossSkill:
                                actionData.skillDmg += dmg;
                                break;
                            case BATTLE_ACTIONS.ougi:
                            case BATTLE_ACTIONS.ougiEcho:
                            case BATTLE_ACTIONS.bossOugi:
                                actionData.ougiDmg += dmg;
                                break;
                            default: // normal atk
                                actionData.dmg += dmg;
                        }
                        actionData.hits++;
                    }

                    if (entry.critical) { // crit is not a "source" of dmg
                        actionData.critDmg += dmg;
                        actionData.crits++;
                    }
                    if (entry.miss > 0) {
                        actionData.misses++;
                    }
            }
        }
        else if(entry.hasOwnProperty("damage")) {
            battleParseDamage(entry.damage, actionData, type);
        }
        else { // aoe/mutlitarget? entry = boss pos
            battleParseDamage(entry, actionData, type);
        }
    }
    try {
        if (Array.isArray(input)) {
            for (let entry of input) {
                parse(entry);
            }
        }
        else {
            for (let key of Object.keys(input)) {
                parse(input[key]);
            }
        }
        actionData.dmgParsed = true;
    }
    catch (e) {
        deverror(e, input, actionData);
    }
}
function battleUseAbility(json, postData) {
    if (!json || json.scenario[0].cmd == "finished" || !Battle.current) { return } // Battle over

    Battle.current.turn = json.status.turn;
    // Battle.log.checkReset();
    var actions = [],
        actionData;

    for (let action of json.scenario) {
        switch (action.cmd) {
            case "ability":
                actionData = new BattleActionData(BATTLE_ACTIONS.skill);
                actionData.name = action.name;
                actionData.char = Battle.current.characters.getAtPos(action.pos).char;
                if (postData && postData.ability_id) { actionData.id = parseInt(postData.ability_id) }
                break;
            case "damage":
            case "loop_damage":
                if (action.to == "boss") {
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.dmgDealt);
                    if (!actions.includes(actionData)) {
                        actions.push(actionData);
                    }
                    // actionData.hits = action.list.length;
                }
                break;
            case "attack": // No-turn attack abilities like Tag team, GS
                battleAttack({
                    scenario: [action],
                    status: {turn: Battle.current.turn}
                });
                break;
            case "heal":
                if (action.to == "player") {
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.heal);
                    if (!actions.includes(actionData)) {
                        actions.push(actionData);
                    }
                }
                break;
            case "boss_gauge": {
                let unit = Battle.current.bosses.getAtPos(action.pos);
                unit.currentHp = action.hp;
                unit.maxHp = action.hpmax;
                unit.name = action.name.en; // Identity disorder bosses.
                // unit.charge = action.recast;
                // unit.maxCharge = action.recastmax;
                break;
            }
            case "contribution":
                // Need to check if action was actually pushed, hence not using ActionData, which can be disposed if not a dmg ability. Nor setting it on turn object directly for same reason.
                if (actions[0]) { // Assuming only 1 damaging ability per call, seems to work so far. TODO: replace array if this remains true
                    actions[0].honor = action.amount;
                }
                break;
            case "win":
                fireEvent(EVENTS.battleOver, Battle.current);
                if (action.is_last_raid) {
                    fireEvent(EVENTS.questOver, {id: action.raid_id});
                }
                break;
        }
    }

    if (actions.length > 0) {
        for (let action of actions) {
            Battle.current.currentTurn.actions.push(action);
            updateBattleStats(action);
        }
        devlog("Battle info updated", actions);
        updateUI("updBattleData", Battle.packageData());
    }
}
function battleAttack(json) {
    if (!json || json.scenario[0].cmd == "finished" || !Battle.current) { return } // Battle over

    var actions = [],
        actionData,
        isPlayerTurn = true;

    function checkInvalidatedDamage(ad) {
        if (ad.hits > 0 && ad.dmg === 0) {
            ad.invalidatedDmg = true;
        }
    }

    Battle.current.bosses.list.forEach(boss => boss.warn = false);
    var unit;
    for (let action of json.scenario) {
        switch (action.cmd) {
            case "super": // Boss ougi
                isPlayerTurn = false;
                actionData = new BattleActionData(BATTLE_ACTIONS.bossOugi);
                actionData.name = action.name;
                actionData.isBoss = true;
                unit = Battle.current.bosses.getAtPos(action.pos);
                actionData.char = unit.char;
                unit.activeTurns++;
                unit.warn = true;
                if (action.list) { // Some ougis do no dmg
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.dmgTaken);
                }
                else {
                    actionData.noDmgOugi = true;
                }
                actions.push(actionData);
                break;
            case "special": // Player ougi
            case "special_npc": // Chara ougi
                actionData = new BattleActionData(BATTLE_ACTIONS.ougi);
                actionData.name = action.name;
                unit = Battle.current.characters.getAtPos(action.pos);
                actionData.char = unit.char;
                unit.activeTurns++;
                if (action.list) { // Some ougis do no dmg
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.dmgDealt);
                }
                else {
                    actionData.noDmgOugi = true;
                }
                checkInvalidatedDamage(actionData);
                actions.push(actionData);
                break;
            case "attack":
                if (action.from == "player") {
                    actionData = new BattleActionData(isPlayerTurn ? BATTLE_ACTIONS.attack : BATTLE_ACTIONS.counter);
                    unit = Battle.current.characters.getAtPos(action.pos);
                    actionData.char = unit.char;
                    if (isPlayerTurn) { unit.activeTurns++ } // Ignore counters
                    if (action.hasOwnProperty("damage")) {
                        battleParseDamage(action.damage, actionData, BATTLE_ACTION_TYPES.dmgDealt);
                        actions.push(actionData);
                        checkInvalidatedDamage(actionData);
                    }
                }
                else { // boss atk (.from == boss)
                    isPlayerTurn = false;
                    actionData = new BattleActionData(BATTLE_ACTIONS.bossAtk);
                    actionData.isBoss = true;
                    unit = Battle.current.bosses.getAtPos(action.pos);
                    actionData.char = unit.char;
                    unit.activeTurns++;
                    if (action.hasOwnProperty("damage")) {
                        battleParseDamage(action.damage, actionData, BATTLE_ACTION_TYPES.dmgTaken);
                        actions.push(actionData);
                        // checkInvalidatedDamage(actionData);
                    }
                }
                break;
            case "ability":
                // Attack-turn activated abilities (Athena, Nighthound, etc)
                // Also some bosses cast them from buffs (e.g. Alex plain dmg buff)
                if (action.to == "player") {
                    actionData = new BattleActionData(BATTLE_ACTIONS.triggerSkill);
                    actionData.name = action.name;
                    actionData.char = Battle.current.characters.getAtPos(action.pos).char;
                }
                else { // boss
                    actionData = new BattleActionData(BATTLE_ACTIONS.bossSkill);
                    actionData.isBoss = true;
                    actionData.name = action.name;
                    actionData.char = Battle.current.bosses.getAtPos(action.pos).char;
                }
                break;
            case "turn":
                if (action.mode == "boss") {
                    isPlayerTurn = false;
                }
                break;
            case "chain_cutin":
                actionData = new BattleActionData(BATTLE_ACTIONS.chain);
                actionData.chainNum = action.chain_num;
                break;
            // Chain burst, Ougi echo, Skill counter (Athena), ...? TODO: check more cases
            // Also for some boss skills.
            case "damage":
            case "loop_damage": // eg.: Sarasa 5* ougi plain dmg part
                if (action.to == "boss") {
                    if (!isPlayerTurn) {
                        // If skill, char is already set and nothing else is needed here.
                        if (actionData.action != BATTLE_ACTIONS.triggerSkill || actionData.dmgParsed) {
                            actionData = new BattleActionData(BATTLE_ACTIONS.effect);
                        }
                    }
                    else if (actionData.action == BATTLE_ACTIONS.ougi) {
                        let char = actionData.char;
                        actionData = new BattleActionData(BATTLE_ACTIONS.ougiEcho);
                        actionData.char = char;
                    }
                    else if (actionData.action == BATTLE_ACTIONS.attack) {
                        let char = actionData.char;
                        actionData = new BattleActionData(BATTLE_ACTIONS.triggerSkill);
                        actionData.char = char;
                    }
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.dmgDealt);
                    checkInvalidatedDamage(actionData);
                    actions.push(actionData);
                }
                else { // Boss dmg from buffs (alex)
                    if (action.hasOwnProperty("list")) {
                        battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.dmgTaken);
                        actions.push(actionData);
                    }
                }
                break;
            case "heal":
                if (action.to == "player") {
                    // Doctor support skill & co, add under their correct action and keep attributed.
                    if (actionData.action == BATTLE_ACTIONS.triggerSkill) {
                        actions.push(actionData);
                    }
                    // Heal from ougi and atk (drain) are pushed already and can be attributed.
                    else if (actionData.action != BATTLE_ACTIONS.ougi && actionData.action != BATTLE_ACTIONS.attack) {
                        // Fallback to generic heal action.
                        // refresh, etc. Just kinda activates, no char, and no way to tell unless we try to store and track buffs, dealing with overwrites and stacking...
                        actionData = new BattleActionData(BATTLE_ACTIONS.healFffect);
                        actions.push(actionData);
                    }
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.heal);
                }
                // TODO: Figure out boss heal
                break;
            case "boss_gauge":
                unit = Battle.current.bosses.getAtPos(action.pos);
                unit.currentHp = action.hp;
                unit.maxHp = action.hpmax;
                unit.name = action.name.en; // Identity disorder bosses.
                // unit.charge = action.recast;
                // unit.maxCharge = action.recastmax;
                break;
            case "replace": // Chara swap
                Battle.current.characters.swap(action.pos, action.npc);
                break;
            case "contribution":
                Battle.current.currentTurn.honor += action.amount; // Honors only given for whole turn so can't add to any action
                break;
            case "die":
                if (action.to == "player") {
                    fireEvent(EVENTS.playerDeath, Battle.current);
                }
                break;
            case "win":
                fireEvent(EVENTS.battleOver, Battle.current);
                if (action.is_last_raid) {
                    fireEvent(EVENTS.questOver, {id: action.raid_id});
                }
                break;
        }
    }

    if (actions.length > 0) {
        for (let action of actions) {
            Battle.current.currentTurn.actions.push(action);
            updateBattleStats(action);
        }
        devlog("Battle info updated", actions);
        updateUI("updBattleData", Battle.packageData());
        // Battle.activeTurns += 1;
    }
    Battle.current.turn = json.status.turn;
    // Battle.current.addTurn(json.status.turn);
    // devlog("Start turn ", json.status.turn);
}
function battleUseSummon(json) {
    if (!json || json.scenario[0].cmd == "finished" || !Battle.current) { return } // Battle over

    Battle.current.turn = json.status.turn; // still same turn after summon
    // var actions = [],
    // actionData;

    for (let action of json.scenario) {
        switch (action.cmd) {
            case "replace": // Chara swap. Used for Resurrection (like Europa), possibly other calls that change ally position.
                if (action.voice) { // Only do it on actual replace. Prevents having to parseInt for the same action. I think this is marginally faster? Either way game is dumb.
                    Battle.current.characters.swap(action.pos, action.npc);
                }
                break;
            case "win":
                fireEvent(EVENTS.battleOver, Battle.current);
                if (action.is_last_raid) {
                    fireEvent(EVENTS.questOver, {id: action.raid_id});
                }
                break;
        }
    }

    // Not currently used
/*    if (actions.length > 0) {
        for (let action of actions) {
            Battle.log.currentTurn.actions.push(action);
            updateBattleStats(action);
        }
        devlog("Battle info updated", actions);
        updateUI("updBattleData", Battle);
    }*/
}

function updateBattleStats(actionData) {
    Battle.current.currentTurn.honor += actionData.honor;

    if (actionData.char != -1) { // Character-based actions
        let unitStats = actionData.isBoss ? Battle.current.bosses.getById(actionData.char).stats : Battle.current.characters.getById(actionData.char).stats;
        unitStats.hits += actionData.hits;
        unitStats.dmg += actionData.dmg;
        unitStats.echoHits += actionData.echoHits;
        unitStats.echoDmg += actionData.echoDmg;
        unitStats.skillDmg += actionData.skillDmg;
        unitStats.ougiDmg += actionData.ougiDmg;
        unitStats.crits += actionData.crits;

        unitStats.instance.currentTurnOugi.triggered = false;
        if (actionData.action == BATTLE_ACTIONS.ougi || actionData.action == BATTLE_ACTIONS.bossOugi) {
            unitStats.ougis++;
            unitStats.instance.currentTurnOugi.triggered = true;
            unitStats.instance.currentTurnOugi.name = actionData.name;
        }
        else if (actionData.action == BATTLE_ACTIONS.attack || actionData.action == BATTLE_ACTIONS.bossAtk) {
            let da = actionData.hits == 2,
                ta = actionData.hits == 3;
            unitStats.da += da ? 1 : 0;
            unitStats.ta += ta ? 1 : 0;
            if (!actionData.isBoss) {
                Battle.current.stats.totalDa += da ? 1 : 0;
                Battle.current.stats.totalTa += ta ? 1 : 0;
            }
        }
        else if ([BATTLE_ACTIONS.skill, BATTLE_ACTIONS.triggerSkill, BATTLE_ACTIONS.bossSkill].includes(actionData.action)) {
            // Add per-skill values.
            let skill = unitStats.skillDetails[actionData.name];
            if (!skill) {
                skill = unitStats.skillDetails[actionData.name] = {dmg: 0, heal: 0};
            }
            skill.dmg += actionData.skillDmg;
            skill.heal += actionData.selfHealing + actionData.teamHealing;
        }
        unitStats.selfHealing += actionData.selfHealing;
        unitStats.teamHealing += actionData.teamHealing;
        if (!actionData.isBoss) {
            Battle.current.stats.totalHits += actionData.totalHits;
            Battle.current.stats.totalCrits += actionData.crits;
        }
    }
    else { // Other actions
        for (let char in actionData.dmgTaken) {
            Battle.current.characters.getById(char).stats.dmgTaken += actionData.dmgTaken[char];
            Battle.current.stats.totalDamageTaken += actionData.dmgTaken[char];
        }
    }

    if (!actionData.isBoss) {
        Battle.current.stats.totalDmg += actionData.totalDmg;
    }
}