window.Planner = {
    createPlan: function (series, wtype, element, start, end) {
        console.groupCollapsed(`Creating plan for ${series}`);
        var plan = [];

        function addToPlan(item, templateKey) {
            function addById(id, needed) {
                let plannedItem = plan.find(p => p.id == id);
                if (plannedItem) {
                    plannedItem.needed += needed;
                }
                else {
                    let newItem = Supplies.get(item.type, id) || new SupplyItem(item.type, id);
                    newItem.needed = needed;
                    plan.push(newItem);
                }
            }

            let id = item.id;
            //Dealing with templates
            if (item.isTemplate) {
                //Multi-mapped typeNames
                if (Array.isArray(templateKey)) {
                    for (let key of templateKey) {
                        if (item.id[key]) {
                            templateKey = key;
                            break;
                        }
                    }
                }
                id = item.id[templateKey];
            }
            //Multi-item teplates
            let needed = item.needed;
            if (Array.isArray(id)) {
                needed /= id.length;
                for (let itemId of id) {
                    addById(itemId, needed);
                }
            }
            else {
                addById(id, needed);
            }
        }

        for (let category of Object.keys(PlannerData[series])) {
             let itemArray,
                 templateKey;
             switch (category) {
                 case "core":
                     itemArray = PlannerData[series].core;
                     break;
                 case "wtype":
                     itemArray = PlannerData[series].wtype[wtype] || [];
                     if (PlannerData[series].wtype.templates) {
                         itemArray = itemArray.concat(PlannerData[series].wtype.templates);
                     }
                     templateKey = PlannerData[series].typeNames ? PlannerData[series].typeNames[wtype] : wtype;
                     break;
                 case "element":
                     itemArray = PlannerData[series].element[element] || [];
                     itemArray = itemArray.concat(PlannerData[series].element.templates);
                     templateKey = element;
                     break;
                 case "typeNames":
                 case "stepNames":
                     continue;
                 default:
                     deverror("[Planner] Invalid plan category: ", category);
                     return;
             }

            if (itemArray) {
                for (let item of itemArray) {
                    if (item == null) { continue; }
                    if (start < item.step && item.step <= end) { //start is exclusive (we already have it!)
                        addToPlan(item, templateKey);
                    }
                }
            }
        }

        console.groupEnd();
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


//DBG/Build data: Find by name, use with Supply
function fi(s){
    var search = new RegExp(s, "i");
    var ret = [];

    function f(obj, type) {
        for (let key of Object.keys(obj)) {
            let item = obj[key];
            if (item.hasOwnProperty("name") && search.test(item.name)) {
                let kind = ITEM_KIND[type] ? `${ITEM_KIND[type].name}/${ITEM_KIND[type].class}` : "Unknown!";
                ret.push(`${item.name} from ${kind} (type: ${type}) is ${key}`);
            }
            else if (typeof item == "object"){
                f(item, key);
            }
        }
    }

    f(Supplies.index);
    return ret.join("\n");
}