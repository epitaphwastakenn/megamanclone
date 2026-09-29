// FUNCTIONS

function swarmTargets() {
  const list = [];
  for (const enemy of enemies) {
    const spec = enemyTypes[enemy.type];
    if (!enemy.alive || enemy.intangible || spec.harmless || spec.invincible) continue;
    const y = enemy.y - enemy.h / 2;
    if (!onScreen(enemy.x, y, 0)) continue;
    list.push({ ref: enemy, x: enemy.x, y, penalty: enemyShielded(enemy) ? 120 : 0 });
  }
  for (const shot of bossShots) {
    const kind = bossShotKinds[shot.kind];
    if (!kind.shootable || shot.dead || !onScreen(shot.x, shot.y, 0)) continue;
    list.push({ ref: shot, x: shot.x, y: shot.y, penalty: 0 });
  }
  if (boss.active && boss.visible && boss.state === 'fight') {
    const box = bossBox();
    list.push({ ref: boss, x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2, penalty: 0 });
  }
  return list;
}

function swarmTargetAlive(target) {
  if (!target) return false;
  if (target === boss) return boss.active && boss.visible && boss.state === 'fight';
  if (target.kind) return !target.dead && bossShots.includes(target);
  return target.alive && !target.intangible;
}

function chooseSwarmTarget(shot) {
  const claimed = playerShots.filter(other => other.kind === 'swarmBee' && other !== shot && other.slot < shot.slot && !other.reflected).map(other => other.target);
  let best = null;
  let bestScore = Infinity;
  for (const target of swarmTargets()) {
    let score = Math.hypot(target.x - shot.x, target.y - shot.y) + target.penalty;
    if (claimed.includes(target.ref)) score += 72;
    if (shot.hitList.includes(target.ref)) continue;
    if (score < bestScore) {
      best = target.ref;
      bestScore = score;
    }
  }
  return best;
}

function swarmTargetPoint(target) {
  if (target === boss) {
    const box = bossBox();
    return { x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2 };
  }
  if (target.kind) return { x: target.x, y: target.y };
  return { x: target.x, y: target.y - target.h / 2 };
}

function hiveTurnToward(current, desired, rate) {
  let diff = desired - current;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return current + Math.max(-rate, Math.min(rate, diff));
}

function updateSwarmBee(shot) {
  if (shot.delay > 0) {
    shot.delay--;
    const origin = busterOrigin();
    shot.x = origin.x - player.facing * 4;
    shot.y = origin.y;
    shot.heading = player.facing > 0 ? shot.spread : Math.PI - shot.spread;
    shot.dir = player.facing;
    if (shot.delay === 0) playHiveSfx('swarm');
    return true;
  }
  if (shot.age > 124 + shot.slot * 7) {
    spawnEffect('hiveBeePuff', shot.x, shot.y);
    return false;
  }
  const flight = shot.age - shot.slot * 7;
  if (flight >= 6 && (shot.age % 6 === shot.slot * 2 || !swarmTargetAlive(shot.target))) shot.target = chooseSwarmTarget(shot);
  if (!swarmTargetAlive(shot.target)) shot.target = null;
  let desired = shot.dir > 0 ? 0 : Math.PI;
  let rate = 0.05;
  if (shot.target && flight >= 6) {
    const point = swarmTargetPoint(shot.target);
    desired = Math.atan2(point.y - shot.y, point.x - shot.x);
    rate = 0.13;
  } else {
    desired += Math.sin(shot.age / 7 + shot.slot * 2) * 0.5 + (shot.slot - 1) * 0.12;
  }
  shot.heading = hiveTurnToward(shot.heading, desired, rate);
  shot.vx = Math.cos(shot.heading) * shot.speed;
  shot.vy = Math.sin(shot.heading) * shot.speed;
  shot.x += shot.vx;
  shot.y += shot.vy;
  if (boss.active && boss.visible && boss.state === 'fight' && boss.invuln > 0 && shot.target === boss && boxesOverlap(shotBox(shot), bossBox())) {
    spawnEffect('hiveBeePuff', shot.x, shot.y);
    playSfx('tink');
    return false;
  }
  return true;
}

function drawSwarmBee(ctx, shot, sx, sy) {
  if (shot.delay > 0 || (shot.age > 104 + shot.slot * 7 && Math.floor(shot.age / 2) % 2 === 0)) return;
  const frame = Math.floor((shot.age + shot.slot) / 2) % 2 ? 'swarmBee2' : 'swarmBee1';
  drawSprite(ctx, frame, sx, sy, shot.vx < 0, 'boss');
}

function fireSwarm() {
  if (playerShots.some(shot => shot.kind === 'swarmBee' && !shot.reflected)) return false;
  const origin = busterOrigin();
  const spreads = [-0.55, 0, 0.55];
  spreads.forEach((spread, slot) => {
    const heading = player.facing > 0 ? spread : Math.PI - spread;
    makePlayerShot('swarmBee', origin.x - player.facing * 4, origin.y, { heading, spread, slot, delay: slot * 7, speed: 2.7, dir: player.facing, target: null });
  });
  return true;
}

// INITIALIZATION

Object.assign(effectTypes, {
  hiveBeePuff: {
    update: effect => effect.timer >= 8,
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'hiveSmoke1', sx, sy, false, 'boss'),
  },
});

Object.assign(playerShotKinds, {
  swarmBee: {
    weapon: 'hive',
    damage: 1,
    w: 8,
    h: 8,
    bossDamage: 1,
    weakDamage: 4,
    screenMargin: 40,
    update: updateSwarmBee,
    draw: drawSwarmBee,
  },
});

weaponDefs.hive = {
  label: 'HIVE SWARM',
  palette: 'megaHive',
  cost: 2,
  barColors: [0x28, 0x38],
  boss: 'hive',
  pose: 'Shoot',
  icon: { frames: ['hiveBee1', 'hiveBee2'], rate: 3, palette: 'boss' },
  fire: fireSwarm,
};
