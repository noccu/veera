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
                        super: {name: "Boss ougi"}}; //As objects for faster/easier comparison while keeping a name string.

window.Battle = {
    turn: 1, //default at 1 so our math doesn't /0
    //For calculating more accurately when rejoining raids, activating Veera mid-battle, or any other time turns get desynced.
    //Starts at 1 to prevent /0 when using skills
    //It is now default
    activeTurns: 1,
    id: 0,
    log: {
        log: [],
        get currentTurn() {
            if (!this.log[Battle.turn]) {
                this.log[Battle.turn] = new BattleTurnData();
            }
            return this.log[Battle.turn];
        },
        getFull: function() {
            return this.log.filter(t => (t instanceof BattleTurnData));
        },
        reset: function(json) { //new battle
            if (!json) { return; } //Quiet occasional error.
            let id = json.multi ? json.twitter.battle_id : json.raid_id;
            if (id != Battle.id) {
                this.log = [];
                this.turn = json.turn;
                Battle.characters.reset(json.player.param);

                for (let stat of Object.keys(Battle.stats)) {
                    Battle.stats[stat] = 0;
                }

                Battle.id = id;
                updateUI("updBattleNewRaid", Battle);
            }
        }
    },
    stats: {
        highestDmg: 0,
        totalHits: 0,
        totalCrits: 0,
        totalDa: 0,
        totalTa: 0,
        totalDmg: 0,

        get turnDmg() {
            return Battle.log.currentTurn.getDmg();
        },
/*        get turnMultiRate() {
          return Battle.log.currentTurn.getMultiRate();
        },*/
        get turnCritRate() {
            return Battle.log.currentTurn.getCritRate();
        },

/*        get totalDmg () {
            let total = 0;
            for (let turn of Battle.log.getFull()) {
                total += turn.getDmg();
            }
            return total;
        },   */
        get totalHonor() {
            let total = 0;
            for (let turn of Battle.log.getFull()) {
                total +=  turn.honor;
            }
            return total;
        },

        get avgCritRate() {
            return safeDivide(this.totalCrits, this.totalHits) * 100;
        },
        get avgTurnHonor() {
            return Math.floor(this.totalHonor / Battle.activeTurns);
        },
        get avgTurnDmg() {
            return Math.floor(this.totalDmg / Battle.activeTurns);
        },
        get avgDaRate() {
//            return safeDivide(this.totalDa, Battle.turn * Battle.characters.active) * 100;
            return safeDivide(this.totalDa, Battle.characters.autoTurns) * 100;
        },
        get avgTaRate() {
//            return safeDivide(this.totalTa, Battle.turn * Battle.characters.active) * 100;
            return safeDivide(this.totalTa, Battle.characters.autoTurns) * 100;
        }
    },
    characters: {
        current: [0,1,2,3], //pos = id
        get active() {
            let n = 0;
            Battle.characters.list.forEach(function(entry) {
                if (entry.activeTurns) {
                    n++;
                }
            });
            return n;
        },
        get autoTurns() {
            let n = 0;
            Battle.characters.list.forEach(function(entry) {
                if (entry.activeTurns) {
                    n += (entry.activeTurns - entry.stats.ougis);
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
        },
        reset: function(party) {
            this.list = [];
            party.forEach((entry, idx) => this.list[idx] = new BattleCharData(idx, entry.name));
            this.current = [0,1,2,3];
        }
    }
};

function safeDivide(a,b) {
    return a / (b || 1);
}
function getTotalDamage(pos) {
    let total = 0;
    for (let turn of Battle.log.getFull()) {
        total += turn.getDmg(pos);
    }
    return total;
}

function BattleActionData(action) {
    this.action = action;
    this.dmg = 0;
    this.char = -1;//not every action has a chara assigned!
    this.hits = 0;
    this.crits = 0;
    this.critDmg = 0;
    this.echoDmg = 0;
    this.echoHits = 0;
    this.misses = 0;
    this.honor = 0;
    this.dmgTaken = {};
    this.selfHealing = 0;
    this.teamHealing = 0;
}

function BattleTurnData() {
    this.actions = [];
    this.honor = 0;

/*    this.getMultiRate = function(char) {
        let hits = 0,
            da = 0,
            ta = 0;
        for (let action of this.actions) {
            if (char === null || action.char == char) {
                hits += action.hits;
                da += action.hits == 2 ? 1 : 0;
                ta += action.hits == 3 ? 1 : 0;
            }
        }
        hits = hits || 1;
        return {da: da/hits*100,
                ta: ta/hits*100};
    };*/
}
BattleTurnData.prototype.getDmg = function (char) {
    let total = 0;
    for (let action of this.actions) {
        if (char === undefined || action.char == char) {
            total += action.dmg + action.echoDmg;
        }
    }
    return total;
};
BattleTurnData.prototype.getDmgBase = function (char) {
    let total = 0;
    for (let action of this.actions) {
        if (char === undefined || action.char == char) {
            total += action.dmg;
        }
    }
    return total;
};
BattleTurnData.prototype.getDmgEcho = function (char) {
    let total = 0;
    for (let action of this.actions) {
        if (char === undefined || action.char == char) {
            total += action.echoDmg;
        }
    }
    return total;
};
BattleTurnData.prototype.getCritRate = function(char) {
    let hits = 0,
        crits = 0;
    for (let action of this.actions) {
        if (char === undefined || action.char == char) {
            hits += action.hits + action.echoHits;
            crits += action.crits;
        }
    }
    return safeDivide(crits, hits) *100;
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
//    this.activities = {}; //Used for stat calcs.
    this.activeTurns = 0;

    var self = this;
    this.stats = {
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
        teamHealing: 0,

        get critRate () {
            return safeDivide(this.crits, this.hits + this.echoHits) * 100;
        },
        get daRate () {
            return safeDivide(this.da, self.activeTurns - this.ougis) * 100;
        },
        get taRate () {
            return safeDivide(this.ta, self.activeTurns - this.ougis) * 100;
        },
        get ougiRate () {
            return safeDivide(this.ougis, self.activeTurns) * 100;
        },
        get totalDmg () {
            return this.dmg + this.echoDmg;
        },
        get avgDmg() {
            return Math.floor(safeDivide(this.totalDmg, self.activeTurns));
        },
        get turnDmg() {
            return Battle.log.currentTurn.getDmg(self.char);
        },
        get turnCritRate() {
            return Battle.log.currentTurn.getCritRate(self.char);
        },
        get turnDmgTaken() {
            return Battle.log.currentTurn.getDamageTaken(self.char);
        },
        get turnCritDmg() {
            return Battle.log.currentTurn.getCritDmg(self.char);
        }
    };
}

function battleParseDamage(input, actionData, type) {
    function parse(entry) {
        if (entry.hasOwnProperty("value")) { //single target, entry = hit/dmg instance
            switch (type) {
                case BATTLE_ACTION_TYPES.heal:
                    actionData[actionData.char == entry.pos ? "selfHealing" : "teamHealing"] += parseInt(entry.value);
                    break;
                case BATTLE_ACTION_TYPES.dmgTaken:
                    let char = Battle.characters.getAtPos(entry.pos).char;
                    if (!actionData.dmgTaken[char]) {
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
                        actionData.crits++;
                        actionData.critDmg += parseInt(entry.value);
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

    Battle.turn = json.status.turn;
//    Battle.log.checkReset();
    var actions = [],
        actionData;

    for (let action of json.scenario) {
        switch (action.cmd) {
            case "ability":
                actionData = new BattleActionData(BATTLE_ACTIONS.skill);
                actionData.name = action.name;
                actionData.char = Battle.characters.getAtPos(action.pos).char;
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
                              status: {turn: Battle.turn + 1} }); //cause of the way it parses things
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
            Battle.log.currentTurn.actions.push(action);
            updateBattleStats(action);
        }
        devlog("Battle info updated", actions);
        updateUI("updBattleData", Battle);
    }
}

function battleAttack(json) {
    if (!json || json.scenario[0].cmd == "finished") { return;} //Battle over

    Battle.turn = json.status.turn - 1; //json shows status after attack, so counting the data for prev turn.
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
                actionData = new BattleActionData(BATTLE_ACTIONS.super);
                if (action.list) { //Some ougis do no dmg
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.dmgTaken);
                    actions.push(actionData);
                }
                break;
            case "special": //Player ougi
            case "special_npc": //Chara ougi
                actionData = new BattleActionData(BATTLE_ACTIONS.ougi);
                actionData.char = Battle.characters.getAtPos(action.pos).char;
                Battle.characters.getAtPos(action.pos).activeTurns++;
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
                    actionData.char = Battle.characters.getAtPos(action.pos).char;
                    if (isPlayerTurn) { Battle.characters.getAtPos(action.pos).activeTurns++; }
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
                            checkInvalidatedDamage(actionData);
                        }
                    }
                }
                break;
            case "ability": //Attack-turn activated abilities (Athena, Nighthound, etc)
                actionData = new BattleActionData(BATTLE_ACTIONS.skill);
                actionData.char = Battle.characters.getAtPos(action.pos).char;
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
            case "damage": //Chain burst, Ougi echo, Skill counter (Athena), ...? TODO: check more cases
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
                break;
            case "heal": //Must be part of atk or ougi, even if caused by ability. Can assume actionData was pushed.
                if (action.to == "player") {
                    battleParseDamage(action.list, actionData, BATTLE_ACTION_TYPES.heal);
                }
                break;
            case "replace": //Chara swap
                Battle.characters.swap(action.pos, action.npc);
                break;
            case "contribution":
                Battle.log.currentTurn.honor += action.amount; //Honors only given for whole turn so can't add to any action
        }
    }

    if (actions.length > 0) {
        for (let action of actions) {
            Battle.log.currentTurn.actions.push(action);
            updateBattleStats(action);
        }
        devlog("Battle info updated", actions);
        updateUI("updBattleData", Battle);
        Battle.activeTurns += 1;
    }
    devlog("Start turn ", json.status.turn);
}

function battleUseSummon(json) {
     if (!json || json.scenario[0].cmd == "finished") { return;} //Battle over

    Battle.turn = json.status.turn; //still same turn after summon
//    var actions = [],
//        actionData;

    for (let action of json.scenario) {
        switch (action.cmd) {
            case "replace": //Chara swap. Used for Resurection (like Europa), possibly other calls that change ally position.
                if (action.voice) { //Only do it on actual replace. Prevents having to parseInt for the same action. I think this is marginally faster? Either way game is dumb.
                    Battle.characters.swap(action.pos, action.npc);
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
    Battle.log.currentTurn.honor += actionData.honor;

    if (actionData.char != -1) { //Character-based actions
        let charStats = Battle.characters.getById(actionData.char).stats;
        charStats.hits += actionData.hits;
        charStats.echoDmg += actionData.echoDmg;
        charStats.echoHits += actionData.echoHits;
        charStats.dmg += actionData.dmg;
        charStats.crits += actionData.crits;
        if (actionData.action == BATTLE_ACTIONS.ougi) {
            charStats.ougis++;
        }
        if (actionData.action == BATTLE_ACTIONS.attack) {
            charStats.da += actionData.hits == 2 ? 1 : 0;
            charStats.ta += actionData.hits == 3 ? 1 : 0;
            Battle.stats.totalDa += actionData.hits == 2 ? 1 : 0;
            Battle.stats.totalTa += actionData.hits == 3 ? 1 : 0;
//            if (!Battle.characters.list[actionData.char].activities.attack) { Battle.characters.list[actionData.char].activities.attack = true; };
        }
        charStats.selfHealing += actionData.selfHealing;
        charStats.teamHealing += actionData.teamHealing;
    }
    else { //Other actions
        for (let char in actionData.dmgTaken) {
            Battle.characters.getById(char).stats.dmgTaken += actionData.dmgTaken[char];
            Battle.stats.totalDamageTaken += actionData.dmgTaken[char];
        }
    }

    Battle.stats.totalHits += actionData.hits;
    Battle.stats.totalCrits += actionData.crits;
    Battle.stats.totalDmg += actionData.dmg + actionData.echoDmg;
}