/*globals Battle, State*/
window.Battle = {
    turn: 1, //default at 1 so our math doesn't /0
    log: {
        log: [],
        get currentTurn() {
            if (!this.log[Battle.turn]) {
                this.log[Battle.turn] = new BattleTurnData();
            }
            return this.log[Battle.turn];
        },
        get last() {
            return this.log[this.log.length - 1];
        },
        get numTurns() {
            return this.log.length - 1; //sparse, 0 indexed array, turns start at 1
        },
        getFull: function() {
            return this.log.slice(1);
        }
    },
    stats: {
        turnDamage: 0,
//        avgTurnDmg: 0,
//        critRate: 0,
        highestDmg: 0,
//        avgTurnHonor: 0,
        totalHits: 0,
        totalCrits: 0,
//        totalHonor: 0,
        totalDmg: 0,
//        totalTurns: 0,
        
        get critRate() {
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
}

function BattleTurnData() {
    this.actions = [];
    this.honor = 0;
    
    function getDmg () {
        let total = 0;
        for (let entry of this.actions) {
            total += entry.dmg;
        }
        return total;
    }
}

function BattleParseDmg(arr, actionData) {
    for (let entry of arr) {
        if (entry.value) { //single target, entry = hit
            actionData.dmg += entry.value;
            if (entry.critical) {
                actionData.crits += 1;
            }
        }
        else { //aoe/mutlitarget? entry = boss pos
            BattleParseDmg(entry, actionData);
        }
    }
}

function battleUseAbility (json) {
    if (json.scenario[0].cmd == "finished") { return;} //Battle over
    
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
                    BattleParseDmg(action.list, actionData);
                    actionData.hits = action.list.length;
                }
                break;
            case "contribution":
            /*    let target = actions.find(i => i.dmg > 0); //TODO: help
                if (target) {
                    target.honor = action.amount;
                }*/
                if (actions[0]) {
                    actions[0].honor = action.amount;
                }
        }
    }
    
    for (let action of actions) {
        Battle.log.currentTurn.actions.push(action);
        Battle.log.currentTurn.honor += action.honor;
        updateBattleStats(action);
        
        Stats.devlog("Battle info updated", action);
    }
}

function battleAttack(json) {
    if (json.scenario[0].cmd == "finished") { return;} //Battle over
    
    Battle.turn = json.status.turn - 1; //json shows status after attack, so counting the data for prev turn.
    var actions = [];
    var actionData;
    
    for (let action of json.scenario) {
        switch (action.cmd) {
            case "special": //ougi, boss = "super"
            case "special_npc":
                actionData = new BattleActionData("Ougi");
                actionData.char = action.pos; //TODO: write translate func {id, name}
                for (let entry of action.list) {
                    actionData.dmg += entry.damage[0].value;
                    if (entry.damage[0].critical) {
                        actionData.crits += 1;
                    }
                }
                actionData.hits = action.list.length;
                actions.push(actionData);
                break;
            case "attack":
                if (action.from == "player") {
                    actionData = new BattleActionData("Attack");
                    actionData.char = action.pos;
                    for (let entry of action.damage) {
                        actionData.dmg += entry[0].value;
                        if (entry[0].critical) {
                            actionData.crits += 1;
                        }
                    }
                    actionData.hits += action.damage.length;
                    actions.push(actionData);
                }
                break;
            case "chain_cutin":
                actionData = new BattleActionData("Chain");
                actionData.chainNum = action.chain_num;
                break;
            case "damage": //Based on chain burst, TODO: check
                for (let entry in action.list) {
                    actionData.dmg += entry.value;
                }
                break;
            case "contribution":
                Battle.log.currentTurn.honor += action.amount;
        }
    }
    
    for (let action of actions) {
        Battle.log.currentTurn.actions.push(action);
        updateBattleStats(action);
    }
}

function updateBattleStats(actionData) {
    Battle.stats.totalHits += actionData.hits;
    Battle.stats.totalCrits += actionData.crits;
//    Battle.stats.totalHonor += actionData.honor;
    Battle.stats.totalDmg += actionData.dmg;
//    Battle.stats.totalTurns = Battle.turn;
}