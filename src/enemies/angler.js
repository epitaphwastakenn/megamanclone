// FUNCTIONS

function anglerClipAbove(ctx, surfaceY, draw) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, screenWidth, Math.round(surfaceY));
  ctx.clip();
  draw();
  ctx.restore();
}

function anglerSplashAt(x, surfaceY) {
  spawnEffect('splash', x, surfaceY + 2);
  playAnglerSfx('splash');
}

function initAnglerLeapFish(enemy, spawn) {
  enemy.surface = spawn.y + 2;
  enemy.y = enemy.surface + 24;
  enemy.state = 'hide';
  enemy.timer = spawn.delay || 30;
  enemy.intangible = true;
}

function updateAnglerLeapFish(enemy) {
  enemy.anim++;
  enemy.timer--;
  if (enemy.state === 'hide') {
    if (enemy.timer <= 0 && Math.abs(player.x - enemy.x) < 128) {
      enemy.state = 'ripple';
      enemy.timer = 54;
    }
  } else if (enemy.state === 'ripple') {
    if (enemy.timer % 10 === 0) spawnEffect('bubble', enemy.x - 4 + (enemy.timer % 3) * 4, enemy.surface + 24);
    if (enemy.timer <= 0) {
      enemy.state = 'leap';
      enemy.y = enemy.surface + 10;
      enemy.vy = -5.4;
      enemy.intangible = false;
      anglerSplashAt(enemy.x, enemy.surface);
    }
  } else {
    enemy.vy = Math.min(enemy.vy + 0.2, 5);
    enemy.y += enemy.vy;
    if (enemy.vy > 0 && enemy.y > enemy.surface + 18) {
      enemy.state = 'hide';
      enemy.intangible = true;
      enemy.timer = 90;
      anglerSplashAt(enemy.x, enemy.surface);
    }
  }
}

function drawAnglerRipple(ctx, sx, surfaceY, age, remaining) {
  if (remaining < 36) drawSprite(ctx, 'anglerFin', sx + Math.round(Math.sin(age / 4) * 4), surfaceY + 1, Math.cos(age / 4) < 0, 'enemy');
  drawSprite(ctx, 'anglerRipple' + (Math.floor(age / 6) % 3), sx, surfaceY, false, 'enemy');
  ctx.fillStyle = nesPalette[0x30];
  for (let i = 0; i < 3; i++) {
    const hop = Math.abs(Math.sin(age / 6 + i * 2.1)) * (remaining < 24 ? 12 : 5);
    ctx.fillRect(Math.round(sx - 7 + i * 6), Math.round(surfaceY - 3 - hop), 2, 2);
  }
}

function drawAnglerLeapFish(ctx, enemy, sx, sy, palette) {
  const surface = enemy.surface - camera.y;
  if (enemy.state === 'ripple') {
    drawAnglerRipple(ctx, sx, surface, 54 - enemy.timer, enemy.timer);
    return;
  }
  if (enemy.state !== 'leap') return;
  const name = (enemy.vy < 0 ? 'anglerLeapFishUp' : 'anglerLeapFishDown') + (Math.floor(enemy.anim / 4) % 2);
  anglerClipAbove(ctx, surface + 1, () => drawSprite(ctx, name, sx, sy, false, palette));
}

function initAnglerPelican(enemy, spawn) {
  enemy.facing = spawn.dir || -1;
  enemy.baseY = spawn.y;
  enemy.vx = enemy.facing * 0.9;
  enemy.state = 'fly';
  enemy.dropped = false;
}

function updateAnglerPelican(enemy) {
  enemy.anim++;
  enemy.x += enemy.vx;
  enemy.y = enemy.baseY + Math.round(Math.sin(enemy.anim / 12) * 3);
  if (enemy.state === 'fly') {
    const ahead = (player.x - enemy.x) * enemy.facing;
    if (!enemy.dropped && ahead > -6 && ahead < 46) {
      enemy.state = 'aim';
      enemy.timer = 22;
      playAnglerSfx('squawk');
    }
    return;
  }
  enemy.timer--;
  if (enemy.timer > 0) return;
  fireEnemyShot(enemy.x + enemy.facing * 6, enemy.y - 3, enemy.vx * 0.5, 0.4, 2, 'anglerPelicanBomb', { gravity: 0.2, w: 6, h: 6, update: updateAnglerPelicanBomb });
  playSfx('throw');
  enemy.dropped = true;
  enemy.state = 'fly';
}

function updateAnglerPelicanBomb(shot) {
  shot.vy = Math.min(shot.vy + shot.gravity, 5);
  shot.x += shot.vx;
  shot.y += shot.vy;
  if (isWaterAt(shot.x, shot.y)) {
    anglerSplashAt(shot.x, Math.floor(shot.y / tileSize) * tileSize + 2);
    return false;
  }
  if (solidAt(shot.x, shot.y + 3)) {
    spawnEffect('explode', shot.x, shot.y);
    playSfx('burst');
    return false;
  }
  return true;
}

function anglerPelicanSprite(enemy) {
  if (enemy.state === 'aim') return 'anglerPelicanOpen';
  return Math.floor(enemy.anim / 6) % 2 ? 'anglerPelican1' : 'anglerPelican0';
}

function initAnglerCrab(enemy, spawn) {
  const range = (spawn.range || 3) * tileSize;
  enemy.state = 'walk';
  enemy.timer = 50;
  enemy.walkDir = enemy.facing;
  enemy.minX = spawn.x - range;
  enemy.maxX = spawn.x + range;
}

function anglerCrabBlocked(enemy, dir) {
  const front = enemy.x + dir * (enemy.w / 2 + 2);
  const outside = dir < 0 ? enemy.x <= enemy.minX : enemy.x >= enemy.maxX;
  return outside || !solidAt(front, enemy.y + 4) || solidAt(front, enemy.y - 6);
}

function updateAnglerCrab(enemy) {
  enemy.anim++;
  enemy.timer--;
  if (enemy.state === 'walk') {
    if (anglerCrabBlocked(enemy, enemy.walkDir)) enemy.walkDir = -enemy.walkDir;
    enemy.vx = anglerCrabBlocked(enemy, enemy.walkDir) ? 0 : enemy.walkDir * 0.6;
    if (enemy.timer <= 0) {
      enemy.state = 'guard';
      enemy.timer = 40;
      enemy.vx = 0;
      playAnglerSfx('clack');
    }
  } else if (enemy.timer <= 0) {
    enemy.state = 'walk';
    enemy.timer = 70 + Math.floor(Math.random() * 30);
  }
  applyEnemyGravity(enemy);
}

function anglerCrabSprite(enemy) {
  if (enemy.state === 'guard') return 'anglerCrabGuard';
  return enemy.vx !== 0 && Math.floor(enemy.anim / 6) % 2 ? 'anglerCrab1' : 'anglerCrab0';
}

// INITIALIZATION

Object.assign(enemyTypes, {
  anglerLeapFish: {
    w: 12,
    h: 16,
    hp: 2,
    damage: 3,
    init: initAnglerLeapFish,
    update: updateAnglerLeapFish,
    draw: drawAnglerLeapFish,
    screenMargin: 64,
  },
  anglerPelican: {
    w: 18,
    h: 14,
    hp: 3,
    damage: 3,
    init: initAnglerPelican,
    update: updateAnglerPelican,
    sprite: anglerPelicanSprite,
  },
  anglerCrab: {
    w: 20,
    h: 12,
    hp: 3,
    damage: 3,
    init: initAnglerCrab,
    update: updateAnglerCrab,
    shielded: enemy => enemy.state === 'guard',
    sprite: anglerCrabSprite,
  },
});
