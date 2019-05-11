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
    BUFF_TIMEOUT_MARGIN: 10000, //10s
    currentJst: null,
//    lastReset: null,
    timers: {},
    crewBuffs: [],
    jdBuffs: [],
    tick () {
        Time.update(Time.currentJst, 1);

        let reset = false; //only reset once but continue to check other timers
        for (let timerName in Time.timers) {
            let timer = Time.timers[timerName];
            if (timer.getTime() <= 0) {
                devlog(`Timer ${timerName} has ended.`);
                switch (timerName) {
                    case "maint":
    //                    endMaintTimer();
                        break;
                    case "st1":
                    case "st2":
                        devlog("Syncing for ST.");
                        Time.sync();
                        break;
                    case "weekly":
                        fireEvent(EVENTS.weeklyReset);
//                        reset = true;
                        break;
                    case "monthly":
                        fireEvent(EVENTS.monthlyReset);
//                        reset = true;
                        break;
                    default: //daily. When other resets happen, daily happens too. So we only need to actually reset here, but delayed for loop order.
                        reset = true;
                }
            }
            Time.update(timer, -1);
        }
        if (reset) {
            Time.triggerReset(Time.getLastReset()); //either daily or == daily
            Time.sync();
        }

        reset = []; //Same but check for buffs running out
        for (let i = 0; i < Time.crewBuffs.length; i++) {
            let buff = Time.crewBuffs[i],
                margin = reset.length > 0 ? this.BUFF_TIMEOUT_MARGIN : 0;
            if (buff.time.getTime() <= margin) {
                Time.crewBuffs.splice(i, 1);
                reset.push(buff.name);
                i--;
            }
            else {
                Time.update(buff.time, -1);
            }
        }

        for (let i = 0; i < Time.jdBuffs.length; i++) {
            let buff = Time.jdBuffs[i],
                margin = reset.length > 0 ? this.BUFF_TIMEOUT_MARGIN : 0;
            if (buff.time.getTime() <= margin) {
                Time.jdBuffs.splice(i, 1);
                reset.push(buff.name);
                i--;
            }
            else {
                Time.update(buff.time, -1);
            }
        }
        if (reset.length > 0) {
            showNotif("Buffs running out", {
                text: reset.join(",\n"),
                onclick: () => State.game.navigateTo(GAME_URL.baseGame + "#shop/exchange/trajectory")
            });
            updateUI("syncTime", Time.pack());
        }
    },
    keep () {
        this.currentJst = new Date();
        this.currentJst.convertToJst();
        this.setTimers();
        this.setStrikeTime();
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

        showNotif("Daily reset.", {text: detail});
        fireEvent(EVENTS.dailyReset);
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
    setStrikeTime() {
        if (State.store.strikeTime[1]) {
            let nextSt, hour;
            for (let schedule in State.store.strikeTime) {
                hour = State.store.strikeTime[schedule];
                nextSt = new Date(this.currentJst);

                nextSt.setUTCHours(hour, 0, 0, 0);
                if (hour <= this.currentJst.getUTCHours()) { //Had or having this ST
                    nextSt.setUTCDate(nextSt.getUTCDate() + 1);
                }
                if (hour == this.currentJst.getUTCHours() && !this._stEnd) { //Currently in ST.
                    //Prevent notifying more than once per ST, per boot of Veera.
                    let end = new Date(this.currentJst);
                    end.setUTCHours(end.getUTCHours() + 1, 0, 0);
                    end.setTime(end - this.currentJst);
                    this._stEnd = setTimeout(() => Time._stEnd = false, end.valueOf);

                    showNotif("Strike time!", {text: `For the next ${end.getUTCMinutes()} minute(s), ${end.getUTCSeconds()} seconds.`});
                }
                nextSt.setTime(nextSt - this.currentJst);
                this.timers["st" + schedule] = nextSt;
            }
        }
    },
    setCrewBuffs(json) {
        let h, m, match, timer;
        this.crewBuffs = [];
        for (let buff of json) {
            match = buff.time.match(/(\d+) hr (\d+) min/);
            if (match) {
                h = match[1];
                m = match[2];
                timer = {
                    name: buff.name,
                    time: new Date(0),
                    img: `${GAME_URL.baseGame}${GAME_URL.assets_light}item/support/support_${buff.image}_${buff.level}.png`
                };
                timer.time.setUTCHours(h, m, 0, 0);
                this.crewBuffs.push(timer);
            }
        }
        updateUI("syncTime", this.pack());
        this.orderBuffs(this.crewBuffs);
    },
    setJdBuffs(json) {
        let h, m, match, timer, buff;
        this.jdBuffs = [];
        for (let idx in json) {
            buff = json[idx];
            match = buff.remain_time.match(/(\d+) hr (\d+) min/);
            if (match) {
                h = match[1];
                m = match[2];
                timer = {
                    type: "buff",
                    name: buff.name,
                    level: buff.level,
                    time: new Date(0),
                    img: `${GAME_URL.baseGame}${GAME_URL.assets_light}item/support/${buff.image_path}_${buff.level}.png`
                };
                timer.time.setUTCHours(h, m, 0, 0);
                this.jdBuffs.push(timer);
            }
        }
        updateUI("syncTime", this.pack());
        this.orderBuffs(this.jdBuffs);
    },
    addJdBuff(data) {
        if (data.postData) { //activate
            let pending = this.pendingJdBuff;
            if (data.postData.support_id == pending.id) {
                pending.time = new Date(0);
                pending.time.setUTCHours(parseInt(data.postData.support_time));
                pending.level = data.postData.support_level;
                pending.img = `${GAME_URL.baseGame}${GAME_URL.assets_light}item/support/${pending.img}_${pending.level}.png`;
                this.jdBuffs.push(pending);
                updateUI("syncTime", this.pack());
                this.orderBuffs(this.jdBuffs);
            }
        }
        else if (data.json) { //pending
            this.pendingJdBuff = {
                type: "buff",
                name: data.json.name,
                id: data.json.support_id,
                img: data.json.support_image
            };
        }
    },
    orderBuffs(buffs) {
        buffs.sort((a, b) => a.time.getTime() - b.time.getTime());
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
    convert24 (time, ampm) {
        if (ampm.slice(0,1) == "p") {
            time += 12;
        }
        return time;
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
        for (let b of this.crewBuffs.concat(this.jdBuffs)) {
            times.push({
                type: "buff",
                name: b.name,
                time: this.format(b.time),
                img: b.img,
                delta: -1
            });
        }
        return times;
    }
};

function updStrikeTime (json) {
    let dom = parseDom(json.data);
    let schedule = dom.querySelectorAll(".prt-assault-guildinfo");

    for (let time, num = 0; num < schedule.length; num++) {
        time = schedule[num].getElementsByClassName("prt-item-status")[0];
        time = time.textContent.match(/^(\d) (a|p)/); //Assuming EN game...
        State.store.strikeTime[num + 1] = Time.convert24(parseInt(time[1]), time[2]);
    }

    State.save();
    Time.sync();
}
