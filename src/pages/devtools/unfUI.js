window.UI.unf = {
    areaInfo: {
        graph: null,
        logging: false,
        init: function() {
            document.getElementById("unf-graph-start").addEventListener("click", () => BackgroundPage.send("controlUnf", {cmd: "startLog"}));
            document.getElementById("unf-graph-stop").addEventListener("click", () => BackgroundPage.send("controlUnf", {cmd: "stopLog"}));
            document.getElementById("unf-graph-save").addEventListener("click", () => BackgroundPage.send("controlUnf", {cmd: "save"}));
            document.getElementById("unf-graph-load").addEventListener("click", () => BackgroundPage.send("controlUnf", {cmd: "load"}));
            document.getElementById("unf-graph-upd").addEventListener("click", () => BackgroundPage.send("controlUnf", {cmd: "getUnfData"}));
        },
        create: function() {
            var ctx = document.getElementById("unf-area-chart").getContext("2d");

            this.graph = new Chart(ctx, {
                type: "line",
                data: {
                    labels: [],
                    datasets: [
                        createUnfDataset("North", "rgb(87, 129, 61)"),
                        createUnfDataset("West", "rgb(98, 98, 75)"),
                        createUnfDataset("East", "rgb(61, 79, 129)"),
                        createUnfDataset("South", "rgb(129, 61, 61)")
                    ]
                },
                options: {elements: {line: {tension: 0}}}
            });
        },
        update: function({pts: honors, times}) {
            if (!this.graph) { this.create() }

            for (let i = 0; i < honors.length; i++) {
                this.graph.config.data.datasets[i].data = honors[i];
            }
            this.graph.config.data.labels = times;
            this.graph.update();
        }
    }
};

function createUnfDataset(area, color) {
    return {
        label: area,
        data: [],
        borderColor: color,
        borderWidth: 1,
        fill: false
    };
}
