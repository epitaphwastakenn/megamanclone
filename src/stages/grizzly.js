// VARIABLES

const grizzlyPeaks = [
  { x: 20, h: 96, snow: true },
  { x: 92, h: 70, snow: false },
  { x: 150, h: 118, snow: true },
  { x: 236, h: 84, snow: true },
  { x: 300, h: 64, snow: false },
];

const grizzlyFallX = 150;

// FUNCTIONS

function grizzlyPlantPine(paint, col, groundRow, height) {
  paint.back(col, groundRow - height, 1, 1, 'y');
  paint.back(col, groundRow - height + 1, 1, height - 2, 'Y');
  paint.back(col, groundRow - 1, 1, 1, 'k');
}

function grizzlyPlantForest(paint, fromCol, toCol, groundRow, heights) {
  let index = 0;
  for (let col = fromCol; col <= toCol; col += 2 + (index % 2)) {
    grizzlyPlantPine(paint, col, groundRow, heights[index % heights.length]);
    index++;
  }
}

function grizzlyCaveRoom(paint, cols) {
  paint.fill(0, 0, 2, 15, 'R');
  paint.fill(cols - 2, 0, 2, 15, 'R');
}

function buildGrizzlyRoomA() {
  const a = paintRoom('A');
  a.fill(0, 12, 18, 3, '#');
  a.fill(18, 10, 9, 5, '#');
  a.fill(29, 10, 7, 5, '#');
  a.fill(36, 8, 8, 7, '#');
  a.fill(44, 10, 6, 5, '#');
  a.fill(50, 12, 18, 3, '#');
  a.fill(50, 11, 18, 1, '~');
  a.fill(55, 11, 3, 1, 'F');
  a.fill(53, 10, 2, 5, '#');
  a.fill(58, 10, 2, 5, '#');
  a.fill(51, 0, 11, 2, '#');
  a.fill(55, 0, 3, 11, 'f');
  a.back(52, 2, 9, 9, 'b');
  a.fill(68, 10, 12, 5, '#');
  a.fill(74, 0, 6, 10, '#');
  a.fill(74, 8, 1, 2, 'X');
  a.fill(75, 8, 4, 2, 'c');
  a.ladder(71, 10, 14);
  grizzlyPlantForest(a, 1, 16, 12, [5, 7, 4, 6, 8, 5]);
  grizzlyPlantForest(a, 19, 25, 10, [4, 6, 5]);
  grizzlyPlantForest(a, 30, 34, 10, [6, 4]);
  grizzlyPlantForest(a, 37, 42, 8, [4, 5, 3]);
  grizzlyPlantForest(a, 45, 48, 10, [5, 3]);
  grizzlyPlantPine(a, 69, 10, 5);
  grizzlyPlantPine(a, 73, 10, 4);
  a.spawn('grizzlyMarmot', 13, 12);
  a.spawn('grizzlyMarmot', 33, 10);
  a.spawn('blader', 46, 4);
  a.spawn('grizzlySalmon', 51, 11, { delay: 30 });
  a.spawn('grizzlySalmon', 56, 11, { delay: 100 });
  a.platform('grizzlyLog', 62, 11, { minX: 984, maxX: 1064 });
  a.item('energySmall', 42, 8);
  a.item('weaponSmall', 23, 10);
  a.item('energySmall', 69, 10);
  a.item('oneUp', 77, 10);
}

function buildGrizzlyRoomB() {
  const b1 = paintRoom('B1');
  grizzlyCaveRoom(b1, 16);
  b1.fill(2, 6, 9, 1, 'R');
  b1.fill(2, 10, 12, 5, 'R');
  b1.fill(4, 7, 1, 1, 'R');
  b1.fill(4, 8, 1, 2, 'x');
  b1.ladder(7, 0, 5);
  b1.ladder(12, 10, 14);
  b1.back(2, 0, 12, 15, 'c');
  b1.item('weaponBig', 2, 10);
  b1.item('energySmall', 3, 6);

  const b2 = paintRoom('B2');
  grizzlyCaveRoom(b2, 16);
  b2.fill(2, 0, 8, 8, 'R');
  b2.fill(2, 12, 12, 3, 'R');
  b2.ladder(12, 0, 11);
  b2.ladder(3, 12, 14);
  b2.back(2, 0, 12, 15, 'c');
  b2.spawn('grizzlyStalactite', 7, 8, { range: 100 });
  b2.item('energySmall', 9, 12);
}

function buildGrizzlyRoomC() {
  const c = paintRoom('C');
  c.fill(0, 0, 80, 2, 'R');
  c.fill(0, 2, 2, 13, 'R');
  c.fill(2, 12, 32, 3, 'R');
  c.fill(36, 12, 2, 3, 'R');
  c.fill(38, 10, 10, 5, 'R');
  c.fill(48, 8, 2, 7, 'R');
  c.fill(48, 8, 2, 2, 'x');
  c.fill(50, 6, 8, 9, 'R');
  c.fill(50, 8, 8, 2, 'c');
  c.fill(58, 8, 2, 7, 'R');
  c.fill(58, 8, 2, 2, 'x');
  c.fill(60, 10, 4, 5, 'R');
  c.fill(64, 12, 16, 3, 'R');
  c.fill(20, 2, 4, 1, 'R');
  c.fill(40, 2, 6, 2, 'R');
  c.fill(64, 2, 16, 4, 'R');
  c.fill(79, 6, 1, 2, 'R');
  c.fill(79, 8, 1, 4, 'D');
  c.ladder(3, 0, 11);
  c.back(0, 0, 80, 15, 'c');
  c.spawn('met', 17, 12);
  c.spawn('grizzlyBat', 25, 2);
  c.spawn('grizzlyStalactite', 29, 2);
  c.spawn('grizzlyStalactite', 32, 2);
  c.spawn('grizzlyRoller', 44, 10);
  c.spawn('grizzlyStalactite', 52, 2, { range: 40 });
  c.spawn('grizzlyStalactite', 55, 2, { range: 40 });
  c.spawn('grizzlyStalactite', 66, 6);
  c.spawn('grizzlyStalactite', 69, 6);
  c.spawn('grizzlyStalactite', 72, 6);
  c.spawn('grizzlyBat', 75, 6);
  c.item('energySmall', 11, 12);
  c.item('energyBig', 52, 10);
  c.item('weaponBig', 55, 10);
  c.item('weaponSmall', 37, 12);
}

function buildGrizzlyRoomsDE() {
  const d = paintRoom('D');
  d.fill(0, 0, 16, 8, 'R');
  d.fill(0, 12, 16, 3, 'R');
  d.fill(0, 8, 1, 4, 'D');
  d.fill(15, 8, 1, 4, 'D');
  d.fill(4, 9, 1, 1, 's');
  d.fill(11, 10, 1, 1, 's');
  d.back(1, 8, 14, 4, 'c');
  d.item('energyBig', 6, 12);
  d.item('weaponBig', 10, 12);

  const e = paintRoom('E');
  e.fill(0, 0, 10, 2, 'R');
  e.fill(13, 0, 3, 2, 'R');
  e.fill(0, 2, 1, 6, 'R');
  e.fill(0, 8, 1, 4, 'D');
  e.fill(15, 0, 1, 15, 'R');
  e.fill(0, 12, 15, 3, 'R');
  e.fill(3, 11, 1, 1, 'o');
  e.fill(12, 11, 1, 1, 'o');
  e.fill(4, 5, 1, 1, 's');
  e.fill(9, 8, 1, 1, 's');
  e.fill(11, 4, 1, 1, 's');
  e.back(1, 0, 14, 12, 'c');
}

function buildGrizzlyStage() {
  buildGrizzlyRoomA();
  buildGrizzlyRoomB();
  buildGrizzlyRoomC();
  buildGrizzlyRoomsDE();
}

function grizzlyPeakHeight(x) {
  const wrapped = ((x % 320) + 320) % 320;
  let best = 0;
  for (const peak of grizzlyPeaks) {
    for (const offset of [-320, 0, 320]) best = Math.max(best, peak.h - Math.abs(wrapped - peak.x - offset) * 0.9);
  }
  return best;
}

function grizzlySnowLine(x) {
  const wrapped = ((x % 320) + 320) % 320;
  let line = 0;
  for (const peak of grizzlyPeaks) {
    if (!peak.snow) continue;
    for (const offset of [-320, 0, 320]) {
      const distance = Math.abs(wrapped - peak.x - offset);
      if (distance < 22) line = Math.max(line, peak.h - 18 + ((x >> 2) % 3) * 2 - distance * 0.1);
    }
  }
  return line;
}

function grizzlyHillHeight(x) {
  const wrapped = ((x % 24) + 24) % 24;
  const tree = 18 - Math.abs(wrapped - 12) * 1.4;
  return 30 + Math.max(0, tree) + Math.sin(x / 40) * 6;
}

function grizzlyDrawMountains(ctx, top) {
  const base = top + 176;
  const shift = camera.x * 0.2;
  for (let sx = 0; sx < screenWidth; sx++) {
    const x = sx + shift;
    const height = Math.floor(grizzlyPeakHeight(x));
    if (height <= 0) continue;
    ctx.fillStyle = nesPalette[0x11];
    ctx.fillRect(sx, base - height, 1, height);
    const snow = Math.floor(grizzlySnowLine(x));
    if (snow > 0 && snow < height) {
      ctx.fillStyle = nesPalette[0x31];
      ctx.fillRect(sx, base - height, 1, height - snow);
    }
  }
  const fallLeft = Math.round(grizzlyFallX - (shift % 320));
  for (const left of [fallLeft, fallLeft + 320]) {
    if (left < -8 || left > screenWidth) continue;
    const fallTop = base - 70;
    for (let y = fallTop; y < base; y++) {
      const phase = (y - game.timer + left) & 7;
      ctx.fillStyle = nesPalette[phase < 3 ? 0x30 : 0x21];
      ctx.fillRect(left, y, 5, 1);
      ctx.fillStyle = nesPalette[phase < 5 ? 0x31 : 0x30];
      ctx.fillRect(left + 1, y, 3, 1);
    }
  }
}

function grizzlyDrawHills(ctx, top) {
  const base = top + 200;
  const shift = camera.x * 0.45;
  ctx.fillStyle = nesPalette[0x0A];
  for (let sx = 0; sx < screenWidth; sx++) {
    const height = Math.floor(grizzlyHillHeight(sx + shift));
    ctx.fillRect(sx, base - height, 1, height + 40);
  }
}

function grizzlyDrawBackground(ctx) {
  const room = rooms.find(entry => entry.id === 'A');
  const bounds = roomBounds(room);
  const top = bounds.top - camera.y;
  if (top >= screenHeight || top + screenHeight <= 0) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(bounds.left - camera.x, top, bounds.right - bounds.left, screenHeight);
  ctx.clip();
  grizzlyDrawMountains(ctx, top);
  grizzlyDrawHills(ctx, top);
  ctx.restore();
}

function grizzlyDrawForeground(ctx) {
  const overflow = camera.y + screenHeight - currentRoomBounds().bottom;
  if (overflow > 0 && !stage.transition) {
    ctx.fillStyle = nesPalette[0x0F];
    ctx.fillRect(0, screenHeight - overflow, screenWidth, overflow);
  }
  const top = -camera.y;
  if (top >= screenHeight || top + screenHeight <= 0 || camera.x > 360) return;
  for (const baseX of [12, 40, 118, 150, 230, 262, 330]) {
    const sx = Math.round(baseX - camera.x * 1.35);
    if (sx < -16 || sx > screenWidth) continue;
    drawSprite(ctx, 'grizzlyForePine', sx, top + screenHeight + 6 + (baseX % 3) * 4, false, 'grizzlyPines');
  }
}

function grizzlyStageUpdate() {
  if (stage.state !== 'play' || game.timer % 18 !== 0) return;
  const x = 56 * tileSize + 8 + ((game.timer / 18) % 3) * 12 - 12;
  if (onScreen(x, 11 * tileSize, 0)) spawnEffect('splash', x, 11 * tileSize + 2);
}

// INITIALIZATION

platformTypes.grizzlyLog = {
  w: 48,
  h: 7,
  sprite: 'grizzlyLogPlatform',
  palette: 'grizzlyRocks',
  init(p, spawn) {
    p.minX = spawn.minX;
    p.maxX = spawn.maxX;
    p.baseY = spawn.y - 3;
    p.y = p.baseY;
    p.prevY = p.y;
    p.dir = 1;
    p.pause = 30;
    p.sink = 0;
  },
  update(p) {
    if (p.pause > 0) p.pause--;
    else {
      p.x += p.dir * 0.6;
      if (p.x >= p.maxX || p.x <= p.minX) {
        p.x = Math.max(p.minX, Math.min(p.maxX, p.x));
        p.dir = -p.dir;
        p.pause = 50;
      }
    }
    p.sink = p.carrying ? Math.min(3, p.sink + 0.25) : Math.max(0, p.sink - 0.25);
    p.y = p.baseY + Math.round(Math.sin(p.timer / 18)) + Math.floor(p.sink);
  },
};

stageDefs.grizzly = {
  id: 'grizzly',
  boss: 'grizzly',
  cols: 176,
  rows: 60,
  rooms: [
    { id: 'A', col: 0, row: 0, cols: 80, rows: 15 },
    { id: 'B1', col: 64, row: 15, cols: 16, rows: 15, sky: 0x0F },
    { id: 'B2', col: 64, row: 30, cols: 16, rows: 15, sky: 0x0F },
    { id: 'C', col: 64, row: 45, cols: 80, rows: 15, sky: 0x0F },
    { id: 'D', col: 144, row: 45, cols: 16, rows: 15, sky: 0x0F },
    { id: 'E', col: 160, row: 45, cols: 16, rows: 15, boss: true, sky: 0x0F },
  ],
  checkpoints: [
    { room: 'A', col: 3, row: 12 },
    { room: 'C', col: 70, row: 57 },
    { room: 'D', col: 147, row: 57 },
  ],
  sky: 0x21,
  song: grizzlyStageSong,
  tilePalette: 'grizzlyRocks',
  tilePalettes: {
    R: 'grizzlyCave',
    x: 'grizzlyCave',
    c: 'grizzlyCaveBack',
    s: 'grizzlyCaveBack',
    '~': 'grizzlyWater',
    f: 'grizzlyWater',
    F: 'grizzlyWater',
    y: 'grizzlyPines',
    Y: 'grizzlyPines',
    k: 'grizzlyPines',
    H: 'grizzlyLadder',
  },
  tiles: {
    '#': 'tileGrizzlyRock',
    R: 'tileGrizzlyRock',
    X: 'tileGrizzlyCrack',
    x: 'tileGrizzlyCrack',
    c: 'tileGrizzlyCaveBack',
    s: 'tileGrizzlyScratch',
    b: 'tileGrizzlyCliffBack',
    y: 'tileGrizzlyPineTop',
    Y: 'tileGrizzlyPine',
    k: 'tileGrizzlyPineTrunk',
    H: 'tileLadder',
    o: 'tileGrizzlyBones',
  },
  tileFrames: {
    '~': { names: ['tileGrizzlySurface0', 'tileGrizzlySurface1', 'tileGrizzlySurface2', 'tileGrizzlySurface3'], rate: 10 },
    f: { names: ['tileGrizzlyFall0', 'tileGrizzlyFall1', 'tileGrizzlyFall2', 'tileGrizzlyFall3'], rate: 4 },
    F: { names: ['tileGrizzlyFoam0', 'tileGrizzlyFoam1', 'tileGrizzlyFoam2', 'tileGrizzlyFoam3'], rate: 6, stagger: 2 },
  },
  groundTop: { '#': 'tileGrizzlyGrass', R: 'tileGrizzlyCaveTop' },
  tileTypes: { R: 'solid', X: 'breakable', x: 'breakable', '~': 'water', F: 'water' },
  brokenTile: 'c',
  bossSpawn: { col: 11.5, y: 8 },
  update: grizzlyStageUpdate,
  drawBackground: grizzlyDrawBackground,
  drawForeground: grizzlyDrawForeground,
  build: buildGrizzlyStage,
};
