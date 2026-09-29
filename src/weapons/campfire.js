// FUNCTIONS

function campLogGround(shot, previousBottom) {
  const bottom = shot.y + 4;
  const col = Math.floor(shot.x / tileSize);
  const row = Math.floor(bottom / tileSize);
  const topOnly = isOneWayTile(col, row) || isLadderTopTile(col, row);
  if (isSolidTile(col, row) || (topOnly && previousBottom <= row * tileSize + 0.01)) return { y: row * tileSize, platform: null };
  const platform = platformLanding({ x: shot.x, y: bottom, w: 8 }, previousBottom);
  if (platform) return { y: platform.y, platform };
  return null;
}

function updateCampLog(shot) {
  shot.vy = Math.min(shot.vy + 0.2, 6);
  if (shot.vx && solidAt(shot.x + Math.sign(shot.vx) * 6, shot.y)) shot.vx = 0;
  const previousBottom = shot.y + 4;
  shot.x += shot.vx;
  shot.y += shot.vy;
  if (isWaterAt(shot.x, shot.y)) {
    campfirePuff(shot.x, shot.y);
    campfireSound('hiss');
    return false;
  }
  if (shot.vy <= 0) return true;
  const ground = campLogGround(shot, previousBottom);
  if (!ground) return true;
  igniteCampfire(shot.x, ground.y, ground.platform);
  return false;
}

function igniteCampfire(x, groundY, platform) {
  for (const other of playerShots) {
    if (other.kind !== 'campFlame' || other.dead) continue;
    other.dead = true;
    campfirePuff(other.x, other.groundY - 8);
  }
  const offset = platform ? x - platform.x : 0;
  makePlayerShot('campFlame', x, groundY - 8, { groundY, platform, offset, life: 180, burns: new Map(), dir: 1 });
  spawnEffect('dust', x, groundY);
  campfireSound('ignite');
}

function dropCampLog(shot) {
  shot.vx *= 0.15;
  shot.vy = Math.max(shot.vy, 0.5);
  return 'pass';
}

function updateCampFlame(shot) {
  if (shot.platform) {
    if (!shot.platform.alive || !platforms.includes(shot.platform)) return false;
    shot.x = shot.platform.x + shot.offset;
    shot.groundY = shot.platform.y;
  }
  if (shot.age >= shot.life) {
    campfirePuff(shot.x, shot.groundY - 8);
    return false;
  }
  const height = campfireFireHeight(shot.age, shot.life);
  const box = campfireFireBox(shot.x, shot.groundY, shot.age, shot.life);
  shot.y = shot.groundY - height / 2;
  shot.h = height;
  if (shot.age % 7 === 0) spawnEffect('campfireSpark', shot.x + (Math.random() - 0.5) * 8, shot.groundY - height + 2, { vx: (Math.random() - 0.5) * 0.6, vy: -0.8 });
  burnEnemies(shot, box);
  burnBoss(shot, box);
  burnProjectiles(box);
  return true;
}

function burnEnemies(shot, box) {
  for (const enemy of enemies) {
    if (!enemy.alive || enemy.intangible || enemyTypes[enemy.type].invincible || enemyShielded(enemy)) continue;
    if (!boxesOverlap(box, bodyBox(enemy))) continue;
    if ((shot.burns.get(enemy) || 0) > shot.age) continue;
    shot.burns.set(enemy, shot.age + 8);
    damageEnemy(enemy, shot.damage);
  }
}

function burnBoss(shot, box) {
  if (!boss.active || !boss.visible || boss.state !== 'fight' || boss.invuln > 0) return;
  if (!boxesOverlap(box, bossBox())) return;
  if (boss.def.shielded && boss.def.shielded(boss, shot)) return;
  if (bossDamageFor(shot) <= 0) return;
  hitBossWithShot(shot, box);
}

function burnProjectiles(box) {
  for (let i = enemyShots.length - 1; i >= 0; i--) {
    const shot = enemyShots[i];
    if (!boxesOverlap(box, centerBox(shot.x, shot.y, shot.w, shot.h))) continue;
    enemyShots.splice(i, 1);
    campfirePuff(shot.x, shot.y);
    campfireSound('hiss');
  }
  for (const shot of bossShots) {
    const kind = bossShotKinds[shot.kind];
    if (shot.dead || !kind.fragile || kind.fireproof) continue;
    const shotBounds = bossShotBox(shot, kind);
    if (shotBounds.right - shotBounds.left > 12 || shotBounds.bottom - shotBounds.top > 12) continue;
    if (!boxesOverlap(box, shotBounds)) continue;
    shot.dead = true;
    campfirePuff(shot.x, shot.y);
    campfireSound('hiss');
  }
}

function drawCampLog(ctx, shot, sx, sy) {
  const vertical = Math.floor(shot.age / 5) % 2 === 1;
  const frame = Math.floor(shot.age / 3) % 2;
  drawSprite(ctx, (vertical ? 'campfireStickV' : 'campfireStickH') + frame, sx, sy, shot.dir < 0, 'campfireBoss');
}

// INITIALIZATION

Object.assign(playerShotKinds, {
  campLog: {
    weapon: 'campfire',
    damage: 2,
    w: 10,
    h: 8,
    bossDamage: 2,
    weakDamage: 6,
    screenMargin: 48,
    update: updateCampLog,
    onShield: dropCampLog,
    onHitEnemy: dropCampLog,
    onHitBoss: dropCampLog,
    draw: drawCampLog,
  },
  campFlame: {
    weapon: 'campfire',
    damage: 2,
    w: 12,
    h: 16,
    bossDamage: 2,
    weakDamage: 5,
    harmless: true,
    screenMargin: 64,
    update: updateCampFlame,
    draw: (ctx, shot, sx) => campfireDrawFire(ctx, sx, shot.groundY - camera.y, shot.age, shot.life),
  },
});

weaponDefs.campfire = {
  label: 'CAMPFIRE',
  palette: 'megaCampfire',
  cost: 2,
  barColors: [0x27, 0x38],
  boss: 'campfire',
  pose: 'Throw',
  icon: { frames: ['campfireIcon0', 'campfireIcon1', 'campfireIcon2'], rate: 5, palette: 'campfireBoss' },
  fire() {
    if (countPlayerShots('campLog')) return false;
    const origin = busterOrigin();
    const far = input.held.up;
    const x = solidAt(origin.x, origin.y) ? player.x : origin.x - player.facing * 4;
    makePlayerShot('campLog', x, origin.y - 2, { vx: player.facing * (far ? 3 : 2), vy: far ? -3.6 : -2.2, dir: player.facing });
    playSfx('throw');
    return true;
  },
};
