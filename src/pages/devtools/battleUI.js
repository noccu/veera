window.UI.battle = {
    display: {
        overview: {},
        chars: {}
    },
    isInit: false,
    current: 0,
    graph: {
        overview: null,
        chars: {}
    },
    graphData: {
        overview: null,
        chars: {}
    },
    // List stats showing in overview graph and their dataset ID. TODO: configurable settings that are code-filled so I don't have to repeat the names. And maybe user choice for what's visible...
    graphStats: {
        overview: {
            turnDmg: 0,
            turnCritRate: 1
        },
        chars: {
            turnDmg: 0,
            // turnCritDmg: 1,
            turnDmgTaken: 1
        }

    },
    initDisplay: function () {
        Chart.defaults.scale.ticks.callback = function (value, index, values) {
            return NUMBER_FORMAT.format(value);
        };
        Chart.defaults.global.tooltips.callbacks.label = function (tooltipItem, data) {
            return `${data.datasets[tooltipItem.datasetIndex].label}: ${NUMBER_FORMAT.format(tooltipItem.yLabel)}`;
        };
        Chart.defaults.global.tooltips.callbacks.title = function (tooltipItemArr, data) {
            /* var title = "Turn: ";
            for (let item of tooltipItemArr) {
                title += item.xLabel;
            }
            return title;*/
            return `Turn: ${tooltipItemArr[0].xLabel}`;
        };
        // Archive
        this.display.arch = document.getElementById("battle-select");
        this.display.arch.addEventListener("change", showArchBattle);

        // Overview
        var store = document.querySelectorAll("#battle-overview .battle-stats");
        for (let statEle of store) {
            this.display.overview[statEle.dataset.stat] = statEle.children[0];
        }
        this.createOverviewGraph();

        // Characters
        var list = document.querySelector("#battle-characters .panel-content"),
            temp = document.getElementById("t-battle-char-container");
        // ele = document.getElementsByClassName("battle-char-container");
        // var charaStats = document.querySelectorAll("#battle-characters span[data-stat]")
        for (let i = 0; i < 6; i++) {
            temp.content.querySelector(".battle-char-container").dataset.char = i;
            temp.content.querySelector(".battle-char-name").textContent = `Char ${i+1}`;

            store = document.importNode(temp, true).content.children[0];
            let statsList = store.getElementsByClassName("battle-stats"),
                id = store.dataset.char;
            if (!this.display.chars[id]) {
                this.display.chars[id] = {};
            }
            for (let statEle of statsList) {
                this.display.chars[id][statEle.dataset.stat] = statEle.children[0];
            }
            list.appendChild(store);

            this.createCharaGraph(i);
        }

        this.isInit = true;
    },
    update: function(battle, requestArchive) {
        // don't update when displaying old battles.
        if(!requestArchive && !this.display.arch.selectedOptions[0].current) { return }

        this.updateOverview(battle);
        this.graph.overview.update();

        this.updateCharacters(battle.turn, battle.characters.list);
        for (let char of Object.keys(this.graph.chars)) {
            this.graph.chars[char].update();
        }
    },
    reset: function() {
        if (!this.isInit) { this.initDisplay() }
        if (this.graph.overview) {
            clearGraph(this.graph.overview);
        }
        for (let char of Object.keys(this.graph.chars)) {
            let charGraph = this.graph.chars[char];
            for (let axis of charGraph.config.options.scales.yAxes) { // Graph scale sync
                axis.ticks.max = 100;
            }
            clearGraph(this.graph.chars[char]);
        }

        // Readouts
        for (let stat of Object.keys(this.display.overview)) {
            stat = this.display.overview[stat];
            stat.textContent = stat.classList.contains("text") ? "" : "0";
        }
        for (let char of Object.keys(this.display.chars)) {
            for (let stat of Object.keys(this.display.chars[char])) {
                stat = this.display.chars[char][stat];
                stat.textContent = stat.classList.contains("text") ? "" : "0";
            }
        }
    },
    updArchive(data) {
        clearDropdown(this.display.arch);
        populateDropdown(this.display.arch, data, (el, opt) => {
            if (opt.current) {
                el.current = true;
                el.selected = true;
            }
        });
        // this.display.arch.options[this.display.arch.options.length - 1].selected = true;
    },
    updateOverview: function(battle) {
        // Readouts
        for (let stat of Object.keys(this.display.overview)) {
            if (battle.stats[stat] !== undefined) {
                this.display.overview[stat].textContent = NUMBER_FORMAT.format(battle.stats[stat]);
            }
        }

        // GraphData
        for (let stat of Object.keys(this.graphStats.overview)) {
            let statID = this.graphStats.overview[stat];
            if (battle.stats[stat] !== undefined) {
                if (!this.offset) { this.offset = 0 }
                if (battle.turn > this.graphData.overview.labels.last) {
                    this.graphData.overview.labels.push(battle.turn);
                    this.offset = battle.turn - 1 - this.graphData.overview.datasets[statID].data.length; // dealing with missing turn data
                }
                this.graphData.overview.datasets[statID].data[battle.turn - 1 - this.offset] = battle.stats[stat];
            }
        }
    },
    updateCharacters: function (turn, characters) {
        var charData, charGraphData, disp;
        for (let id of Object.keys(characters)) {
            charData = characters[id];
            charGraphData = this.graphData.chars[charData.char];
            // Readouts
            for (let stat of Object.keys(this.display.chars[charData.char])) {
                if (charData.stats[stat] !== undefined) { // stats can be 0 :V
                    try {
                        // Simple numbers
                        if (typeof charData.stats[stat] == "number") {
                            this.display.chars[charData.char][stat].textContent = NUMBER_FORMAT.format(charData.stats[stat]);
                        }
                        // Detailed objects
                        else {
                            let content = "";
                            for (let name in charData.stats[stat]) {
                                let entry = charData.stats[stat][name],
                                    exp = `${name}: `,
                                    first = true;
                                for (let label in entry) {
                                    if (entry[label] != 0) {
                                        exp += `${first ? "" : ", "}${NUMBER_FORMAT.format(entry[label])} ${label}`;
                                        first = false;
                                    }
                                }
                                content += exp + "\n";
                            }
                            this.display.chars[charData.char][stat].textContent = content;
                        }
                    }
                    catch (e) {
                        devlog("Error: ", e, "stat: ", stat, "cdata: ", charData, "disp: ", disp, "id: ", id, "chars: ", characters);
                    }
                }
            }

            // Graph
            for (let stat of Object.keys(this.graphStats.chars)) {
                let statID = this.graphStats.chars[stat];
                if (turn > charGraphData.labels.last) {
                    charGraphData.labels.push(turn);
                    this.offset = turn - 1 - charGraphData.datasets[statID].data.length; // dealing with missing turn data
                }
                charGraphData.datasets[statID].data[turn - 1 - this.offset] = charData.stats[stat];

                for (let graph of Object.keys(this.graph.chars)) { // Graph scale sync (global)
                    let charGraphConfig = this.graph.chars[graph].config;
                    for (let axis of charGraphConfig.options.scales.yAxes) { // Group axes (for stats measured on the same axis)
                        if (axis.id == charGraphData.datasets[statID].yAxisID) {
                            axis.ticks.max = Math.max(axis.ticks.max || 0, charData.stats[stat]);
                        }
                    }
                }
            }
        }
    },
    createOverviewGraph: function() {
        var ctx = document.getElementById("battle-overview-graph");

        this.graph.overview = new Chart(ctx, {
            type: "line",
            data: {
                labels: [],
                datasets: [
                    createBattleDataset("Turn Damage", "rgb(87, 129, 61)", "rgb(87, 129, 61)", "tdmg"),
                    createBattleDataset("Crit Rate", "rgb(61, 79, 129)", "rgb(61, 79, 129)", "crit")
                ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            id: "tdmg",
                            type: "linear",
                            position: "left"
                        },
                        {
                            id: "crit",
                            type: "linear",
                            position: "right"
                        }
                    ]
                }
            }
        });
        this.graphData.overview = this.graph.overview.config.data;
    },
    createCharaGraph: function(char) {
        var ctx = document.getElementsByClassName("battle-char-graph")[char]; // TODO: hhope this works lmao, check if it's always ordered

        this.graph.chars[char] = new Chart(ctx, {
            type: "bar",
            data: {
                labels: [],
                datasets: [
                    createBattleDataset("Turn Damage", "rgb(87, 129, 61)", "rgba(87, 129, 61,0.2)", "tdmg"),
                    // createBattleDataset("Crit Damage", 'rgb(61, 79, 129)', 'rgba(61, 79, 129, 0.2)', "tdmg"),
                    createBattleDataset("Damage Taken", "rgb(134, 25, 54)", "rgba(134, 25, 54, 0.2)", "bdmg")
                ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            id: "tdmg",
                            type: "linear",
                            position: "left",
                            ticks: {suggestedMin: 0}
                        },
                        /*                                {id: 'cdmg',
                                 type: 'linear',
                                 position: "right",
                                 ticks: { suggestedMin: 0}},*/
                        {
                            id: "bdmg",
                            type: "linear",
                            position: "right",
                            ticks: {suggestedMin: 0}
                        }
                    ]
                }
            }
        });
        this.graphData.chars[char] = this.graph.chars[char].config.data;
    },
    setPartyNames: function(party) {
        var eles = document.querySelectorAll(".battle-char-container .battle-char-name");
        party.forEach((entry, idx) => eles[idx].textContent = entry.name); // just hope for consistent selector output lmao
    }
};

function createBattleDataset (stat, color, bgColor, axisID) {
    return {
        label: stat,
        data: [],
        backgroundColor: bgColor,
        borderColor: color,
        borderWidth: 2,
        fill: false,
        yAxisID: axisID
    };
}

function showArchBattle (ev) {
    // BackgroundPage.send("requestArchBattle", ev.target.value);
    BackgroundPage.query("archivedBattle", ev.target.value)
        .then(allTurns => {
            if (allTurns.length) {
                UI.battle.reset();
                UI.battle.setPartyNames(allTurns[0].characters.list);
                for (let turn of allTurns) {
                    UI.battle.update(turn, true);
                }
            }
        });
}