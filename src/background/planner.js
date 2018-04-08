/*globals PlannerData:true, SUPPLYTYPE, Supplies*/

window.PlannerData = {
    Bahamut: {
        core: [ //Items needed for every craft
                createItem(1, SUPPLYTYPE.treasure, 59, 1),

                //Nova
                createItem(2, SUPPLYTYPE.treasure, 59, 3),
                createItem(2, SUPPLYTYPE.treasure, 1, 7),
                createItem(2, SUPPLYTYPE.treasure, 1111, 30),
                createItem(2, SUPPLYTYPE.treasure, 1121, 30),
                createItem(2, SUPPLYTYPE.treasure, 1131, 30),
                createItem(2, SUPPLYTYPE.treasure, 1141, 30),
                createItem(2, SUPPLYTYPE.treasure, 1151, 30),
                createItem(2, SUPPLYTYPE.treasure, 1161, 30),

                //Coda
                createItem(3, SUPPLYTYPE.treasure, 79, 5),
                createItem(3, SUPPLYTYPE.treasure, 2003, 3)
                ],
        wtype: { //Weapon type specific items
                Sword: [createItem(2, SUPPLYTYPE.treasure, 47, 20)],
                Dagger: [createItem(2, SUPPLYTYPE.treasure, 51, 20)],
                Spear: [createItem(2, SUPPLYTYPE.treasure, 32, 20)],
                Axe: [createItem(2, SUPPLYTYPE.treasure, 49, 20)],
                Staff: [createItem(2, SUPPLYTYPE.treasure, 50, 20)],
                Gun: [createItem(2, SUPPLYTYPE.treasure, 47, 20)],
                Fist: [createItem(2, SUPPLYTYPE.treasure, 49, 20)],
                Bow: [createItem(2, SUPPLYTYPE.treasure, 32, 20)],
                Harp: [createItem(2, SUPPLYTYPE.treasure, 48, 20)],
                Katana: [createItem(2, SUPPLYTYPE.treasure, 48, 20)]
               },
        element: {
            Dark: null //no special items, but name needed for option parsing (well not really, but it's nice)
        },
        stepNames: ["Rusted", "Base", "Nova", "Coda"] //In order starting from 0, which is the true starting (not part of the craft) step
        }
};

function createItem(step, type, id, needed) {
    return {step, type, id, needed};
}


window.Planner = {
    createPlan: function (series, wtype, element, start, end) {
        var plan = [];

        //find() function for duplicate items in steps (this) in planned items (entry)
        function equalID(entry) {
            return entry.id == this.id;
        }

        for (let key of Object.keys(PlannerData[series])) {
             var itemArray;
             switch (key) {
                case "core":
                    itemArray = PlannerData[series].core;
                     break;
                case "wtype":
                    itemArray = PlannerData[series].wtype[wtype];
                    break;
                case "element":
                    itemArray = PlannerData[series].element[element];
                    break;
                 case "stepNames":
                     continue;
                default:
                    console.error("Internal data error (Planner). Given: ", key);
                    return;
            }

            if (itemArray) {
                 for (let item of itemArray) {
                    if (start < item.step) { //start is exclusive (we already have it!)
                        if (item.step <= end) { //see else
                            var plannedItem = plan.find(equalID, item);
                            if (plannedItem) {
                                plannedItem.needed += item.needed;
                            }
                            else {
                                var supplydata = Supplies.getData(item.type, item.id);
                                plan.push({type: item.type,
                                           id: item.id,
                                           name: supplydata.name,
                                           needed: item.needed,
                                           current: supplydata.count
                                          });
                            }
                        }
                        else {  //early term when not finished build
                            break;
                        }
                    }
                 }
            }
        }

        return plan;
    },
    listSeries: function() {
        return Object.keys(PlannerData);
    },
    listTypes: function(series) {
        if (PlannerData[series]) {
            return Object.keys(PlannerData[series].wtype);
        }
    },
    listElements: function(series) {
        if (PlannerData[series]){
            return Object.keys(PlannerData[series].element);
        }
    },
    listSteps: function(series) {
        if (PlannerData[series]) {
            return PlannerData[series].stepNames;
        }
    },
    getSeriesOptions: function (series) {    
        return {types: this.listTypes(series),
                elements: this.listElements(series),
                steps: this.listSteps(series)};
    }
};


//Find by name, use with Supply
//TODO: change temp1 to global supply
/*function fi(s){
    var ret = []; 
    for (let item in temp1) {
        if(temp1.hasOwnProperty(item)&&temp1[item].name.toLowerCase().indexOf(s)!=-1){
            ret.push(temp1[item].name);
            ret.push(item);
        }
    } 
    return ret;
}*/