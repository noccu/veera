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
            Dark: 1062
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
    quartz: {
        type: SUPPLYTYPE.treasure,
        Fire: 5011,
        Water: 5021,
        Earth: 5031,
        Wind: 5041,
        Light: 5051,
        Dark: 5061
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
    },
    centrums: {
            type: SUPPLYTYPE.treasure,
            Fire: 101,
            Water: 102,
            Earth: 103,
            Wind: 104,
            Light: 105,
            Dark: 106,
            Silver: 107
    },

    trialFragments: {
//        __proto__: PlannerTemplate,
        type: SUPPLYTYPE.treasure,
        Fire: 5111,
        Water: 5121,
        Earth: 5131,
        Wind: 5141,
        Light: [5111, 5141],
        Dark: [5121, 5131]
    },
    urns: {
        type: SUPPLYTYPE.treasure,
        Fire: 111,
        Water: 112,
        Earth: 113,
        Wind: 114,
        Light: 115,
        Dark: 116
    },
    relicShards: {
        type: SUPPLYTYPE.treasure,
        Sword: 5411,
        Dagger: 5421,
        Spear: 5431,
        Axe: 5441,
        Staff: 5451,
        Gun: 5461,
        Fist: 5471,
        Bow: 5481,
        Harp: 5491,
        Katana: 5501
    },
    revenantFragments: {
        type: SUPPLYTYPE.treasure,
        Sword: 5671,
        Dagger: 5641,
        Spear: 5611,
        Axe: 5631,
        Staff: 5651,
        Gun: 5701,
        Fist: 5661,
        Bow: 5621,
        Harp: 5691,
        Katana: 5681
    },
    showdowns: {
        items: {
            type: SUPPLYTYPE.treasure,
            Fire: 20611,
            Water: 20621,
            Earth: 20631,
            Wind: 20641,
            Light: 20651,
            Dark: 20661
        },
        anima: {
            type: SUPPLYTYPE.treasure,
            Fire: 10018,
            Water: 10005,
            Earth: 10011,
            Wind: 10027,
            Light: 10046,
            Dark: 10065
        },
        omegaAnima: {
            type: SUPPLYTYPE.treasure,
            Fire: 10019,
            Water: 10006,
            Earth: 10012,
            Wind: 10028,
            Light: 10047,
            Dark: 10066
        }
    },
    grimoires: {
        type: SUPPLYTYPE.treasure,
        Fire: 20711,
        Water: 20721,
        Earth: 20731,
        Wind: 20741,
        Light: [20711, 20741],
        Dark: [20721, 20731]
    },
    primarchAnima: {
        type: SUPPLYTYPE.treasure,
        Fire: 506,
        Water: 507,
        Earth: 508,
        Wind: 509,
        Light: [506, 509],
        Dark: [507, 508]
    },
    genesisAnima: {
        type: SUPPLYTYPE.treasure,
        Fire: 511,
        Water: 513,
        Earth: 515,
        Wind: 517,
        Light: 519,
        Dark: 521
    }
};

const PLANNER_ITEMS = {
    blueSkyCrystal: new PlannerItem(SUPPLYTYPE.treasure, 1),
    championMerit: new PlannerItem(SUPPLYTYPE.treasure, 2001),
    supremeMerit: new PlannerItem(SUPPLYTYPE.treasure, 2002),
    legendaryMerit: new PlannerItem(SUPPLYTYPE.treasure, 2003),
    flawlessPrism: new PlannerItem(SUPPLYTYPE.treasure, 1203),
    rainbowPrism: new PlannerItem(SUPPLYTYPE.treasure, 1204),
    antiqueCloth: new PlannerItem(SUPPLYTYPE.treasure, 54),
    flawedPrism: new PlannerItem(SUPPLYTYPE.treasure, 1202),
    prismChip: new PlannerItem(SUPPLYTYPE.treasure, 1201),
    bahaHorn: new PlannerItem(SUPPLYTYPE.treasure, 59),
    silverCentrum: new PlannerItem(SUPPLYTYPE.treasure, 107),
    goldBrick: new PlannerItem(17, 20004)
};

/** Creates an item for the planner from any accepted input.
    @arg {Number|Object|PlannerItem} type
**/
function PlannerItem (step, type, id, needed) {
    if (arguments.length == 2) {
        this.type = arguments[0];
        this.id = arguments[1];
        return;
    }
    else if (arguments.length == 3) {
        let item = arguments[1];
        needed = arguments[2];
        if (item instanceof PlannerItem) {
            id = item.id;
            type = item.type;
        }
        else if (item.type) { //templates
            id = item;
            type = item.type;
            this.isTemplate = true;
        }
        else {
            deverror("Invalid planner item, check data.", type);
        }
    }

    this.step = step;
    this.type = type;
    this.id = id;
    this.needed = needed;
}

window.PlannerData = {
    Bahamut: {
        core: [ //Items needed for every craft
            new PlannerItem(1, SUPPLYTYPE.treasure, 59, 1),

            //Nova
            new PlannerItem(2, SUPPLYTYPE.treasure, 59, 3),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1, 7),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1111, 30),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1121, 30),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1131, 30),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1141, 30),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1151, 30),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1161, 30),

            //Coda
            new PlannerItem(3, SUPPLYTYPE.treasure, 79, 5),
            new PlannerItem(3, SUPPLYTYPE.treasure, 2003, 3)
        ],
        wtype: { //Weapon type specific items
            Sword: [new PlannerItem(2, SUPPLYTYPE.treasure, 47, 20)],
            Dagger: [new PlannerItem(2, SUPPLYTYPE.treasure, 51, 20)],
            Spear: [new PlannerItem(2, SUPPLYTYPE.treasure, 32, 20)],
            Axe: [new PlannerItem(2, SUPPLYTYPE.treasure, 49, 20)],
            Staff: [new PlannerItem(2, SUPPLYTYPE.treasure, 50, 20)],
            Gun: [new PlannerItem(2, SUPPLYTYPE.treasure, 47, 20)],
            Fist: [new PlannerItem(2, SUPPLYTYPE.treasure, 49, 20)],
            Bow: [new PlannerItem(2, SUPPLYTYPE.treasure, 32, 20)],
            Harp: [new PlannerItem(2, SUPPLYTYPE.treasure, 48, 20)],
            Katana: [new PlannerItem(2, SUPPLYTYPE.treasure, 48, 20)]
        },
        element: {
            Dark: null //no special items, but name needed for option parsing (well not really, but it's nice)
        },
        stepNames: ["Rusted", "Base", "Nova", "Coda"] //In order starting from 0, which is the true starting (not part of the craft) step
    },

    Class: {
        core: [ //Items needed for every craft
             new PlannerItem(1, SUPPLYTYPE.treasure, 54, 20),
             new PlannerItem(1, PLANNER_ITEMS.prismChip, 50),
             new PlannerItem(1, PLANNER_ITEMS.blueSkyCrystal, 5),
             //Rebuild
             new PlannerItem(2, PLANNER_ITEMS.prismChip, 120),
             new PlannerItem(2, PLANNER_ITEMS.championMerit, 30),
             new PlannerItem(2, SUPPLYTYPE.evolution, 20003, 2), //steel brick
             new PlannerItem(2, PLANNER_ITEMS.blueSkyCrystal, 5),
             //Elechange
             new PlannerItem(3, PLANNER_ITEMS.silverCentrum, 3),
             new PlannerItem(3, PLANNER_ITEMS.blueSkyCrystal, 15),

             new PlannerItem(4, SUPPLYTYPE.treasure, 20771, 3),
             new PlannerItem(4, SUPPLYTYPE.treasure, 79, 1),
             new PlannerItem(4, PLANNER_ITEMS.blueSkyCrystal, 20),
             new PlannerItem(4, PLANNER_ITEMS.silverCentrum, 3)
        ],
        wtype: { //Weapon type specific items
            Avenger: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20211, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20411, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20211, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20411, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Skofnung: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20211, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20421, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20211, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20421, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Ipetam: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20221, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20461, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20221, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20461, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Aschallon: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20211, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20691, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20211, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20691, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Keraunos: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20221, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20441, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20221, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20441, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Rosenbogen: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20211, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20481, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20211, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20481, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Langeleik: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20221, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20491, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20221, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20491, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            "Romulus Spear": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20211, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20501, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20211, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20501, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Faust: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20221, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20511, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20221, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20511, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Murakumo: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20211, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20671, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20211, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20671, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Kapilavastu: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20221, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20751, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20221, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20751, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Nirvana: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20221, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20431, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20221, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20431, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Oliver: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20211, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20451, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20211, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20451, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            "Hellion Gauntlet": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20211, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20471, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20211, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20471, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20231, 10)
            ],
            Muramasa: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20221, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20681, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20221, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20681, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Nebuchad: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20221, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20701, 10),
                new PlannerItem(2, SUPPLYTYPE.treasure, 20221, 25),
                new PlannerItem(3, SUPPLYTYPE.treasure, 20701, 30),
                new PlannerItem(4, SUPPLYTYPE.treasure, 20241, 10)
            ],
            Misericorde: [
                new PlannerItem(1, SUPPLYTYPE.treasure, 20211, 10), //creeds
                new PlannerItem(2, SUPPLYTYPE.treasure, 20761, 10), //dists
                new PlannerItem(2, SUPPLYTYPE.treasure, 20211, 25), //creeds
                new PlannerItem(3, SUPPLYTYPE.treasure, 20761, 30), //dists
                new PlannerItem(4, SUPPLYTYPE.treasure, 20231, 10) //esteems
            ],
            templates: [
                new PlannerItem(1, PLANNER_TEMPLATES.showdowns.items, 50),
                new PlannerItem(1, PLANNER_TEMPLATES.tomes, 70),

                new PlannerItem(2, PLANNER_TEMPLATES.stones, 256),
                new PlannerItem(2, PLANNER_TEMPLATES.quartz, 50),

                new PlannerItem(3, PLANNER_TEMPLATES.stones, 512),

                new PlannerItem(4, PLANNER_TEMPLATES.stones, 255),
            ]
        },
        element: {
            Fire: null,
            Water: null,
            Earth: null,
            Wind: null,
            Light: null,
            Dark: null,
            templates: [
                new PlannerItem(3, PLANNER_TEMPLATES.centrums, 30),
                new PlannerItem(3, PLANNER_TEMPLATES.grimoires, 30),
                new PlannerItem(3, PLANNER_TEMPLATES.showdowns.anima, 100),

                new PlannerItem(4, PLANNER_TEMPLATES.centrums, 30),
                new PlannerItem(4, PLANNER_TEMPLATES.primarchAnima, 6),
            ]
        },
        stepNames: ["Replica", "Forge", "Rebuild", "Elechange", "FLB"],
        typeNames: {
            "Avenger": ["Fire", "Axe"],
            "Skofnung": ["Water", "Sword"],
            "Ipetam": ["Dark", "Dagger"],
            "Aschallon": ["Fire", "Sword"],
            "Keraunos": ["Earth", "Staff"],
            "Rosenbogen": ["Wind", "Bow"],
            "Langeleik": ["Water", "Harp"],
            "Romulus Spear": ["Light", "Spear"],
            "Faust": ["Earth", "Dagger"],
            "Murakumo": ["Light", "Katana"],
            "Kapilavastu": ["Water", "Staff"],
            "Nirvana": ["Light", "Staff"],
            "Oliver": ["Wind", "Gun"],
            "Hellion Gauntlet": ["Fire", "Fist"],
            "Muramasa": ["Dark", "Katana"],
            "Nebuchad": ["Dark", "Gun"],
            "Misericorde": ["Wind", "Dagger"]
        }
    },

    Revenant:{
        core: [
            //Awakening
            new PlannerItem(1, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.orbs.high.Light, 50),
            new PlannerItem(1, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.scrolls.Light, 50),
            new PlannerItem(1, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.whorls.Light, 50),
            new PlannerItem(1, SUPPLYTYPE.treasure, 1151, 50),
            new PlannerItem(1, SUPPLYTYPE.treasure, 2001, 50),
            new PlannerItem(1, SUPPLYTYPE.crystals, 0, 100),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1202, 250),

            //Upgrade 1
            new PlannerItem(3, SUPPLYTYPE.treasure, 2, 300),
            new PlannerItem(3, SUPPLYTYPE.treasure, 5, 100),
            new PlannerItem(3, SUPPLYTYPE.treasure, 8, 100),
            new PlannerItem(3, PLANNER_ITEMS.supremeMerit, 10),
            new PlannerItem(3, PLANNER_ITEMS.blueSkyCrystal, 3),
            new PlannerItem(3, SUPPLYTYPE.crystals, 0, 100),

            //2
            new PlannerItem(4, SUPPLYTYPE.treasure, 6, 100),
            new PlannerItem(4, SUPPLYTYPE.treasure, 24, 100),
            new PlannerItem(4, SUPPLYTYPE.treasure, 28, 100),
            new PlannerItem(4, PLANNER_ITEMS.rainbowPrism, 50),
            new PlannerItem(4, PLANNER_ITEMS.blueSkyCrystal, 5),
            new PlannerItem(4, SUPPLYTYPE.crystals, 0, 200),

            //3
            new PlannerItem(5, SUPPLYTYPE.treasure, 3, 300),
            new PlannerItem(5, SUPPLYTYPE.treasure, 22, 100),
            new PlannerItem(5, SUPPLYTYPE.treasure, 39, 80),
            new PlannerItem(5, PLANNER_ITEMS.supremeMerit, 10),
            new PlannerItem(5, PLANNER_ITEMS.blueSkyCrystal, 7),
            new PlannerItem(5, SUPPLYTYPE.crystals, 0, 300),

            //4
            new PlannerItem(6, SUPPLYTYPE.treasure, 17, 100),
            new PlannerItem(6, SUPPLYTYPE.treasure, 29, 100),
            new PlannerItem(6, SUPPLYTYPE.treasure, 40, 80),
            new PlannerItem(6, PLANNER_ITEMS.rainbowPrism, 150),
            new PlannerItem(6, PLANNER_ITEMS.blueSkyCrystal, 10),
            new PlannerItem(6, SUPPLYTYPE.crystals, 0, 400),
            //5
            new PlannerItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Wind, 20),
            new PlannerItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Fire, 20),
            new PlannerItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Water, 20),
            new PlannerItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Earth, 20),
            new PlannerItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Light, 20),
            new PlannerItem(7, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.omegaItem.Dark, 20),
            new PlannerItem(7, PLANNER_ITEMS.antiqueCloth, 100),
            new PlannerItem(7, PLANNER_ITEMS.supremeMerit, 10),
            new PlannerItem(7, PLANNER_ITEMS.blueSkyCrystal, 15),
            new PlannerItem(7, SUPPLYTYPE.crystals, 0, 500),
            //6
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Fire, 3),
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Water, 3),
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Earth, 3),
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Wind, 3),
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Light, 3),
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Dark, 3),
            new PlannerItem(8, PLANNER_ITEMS.rainbowPrism, 250),
            new PlannerItem(8, PLANNER_ITEMS.blueSkyCrystal, 30),
            new PlannerItem(8, SUPPLYTYPE.evolution, 20004, 1), //Gold brick 1
            new PlannerItem(8, SUPPLYTYPE.crystals, 0, 600),

           //8 Crafting an uncapped Silver relic
            new PlannerItem(10, SUPPLYTYPE.treasure, 5011, 300),
            new PlannerItem(10, SUPPLYTYPE.treasure, 5021, 300),
            new PlannerItem(10, SUPPLYTYPE.treasure, 5031, 300),
            new PlannerItem(10, SUPPLYTYPE.treasure, 5041, 300),
            new PlannerItem(10, SUPPLYTYPE.treasure, 5051, 300),
            new PlannerItem(10, SUPPLYTYPE.treasure, 5061, 300),

           //9 Creating a Golden Relic
           new PlannerItem(11, SUPPLYTYPE.evolution, 20004, 1),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.centrums.Silver, 10),
           new PlannerItem(11, SUPPLYTYPE.treasure, 203, 10),
           new PlannerItem(11, PLANNER_ITEMS.legendaryMerit, 5),
           new PlannerItem(11, PLANNER_ITEMS.flawedPrism, 1500),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.whorls.Fire, 250),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.whorls.Water, 250),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.whorls.Earth, 250),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.whorls.Wind, 250),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.whorls.Light, 250),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.whorls.Dark, 250),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.orbs.low.Fire, 250),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.orbs.low.Water, 250),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.orbs.low.Earth, 250),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.orbs.low.Wind, 250),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.orbs.low.Light, 250),
           new PlannerItem(11, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.orbs.low.Dark, 250)
        ],
        wtype: {

            //All need 24 rusted weapons of the same type as the Eternal.

            "Uno (spear)": [
                new PlannerItem(11, SUPPLYTYPE.treasure, 20421, 30)
                ],
            "Sorn (bow)": [
                new PlannerItem(11, SUPPLYTYPE.treasure, 20481, 30)
                ],
            "Sarasa (axe)": [
                new PlannerItem(11, SUPPLYTYPE.treasure, 20411, 30)
                ],
            "Feower (dagger)": [
                new PlannerItem(11, SUPPLYTYPE.treasure, 20461, 30)
                ],
            "Funf (staff)": [
                new PlannerItem(11, SUPPLYTYPE.treasure, 20431, 30)
                ],
            "Six (fist)": [
                new PlannerItem(11, SUPPLYTYPE.treasure, 20471, 30)
                ],
            "Siete (sword)": [
                new PlannerItem(11, SUPPLYTYPE.treasure, 20691, 30)
                ],
            "Okto (katana)": [
                new PlannerItem(11, SUPPLYTYPE.treasure, 20671, 30)
                ],
            "Nio (harp)": [
                new PlannerItem(11, SUPPLYTYPE.treasure, 20491, 30)
                ],
            "Esser (gun)": [
                new PlannerItem(11, SUPPLYTYPE.treasure, 20451, 30)
                ],
            templates: [
               new PlannerItem(9, PLANNER_TEMPLATES.relicShards, 40), //Silver fragments
               new PlannerItem(10, PLANNER_TEMPLATES.stones, 300), //Stones
               new PlannerItem(11, PLANNER_TEMPLATES.revenantFragments, 100) //Revenant Fragments
            ]
        },
        element: {
            Fire: null,
            Water: null,
            Earth: null,
            Wind: null,
            Light: null,
            Dark: null,
            templates: [
                new PlannerItem(2, PLANNER_TEMPLATES.orbs.low, 250),
                new PlannerItem(2, PLANNER_TEMPLATES.whorls, 250),

                //Upgrade 1
                new PlannerItem(3, PLANNER_TEMPLATES.orbs.low, 100),
                new PlannerItem(3, PLANNER_TEMPLATES.whorls, 100),
                new PlannerItem(3, PLANNER_TEMPLATES.tomes, 100),
                new PlannerItem(3, PLANNER_TEMPLATES.scrolls, 150),

                //Upgrade 2
                new PlannerItem(4, PLANNER_TEMPLATES.orbs.low, 150),
                new PlannerItem(4, PLANNER_TEMPLATES.tomes, 150),
                new PlannerItem(4, PLANNER_TEMPLATES.whorls, 150),
                new PlannerItem(4, PLANNER_TEMPLATES.scales, 30),
                new PlannerItem(4, PLANNER_TEMPLATES.trueAnima, 3),

                //Upgrade 3
                new PlannerItem(5, PLANNER_TEMPLATES.orbs.low, 200),
                new PlannerItem(5, PLANNER_TEMPLATES.orbs.high, 100),
                new PlannerItem(5, PLANNER_TEMPLATES.whorls, 200),
                new PlannerItem(5, PLANNER_TEMPLATES.anima.primal, 100),

                //Upgrade 4
                new PlannerItem(6, PLANNER_TEMPLATES.orbs.low, 250),
                new PlannerItem(6, PLANNER_TEMPLATES.scales, 50),
                new PlannerItem(6, PLANNER_TEMPLATES.whorls, 250),
                new PlannerItem(6, PLANNER_TEMPLATES.trueAnima, 3),

                //Upgrade 5
                new PlannerItem(7, PLANNER_TEMPLATES.omegaItem, 60),
            ]
        },
        stepNames: ["Revenant", "Awaken", "Elechange", "Upgrade 1", "Upgrade 2", "Upgrade 3", "Upgrade 4", "Upgrade 5", "Upgrade 6", 'Silver Relic', 'Silver Uncap','Golden Relic'],
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
            "Esser (gun)": "Gun"
        }
    },

    "Atma/Ultima": {
        core: [
            new PlannerItem(1, PLANNER_ITEMS.flawedPrism, 250),

            new PlannerItem(2, PLANNER_ITEMS.bahaHorn, 2),
            new PlannerItem(2, SUPPLYTYPE.treasure, 137, 10),
            new PlannerItem(2, PLANNER_ITEMS.supremeMerit, 20),
            new PlannerItem(2, SUPPLYTYPE.treasure, 140, 1),

            new PlannerItem(3, PLANNER_ITEMS.legendaryMerit, 10),
            new PlannerItem(3, PLANNER_ITEMS.silverCentrum, 10),
            new PlannerItem(3, SUPPLYTYPE.treasure, 79, 3),
            new PlannerItem(3, SUPPLYTYPE.treasure, 138, 5)
        ],
        wtype: {
            Sword: null,
            Dagger: null,
            Spear: null,
            Axe: null,
            Staff: null,
            Gun: null,
            Fist: null,
            Bow: null,
            Harp: null,
            Katana: null,
            templates: [
                new PlannerItem(3, PLANNER_TEMPLATES.stones, 500)
            ]
        },
        element: {
            Fire: null,
            Water: null,
            Earth: null,
            Wind: null,
            Light: null,
            Dark: null,
            templates: [
                new PlannerItem(1, PLANNER_TEMPLATES.orbs.low, 250),
                new PlannerItem(1, PLANNER_TEMPLATES.whorls, 250),
                new PlannerItem(2, PLANNER_TEMPLATES.trialFragments, 20),
                new PlannerItem(3, PLANNER_TEMPLATES.quartz, 500),
                new PlannerItem(3, PLANNER_TEMPLATES.urns, 30)
            ]
        },
        stepNames: ["Rusted", "Relic", "Atma", "Ultima"]
    },

    Opus: {
        core: [
            new PlannerItem(1, SUPPLYTYPE.treasure, 537, 5),

            new PlannerItem(2, SUPPLYTYPE.treasure, 537, 5),
            new PlannerItem(2, PLANNER_ITEMS.silverCentrum, 5),
            new PlannerItem(2, PLANNER_ITEMS.legendaryMerit, 10),
            new PlannerItem(2, PLANNER_ITEMS.supremeMerit, 100),

            new PlannerItem(3, PLANNER_ITEMS.goldBrick, 1),
            new PlannerItem(3, SUPPLYTYPE.treasure, 538, 5), //tears
            new PlannerItem(3, SUPPLYTYPE.treasure, 79, 50), //horn
            new PlannerItem(3, SUPPLYTYPE.treasure, 534, 50), //key
            new PlannerItem(3, SUPPLYTYPE.treasure, 138, 50), //unit
            new PlannerItem(3, SUPPLYTYPE.treasure, 20781, 30) //anima
        ],
        wtype: {
            Sword: [new PlannerItem(3, SUPPLYTYPE.treasure, 543, 1)], //tidings
            Spear: [new PlannerItem(3, SUPPLYTYPE.treasure, 542, 1)],
            Axe: [new PlannerItem(3, SUPPLYTYPE.treasure, 539, 1)],
            Staff: [new PlannerItem(3, SUPPLYTYPE.treasure, 540, 1)],
            Harp: [new PlannerItem(3, SUPPLYTYPE.treasure, 541, 1)],
            Katana: [new PlannerItem(3, SUPPLYTYPE.treasure, 544, 1)],
            templates: [
                new PlannerItem(1, PLANNER_TEMPLATES.quartz, 500),
                new PlannerItem(1, PLANNER_TEMPLATES.stones, 255),

                new PlannerItem(2, PLANNER_TEMPLATES.urns, 30),
                new PlannerItem(2, PLANNER_TEMPLATES.genesisAnima, 10)
            ]
        },
        element: {
            Fire: null,
            Water: null,
            Earth: null,
            Wind: null,
            Light: null,
            Dark: null
        },
        stepNames: ["None", "Trade", "4*", "5*"],
        typeNames: {
            "Sword": "Light",
            "Spear": "Wind",
            "Axe": "Fire",
            "Staff": "Water",
            "Harp": "Earth",
            "Katana": "Dark",
        }
    }
};

(function hideTemplates(o) {
    if (o.templates) {
        Object.defineProperty(o, "templates", {enumerable: false});
    }
    else {
        for (let k of Object.keys(o)) {
            if (o[k] instanceof Object) { hideTemplates(o[k]); }
        }
    }
})(PlannerData);
