// FUNCTIONS

function recolorArt(rows, map) {
  return rows.map(row => row.split('').map(ch => map[ch] || ch).join(''));
}

function rotateArt(rows) {
  const height = rows.length;
  const width = Math.max(...rows.map(row => row.length));
  const result = [];
  for (let x = 0; x < width; x++) {
    let line = '';
    for (let y = height - 1; y >= 0; y--) line += rows[y][x] || '.';
    result.push(line);
  }
  return result;
}

// VARIABLES

const cutColors = { B: 'R', C: 'O' };

const cutScissors = [
  'KK........KK',
  'KWK......KWK',
  'KWGK....KGWK',
  '.KWGK..KGWK.',
  '..KWGKKGWK..',
  '...KWGGWK...',
  '...KKWWKK...',
  '..KOOKKOOK..',
  '..KOKKKKOK..',
  '..KKK..KKK..',
];

const cutHeadBase = recolorArt([
  '.........KKKKK..........',
  '.......KKBBBBBKK........',
  '......KBBBBBBBBBK.......',
  '.....KBBCCBBBBBBBK......',
  '.....KBBCCBBBBBBBBK.....',
  '....KBBBBBBBBBBBBBK.....',
  '....KBBBBBBKKKKKKKK.....',
  '....KBBBBBSKWWKSKWK.....',
  '....KBBBBBSSKWKSSKK.....',
  '....KBBBBBSSSSSSSSK.....',
  '.....KBBBBSSSSSKKSK.....',
  '......KKBBBSSSSSSK......',
], cutColors);

const cutTorsoStand = recolorArt(torsoStand, cutColors);
const cutTorsoRun = recolorArt(torsoRunWide, cutColors);
const cutTorsoMid = recolorArt(torsoRunMid, cutColors);
const cutTorsoJump = recolorArt(torsoJump, cutColors);
const cutTorsoThrow = recolorArt([
  '.......KKKKKKKKKK.......',
  '.....KKCCCCCCCCCCKKKKK..',
  '....KCCCKCCCCCCCCCCCBBK.',
  '...KBBCCKCCCCCCKKKKKBBBK',
  '...KBBBKKBBBBBBKK..KBBK.',
  '...KBBBK.KBBBBK.....KK..',
], cutColors);
const cutLegsStand = recolorArt(legsStand, cutColors);
const cutLegsRun = recolorArt(legsRunWide, cutColors);
const cutLegsPass = recolorArt(legsRunPass, cutColors);
const cutLegsMid = recolorArt(legsRunMid, cutColors);
const cutLegsJump = recolorArt(legsJump, cutColors);
const cutJumpArm = recolorArt(jumpBack, cutColors);

const cutterFrame = composeArt(16, 16, [[cutScissors, 2, 3]]);
const cutterFrames = [cutterFrame];
for (let i = 1; i < 4; i++) cutterFrames.push(rotateArt(cutterFrames[i - 1]));

function buildCutMan(torso, legs, withCutter, extra) {
  const parts = [];
  if (extra) parts.push([extra, 0, 8]);
  parts.push([cutHeadBase, 0, 8]);
  if (withCutter) parts.push([cutScissors, 6, 0]);
  parts.push([torso, 0, 20]);
  parts.push([legs, 0, 26]);
  return composeArt(24, 32, parts);
}

const bossArt = {};

for (const variant of [['', true], ['X', false]]) {
  const suffix = variant[0];
  const withCutter = variant[1];
  bossArt['cutStand' + suffix] = { ox: 12, rows: buildCutMan(cutTorsoStand, cutLegsStand, withCutter) };
  bossArt['cutRun1' + suffix] = { ox: 12, rows: buildCutMan(cutTorsoRun, cutLegsRun, withCutter) };
  bossArt['cutRun2' + suffix] = { ox: 12, rows: buildCutMan(cutTorsoMid, cutLegsPass, withCutter) };
  bossArt['cutRun3' + suffix] = { ox: 12, rows: buildCutMan(cutTorsoMid, cutLegsMid, withCutter) };
  bossArt['cutJump' + suffix] = { ox: 12, rows: composeArt(24, 34, [[cutJumpArm, 0, 8], [cutHeadBase, 0, 10], ...(withCutter ? [[cutScissors, 6, 2]] : []), [cutTorsoJump, 0, 22], [cutLegsJump, 0, 27]]) };
  bossArt['cutThrow' + suffix] = { ox: 12, rows: buildCutMan(cutTorsoThrow, cutLegsStand, withCutter) };
}

for (let i = 0; i < 4; i++) bossArt['cutter' + i] = { oy: 8, rows: cutterFrames[i] };
