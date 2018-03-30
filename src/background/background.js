console.log("Onee-sama?");

DevTools.init(); //Listen for devtools conn

//Helper function
function matchURL(url, match) {
    return url.indexOf(match) != -1;
}

function hearMessageDT (data) {
    //console.log("Processing:", data);
    if (data.request) {
        url = data.request.url;
        if (matchURL(url, "user/content/index"))
        {
            Profile.setPendants(data.request.json);
        }
    }
}
