window.Profile = {
    setPendants: function(json) {
        DevTools.send({
            action: "updatePendants", 
            method: "set", 
            value: parsePendants(json)
        });
    }
};

function parsePendants(json) {
    if (!json.option) {console.log("Error finding pendant info."); return;}
    var pendants = json.option.mbp_limit_info;
    var renown = pendants['92001'];
    var prestige = pendants['92002'];
    
    return {
        renown: {
            total: parseInt(renown.article.number), 
            weekly: parseInt(renown.limit_info['10100'].data.weekly.get_number), 
            daily: parseInt(renown.limit_info['10100'].data.daily.get_number)
            },
        renown_sr: parseInt(renown.limit_info['20200'].data.weekly.get_number),
        renown_r: parseInt(renown.limit_info['20100'].data.weekly.get_number),
        
        prestige: parseInt(prestige.limit_info['10100'].data.weekly.get_number),
        prestige_crew: parseInt(prestige.limit_info['20300'].data.weekly.get_number)
    };
}