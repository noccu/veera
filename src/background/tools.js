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
            let sparkValue = 90000;
            let sparkReady = Math.trunc(current / sparkValue);

            if (gained < 0) {
                printWarn("Spark progress auto-reset triggered.");
                this.reset();
                return this.calculate();
            }

            let daysElapsed = (Date.now() - this.startDate.getTime()) / 86400000;
            let avgCrystals = safeDivide(gained, Math.max(daysElapsed, 1));
            let needed = sparkValue * (sparkReady + 1) - current;
            let eta = new Date(Date.now() + Math.floor(safeDivide(needed, avgCrystals)) * 86400000).toLocaleDateString(navigator.languages, {dateStyle: "long"});

            return {
                ready: sparkReady,
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
    }
};