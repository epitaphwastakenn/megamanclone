// FUNCTIONS

function pineSpawn(boss) {
  Object.assign(boss.ai, { action: 'stand', timer: 40, throws: 0, empty: 0, dodge: 0, blink: 0, shake: 0, hover: 0, rained: false });
}

function pineThrowCone() {
  const x = boss.x + boss.facing * 16;
  const y = boss.y - 20;
  const vx = Math.max(-3.2, Math.min(3.2, (player.x - x) / 41));
  bossShots.push({ kind: 'pineCone', x, y, vx, vy: -3.6, age: 0 });
  playSfx('throw');
}

function pineNeedles(x, y, angles, speed) {
  for (const angle of angles) {
    const radians = (angle * Math.PI) / 180;
    bossShots.push({ kind: 'pineNeedle', x, y, vx: Math.cos(radians) * speed, vy: Math.sin(radians) * speed, age: 0 });
  }
}

function pineStartRain() {
  const bounds = currentRoomBounds();
  const center = (bounds.left + bounds.right) / 2;
  boss.vy = -6.4;
  boss.vx = Math.max(-1.6, Math.min(1.6, (center - boss.x) / 50));
  boss.onGround = false;
  boss.ai.action = 'rain';
  boss.ai.rained = false;
  playSfx('jumpBig');
}

function pineChooseAction() {
  const ai = boss.ai;
  bossFacePlayer();
  if (ai.throws < 2) {
    ai.action = 'windup';
    ai.timer = 16;
    return;
  }
  ai.throws = 0;
  if (Math.random() < 0.6) {
    ai.action = 'crouch';
    ai.timer = 18;
  } else {
    pineStartRain();
  }
}

function pineUpdate(boss) {
  const ai = boss.ai;
  ai.blink++;
  if (ai.empty > 0) ai.empty--;
  if (ai.dodge > 0) ai.dodge--;
  if (ai.shake > 0) ai.shake--;
  ai.timer--;
  if (ai.action === 'stand') {
    boss.vx = 0;
    bossFacePlayer();
    if (stageEvents.playerFired && ai.dodge <= 0 && Math.random() < 0.25) {
      ai.dodge = 150;
      pineStartRain();
    } else if (ai.timer <= 0) {
      pineChooseAction();
    }
  } else if (ai.action === 'windup') {
    if (ai.timer <= 0) {
      pineThrowCone();
      ai.action = 'throw';
      ai.timer = 12;
    }
  } else if (ai.action === 'throw') {
    if (ai.timer <= 0) {
      ai.throws++;
      ai.empty = 24;
      ai.action = 'stand';
      ai.timer = 22;
    }
  } else if (ai.action === 'crouch') {
    if (ai.timer % 6 === 0) spawnEffect('dust', boss.x - boss.facing * 10, boss.y);
    if (ai.timer <= 0) {
      ai.action = 'skate';
      boss.vx = boss.facing * 3.4;
      playSfx('skate');
    }
  } else if (ai.action === 'skate') {
    boss.vx = boss.facing * 3.4;
    if (ai.timer % 4 === 0) spawnEffect('dust', boss.x - boss.facing * 12, boss.y);
    const result = bossPhysics();
    if (result.hitWall) {
      boss.vx = 0;
      ai.action = 'stand';
      ai.timer = 30;
      playSfx('thud');
    }
    return;
  } else if (ai.action === 'rain') {
    if (ai.hover > 0) {
      ai.hover--;
      boss.vy = 0;
      if (ai.hover === 18) pineNeedles(boss.x, boss.y - 26, [45, 67, 90, 113, 135], 3);
      if (ai.hover === 6) pineNeedles(boss.x, boss.y - 26, [56, 79, 101, 124], 3);
      return;
    }
    if (!ai.rained && boss.vy >= 0) {
      ai.rained = true;
      ai.hover = 26;
      ai.shake = 26;
      boss.vx = 0;
      playSfx('burst');
      return;
    }
    if (boss.onGround && ai.rained) {
      ai.action = 'stand';
      ai.timer = 30;
    }
  }
  bossPhysics();
}

function pineSprite(boss) {
  const ai = boss.ai;
  if (boss.state === 'pose') return Math.floor(boss.timer / 12) % 4 === 1 ? 'pineStand' : 'pinePose';
  if (ai.action === 'windup') return 'pinePose';
  if (ai.action === 'throw') return 'pineThrow';
  if (ai.action === 'crouch' || ai.action === 'skate') return 'pineSkate';
  if (!boss.onGround) return 'pineJump';
  if (ai.empty > 0) return 'pineStandX';
  return ai.blink % 90 < 6 ? 'pineBlink' : 'pineStand';
}

// INITIALIZATION

bossShotKinds.pineCone = {
  size: 8,
  damage: 3,
  fragile: true,
  update(shot) {
    shot.vy = Math.min(shot.vy + 0.2, 6);
    shot.x += shot.vx;
    shot.y += shot.vy;
    if (solidAt(shot.x, shot.y + 4) || solidAt(shot.x + Math.sign(shot.vx) * 4, shot.y)) {
      pineNeedles(shot.x, shot.y - 2, [180, 225, 270, 315, 0], 2.6);
      spawnEffect('hitSpark', shot.x, shot.y);
      playSfx('burst');
      return false;
    }
    return true;
  },
  draw(ctx, shot, sx, sy) {
    drawSprite(ctx, 'cone' + (Math.floor(shot.age / 4) % 4), sx, sy, false, 'boss');
  },
};

bossShotKinds.pineNeedle = {
  size: 6,
  damage: 2,
  fragile: true,
  update(shot) {
    shot.x += shot.vx;
    shot.y += shot.vy;
    return !solidAt(shot.x, shot.y);
  },
  draw(ctx, shot, sx, sy) {
    const [name, flip] = needleSprite(shot.vx, shot.vy);
    drawSprite(ctx, name, sx, sy, flip, 'boss');
  },
};

bossDefs.pine = {
  name: 'PINE MAN',
  stage: 'pine',
  weapon: 'pine',
  w: 18,
  h: 26,
  contactDamage: 4,
  invulnFrames: 20,
  orbPalette: 'orbPine',
  damage: { axe: 7, cone: 0, needle: 0 },
  portrait: 'pineFace',
  present: { fall: 'pineJump', land: 'pineStand', pose: 'pinePose' },
  spawn: pineSpawn,
  update: pineUpdate,
  sprite: pineSprite,
};
