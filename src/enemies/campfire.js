// FUNCTIONS

function campfireSound(name) {
  if (name === 'ignite') playFrames('campfireIgnite', 'noise', sweepFrames(2400, 14000, 12, 0.34, 0.06));
  else if (name === 'crackle') playFrames('campfireCrackle', 'noiseShort', [7046, 0, 11186, 0, 0, 8860, 0, 13982].map((rate, i) => [rate, rate ? 0.16 - i * 0.008 : 0]));
  else if (name === 'roar') playFrames('campfireRoar', 'noise', [...sweepFrames(3500, 16000, 8, 0.2, 0.38), ...sweepFrames(16000, 5000, 22, 0.38, 0.04)]);
  else if (name === 'hiss') playFrames('campfireHiss', 'noise', sweepFrames(40000, 18000, 36, 0.3, 0));
  else if (name === 'stoke') playFrames('campfireStoke', 'noise', sweepFrames(2000, 20000, 28, 0.08, 0.36));
  else if (name === 'chirp') playFrames('campfireChirp', 0.125, [...sweepFrames(2800, 3600, 4, 0.14, 0.1), [0, 0], ...sweepFrames(3200, 4200, 4, 0.12, 0.06)]);
  else if (name === 'rumble') playFrames('campfireRumble', 'noise', sweepFrames(1200, 700, 20, 0.28, 0.08));
}

function campfirePuff(x, y) {
  spawnEffect('campfireSmoke', x, y, { vx: (Math.random() - 0.5) * 0.4, vy: -0.5 });
}

function campfireSparks(x, y, count) {
  for (let i = 0; i < count; i++) spawnEffect('campfireSpark', x + (Math.random() - 0.5) * 12, y, { vx: (Math.random() - 0.5) * 1.4, vy: -1 - Math.random() * 1.6 });
}

function campfireFireHeight(age, life) {
  const grow = Math.min(1, age / 10);
  const fade = Math.min(1, Math.max(0, (life - age) / 45));
  return Math.max(3, Math.round(22 * grow * (0.2 + 0.8 * fade)));
}

function campfireDrawFire(ctx, sx, sy, age, life) {
  const height = campfireFireHeight(age, life);
  const left = life - age;
  const size = height > 15 ? 'L' : height > 8 ? 'M' : 'S';
  const frame = Math.floor(age / 4) % 3;
  if (left < 24 && Math.floor(age / 3) % 2 === 0) {
    drawSprite(ctx, 'campfireAsh', sx, sy, false, 'campfireBoss');
    return;
  }
  drawSprite(ctx, 'campfireFire' + size + frame, sx, sy, frame === 1, 'campfireBoss');
}

function campfireFireBox(x, groundY, age, life) {
  const height = campfireFireHeight(age, life);
  return { left: x - 6, top: groundY - height, right: x + 6, bottom: groundY };
}

function updateEmberBat(enemy) {
  enemy.anim++;
  enemy.timer--;
  if (enemy.state === 'hang') {
    enemy.x = enemy.homeX;
    enemy.y = enemy.homeY;
    if (Math.abs(player.x - enemy.x) < 88 && player.y > enemy.y - 8) {
      enemy.state = 'wake';
      enemy.timer = 36;
      campfireSound('chirp');
    }
  } else if (enemy.state === 'wake') {
    if (enemy.timer % 12 === 0) campfireSparks(enemy.x, enemy.y - 4, 1);
    if (enemy.timer <= 0 && player.climbing) enemy.timer = 1;
    else if (enemy.timer <= 0) startEmberBatDive(enemy);
  } else if (enemy.state === 'dive') {
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;
    enemy.vy -= enemy.lift;
    if (enemy.anim % 6 === 0) spawnEffect('campfireSpark', enemy.x, enemy.y - 4, { vx: 0, vy: -0.4 });
    if (enemy.vy < 0 && enemy.y <= enemy.homeY) {
      enemy.y = enemy.homeY;
      enemy.state = 'hover';
      enemy.timer = 60;
    }
  } else if (enemy.state === 'hover') {
    aimAtPlayer(enemy);
    if (Math.abs(enemy.x + enemy.facing * 0.5 - enemy.homeX) < 64) enemy.x += enemy.facing * 0.5;
    enemy.y = enemy.homeY + Math.sin(enemy.anim / 8) * 3;
    if (enemy.timer <= 0 && !player.climbing && Math.abs(player.x - enemy.x) < 96) {
      enemy.state = 'wake';
      enemy.timer = 30;
      campfireSound('chirp');
    }
  }
}

function startEmberBatDive(enemy) {
  const depth = Math.max(16, Math.min(128, player.y - 10 - enemy.y));
  const frames = 46;
  enemy.state = 'dive';
  enemy.lift = (2 * depth) / (frames * frames);
  enemy.vy = enemy.lift * frames;
  enemy.vx = Math.max(-2.2, Math.min(2.2, (player.x - enemy.x) / frames));
  enemy.homeY = enemy.y;
  aimAtPlayer(enemy);
}

function emberBatSprite(enemy) {
  if (enemy.state === 'hang') return 'emberBatHang';
  if (enemy.state === 'wake') return Math.floor(enemy.anim / 4) % 2 ? 'emberBatWake' : 'emberBatUp';
  return Math.floor(enemy.anim / 5) % 2 ? 'emberBatUp' : 'emberBatDown';
}

function updateMallowBot(enemy) {
  enemy.anim++;
  enemy.timer--;
  const distance = Math.abs(player.x - enemy.x);
  if (enemy.state === 'roast') {
    if (enemy.timer <= 0 && distance < 168 && Math.abs(player.y - enemy.y) < 96) {
      enemy.state = 'ready';
      enemy.timer = 34;
      campfireSound('ignite');
    }
  } else if (enemy.state === 'ready') {
    if (enemy.timer <= 0) {
      throwMallow(enemy);
      enemy.state = 'throw';
      enemy.timer = 18;
    }
  } else if (enemy.state === 'throw' && enemy.timer <= 0) {
    enemy.state = 'roast';
    enemy.timer = 90 + Math.floor(Math.random() * 40);
  }
  applyEnemyGravity(enemy);
}

function throwMallow(enemy) {
  const x = enemy.x - enemy.facing * 3;
  const y = enemy.y - 30;
  const vx = Math.max(-2.4, Math.min(2.4, (player.x - x) / 56));
  fireEnemyShot(x, y, vx, -4.2, 3, 'mallowShot0', { gravity: 0.17, frames: ['mallowShot0', 'mallowShot1'], frameRate: 4, w: 6, h: 6, solidStop: true, palette: 'campfireBoss' });
  playSfx('throw');
}

function mallowBotSprite(enemy) {
  if (enemy.state === 'ready') return 'mallowBotRaise';
  if (enemy.state === 'throw') return 'mallowBotThrow';
  return Math.floor(enemy.anim / 16) % 2 ? 'mallowBotLower' : 'mallowBotRoast';
}

function drawMallowBot(ctx, enemy, sx, sy, palette) {
  const flip = enemy.facing < 0;
  drawSprite(ctx, mallowBotSprite(enemy), sx - enemy.facing * 6, sy, flip, palette);
  drawSprite(ctx, 'campfireFireS' + (Math.floor(enemy.anim / 5) % 3), sx + enemy.facing * 11, sy, false, 'campfireBoss');
}

function updateLogPile(enemy) {
  enemy.timer--;
  if (enemy.state === 'shake') {
    if (enemy.timer % 10 === 0) campfirePuff(enemy.x + enemy.facing * 6, enemy.y - 18);
    if (enemy.timer > 0) return;
    const log = createEnemy({ type: 'rollingLog', x: enemy.x + enemy.facing * 12, y: enemy.y - 14, dir: enemy.facing, state: null });
    log.pile = enemy;
    enemy.state = 'wait';
    enemy.timer = enemy.rate;
    return;
  }
  if (enemy.timer > 0) return;
  const rolling = enemies.filter(other => other.type === 'rollingLog' && other.alive && other.pile === enemy).length;
  const visible = enemy.x > camera.x + 8 && enemy.x < camera.x + screenWidth - 8;
  const near = visible && Math.abs(player.x - enemy.x) < 208 && Math.abs(player.y - enemy.y) < 120;
  if (!near || rolling >= 2) return;
  enemy.state = 'shake';
  enemy.timer = 40;
  campfireSound('rumble');
}

function drawLogPile(ctx, enemy, sx, sy) {
  const shake = enemy.state === 'shake' ? (Math.floor(enemy.timer / 3) % 2 ? 1 : 2) : 0;
  drawSprite(ctx, 'logPile' + shake, sx, sy, enemy.facing > 0, 'enemy');
}

function updateRollingLog(enemy) {
  enemy.justLanded = false;
  enemy.vx = enemy.dir * 1.4;
  enemy.anim++;
  const speed = enemy.vy;
  const result = applyEnemyGravity(enemy);
  if (result.hitWall) {
    enemy.alive = false;
    spawnEffect('explode', enemy.x, enemy.y - 6);
    playSfx('thud');
    return;
  }
  if (enemy.justLanded && speed > 2.2) {
    enemy.vy = -speed * 0.35;
    enemy.onGround = false;
    playSfx('thud');
  }
}

function drawRollingLog(ctx, enemy, sx, sy, palette) {
  const frame = Math.floor(enemy.anim / 5) % 4;
  drawSprite(ctx, 'rollingLog' + (enemy.dir > 0 ? frame : 3 - frame), sx, sy, false, palette);
  drawSprite(ctx, 'rollingLogFlame' + (Math.floor(enemy.anim / 4) % 2), sx - enemy.dir * 2, sy - 12, enemy.dir > 0, 'campfireBoss');
}

// INITIALIZATION

Object.assign(effectTypes, {
  campfireSmoke: {
    update: effect => effect.timer >= 27,
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'campfireSmoke' + Math.min(2, Math.floor(effect.timer / 9)), sx, sy, false, 'campfireBoss'),
  },
  campfireSpark: {
    update(effect) {
      effect.vy += 0.04;
      return effect.timer >= 18;
    },
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'campfireSpark' + (effect.timer < 9 ? 0 : 1), sx, sy, false, 'campfireBoss'),
  },
});

Object.assign(enemyTypes, {
  emberBat: {
    w: 12,
    h: 10,
    hp: 1,
    damage: 3,
    init(enemy, spawn) {
      enemy.state = 'hang';
      enemy.homeX = spawn.x;
      enemy.homeY = spawn.y + 3 + (spawn.hang || 0);
      enemy.y = enemy.homeY;
      enemy.lift = 0;
    },
    update: updateEmberBat,
    sprite: emberBatSprite,
  },
  mallowBot: {
    w: 26,
    h: 20,
    hp: 5,
    damage: 3,
    init(enemy, spawn) {
      enemy.facing = spawn.facing || -1;
      enemy.state = 'roast';
      enemy.timer = 50;
    },
    update: updateMallowBot,
    draw: drawMallowBot,
  },
  logPile: {
    w: 28,
    h: 20,
    hp: 1,
    damage: 0,
    intangible: true,
    harmless: true,
    noDrop: true,
    drawStun: false,
    screenMargin: 64,
    init(enemy, spawn) {
      enemy.facing = spawn.facing || -1;
      enemy.rate = spawn.rate || 150;
      enemy.state = 'wait';
      enemy.timer = 30;
    },
    update: updateLogPile,
    draw: drawLogPile,
  },
  rollingLog: {
    w: 12,
    h: 13,
    hp: 2,
    damage: 3,
    noDrop: true,
    init(enemy, spawn) {
      enemy.dir = spawn.dir;
      enemy.facing = spawn.dir;
      enemy.vy = -2;
      enemy.onGround = false;
    },
    update: updateRollingLog,
    draw: drawRollingLog,
  },
});
