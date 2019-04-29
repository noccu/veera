/*
This file keeps timing, timer, alerts, etc functionality.
It works by modifying a Date object such that UTC functions return JST time, and working entirely in assumption of JST.
This means the actual unix timestamp is invalid for any use that doesnt take this into account.
*/

Date.prototype.convertToJst = function () {
    this.setUTCHours(this.getUTCHours() + 9);
};
Date.prototype.convertFromJst = function () {
    this.setUTCHours(this.getUTCHours() - 9);
};

window.Time = {
    SYNC_INTERVAL: 43200000, //12h
    currentJst: null,
//    lastReset: null,
    timers: {},
    crewBuffs: [],
    tick () {
        Time.update(Time.currentJst, 1);

        for (let timer in Time.timers) {
            if (Time.timers[timer].getTime() <= 0) {
                if (timer == "maint") {
//                    endMaintTimer();
                    continue; //check other timers
                }
                else {
                    devlog("Resetting based on " + timer);
                    Time.triggerReset(Time.getLastReset()); //either daily or == daily
//                    Time.setTimers();
                    Time.sync();
                    break; //only reset once
                }
            }
            Time.update(Time.timers[timer], -1);
        }

        for (let buff of Time.crewBuffs) {
            Time.update(buff.time, -1);
        }
    },
    keep () {
        this.currentJst = new Date();
        this.currentJst.convertToJst();
        this.setTimers();
        this.tock = setInterval(this.tick, 1000);
        setTimeout(this.sync, this.SYNC_INTERVAL);
        updateUI("syncTime", this.pack());
    },
    update (time, deltaSeconds) {
        time.setUTCSeconds(time.getUTCSeconds() + (deltaSeconds || 1));
    },
    sync () {
        console.log("Syncing time.");
        if (Time.tock) {
            clearInterval(Time.tock);
        }
        Time.keep();
    },
    triggerReset (lastReset, detail) {
//        this.lastReset = lastReset.getTime();
//        this.save();
        State.store.lastReset = lastReset.getTime();
        State.save();

        showNotif("Daily reset.", detail);
        window.dispatchEvent(new Event(EVENTS.dailyReset));
    },
    setTimers () {
        let current = this.currentJst;

        let daily = this.getNextReset();
        let weekly = new Date(daily);
        let monthly = new Date(daily);

        //Weekly
        if (current.getUTCDay() === 0) { //sunday
            weekly.setUTCDate(current.getUTCDate() + 1);
        }
        else if (current.getUTCDay() != 1 || current.getUTCHours() >= 5) {
            weekly.setUTCDate(current.getUTCDate() + (8 - current.getUTCDay()));
        } //Else weekly == daily
        //Monthly
        if (current.getUTCDate() > 1 || current.getUTCHours() >= 5) {
            monthly.setUTCDate(1);
            monthly.setUTCMonth(current.getUTCMonth() + 1);
        } //Else monthly == daily

        this.timers.daily = new Date(daily - current);
        this.timers.weekly = new Date(weekly - current);
        this.timers.monthly = new Date(monthly - current);
    },
    setStrikeTime(time) {
        //            this.timers.strike.a = new Date(time[0] - current);
        //            this.timers.strike.b = new Date(time[1] - current);
    },
    getLastReset() {
        let time = new Date(this.currentJst);
        if (time.getUTCHours() < 5) {
            time.setUTCDate(time.getUTCDate() - 1);
        }
        time.setUTCHours(5, 0, 0, 0);
        return time;
    },
    getNextReset() {
        let time = new Date(this.currentJst);
        if (time.getUTCHours() >= 5) {
            time.setUTCDate(time.getUTCDate() + 1);
        }
        time.setUTCHours(5, 0, 0, 0);
        return time;
    },
    //Check if resets happened while inactive
    checkReset () {
        console.log("Checking time since reset.");
        let lastReset = State.store.lastReset;
        if (!lastReset) { //init & save a new date
            //Need to set this here in case reset is never triggered normally. i.e. Veera is never active at 5 JST
            lastReset = this.getLastReset();
            this.triggerReset(lastReset, "First run initialization: creating a reference point.\nThis shouldn't show again.");
        }
        else {
            lastReset = new Date(lastReset); //create date obj from timestamp
            if (this.currentJst - lastReset > 86400000) {
                devlog("Reset happened while Veera sleeping...");
                lastReset = this.getLastReset();
                this.triggerReset(lastReset, "Happened while inactive.");
            }
        }
    },
    format (time) {
        return time.getTime();
//        return {
//            d: time.getUTCDate() - 1,
//            h: ('0' + time.getUTCHours()).slice(-2),
//            m: ('0' + time.getUTCMinutes()).slice(-2),
//            s: ('0' + time.getUTCSeconds()).slice(-2)
//        };
    },
    pack () {
        let times = [];
        
        let jst = {type: "jst", name: "jst", delta: 1};
        jst.time = this.format(this.currentJst);
        times.push(jst);
        for (let t in this.timers) {
            times.push({
                type: "timer",
                name: t,
                time: this.format(this.timers[t]),
                delta: -1
            });
        }
        for (let b of this.crewBuffs) {
            times.push({
                type: "buff",
                name: b.name,
                time: this.format(b),
                delta: -1
            });
        }
        return times;
    }
};
