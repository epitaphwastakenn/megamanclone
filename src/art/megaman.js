// FUNCTIONS

function composeArt(width, height, parts) {
  const grid = [];
  for (let y = 0; y < height; y++) grid.push(new Array(width).fill('.'));
  for (const [rows, dx, dy] of parts) {
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === '.') continue;
        const gx = x + dx;
        const gy = y + dy;
        if (gx < 0 || gy < 0 || gx >= width || gy >= height) continue;
        grid[gy][gx] = ch === '_' ? '.' : ch;
      }
    }
  }
  return grid.map(row => row.join(''));
}

// VARIABLES

const megaHead = [
  '.........KKKKK..........',
  '.......KKBBBCCKK........',
  '......KBBBBBCCCBK.......',
  '.....KBBBBBBCCCBBK......',
  '.....KBBBBBBBCCBBBK.....',
  '....KBBBBBBBBBBBBBK.....',
  '....KBBBBBBSSSSSSSK.....',
  '....KBBBBBSWWKSSWKK.....',
  '....KBBBBBSWWKSSWKK.....',
  '....KBBBBBSSSSSSSSK.....',
  '.....KBBBBSSSSSKKSK.....',
  '......KKBBBSSSSSSK......',
];

const megaHeadBlink = composeArt(24, 12, [
  [megaHead, 0, 0],
  [['..........SSSSSSSS', '..........SKKKSSKK'], 0, 7],
]);

const megaHeadHurt = composeArt(24, 12, [
  [megaHead, 0, 0],
  [[
    '..........SKSSSSKS',
    '..........SSKSSKSK',
    '..........SKSSSSKS',
    '..........SSSSKKKS',
  ], 0, 7],
]);

const megaHeadShout = composeArt(24, 12, [
  [megaHead, 0, 0],
  [['..........SSSSSKKK', '..........SSSSKKKS'], 0, 9],
]);

const megaHeadBack = [
  '.....KKKKKK.....',
  '...KKBBCCBBKK...',
  '..KBBBBCCBBBBK..',
  '.KBBBBBCCBBBBBK.',
  '.KBBBBBCCBBBBBK.',
  'KBBBBBBCCBBBBBBK',
  'KBBBBBBBBBBBBBBK',
  'KBBBBBBBBBBBBBBK',
  'KBBBBBBBBBBBBBBK',
  '.KBBBBBBBBBBBBK.',
  '..KKBBBBBBBBKK..',
  '....KKKKKKKK....',
];

const torsoStand = [
  '.......KKKKKKKKKK.......',
  '.....KKCCCCCCCCCCKK.....',
  '....KCCCKCCCCCCKCCCK....',
  '...KBBCCKCCCCCCKCCBBK...',
  '...KBBBKKBBBBBBKKBBBK...',
  '...KBBBK.KBBBBK.KBBBK...',
];

const torsoStep = [
  '.......KKKKKKKKKK.......',
  '......KCCCCCCCCCCK......',
  '.....KCCKCCCCCCKCCK.....',
  '.....KBBKCCCCCCKBBK.....',
  '.....KBBKBBBBBBKBBK.....',
  '......KKKBBBBBBKKK......',
];

const torsoRunWide = [
  '.......KKKKKKKKKK.......',
  '.....KKCCCCCCCCCCK......',
  '...KKCCCKCCCCCCKCKK.....',
  '..KBBKKKKCCCCCCKCCCK....',
  '..KBBBK.KBBBBBBKKBBBK...',
  '...KKK..KBBBBBBK.KBBBK..',
];

const torsoRunMid = [
  '.......KKKKKKKKKK.......',
  '......KCCCCCCCCCCKK.....',
  '.....KCCKCCCCCCKCCCK....',
  '....KBBBKCCCCCCKKBBK....',
  '....KBBBKBBBBBBKBBBK....',
  '.....KKKKBBBBBBKKKK.....',
];

const torsoShoot = [
  '.......KKKKKKKKKK...............',
  '.....KKCCCCCCCCCKKKKKKKKK.......',
  '....KCCCKCCCCCCCCCCCKBBBBK......',
  '...KBBCCKCCCCCCKCCCCKBBBBBKK....',
  '...KBBBKKBBBBBBKKKKKKBBBBBK.....',
  '...KBBBK.KBBBBK.....KKKKKK......',
];

const legsStand = [
  '....KKKKCCCKKCCCKKKK....',
  '......KCCCK..KCCCK......',
  '.....KBBBBK..KBBBBK.....',
  '....KBBBBBK..KBBBBBK....',
  '...KBBBBBBK..KBBBBBBK...',
  '...KKKKKKKK..KKKKKKKK...',
];

const legsStep = [
  '.......KCCCKKCCCK.......',
  '.......KCCCKKCCCK.......',
  '......KBBBBKKBBBBK......',
  '......KBBBBBKBBBBBK.....',
  '......KBBBBBKBBBBBBK....',
  '......KKKKKKKKKKKKKK....',
];

const legsRunWide = [
  '.......KCCCCKKCCCCK.....',
  '.....KKCCCCK..KCCCCK....',
  '..KKKBBKKKK....KCCCCK...',
  '.KBBBBBBK.....KBBBBBK...',
  '..KBBBBK.....KBBBBBBBK..',
  '...KKKK......KKKKKKKKK..',
];

const legsRunPass = [
  '........KCCCCKCCCCK.....',
  '........KCCCKKCCCCK.....',
  '.......KBBBBKKBBBBBK....',
  '.......KBBBBKKKBBBBBK...',
  '........KBBBK.KKKKKKK...',
  '.........KKK............',
];

const legsRunMid = [
  '.......KCCCCKKCCCCK.....',
  '......KCCCCK.KCCCCK.....',
  '....KKBBBBK...KBBBBK....',
  '...KBBBBBK...KBBBBBBK...',
  '...KBBBBK....KBBBBBBBK..',
  '....KKKK.....KKKKKKKKK..',
];

const jumpBack = [
  '..KKKK..................',
  '.KBBBBK.................',
  '.KBBBBK.................',
  '.KBBBBK.................',
  '..KCCK..................',
  '..KCCK..................',
  '..KCCK..................',
  '..KCCK..................',
];

const torsoJump = [
  '......KKKKKKKKKKK.......',
  '.....KCCCCCCCCCCCKK.....',
  '....KCCKCCCCCCCKCCCK....',
  '....KCCKCCCCCCCKCBBBK...',
  '.....KKKBBBBBBBKBBBBK...',
  '.......KBBBBBBBKKBBK....',
];

const legsJump = [
  '......KCCCCKCCCCCKK.....',
  '.....KCCCCK.KCCCCCCK....',
  '....KBBBBK...KKCCCCK....',
  '...KBBBBK.....KBBBBBK...',
  '..KBBBBK......KBBBBBBK..',
  '..KBBBBK......KBBBBBBK..',
  '...KKKK........KKKKKKK..',
];

const torsoJumpShoot = [
  '......KKKKKKKKKKK...............',
  '.....KCCCCCCCCCCKKKKKKKKK.......',
  '....KCCKCCCCCCCCCCCCKBBBBK......',
  '....KCCKCCCCCCKCCCCCKBBBBBKK....',
  '.....KKKBBBBBBKKKKKKKBBBBK......',
  '.......KBBBBBBBK....KKKKK.......',
];

const climbArmUp = [
  '..........KKKK..',
  '.........KBBBBK.',
  '.........KBBBBK.',
  '.........KBBBBK.',
  '..........KCCK..',
  '..........KCCK..',
];

const torsoClimb = [
  '..KKKKKKKKKKCK..',
  '.KCCCCCCCCCCCCK.',
  'KCCKCCCCCCCCKCK.',
  'KBBKCCCCCCCCKK..',
  'KBBKBBBBBBBBK...',
  'KBBKBBBBBBBBK...',
  '.KKKCCCKKCCCK...',
];

const legsClimb = [
  '...KCCCK.KCCCK..',
  '...KCCCK.KBBBBK.',
  '..KBBBBK.KBBBBK.',
  '..KBBBBK..KKKK..',
  '..KBBBBK........',
  '..KBBBBK........',
  '...KKKK.........',
];

const climbTopRows = composeArt(18, 21, [
  [[
    '.KKK............KKK',
    'KBBBK..........KBBBK',
    'KBBBK..........KBBBK',
    'KBBBKK........KKBBBK',
    '.KKCCK........KCCKK.',
    '...KCCK......KCCK...',
  ], -1, 7],
  [megaHeadBack, 1, 0],
  [[
    '...KKCCCCCCCCKK...',
    '..KCCCCCCCCCCCCK..',
    '..KBBBBBBBBBBBBK..',
    '...KCCCKKKKCCCK...',
    '..KBBBBK..KBBBBK..',
    '.KBBBBBK..KBBBBBK.',
    '.KKKKKKK..KKKKKKK.',
  ], 0, 12],
]);

const climbShootRows = composeArt(28, 29, [
  [megaHead, 0, 3],
  [[
    '.......KKKKKKKKKK...........',
    '.....KKCCCCCCCCCCKKKKKKKK...',
    '....KCCCKCCCCCCCCCCCCKBBBBK.',
    '...KBBCCKCCCCCCCCCCCCKBBBBBK',
    '...KBBBKKBBBBBBKKKKKKKBBBBBK',
    '...KBBBK.KBBBBK......KKKKKK.',
    '....KKKKCCCKKCCCKK..........',
  ], 0, 15],
  [[
    '.......KCCCK.KCCCK',
    '.......KBBBK.KBBBBK',
    '......KBBBBK..KKKK.',
    '......KBBBBK.......',
    '......KBBBBK.......',
    '.......KKKK........',
  ], 0, 22],
]);

const slideRows = composeArt(29, 18, [
  [megaHead, 0, 0],
  [[
    '......KKKKKKKKKKK............',
    '..KKKKCCCCCCCCCCCK...........',
    '.KBBBKCCCCCCCCCCCCKKKK..KKK..',
    '.KBBBKBBBBBBBBKCCCCCCCKKBBBK.',
    '.KBBBKKKBBBBBKKCCCCCCCKBBBBBK',
    '..KKK..KKKKKKK.KKKKKKKKKKKKK.',
  ], 0, 12],
]);

const hurtRows = composeArt(26, 26, [
  [[
    '.KKKK................KKKK.',
    'KBBBBK..............KBBBBK',
    'KBBBBK..............KBBBBK',
    'KBBBBK..............KBBBBK',
    '.KCCK................KCCK.',
    '.KCCK................KCCK.',
    '..KCCK..............KCCK..',
    '...KCCK............KCCK...',
  ], 0, 6],
  [megaHeadHurt, 1, 1],
  [[
    '........KKKKKKKKKK........',
    '......KKCCCCCCCCCCKK......',
    '.....KCCKCCCCCCCCKCCK.....',
    '......KKKBBBBBBBBKKK......',
    '........KBBBBBBBBK........',
    '.......KCCCKKKKCCCK.......',
    '......KCCCK....KCCCK......',
    '.....KBBBBK....KBBBBK.....',
    '....KBBBBBK....KBBBBBK....',
    '....KBBBBBK....KBBBBBK....',
    '....KKKKKKK....KKKKKKK....',
  ], 0, 15],
]);

const beamRows = [];
beamRows.push('..KK..');
beamRows.push('.KCCK.');
for (let i = 0; i < 28; i++) beamRows.push(i % 4 < 2 ? 'KBCCBK' : 'KCBBCK');
beamRows.push('.KCCK.');
beamRows.push('..KK..');

const teleportARows = [
  '......KKKKKKK.......',
  '....KKCCCCCCCKK.....',
  '...KCCBBBBBBBCCK....',
  '..KCBBKKKKKKKBBCK...',
  '..KCBK.......KBCK...',
  '..KCBK.......KBCK...',
  '.KCBBK.......KBBCK..',
  '.KCBK.........KBCK..',
  '.KKKK.........KKKK..',
];

const teleportBRows = composeArt(24, 24, [
  [megaHead.slice(0, 6), 0, 4],
  [[
    '....KBBBBBBBBBBBBBK.....',
    '...KCCKKKKKKKKKKKCCK....',
    '..KBBBK.........KBBBK...',
    '..KBBBK.........KBBBK...',
    '...KKK...........KKK....',
  ], 0, 10],
  [legsStand.slice(2), 0, 20],
]);

const megaArt = {
  megaStand: { ox: 12, rows: composeArt(24, 24, [[megaHead, 0, 0], [torsoStand, 0, 12], [legsStand, 0, 18]]) },
  megaBlink: { ox: 12, rows: composeArt(24, 24, [[megaHeadBlink, 0, 0], [torsoStand, 0, 12], [legsStand, 0, 18]]) },
  megaStep: { ox: 12, rows: composeArt(24, 24, [[megaHead, 0, 0], [torsoStep, 0, 12], [legsStep, 0, 18]]) },
  megaRun1: { ox: 12, rows: composeArt(24, 24, [[megaHead, 0, 0], [torsoRunWide, 0, 12], [legsRunWide, 0, 18]]) },
  megaRun2: { ox: 12, rows: composeArt(24, 24, [[megaHead, 0, 0], [torsoRunMid, 0, 12], [legsRunPass, 0, 18]]) },
  megaRun3: { ox: 12, rows: composeArt(24, 24, [[megaHead, 0, 0], [torsoRunMid, 0, 12], [legsRunMid, 0, 18]]) },
  megaShoot: { ox: 12, rows: composeArt(32, 24, [[megaHead, 0, 0], [torsoShoot, 0, 12], [legsStand, 0, 18]]) },
  megaRunShoot1: { ox: 12, rows: composeArt(32, 24, [[megaHead, 0, 0], [torsoShoot, 0, 12], [legsRunWide, 0, 18]]) },
  megaRunShoot2: { ox: 12, rows: composeArt(32, 24, [[megaHead, 0, 0], [torsoShoot, 0, 12], [legsRunPass, 0, 18]]) },
  megaRunShoot3: { ox: 12, rows: composeArt(32, 24, [[megaHead, 0, 0], [torsoShoot, 0, 12], [legsRunMid, 0, 18]]) },
  megaJump: { ox: 12, rows: composeArt(24, 27, [[jumpBack, 0, 0], [megaHeadShout, 0, 2], [torsoJump, 0, 14], [legsJump, 0, 20]]) },
  megaJumpShoot: { ox: 12, rows: composeArt(32, 27, [[jumpBack, 0, 0], [megaHeadShout, 0, 2], [torsoJumpShoot, 0, 14], [legsJump, 0, 20]]) },
  megaClimb: { ox: 8, rows: composeArt(16, 30, [[climbArmUp, 0, 0], [megaHeadBack, 0, 4], [torsoClimb, 0, 16], [legsClimb, 0, 23]]) },
  megaClimbShoot: { ox: 12, rows: climbShootRows },
  megaClimbTop: { ox: 8, rows: climbTopRows },
  megaSlide: { ox: 14, rows: slideRows },
  megaHurt: { ox: 13, rows: hurtRows },
  megaBeam: { ox: 3, rows: beamRows },
  megaTeleportA: { ox: 10, rows: teleportARows },
  megaTeleportB: { ox: 12, rows: teleportBRows },
};
