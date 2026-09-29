// VARIABLES

const marineCurrentPush = 0.6;
const marineCurrents = [{ room: 'C', col: 34, row: 3, cols: 12, rows: 8, dir: -1 }];
const marineVents = [{ room: 'A', col: 68, row: 14, cols: 8 }];
const marineClouds = [
  { x: 20, y: 28, w: 40 },
  { x: 120, y: 52, w: 28 },
  { x: 190, y: 20, w: 48 },
  { x: 300, y: 44, w: 34 },
];
const marinePlankton = [];
const marineDither = { fill: null };

// FUNCTIONS

function marinePier(paint, fromCol, toCol, row) {
  paint.fill(fromCol, row, toCol - fromCol + 1, 1, 'p');
  for (let col = fromCol + 1; col <= toCol; col += 3) paint.fill(col, row + 1, 1, 2, 'I');
}

function marinePalm(paint, col, groundRow, height) {
  paint.back(col, groundRow - height, 1, 1, 'T');
  paint.back(col, groundRow - height + 1, 1, height - 1, 't');
}

function marineKelp(paint, col, bottomRow, height) {
  paint.fill(col, bottomRow - height + 1, 1, height, 'k');
}

function buildMarineShip(a) {
  a.fill(41, 11, 4, 4, '#');
  a.fill(43, 9, 2, 2, 'x');
  a.back(45, 7, 10, 1, 'r');
  a.fill(45, 8, 14, 1, '=');
  a.fill(45, 9, 14, 1, 'Y');
  a.fill(45, 10, 14, 5, 'h');
  for (const col of [47, 50, 53]) a.fill(col, 10, 1, 1, 'O');
  a.fill(55, 6, 4, 1, '=');
  a.fill(55, 7, 4, 1, 'h');
  a.fill(57, 7, 1, 1, 'O');
  a.back(55, 5, 4, 1, 'r');
  a.fill(50, 1, 1, 7, 'm');
  a.fill(51, 1, 1, 1, 'F');
}

function buildMarineBeach() {
  const a = paintRoom('A');
  a.fill(0, 11, 13, 4, '#');
  marinePalm(a, 2, 11, 5);
  marinePalm(a, 8, 11, 4);
  a.fill(13, 12, 67, 1, '~');
  a.fill(13, 13, 67, 2, 'w');
  a.fill(13, 14, 55, 1, '#');
  marinePier(a, 13, 18, 11);
  marinePier(a, 24, 30, 11);
  marinePier(a, 33, 40, 11);
  buildMarineShip(a);
  a.back(65, 6, 1, 5, 'm');
  a.fill(64, 5, 3, 1, 'p');
  marinePier(a, 59, 67, 11);
  a.fill(76, 3, 4, 12, 'R');
  a.spawn('marineCrab', 10, 11);
  a.spawn('marinePiranhaLeap', 31, 14, { surfaceY: 12 * tileSize });
  a.spawn('blader', 35, 5);
  a.spawn('met', 39, 11);
  a.spawn('marineCrab', 52, 8);
  a.spawn('blader', 58, 2);
  a.platform('marineRaft', 20, 12, { fromX: 19 * tileSize + 16, toX: 23 * tileSize });
  a.item('energySmall', 21, 14);
  a.item('weaponSmall', 46, 8);
  a.item('oneUp', 65, 5);
  a.item('energyBig', 61, 11);
}

function buildMarineDescent() {
  const b1 = paintRoom('B1');
  b1.fill(0, 0, 16, 15, ',');
  b1.fill(0, 0, 2, 15, 'X');
  b1.fill(14, 0, 2, 15, 'X');
  b1.fill(0, 0, 4, 1, 'X');
  b1.fill(12, 0, 4, 1, 'X');
  b1.fill(2, 6, 10, 1, 'R');
  b1.fill(12, 3, 2, 1, 'R');
  b1.fill(4, 11, 10, 4, 'R');
  b1.fill(3, 5, 1, 1, 'c');
  marineKelp(b1, 9, 5, 2);
  b1.fill(6, 10, 1, 1, 'C');
  b1.fill(11, 10, 1, 1, 'c');
  marineKelp(b1, 13, 10, 3);
  b1.spawn('marineJelly', 7, 10, { leash: 32, rise: 16 });
  b1.item('weaponSmall', 12, 3);

  const b2 = paintRoom('B2');
  b2.fill(0, 0, 16, 15, ',');
  b2.fill(0, 0, 2, 15, 'X');
  b2.fill(14, 0, 2, 15, 'X');
  b2.fill(4, 0, 10, 2, 'X');
  b2.fill(12, 2, 2, 1, 'X');
  b2.fill(2, 5, 7, 1, 'R');
  b2.fill(8, 9, 6, 1, 'R');
  b2.fill(2, 4, 1, 1, 'c');
  marineKelp(b2, 6, 4, 2);
  b2.fill(13, 8, 1, 1, 'C');
  marineKelp(b2, 9, 8, 2);
  b2.fill(11, 8, 1, 1, 'c');
  b2.spawn('marineCrab', 8, 5);
  b2.item('energySmall', 12, 9);
}

function buildMarineReef(c) {
  c.fill(0, 0, 80, 15, ',');
  c.fill(0, 0, 2, 15, 'X');
  c.fill(14, 0, 66, 2, 'X');
  c.fill(0, 12, 19, 3, '#');
  c.fill(3, 11, 1, 1, 'c');
  c.fill(9, 11, 1, 1, 'C');
  marineKelp(c, 6, 11, 2);
  marineKelp(c, 13, 11, 3);
  c.fill(16, 11, 1, 1, 'c');
  c.fill(19, 12, 3, 1, '^');
  c.fill(19, 13, 3, 2, '#');
  c.fill(22, 9, 3, 6, 'R');
  c.fill(23, 8, 1, 1, 'C');
  c.fill(25, 12, 3, 3, '#');
  marineKelp(c, 26, 11, 2);
  c.fill(28, 8, 3, 7, 'R');
  c.fill(29, 7, 1, 1, 'c');
  c.fill(31, 12, 3, 1, '^');
  c.fill(31, 13, 3, 2, '#');
  c.spawn('marineCrab', 26, 12);
  c.spawn('marineJelly', 26, 6, { leash: 40, rise: 16 });
}

function buildMarineKelpForest(c) {
  c.fill(34, 12, 6, 3, '#');
  c.fill(40, 13, 2, 1, '^');
  c.fill(40, 14, 2, 1, '#');
  c.fill(42, 12, 6, 3, '#');
  marineKelp(c, 35, 11, 4);
  marineKelp(c, 37, 11, 2);
  marineKelp(c, 39, 11, 5);
  marineKelp(c, 44, 11, 4);
  marineKelp(c, 46, 11, 3);
  c.fill(36, 11, 1, 1, 'c');
  c.fill(45, 11, 1, 1, 'C');
  c.spawn('marinePiranhaSchool', 46, 12, { untilX: (c.room.col + 44) * tileSize });
}

function buildMarineGalleon(c) {
  c.fill(48, 0, 20, 15, 'b');
  c.fill(48, 0, 20, 2, 'G');
  c.fill(48, 12, 20, 3, 'G');
  c.fill(48, 2, 1, 7, 'G');
  c.fill(67, 2, 1, 7, 'G');
  c.fill(48, 9, 1, 3, ',');
  c.fill(67, 9, 1, 3, ',');
  c.fill(53, 8, 7, 1, 'G');
  for (const col of [51, 56, 61, 65]) c.fill(col, 4, 1, 1, 'o');
  for (const col of [50, 58, 64]) c.fill(col, 11, 1, 1, '$');
  c.spawn('marineLantern', 58, 8);
  c.spawn('marineLantern', 61, 12);
  c.item('energyBig', 54, 8);
}

function buildMarineFloor() {
  const c = paintRoom('C');
  buildMarineReef(c);
  buildMarineKelpForest(c);
  buildMarineGalleon(c);
  c.fill(68, 12, 12, 3, '#');
  c.fill(79, 0, 1, 8, 'X');
  c.fill(79, 8, 1, 4, 'D');
  marineKelp(c, 70, 11, 3);
  c.fill(71, 11, 1, 1, 'C');
  marineKelp(c, 73, 11, 2);
  c.fill(74, 11, 1, 1, 'c');
  marineKelp(c, 77, 11, 4);
  c.spawn('marineCrab', 76, 12);
  c.item('weaponBig', 73, 12);
}

function buildMarineBossRooms() {
  const d = paintRoom('D');
  d.fill(0, 0, 16, 15, ',');
  d.fill(0, 0, 16, 8, 'X');
  d.fill(0, 12, 16, 3, '#');
  d.fill(0, 8, 1, 4, 'D');
  d.fill(15, 8, 1, 4, 'D');
  d.fill(4, 11, 1, 1, 'c');
  marineKelp(d, 12, 11, 2);
  d.item('energyBig', 6, 12);
  d.item('weaponBig', 10, 12);

  const e = paintRoom('E');
  e.fill(0, 0, 16, 15, ',');
  e.fill(0, 0, 16, 2, 'X');
  e.fill(0, 2, 1, 6, 'X');
  e.fill(0, 8, 1, 4, 'D');
  e.fill(15, 0, 1, 15, 'X');
  e.fill(0, 12, 15, 3, '#');
  marineKelp(e, 2, 11, 4);
  marineKelp(e, 13, 11, 5);
  e.fill(5, 11, 1, 1, 'c');
  e.fill(10, 11, 1, 1, 'C');
}

function buildSwordfishStage() {
  buildMarineBeach();
  buildMarineDescent();
  buildMarineFloor();
  buildMarineBossRooms();
}

function marineCurrentRect(current) {
  const room = rooms.find(entry => entry.id === current.room);
  const left = (room.col + current.col) * tileSize;
  const top = (room.row + current.row) * tileSize;
  return { left, top, right: left + current.cols * tileSize, bottom: top + current.rows * tileSize };
}

function marineCurrentAt(x, y) {
  for (const current of marineCurrents) {
    const rect = marineCurrentRect(current);
    if (x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom) return current.dir;
  }
  return 0;
}

function applyMarineCurrent() {
  if (!player.inWater || player.climbing || player.dead || !player.control) return;
  player.pushX += marineCurrentAt(player.x, player.y - 12) * marineCurrentPush;
}

function spawnMarineCurrentBubbles() {
  if (game.timer % 5 !== 0) return;
  for (const current of marineCurrents) {
    const rect = marineCurrentRect(current);
    const left = Math.max(rect.left, camera.x);
    const right = Math.min(rect.right, camera.x + screenWidth);
    if (left >= right) continue;
    const x = left + Math.random() * (right - left);
    const y = rect.top + Math.random() * (rect.bottom - rect.top);
    spawnEffect('marineBubble', x, y, { vx: current.dir * (1.6 + Math.random()) });
  }
}

function spawnMarineVentBubbles() {
  if (game.timer % 9 !== 0) return;
  for (const vent of marineVents) {
    const room = rooms.find(entry => entry.id === vent.room);
    const x = (room.col + vent.col + Math.random() * vent.cols) * tileSize;
    const y = (room.row + vent.row + 1) * tileSize - 2;
    if (onScreen(x, y, 8)) spawnEffect('bubble', x, y);
  }
}

function updateSwordfishStage() {
  if (!marinePlankton.length) {
    for (let i = 0; i < 24; i++) marinePlankton.push({ x: Math.random() * screenWidth, y: Math.random() * screenHeight, speed: 0.1 + Math.random() * 0.25, phase: Math.random() * 6 });
  }
  for (const speck of marinePlankton) {
    speck.y -= speck.speed;
    if (speck.y < 0) speck.y += screenHeight;
  }
  if (stage.state !== 'play') return;
  applyMarineCurrent();
  spawnMarineCurrentBubbles();
  spawnMarineVentBubbles();
}

function marineRoomRect(room) {
  const bounds = roomBounds(room);
  return { x: bounds.left - camera.x, y: bounds.top - camera.y, w: bounds.right - bounds.left, h: bounds.bottom - bounds.top };
}

function marineDitherFill(ctx) {
  if (!marineDither.fill) {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const pattern = canvas.getContext('2d');
    pattern.fillStyle = nesPalette[0x0C];
    pattern.fillRect(0, 0, 1, 1);
    pattern.fillRect(1, 1, 1, 1);
    marineDither.fill = ctx.createPattern(canvas, 'repeat');
  }
  return marineDither.fill;
}

function drawMarineSky(ctx, rect) {
  ctx.fillStyle = nesPalette[0x38];
  const sunY = rect.y + 30;
  ctx.fillRect(198, sunY - 10, 12, 20);
  ctx.fillRect(194, sunY - 6, 20, 12);
  ctx.fillRect(196, sunY - 8, 16, 16);
  ctx.fillStyle = nesPalette[0x30];
  for (const cloud of marineClouds) {
    const x = Math.round((((cloud.x - camera.x * 0.2) % 360) + 360) % 360) - 52;
    const y = rect.y + cloud.y;
    ctx.fillRect(x, y, cloud.w, 6);
    ctx.fillRect(x + 6, y - 4, cloud.w - 14, 4);
    ctx.fillRect(x + 12, y - 7, cloud.w - 26, 3);
  }
  const horizon = rect.y + 150;
  ctx.fillStyle = nesPalette[0x11];
  ctx.fillRect(rect.x, horizon, rect.w, rect.h - 150);
  ctx.fillStyle = nesPalette[0x0C];
  for (let i = 0; i < 3; i++) {
    const x = Math.round((((i * 170 + 40 - camera.x * 0.3) % 510) + 510) % 510) - 60;
    ctx.fillRect(x, horizon - 6, 36, 6);
    ctx.fillRect(x + 8, horizon - 12, 18, 6);
    ctx.fillRect(x + 12, horizon - 16, 8, 4);
  }
  ctx.fillStyle = nesPalette[0x21];
  for (let i = 0; i < 10; i++) {
    const x = Math.round((((i * 53 - camera.x * 0.4 + (Math.floor(game.timer / 20) % 2) * 3) % 530) + 530) % 530) - 20;
    ctx.fillRect(x, horizon + 6 + (i % 4) * 8, 6 + (i % 3) * 3, 1);
  }
}

function drawMarineDepths(ctx, rect) {
  ctx.fillStyle = marineDitherFill(ctx);
  const base = rect.y + rect.h;
  for (let i = 0; i < 6; i++) {
    const x = Math.round((((i * 97 - camera.x * 0.5) % 582) + 582) % 582) - 60;
    const height = 40 + (i % 3) * 22;
    ctx.fillRect(x, base - height, 44, height);
    ctx.fillRect(x + 8, base - height - 12, 26, 12);
    ctx.fillRect(x + 16, base - height - 22, 10, 10);
  }
  ctx.fillStyle = nesPalette[0x2C];
  for (let i = 0; i < 4; i++) {
    const x = Math.round((((i * 83 + 30 - camera.x * 0.15) % 332) + 332) % 332) - 20;
    for (let y = 0; y < 120; y += 4) ctx.fillRect(x + y / 4 + ((y / 4) % 2), rect.y + y, 1, 1);
  }
  ctx.fillStyle = nesPalette[0x31];
  for (const speck of marinePlankton) {
    const x = Math.round(speck.x + Math.sin(game.timer / 40 + speck.phase) * 3);
    const y = Math.round(speck.y);
    if (y >= rect.y && y < rect.y + rect.h) ctx.fillRect(x, y, 1, 1);
  }
}

function drawMarineCurrents(ctx) {
  ctx.fillStyle = nesPalette[0x31];
  for (const current of marineCurrents) {
    const rect = marineCurrentRect(current);
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;
    const count = Math.floor((current.cols * current.rows) / 2);
    for (let i = 0; i < count; i++) {
      const offset = (i * 67 + current.dir * game.timer * (1.5 + (i % 3) * 0.5)) % width;
      const x = rect.left + ((offset + width) % width) - camera.x;
      const y = rect.top + ((i * 29) % height) - camera.y;
      if (x < -8 || x > screenWidth || y < -2 || y > screenHeight) continue;
      ctx.fillRect(Math.round(x), Math.round(y), 5 + (i % 3) * 2, 1);
    }
  }
}

function drawSwordfishBackground(ctx) {
  for (const room of rooms) {
    const rect = marineRoomRect(room);
    if (rect.x >= screenWidth || rect.x + rect.w <= 0 || rect.y >= screenHeight || rect.y + rect.h <= 0) continue;
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.clip();
    if (room.id === 'A') drawMarineSky(ctx, rect);
    else drawMarineDepths(ctx, rect);
    ctx.restore();
  }
  drawMarineCurrents(ctx);
}

// INITIALIZATION

Object.assign(effectTypes, {
  marineBubble: {
    update(effect) {
      effect.y += Math.sin(effect.timer / 4) * 0.4;
      return effect.timer > 40 || !isWaterAt(effect.x, effect.y);
    },
    draw(ctx, effect, sx, sy) {
      drawSprite(ctx, 'bubble', sx, sy, false, 'enemy');
    },
  },
});

Object.assign(platformTypes, {
  marineRaft: {
    w: 32,
    h: 6,
    sprite: 'marineRaft',
    palette: 'marineTiles',
    init(p, spawn) {
      p.fromX = spawn.fromX;
      p.toX = spawn.toX;
      p.baseY = spawn.y - 3;
      p.dir = 1;
    },
    update(p) {
      p.x += p.dir * 0.5;
      if (p.x >= p.toX) p.dir = -1;
      if (p.x <= p.fromX) p.dir = 1;
      p.y = p.baseY + Math.round(Math.sin(p.timer / 20) * 1.5);
    },
  },
});

stageDefs.swordfish = {
  id: 'swordfish',
  boss: 'swordfish',
  cols: 176,
  rows: 60,
  rooms: [
    { id: 'A', col: 0, row: 0, cols: 80, rows: 15, sky: 0x21 },
    { id: 'B1', col: 64, row: 15, cols: 16, rows: 15 },
    { id: 'B2', col: 64, row: 30, cols: 16, rows: 15 },
    { id: 'C', col: 64, row: 45, cols: 80, rows: 15 },
    { id: 'D', col: 144, row: 45, cols: 16, rows: 15 },
    { id: 'E', col: 160, row: 45, cols: 16, rows: 15, boss: true },
  ],
  checkpoints: [
    { room: 'A', col: 3, row: 11 },
    { room: 'C', col: 70, row: 57 },
    { room: 'D', col: 147, row: 57 },
  ],
  sky: 0x1C,
  song: swordfishStageSong,
  tilePalette: 'marineTiles',
  tilePalettes: { G: 'marineHull', h: 'marineHull', O: 'marineHull', Y: 'marineHull', b: 'marineHold', o: 'marineHold', $: 'marineHold' },
  tiles: {
    '#': 'tileMarineSand',
    R: 'tileMarineRock',
    X: 'tileMarineRock',
    '=': 'tileMarinePlank',
    G: 'tileMarinePlank',
    h: 'tileMarinePlank',
    O: 'tileMarineHullPort',
    Y: 'tileMarineHullTrim',
    x: 'tileMarineCrate',
    r: 'tileMarineRail',
    F: 'tileMarineFlag',
    p: 'tileMarinePier',
    I: 'tileMarinePostWet',
    w: 'tileMarineWater',
    '^': 'tileMarineUrchin',
    c: 'tileMarineCoral',
    C: 'tileMarineCoral2',
    b: 'tileMarineGalleon',
    o: 'tileMarinePorthole',
    $: 'tileMarineTreasure',
    t: 'tileMarinePalm',
    T: 'tileMarinePalmCrown',
    m: 'tileMarineMast',
  },
  tileFrames: {
    '~': { names: ['tileMarineSurface0', 'tileMarineSurface1', 'tileMarineSurface2', 'tileMarineSurface3'], rate: 12 },
    k: { names: ['tileMarineKelp0', 'tileMarineKelp1'], rate: 30, stagger: 11 },
  },
  groundTop: { '#': 'tileMarineSandTop', R: 'tileMarineRockTop' },
  tileTypes: {
    R: 'solid',
    X: 'solid',
    G: 'solid',
    h: 'solid',
    O: 'solid',
    Y: 'solid',
    x: 'solid',
    p: 'oneWay',
    '~': 'water',
    w: 'water',
    I: 'water',
    ',': 'water',
    c: 'water',
    C: 'water',
    k: 'water',
    b: 'water',
    o: 'water',
    $: 'water',
  },
  bossSpawn: { col: 11, y: 40 },
  update: updateSwordfishStage,
  drawBackground: drawSwordfishBackground,
  build: buildSwordfishStage,
};
