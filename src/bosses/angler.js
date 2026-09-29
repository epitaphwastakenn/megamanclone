// VARIABLES

const anglerNoBox = { left: -9999, top: -9999, right: -9998, bottom: -9998 };
const anglerPattern = ['cast', 'hop', 'bobbers', 'cross', 'cast', 'catch', 'hop', 'bobbers', 'cross', 'catch'];
const anglerPinchPattern = ['cast', 'school', 'cross', 'bobbers', 'hop', 'catch', 'cast', 'cross', 'school', 'bobbers', 'hop', 'catch'];

// FUNCTIONS

function anglerSpawn(boss) {
  Object.assign(boss.ai, { action: 'stand', timer: 40, step: 0, blink: 0, shake: 0, hopCooldown: 90, mash: 0, thrown: 0, tosses: 2, next: null, followUp: false, dodged: false, staggerCooldown: 0 });
}

function anglerClamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}

function anglerArena() {
  const bounds = currentRoomBounds();
  return { left: bounds.left + 30, right: bounds.right - 30, floor: bounds.top + 12 * tileSize };
}

function anglerPinch(boss) {
  return boss.health <= 14;
}

function anglerHookShot() {
  return bossShots.find(shot => shot.kind === 'anglerHook' && shot.phase !== 'snap') || null;
}

function anglerRodTip(boss) {
  const tip = anglerRodTips[anglerSprite(boss)] || anglerRodTips.anglerStand;
  return { x: boss.x + (boss.facing < 0 ? -tip.x - 1 : tip.x), y: boss.y + tip.y };
}

function anglerRest(boss, frames) {
  boss.ai.action = 'stand';
  boss.ai.timer = frames || (anglerPinch(boss) ? 20 + Math.floor(Math.random() * 10) : 28 + Math.floor(Math.random() * 12));
}

function anglerChoose(boss) {
  const ai = boss.ai;
  ai.dodged = false;
  bossFacePlayer();
  if (Math.abs(player.x - boss.x) < 52 && ai.hopCooldown <= 0) {
    anglerStartCrouch(boss, 'hop', 12);
    return;
  }
  const pattern = anglerPinch(boss) ? anglerPinchPattern : anglerPattern;
  if (Math.random() < 0.25) ai.step++;
  const move = pattern[ai.step % pattern.length];
  ai.step++;
  if (move === 'cast') {
    ai.action = 'windup';
    ai.timer = 26;
  } else if (move === 'bobbers') anglerStartToss(boss, 22);
  else if (move === 'catch') anglerStartCrouch(boss, 'catch', 18);
  else if (move === 'cross') anglerStartCrouch(boss, 'cross', 14);
  else if (move === 'hop') anglerStartCrouch(boss, 'hop', 10);
  else anglerStartSchool(boss);
}

function anglerStartToss(boss, frames) {
  bossFacePlayer();
  boss.ai.action = 'tossReady';
  boss.ai.timer = frames;
  boss.ai.tosses = anglerPinch(boss) ? 3 : 2;
}

function anglerStartCrouch(boss, next, frames) {
  boss.ai.action = 'crouch';
  boss.ai.next = next;
  boss.ai.timer = frames;
}

function anglerStartSchool(boss) {
  const arena = anglerArena();
  const first = anglerClamp(player.x, arena.left, arena.right);
  const side = first < (arena.left + arena.right) / 2 ? 1 : -1;
  const second = anglerClamp(first + side * 80, arena.left, arena.right);
  spawnBossShot('anglerLeaper', first, arena.floor, { phase: 'ripple', timer: 52 });
  spawnBossShot('anglerLeaper', second, arena.floor, { phase: 'ripple', timer: 66 });
  boss.ai.action = 'call';
  boss.ai.timer = 44;
  playAnglerSfx('latch');
}

function anglerCastHook(boss) {
  const tip = anglerRodTip(boss);
  const targetX = player.x;
  const targetY = player.y - 10;
  const frames = anglerClamp(Math.abs(targetX - tip.x) / 5, 16, 34);
  const vx = (targetX - tip.x) / frames;
  const vy = (targetY - tip.y - 0.5 * 0.25 * frames * frames) / frames;
  spawnBossShot('anglerHook', tip.x, tip.y, { vx, vy, phase: 'fly', timer: 0 });
  playAnglerSfx('cast');
}

function anglerThrowBobber(boss, index) {
  const ai = boss.ai;
  const spreads = ai.tosses === 3 ? [0.55, 1, 1.45] : [0.7, 1.3];
  const arena = anglerArena();
  const distance = Math.max(56, Math.abs(player.x - boss.x));
  const targetX = anglerClamp(boss.x + boss.facing * distance * spreads[index], arena.left - 12, arena.right + 12);
  const x = boss.x + boss.facing * 8;
  const y = boss.y - 34;
  const frames = 34;
  const vy = (arena.floor - 5 - y - 0.5 * 0.2 * frames * frames) / frames;
  spawnBossShot('anglerBobber', x, y, { vx: (targetX - x) / frames, vy, phase: 'fly', bounced: false, timer: 0 });
  playSfx('throw');
}

function anglerThrowFish(boss) {
  spawnBossShot('anglerFish', boss.x + boss.facing * 14, boss.y - 20, { vx: boss.facing * 2.1, vy: -1.5, bounces: 0, walls: 0 });
  playSfx('throw');
}

function anglerHopTarget(boss, cross) {
  const arena = anglerArena();
  const away = boss.x < player.x ? -1 : 1;
  const over = player.x - away * 64;
  const canCross = Math.abs(player.x - boss.x) < 120 && over >= arena.left && over <= arena.right;
  const back = boss.x + away * 72;
  if (cross && canCross) return over;
  if (back >= arena.left && back <= arena.right) return back;
  return boss.x;
}

function anglerLaunchHop(boss, cross) {
  const target = anglerHopTarget(boss, cross);
  boss.vy = -5.2;
  boss.vx = (target - boss.x) / 42;
  boss.onGround = false;
  if (target !== boss.x) boss.facing = target < boss.x ? -1 : 1;
  boss.ai.action = 'hop';
  boss.ai.hopCooldown = 50;
  playSfx('jumpBig');
}

function anglerReleaseLine(boss, freed) {
  const hook = anglerHookShot();
  if (hook) hook.phase = 'drag';
  boss.ai.action = 'reelEnd';
  boss.ai.timer = freed ? 20 : 14;
  boss.ai.followUp = !freed;
}

function anglerSnapLine(boss) {
  const hook = anglerHookShot();
  const tip = anglerRodTip(boss);
  const shot = hook || spawnBossShot('anglerHook', tip.x, tip.y, {});
  shot.phase = 'snap';
  shot.vx = -boss.facing * 2.4;
  shot.vy = -3.2;
  shot.age = 0;
}

function anglerDodge(boss, chance) {
  const ai = boss.ai;
  const aimed = player.facing === (boss.x > player.x ? 1 : -1);
  if (!stageEvents.playerFired || !aimed || ai.dodged || ai.hopCooldown > 0 || !boss.onGround || Math.random() >= chance) return false;
  ai.dodged = true;
  anglerStartCrouch(boss, 'hop', 4);
  return true;
}

function anglerStandAction(boss, ai) {
  boss.vx = 0;
  if (!boss.onGround) return;
  bossFacePlayer();
  ai.timer--;
  if (ai.timer <= 0) anglerChoose(boss);
}

function anglerWindupAction(boss, ai) {
  ai.timer--;
  if (ai.timer % 4 === 0) playAnglerSfx('reel');
  if (ai.timer > 0) return;
  ai.action = 'cast';
  ai.timer = 0;
  bossFacePlayer();
  anglerCastHook(boss);
}

function anglerCastAction(boss, ai) {
  ai.timer++;
  const hook = anglerHookShot();
  if (!hook) anglerRest(boss, 24);
  else if (hook.phase === 'drag') ai.action = 'retrieve';
  else if (ai.timer > 120) hook.phase = 'drag';
}

function anglerRetrieveAction(boss) {
  if (!anglerDodge(boss, 0.4) && !anglerHookShot()) anglerRest(boss);
}

function anglerReelAction(boss, ai) {
  ai.timer++;
  if (ai.timer % 5 === 0) playAnglerSfx('reel');
  if (input.pressed.jump) ai.mash += 3;
  if (input.pressed.left || input.pressed.right) ai.mash++;
  const gap = Math.abs(boss.x - player.x);
  if (!anglerHookShot() || player.dead || player.climbing || ai.mash >= 3) {
    anglerReleaseLine(boss, true);
    return;
  }
  if (ai.timer >= 60 || gap <= 44) {
    anglerReleaseLine(boss, false);
    return;
  }
  player.pushX += (boss.x > player.x ? 1 : -1) * 1.2;
}

function anglerReelEndAction(boss, ai) {
  ai.timer--;
  if (ai.timer > 0) return;
  if (ai.followUp) anglerStartToss(boss, 24);
  else anglerRest(boss, 26);
}

function anglerTossReadyAction(boss, ai) {
  ai.timer--;
  if (ai.timer > 0) return;
  ai.action = 'toss';
  ai.timer = 0;
  ai.thrown = 0;
}

function anglerTossAction(boss, ai) {
  if (ai.timer % 10 === 0 && ai.thrown < ai.tosses) {
    anglerThrowBobber(boss, ai.thrown);
    ai.thrown++;
  }
  ai.timer++;
  if (ai.thrown >= ai.tosses && ai.timer > ai.tosses * 10 + 8) anglerRest(boss);
}

function anglerCrouchAction(boss, ai) {
  boss.vx = 0;
  ai.timer--;
  if (ai.timer % 6 === 0) spawnEffect('dust', boss.x - boss.facing * 10, boss.y);
  if (ai.timer > 0) return;
  if (ai.next === 'hop' || ai.next === 'cross') {
    anglerLaunchHop(boss, ai.next === 'cross');
    return;
  }
  bossFacePlayer();
  boss.vy = -6.4;
  boss.onGround = false;
  ai.action = 'catch';
  ai.thrown = 0;
  playSfx('jumpBig');
}

function anglerCatchAction(boss, ai) {
  if (!ai.thrown && boss.vy >= -0.5) {
    bossFacePlayer();
    anglerThrowFish(boss);
    ai.thrown = 1;
  }
  if (ai.thrown && boss.onGround) anglerRest(boss);
}

function anglerHopAction(boss) {
  if (boss.onGround) anglerRest(boss, 16);
}

function anglerCallAction(boss, ai) {
  if (anglerDodge(boss, 0.3)) return;
  ai.timer--;
  if (ai.timer <= 0 && !bossShots.some(shot => shot.kind === 'anglerLeaper')) anglerRest(boss, 20);
}

function anglerDizzyAction(boss, ai) {
  boss.vx *= 0.85;
  if (Math.abs(boss.vx) < 0.1) boss.vx = 0;
  ai.timer--;
  if (ai.timer <= 0) anglerRest(boss, 20);
}

function anglerUpdate(boss) {
  const ai = boss.ai;
  ai.blink++;
  if (ai.shake > 0) ai.shake--;
  if (ai.hopCooldown > 0) ai.hopCooldown--;
  if (ai.staggerCooldown > 0) ai.staggerCooldown--;
  anglerActions[ai.action](boss, ai);
  bossPhysics();
}

function anglerShielded(boss, shot) {
  const kind = playerShotKinds[shot.kind];
  const guarding = boss.ai.action === 'stand' || boss.ai.action === 'windup' || boss.ai.action === 'crouch';
  if (!guarding || !boss.onGround || kind.pierceShields || shot.weapon === weaknessChart.angler) return false;
  return Math.sign(shot.x - boss.x) === boss.facing;
}

function anglerWeakHit(boss, shot) {
  const ai = boss.ai;
  if (ai.staggerCooldown > 0) return;
  anglerSnapLine(boss);
  ai.action = 'dizzy';
  ai.timer = 40;
  ai.shake = 12;
  ai.staggerCooldown = 100;
  boss.invuln = 40;
  boss.vx = shot.x < boss.x ? 1.6 : -1.6;
  playAnglerSfx('snap');
}

function anglerSprite(boss) {
  const ai = boss.ai;
  if (boss.state === 'pose') return Math.floor(boss.timer / 12) % 4 === 1 ? 'anglerStand' : 'anglerPose';
  switch (ai.action) {
    case 'windup':
      return 'anglerWindup';
    case 'cast':
    case 'retrieve':
      return 'anglerCast';
    case 'reel':
      return Math.floor(ai.timer / 4) % 2 ? 'anglerReel2' : 'anglerReel1';
    case 'reelEnd':
    case 'call':
      return 'anglerReel1';
    case 'tossReady':
      return 'anglerToss';
    case 'toss':
      return 'anglerThrow';
    case 'crouch':
      return 'anglerCrouch';
    case 'catch':
      return ai.thrown ? 'anglerHurl' : 'anglerJump';
    case 'dizzy':
      return 'anglerDizzy';
  }
  if (!boss.onGround) return 'anglerJump';
  return ai.blink % 110 < 6 ? 'anglerBlink' : 'anglerStand';
}

function anglerDraw(ctx, boss, sx, sy) {
  drawSprite(ctx, anglerSprite(boss), sx, sy, boss.facing < 0, 'boss');
  if (boss.ai.action !== 'dizzy') return;
  ctx.fillStyle = nesPalette[0x28];
  for (let i = 0; i < 3; i++) {
    const angle = boss.ai.timer / 5 + (i * Math.PI * 2) / 3;
    ctx.fillRect(Math.round(sx + Math.cos(angle) * 10 - 1), Math.round(sy - 38 + Math.sin(angle) * 3), 2, 2);
  }
}

function anglerLandY(y, offset) {
  return Math.floor((y + offset) / tileSize) * tileSize - offset;
}

function updateAnglerHook(shot) {
  if (shot.phase === 'fly') {
    shot.vy = Math.min(shot.vy + 0.25, 6);
    shot.x += shot.vx;
    shot.y += shot.vy;
    if (solidAt(shot.x, shot.y + 3) || solidAt(shot.x + Math.sign(shot.vx) * 3, shot.y)) {
      shot.phase = 'rest';
      shot.timer = 18;
      playSfx('tink');
    }
    return true;
  }
  if (shot.phase === 'latched') {
    if (player.dead || boss.ai.action !== 'reel') shot.phase = 'drag';
    shot.x = player.x;
    shot.y = player.y - 12;
    return true;
  }
  if (shot.phase === 'rest') {
    if (!solidAt(shot.x, shot.y + 3)) shot.y += 3;
    if (shot.timer % 6 === 0) playAnglerSfx('reel');
    shot.timer--;
    if (shot.timer <= 0) shot.phase = 'sweep';
    return true;
  }
  if (shot.phase === 'sweep') {
    const dx = boss.x - shot.x;
    if (Math.abs(dx) < 24 || boss.ai.action !== 'cast') shot.phase = 'drag';
    shot.x += Math.sign(dx) * 3.5;
    if (shot.age % 4 === 0) playAnglerSfx('reel');
    return true;
  }
  if (shot.phase === 'snap') {
    shot.vy = Math.min(shot.vy + 0.25, 6);
    shot.x += shot.vx;
    shot.y += shot.vy;
    return shot.age < 80;
  }
  const tip = anglerRodTip(boss);
  const dx = tip.x - shot.x;
  const dy = tip.y - shot.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 6) return false;
  const speed = Math.min(distance, 5);
  shot.x += (dx / distance) * speed;
  shot.y += (dy / distance) * speed;
  return true;
}

function latchAnglerHook(shot, wasHurt) {
  if (wasHurt || shot.phase !== 'fly' || player.dead || boss.ai.action !== 'cast') return;
  shot.phase = 'latched';
  boss.ai.action = 'reel';
  boss.ai.timer = 0;
  boss.ai.mash = 0;
  playAnglerSfx('latch');
}

function drawAnglerHook(ctx, shot, sx, sy) {
  if (shot.phase !== 'snap' && boss.visible) {
    const tip = anglerRodTip(boss);
    const sag = shot.phase === 'latched' ? 0 : shot.phase === 'fly' ? 6 : 3;
    drawFishingLine(ctx, tip.x - camera.x, tip.y - camera.y, sx, sy, sag);
  }
  if (shot.phase !== 'latched') drawSprite(ctx, 'anglerHook', sx, sy, shot.vx < 0, 'boss');
}

function updateAnglerBobber(shot) {
  if (shot.phase === 'fly') {
    shot.vy = Math.min(shot.vy + 0.2, 6);
    if (solidAt(shot.x + shot.vx + Math.sign(shot.vx) * 4, shot.y)) shot.vx = -shot.vx * 0.5;
    shot.x += shot.vx;
    shot.y += shot.vy;
    if (shot.vy > 0 && solidAt(shot.x, shot.y + 5)) {
      shot.y = anglerLandY(shot.y, 5);
      if (!shot.bounced) {
        shot.bounced = true;
        shot.vy = -2.2;
        shot.vx *= 0.5;
        playAnglerSfx('plop');
      } else {
        shot.phase = 'fuse';
        shot.timer = 56;
      }
    }
    return true;
  }
  shot.timer--;
  if (shot.timer % 8 === 0) playAnglerSfx('fuse');
  if (shot.timer > 0) return true;
  shot.blasted = true;
  spawnBossShot('anglerBlast', shot.x, shot.y - 4);
  playSfx('explode');
  return false;
}

function drawAnglerBobber(ctx, shot, sx, sy) {
  const rate = shot.timer > 24 ? 6 : 3;
  const flash = shot.phase === 'fuse' && Math.floor(shot.timer / rate) % 2 === 0;
  drawSprite(ctx, flash ? 'anglerBobberFlash' : 'anglerBobber', sx, sy, false, 'boss');
}

function drawAnglerBlast(ctx, shot, sx, sy) {
  const frame = 'explode' + (1 + Math.min(4, Math.floor(shot.age / 4)));
  drawSprite(ctx, frame, sx, sy, false, 'enemy');
  drawSprite(ctx, frame, sx - 8, sy + 5, false, 'enemy');
  drawSprite(ctx, frame, sx + 8, sy + 5, false, 'enemy');
}

function updateAnglerFish(shot) {
  shot.vy = Math.min(shot.vy + 0.25, 6);
  if (solidAt(shot.x + shot.vx + Math.sign(shot.vx) * 8, shot.y)) {
    shot.vx = -shot.vx;
    shot.walls++;
  }
  shot.x += shot.vx;
  shot.y += shot.vy;
  if (shot.vy > 0 && solidAt(shot.x, shot.y + 5)) {
    shot.y = anglerLandY(shot.y, 5);
    shot.bounces++;
    if (shot.bounces > 7 || shot.walls >= 2) {
      spawnEffect('explode', shot.x, shot.y);
      playSfx('explode');
      return false;
    }
    shot.vy = -3.4;
    playAnglerSfx('flop');
  }
  return true;
}

function updateAnglerLeaper(shot) {
  const floor = anglerArena().floor;
  if (shot.phase === 'ripple') {
    shot.timer--;
    if (shot.timer > 0) return true;
    shot.phase = 'leap';
    shot.y = floor + 12;
    shot.vy = -6.4;
    spawnEffect('splash', shot.x, floor);
    playAnglerSfx('splash');
    return true;
  }
  shot.vy = Math.min(shot.vy + 0.22, 6);
  shot.y += shot.vy;
  if (shot.vy > 0 && shot.y > floor + 14) {
    spawnEffect('splash', shot.x, floor);
    return false;
  }
  return true;
}

function drawAnglerLeaper(ctx, shot, sx, sy) {
  const floor = anglerArena().floor - camera.y;
  if (shot.phase === 'ripple') {
    drawAnglerRipple(ctx, sx, floor - 3, shot.age, shot.timer);
    return;
  }
  const name = (shot.vy < 0 ? 'anglerLeapFishUp' : 'anglerLeapFishDown') + (Math.floor(shot.age / 4) % 2);
  anglerClipAbove(ctx, floor, () => drawSprite(ctx, name, sx, sy, false, 'enemy'));
}

// VARIABLES

const anglerActions = {
  stand: anglerStandAction,
  windup: anglerWindupAction,
  cast: anglerCastAction,
  retrieve: anglerRetrieveAction,
  reel: anglerReelAction,
  reelEnd: anglerReelEndAction,
  tossReady: anglerTossReadyAction,
  toss: anglerTossAction,
  crouch: anglerCrouchAction,
  catch: anglerCatchAction,
  hop: anglerHopAction,
  call: anglerCallAction,
  dizzy: anglerDizzyAction,
};

// INITIALIZATION

Object.assign(bossShotKinds, {
  anglerHook: {
    damage: 2,
    box: shot => (shot.phase === 'fly' || shot.phase === 'sweep' ? centerBox(shot.x, shot.y, 8, 8) : anglerNoBox),
    keepOffscreen: true,
    update: updateAnglerHook,
    onHitPlayer: latchAnglerHook,
    draw: drawAnglerHook,
  },
  anglerBobber: {
    size: 9,
    damage: 2,
    fragile: true,
    shootable: 1,
    update: updateAnglerBobber,
    onRemove(shot) {
      if (!shot.blasted && !shot.dead) spawnEffect('explode', shot.x, shot.y);
    },
    draw: drawAnglerBobber,
  },
  anglerBlast: {
    damage: 3,
    box: shot => (shot.age < 12 ? centerBox(shot.x, shot.y, 30, 26) : anglerNoBox),
    update: shot => shot.age < 20,
    draw: drawAnglerBlast,
  },
  anglerFish: {
    w: 16,
    h: 10,
    size: 14,
    damage: 3,
    shootable: 3,
    update: updateAnglerFish,
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'anglerFish' + (Math.floor(shot.age / 5) % 2), sx, sy, shot.vx < 0, 'boss'),
  },
  anglerLeaper: {
    damage: 3,
    box: shot => (shot.phase === 'leap' ? centerBox(shot.x, shot.y - 8, 10, 14) : anglerNoBox),
    keepOffscreen: true,
    update: updateAnglerLeaper,
    draw: drawAnglerLeaper,
  },
});

bossDefs.angler = {
  name: 'ANGLER MAN',
  stage: 'angler',
  weapon: 'angler',
  w: 20,
  h: 30,
  contactDamage: 4,
  invulnFrames: 20,
  orbPalette: 'orbAngler',
  portrait: 'anglerFace',
  present: { fall: 'anglerJump', land: 'anglerStand', pose: 'anglerPose' },
  spawn: anglerSpawn,
  update: anglerUpdate,
  sprite: anglerSprite,
  draw: anglerDraw,
  shielded: anglerShielded,
  onWeakHit: anglerWeakHit,
};
