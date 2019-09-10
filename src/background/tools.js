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
            window.addEventListener(EVENTS.suppliesUpdated, this.evhSuppliesChange);
            if (!this.startDate) { this.reset() }
            this.evhSuppliesChange(); // update ui
        },
        evhSuppliesChange() {
            updateUI("updSparkProgress", Tools.sparkProgress.calculate());
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
            let crystalValue, ticketValue;
            try {
                crystalValue = Supplies.get(SUPPLYTYPE.crystals, 0).count;
                ticketValue = Supplies.get(SUPPLYTYPE.drawTickets, 20011).count * 300 + Supplies.get(SUPPLYTYPE.drawTickets, 20010).count * 3000;
            }
            catch (e) {
                printWarn("Couldn't find crystals or tickets. Update supplies?");
                devwarn(e);
                crystalValue = ticketValue = 0;
            }
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
            let {crystalValue, ticketValue} = this.getValues();
            this.startCrystalValue = crystalValue;
            this.startTicketValue = ticketValue;
            this.startDate = new Date();
            this.save();
        }
    }
};