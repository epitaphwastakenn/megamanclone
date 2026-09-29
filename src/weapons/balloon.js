// FUNCTIONS

function sandBody(shot, height) {
  return { x: shot.x, y: shot.y + shot.h / 2, w: shot.w - 2, h: height };
}

function sandPlatformUnder(body) {
  for (const platform of platforms) {
    if (!platform.alive || platform.solid === false) continue;
    if (Math.abs(body.x - platform.x) >= platform.w / 2 + body.w / 2) continue;
    if (Math.abs(body.y - platform.y) < 2) return platform;
  }
  return null;
}

function sandFall(body, shot) {
  const previousBottom = body.y;
  shot.vy = Math.min(shot.vy + 0.35, 6);
  if (moveBody(body, 0, shot.vy).landed) {
    shot.vy = 0;
    return;
  }
  const platform = platformLanding(body, previousBottom);
  if (platform) {
    body.y = platform.y;
    shot.vy = 0;
  }
}

function sandBurst(shot, hitList) {
  const feet = shot.y + shot.h / 2;
  const wave = makePlayerShot('sandWave', shot.x, feet - 6, { dir: shot.dir, vx: 0, vy: 0 });
  if (hitList) wave.hitList.push(...hitList);
  for (let i = 0; i < 3; i++) spawnEffect('sandDust', shot.x - 6 + i * 6, feet - 4, { vy: -0.4 - i * 0.2 });
  playSfx('thud');
}

function sandBagUpdate(shot) {
  shot.vy = Math.min(shot.vy + 0.25, 6);
  const body = sandBody(shot, 8);
  const previousBottom = body.y;
  const moved = moveBody(body, shot.vx, shot.vy);
  let landed = moved.landed;
  if (!landed && shot.vy > 0) {
    const platform = platformLanding(body, previousBottom);
    if (platform) {
      body.y = platform.y;
      landed = true;
    }
  }
  shot.x = body.x;
  shot.y = body.y - shot.h / 2;
  if (landed || moved.hitWall) {
    sandBurst(shot);
    return false;
  }
  return shot.age < 120;
}

function sandWaveUpdate(shot) {
  const body = sandBody(shot, 10);
  const moved = moveBody(body, shot.dir * 2.5, 0);
  if (moved.hitWall) {
    shot.x = body.x;
    return false;
  }
  const platform = sandPlatformUnder(body);
  if (platform) {
    body.y = platform.y;
    shot.vy = 0;
  } else if (!isStandingOn(body) || shot.vy !== 0) {
    sandFall(body, shot);
  }
  shot.x = body.x;
  shot.y = body.y - shot.h / 2;
  if (shot.age % 6 === 0) spawnEffect('sandDust', shot.x - shot.dir * 7, body.y - 3, { vy: -0.3 });
  if (shot.age % 10 === 0) playSfx('skate');
  return shot.age < 90;
}

function sandWaveFade(shot) {
  spawnEffect('sandDust', shot.x, shot.y + 2, { vy: -0.5 });
  spawnEffect('sandDust', shot.x + shot.dir * 5, shot.y - 2, { vy: -0.8 });
}

// INITIALIZATION

Object.assign(effectTypes, {
  sandDust: {
    update(effect) {
      effect.vy += 0.03;
      return effect.timer >= 15;
    },
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'sandDust' + Math.min(2, Math.floor(effect.timer / 5)), sx, sy, false, 'boss'),
  },
});

Object.assign(playerShotKinds, {
  sandBag: {
    weapon: 'balloon',
    damage: 2,
    w: 8,
    h: 8,
    bossDamage: 2,
    weakDamage: 7,
    update: sandBagUpdate,
    onShield(shot) {
      sandBurst(shot);
      return 'stop';
    },
    onHitEnemy(shot, enemy) {
      sandBurst(shot, [enemy]);
      return 'stop';
    },
    onHitBoss(shot) {
      sandWaveFade(shot);
      return 'stop';
    },
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'sandBag' + (Math.floor(shot.age / 4) % 4), sx, sy, shot.dir < 0, 'boss'),
  },
  sandWave: {
    weapon: 'balloon',
    damage: 2,
    w: 14,
    h: 12,
    bossDamage: 2,
    weakDamage: 7,
    pierceShields: true,
    screenMargin: 24,
    update: sandWaveUpdate,
    onShield: () => 'pass',
    onHitEnemy: () => 'pass',
    onHitBoss(shot) {
      sandWaveFade(shot);
      return 'stop';
    },
    onExpire: sandWaveFade,
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'sandWave' + (Math.floor(shot.age / 5) % 2), sx, sy + shot.h / 2, shot.dir < 0, 'boss'),
  },
});

weaponDefs.balloon = {
  label: 'SAND BALLAST',
  palette: 'megaBalloon',
  cost: 2,
  barColors: [0x18, 0x38],
  boss: 'balloon',
  icon: { frames: ['sandBag0', 'sandBag1', 'sandBag2', 'sandBag3'], rate: 5, palette: 'boss' },
  fire() {
    if (countPlayerShots('sandBag') || countPlayerShots('sandWave')) return false;
    const origin = busterOrigin();
    makePlayerShot('sandBag', player.x + player.facing * 10, origin.y - 2, { vx: player.facing * 2, vy: -2.6, dir: player.facing });
    playSfx('throw');
    return true;
  },
};
