// VARIABLES

const anglerHorizon = 150;
const anglerSkyBands = [[0, 0x22], [40, 0x32], [70, 0x33], [96, 0x34], [116, 0x35], [132, 0x36], [143, 0x37]];
const anglerHills = [];
const anglerTrees = [];

// FUNCTIONS

function anglerEase(t) {
  return t * t * (3 - 2 * t);
}

function initAnglerBoat(p, spawn) {
  p.fromX = spawn.x;
  p.toX = spawn.x + spawn.range * tileSize;
  p.baseY = spawn.y;
  p.frames = spawn.frames || 110;
  p.pause = spawn.pause || 60;
  p.wait = p.pause;
  p.t = 0;
  p.dir = 1;
  p.surface = spawn.y + tileSize + 2;
}

function updateAnglerBoat(p) {
  if (p.wait > 0) p.wait--;
  else {
    p.t = Math.max(0, Math.min(1, p.t + p.dir / p.frames));
    if (p.t === 0 || p.t === 1) {
      p.dir = -p.dir;
      p.wait = p.pause;
    }
  }
  p.x = p.fromX + (p.toX - p.fromX) * anglerEase(p.t);
  p.y = p.baseY + Math.round(Math.sin(p.t * Math.PI * 2) * 1.5);
}

function drawAnglerBoat(ctx, p, sx, sy) {
  anglerClipAbove(ctx, p.surface - camera.y + 1, () => drawSprite(ctx, 'anglerBoat', sx, sy, p.toX < p.fromX, 'anglerTiles'));
}

function initAnglerLift(p, spawn) {
  p.bottomY = spawn.y;
  p.topY = spawn.y - spawn.range * tileSize;
  p.ropeY = p.topY - spawn.rope * tileSize;
  p.frames = spawn.frames || 150;
  p.state = 'bottom';
  p.wait = 0;
  p.t = 0;
}

function updateAnglerLift(p) {
  if (p.state === 'bottom' || p.state === 'top') {
    const waiting = p.state === 'bottom' ? p.carrying : !p.carrying;
    p.wait = waiting ? p.wait + 1 : 0;
    if (p.wait >= (p.state === 'bottom' ? 16 : 90)) {
      p.state = p.state === 'bottom' ? 'up' : 'down';
      p.wait = 0;
      playSfx('door');
    }
  } else {
    p.t = Math.max(0, Math.min(1, p.t + (p.state === 'up' ? 1 : -1) / p.frames));
    if (p.t === 1) p.state = 'top';
    if (p.t === 0) p.state = 'bottom';
  }
  p.y = p.bottomY + (p.topY - p.bottomY) * anglerEase(p.t);
}

function drawAnglerLift(ctx, p, sx, sy) {
  const ropeTop = p.ropeY - camera.y;
  ctx.fillStyle = nesPalette[0x37];
  for (const dx of [-18, 17]) {
    ctx.fillRect(Math.round(sx + dx), Math.round(ropeTop), 1, Math.round(sy - ropeTop));
    drawSprite(ctx, 'anglerPulley', sx + dx, ropeTop, false, 'anglerTiles');
  }
  drawSprite(ctx, 'anglerLift', sx, sy, false, 'anglerTiles');
}

function anglerLake(paint, fromCol, toCol) {
  paint.back(fromCol, 13, toCol - fromCol, 1, 'w');
  paint.back(fromCol, 14, toCol - fromCol, 1, 'x');
}

function anglerStilt(paint, col, fromRow) {
  paint.back(col, fromRow, 1, 13 - fromRow, 'k');
  paint.back(col, 13, 1, 1, 'y');
  paint.back(col, 14, 1, 1, 'z');
}

function anglerDock(paint, col, width) {
  paint.fill(col, 12, width, 1, '=');
  for (let post = col + 1; post < col + width; post += 3) anglerStilt(paint, post, 13);
}

function anglerLamp(paint, col) {
  paint.back(col, 9, 1, 1, 'l');
  paint.back(col, 10, 1, 2, 'p');
}

function buildAnglerShore() {
  const a = paintRoom('A');
  a.fill(1, 12, 1, 1, 'o');
  a.item('oneUp', 1, 12);
  a.fill(7, 12, 13, 3, '#');
  for (const col of [7, 10, 13, 19]) a.back(col, 11, 1, 1, 'r');
  anglerLamp(a, 16);
  a.spawn('anglerCrab', 18, 12);
  anglerDock(a, 20, 8);
  a.spawn('met', 26, 12);
  anglerDock(a, 30, 8);
  a.fill(33, 11, 2, 1, 'c');
  a.spawn('anglerLeapFish', 39, 13);
  anglerDock(a, 41, 6);
  a.item('energySmall', 43, 12);
  a.platform('anglerBoat', 48, 12, { range: 6 });
  anglerDock(a, 56, 12);
  a.back(59, 11, 1, 1, 'q');
  anglerLamp(a, 63);
  a.spawn('anglerPelican', 67, 9);
  a.fill(68, 0, 12, 3, 'M');
  a.fill(68, 3, 1, 6, 'M');
  a.fill(78, 3, 2, 12, 'M');
  a.fill(68, 12, 10, 1, '=');
  a.fill(71, 5, 1, 2, 'v');
  a.fill(76, 4, 2, 5, 'n');
  a.ladder(74, 0, 11);
  a.back(69, 3, 9, 9, 'b');
  a.item('energySmall', 71, 12);
  anglerLake(a, 0, 80);
}

function buildAnglerBoathouse() {
  const b1 = paintRoom('B1');
  b1.fill(0, 0, 2, 15, 'M');
  b1.fill(14, 0, 2, 15, 'M');
  b1.fill(8, 12, 6, 1, '=');
  b1.fill(8, 13, 6, 2, 'M');
  b1.ladder(10, 12, 14);
  b1.fill(2, 4, 3, 1, '=');
  b1.ladder(3, 0, 3);
  b1.fill(11, 6, 1, 2, 'v');
  b1.fill(8, 1, 2, 5, 'n');
  b1.back(2, 0, 12, 13, 'b');
  b1.back(2, 13, 6, 1, 'u');
  b1.back(2, 14, 6, 1, 'x');
  b1.platform('anglerLift', 6, 12, { range: 8, rope: 3 });
  b1.item('weaponSmall', 12, 12);

  const b2 = paintRoom('B2');
  b2.fill(0, 0, 2, 15, 'M');
  b2.fill(14, 0, 2, 15, 'M');
  b2.fill(2, 12, 12, 1, '=');
  b2.fill(2, 13, 12, 2, 'M');
  b2.ladder(3, 12, 14);
  b2.fill(11, 10, 2, 2, 'c');
  b2.fill(7, 8, 3, 1, '-');
  b2.fill(2, 6, 4, 1, '-');
  b2.ladder(3, 0, 5);
  b2.fill(9, 3, 1, 2, 'v');
  b2.fill(11, 2, 2, 5, 'n');
  b2.back(2, 0, 12, 12, 'b');
  b2.spawn('anglerCrab', 9, 12, { range: 1 });
  b2.item('weaponBig', 8, 8);
}

function buildAnglerPiers() {
  const c = paintRoom('C');
  c.fill(0, 0, 2, 15, 'M');
  c.fill(2, 0, 10, 3, 'M');
  c.fill(11, 3, 1, 6, 'M');
  c.fill(2, 12, 9, 1, '=');
  c.fill(2, 13, 9, 2, 'M');
  c.ladder(3, 12, 14);
  c.fill(7, 5, 1, 2, 'v');
  c.back(2, 3, 9, 9, 'b');
  anglerDock(c, 11, 7);
  c.spawn('anglerLeapFish', 19, 13);
  anglerDock(c, 21, 9);
  anglerLamp(c, 24);
  c.spawn('joe', 28, 12);
  c.spawn('anglerLeapFish', 31, 13, { delay: 60 });
  anglerDock(c, 33, 5);
  c.spawn('anglerCrab', 36, 12);
  c.platform('anglerBoat', 39, 12, { range: 4, frames: 100 });
  c.platform('anglerBoat', 48, 12, { range: -2, frames: 100 });
  anglerDock(c, 50, 11);
  c.back(52, 11, 1, 1, 'q');
  c.item('energyBig', 54, 12);
  c.spawn('anglerCrab', 58, 12);
  c.spawn('anglerPelican', 61, 9);
  c.spawn('anglerLeapFish', 62, 13);
  anglerDock(c, 64, 5);
  c.fill(67, 9, 1, 3, 'h');
  c.fill(68, 9, 10, 1, '=');
  anglerStilt(c, 71, 10);
  anglerStilt(c, 75, 10);
  c.fill(73, 12, 1, 1, 'o');
  c.item('weaponBig', 73, 12);
  c.spawn('anglerPelican', 79, 6);
  anglerDock(c, 78, 2);
  c.fill(79, 0, 1, 8, 'M');
  c.fill(79, 8, 1, 4, 'D');
  anglerLake(c, 11, 80);
}

function buildAnglerBossRooms() {
  const d = paintRoom('D');
  d.fill(0, 0, 16, 8, 'M');
  d.fill(0, 8, 1, 4, 'D');
  d.fill(15, 8, 1, 4, 'D');
  anglerDock(d, 0, 16);
  d.fill(7, 9, 2, 2, 'v');
  d.back(1, 8, 14, 4, 'b');
  d.item('energyBig', 5, 12);
  d.item('weaponBig', 10, 12);
  anglerLake(d, 0, 16);

  const e = paintRoom('E');
  e.fill(0, 0, 1, 8, 'M');
  e.fill(0, 8, 1, 4, 'D');
  e.fill(15, 0, 1, 12, 'M');
  anglerDock(e, 0, 16);
  anglerLamp(e, 3);
  anglerLamp(e, 12);
  e.back(8, 11, 1, 1, 'q');
  anglerLake(e, 0, 16);
}

function buildAnglerStage() {
  buildAnglerShore();
  buildAnglerBoathouse();
  buildAnglerPiers();
  buildAnglerBossRooms();
}

function anglerSurfaceAbove(col, row) {
  let top = row;
  while (isWaterTile(col, top - 1)) top--;
  return top * tileSize + 2;
}

function updateAnglerStage() {
  if (stage.state !== 'play' || player.dead || player.teleport) return;
  if (!isWaterAt(player.x, player.y - 6)) return;
  const col = Math.floor(player.x / tileSize);
  spawnEffect('splash', player.x, anglerSurfaceAbove(col, Math.floor((player.y - 6) / tileSize)) + 2);
  playAnglerSfx('splash');
  killPlayer(true);
}

function anglerRoomEnter() {
  for (const item of items) item.floating = false;
}

function drawAnglerSky(ctx) {
  anglerSkyBands.forEach(([top, color], index) => {
    const bottom = index + 1 < anglerSkyBands.length ? anglerSkyBands[index + 1][0] : anglerHorizon;
    ctx.fillStyle = nesPalette[color];
    ctx.fillRect(0, top, screenWidth, bottom - top);
    if (index + 1 >= anglerSkyBands.length) return;
    ctx.fillStyle = nesPalette[anglerSkyBands[index + 1][1]];
    ctx.fillRect(0, bottom - 4, screenWidth, 1);
    ctx.fillRect(0, bottom - 2, screenWidth, 1);
  });
  ctx.fillStyle = nesPalette[0x37];
  for (let dy = -15; dy <= 15; dy++) {
    const half = Math.round(Math.sqrt(225 - dy * dy));
    ctx.fillRect(188 - half, anglerHorizon - 26 + dy, half * 2, 1);
  }
  ctx.fillStyle = nesPalette[0x30];
  for (let dy = -10; dy <= 10; dy++) {
    const half = Math.round(Math.sqrt(100 - dy * dy));
    ctx.fillRect(188 - half, anglerHorizon - 26 + dy, half * 2, 1);
  }
}

function drawAnglerHills(ctx) {
  const farShift = Math.floor(camera.x * 0.1);
  const nearShift = Math.floor(camera.x * 0.25);
  for (let x = 0; x < screenWidth; x += 2) {
    const hill = anglerHills[(x + farShift) & 511];
    const tree = anglerTrees[(x + nearShift) & 511];
    ctx.fillStyle = nesPalette[0x23];
    ctx.fillRect(x, anglerHorizon - hill, 2, hill);
    ctx.fillStyle = nesPalette[0x13];
    ctx.fillRect(x, anglerHorizon - tree, 2, tree);
    ctx.fillStyle = nesPalette[0x13];
    ctx.fillRect(x, anglerHorizon, 2, Math.round(hill * 0.45));
    ctx.fillStyle = nesPalette[0x03];
    ctx.fillRect(x, anglerHorizon, 2, Math.round(tree * 0.7));
  }
}

function drawAnglerLake(ctx) {
  ctx.fillStyle = nesPalette[0x22];
  for (let y = anglerHorizon + 2; y < screenHeight; y += 3) ctx.fillRect(0, y, screenWidth, 1);
  ctx.fillStyle = nesPalette[0x12];
  ctx.fillRect(0, 180, screenWidth, screenHeight - 180);
  ctx.fillStyle = nesPalette[0x22];
  for (let y = 182; y < screenHeight; y += 4) ctx.fillRect(0, y, screenWidth, 1);
  for (let y = anglerHorizon + 3; y < 196; y += 4) {
    const wave = Math.sin(game.timer / 14 + y * 0.7);
    const half = Math.round(4 + (y - anglerHorizon) * 0.25 + wave * 3);
    ctx.fillStyle = nesPalette[y % 8 < 4 ? 0x37 : 0x36];
    ctx.fillRect(188 - half + Math.round(wave * 2), y, half * 2, 1);
  }
}

function drawAnglerMist(ctx) {
  ctx.fillStyle = nesPalette[0x3D];
  for (let i = 0; i < 9; i++) {
    const width = 18 + (i % 4) * 10;
    const x = ((i * 53 + Math.floor(game.timer / 5) + Math.floor(camera.x * 0.3)) % 320) - 32;
    ctx.fillRect(x, anglerHorizon - 5 + (i % 3) * 3, width, 1);
    ctx.fillRect(x + 6, anglerHorizon - 4 + (i % 3) * 3, width - 12, 1);
  }
}

function drawAnglerBackground(ctx) {
  drawAnglerSky(ctx);
  ctx.fillStyle = nesPalette[0x32];
  ctx.fillRect(0, anglerHorizon, screenWidth, screenHeight - anglerHorizon);
  drawAnglerHills(ctx);
  drawAnglerLake(ctx);
  drawAnglerMist(ctx);
}

// INITIALIZATION

for (let x = 0; x < 512; x++) {
  const angle = (x / 512) * Math.PI * 2;
  anglerHills.push(Math.max(8, Math.round(30 + 13 * Math.sin(angle * 3) + 8 * Math.sin(angle * 7 + 1.3) + 4 * Math.sin(angle * 17 + 0.4))));
  const offset = x % 14;
  const size = 10 + ((x / 14) % 3 | 0) * 3;
  anglerTrees.push(Math.max(4, size - Math.abs(offset - 7) * 2));
}

Object.assign(platformTypes, {
  anglerBoat: { w: 48, h: 8, init: initAnglerBoat, update: updateAnglerBoat, draw: drawAnglerBoat },
  anglerLift: { w: 48, h: 8, init: initAnglerLift, update: updateAnglerLift, draw: drawAnglerLift },
});

stageDefs.angler = {
  id: 'angler',
  boss: 'angler',
  cols: 176,
  rows: 60,
  rooms: [
    { id: 'A', col: 0, row: 45, cols: 80, rows: 15 },
    { id: 'B1', col: 64, row: 30, cols: 16, rows: 15 },
    { id: 'B2', col: 64, row: 15, cols: 16, rows: 15 },
    { id: 'C', col: 64, row: 0, cols: 80, rows: 15 },
    { id: 'D', col: 144, row: 0, cols: 16, rows: 15 },
    { id: 'E', col: 160, row: 0, cols: 16, rows: 15, boss: true },
  ],
  checkpoints: [
    { room: 'A', col: 8, row: 57 },
    { room: 'C', col: 72, row: 12 },
    { room: 'D', col: 147, row: 12 },
  ],
  sky: 0x22,
  song: anglerStageSong,
  tilePalette: 'anglerTiles',
  tiles: {
    '#': 'tileAnglerShore',
    '=': 'tileAnglerDock',
    M: 'tileAnglerBoathouse',
    b: 'tileAnglerBackWall',
    v: 'tileAnglerWindow',
    n: 'tileAnglerNet',
    c: 'tileAnglerCrate',
    H: 'tileAnglerLadder',
    h: 'tileAnglerLadderOut',
    '-': 'tileAnglerLoft',
    o: 'tileAnglerBuoy',
    r: 'tileAnglerReeds',
    l: 'tileAnglerLamp',
    p: 'tileAnglerPole',
    q: 'tileAnglerBollard',
    k: 'tileAnglerPost',
    w: 'tileAnglerWave0',
    u: 'tileAnglerWaveIn0',
    x: 'tileAnglerDeep0',
    y: 'tileAnglerWavePost0',
    z: 'tileAnglerDeepPost0',
  },
  tileFrames: {
    w: { names: ['tileAnglerWave0', 'tileAnglerWave1', 'tileAnglerWave2', 'tileAnglerWave3'], rate: 10 },
    u: { names: ['tileAnglerWaveIn0', 'tileAnglerWaveIn1', 'tileAnglerWaveIn2', 'tileAnglerWaveIn3'], rate: 10 },
    y: { names: ['tileAnglerWavePost0', 'tileAnglerWavePost1', 'tileAnglerWavePost2', 'tileAnglerWavePost3'], rate: 10 },
    x: { names: ['tileAnglerDeep0', 'tileAnglerDeep1'], rate: 24 },
    z: { names: ['tileAnglerDeepPost0', 'tileAnglerDeepPost1'], rate: 24 },
  },
  groundTop: { '#': 'tileAnglerShoreTop' },
  tileTypes: { c: 'solid', o: 'solid', '-': 'oneWay', h: 'ladder', w: 'water', u: 'water', x: 'water', y: 'water', z: 'water' },
  update: updateAnglerStage,
  onRoomEnter: anglerRoomEnter,
  drawBackground: drawAnglerBackground,
  build: buildAnglerStage,
};
