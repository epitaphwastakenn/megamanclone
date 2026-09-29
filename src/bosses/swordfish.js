// VARIABLES

const swordfishStats = {
  lungeSpeed: 6.4,
  lungeOvershoot: 40,
  diveSpeed: 4.4,
  bladeSpeed: 2.2,
  swimSpeed: 1.6,
  bodyBack: 34,
  billTip: 34,
};

const swordfishBladePatterns = [['low'], ['high'], ['low', 'high'], ['high', 'low'], ['low', 'high', 'low'], ['high', 'low', 'high']];

const swordfishTips = {
  swordfishStand: [34, -23],
  swordfishSwim1: [34, -23],
  swordfishSwim2: [34, -23],
  swordfishSlashUp: [22, -39],
  swordfishLunge: [34, -16],
  swordfishLungeKick: [34, -16],
  swordfishStuck: [34, -16],
};

const swordfishActions = {
  swim: swordfishSwim,
  lungeBack: swordfishLungeBack,
  lunge: swordfishLunge,
  stuck: swordfishStuck,
  pull: swordfishPull,
  brake: swordfishBrake,
  slashSink: swordfishSlashSink,
  slashWind: swordfishSlashWind,
  slashCut: swordfishSlashCut,
  rest: swordfishRest,
  diveRise: swordfishDiveRise,
  diveAim: swordfishDiveAim,
  diveDown: swordfishDiveMove,
  sweep: swordfishDiveMove,
  diveUp: swordfishDiveMove,
  hooked: swordfishHooked,
};

// FUNCTIONS

function swordArena() {
  const bounds = currentRoomBounds();
  return { left: bounds.left + 16, right: bounds.right - 16, top: bounds.top + 32, floor: bounds.top + 192 };
}

function swordCenterY(boss) {
  return boss.y - 14;
}

function setSwordCenterY(boss, cy) {
  boss.y = cy + 14;
}

function swordApproach(value, target, speed) {
  if (Math.abs(target - value) <= speed) return target;
  return value + Math.sign(target - value) * speed;
}

function swordfishSpawn(boss) {
  Object.assign(boss.ai, {
    action: 'swim',
    timer: 30,
    shape: 'upright',
    anim: 0,
    tx: boss.x,
    ty: boss.y,
    vx: 0,
    vy: 0,
    glint: false,
    flash: 0,
    shake: 0,
    history: ['lunge'],
    next: 'lunge',
    blades: [],
    lockX: 0,
    lockY: 0,
    dodge: 0,
    raging: false,
  });
}

function swordfishPickAttack(ai) {
  const recent = ai.history.slice(-2);
  const options = [];
  const weights = { lunge: 5, slash: 3, dive: 3 };
  for (const name in weights) {
    if (recent.length === 2 && recent[0] === name && recent[1] === name) continue;
    for (let i = 0; i < weights[name]; i++) options.push(name);
  }
  return options[Math.floor(Math.random() * options.length)];
}

function swordfishFarSide(margin) {
  const arena = swordArena();
  const middle = (arena.left + arena.right) / 2;
  return player.x < middle ? arena.right - margin : arena.left + margin;
}

function swordfishStartSwim(boss, frames) {
  const ai = boss.ai;
  const arena = swordArena();
  ai.next = swordfishPickAttack(ai);
  ai.history.push(ai.next);
  if (ai.history.length > 4) ai.history.shift();
  ai.action = 'swim';
  ai.shape = 'upright';
  ai.glint = false;
  ai.timer = frames || 40;
  if (ai.next === 'lunge') {
    const side = Math.sign(swordfishFarSide(0) - player.x);
    ai.tx = Math.max(arena.left + 44, Math.min(arena.right - 44, player.x + side * (80 + Math.random() * 40)));
    ai.ty = arena.floor - 10 - Math.random() * 50;
  } else {
    ai.tx = swordfishFarSide(40);
    ai.ty = ai.next === 'slash' ? arena.floor - 20 : arena.floor - 70;
  }
  bossFacePlayer();
}

function swordfishStartAttack(boss) {
  const ai = boss.ai;
  bossFacePlayer();
  if (ai.next === 'lunge') {
    ai.action = 'lungeBack';
    ai.shape = 'flat';
    ai.timer = ai.raging ? 26 : 32;
    ai.glint = true;
    playSfx('tink');
  } else if (ai.next === 'slash') {
    ai.action = 'slashSink';
    ai.timer = 60;
    ai.tx = swordfishFarSide(36);
    const pool = ai.raging ? swordfishBladePatterns : swordfishBladePatterns.slice(0, 4);
    ai.blades = pool[Math.floor(Math.random() * pool.length)].slice();
  } else {
    ai.action = 'diveRise';
    ai.timer = 70;
    ai.tx = swordfishFarSide(48);
  }
}

function swordfishTravel(boss, tx, ty, speedX, speedY) {
  const crossing = Math.sign(tx - player.x) !== Math.sign(boss.x - player.x) && Math.abs(boss.x - player.x) < 72;
  const targetY = crossing ? Math.min(ty, player.y - 66) : ty;
  const climbing = boss.y > targetY + 8;
  boss.x = swordApproach(boss.x, tx, crossing && climbing ? 0.4 : speedX);
  boss.y = swordApproach(boss.y, targetY, crossing ? Math.max(speedY, 2.6) : speedY);
}

function swordfishSwim(boss) {
  const ai = boss.ai;
  bossFacePlayer();
  if (ai.dodge > 0) ai.dodge--;
  const arena = swordArena();
  const lined = Math.abs(player.y - 11 - swordCenterY(boss)) < 18;
  if (stageEvents.playerFired && lined && ai.dodge <= 0 && Math.random() < 0.4) {
    const up = boss.y > arena.floor - 40;
    ai.ty = Math.max(arena.top + 40, Math.min(arena.floor, boss.y + (up ? -52 : 52)));
    ai.dodge = 70;
    ai.timer = Math.max(ai.timer, 24);
  }
  const bob = Math.sin(ai.anim / 10) * 6;
  swordfishTravel(boss, ai.tx, ai.ty + bob, swordfishStats.swimSpeed, ai.dodge > 50 ? 2.6 : 1.2);
  const close = Math.abs(boss.x - ai.tx) < 12 && Math.abs(boss.y - ai.ty) < 14;
  if ((ai.timer <= 0 && close) || ai.timer < -50) swordfishStartAttack(boss);
}

function swordfishLungeBack(boss) {
  const ai = boss.ai;
  const arena = swordArena();
  if (ai.timer > 10) {
    const target = Math.max(arena.top + 10, Math.min(arena.floor - 11, player.y - 11));
    setSwordCenterY(boss, swordApproach(swordCenterY(boss), target, 3.5));
  }
  const minX = boss.facing > 0 ? arena.left + swordfishStats.bodyBack : arena.left + 12;
  const maxX = boss.facing > 0 ? arena.right - 12 : arena.right - swordfishStats.bodyBack;
  boss.x = Math.max(minX, Math.min(maxX, boss.x - boss.facing * 0.9));
  if (ai.timer % 10 === 0) spawnEffect('bubble', boss.x - boss.facing * 30, swordCenterY(boss) - 4);
  if (ai.timer <= 0) {
    ai.action = 'lunge';
    ai.glint = false;
    ai.lockX = player.x;
    ai.vx = boss.facing * (ai.raging ? swordfishStats.lungeSpeed + 0.8 : swordfishStats.lungeSpeed);
    playSfx('skate');
  }
}

function swordfishLunge(boss) {
  const ai = boss.ai;
  const arena = swordArena();
  boss.x += ai.vx;
  if (ai.anim % 2 === 0) spawnEffect('bubble', boss.x - boss.facing * 34, swordCenterY(boss) - 6 + Math.random() * 10);
  const tip = boss.x + boss.facing * swordfishStats.billTip;
  const wall = boss.facing > 0 ? arena.right + 6 : arena.left - 6;
  if ((boss.facing > 0 && tip >= wall) || (boss.facing < 0 && tip <= wall)) {
    boss.x = wall - boss.facing * swordfishStats.billTip;
    ai.action = 'stuck';
    ai.timer = 46;
    ai.shake = 46;
    spawnEffect('hitSpark', wall - boss.facing * 4, swordCenterY(boss) - 2);
    playSfx('thud');
    return;
  }
  if (boss.facing * (boss.x - ai.lockX) > swordfishStats.lungeOvershoot) {
    ai.action = 'brake';
    ai.timer = 18;
  }
}

function swordfishStuck(boss) {
  const ai = boss.ai;
  if (ai.timer % 7 === 0) spawnEffect('bubble', boss.x + boss.facing * 26, swordCenterY(boss) - 6);
  if (ai.timer % 12 === 0) playSfx('tink');
  if (ai.timer <= 0) {
    ai.action = 'pull';
    ai.timer = 8;
    spawnEffect('dust', boss.x + boss.facing * 30, swordCenterY(boss));
  }
}

function swordfishPull(boss) {
  const ai = boss.ai;
  boss.x -= boss.facing * 3;
  if (ai.timer <= 0) swordfishStartSwim(boss, 34);
}

function swordfishBrake(boss) {
  const ai = boss.ai;
  ai.vx *= 0.82;
  boss.x += ai.vx;
  if (ai.timer <= 0) swordfishStartSwim(boss, 30);
}

function swordfishSlashSink(boss) {
  const ai = boss.ai;
  const arena = swordArena();
  swordfishTravel(boss, ai.tx, arena.floor, 2.2, 2.4);
  bossFacePlayer();
  if (ai.timer <= -60) {
    swordfishStartSwim(boss, 20);
    return;
  }
  if (boss.y >= arena.floor && Math.abs(boss.x - ai.tx) < 6) {
    ai.action = 'slashWind';
    ai.timer = 30;
    ai.glint = true;
    playSfx('tink');
  }
}

function swordfishSlashWind(boss) {
  const ai = boss.ai;
  if (ai.timer <= 0) {
    ai.action = 'slashCut';
    ai.timer = 14;
    ai.glint = false;
    const lane = ai.blades.shift();
    const arena = swordArena();
    const y = lane === 'low' ? arena.floor - 7 : arena.floor - 22;
    spawnBossShot('swordBlade', boss.x + boss.facing * 26, y, { vx: boss.facing * swordfishStats.bladeSpeed, lane });
    spawnEffect('splash', boss.x + boss.facing * 22, y + 4);
    playSfx('axe');
  }
}

function swordfishSlashCut(boss) {
  const ai = boss.ai;
  if (ai.timer > 0) return;
  if (ai.blades.length) {
    ai.action = 'slashWind';
    ai.timer = 26;
    ai.glint = true;
  } else {
    ai.action = 'rest';
    ai.timer = 20;
  }
}

function swordfishRest(boss) {
  if (boss.ai.timer <= 0) swordfishStartSwim(boss, 30);
}

function swordfishDiveRise(boss) {
  const ai = boss.ai;
  const arena = swordArena();
  const targetY = arena.floor - 86;
  swordfishTravel(boss, ai.tx, targetY, 2, 2.2);
  bossFacePlayer();
  if ((Math.abs(boss.x - ai.tx) < 4 && Math.abs(boss.y - targetY) < 3) || ai.timer <= 0) {
    ai.action = 'diveAim';
    ai.timer = 40;
    ai.flash = 40;
    ai.shape = 'diag';
    ai.lockX = Math.max(arena.left + 24, Math.min(arena.right - 24, player.x));
    ai.lockY = arena.floor - 14;
    playSfx('jumpBig');
  }
}

function swordfishDiveAim(boss) {
  const ai = boss.ai;
  const arena = swordArena();
  boss.facing = ai.lockX < boss.x ? -1 : 1;
  if (ai.flash > 0) ai.flash--;
  boss.y += Math.sin(ai.anim / 3) * 0.3;
  if (ai.timer % 4 === 0) spawnEffect('bubble', ai.lockX + (Math.random() * 12 - 6), arena.floor - 3);
  if (ai.timer % 12 === 0) spawnEffect('dust', ai.lockX, arena.floor);
  if (ai.timer <= 0) {
    const dx = ai.lockX - boss.x;
    const dy = ai.lockY - swordCenterY(boss);
    const length = Math.hypot(dx, dy) || 1;
    ai.vx = (dx / length) * swordfishStats.diveSpeed;
    ai.vy = (dy / length) * swordfishStats.diveSpeed;
    ai.action = 'diveDown';
    ai.flash = 0;
    playSfx('skate');
  }
}

function swordfishDiveMove(boss) {
  const ai = boss.ai;
  const arena = swordArena();
  boss.x += ai.vx;
  setSwordCenterY(boss, swordCenterY(boss) + ai.vy);
  if (Math.abs(ai.vx) > 0.2) boss.facing = Math.sign(ai.vx);
  if (ai.anim % 3 === 0) spawnEffect('bubble', boss.x - ai.vx * 5, swordCenterY(boss) - ai.vy * 5);
  const hitWall = boss.x < arena.left + 20 || boss.x > arena.right - 20;
  boss.x = Math.max(arena.left + 20, Math.min(arena.right - 20, boss.x));
  if (ai.action === 'diveDown' && swordCenterY(boss) >= arena.floor - 14) {
    setSwordCenterY(boss, arena.floor - 14);
    ai.action = 'sweep';
    ai.timer = 8;
    ai.vx = (Math.sign(ai.vx) || boss.facing) * swordfishStats.diveSpeed;
    ai.vy = 0;
    spawnEffect('dust', boss.x, arena.floor);
    playSfx('thud');
  } else if (ai.action === 'sweep' && (ai.timer <= 0 || hitWall)) {
    ai.action = 'diveUp';
    ai.vx = hitWall ? 0 : Math.sign(ai.vx) * 3.1;
    ai.vy = hitWall ? -3.6 : -3.1;
  } else if (ai.action === 'diveUp') {
    if (hitWall) ai.vx = 0;
    if (swordCenterY(boss) <= arena.floor - 90) {
      ai.shape = 'upright';
      swordfishStartSwim(boss, 26);
    }
  }
}

function swordfishHooked(boss) {
  const ai = boss.ai;
  const arena = swordArena();
  ai.vy = Math.min(0, ai.vy + 0.18);
  setSwordCenterY(boss, Math.max(arena.top + 20, swordCenterY(boss) + ai.vy));
  if (ai.timer % 9 === 0) spawnEffect('bubble', boss.x, swordCenterY(boss) - 8);
  if (ai.timer <= 0) {
    ai.shape = 'upright';
    swordfishStartSwim(boss, 30);
  }
}

function swordfishUpdate(boss) {
  const ai = boss.ai;
  ai.anim++;
  ai.timer--;
  if (ai.shake > 0) ai.shake--;
  ai.raging = boss.health <= 14;
  swordfishActions[ai.action](boss);
  const arena = swordArena();
  if (ai.shape === 'upright') {
    boss.x = Math.max(arena.left + 12, Math.min(arena.right - 12, boss.x));
    boss.y = Math.max(arena.top + 34, Math.min(arena.floor, boss.y));
  }
}

function swordfishOnWeakHit(boss) {
  const ai = boss.ai;
  ai.action = 'hooked';
  ai.shape = 'flat';
  ai.timer = 46;
  ai.shake = 46;
  ai.vy = -3.2;
  ai.glint = false;
  ai.flash = 0;
  ai.blades = [];
  playSfx('thud');
}

function swordfishDiveSprite(ai) {
  const angle = Math.atan2(ai.vy, Math.abs(ai.vx));
  const step = Math.round(angle / (Math.PI / 4));
  if (step >= 2) return 'swordfishDown';
  if (step === 1) return 'swordfishDive';
  if (step === -1) return 'swordfishRise';
  if (step <= -2) return 'swordfishUp';
  return 'swordfishLunge';
}

function swordfishSprite(boss) {
  const ai = boss.ai;
  if (boss.state === 'pose') return Math.floor(boss.timer / 12) % 4 === 1 ? 'swordfishStand' : 'swordfishPose';
  if (boss.state !== 'fight') return boss.onGround ? 'swordfishStand' : 'swordfishJump';
  switch (ai.action) {
    case 'lungeBack':
      return Math.floor(ai.anim / 5) % 2 ? 'swordfishLungeKick' : 'swordfishLunge';
    case 'lunge':
    case 'brake':
      return 'swordfishLunge';
    case 'stuck':
    case 'pull':
      return Math.floor(ai.anim / 4) % 2 ? 'swordfishStuck' : 'swordfishLungeKick';
    case 'hooked':
      return Math.floor(ai.anim / 5) % 2 ? 'swordfishFlop' : 'swordfishStuck';
    case 'slashWind':
      return 'swordfishSlashUp';
    case 'slashCut':
      return 'swordfishSlashDown';
    case 'diveAim':
      return 'swordfishDive';
    case 'diveDown':
    case 'sweep':
    case 'diveUp':
      return swordfishDiveSprite(ai);
    case 'slashSink':
    case 'rest':
      return boss.y >= swordArena().floor ? (ai.anim % 90 < 6 ? 'swordfishBlink' : 'swordfishStand') : 'swordfishSwim1';
  }
  return Math.floor(ai.anim / 8) % 2 ? 'swordfishSwim2' : 'swordfishSwim1';
}

function swordfishShapeOf(name) {
  if (/Lunge|Stuck|Flop/.test(name)) return 'flat';
  if (/Dive|Rise/.test(name)) return 'diag';
  if (/Down|Up$/.test(name) && !/Slash/.test(name)) return 'vert';
  return 'upright';
}

function swordfishBox(boss, withBill) {
  const shape = swordfishShapeOf(swordfishSprite(boss));
  const cy = swordCenterY(boss);
  if (shape === 'flat') {
    const back = boss.x - boss.facing * swordfishStats.bodyBack;
    const front = boss.x + boss.facing * (withBill ? swordfishStats.billTip : 9);
    return { left: Math.min(back, front), top: cy - 7, right: Math.max(back, front), bottom: cy + 7 };
  }
  if (shape === 'diag') return centerBox(boss.x, cy, 26, 26);
  if (shape === 'vert') return centerBox(boss.x, cy, 14, 40);
  return { left: boss.x - 9, top: boss.y - 30, right: boss.x + 9, bottom: boss.y };
}

function swordfishDraw(ctx, boss, sx, sy) {
  const ai = boss.ai;
  const name = swordfishSprite(boss);
  const flip = boss.facing < 0;
  const palette = ai.flash > 0 && Math.floor(ai.flash / 3) % 2 === 0 ? 'bossFlash' : 'swordfishBoss';
  const upright = swordfishShapeOf(name) === 'upright';
  drawSprite(ctx, name, sx, upright ? sy : sy - 14, flip, palette);
  const tip = swordfishTips[name];
  if (ai.glint && tip && Math.floor(ai.anim / 4) % 3 !== 2) {
    drawSprite(ctx, 'swordGlint' + (Math.floor(ai.anim / 4) % 2), sx + boss.facing * tip[0], sy + tip[1], false, 'swordfishBoss');
  }
  if (ai.action === 'hooked' && ai.timer > 14) swordfishDrawLine(ctx, sx, sy - 22);
}

function swordfishDrawLine(ctx, sx, sy) {
  ctx.fillStyle = nesPalette[0x30];
  const x = Math.round(sx);
  ctx.fillRect(x, 0, 1, Math.max(0, Math.round(sy) - 4));
  ctx.fillStyle = nesPalette[0x10];
  ctx.fillRect(x - 1, Math.round(sy) - 5, 3, 2);
  ctx.fillRect(x + 1, Math.round(sy) - 3, 1, 5);
  ctx.fillRect(x - 3, Math.round(sy) + 1, 4, 1);
  ctx.fillRect(x - 3, Math.round(sy) - 1, 1, 2);
}

// INITIALIZATION

bossShotKinds.swordBlade = {
  w: 8,
  h: 12,
  damage: 3,
  update(shot) {
    shot.x += shot.vx;
    if (shot.age % 6 === 0) spawnEffect('bubble', shot.x - Math.sign(shot.vx) * 6, shot.y + (Math.random() * 10 - 5));
    const arena = swordArena();
    return shot.x > arena.left - 8 && shot.x < arena.right + 8;
  },
  draw(ctx, shot, sx, sy) {
    drawSprite(ctx, 'swordWaterBlade' + (Math.floor(shot.age / 4) % 2), sx, sy, shot.vx < 0, 'swordfishBoss');
  },
};

bossDefs.swordfish = {
  name: 'SWORDFISH MAN',
  stage: 'swordfish',
  weapon: 'swordfish',
  w: 18,
  h: 28,
  contactDamage: 4,
  invulnFrames: 20,
  orbPalette: 'orbSwordfish',
  portrait: 'swordfishFace',
  palette: 'swordfishBoss',
  present: { fall: 'swordfishJump', land: 'swordfishStand', pose: 'swordfishPose' },
  spawn: swordfishSpawn,
  update: swordfishUpdate,
  sprite: swordfishSprite,
  draw: swordfishDraw,
  box: boss => swordfishBox(boss, false),
  contactBox: boss => (boss.ai.action === 'stuck' ? null : swordfishBox(boss, boss.ai.action === 'lunge')),
  onWeakHit: swordfishOnWeakHit,
};
