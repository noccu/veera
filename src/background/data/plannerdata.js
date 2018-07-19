/*globals SUPPLYTYPE*/

//Templates
const PLANNER_TEMPLATES = {
    orbs: {
        low: {
            type: SUPPLYTYPE.treasure,
            fire: 1011,
            water: 1021,
            earth: 1031,
            wind: 1041,
            light: 1051,
            dark: 1061
        },
        high: {
            type: SUPPLYTYPE.treasure,
            fire: 1012, 
            water: 1022, 
            earth: 1032,
            wind: 1042,
            light: 1052,
            dark: 1062,
        }
    },
    whorls: {
        type: SUPPLYTYPE.treasure,
        fire: 1313, 
        water: 1323, 
        earth: 1333,
        wind: 1343,
        light: 1353,
        dark: 1363
    },
    tomes: {
        type: SUPPLYTYPE.treasure,
        fire: 1311, 
        water: 1321, 
        earth: 1331,
        wind: 1341,
        light: 1351,
        dark: 1361
    },
    scrolls: {
        type: SUPPLYTYPE.treasure,
        fire: 1312, 
        water: 1322, 
        earth: 1332,
        wind: 1342,
        light: 1352,
        dark: 1362
    },
    stones: {
        type: SUPPLYTYPE.treasure,
        axe: 4041,
        sword: 4011,
        
    }
};

function createItem(step, type, id, needed) {
    return {
        step,
        type,
        id,
        needed
    };
}

function supplyTemplate (step, template, needed) {
    return {
        step,
        type: template.type,
        id: template,
        needed
    };
}

function createItemFromTemplate(templateItem, key) {
    templateItem.id = templateItem.id[key];
    return templateItem;
}

/*function templateItem(step, template, type, needed) {
    return {
        step,
        type: template.type,
        id: template[type],
        needed
    };
}*/

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
    },

    Class: {
        core: [ //Items needed for every craft
             createItem(1, SUPPLYTYPE.treasure, 54, 40),
             createItem(1, SUPPLYTYPE.treasure, 1201, 200),
             createItem(1, SUPPLYTYPE.treasure, 1, 5),
             //Rebuild
             createItem(2, SUPPLYTYPE.treasure, 1201, 120),
             createItem(2, SUPPLYTYPE.treasure, 2001, 30),
             createItem(2, SUPPLYTYPE.evolution, 20003, 2),
             createItem(2, SUPPLYTYPE.treasure, 1, 5),
             //Elechange
             createItem(3, SUPPLYTYPE.treasure, 107, 3),
             createItem(3, SUPPLYTYPE.treasure, 1, 15),
             
             createItem(4, SUPPLYTYPE.treasure, 20771, 3),
             createItem(4, SUPPLYTYPE.treasure, 79, 1),
             createItem(4, SUPPLYTYPE.treasure, 1, 20),
             createItem(4, SUPPLYTYPE.treasure, 107, 3),
        ],
        wtype: { //Weapon type specific items
            Avenger: [createItem(1, SUPPLYTYPE.treasure, 20611, 70),
                      createItem(1, SUPPLYTYPE.treasure, 1311, 70),
                      createItem(1, SUPPLYTYPE.treasure, 20211, 10),
                      createItem(1, SUPPLYTYPE.treasure, 20111, 30),
                      createItem(2, SUPPLYTYPE.treasure, 20411, 10),
                      createItem(2, SUPPLYTYPE.treasure, 4041, 256),
                      createItem(2, SUPPLYTYPE.treasure, 5011, 50), 
                      createItem(2, SUPPLYTYPE.treasure, 20211, 25),
                      createItem(3, SUPPLYTYPE.treasure, 20411, 30),
//                      createItem(3, SUPPLYTYPE.treasure, 4041, 512),
//                      templateItem(3, PLANNER_TEMPLATES.stones, "axe", 512),
                      createItem(4, SUPPLYTYPE.treasure, 4041, 255),
                      createItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Skofnung: [createItem(1, SUPPLYTYPE.treasure, 20621, 70),
                       createItem(1, SUPPLYTYPE.treasure, 1321, 70),
                       createItem(1, SUPPLYTYPE.treasure, 20211, 10),
                       createItem(1, SUPPLYTYPE.treasure, 20121, 30),
                       createItem(2, SUPPLYTYPE.treasure, 20421, 10),
                       createItem(2, SUPPLYTYPE.treasure, 4011, 256),
                       createItem(2, SUPPLYTYPE.treasure, 5021, 50),
                       createItem(2, SUPPLYTYPE.treasure, 20211, 25),
                       createItem(3, SUPPLYTYPE.treasure, 20421, 30),
                       createItem(3, SUPPLYTYPE.treasure, 4011, 512),
                       createItem(4, SUPPLYTYPE.treasure, 4011, 255),
                       createItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Ipetam: [createItem(1, SUPPLYTYPE.treasure, 20661, 70),
                     createItem(1, SUPPLYTYPE.treasure, 1361, 70),
                     createItem(1, SUPPLYTYPE.treasure, 20221, 10),
                     createItem(1, SUPPLYTYPE.treasure, 20121, 15),
                     createItem(1, SUPPLYTYPE.treasure, 20131, 15),
                     createItem(2, SUPPLYTYPE.treasure, 20461, 10),
                     createItem(2, SUPPLYTYPE.treasure, 4021, 256),
                     createItem(2, SUPPLYTYPE.treasure, 5061, 50),
                     createItem(2, SUPPLYTYPE.treasure, 20221, 25),
                     createItem(3, SUPPLYTYPE.treasure, 20461, 30),
                     createItem(3, SUPPLYTYPE.treasure, 4021, 512),
                     createItem(4, SUPPLYTYPE.treasure, 4021, 255),
                     createItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Aschallon: [createItem(1, SUPPLYTYPE.treasure, 20611, 70),
                        createItem(1, SUPPLYTYPE.treasure, 1311, 70),
                        createItem(1, SUPPLYTYPE.treasure, 20211, 10),
                        createItem(1, SUPPLYTYPE.treasure, 20111, 30),
                        createItem(2, SUPPLYTYPE.treasure, 20691, 10),
                        createItem(2, SUPPLYTYPE.treasure, 4011, 256),
                        createItem(2, SUPPLYTYPE.treasure, 5011, 50),
                        createItem(2, SUPPLYTYPE.treasure, 20211, 25),
                        createItem(3, SUPPLYTYPE.treasure, 20691, 30),
                        createItem(3, SUPPLYTYPE.treasure, 4011, 512),
                        createItem(4, SUPPLYTYPE.treasure, 4011, 255),
                        createItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Keraunos: [createItem(1, SUPPLYTYPE.treasure, 20631, 80),
                       createItem(1, SUPPLYTYPE.treasure, 1331, 70),
                       createItem(1, SUPPLYTYPE.treasure, 20221, 10),
                       createItem(1, SUPPLYTYPE.treasure, 20131, 30),
                       createItem(2, SUPPLYTYPE.treasure, 20441, 10),
                       createItem(2, SUPPLYTYPE.treasure, 4051, 256),
                       createItem(2, SUPPLYTYPE.treasure, 5031, 50),
                       createItem(2, SUPPLYTYPE.treasure, 20221, 25),
                       createItem(3, SUPPLYTYPE.treasure, 20441, 30),
                       createItem(3, SUPPLYTYPE.treasure, 4051, 512),
                       createItem(4, SUPPLYTYPE.treasure, 4051, 255),
                       createItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Rosenbogen: [createItem(1, SUPPLYTYPE.treasure, 20641, 80),
                         createItem(1, SUPPLYTYPE.treasure, 1341, 70),
                         createItem(1, SUPPLYTYPE.treasure, 20211, 10),
                         createItem(1, SUPPLYTYPE.treasure, 20141, 30),
                         createItem(2, SUPPLYTYPE.treasure, 20481, 10),
                         createItem(2, SUPPLYTYPE.treasure, 4081, 256),
                         createItem(2, SUPPLYTYPE.treasure, 5041, 50),
                         createItem(2, SUPPLYTYPE.treasure, 20211, 25),
                         createItem(3, SUPPLYTYPE.treasure, 20481, 30),
                         createItem(3, SUPPLYTYPE.treasure, 4081, 512),
                         createItem(4, SUPPLYTYPE.treasure, 4081, 255),
                         createItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Langeleik: [createItem(1, SUPPLYTYPE.treasure, 20621, 80),
                        createItem(1, SUPPLYTYPE.treasure, 1321, 70),
                        createItem(1, SUPPLYTYPE.treasure, 20221, 10),
                        createItem(1, SUPPLYTYPE.treasure, 20121, 30),
                        createItem(2, SUPPLYTYPE.treasure, 20491, 10),
                        createItem(2, SUPPLYTYPE.treasure, 4091, 256),
                        createItem(2, SUPPLYTYPE.treasure, 5021, 50),
                        createItem(2, SUPPLYTYPE.treasure, 20221, 25),
                        createItem(3, SUPPLYTYPE.treasure, 20491, 30),
                        createItem(3, SUPPLYTYPE.treasure, 4091, 512),
                        createItem(4, SUPPLYTYPE.treasure, 4091, 255),
                        createItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Romulus: [createItem(1, SUPPLYTYPE.treasure, 20651, 80),
                      createItem(1, SUPPLYTYPE.treasure, 1351, 70),
                      createItem(1, SUPPLYTYPE.treasure, 20211, 10),
                      createItem(1, SUPPLYTYPE.treasure, 20111, 15),
                      createItem(1, SUPPLYTYPE.treasure, 20141, 15),
                      createItem(2, SUPPLYTYPE.treasure, 20501, 10),
                      createItem(2, SUPPLYTYPE.treasure, 4031, 256),
                      createItem(2, SUPPLYTYPE.treasure, 5051, 50),
                      createItem(2, SUPPLYTYPE.treasure, 20211, 25),
                      createItem(3, SUPPLYTYPE.treasure, 20501, 30),
                      createItem(3, SUPPLYTYPE.treasure, 4031, 512),
                      createItem(4, SUPPLYTYPE.treasure, 4031, 255),
                      createItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Faust: [createItem(1, SUPPLYTYPE.treasure, 20631, 80),
                    createItem(1, SUPPLYTYPE.treasure, 1331, 70),
                    createItem(1, SUPPLYTYPE.treasure, 20221, 10),
                    createItem(1, SUPPLYTYPE.treasure, 20131, 30),
                    createItem(2, SUPPLYTYPE.treasure, 20511, 10),
                    createItem(2, SUPPLYTYPE.treasure, 4021, 256),
                    createItem(2, SUPPLYTYPE.treasure, 5031, 50),
                    createItem(2, SUPPLYTYPE.treasure, 20221, 25),
                    createItem(3, SUPPLYTYPE.treasure, 20511, 30),
                    createItem(3, SUPPLYTYPE.treasure, 4021, 512),
                    createItem(4, SUPPLYTYPE.treasure, 4021, 255),
                    createItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Murakumo: [createItem(1, SUPPLYTYPE.treasure, 20651, 80),
                       createItem(1, SUPPLYTYPE.treasure, 1351, 70),
                       createItem(1, SUPPLYTYPE.treasure, 20211, 10),
                       createItem(1, SUPPLYTYPE.treasure, 20111, 15),
                       createItem(1, SUPPLYTYPE.treasure, 20141, 15),
                       createItem(2, SUPPLYTYPE.treasure, 20671, 10),
                       createItem(2, SUPPLYTYPE.treasure, 4101, 256),
                       createItem(2, SUPPLYTYPE.treasure, 5051, 50),
                       createItem(2, SUPPLYTYPE.treasure, 20211, 25),
                       createItem(3, SUPPLYTYPE.treasure, 20671, 30),
                       createItem(3, SUPPLYTYPE.treasure, 4101, 512),
                       createItem(4, SUPPLYTYPE.treasure, 4101, 255),
                       createItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Kapilavastu: [createItem(1, SUPPLYTYPE.treasure, 20621, 80),
                          createItem(1, SUPPLYTYPE.treasure, 1321, 70),
                          createItem(1, SUPPLYTYPE.treasure, 20221, 10),
                          createItem(1, SUPPLYTYPE.treasure, 20121, 30),
                          createItem(2, SUPPLYTYPE.treasure, 20751, 10),
                          createItem(2, SUPPLYTYPE.treasure, 4051, 256),
                          createItem(2, SUPPLYTYPE.treasure, 5021, 50),
                          createItem(2, SUPPLYTYPE.treasure, 20221, 25),
                          createItem(3, SUPPLYTYPE.treasure, 20751, 30),
                          createItem(3, SUPPLYTYPE.treasure, 4051, 512),
                          createItem(4, SUPPLYTYPE.treasure, 4051, 255),
                          createItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Nirvana: [createItem(1, SUPPLYTYPE.treasure, 20651, 90),
                      createItem(1, SUPPLYTYPE.treasure, 1351, 70),
                      createItem(1, SUPPLYTYPE.treasure, 20221, 10),
                      createItem(1, SUPPLYTYPE.treasure, 20111, 15),
                      createItem(1, SUPPLYTYPE.treasure, 20141, 15),
                      createItem(2, SUPPLYTYPE.treasure, 20431, 10),
                      createItem(2, SUPPLYTYPE.treasure, 4051, 256),
                      createItem(2, SUPPLYTYPE.treasure, 5051, 50),
                      createItem(2, SUPPLYTYPE.treasure, 20221, 25),
                      createItem(3, SUPPLYTYPE.treasure, 20431, 30),
                      createItem(3, SUPPLYTYPE.treasure, 4051, 512),
                      createItem(4, SUPPLYTYPE.treasure, 4051, 255),
                      createItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Oliver: [createItem(1, SUPPLYTYPE.treasure, 20641, 90),
                     createItem(1, SUPPLYTYPE.treasure, 1341, 70),
                     createItem(1, SUPPLYTYPE.treasure, 20211, 10),
                     createItem(1, SUPPLYTYPE.treasure, 20141, 30),
                     createItem(2, SUPPLYTYPE.treasure, 20451, 10),
                     createItem(2, SUPPLYTYPE.treasure, 4061, 256),
                     createItem(2, SUPPLYTYPE.treasure, 5041, 50),
                     createItem(2, SUPPLYTYPE.treasure, 20211, 25),
                     createItem(3, SUPPLYTYPE.treasure, 20451, 30),
                     createItem(3, SUPPLYTYPE.treasure, 4061, 512),
                     createItem(4, SUPPLYTYPE.treasure, 4061, 255),
                     createItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Hellion: [createItem(1, SUPPLYTYPE.treasure, 20611, 90),
                      createItem(1, SUPPLYTYPE.treasure, 1311, 70),
                      createItem(1, SUPPLYTYPE.treasure, 20211, 10),
                      createItem(1, SUPPLYTYPE.treasure, 20111, 30),
                      createItem(2, SUPPLYTYPE.treasure, 20471, 10),
                      createItem(2, SUPPLYTYPE.treasure, 4071, 256),
                      createItem(2, SUPPLYTYPE.treasure, 5011, 50),
                      createItem(2, SUPPLYTYPE.treasure, 20211, 25),
                      createItem(3, SUPPLYTYPE.treasure, 20471, 30),
                      createItem(3, SUPPLYTYPE.treasure, 4071, 512),
                      createItem(4, SUPPLYTYPE.treasure, 4071, 255),
                      createItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Muramasa: [createItem(1, SUPPLYTYPE.treasure, 20661, 90),
                       createItem(1, SUPPLYTYPE.treasure, 1361, 70),
                       createItem(1, SUPPLYTYPE.treasure, 20221, 10),
                       createItem(1, SUPPLYTYPE.treasure, 20121, 15),
                       createItem(1, SUPPLYTYPE.treasure, 20131, 15),
                       createItem(2, SUPPLYTYPE.treasure, 20681, 10),
                       createItem(2, SUPPLYTYPE.treasure, 4101, 256),
                       createItem(2, SUPPLYTYPE.treasure, 5061, 50),
                       createItem(2, SUPPLYTYPE.treasure, 20221, 25),
                       createItem(3, SUPPLYTYPE.treasure, 20681, 30),
                       createItem(3, SUPPLYTYPE.treasure, 4101, 512),
                       createItem(4, SUPPLYTYPE.treasure, 4101, 255),
                       createItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Nebuchad: [createItem(1, SUPPLYTYPE.treasure, 20661, 90),
                       createItem(1, SUPPLYTYPE.treasure, 1361, 70),
                       createItem(1, SUPPLYTYPE.treasure, 20221, 10),
                       createItem(1, SUPPLYTYPE.treasure, 20121, 15),
                       createItem(1, SUPPLYTYPE.treasure, 20131, 15),
                       createItem(2, SUPPLYTYPE.treasure, 20701, 10),
                       createItem(2, SUPPLYTYPE.treasure, 4061, 256),
                       createItem(2, SUPPLYTYPE.treasure, 5061, 50),
                       createItem(2, SUPPLYTYPE.treasure, 20221, 25),
                       createItem(3, SUPPLYTYPE.treasure, 20701, 30),
                       createItem(3, SUPPLYTYPE.treasure, 4061, 512),
                       createItem(4, SUPPLYTYPE.treasure, 4061, 255),
                       createItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Misericorde: [createItem(1, SUPPLYTYPE.treasure, 20641, 90),
                          createItem(1, SUPPLYTYPE.treasure, 1341, 70),
                          createItem(1, SUPPLYTYPE.treasure, 20211, 10),
                          createItem(1, SUPPLYTYPE.treasure, 20141, 30),
                          createItem(2, SUPPLYTYPE.treasure, 20761, 10),
                          createItem(2, SUPPLYTYPE.treasure, 4021, 256),
                          createItem(2, SUPPLYTYPE.treasure, 5041, 50),
                          createItem(2, SUPPLYTYPE.treasure, 20211, 25),
                          createItem(3, SUPPLYTYPE.treasure, 20761, 30),
                          createItem(3, SUPPLYTYPE.treasure, 4021, 512),
                          createItem(4, SUPPLYTYPE.treasure, 4021, 255),
                          createItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
        },
        element: {
            Fire: [createItem(3, SUPPLYTYPE.treasure, 101, 30),
                   createItem(3, SUPPLYTYPE.treasure, 20711, 30),
                   createItem(3, SUPPLYTYPE.treasure, 10018, 200),
                   createItem(4, SUPPLYTYPE.treasure, 101, 30),
                   createItem(4, SUPPLYTYPE.treasure, 506, 6)
            ],
            Water: [createItem(3, SUPPLYTYPE.treasure, 102, 30),
                    createItem(3, SUPPLYTYPE.treasure, 20721, 30),
                    createItem(3, SUPPLYTYPE.treasure, 10005, 200),
                    createItem(4, SUPPLYTYPE.treasure, 102, 30),
                    createItem(4, SUPPLYTYPE.treasure, 507, 6)
            ],
            Earth: [createItem(3, SUPPLYTYPE.treasure, 103, 30),
                    createItem(3, SUPPLYTYPE.treasure, 20731, 30),
                    createItem(3, SUPPLYTYPE.treasure, 10011, 200),
                    createItem(3, SUPPLYTYPE.treasure, 103, 30),
                    createItem(4, SUPPLYTYPE.treasure, 508, 6)
            ],
            Wind: [createItem(3, SUPPLYTYPE.treasure, 104, 30),
                   createItem(3, SUPPLYTYPE.treasure, 20741, 30),
                   createItem(3, SUPPLYTYPE.treasure, 10027, 200),
                   createItem(3, SUPPLYTYPE.treasure, 104, 30),
                   createItem(4, SUPPLYTYPE.treasure, 509, 6)
            ],
            Light: [createItem(3, SUPPLYTYPE.treasure, 105, 30),
                    createItem(3, SUPPLYTYPE.treasure, 20711, 15),
                    createItem(3, SUPPLYTYPE.treasure, 20741, 15),
                    createItem(3, SUPPLYTYPE.treasure, 10046, 200),
                    createItem(3, SUPPLYTYPE.treasure, 105, 30),
                    createItem(4, SUPPLYTYPE.treasure, 506, 6),
                    createItem(4, SUPPLYTYPE.treasure, 509, 6)
            ],
            Dark: [createItem(3, SUPPLYTYPE.treasure, 106, 30),
                   createItem(3, SUPPLYTYPE.treasure, 20721, 15),
                   createItem(3, SUPPLYTYPE.treasure, 20731, 15),
                   createItem(3, SUPPLYTYPE.treasure, 10065, 200),
                   createItem(3, SUPPLYTYPE.treasure, 106, 30),
                   createItem(4, SUPPLYTYPE.treasure, 507, 6),
                   createItem(4, SUPPLYTYPE.treasure, 508, 6)
            ],
        },
        stepNames: ["Replica", "Forge", "Rebuild", "Elechange", "FLB"]
    },
    
    Revenant:{
        core: [
            createItem(1, SUPPLYTYPE.treasure, 1052, 50),
            createItem(1, SUPPLYTYPE.treasure, 1352, 50),
            createItem(1, SUPPLYTYPE.treasure, 1353, 50),
            createItem(1, SUPPLYTYPE.treasure, 1151, 50),
            createItem(1, SUPPLYTYPE.treasure, 2001, 50),
//            createItem(1, SUPPLYTYPE.treasure, 1052, 50),
            
            createItem(2, SUPPLYTYPE.treasure, 1202, 250),
            
            //6 Upgrades
            createItem(3, SUPPLYTYPE.treasure, 1202, 250),
            createItem(3, SUPPLYTYPE.treasure, 1202, 250),
            createItem(3, SUPPLYTYPE.treasure, 1202, 250),
            createItem(3, SUPPLYTYPE.treasure, 1202, 250),
            createItem(3, SUPPLYTYPE.treasure, 1202, 250),
            
            createItem(4, SUPPLYTYPE.treasure, 1202, 250),
        ],
        wtype: {},
        element: {
            templates: [
                supplyTemplate(2, PLANNER_TEMPLATES.orbs.low, 250),
                supplyTemplate(2, PLANNER_TEMPLATES.whorls, 250),
                
                //6 upgrades
                supplyTemplate(3, PLANNER_TEMPLATES.orbs.low, 100),
                supplyTemplate(3, PLANNER_TEMPLATES.whorls, 100),
                supplyTemplate(3, PLANNER_TEMPLATES.tomes, 100),
                supplyTemplate(3, PLANNER_TEMPLATES.scrolls, 100),
            ]            
        },
        stepNames: ["Awaken", "Elechange", "Upgrade 1", "Upgrade 2", "Upgrade 3", "Upgrade 4", "Upgrade 5"]
    }
};
