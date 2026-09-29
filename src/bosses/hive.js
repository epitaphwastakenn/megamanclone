// VARIABLES

const hivePattern = ['guard', 'dash', 'honey', 'guard', 'honey', 'dash'];
const hiveNoBox = { left: -9999, top: -9999, right: -9998, bottom: -9998 };

// FUNCTIONS

function hiveArena() {
  const bounds = currentRoomBounds();
  return { left: bounds.left + tileSize, right: bounds.right - tileSize, top: bounds.top + tileSize * 2, floor: bounds.top + tileSize * 12 };
}

function hiveSpawn(boss) {
  Object.assign(boss.ai, { action: 'stand', timer: 40, blink: 0, shake: 0, step: 0, orbit: 0, dashLow: true, flung: false, hover: 0, sideX: 0, flap: 0, dodge: 0 });
}

function hiveBees() {
  return bossShots.filter(shot => shot.kind === 'hiveBee' && !shot.dead);
}

function hiveSetAction(action, timer) {
  boss.ai.action = action;
  boss.ai.timer = timer;
}

function hiveChooseAction() {
  const ai = boss.ai;
  bossFacePlayer();
  let next = hivePattern[ai.step % hivePattern.length];
  ai.step++;
  if (next !== 'guard' && Math.random() < 0.25) {
    next = next === 'dash' ? 'honey' : 'dash';
  }
  if (next === 'honey' && bossShots.filter(shot => shot.kind === 'hivePuddle').length >= 2) next = 'dash';
  if (next === 'guard') {
    hiveSetAction('summon', 32);
    playHiveSfx('buzz');
  } else if (next === 'honey') {
    hiveSetAction('crouch', 16);
  } else {
    hiveStartDash();
  }
}

function hiveStartDash() {
  const ai = boss.ai;
  const arena = hiveArena();
  const center = (arena.left + arena.right) / 2;
  ai.sideX = player.x < center ? arena.right - 26 : arena.left + 26;
  ai.dashLow = !ai.dashLow;
  if (Math.random() < 0.3) ai.dashLow = !ai.dashLow;
  if (player.slowTimer > 0) ai.dashLow = false;
  boss.onGround = false;
  boss.vx = 0;
  boss.vy = 0;
  hiveSetAction('buzzUp', 30);
}

function hiveSpawnBee(slot) {
  spawnBossShot('hiveBee', boss.x + boss.facing * 6, boss.y - 24, { slot, state: 'emerge', timer: 14, fromX: boss.x + boss.facing * 6, fromY: boss.y - 24 });
}

function hiveOrbitPoint(slot) {
  const angle = boss.ai.orbit + (slot * Math.PI) / 2;
  return { x: boss.x + Math.cos(angle) * 24, y: boss.y - 20 + Math.sin(angle) * 17 };
}

function hiveMoveToward(targetX, targetY, speed) {
  const dx = targetX - boss.x;
  const dy = targetY - boss.y;
  boss.x += Math.max(-speed, Math.min(speed, dx));
  boss.y += Math.max(-speed, Math.min(speed, dy));
  return Math.abs(dx) <= speed && Math.abs(dy) <= speed;
}

function hiveDropHoney() {
  const arena = hiveArena();
  const first = Math.max(arena.left + 20, Math.min(arena.right - 20, player.x));
  const roomLeft = first - arena.left;
  const roomRight = arena.right - first;
  let second = roomLeft > roomRight ? first - 64 : first + 64;
  second = Math.max(arena.left + 20, Math.min(arena.right - 20, second));
  for (const [index, targetX] of [first, second].entries()) {
    spawnBossShot('hiveHoney', boss.x + (index ? 8 : -8), boss.y - 30, { phase: 'up', vx: (index ? 1 : -1) * 0.6, targetX, delay: index * 10 });
  }
  playSfx('throw');
}

function hiveUpdateGround(ai) {
  if (ai.action === 'stand') {
    bossFacePlayer();
    if (boss.onGround) boss.vx = 0;
    if (boss.onGround && stageEvents.playerFired && ai.dodge <= 0 && Math.random() < 0.45) {
      boss.vy = -4.2;
      boss.vx = -boss.facing * 0.8;
      boss.onGround = false;
      ai.dodge = 70;
      playHiveSfx('buzz');
    } else if (ai.timer <= 0 && boss.onGround) hiveChooseAction();
  } else if (ai.action === 'summon') {
    boss.vx = 0;
    if ([26, 21, 16, 11].includes(ai.timer)) hiveSpawnBee([26, 21, 16, 11].indexOf(ai.timer));
    if (ai.timer <= 0) hiveSetAction('guard', 130);
  } else if (ai.action === 'guard') {
    bossFacePlayer();
    const distance = Math.abs(player.x - boss.x);
    boss.vx = distance > 88 ? boss.facing * 0.45 : distance < 48 ? -boss.facing * 0.45 : 0;
    if (ai.timer % 24 === 0) playHiveSfx('buzz');
    if (ai.timer <= 0 || !hiveBees().length) hiveSetAction('launch', 0);
  } else if (ai.action === 'launch') {
    boss.vx = 0;
    bossFacePlayer();
    const bees = hiveBees();
    if (!bees.some(bee => bee.state === 'flash')) {
      const next = bees.find(bee => bee.state === 'orbit');
      if (next) {
        next.state = 'flash';
        next.timer = 24;
      } else hiveSetAction('stand', 34);
    }
  } else if (ai.action === 'crouch') {
    boss.vx = 0;
    if (ai.timer <= 0) {
      const arena = hiveArena();
      const center = (arena.left + arena.right) / 2;
      boss.vy = -6.6;
      boss.vx = Math.max(-1.2, Math.min(1.2, (center - boss.x) / 60));
      boss.onGround = false;
      ai.flung = false;
      ai.hover = 0;
      hiveSetAction('honey', 0);
      playSfx('jumpBig');
    }
  } else if (ai.action === 'cough') {
    boss.vx = 0;
    if (ai.timer % 7 === 0) spawnEffect('hiveSmoke', boss.x + boss.facing * (4 + Math.random() * 8), boss.y - 22 - Math.random() * 10, { vy: -0.4, vx: (Math.random() - 0.5) * 0.6 });
    if (ai.timer === 30 || ai.timer === 12) playHiveSfx('cough');
    if (ai.timer <= 0) hiveSetAction('stand', 20);
  } else if (ai.action === 'bonk') {
    boss.vx = 0;
    if (boss.onGround && ai.timer <= 0) hiveSetAction('stand', 28);
  }
  bossPhysics();
}

function hiveUpdateHoney(ai) {
  if (ai.hover > 0) {
    ai.hover--;
    boss.vy = 0;
    boss.vx = 0;
    if (ai.hover === 10) hiveDropHoney();
    return;
  }
  if (!ai.flung && boss.vy >= 0) {
    ai.flung = true;
    ai.hover = 20;
    ai.shake = 20;
    return;
  }
  bossPhysics();
  if (boss.onGround && ai.flung) hiveSetAction('stand', 30);
}

function hiveUpdateFlight(ai) {
  const arena = hiveArena();
  ai.flap++;
  if (ai.flap % 6 === 0) playHiveSfx('buzz');
  if (ai.action === 'buzzUp') {
    boss.facing = ai.sideX > boss.x ? 1 : -1;
    const targetY = Math.max(arena.top + 40, arena.floor - 60);
    hiveMoveToward(ai.sideX, targetY, 1.8);
    if (ai.timer <= 0) hiveSetAction('buzzAim', 0);
  } else if (ai.action === 'buzzAim') {
    const targetY = ai.dashLow ? arena.floor - 2 : arena.floor - 15;
    if (hiveMoveToward(ai.sideX, targetY, 1.8)) {
      boss.x = ai.sideX;
      boss.y = targetY;
      hiveSetAction('buzzHold', 30);
      ai.shake = 30;
    }
    bossFacePlayer();
  } else if (ai.action === 'buzzHold') {
    boss.facing = boss.x < (arena.left + arena.right) / 2 ? 1 : -1;
    if (ai.timer <= 0) {
      hiveSetAction('dash', 0);
      playSfx('skate');
    }
  } else if (ai.action === 'dash') {
    boss.x += boss.facing * 4.2;
    if (ai.flap % 3 === 0) spawnEffect('dust', boss.x - boss.facing * 16, boss.y - 8);
    const limit = boss.facing > 0 ? arena.right - 16 : arena.left + 16;
    if ((boss.facing > 0 && boss.x >= limit) || (boss.facing < 0 && boss.x <= limit)) {
      boss.x = limit;
      boss.vy = 0;
      boss.onGround = false;
      hiveSetAction('bonk', 12);
      ai.shake = 12;
      playSfx('thud');
    }
  }
}

function hiveUpdate(boss) {
  const ai = boss.ai;
  ai.blink++;
  ai.orbit += 0.05;
  if (ai.dodge > 0) ai.dodge--;
  if (ai.shake > 0) ai.shake--;
  ai.timer--;
  if (!boss.onGround && ai.action === 'stand') ai.flap++;
  if (ai.action === 'honey') hiveUpdateHoney(ai);
  else if (hiveFlying(ai)) hiveUpdateFlight(ai);
  else hiveUpdateGround(ai);
}

function hiveFlying(ai) {
  return ['buzzUp', 'buzzAim', 'buzzHold', 'dash'].includes(ai.action);
}

function hiveDashing(ai) {
  return ai.action === 'buzzHold' || ai.action === 'dash';
}

function hiveBox(boss) {
  if (hiveDashing(boss.ai)) return { left: boss.x - 14, top: boss.y - 17, right: boss.x + 14, bottom: boss.y - 1 };
  return bodyBox(boss);
}

function hiveOnWeakHit(boss) {
  for (const bee of hiveBees()) {
    bee.state = 'drowsy';
    bee.vy = 0;
    bee.timer = 0;
  }
  boss.vx = 0;
  boss.vy = Math.max(boss.vy, 0);
  boss.ai.shake = 40;
  hiveSetAction('cough', 40);
  playHiveSfx('cough');
}

function hiveSprite(boss) {
  const ai = boss.ai;
  const flap = Math.floor(ai.flap / 2) % 2 ? 'hiveFly2' : 'hiveFly1';
  if (boss.state === 'drop' || boss.state === 'idle') return boss.onGround ? 'hiveStand' : Math.floor(game.timer / 3) % 2 ? 'hiveFly2' : 'hiveFly1';
  if (boss.state === 'pose') return Math.floor(boss.timer / 12) % 4 === 1 ? 'hiveStand' : 'hivePose';
  switch (ai.action) {
    case 'summon':
      return 'hiveSummon';
    case 'guard':
      return ai.blink % 80 < 5 ? 'hiveBlink' : 'hiveStand';
    case 'stand':
      if (!boss.onGround) return flap;
      break;
    case 'launch':
      return 'hivePoint';
    case 'crouch':
      return 'hiveCrouch';
    case 'honey':
      if (ai.hover > 0) return 'hiveFling';
      return boss.vy < 0 ? 'hiveJump' : 'hiveFly1';
    case 'buzzUp':
    case 'buzzAim':
      return Math.floor(ai.flap / 2) % 2 ? 'hiveFly2' : 'hiveFly1';
    case 'buzzHold':
    case 'dash':
      return Math.floor(ai.flap / 2) % 2 ? 'hiveDash2' : 'hiveDash1';
    case 'cough':
      return 'hiveCough';
    case 'bonk':
      return boss.onGround ? 'hiveCough' : 'hiveJump';
  }
  return ai.blink % 90 < 6 ? 'hiveBlink' : 'hiveStand';
}

function updateHiveBee(shot) {
  shot.anim = (shot.anim || 0) + 1;
  if (shot.state === 'emerge') {
    shot.timer--;
    const point = hiveOrbitPoint(shot.slot);
    const t = 1 - shot.timer / 14;
    shot.x = shot.fromX + (point.x - shot.fromX) * t;
    shot.y = shot.fromY + (point.y - shot.fromY) * t;
    if (shot.timer <= 0) shot.state = 'orbit';
    return true;
  }
  if (shot.state === 'orbit' || shot.state === 'flash') {
    const guarding = ['summon', 'guard', 'launch'].includes(boss.ai.action);
    const point = hiveOrbitPoint(shot.slot);
    shot.x = point.x;
    shot.y = point.y;
    if (shot.state === 'flash') shot.timer--;
    if ((shot.state === 'flash' && shot.timer <= 0) || !guarding) {
      const dx = player.x - shot.x;
      const dy = player.y - 12 - shot.y;
      const distance = Math.hypot(dx, dy) || 1;
      shot.vx = (dx / distance) * 2;
      shot.vy = (dy / distance) * 2;
      shot.state = 'dive';
      playHiveSfx('beeLaunch');
    }
    return true;
  }
  if (shot.state === 'dive') {
    shot.x += shot.vx;
    shot.y += shot.vy;
    if (solidAt(shot.x, shot.y)) {
      spawnEffect('hiveBeePuff', shot.x, shot.y);
      return false;
    }
    return onScreen(shot.x, shot.y, 16);
  }
  if (shot.state === 'drowsy') {
    shot.timer++;
    const floor = hiveArena().floor;
    shot.vy = Math.min(shot.vy + 0.08, 1.2);
    shot.y = Math.min(floor - 4, shot.y + shot.vy);
    if (shot.y < floor - 4) shot.x += Math.sin(shot.timer / 6) * 0.6;
    if (shot.timer > 90) {
      spawnEffect('hiveBeePuff', shot.x, shot.y);
      return false;
    }
    return true;
  }
  return false;
}

function drawHiveBee(ctx, shot, sx, sy) {
  if (shot.state === 'drowsy') {
    if (shot.timer > 70 && shot.timer % 4 < 2) return;
    drawSprite(ctx, 'hiveBeeSleep', sx, sy, false, 'boss');
    if (Math.floor(shot.timer / 12) % 2 === 0) drawSprite(ctx, 'hiveZ', sx + 5, sy - 8 - (shot.timer % 12) / 3, false, 'boss');
    return;
  }
  const frame = Math.floor(shot.anim / 2) % 2 ? 'hiveBee2' : 'hiveBee1';
  const flip = shot.state === 'dive' ? shot.vx < 0 : boss.facing < 0;
  const palette = shot.state === 'flash' && Math.floor(shot.timer / 2) % 2 === 0 ? 'bossFlash' : 'boss';
  drawSprite(ctx, frame, sx, sy, flip, palette);
}

function updateHiveHoney(shot) {
  const arena = hiveArena();
  if (shot.phase === 'up') {
    if (shot.delay > 0) {
      shot.delay--;
      shot.x = boss.x;
      shot.y = boss.y - 30;
      return true;
    }
    shot.x += shot.vx;
    shot.y -= 5;
    if (shot.y < arena.top) {
      shot.phase = 'drip';
      shot.x = shot.targetX;
      shot.y = arena.top;
    }
  } else if (shot.phase === 'drip') {
    shot.y += 4;
    if (shot.y >= arena.floor - 3) {
      shot.phase = 'mark';
      shot.y = arena.floor;
      shot.timer = 24;
      playHiveSfx('drip');
    }
  } else if (shot.phase === 'mark') {
    shot.timer--;
    if (shot.timer <= 0) {
      shot.phase = 'glob';
      shot.y = arena.top;
      shot.vy = 2;
    }
  } else if (shot.phase === 'glob') {
    shot.vy = Math.min(shot.vy + 0.15, 6);
    shot.y += shot.vy;
    if (shot.y >= arena.floor - 6) {
      const puddles = bossShots.filter(other => other.kind === 'hivePuddle' && !other.dead);
      if (puddles.length >= 4) puddles[0].dead = true;
      spawnBossShot('hivePuddle', shot.x, arena.floor, {});
      spawnEffect('honeySplash', shot.x, arena.floor);
      playHiveSfx('splat');
      return false;
    }
  }
  return true;
}

function drawHiveHoney(ctx, shot, sx, sy) {
  if (shot.phase === 'up' || shot.phase === 'drip') {
    drawSprite(ctx, 'honeyDrop', sx, sy, false, 'boss');
    return;
  }
  const arena = hiveArena();
  const floorY = arena.floor - camera.y;
  const threadTop = shot.phase === 'glob' ? sy + 6 : arena.top - camera.y;
  ctx.fillStyle = nesPalette[Math.floor(shot.age / 4) % 2 ? 0x27 : 0x38];
  for (let y = threadTop + ((shot.age >> 1) % 6); y < floorY - 4; y += 6) ctx.fillRect(Math.round(sx), Math.round(y), 1, 3);
  const markPalette = Math.floor(shot.age / 4) % 2 ? 'boss' : 'bossFlash';
  drawSprite(ctx, 'honeyMark', sx, floorY, false, shot.phase === 'mark' ? markPalette : 'boss');
  if (shot.phase === 'glob') drawSprite(ctx, 'honeyGlob', sx, sy, false, 'boss');
}

function updateHivePuddle(shot) {
  if (shot.age > 300) return false;
  if (!player.dead && player.onGround && Math.abs(player.x - shot.x) < 20 && Math.abs(player.y - shot.y) < 2) player.slowTimer = Math.max(player.slowTimer, 8);
  return true;
}

function drawHivePuddle(ctx, shot, sx, sy) {
  if (shot.age > 240 && Math.floor(shot.age / 3) % 2 === 0) return;
  drawSprite(ctx, 'honeyPuddle', sx, sy, false, 'boss');
}

// INITIALIZATION

Object.assign(effectTypes, {
  hiveSmoke: {
    update: effect => effect.timer >= 24,
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'hiveSmoke' + (1 + Math.min(2, Math.floor(effect.timer / 8))), sx, sy, false, 'boss'),
  },
});

bossShotKinds.hiveBee = {
  size: 8,
  hitSize: 12,
  damage: 2,
  shootable: 1,
  keepOffscreen: true,
  box: shot => (shot.state === 'drowsy' ? hiveNoBox : centerBox(shot.x, shot.y, 8, 8)),
  update: updateHiveBee,
  onHitPlayer(shot, wasHurt) {
    if (shot.state === 'dive' && !wasHurt) {
      spawnEffect('hiveBeePuff', shot.x, shot.y);
      shot.dead = true;
    }
  },
  draw: drawHiveBee,
};

bossShotKinds.hiveHoney = {
  size: 12,
  damage: 3,
  keepOffscreen: true,
  box: shot => (shot.phase === 'glob' ? centerBox(shot.x, shot.y, 12, 12) : hiveNoBox),
  update: updateHiveHoney,
  draw: drawHiveHoney,
};

bossShotKinds.hivePuddle = {
  size: 32,
  harmless: true,
  behind: true,
  keepOffscreen: true,
  update: updateHivePuddle,
  draw: drawHivePuddle,
};

bossDefs.hive = {
  name: 'HIVE MAN',
  stage: 'hive',
  weapon: 'hive',
  w: 20,
  h: 28,
  contactDamage: 4,
  invulnFrames: 20,
  orbPalette: 'orbHive',
  portrait: 'hiveFace',
  present: { fall: 'hiveFly1', land: 'hiveStand', pose: 'hivePose' },
  spawn: hiveSpawn,
  update: hiveUpdate,
  sprite: hiveSprite,
  box: hiveBox,
  contactBox: hiveBox,
  onWeakHit: hiveOnWeakHit,
};
