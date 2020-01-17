window.Tools = {
    logSupportUser(json) {
        if (json.popup_data.supporter_user && json.popup_data.supporter_user.level) {
            let d = json.popup_data.supporter_user;
            updateUI("logSupport", {
                summon: d.summon_name,
                rank: d.level,
                user: d.name || "Unknown",
                id: d.request_user_id,
                url: `#profile/${d.request_user_id}`,
                viewer: d.viewer_id
            });
        }
    },
    sparkProgress: {
        init() {
            window.addEventListener(EVENTS.suppliesUpdated, this.evhSuppliesChange.bind(this));
            this.evhSuppliesChange(); // update ui
        },
        evhSuppliesChange() {
            if (this.startDate || this.reset()) {
                updateUI("updSparkProgress", Tools.sparkProgress.calculate());
            }
        },
        calculate() {
            // calc in days to help float/rounding margins
            let {crystalValue, ticketValue} = this.getValues();
            let startValue = this.startCrystalValue + this.startTicketValue,
                current = crystalValue + ticketValue,
                gained = current - startValue;

            if (gained < 0) {
                printWarn("Spark progress auto-reset triggered.");
                this.reset();
                return this.calculate();
            }

            let daysElapsed = (Date.now() - this.startDate.getTime()) / 86400000;
            let avgCrystals = safeDivide(gained, Math.max(daysElapsed, 1));
            let needed = 90000 - current;
            let eta = new Date(Date.now() + Math.floor(safeDivide(needed, avgCrystals)) * 86400000).toLocaleDateString(navigator.languages, {dateStyle: "long"});

            return {
                time: daysElapsed | 0,
                avg: avgCrystals | 0,
                needed,
                eta
            };
        },
        getValues() {
            let crystalValue = 0, ticketValue = 0,
                crystals, tickets;

            // Safer step by step calc for newer players or any cases where no items exist yet.
            crystals = Supplies.get(SUPPLYTYPE.crystals, 0);
            if (crystals) { crystalValue = crystals.count }
            tickets = Supplies.get(SUPPLYTYPE.drawTickets, 20011);
            if (tickets) { ticketValue = tickets.count * 300 }

            tickets = Supplies.get(SUPPLYTYPE.drawTickets, 20010);
            if (tickets) { ticketValue += tickets.count * 3000 }

            return {
                crystalValue,
                ticketValue
            };
        },
        save() {
            Storage.set({
                sparkProgress: {
                    startDate: this.startDate.getTime(),
                    startCrystalValue: this.startCrystalValue,
                    startTicketValue: this.startTicketValue
                }
            });
        },
        load() {
            return new Promise((r, x) => {
                function _load(data) {
                    if (data.sparkProgress) {
                        Tools.sparkProgress.startDate = new Date(data.sparkProgress.startDate);
                        Tools.sparkProgress.startCrystalValue = data.sparkProgress.startCrystalValue;
                        Tools.sparkProgress.startTicketValue = data.sparkProgress.startTicketValue;

                        console.info("Spark data loaded.");
                    }
                    else {
                        console.warn("No spark data found.");
                    }
                    Tools.sparkProgress.init();
                    r();
                }
                try {
                    Storage.get("sparkProgress", _load);
                }
                catch (e) {
                    deverror(e);
                    x("Failed to load spark data.");
                }
            });
        },
        reset() {
            if (State.store.isInit.home && State.store.isInit.tickets) {
                let {crystalValue, ticketValue} = this.getValues();
                this.startCrystalValue = crystalValue;
                this.startTicketValue = ticketValue;
                this.startDate = new Date();
                this.save();
                return true;
            }
            else {
                printWarn("[Spark progress] Crystals or tickets are not initialized.", "Visit supplies -> tickets and/or the homepage.");
                return false;
            }
        }
    },
    roomNameGen: {
        rooms: [
            {name: "BahaHL -> Akasha", room: "つよばは→アーカーシャ"},
            {name: "Astaroth", room: "アスタ"},
            {name: "Chaos Beast (Darkblades)", room: "EX6-1"},
            {name: "Levi Malice", room: "リヴァイアサンマリス"},
            {name: "Slime", room: "スラ爆"},
            {name: "Creeds", room: "信念集め"},
            {name: "Dailies", room: "デイリー"},
            {name: "-----", room: ""}
        ],
        optsList: [
            {name: "Bring TH", opt: "トレハン募集"},
            {name: "No Dancer", opt: "ダンサー禁止"},
            {name: "No Chrysaor", opt: "クリュ禁止"},
            {name: "Don't Leech", opt: "ワンパン禁止"},
            {name: "Weak Host", opt: "主弱"},
            {name: "MVP Free (Racing OK)", opt: "M自由"},
            {name: "Have Para extend", opt: "麻痺延長"},
            {name: "Have Break extend", opt: "ブレキ"},
            {name: "Thor at 70%", opt: "主70ト"},
            {name: "Thor at 30%", opt: "主30ト"},
            {name: "Thor at 10%", opt: "主10ト"},
            {name: "Hosting AFK", opt: "自発放置"},
            {name: "Practice run", opt: "練習"},
            {name: "Earth for labor 7", opt: "土７"},
            {name: "Dark for labor 7", opt: "闇７"}
        ],
        details: {
            Water: "水",
            Fire: "火",
            Wind: "風",
            Earth: "土",
            Dark: "闇",
            Light: "光"
        },
        // UI sends back raid and opts as array indexes
        generateName(data) {
            let {raid, reps, minRank, maxRank, opts, hostDetail, reqDetail} = data;

            if (opts.length) { opts = opts.reduce((a, v) => a + ` ${this.optsList[v].opt}`, "") }
            if (hostDetail.length) { hostDetail = hostDetail.reduce((a, v) => a + `${this.details[v]}`, "主") }
            if (reqDetail.length) { reqDetail = reqDetail.reduce((a, v) => a + `${this.details[v]}`, "@") }

            return `${this.rooms[raid].room}${reps && reps != "0" ? ` ${reps}連` : ""}${minRank && minRank != "0" ? ` ${minRank}↑` : ""}${maxRank && maxRank != "0" ? ` ${maxRank}↓` : ""} ${hostDetail}${reqDetail} ${opts}`;
        },
        init() {
            RaidList.forEach(v => {
                if (v.jName) {
                    this.rooms.push({name: v.name, room: v.jName});
                }
            });
            return {rooms: this.rooms, opts: this.optsList, details: this.details};
        }
    }
};