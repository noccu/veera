/*globals BackgroundPage: true*/
window.UI = {
    getTheme: function() {
        BackgroundPage.send({
            query: "theme"
        });
    },
    setTheme: function (theme) {
        var sheet = document.getElementById("theme");
        if (!theme.fname) {console.log("No theme file given, using default."); theme.fname = "night";}
        sheet.href = `../stylesheets/${theme.fname}.css`;
    },

    //Input: {id, value} optionally in Array
    //Updates every id in upd with the given value.
    setValue: function (upd) {
        if (Array.isArray(upd)) {
            for (let entry of upd) {
                this.setValue({id: entry.id, value: entry.value});
            }
        }
        else {
            var ele = document.getElementById(upd.id);
            ele.textContent = upd.value;
        }
    },
    
    switchNav: function (ev) {
        if (!ev.target.dataset.navpage) {return;}
        var oldNav = this.getElementsByClassName("active")[0];
        oldNav.classList.remove("active");
        var oldTab = document.getElementById(oldNav.dataset.navpage); 
        oldTab.classList.remove("active");

        ev.target.classList.add("active");
        document.getElementById(ev.target.dataset.navpage).classList.add("active");
    },
    initButtons: function () {
        var nl = document.getElementsByClassName("navlist");
        for (let nav of nl) {
            nav.addEventListener("click", this.switchNav);
        }
    }
};
