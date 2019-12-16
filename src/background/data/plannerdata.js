// Templates
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
        magna: {
            type: SUPPLYTYPE.treasure,
            Fire: 11,
            Water: 12,
            Earth: 13,
            Wind: 10,
            Light: 25,
            Dark: 30
        },
        magnaOmega: {
            type: SUPPLYTYPE.treasure,
            Fire: 19,
            Water: 20,
            Earth: 21,
            Wind: 18,
            Light: 26,
            Dark: 31
        },
        ancient: {
            type: SUPPLYTYPE.treasure,
            Fire: 64,
            Water: 60,
            Earth: 62,
            Wind: 65,
            Light: 66,
            Dark: 63
        },
        ancientOmega: {
            type: SUPPLYTYPE.treasure,
            Fire: 76,
            Water: 73,
            Earth: 74,
            Wind: 77,
            Light: 78,
            Dark: 75
        },
        epic: {
            type: SUPPLYTYPE.treasure,
            Fire: 85,
            Water: 68,
            Earth: 87,
            Wind: 92,
            Light: 67,
            Dark: 72
        },
        epicOmega: {
            type: SUPPLYTYPE.treasure,
            Fire: 86,
            Water: 142,
            Earth: 88,
            Wind: 93,
            Light: 141,
            Dark: 143
        },
        primarch: {
            type: SUPPLYTYPE.treasure,
            Fire: 506,
            Water: 507,
            Earth: 508,
            Wind: 509,
            Light: [506, 509],
            Dark: [507, 508]
        },
        genesis: {
            type: SUPPLYTYPE.treasure,
            Fire: 510,
            Water: 512,
            Earth: 514,
            Wind: 516,
            Light: 518,
            Dark: 520
        },
        genesisOmega: {
            type: SUPPLYTYPE.treasure,
            Fire: 511,
            Water: 513,
            Earth: 515,
            Wind: 517,
            Light: 519,
            Dark: 521
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
    astras: {
        type: SUPPLYTYPE.treasure,
        Fire: 25001,
        Water: 25002,
        Earth: 25003,
        Wind: 25004,
        Light: 25005,
        Dark: 25006
    },
    verumProofs: {
        type: SUPPLYTYPE.treasure,
        Fire: 25023,
        Water: 25024,
        Earth: 25025,
        Wind: 25026,
        Light: [25023, 25026],
        Dark: [25024, 25025]
    },
    elementalHalos: {
        type: SUPPLYTYPE.treasure,
        Fire: 5211,
        Water: 5221,
        Earth: 5231,
        Wind: 5241,
        Light: [5211, 5241],
        Dark: [5221, 5231]
    },
    treasureDrops: {
        low: {
            // Fine sand
            type: SUPPLYTYPE.treasure,
            Fire: 4,
            Water: 6,
            Earth: 8,
            Wind: 2
            // Light: [5211, 5241],
            // Dark: [5221, 5231]
        },
        lowOmega: {
            // Untamed
            type: SUPPLYTYPE.treasure,
            Fire: 5,
            Water: 7,
            Earth: 9,
            Wind: 3
            // Light: [5211, 5241],
            // Dark: [5221, 5231]
        },
        high: {
            // Blistering ore
            type: SUPPLYTYPE.treasure,
            Fire: 15,
            Water: 16,
            Earth: 17,
            Wind: 14
            // Light: [5211, 5241],
            // Dark: [5221, 5231]
        },
        ingredient: {
            // Wheat stalk
            type: SUPPLYTYPE.treasure,
            Fire: 33,
            Water: 23,
            Earth: 52,
            Wind: 38
            // Light: [5211, 5241],
            // Dark: [5221, 5231]
        },
        ingredientOmega: {
            // Wheat stalk
            type: SUPPLYTYPE.treasure,
            Fire: 120,
            Water: 99,
            Earth: 124,
            Wind: 91
            // Light: [5211, 5241],
            // Dark: [5221, 5231]
        }
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
    primevalHorn: new PlannerItem(SUPPLYTYPE.treasure, 79),
    silverCentrum: new PlannerItem(SUPPLYTYPE.treasure, 107),
    goldBrick: new PlannerItem(17, 20004),
    sephiraStone: new PlannerItem(SUPPLYTYPE.treasure, 25000),
    damaCrystal: new PlannerItem(SUPPLYTYPE.treasure, 203),
    genesisFrag: new PlannerItem(SUPPLYTYPE.treasure, 535)
};

/** Creates an item for the planner from any accepted input.
    @arg {Number|Object|PlannerItem} type
**/
function PlannerItem(...args) {
    let step = args[0], type, id, needed;
    // Dealing with input
    if (args.length == 2) {
        type = args[0];
        id = args[1];
    }
    else if (Number.isInteger(args[1])) { // normal items
        type = args[1];
        id = args[2];
        needed = args[3];
    }
    else if (args[1] instanceof PlannerItem) { // shorthands
        let item = args[1];
        type = item.type;
        id = item.id;
        needed = args[2];
    }
    else if (args[1].type) { // templates
        let item = args[1];
        type = item.type;
        id = item;
        needed = args[2];
        this.isTemplate = true;
        this.templateKey = args[3];
    }
    else {
        deverror("Invalid planner item, check data.", args);
        return;
    }

    // Actual object assigning.
    this.step = step;
    this.type = type;
    this.id = id;
    this.needed = needed;
}

window.PlannerData = {
    Arcarum: {
        core: [ // Items needed for every craft
            new PlannerItem(1, PLANNER_ITEMS.sephiraStone, 2),
            new PlannerItem(1, PLANNER_ITEMS.flawlessPrism, 100),

            new PlannerItem(2, PLANNER_ITEMS.sephiraStone, 5),
            new PlannerItem(2, PLANNER_ITEMS.rainbowPrism, 100),

            new PlannerItem(3, PLANNER_ITEMS.sephiraStone, 10),

            new PlannerItem(4, PLANNER_ITEMS.sephiraStone, 15),
            new PlannerItem(4, PLANNER_ITEMS.legendaryMerit, 3),

            new PlannerItem(5, PLANNER_ITEMS.sephiraStone, 30),
            new PlannerItem(5, PLANNER_ITEMS.silverCentrum, 5),
            new PlannerItem(5, SUPPLYTYPE.evolution, 20014, 1),

            new PlannerItem(6, PLANNER_ITEMS.sephiraStone, 45),

            new PlannerItem(7, SUPPLYTYPE.treasure, 79, 10), // horn
            new PlannerItem(7, SUPPLYTYPE.treasure, 535, 80),

            new PlannerItem(8, PLANNER_ITEMS.sephiraStone, 30),
            new PlannerItem(8, SUPPLYTYPE.treasure, 25036, 1) // Evolite
        ],
        wtype: {// Summon specific items
            "Justice (Maria Theresa)": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 25007, 2), // idean
                new PlannerItem(1, SUPPLYTYPE.treasure, 25021, 1), // haze

                new PlannerItem(2, SUPPLYTYPE.treasure, 25007, 3), // idean
                new PlannerItem(2, SUPPLYTYPE.treasure, 25021, 3), // haze

                new PlannerItem(3, SUPPLYTYPE.treasure, 25007, 5), // idean
                new PlannerItem(3, SUPPLYTYPE.treasure, 25021, 7), // haze

                new PlannerItem(4, SUPPLYTYPE.treasure, 25007, 7), // idean
                new PlannerItem(4, SUPPLYTYPE.treasure, 25021, 16), // haze

                new PlannerItem(5, SUPPLYTYPE.treasure, 25007, 15), // idean
                new PlannerItem(5, SUPPLYTYPE.treasure, 25021, 24), // haze

                new PlannerItem(6, SUPPLYTYPE.treasure, 25007, 25), // idean
                new PlannerItem(6, SUPPLYTYPE.treasure, 25034, 10), // fragment
                new PlannerItem(6, SUPPLYTYPE.treasure, 25021, 32), // haze

                new PlannerItem(7, SUPPLYTYPE.treasure, 25034, 20), // fragment
                new PlannerItem(7, SUPPLYTYPE.treasure, 130, 50), // treasure

                new PlannerItem(8, SUPPLYTYPE.treasure, 25007, 20) // idean
            ],
            "The Hanged Man (Caim)": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 25008, 2), // idean
                new PlannerItem(1, SUPPLYTYPE.treasure, 25021, 1), // haze

                new PlannerItem(2, SUPPLYTYPE.treasure, 25008, 3), // idean
                new PlannerItem(2, SUPPLYTYPE.treasure, 25021, 3), // haze

                new PlannerItem(3, SUPPLYTYPE.treasure, 25008, 5), // idean
                new PlannerItem(3, SUPPLYTYPE.treasure, 25021, 7), // haze

                new PlannerItem(4, SUPPLYTYPE.treasure, 25008, 7), // idean
                new PlannerItem(4, SUPPLYTYPE.treasure, 25021, 16), // haze

                new PlannerItem(5, SUPPLYTYPE.treasure, 25008, 15), // idean
                new PlannerItem(5, SUPPLYTYPE.treasure, 25021, 24), // haze

                new PlannerItem(6, SUPPLYTYPE.treasure, 25008, 25), // idean
                new PlannerItem(6, SUPPLYTYPE.treasure, 25033, 10), // fragment
                new PlannerItem(6, SUPPLYTYPE.treasure, 25021, 32), // haze

                new PlannerItem(7, SUPPLYTYPE.treasure, 25033, 20), // fragment
                new PlannerItem(7, SUPPLYTYPE.treasure, 129, 50), // treasure

                new PlannerItem(8, SUPPLYTYPE.treasure, 25008, 20) // idean
            ],
            "Death (Nier)": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 25009, 2), // idean
                new PlannerItem(1, SUPPLYTYPE.treasure, 25021, 1), // haze

                new PlannerItem(2, SUPPLYTYPE.treasure, 25009, 3), // idean
                new PlannerItem(2, SUPPLYTYPE.treasure, 25021, 3), // haze

                new PlannerItem(3, SUPPLYTYPE.treasure, 25009, 5), // idean
                new PlannerItem(3, SUPPLYTYPE.treasure, 25021, 7), // haze

                new PlannerItem(4, SUPPLYTYPE.treasure, 25009, 7), // idean
                new PlannerItem(4, SUPPLYTYPE.treasure, 25021, 16), // haze

                new PlannerItem(5, SUPPLYTYPE.treasure, 25009, 15), // idean
                new PlannerItem(5, SUPPLYTYPE.treasure, 25021, 24), // haze

                new PlannerItem(6, SUPPLYTYPE.treasure, 25009, 25), // idean
                new PlannerItem(6, SUPPLYTYPE.treasure, 25035, 10), // fragment
                new PlannerItem(6, SUPPLYTYPE.treasure, 25021, 32), // haze

                new PlannerItem(7, SUPPLYTYPE.treasure, 25035, 20), // fragment
                new PlannerItem(7, SUPPLYTYPE.treasure, 128, 50), // treasure

                new PlannerItem(8, SUPPLYTYPE.treasure, 25009, 20) // idean
            ],
            "Temperance (Estarriola)": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 25010, 2), // idean
                new PlannerItem(1, SUPPLYTYPE.treasure, 25020, 1), // haze

                new PlannerItem(2, SUPPLYTYPE.treasure, 25010, 3), // idean
                new PlannerItem(2, SUPPLYTYPE.treasure, 25020, 3), // haze

                new PlannerItem(3, SUPPLYTYPE.treasure, 25010, 5), // idean
                new PlannerItem(3, SUPPLYTYPE.treasure, 25020, 7), // haze

                new PlannerItem(4, SUPPLYTYPE.treasure, 25010, 7), // idean
                new PlannerItem(4, SUPPLYTYPE.treasure, 25020, 16), // haze

                new PlannerItem(5, SUPPLYTYPE.treasure, 25010, 15), // idean
                new PlannerItem(5, SUPPLYTYPE.treasure, 25020, 24), // haze

                new PlannerItem(6, SUPPLYTYPE.treasure, 25010, 25), // idean
                new PlannerItem(6, SUPPLYTYPE.treasure, 25035, 10), // fragment
                new PlannerItem(6, SUPPLYTYPE.treasure, 25020, 32), // haze

                new PlannerItem(7, SUPPLYTYPE.treasure, 25035, 20), // fragment
                new PlannerItem(7, SUPPLYTYPE.treasure, 126, 50), // treasure

                new PlannerItem(8, SUPPLYTYPE.treasure, 25010, 20) // idean
            ],
            "The Devil (Fraux)": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 25011, 2), // idean
                new PlannerItem(1, SUPPLYTYPE.treasure, 25020, 1), // haze

                new PlannerItem(2, SUPPLYTYPE.treasure, 25011, 3), // idean
                new PlannerItem(2, SUPPLYTYPE.treasure, 25020, 3), // haze

                new PlannerItem(3, SUPPLYTYPE.treasure, 25011, 5), // idean
                new PlannerItem(3, SUPPLYTYPE.treasure, 25020, 7), // haze

                new PlannerItem(4, SUPPLYTYPE.treasure, 25011, 7), // idean
                new PlannerItem(4, SUPPLYTYPE.treasure, 25020, 16), // haze

                new PlannerItem(5, SUPPLYTYPE.treasure, 25011, 15), // idean
                new PlannerItem(5, SUPPLYTYPE.treasure, 25020, 24), // haze

                new PlannerItem(6, SUPPLYTYPE.treasure, 25011, 25), // idean
                new PlannerItem(6, SUPPLYTYPE.treasure, 25033, 10), // fragment
                new PlannerItem(6, SUPPLYTYPE.treasure, 25020, 32), // haze

                new PlannerItem(7, SUPPLYTYPE.treasure, 25033, 20), // fragment
                new PlannerItem(7, SUPPLYTYPE.treasure, 144, 50), // treasure

                new PlannerItem(8, SUPPLYTYPE.treasure, 25011, 20) // idean
            ],
            "The Tower (Lobelia)": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 25012, 2), // idean
                new PlannerItem(1, SUPPLYTYPE.treasure, 25021, 1), // haze

                new PlannerItem(2, SUPPLYTYPE.treasure, 25012, 3), // idean
                new PlannerItem(2, SUPPLYTYPE.treasure, 25021, 3), // haze

                new PlannerItem(3, SUPPLYTYPE.treasure, 25012, 5), // idean
                new PlannerItem(3, SUPPLYTYPE.treasure, 25021, 7), // haze

                new PlannerItem(4, SUPPLYTYPE.treasure, 25012, 7), // idean
                new PlannerItem(4, SUPPLYTYPE.treasure, 25021, 16), // haze

                new PlannerItem(5, SUPPLYTYPE.treasure, 25012, 15), // idean
                new PlannerItem(5, SUPPLYTYPE.treasure, 25021, 24), // haze

                new PlannerItem(6, SUPPLYTYPE.treasure, 25012, 25), // idean
                new PlannerItem(6, SUPPLYTYPE.treasure, 25035, 10), // fragment
                new PlannerItem(6, SUPPLYTYPE.treasure, 25021, 32), // haze

                new PlannerItem(7, SUPPLYTYPE.treasure, 25035, 20), // fragment
                new PlannerItem(7, SUPPLYTYPE.treasure, 148, 50), // treasure

                new PlannerItem(8, SUPPLYTYPE.treasure, 25012, 20) // idean
            ],
            "The Star (Geisenborger)": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 25013, 2), // idean
                new PlannerItem(1, SUPPLYTYPE.treasure, 25020, 1), // haze

                new PlannerItem(2, SUPPLYTYPE.treasure, 25013, 3), // idean
                new PlannerItem(2, SUPPLYTYPE.treasure, 25020, 3), // haze

                new PlannerItem(3, SUPPLYTYPE.treasure, 25013, 5), // idean
                new PlannerItem(3, SUPPLYTYPE.treasure, 25020, 7), // haze

                new PlannerItem(4, SUPPLYTYPE.treasure, 25013, 7), // idean
                new PlannerItem(4, SUPPLYTYPE.treasure, 25020, 16), // haze

                new PlannerItem(5, SUPPLYTYPE.treasure, 25013, 15), // idean
                new PlannerItem(5, SUPPLYTYPE.treasure, 25020, 24), // haze

                new PlannerItem(6, SUPPLYTYPE.treasure, 25013, 25), // idean
                new PlannerItem(6, SUPPLYTYPE.treasure, 25035, 10), // fragment
                new PlannerItem(6, SUPPLYTYPE.treasure, 25020, 32), // haze

                new PlannerItem(7, SUPPLYTYPE.treasure, 25035, 20), // fragment
                new PlannerItem(7, SUPPLYTYPE.treasure, 145, 50), // treasure

                new PlannerItem(8, SUPPLYTYPE.treasure, 25013, 20) // idean
            ],
            "The Moon (Haaselia)": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 25014, 2), // idean
                new PlannerItem(1, SUPPLYTYPE.treasure, 25021, 1), // haze

                new PlannerItem(2, SUPPLYTYPE.treasure, 25014, 3), // idean
                new PlannerItem(2, SUPPLYTYPE.treasure, 25021, 3), // haze

                new PlannerItem(3, SUPPLYTYPE.treasure, 25014, 5), // idean
                new PlannerItem(3, SUPPLYTYPE.treasure, 25021, 7), // haze

                new PlannerItem(4, SUPPLYTYPE.treasure, 25014, 7), // idean
                new PlannerItem(4, SUPPLYTYPE.treasure, 25021, 16), // haze

                new PlannerItem(5, SUPPLYTYPE.treasure, 25014, 15), // idean
                new PlannerItem(5, SUPPLYTYPE.treasure, 25021, 24), // haze

                new PlannerItem(6, SUPPLYTYPE.treasure, 25014, 25), // idean
                new PlannerItem(6, SUPPLYTYPE.treasure, 25034, 10), // fragment
                new PlannerItem(6, SUPPLYTYPE.treasure, 25021, 32), // haze

                new PlannerItem(7, SUPPLYTYPE.treasure, 25034, 20), // fragment
                new PlannerItem(7, SUPPLYTYPE.treasure, 146, 50), // treasure

                new PlannerItem(8, SUPPLYTYPE.treasure, 25014, 20) // idean
            ],
            "The Sun (Alanaan)": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 25015, 2), // idean
                new PlannerItem(1, SUPPLYTYPE.treasure, 25020, 1), // haze

                new PlannerItem(2, SUPPLYTYPE.treasure, 25015, 3), // idean
                new PlannerItem(2, SUPPLYTYPE.treasure, 25020, 3), // haze

                new PlannerItem(3, SUPPLYTYPE.treasure, 25015, 5), // idean
                new PlannerItem(3, SUPPLYTYPE.treasure, 25020, 7), // haze

                new PlannerItem(4, SUPPLYTYPE.treasure, 25015, 7), // idean
                new PlannerItem(4, SUPPLYTYPE.treasure, 25020, 16), // haze

                new PlannerItem(5, SUPPLYTYPE.treasure, 25015, 15), // idean
                new PlannerItem(5, SUPPLYTYPE.treasure, 25020, 24), // haze

                new PlannerItem(6, SUPPLYTYPE.treasure, 25015, 25), // idean
                new PlannerItem(6, SUPPLYTYPE.treasure, 25033, 10), // fragment
                new PlannerItem(6, SUPPLYTYPE.treasure, 25020, 32), // haze

                new PlannerItem(7, SUPPLYTYPE.treasure, 25033, 20), // fragment
                new PlannerItem(7, SUPPLYTYPE.treasure, 127, 50), // treasure

                new PlannerItem(8, SUPPLYTYPE.treasure, 25015, 20) // idean
            ],
            "Judgement (Katzelia)": [
                new PlannerItem(1, SUPPLYTYPE.treasure, 25016, 2), // idean
                new PlannerItem(1, SUPPLYTYPE.treasure, 25020, 1), // haze

                new PlannerItem(2, SUPPLYTYPE.treasure, 25016, 3), // idean
                new PlannerItem(2, SUPPLYTYPE.treasure, 25020, 3), // haze

                new PlannerItem(3, SUPPLYTYPE.treasure, 25016, 5), // idean
                new PlannerItem(3, SUPPLYTYPE.treasure, 25020, 7), // haze

                new PlannerItem(4, SUPPLYTYPE.treasure, 25016, 7), // idean
                new PlannerItem(4, SUPPLYTYPE.treasure, 25020, 16), // haze

                new PlannerItem(5, SUPPLYTYPE.treasure, 25016, 15), // idean
                new PlannerItem(5, SUPPLYTYPE.treasure, 25020, 24), // haze

                new PlannerItem(6, SUPPLYTYPE.treasure, 25016, 25), // idean
                new PlannerItem(6, SUPPLYTYPE.treasure, 25034, 10), // fragment
                new PlannerItem(6, SUPPLYTYPE.treasure, 25020, 32), // haze

                new PlannerItem(7, SUPPLYTYPE.treasure, 25034, 20), // fragment
                new PlannerItem(7, SUPPLYTYPE.treasure, 147, 50), // treasure

                new PlannerItem(8, SUPPLYTYPE.treasure, 25016, 20) // idean
            ],
            templates: [
                new PlannerItem(1, PLANNER_TEMPLATES.astras, 3),
                new PlannerItem(1, PLANNER_TEMPLATES.verumProofs, 6),
                new PlannerItem(1, PLANNER_TEMPLATES.anima.magnaOmega, 30),

                new PlannerItem(2, PLANNER_TEMPLATES.astras, 5),
                new PlannerItem(2, PLANNER_TEMPLATES.verumProofs, 16),
                new PlannerItem(2, PLANNER_TEMPLATES.quartz, 100),

                new PlannerItem(3, PLANNER_TEMPLATES.astras, 10),
                new PlannerItem(3, PLANNER_TEMPLATES.verumProofs, 30),
                new PlannerItem(3, PLANNER_TEMPLATES.anima.ancient, 30),

                new PlannerItem(4, PLANNER_TEMPLATES.astras, 15),
                new PlannerItem(4, PLANNER_TEMPLATES.verumProofs, 50),
                new PlannerItem(4, PLANNER_TEMPLATES.anima.epic, 30),

                new PlannerItem(5, PLANNER_TEMPLATES.astras, 30),
                new PlannerItem(5, PLANNER_TEMPLATES.verumProofs, 80),
                new PlannerItem(5, PLANNER_TEMPLATES.anima.primarch, 20),

                new PlannerItem(6, PLANNER_TEMPLATES.astras, 45),
                new PlannerItem(6, PLANNER_TEMPLATES.verumProofs, 120),
                new PlannerItem(6, PLANNER_TEMPLATES.anima.genesisOmega, 10),

                new PlannerItem(7, PLANNER_TEMPLATES.showdowns.items, 100),
                new PlannerItem(7, PLANNER_TEMPLATES.trialFragments, 50),
                new PlannerItem(7, PLANNER_TEMPLATES.verumProofs, 250),

                new PlannerItem(8, PLANNER_TEMPLATES.astras, 200)
            ]
        },
        element: {Locked: null},
        stepNames: ["None", "Obtain", "SR 1*", "SR 2*", "SR 3*", "SSR Upgrade", "SSR 4*", "SSR 5*", "Recruitment"],
        typeNames: {
            "Justice (Maria Theresa)": "Water",
            "The Hanged Man (Caim)": "Earth",
            "Death (Nier)": "Dark",
            "Temperance (Estarriola)": "Wind",
            "The Devil (Fraux)": "Fire",
            "The Tower (Lobelia)": "Earth",
            "The Star (Geisenborger)": "Light",
            "The Moon (Haaselia)": "Water",
            "The Sun (Alanaan)": "Fire",
            "Judgement (Katzelia)": "Wind"
        }
    },
    Bahamut: {
        core: [ // Items needed for every craft
            new PlannerItem(1, SUPPLYTYPE.treasure, 59, 1),

            // Nova
            new PlannerItem(2, SUPPLYTYPE.treasure, 59, 3),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1, 7),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1111, 30),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1121, 30),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1131, 30),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1141, 30),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1151, 30),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1161, 30),

            // Coda
            new PlannerItem(3, SUPPLYTYPE.treasure, 79, 5),
            new PlannerItem(3, SUPPLYTYPE.treasure, 2003, 3)
        ],
        wtype: {// Weapon type specific items
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
        element: {Dark: null}, // no special items, but name needed for option parsing (well not really, but it's nice)
        stepNames: ["Rusted", "Base", "Nova", "Coda"] // In order starting from 0, which is the true starting (not part of the craft) step
    },
    Class: {
        core: [ // Items needed for every craft
            new PlannerItem(1, SUPPLYTYPE.treasure, 54, 20),
            new PlannerItem(1, PLANNER_ITEMS.prismChip, 50),
            new PlannerItem(1, PLANNER_ITEMS.blueSkyCrystal, 5),
            // Rebuild
            new PlannerItem(2, PLANNER_ITEMS.prismChip, 120),
            new PlannerItem(2, PLANNER_ITEMS.championMerit, 30),
            new PlannerItem(2, SUPPLYTYPE.evolution, 20003, 2), // steel brick
            new PlannerItem(2, PLANNER_ITEMS.blueSkyCrystal, 5),
            // Elechange
            new PlannerItem(3, PLANNER_ITEMS.silverCentrum, 3),
            new PlannerItem(3, PLANNER_ITEMS.blueSkyCrystal, 15),

            new PlannerItem(4, SUPPLYTYPE.treasure, 20771, 3),
            new PlannerItem(4, SUPPLYTYPE.treasure, 79, 1),
            new PlannerItem(4, PLANNER_ITEMS.blueSkyCrystal, 20),
            new PlannerItem(4, PLANNER_ITEMS.silverCentrum, 3)
        ],
        wtype: {// Weapon type specific items
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
                new PlannerItem(1, SUPPLYTYPE.treasure, 20211, 10), // creeds
                new PlannerItem(2, SUPPLYTYPE.treasure, 20761, 10), // dists
                new PlannerItem(2, SUPPLYTYPE.treasure, 20211, 25), // creeds
                new PlannerItem(3, SUPPLYTYPE.treasure, 20761, 30), // dists
                new PlannerItem(4, SUPPLYTYPE.treasure, 20231, 10) // esteems
            ],
            templates: [
                new PlannerItem(1, PLANNER_TEMPLATES.showdowns.items, 50),
                new PlannerItem(1, PLANNER_TEMPLATES.tomes, 70),

                new PlannerItem(2, PLANNER_TEMPLATES.stones, 256),
                new PlannerItem(2, PLANNER_TEMPLATES.quartz, 50),

                new PlannerItem(3, PLANNER_TEMPLATES.stones, 512),

                new PlannerItem(4, PLANNER_TEMPLATES.stones, 255)
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
                new PlannerItem(4, PLANNER_TEMPLATES.anima.primarch, 6)
            ]
        },
        options: {
            "First time": [
                new PlannerItem(2, PLANNER_TEMPLATES.stones, -206, "wtype"),
                new PlannerItem(3, PLANNER_TEMPLATES.stones, -362, "wtype")
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
    Revenant: {
        core: [
            // Awakening
            new PlannerItem(1, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.orbs.high.Light, 50),
            new PlannerItem(1, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.scrolls.Light, 50),
            new PlannerItem(1, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.whorls.Light, 50),
            new PlannerItem(1, SUPPLYTYPE.treasure, 1151, 50),
            new PlannerItem(1, SUPPLYTYPE.treasure, 2001, 50),
            new PlannerItem(1, SUPPLYTYPE.crystals, 0, 100),
            new PlannerItem(2, SUPPLYTYPE.treasure, 1202, 250),

            // Upgrade 1
            new PlannerItem(3, SUPPLYTYPE.treasure, 2, 300),
            new PlannerItem(3, SUPPLYTYPE.treasure, 5, 100),
            new PlannerItem(3, SUPPLYTYPE.treasure, 8, 100),
            new PlannerItem(3, PLANNER_ITEMS.supremeMerit, 10),
            new PlannerItem(3, PLANNER_ITEMS.blueSkyCrystal, 3),
            new PlannerItem(3, SUPPLYTYPE.crystals, 0, 100),

            // 2
            new PlannerItem(4, SUPPLYTYPE.treasure, 6, 100),
            new PlannerItem(4, SUPPLYTYPE.treasure, 24, 100),
            new PlannerItem(4, SUPPLYTYPE.treasure, 28, 100),
            new PlannerItem(4, PLANNER_ITEMS.rainbowPrism, 50),
            new PlannerItem(4, PLANNER_ITEMS.blueSkyCrystal, 5),
            new PlannerItem(4, SUPPLYTYPE.crystals, 0, 200),

            // 3
            new PlannerItem(5, SUPPLYTYPE.treasure, 3, 300),
            new PlannerItem(5, SUPPLYTYPE.treasure, 22, 100),
            new PlannerItem(5, SUPPLYTYPE.treasure, 39, 80),
            new PlannerItem(5, PLANNER_ITEMS.supremeMerit, 10),
            new PlannerItem(5, PLANNER_ITEMS.blueSkyCrystal, 7),
            new PlannerItem(5, SUPPLYTYPE.crystals, 0, 300),

            // 4
            new PlannerItem(6, SUPPLYTYPE.treasure, 17, 100),
            new PlannerItem(6, SUPPLYTYPE.treasure, 29, 100),
            new PlannerItem(6, SUPPLYTYPE.treasure, 40, 80),
            new PlannerItem(6, PLANNER_ITEMS.rainbowPrism, 150),
            new PlannerItem(6, PLANNER_ITEMS.blueSkyCrystal, 10),
            new PlannerItem(6, SUPPLYTYPE.crystals, 0, 400),
            // 5
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
            // 6
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Fire, 3),
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Water, 3),
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Earth, 3),
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Wind, 3),
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Light, 3),
            new PlannerItem(8, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Dark, 3),
            new PlannerItem(8, PLANNER_ITEMS.rainbowPrism, 250),
            new PlannerItem(8, PLANNER_ITEMS.blueSkyCrystal, 30),
            new PlannerItem(8, SUPPLYTYPE.evolution, 20004, 1), // Gold brick 1
            new PlannerItem(8, SUPPLYTYPE.crystals, 0, 600),

            // 8 Crafting an uncapped Silver relic
            new PlannerItem(10, SUPPLYTYPE.treasure, 5011, 300),
            new PlannerItem(10, SUPPLYTYPE.treasure, 5021, 300),
            new PlannerItem(10, SUPPLYTYPE.treasure, 5031, 300),
            new PlannerItem(10, SUPPLYTYPE.treasure, 5041, 300),
            new PlannerItem(10, SUPPLYTYPE.treasure, 5051, 300),
            new PlannerItem(10, SUPPLYTYPE.treasure, 5061, 300),

            // 9 Creating a Golden Relic
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

            // All need 24 rusted weapons of the same type as the Eternal.

            "Uno (spear)": [new PlannerItem(11, SUPPLYTYPE.treasure, 20421, 30)],
            "Sorn (bow)": [new PlannerItem(11, SUPPLYTYPE.treasure, 20481, 30)],
            "Sarasa (axe)": [new PlannerItem(11, SUPPLYTYPE.treasure, 20411, 30)],
            "Feower (dagger)": [new PlannerItem(11, SUPPLYTYPE.treasure, 20461, 30)],
            "Funf (staff)": [new PlannerItem(11, SUPPLYTYPE.treasure, 20431, 30)],
            "Six (fist)": [new PlannerItem(11, SUPPLYTYPE.treasure, 20471, 30)],
            "Siete (sword)": [new PlannerItem(11, SUPPLYTYPE.treasure, 20691, 30)],
            "Okto (katana)": [new PlannerItem(11, SUPPLYTYPE.treasure, 20671, 30)],
            "Nio (harp)": [new PlannerItem(11, SUPPLYTYPE.treasure, 20491, 30)],
            "Esser (gun)": [new PlannerItem(11, SUPPLYTYPE.treasure, 20451, 30)],
            templates: [
                new PlannerItem(9, PLANNER_TEMPLATES.relicShards, 40), // Silver fragments
                new PlannerItem(10, PLANNER_TEMPLATES.stones, 300), // Stones
                new PlannerItem(11, PLANNER_TEMPLATES.revenantFragments, 100) // Revenant Fragments
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

                // Upgrade 1
                new PlannerItem(3, PLANNER_TEMPLATES.orbs.low, 100),
                new PlannerItem(3, PLANNER_TEMPLATES.whorls, 100),
                new PlannerItem(3, PLANNER_TEMPLATES.tomes, 100),
                new PlannerItem(3, PLANNER_TEMPLATES.scrolls, 150),

                // Upgrade 2
                new PlannerItem(4, PLANNER_TEMPLATES.orbs.low, 150),
                new PlannerItem(4, PLANNER_TEMPLATES.tomes, 150),
                new PlannerItem(4, PLANNER_TEMPLATES.whorls, 150),
                new PlannerItem(4, PLANNER_TEMPLATES.scales, 30),
                new PlannerItem(4, PLANNER_TEMPLATES.trueAnima, 3),

                // Upgrade 3
                new PlannerItem(5, PLANNER_TEMPLATES.orbs.low, 200),
                new PlannerItem(5, PLANNER_TEMPLATES.orbs.high, 100),
                new PlannerItem(5, PLANNER_TEMPLATES.whorls, 200),
                new PlannerItem(5, PLANNER_TEMPLATES.anima.magna, 100),

                // Upgrade 4
                new PlannerItem(6, PLANNER_TEMPLATES.orbs.low, 250),
                new PlannerItem(6, PLANNER_TEMPLATES.scales, 50),
                new PlannerItem(6, PLANNER_TEMPLATES.whorls, 250),
                new PlannerItem(6, PLANNER_TEMPLATES.trueAnima, 3),

                // Upgrade 5
                new PlannerItem(7, PLANNER_TEMPLATES.omegaItem, 60)
            ]
        },
        stepNames: ["Revenant", "Awaken", "Elechange", "Upgrade 1", "Upgrade 2", "Upgrade 3", "Upgrade 4", "Upgrade 5", "Upgrade 6", "Silver Relic", "Silver Uncap", "Golden Relic"],
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
            templates: [new PlannerItem(3, PLANNER_TEMPLATES.stones, 500)]
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
        options: {
            "Gauph key": [new PlannerItem(false, SUPPLYTYPE.treasure, 137, 5)],
            "Ultima key": [
                new PlannerItem(false, SUPPLYTYPE.treasure, 138, 7),
                new PlannerItem(false, PLANNER_ITEMS.legendaryMerit, 2)
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
            new PlannerItem(3, SUPPLYTYPE.treasure, 538, 5), // tears
            new PlannerItem(3, SUPPLYTYPE.treasure, 79, 50), // horn
            new PlannerItem(3, SUPPLYTYPE.treasure, 534, 50), // key
            new PlannerItem(3, SUPPLYTYPE.treasure, 138, 50), // unit
            new PlannerItem(3, SUPPLYTYPE.treasure, 20781, 30) // anima
        ],
        wtype: {
            Sword: [new PlannerItem(3, SUPPLYTYPE.treasure, 543, 1)], // tidings
            Spear: [new PlannerItem(3, SUPPLYTYPE.treasure, 542, 1)],
            Axe: [new PlannerItem(3, SUPPLYTYPE.treasure, 539, 1)],
            Staff: [new PlannerItem(3, SUPPLYTYPE.treasure, 540, 1)],
            Harp: [new PlannerItem(3, SUPPLYTYPE.treasure, 541, 1)],
            Katana: [new PlannerItem(3, SUPPLYTYPE.treasure, 544, 1)],
            templates: [
                new PlannerItem(1, PLANNER_TEMPLATES.quartz, 500),
                new PlannerItem(1, PLANNER_TEMPLATES.stones, 255),

                new PlannerItem(2, PLANNER_TEMPLATES.urns, 30),
                new PlannerItem(2, PLANNER_TEMPLATES.anima.genesisOmega, 10)
            ]
        },
        element: {Locked: null},
        options: {
            "Revelation Pendulum": [new PlannerItem(false, SUPPLYTYPE.treasure, 537, 5)],
            "Gospel Pendulum": [
                new PlannerItem(false, SUPPLYTYPE.treasure, 538, 5),
                new PlannerItem(false, SUPPLYTYPE.treasure, 535, 30)
            ]
        },
        stepNames: ["None", "Trade", "4*", "5*"],
        typeNames: {
            "Sword": "Light",
            "Spear": "Wind",
            "Axe": "Fire",
            "Staff": "Water",
            "Harp": "Earth",
            "Katana": "Dark"
        }
    },
    Hollowsky: {
        core: [
            new PlannerItem(1, SUPPLYTYPE.treasure, 534, 30),

            new PlannerItem(2, SUPPLYTYPE.treasure, 534, 30),
            new PlannerItem(2, PLANNER_ITEMS.legendaryMerit, 5),
            new PlannerItem(2, PLANNER_ITEMS.blueSkyCrystal, 30)
        ],
        wtype: {
            Sword: [
                new PlannerItem(1, PLANNER_TEMPLATES.relicShards.type, PLANNER_TEMPLATES.relicShards.Dagger, 10),

                new PlannerItem(2, PLANNER_TEMPLATES.relicShards.type, PLANNER_TEMPLATES.relicShards.Dagger, 10),
                new PlannerItem(2, PLANNER_TEMPLATES.stones.type, PLANNER_TEMPLATES.stones.Dagger, 200)
            ],
            Spear: [
                new PlannerItem(1, PLANNER_TEMPLATES.relicShards.type, PLANNER_TEMPLATES.relicShards.Katana, 10),

                new PlannerItem(2, PLANNER_TEMPLATES.relicShards.type, PLANNER_TEMPLATES.relicShards.Katana, 10),
                new PlannerItem(2, PLANNER_TEMPLATES.stones.type, PLANNER_TEMPLATES.stones.Katana, 200)
            ],
            Axe: [
                new PlannerItem(1, PLANNER_TEMPLATES.relicShards.type, PLANNER_TEMPLATES.relicShards.Fist, 10),

                new PlannerItem(2, PLANNER_TEMPLATES.relicShards.type, PLANNER_TEMPLATES.relicShards.Fist, 10),
                new PlannerItem(2, PLANNER_TEMPLATES.stones.type, PLANNER_TEMPLATES.stones.Fist, 200)
            ],
            Staff: [
                new PlannerItem(1, PLANNER_TEMPLATES.relicShards.type, PLANNER_TEMPLATES.relicShards.Harp, 10),

                new PlannerItem(2, PLANNER_TEMPLATES.relicShards.type, PLANNER_TEMPLATES.relicShards.Harp, 10),
                new PlannerItem(2, PLANNER_TEMPLATES.stones.type, PLANNER_TEMPLATES.stones.Harp, 200)
            ],
            Bow: [
                new PlannerItem(1, PLANNER_TEMPLATES.relicShards.type, PLANNER_TEMPLATES.relicShards.Gun, 10),

                new PlannerItem(2, PLANNER_TEMPLATES.relicShards.type, PLANNER_TEMPLATES.relicShards.Gun, 10),
                new PlannerItem(2, PLANNER_TEMPLATES.stones.type, PLANNER_TEMPLATES.stones.Gun, 200)
            ],
            templates: [
                new PlannerItem(1, PLANNER_TEMPLATES.relicShards, 10),

                new PlannerItem(2, PLANNER_TEMPLATES.relicShards, 10),
                new PlannerItem(2, PLANNER_TEMPLATES.stones, 200)
            ]
        },
        element: {Locked: null},
        stepNames: ["None", "Trade", "4*"],
        typeNames: {
            "Sword": "Dark",
            "Spear": "Fire",
            "Axe": "Earth",
            "Staff": "Water",
            "Bow": "Light"
        }
    },
    "Seraphic (main)": {
        core: [
            new PlannerItem(3, PLANNER_ITEMS.championMerit, 3),

            new PlannerItem(4, PLANNER_ITEMS.supremeMerit, 3),

            new PlannerItem(5, PLANNER_ITEMS.legendaryMerit, 2),
            new PlannerItem(5, PLANNER_ITEMS.bahaHorn, 2),

            new PlannerItem(6, PLANNER_ITEMS.primevalHorn, 3),
            new PlannerItem(6, PLANNER_ITEMS.damaCrystal, 5),
            new PlannerItem(6, PLANNER_ITEMS.genesisFrag, 40),
            new PlannerItem(6, SUPPLYTYPE.treasure, 531, 5), // qilin
            new PlannerItem(6, SUPPLYTYPE.treasure, 529, 5) // huang
        ],
        wtype: {
            "Raphael": [],
            "Michael": [],
            "Gabriel": [],
            "Uriel": [],
            templates: [
                // Light and dark are different
                new PlannerItem(1, PLANNER_TEMPLATES.orbs.low, 5),
                new PlannerItem(1, PLANNER_TEMPLATES.tomes, 5),
                new PlannerItem(1, PLANNER_TEMPLATES.treasureDrops.low, 5),
                new PlannerItem(1, PLANNER_TEMPLATES.treasureDrops.lowOmega, 3),
                new PlannerItem(1, PLANNER_TEMPLATES.whorls, 10),
                new PlannerItem(1, PLANNER_TEMPLATES.scales, 1),

                // uncap 1
                new PlannerItem(2, PLANNER_TEMPLATES.treasureDrops.low, 20),
                new PlannerItem(2, PLANNER_TEMPLATES.orbs.low, 10),
                new PlannerItem(2, PLANNER_TEMPLATES.tomes, 10),
                new PlannerItem(2, PLANNER_TEMPLATES.whorls, 30),
                new PlannerItem(2, PLANNER_TEMPLATES.scales, 5),
                new PlannerItem(2, PLANNER_TEMPLATES.orbs.high, 3),
                new PlannerItem(2, PLANNER_TEMPLATES.elementalHalos, 1),

                // uncap 2
                new PlannerItem(3, PLANNER_TEMPLATES.treasureDrops.lowOmega, 20),
                new PlannerItem(3, PLANNER_TEMPLATES.orbs.high, 15),
                new PlannerItem(3, PLANNER_TEMPLATES.scrolls, 20),
                new PlannerItem(3, PLANNER_TEMPLATES.whorls, 30),
                new PlannerItem(3, PLANNER_TEMPLATES.anima.magna, 30),
                new PlannerItem(3, PLANNER_TEMPLATES.trialFragments, 3),
                new PlannerItem(3, PLANNER_TEMPLATES.elementalHalos, 1),

                // uncap 3
                new PlannerItem(4, PLANNER_TEMPLATES.treasureDrops.high, 50),
                new PlannerItem(4, PLANNER_TEMPLATES.treasureDrops.ingredient, 80),
                new PlannerItem(4, PLANNER_TEMPLATES.showdowns.anima, 20),
                new PlannerItem(4, PLANNER_TEMPLATES.omegaItem, 10),
                new PlannerItem(4, PLANNER_TEMPLATES.anima.magnaOmega, 20),
                new PlannerItem(4, PLANNER_TEMPLATES.trialFragments, 7),
                new PlannerItem(4, PLANNER_TEMPLATES.elementalHalos, 1),

                // SSR
                new PlannerItem(5, PLANNER_TEMPLATES.showdowns.omegaAnima, 20),
                new PlannerItem(5, PLANNER_TEMPLATES.anima.ancientOmega, 2),
                new PlannerItem(5, PLANNER_TEMPLATES.anima.epic, 10),
                new PlannerItem(5, PLANNER_TEMPLATES.centrums, 20),
                new PlannerItem(5, PLANNER_TEMPLATES.anima.primarch, 10),
                new PlannerItem(5, PLANNER_TEMPLATES.trialFragments, 16),
                new PlannerItem(5, PLANNER_TEMPLATES.elementalHalos, 1),
                new PlannerItem(5, PLANNER_TEMPLATES.treasureDrops.ingredientOmega, 30),

                // 4*
                new PlannerItem(6, PLANNER_TEMPLATES.quartz, 500),
                new PlannerItem(6, PLANNER_TEMPLATES.stones, 255),
                new PlannerItem(6, PLANNER_TEMPLATES.urns, 30),
                new PlannerItem(6, PLANNER_TEMPLATES.elementalHalos, 16)
            ]
        },
        element: {Locked: null},
        stepNames: ["None", "Obtain", "SR 1*", "SR 2*", "SR 3*", "SSR", "SSR 4*"],
        typeNames: {
            "Michael": ["Fire", "Sword"],
            "Gabriel": ["Water", "Staff"],
            "Uriel": ["Earth", "Fist"],
            "Raphael": ["Wind", "Bow"]
        }
    },
    "Seraphic (light/dark)": {
        core: [
            new PlannerItem(1, PLANNER_ITEMS.championMerit, 5),

            new PlannerItem(2, PLANNER_ITEMS.supremeMerit, 5),

            new PlannerItem(3, PLANNER_ITEMS.rainbowPrism, 30),

            new PlannerItem(4, PLANNER_ITEMS.legendaryMerit, 2),

            new PlannerItem(5, SUPPLYTYPE.treasure, 150, 5),
            new PlannerItem(5, PLANNER_ITEMS.bahaHorn, 3),

            new PlannerItem(6, PLANNER_ITEMS.primevalHorn, 3),
            new PlannerItem(6, PLANNER_ITEMS.damaCrystal, 5),
            new PlannerItem(6, PLANNER_ITEMS.genesisFrag, 40),
        ],
        wtype: {
            "Teachers": [
                new PlannerItem(3, SUPPLYTYPE.treasure, 56, 2), // dawn
                new PlannerItem(3, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.ancientOmega.Wind, 1),
                new PlannerItem(3, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.ancientOmega.Fire, 1),
                new PlannerItem(3, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.ancientOmega.Light, 1),

                new PlannerItem(4, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.epicOmega.Wind, 1),
                new PlannerItem(4, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.epicOmega.Fire, 1),
                new PlannerItem(4, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.epicOmega.Light, 1),

                new PlannerItem(5, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Light, 30),
                new PlannerItem(5, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Wind, 20),
                new PlannerItem(5, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Fire, 20),

                new PlannerItem(6, SUPPLYTYPE.treasure, 529, 5) // huang
            ],
            "Belial": [
                new PlannerItem(3, SUPPLYTYPE.treasure, 57, 2), // dusk
                new PlannerItem(3, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.ancientOmega.Water, 1),
                new PlannerItem(3, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.ancientOmega.Earth, 1),
                new PlannerItem(3, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.ancientOmega.Dark, 1),

                new PlannerItem(4, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.epicOmega.Water, 1),
                new PlannerItem(4, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.epicOmega.Earth, 1),
                new PlannerItem(4, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.anima.epicOmega.Dark, 1),

                new PlannerItem(5, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Dark, 30),
                new PlannerItem(5, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Water, 20),
                new PlannerItem(5, SUPPLYTYPE.treasure, PLANNER_TEMPLATES.trueAnima.Earth, 20),

                new PlannerItem(6, SUPPLYTYPE.treasure, 531, 5) // qilin
            ],
            templates: [
                // Light and dark are different
                new PlannerItem(1, PLANNER_TEMPLATES.scrolls, 30),
                new PlannerItem(1, PLANNER_TEMPLATES.anima.magna, 30),
                new PlannerItem(1, PLANNER_TEMPLATES.orbs.high, 20),
                new PlannerItem(1, PLANNER_TEMPLATES.whorls, 30),

                // uncap 1
                new PlannerItem(2, PLANNER_TEMPLATES.anima.magnaOmega, 30),
                new PlannerItem(2, PLANNER_TEMPLATES.omegaItem, 20),
                new PlannerItem(2, PLANNER_TEMPLATES.trialFragments, 10),

                // uncap 3
                new PlannerItem(4, PLANNER_TEMPLATES.anima.primarch, 10),

                // SSR
                new PlannerItem(5, PLANNER_TEMPLATES.centrums, 40),

                // 4*
                new PlannerItem(6, PLANNER_TEMPLATES.quartz, 500),
                new PlannerItem(6, PLANNER_TEMPLATES.stones, 255),
                new PlannerItem(6, PLANNER_TEMPLATES.urns, 30),
                new PlannerItem(6, PLANNER_TEMPLATES.elementalHalos, 16)
            ]
        },
        element: {Locked: null},
        stepNames: ["None", "Obtain", "SR 1*", "SR 2*", "SR 3*", "SSR", "SSR 4*"],
        typeNames: {
            "Teachers": ["Light", "Harp"],
            "Belial": ["Dark", "Axe"]
        }
    }
};

(function hideTemplates(o) {
    if (o.templates) {
        Object.defineProperty(o, "templates", {enumerable: false});
    }
    else {
        for (let k of Object.keys(o)) {
            if (o[k] instanceof Object) { hideTemplates(o[k]) }
        }
    }
})(PlannerData);
