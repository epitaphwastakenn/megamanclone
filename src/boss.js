// VARIABLES

const bossStats = {
  maxHealth: 28,
  contactDamage: 4,
  cutterDamage: 4,
  runSpeed: 1.25,
  jumpSpeed: 5.2,
  invulnFrames: 20,
  shotDamage: { pellet: 2, mid: 3, full: 5 },
};

const boss = {
  active: false,
  x: 0,
  y: 0,
  w: 16,
  h: 24,
  vx: 0,
  vy: 0,
  facing: -1,
  health: 0,
  state: 'none',
  timer: 0,
  hasCutter: true,
  invuln: 0,
  onGround: false,
  anim: 0,
  visible: false,
  throwCooldown: 0,
  jumpCooldown: 0,
  jumpTimer: 0,
};

const cutter = { active: false, x: 0, y: 0, targetX: 0, targetY: 0, phase: 'out', age: 0 };

// FUNCTIONS

function spawnBoss(x, y) {
  Object.assign(boss, {
    active: true,
    x,
    y,
    vx: 0,
    vy: 0,
    facing: -1,
    health: 0,
    state: 'drop',
    timer: 0,
    hasCutter: true,
    invuln: 0,
    onGround: false,
    anim: 0,
    visible: true,
    throwCooldown: 50,
    jumpCooldown: 0,
    jumpTimer: 120,
  });
  cutter.active = false;
}

function clearBoss() {
  boss.active = false;
  boss.visible = false;
  boss.state = 'none';
  cutter.active = false;
}

function bossFacePlayer() {
  boss.facing = player.x < boss.x ? -1 : 1;
}

function bossJump(power) {
  bossFacePlayer();
  boss.vy = -bossStats.jumpSpeed * (power || 1);
  boss.vx = boss.facing * 1.6;
  boss.onGround = false;
}

function bossPhysics() {
  boss.vy = Math.min(boss.vy + 0.25, 7);
  const result = moveBody(boss, boss.vx, boss.vy);
  if (result.hitWall) boss.vx = 0;
  if (result.landed) {
    if (!boss.onGround) boss.vx = 0;
    boss.onGround = true;
    boss.vy = 0;
  } else if (boss.vy > 0) {
    boss.onGround = false;
  }
}

function throwCutter() {
  cutter.active = true;
  cutter.x = boss.x + boss.facing * 6;
  cutter.y = boss.y - 30;
  cutter.targetX = player.x;
  cutter.targetY = player.y - 12;
  cutter.phase = 'out';
  cutter.age = 0;
  boss.hasCutter = false;
}

function updateCutter() {
  if (!cutter.active) return;
  cutter.age++;
  if (cutter.age % 8 === 1) playSfx('cutter');
  const speed = 3.6;
  let tx = cutter.targetX;
  let ty = cutter.targetY;
  if (cutter.phase === 'back') {
    tx = boss.x;
    ty = boss.y - 30;
  }
  const dx = tx - cutter.x;
  const dy = ty - cutter.y;
  const distance = Math.hypot(dx, dy);
  if (distance <= speed) {
    cutter.x = tx;
    cutter.y = ty;
    if (cutter.phase === 'out') cutter.phase = 'back';
    else {
      cutter.active = false;
      boss.hasCutter = true;
      boss.throwCooldown = 30 + Math.floor(Math.random() * 50);
      return;
    }
  } else {
    cutter.x += (dx / distance) * speed;
    cutter.y += (dy / distance) * speed;
  }
  if (cutter.phase === 'out' && cutter.age > 70) cutter.phase = 'back';
  if (!player.dead && boxesOverlap(centerBox(cutter.x, cutter.y, 12, 12), playerHitBox())) hurtPlayer(bossStats.cutterDamage);
}

function updateBossAI() {
  if (boss.throwCooldown > 0) boss.throwCooldown--;
  if (boss.jumpCooldown > 0) boss.jumpCooldown--;
  if (boss.state === 'throw') {
    boss.timer++;
    boss.vx = 0;
    if (boss.timer === 5) throwCutter();
    if (boss.timer >= 16) boss.state = 'fight';
    bossPhysics();
    return;
  }
  if (boss.onGround) {
    bossFacePlayer();
    boss.jumpTimer--;
    if (boss.hasCutter && boss.throwCooldown <= 0) {
      boss.state = 'throw';
      boss.timer = 0;
      boss.vx = 0;
    } else if (stageEvents.playerFired && boss.jumpCooldown <= 0 && Math.random() < 0.55) {
      bossJump(1);
      boss.jumpCooldown = 50;
    } else if (boss.jumpTimer <= 0) {
      bossJump(Math.random() < 0.5 ? 0.8 : 1.1);
      boss.jumpTimer = 90 + Math.floor(Math.random() * 80);
    } else {
      const distance = Math.abs(player.x - boss.x);
      boss.vx = distance > 28 ? boss.facing * bossStats.runSpeed : 0;
      if (boss.vx !== 0) boss.anim++;
    }
  }
  bossPhysics();
}

function updateBoss(allowContact) {
  if (!boss.active) return;
  if (boss.invuln > 0) boss.invuln--;
  if (boss.state === 'drop') {
    bossPhysics();
    if (boss.onGround) {
      boss.state = 'pose';
      boss.timer = 0;
      playSfx('land');
    }
  } else if (boss.state === 'pose') {
    boss.timer++;
    bossFacePlayer();
  } else if (boss.state === 'fight' || boss.state === 'throw') {
    updateBossAI();
  } else if (boss.state === 'idle') {
    bossPhysics();
  }
  updateCutter();
  if (allowContact && boss.visible && !player.dead && boxesOverlap(bodyBox(boss), playerHitBox())) hurtPlayer(bossStats.contactDamage);
}

function hitBossWithShot(shot, box) {
  if (!boss.active || !boss.visible || (boss.state !== 'fight' && boss.state !== 'throw')) return false;
  if (!boxesOverlap(box, bodyBox(boss))) return false;
  if (boss.invuln > 0) return false;
  boss.health = Math.max(0, boss.health - bossStats.shotDamage[shot.kind]);
  boss.invuln = bossStats.invulnFrames;
  spawnEffect('hitSpark', shot.x, shot.y);
  if (boss.health <= 0) defeatBoss();
  else playSfx('enemyHit');
  return true;
}

function defeatBoss() {
  boss.state = 'dead';
  boss.visible = false;
  cutter.active = false;
  spawnDeathOrbs(boss.x, boss.y - 14, 'orbCut');
  stopSong();
  playSfx('bossDeath');
  onBossDefeated();
}

function bossSprite() {
  const suffix = boss.hasCutter ? '' : 'X';
  if (boss.state === 'throw') return 'cutThrow' + suffix;
  if (boss.state === 'pose') {
    const beat = Math.floor(boss.timer / 10) % 4;
    return (beat === 1 || beat === 3 ? 'cutThrow' : 'cutStand') + suffix;
  }
  if (!boss.onGround) return 'cutJump' + suffix;
  if (boss.vx !== 0) return 'cutRun' + [1, 2, 3, 2][Math.floor(boss.anim / 7) % 4] + suffix;
  return 'cutStand' + suffix;
}

function drawBoss(ctx) {
  if (!boss.active) return;
  if (boss.visible && !(boss.invuln > 0 && Math.floor(boss.invuln / 2) % 2 === 0)) {
    drawSprite(ctx, bossSprite(), boss.x - camera.x, boss.y - camera.y, boss.facing < 0, 'cutMan');
  }
  if (cutter.active) drawSprite(ctx, 'cutter' + (Math.floor(cutter.age / 3) % 4), cutter.x - camera.x, cutter.y - camera.y, false, 'cutMan');
}
