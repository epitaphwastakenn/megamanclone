// FUNCTIONS

function plantTree(paint, col, groundRow, height) {
  paint.back(col, groundRow - height, 1, 1, 'y');
  paint.back(col, groundRow - height + 1, 1, height - 2, 'Y');
  paint.back(col, groundRow - 1, 1, 1, 'k');
}

function plantForest(paint, fromCol, toCol, groundRow) {
  const heights = [4, 6, 5, 3, 6, 4, 5];
  let index = 0;
  for (let col = fromCol; col < toCol; col += 3 + (index % 2)) {
    plantTree(paint, col, groundRow, heights[index % heights.length]);
    index++;
  }
}

function buildPineStage() {
  const a = paintRoom('A');
  a.fill(0, 12, 17, 3, '#');
  plantForest(a, 1, 16, 12);
  a.fill(17, 14, 2, 1, '^');
  a.fill(19, 10, 13, 5, '#');
  plantForest(a, 20, 31, 10);
  a.fill(32, 14, 3, 1, '^');
  a.fill(35, 12, 15, 3, 'I');
  a.fill(50, 14, 5, 1, '^');
  a.fill(51, 11, 2, 1, '=');
  a.fill(55, 12, 9, 3, '#');
  plantForest(a, 55, 63, 12);
  a.fill(64, 12, 6, 3, '#');
  a.fill(74, 12, 4, 3, '#');
  a.fill(66, 10, 2, 1, '=');
  a.fill(78, 0, 2, 15, '#');
  plantTree(a, 64, 12, 4);
  plantTree(a, 75, 12, 5);
  a.spawn('flea', 12, 12);
  a.spawn('flea', 27, 10);
  a.spawn('pengs', 30, 6);
  a.spawn('picketMan', 45, 12);
  a.spawn('flea', 59, 12);
  a.spawn('met', 76, 12);
  a.item('energySmall', 51, 11);
  a.item('weaponSmall', 29, 10);
  a.item('energyBig', 66, 10);

  const b1 = paintRoom('B1');
  b1.fill(0, 0, 2, 15, '#');
  b1.fill(14, 0, 2, 15, '#');
  b1.back(2, 0, 12, 15, 'c');
  b1.fill(2, 6, 3, 1, 'I');
  b1.fill(11, 10, 3, 1, 'I');
  b1.fill(10, 11, 4, 1, '#');
  b1.fill(2, 13, 2, 2, '#');
  b1.spawn('flea', 3, 6);
  b1.spawn('flea', 12, 10);
  b1.item('energySmall', 3, 6);

  const b2 = paintRoom('B2');
  b2.fill(0, 0, 2, 15, '#');
  b2.fill(14, 0, 2, 15, '#');
  b2.back(2, 0, 12, 15, 'c');
  b2.fill(2, 4, 4, 1, '#');
  b2.fill(10, 8, 4, 1, 'I');
  b2.spawn('pengs', 8, 3);
  b2.item('weaponBig', 11, 8);

  const c = paintRoom('C');
  c.fill(0, 0, 2, 15, '#');
  c.fill(14, 0, 66, 2, '#');
  c.back(2, 0, 78, 15, 'c');
  c.fill(2, 12, 18, 3, '#');
  c.fill(20, 12, 14, 3, 'I');
  c.fill(26, 10, 2, 2, 'I');
  c.fill(34, 14, 12, 1, '^');
  c.fill(36, 10, 2, 1, '#');
  c.fill(40, 10, 2, 1, '#');
  c.fill(44, 11, 1, 1, '#');
  c.fill(46, 12, 6, 3, '#');
  c.fill(52, 10, 8, 5, '#');
  c.fill(60, 12, 4, 3, 'I');
  c.fill(64, 12, 16, 3, '#');
  c.fill(56, 2, 4, 5, '#');
  c.fill(79, 2, 1, 6, '#');
  c.fill(79, 8, 1, 4, 'D');
  c.spawn('joe', 30, 12);
  c.spawn('met', 18, 12);
  c.spawn('flea', 48, 12);
  c.spawn('picketMan', 56, 10);
  c.spawn('bigEye', 66, 12);
  c.spawn('joe', 75, 12);
  c.item('energyBig', 23, 12);
  c.item('oneUp', 40, 10);
  c.item('weaponBig', 62, 12);

  const d = paintRoom('D');
  d.fill(0, 0, 16, 8, 'M');
  d.fill(0, 12, 16, 3, '#');
  d.fill(0, 8, 1, 4, 'D');
  d.fill(15, 8, 1, 4, 'D');
  d.back(1, 8, 14, 4, 'c');
  d.item('energyBig', 6, 12);
  d.item('weaponBig', 10, 12);

  const e = paintRoom('E');
  e.fill(0, 0, 1, 8, 'M');
  e.fill(0, 8, 1, 4, 'D');
  e.fill(15, 0, 1, 15, 'M');
  e.fill(0, 12, 15, 3, '#');
  plantTree(e, 2, 12, 5);
  plantTree(e, 5, 12, 3);
  plantTree(e, 10, 12, 4);
  plantTree(e, 13, 12, 6);
}

// INITIALIZATION

stageDefs.pine = {
  id: 'pine',
  boss: 'pine',
  cols: 176,
  rows: 60,
  rooms: [
    { id: 'A', col: 0, row: 0, cols: 80, rows: 15 },
    { id: 'B1', col: 64, row: 15, cols: 16, rows: 15 },
    { id: 'B2', col: 64, row: 30, cols: 16, rows: 15 },
    { id: 'C', col: 64, row: 45, cols: 80, rows: 15 },
    { id: 'D', col: 144, row: 45, cols: 16, rows: 15 },
    { id: 'E', col: 160, row: 45, cols: 16, rows: 15, boss: true },
  ],
  checkpoints: [
    { room: 'A', col: 3, row: 12 },
    { room: 'C', col: 70, row: 57 },
    { room: 'D', col: 147, row: 57 },
  ],
  sky: 0x0C,
  snow: true,
  song: pineStageSong,
  tilePalette: 'iceTiles',
  tiles: {
    '#': 'tileIceRock',
    '=': 'tileLog',
    I: 'tileIce',
    '^': 'tileSpike',
    M: 'tileMetal',
    H: 'tileLadder',
    c: 'tileCrystal',
    y: 'tileTreeTop',
    Y: 'tileTree',
    k: 'tileTrunk',
  },
  groundTop: { '#': 'tileSnow' },
  build: buildPineStage,
};
