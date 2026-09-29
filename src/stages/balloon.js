// VARIABLES

const canyonWind = { timer: 0, particles: [] };
const canyonWindCycle = { calm: 180, warn: 60, gust: 75 };
const canyonSkyBands = [[0, 0x02], [24, 0x03], [50, 0x13], [78, 0x24], [102, 0x25], [124, 0x26], [146, 0x27], [168, 0x28], [192, 0x38]];
const canyonFarMesas = [[0, 64, 30], [96, 36, 18], [160, 92, 42], [290, 48, 26], [372, 84, 36], [470, 30, 14]];
const canyonNearMesas = [[40, 110, 44], [230, 70, 30], [340, 130, 52], [500, 50, 24]];
const canyonClouds = [[10, 34, 44], [120, 62, 30], [200, 22, 56], [330, 48, 38], [430, 78, 26]];

// FUNCTIONS

function canyonCactus(paint, col, groundRow, height) {
  paint.back(col, groundRow - height, 1, 1, 'y');
  paint.back(col, groundRow - height + 1, 1, height - 1, 'Y');
}

function buildCanyonA() {
  const a = paintRoom('A');
  a.fill(0, 12, 18, 3, '#');
  a.fill(20, 12, 9, 3, '#');
  a.fill(29, 7, 15, 8, '#');
  a.fill(44, 14, 11, 1, '#');
  a.ladder(44, 7, 13);
  a.ladder(54, 9, 13);
  a.fill(55, 9, 6, 6, '#');
  a.fill(61, 12, 19, 3, '#');
  a.fill(69, 0, 3, 4, 'M');
  a.fill(73, 0, 5, 4, 'M');
  a.fill(78, 0, 2, 15, 'M');
  a.ladder(72, 0, 11);
  a.back(69, 4, 9, 8, 'b');
  canyonCactus(a, 5, 12, 3);
  canyonCactus(a, 12, 12, 2);
  canyonCactus(a, 22, 12, 3);
  canyonCactus(a, 32, 7, 3);
  canyonCactus(a, 39, 7, 2);
  canyonCactus(a, 58, 9, 3);
  canyonCactus(a, 64, 12, 2);
  a.back(9, 11, 1, 1, 'j');
  a.back(16, 11, 1, 1, 'j');
  a.back(35, 6, 1, 1, 'j');
  a.back(47, 13, 1, 1, 'j');
  a.back(66, 11, 1, 1, 'j');
  a.back(25, 11, 1, 1, 'f');
  a.back(30, 6, 1, 1, 'f');
  a.platform('canyonLoop', 27, 11, { range: 5, period: 320 });
  a.platform('canyonSink', 46, 8, { depth: 2 });
  a.platform('canyonSink', 51, 8, { depth: 2 });
  a.spawn('kiteBot', 16, 10, { dir: -1 });
  a.spawn('met', 24, 12);
  a.spawn('vultureBot', 37, 7);
  a.spawn('kiteBot', 67, 10, { dir: -1 });
  a.item('energySmall', 41, 7);
  a.item('energyBig', 49, 14);
  a.item('weaponSmall', 57, 9);
}

function buildCanyonB() {
  const b1 = paintRoom('B1');
  b1.fill(0, 0, 2, 15, 'M');
  b1.fill(14, 0, 2, 15, 'M');
  b1.fill(2, 11, 12, 4, '#');
  b1.ladder(8, 11, 14);
  b1.fill(2, 4, 6, 1, '#');
  b1.ladder(3, 0, 3);
  b1.back(2, 5, 2, 6, 'b');
  b1.back(12, 0, 2, 11, 'b');
  canyonCactus(b1, 5, 11, 2);
  b1.platform('canyonLoop', 11, 10, { range: 6, period: 340 });
  b1.item('energySmall', 6, 4);

  const b2 = paintRoom('B2');
  b2.fill(0, 0, 2, 15, 'M');
  b2.fill(14, 0, 2, 15, 'M');
  b2.fill(2, 11, 12, 4, '#');
  b2.ladder(3, 11, 14);
  b2.fill(8, 9, 4, 1, '-');
  b2.fill(3, 7, 4, 1, '-');
  b2.fill(8, 5, 4, 1, '-');
  b2.fill(3, 3, 4, 1, '-');
  b2.ladder(4, 0, 2);
  b2.back(2, 0, 1, 11, 'b');
  b2.back(13, 0, 1, 11, 'b');
  b2.back(9, 10, 1, 1, 'v');
  b2.back(4, 8, 1, 3, 'v');
  b2.back(9, 6, 1, 3, 'v');
  b2.spawn('airMine', 12, 8);
  b2.item('weaponSmall', 6, 3);
}

function buildCanyonC() {
  const c = paintRoom('C');
  c.fill(0, 0, 2, 15, 'M');
  c.fill(2, 12, 14, 3, '#');
  c.ladder(4, 12, 14);
  c.fill(27, 10, 5, 5, '#');
  c.fill(43, 10, 7, 5, '#');
  c.fill(52, 10, 6, 5, '#');
  c.fill(60, 9, 6, 6, '#');
  c.fill(64, 5, 2, 1, '-');
  c.fill(71, 12, 8, 3, '#');
  c.fill(79, 0, 1, 8, 'M');
  c.fill(79, 8, 1, 4, 'D');
  c.fill(79, 12, 1, 3, '#');
  canyonCactus(c, 8, 12, 3);
  canyonCactus(c, 13, 12, 2);
  canyonCactus(c, 29, 10, 2);
  canyonCactus(c, 47, 10, 3);
  canyonCactus(c, 73, 12, 3);
  canyonCactus(c, 60, 9, 2);
  c.back(11, 11, 1, 1, 'j');
  c.back(44, 9, 1, 1, 'j');
  c.back(62, 8, 1, 1, 'j');
  c.back(55, 9, 1, 1, 'j');
  c.back(15, 11, 1, 1, 'f');
  c.back(77, 11, 1, 1, 'j');
  c.platform('canyonLoop', 18, 12, { range: 2, period: 200 });
  c.platform('canyonLoop', 23, 12, { range: 2, period: 200 });
  c.platform('canyonSink', 34, 10, { depth: 2 });
  c.platform('canyonSink', 39, 10, { depth: 2 });
  c.platform('canyonLoop', 68, 10, { range: 3, period: 260 });
  c.spawn('kiteBot', 28, 9, { dir: -1 });
  c.spawn('airMine', 36, 7);
  c.spawn('vultureBot', 48, 10);
  c.spawn('kiteBot', 62, 7, { dir: -1 });
  c.spawn('joe', 76, 12);
  c.item('energyBig', 30, 10);
  c.item('weaponBig', 45, 10);
  c.item('oneUp', 65, 5);
}

function buildCanyonBoss() {
  const d = paintRoom('D');
  d.fill(0, 0, 16, 8, 'M');
  d.fill(0, 12, 16, 3, '#');
  d.fill(0, 8, 1, 4, 'D');
  d.fill(15, 8, 1, 4, 'D');
  d.back(1, 8, 14, 4, 'b');
  d.item('energyBig', 6, 12);
  d.item('weaponBig', 10, 12);

  const e = paintRoom('E');
  e.fill(0, 0, 1, 8, 'M');
  e.fill(0, 8, 1, 4, 'D');
  e.fill(15, 0, 1, 15, 'M');
  e.fill(0, 12, 15, 3, '#');
  canyonCactus(e, 2, 12, 3);
  canyonCactus(e, 13, 12, 2);
  e.back(6, 11, 1, 1, 'j');
  e.back(10, 11, 1, 1, 'j');
}

function buildBalloonStage() {
  buildCanyonA();
  buildCanyonB();
  buildCanyonC();
  buildCanyonBoss();
}

function canyonLoopUpdate(platform) {
  const angle = ((platform.timer + platform.phase) / platform.period) * Math.PI * 2;
  platform.y = platform.homeY - (platform.range * (1 - Math.cos(angle))) / 2;
}

function canyonSinkUpdate(platform) {
  if (platform.carrying) platform.y = Math.min(platform.homeY + platform.depth, platform.y + 0.45);
  else if (platform.y > platform.homeY) platform.y = Math.max(platform.homeY, platform.y - 0.7);
}

function canyonRope(ctx, x1, y1, x2, y2) {
  const steps = Math.abs(y2 - y1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    ctx.fillRect(Math.round(x1 + (x2 - x1) * t), Math.round(y1 + (y2 - y1) * t), 1, 1);
  }
}

function canyonDrawBalloon(ctx, sx, sy, envelope, flame) {
  const mouth = sy - 30;
  ctx.fillStyle = nesPalette[0x08];
  canyonRope(ctx, sx - 23, sy, sx - 5, mouth);
  canyonRope(ctx, sx + 22, sy, sx + 4, mouth);
  drawSprite(ctx, envelope, sx, mouth + 1, false, 'enemy');
  if (flame) drawSprite(ctx, flame, sx, mouth + 3, false, 'boss');
  drawSprite(ctx, 'canyonBasket', sx, sy, false, 'enemy');
}

function canyonWindPhase() {
  const t = canyonWind.timer;
  if (t < canyonWindCycle.calm) return 'calm';
  if (t < canyonWindCycle.calm + canyonWindCycle.warn) return 'warn';
  return 'gust';
}

function canyonZones() {
  if (!currentStage || !currentStage.wind || !stage.room) return [];
  return currentStage.wind.filter(zone => zone.room === stage.room.id);
}

function canyonZoneAt(x) {
  return canyonZones().find(zone => x >= zone.from * tileSize && x < zone.to * tileSize) || null;
}

function canyonZoneVisible(zone) {
  return zone.to * tileSize > camera.x && zone.from * tileSize < camera.x + screenWidth;
}

function canyonWindAt(x) {
  const zone = canyonZoneAt(x);
  if (!zone || canyonWindPhase() !== 'gust') return 0;
  const since = canyonWind.timer - canyonWindCycle.calm - canyonWindCycle.warn;
  return zone.dir * 0.45 * Math.min(1, (since + 1) / 12);
}

function canyonSpawnParticle(zone, leaf) {
  const left = Math.max(zone.from * tileSize, camera.x - 24);
  const right = Math.min(zone.to * tileSize, camera.x + screenWidth + 24);
  const x = zone.dir > 0 ? left : right;
  const y = camera.y + 24 + Math.random() * 190;
  canyonWind.particles.push({ zone, leaf, x, y, age: 0, length: 8 + Math.floor(Math.random() * 14), speed: leaf ? 2 + Math.random() : 5 + Math.random() * 2 });
}

function canyonUpdateParticles() {
  const phase = canyonWindPhase();
  for (const zone of canyonZones()) {
    if (!canyonZoneVisible(zone) || phase === 'calm') continue;
    const streakRate = phase === 'gust' ? 3 : 9;
    const leafRate = phase === 'gust' ? 7 : 14;
    if (canyonWind.timer % streakRate === 0) canyonSpawnParticle(zone, false);
    if (canyonWind.timer % leafRate === 0) canyonSpawnParticle(zone, true);
  }
  canyonWind.particles = canyonWind.particles.filter(particle => {
    particle.age++;
    particle.x += particle.zone.dir * particle.speed;
    if (particle.leaf) particle.y += Math.sin(particle.age / 6) * 0.8;
    return particle.x > particle.zone.from * tileSize - 24 && particle.x < particle.zone.to * tileSize + 24 && particle.age < 160;
  });
}

function canyonWindSound() {
  if (!canyonZones().some(canyonZoneVisible)) return;
  const t = canyonWind.timer;
  if (t === canyonWindCycle.calm) playFrames('canyonWind', 'noise', sweepFrames(12000, 6000, 40, 0.04, 0.12));
  if (t === canyonWindCycle.calm + canyonWindCycle.warn) playFrames('canyonWind', 'noise', sweepFrames(7000, 3000, 70, 0.16, 0.02));
}

function canyonResetWind() {
  canyonWind.timer = 0;
  canyonWind.particles = [];
}

function canyonUpdate() {
  canyonWind.timer = (canyonWind.timer + 1) % (canyonWindCycle.calm + canyonWindCycle.warn + canyonWindCycle.gust);
  canyonUpdateParticles();
  if (stage.state !== 'play') return;
  canyonWindSound();
  const push = canyonWindAt(player.x);
  if (push && !player.climbing && player.control) player.pushX += push;
}

function canyonDrawWind(ctx) {
  for (const particle of canyonWind.particles) {
    const sx = Math.round(particle.x - camera.x);
    const sy = Math.round(particle.y - camera.y);
    if (particle.leaf) {
      ctx.fillStyle = nesPalette[particle.age % 20 < 10 ? 0x18 : 0x28];
      ctx.fillRect(sx, sy, 2, particle.age % 12 < 6 ? 2 : 1);
    } else {
      ctx.fillStyle = nesPalette[0x30];
      ctx.fillRect(particle.zone.dir > 0 ? sx - particle.length : sx, sy, particle.length, 1);
    }
  }
}

function canyonDrawSky(ctx, offset) {
  canyonSkyBands.forEach(([top, color], index) => {
    const next = canyonSkyBands[index + 1];
    const y = index === 0 ? 0 : top + offset;
    const bottom = next ? next[0] + offset : screenHeight;
    ctx.fillStyle = nesPalette[color];
    ctx.fillRect(0, y, screenWidth, bottom - y);
    if (!next) return;
    ctx.fillStyle = nesPalette[next[1]];
    ctx.fillRect(0, bottom - 4, screenWidth, 1);
    ctx.fillRect(0, bottom - 2, screenWidth, 1);
  });
}

function canyonDrawSun(ctx, offset) {
  const cx = Math.round(190 - camera.x * 0.02);
  const cy = 170 + offset;
  const radius = 18;
  for (let dy = -radius; dy <= radius; dy++) {
    if (dy > 4 && dy % 4 === 0) continue;
    const half = Math.round(Math.sqrt(radius * radius - dy * dy));
    ctx.fillStyle = nesPalette[dy < -6 ? 0x30 : 0x38];
    ctx.fillRect(cx - half, cy + dy, half * 2, 1);
  }
}

function canyonDrawClouds(ctx, offset) {
  const shift = (camera.x * 0.15 + game.timer * 0.05) % 512;
  for (const [x, y, width] of canyonClouds) {
    for (const wrap of [0, 512]) {
      const sx = Math.round(((x - shift + wrap + 512) % 1024) - 256);
      if (sx > screenWidth || sx + width < 0) continue;
      const sy = y + Math.round(offset / 2);
      ctx.fillStyle = nesPalette[0x35];
      ctx.fillRect(sx + 6, sy, width - 14, 2);
      ctx.fillRect(sx, sy + 2, width, 3);
      ctx.fillStyle = nesPalette[0x25];
      ctx.fillRect(sx + 3, sy + 5, width - 6, 2);
    }
  }
}

function canyonDrawMesas(ctx, list, factor, baseline, color, capColor) {
  const shift = (camera.x * factor) % 512;
  for (const [x, width, height] of list) {
    for (const wrap of [0, 512]) {
      const left = Math.round(x - shift + wrap);
      if (left > screenWidth + 40 || left + width < -40) continue;
      const top = baseline - height;
      ctx.fillStyle = nesPalette[color];
      for (let dy = 0; dy < height; dy += 3) {
        const spread = Math.floor(dy / 3);
        ctx.fillRect(left - spread, top + dy, width + spread * 2, Math.min(3, height - dy));
      }
      ctx.fillStyle = nesPalette[capColor];
      ctx.fillRect(left, top, width, 1);
    }
  }
  ctx.fillStyle = nesPalette[color];
  ctx.fillRect(0, baseline, screenWidth, Math.max(0, screenHeight - baseline));
}

function canyonDrawBackground(ctx) {
  const offset = Math.round((45 * tileSize - camera.y) * 0.02);
  canyonDrawSky(ctx, offset);
  canyonDrawSun(ctx, offset);
  canyonDrawClouds(ctx, offset);
  canyonDrawMesas(ctx, canyonFarMesas, 0.12, 198 + offset, 0x04, 0x14);
  canyonDrawMesas(ctx, canyonNearMesas, 0.3, 222 + offset, 0x05, 0x15);
}

// INITIALIZATION

Object.assign(platformTypes, {
  canyonLoop: {
    w: 48,
    h: 10,
    init(platform, spawn) {
      platform.homeY = spawn.y;
      platform.range = (spawn.range || 3) * tileSize;
      platform.period = spawn.period || 300;
      platform.phase = spawn.phase || 0;
    },
    update: canyonLoopUpdate,
    draw(ctx, platform, sx, sy) {
      canyonDrawBalloon(ctx, sx, sy, 'canyonEnvelopeBlue', Math.floor(platform.timer / 4) % 2 ? 'balloonFlameSmall' : 'balloonFlameBig');
    },
  },
  canyonSink: {
    w: 48,
    h: 10,
    init(platform, spawn) {
      platform.homeY = spawn.y;
      platform.depth = (spawn.depth || 2) * tileSize;
    },
    update: canyonSinkUpdate,
    draw(ctx, platform, sx, sy) {
      let flame = 'balloonFlameSmall';
      if (platform.carrying) flame = Math.floor(platform.timer / 3) % 3 ? null : 'balloonFlameSmall';
      else if (platform.y > platform.homeY) flame = 'balloonFlameBig';
      canyonDrawBalloon(ctx, sx, sy, 'canyonEnvelopeRed', flame);
    },
  },
});

stageDefs.balloon = {
  id: 'balloon',
  boss: 'balloon',
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
    { room: 'C', col: 70, row: 12 },
    { room: 'D', col: 147, row: 12 },
  ],
  sky: 0x13,
  song: balloonStageSong,
  tilePalette: 'enemy',
  tiles: {
    '#': 'tileCanyonRock',
    M: 'tileCanyonCliff',
    '-': 'tileCanyonPlank',
    H: 'tileCanyonLadder',
    b: 'tileCanyonBack',
    y: 'tileCanyonCactusTop',
    Y: 'tileCanyonCactus',
    j: 'tileCanyonBrush',
    f: 'tileCanyonPost',
    v: 'tileCanyonBeam',
  },
  groundTop: { '#': 'tileCanyonTop' },
  tileTypes: { '-': 'oneWay' },
  bossSpawn: { col: 11, y: 40 },
  wind: [
    { room: 'A', from: 61, to: 72, dir: -1 },
    { room: 'C', from: 114, to: 127, dir: 1 },
  ],
  onStart: canyonResetWind,
  update: canyonUpdate,
  drawBackground: canyonDrawBackground,
  drawForeground: canyonDrawWind,
  build: buildBalloonStage,
};
