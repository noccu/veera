window.State = {
    DEBUG: true,
    
    options: {
        theme: {
            list: [
                {name: "Tiamat Night", fname: "night"},
                {name: "Anichra Day", fname: "day"}
                ],
            get current() {
                return this.list[this._current];
            },
            set current(idx) {
                this._current = idx;
            }
            //set: function(n) {this.current = n};
        },
        raids: {
            sortByDiff: true
        }
    },
    
    freeRollEvent: false,

}