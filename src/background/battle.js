/*globals Battle, State*/
window.Battle = {
    turn: 1, //default at 1 so our math doesn't /0
    log: {
        log: [],
        get currentTurn() {
            if (this.numTurns > Battle.turn) { //new battle
                this.log = [];
            }
            if (!this.log[Battle.turn]) {
                this.log[Battle.turn] = new BattleTurnData();
            }
            return this.log[Battle.turn];
        },
/*        get last() {
            return this.log[this.log.length - 1];
        },*/
        get numTurns() {
            return this.log.length - 1; //sparse, 0 indexed array, turns start at 1
        },
        getFull: function() {
            return this.log.filter(t => (t instanceof BattleTurnData));
        }
    },
    stats: {
        get turnDmg() {
            return Battle.log.currentTurn.getDmg();
        },
//        avgTurnDmg: 0,
//        critRate: 0,
        highestDmg: 0,
//        avgTurnHonor: 0,
        totalHits: 0,
        totalCrits: 0,
//        totalHonor: 0,
        get totalDmg () {
            let total = 0;
            for (let turn of Battle.log.getFull()) {
                total += turn.getDmg();
            }
            return total;
        },        
        get turnCritRate() {
            return Battle.log.currentTurn.getCritRate();
        },
        get avgCritRate() {
            return (this.totalCrits / this.totalHits) * 100;
        },
        get avgTurnHonor() {
            return Math.floor(this.totalHonor / Battle.turn);
        },
        get avgTurnDmg() {
            return Math.floor(this.totalDmg / Battle.turn);
        },
        get totalHonor() {
            let total = 0;
            for (let turn of Battle.log.getFull()) {
                total +=  turn.honor;
            }
            return total;
        }
    }
};


function BattleActionData(action) {
    this.action = action;
    this.dmg = 0;
    this.char = 0;
    this.hits = 0;
    this.crits = 0;
    this.echoDmg = 0;
    this.echoHits = 0;
    this.misses = 0;
}

function BattleTurnData() {
    this.actions = [];
//    this.stats = new BattleActionData();
    this.honor = 0;
    
/*    this.actions.addAction: function(action) {
        this.actions.push(action);
        for ( let stat of Object.keys(action) ) {
            this.stats[stat] += action[stat];
//            Battle.stats[stat] += action[stat];
        }
    }*/
    
    this.getDmg = function () {
        let total = 0;
        for (let action of this.actions) {
            total += action.dmg;
        }
        return total;
    };
    this.getCritRate = function() {
        let hits = 0,
            crits = 0;
        for (let action of this.actions) {
            hits += action.hits + action.echoHits;
            crits += action.crits;
        }
        return crits/hits*100;
    };
}

function battleParseDmg(arr, actionData) {
//    actionData.hits = arr.length; //set this here to deal with loop_dmg
    try {
        
        for (let entry of arr) {
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
        
    }
    catch (e) {
        console.log(e, arr, actionData);
    }
}

function battleUseAbility (json) {
    if (!json || json.scenario[0].cmd == "finished") { return;} //Battle over
    
    Battle.turn = json.status.turn;
    var actions = [];
    var actionData;
    
    for (let action of json.scenario) {
        switch (action.cmd) {
            case "ability":
                actionData = new BattleActionData("Skill");
                actionData.name = action.name;
                actionData.char = action.pos; //TODO: write translate func {id, name}
                break;
            case "damage":
            case "loop_damage":
                if (action.to == "boss") {
                    actions.push(actionData); //only push when dmg, for now. TODO, kinda
                    battleParseDmg(action.list, actionData);
//                    actionData.hits = action.list.length;
                }
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
        State.devlog("Battle info updated", actions);
    }
}

function battleAttack(json) {
    if (!json || json.scenario[0].cmd == "finished") { return;} //Battle over
    
    Battle.turn = json.status.turn - 1; //json shows status after attack, so counting the data for prev turn.
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
                actionData = new BattleActionData("Ougi");
                actionData.char = action.pos; //TODO: write translate func {id, name}
                battleParseDmg(action.list, actionData); 
                actions.push(actionData);
                break;
            case "attack":
                if (action.from == "player") {
                    actionData = new BattleActionData(isPlayerTurn ? "Attack" : "Counter");
                    actionData.char = action.pos;
                    battleParseDmg(action.damage, actionData);
//                    actionData.hits += action.damage.length;
                    actions.push(actionData);
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
                actionData = new BattleActionData("Chain");
                actionData.chainNum = action.chain_num;
                break;
            case "damage": //CHain burst, Ougi echo, ...? TODO: check more cases
                if (!isPlayerTurn) {
                    actionData = new BattleActionData("Effect (Reflect, etc)");
                }
                battleParseDmg(action.list, actionData);
                actions.push(actionData);
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
}

function updateBattleStats(actionData) {
    Battle.stats.totalHits += actionData.hits;
    Battle.stats.totalCrits += actionData.crits;
//    Battle.stats.totalHonor += actionData.honor;
//    Battle.stats.totalDmg += actionData.dmg;
//    Battle.stats.totalTurns = Battle.turn;
    
    updateUI("updBattleData", Battle);
}