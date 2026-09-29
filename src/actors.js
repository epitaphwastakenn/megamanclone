// VARIABLES

const playerShots = [];
const enemyShots = [];
const enemies = [];
const items = [];
const effects = [];
const collectedItems = new Set();
const stageEvents = { playerFired: false, playerDied: false };
const enemyTypes = {};
const playerShotKinds = {};
const effectTypes = {};

// FUNCTIONS

function bodyBox(body) {
  return { left: body.x - body.w / 2, top: body.y - body.h, right: body.x + body.w / 2, bottom: body.y };
}

function centerBox(x, y, w, h) {
  return { left: x - w / 2, top: y - h / 2, right: x + w / 2, bottom: y + h / 2 };
}

function boxesOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function onScreen(x, y, margin) {
  return x > camera.x - margin && x < camera.x + screenWidth + margin && y > camera.y - margin && y < camera.y + screenHeight + margin;
}

function playerHitBox() {
  return { left: player.x - 6, top: player.y - player.h + 2, right: player.x + 6, bottom: player.y };
}

function makePlayerShot(kind, x, y, extra) {
  const spec = playerShotKinds[kind];
  const shot = { kind, weapon: spec.weapon || 'buster', x, y, vx: 0, vy: 0, dir: player.facing, damage: spec.damage || 1, w: spec.w || 8, h: spec.h || 8, reflected: false, age: 0, hitList: [], ...(extra || {}) };
  playerShots.push(shot);
  return shot;
}

function firePlayerShot(x, y, dir, kind) {
  const spec = playerShotKinds[kind];
  return makePlayerShot(kind, x, y, { vx: dir * spec.speed, dir });
}

function countPlayerShots(kind) {
  return playerShots.filter(shot => shot.kind === kind && !shot.reflected).length;
}

function reflectShot(shot) {
  shot.reflected = true;
  shot.vx = -(shot.dir || 1) * 4;
  shot.vy = -4;
  playSfx('tink');
}

function shotBox(shot) {
  return centerBox(shot.x, shot.y, shot.w, shot.h);
}

function updatePlayerShots() {
  for (let i = playerShots.length - 1; i >= 0; i--) {
    const shot = playerShots[i];
    shot.age++;
    if (shot.reflected) {
      shot.x += shot.vx;
      shot.y += shot.vy;
      if (!onScreen(shot.x, shot.y, 16)) playerShots.splice(i, 1);
      continue;
    }
    const kind = playerShotKinds[shot.kind];
    const alive = kind.update ? kind.update(shot) : moveStraight(shot);
    if (!alive || shot.dead || !onScreen(shot.x, shot.y, kind.screenMargin || 16)) {
      if (!shot.dead && kind.onExpire) kind.onExpire(shot);
      playerShots.splice(i, 1);
      continue;
    }
    if (kind.harmless) continue;
    if (hitWithShot(shot) || shot.dead) playerShots.splice(i, 1);
  }
}

function moveStraight(shot) {
  shot.x += shot.vx;
  shot.y += shot.vy;
  return true;
}

function shotResult(kind, name, shot, target, fallback) {
  return kind[name] ? kind[name](shot, target) : fallback;
}

function hitWithShot(shot) {
  const kind = playerShotKinds[shot.kind];
  const box = shotBox(shot);
  for (const enemy of enemies) {
    if (!enemy.alive || enemy.intangible || shot.hitList.includes(enemy)) continue;
    if (!boxesOverlap(box, bodyBox(enemy))) continue;
    if ((enemyShielded(enemy) && !kind.pierceShields) || enemyTypes[enemy.type].invincible) {
      const result = shotResult(kind, 'onShield', shot, enemy, 'reflect');
      if (result === 'reflect') {
        reflectShot(shot);
        return false;
      }
      if (result === 'stop') return true;
      shot.hitList.push(enemy);
      continue;
    }
    const killed = damageEnemy(enemy, shot.damage);
    shot.hitList.push(enemy);
    const result = kind.onHitEnemy ? kind.onHitEnemy(shot, enemy, killed) : 'stop';
    if (result === 'stop') return true;
  }
  for (const bossShot of bossShots) {
    const bossKind = bossShotKinds[bossShot.kind];
    if (!bossKind.shootable || bossShot.dead || shot.hitList.includes(bossShot)) continue;
    const size = bossKind.hitSize || bossKind.size;
    if (!boxesOverlap(box, centerBox(bossShot.x, bossShot.y, size, size))) continue;
    shot.hitList.push(bossShot);
    bossShot.hp = (bossShot.hp === undefined ? bossKind.shootable : bossShot.hp) - shot.damage;
    if (bossShot.hp <= 0) {
      bossShot.dead = true;
      spawnEffect('explode', bossShot.x, bossShot.y);
      playSfx('explode');
    } else playSfx('enemyHit');
    const result = kind.onHitEnemy ? kind.onHitEnemy(shot, bossShot, bossShot.dead) : 'stop';
    if (result === 'stop') return true;
  }
  const result = hitBossWithShot(shot, box);
  if (result === 'hit') {
    if (kind.onHitBoss) return kind.onHitBoss(shot) === 'stop';
    return !kind.pierceBoss;
  }
  return result === 'consumed';
}

function drawPlayerShots(ctx) {
  for (const shot of playerShots) {
    const sx = shot.x - camera.x;
    const sy = shot.y - camera.y;
    if (shot.reflected && playerShotKinds[shot.kind].drawReflected === false) continue;
    playerShotKinds[shot.kind].draw(ctx, shot, sx, sy);
  }
}

function fireEnemyShot(x, y, vx, vy, damage, sprite, extra) {
  const shot = { x, y, vx, vy, damage: damage || 2, w: 6, h: 6, sprite: sprite || 'enemyShot', age: 0, gravity: 0, palette: 'enemy', ...(extra || {}) };
  enemyShots.push(shot);
  return shot;
}

function updateEnemyShots() {
  const hitBox = playerHitBox();
  for (let i = enemyShots.length - 1; i >= 0; i--) {
    const shot = enemyShots[i];
    shot.age++;
    if (shot.update) {
      if (!shot.update(shot)) {
        enemyShots.splice(i, 1);
        continue;
      }
    } else {
      shot.vy += shot.gravity;
      shot.x += shot.vx;
      shot.y += shot.vy;
    }
    if (shot.solidStop && solidAt(shot.x, shot.y)) {
      enemyShots.splice(i, 1);
      continue;
    }
    if (!onScreen(shot.x, shot.y, shot.gravity ? 48 : 8)) {
      enemyShots.splice(i, 1);
      continue;
    }
    if (!player.dead && player.visible && boxesOverlap(centerBox(shot.x, shot.y, shot.w, shot.h), hitBox) && player.invulnTimer === 0 && player.shieldTimer === 0) {
      hurtPlayer(shot.damage);
      if (!shot.piercing) enemyShots.splice(i, 1);
    }
  }
}

function drawEnemyShots(ctx) {
  for (const shot of enemyShots) {
    const sx = shot.x - camera.x;
    const sy = shot.y - camera.y;
    if (shot.draw) {
      shot.draw(ctx, shot, sx, sy);
      continue;
    }
    const name = shot.frames ? shot.frames[Math.floor(shot.age / shot.frameRate) % shot.frames.length] : shot.sprite;
    drawSprite(ctx, name, sx, sy, shot.vx < 0 && (!!shot.frames || !!shot.flipLeft), shot.palette);
  }
}

function createEnemy(spawn) {
  const spec = enemyTypes[spawn.type];
  if (!spec) throw new Error('Unknown enemy ' + spawn.type);
  const enemy = {
    type: spawn.type,
    x: spawn.x,
    y: spawn.y,
    w: spec.w,
    h: spec.h,
    hp: spec.hp,
    damage: spec.damage,
    facing: player.x < spawn.x ? -1 : 1,
    vx: 0,
    vy: 0,
    timer: 30,
    state: 'idle',
    flash: 0,
    anim: 0,
    stun: 0,
    alive: true,
    spawn,
    onGround: true,
    intangible: !!spec.intangible,
  };
  if (spec.init) spec.init(enemy, spawn);
  enemies.push(enemy);
  return enemy;
}

function enemyShielded(enemy) {
  const spec = enemyTypes[enemy.type];
  return spec.shielded ? spec.shielded(enemy) : false;
}

function damageEnemy(enemy, damage) {
  enemy.hp -= damage;
  if (enemy.hp <= 0) {
    destroyEnemy(enemy);
    return true;
  }
  enemy.flash = 6;
  playSfx('enemyHit');
  return false;
}

function destroyEnemy(enemy) {
  enemy.alive = false;
  if (enemy.spawn.state) enemy.spawn.state = 'dead';
  const spec = enemyTypes[enemy.type];
  if (spec.onDestroy) spec.onDestroy(enemy);
  spawnEffect('explode', enemy.x, enemy.y - enemy.h / 2);
  playSfx('explode');
  if (spec.noDrop) return;
  const roll = Math.random();
  let drop = null;
  if (roll < 0.03) drop = 'oneUp';
  else if (roll < 0.09) drop = 'energyBig';
  else if (roll < 0.14) drop = 'weaponBig';
  else if (roll < 0.32) drop = 'energySmall';
  else if (roll < 0.42) drop = 'weaponSmall';
  if (drop) spawnItem(drop, enemy.x, enemy.y - enemy.h / 2, true);
}

function applyEnemyGravity(enemy, gravity) {
  enemy.vy = Math.min(enemy.vy + (gravity || 0.25), 7);
  const result = moveBody(enemy, enemy.vx, enemy.vy);
  if (result.landed) {
    if (!enemy.onGround) enemy.justLanded = true;
    enemy.onGround = true;
    enemy.vy = 0;
  } else if (enemy.vy > 0) {
    enemy.onGround = false;
  }
  return result;
}

function aimAtPlayer(enemy) {
  enemy.facing = player.x < enemy.x ? -1 : 1;
}

function updateEnemies(allowContact) {
  const hitBox = playerHitBox();
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    if (!enemy.alive) {
      enemies.splice(i, 1);
      continue;
    }
    const spec = enemyTypes[enemy.type];
    if (enemy.flash > 0) enemy.flash--;
    if (enemy.stun > 0) enemy.stun--;
    else spec.update(enemy);
    if (!enemy.alive) {
      enemies.splice(i, 1);
      continue;
    }
    if (!onScreen(enemy.x, enemy.y - enemy.h / 2, spec.screenMargin || 48)) {
      enemy.alive = false;
      if (enemy.spawn.state) enemy.spawn.state = 'dead';
      enemies.splice(i, 1);
      continue;
    }
    if (allowContact && !enemy.intangible && !spec.harmless && !player.dead && player.visible && boxesOverlap(bodyBox(enemy), hitBox)) hurtPlayer(enemy.damage);
  }
}

function drawEnemies(ctx) {
  for (const enemy of enemies) {
    const spec = enemyTypes[enemy.type];
    const palette = enemy.flash > 0 && enemy.flash % 2 === 0 ? 'enemyFlash' : spec.palette || 'enemy';
    const sx = enemy.x - camera.x;
    const sy = enemy.y - camera.y;
    if (spec.draw) {
      spec.draw(ctx, enemy, sx, sy, palette);
    } else {
      const name = spec.sprite ? spec.sprite(enemy) : null;
      if (name) {
        const offset = spec.drawOffset ? spec.drawOffset(enemy) : { x: 0, y: 0 };
        const flip = spec.faceLeft ? enemy.facing > 0 : enemy.facing < 0;
        drawSprite(ctx, name, sx + offset.x, sy + offset.y, flip, palette);
      }
    }
    if (enemy.stun > 0 && spec.drawStun !== false) drawStunMark(ctx, enemy, sx, sy);
  }
}

function drawStunMark(ctx, enemy, sx, sy) {
  const phase = Math.floor(enemy.stun / 4) % 2;
  ctx.fillStyle = nesPalette[0x28];
  const top = sy - enemy.h - 4;
  ctx.fillRect(Math.round(sx - 5 + phase * 2), Math.round(top), 2, 2);
  ctx.fillRect(Math.round(sx + 3 - phase * 2), Math.round(top - 1), 2, 2);
}

function resetSpawns() {
  for (const spawn of levelSpawns) spawn.state = 'ready';
  enemies.length = 0;
  enemyShots.length = 0;
  playerShots.length = 0;
}

function updateSpawns(room) {
  for (const spawn of levelSpawns) {
    if (spawn.room !== room.id) continue;
    const visible = spawn.x > camera.x - 8 && spawn.x < camera.x + screenWidth + 8 && spawn.y >= camera.y && spawn.y <= camera.y + screenHeight + 16;
    if (!visible) {
      if (spawn.state === 'dead') spawn.state = 'ready';
      continue;
    }
    if (!spawn.state || spawn.state === 'ready') {
      createEnemy(spawn);
      spawn.state = 'active';
    }
  }
}

function spawnItem(type, x, y, temporary, levelId) {
  if (type.startsWith('weapon') && !hasSpecialWeapons()) {
    if (temporary) return null;
    type = type === 'weaponBig' ? 'energyBig' : 'energySmall';
  }
  const small = type === 'energySmall' || type === 'weaponSmall';
  const size = small ? { w: 8, h: 8 } : { w: 14, h: 12 };
  const item = { type, x, y, vy: temporary ? -2 : 0, w: size.w, h: size.h, timer: temporary ? 360 : -1, levelId, anim: 0, onGround: false, floating: false };
  items.push(item);
  return item;
}

function resetLevelItems() {
  items.length = 0;
  for (const item of levelItems) {
    if (!collectedItems.has(item.id)) spawnItem(item.type, item.x, item.y, false, item.id);
  }
}

function updateItems() {
  const hitBox = playerHitBox();
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    item.anim++;
    if (item.timer > 0) {
      item.timer--;
      if (item.timer === 0) {
        items.splice(i, 1);
        continue;
      }
    }
    if (!item.floating && (item.timer > 0 || item.vy !== 0 || !isStandingOn(item))) {
      item.vy = Math.min(item.vy + 0.25, 7);
      const previousBottom = item.y;
      const result = moveBody(item, 0, item.vy);
      if (result.landed) item.vy = 0;
      else if (item.vy > 0) {
        const platform = platformLanding(item, previousBottom);
        if (platform) {
          item.y = platform.y;
          item.vy = 0;
        }
      }
    }
    if (item.timer > 0 && !onScreen(item.x, item.y, 16)) {
      items.splice(i, 1);
      continue;
    }
    if (!player.dead && player.visible && player.control && boxesOverlap(bodyBox(item), hitBox)) {
      collectItem(item);
      items.splice(i, 1);
    }
  }
}

function collectItem(item) {
  if (item.levelId !== undefined) collectedItems.add(item.levelId);
  if (item.type === 'oneUp') {
    game.lives = Math.min(9, game.lives + 1);
    playSfx('oneUp');
    return;
  }
  const amount = item.type.endsWith('Big') ? 10 : 2;
  if (item.type.startsWith('energy')) queueFill('health', amount);
  else {
    const target = weaponRefillTarget();
    if (target) queueFill(target, amount);
  }
}

function drawItems(ctx) {
  for (const item of items) {
    if (!onScreen(item.x, item.y, 16)) continue;
    if (item.timer > 0 && item.timer < 90 && Math.floor(item.timer / 2) % 2 === 0) continue;
    const frame = Math.floor(item.anim / 8) % 2 ? 1 : 2;
    let name = 'oneUp';
    if (item.type === 'energySmall') name = 'energySmall' + frame;
    if (item.type === 'energyBig') name = 'energyBig' + frame;
    if (item.type === 'weaponSmall') name = 'weaponEnergySmall' + frame;
    if (item.type === 'weaponBig') name = 'weaponEnergyBig' + frame;
    drawSprite(ctx, name, item.x - camera.x, item.y - camera.y, false, item.type.startsWith('energy') ? 'enemy' : 'mega');
  }
}

function spawnEffect(type, x, y, extra) {
  const effect = { type, x, y, timer: 0, vx: 0, vy: 0, palette: 'enemy', ...(extra || {}) };
  effects.push(effect);
  return effect;
}

function spawnDeathOrbs(x, y, palette) {
  for (const speed of [1, 2]) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      spawnEffect('orb', x, y, { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, palette });
    }
  }
}

function updateEffects() {
  for (let i = effects.length - 1; i >= 0; i--) {
    const effect = effects[i];
    effect.timer++;
    effect.x += effect.vx;
    effect.y += effect.vy;
    if (effectTypes[effect.type].update(effect)) effects.splice(i, 1);
  }
}

function drawEffects(ctx) {
  for (const effect of effects) effectTypes[effect.type].draw(ctx, effect, effect.x - camera.x, effect.y - camera.y);
}

// INITIALIZATION

Object.assign(effectTypes, {
  explode: {
    update: effect => effect.timer >= 20,
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'explode' + (1 + Math.min(4, Math.floor(effect.timer / 4))), sx, sy, false, 'enemy'),
  },
  hitSpark: {
    update: effect => effect.timer >= 4,
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'hitSpark', sx, sy, false, 'enemy'),
  },
  dust: {
    update(effect) {
      effect.y -= 0.3;
      return effect.timer >= 12;
    },
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'dust' + (1 + Math.min(2, Math.floor(effect.timer / 4))), sx, sy, false, 'enemy'),
  },
  orb: {
    update: effect => effect.timer > 300 || !onScreen(effect.x, effect.y, 16),
    draw(ctx, effect, sx, sy) {
      const phase = Math.floor(effect.timer / 3) % 4;
      const name = phase === 0 ? 'orbSmall' : phase === 2 ? 'orbBig2' : 'orbBig1';
      drawSprite(ctx, name, sx, sy, false, effect.palette);
    },
  },
  bubble: {
    update(effect) {
      effect.y -= 0.6;
      effect.x += Math.sin(effect.timer / 5) * 0.3;
      return effect.timer > 120 || !isWaterAt(effect.x, effect.y - 3);
    },
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'bubble', sx, sy, false, 'enemy'),
  },
  splash: {
    update: effect => effect.timer >= 16,
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'splash' + Math.min(2, Math.floor(effect.timer / 6)), sx, sy, false, 'enemy'),
  },
});

Object.assign(playerShotKinds, {
  pellet: {
    damage: 1,
    w: 8,
    h: 6,
    speed: 5,
    bossDamage: 2,
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'busterShot', sx, sy, shot.dir < 0, 'enemy'),
  },
  mid: {
    damage: 2,
    w: 14,
    h: 12,
    speed: 5,
    bossDamage: 3,
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'chargeMid' + (1 + (Math.floor(shot.age / 3) % 2)), sx, sy, shot.dir < 0, 'enemy'),
  },
  full: {
    damage: 3,
    w: 22,
    h: 18,
    speed: 5.5,
    bossDamage: 5,
    onHitEnemy: (shot, enemy, killed) => (killed ? 'pass' : 'stop'),
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'chargeFull' + (1 + (Math.floor(shot.age / 3) % 2)), sx, sy, shot.dir < 0, 'enemy'),
  },
});
