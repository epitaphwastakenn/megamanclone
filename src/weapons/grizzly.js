// FUNCTIONS

function grizzlyClawPlace(shot) {
  shot.x = player.x + shot.dir * 16;
  shot.y = player.y - 12;
}

function grizzlyClawShots(box) {
  let destroyed = false;
  for (let i = enemyShots.length - 1; i >= 0; i--) {
    const shot = enemyShots[i];
    if (!boxesOverlap(box, centerBox(shot.x, shot.y, shot.w, shot.h))) continue;
    enemyShots.splice(i, 1);
    spawnEffect('hitSpark', shot.x, shot.y);
    destroyed = true;
  }
  for (const shot of bossShots) {
    const kind = bossShotKinds[shot.kind];
    if (shot.dead || !kind.fragile || kind.harmless || !kind.damage || kind.shootable) continue;
    if (!boxesOverlap(box, bossShotBox(shot, kind))) continue;
    shot.dead = true;
    spawnEffect('hitSpark', shot.x, shot.y);
    destroyed = true;
  }
  if (destroyed) playSfx('tink');
}

function grizzlyClawUpdate(shot) {
  if (player.dead || shot.age > 12) return false;
  grizzlyClawPlace(shot);
  const box = shotBox(shot);
  breakTilesInBox(box);
  grizzlyClawShots(box);
  return true;
}

// INITIALIZATION

Object.assign(playerShotKinds, {
  grizzlyClaw: {
    weapon: 'grizzly',
    damage: 4,
    w: 24,
    h: 24,
    bossDamage: 3,
    weakDamage: 7,
    pierceShields: true,
    pierceBoss: true,
    immuneResult: 'consume',
    drawReflected: false,
    screenMargin: 64,
    update: grizzlyClawUpdate,
    onShield: () => 'pass',
    onHitEnemy: () => 'pass',
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'grizzlyClawSlash' + Math.min(3, 1 + Math.floor((shot.age - 1) / 4)), sx, sy, shot.dir < 0, 'grizzlyBoss'),
  },
});

weaponDefs.grizzly = {
  label: 'GRIZZLY CLAW',
  palette: 'megaGrizzly',
  cost: 1,
  barColors: [0x17, 0x37],
  boss: 'grizzly',
  icon: { frames: ['grizzlyPaw2', 'grizzlyPaw1', 'grizzlyPaw1', 'grizzlyPaw1'], rate: 8, palette: 'grizzlyBoss' },
  fire() {
    if (countPlayerShots('grizzlyClaw')) return false;
    const shot = makePlayerShot('grizzlyClaw', player.x, player.y, { dir: player.facing });
    grizzlyClawPlace(shot);
    grizzlySound('claw');
    return true;
  },
};
