// FUNCTIONS

function campfireSpawn(boss) {
  Object.assign(boss.ai, { action: 'stand', timer: 40, tosses: 0, blink: 0, anim: 0, rained: false, scattered: false, shake: 0, smotherCooldown: 0, dodge: 60 });
}

function campfireFloorFires() {
  return bossShots.filter(shot => shot.kind === 'campfireFire' && !shot.out);
}

function campfireSetAction(action, timer) {
  boss.ai.action = action;
  boss.ai.timer = timer;
  boss.ai.anim = 0;
}

function campfireChooseAction() {
  const ai = boss.ai;
  bossFacePlayer();
  const fires = campfireFloorFires().length;
  if (fires >= 2 && !ai.rained) {
    campfireSetAction('crouch', 26);
    return;
  }
  ai.rained = false;
  if (ai.tosses >= 2 || (ai.tosses === 1 && Math.random() < 0.3)) {
    ai.tosses = 0;
    campfireSetAction('stoke', 32);
    campfireSound('stoke');
    return;
  }
  campfireSetAction('windup', 24);
}

function campfireThrowLog() {
  const bounds = currentRoomBounds();
  const x = boss.x - boss.facing * 6;
  const y = boss.y - 36;
  const target = Math.max(bounds.left + 40, Math.min(bounds.right - 40, player.x));
  const vx = Math.max(-3, Math.min(3, (target - x) / 43));
  spawnBossShot('campfireLog', x, y, { vx, vy: -3.5 });
  boss.ai.tosses++;
  playSfx('throw');
}

function campfireLightFire(x, groundY) {
  const fires = campfireFloorFires();
  if (fires.length >= 2) fires.sort((a, b) => b.age - a.age)[0].out = true;
  spawnBossShot('campfireFire', x, groundY, { life: 190 });
  campfireSound('ignite');
}

function campfireHop() {
  const bounds = currentRoomBounds();
  const away = player.x < boss.x ? 1 : -1;
  const room = away > 0 ? bounds.right - 32 - boss.x : boss.x - bounds.left - 32;
  boss.vy = -4.6;
  boss.vx = (room > 40 ? away : -away) * 1.3;
  boss.onGround = false;
  boss.ai.dodge = 110;
  campfireSetAction('hop', 0);
  playSfx('jumpBig');
}

function campfireStartRain() {
  const bounds = currentRoomBounds();
  const center = (bounds.left + bounds.right) / 2;
  const target = boss.x < center ? bounds.right - 40 : bounds.left + 40;
  boss.vy = -6.4;
  boss.vx = (target - boss.x) / 51;
  boss.onGround = false;
  campfireSetAction('rain', 0);
  boss.ai.rained = true;
  playSfx('jumpBig');
}

function campfireRainEmbers() {
  const count = boss.health > 18 ? 3 : boss.health > 9 ? 4 : 5;
  for (let i = 0; i < count; i++) {
    const vx = -2.4 + (4.8 * i) / (count - 1);
    spawnBossShot('campfireEmber', boss.x, boss.y - 28, { vx, vy: -2 - (i % 2) * 0.6 });
  }
  boss.ai.shake = 16;
  playSfx('burst');
}

function campfireUpdate(boss) {
  const ai = boss.ai;
  ai.blink++;
  ai.anim++;
  if (ai.shake > 0) ai.shake--;
  if (ai.smotherCooldown > 0) ai.smotherCooldown--;
  if (ai.dodge > 0) ai.dodge--;
  ai.timer--;
  if (ai.action === 'stand') {
    boss.vx = 0;
    bossFacePlayer();
    if (stageEvents.playerFired && ai.dodge <= 0 && ai.timer > 8 && Math.random() < 0.3) campfireHop();
    else if (ai.timer <= 0) campfireChooseAction();
  } else if (ai.action === 'hop') {
    if (boss.onGround && ai.anim > 2) {
      boss.vx = 0;
      campfireSetAction('stand', 14);
    }
  } else if (ai.action === 'windup') {
    boss.vx = 0;
    if (ai.timer % 8 === 0) spawnEffect('campfireSpark', boss.x - boss.facing * 6, boss.y - 40, { vx: 0, vy: -0.8 });
    if (ai.timer <= 0) {
      campfireThrowLog();
      campfireSetAction('throw', 16);
    }
  } else if (ai.action === 'throw') {
    if (ai.timer <= 0) campfireSetAction('stand', boss.health > 12 ? 34 : 24);
  } else if (ai.action === 'crouch') {
    if (ai.timer % 6 === 0) campfireSparks(boss.x, boss.y - 32, 1);
    if (ai.timer % 8 === 0) spawnEffect('dust', boss.x + (ai.timer % 16 ? 10 : -10), boss.y);
    if (ai.timer <= 0) campfireStartRain();
  } else if (ai.action === 'rain') {
    if (boss.vy >= 0 && !ai.scattered) {
      ai.scattered = true;
      campfireRainEmbers();
    }
    if (boss.onGround && ai.scattered) {
      ai.scattered = false;
      boss.vx = 0;
      playSfx('thud');
      campfireSetAction('stand', 36);
    }
  } else if (ai.action === 'stoke') {
    boss.vx = 0;
    if (ai.timer % 4 === 0) campfireSparks(boss.x, boss.y - 36, 2);
    if (ai.timer <= 0) {
      campfireSetAction('dash', 0);
      bossFacePlayer();
      campfireSound('roar');
    }
  } else if (ai.action === 'dash') {
    boss.vx = boss.facing * Math.min(3.2, 0.8 + ai.anim * 0.3);
    if (ai.anim % 3 === 0) spawnBossShot('campfireSpark', boss.x - boss.facing * 10, boss.y - 3, {});
    const result = bossPhysics();
    if (result.hitWall) {
      boss.vx = 0;
      ai.shake = 12;
      playSfx('thud');
      campfireSetAction('stand', 40);
    }
    return;
  } else if (ai.action === 'smother') {
    boss.vx = 0;
    if (ai.timer % 7 === 0) campfirePuff(boss.x + (Math.random() - 0.5) * 14, boss.y - 36);
    if (ai.timer <= 0) campfireSetAction('stand', 20);
  }
  bossPhysics();
}

function campfireWeakHit(boss) {
  const ai = boss.ai;
  for (const shot of bossShots) if (shot.kind === 'campfireFire') shot.out = true;
  for (let i = 0; i < 4; i++) campfirePuff(boss.x - 8 + i * 5, boss.y - 38 - (i % 2) * 4);
  campfireSound('hiss');
  if (ai.smotherCooldown > 0) return;
  campfireSetAction('smother', 45);
  ai.smotherCooldown = 150;
  ai.shake = 10;
  ai.scattered = false;
  ai.tosses = 0;
  boss.vx = 0;
}

function campfireSpriteName(boss) {
  const ai = boss.ai;
  const flame = Math.floor(game.timer / 5) % 3;
  if (boss.state === 'pose') return Math.floor(boss.timer / 12) % 4 === 1 ? 'campfireStand' + flame : 'campfirePose' + flame;
  switch (ai.action) {
    case 'windup':
      return 'campfireWindup' + flame;
    case 'throw':
      return 'campfireThrow' + flame;
    case 'crouch':
      return 'campfireCrouch' + flame;
    case 'rain':
      return 'campfireJump' + flame;
    case 'stoke':
      return 'campfireStoke' + (Math.floor(ai.anim / 3) % 2);
    case 'dash':
      return 'campfireDash' + (Math.floor(ai.anim / 3) % 2);
    case 'smother':
      return 'campfireSmother' + (Math.floor(ai.anim / 8) % 2);
  }
  if (!boss.onGround) return 'campfireJump' + flame;
  return ai.blink % 110 < 6 ? 'campfireBlink' + flame : 'campfireStand' + flame;
}

function campfireDraw(ctx, boss, sx, sy) {
  const hot = boss.ai.action === 'stoke' && Math.floor(boss.ai.anim / 3) % 2 === 1;
  drawSprite(ctx, campfireSpriteName(boss), sx, sy, boss.facing < 0, hot ? 'campfireHot' : 'campfireBoss');
}

function updateCampfireLog(shot) {
  shot.vy = Math.min(shot.vy + 0.2, 6);
  if (shot.vx && solidAt(shot.x + Math.sign(shot.vx) * 7, shot.y)) shot.vx = 0;
  shot.x += shot.vx;
  shot.y += shot.vy;
  if (shot.vy > 0 && solidAt(shot.x, shot.y + 5)) {
    campfireLightFire(shot.x, Math.floor((shot.y + 5) / tileSize) * tileSize);
    return false;
  }
  return true;
}

function updateCampfireFire(shot) {
  if (shot.out) {
    campfirePuff(shot.x, shot.y - 8);
    campfirePuff(shot.x + 5, shot.y - 14);
    return false;
  }
  if (shot.age >= shot.life) {
    campfirePuff(shot.x, shot.y - 6);
    return false;
  }
  if (shot.age % 9 === 0) spawnEffect('campfireSpark', shot.x + (Math.random() - 0.5) * 8, shot.y - campfireFireHeight(shot.age, shot.life) + 2, { vx: (Math.random() - 0.5) * 0.6, vy: -0.8 });
  return true;
}

function updateCampfireEmber(shot) {
  shot.vy = Math.min(shot.vy + 0.12, 4);
  shot.x += shot.vx;
  shot.y += shot.vy;
  if (solidAt(shot.x, shot.y + 2) || solidAt(shot.x, shot.y)) {
    campfireSparks(shot.x, shot.y, 2);
    return false;
  }
  return true;
}

// INITIALIZATION

Object.assign(bossShotKinds, {
  campfireLog: {
    w: 12,
    h: 10,
    damage: 3,
    fireproof: true,
    update: updateCampfireLog,
    draw(ctx, shot, sx, sy) {
      const vertical = Math.floor(shot.age / 6) % 2 === 1;
      drawSprite(ctx, (vertical ? 'campfireLogV' : 'campfireLogH') + (Math.floor(shot.age / 3) % 2), sx, sy, shot.vx < 0, 'campfireBoss');
    },
  },
  campfireFire: {
    damage: 2,
    behind: true,
    fireproof: true,
    box: shot => campfireFireBox(shot.x, shot.y, shot.age, shot.life),
    update: updateCampfireFire,
    draw: (ctx, shot, sx, sy) => campfireDrawFire(ctx, sx, sy, shot.age, shot.life),
  },
  campfireEmber: {
    size: 5,
    damage: 2,
    fragile: true,
    fireproof: true,
    update: updateCampfireEmber,
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'campfireEmber' + (Math.floor(shot.age / 4) % 2), sx, sy, false, 'campfireBoss'),
  },
  campfireSpark: {
    fireproof: true,
    damage: 2,
    behind: true,
    box: shot => (shot.age < 9 ? { left: shot.x - 4, top: shot.y - 4, right: shot.x + 4, bottom: shot.y + 3 } : { left: 0, top: 0, right: 0, bottom: 0 }),
    update: shot => shot.age < 20,
    draw(ctx, shot, sx, sy) {
      if (shot.age >= 14 && shot.age % 2) return;
      drawSprite(ctx, 'campfireSpark' + (shot.age < 9 ? 0 : 1), sx, sy - Math.floor(shot.age / 5), false, 'campfireBoss');
    },
  },
});

bossDefs.campfire = {
  name: 'CAMPFIRE MAN',
  stage: 'campfire',
  weapon: 'campfire',
  w: 20,
  h: 30,
  contactDamage: 4,
  invulnFrames: 20,
  orbPalette: 'orbCampfire',
  portrait: 'campfireFace',
  palette: 'campfireBoss',
  present: { fall: 'campfireJump0', land: 'campfireStand0', pose: 'campfirePose0' },
  spawn: campfireSpawn,
  update: campfireUpdate,
  sprite: campfireSpriteName,
  draw: campfireDraw,
  onWeakHit: campfireWeakHit,
};
