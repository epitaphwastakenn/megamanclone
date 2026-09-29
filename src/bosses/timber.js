// FUNCTIONS

function timberSpawn(boss) {
  Object.assign(boss.ai, { action: 'fight', timer: 0, hasAxe: true, throwCooldown: 50, jumpCooldown: 0, jumpTimer: 120 });
}

function timberJump(power) {
  bossFacePlayer();
  boss.vy = -5.2 * (power || 1);
  boss.vx = boss.facing * 1.6;
  boss.onGround = false;
}

function timberThrow() {
  bossShots.push({ kind: 'timberAxe', x: boss.x + boss.facing * 6, y: boss.y - 30, targetX: player.x, targetY: player.y - 12, phase: 'out', age: 0 });
  boss.ai.hasAxe = false;
}

function timberUpdate(boss) {
  const ai = boss.ai;
  if (ai.throwCooldown > 0) ai.throwCooldown--;
  if (ai.jumpCooldown > 0) ai.jumpCooldown--;
  if (!ai.hasAxe && ai.action !== 'throw' && !bossShots.some(shot => shot.kind === 'timberAxe')) ai.hasAxe = true;
  if (ai.action === 'throw') {
    ai.timer++;
    boss.vx = 0;
    if (ai.timer === 5) timberThrow();
    if (ai.timer >= 16) ai.action = 'fight';
    bossPhysics();
    return;
  }
  if (boss.onGround) {
    bossFacePlayer();
    ai.jumpTimer--;
    if (ai.hasAxe && ai.throwCooldown <= 0) {
      ai.action = 'throw';
      ai.timer = 0;
      boss.vx = 0;
    } else if (stageEvents.playerFired && ai.jumpCooldown <= 0 && Math.random() < 0.55) {
      timberJump(1);
      ai.jumpCooldown = 50;
    } else if (ai.jumpTimer <= 0) {
      timberJump(Math.random() < 0.5 ? 0.8 : 1.1);
      ai.jumpTimer = 90 + Math.floor(Math.random() * 80);
    } else {
      const distance = Math.abs(player.x - boss.x);
      boss.vx = distance > 28 ? boss.facing * 1.25 : 0;
      if (boss.vx !== 0) boss.anim++;
    }
  }
  bossPhysics();
}

function timberSprite(boss) {
  const ai = boss.ai;
  const suffix = ai.hasAxe ? '' : 'X';
  if (boss.state === 'pose') return Math.floor(boss.timer / 12) % 4 === 1 ? 'timberStand' : 'timberPose';
  if (ai.action === 'throw') return ai.timer < 5 ? 'timberPose' : 'timberThrow';
  if (!boss.onGround) return 'timberJump' + suffix;
  if (boss.vx !== 0) return 'timberRun' + (1 + (Math.floor(boss.anim / 8) % 2)) + suffix;
  if (ai.hasAxe && ai.throwCooldown % 70 < 5) return 'timberBlink';
  return 'timberStand' + suffix;
}

// INITIALIZATION

bossShotKinds.timberAxe = {
  size: 18,
  damage: 4,
  update(shot) {
    if (shot.age % 8 === 1) playSfx('axe');
    const speed = 3.6;
    let tx = shot.targetX;
    let ty = shot.targetY;
    if (shot.phase === 'back') {
      tx = boss.x;
      ty = boss.y - 30;
    }
    const dx = tx - shot.x;
    const dy = ty - shot.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= speed) {
      shot.x = tx;
      shot.y = ty;
      if (shot.phase === 'back') {
        boss.ai.hasAxe = true;
        boss.ai.throwCooldown = 30 + Math.floor(Math.random() * 50);
        return false;
      }
      shot.phase = 'back';
    } else {
      shot.x += (dx / distance) * speed;
      shot.y += (dy / distance) * speed;
    }
    if (shot.phase === 'out' && shot.age > 70) shot.phase = 'back';
    return true;
  },
  draw(ctx, shot, sx, sy) {
    drawSprite(ctx, 'axe' + (Math.floor(shot.age / 2) % 4), sx, sy, shot.x > boss.x, 'boss');
  },
};

bossDefs.timber = {
  name: 'TIMBER MAN',
  stage: 'timber',
  weapon: 'timber',
  w: 18,
  h: 28,
  contactDamage: 4,
  invulnFrames: 20,
  orbPalette: 'orbBoss',
  portrait: 'timberFace',
  present: { fall: 'timberJump', land: 'timberStand', pose: 'timberPose' },
  spawn: timberSpawn,
  update: timberUpdate,
  sprite: timberSprite,
};
