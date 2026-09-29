// INITIALIZATION

Object.assign(playerShotKinds, {
  axe: {
    weapon: 'timber',
    damage: 3,
    w: 14,
    h: 14,
    bossDamage: 2,
    weakDamage: 7,
    pierceShields: true,
    pierceBoss: true,
    screenMargin: 64,
    update(shot) {
      if (shot.age % 8 === 1) playSfx('axe');
      if (shot.phase === 'out') {
        shot.vx -= shot.dir * 0.15;
        shot.x += shot.vx;
        if (Math.sign(shot.vx) !== shot.dir) shot.phase = 'back';
        return true;
      }
      const dx = player.x - shot.x;
      const dy = player.y - 12 - shot.y;
      const distance = Math.hypot(dx, dy);
      const speed = Math.min(6, Math.max(1, (shot.age - 40) * 0.12));
      if (distance < 10 || player.dead) return false;
      shot.x += (dx / distance) * speed;
      shot.y += (dy / distance) * speed;
      return true;
    },
    onHitEnemy: () => 'pass',
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'axeSmall' + (Math.floor(shot.age / 2) % 4), sx, sy, shot.dir < 0, 'boss'),
  },
});

weaponDefs.timber = {
  label: 'TIMBER AXE',
  palette: 'megaTimber',
  cost: 1,
  barColors: [0x27, 0x30],
  boss: 'timber',
  icon: { frames: ['axeSmall0', 'axeSmall1', 'axeSmall2', 'axeSmall3'], rate: 4, palette: 'boss' },
  fire() {
    if (countPlayerShots('axe')) return false;
    const origin = busterOrigin();
    makePlayerShot('axe', origin.x, origin.y, { vx: player.facing * 6, dir: player.facing, phase: 'out' });
    playSfx('axe');
    return true;
  },
};
