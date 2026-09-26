// VARIABLES

const timberHead = [
  '......KKKKKK......',
  '....KKGGGGGGKK....',
  '...KGWWGGGGGGGK...',
  '..KGWGGGGGGGGGGK..',
  '..KGGGGGGGGGGGGGK.',
  '.KRRRRRRRRRRRRRRRK',
  '.KDDDKKKKKKKKKKKK.',
  '.KGDGKSSSSWWKSK...',
  '.KGDGKSSSSWKKSK...',
  '.KGDGKSSSSSSSSK...',
  '.KGDGKSSDDDDDDK...',
  '..KGGKSDKDKDKDK...',
  '...KKKKKKKKKKK....',
];

const timberTorso = [
  '........KKKKKKKKKK........',
  '.......KRRrRRrRRrRK.......',
  '.......KRrRRrRRrRRK.......',
  '.......KRRrRRrRRrRK.......',
  '.......KrrrrrrrrrrK.......',
  '.......KRRrRRrRRrRK.......',
  '.......KRrRRrRRrRRK.......',
  '.......KKKKKYYKKKKK.......',
  '.......KDDDKYYKDDDK.......',
  '.......KDDDDDDDDDDK.......',
  '........KDDDKKDDDK........',
];

const timberArmDown = [
  '..KKKK.',
  '.KGWGGK',
  'KGWGGGK',
  'KGGGGGK',
  '.KKKKK.',
  '.KRRRK.',
  '.KRrRK.',
  '.KRRRK.',
  'KGGGGK.',
  'KGWGGK.',
  'KGGGGK.',
  '.KKKK..',
];

const timberArmForward = [
  '.KKKK.........',
  'KGGWGK........',
  'KGGGGKKKKK....',
  'KGGGGKRRrRKKK.',
  '.KKKKKRRrRKGGK',
  '.....KKKKKKGWGK',
  '..........KGGK',
  '...........KK.',
];

const timberArmUp = [
  '...KKKK..',
  '..KGGGGK.',
  '..KGWGGK.',
  '..KGGGGK.',
  '...KKKK..',
  '...KRRK..',
  '...KRrK..',
  '..KRRrK..',
  '.KRRRK...',
  'KKKKKKK..',
  'KGGWGGK..',
  'KGGGGGK..',
  '.KKKKK...',
];

const timberLegsStand = [
  '.......KGGGGK..KGGGGK.....',
  '......KGGGGK....KGGGGK....',
  '......KDDDDK....KDDDDK....',
  '.....KDDDDDK....KDDDDDK...',
  '....KDGGDDDK....KDGGDDDK..',
  '...KDDDDDDDK....KDDDDDDDK.',
  '...KDDDDDDDK....KDDDDDDDK.',
  '...KKKKKKKKK....KKKKKKKKK.',
];

const timberLegsStride = [
  '.......KGGGGKKGGGGK.......',
  '.....KKGGGGK..KGGGGK......',
  '...KKDDDDKK....KDDDDK.....',
  '..KDDDDDK.......KDDDDK....',
  '.KDGGDDK.......KDGGDDDK...',
  'KDDDDDK........KDDDDDDDK..',
  'KDDDDK.........KDDDDDDDK..',
  '.KKKK..........KKKKKKKKK..',
];

const timberLegsPass = [
  '........KGGGGKGGGGK.......',
  '........KGGGGKGGGGK.......',
  '.......KDDDDKKDDDDK.......',
  '.......KDDDDKKDDDDDK......',
  '......KDGGDDKKDGGDDDK.....',
  '.......KDDDDDKDDDDDDK.....',
  '........KKKKKKDDDDDDK.....',
  '.............KKKKKKKK.....',
];

const timberLegsJump = [
  '.......KGGGGKKGGGGKK......',
  '......KGGGGK.KGGGGGDK.....',
  '.....KDDDDK...KKDDDDDK....',
  '....KDDDDDK.....KDGGDK....',
  '...KDGGDDK......KDDDDK....',
  '...KDDDDDK.......KKKK.....',
  '....KDDDDK................',
  '.....KKKK.................',
];

const timberAxe = [
  '...KKKKK........',
  '..KWWWWWK.......',
  '.KWGGGGWWK......',
  'KWGGGGGGWK......',
  'KWGGGGGGGKK.....',
  'KWGGGGGGKoNK....',
  '.KWGGGGKoNK.....',
  '..KKWWKoNK......',
  '....KKoNK.......',
  '.....KoNK.......',
  '....KoNK........',
  '...KoNK.........',
  '..KoNK..........',
  '..KKK...........',
];

const timberAxeSpin = composeArt(16, 16, [[timberAxe.slice(0, 13).map(row => row.slice(0, 12)), 2, 1]]);

// FUNCTIONS

function buildTimber(options) {
  const parts = [];
  if (options.axe === 'back') parts.push([timberAxe, 0, -2]);
  parts.push([options.backArm || timberArmDown, 2, 13]);
  parts.push([timberTorso, 0, 13]);
  parts.push([options.legs || timberLegsStand, 0, 24]);
  parts.push([timberHead, 4, 0]);
  const front = options.frontArm || 'down';
  if (front === 'down') parts.push([timberArmDown.map(row => row.split('').reverse().join('')), 17, 13]);
  if (front === 'forward') parts.push([timberArmForward, 17, 13]);
  if (front === 'up') parts.push([timberArmUp, 18, 1]);
  if (options.axe === 'raised') parts.push([rotateArt(rotateArt(rotateArt(timberAxe))), 16, -1]);
  return composeArt(32, 32, parts.map(([rows, dx, dy]) => [rows, dx, dy + 2])).map(row => row.slice(0, 32));
}

// VARIABLES

const bossArt = {};

for (const [suffix, axe] of [['', 'back'], ['X', 'none']]) {
  bossArt['timberStand' + suffix] = { ox: 13, rows: buildTimber({ axe }) };
  bossArt['timberRun1' + suffix] = { ox: 13, rows: buildTimber({ axe, legs: timberLegsStride }) };
  bossArt['timberRun2' + suffix] = { ox: 13, rows: buildTimber({ axe, legs: timberLegsPass }) };
  bossArt['timberJump' + suffix] = { ox: 13, rows: buildTimber({ axe, legs: timberLegsJump, frontArm: 'up' }) };
}
bossArt.timberThrow = { ox: 13, rows: buildTimber({ axe: 'none', frontArm: 'forward' }) };
bossArt.timberPose = { ox: 13, rows: buildTimber({ axe: 'raised', frontArm: 'up' }) };

let spinFrame = timberAxeSpin;
for (let i = 0; i < 4; i++) {
  bossArt['axe' + i] = { oy: 8, rows: spinFrame };
  spinFrame = rotateArt(spinFrame);
}
