//Templates
const PLANNER_TEMPLATES = {
    orbs: {
        low: {
            type: SUPPLYTYPE.treasure,
            Fire: 1011,
            Water: 1021,
            Earth: 1031,
            Wind: 1041,
            Light: 1051,
            Dark: 1061
        },
        high: {
            type: SUPPLYTYPE.treasure,
            Fire: 1012,
            Water: 1022,
            Earth: 1032,
            Wind: 1042,
            Light: 1052,
            Dark: 1062,
        }
    },
    whorls: {
        type: SUPPLYTYPE.treasure,
        Fire: 1313,
        Water: 1323,
        Earth: 1333,
        Wind: 1343,
        Light: 1353,
        Dark: 1363
    },
    tomes: {
        type: SUPPLYTYPE.treasure,
        Fire: 1311,
        Water: 1321,
        Earth: 1331,
        Wind: 1341,
        Light: 1351,
        Dark: 1361
    },
    scrolls: {
        type: SUPPLYTYPE.treasure,
        Fire: 1312,
        Water: 1322,
        Earth: 1332,
        Wind: 1342,
        Light: 1352,
        Dark: 1362
    },
    scales: {
        type: SUPPLYTYPE.treasure,
        Fire: 1111,
        Water: 1121,
        Earth: 1131,
        Wind: 1141,
        Light: 1151,
        Dark: 1161
    },
    stones: {
        type: SUPPLYTYPE.treasure,
        Sword: 4011,
        Dagger: 4021,
        Spear: 4031,
        Axe: 4041,
        Staff: 4051,
        Gun: 4061,
        Fist: 4071,
        Bow: 4081,
        Harp: 4091,
        Katana: 4101
    },
    trueAnima: {
        type: SUPPLYTYPE.treasure,
        Fire: 41,
        Water: 42,
        Earth: 43,
        Wind: 44,
        Light: 45,
        Dark: 46
},
    anima: {
        primal: {
            type: SUPPLYTYPE.treasure,
            Fire: 11,
            Water: 12,
            Earth: 13,
            Wind: 10,
            Light: 25,
            Dark: 30
        }
    },
    omegaItem: {
        type: SUPPLYTYPE.treasure,
        Fire: 47,
        Water: 48,
        Earth: 49,
        Wind: 32,
        Light: 50,
        Dark: 51
    }
};

const PLANNER_ITEMS = {
    blueSkyCrystal: {type: SUPPLYTYPE.treasure, id: 1},
    championMerit: {type: SUPPLYTYPE.treasure, id: 2001},
    supremeMerit: {type: SUPPLYTYPE.treasure, id: 2002},
    legendaryMerit: {type: SUPPLYTYPE.treasure, id: 2003},
    flawlessPrism: {type: SUPPLYTYPE.treasure, id: 1203},
    rainbowPrism: {type: SUPPLYTYPE.treasure, id: 1204},
    antiqueCloth: {type: SUPPLYTYPE.treasure, id: 54}
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
        needed,
        isTemplate: true
    };
}

//function createItemFromTemplate(templateItem, key) {
//    templateItem.id = templateItem.id[key];
//    return templateItem;
//}

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
            createItem(1, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.orbs.high.Light, 50),
            createItem(1, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.scrolls.Light, 50),
            createItem(1, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.whorls.Light, 50),
            createItem(1, SUPPLYTYPE.treasure, 1151, 50),
            createItem(1, SUPPLYTYPE.treasure, 2001, 50),
//            createItem(1, SUPPLYTYPE.treasure, 1052, 50),

            createItem(2, SUPPLYTYPE.treasure, 1202, 250),

            //Upgrade 1
            createItem(3, SUPPLYTYPE.treasure, 2, 300),
            createItem(3, SUPPLYTYPE.treasure, 5, 100),
            createItem(3, SUPPLYTYPE.treasure, 8, 100),
            createItem(3, PLANNER_ITEMS.supremeMerit.type, PLANNER_ITEMS.supremeMerit.id, 10),
            createItem(3, PLANNER_ITEMS.blueSkyCrystal.type, PLANNER_ITEMS.blueSkyCrystal.id, 3),
            //crystals 100

            //2
            createItem(4, SUPPLYTYPE.treasure, 6, 100),
            createItem(4, SUPPLYTYPE.treasure, 24, 100),
            createItem(4, SUPPLYTYPE.treasure, 28, 100),
            createItem(4, PLANNER_ITEMS.rainbowPrism.type, PLANNER_ITEMS.rainbowPrism.id, 50),
            createItem(4, PLANNER_ITEMS.blueSkyCrystal.type, PLANNER_ITEMS.blueSkyCrystal.id, 5),
            //crystals 200

            //3
            createItem(5, SUPPLYTYPE.treasure, 3, 300),
            createItem(5, SUPPLYTYPE.treasure, 22, 100),
            createItem(5, SUPPLYTYPE.treasure, 39, 80),
            createItem(5, PLANNER_ITEMS.supremeMerit.type, PLANNER_ITEMS.supremeMerit.id, 10),
            createItem(5, PLANNER_ITEMS.blueSkyCrystal.type, PLANNER_ITEMS.blueSkyCrystal.id, 7),
            //crystal 300

            //4
            createItem(6, SUPPLYTYPE.treasure, 17, 100),
            createItem(6, SUPPLYTYPE.treasure, 29, 100),
            createItem(6, SUPPLYTYPE.treasure, 40, 80),
            createItem(6, PLANNER_ITEMS.rainbowPrism.type, PLANNER_ITEMS.rainbowPrism.id, 150),
            createItem(6, PLANNER_ITEMS.blueSkyCrystal.type, PLANNER_ITEMS.blueSkyCrystal.id, 10),
            //crystal 400

            //5
            createItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Wind, 20),
            createItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Fire, 20),
            createItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Water, 20),
            createItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Earth, 20),
            createItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Light, 20),
            createItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Dark, 20),
            createItem(7, PLANNER_ITEMS.antiqueCloth.type, PLANNER_ITEMS.antiqueCloth.id, 100),
            createItem(7, PLANNER_ITEMS.supremeMerit.type, PLANNER_ITEMS.supremeMerit.id, 10),
            createItem(7, PLANNER_ITEMS.blueSkyCrystal.type, PLANNER_ITEMS.blueSkyCrystal.id, 15),
            //crystals 500

            //6
            createItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Fire, 3),
            createItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Water, 3),
            createItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Earth, 3),
            createItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Wind, 3),
            createItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Light, 3),
            createItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Dark, 3),
            createItem(8, PLANNER_ITEMS.rainbowPrism.type, PLANNER_ITEMS.rainbowPrism.id, 250),
            createItem(8, PLANNER_ITEMS.blueSkyCrystal.type, PLANNER_ITEMS.blueSkyCrystal.id, 30),
            createItem(8, SUPPLYTYPE.evolution, 20004, 1) //Gold brick 1
            //crystal 500
        ],
        wtype: {
            "Uno (spear)": null,
            "Sorn (bow)": null,
            "Sarasa (axe)": null,
            "Feower (dagger)": null,
            "Funf (staff)": null,
            "Six (fist)": null,
            "Siete (sword)": null,
            "Okto (katana)": null,
            "Nio (harp)": null,
            "Esser (gun)": null,
        },
        element: {
            Fire: null,
            Water: null,
            Earth: null,
            Wind: null,
            Light: null,
            Dark: null,
            templates: [
                supplyTemplate(2, PLANNER_TEMPLATES.orbs.low, 250),
                supplyTemplate(2, PLANNER_TEMPLATES.whorls, 250),

                //Upgrade 1
                supplyTemplate(3, PLANNER_TEMPLATES.orbs.low, 100),
                supplyTemplate(3, PLANNER_TEMPLATES.whorls, 100),
                supplyTemplate(3, PLANNER_TEMPLATES.tomes, 100),
                supplyTemplate(3, PLANNER_TEMPLATES.scrolls, 150),

                //Upgrade 2
                supplyTemplate(4, PLANNER_TEMPLATES.orbs.low, 150),
                supplyTemplate(4, PLANNER_TEMPLATES.tomes, 150),
                supplyTemplate(4, PLANNER_TEMPLATES.whorls, 150),
                supplyTemplate(4, PLANNER_TEMPLATES.scales, 30),
                supplyTemplate(4, PLANNER_TEMPLATES.trueAnima, 3),

                //Upgrade 3
                supplyTemplate(5, PLANNER_TEMPLATES.orbs.low, 200),
                supplyTemplate(5, PLANNER_TEMPLATES.orbs.high, 100),
                supplyTemplate(5, PLANNER_TEMPLATES.whorls, 200),
                supplyTemplate(5, PLANNER_TEMPLATES.anima.primal, 100),

                //Upgrade 4
                supplyTemplate(6, PLANNER_TEMPLATES.orbs.low, 250),
                supplyTemplate(6, PLANNER_TEMPLATES.scales, 50),
                supplyTemplate(6, PLANNER_TEMPLATES.whorls, 250),
                supplyTemplate(6, PLANNER_TEMPLATES.trueAnima, 3),

                //Upgrade 5
                supplyTemplate(7, PLANNER_TEMPLATES.omegaItem, 60),
            ]
        },
        stepNames: ["Revenant", "Awaken", "Elechange", "Upgrade 1", "Upgrade 2", "Upgrade 3", "Upgrade 4", "Upgrade 5", "Upgrade 6"],
        typeNames: {
            "Uno (spear)": "Spear",
            "Sorn (bow)": "Bow",
            "Sarasa (axe)": "Axe",
            "Feower (dagger)": "Dagger",
            "Funf (staff)": "Staff",
            "Six (fist)": "Fist",
            "Siete (sword)": "Sword",
            "Okto (katana)": "Katana",
            "Nio (harp)": "Harp",
            "Esser (gun)": "Gun",
        }
    }
};

(function hideTemplates(o) {
    if (o["templates"]) {
        Object.defineProperty(o, "templates", {enumerable: false});
    }
    else {
        for (let k of Object.keys(o)) {
            if (o[k] instanceof Object) { hideTemplates(o[k]); }
        }
    }
})(PlannerData);
