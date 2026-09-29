// FUNCTIONS

function playHiveSfx(name) {
  if (!audioCtx) return;
  switch (name) {
    case 'buzz':
      playFrames('hiveBuzz', 0.125, [
        [196, 0.18],
        [208, 0.18],
        [196, 0.16],
        [208, 0.16],
        [196, 0.14],
        [208, 0.12],
        [196, 0.08],
      ]);
      break;
    case 'swarm':
      playFrames('hiveSwarm', 0.25, [
        [880, 0.2],
        [932, 0.2],
        [880, 0.18],
        [988, 0.18],
        [932, 0.16],
        [1046, 0.14],
        [988, 0.1],
        [1046, 0.06],
      ]);
      break;
    case 'drip':
      playFrames('hiveDrip', 0.5, sweepFrames(1200, 2400, 4, 0.14, 0.04));
      break;
    case 'splat':
      playFrames('hiveSplat', 'noise', sweepFrames(5000, 900, 10, 0.32, 0));
      break;
    case 'cough':
      playFrames('hiveCough', 'noise', [...sweepFrames(3000, 1500, 6, 0.3, 0.05), [0, 0], [0, 0], ...sweepFrames(2600, 1200, 6, 0.26, 0)]);
      break;
    case 'beeLaunch':
      playFrames('hiveBee', 0.25, sweepFrames(520, 1100, 6, 0.18, 0.05));
      break;
    case 'hiveRelease':
      playFrames('hiveBee', 0.125, [
        [330, 0.14],
        [349, 0.14],
        [330, 0.12],
        [349, 0.1],
        [330, 0.06],
      ]);
      break;
  }
}

function hiveFloorAhead(enemy) {
  const x = enemy.x + enemy.facing * (enemy.w / 2 + 1);
  const row = Math.floor((enemy.y + 1) / tileSize);
  const col = Math.floor(x / tileSize);
  return (isSolidTile(col, row) || isOneWayTile(col, row)) && tileTypeAt(col, row) !== 'slow';
}

function updateBeeDrone(enemy) {
  enemy.anim++;
  enemy.x += enemy.vx;
  const targetY = player.y - 6;
  enemy.baseY += Math.max(-0.35, Math.min(0.35, targetY - enemy.baseY));
  enemy.y = enemy.baseY + Math.sin(enemy.anim / 11) * 12;
}

function updateBeeHive(enemy) {
  enemy.anim++;
  if (enemy.release > 0) {
    enemy.release--;
    if (enemy.release === 0) {
      const dir = player.x < enemy.x ? -1 : 1;
      createEnemy({ type: 'beeDrone', x: enemy.x, y: enemy.y - 2, dir, state: null });
      playHiveSfx('hiveRelease');
    }
    return;
  }
  enemy.timer--;
  if (enemy.timer > 0) return;
  enemy.timer = 150;
  const alive = enemies.filter(other => other.type === 'beeDrone' && other.alive).length;
  const side = player.x < enemy.x ? -1 : 1;
  if (alive >= 2 || Math.abs(player.x - enemy.x) > 176 || (enemy.side && side !== enemy.side)) return;
  enemy.release = 30;
}

function updateLadybugTank(enemy) {
  enemy.anim++;
  enemy.timer--;
  if (enemy.state === 'walk') {
    enemy.vx = enemy.facing * 0.5;
    if (!hiveFloorAhead(enemy)) {
      enemy.facing = -enemy.facing;
      enemy.vx = 0;
    }
    if (enemy.timer <= 0 && Math.abs(player.x - enemy.x) < 128) {
      aimAtPlayer(enemy);
      enemy.state = 'open';
      enemy.timer = 20;
      enemy.vx = 0;
    }
  } else if (enemy.state === 'open') {
    enemy.vx = 0;
    if (enemy.timer <= 0) {
      enemy.state = 'fire';
      enemy.timer = 60;
    }
  } else if (enemy.state === 'fire') {
    enemy.vx = 0;
    if (enemy.timer === 59 || enemy.timer === 35) {
      fireEnemyShot(enemy.x + enemy.facing * 10, enemy.y - 5, enemy.facing * 2, 0, 2, 'hiveLadyShot', { solidStop: true });
      playSfx('enemyShot');
    }
    if (enemy.timer <= 0) {
      enemy.state = 'walk';
      enemy.timer = 100 + Math.floor(Math.random() * 40);
    }
  }
  const result = applyEnemyGravity(enemy);
  if (result.hitWall) enemy.facing = -enemy.facing;
}

function hiveSpitSeed(enemy, reach) {
  const x = enemy.x;
  const y = enemy.y - 22;
  const vx = Math.max(-2.4, Math.min(2.4, ((player.x - x) * reach) / 50));
  fireEnemyShot(x, y, vx, -3.4, 2, 'hiveSeed', { gravity: 0.15, solidStop: true, w: 6, h: 6 });
}

function updateSeedFlower(enemy) {
  enemy.timer--;
  if (enemy.state === 'closed') {
    if (enemy.timer <= 0 && Math.abs(player.x - enemy.x) < 144) {
      enemy.state = 'open';
      enemy.timer = 26;
    }
  } else if (enemy.state === 'open') {
    if (enemy.timer <= 0) {
      hiveSpitSeed(enemy, 1);
      hiveSpitSeed(enemy, 0.55);
      playSfx('throw');
      enemy.state = 'spit';
      enemy.timer = 14;
    }
  } else if (enemy.state === 'spit' && enemy.timer <= 0) {
    enemy.state = 'closed';
    enemy.timer = 80 + Math.floor(Math.random() * 30);
  }
}

function updateHoneyDropShot(shot) {
  shot.vy = Math.min(shot.vy + 0.25, 6);
  shot.y += shot.vy;
  const col = Math.floor(shot.x / tileSize);
  const row = Math.floor((shot.y + 3) / tileSize);
  if (isSolidTile(col, row) || (isOneWayTile(col, row) && shot.y + 3 - shot.vy <= row * tileSize + 1)) {
    spawnEffect('honeySplash', shot.x, row * tileSize);
    if (onScreen(shot.x, shot.y, 0)) playHiveSfx('splat');
    return false;
  }
  return true;
}

function updateHoneyDrip(enemy) {
  enemy.timer--;
  if (enemy.state === 'wait') {
    if (enemy.timer <= 0) {
      enemy.state = 'swell';
      enemy.timer = 44;
      playHiveSfx('drip');
    }
  } else if (enemy.state === 'swell' && enemy.timer <= 0) {
    fireEnemyShot(enemy.x, enemy.y + 8, 0, 0.5, 3, 'honeyDrop', { gravity: 0.25, w: 6, h: 8, update: updateHoneyDropShot });
    enemy.state = 'wait';
    enemy.timer = enemy.period;
  }
}

function drawHoneyDrip(ctx, enemy, sx, sy) {
  if (enemy.state !== 'swell') {
    drawSprite(ctx, 'hiveDripNub', sx, sy, false, 'enemy');
    return;
  }
  const size = enemy.timer > 30 ? 1 : enemy.timer > 14 ? 2 : 3;
  const shake = size === 3 && enemy.timer % 4 < 2 ? 1 : 0;
  drawSprite(ctx, 'hiveDripSwell' + size, sx + shake, sy, false, 'enemy');
}

// INITIALIZATION

Object.assign(effectTypes, {
  honeySplash: {
    update: effect => effect.timer >= 12,
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, effect.timer < 6 ? 'honeySplash1' : 'honeySplash2', sx, sy, false, 'enemy'),
  },
});

Object.assign(enemyTypes, {
  beeDrone: {
    w: 14,
    h: 10,
    hp: 1,
    damage: 2,
    init(enemy, spawn) {
      enemy.facing = spawn.dir || (player.x < spawn.x ? -1 : 1);
      enemy.vx = enemy.facing * 1.15;
      enemy.baseY = spawn.y;
      enemy.anim = Math.floor(Math.random() * 60);
    },
    update: updateBeeDrone,
    sprite: enemy => (Math.floor(enemy.anim / 2) % 2 ? 'beeDrone2' : 'beeDrone1'),
  },
  beeHive: {
    w: 16,
    h: 15,
    hp: 5,
    damage: 3,
    init(enemy, spawn) {
      enemy.y = spawn.y + 15;
      enemy.side = spawn.side || 0;
      enemy.timer = 40;
      enemy.release = 0;
    },
    update: updateBeeHive,
    sprite: enemy => (enemy.release > 0 && Math.floor(enemy.release / 4) % 2 ? 'beeHive2' : 'beeHive1'),
    drawOffset: enemy => ({ x: enemy.release > 0 && enemy.release % 4 < 2 ? 1 : 0, y: -15 }),
  },
  ladybugTank: {
    w: 20,
    h: 11,
    hp: 3,
    damage: 3,
    init(enemy) {
      enemy.state = 'walk';
      enemy.timer = 60;
    },
    update: updateLadybugTank,
    shielded: enemy => enemy.state === 'walk',
    sprite(enemy) {
      if (enemy.state === 'walk') return Math.floor(enemy.anim / 8) % 2 ? 'ladybugTank2' : 'ladybugTank1';
      return 'ladybugTankOpen';
    },
  },
  seedFlower: {
    w: 14,
    h: 26,
    hp: 3,
    damage: 3,
    init(enemy) {
      enemy.state = 'closed';
      enemy.timer = 40;
    },
    update: updateSeedFlower,
    sprite(enemy) {
      if (enemy.state === 'open') return 'seedFlowerOpen';
      if (enemy.state === 'spit') return 'seedFlowerSpit';
      return 'seedFlowerClosed';
    },
  },
  honeyDrip: {
    w: 8,
    h: 8,
    hp: 1,
    damage: 0,
    intangible: true,
    harmless: true,
    noDrop: true,
    drawStun: false,
    init(enemy, spawn) {
      enemy.state = 'wait';
      enemy.timer = spawn.delay || 30;
      enemy.period = spawn.period || 70;
      enemy.y = spawn.y;
    },
    update: updateHoneyDrip,
    draw: drawHoneyDrip,
  },
});
