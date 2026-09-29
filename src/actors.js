// VARIABLES

const playerShots = [];
const enemyShots = [];
const enemies = [];
const items = [];
const effects = [];
const collectedItems = new Set();
const stageEvents = { playerFired: false, playerDied: false };

const shotKinds = {
  pellet: { damage: 1, w: 8, h: 6, speed: 5 },
  mid: { damage: 2, w: 14, h: 12, speed: 5 },
  full: { damage: 3, w: 22, h: 18, speed: 5.5 },
};

const enemyTypes = {
  met: { w: 16, h: 10, hp: 1, damage: 2 },
  blader: { w: 14, h: 12, hp: 1, damage: 3 },
  screw: { w: 16, h: 8, hp: 3, damage: 2 },
  blaster: { w: 14, h: 16, hp: 1, damage: 2 },
  bigEye: { w: 26, h: 36, hp: 20, damage: 10 },
  flea: { w: 14, h: 10, hp: 1, damage: 2 },
  pengs: { w: 2, h: 2, hp: 1, damage: 0, intangible: true },
  peng: { w: 20, h: 12, hp: 1, damage: 2, faceLeft: true },
  joe: { w: 18, h: 24, hp: 10, damage: 4, faceLeft: true },
  picketMan: { w: 20, h: 22, hp: 8, damage: 4 },
};

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

function firePlayerShot(x, y, dir, kind) {
  const spec = shotKinds[kind];
  playerShots.push({ x, y, vx: dir * spec.speed, vy: 0, dir, kind, damage: spec.damage, w: spec.w, h: spec.h, reflected: false, age: 0, hitList: [] });
}

function reflectShot(shot) {
  shot.reflected = true;
  shot.vx = -shot.dir * 4;
  shot.vy = -4;
  playSfx('tink');
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
    const alive = moveSpecialShot(shot);
    if (!alive || !onScreen(shot.x, shot.y, shot.kind === 'axe' ? 64 : 16)) {
      playerShots.splice(i, 1);
      continue;
    }
    if (hitWithShot(shot)) playerShots.splice(i, 1);
  }
}

function hitWithShot(shot) {
  const box = centerBox(shot.x, shot.y, shot.w, shot.h);
  for (const enemy of enemies) {
    if (!enemy.alive || enemy.intangible || shot.hitList.includes(enemy)) continue;
    if (!boxesOverlap(box, bodyBox(enemy))) continue;
    if (enemyShielded(enemy) && shot.kind !== 'axe') {
      if (shot.kind === 'cone') {
        burstCone(shot);
        return true;
      }
      if (shot.kind === 'needle') {
        playSfx('tink');
        return true;
      }
      reflectShot(shot);
      return false;
    }
    const killed = damageEnemy(enemy, shot.damage);
    shot.hitList.push(enemy);
    if (shot.kind === 'axe') continue;
    if (shot.kind === 'cone') {
      burstCone(shot);
      return true;
    }
    if (!(shot.kind === 'full' && killed)) return true;
  }
  const result = hitBossWithShot(shot, box);
  if (result === 'hit') {
    if (shot.kind === 'cone') burstCone(shot);
    return shot.kind !== 'axe';
  }
  return result === 'consumed';
}

function drawPlayerShots(ctx) {
  for (const shot of playerShots) {
    const sx = shot.x - camera.x;
    const sy = shot.y - camera.y;
    const flip = shot.dir < 0;
    if (shot.kind === 'pellet') drawSprite(ctx, 'busterShot', sx, sy, flip, 'enemy');
    else if (shot.kind === 'mid') drawSprite(ctx, 'chargeMid' + (1 + (Math.floor(shot.age / 3) % 2)), sx, sy, flip, 'enemy');
    else if (shot.kind === 'full') drawSprite(ctx, 'chargeFull' + (1 + (Math.floor(shot.age / 3) % 2)), sx, sy, flip, 'enemy');
    else drawSpecialShot(ctx, shot, sx, sy);
  }
}

function fireEnemyShot(x, y, vx, vy, damage, sprite, extra) {
  enemyShots.push({ x, y, vx, vy, damage: damage || 2, w: 6, h: 6, sprite: sprite || 'enemyShot', age: 0, gravity: 0, ...(extra || {}) });
}

function updateEnemyShots() {
  const hitBox = playerHitBox();
  for (let i = enemyShots.length - 1; i >= 0; i--) {
    const shot = enemyShots[i];
    shot.age++;
    shot.vy += shot.gravity;
    shot.x += shot.vx;
    shot.y += shot.vy;
    if (!onScreen(shot.x, shot.y, shot.gravity ? 48 : 8)) {
      enemyShots.splice(i, 1);
      continue;
    }
    if (!player.dead && player.visible && boxesOverlap(centerBox(shot.x, shot.y, shot.w, shot.h), hitBox) && player.invulnTimer === 0) {
      hurtPlayer(shot.damage);
      enemyShots.splice(i, 1);
    }
  }
}

function drawEnemyShots(ctx) {
  for (const shot of enemyShots) {
    const name = shot.frames ? shot.frames[Math.floor(shot.age / shot.frameRate) % shot.frames.length] : shot.sprite;
    drawSprite(ctx, name, shot.x - camera.x, shot.y - camera.y, shot.vx < 0 && !!shot.frames, 'enemy');
  }
}

function createEnemy(spawn) {
  const spec = enemyTypes[spawn.type];
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
    alive: true,
    spawn,
    onGround: true,
    intangible: !!spec.intangible,
  };
  if (spawn.type === 'met') enemy.state = 'hide';
  if (spawn.type === 'blader') {
    enemy.state = 'approach';
    enemy.baseY = spawn.y + 8;
    enemy.y = enemy.baseY;
  }
  if (spawn.type === 'screw') enemy.state = 'closed';
  if (spawn.type === 'blaster') {
    enemy.facing = spawn.facing;
    enemy.x = spawn.x - 8 + spawn.facing * 7;
    enemy.y = spawn.y + 16;
    enemy.state = 'closed';
    enemy.timer = 40;
  }
  if (spawn.type === 'bigEye') {
    enemy.timer = 50;
    enemy.jumps = 0;
  }
  if (spawn.type === 'flea') enemy.timer = 20;
  if (spawn.type === 'pengs') enemy.timer = 20;
  if (spawn.type === 'peng') {
    enemy.baseY = spawn.y;
    enemy.vx = spawn.vx;
    enemy.facing = Math.sign(spawn.vx);
  }
  if (spawn.type === 'joe') {
    enemy.state = 'guard';
    enemy.timer = 40;
    enemy.jumps = 0;
  }
  if (spawn.type === 'picketMan') {
    enemy.state = 'guard';
    enemy.timer = 30;
  }
  enemies.push(enemy);
  return enemy;
}

function enemyShielded(enemy) {
  if (enemy.type === 'met') return enemy.state === 'hide';
  if (enemy.type === 'blaster') return enemy.state === 'closed';
  if (enemy.type === 'joe') return enemy.state === 'guard' || enemy.state === 'jump';
  if (enemy.type === 'picketMan') return enemy.state === 'guard';
  return false;
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
  spawnEffect('explode', enemy.x, enemy.y - enemy.h / 2);
  playSfx('explode');
  const roll = Math.random();
  let drop = null;
  if (roll < 0.03) drop = 'oneUp';
  else if (roll < 0.09) drop = 'energyBig';
  else if (roll < 0.14) drop = 'weaponBig';
  else if (roll < 0.32) drop = 'energySmall';
  else if (roll < 0.42) drop = 'weaponSmall';
  if (drop) spawnItem(drop, enemy.x, enemy.y - enemy.h / 2, true);
}

function applyEnemyGravity(enemy) {
  enemy.vy = Math.min(enemy.vy + 0.25, 7);
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

function updateMet(enemy) {
  aimAtPlayer(enemy);
  if (enemy.state === 'hide') {
    enemy.h = 10;
    enemy.timer--;
    if (enemy.timer <= 0 && Math.abs(player.x - enemy.x) < 96) {
      enemy.state = 'open';
      enemy.timer = 0;
    }
  } else {
    enemy.h = 14;
    enemy.timer++;
    if (enemy.timer === 10) {
      for (const vy of [-1.2, 0, 1.2]) fireEnemyShot(enemy.x + enemy.facing * 6, enemy.y - 8, enemy.facing * 2, vy);
      playSfx('enemyShot');
    }
    if (enemy.timer >= 44) {
      enemy.state = 'hide';
      enemy.timer = 60 + Math.floor(Math.random() * 50);
    }
  }
  applyEnemyGravity(enemy);
}

function updateBlader(enemy) {
  enemy.anim++;
  if (enemy.state === 'approach') {
    aimAtPlayer(enemy);
    enemy.x += enemy.facing * 1;
    enemy.y = enemy.baseY + Math.sin(enemy.anim / 8) * 3;
    if (Math.abs(player.x - enemy.x) < 52 && player.y - 10 > enemy.y) {
      enemy.state = 'dive';
      enemy.vx = enemy.facing * 1.6;
      enemy.vy = Math.min(3.4, 1.2 + (player.y - 10 - enemy.y) / 28);
    }
  } else {
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;
    enemy.vy -= 0.09;
    if (enemy.vy < 0 && enemy.y <= enemy.baseY) {
      enemy.y = enemy.baseY;
      enemy.state = 'approach';
    }
  }
}

function updateScrew(enemy) {
  if (enemy.state === 'closed') {
    enemy.h = 8;
    enemy.timer--;
    if (enemy.timer <= 0 && Math.abs(player.x - enemy.x) < 112) {
      enemy.state = 'open';
      enemy.timer = 0;
    }
  } else {
    enemy.h = 12;
    enemy.timer++;
    enemy.anim++;
    if (enemy.timer === 14 || enemy.timer === 38) {
      const directions = [[-1, 0], [-0.7, -0.7], [0, -1], [0.7, -0.7], [1, 0]];
      for (const [dx, dy] of directions) fireEnemyShot(enemy.x + dx * 6, enemy.y - 10 + dy * 4, dx * 2, dy * 2);
      playSfx('enemyShot');
    }
    if (enemy.timer >= 56) {
      enemy.state = 'closed';
      enemy.timer = 70;
    }
  }
  applyEnemyGravity(enemy);
}

function updateBlaster(enemy) {
  enemy.timer--;
  if (enemy.state === 'closed') {
    if (enemy.timer <= 0) {
      enemy.state = 'open';
      enemy.timer = 64;
    }
  } else {
    const shotIndex = [54, 44, 34, 24].indexOf(enemy.timer);
    if (shotIndex >= 0) {
      const vy = [-1.6, -0.6, 0.6, 1.6][shotIndex];
      fireEnemyShot(enemy.x + enemy.facing * 8, enemy.y - 8, enemy.facing * 2.2, vy, 2, 'beakShot');
      playSfx('enemyShot');
    }
    if (enemy.timer <= 0) {
      enemy.state = 'closed';
      enemy.timer = 90;
    }
  }
}

function updateBigEye(enemy) {
  enemy.justLanded = false;
  if (enemy.onGround) {
    enemy.vx = 0;
    enemy.timer--;
    if (enemy.timer <= 0) {
      aimAtPlayer(enemy);
      enemy.jumps++;
      const high = enemy.jumps % 3 === 0;
      enemy.vy = high ? -6.8 : -4.2;
      enemy.vx = enemy.facing * (high ? 1.1 : 1.5);
      enemy.onGround = false;
      playSfx('jumpBig');
    }
  }
  const result = applyEnemyGravity(enemy);
  if (result.hitWall) enemy.vx = 0;
  if (enemy.justLanded) {
    enemy.timer = 40;
    playSfx('thud');
  }
}

function updateFlea(enemy) {
  enemy.justLanded = false;
  if (enemy.onGround) {
    enemy.vx = 0;
    enemy.timer--;
    if (enemy.timer <= 0) {
      aimAtPlayer(enemy);
      const high = Math.random() < 0.35;
      enemy.vy = high ? -5.2 : -3.6;
      enemy.vx = enemy.facing * (high ? 1.2 : 1.8);
      enemy.onGround = false;
    }
  }
  const result = applyEnemyGravity(enemy);
  if (result.hitWall) enemy.vx = 0;
  if (enemy.justLanded) enemy.timer = 16 + Math.floor(Math.random() * 24);
}

function updatePengSpawner(enemy) {
  enemy.timer--;
  if (enemy.timer > 0) return;
  enemy.timer = 70 + Math.floor(Math.random() * 40);
  const alive = enemies.filter(other => other.type === 'peng' && other.alive).length;
  if (alive >= 3) return;
  const y = enemy.y + Math.floor(Math.random() * 5) * 8 - 16;
  createEnemy({ type: 'peng', x: camera.x + screenWidth + 10, y, vx: -1.4, state: null });
}

function updatePeng(enemy) {
  enemy.anim++;
  enemy.x += enemy.vx;
  enemy.y = enemy.baseY + Math.sin(enemy.anim / 10) * 14;
}

function updateJoe(enemy) {
  enemy.justLanded = false;
  aimAtPlayer(enemy);
  enemy.timer--;
  if (enemy.state === 'guard') {
    if (enemy.timer <= 0) {
      enemy.state = 'lower';
      enemy.timer = 8;
    }
  } else if (enemy.state === 'lower') {
    if (enemy.timer <= 0) {
      enemy.state = 'shoot';
      enemy.timer = 48;
    }
  } else if (enemy.state === 'shoot') {
    if (enemy.timer % 16 === 8) {
      fireEnemyShot(enemy.x + enemy.facing * 12, enemy.y - 8, enemy.facing * 2.6, 0, 3, 'joeShot');
      playSfx('enemyShot');
    }
    if (enemy.timer <= 0) {
      enemy.jumps++;
      if (enemy.jumps % 2 === 0 && enemy.onGround) {
        enemy.state = 'jump';
        enemy.vy = -5;
        enemy.onGround = false;
      } else {
        enemy.state = 'guard';
        enemy.timer = 60 + Math.floor(Math.random() * 40);
      }
    }
  }
  applyEnemyGravity(enemy);
  if (enemy.state === 'jump' && enemy.justLanded) {
    enemy.state = 'guard';
    enemy.timer = 50;
  }
}

function updatePicketMan(enemy) {
  aimAtPlayer(enemy);
  enemy.timer--;
  if (enemy.state === 'guard') {
    if (enemy.timer <= 0) {
      enemy.state = 'windup';
      enemy.timer = 14;
      enemy.throwsLeft = 2 + Math.floor(Math.random() * 2);
    }
  } else if (enemy.state === 'windup') {
    if (enemy.timer <= 0) {
      const vx = Math.max(-2.6, Math.min(2.6, (player.x - enemy.x) / 49));
      fireEnemyShot(enemy.x, enemy.y - 22, vx, -4.4, 3, 'picket0', { gravity: 0.18, frames: ['picket0', 'picket1', 'picket2', 'picket3'], frameRate: 3, w: 10, h: 10 });
      playSfx('throw');
      enemy.state = 'release';
      enemy.timer = 10;
    }
  } else if (enemy.state === 'release' && enemy.timer <= 0) {
    enemy.throwsLeft--;
    if (enemy.throwsLeft > 0) {
      enemy.state = 'windup';
      enemy.timer = 12;
    } else {
      enemy.state = 'guard';
      enemy.timer = 50 + Math.floor(Math.random() * 40);
    }
  }
  applyEnemyGravity(enemy);
}

function updateEnemies(allowContact) {
  const hitBox = playerHitBox();
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    if (!enemy.alive) {
      enemies.splice(i, 1);
      continue;
    }
    if (enemy.flash > 0) enemy.flash--;
    if (enemy.type === 'met') updateMet(enemy);
    else if (enemy.type === 'blader') updateBlader(enemy);
    else if (enemy.type === 'screw') updateScrew(enemy);
    else if (enemy.type === 'blaster') updateBlaster(enemy);
    else if (enemy.type === 'bigEye') updateBigEye(enemy);
    else if (enemy.type === 'flea') updateFlea(enemy);
    else if (enemy.type === 'pengs') updatePengSpawner(enemy);
    else if (enemy.type === 'peng') updatePeng(enemy);
    else if (enemy.type === 'joe') updateJoe(enemy);
    else if (enemy.type === 'picketMan') updatePicketMan(enemy);
    if (!onScreen(enemy.x, enemy.y - enemy.h / 2, 48)) {
      enemy.alive = false;
      if (enemy.spawn.state) enemy.spawn.state = 'dead';
      enemies.splice(i, 1);
      continue;
    }
    if (allowContact && !enemy.intangible && !player.dead && player.visible && boxesOverlap(bodyBox(enemy), hitBox)) hurtPlayer(enemy.damage);
  }
}

function enemySprite(enemy) {
  switch (enemy.type) {
    case 'met':
      return enemy.state === 'hide' ? 'metHide' : 'metOpen';
    case 'blader':
      return Math.floor(enemy.anim / 3) % 2 ? 'blader1' : 'blader2';
    case 'screw':
      if (enemy.state === 'closed') return 'screw0';
      if (enemy.timer < 4 || enemy.timer > 52) return 'screw1';
      return 'screw' + (2 + (Math.floor(enemy.anim / 3) % 3));
    case 'blaster':
      if (enemy.state === 'closed') return enemy.timer < 6 ? 'beak1' : 'beak0';
      if (enemy.timer > 58 || enemy.timer < 6) return enemy.timer > 61 || enemy.timer < 3 ? 'beak1' : 'beak2';
      return 'beak3';
    case 'bigEye':
      if (!enemy.onGround) return enemy.vy < 0 ? 'bigEye2' : 'bigEye3';
      return enemy.timer < 8 ? 'bigEye1' : 'bigEye0';
    case 'flea':
      return enemy.onGround ? 'flea1' : 'flea2';
    case 'peng':
      return Math.floor(enemy.anim / 8) % 2 ? 'peng2' : 'peng1';
    case 'joe':
      if (enemy.state === 'jump') return 'joeJump';
      if (enemy.state === 'shoot') return 'joeShoot';
      return enemy.state === 'lower' ? 'joeLower' : 'joeShield';
    case 'picketMan':
      if (enemy.state === 'windup') return 'picketMan1';
      return enemy.state === 'release' ? 'picketMan2' : 'picketMan0';
  }
  return null;
}

function drawEnemies(ctx) {
  for (const enemy of enemies) {
    const name = enemySprite(enemy);
    if (!name) continue;
    const palette = enemy.flash > 0 && enemy.flash % 2 === 0 ? 'enemyFlash' : 'enemy';
    let drawY = enemy.y - camera.y;
    if (enemy.type === 'blaster') drawY -= 8;
    if (enemy.type === 'blader') drawY += 4;
    if (enemy.type === 'peng') drawY -= 6;
    const flip = enemyTypes[enemy.type].faceLeft ? enemy.facing > 0 : enemy.facing < 0;
    if (enemy.type === 'blaster') {
      const drawX = enemy.facing > 0 ? enemy.x - 7 : enemy.x + 7;
      drawSprite(ctx, name, drawX - camera.x, drawY, flip, palette);
      continue;
    }
    drawSprite(ctx, name, enemy.x - camera.x, drawY, flip, palette);
  }
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
    if (temporary) return;
    type = type === 'weaponBig' ? 'energyBig' : 'energySmall';
  }
  const small = type === 'energySmall' || type === 'weaponSmall';
  const size = small ? { w: 8, h: 8 } : { w: 14, h: 12 };
  items.push({ type, x, y, vy: temporary ? -2 : 0, w: size.w, h: size.h, timer: temporary ? 360 : -1, levelId, anim: 0, onGround: false });
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
    if (item.timer > 0 || item.vy !== 0 || !isStandingOn(item)) {
      item.vy = Math.min(item.vy + 0.25, 7);
      const result = moveBody(item, 0, item.vy);
      if (result.landed) item.vy = 0;
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
  effects.push({ type, x, y, timer: 0, vx: 0, vy: 0, palette: 'enemy', ...(extra || {}) });
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
    let done = false;
    if (effect.type === 'explode') done = effect.timer >= 20;
    else if (effect.type === 'hitSpark') done = effect.timer >= 4;
    else if (effect.type === 'dust') {
      effect.y -= 0.3;
      done = effect.timer >= 12;
    } else if (effect.type === 'orb') done = effect.timer > 300 || !onScreen(effect.x, effect.y, 16);
    if (done) effects.splice(i, 1);
  }
}

function drawEffects(ctx) {
  for (const effect of effects) {
    const sx = effect.x - camera.x;
    const sy = effect.y - camera.y;
    if (effect.type === 'explode') drawSprite(ctx, 'explode' + (1 + Math.min(4, Math.floor(effect.timer / 4))), sx, sy, false, 'enemy');
    else if (effect.type === 'hitSpark') drawSprite(ctx, 'hitSpark', sx, sy, false, 'enemy');
    else if (effect.type === 'dust') drawSprite(ctx, 'dust' + (1 + Math.min(2, Math.floor(effect.timer / 4))), sx, sy, false, 'enemy');
    else if (effect.type === 'orb') {
      const phase = Math.floor(effect.timer / 3) % 4;
      const name = phase === 0 ? 'orbSmall' : phase === 2 ? 'orbBig2' : 'orbBig1';
      drawSprite(ctx, name, sx, sy, false, effect.palette);
    }
  }
}
