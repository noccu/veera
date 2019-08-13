function logSupportUser(json) {
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
}
