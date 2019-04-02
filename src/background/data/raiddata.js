const ELEMENTS = { fire: 0, water: 1, earth: 2, wind: 3, light: 4, dark: 5, noEle: 6};
const RAID_TIER = {A: 1, B: 2, Magna: 4, Ancient: 5, Epic: 6, Nightmare: 7, Primarch: 8, Genesis: 9, Ultimate: 10}; //These aren't exactly corresponding, just ease of use. whatever

function RaidData(name, id, tier, minHostRank, dailyHosts, apCost, matIDs, matNums, ele, thumb) {
    let mats;
    this.urls = {};
    if (matIDs) {
        if (matIDs.length == matNums.length) {
            mats = [];
            for (let i = 0; i < matIDs.length; i++) {
                let mId = matIDs[i],
                    mNum = matNums[i];
                mats.push({id: mId, num: mNum});
                this.urls[mId] = `${GAME_URL.baseGame}#quest/supporter/${id}/1/0/${mId}`;
            }
        }
        else {
            deverror(`Malformed raid data for raid ${id}: ${name}`);
            return;
        }
    }
    else {
        this.urls[Raids.NO_HOST_MAT] = `${GAME_URL.baseGame}#quest/supporter/${id}/1`;
    }


    this.name = name;
    this.id = id;
    this.tier = tier;
    this.tierName = getEnumNamedValue(RAID_TIER, tier);
    this.minHostRank = minHostRank;
    this.isHl = minHostRank > 100;
    this.dailyHosts = dailyHosts;
    this.apCost = apCost;
    this.matCost = mats;
    this.element = ele;
    this.elementName = getEnumNamedValue(ELEMENTS, ele);
//        img: "http://game.granbluefantasy.jp/assets_en/img/sp/assets/summon/qm/" + img
    this.img = `${GAME_URL.assets}${ITEM_KIND[2].path}/${GAME_URL.size.questMedium}${thumb}`;
}

window.RaidList = [
    new RaidData("Griffin (N)", 300011, RAID_TIER.A, null, 3, 10, null, null, ELEMENTS.wind, "2030003000.png"),
    new RaidData("Griffin (H)", 300021, RAID_TIER.A, null, 3, 15, null, null, ELEMENTS.wind, "2030003000_hard.png"),
    new RaidData("Tiamat (N)", 300031, RAID_TIER.B, 10, 3, 10, null, null, ELEMENTS.wind, "2030000000.png"),
    new RaidData("Tiamat (H)", 300041, RAID_TIER.B, 20, 3, 15, null, null, ELEMENTS.wind, "2030000000_hard.png"),
    new RaidData("Tiamat (H+)", 305011, RAID_TIER.B, 101, 1, 45, null, null, ELEMENTS.wind, "2030000000_hard_plus.png"),
    new RaidData("Tiamat Omega", 300051, RAID_TIER.Magna, 30, 3, 30, [18], [2], ELEMENTS.wind, "2040020000_ex.png"),
    new RaidData("Nezha", 300421, RAID_TIER.Ancient, 40, 2, 40, [1343, 1141], [50, 6], ELEMENTS.wind, "2040042000_ex.png"),
    new RaidData("Garuda", 301381, RAID_TIER.Epic, 40, 2, 40, [1343, 1141], [50, 6], ELEMENTS.wind, "2040071000_ex.png"),
    new RaidData("Tiamat Omega (HL)", 300441, RAID_TIER.Magna, 101, 2, 50, [32], [3], ELEMENTS.wind, "2040020000_high.png"),
    new RaidData("Nezha (HL)", 300451, RAID_TIER.Epic, 101, 1, 50, [44], [1], ELEMENTS.wind, "2040042000_high.png"),
    new RaidData("Raphael", 303081, RAID_TIER.Primarch, 40, 1, 50, [5341], [2], ELEMENTS.wind, "2040202000_multi.png"),

    new RaidData("Flame (N)", 300061, RAID_TIER.A, null, 3, null, null, null, ELEMENTS.fire, "2020018001.png"),
    new RaidData("Flame (H)", 300071, RAID_TIER.A, null, 3, null, null, null, ELEMENTS.fire, "2020018001_hard.png"),
    new RaidData("Colossus (N)", 300081, RAID_TIER.B, 10, 3, 10, null, null, ELEMENTS.fire, "2030001000.png"),
    new RaidData("Colossus (H)", 300091, RAID_TIER.B, 20, 3, 15, null, null, ELEMENTS.fire, "2030001000_hard.png"),
    new RaidData("Colossus (H+)", 305021, RAID_TIER.B, 101, 1, 45, null, null, ELEMENTS.fire, "2030001000_hard_plus.png"),
    new RaidData("Colossus Omega", 300101, RAID_TIER.Magna, 30, 3, 30, [19], [2], ELEMENTS.fire, "2040034000_ex.png"),
    new RaidData("Twin Elements", 300411, RAID_TIER.Ancient, 40, 2, 40, [1313, 1111], [50, 6], ELEMENTS.fire, "2040063000_ex.png"),
    new RaidData("Athena", 301071, RAID_TIER.Epic, 40, 2, 40, [1313, 1111], [50, 6], ELEMENTS.fire, "2040021000_ex.png"),
    new RaidData("Colossus Omega (HL)", 300491, RAID_TIER.Magna, 101, 2, 50, [47], [3], ELEMENTS.fire, "2040034000_high.png"),
    new RaidData("Twin Elements (HL)", 300501, RAID_TIER.Ancient, 101, 1, 50, [41], [1], ELEMENTS.fire, "2040063000_high.png"),
    new RaidData("Michael", 303101, RAID_TIER.Primarch, 40, 1, 50, [5311], [2], ELEMENTS.fire, "2040200000_multi.png"),

    new RaidData("Guard (N)", 300111, RAID_TIER.A, null, 3, null, null, null, ELEMENTS.water, "2030013001.png"),
    new RaidData("Guard (H)", 300121, RAID_TIER.A, null, 3, null, null, null, ELEMENTS.water, "2030013001_hard.png"),
    new RaidData("Leviathan (N)", 300141, RAID_TIER.B, 10, 3, 10, null, null, ELEMENTS.water, "2030011000.png"),
    new RaidData("Leviathan (H)", 300151, RAID_TIER.B, 20, 3, 15, null, null, ELEMENTS.water, "2030011000_hard.png"),
    new RaidData("Leviathan (H+)", 305031, RAID_TIER.B, 101, 1, 45, null, null, ELEMENTS.water, "2030011000_hard_plus.png"),
    new RaidData("Leviathan Omega", 300161, RAID_TIER.Magna, 30, 3, 30, [20], [2], ELEMENTS.water, "2040028000_ex.png"),
    new RaidData("Macula", 300381, RAID_TIER.Ancient, 40, 2, 40, [1323, 1121], [50, 6], ELEMENTS.water, "2040002000_ex.png"),
    new RaidData("Grani", 300481, RAID_TIER.Epic, 40, 2, 40, [1323, 1121], [50, 6], ELEMENTS.water, "2040007000_ex.png"),
    new RaidData("Leviathan Omega (HL)", 300511, RAID_TIER.Magna, 101, 2, 50, [48], [3], ELEMENTS.water, "2040028000_high.png"),
    new RaidData("Macula (HL)", 300521, RAID_TIER.Ancient, 101, 1, 50, [42], [1], ELEMENTS.water, "2040002000_high.png"),
    new RaidData("Gabriel", 303091, RAID_TIER.Primarch, 40, 1, 50, [5321], [2], ELEMENTS.water, "2040201000_multi.png"),

    new RaidData("Dragon (H)", 300171, RAID_TIER.A, null, 3, null, null, null, ELEMENTS.earth, "2030004000_hard.png"),
    new RaidData("Yggdrasil (N)", 300181, RAID_TIER.B, 10, 3, 10, null, null, ELEMENTS.earth, "2030015000.png"),
    new RaidData("Yggdrasil (H)", 300191, RAID_TIER.B, 20, 3, 15, null, null, ELEMENTS.earth, "2030015000_hard.png"),
    new RaidData("Yggdrasil (H+)", 305041, RAID_TIER.B, 101, 1, 45, null, null, ELEMENTS.earth, "2030015000_hard_plus.png"),
    new RaidData("Yggdrasil Omega", 300261, RAID_TIER.Magna, 30, 3, 30, [21], [2], ELEMENTS.earth, "2040027000_ex.png"),
    new RaidData("Medusa", 300391, RAID_TIER.Ancient, 40, 2, 40, [1333, 1131], [50, 6], ELEMENTS.earth, "2040059000_ex.png"),
    new RaidData("Baal", 301371, RAID_TIER.Epic, 40, 2, 40, [1333, 1131], [50, 6], ELEMENTS.earth, "2040013000_ex.png"),
    new RaidData("Yggdrasil Omega (HL)", 300531, RAID_TIER.Magna, 101, 2, 50, [49], [3], ELEMENTS.earth, "2040027000_high.png"),
    new RaidData("Medusa (HL)", 300541, RAID_TIER.Ancient, 101, 1, 50, [43], [1], ELEMENTS.earth, "2040059000_high.png"),
    new RaidData("Uriel", 303111, RAID_TIER.Primarch, 40, 1, 50, [5331], [2], ELEMENTS.earth, "2040203000_multi.png"),

    new RaidData("Wisp (H)", 300201, RAID_TIER.A, null, 3, null, null, null, ELEMENTS.light, "2030027000_hard.png"),
    new RaidData("Adversa (N)", 300211, RAID_TIER.B, 10, 3, 10, null, null, ELEMENTS.light, "2030035000.png"),
    new RaidData("Adversa (H)", 300221, RAID_TIER.B, 20, 3, 15, null, null, ELEMENTS.light, "2030035000_hard.png"),
    new RaidData("Adversa (H+)", 305051, RAID_TIER.B, 101, 1, 45, null, null, ELEMENTS.light, "2030035000_hard_plus.png"),
    new RaidData("Luminiera Omega", 300271, RAID_TIER.Magna, 30, 3, 30, [26], [2], ELEMENTS.light, "2040047000_ex.png"),
    new RaidData("Apollo", 300431, RAID_TIER.Ancient, 40, 2, 40, [1353, 1151], [50, 6], ELEMENTS.light, "2040023000_ex.png"),
    new RaidData("Odin", 300461, RAID_TIER.Epic, 40, 2, 40, [1353, 1151], [50, 6], ELEMENTS.light, "2040029000_ex.png"),
    new RaidData("Luminiera Omega (HL)", 300561, RAID_TIER.Magna, 101, 2, 50, [50], [3], ELEMENTS.light, "2040047000_high.png"),
    new RaidData("Apollo (HL)", 300571, RAID_TIER.Ancient, 101, 1, 50, [45], [1], ELEMENTS.light, "2040023000_high.png"),

    new RaidData("Eye (H)", 300231, RAID_TIER.A, null, 3, null, null, null, ELEMENTS.dark, "2030038000_hard.png"),
    new RaidData("Celeste (N)", 300241, RAID_TIER.B, 10, 3, 10, null, null, ELEMENTS.dark, "2030041000.png"),
    new RaidData("Celeste (H)", 300251, RAID_TIER.B, 20, 3, 15, null, null, ELEMENTS.dark, "2030041000_hard.png"),
    new RaidData("Celeste (H+)", 305061, RAID_TIER.B, 101, 1, 45, null, null, ELEMENTS.dark, "2030041000_hard_plus.png"),
    new RaidData("Celeste Omega", 300281, RAID_TIER.Magna, 30, 3, 30, [31], [2], ELEMENTS.dark, "2040046000_ex.png"),
    new RaidData("Olivia", 300401, RAID_TIER.Ancient, 40, 2, 40, [1363, 1161], [50, 6], ELEMENTS.dark, "2040005000_ex.png"),
    new RaidData("Lich", 300551, RAID_TIER.Epic, 40, 2, 40, [1363, 1161], [50, 6], ELEMENTS.dark, "2040012000_ex.png"),
    new RaidData("Celeste Omega (HL)", 300581, RAID_TIER.Magna, 101, 2, 50, [51], [3], ELEMENTS.dark, "2040046000_high.png"),
    new RaidData("Olivia (HL)", 300591, RAID_TIER.Ancient, 101, 1, 50, [46], [1], ELEMENTS.dark, "2040005000_high.png"),
    
    new RaidData("Prometheus", 302751, RAID_TIER.Epic, 101, 1, 80, [41], [1], ELEMENTS.fire, "2040125000_high.png"),
    new RaidData("Ca Ong", 303041, RAID_TIER.Epic, 101, 1, 80, [42], [1], ELEMENTS.water, "2040160000_high.png"),
    new RaidData("Gilgamesh", 302711, RAID_TIER.Epic, 101, 1, 80, [43], [1], ELEMENTS.earth, "2040130000_high.png"),
    new RaidData("Morrigna", 303051, RAID_TIER.Epic, 101, 1, 80, [44], [1], ELEMENTS.wind, "2040122000_high.png"),
    new RaidData("Hector", 303061, RAID_TIER.Epic, 101, 1, 80, [45], [1], ELEMENTS.light, "2040144000_high.png"),
    new RaidData("Anubis", 303071, RAID_TIER.Epic, 101, 1, 80, [46], [1], ELEMENTS.dark, "2040134000_high.png"),
    
    new RaidData("Shiva", 303151, RAID_TIER.Genesis, 120, 2, 90, [522], [1], ELEMENTS.fire, "2040185000_high.png"),
    new RaidData("Europa", 303161, RAID_TIER.Genesis, 120, 2, 90, [523], [1], ELEMENTS.water, "2040225000_high.png"),
    new RaidData("Godsworn Alexiel", 303171, RAID_TIER.Genesis, 120, 2, 90, [524], [1], ELEMENTS.earth, "2040205000_high.png"),
    new RaidData("Grimnir", 303181, RAID_TIER.Genesis, 120, 2, 90, [525], [1], ELEMENTS.wind, "2040261000_high.png"),
    new RaidData("Metatron", 303191, RAID_TIER.Genesis, 120, 2, 90, [526], [1], ELEMENTS.light, "2040276000_high.png"),
    new RaidData("Avatar", 303221, RAID_TIER.Genesis, 120, 2, 90, [527], [1], ELEMENTS.dark, "2040277000_high.png"),

    new RaidData("Bahamut", 300291, RAID_TIER.Nightmare, 80, 3, 80, [58], [1], ELEMENTS.dark, "2030002000_hell.png"),
    new RaidData("Grand Order", 301051, RAID_TIER.Nightmare, 80, 2, 80, [82], [1], ELEMENTS.light, "2040065000_hell.png"),
    new RaidData("Huanglong", 301671, RAID_TIER.Nightmare, 80, 1, 80, [6005], [1], ELEMENTS.light, "2040157000_hell.png"),
    new RaidData("Qilin", 301681, RAID_TIER.Nightmare, 80, 1, 80, [6005], [1], ELEMENTS.dark, "2040158000_hell.png"),
    new RaidData("Bahamut (HL)", 301061, RAID_TIER.Nightmare, 101, 1, 90, [59], [1], ELEMENTS.dark, "2040128000_hell.png"),
    new RaidData("Huanglong & Qilin (HL)", 303231, RAID_TIER.Nightmare, 120, 1, 90, [6005], [2], ELEMENTS.light, "2040157000_high.png"),
    new RaidData("Akasha", 303251, RAID_TIER.Nightmare, 150, 1, 90, [533], [3], ELEMENTS.light, "2040308000_high.png"),
    
    new RaidData("Rose Queen (HL)", 300471, RAID_TIER.Ancient, 101, 1, 50, [1204], [10], ELEMENTS.wind, "2040105000_high.png"),
    
    new RaidData("Ultimate Bahamut", 303131, RAID_TIER.Ultimate, 80, 1, 80, [133], [1], ELEMENTS.noEle, "2040223000.png"),
    new RaidData("Tiamat Malice", 303241, RAID_TIER.Epic, 120, 1, 80, [104, 106], [5, 5], ELEMENTS.wind, "2040307000_high.png"),
    new RaidData("Ultimate Bahamut (HL)", 303141, RAID_TIER.Ultimate, 130, 1, 100, [136], [1], ELEMENTS.noEle, "2040223000_high.png")
];
