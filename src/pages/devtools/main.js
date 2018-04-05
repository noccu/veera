window.DEBUG = true; //TODO: remove/replace with proper thing

//Start logging network requests.
BackgroundPage.connect();
Network.listen();

//TODO: Query options and adjust UI.
// chrome.runtime.sendMessage({query: "theme"}, setTheme;)
UI.getTheme();


function switchNav (ev) {
    if (!ev.target.dataset.navpage) {return;}
    var oldNav = this.getElementsByClassName("active")[0];
    oldNav.classList.remove("active");
    var oldTab = document.getElementById(oldNav.dataset.navpage); 
    oldTab.classList.remove("active");
    
    ev.target.classList.add("active");
    document.getElementById(ev.target.dataset.navpage).classList.add("active");
}

function initButtons () {
     var nl = document.getElementsByClassName("navlist");
    for (let nav of nl) {
        nav.addEventListener("click", switchNav);
    }
}

initButtons();

// Browser.runtime.onMessage.addListener( request => new Promise( resolve => {
    // if( !request || typeof request !== 'object' || request.type !== "getUrls" ) return;

    // $.ajax({
        // 'url': "http://localhost:3000/urls",
        // 'method': 'GET'
    // }).then( urls => { resolve({ urls }); });
// }) );