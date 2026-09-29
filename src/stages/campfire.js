// VARIABLES

const campfirePits = [];
const campfireStars = [];
const campfireEmbers = [];
const campfireFarPines = [
  [0, 'campfirePineSmall', 2],
  [13, 'campfirePineBig', 6],
  [27, 'campfirePineSmall', 4],
  [41, 'campfirePineSmall', 1],
  [55, 'campfirePineBig', 8],
  [71, 'campfirePineSmall', 3],
  [86, 'campfirePineBig', 5],
  [101, 'campfirePineSmall', 2],
  [114, 'campfirePineSmall', 5],
];
const campfireNearPines = [
  [0, 'campfirePineBig', 30],
  [22, 'campfirePineBig', 40],
  [70, 'campfirePineBig', 34],
  [96, 'campfirePineSmall', 18],
  [118, 'campfirePineBig', 44],
];
let campfireTick = 0;
let campfireEmberCameraX = 0;

// FUNCTIONS

function campfireRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

function campfireMakeSky() {
  const random = campfireRandom(9);
  for (let i = 0; i < 56; i++) campfireStars.push({ x: Math.floor(random() * 512), y: Math.floor(random() * 150), phase: Math.floor(random() * 90), big: random() < 0.2 });
  for (let i = 0; i < 18; i++) {
    campfireEmbers.push({ x: random() * screenWidth, y: random() * screenHeight, speed: 0.25 + random() * 0.45, drift: random() * Math.PI * 2, size: random() < 0.3 ? 2 : 1 });
  }
}

function campfirePit(paint, col, row, offset) {
  paint.fill(col, row, 1, 1, 'f');
  paint.fill(col + 1, row, 1, 1, 'F');
  campfirePits.push({ x: (paint.room.col + col + 1) * tileSize, y: (paint.room.row + row) * tileSize, offset });
}

function campfireTent(paint, col, row) {
  paint.back(col, row, 1, 1, '1');
  paint.back(col + 1, row, 1, 1, '2');
  paint.back(col, row + 1, 1, 1, '3');
  paint.back(col + 1, row + 1, 1, 1, '4');
}

function campfireTower(paint, col, row, width, height) {
  for (let y = row + 3; y < row + height; y += 4) paint.back(col, y, width, 1, 'y');
  paint.back(col, row, 1, height, '|');
  paint.back(col + width - 1, row, 1, height, '|');
  for (let y = row; y < row + height; y++) {
    if ((y - row) % 4 === 3) continue;
    paint.back(col + 1, y, 1, 1, 'x');
    paint.back(col + width - 2, y, 1, 1, 'x');
  }
}

function campfireLamp(paint, col, groundRow) {
  paint.back(col, groundRow - 3, 1, 1, 'j');
  paint.back(col, groundRow - 2, 1, 2, 'i');
}

function campfireTable(paint, col, row) {
  paint.fill(col, row, 1, 1, 'T');
  paint.fill(col + 1, row, 1, 1, 'U');
}

function campfirePitPhase(pit) {
  const t = (campfireTick + pit.offset) % 180;
  if (t < 90) return { state: 'idle', t };
  if (t < 130) return { state: 'warn', t: t - 90 };
  return { state: 'flare', t: t - 130 };
}

function campfireFlareHeight(t) {
  return Math.round(58 * Math.min(1, (t + 1) / 5, (50 - t) / 6));
}

function updateCampfirePits() {
  const playing = stage.state === 'play';
  const hitBox = playerHitBox();
  for (const pit of campfirePits) {
    const phase = campfirePitPhase(pit);
    const visible = playing && onScreen(pit.x, pit.y, 8);
    if (visible && phase.state === 'warn') {
      if (phase.t === 0) campfireSound('crackle');
      if (phase.t % 6 === 0) campfireSparks(pit.x, pit.y - 2, 2);
      if (phase.t % 10 === 5) campfirePuff(pit.x + (Math.random() - 0.5) * 16, pit.y - 10);
    }
    if (phase.state !== 'flare') continue;
    const height = campfireFlareHeight(phase.t);
    if (visible && phase.t === 0) campfireSound('roar');
    if (visible && phase.t % 5 === 0) campfireSparks(pit.x, pit.y - height, 1);
    if (!playing || height < 10 || !player.control) continue;
    if (boxesOverlap({ left: pit.x - 13, top: pit.y - height + 4, right: pit.x + 13, bottom: pit.y }, hitBox)) hurtPlayer(4);
  }
}

function updateCampfireEmbers() {
  const scroll = camera.x - campfireEmberCameraX;
  campfireEmberCameraX = camera.x;
  for (const ember of campfireEmbers) {
    ember.y -= ember.speed;
    ember.x += Math.sin(ember.drift + ember.y / 18) * 0.35 - scroll * 0.6;
    if (ember.y < 0) {
      ember.y += screenHeight;
      ember.x = (((ember.x * 7) % screenWidth) + screenWidth) % screenWidth;
    }
    if (ember.x < 0) ember.x += screenWidth;
    if (ember.x >= screenWidth) ember.x -= screenWidth;
  }
}

function updateCampfireStage() {
  campfireTick++;
  updateCampfireEmbers();
  updateCampfirePits();
}

function startCampfireStage() {
  campfireEmberCameraX = camera.x;
}

function campfireHorizon() {
  return Math.round(140 + (720 - camera.y) * 0.04);
}

function drawCampfireStars(ctx, horizon) {
  for (const star of campfireStars) {
    const x = (((star.x - Math.floor(camera.x * 0.06)) % 512) + 512) % 512;
    if (x >= screenWidth || star.y > horizon - 40) continue;
    const phase = (game.timer + star.phase) % 90;
    const bright = phase >= 60 && phase < 72;
    ctx.fillStyle = nesPalette[bright ? 0x30 : star.big ? 0x10 : 0x2D];
    ctx.fillRect(x, star.y, 1, 1);
    if (!star.big || !bright) continue;
    ctx.fillRect(x - 1, star.y, 3, 1);
    ctx.fillRect(x, star.y - 1, 1, 3);
  }
}

function drawCampfirePines(ctx, list, period, parallax, baseY, palette) {
  const offset = Math.floor(camera.x * parallax) % period;
  for (let base = -period; base < screenWidth + period; base += period) {
    for (const [x, name, sink] of list) drawSprite(ctx, name, base + x - offset, baseY + sink, false, palette);
  }
}

function drawCampfireBackground(ctx) {
  const horizon = campfireHorizon();
  drawCampfireStars(ctx, horizon);
  drawSprite(ctx, 'campfireMoon', 190 - Math.floor(camera.x * 0.02), 22, false, 'campfireFar');
  ctx.fillStyle = nesPalette[0x02];
  ctx.fillRect(0, horizon - 40, screenWidth, 40);
  ctx.fillStyle = nesPalette[0x03];
  ctx.fillRect(0, horizon - 14, screenWidth, 14);
  drawCampfirePines(ctx, campfireFarPines, 128, 0.25, horizon, 'campfireFar');
  ctx.fillStyle = nesPalette[0x0C];
  ctx.fillRect(0, horizon + 6, screenWidth, screenHeight);
  const glowOffset = Math.floor(camera.x * 0.25) % 128;
  for (let base = -128; base < screenWidth + 128; base += 128) {
    for (const x of [35, 97]) {
      ctx.fillStyle = nesPalette[(game.timer + x) % 16 < 8 ? 0x27 : 0x16];
      ctx.fillRect(base + x - glowOffset, horizon + 12, 2, 2);
    }
  }
  drawCampfirePines(ctx, campfireNearPines, 144, 0.5, horizon, 'campfireNear');
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(0, horizon + 34, screenWidth, screenHeight);
}

function drawCampfirePits(ctx) {
  for (const pit of campfirePits) {
    if (!onScreen(pit.x, pit.y, 48)) continue;
    const phase = campfirePitPhase(pit);
    const sx = pit.x - camera.x;
    const sy = pit.y - camera.y;
    const frame = Math.floor(campfireTick / 4) % 3;
    if (phase.state === 'warn') {
      const size = phase.t < 20 ? 'S' : 'M';
      drawSprite(ctx, 'campfireFire' + size + frame, sx - 8, sy + 3, false, 'campfireBoss');
      drawSprite(ctx, 'campfireFire' + size + ((frame + 1) % 3), sx + 8, sy + 3, true, 'campfireBoss');
    } else if (phase.state === 'flare') {
      const name = 'campfireFlare' + frame;
      const full = spriteDefs[name].height;
      const height = campfireFlareHeight(phase.t);
      ctx.save();
      ctx.beginPath();
      ctx.rect(sx - 16, sy - 80, 32, 83);
      ctx.clip();
      drawSprite(ctx, name, sx, sy + 3 + Math.max(0, full - height - 6), false, 'campfireBoss');
      ctx.restore();
    }
  }
}

function drawCampfireEmbers(ctx) {
  campfireEmbers.forEach((ember, index) => {
    const phase = (campfireTick + index * 7) % 24;
    ctx.fillStyle = nesPalette[phase < 8 ? 0x28 : phase < 16 ? 0x27 : 0x16];
    ctx.fillRect(Math.floor(ember.x), Math.floor(ember.y), ember.size, 1);
  });
}

function drawCampfireForeground(ctx) {
  drawCampfirePits(ctx);
  drawCampfireEmbers(ctx);
}

function drawCampfireLift(ctx, platform, sx, sy) {
  ctx.fillStyle = nesPalette[0x37];
  ctx.fillRect(Math.round(sx) - 21, 0, 1, Math.round(sy));
  ctx.fillRect(Math.round(sx) + 20, 0, 1, Math.round(sy));
  drawSprite(ctx, 'campfireLift', sx, sy, false, 'campfireBoss');
}

function drawCampfireRaft(ctx, platform, sx, sy) {
  const cableY = Math.round(platform.cableY - camera.y);
  const left = Math.round(platform.minX - 26 - camera.x);
  const right = Math.round(platform.maxX + 26 - camera.x);
  ctx.fillStyle = nesPalette[0x00];
  ctx.fillRect(left, cableY, right - left, 1);
  ctx.fillStyle = nesPalette[0x37];
  ctx.fillRect(Math.round(sx) - 21, cableY, 1, Math.round(sy) - cableY);
  ctx.fillRect(Math.round(sx) + 20, cableY, 1, Math.round(sy) - cableY);
  ctx.fillStyle = nesPalette[0x10];
  ctx.fillRect(Math.round(sx) - 23, cableY - 2, 5, 3);
  ctx.fillRect(Math.round(sx) + 18, cableY - 2, 5, 3);
  drawSprite(ctx, 'campfireLift', sx, sy, false, 'campfireBoss');
}

function buildCampfireStage() {
  campfirePits.length = 0;

  const a = paintRoom('A');
  a.fill(0, 12, 80, 3, '#');
  campfireTent(a, 1, 10);
  campfireLamp(a, 5, 12);
  campfireTable(a, 8, 11);
  a.back(11, 11, 1, 1, 's');
  a.back(14, 11, 2, 1, 'w');
  campfirePit(a, 18, 12, 0);
  campfireLamp(a, 23, 12);
  a.back(28, 6, 7, 1, 'y');
  a.back(28, 7, 1, 5, '|');
  a.back(34, 7, 1, 5, '|');
  a.spawn('emberBat', 31, 7, { hang: 1 });
  campfireTable(a, 38, 11);
  campfireTent(a, 42, 10);
  a.spawn('mallowBot', 48, 12, { facing: -1 });
  a.back(50, 6, 1, 6, '|');
  a.back(63, 6, 1, 6, '|');
  a.back(51, 6, 12, 1, '~');
  campfirePit(a, 53, 12, 0);
  a.spawn('emberBat', 57, 7, { hang: -6 });
  a.item('energySmall', 57, 12);
  campfirePit(a, 59, 12, 90);
  campfireLamp(a, 67, 12);
  campfireTower(a, 68, 0, 10, 12);
  a.fill(78, 0, 2, 15, 'S');
  a.ladder(72, 0, 11);
  a.item('energyBig', 75, 12);

  const b1 = paintRoom('B1');
  b1.fill(0, 0, 2, 15, 'L');
  b1.fill(14, 0, 2, 15, 'L');
  b1.fill(5, 10, 9, 1, '-');
  b1.fill(2, 12, 3, 3, 'S');
  b1.fill(5, 3, 9, 1, '-');
  b1.ladder(8, 10, 14);
  b1.ladder(12, 0, 2);
  campfireTower(b1, 2, 0, 12, 15);
  b1.platform('campLift', 3, 10, { rise: 7 });
  b1.item('energySmall', 11, 10);
  b1.item('weaponSmall', 6, 3);

  const b2 = paintRoom('B2');
  b2.fill(0, 0, 2, 15, 'L');
  b2.fill(14, 0, 2, 15, 'L');
  b2.fill(2, 11, 12, 1, '-');
  b2.fill(3, 9, 4, 1, '-');
  b2.fill(8, 7, 4, 1, '-');
  b2.fill(3, 5, 4, 1, '-');
  b2.fill(9, 3, 3, 1, '-');
  b2.ladder(12, 11, 14);
  b2.ladder(3, 0, 4);
  campfireTower(b2, 2, 0, 12, 15);
  b2.item('weaponBig', 10, 7);
  b2.item('oneUp', 10, 3);

  const c = paintRoom('C');
  c.fill(0, 0, 1, 12, 'L');
  c.fill(0, 12, 16, 3, '#');
  c.ladder(3, 12, 14);
  campfireTent(c, 6, 10);
  campfireLamp(c, 9, 12);
  c.spawn('met', 11, 12);
  c.fill(13, 11, 1, 1, 'k');
  c.fill(16, 11, 3, 4, '#');
  c.fill(19, 10, 3, 5, '#');
  c.fill(22, 9, 3, 6, '#');
  c.fill(25, 8, 13, 7, '#');
  c.spawn('logPile', 30, 8, { facing: -1 });
  c.back(33, 7, 2, 1, 'w');
  campfireLamp(c, 36, 8);
  c.fill(38, 8, 3, 1, '-');
  c.back(38, 9, 1, 6, '|');
  c.back(40, 3, 1, 5, '|');
  c.back(40, 9, 1, 6, '|');
  c.platform('campRaft', 42, 8, { span: 4 });
  c.fill(48, 8, 3, 1, '-');
  c.back(48, 3, 1, 5, '|');
  c.back(48, 9, 1, 6, '|');
  c.back(50, 9, 1, 6, '|');
  c.fill(51, 8, 5, 7, '#');
  c.back(53, 7, 1, 1, 's');
  c.fill(56, 12, 3, 3, '#');
  c.fill(59, 12, 21, 3, 'P');
  c.fill(57, 0, 23, 3, 'R');
  c.fill(58, 3, 1, 7, 'L');
  c.fill(79, 3, 1, 5, 'L');
  c.fill(79, 8, 1, 4, 'D');
  c.back(61, 6, 1, 1, 'o');
  c.back(67, 6, 1, 1, 'o');
  c.back(73, 6, 1, 1, 'o');
  c.back(59, 3, 20, 9, 'l');
  campfirePit(c, 63, 12, 0);
  c.spawn('emberBat', 66, 3, { hang: 7 });
  c.item('energyBig', 67, 12);
  campfirePit(c, 69, 12, 90);
  c.back(77, 11, 1, 1, 'w');
  c.spawn('mallowBot', 76, 12, { facing: -1 });

  const d = paintRoom('D');
  d.fill(0, 0, 16, 3, 'R');
  d.fill(0, 3, 16, 5, 'L');
  d.fill(0, 12, 16, 3, 'P');
  d.fill(0, 8, 1, 4, 'D');
  d.fill(15, 8, 1, 4, 'D');
  d.back(4, 9, 1, 1, 'o');
  d.back(11, 9, 1, 1, 'o');
  d.back(1, 8, 14, 4, 'l');
  d.item('energyBig', 6, 12);
  d.item('weaponBig', 9, 12);

  const e = paintRoom('E');
  e.fill(0, 0, 1, 8, 'L');
  e.fill(0, 8, 1, 4, 'D');
  e.fill(15, 0, 1, 15, 'S');
  e.fill(0, 12, 15, 3, '#');
  campfireTent(e, 11, 10);
  campfireLamp(e, 3, 12);
  e.back(7, 11, 2, 1, 'w');
}

// INITIALIZATION

campfireMakeSky();

Object.assign(platformTypes, {
  campLift: {
    w: 48,
    h: 8,
    init(platform, spawn) {
      platform.bottomY = spawn.y;
      platform.topY = spawn.y - spawn.rise * tileSize;
      platform.dir = -1;
      platform.wait = 50;
    },
    update(platform) {
      if (platform.wait > 0) {
        platform.wait--;
        return;
      }
      platform.y += platform.dir * 0.8;
      if (platform.y <= platform.topY || platform.y >= platform.bottomY) {
        platform.y = Math.max(platform.topY, Math.min(platform.bottomY, platform.y));
        platform.dir = -platform.dir;
        platform.wait = 60;
      }
    },
    draw: drawCampfireLift,
  },
  campRaft: {
    w: 48,
    h: 8,
    init(platform, spawn) {
      platform.minX = spawn.x;
      platform.maxX = spawn.x + spawn.span * tileSize;
      platform.cableY = spawn.y - 72;
      platform.dir = 1;
      platform.wait = 50;
    },
    update(platform) {
      if (platform.wait > 0) {
        platform.wait--;
        return;
      }
      platform.x += platform.dir * 0.75;
      if (platform.x <= platform.minX || platform.x >= platform.maxX) {
        platform.x = Math.max(platform.minX, Math.min(platform.maxX, platform.x));
        platform.dir = -platform.dir;
        platform.wait = 50;
      }
    },
    draw: drawCampfireRaft,
  },
});

stageDefs.campfire = {
  id: 'campfire',
  boss: 'campfire',
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
    { room: 'A', col: 3, row: 57 },
    { room: 'C', col: 68, row: 12 },
    { room: 'D', col: 147, row: 12 },
  ],
  sky: 0x0F,
  song: campfireStageSong,
  tilePalette: 'campfireTiles',
  tiles: {
    '#': 'tileCampDirt',
    S: 'tileCampStone',
    P: 'tileCampFloor',
    L: 'tileCampLogWall',
    R: 'tileCampRoof',
    '-': 'tileCampPlank',
    T: 'tileCampTableL',
    U: 'tileCampTableR',
    H: 'tileCampLadder',
    l: 'tileCampLogBack',
    '|': 'tileCampPost',
    x: 'tileCampBrace',
    y: 'tileCampBeam',
    w: 'tileCampWoodpile',
    k: 'tileCampStump',
    o: 'tileCampWindow',
    i: 'tileCampLampPost',
    s: 'tileCampSign',
    1: 'tileCampTent0',
    2: 'tileCampTent1',
    3: 'tileCampTent2',
    4: 'tileCampTent3',
  },
  tileFrames: {
    f: { names: ['tileCampPitL0', 'tileCampPitL1'], rate: 10 },
    F: { names: ['tileCampPitR0', 'tileCampPitR1'], rate: 10 },
    j: { names: ['tileCampLantern0', 'tileCampLantern1'], rate: 14, stagger: 5 },
    '~': { names: ['tileCampLights0', 'tileCampLights1'], rate: 24, stagger: 24 },
  },
  groundTop: { '#': 'tileCampGrass' },
  tileTypes: { S: 'solid', P: 'solid', L: 'solid', R: 'solid', k: 'solid', f: 'solid', F: 'solid', '-': 'oneWay', T: 'oneWay', U: 'oneWay' },
  onStart: startCampfireStage,
  update: updateCampfireStage,
  drawBackground: drawCampfireBackground,
  drawForeground: drawCampfireForeground,
  build: buildCampfireStage,
};
