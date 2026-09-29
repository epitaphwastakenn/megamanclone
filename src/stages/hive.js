// VARIABLES

const hiveClouds = [
  { x: 20, y: 22 },
  { x: 150, y: 50 },
  { x: 270, y: 14 },
  { x: 390, y: 44 },
  { x: 470, y: 76 },
];

// FUNCTIONS

function plantHiveFlower(paint, col, row, groundRow, kind) {
  const [left, center, right] = kind === 'daisy' ? ['L', 'C', 'R'] : ['l', 'c', 'r'];
  paint.fill(col - 1, row, 1, 1, left);
  paint.fill(col, row, 1, 1, center);
  paint.fill(col + 1, row, 1, 1, right);
  for (let y = row + 1; y < groundRow; y++) paint.back(col, y, 1, 1, (y - row) % 4 === 2 ? 'f' : '|');
}

function scatterHiveFlowers(paint, cols, row) {
  for (const col of cols) paint.back(col, row, 1, 1, 'o');
}

function fillHoneyCells(paint, cells) {
  for (const [col, row] of cells) paint.fill(col, row, 1, 1, 'y');
}

function buildHiveStage() {
  const a = paintRoom('A');
  a.fill(0, 12, 18, 3, '#');
  plantHiveFlower(a, 5, 10, 12, 'pink');
  plantHiveFlower(a, 10, 8, 12, 'daisy');
  a.item('energySmall', 10, 8);
  scatterHiveFlowers(a, [1, 8, 14], 11);
  a.fill(20, 12, 14, 3, '#');
  scatterHiveFlowers(a, [21, 25, 31], 11);
  a.spawn('ladybugTank', 29, 12);
  a.fill(34, 12, 10, 3, '~');
  a.fill(44, 12, 20, 3, '#');
  scatterHiveFlowers(a, [45, 49, 52, 62], 11);
  a.spawn('seedFlower', 56, 12);
  a.spawn('flea', 62, 12);
  plantHiveFlower(a, 60, 10, 12, 'daisy');
  a.item('weaponSmall', 60, 10);
  plantHiveFlower(a, 66, 11, 15, 'daisy');
  plantHiveFlower(a, 71, 10, 15, 'pink');
  a.fill(76, 12, 6, 3, '#');
  plantHiveFlower(a, 79, 7, 12, 'pink');
  a.spawn('beeHive', 80, 8, { side: -1 });
  scatterHiveFlowers(a, [77], 11);
  a.fill(82, 0, 2, 9, 'B');
  a.fill(82, 12, 2, 3, 'B');
  a.fill(94, 0, 2, 15, 'B');
  a.fill(84, 12, 10, 3, 'w');
  a.back(82, 9, 12, 3, 'x');
  a.back(84, 0, 10, 12, 'x');
  a.ladder(90, 0, 11);
  fillHoneyCells(a, [
    [86, 2],
    [92, 5],
    [85, 8],
    [88, 10],
  ]);
  a.back(80, 0, 2, 3, 'k');
  a.item('energySmall', 86, 12);

  const b1 = paintRoom('B1');
  b1.fill(0, 0, 4, 15, 'B');
  b1.fill(14, 0, 2, 15, 'B');
  b1.fill(4, 11, 10, 4, 'w');
  b1.ladder(10, 11, 14);
  b1.fill(5, 4, 9, 1, 'w');
  b1.ladder(4, 4, 10);
  b1.ladder(12, 0, 3);
  b1.back(4, 0, 10, 11, 'x');
  fillHoneyCells(b1, [
    [6, 1],
    [9, 7],
    [12, 9],
    [5, 2],
  ]);
  b1.spawn('honeyDrip', 7, 5, { delay: 20, period: 70 });
  b1.item('energySmall', 8, 4);

  const b2 = paintRoom('B2');
  b2.fill(0, 0, 4, 15, 'B');
  b2.fill(14, 0, 2, 15, 'B');
  b2.fill(4, 11, 10, 4, 'w');
  b2.fill(5, 11, 5, 1, '~');
  b2.ladder(12, 11, 14);
  b2.fill(5, 3, 9, 1, 'w');
  b2.ladder(4, 3, 10);
  b2.ladder(11, 0, 2);
  b2.fill(13, 9, 1, 2, 'z');
  b2.fill(14, 9, 1, 2, 'x');
  b2.back(4, 0, 10, 11, 'x');
  fillHoneyCells(b2, [
    [9, 1],
    [5, 6],
    [11, 8],
    [6, 9],
  ]);
  b2.spawn('honeyDrip', 7, 4, { delay: 30, period: 70 });
  b2.item('oneUp', 14, 11);
  b2.item('weaponSmall', 8, 3);

  const c = paintRoom('C');
  c.fill(0, 0, 4, 15, 'B');
  c.fill(4, 0, 12, 3, 'B');
  c.fill(4, 11, 12, 4, 'w');
  c.ladder(11, 11, 14);
  c.fill(14, 3, 2, 5, 'B');
  c.back(4, 3, 12, 8, 'x');
  fillHoneyCells(c, [
    [6, 4],
    [9, 6],
    [13, 9],
  ]);
  c.back(16, 0, 3, 2, 'k');
  c.fill(16, 11, 12, 1, '=');
  c.back(18, 12, 2, 1, 'k');
  c.back(27, 10, 1, 1, 'k');
  c.platform('hiveDandelion', 23, 10, { mode: 'lift', rise: 80 });
  c.fill(26, 5, 8, 1, '=');
  c.back(28, 4, 3, 1, 'k');
  c.back(33, 6, 1, 1, 'k');
  c.platform('hiveDandelion', 36, 6, { mode: 'drift', range: 5, phase: 0 });
  c.platform('hiveDandelion', 45, 5, { mode: 'drift', range: 5, phase: 1 });
  plantHiveFlower(c, 48, 3, 15, 'daisy');
  c.item('oneUp', 48, 3);
  plantHiveFlower(c, 55, 5, 15, 'pink');
  c.fill(58, 12, 22, 3, '#');
  c.fill(62, 12, 6, 3, '~');
  scatterHiveFlowers(c, [59, 69, 71], 11);
  c.item('energyBig', 60, 12);
  c.spawn('seedFlower', 72, 12);
  c.spawn('ladybugTank', 75, 12);
  c.fill(76, 3, 1, 5, 'w');
  c.fill(77, 1, 1, 7, 'w');
  c.fill(78, 0, 2, 8, 'w');
  c.back(75, 1, 2, 2, 'k');
  c.fill(79, 8, 1, 4, 'D');
  c.spawn('honeyDrip', 77, 8, { delay: 10, period: 80 });

  const d = paintRoom('D');
  d.fill(0, 0, 16, 8, 'w');
  d.fill(0, 12, 16, 3, 'w');
  d.fill(0, 8, 1, 4, 'D');
  d.fill(15, 8, 1, 4, 'D');
  d.back(1, 8, 14, 4, 'X');
  d.item('energyBig', 6, 12);
  d.item('weaponBig', 10, 12);

  const e = paintRoom('E');
  e.fill(0, 0, 16, 2, 'w');
  e.fill(0, 2, 1, 6, 'w');
  e.fill(0, 8, 1, 4, 'D');
  e.fill(15, 0, 1, 15, 'w');
  e.fill(0, 12, 15, 3, 'w');
  e.back(1, 2, 14, 10, 'X');
}

function updateHiveDandelion(platform) {
  const bob = Math.sin(platform.timer / 18) * 1.5;
  if (platform.mode === 'lift') {
    if (platform.carrying) platform.lift = Math.min(platform.rise, platform.lift + 0.7);
    else platform.lift = Math.max(0, platform.lift - 0.5);
    platform.y = platform.baseY - platform.lift + bob;
  } else if (platform.mode === 'drift') {
    const t = platform.timer * 0.021 + platform.phase * Math.PI;
    platform.x = platform.fromX + ((platform.toX - platform.fromX) * (1 - Math.cos(t))) / 2;
    platform.y = platform.baseY + bob;
  } else {
    platform.y = platform.baseY + bob;
  }
}

function drawHiveClouds(ctx, top) {
  const span = 512;
  for (const cloud of hiveClouds) {
    const x = ((((cloud.x - camera.x * 0.25) % span) + span) % span) - 48;
    drawSprite(ctx, 'hiveCloud', x, top + cloud.y, false, 'enemy');
  }
}

function drawHiveHills(ctx, horizon, lift, height, parallax, color, phase) {
  ctx.fillStyle = nesPalette[color];
  for (let x = 0; x < screenWidth; x += 2) {
    const world = x + camera.x * parallax + phase;
    const hill = Math.round((height * (0.55 + 0.3 * Math.sin(world / 41) + 0.15 * Math.sin(world / 17 + 1))) / 2) * 2;
    ctx.fillRect(x, horizon - lift - hill, 2, hill + lift);
  }
}

function drawHiveBackground(ctx) {
  for (const room of rooms) {
    if (!room.outdoor) continue;
    const bounds = roomBounds(room);
    const left = bounds.left - camera.x;
    const top = bounds.top - camera.y;
    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    if (left >= screenWidth || top >= screenHeight || left + width <= 0 || top + height <= 0) continue;
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, width, height);
    ctx.clip();
    drawHiveClouds(ctx, top);
    const horizon = top + (room.high ? 240 : 200);
    drawHiveHills(ctx, horizon, room.high ? 6 : 18, room.high ? 36 : 64, 0.2, 0x3A, 0);
    drawHiveHills(ctx, horizon, 0, room.high ? 20 : 40, 0.4, 0x2B, 90);
    ctx.restore();
  }
}

// INITIALIZATION

platformTypes.hiveDandelion = {
  w: 48,
  h: 8,
  init(platform, spawn) {
    platform.mode = spawn.mode || 'float';
    platform.baseY = spawn.y;
    platform.rise = spawn.rise || 0;
    platform.lift = 0;
    platform.fromX = spawn.x;
    platform.toX = spawn.x + (spawn.range || 0) * tileSize;
    platform.phase = spawn.phase || 0;
    updateHiveDandelion(platform);
    platform.prevY = platform.y;
  },
  update: updateHiveDandelion,
  draw: (ctx, platform, sx, sy) => drawSprite(ctx, 'hiveDandelion', sx, sy, false, 'enemy'),
};

stageDefs.hive = {
  id: 'hive',
  boss: 'hive',
  cols: 192,
  rows: 60,
  rooms: [
    { id: 'A', col: 0, row: 45, cols: 96, rows: 15, outdoor: true },
    { id: 'B1', col: 80, row: 30, cols: 16, rows: 15, sky: 0x07 },
    { id: 'B2', col: 80, row: 15, cols: 16, rows: 15, sky: 0x07 },
    { id: 'C', col: 80, row: 0, cols: 80, rows: 15, outdoor: true, high: true },
    { id: 'D', col: 160, row: 0, cols: 16, rows: 15, sky: 0x07 },
    { id: 'E', col: 176, row: 0, cols: 16, rows: 15, boss: true, sky: 0x07 },
  ],
  checkpoints: [
    { room: 'A', col: 3, row: 57 },
    { room: 'C', col: 87, row: 11 },
    { room: 'D', col: 163, row: 12 },
  ],
  sky: 0x21,
  song: hiveStageSong,
  tilePalette: 'enemy',
  tilePalettes: { L: 'hiveDaisy', C: 'hiveDaisy', R: 'hiveDaisy', X: 'hiveChamber' },
  tiles: {
    '#': 'tileHiveDirt',
    '~': 'tileHiveHoney',
    l: 'tileHivePetalL',
    c: 'tileHivePetalC',
    r: 'tileHivePetalR',
    L: 'tileHivePetalL',
    C: 'tileHivePetalC',
    R: 'tileHivePetalR',
    '|': 'tileHiveStem',
    f: 'tileHiveStemLeaf',
    B: 'tileHiveBark',
    w: 'tileHiveWax',
    z: 'tileHiveWaxCrack',
    x: 'tileHiveComb',
    y: 'tileHiveCombHoney',
    X: 'tileHiveComb',
    '=': 'tileHiveBranch',
    k: 'tileHiveLeaves',
    H: 'tileHiveVine',
    o: 'tileHiveFlowers',
  },
  tileTypes: { '~': 'slow', l: 'oneWay', c: 'oneWay', r: 'oneWay', L: 'oneWay', C: 'oneWay', R: 'oneWay', B: 'solid', w: 'solid', z: 'breakable' },
  groundTop: { '#': 'tileHiveGrass', '~': 'tileHiveHoneyTop' },
  brokenTile: 'x',
  bossSpawn: { col: 11, y: 40 },
  build: buildHiveStage,
  drawBackground: drawHiveBackground,
};
