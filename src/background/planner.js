window.Planner = {
    createPlan: function (series, wtype, element, start, end) {
        var plan = [];

        //find() function checks if given id(this) is already in plan (p)
        function equalID(p) {
            return p.id == this;
        }

        for (let key of Object.keys(PlannerData[series])) {
             let id,
                 itemArray,
                 templateKey,
                 t;
             switch (key) {
                 case "core":
                     itemArray = PlannerData[series].core;
                     break;
                 case "wtype":
                     t = PlannerData[series].wtype.templates || [];
                     itemArray = t.concat(PlannerData[series].wtype[wtype]);
                     templateKey = PlannerData[series].typeNames ? PlannerData[series].typeNames[wtype] : wtype;
                     break;
                 case "element":
                     t = PlannerData[series].element.templates || [];
                     itemArray = t.concat(PlannerData[series].element[element]);
                     templateKey = element;
                     break;
                 case "typeNames":
                 case "stepNames":
                     continue;
                 default:
                     deverror("Internal data error (Planner). Given: ", key);
                     return;
             }

            if (itemArray) {
                for (let item of itemArray) {
                    if (item == null) { continue; }
                    if (start < item.step && item.step <= end) { //start is exclusive (we already have it!)
                        id = item.isTemplate ? item.id[templateKey] : item.id; //Dealing with templates
                        var plannedItem = plan.find(equalID, id);
                        if (plannedItem) {
                            plannedItem.needed += item.needed;
                        } else {
                            var supplydata = Supplies.get(item.type, id);
                            if (supplydata) {
                                supplydata.needed = item.needed;
                                plan.push(supplydata);
                            }
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