const BATTLE_ACTION_TYPES = {dmgDealt: 1,
                             dmgTaken: 2,
                             heal: 3};
const BATTLE_ACTIONS = {attack: {name: "Attack"},
                        skill: {name: "Skill"},
                        postAtkTrigger: {name: "Post-attack skill trigger"},
                        ougi: {name: "Ougi"},
                        ougiEcho: {name: "Ougi echo"},
                        effect: {name: "Effect (Reflect, DoT, etc)"},
                        counter: {name: "Counter"},
                        chain: {name: "Chain burst"},
                        bossAtk: {name: "Boss attack"},
                        bossOugi: {name: "Boss ougi"},
                        bossSkill: {name: "Boss skill"}}; //As objects for faster/easier(??) comparison while keeping a name string.

function BattleData(id, chars) {
    this.turn = 1;
    this.id = id;
    this.log = [];

    this.stats = {
        //TODO: This SHOULD be optimized like Object.create(), hopefully...
        __proto__: battleStatsShared, //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Prototype_mutation
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
        current: [0,1,2,3], //pos = id
        get active() {
            let n = 0;
            this.list.forEach(function(entry) {
                if (entry.activeTurns) {
                    n++;
                }
            });
            return n;
        },
        list: [],
        swap: function(pos, id) {
            this.current[pos] = id;
        },
        getAtPos: function (pos) {
            return this.list[ this.current[pos] ];
        },
        getById: function (id) {
            return this.list[id];
        }
    };

    //Init chars
    chars.forEach((entry, idx) => this.characters.list[idx] = new BattleCharData(idx, entry.name));
}
Object.defineProperties(BattleData.prototype, {
    addTurn: {
        value: function() {
            this.log.push(new BattleTurnData());
        }
    },
    getTotalDamage: { //don't think this is actually used, in favour of stats.totalDmg
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
            if (!this.log.length) {
                this.addTurn();
            }
            return this.log.last;
            
//            let turn = this.turn - 1; //0-indexed array, 1-indexed turns
//            if (!this.log[turn]) {
//                this.log[turn] = new BattleTurnData();
//            }
//            return this.log[turn];
        }
    },
    activeTurns: {
        get() {
            return this.log.length || 1;
//            return this.log.filter(() => true).length || 1;
        }
    }
});
//Computed stat functions, used as prototype for battle stats.
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
    }
};

window.Battle = {
    MAX_STORED: 30,
    archive: {},
    get current() {
        if (this._currentId) {
            return this.archive[this._currentId];
        }
        else {
            return null;
        }
    },
    set current(id) {
        this._currentId = id;
    },
    packageData: function () {//TODO: check if everything copies
        let data = JSON.parse(JSON.stringify(this.current));
        
        for (let stat in this.current.stats) {
            data.stats[stat] = this.current.stats[stat];
        }
        for (let char of Object.keys(this.current.characters.list)) {
            for (let stat in this.current.characters.list[char].stats)
            {
                data.characters.list[char].stats[stat] = this.current.characters.list[char].stats[stat];
            }
        }
        return data;
    },
    reset(json) { //Called on every battle entry (incl refresh)
        if (json) {
            let id = json.multi ? json.twitter.battle_id : json.raid_id;
            let logged = id in this.archive;
            this.current = id;
            //Unlogged raid, or new host/join of logged raid
            if (!logged || logged && json.turn < this.archive[id].turn) {
                this.archive[id] = new BattleData(id, json.player.param);
                
                //Limit number of archived raids. TODO: find better way cause this sux
                let stored = Object.keys(this.archive);
                if (stored.length > this.MAX_STORED) {
                    delete this.archive[stored[0]];
                }

                updateUI("updBattleNewRaid", this.packageData());
            }
        }
    }
};

function safeDivide(a,b) {
    return a / (b || 1);
}

function BattleActionData(action) {
    this.action = action;
    this.char = -1;//not every action has a chara assigned!
    this.dmg = 0;
    this.hits = 0;
    this.echoDmg = 0;
    this.echoHits = 0;
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
            return this.dmg + this.echoDmg;
        }
    },
    totalHits: {
        get() {
            return this.hits + this.echoHits;
        }
    }
});

function BattleTurnData() {
    this.actions = [];
    this.honor = 0;
}
BattleTurnData.prototype.getTotalHits = function (char) {
    let total = 0;
    for (let action of this.actions) {
        if (char === undefined || action.char == char) {
            total += action.totalHits;
        }
    }
    return total;
};
BattleTurnData.prototype.getTotalDmg = function (char) {
    let total = 0;
    for (let action of this.actions) {
        if (char === undefined || action.char == char) {
            total += action.totalDmg;
        }
    }
    return total;
};
BattleTurnData.prototype.getDmg = function (char) {
    let total = 0;
    for (let action of this.actions) {
        if (char === undefined || action.char == char) {
            total += action.dmg;
        }
    }
    return total;
};
BattleTurnData.prototype.getEchoDmg = function (char) {
    let total = 0;
    for (let action of this.actions) {
        if (char === undefined || action.char == char) {
            total += action.echoDmg;
        }
    }
    return total;
};
BattleTurnData.prototype.getCritRate = function(char) {
    let crits = 0;
    for (let action of this.actions) {
        if (char === undefined || action.char == char) {
            crits += action.crits;
        }
    }
    return safeDivide(crits, this.getTotalHits(char)) * 100;
};
BattleTurnData.prototype.getCritDmg = function(char) {
    let total = 0;
    for (let action of this.actions) {
        if (char === undefined || action.char == char) {
            total += action.critDmg;
        }
    }
    return total;
};
BattleTurnData.prototype.getDamageTaken = function(char) {
    let dmg = 0;
    for (let action of this.actions) {
        for (let charHit in action.dmgTaken) {
            if (char === undefined || charHit == char) {
                dmg += action.dmgTaken[charHit];
            }
        }
    }
    return dmg;
};

function BattleCharData(id, name = "") {
    this.char = id;
    this.name = name;
    this.activeTurns = 0;

    this.stats = {
        __proto__: battleCharStatsShared,
        dmg: 0,
        hits: 0,
        echoDmg: 0,
        echoHits: 0,
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
}

const battleCharStatsShared = {
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
        return this.dmg + this.echoDmg;
    },
    get totalHits() {
        return this.hits + this.echoHits;
    },
    get avgDmg() {
        return Math.floor(safeDivide(this.totalDmg, this.instance.activeTurns));
    },
    get turnDmg() {
        return Battle.current.currentTurn.getTotalDmg(this.instance.char);
    },
    get turnCritRate() {
        return Battle.current.currentTurn.getCritRate(this.instance.char);
    },
    get turnDmgTaken() {
        return Battle.current.currentTurn.getDamageTaken(this.instance.char);
    },
    get turnCritDmg() {
        return Battle.current.currentTurn.getCritDmg(this.instance.char);
    }
};

function battleParseDamage(input, actionData, type) {
    function parse(entry) {
        if (entry.hasOwnProperty("value")) { //single target, entry = hit/dmg instance
            switch (type) {
                case BATTLE_ACTION_TYPES.heal:
                    actionData[actionData.char == entry.pos ? "selfHealing" : "teamHealing"] += parseInt(entry.value);
                    break;
                case BATTLE_ACTION_TYPES.dmgTaken:
                    let char = Battle.current.characters.getAtPos(entry.pos).char;
                    if (!actionData.dmgTaken[char]) {//init value so we can add to it
                        actionData.dmgTaken[char] = 0;
                    }
                    actionData.dmgTaken[char] += parseInt(entry.value);
                    break;
                case BATTLE_ACTION_TYPES.dmgDealt:
                    if (entry.concurrent_attack_count > 0) {
                        actionData.echoDmg += parseInt(entry.value);
                        actionData.echoHits++;
                    }
                    else {
                        actionData.dmg += parseInt(entry.value);
                        actionData.hits++;
                    }

                    if (entry.critical) {
                        actionData.critDmg += parseInt(entry.value);
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
        else { //aoe/mutlitarget? entry = boss pos
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

function battleUseAbility (json) {
    if (!json || json.scenario[0].cmd == "finished") { return;} //Battle over

    Battle.current.turn = json.status.turn;
//    Battle.log.checkReset();
    var actions = [],
        actionData;

    for (let action of json.scenario) {
        switch (action.cmd) {
            case "ability":
                actionData = new BattleActionData(BATTLE_ACTIONS.skill);
                actionData.name = action.name;
                actionData.char = Battle.current.characters.getAtPos(action.pos).char;
                break;
            case "damage":
            case "loop_damage":
                if (action.to == "boss") {
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.dmgDealt);
                    if (!actions.includes(actionData)) {
                        actions.push(actionData);
                    }
//                    actionData.hits = action.list.length;
                }
                break;
            case "attack": //No-turn attack abilities like Tag team, GS
                battleAttack({scenario: [action],
                              status: {turn: Battle.current.turn + 1} }); //cause of the way it parses things
                break;
            case "heal":
                if (action.to == "player") {
//                    actionData = new BattleActionData(BATTLE_ACTIONS.selfHeal);
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.heal);
                    if (!actions.includes(actionData)) {
                        actions.push(actionData);
                    }
//                    actionData.healTo = Battle.characters.getAtPos(action.pos);
                }
                break;
            case "contribution":
                //Need to check if action was actually pushed, hence not using ActionData, which can be disposed if not a dmg ability. Nor setting it on turn object directly for same reason.
                if (actions[0]) { //Assuming only 1 damaging ability per call, seems to work so far. TODO: replace array if this remains true
                    actions[0].honor = action.amount;
                }
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
    if (!json || json.scenario[0].cmd == "finished") { return;} //Battle over

    Battle.current.turn = json.status.turn - 1; //json shows status after attack, so counting the data for prev turn.
    //Active turns is increased after all the stat calcs
//    Battle.log.checkReset();
    var actions = [],
        actionData,
        isPlayerTurn = true;

    function checkInvalidatedDamage(ad) {
        if (ad.hits > 0 && ad.dmg === 0) {
            ad.invalidatedDmg = true;
        }
    }

    for (let action of json.scenario) {
        switch (action.cmd) {
            case "super": //Boss ougi
                isPlayerTurn = false;
                actionData = new BattleActionData(BATTLE_ACTIONS.bossOugi);
                if (action.list) { //Some ougis do no dmg
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.dmgTaken);
                    actions.push(actionData);
                }
                break;
            case "special": //Player ougi
            case "special_npc": //Chara ougi
                actionData = new BattleActionData(BATTLE_ACTIONS.ougi);
                actionData.char = Battle.current.characters.getAtPos(action.pos).char;
                Battle.current.characters.getAtPos(action.pos).activeTurns++;
                if (action.list) { //Some ougis do no dmg
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
                    actionData.char = Battle.current.characters.getAtPos(action.pos).char;
                    if (isPlayerTurn) { Battle.current.characters.getAtPos(action.pos).activeTurns++; }
                    if (action.hasOwnProperty("damage")) {
                        battleParseDamage(action.damage, actionData, BATTLE_ACTION_TYPES.dmgDealt);
                        actions.push(actionData);
                        checkInvalidatedDamage(actionData);
                    }
                }
                else { //boss atk
                    isPlayerTurn = false;
                    if (action.from == "boss") {
                        actionData = new BattleActionData(BATTLE_ACTIONS.bossAtk);
                        if (action.hasOwnProperty("damage")) {
                            battleParseDamage(action.damage, actionData, BATTLE_ACTION_TYPES.dmgTaken);
                            actions.push(actionData);
//                            checkInvalidatedDamage(actionData);
                        }
                    }
                }
                break;
            case "ability":
                //Attack-turn activated abilities (Athena, Nighthound, etc)
                //Also some bosses cast them from buffs (e.g. Alex plain dmg buff)
                if (action.to == "player") {
                    actionData = new BattleActionData(BATTLE_ACTIONS.skill);
                    actionData.char = Battle.current.characters.getAtPos(action.pos).char;
                }
                else {//boss
                    actionData = new BattleActionData(BATTLE_ACTIONS.bossSkill);
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
            case "damage":
            //Chain burst, Ougi echo, Skill counter (Athena), ...? TODO: check more cases
            //Also for some boss skills.
            case "loop_damage": //eg.: Sarasa 5* ougi plain dmg part
                if (action.to == "boss") {
                    if (!isPlayerTurn) {
                        //If skill, char is already set and nothing else is needed here.
                        if (actionData.action != BATTLE_ACTIONS.skill || actionData.dmgParsed) {
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
                        actionData = new BattleActionData(BATTLE_ACTIONS.postAtkTrigger);
                        actionData.char = char;
                    }
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.dmgDealt);
                    checkInvalidatedDamage(actionData);
                    actions.push(actionData);
                }
                else {//Boss dmg from buffs (alex)
                    if (action.hasOwnProperty("list")) {
                        battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.dmgTaken);
                        actions.push(actionData);
                    }
                }
                break;
            case "heal": //Must be part of atk or ougi, even if caused by ability. Can assume actionData was pushed.
                if (action.to == "player") {
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.heal);
                }
                break;
            case "replace": //Chara swap
                Battle.current.characters.swap(action.pos, action.npc);
                break;
            case "contribution":
                Battle.current.currentTurn.honor += action.amount; //Honors only given for whole turn so can't add to any action
        }
    }

    if (actions.length > 0) {
        for (let action of actions) {
            Battle.current.currentTurn.actions.push(action);
            updateBattleStats(action);
        }
        devlog("Battle info updated", actions);
        updateUI("updBattleData", Battle.packageData());
//        Battle.activeTurns += 1;
    }
    Battle.current.addTurn();
    devlog("Start turn ", json.status.turn);
}

function battleUseSummon(json) {
     if (!json || json.scenario[0].cmd == "finished") { return;} //Battle over

    Battle.current.turn = json.status.turn; //still same turn after summon
//    var actions = [],
//        actionData;

    for (let action of json.scenario) {
        switch (action.cmd) {
            case "replace": //Chara swap. Used for Resurection (like Europa), possibly other calls that change ally position.
                if (action.voice) { //Only do it on actual replace. Prevents having to parseInt for the same action. I think this is marginally faster? Either way game is dumb.
                    Battle.current.characters.swap(action.pos, action.npc);
                }
                break;
        }
    }

    //Not currently used
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

    if (actionData.char != -1) { //Character-based actions
        let charStats = Battle.current.characters.getById(actionData.char).stats;
        charStats.hits += actionData.hits;
        charStats.dmg += actionData.dmg;
        charStats.echoHits += actionData.echoHits;
        charStats.echoDmg += actionData.echoDmg;
        charStats.crits += actionData.crits;
        if (actionData.action == BATTLE_ACTIONS.ougi) {
            charStats.ougis++;
        }
        else if (actionData.action == BATTLE_ACTIONS.attack) {
            let da = actionData.hits == 2,
                ta = actionData.hits == 3;
            charStats.da += da ? 1 : 0;
            charStats.ta += ta ? 1 : 0;
            Battle.current.stats.totalDa += da ? 1 : 0;
            Battle.current.stats.totalTa += ta ? 1 : 0;
        }
        charStats.selfHealing += actionData.selfHealing;
        charStats.teamHealing += actionData.teamHealing;
        Battle.current.stats.totalHits += actionData.totalHits;
        Battle.current.stats.totalCrits += actionData.crits;
    }
    else { //Other actions
        for (let char in actionData.dmgTaken) {
            Battle.current.characters.getById(char).stats.dmgTaken += actionData.dmgTaken[char];
            Battle.current.stats.totalDamageTaken += actionData.dmgTaken[char];
        }
    }

    Battle.current.stats.totalDmg += actionData.totalDmg;
}