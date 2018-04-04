window.Profile = {
    pendants: {
        count: {
            //Here to show the structure cleanly, doesn't actually need to be changed on updates.
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
        
        add: function(json) {
            //TODO: uhh might need more cases?
            var added = json.mbp_info.add_result;
            switch (json.mbp_info.item_id) {
                case "92001": //renown
                    //It only gives a total number, taking into account daily and weekly, but we still have to add them.
                    this.count.renown.daily.current += added['10100'].add_point;
                    this.count.renown.weekly.current += added['10100'].add_point;
                    this.count.renown.sr.current += added['20200'].add_point;
                    this.count.renown.r.current += added['20100'].add_point;
                    this.count.renown.total.current += parseInt(json.mbp_info.article_remain['92001'].number) + json.mbp_info.number; //Using given number to deal with multibox
                    break;
                case "92002": //prestige
                    this.count.prestige.weekly.current += added['10100'].add_point;
                    this.count.prestige.crew.current += added['20300'].add_point;
                    this.count.prestige.total.current = parseInt(json.mbp_info.article_remain['92002'].number) + json.mbp_info.number; //Using given number to deal with multibox
                    break;
            }
            updateUI("updPendants", this.count);
        },
        set: function (json) {
            if (!json.option) {console.log("Error finding pendant info."); return;}
            var pendants = json.option.mbp_limit_info;
            var renown = pendants['92001'];
            var prestige = pendants['92002'];
            this.count = {
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
            updateUI("updPendants", this.count);
        }
    },
    status: {
        ap: {current: 0, max: 0},
        bp: {current: 0, max: 0},
        
        level: 0,
        levelPerc: 0,
        jobLevel: 0,
        exp: 0,
        
        set: function (json) {
            this.ap = {current: json.now_action_point, max: parseInt(json.max_action_point)};
            this.bp = {current: json.now_battle_point, max: json.max_battle_point};
            
            this.level = parseInt(json.level);
            this.levelPerc = parseInt(json.levelGauge.slice(0,-1));
            
            updateUI("updStatus", {ap: this.ap.current, apMax: this.ap.max, bp: this.bp.current, lvl: this.level, lvlP: this.levelPerc});
        }
    }
};