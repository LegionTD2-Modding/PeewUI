const wavesData = [
{
    wave: 0,
    creature: "",
    amount: "0x",
    reward: 0,
    range: 0,
    dps: 0,
    hp: 0,
    dmgType: "",
    defType: "",
    ability1: "",
    ability2: "",
    value: 0
},
{
    wave: 1,
    creature: "Crab",
    amount: "12x",
    reward: 72,
    range: 100,
    dps: 5,
    hp: 120,
    dmgType: "Pierce",
    defType: "Fortified",
    ability1: "",
    ability2: "",
    value: 150
},
{
    wave: 2,
    creature: "Wale",
    amount: "12x",
    reward: 84,
    range: 100,
    dps: 7,
    hp: 140,
    dmgType: "Impact",
    defType: "Arcane",
    ability1: "",
    ability2: "",
    value: 165
},
{
    wave: 3,
    creature: "Hopper",
    amount: "18x",
    reward: 90,
    range: 100,
    dps: 7,
    hp: 120,
    dmgType: "Magic",
    defType: "Natural",
    ability1: "",
    ability2: "",
    value: 230
},
{
    wave: 4,
    creature: "Flying Chicken",
    amount: "12x",
    reward: 96,
    range: 100,
    dps: 13,
    hp: 230,
    dmgType: "Impact",
    defType: "Swift",
    ability1: "",
    ability2: "",
    value: 290
},
{
    wave: 5,
    creature: "Scorpion",
    amount: "8x + Miniboss",
    reward: 108,
    range: 100,
    dps: 15,
    hp: 340,
    dmgType: "Pierce",
    defType: "Natural",
    ability1: "",
    ability2: "",
    value: 365
},
{
    wave: 6,
    creature: "Rocko",
    amount: "6x",
    reward: 114,
    range: 100,
    dps: 31,
    hp: 830,
    dmgType: "Impact",
    defType: "Fortified",
    ability1: "Impale",
    ability2: "",
    value: 480
},
{
    wave: 7,
    creature: "Sludge",
    amount: "10x",
    reward: 120,
    range: 100,
    dps: 28,
    hp: 560,
    dmgType: "Magic",
    defType: "Arcane",
    ability1: "Blobs",
    ability2: "",
    value: 610
},
{
    wave: 8,
    creature: "Kobra",
    amount: "12x",
    reward: 132,
    range: 400,
    dps: 31,
    hp: 600,
    dmgType: "Magic",
    defType: "Swift",
    ability1: "",
    ability2: "",
    value: 745
},
{
    wave: 9,
    creature: "Carapace",
    amount: "12x",
    reward: 144,
    range: 100,
    dps: 35,
    hp: 740,
    dmgType: "Pierce",
    defType: "Fortified",
    ability1: "Deflection",
    ability2: "",
    value: 880
},
{
    wave: 10,
    creature: "Granddaddy",
    amount: "1x",
    reward: 150,
    range: 100,
    dps: 426,
    hp: 10000,
    dmgType: "Impact",
    defType: "Arcane",
    ability1: "Boss Unit",
    ability2: "",
    value: 1150
},
{
    wave: 11,
    creature: "Quill Shooter",
    amount: "12x",
    reward: 156,
    range: 550,
    dps: 55,
    hp: 1080,
    dmgType: "Pierce",
    defType: "Natural",
    ability1: "",
    ability2: "",
    value: 1375
},
{
    wave: 12,
    creature: "Mantis",
    amount: "12x",
    reward: 168,
    range: 100,
    dps: 80,
    hp: 1290,
    dmgType: "Pierce",
    defType: "Swift",
    ability1: "",
    ability2: "",
    value: 1635
},
{
    wave: 13,
    creature: "Drill Golem",
    amount: "6x",
    reward: 180,
    range: 100,
    dps: 155,
    hp: 3210,
    dmgType: "Impact",
    defType: "Fortified",
    ability1: "",
    ability2: "",
    value: 1915
},
{
    wave: 14,
    creature: "Killer Slug",
    amount: "12x",
    reward: 192,
    range: 100,
    dps: 95,
    hp: 2050,
    dmgType: "Magic",
    defType: "Arcane",
    ability1: "",
    ability2: "",
    value: 2300
},
{
    wave: 15,
    creature: "Quadrapus",
    amount: "8x + Miniboss",
    reward: 204,
    range: 400,
    dps: 60,
    hp: 2250,
    dmgType: "Magic",
    defType: "Natural",
    ability1: "Dual Shot",
    ability2: "",
    value: 2905
},
{
    wave: 16,
    creature: "Cardinal",
    amount: "18x",
    reward: 216,
    range: 100,
    dps: 104,
    hp: 1990,
    dmgType: "Impact",
    defType: "Swift",
    ability1: "",
    ability2: "",
    value: 3495
},
{
    wave: 17,
    creature: "Metal Dragon",
    amount: "12x",
    reward: 228,
    range: 100,
    dps: 185,
    hp: 3300,
    dmgType: "Pierce",
    defType: "Arcane",
    ability1: "",
    ability2: "",
    value: 4115
},
{
    wave: 18,
    creature: "Wale Chief",
    amount: "6x",
    reward: 252,
    range: 100,
    dps: 250,
    hp: 8100,
    dmgType: "Impact",
    defType: "Natural",
    ability1: "Poison-Tipped Pole",
    ability2: "",
    value: 4860
},
{
    wave: 19,
    creature: "Dire Toad",
    amount: "12x",
    reward: 276,
    range: 400,
    dps: 88,
    hp: 4350,
    dmgType: "Pierce",
    defType: "Swift",
    ability1: "Split Shot",
    ability2: "",
    value: 5840
},
{
    wave: 20,
    creature: "Maccabeus",
    amount: "1x",
    reward: 300,
    range: 250,
    dps: 2000,
    hp: 65000,
    dmgType: "Magic",
    defType: "Fortified",
    ability1: "Insatiable Hunger",
    ability2: "Boss Unit",
    value: 7840
},
{
    wave: 21,
    creature: "Legion Lord",
    amount: "8x + Miniboss",
    reward: 360,
    range: 100,
    dps: 355,
    hp: 8250,
    dmgType: "Pure",
    defType: "Immaterial",
    ability1: "",
    ability2: "",
    value: 9020
}];

const waveAbilitiesDescription = [
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['Each attack has a 25% chance to deal 150% damage', ''],
    ['When this unit dies, it spawns a Blob', ''],
    ['', ''],
    ['Reduces damage taken from ranged units by 15%', ''],
    ['Reduces the duration or effectiveness of most debuffs', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['Attacks up to 2 units at once but can still strike the same unit with both atttacks', ''],
    ['', ''],
    ['', ''],
    ['Deals 230 single-target and 20 Magic splash damage every fourth attack', ''],
    ['Attacks up to 3 units at once but can still strike the same unit with multiple atttacks', ''],
    ['Reduces the duration or effectiveness of most debuffs', 'Gains 1% bonus damage and heals by 100 whenever it kills a unit'],
    ['', '']
];
