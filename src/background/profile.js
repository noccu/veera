window.Profile = {
    status: {
        ap: {current: 0, max: 0},
        bp: {current: 0, max: 0},

        level: 0,
        levelPerc: 0,
        jobLevel: 0,
        exp: 0
    },
    get currencies() {
        return {
            rupie: Supplies.get(SUPPLYTYPE.rupie, 0),
            cp: Supplies.get(19, 0),
            crystals: Supplies.get(SUPPLYTYPE.crystals, 0),
            casinoChips: Supplies.get(31, 0)
        };
    },
    pendants: {
        renown: {
            total: {current: 0, max: 0},
            daily: {current: 0, max: 0},
            weekly: {current: 0, max: 0},
            sr: {current: 0, max: 0},
            r: {current: 0, max: 0},
        },
        prestige: {
            total: {current: 0, max: 0},
            weekly: {current: 0, max: 0},
            crew: {current: 0, max: 0}
        }
    },
    arcarum: {
        tickets: {current: 0, max: 0},
        points: {current: 0, max: 0}
    },

    setPendants (pendants) {
        var renown = pendants['92001'];
        var prestige = pendants['92002'];
        this.pendants = {
            renown: {
                total: {current: parseInt(renown.article.number), max: parseInt(renown.article.limit)},
                weekly: {current: parseInt(renown.limit_info['10100'].data.weekly.get_number), max: parseInt(renown.limit_info['10100'].data.weekly.get_limit)},
                daily: {current: parseInt(renown.limit_info['10100'].data.daily.get_number), max: parseInt(renown.limit_info['10100'].data.daily.get_limit)},
                sr: {current: parseInt(renown.limit_info['20200'].data.weekly.get_number), max: parseInt(renown.limit_info['20200'].data.weekly.get_limit)},
                r: {current: parseInt(renown.limit_info['20100'].data.weekly.get_number), max: parseInt(renown.limit_info['20100'].data.weekly.get_limit)}
            },

            prestige: {
                total: {current: parseInt(prestige.article.number), max: parseInt(prestige.article.limit)},
                weekly: {current: parseInt(prestige.limit_info['10100'].data.weekly.get_number), max: parseInt(prestige.limit_info['10100'].data.weekly.get_limit)},
                crew: {current: parseInt(prestige.limit_info['20300'].data.weekly.get_number), max:  parseInt(prestige.limit_info['20300'].data.weekly.get_limit)}
            }
        };
        updateUI("updPendants", this.pendants);
    },
    updatePendants (updArr) { //[ { pendantType, limitType, delta }]
        for (let item of updArr) {
            this.pendants[item.pendantType][item.limitType].current += item.delta;
        }
        updateUI("updPendants", this.pendants);
        this.save();
    },
    setCurrencies (dom) {
        let info = dom.querySelector(".prt-info-possessed");
        Supplies.set(new SupplyItem(SUPPLYTYPE.rupie, 0, parseInt(info.children[0].textContent), "Rupie"));
        Supplies.set(new SupplyItem(19, 0, parseInt(info.children[1].textContent), "CP"));
        Supplies.set(new SupplyItem(SUPPLYTYPE.crystals, 0, parseInt(info.children[2].textContent), "Crystals"));

        Supplies.save();
        updateUI("updCurrencies", this.currencies);
    },
    setArca (dom) {
        //TODO: check if arca gives us this in easier fashion
        let info = dom.querySelector("#arcarum-status");
        let text = info.children[0].textContent.split("/");
        this.arcarum.tickets.current = text[0];
        this.arcarum.tickets.max = text[1];
        text = info.children[1].textContent.split("/");
        this.arcarum.points.current = text[0];
        this.arcarum.points.max = text[1];

        updateUI("updArca", this.arcarum);
    },
    setStatus (status) {
        this.status.ap = {
            current: status.now_action_point,
            max: parseInt(status.max_action_point)
        };
        this.status.bp = {
            current: status.now_battle_point,
            max: status.max_battle_point
        };

        this.status.level = parseInt(status.level);
        this.status.levelPerc = parseInt(status.levelGauge.slice(0, -1));

        updateUI("updStatus", this.status);
    },
    setCasino(json){
        if (json.data) {
            let dom = parseDom(json.data);
            let ele = dom.querySelector(".prt-having-medal .txt-value");
            if (ele) {
                let chips = parseInt(ele.getAttribute("value"));
                Supplies.set( new SupplyItem(31, 0, chips, "Casino medals") );
                Supplies.save();
                updateUI("updCurrencies", this.currencies);
            }
        }
    },
    update (json) {
        //Sometimes returns no info, like on gacha banners or other redirects.
        if (json.data) { //Currencies & arca
            let dom = parseDom(json.data);
            this.setCurrencies(dom);
            this.setArca(dom);
        }

        let status = json.status;
        if (json.option) {
            if (!status && json.option.mydata_assets && json.option.mydata_assets.mydata) {
                status = json.option.mydata_assets.mydata.status;
            }

            //Pendants
            if (json.option.mbp_limit_info) {
                this.setPendants(json.option.mbp_limit_info);
            }
        }

        //Status
        if (status) {
            this.setStatus(status);
        }
        Profile.save();
    },
    save () {
        Storage.set({
            profile: {
//                status: this.status,
                pendants: this.pendants,
                arcarum: this.arcarum
            }
        });
        devlog("Profile saved.");
    },
    load () {
        return new Promise((r,x) => {
            function _load(data) {
                if (data.profile) {
                    for (let key in data.profile) {
                        Profile[key] = data.profile[key];
                    }
                }
                else {
                    console.warn("Could not load Profile data. Visit home page to initialize most of it.");
                }
                r();
            }
            try {
                Storage.get("profile", _load);
            }
            catch (e) {
                console.error(e);
                x("Failed to load Profile.");
            }
        });
    }
};

function getPendantsRaid (json) {
    //TODO: uhh might need more cases?
    if (json.mbp_info && json.mbp_info.add_result) {
        var added = json.mbp_info.add_result;
        switch (json.mbp_info.item_id) {
            case "92001": //renown
                //It only gives a total number, taking into account daily and weekly, but we still have to add them.
                Profile.updatePendants([
                    {pendantType: "renown", limitType: "daily", delta: added['10100'].add_point},
                    {pendantType: "renown", limitType: "weekly", delta: added['10100'].add_point},
                    {pendantType: "renown", limitType: "sr", delta: added['20200'].add_point},
                    {pendantType: "renown", limitType: "r", delta: added['20100'].add_point},
                    {pendantType: "renown", limitType: "total", delta: parseInt(json.mbp_info.article_remain['92001'].number) + json.mbp_info.number} //Using given number to deal with multibox
                ]);
                break;
            case "92002": //prestige
                Profile.updatePendants([
                    {pendantType: "prestige", limitType: "weekly", delta: added['10100'].add_point},
                    {pendantType: "prestige", limitType: "crew", delta: added['20300'].add_point},
                    {pendantType: "prestige", limitType: "total", delta: parseInt(json.mbp_info.article_remain['92002'].number) + json.mbp_info.number} //Using given number to deal with multibox
                ]);
                break;
        }
    }
}
