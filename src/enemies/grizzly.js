// FUNCTIONS

function grizzlySound(name) {
  switch (name) {
    case 'roar':
      playFrames('grizzlyRoar', 'noise', sweepFrames(2348, 700, 40, 0.5, 0.05));
      playFrames('grizzlyRoarTone', 0.25, sweepFrames(98, 62, 38, 0.3, 0.02));
      break;
    case 'rumble':
      playFrames('grizzlyRumble', 'noise', sweepFrames(1761, 880, 24, 0.28, 0.04));
      break;
    case 'claw':
      playFrames('grizzlyClaw', 'noise', sweepFrames(27965, 4709, 9, 0.36, 0.02));
      playFrames('grizzlyClawTone', 0.125, sweepFrames(1760, 520, 6, 0.14, 0.02));
      break;
    case 'squeak':
      playFrames('grizzlySqueak', 0.25, [[1760, 0.16], [2093, 0.16], [0, 0], [2093, 0.12], [1760, 0.08]]);
      break;
    case 'splash':
      playFrames('grizzlySplash', 'noise', sweepFrames(27965, 3523, 14, 0.26, 0));
      break;
  }
}

function grizzlyShatter(x, y, palette) {
  for (const [vx, vy] of [[-1.6, -3], [-0.7, -3.8], [0.7, -3.8], [1.6, -3]]) spawnEffect('grizzlyShard', x, y, { vx, vy, palette });
  spawnEffect('dust', x, y + 4);
  playSfx('thud');
}

function grizzlyDust(x, y, color) {
  spawnEffect('grizzlyFallDust', x, y, { vy: 0.4, color: color || 0x10 });
}

function grizzlyUpdateMarmot(enemy) {
  aimAtPlayer(enemy);
  enemy.timer--;
  if (enemy.state === 'hide') {
    enemy.h = 7;
    enemy.intangible = true;
    const near = Math.abs(player.x - enemy.x) < 112 && Math.abs(player.y - enemy.y) < 80;
    if (enemy.timer <= 0 && near) {
      enemy.state = 'peek';
      enemy.timer = 24;
      enemy.intangible = false;
      grizzlySound('squeak');
    }
  } else if (enemy.state === 'peek') {
    enemy.h = 10;
    if (enemy.timer <= 0) {
      enemy.state = 'up';
      enemy.timer = 18;
    }
  } else if (enemy.state === 'up') {
    enemy.h = 16;
    if (enemy.timer <= 0) {
      const vx = Math.max(-2.2, Math.min(2.2, (player.x - enemy.x) / 36));
      fireEnemyShot(enemy.x + enemy.facing * 4, enemy.y - 16, vx, -3.6, 2, 'grizzlyPebble', { gravity: 0.2, palette: 'grizzlyStone', solidStop: true });
      playSfx('throw');
      enemy.state = 'throw';
      enemy.timer = 20;
    }
  } else if (enemy.timer <= 0) {
    enemy.state = 'hide';
    enemy.timer = 70 + Math.floor(Math.random() * 40);
  }
  applyEnemyGravity(enemy);
}

function grizzlyMarmotSprite(enemy) {
  if (enemy.state === 'hide') return 'grizzlyMarmotHide';
  if (enemy.state === 'peek') return 'grizzlyMarmotPeek';
  if (enemy.state === 'up') return enemy.timer < 9 ? 'grizzlyMarmotThrow' : 'grizzlyMarmotUp';
  return 'grizzlyMarmotUp';
}

function grizzlyUpdateBat(enemy) {
  enemy.anim++;
  if (enemy.state === 'hang') {
    if (enemy.timer > 0) enemy.timer--;
    else if (Math.abs(player.x - enemy.x) < 80 && player.y > enemy.y && !player.dead) {
      enemy.state = 'wake';
      enemy.timer = 24;
      grizzlySound('squeak');
    }
    return;
  }
  if (enemy.state === 'wake') {
    enemy.timer--;
    if (enemy.timer <= 0) {
      enemy.state = 'fly';
      enemy.timer = 200;
    }
    return;
  }
  const home = enemy.state === 'return';
  const tx = home ? enemy.homeX : player.x;
  const ty = home ? enemy.homeY : player.y - 6;
  const dx = tx - enemy.x;
  const dy = ty - enemy.y;
  const distance = Math.hypot(dx, dy) || 1;
  const speed = home ? 1.3 : 1;
  enemy.x += (dx / distance) * speed;
  enemy.y += (dy / distance) * speed + Math.sin(enemy.anim / 5) * 0.5;
  if (home) {
    if (distance < 2) {
      enemy.x = enemy.homeX;
      enemy.y = enemy.homeY;
      enemy.state = 'hang';
      enemy.timer = 90;
    }
    return;
  }
  enemy.timer--;
  if (enemy.timer <= 0 || boxesOverlap(bodyBox(enemy), playerHitBox())) enemy.state = 'return';
}

function grizzlyBatSprite(enemy) {
  if (enemy.state === 'hang') return 'grizzlyBatHang';
  if (enemy.state === 'wake') return enemy.timer % 8 < 4 ? 'grizzlyBatWake' : 'grizzlyBatHang';
  return Math.floor(enemy.anim / 5) % 2 ? 'grizzlyBatFly1' : 'grizzlyBatFly2';
}

function grizzlyUpdateRoller(enemy) {
  applyEnemyGravity(enemy);
  enemy.timer--;
  if (enemy.state === 'wait') {
    aimAtPlayer(enemy);
    const boulders = enemies.filter(other => other.type === 'grizzlyBoulder' && other.alive).length;
    if (enemy.timer <= 0 && boulders < 2 && Math.abs(player.x - enemy.x) < 136) {
      enemy.state = 'grab';
      enemy.timer = 32;
      grizzlySound('rumble');
    }
  } else if (enemy.state === 'grab') {
    if (enemy.timer <= 0) {
      createEnemy({ type: 'grizzlyBoulder', x: enemy.x + enemy.facing * 18, y: enemy.y, vx: enemy.facing * 1.4, room: enemy.spawn.room });
      playSfx('thud');
      enemy.state = 'push';
      enemy.timer = 16;
    }
  } else if (enemy.timer <= 0) {
    enemy.state = 'wait';
    enemy.timer = 110;
  }
}

function grizzlyDrawRoller(ctx, enemy, sx, sy, palette) {
  const flip = enemy.facing < 0;
  if (enemy.state === 'grab') {
    const lift = enemy.timer < 12 ? 2 : 0;
    const wobble = enemy.timer % 6 < 3 ? 1 : 0;
    drawSprite(ctx, 'grizzlyBoulder0', sx + enemy.facing * (18 + wobble), sy - lift, flip, 'grizzlyStone');
  }
  drawSprite(ctx, enemy.state === 'wait' ? 'grizzlyRoller1' : 'grizzlyRoller2', sx, sy, flip, palette);
}

function grizzlyUpdateBoulder(enemy) {
  enemy.anim++;
  enemy.justLanded = false;
  const result = applyEnemyGravity(enemy);
  if (enemy.justLanded) playSfx('thud');
  if (result.hitWall) {
    grizzlyShatter(enemy.x, enemy.y - 8, 'grizzlyStone');
    enemy.alive = false;
  }
}

function grizzlyBoulderSprite(enemy) {
  const step = Math.floor(enemy.anim / 6) % 4;
  return 'grizzlyBoulder' + (enemy.vx < 0 ? (4 - step) % 4 : step);
}

function grizzlyUpdateSalmon(enemy) {
  enemy.anim++;
  enemy.timer--;
  if (enemy.state === 'lurk') {
    if (enemy.timer % 40 === 0) spawnEffect('bubble', enemy.homeX + (enemy.anim % 80 < 40 ? -4 : 4), enemy.swimY - 4);
    if (enemy.timer <= 0) {
      enemy.state = 'ready';
      enemy.timer = 42;
    }
  } else if (enemy.state === 'ready') {
    if (enemy.timer % 14 === 0) {
      spawnEffect('splash', enemy.homeX, enemy.surfaceY + 2);
      spawnEffect('bubble', enemy.homeX + (enemy.timer % 28 ? 3 : -3), enemy.swimY - 2);
    }
    if (enemy.timer <= 0) {
      enemy.state = 'leap';
      enemy.intangible = false;
      enemy.vy = -5.4;
      enemy.splashed = false;
      spawnEffect('splash', enemy.x, enemy.surfaceY + 2);
      grizzlySound('splash');
    }
  } else {
    enemy.vy = Math.min(enemy.vy + 0.2, 5);
    enemy.y += enemy.vy;
    if (enemy.vy > 0 && !enemy.splashed && enemy.y - 8 > enemy.surfaceY) {
      enemy.splashed = true;
      spawnEffect('splash', enemy.x, enemy.surfaceY + 2);
      grizzlySound('splash');
    }
    if (enemy.vy > 0 && enemy.y >= enemy.swimY) {
      enemy.y = enemy.swimY;
      enemy.state = 'lurk';
      enemy.intangible = true;
      enemy.timer = 80 + Math.floor(Math.random() * 40);
    }
  }
}

function grizzlySalmonSprite(enemy) {
  if (enemy.state !== 'leap') return null;
  return (enemy.vy < 0 ? 'grizzlySalmon' : 'grizzlySalmonDive') + (1 + (Math.floor(enemy.anim / 6) % 2));
}

function grizzlyUpdateStalactite(enemy) {
  if (enemy.state === 'hang') {
    if (!player.dead && Math.abs(player.x - enemy.baseX) < enemy.range && player.y > enemy.y) {
      enemy.state = 'shake';
      enemy.timer = 48;
      grizzlySound('rumble');
    }
    return;
  }
  if (enemy.state === 'shake') {
    enemy.timer--;
    enemy.x = enemy.baseX + (Math.floor(enemy.timer / 2) % 2 ? 1 : -1);
    if (enemy.timer % 5 === 0) grizzlyDust(enemy.baseX - 4 + Math.random() * 8, enemy.y - 2, 0x2D);
    if (enemy.timer === 24) grizzlySound('rumble');
    if (enemy.timer <= 0) {
      enemy.state = 'fall';
      enemy.x = enemy.baseX;
      enemy.intangible = false;
      enemy.vy = 0;
    }
    return;
  }
  enemy.vy = Math.min(enemy.vy + 0.3, 6);
  enemy.y += enemy.vy;
  if (solidAt(enemy.x, enemy.y)) {
    enemy.y = Math.floor(enemy.y / tileSize) * tileSize;
    grizzlyShatter(enemy.x, enemy.y - 6, 'grizzlyCave');
    enemy.alive = false;
    enemy.spawn.state = 'dead';
  }
}

// INITIALIZATION

Object.assign(effectTypes, {
  grizzlyShard: {
    update(effect) {
      effect.vy += 0.25;
      return effect.timer >= 32;
    },
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'grizzlyShard', sx, sy, false, effect.palette),
  },
  grizzlyFallDust: {
    update(effect) {
      effect.vy = Math.min(effect.vy + 0.12, 2.4);
      return effect.timer >= (effect.life || 28);
    },
    draw(ctx, effect, sx, sy) {
      ctx.fillStyle = nesPalette[effect.color];
      ctx.fillRect(Math.round(sx), Math.round(sy), 2, 2);
    },
  },
});

Object.assign(enemyTypes, {
  grizzlyMarmot: {
    w: 14,
    h: 7,
    hp: 2,
    damage: 3,
    palette: 'grizzlyEnemy',
    init(enemy) {
      enemy.state = 'hide';
      enemy.timer = 30;
      enemy.intangible = true;
    },
    update: grizzlyUpdateMarmot,
    shielded: enemy => enemy.state === 'peek',
    sprite: grizzlyMarmotSprite,
  },
  grizzlyBat: {
    w: 14,
    h: 10,
    hp: 1,
    damage: 3,
    palette: 'grizzlyEnemy',
    init(enemy, spawn) {
      enemy.state = 'hang';
      enemy.timer = 0;
      enemy.homeX = spawn.x;
      enemy.homeY = spawn.y + 11;
      enemy.y = enemy.homeY;
    },
    update: grizzlyUpdateBat,
    sprite: grizzlyBatSprite,
  },
  grizzlyRoller: {
    w: 18,
    h: 18,
    hp: 6,
    damage: 4,
    palette: 'grizzlyEnemy',
    init(enemy) {
      enemy.state = 'wait';
      enemy.timer = 50;
    },
    update: grizzlyUpdateRoller,
    draw: grizzlyDrawRoller,
  },
  grizzlyBoulder: {
    w: 14,
    h: 14,
    hp: 3,
    damage: 3,
    noDrop: true,
    palette: 'grizzlyStone',
    init(enemy, spawn) {
      enemy.vx = spawn.vx;
      enemy.facing = Math.sign(spawn.vx);
      enemy.onGround = false;
    },
    update: grizzlyUpdateBoulder,
    sprite: grizzlyBoulderSprite,
    onDestroy: enemy => grizzlyShatter(enemy.x, enemy.y - 8, 'grizzlyStone'),
  },
  grizzlySalmon: {
    w: 12,
    h: 14,
    hp: 2,
    damage: 3,
    palette: 'grizzlyEnemy',
    intangible: true,
    drawStun: false,
    init(enemy, spawn) {
      enemy.surfaceY = spawn.y;
      enemy.swimY = spawn.y + 14;
      enemy.homeX = spawn.x;
      enemy.y = enemy.swimY;
      enemy.state = 'lurk';
      enemy.timer = spawn.delay || 50;
    },
    update: grizzlyUpdateSalmon,
    sprite: grizzlySalmonSprite,
  },
  grizzlyStalactite: {
    w: 10,
    h: 14,
    hp: 1,
    damage: 4,
    invincible: true,
    intangible: true,
    noDrop: true,
    palette: 'grizzlyCave',
    drawStun: false,
    init(enemy, spawn) {
      enemy.state = 'hang';
      enemy.y = spawn.y + 15;
      enemy.baseX = spawn.x;
      enemy.range = spawn.range || 44;
    },
    update: grizzlyUpdateStalactite,
    sprite: () => 'grizzlyStalactite',
  },
});
