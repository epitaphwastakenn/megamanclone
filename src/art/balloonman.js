// VARIABLES

const balloonEnvelopes = {
  full: [
    '.........KKKKKKKK.........',
    '......KKKYWYRRYYYKKK......',
    '....KKRRYWYRRRRYYYRRKK....',
    '..KKYRRYWYYRRRRYYYYRRYKK..',
    '.KYYRRRYWYYRRRRYYYYRRROOK.',
    'KYYRRRYYYYYRRRRYYYYYRRROOK',
    'KYYRRRYYYYYRRRRYYYYYRRROOK',
    'KYYRRRYYYYYRRRRYYYYYRRROOK',
    'KYYRRRYYYYYRRRRYYYYYRRROOK',
    'KYYRRRYYYYYRRRRYYYYYRRROOK',
    '.KYYRRRYYYYRRRRYYYYRRROOK.',
    '..KYRRRYYYYRRRRYYYYRRROK..',
    '...KYRRRYYYRRRRYYYRRROK...',
    '....KYRRRYYRRRRYYRRROK....',
    '......KYRYYYRRYYYRYK......',
    '.......KKKKKKKKKKKK.......',
  ],
  vent: [
    '..........................',
    '..........................',
    '...........KKKK...........',
    '.......KKKKYRRYKKKK.......',
    '.....KKYRRYYRRYYRRYKK.....',
    '....KYWYRRYYRRYYRRYOOK....',
    '...KYWYRRYYYRRYYYRRYOOK...',
    '...KYYYRRYYYRRYYYRRYOOK...',
    '...KYYYRRYYYRRYYYRRYOOK...',
    '....KYYRRYYYRRYYYRRYOK....',
    '....KYYRRYYYRRYYYRRYOK....',
    '.....KYRRYYYRRYYYRROK.....',
    '.....KYRRYYYRRYYYRROK.....',
    '......KYRRYYRRYYRROK......',
    '.......KYRYYRRYYRYK.......',
    '.......KKKKKKKKKKKK.......',
  ],
  half: [
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........KKKKKK..........',
    '.......KKKYRRRRYKKK.......',
    '.....KKYRRYYRRYYRRYKK.....',
    '....KYWYRRYYRRYYRRYOOK....',
    '...KYWYRRYYYRRYYYRRYOOK...',
    '...KYYYRRYYYRRYYYRRYOOK...',
    '....KYYRRYYYRRYYYRRYOK....',
    '.....KYRRYYYRRYYYRROK.....',
    '......KYRRYYRRYYRROK......',
    '.......KYRYYRRYYRYK.......',
    '.......KKKKKKKKKKKK.......',
  ],
  flat: [
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '..........................',
    '.........KKKK.............',
    '.......KKYRRYKKK..........',
    '.....KKYRRYYRRRYKK........',
    '....KYRRYKYRRYYRRYKKK.....',
    '...KYRRYKYYRRRYKYYRRYKK...',
    '..KYRRYKKYRRRYYRKYRRYOOK..',
    '..KRRYK.KYRRYYRRKKRYYOOK..',
    '.KYRYK..KKRRYYRK.KKRYOK...',
    '.KRRK....KKKKKKK...KKOK...',
    '.KKK................KK....',
  ],
};

const balloonHeads = {
  normal: [
    '....KKKKK....',
    '..KKRRRRRKK..',
    '.KRRRRRRRRRK.',
    'KRRRRRRRRRRRK',
    'KRRRKKKKKKKKK',
    'KYYKSSWWKSWWK',
    'KYYKSSWWKSWKK',
    'KRRKSSSSSSSSK',
    '.KRKSSSKKKSK.',
    '..KKKKKKKKKK.',
  ],
  blink: [
    '....KKKKK....',
    '..KKRRRRRKK..',
    '.KRRRRRRRRRK.',
    'KRRRRRRRRRRRK',
    'KRRRKKKKKKKKK',
    'KYYKSSSSSSSSK',
    'KYYKSSKKKSKKK',
    'KRRKSSSSSSSSK',
    '.KRKSSSKKKSK.',
    '..KKKKKKKKKK.',
  ],
  shout: [
    '....KKKKK....',
    '..KKRRRRRKK..',
    '.KRRRRRRRRRK.',
    'KRRRRRRRRRRRK',
    'KRRRKKKKKKKKK',
    'KYYKSSWKKSWKK',
    'KYYKSSWWKSWWK',
    'KRRKSSSSSKKKK',
    '.KRKSSSKrrrK.',
    '..KKKKKKKKKK.',
  ],
  dizzy: [
    '....KKKKK....',
    '..KKRRRRRKK..',
    '.KRRRRRRRRRK.',
    'KRRRRRRRRRRRK',
    'KRRRKKKKKKKKK',
    'KYYKSSSSSSSSK',
    'KYYKSKKKSKKKK',
    'KRRKSSSSSSSSK',
    '.KRKSSKKKKSK.',
    '..KKKKKKKKKK.',
  ],
};

const balloonBasket = [
  'KKKKKKKKKKKKKKKKKK',
  'KLLLLLLLLLLLLLLLLK',
  'KOoOOoOOoOOoOOoOOK',
  'KoOOoOOoOOoOOoOOoK',
  'KOOoOOoOOoOOoOOoOK',
  'KooooooooooooooooK',
  '.KKKKKKKKKKKKKKKK.',
];

const balloonArms = {
  grip: [
    ['.KK.', 'KYYK', 'KYYK', 'KRRK', 'KRRK', '.KRK'],
    ['.KK.', 'KYYK', 'KYYK', 'KRRK', 'KRRK', 'KRK.'],
  ],
  up: [
    ['.KK.', 'KYYK', 'KYYK', 'KRRK', 'KRRK', 'KRRK', 'KRRK', 'KRRK', 'KRRK', 'KRK.'],
    ['.KK.', 'KYYK', 'KYYK', 'KRRK', 'KRRK', 'KRRK', 'KRRK', 'KRRK', 'KRRK', '.KRK'],
  ],
  reach: [
    ['.KK.', 'KYYK', 'KYYK', 'KRRK', 'KRRK', '.KRK'],
    ['.KKK..', 'KRRRK.', 'KKRRK.', '.KRRK.', '.KRRK.', '.KYYK.', '.KYYK.', '..KK..'],
  ],
};

const balloonLegs = {
  dangle: [
    '...KRRK..KRRK...',
    '...KRRK..KRRK...',
    '...KRRK..KRRK...',
    '...KYYYK.KYYYK..',
    '...KKKKK.KKKKK..',
  ],
  stand: [
    '..KRRK....KRRK..',
    '..KRRK....KRRK..',
    '.KYYYYK..KYYYYK.',
    '.KYYYYKK.KYYYYKK',
    '.KKKKKKK.KKKKKKK',
  ],
  sit: [
    '................',
    '................',
    '.KKKKKK..KKKKKK.',
    'KRRRRYYK.KRRRRYYK',
    'KKKKKKKK.KKKKKKKK',
  ],
};

const balloonBag = [
  '.KKK.',
  'KLoLK',
  'KLLLK',
  'KLLLK',
  'KLLnK',
  'KLnnK',
  '.KKK.',
];

const balloonFaceHalf = [
  'KYYRRRYYYYRRRRRR',
  'KYYRRRYWWYRRRRRR',
  '.KYRRRYWYYRRRRRR',
  '.KYYRRRYYYRRRRRR',
  '..KYRRRYYYYRRRRR',
  '...KYRRRYYYRRRRR',
  '....KKRRRYYYRRRR',
  '...N..KKRRYYRRRR',
  '...N....KKKYYRRR',
  '...N.......KKKKK',
  '...N.........KGG',
  '...N.......KKKKK',
  '...N...KKKKRRRRR',
  '...N.KKRRRRRRRRR',
  '...NKRRRRRRRRRRR',
  '...KRRRRRRRRRRRR',
  '..KRRRRRRRRRRRRR',
  '..KRRRRKKKKKKKKK',
  '.KYYRRKSSSSSSSSS',
  '.KYKYRKSSKKKKSSS',
  '.KYKYRKSSWWWWKSS',
  '.KYKYRKSSWWWKKSS',
  '.KYYRRKSSWWWKKSS',
  '..KRRRKSSSSSSSSS',
  '..KRRRKSSSSSSSSS',
  '..NKRRKSSSSSSKKK',
  '..N.KRKSSSSSSSSS',
  '..N..KKKSSSSSSSS',
  'KKKKKKKKKKKKKKKK',
  'KLLLLLLLLLLLLLLL',
  'KOoOOoOOoOOoOOoO',
  'KoOOoOOoOOoOOoOO',
];

const balloonFlames = {
  small: ['.Y.', 'YWY', 'YWY'],
  big: ['..Y..', '.YWY.', '.YWY.', 'YWWWY', 'OYWYO', '.OYO.'],
};

const balloonDropBagRows = [
  '.....KK.....',
  '....KooK....',
  '...KKooKK...',
  '..KLLKKLLK..',
  '.KLLLLLLLLK.',
  'KLLWLLLLLLLK',
  'KLLLLLnLLLLK',
  'KLLLLLLLLLnK',
  'KLnLLLLLLLnK',
  'KLLLLnLLLnnK',
  '.KnnnnnnnnK.',
  '..KKKKKKKK..',
];

const balloonSandPile = [
  '....KKKKKKKKKKKKKKKKKKKKKKKK....',
  '..KKLLLLLWLLLLLLLLLLLLWLLLLLKK..',
  '.KLLLWLLLLLLLLnLLLLLLLLLLLWLLLK.',
  'KLLLLLLLLnLLLLLLLLLWLLLLLLLLLLLK',
  'KLLnLLLLLLLLLLWLLLLLLLLnLLLLLLLK',
  'KLLLLLLWLLLLLLLLLLnLLLLLLLLWLnLK',
  'KLLLLLLLLLLnLLLLLLLLLLLLnLLLLLLK',
  'KLnLLLLLLLLLLLLLLLLnLLLLLLLLLLnK',
  'KLLLLLnLLLLLLLWLLLLLLLLLLnLLLLLK',
  'KnLLLLLLLLLLLLLLLLLLLLLLLLLLLLnK',
  'KLLLLLLLLLnLLLLLLLnLLLLLLLLnLLLK',
  'KnnLLLLLLLLLLLLLLLLLLLLLLLLLLnnK',
  'KnLnnLLLLnLLLLLLLLLLnLLLLLnnLnnK',
  'KnnnnnnLLLLLLLnLLLLLLLLLnnnnnnnK',
  'KnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnK',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
];

const balloonFire = [
  '..RYWWWWYR..',
  '.ROYWWWWYOR.',
  '.ROYYWWYYOR.',
  'ROOYWWWWYOOR',
  'ROYWWWWWWYOR',
  '.ROYWWWWYOR.',
  '..ROYWWYOR..',
  '.ROOYWWYOOR.',
  'ROOYYWWYYOOR',
  'ROYYWWWWYYOR',
  '.RYWWWWWWYR.',
  '.ROYWWWWYOR.',
  '..ROYWWYOR..',
  '.RROYWWYORR.',
  'ROOYYWWYYOOR',
  '.ROYWWWWYOR.',
];

const balloonFireTip = [
  '...ROYWWWWYOR...',
  '..ROYYWWWWYYOR..',
  '.ROYWWWWWWWWYOR.',
  'ROYYWWWWWWWWYYOR',
  'ROOYYYWWWWYYYOOR',
  '.RROOOYYYYOOORR.',
];

const sandBagSmall = [
  '...KK...',
  '..KooK..',
  '.KLKKLK.',
  'KLLLLLLK',
  'KLLWLLLK',
  'KLLLLLnK',
  'KLnLLnnK',
  '.KKKKKK.',
];

const sandWaves = [
  [
    '...........W....',
    '.........W..W...',
    '.......KKKK..W..',
    '.....KKLLLLKK...',
    '....KLLLWLLLLK..',
    '...KLLnLLLLLLLK.',
    '...KLLLLLLKKLLK.',
    '..KLLLnLLK..KK..',
    '..KLLLLLLK......',
    '.KLLnLLLLLK.....',
    '.KLLLLLnLLLK....',
    'KLLnLLLLLLLLK...',
    'KLLLLLLnLLLLLK..',
    'KKKKKKKKKKKKKKK.',
  ],
  [
    '..........W.....',
    '............W...',
    '.......KKKK...W.',
    '.....KKLLLLKK...',
    '....KLLLLLWLLK..',
    '...KLLLLnLLLLLK.',
    '...KLnLLLLKKLLK.',
    '..KLLLLLLK..KK..',
    '..KLLLnLLK......',
    '.KLLLLLLLLK.....',
    '.KLnLLLLLLnK....',
    'KLLLLLLnLLLLK...',
    'KLLLnLLLLLLLLK..',
    'KKKKKKKKKKKKKKK.',
  ],
];

const sandDustFrames = [
  ['.LL.', 'LWLL', 'LLLn', '.nn.'],
  ['.L..L.', 'L.LL..', '.LnL.L', 'L..n..', '..n..L'],
  ['L....L', '......', '..L...', 'n....n', '...L..'],
];

const balloonPuffFrames = [
  ['.WW.', 'WWWW', 'WWWW', '.WW.'],
  ['.W..W.', 'W.WW.W', '.WWWW.', 'W.WW.W', '.W..W.'],
  ['W....W', '......', '..WW..', '......', 'W....W'],
];

const vultureFrames = {
  perch: [
    '.....KKK........',
    '....KPPPK.......',
    '....KPKPPK......',
    '....KPPPKYK.....',
    '.....KPPKYYK....',
    '..KKKWWWKKK.....',
    '.KNNNNWWNNNK....',
    'KNnNNNNNNNNNK...',
    'KNnnNNNNNNNNNK..',
    'KNNnnNNNNNNNNK..',
    '.KNNnnNNNNNNK...',
    '..KNNNnnNNNK....',
    '...KKKNNNKK.....',
    '.....KGKGK......',
    '.....KGKGK......',
    '....KGGKGGK.....',
    '....KKKKKKK.....',
  ],
  up: [
    '...KK.KK.KK...........',
    '..KNNKNNKNNK..........',
    '..KNnNNnNNnK..........',
    '...KNnNNnNNK..........',
    '....KNnNNnNK....KKK...',
    '.....KNnNNNK...KPPPK..',
    '..KKKKNNNNNKKKKPKPPKK.',
    '.KNNNNNNNNNNNWWKPPPYYK',
    'KNNNnnNNNNNNNNWWKKKYK.',
    '.KKKNNnnNNNNNNNKK.KK..',
    '....KKKNNNNNNKK.......',
    '.......KKGKGKK........',
    '........KGKGK.........',
    '........KK.KK.........',
  ],
  down: [
    '......................',
    '................KKK...',
    '...............KPPPK..',
    '..KKKK.KKKKKK.KPKPPKK.',
    '.KNNNNKNNNNNNKWKPPPYYK',
    'KNNNnnNNNNNNNNWWKKKYK.',
    '.KKKNNnnNNNNNNNKK.KK..',
    '...KNnNNnNNnNKK.......',
    '...KNnNNnNNnNK........',
    '..KNnNNnNNnNK.........',
    '..KNNKNNKNNK..........',
    '...KK.KK.KK...........',
    '......................',
    '......................',
  ],
  dive: [
    'KKK...................',
    'KNNKK.................',
    '.KNnNKK...............',
    '..KNnnNKKK......KKK...',
    '...KNNnnNNKKKKKKPPPK..',
    '....KKNNNNNNNNWKPKPPKK',
    '......KNNNNNNNWWKPPPYYK',
    '.......KKKNNNNNWKKKKYK.',
    '..........KKKKKKK..KK..',
  ],
};

const kiteBotFrames = [
  [
    '.......KK.......',
    '......KWWK......',
    '.....KWWBBK.....',
    '....KWWWBBBK....',
    '...KWWWWBBBBK...',
    '..KWWWKKKBBBBK..',
    '.KWWWKRRWKBBBBK.',
    'KKKKKKRKRKKKKKKK',
    '.KBBBKRRRKWWWWK.',
    '..KBBBKKKWWWWK..',
    '...KBBBBWWWWK...',
    '....KBBBWWWK....',
    '.....KBBWWK.....',
    '......KBWK......',
    '.......KK.......',
  ],
  [
    '.......KK.......',
    '......KWWK......',
    '.....KWWBBK.....',
    '....KWWWBBBK....',
    '...KWWWWBBBBK...',
    '..KWWWKKKBBBBK..',
    '.KWWWKWRRKBBBBK.',
    'KKKKKKRKRKKKKKKK',
    '.KBBBKRRRKWWWWK.',
    '..KBBBKKKWWWWK..',
    '...KBBBBWWWWK...',
    '....KBBBWWWK....',
    '.....KBBWWK.....',
    '......KBWK......',
    '.......KK.......',
  ],
];

const kiteBow = ['RR.RR', '.RKR.', 'RR.RR'];

const airMineFrames = [
  [
    '.......KK.......',
    '.......KWK......',
    '.....KKKKKK.....',
    '...KKPPPPPPKK...',
    '..KPWWPPPPPppK..',
    '..KPWPPPPPPppK..',
    'KKKPPPPPPPPppKKK',
    'KWKGGGGRGGGGGKWK',
    'KKKPPPPPPPPppKKK',
    '..KPPPPPPPpppK..',
    '..KpPPPPPpppK...',
    '...KKppppppKK...',
    '.....KKKKKK.....',
    '.......KK.......',
    '.......KWK......',
    '........K.......',
  ],
  [
    '.......KK.......',
    '.......KWK......',
    '.....KKKKKK.....',
    '...KKPPPPPPKK...',
    '..KPWWPPPPPppK..',
    '..KPWPPPPPPppK..',
    'KKKPPPPPPPPppKKK',
    'KWKGGGGYGGGGGKWK',
    'KKKPPPPPPPPppKKK',
    '..KPPPPPPPpppK..',
    '..KpPPPPPpppK...',
    '...KKppppppKK...',
    '.....KKKKKK.....',
    '.......KK.......',
    '.......KWK......',
    '........K.......',
  ],
];

const airMinePellet = ['.KK.', 'KPWK', 'KWPK', '.KK.'];

const canyonEnvelopeRows = [
  '.............KKKKKKKKKK.............',
  '.........KKKKZXXXZZXXXZKKKK.........',
  '......KKKXZZZXXXZZZZXXXZZZXKKK......',
  '....KKXXXZZZXXXXZZZZXXXXZZZXXXKK....',
  '..KKZXXZZZZXXXXXZZZZXXXXXZZZZXXZKK..',
  '.KZZXXXZZZZXXXXXZZZZXXXXXZZZZXXXZZK.',
  '.KZXXXZZZZZXXXXZZZZZZXXXXZZZZZXXXZK.',
  'KZZXXXZZZZXXXXXZZZZZZXXXXXZZZZXXXZZK',
  'KZXXXXZZZZXXXXXZZZZZZXXXXXZZZZXXXXZK',
  'KZXXXXZZZZXXXXXZZZZZZXXXXXZZZZXXXXZK',
  'KZXXXXZZZZXXXXXZZZZZZXXXXXZZZZXXXXZK',
  'KZZXXXZZZZXXXXXZZZZZZXXXXXZZZZXXXZZK',
  '.KZXXXZZZZZXXXXZZZZZZXXXXZZZZZXXXZK.',
  '.KZZXXXZZZZXXXXXZZZZXXXXXZZZZXXXZZK.',
  '..KZZXXZZZZXXXXXZZZZXXXXXZZZZXXZZK..',
  '...KZZXXZZZZXXXXZZZZXXXXZZZZXXZZK...',
  '.....KZXXZZZXXXXZZZZXXXXZZZXXZK.....',
  '......KZXXZZZXXXZZZZXXXZZZXXZK......',
  '........KZXZZZXXXZZXXXZZZXZK........',
  '.........KZXZZXXXZZXXXZZXZK.........',
  '...........KXZZXXZZXXZZXK...........',
  '............KKKKKKKKKKKK............',
  '.............KNNNNNNNNK.............',
];

const canyonRockRows = [
  'oooOoooooooooOoo',
  'oooooooKoooooooo',
  'rrrrrrrrrrrrrrrr',
  'ooooOoooooooooOo',
  'oooooooooOoooooo',
  'oKoooooooooooKoo',
  'rrrrrrrrrrrrrrrr',
  'rrrKrrrrrrrrrrrr',
  'ooooooooOooooooo',
  'OoooooooooooOooo',
  'ooooooKooooooooo',
  'rrrrrrrrrrrrrrrr',
  'oooooOoooooooooo',
  'oooooooooooooOoo',
  'ooKooooooOoooooo',
  'rrrrrrrrrrrrrrrr',
];

const canyonCliffRows = [
  'rrrrrKrrrrrrrrKr',
  'rorrrKrrrorrrrKr',
  'rrrrKrrrrrrrrKrr',
  'rrrrKrrrrrrrrKrr',
  'rrorKrrrrrorrrKr',
  'rrrrrKrrrrrrrrKr',
  'KKrrrKrrrrrrrrrK',
  'rrKKrrKrrorrrrrK',
  'rrrrKKKrrrrrrrrK',
  'rrrrrrKrrrrrrorK',
  'rorrrrKrrrrrrrKr',
  'rrrrrKrrrrrrrrKr',
  'rrrrrKrrrrorrKKr',
  'rrorrKrrrrrrKrrr',
  'rrrrrrKrrrrrKrrr',
  'KKKrrrKrrrrrKrro',
];


const canyonCactusTrunk = '....KgegegK.....';

const canyonEmptyRow = '................';

// FUNCTIONS

function buildBalloonMan(options) {
  const envelope = balloonEnvelopes[options.envelope || 'full'];
  const arms = balloonArms[options.arms || 'grip'];
  const legs = options.legs || 'dangle';
  const parts = [[envelope, 2, 0]];
  parts.push([['.KKKKK.', 'KGGGGGK'], 12, 16]);
  if (options.envelope !== 'flat') for (let row = 14; row < 28; row++) parts.push([['N'], 7, row], [['N'], 22, row]);
  parts.push([balloonHeads[options.face || 'normal'], 9, 18]);
  parts.push([balloonBasket, 6, 28]);
  parts.push([balloonLegs[legs], 7, 35]);
  if (options.arms === 'up') parts.push([arms[0], 3, 19], [arms[1], 23, 19]);
  else if (options.arms === 'reach') parts.push([arms[0], 5, 23], [arms[1], 22, 27]);
  else parts.push([arms[0], 5, 23], [arms[1], 21, 23]);
  if (options.bags) parts.push([balloonBag, 3, 29], [balloonBag, 22, 29]);
  return composeArt(32, 40, parts);
}

function canyonEnvelope(stripeA, stripeB) {
  return recolorArt(canyonEnvelopeRows, { X: stripeA, Z: stripeB });
}

function canyonWeaveRow(inner, offset) {
  let row = 'K';
  for (let i = 0; i < inner; i++) row += (i + offset) % 3 === 0 ? 'o' : 'O';
  return row + 'K';
}

function canyonBasket(width) {
  const inner = width - 2;
  return [
    'K'.repeat(width),
    'K' + 'L'.repeat(inner) + 'K',
    'K' + 'n'.repeat(inner) + 'K',
    canyonWeaveRow(inner, 0),
    canyonWeaveRow(inner, 1),
    canyonWeaveRow(inner, 2),
    canyonWeaveRow(inner, 0),
    canyonWeaveRow(inner, 1),
    'K' + 'o'.repeat(inner) + 'K',
    '.' + 'K'.repeat(inner) + '.',
  ];
}

function canyonTopRows(base) {
  return [
    'LLLLLLLLLLLLLLLL',
    'LLLLYLLLLLLLYLLL',
    'YYYYYYYYYYYYYYYY',
    'OYOOOYOOOOYOOOYO',
    'KOKOOKOOKOOKOOKO',
    'oKooKooKooKooKoo',
    ...base.slice(6),
  ];
}

function canyonCactusTop() {
  return [
    '.....KKKKK......',
    '....KgegegK.....',
    '....KgegegK.....',
    '....KgegegK.....',
    '....KgegegK..KK.',
    '....KgegegK.KgeK',
    '.KK.KgegegK.KgeK',
    'KgeKKgegegK.KgeK',
    'KgeKKgegegKKKgeK',
    'KgeKKgegegKgegeK',
    'KgegKgegegKgegK.',
    '.KgegegegegegK..',
    '..KKKgegegKKK...',
    canyonCactusTrunk,
    canyonCactusTrunk,
    canyonCactusTrunk,
  ];
}

function canyonFill(rows, count) {
  return new Array(count).fill(rows).flat();
}

// VARIABLES

const balloonArt = {
  balloonBody: { ox: 15, rows: buildBalloonMan({}) },
  balloonBodyBlink: { ox: 15, rows: buildBalloonMan({ face: 'blink' }) },
  balloonBodyShout: { ox: 15, rows: buildBalloonMan({ face: 'shout', arms: 'up' }) },
  balloonBodyReach: { ox: 15, rows: buildBalloonMan({ face: 'shout', arms: 'reach' }) },
  balloonBodyVent: { ox: 15, rows: buildBalloonMan({ envelope: 'vent', face: 'shout', arms: 'up' }) },
  balloonBodyHalf: { ox: 15, rows: buildBalloonMan({ envelope: 'half', face: 'shout', legs: 'stand' }) },
  balloonBodyFlat: { ox: 15, rows: buildBalloonMan({ envelope: 'flat', face: 'dizzy', arms: 'up' }) },
  balloonBodySit: { ox: 15, rows: buildBalloonMan({ envelope: 'flat', face: 'dizzy', legs: 'sit' }) },
  balloonBodyGround: { ox: 15, rows: buildBalloonMan({ legs: 'stand' }) },
  balloonStand: { ox: 15, rows: buildBalloonMan({ legs: 'stand', bags: true }) },
  balloonFall: { ox: 15, rows: buildBalloonMan({ bags: true, face: 'shout' }) },
  balloonPose: { ox: 15, rows: buildBalloonMan({ legs: 'stand', bags: true, face: 'shout', arms: 'up' }) },
  balloonBag: { ox: 2, oy: 0, rows: balloonBag },
  balloonFace: { ox: 0, oy: 0, rows: mirrorArt(balloonFaceHalf) },
  balloonFlameSmall: { ox: 1, oy: 3, rows: balloonFlames.small },
  balloonFlameBig: { ox: 2, oy: 6, rows: balloonFlames.big },
  balloonDropBag: { ox: 6, oy: 6, rows: balloonDropBagRows },
  balloonShadowBig: { ox: 7, oy: 2, rows: ['...KKKKKKKK...', '.KKKKKKKKKKKK.', '...KKKKKKKK...'] },
  balloonShadowSmall: { ox: 4, oy: 2, rows: ['..KKKK..', 'KKKKKKKK', '..KKKK..'] },
  balloonSandPile: { ox: 16, oy: 0, rows: balloonSandPile },
  balloonFire0: { ox: 6, oy: 0, rows: balloonFire },
  balloonFire1: { ox: 6, oy: 0, rows: [...balloonFire.slice(8), ...balloonFire.slice(0, 8)] },
  balloonFireTip: { ox: 8, oy: 6, rows: balloonFireTip },
  sandWave0: { ox: 8, rows: sandWaves[0] },
  sandWave1: { ox: 8, rows: sandWaves[1] },
};

let sandBagFrame = sandBagSmall;
for (let i = 0; i < 4; i++) {
  balloonArt['sandBag' + i] = { ox: 4, oy: 4, rows: sandBagFrame };
  sandBagFrame = rotateArt(sandBagFrame);
}

sandDustFrames.forEach((rows, index) => {
  balloonArt['sandDust' + index] = { ox: Math.floor(rows[0].length / 2), oy: Math.floor(rows.length / 2), rows };
});

balloonPuffFrames.forEach((rows, index) => {
  balloonArt['balloonPuff' + index] = { ox: Math.floor(rows[0].length / 2), oy: Math.floor(rows.length / 2), rows };
});

const canyonEnemyArt = {
  vulturePerch: { rows: vultureFrames.perch },
  vultureUp: { ox: 11, oy: 12, rows: vultureFrames.up },
  vultureDown: { ox: 11, oy: 12, rows: vultureFrames.down },
  vultureDive: { ox: 11, oy: 8, rows: vultureFrames.dive },
  kiteBot0: { ox: 8, oy: 7, rows: kiteBotFrames[0] },
  kiteBot1: { ox: 8, oy: 7, rows: kiteBotFrames[1] },
  kiteBow: { ox: 2, oy: 1, rows: kiteBow },
  airMine0: { ox: 8, oy: 8, rows: airMineFrames[0] },
  airMine1: { ox: 8, oy: 8, rows: airMineFrames[1] },
  airMinePellet: { ox: 2, oy: 2, rows: airMinePellet },
};

const canyonTileArt = {
  tileCanyonRock: { ox: 0, oy: 0, rows: canyonRockRows },
  tileCanyonTop: { ox: 0, oy: 0, rows: canyonTopRows(canyonRockRows) },
  tileCanyonCliff: { ox: 0, oy: 0, rows: canyonCliffRows },
  tileCanyonCliffTop: { ox: 0, oy: 0, rows: canyonTopRows(canyonCliffRows) },
  tileCanyonBack: { ox: 0, oy: 0, rows: recolorArt(canyonCliffRows, { r: 'N', o: 'r', K: 'r' }) },
  tileCanyonPlank: {
    ox: 0,
    oy: 0,
    rows: [
      'KKKKKKKKKKKKKKKK',
      'LnLLLLLnLLLLLLnL',
      'nnnnnnnNnnnnnnnN',
      'NNNNNNNKNNNNNNNK',
      'KKKKKKKKKKKKKKKK',
      '..KNK......KNK..',
      '..KNK......KNK..',
      '...K........K...',
      ...canyonFill([canyonEmptyRow], 8),
    ],
  },
  tileCanyonLadder: {
    ox: 0,
    oy: 0,
    rows: canyonFill([
      '...KOK....KOK...',
      '...KOK....KOK...',
      '..KKOKKKKKKOKK..',
      '..KnnnnnnnnnnK..',
      '..KNNNNNNNNNNK..',
      '..KKOKKKKKKOKK..',
      '...KOK....KOK...',
      '...KOK....KOK...',
    ], 2),
  },
  tileCanyonCactusTop: { ox: 0, oy: 0, rows: canyonCactusTop() },
  tileCanyonCactus: { ox: 0, oy: 0, rows: canyonFill([canyonCactusTrunk], 16) },
  tileCanyonBrush: {
    ox: 0,
    oy: 0,
    rows: [
      ...canyonFill([canyonEmptyRow], 9),
      '.....K.K.K......',
      '...K.nKnKn.K....',
      '..KnKnnnnnKnK...',
      '.KnnnNnnNnnnnK..',
      '.KnNnnnNnnnNnK..',
      'KNnnNnnnnNnnnNK.',
      'KKKKKKKKKKKKKKK.',
    ],
  },
  tileCanyonPost: {
    ox: 0,
    oy: 0,
    rows: [
      '......KKKK......',
      '.....KLnnNK.....',
      '.....KnnnNK.....',
      'OOOOOKnnnNKOOOOO',
      'oooooKnnnNKooooo',
      '.....KnnnNK.....',
      '.....KnnnNK.....',
      '.....KnnnNK.....',
      '.....KnnnNK.....',
      '.....KnnnNK.....',
      '.....KnnnNK.....',
      '.....KnnnNK.....',
      '.....KnnnNK.....',
      '.....KnnnNK.....',
      '....KNnnnNNK....',
      '...KNNNNNNNNK...',
    ],
  },
  tileCanyonBeam: {
    ox: 0,
    oy: 0,
    rows: canyonFill([
      '.....KnnNK......',
      '.....KnnNK......',
      '.....KnnNK......',
      '.....KnnNK......',
      '.....KnnNK......',
      '.....KnnNK......',
      '..KKKKnnNKKKK...',
      '..KNNNNNNNNNK...',
    ], 2),
  },
  canyonEnvelopeBlue: { ox: 18, rows: canyonEnvelope('B', 'W') },
  canyonEnvelopeRed: { ox: 18, rows: canyonEnvelope('R', 'Y') },
  canyonBasket: { ox: 24, oy: 0, rows: canyonBasket(48) },
};

// INITIALIZATION

Object.assign(palettes, {
  megaBalloon: { B: 0x18, C: 0x38, v: 0x08 },
  orbBalloon: { C: 0x28, W: 0x30 },
  sandFlash: { L: 0x30, n: 0x10, W: 0x30 },
  canyonMine: { P: 0x2A, p: 0x1A },
  balloonMark: { K: 0x16 },
});

registerArt(balloonArt, 'boss');
registerArt(canyonEnemyArt, 'enemy');
registerArt(canyonTileArt, 'enemy');

registerAnimations([
  { label: 'Balloon Man', fps: 4, frames: ['balloonStand', 'balloonStand', 'balloonPose', 'balloonStand', 'balloonFall', 'balloonFall'] },
  { label: 'Balloon Man flutuando', fps: 4, frames: ['balloonBody', 'balloonBody', 'balloonBodyBlink', 'balloonBody', 'balloonBodyReach', 'balloonBodyShout'] },
  { label: 'Balloon Man mergulho', fps: 3, frames: ['balloonBody', 'balloonBodyVent', 'balloonBodyVent', 'balloonBody'] },
  { label: 'Balloon Man furado', fps: 3, frames: ['balloonBodyFlat', { sprite: 'balloonBodyFlat', flip: true }, 'balloonBodySit', 'balloonBodySit', 'balloonBodyHalf', 'balloonBodyGround'] },
  { label: 'Queimador', fps: 10, frames: ['balloonFlameSmall', 'balloonFlameBig'] },
  { label: 'Saco de areia', fps: 4, frames: ['balloonDropBag', 'balloonShadowSmall', 'balloonShadowBig'] },
  { label: 'Monte de areia', fps: 4, frames: ['balloonSandPile', { sprite: 'balloonSandPile', palette: 'sandFlash' }] },
  { label: 'Chama do queimador', fps: 12, frames: ['balloonFire0', 'balloonFire1', 'balloonFireTip'] },
  { label: 'Arma Sand Ballast', fps: 6, frames: [{ sprite: 'megaThrow', palette: 'mega' }, { sprite: 'megaThrow', palette: 'megaBalloon' }] },
  { label: 'Sand Ballast', fps: 12, frames: ['sandBag0', 'sandBag1', 'sandBag2', 'sandBag3'] },
  { label: 'Onda de areia', fps: 10, frames: ['sandWave0', 'sandWave1'] },
  { label: 'Poeira de areia / ar', fps: 8, frames: ['sandDust0', 'sandDust1', 'sandDust2', 'balloonPuff0', 'balloonPuff1', 'balloonPuff2'] },
  { label: 'Vulture Bot', fps: 6, frames: ['vulturePerch', 'vulturePerch', 'vultureUp', 'vultureDown', 'vultureUp', 'vultureDown', 'vultureDive'] },
  { label: 'Kite Bot', fps: 4, frames: ['kiteBot0', 'kiteBot1'] },
  { label: 'Balloon Mine', fps: 4, frames: ['airMine0', 'airMine1', 'airMinePellet'] },
  { label: 'Baloes (plataformas)', fps: 1, frames: ['canyonEnvelopeBlue', 'canyonEnvelopeRed', 'canyonBasket'] },
  { label: 'Retrato Balloon Man', fps: 1, frames: ['balloonFace'] },
]);
