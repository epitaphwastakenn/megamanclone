// VARIABLES

const swordCrest = [
  'KK............',
  'KBK...........',
  'KCBK..........',
  'KBCBK.........',
  'KBBCBKK.......',
  'KBBBCBBKK.....',
  '.KBBBCBBBKK...',
  '.KBBBBCBBBBKK.',
  '..KBBBBBBBBBBK',
];

const swordHelmet = [
  '.....KKKKKKKK.....',
  '...KKBBBBBBBBKK...',
  '..KBBBCCBBBBBBBK..',
  '.KBBBCCBBBBBBBBBK.',
  '.KBBCCBBBBBBBBBBBK',
  'KBBBCBBBBBBBBBBBBK',
  'KBBBBBBBBBBBKKKKKK',
  'KBBBBBBBBBBKSSSSSK',
  'KBKKKBBBBBKSSKKKSK',
  'KKYYYKBBBBKSSWWKSK',
  'KKYKYKBBBBKSSWWKSK',
  'KKYYYKBBBBKSSSSSSK',
  '.KKKKBBBBBBKSSKKKK',
  '..KKBBBBBBBBKKSSK.',
  '....KKKKKKKKKKKK..',
];

const swordFaces = {
  blink: [['SSSSSK', 'SSKKKK', 'SSSSSK'], 11, 8],
  shout: [['SSKKKK', 'SSWWKK', 'SSWWKK', 'SSSSSS', 'SKKKKK'], 11, 8],
  hurt: [['SKSSKS', 'SSKKSS', 'SKSSKS', 'SSSSSS', 'SSKKKK'], 11, 8],
};

const swordBill = [
  'KKKKKKKKKKKKKKKKKKKKK....',
  'WWWWWWWWWWWWWWWWWWWWWKK..',
  'GGGGGGGGGGGGGGGGGGGGGGGKK',
  'KKKKKKKKKKKKKKKKKKKKKKK..',
];

const swordBillUp = [
  '..............KK',
  '.............KWK',
  '............KWGK',
  '...........KWGK.',
  '..........KWGK..',
  '.........KWGK...',
  '........KWGK....',
  '.......KWGK.....',
  '......KWGK......',
  '.....KWGK.......',
  '....KWGK........',
  '...KWGK.........',
  '.KKWGK..........',
  'KYYGK...........',
  'KYYK............',
  'KKK.............',
];

const swordGuard = [
  'KKK',
  'KYK',
  'KYK',
  'KYK',
  'KYK',
  'KKK',
];

const swordTorso = [
  '....KKKKKKKKKKKK....',
  '..KKBBBBBBBBBBBBKK..',
  '.KCBBBBBBGWWWWBBBBK.',
  'KCCBBBBBGWWWWWWBBBBK',
  'KCBBBBBBGWWWWWWBBBBK',
  'KBBBBBBBGWWWWWWBBBBK',
  '.KBBBBBBKGWWWWKBBBK.',
  '..KYYYYYYYYYYYYYYK..',
  '..KBBBBBBBKKBBBBBK..',
];

const swordTail = [
  'KKK......',
  'KCBK.....',
  '.KCBK....',
  '.KBCBK...',
  '..KBCBKK.',
  '..KBBBBBK',
  '..KBCBKK.',
  '.KBCBK...',
  '.KCBK....',
  'KCBK.....',
  'KKK......',
];

const swordArms = {
  back: [
    '.KKKK.',
    'KBBBBK',
    'KCBBBK',
    'KBBBBK',
    'KKKKKK',
    'KGWWGK',
    'KGWWWK',
    '.KGGK.',
  ],
  side: [
    '.KKKK..',
    'KBBBBK.',
    'KBBBCK.',
    'KBBBBK.',
    'KKKKKK.',
    'KGWWGK.',
    'KWWWWGK',
    '.KGGGK.',
  ],
  forward: [
    '.KKKKK.....',
    'KBBBBBKKKK.',
    'KBBBBBKGWGK',
    'KBBBBBKWWWK',
    '.KKKKKKGWGK',
    '.......KKK.',
  ],
  up: [
    '..KKKK.',
    '.KGWWGK',
    '.KWWWWK',
    '.KGWWGK',
    '..KKKK.',
    '..KBBK.',
    '..KBBK.',
    '.KBBCK.',
    '.KBBBK.',
    'KBBBBK.',
    'KBBBBK.',
    '.KKKK..',
  ],
};

const swordLegs = {
  stand: [
    '....KBBBBBK..KBBBBBK....',
    '....KBBBBBK..KBBBBBK....',
    '...KGGGGGGK..KGGGGGGK...',
    '..KGWWWWWGK..KGWWWWWGK..',
    '.KGWWWWWWGK..KGWWWWWWGK.',
    '.KKKKKKKKKK..KKKKKKKKKK.',
  ],
  kickA: [
    '...KBBBBBK....KBBBBBK...',
    '..KBBBBBK.....KBBBBBBK..',
    '.KGGGGGK......KKGGGGGGK.',
    'KGWWWWGK.......KGWWWWWK.',
    'KGWWWGK.........KGWWWWGK',
    'KKKKKK...........KKKKKKK',
  ],
  kickB: [
    '....KBBBBBKKBBBBBK......',
    '....KBBBBBKKBBBBBK......',
    '....KGGGGGKKGGGGGGK.....',
    '...KGWWWWWKKGWWWWWK.....',
    '...KGWWWWWGKGWWWWWGK....',
    '...KKKKKKKKKKKKKKKKK....',
  ],
  jump: [
    '....KBBBBBK...KBBBBBK...',
    '...KBBBBBK....KGGGGGK...',
    '..KGGGGGK....KGWWWWWGK..',
    '.KGWWWWGK....KGWWWWWGK..',
    'KGWWWWWGK.....KKKKKKK...',
    'KKKKKKKK................',
  ],
};

const swordBodyFlat = [
  '..............KKKKKKKKKKKKK...',
  '.........KKKKKBBBBBBBBBBBBBKK.',
  '.KKKK..KKBBBBBKYKBBBBBBCCCBBBK',
  'KGGWGKKBBBBBBBKYKBBBBBBBBBBBBK',
  'KGWWWGKBBBBBBBKYKBBBBBBBBBBBBK',
  'KGWWWGKBBBBBBBKYKBBBBBBBBBBBBK',
  'KGWWWGKBBBBBBBKYKBBBBBGWWWWWWK',
  'KGWWGKKKBBBBBBKYKBBBBGWWWWWWK.',
  'KGGGKKGGKKKKKKKYKKKKKGWWWWWK..',
  '.KKK.KGWWGK...KKK..KKKKKKKK...',
  '......KKKKK...................',
];

const swordBodyFlatKick = [
  '..............KKKKKKKKKKKKK...',
  '.KKKK....KKKKKBBBBBBBBBBBBBKK.',
  'KGGWGK.KKBBBBBKYKBBBBBBCCCBBBK',
  'KGWWWGKBBBBBBBKYKBBBBBBBBBBBBK',
  'KGWWWGKBBBBBBBKYKBBBBBBBBBBBBK',
  'KGWWGKKBBBBBBBKYKBBBBBBBBBBBBK',
  'KGGGKKKKBBBBBBKYKBBBBBGWWWWWWK',
  '.KKK.KGGKKBBBBKYKBBBBGWWWWWWK.',
  '....KGWWGKKKKKKYKKKKKGWWWWWK..',
  '....KGWWGK....KKK..KKKKKKKK...',
  '.....KKKK.....................',
];

const swordArmFlat = [
  'KKKKKKKKKK.',
  'KGWGKBBBBBK',
  'KWWGKBBBCBK',
  'KKKKKKKKKK.',
];

const swordFinFlat = [
  'KK.....KK',
  'KCK...KCK',
  '.KCK.KCK.',
  '.KBCKCBK.',
  '..KBBBK..',
];

const swordGlintFrames = [
  [
    '...W...',
    '...W...',
    '..WWW..',
    'WWWWWWW',
    '..WWW..',
    '...W...',
    '...W...',
  ],
  [
    'Y.....Y',
    '.Y.W.Y.',
    '..WWW..',
    '.WWWWW.',
    '..WWW..',
    '.Y.W.Y.',
    'Y.....Y',
  ],
];

const swordWaterBladeRows = [
  '..KK........',
  '...KaK......',
  '....KaaK....',
  '.....KaWK...',
  '.....KaWWK..',
  '......KaWWK.',
  '......KaWWWK',
  '......KaWWWK',
  '......KaWWWK',
  '......KaWWWK',
  '......KaWWWK',
  '......KaWWWK',
  '......KaWWK.',
  '.....KaWWK..',
  '.....KaWK...',
  '....KaaK....',
  '...KaK......',
  '..KK........',
];

const swordfishFaceHalf = [
  '..............KK',
  '.............KCB',
  '.............KCB',
  '............KCBB',
  '............KCBB',
  '...........KCBBB',
  '.......KKKKKCBBB',
  '.....KKBBBBKCBBB',
  '....KBBBCCBKBBBB',
  '...KBBBCCBBBKBBB',
  '..KBBBCCBBBBBBBB',
  '..KBBCCBBBBBBBBB',
  '.KBBCCBBBBBBBBBB',
  '.KBBCBBBBBBBBBBB',
  '.KBBBBBBBBBBBBBB',
  '.KBBBBBBKKKKKKKK',
  'KKKKBBBKSSSSSSSS',
  'KYYYKBBKSSSSSSSS',
  'KYKYKBBKSSKKKKSS',
  'KYYYKBBKSSWWWKSS',
  'KKKKKBBKSSWWKKSS',
  '.KBBBBBKSSWWKKSS',
  '.KBBBBBKSSSSSSSS',
  '..KBBBBKSSSSSSSS',
  '..KBBBBKSSSSSKKK',
  '...KBBBBKSSSSSSS',
  '....KBBBBKKSSSSS',
  '.....KKBBBBKKKKK',
  '.......KKKBBBBBB',
  '....KKKBBBBBBBGW',
  '..KKBBBBBBBBBGWW',
  '.KBBBBBBBBBBBGWW',
];

const marineRaftRows = [
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',
  'KLLLLLLLLKLLLLLLLLLLLKLLLLLLLLLK',
  'KnnnnnnnnKnnnnnnnnnnnKnnnnnnnnnK',
  'KnnWWnnnnKnnnnnnnnnnnKnnnnnWWnnK',
  'KNnWWnnnnKnnnnnnnnnnnKnnnnnWWnNK',
  'KNNNNNNNNKNNNNNNNNNNNKNNNNNNNNNK',
  '.KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.',
];

const swordMegaDashRows = [
  '...............KKK..............',
  '.............KKKCCK.............',
  '............KBBBKCCK............',
  '...........KBBBBBKKKK...........',
  '...........KBBBBBKCCBK..........',
  '........KKKCBBBBBBKKBK..........',
  '......KKCCKCBBSWWWBBWK..........',
  '.....KBKCCKCBSWWKKSKWK...KKKK...',
  '....KBBBKCCKBSWWKKSKWKKKKBBBKKK.',
  '...KBBBBKCCKBSSWWWSWSKCCKBCCCKCK',
  '...KBBBK.KCCKBSKKKKSKCCCKBBBBKBK',
  '...KBBBK.KCCCKSSSSSKCCCCKBBBKKK.',
  '....KKK..KBCCCKKKKKBKKKK.KKKK...',
  '........KBBBCCCCCCCK............',
  '......KKBBBBBBBBBBBK............',
  '....KKBBBBBKKKKBBBBBK...........',
  '..KKBBBBBKK....KBBBBBK..........',
  '.KBBBBBKK.......KBBBBK..........',
  'KBBBBKK.........KBBBBBKK........',
  'KBBBK..........KBBBBBBBBK.......',
  'KKKK...........KKKKKKKKKK.......',
];

const swordDashBladeRows = [
  'KKKKKKKKKKKK....',
  'KWWWWWWWWWWWKK..',
  'KGGGGGGGGGGGGGKK',
  'KKKKKKKKKKKKKK..',
];

const swordDashIconRows = [
  '..KKK...........',
  '..KYK...........',
  'KKKYKKKKKKKKKK..',
  'KYYYWWWWWWWWWWKK',
  'KKKYGGGGGGGGGGGK',
  '..KYKKKKKKKKKKK.',
  '..KKK...........',
];

const marineJellyRows = {
  open: [
    '.....KKKKKK.....',
    '...KKPPWWPPKK...',
    '..KPPPPPWWPPPK..',
    '.KPPPPPPPPWPPPK.',
    '.KPPPPPPPPPPPPK.',
    'KPPPKKPPPPKKPPPK',
    'KPPPKWPPPPKWPPPK',
    'KGGGGGGGGGGGGGGK',
    'KKGKKGKKGKKGKKGK',
    '..KVK.KVK.KVK...',
    '..KVK..KVK.KVK..',
    '...KVK.KVK..KVK.',
    '..KVK..KVK.KVK..',
    '..KVK.KVK..KVK..',
    '...KK..KK...KK..',
  ],
  squeeze: [
    '................',
    '................',
    '.....KKKKKK.....',
    '...KKPPWWPPKK...',
    '.KKPPPPPPWWPPKK.',
    'KPPPPPPPPPPWPPPK',
    'KPPPKKPPPPKKPPPK',
    'KPPPKWPPPPKWPPPK',
    'KGGGGGGGGGGGGGGK',
    'KKGKKGKKGKKGKKGK',
    '.KVK..KVKKVK.KVK',
    'KVK..KVK..KVKKVK',
    '.KVK..KVKKVK.KVK',
    '..KK...KK.KK..KK',
    '................',
  ],
};

const marineZapBoltRows = [
  '...KK.',
  '..KYK.',
  '.KYWK.',
  'KYWWYK',
  '.KWYK.',
  '.KYK..',
  '.KK...',
];

const marinePiranhaRows = {
  shut: [
    '......KKKKK.....',
    '....KKRRRRRKK...',
    'KK.KRRRRRRRRRK..',
    'KRKRRRRRRRKKRRK.',
    'KRRRRRRRRKWWKRRK',
    '.KRRRRRRRKWKKRRK',
    '.KRRRRRRRRRRRKKK',
    'KRRRRGGGGGGKWKWK',
    'KRKGGGGGGGGGKWKK',
    'KK.KKGGGGGGGGGK.',
    '.....KKKKKKKKK..',
  ],
  open: [
    '......KKKKK.....',
    '....KKRRRRRKK...',
    '...KRRRRRRRRRK..',
    '.KKRRRRRRRKKRRK.',
    'KRRRRRRRRKWWKRRK',
    'KRRRRRRRRKWKKRKK',
    '.KRRRRRRRRRRKWK.',
    '.KRRRGGGGGGK....',
    'KRKGGGGGGGGKWK..',
    'KRKKGGGGGGGGGGK.',
    'KK...KKKKKKKKKK.',
  ],
};

const marineCrabRows = {
  walk1: [
    '.....KKKKKK.........',
    '...KKWWWWWWKK.......',
    '..KWWOOOOOWWWK......',
    '.KWOOWWWWOOWWK..K.K.',
    '.KWOWKKKWWOOWWK.KWKW',
    'KWWOWKWOWWOOWWK.KKKK',
    'KWWOWWKKOOOWWWK.KRK.',
    'KWWOOWWWWWWWWKKKRRRK',
    '.KWWOOOOOOWWKRRRKRRK',
    '..KKWWWWWWKKRRRKRRRK',
    '...KRRRRRRRRRRKKRRK.',
    '..KRRKRRKRRKRRK.KK..',
    '.KRK.KRK.KRK.KRK....',
    '.KK..KK..KK..KK.....',
  ],
  walk2: [
    '.....KKKKKK.........',
    '...KKWWWWWWKK.......',
    '..KWWOOOOOWWWK......',
    '.KWOOWWWWOOWWK..K.K.',
    '.KWOWKKKWWOOWWK.KWKW',
    'KWWOWKWOWWOOWWK.KKKK',
    'KWWOWWKKOOOWWWK.KRK.',
    'KWWOOWWWWWWWWKKKRRRK',
    '.KWWOOOOOOWWKRRRKRRK',
    '..KKWWWWWWKKRRRKRRRK',
    '...KRRRRRRRRRRKKRRK.',
    '...KRRKRRKRRKRRKKK..',
    '...KRK.KRK.KRK.KRK..',
    '...KK..KK..KK..KK...',
  ],
  hide: [
    '....................',
    '....................',
    '....................',
    '.....KKKKKK.........',
    '...KKWWWWWWKK.......',
    '..KWWOOOOOWWWK......',
    '.KWOOWWWWOOWWWK.....',
    '.KWOWKKKWWOOWWWK....',
    'KWWOWKWOWWOOWWWWK...',
    'KWWOWWKKOOOWWWWWK...',
    'KWWOOWWWWWWWWWWWK...',
    '.KWWOOOOOOWWWWWK....',
    '..KKWWWWWWWKKKK.....',
    '....KKKKKKK.........',
  ],
};

const marineLanternRows = {
  idle: [
    '...........KKK..........',
    '.........KKoooK.........',
    '........KooYooK.........',
    '........KoooooK.........',
    '.........KKKKK..........',
    '..........KNK...........',
    '...........KNK..........',
    '............KNK.........',
    '.....KKKKKKKKKNK........',
    '...KKVVVVVVVVVKK........',
    '..KVVVVVVVVVVVVVK.......',
    '.KVVVVVVVVVKKKVVVK......',
    'KKVVVVVVVVKWWKKVVK......',
    'KVKVVVVVVVKWKKKVVK......',
    'KVVKVVVVVVVKKKVVVVKK....',
    'KVVVKVVVVVVVVVVKWKWKK...',
    'KVVKVVVVVVVVVVKKKKKKK...',
    'KVKVVVVVVVVVVVKWKWKWK...',
    'KKVVVVVVVVVVVVVKKKKK....',
    '.KKVVVVVVVVVVVVK........',
    '...KKKKKKKKKKKK.........',
  ],
  glow: [
    '..........KKKKK.........',
    '.........KWWWWWK........',
    '........KWWYYWWK........',
    '........KWYYYYWK........',
    '.........KWWWWK.........',
    '..........KNK...........',
    '...........KNK..........',
    '............KNK.........',
    '.....KKKKKKKKKNK........',
    '...KKVVVVVVVVVKK........',
    '..KVVVVVVVVVVVVVK.......',
    '.KVVVVVVVVVKKKVVVK......',
    'KKVVVVVVVVKWWKKVVK......',
    'KVKVVVVVVVKWKKKVVKK.....',
    'KVVKVVVVVVVKKKVVVKWKK...',
    'KVVVKVVVVVVVVVVKKKKKK...',
    'KVVKVVVVVVVVVVK.........',
    'KVKVVVVVVVVVVVKKKKKKK...',
    'KKVVVVVVVVVVVVVKWKWKK...',
    '.KKVVVVVVVVVVVVKKKKK....',
    '...KKKKKKKKKKKK.........',
  ],
};

const marineLampShotRows = [
  '..KKKK..',
  '.KYWWYK.',
  'KYWWWWYK',
  'KWWWWWWK',
  'KYWWWWYK',
  '.KYWWYK.',
  '..KKKK..',
];

const marineSandRows = [
  'LLLLLLLnLLLLLLLL',
  'LLnLLLLLLLLLLnLL',
  'LLLLLLLLLLnLLLLL',
  'LLLLnLLLLLLLLLLL',
  'LLLLLLLLLLLLLnLL',
  'LnLLLLLLnLLLLLLL',
  'LLLLLLLLLLLLLLLL',
  'LLLLLLnLLLLLnLLL',
  'LLLLLLLLLLLLLLLL',
  'LLnLLLLLLLLLLLLL',
  'LLLLLLLLnLLLLLnL',
  'LLLLLnLLLLLLLLLL',
  'LLLLLLLLLLLLLLLL',
  'LLLLLLLLLLLnLLLL',
  'LnLLLLLLLLLLLLLL',
  'LLLLLLnLLLLLLLLL',
];

const marineRockRows = [
  'WGGGGGGDKWGGGGGG',
  'GGGGGGGDKGGGGGGG',
  'GGGGGGDDKGGGGGGD',
  'GGGGGGDKKDGGGGGD',
  'DDGGGDDKGGGGGGDD',
  'KKDDDDKKGGGGGDDK',
  'WGGKKKGGGGGGDDKK',
  'GGGGGKGGGGGDDKWG',
  'GGGGGKDGGGGDKKGG',
  'GGGGDKDDGGDDKGGG',
  'GGGDDKKDDDDKKGGG',
  'DDDDKKWKKKKKGGGG',
  'KKKKKGGGGGKGGGGD',
  'WGGGGGGGGGKDGGDD',
  'GGGGGGGGGDKDDDDK',
  'DDDDDDDDDDKKKKKK',
];

const marinePlankRows = [
  'KKKKKKKKKKKKKKKK',
  'nnnnnnnnnnnnnnnn',
  'nLnnnnnnnnnnnnLn',
  'nnnnnnnnnnnnnnnn',
  'NNNNNNNNNNNNNNNN',
  'KKKKKKKKKKKKKKKK',
  'nnnnnnKnnnnnnnnn',
  'nnnnnnKnnnnnnLnn',
  'nnnnnnKnnnnnnnnn',
  'NNNNNNKNNNNNNNNN',
  'KKKKKKKKKKKKKKKK',
  'nnnnnnnnnnnnKnnn',
  'nnnLnnnnnnnnKnnn',
  'nnnnnnnnnnnnKnnn',
  'NNNNNNNNNNNNKNNN',
  'KKKKKKKKKKKKKKKK',
];

const marinePostRows = [
  '.....KNnnLnK....',
  '.....KNnnnnK....',
  '.....KNnnnnK....',
  '.....KNNnnnK....',
  '.....KNnnnnK....',
  '.....KNnnLnK....',
  '.....KNnnnnK....',
  '.....KKKKKKK....',
  '.....KNnnnnK....',
  '.....KNnnLnK....',
  '.....KNnnnnK....',
  '.....KNNnnnK....',
  '.....KNnnnnK....',
  '.....KNnnnnK....',
  '.....KNnnLnK....',
  '.....KNnnnnK....',
];

const marineSeaRows = [
  'uuuuuuuuuuuuuuuu',
  'uuuuuuuuuuuuuuuu',
  'uuuuuuuuuuuaauuu',
  'uuuuuuuuuuuuuuuu',
  'uuuuuuuuuuuuuuuu',
  'uuuuuuuuuuuuuuuu',
  'uuuaauuuuuuuuuuu',
  'uuuuuuuuuuuuuuuu',
  'uuuuuuuuuuuuuuuu',
  'uuuuuuuuuuuuuuuu',
  'uuuuuuuuuuuuuauu',
  'uuuuuuuuuuuuuuuu',
  'uuuuuuuuuuuuuuuu',
  'uuuuuauuuuuuuuuu',
  'uuuuuuuuuuuuuuuu',
  'uuuuuuuuuuuuuuuu',
];

const marineSurfaceTop = [
  '...WW.......WW..',
  '..WaaW.....WaaW.',
  'WWauuaWWWWWauuaW',
  'aauuuuuaaaauuuuu',
];


const marineUrchinRows = [
  '................',
  '..W....W....W...',
  '...K...K...K....',
  '....K..K..K.....',
  'W....KKKKK....W.',
  '.K..KpppppK..K..',
  '..KKpppWppKKK...',
  '...KppWWpppK....',
  'WKKKppppppppKKKW',
  '...KppppppppK...',
  '..KKpppppppKKK..',
  '.K..KpppppK..K..',
  'W....KKKKK....W.',
  '....K..K..K.....',
  '...W...K...W....',
  '.......W........',
];

const marineCoralRows = [
  '................',
  '..KK.......KK...',
  '.KPPK.....KPPK..',
  '.KPPK..KK.KPPK..',
  '..KPPK.KPKKPPK..',
  '..KPPK.KPPKPK...',
  '...KPPKKPPPPK...',
  '....KPPKPPPK..KK',
  '.KK.KPPPPPK..KPK',
  'KPPK.KPPPPK.KPPK',
  'KPPPKKPPPKKKPPK.',
  '.KPPPPPPPPPPPK..',
  '..KKPPPPPPPKK...',
  '....KPPPPPK.....',
  '....KpPPPpK.....',
  '...KpppppppK....',
];

const marineKelpRows = [
  '......KgK.......',
  '.....KghgK......',
  '.....KghgK...K..',
  '......KghgK.KgK.',
  '.......KghgKghK.',
  '.......KghgKgK..',
  '......KghgKKK...',
  '.....KghgK......',
  '..K..KghgK......',
  '.KgK.KghgK......',
  '.KhgKKghgK......',
  '..KggKghgK......',
  '...KKKghgK......',
  '......KghgK.....',
  '......KghgK.....',
  '.......KghgK....',
];

const marineGalleonRows = [
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNnN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NnNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
];

const marinePortholeRows = [
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNGGGGGNnNNNN',
  'NNNnGGKKKGGnNNNN',
  'NNNGGKaaaKGGNNNN',
  'NNNGKaaWWaKGNNNN',
  'NNNGKaWWaaKGNNNN',
  'NNNGKaaaaaKGNNNN',
  'NNNGGKaaaKGGNNNN',
  'NNNnGGKKKGGnNNNN',
  'NNNnNGGGGGNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
];

const marineTreasureRows = [
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNnNNNNNNNnNNNN',
  'NNNKKKKKKKKKKKNN',
  'NNKnnnnnnnnnnnKN',
  'NKnYnnnnnnnnYnnK',
  'NKKKKKKKKKKKKKKK',
  'NKYYYYYYWYYYYYYK',
  'NKnnnnnKYKnnnnnK',
  'NKnnnnnKKKnnnnnK',
  'KKYYnnnnnnnnnnnK',
  'KYWYKnnnnnnnnnnK',
  'KYYYYKnnnnnnnnnK',
  'KYYWYYKKKKKKKKKK',
  'KKKKKKKNNKNNNNNN',
];

const marinePalmRows = [
  '.......KnnK.....',
  '.......KnNK.....',
  '......KnnNK.....',
  '......KKKKK.....',
  '......KnnNK.....',
  '......KnnNK.....',
  '......KnNNK.....',
  '.....KKKKKK.....',
  '.....KnnNK......',
  '.....KnnNK......',
  '.....KnNNK......',
  '....KKKKKK......',
  '....KnnNK.......',
  '....KnnNK.......',
  '....KnNNK.......',
  '...KKKKKK.......',
];

const marinePalmCrownRows = [
  '..........KKKK..........',
  '.....KKKKKhhhhKKKK......',
  '...KKhhhhhgghhhhhhKK....',
  '..KhhggggggggggghhhhK...',
  '.KhggKKKgggggKKKggghhK..',
  'KhgKK...KggKKgK..KKgghK.',
  'KgK....KggK.KggK...KKggK',
  'KK....KgK.KnnK.KgK...KgK',
  '.....KgK..KnnK..KgK...KK',
  '.....KK...KnNK...KK.....',
];

const marineMastRows = [
  '......KnnK......',
  '......KnnK......',
  '......KnNK......',
  '......KnNK......',
  '......KKKK......',
  '......KnnK......',
  '......KnNK......',
  '......KnNK......',
  '......KnnK......',
  '......KnNK......',
  '......KKKK......',
  '......KnnK......',
  '......KnNK......',
  '......KnNK......',
  '......KnnK......',
  '......KnNK......',
];

const marineCrateRows = [
  'KKKKKKKKKKKKKKKK',
  'KLLLLLLLLLLLLLLK',
  'KLnnnnnnnnnnnnLK',
  'KLnKnnnnnnnnKnLK',
  'KLnnKnnnnnnKnnLK',
  'KLnnnKnnnnKnnnLK',
  'KLnnnnKnnKnnnnLK',
  'KLnnnnnKKnnnnnLK',
  'KLnnnnnKKnnnnnLK',
  'KLnnnnKnnKnnnnLK',
  'KLnnnKnnnnKnnnLK',
  'KLnnKnnnnnnKnnLK',
  'KLnKnnnnnnnnKnLK',
  'KLnnnnnnnnnnnnLK',
  'KNNNNNNNNNNNNNNK',
  'KKKKKKKKKKKKKKKK',
];

const marineRailRows = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  'KKKKKKKKKKKKKKKK',
  'LnnnnnnnnnnnnnnL',
  'KKKKKKKKKKKKKKKK',
  '..KnK......KnK..',
  '..KnK......KnK..',
  '..KnK......KnK..',
  '..KnK......KnK..',
  '..KnK......KnK..',
  '..KnK......KnK..',
  '..KNK......KNK..',
];

const marineFlagRows = [
  'KKKKKKKKKKKKKK..',
  'KKKKKKKKKKKKKKK.',
  'KKKKKWWWWWKKKKKK',
  'KKKKWWWWWWWKKKKK',
  'KKKKWKKWKKWKKKKK',
  'KKKKWKKWKKWKKKK.',
  'KKKKWWWKWWWKKKK.',
  'KKKKKWWWWWKKKKK.',
  'KKWKKWKWKWKKWKKK',
  'KKKWWKKKKKKWWKKK',
  'KKKKKWWWWWWKKKK.',
  'KKKWWKKKKKKWWK..',
  'KKWKKKKKKKKKWK..',
  'KKKKKKKKKKKKKK..',
  '.KKKK..KKK.KK...',
  '..KK....K.......',
];

const marineHullPortRows = [
  '......KKKK......',
  '....KKGGGGKK....',
  '...KGGKKKKGGK...',
  '...KGKaaaaKGK...',
  '..KGKaWWaaaKGK..',
  '..KGKaWaaaaKGK..',
  '..KGKaaaaaaKGK..',
  '...KGKaaaaKGK...',
  '...KGGKKKKGGK...',
  '....KKGGGGKK....',
  '......KKKK......',
];


// FUNCTIONS

function swordShiftRows(rows, amount) {
  return rows.map(row => {
    const offset = ((amount % row.length) + row.length) % row.length;
    return row.slice(row.length - offset) + row.slice(0, row.length - offset);
  });
}

function swordFlipRows(rows) {
  return rows.map(row => row.split('').reverse().join(''));
}

function buildSwordfish(options) {
  const parts = [];
  parts.push([swordTail, 0, 16]);
  parts.push([swordArms.back, 3, 19]);
  parts.push([swordLegs[options.legs || 'stand'], 2, 26]);
  parts.push([swordTorso, 5, 18]);
  const arm = options.arm || 'side';
  if (arm === 'forward') parts.push([swordArms.forward, 19, 19]);
  else if (arm === 'up') parts.push([swordArms.up, 21, 9]);
  else parts.push([swordArms[arm], 21, 19]);
  parts.push([swordHelmet, 5, 5]);
  const face = swordFaces[options.face];
  if (face) parts.push([face[0], 5 + face[1], 5 + face[2]]);
  parts.push([swordCrest, 4, 0]);
  const bill = options.bill || 'level';
  if (bill === 'up') parts.push([swordBillUp, 22, -7]);
  else if (bill === 'down') parts.push([swordBillUp.slice().reverse(), 22, 9]);
  else {
    parts.push([swordBill, 24, 7]);
    parts.push([swordGuard, 22, 6]);
  }
  const top = bill === 'up' ? 7 : 0;
  return composeArt(50, 32 + top, parts.map(([rows, dx, dy]) => [rows, dx, dy + top]));
}

function buildSwordfishFlat(options) {
  const parts = [];
  parts.push([options.kick ? swordBodyFlatKick : swordBodyFlat, 0, 7]);
  parts.push([swordFinFlat, 8, 3]);
  parts.push([swordArmFlat, 15, 10]);
  parts.push([swordHelmet, 26, 3]);
  const face = swordFaces[options.face];
  if (face) parts.push([face[0], 26 + face[1], 3 + face[2]]);
  parts.push([swordCrest, 25, 0]);
  parts.push([swordBill, 45, 5]);
  parts.push([swordGuard, 43, 4]);
  return composeArt(70, 19, parts);
}

function swordTiltArt(rows) {
  const height = rows.length;
  const width = Math.max(...rows.map(row => row.length));
  const size = Math.ceil((width + height) / Math.SQRT2) + 2;
  const cx = width / 2;
  const cy = height / 2;
  const result = [];
  for (let y = 0; y < size; y++) {
    let line = '';
    for (let x = 0; x < size; x++) {
      const counts = {};
      for (let sy = 0; sy < 3; sy++) {
        for (let sx = 0; sx < 3; sx++) {
          const px = x + (sx + 0.5) / 3 - size / 2;
          const py = y + (sy + 0.5) / 3 - size / 2;
          const ux = Math.floor((px + py) / Math.SQRT2 + cx);
          const uy = Math.floor((py - px) / Math.SQRT2 + cy);
          const ch = uy >= 0 && uy < height ? rows[uy][ux] || '.' : '.';
          counts[ch] = (counts[ch] || 0) + 1;
        }
      }
      let best = '.';
      for (const ch in counts) if (counts[ch] > (counts[best] || 0)) best = ch;
      if (best === '.' && (counts.K || 0) >= 3) best = 'K';
      line += best;
    }
    result.push(line);
  }
  return swordTrimArt(result);
}

function swordTrimArt(rows) {
  const filled = rows.map(row => /[^.]/.test(row));
  const top = filled.indexOf(true);
  const bottom = filled.lastIndexOf(true);
  const cut = rows.slice(top, bottom + 1);
  const left = Math.min(...cut.map(row => row.search(/[^.]/)).filter(index => index >= 0));
  return trimRight(cut.map(row => row.slice(left)));
}

function swordCentered(rows) {
  const width = Math.max(...rows.map(row => row.length));
  return { ox: Math.floor(width / 2), oy: Math.floor(rows.length / 2), rows };
}

// VARIABLES

const swordFlatRows = buildSwordfishFlat({});
const swordDiveRows = swordTiltArt(swordFlatRows);

const swordfishArt = {
  swordfishStand: { ox: 14, rows: trimRight(buildSwordfish({})) },
  swordfishBlink: { ox: 14, rows: trimRight(buildSwordfish({ face: 'blink' })) },
  swordfishSwim1: { ox: 14, rows: trimRight(buildSwordfish({ legs: 'kickA', arm: 'back' })) },
  swordfishSwim2: { ox: 14, rows: trimRight(buildSwordfish({ legs: 'kickB' })) },
  swordfishPose: { ox: 14, rows: trimRight(buildSwordfish({ arm: 'up', face: 'shout' })) },
  swordfishJump: { ox: 14, rows: trimRight(buildSwordfish({ arm: 'up', legs: 'jump', face: 'shout' })) },
  swordfishSlashUp: { ox: 14, rows: trimRight(buildSwordfish({ bill: 'up', arm: 'back', face: 'shout' })) },
  swordfishSlashDown: { ox: 14, rows: trimRight(buildSwordfish({ bill: 'down', arm: 'forward', legs: 'kickB', face: 'shout' })) },
  swordfishLunge: swordCentered(swordFlatRows),
  swordfishLungeKick: swordCentered(buildSwordfishFlat({ kick: true, face: 'shout' })),
  swordfishStuck: swordCentered(buildSwordfishFlat({ kick: true, face: 'hurt' })),
  swordfishFlop: swordCentered(buildSwordfishFlat({ face: 'hurt' }).slice().reverse()),
  swordfishDive: swordCentered(swordDiveRows),
  swordfishRise: swordCentered(rotateArt(rotateArt(rotateArt(swordDiveRows)))),
  swordfishDown: swordCentered(swordTrimArt(rotateArt(swordFlatRows))),
  swordfishUp: swordCentered(swordTrimArt(rotateArt(rotateArt(rotateArt(swordFlatRows))))),
  swordfishFace: { ox: 0, oy: 0, rows: composeArt(32, 32, [[mirrorArt(swordfishFaceHalf), 0, 0], [swordBillUp, 16, -2]]) },
  swordGlint0: swordCentered(swordGlintFrames[0]),
  swordGlint1: swordCentered(swordGlintFrames[1]),
  swordWaterBlade0: swordCentered(swordWaterBladeRows),
  swordWaterBlade1: swordCentered(recolorArt(swordWaterBladeRows, { a: 'W', W: 'a' })),
  swordDashBlade0: { ox: 0, oy: 2, rows: swordDashBladeRows },
  swordDashBlade1: { ox: 0, oy: 2, rows: recolorArt(swordDashBladeRows, { W: 'G', G: 'W' }) },
  swordDashIcon0: swordCentered(swordDashIconRows),
  swordDashIcon1: swordCentered(recolorArt(swordDashIconRows, { W: 'Y', Y: 'W' })),
};

const swordfishTileArt = {
  tileMarineSand: { ox: 0, oy: 0, rows: marineSandRows },
  tileMarineSandTop: { ox: 0, oy: 0, rows: ['WWLLLWWWWLLWWWWL', 'LLLLLLLLLLLLLLLL', ...marineSandRows.slice(2)] },
  tileMarineRock: { ox: 0, oy: 0, rows: marineRockRows },
  tileMarineRockTop: { ox: 0, oy: 0, rows: ['KhKKKhhKKKhKKhhK', 'hghhhggghhghhggh', 'gegggeegggegggeg', 'eKeegKKeegKeeKKe', ...marineRockRows.slice(4)] },
  tileMarinePlank: { ox: 0, oy: 0, rows: marinePlankRows },
  tileMarinePier: { ox: 0, oy: 0, rows: [...marinePlankRows.slice(0, 6), '..KNnK....KNnK..', '..KNnK....KNnK..', '..KKKK....KKKK..'] },
  tileMarinePostWet: { ox: 0, oy: 0, rows: composeArt(16, 16, [[marineSeaRows, 0, 0], [marinePostRows, 0, 0]]) },
  tileMarineWater: { ox: 0, oy: 0, rows: marineSeaRows },
  tileMarineUrchin: { ox: 0, oy: 0, rows: marineUrchinRows },
  tileMarineCoral: { ox: 0, oy: 0, rows: marineCoralRows },
  tileMarineCoral2: { ox: 0, oy: 0, rows: swordFlipRows(recolorArt(marineCoralRows, { P: 'O', p: 'o' })) },
  tileMarineKelp0: { ox: 0, oy: 0, rows: marineKelpRows },
  tileMarineKelp1: { ox: 0, oy: 0, rows: swordShiftRows(marineKelpRows.slice(0, 8), 1).concat(marineKelpRows.slice(8)) },
  tileMarineGalleon: { ox: 0, oy: 0, rows: marineGalleonRows },
  tileMarinePorthole: { ox: 0, oy: 0, rows: marinePortholeRows },
  tileMarineTreasure: { ox: 0, oy: 0, rows: marineTreasureRows },
  tileMarinePalm: { ox: 0, oy: 0, rows: marinePalmRows },
  tileMarinePalmCrown: { ox: 4, oy: 0, rows: marinePalmCrownRows },
  tileMarineMast: { ox: 0, oy: 0, rows: marineMastRows },
  tileMarineCrate: { ox: 0, oy: 0, rows: marineCrateRows },
  tileMarineRail: { ox: 0, oy: 0, rows: marineRailRows },
  tileMarineFlag: { ox: 0, oy: 0, rows: marineFlagRows },
  tileMarineHullPort: { ox: 0, oy: 0, rows: composeArt(16, 16, [[marinePlankRows, 0, 0], [marineHullPortRows, 0, 3]]) },
  tileMarineHullTrim: { ox: 0, oy: 0, rows: ['KKKKKKKKKKKKKKKK', 'YYYYYYYYYYYYYYYY', 'oooooooooooooooo', 'KKKKKKKKKKKKKKKK', ...marinePlankRows.slice(4)] },
  marineRaft: { ox: 16, oy: 0, rows: marineRaftRows },
};

for (let i = 0; i < 4; i++) {
  swordfishTileArt['tileMarineSurface' + i] = { ox: 0, oy: 0, rows: [...swordShiftRows(marineSurfaceTop, i * 4), ...marineSeaRows.slice(4)] };
}

const swordfishMegaArt = {
  megaDash: { ox: 12, oy: 21, rows: swordMegaDashRows },
};

const swordfishEnemyArt = {
  marineJelly1: { rows: marineJellyRows.open },
  marineJelly2: { rows: marineJellyRows.squeeze },
  marineZapBolt: swordCentered(marineZapBoltRows),
  marinePiranha1: { oy: 11, rows: marinePiranhaRows.shut },
  marinePiranha2: { oy: 11, rows: marinePiranhaRows.open },
  marineCrab1: { rows: marineCrabRows.walk1 },
  marineCrab2: { rows: marineCrabRows.walk2 },
  marineCrabHide: { rows: marineCrabRows.hide },
  marineLanternIdle: { rows: marineLanternRows.idle },
  marineLanternGlow: { rows: marineLanternRows.glow },
  marineLampShot: swordCentered(marineLampShotRows),
};

// INITIALIZATION

Object.assign(palettes, {
  swordfishBoss: { B: 0x02, C: 0x12 },
  megaSwordfish: { B: 0x02, C: 0x20, v: 0x0C },
  orbSwordfish: { C: 0x12, W: 0x30 },
  swordDashGhost: { all: 0x21, K: undefined },
  marineEnemy: { o: 0x17, N: 0x00 },
  marineJellyZap: { P: 0x28, V: 0x38, W: 0x30 },
  marineTiles: {},
  marineHull: { n: 0x07, N: 0x0F, L: 0x17 },
  marineHold: { N: 0x0F, n: 0x08 },
});

registerArt(swordfishArt, 'swordfishBoss');
registerArt(swordfishMegaArt, 'megaSwordfish');
registerArt(swordfishTileArt, 'marineTiles');

registerAnimations([
  { label: 'Swordfish Man', fps: 4, frames: ['swordfishStand', 'swordfishStand', 'swordfishBlink', 'swordfishSwim1', 'swordfishSwim2', 'swordfishSwim1', 'swordfishPose', 'swordfishJump'] },
  { label: 'Swordfish Man investida', fps: 6, frames: ['swordfishLungeKick', 'swordfishLunge', 'swordfishLungeKick', 'swordfishLunge', 'swordfishStuck', 'swordfishLungeKick', 'swordfishStuck', 'swordfishLungeKick'] },
  { label: 'Swordfish Man corte', fps: 3, frames: ['swordfishSlashUp', 'swordfishSlashUp', 'swordfishSlashDown'] },
  { label: 'Swordfish Man mergulho', fps: 4, frames: ['swordfishDive', 'swordfishDown', 'swordfishDive', 'swordfishLunge', 'swordfishRise', 'swordfishUp'] },
  { label: 'Swordfish Man fisgado', fps: 8, frames: ['swordfishFlop', 'swordfishStuck'] },
  { label: 'Lamina d agua / brilho', fps: 8, frames: ['swordWaterBlade0', 'swordWaterBlade1', 'swordGlint0', 'swordGlint1'] },
  { label: 'Arma Sword Dash', fps: 6, frames: [{ sprite: 'megaStand', palette: 'mega' }, { sprite: 'megaStand', palette: 'megaSwordfish' }] },
  { label: 'Sword Dash', fps: 10, frames: [{ sprite: 'megaDash', palette: 'megaSwordfish' }, { sprite: 'megaDash', palette: 'swordDashGhost' }, 'swordDashBlade0', 'swordDashBlade1'] },
  { label: 'Icone Sword Dash', fps: 4, frames: ['swordDashIcon0', 'swordDashIcon0', 'swordDashIcon1'] },
  { label: 'Agua-viva robo', fps: 6, frames: ['marineJelly1', 'marineJelly1', 'marineJelly2', { sprite: 'marineJelly1', palette: 'marineJellyZap' }, 'marineZapBolt'] },
  { label: 'Piranha robo', fps: 6, frames: ['marinePiranha1', 'marinePiranha2'] },
  { label: 'Caranguejo ermitao', fps: 4, frames: ['marineCrab1', 'marineCrab2', 'marineCrab1', 'marineCrab2', 'marineCrabHide', 'marineCrabHide'] },
  { label: 'Peixe-lanterna', fps: 6, frames: ['marineLanternIdle', 'marineLanternIdle', 'marineLanternGlow', 'marineLanternIdle', 'marineLanternGlow', 'marineLampShot'] },
  { label: 'Superficie do mar', fps: 5, frames: ['tileMarineSurface0', 'tileMarineSurface1', 'tileMarineSurface2', 'tileMarineSurface3'] },
  { label: 'Alga / jangada', fps: 2, frames: ['tileMarineKelp0', 'tileMarineKelp1', 'marineRaft'] },
  { label: 'Retrato Swordfish Man', fps: 1, frames: ['swordfishFace'] },
]);
registerArt(swordfishEnemyArt, 'marineEnemy');
