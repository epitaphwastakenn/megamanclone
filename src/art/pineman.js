// VARIABLES

const pineBody = [
  '............KK...............',
  '...........KWWK..............',
  '..........KWWWWK.............',
  '.........KgWWWWgK............',
  '........KgggWWgggK...........',
  '.......KggggggggggK..........',
  '........KKgKKgKKKK...........',
  '.........KWWWWWWK............',
  '........KWWWWWWggK...........',
  '.......KgWWggWggggK..........',
  '......KggggggggggggK.........',
  '.....KggggggggggggggK........',
  '......KKKgKKgKKgKKKK.........',
  '.......KWWWWWWWWWWKKK........',
  '......KgWWWWggKKKKSSKK.......',
  '.....KggggggKKSSSSSSKK.......',
  '.....KgKgggKSSSSSWWKSK.......',
  '......KgKgKKSSSSWWWKSK.......',
  '.......KKKKKSSSSSWWKSK.......',
  '....KKKKWWKKKSSSSSSSSK.......',
  '...KWWWWWWKgKKKSSKKKKKKK.....',
  '..KWWWWWWKggWWKKKKWgKWWWWK...',
  '..KgWWWWKgggKWWWWWKggKWWWWK..',
  '.KgggKKKgggggKWWWKgggKKWWgK..',
  '.KggggK.KgggggKKKgggggKKggK..',
  '.KWWWWK..KKgggggggggKKKWWWWK.',
  '.KWWKWK.KgKKKKKKKKKKgKKWKWWK.',
  '..KKKK.KgggK.......KgggKKKK..',
  '......KWWWWK.......KWWWWK....',
  '.....KWWWWWWK.....KWWWWWWK...',
  '....KKgggggggK...KgggggggKK..',
  '..KKgggggggggK...KgggggggggK.',
  '.KgggggggggggK...KgggggggggK.',
  '.KKKKKKKKKKKKK...KKKKKKKKKKK.',
];

const pineCone = [
  '..KKK..',
  '.KOoOK.',
  'KoKoKoK',
  'KOoOoOK',
  'KoKoKoK',
  '.KOoOK.',
  '..KoK..',
  '...K...',
];

const pineArmUp = [
  '..KKK..',
  '.KOoOK.',
  'KoKoKoK',
  'KOoOoOK',
  'KoKoKoK',
  'KKKKKKK',
  'KWWWWWK',
  'KWKWKWK',
  '.KWWWK.',
  '.KgggK.',
  '.KgggK.',
  '.KgggK.',
  'KKgggKK',
];

const pineArmThrow = [
  'KKKKKK..........',
  'KWWWWKKKKKKKK...',
  'KWWWWKgggggKWWK.',
  'KKWWgKgggggKWWWK',
  '.KKggKKKKKKKWWWK',
  '..KKK......KKKK.',
];

const pineLegs = {
  jump: [
    '..KKKK.KgggK.......KgggKKKK..',
    '......KWWWWK......KWWWWK.....',
    '.....KWWWWWWK....KWWWWWWK....',
    '.....KgggggggK...KgggggggK...',
    '......KggggggK....KgggggggK..',
    '.......KKKKKKK.....KgggggK...',
    '....................KKKKK....',
  ],
  skate: [
    '..KKKK.KgggKK......KgggKKKK..',
    '......KWWWWWK.....KWWWWK.....',
    '.....KWWWWWK.....KWWWWWWK....',
    '...KKgggggK......KgggggggK...',
    '.KKggggggK.......KggggggggK..',
    'KgggggggK........KgggggggggK.',
    'KKKKKKKKK........KKKKKKKKKKK.',
  ],
};

const pineFaces = {
  blink: [['SSS', 'KKKK', 'SSS'], 16, 16],
  brow: [['KKK'], 16, 15],
  mouth: [['SKKK'], 16, 19],
};

const needleStraight = [
  '.KKKKKKKKK..',
  'KhhhhhhhhWWK',
  'KgggggggggWK',
  '.KKKKKKKKKK.',
];

const needleDiagonal = [
  'KKK.....',
  'KhhK....',
  'KghhK...',
  '.KghhK..',
  '..KghhK.',
  '...KghWK',
  '....KWWK',
  '.....KKK',
];

const pineFaceHalf = [
  '...............W',
  '..............WW',
  '.............gWW',
  '............gggW',
  '...........ggggg',
  '..........gggggg',
  '............WWWW',
  '...........gWWWW',
  '..........gggWWW',
  '.........ggggggW',
  '........gggggggg',
  '..........WWWWWW',
  '.........gWWWWWW',
  '........gggWWWWW',
  '.......ggggggWWW',
  '......gggggggggg',
  '......gggKKKKKKK',
  '.....gggKSSSSSSS',
  '.....gggKSSSSSSS',
  '.....gggKSKKKKSS',
  '.....gggKSWWWWKS',
  '.....gggKSWWKKKS',
  '.....gggKSWWKKKS',
  '......ggKSSSSSSq',
  '......ggKSSSSSSq',
  '.......gKSSSSKKK',
  '........KKSSSSSS',
  '.........KKKSSSS',
  '..WWWWW...KKKKKK',
  '.WWWWWWWW.KgggWW',
  'WWWWWWWWWKggggWW',
  'WWWWWWWWKgggggWW',
];

// FUNCTIONS

function clearArt(width, height) {
  return new Array(height).fill('_'.repeat(width));
}

function buildPine(parts, width) {
  return composeArt(width || pineBody[0].length, pineBody.length, [[pineBody, 0, 0], ...parts]);
}

function lowerArmClear() {
  return [[clearArt(6, 4), 23, 24], [['K', 'K', 'K'], 22, 24]];
}

function legsSwap(legs) {
  return [[clearArt(29, 7), 0, 27], [pineLegs[legs], 0, 27]];
}

// VARIABLES

const pineArt = {
  pineStand: { ox: 13, rows: buildPine([[pineCone, 22, 25]]) },
  pineBlink: { ox: 13, rows: buildPine([[pineCone, 22, 25], pineFaces.blink]) },
  pineStandX: { ox: 13, rows: buildPine([]) },
  pinePose: { ox: 13, rows: trimRight(buildPine([...lowerArmClear(), [pineArmUp, 22, 8], pineFaces.brow, pineFaces.mouth])) },
  pineThrow: { ox: 13, rows: trimRight(buildPine([...lowerArmClear(), [pineArmThrow, 20, 20], pineFaces.brow, pineFaces.mouth], 36)) },
  pineJump: { ox: 13, rows: buildPine([...legsSwap('jump'), pineFaces.brow, pineFaces.mouth]) },
  pineSkate: { ox: 13, rows: buildPine([...legsSwap('skate'), pineFaces.brow]) },
  needleRight: { ox: 6, oy: 2, rows: needleStraight },
  needleDown: { ox: 2, oy: 6, rows: rotateArt(needleStraight) },
  needleUp: { ox: 2, oy: 6, rows: rotateArt(rotateArt(rotateArt(needleStraight))) },
  needleDownRight: { ox: 4, oy: 4, rows: needleDiagonal },
  needleUpRight: { ox: 4, oy: 4, rows: rotateArt(rotateArt(rotateArt(needleDiagonal))) },
  pineFace: { ox: 0, oy: 0, rows: mirrorArt(pineFaceHalf) },
};

let coneFrame = pineCone;
for (let i = 0; i < 4; i++) {
  const width = Math.max(...coneFrame.map(row => row.length));
  pineArt['cone' + i] = { ox: Math.floor(width / 2), oy: Math.floor(coneFrame.length / 2), rows: coneFrame };
  coneFrame = rotateArt(coneFrame);
}
