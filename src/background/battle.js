/*globals Battle, State, updateUI*/
const BATTLE_ACTIONS = {attack: "Attack",
                        skill: "Skill",
                        ougi: "Ougi",
                        ougiEcho: "Ougi echo",
                        effect: "Effect (Reflect, etc)",
                        counter: "Counter",
                        chain: "Chain burst"};

window.Battle = {
    turn: 1, //default at 1 so our math doesn't /0
    id:0,
    log: {
        log: [],
        get currentTurn() {
            if (!this.log[Battle.turn]) {
                this.log[Battle.turn] = new BattleTurnData();
            }
            return this.log[Battle.turn];
        },
        get numTurns() {
            return this.log.length - 1; //sparse, 0 indexed array, turns start at 1
        },
        getFull: function() {
            return this.log.filter(t => (t instanceof BattleTurnData));
        },
        reset: function(json) { //new battle
            if (json.twitter.battle_id != Battle.id) {
                this.log = [];
                Battle.characters.reset(json.player.param);
                
                Battle.id = json.twitter.battle_id;
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
            return Battle.log.currentTurn.getDmg(null);
        },
/*        get turnMultiRate() {
          return Battle.log.currentTurn.getMultiRate(null);  
        },*/
        get turnCritRate() {
            return Battle.log.currentTurn.getCritRate(null);
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
            return Math.floor(this.totalHonor / Battle.turn);
        },
        get avgTurnDmg() {
            return Math.floor(this.totalDmg / Battle.turn);
        },
        get avgDaRate() {
            return this.totalDa / (Battle.turn * 4) * 100;
        },
        get avgTaRate() {
            return this.totalTa / (Battle.turn * 4) * 100;
        }
    },
    characters: {
        active: [0,1,2,3], //pos = id
        list: [],
        addIfNew: function(id) {
            if (!this.list[id]) {
                this.list[id] = new BattleCharData(id);
            }
        },
        swap: function(pos, id) {
            this.active[pos] = id;
        },
        getAtPos: function (pos) {
            return this.list[ this.active[pos] ];
        },
        getById: function (id) {
            return this.list[id];
        },
        reset: function(party) {
            this.list = [];
            party.forEach((entry, idx) => this.list[idx] = new BattleCharData(idx, entry.name));
            this.active = [0,1,2,3];
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
    this.echoDmg = 0;
    this.echoHits = 0;
    this.misses = 0;
}

function BattleTurnData() {
    this.actions = [];
    this.honor = 0;
        
    this.getDmg = function (char) {
        let total = 0;
        for (let action of this.actions) {
            if (char === null || action.char == char) {
                total += action.dmg;
            }
        }
        return total;
    };
    this.getCritRate = function(char) {
        let hits = 0,
            crits = 0;
        for (let action of this.actions) {
            if (char === null || action.char == char) {
                hits += action.hits + action.echoHits;
                crits += action.crits;
            }
        }
        return safeDivide(crits, hits) *100;
    };
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

function BattleCharData(id, name = "") {
    this.char = id;
    this.name = name;
    
    var self = this;
    this.stats = {
        dmg: 0,
        hits: 0,
        echoHits: 0,
        crits: 0,
        da: 0,
        ta: 0,
        ougis: 0,
        
        get critRate () {
            return safeDivide(this.crits, this.hits + this.echoHits) * 100;
        },
        get daRate () {
            return safeDivide(this.da, Battle.turn - this.ougis) * 100;
        },
        get taRate () {
            return safeDivide(this.ta, Battle.turn - this.ougis) * 100;
        },
        get ougiRate () {
            return this.ougis / Battle.turn * 100;
        },
        get avgDmg() {
            return Math.floor(this.dmg / Battle.turn);
        },
        get turnDmg() {
            return Battle.log.currentTurn.getDmg(self.char);
        },
        get turnCritRate() {
            return Battle.log.currentTurn.getCritRate(self.char);
        }
    };
}

function battleParseDmg(arr, actionData) {
//    actionData.hits = arr.length; //set this here to deal with loop_dmg
    function parse(entry) {
        if (entry.hasOwnProperty("value")) { //single target, entry = hit
            if (entry.concurrent_attack_count > 0) {
                actionData.echoDmg += entry.value;
                actionData.echoHits++;
            }
            else {
                actionData.dmg += entry.value;
                actionData.hits++; //set this here to deal with loop_dmg
            }
            
            if (entry.critical) {
                actionData.crits++;
            }
            if (entry.miss > 0) {
                actionData.misses++;
            }
        }
        else if(entry.hasOwnProperty("damage")) {
            battleParseDmg(entry.damage, actionData);
        }
        else { //aoe/mutlitarget? entry = boss pos
            battleParseDmg(entry, actionData);
        }
    }
    try {
        if (Array.isArray(arr)) {
            for (let entry of arr) {
                parse(entry);
            }
        }
        else {
            for (let key of Object.keys(arr)) {
                parse(arr[key]);
            }
        }
    }
    catch (e) {
        console.log(e, arr, actionData);
    }
}

function battleUseAbility (json) {
    if (!json || json.scenario[0].cmd == "finished") { return;} //Battle over
    
    Battle.turn = json.status.turn;
//    Battle.log.checkReset();
    var actions = [];
    var actionData;
    
    for (let action of json.scenario) {
        switch (action.cmd) {
            case "ability":
                actionData = new BattleActionData(BATTLE_ACTIONS.skill);
                actionData.name = action.name;
                actionData.char = Battle.characters.active[action.pos]; //TODO: write translate func {id, name}
                break;
            case "damage":
            case "loop_damage":
                if (action.to == "boss") {
                    actions.push(actionData); //only push when dmg, for now. TODO, kinda
                    battleParseDmg(action.list, actionData);
//                    actionData.hits = action.list.length;
                }
                break;
            case "attack": //No-turn attack abilities like Tag team, GS
                battleAttack({scenario: [action],
                              status: {turn: Battle.turn} });
                break;
            case "contribution":
                //Need to check if action was actually pushed, hence not using ActionData, which can be disposed if not a dmg ability. Nor setting it on turn object directly for same reason.
                if (actions[0]) { //Assuming only 1 damaging ability per call, seems to work so far. TODO: replace array if this remains true
                    actions[0].honor = action.amount;
                }
        }
    }
    
    for (let action of actions) {
        Battle.log.currentTurn.actions.push(action);
        Battle.log.currentTurn.honor += action.honor;
        updateBattleStats(action);
    }
    State.devlog("Battle info updated", actions);
    updateUI("updBattleData", Battle);
}

function battleAttack(json) {
    if (!json || json.scenario[0].cmd == "finished") { return;} //Battle over
    
    Battle.turn = json.status.turn - 1; //json shows status after attack, so counting the data for prev turn.
//    Battle.log.checkReset();
    var actions = [];
    var actionData;
    var isPlayerTurn = true;
    
    for (let action of json.scenario) {
        switch (action.cmd) {
            case "super": //Boss ougi
                isPlayerTurn = false;
                break;
            case "special": //Player ougi
            case "special_npc":
                actionData = new BattleActionData(BATTLE_ACTIONS.ougi);
                actionData.char = Battle.characters.active[action.pos]; //TODO: write translate func {id, name}
                if (action.list) { //Some ougis do no dmg
                    battleParseDmg(action.list, actionData); 
                    actions.push(actionData);
                }
                break;
            case "attack":
                if (action.from == "player") {
                    actionData = new BattleActionData(isPlayerTurn ? BATTLE_ACTIONS.attack : BATTLE_ACTIONS.counter);
                    actionData.char = Battle.characters.active[action.pos];
                    if (action.damage) {
                        battleParseDmg(action.damage, actionData);
                        actions.push(actionData);
                    }
                }
                else { //boss atk
                    isPlayerTurn = false;
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
            case "damage": //CHain burst, Ougi echo, ...? TODO: check more cases
                if (action.to == "boss") {
                    if (!isPlayerTurn) {
                        actionData = new BattleActionData(BATTLE_ACTIONS.effect);
                    }
                    if (actionData.action == "Ougi") {
                        actionData = new BattleActionData(BATTLE_ACTIONS.ougiEcho);
                    }
                    battleParseDmg(action.list, actionData);
                    actions.push(actionData);
                }
                break;
            case "replace": //Chara swap
                Battle.characters.swap(action.pos, action.npc);
                break;
            case "contribution":
                Battle.log.currentTurn.honor += action.amount; //Honors only given for whole turn so can't add to any action
        }
    }
    
    for (let action of actions) {
        Battle.log.currentTurn.actions.push(action);
        updateBattleStats(action);
    }
    State.devlog("Battle info updated", actions);
    updateUI("updBattleData", Battle);
}

function updateBattleStats(actionData) {
    if (actionData.char != -1) {
        Battle.characters.addIfNew(actionData.char);
        let charStats = Battle.characters.getById(actionData.char).stats;
        charStats.hits += actionData.hits;
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
        }
    }
    
    Battle.stats.totalHits += actionData.hits;
    Battle.stats.totalCrits += actionData.crits;
    Battle.stats.totalDmg += actionData.dmg;
}