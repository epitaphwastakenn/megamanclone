// FUNCTIONS

function burstCone(shot) {
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    makePlayerShot('needle', shot.x, shot.y, { vx: Math.cos(angle) * 3.5, vy: Math.sin(angle) * 3.5, dir: 1 });
  }
  spawnEffect('hitSpark', shot.x, shot.y);
  playSfx('burst');
}

// INITIALIZATION

Object.assign(playerShotKinds, {
  cone: {
    weapon: 'pine',
    damage: 2,
    w: 8,
    h: 8,
    bossDamage: 2,
    weakDamage: 7,
    update(shot) {
      shot.vy = Math.min(shot.vy + 0.22, 6);
      shot.x += shot.vx;
      shot.y += shot.vy;
      if (solidAt(shot.x, shot.y + 3) || solidAt(shot.x + shot.dir * 3, shot.y) || shot.age > 70) {
        burstCone(shot);
        return false;
      }
      return true;
    },
    onShield(shot) {
      burstCone(shot);
      return 'stop';
    },
    onHitEnemy(shot) {
      burstCone(shot);
      return 'stop';
    },
    onHitBoss(shot) {
      burstCone(shot);
      return 'stop';
    },
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'cone' + (Math.floor(shot.age / 4) % 4), sx, sy, false, 'boss'),
  },
  needle: {
    weapon: 'pine',
    damage: 1,
    w: 6,
    h: 6,
    bossDamage: 1,
    weakDamage: 3,
    immuneResult: 'consume',
    update(shot) {
      shot.x += shot.vx;
      shot.y += shot.vy;
      return shot.age < 26 && !solidAt(shot.x, shot.y);
    },
    onShield() {
      playSfx('tink');
      return 'stop';
    },
    draw(ctx, shot, sx, sy) {
      const [name, flip] = needleSprite(shot.vx, shot.vy);
      drawSprite(ctx, name, sx, sy, flip, 'boss');
    },
  },
});

weaponDefs.pine = {
  label: 'PINE BURST',
  palette: 'megaPine',
  cost: 2,
  barColors: [0x2A, 0x30],
  boss: 'pine',
  icon: { frames: ['cone0', 'cone1', 'cone2', 'cone3'], rate: 4, palette: 'boss' },
  fire() {
    if (countPlayerShots('cone')) return false;
    const origin = busterOrigin();
    makePlayerShot('cone', origin.x, origin.y - 2, { vx: player.facing * 2.6, vy: -3.4, dir: player.facing });
    playSfx('throw');
    return true;
  },
};
