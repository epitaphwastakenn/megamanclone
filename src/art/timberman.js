// VARIABLES

const timberHat = [
  '.......KKKKKK.......',
  '.....KKOOOOOOKK.....',
  '....KOOOOOOOOOOK....',
  '...KOOOOOOOOOOOOK...',
  '...KRRRRRRRRRRRRRK..',
  '..KOOOOOOOOOOOOOOOKK',
  '..KKKKKKKKKKKKKKKKK.',
];

const timberHair = [
  'KRRRRRRRK',
  'KRRRRRRRK',
  'KRRRRRRRK',
  'KRRRRRRRK',
  'KRRRRRRRK',
  '.KRRRRRRK',
  '..KKKKKK.',
];

const timberRing = [
  '.KKKK.',
  'KOOOOK',
  'KOKKOK',
  'KOKKOK',
  'KOOOOK',
  '.KKKK.',
];

const timberFaces = {
  normal: [
    'SSSKKKKSSK',
    'SSSSWWWKSK',
    'SSSSWWWKSK',
    'SRRSSSSSSK',
    'RRRRSKKKRK',
    'RRRRRRRRRK',
    'KKKKKKKKK.',
  ],
  blink: [
    'SSSKKKKSSK',
    'SSSSSSSSSK',
    'SSSSKKKKSK',
    'SRRSSSSSSK',
    'RRRRSKKKRK',
    'RRRRRRRRRK',
    'KKKKKKKKK.',
  ],
  shout: [
    'SSSKKKKKSK',
    'SSSSWWWKSK',
    'SSSSWWKKSK',
    'SRRSSSSSSK',
    'RRRRKKKKRK',
    'RRRRKKKKRK',
    'KKKKKKKKK.',
  ],
};

const timberTorso = [
  '.....KKKKKKKKKKKK',
  '...KKRRKROKKRROKK',
  '..KRRRRKROKKRROKK',
  '..KSSSKKKORRKKORK',
  '..KSSSKKKORRKKORK',
  '..KKKKKKKKKKOOKKK',
  '..KOOOKKRRRRRRRRK',
  '.KOOOOK.KRRRKRRRK',
  '.KOKOOK.KRRRKRRRK',
  '..KKKK.KRRRK.KRRRK',
];

const timberFrontArm = {
  side: [
    'KRRKK..',
    'KRRRRK.',
    'KKSSSK.',
    'KKSSSK.',
    'KKKKKK.',
    'KKOOOK.',
    '.KOOOOK',
    '.KOOKOK',
    '..KKKK.',
  ],
  grip: [
    'KRRKK...',
    'KRRRRK..',
    'KKSSSK..',
    'KKSSSK..',
    'KKKKKK..',
    'KKOOOOK.',
    '.KOOOOOK',
    '.KOKOKOK',
    '..KKKKK.',
  ],
  throw: [
    'KRRKKKKK.....',
    'KRRRRRRKKKK..',
    'KKSSSSSSSKOOK',
    'KKKKKKKKKOOOOK',
    '........KOKOOK',
    '.........KKKK.',
  ],
  up: [
    '.KKKK..',
    'KOOOOK.',
    'KOKOOK.',
    'KOOOOK.',
    '.KKKK..',
    '.KSSK..',
    '.KSSK..',
    '.KSSK..',
    'KSSK...',
    'KRRK...',
    'KRRK...',
    'KRRRK..',
    'KRRRK..',
    'KKKKK..',
  ],
};

const timberLegs = {
  stand: [
    '.....KOOOOK...KOOOOK....',
    '....KOOOOOK...KOOOOOK...',
    '...KOOOOOOK...KOOOOOOK..',
    '...KKKKKKKK...KKKKKKKK..',
  ],
  stride: [
    '....KOOOOK......KOOOOK..',
    '..KKOOOOK.......KOOOOOK.',
    '.KOOOOOK.......KOOOOOOK.',
    '.KKKKKK........KKKKKKKK.',
  ],
  pass: [
    '.......KOOOOKOOOOK......',
    '......KOOOOOKOOOOOK.....',
    '.....KOOOOOOKKKKKKK.....',
    '.....KKKKKKKK...........',
  ],
  jump: [
    '....KOOOOK.....KOOOOK...',
    '...KOOOOK......KOOOOOK..',
    '..KOOOOOK.......KKKKKK..',
    '..KKKKKK................',
  ],
};

const timberThighs = {
  stand: '..KKKK.KRRRK.KRRRK',
  stride: '..KKKK.KRRRKKRRRRK',
  pass: '..KKKK..KRRRRRRRK',
  jump: '..KKKK.KRRRK...KRRRK',
};

const axeUpright = [
  '.........K..',
  '........KWK.',
  '.......KWWK.',
  'KKKK..KWWWK.',
  'KOOKKKWWKWK.',
  'KOOKWWWWKWK.',
  'KOOKWWWWKWK.',
  'KOOKWWWWKWK.',
  'KOOKKKWWKWK.',
  'KKKK..KWWWK.',
  'KOOK...KWWK.',
  'KOOK....KWK.',
  'KOOK.....K..',
  'KOOK........',
  'KOOK........',
  'KOOK........',
  'KOOK........',
  'KOOK........',
  'KOOK........',
  'KKKK........',
];

const axeOverhead = [
  '.K...........',
  'KWKK.........',
  'KWWWKK.......',
  'KWKKWWK......',
  '.KWWWWWKKK...',
  '..KKWWKOOOK..',
  '....KKOOOOOK.',
  '.......KOOOOK',
  '........KOOOK',
  '.........KKK.',
];

const axeSpin = [
  '........................',
  '.....................K..',
  '....................KWK.',
  '...................KWWK.',
  '...........KKKK...KWWWK.',
  '...........KOOKKKKWWKWK.',
  '...........KOOKWWWWWKWK.',
  '...........KOOKWWWWWKWK.',
  '...........KOOKWWWWWKWK.',
  '...........KOOKKKKWWKWK.',
  '...........KKKK...KWWWK.',
  '...........KOOK....KWWK.',
  '...........KOOK.....KWK.',
  '...........KOOK......K..',
  '...........KOOK.........',
  '...........KOOK.........',
  '...........KOOK.........',
  '...........KOOK.........',
  '...........KOOK.........',
  '...........KOOK.........',
  '...........KOOK.........',
  '...........KOOK.........',
  '...........KKKK.........',
  '........................',
];

const axeSmall = [
  '..........K...',
  '.........KWK..',
  '....KKK.KWWK..',
  '....KOKKWWKWK.',
  '....KOKWWWKWK.',
  '....KOKKWWKWK.',
  '....KKK.KWWK..',
  '....KOK..KWK..',
  '....KOK...K...',
  '....KOK.......',
  '....KOK.......',
  '....KOK.......',
  '....KKK.......',
  '..............',
];

const timberFaceHalf = [
  '................',
  '..........OOOOOO',
  '........OOOOOOOO',
  '.......OOOOOOOOO',
  '......OOOOOOOOOO',
  '.....OOOOOOOOOOO',
  '.....OOOOOOOOOOO',
  '.....RRRRRRRRRRR',
  '.....RRRRRRRRRRR',
  '...OOOOOOOOOOOOO',
  '..OOOOOOOOOOOOOO',
  '................',
  '....RRRKSSSSSSSS',
  '.KKKKRRKSSSSSSSS',
  'KOOOOKRKSRRRRRSS',
  'KOKKOKRKSWWWWKSS',
  'KOKKOKRKSWWKKKSS',
  'KOOOOKRKSWWKKKSS',
  '.KKKKRRKSSSSSSSS',
  '...RRRRRSSSSSSSq',
  '...RRRRRRSSSSSSq',
  '...RRRRRRRRSSSSS',
  '...RRRRRRRRRRRRR',
  '...RRRRRRRRRKKKK',
  '....RRRRRRRRRRRR',
  '....RRRRRRRRRRRR',
  '.....RRRRRRRRRRR',
  '......RRRRRRRRRR',
  '..OOOO..KRRRRRRR',
  '.ORROOO...KRRRRR',
  'OORRKRRO....KRRR',
  'ORRKRRROO.....KR',
];

// FUNCTIONS

function buildTimber(options) {
  const legs = options.legs || 'stand';
  const parts = [];
  parts.push([timberTorso, 0, 13]);
  parts.push([[timberThighs[legs]], 0, 22]);
  parts.push([timberLegs[legs], 0, 23]);
  parts.push([timberHair, 2, 7]);
  parts.push([timberRing, 3, 7]);
  parts.push([timberFaces[options.face || 'normal'], 10, 7]);
  parts.push([timberHat, 1, 0]);
  const arm = options.arm || 'side';
  if (options.axe === 'overhead') parts.push([axeOverhead, 6, -8]);
  if (arm === 'up') parts.push([timberFrontArm.up, 18, 0]);
  else if (arm === 'throw') parts.push([timberFrontArm.throw, 16, 14]);
  else parts.push([timberFrontArm[arm], 16, 14]);
  if (options.axe === 'upright') parts.push([axeUpright, 21, 6]);
  if (arm === 'grip') parts.push([['KOOOOOK', '.KOKOKOK'], 17, 20]);
  const top = options.axe === 'overhead' ? 9 : 0;
  return composeArt(34, 27 + top, parts.map(([rows, dx, dy]) => [rows, dx, dy + top]));
}

// VARIABLES

const bossArt = {
  timberStand: { ox: 12, rows: trimRight(buildTimber({ arm: 'grip', axe: 'upright' })) },
  timberBlink: { ox: 12, rows: trimRight(buildTimber({ arm: 'grip', axe: 'upright', face: 'blink' })) },
  timberStandX: { ox: 12, rows: trimRight(buildTimber({})) },
  timberRun1: { ox: 12, rows: trimRight(buildTimber({ arm: 'grip', axe: 'upright', legs: 'stride' })) },
  timberRun2: { ox: 12, rows: trimRight(buildTimber({ arm: 'grip', axe: 'upright', legs: 'pass' })) },
  timberRun1X: { ox: 12, rows: trimRight(buildTimber({ legs: 'stride' })) },
  timberRun2X: { ox: 12, rows: trimRight(buildTimber({ legs: 'pass' })) },
  timberJump: { ox: 12, rows: trimRight(buildTimber({ arm: 'grip', axe: 'upright', legs: 'jump', face: 'shout' })) },
  timberJumpX: { ox: 12, rows: trimRight(buildTimber({ arm: 'up', legs: 'jump', face: 'shout' })) },
  timberPose: { ox: 12, rows: trimRight(buildTimber({ arm: 'up', axe: 'overhead', face: 'shout' })) },
  timberThrow: { ox: 12, rows: trimRight(buildTimber({ arm: 'throw', face: 'shout' })) },
};

bossArt.timberFace = { ox: 0, oy: 0, rows: mirrorArt(timberFaceHalf) };

let spinFrame = axeSpin;
let smallFrame = axeSmall;
for (let i = 0; i < 4; i++) {
  bossArt['axe' + i] = { oy: 12, rows: spinFrame };
  bossArt['axeSmall' + i] = { ox: 7, oy: 7, rows: smallFrame };
  spinFrame = rotateArt(spinFrame);
  smallFrame = rotateArt(smallFrame);
}
