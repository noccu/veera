window.DEBUG = true; //TODO: remove/replace with proper thing

//Start logging network requests.
BackgroundPage.connect();

//TODO: Query options and adjust UI.
//...

Network.listen();

// chrome.runtime.sendMessage({query: "theme"}, setTheme;)

UI.getTheme();


// Browser.runtime.onMessage.addListener( request => new Promise( resolve => {
    // if( !request || typeof request !== 'object' || request.type !== "getUrls" ) return;

    // $.ajax({
        // 'url': "http://localhost:3000/urls",
        // 'method': 'GET'
    // }).then( urls => { resolve({ urls }); });
// }) );