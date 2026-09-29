// FUNCTIONS

function marineJellyCenter(enemy) {
  return { x: enemy.x, y: enemy.y - 10 };
}

function marineJellyZapShot(enemy) {
  const center = marineJellyCenter(enemy);
  fireEnemyShot(center.x, center.y, 0, 0, 3, 'marineZapBolt', {
    w: 40,
    h: 40,
    piercing: true,
    owner: enemy,
    update(shot) {
      if (!shot.owner.alive) return false;
      const spot = marineJellyCenter(shot.owner);
      shot.x = spot.x;
      shot.y = spot.y;
      return shot.age < 24;
    },
    draw(ctx, shot, sx, sy) {
      const turn = shot.age * 0.35;
      const radius = 12 + Math.min(8, shot.age);
      for (let i = 0; i < 8; i++) {
        const angle = turn + (i / 8) * Math.PI * 2;
        drawSprite(ctx, 'marineZapBolt', sx + Math.cos(angle) * radius, sy + Math.sin(angle) * radius, i % 2 === 1, 'marineEnemy');
      }
    },
  });
}

function updateMarineJelly(enemy) {
  enemy.anim++;
  enemy.timer--;
  const center = marineJellyCenter(enemy);
  const distance = Math.hypot(player.x - center.x, player.y - 12 - center.y);
  if (enemy.state === 'drift') {
    const phase = enemy.anim % 64;
    const dy = phase < 12 ? -1 : 0.35;
    const dx = Math.sign(player.x - enemy.x) * 0.3;
    const nextX = Math.max(enemy.homeX - enemy.leash, Math.min(enemy.homeX + enemy.leash, enemy.x + dx));
    moveBody(enemy, nextX - enemy.x, 0);
    const nextY = Math.max(enemy.homeY - enemy.rise, Math.min(enemy.homeY + 16, enemy.y + dy));
    moveBody(enemy, 0, nextY - enemy.y);
    if (enemy.timer <= 0 && distance < 72) {
      enemy.state = 'charge';
      enemy.timer = 36;
      playSfx('enemyShot');
    }
  } else if (enemy.state === 'charge') {
    if (enemy.timer % 12 === 0) playSfx('tink');
    if (enemy.timer <= 0) {
      enemy.state = 'zap';
      enemy.timer = 24;
      marineJellyZapShot(enemy);
      playSfx('burst');
    }
  } else if (enemy.timer <= 0) {
    enemy.state = 'drift';
    enemy.timer = 90;
  }
}

function updateMarinePiranhaSchool(enemy) {
  enemy.timer--;
  if (enemy.timer > 0) return;
  enemy.timer = 60;
  if (enemy.spawn.untilX && player.x > enemy.spawn.untilX) return;
  const alive = enemies.filter(other => other.type === 'marinePiranha' && other.alive).length;
  if (alive >= 3) return;
  const fromLeft = enemy.spawn.from === 'left';
  const x = fromLeft ? camera.x - 10 : camera.x + screenWidth + 10;
  const y = enemy.y + [-4, -20, -36][enemy.count % 3];
  enemy.count++;
  createEnemy({ type: 'marinePiranha', x, y, vx: fromLeft ? 1.3 : -1.3, state: null });
}

function updateMarinePiranha(enemy) {
  enemy.anim++;
  enemy.x += enemy.vx;
  enemy.y = enemy.baseY + Math.sin(enemy.anim / 12) * 6;
}

function updateMarinePiranhaLeap(enemy) {
  enemy.anim++;
  enemy.timer--;
  enemy.intangible = enemy.state === 'wait';
  if (enemy.state === 'wait') {
    enemy.y = enemy.homeY + Math.sin(enemy.anim / 10) * 2;
    if (enemy.timer <= 0 && Math.abs(player.x - enemy.x) < 120) {
      enemy.state = 'ripple';
      enemy.timer = 36;
    }
  } else if (enemy.state === 'ripple') {
    enemy.y = Math.max(enemy.surfaceY + 10, enemy.y - 0.6);
    if (enemy.timer % 6 === 0) spawnEffect('bubble', enemy.x + (Math.random() * 10 - 5), enemy.y - 8);
    if (enemy.timer % 12 === 0) spawnEffect('splash', enemy.x, enemy.surfaceY);
    if (enemy.timer <= 0) {
      enemy.state = 'leap';
      enemy.vy = -4.7;
      enemy.facing = player.x < enemy.x ? -1 : 1;
      spawnEffect('splash', enemy.x, enemy.surfaceY);
      playSfx('jumpBig');
    }
  } else {
    const inWater = enemy.y > enemy.surfaceY;
    enemy.vy = Math.min(enemy.vy + (inWater ? 0.12 : 0.2), inWater ? 2 : 6);
    enemy.y += enemy.vy;
    enemy.x += enemy.facing * 0.4;
    if (enemy.vy > 0 && enemy.y > enemy.surfaceY && enemy.y - enemy.vy <= enemy.surfaceY) spawnEffect('splash', enemy.x, enemy.surfaceY);
    if (enemy.vy > 0 && enemy.y >= enemy.homeY) {
      enemy.y = enemy.homeY;
      enemy.x = enemy.homeX;
      enemy.state = 'wait';
      enemy.timer = 70;
    }
  }
}

function marineCrabGroundAhead(enemy, dir) {
  const probeX = enemy.x + dir * (enemy.w / 2 + 2);
  return solidAt(probeX, enemy.y + 4) && !solidAt(probeX, enemy.y - 6);
}

function updateMarineCrab(enemy) {
  enemy.justLanded = false;
  if (enemy.hp < enemy.lastHp) {
    enemy.state = 'hide';
    enemy.timer = 44;
    playSfx('tink');
  }
  enemy.lastHp = enemy.hp;
  enemy.timer--;
  if (enemy.state === 'hide') {
    enemy.vx = 0;
    if (enemy.timer <= 0) {
      enemy.state = 'rush';
      enemy.timer = 40;
      aimAtPlayer(enemy);
    }
  } else {
    enemy.anim++;
    if (enemy.state === 'walk' && enemy.timer <= 0) {
      aimAtPlayer(enemy);
      enemy.timer = 50;
    }
    if (enemy.state === 'rush' && enemy.timer <= 0) enemy.state = 'walk';
    const speed = enemy.state === 'rush' ? 0.9 : 0.45;
    if (enemy.onGround && !marineCrabGroundAhead(enemy, enemy.facing)) enemy.facing = -enemy.facing;
    enemy.vx = enemy.onGround ? enemy.facing * speed : 0;
  }
  const result = applyEnemyGravity(enemy);
  if (result.hitWall) enemy.facing = -enemy.facing;
}

function updateMarineLantern(enemy) {
  aimAtPlayer(enemy);
  enemy.timer--;
  if (enemy.state === 'dim') {
    if (enemy.timer <= 0 && Math.abs(player.x - enemy.x) < 128 && Math.abs(player.y - enemy.y) < 96) {
      enemy.state = 'glow';
      enemy.timer = 32;
    }
  } else if (enemy.state === 'glow') {
    if (enemy.timer <= 0) {
      const x = enemy.x + enemy.facing * 6;
      const y = enemy.y - 18;
      const dx = player.x - x;
      const dy = player.y - 12 - y;
      const length = Math.hypot(dx, dy) || 1;
      fireEnemyShot(x, y, (dx / length) * 1.7, (dy / length) * 1.7, 3, 'marineLampShot', { palette: 'marineEnemy', w: 6, h: 6 });
      playSfx('enemyShot');
      enemy.state = 'dim';
      enemy.timer = 80;
    }
  }
  applyEnemyGravity(enemy);
}

// INITIALIZATION

Object.assign(enemyTypes, {
  marineJelly: {
    w: 14,
    h: 15,
    hp: 3,
    damage: 2,
    palette: 'marineEnemy',
    init(enemy, spawn) {
      enemy.state = 'drift';
      enemy.timer = 60;
      enemy.homeX = spawn.x;
      enemy.homeY = spawn.y;
      enemy.leash = spawn.leash || 40;
      enemy.rise = spawn.rise || 32;
    },
    update: updateMarineJelly,
    draw(ctx, enemy, sx, sy, palette) {
      const squeeze = enemy.anim % 64 < 12;
      let name = squeeze ? 'marineJelly2' : 'marineJelly1';
      let tint = palette;
      if (enemy.state === 'charge' && Math.floor(enemy.timer / 3) % 2 === 0) tint = 'marineJellyZap';
      if (enemy.state === 'zap') {
        name = 'marineJelly1';
        tint = Math.floor(enemy.timer / 2) % 2 ? 'marineJellyZap' : palette;
      }
      drawSprite(ctx, name, sx, sy, false, tint);
      if (enemy.state === 'charge' && enemy.timer % 6 < 3) {
        const side = enemy.timer % 12 < 6 ? 1 : -1;
        drawSprite(ctx, 'marineZapBolt', sx + side * 10, sy - 4 - (enemy.timer % 5), side < 0, 'marineEnemy');
        drawSprite(ctx, 'marineZapBolt', sx - side * 6, sy + 2, side > 0, 'marineEnemy');
      }
    },
  },
  marinePiranhaSchool: {
    w: 2,
    h: 2,
    hp: 1,
    damage: 0,
    intangible: true,
    harmless: true,
    init(enemy) {
      enemy.timer = 20;
      enemy.count = 0;
    },
    update: updateMarinePiranhaSchool,
    sprite: () => null,
  },
  marinePiranha: {
    w: 14,
    h: 10,
    hp: 1,
    damage: 2,
    palette: 'marineEnemy',
    init(enemy, spawn) {
      enemy.baseY = spawn.y;
      enemy.vx = spawn.vx;
      enemy.facing = Math.sign(spawn.vx);
      enemy.anim = Math.floor(Math.random() * 20);
    },
    update: updateMarinePiranha,
    sprite: enemy => (Math.floor(enemy.anim / 8) % 2 ? 'marinePiranha2' : 'marinePiranha1'),
  },
  marinePiranhaLeap: {
    w: 14,
    h: 10,
    hp: 1,
    damage: 3,
    palette: 'marineEnemy',
    screenMargin: 64,
    init(enemy, spawn) {
      enemy.state = 'wait';
      enemy.timer = 50;
      enemy.homeX = spawn.x;
      enemy.homeY = spawn.y;
      enemy.surfaceY = spawn.surfaceY;
    },
    update: updateMarinePiranhaLeap,
    sprite(enemy) {
      if (enemy.state === 'leap') return enemy.vy < 0 ? 'marinePiranha2' : 'marinePiranha1';
      return Math.floor(enemy.anim / 10) % 2 ? 'marinePiranha2' : 'marinePiranha1';
    },
  },
  marineCrab: {
    w: 18,
    h: 13,
    hp: 3,
    damage: 3,
    palette: 'marineEnemy',
    init(enemy) {
      enemy.state = 'walk';
      enemy.timer = 30;
      enemy.lastHp = 3;
    },
    update: updateMarineCrab,
    shielded: enemy => enemy.state === 'hide',
    sprite(enemy) {
      if (enemy.state === 'hide') return 'marineCrabHide';
      return Math.floor(enemy.anim / 8) % 2 ? 'marineCrab2' : 'marineCrab1';
    },
  },
  marineLantern: {
    w: 20,
    h: 14,
    hp: 5,
    damage: 3,
    palette: 'marineEnemy',
    init(enemy) {
      enemy.state = 'dim';
      enemy.timer = 40;
    },
    update: updateMarineLantern,
    sprite: enemy => (enemy.state === 'glow' && Math.floor(enemy.timer / 3) % 2 === 0 ? 'marineLanternGlow' : 'marineLanternIdle'),
  },
});
