// FUNCTIONS

function decorateOutdoor(paint, fromCol, toCol) {
  paint.back(fromCol, 1, toCol - fromCol, 4, 'm');
  for (let col = fromCol; col < toCol; col += 14) {
    paint.back(col + 4, 7, Math.min(6, toCol - col - 4), 1, 't');
    paint.back(col + 4, 8, Math.min(6, toCol - col - 4), 6, 'b');
  }
  for (let col = fromCol + 3; col < toCol; col += 7) paint.back(col, 5, 1, 9, '|');
}

function buildTimberStage() {
  const a = paintRoom('A');
  a.fill(0, 12, 23, 3, '#');
  a.fill(23, 10, 14, 5, '#');
  a.fill(18, 8, 3, 1, '=');
  a.fill(40, 11, 8, 4, '#');
  a.fill(48, 12, 16, 3, '#');
  a.fill(64, 12, 16, 3, '#');
  a.fill(66, 10, 3, 2, '#');
  a.fill(69, 0, 3, 4, 'M');
  a.fill(73, 0, 5, 4, 'M');
  a.fill(78, 0, 2, 15, 'M');
  a.ladder(72, 0, 11);
  decorateOutdoor(a, 0, 64);
  a.back(64, 4, 14, 8, 'b');
  a.spawn('met', 13, 12);
  a.spawn('blader', 21, 5);
  a.spawn('blader', 28, 4);
  a.spawn('blader', 34, 6);
  a.spawn('screw', 44, 11);
  a.spawn('bigEye', 59, 12);
  a.spawn('met', 67, 10);
  a.spawn('met', 76, 12);
  a.item('energySmall', 19, 8);
  a.item('energyBig', 46, 11);

  const b1 = paintRoom('B1');
  b1.fill(0, 0, 2, 15, 'M');
  b1.fill(14, 0, 2, 15, 'M');
  b1.fill(2, 11, 12, 4, 'M');
  b1.fill(6, 10, 8, 1, '=');
  b1.fill(2, 6, 6, 1, '=');
  b1.ladder(8, 10, 14);
  b1.ladder(7, 6, 9);
  b1.ladder(3, 0, 5);
  b1.back(2, 0, 12, 15, 'b');
  b1.spawn('blaster', 2, 8, { facing: 1 });
  b1.spawn('blaster', 14, 3, { facing: -1 });
  b1.spawn('screw', 12, 10);

  const b2 = paintRoom('B2');
  b2.fill(0, 0, 2, 15, 'M');
  b2.fill(14, 0, 2, 15, 'M');
  b2.fill(2, 11, 5, 1, '=');
  b2.fill(9, 9, 3, 1, '=');
  b2.fill(12, 7, 2, 1, '=');
  b2.ladder(3, 11, 14);
  b2.ladder(12, 0, 6);
  b2.back(2, 0, 12, 15, 'b');
  b2.spawn('blader', 9, 4);
  b2.spawn('blaster', 2, 5, { facing: 1 });
  b2.item('weaponSmall', 10, 9);

  const c = paintRoom('C');
  c.fill(0, 0, 2, 15, 'M');
  c.fill(2, 12, 21, 3, '#');
  c.fill(26, 12, 6, 3, '#');
  c.fill(32, 10, 8, 5, '#');
  c.fill(40, 8, 4, 7, '#');
  c.fill(44, 12, 4, 3, '#');
  c.fill(48, 12, 16, 3, '#');
  c.fill(54, 0, 6, 11, 'M');
  c.fill(64, 12, 16, 3, '#');
  c.fill(79, 0, 1, 8, 'M');
  c.fill(79, 8, 1, 4, 'D');
  c.ladder(12, 12, 14);
  decorateOutdoor(c, 2, 54);
  c.back(60, 1, 19, 11, 'b');
  c.spawn('met', 19, 12);
  c.spawn('blader', 24, 5);
  c.spawn('blader', 29, 4);
  c.spawn('screw', 42, 8);
  c.spawn('met', 46, 12);
  c.spawn('blader', 51, 6);
  c.spawn('met', 62, 12);
  c.spawn('met', 70, 12);
  c.spawn('blader', 74, 5);
  c.item('energyBig', 37, 10);
  c.item('oneUp', 57, 12);

  const d = paintRoom('D');
  d.fill(0, 0, 16, 8, 'M');
  d.fill(0, 12, 16, 3, '#');
  d.fill(0, 8, 1, 4, 'D');
  d.fill(15, 8, 1, 4, 'D');
  d.back(1, 8, 14, 4, 'b');
  d.item('energyBig', 6, 12);
  d.item('weaponBig', 10, 12);

  const e = paintRoom('E');
  e.fill(0, 0, 16, 2, 'M');
  e.fill(0, 2, 1, 6, 'M');
  e.fill(0, 8, 1, 4, 'D');
  e.fill(15, 0, 1, 15, 'M');
  e.fill(0, 12, 15, 3, '#');
  e.back(1, 2, 14, 10, 'b');
}

// INITIALIZATION

stageDefs.timber = {
  id: 'timber',
  boss: 'timber',
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
    { room: 'A', col: 4, row: 57 },
    { room: 'C', col: 70, row: 12 },
    { room: 'D', col: 147, row: 12 },
  ],
  sky: 0x0F,
  song: timberStageSong,
  tilePalette: 'enemy',
  tiles: {
    '#': 'tileBrick',
    '=': 'tileGirder',
    M: 'tileMetal',
    H: 'tileLadder',
    m: 'tileMesh',
    '|': 'tilePillar',
    b: 'tileBack',
    t: 'tileBackTop',
  },
  groundTop: { '#': 'tileGrass' },
  build: buildTimberStage,
};
