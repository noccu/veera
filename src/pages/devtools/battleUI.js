window.UI.battle = {
    display: {},
    isInit: false,
    graph: null,
    graphStats: { //TODo: configurable settings that are code-filled so I don't have to repeat the names
        turnDmg: 0,
        turnCritRate: 1,
        avgTurnDmg: 2,
        totalHonor: 3,
        avgTurnHonor: 4
    },
/*    init: function() {
        this.display.totalDmg = document.getElementById("battle-totalDmg");
        this.display.avgTurnDmg = document.getElementById("battle-avgTurnDmg");
        this.display.critRate = document.getElementById("battle-critRate");
        this.display.totalHonor = document.getElementById("battle-totalHonor");
        this.display.avgTurnHonor = document.getElementById("battle-avgTurnHonor");
    },*/
    initDisplay: function (stats) {
        for (let stat of Object.keys(stats)) {
            let ele = document.getElementById(`battle-${stat}`); //TODO: see statList
            if (ele) {
                this.display[stat] = ele;
            }
        }
        this.isInit = true;
    },
    update: function(battle){
        if (!this.graph) { this.createGraph(); }
        if (!this.isInit) { this.initDisplay(battle.stats); }
        if (battle.turn < this.graphData.labels.last) { //new battle
            clearGraph(this.graph);
        }
        
        for (let stat of Object.keys(battle.stats)) {
            this.updateDisplay(stat, battle.stats[stat]);
            this.updateGraphData(battle.turn, stat, battle.stats[stat]);
        }
        this.graph.update();
    },
    updateDisplay: function(stat, statValue) {
        if (this.display[stat]) {
            this.display[stat].textContent = statValue;
        }
    },
    updateGraphData: function(turn, stat, statValue){
        let statID = this.graphStats[stat];
        if (statID < this.graphData.datasets.length) {
            this.graphData.datasets[statID].data[turn - 1] = statValue;
            if (turn > this.graphData.labels.last) {
                this.graphData.labels.push(turn);
            }
        }
    },
    createGraph: function(){
        var ctx = document.getElementById("battle-overview-graph");
        
        this.graph = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [createBattleDataset("Turn Damage", 'rgb(87, 129, 61)', "tdmg"),
                               createBattleDataset("Crit Rate", 'rgb(61, 79, 129)', "crit")]
                },
                options: {
                    scales: {
                        yAxes: [{id: 'tdmg',
                                 type: 'linear',
                                position: "left"},
                                {id: 'crit',
                                 type: 'linear',
                                position: "right"}]
                    }
                }
            });
        this.graphData = this.graph.config.data;
    }
};

function createBattleDataset (stat, color, axisID) {
    return {label: stat,
            data: [],
            borderColor: color,
            borderWidth: 3,
            fill: false,
            yAxisID: axisID};
}