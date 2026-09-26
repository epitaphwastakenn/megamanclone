// VARIABLES

const bossStats = {
  maxHealth: 28,
  contactDamage: 4,
  axeDamage: 4,
  runSpeed: 1.25,
  jumpSpeed: 5.2,
  invulnFrames: 20,
  shotDamage: { pellet: 2, mid: 3, full: 5 },
};

const boss = {
  active: false,
  x: 0,
  y: 0,
  w: 18,
  h: 28,
  vx: 0,
  vy: 0,
  facing: -1,
  health: 0,
  state: 'none',
  timer: 0,
  hasAxe: true,
  invuln: 0,
  onGround: false,
  anim: 0,
  visible: false,
  throwCooldown: 0,
  jumpCooldown: 0,
  jumpTimer: 0,
};

const bossAxe = { active: false, x: 0, y: 0, targetX: 0, targetY: 0, phase: 'out', age: 0 };

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
    hasAxe: true,
    invuln: 0,
    onGround: false,
    anim: 0,
    visible: true,
    throwCooldown: 50,
    jumpCooldown: 0,
    jumpTimer: 120,
  });
  bossAxe.active = false;
}

function clearBoss() {
  boss.active = false;
  boss.visible = false;
  boss.state = 'none';
  bossAxe.active = false;
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

function throwAxe() {
  bossAxe.active = true;
  bossAxe.x = boss.x + boss.facing * 6;
  bossAxe.y = boss.y - 30;
  bossAxe.targetX = player.x;
  bossAxe.targetY = player.y - 12;
  bossAxe.phase = 'out';
  bossAxe.age = 0;
  boss.hasAxe = false;
}

function updateAxe() {
  if (!bossAxe.active) return;
  bossAxe.age++;
  if (bossAxe.age % 8 === 1) playSfx('axe');
  const speed = 3.6;
  let tx = bossAxe.targetX;
  let ty = bossAxe.targetY;
  if (bossAxe.phase === 'back') {
    tx = boss.x;
    ty = boss.y - 30;
  }
  const dx = tx - bossAxe.x;
  const dy = ty - bossAxe.y;
  const distance = Math.hypot(dx, dy);
  if (distance <= speed) {
    bossAxe.x = tx;
    bossAxe.y = ty;
    if (bossAxe.phase === 'out') bossAxe.phase = 'back';
    else {
      bossAxe.active = false;
      boss.hasAxe = true;
      boss.throwCooldown = 30 + Math.floor(Math.random() * 50);
      return;
    }
  } else {
    bossAxe.x += (dx / distance) * speed;
    bossAxe.y += (dy / distance) * speed;
  }
  if (bossAxe.phase === 'out' && bossAxe.age > 70) bossAxe.phase = 'back';
  if (!player.dead && boxesOverlap(centerBox(bossAxe.x, bossAxe.y, 18, 18), playerHitBox())) hurtPlayer(bossStats.axeDamage);
}

function updateBossAI() {
  if (boss.throwCooldown > 0) boss.throwCooldown--;
  if (boss.jumpCooldown > 0) boss.jumpCooldown--;
  if (boss.state === 'throw') {
    boss.timer++;
    boss.vx = 0;
    if (boss.timer === 5) throwAxe();
    if (boss.timer >= 16) boss.state = 'fight';
    bossPhysics();
    return;
  }
  if (boss.onGround) {
    bossFacePlayer();
    boss.jumpTimer--;
    if (boss.hasAxe && boss.throwCooldown <= 0) {
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
  updateAxe();
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
  bossAxe.active = false;
  spawnDeathOrbs(boss.x, boss.y - 14, 'orbBoss');
  stopSong();
  playSfx('bossDeath');
  onBossDefeated();
}

function bossSprite() {
  const suffix = boss.hasAxe ? '' : 'X';
  if (boss.state === 'throw') return boss.timer < 5 ? 'timberPose' : 'timberThrow';
  if (boss.state === 'pose') return Math.floor(boss.timer / 12) % 4 === 1 ? 'timberStand' : 'timberPose';
  if (!boss.onGround) return 'timberJump' + suffix;
  if (boss.vx !== 0) return 'timberRun' + (1 + (Math.floor(boss.anim / 8) % 2)) + suffix;
  if (boss.hasAxe && boss.throwCooldown % 70 < 5) return 'timberBlink';
  return 'timberStand' + suffix;
}

function drawBoss(ctx) {
  if (!boss.active) return;
  if (boss.visible && !(boss.invuln > 0 && Math.floor(boss.invuln / 2) % 2 === 0)) {
    drawSprite(ctx, bossSprite(), boss.x - camera.x, boss.y - camera.y, boss.facing < 0, 'boss');
  }
  if (bossAxe.active) drawSprite(ctx, 'axe' + (Math.floor(bossAxe.age / 2) % 4), bossAxe.x - camera.x, bossAxe.y - camera.y, bossAxe.x > boss.x, 'boss');
}
