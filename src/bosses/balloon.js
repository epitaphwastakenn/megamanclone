// FUNCTIONS

function balloonSfx(name) {
  switch (name) {
    case 'hiss':
      playFrames('balloonHiss', 'noise', sweepFrames(24000, 9000, 28, 0.16, 0.02));
      break;
    case 'roar':
      playFrames('balloonRoar', 'noise', sweepFrames(2600, 1400, 18, 0.26, 0.04));
      break;
    case 'crackle':
      playFrames('balloonCrackle', 'noiseShort', [[7046, 0.2], [0, 0], [4709, 0.16], [0, 0]]);
      break;
    case 'pop':
      playFrames('balloonPop', 'noise', sweepFrames(40000, 2200, 12, 0.5, 0));
      playFrames('balloonPopTone', 0.25, sweepFrames(1800, 300, 14, 0.25, 0.02));
      break;
  }
}

function balloonPiles() {
  return platforms.filter(platform => platform.type === 'sandPile' && platform.alive);
}

function balloonGroundBelow(x, fromY) {
  const col = Math.floor(x / tileSize);
  let ground = currentRoomBounds().bottom + 64;
  for (let row = Math.max(0, Math.floor(fromY / tileSize)); row < levelRows; row++) {
    if (isSolidTile(col, row)) {
      ground = row * tileSize;
      break;
    }
  }
  for (const pile of balloonPiles()) {
    if (Math.abs(x - pile.x) < pile.w / 2 && pile.y >= fromY && pile.y < ground) ground = pile.y;
  }
  return ground;
}

function balloonRestY() {
  const ai = boss.ai;
  return ai.floorY - 66 - ai.lift - ai.rise + ai.sink + Math.sin(ai.bob / 24) * 3;
}

function balloonReachable() {
  const floorY = boss.ai.floorY;
  if (boss.y >= floorY - 60) return true;
  return balloonPiles().length > 0 && boss.y >= floorY - 76;
}

function balloonSpawn(boss) {
  const bounds = currentRoomBounds();
  Object.assign(boss.ai, {
    action: 'lift',
    timer: 0,
    floorY: bounds.top + 12 * tileSize,
    lift: 0,
    sink: 0,
    sinkTimer: 0,
    rise: 0,
    dodgeCooldown: 90,
    bob: 0,
    bags: 2,
    bagTimer: 0,
    bagShake: 0,
    under: 0,
    burnCooldown: 120,
    aloft: 0,
    attacks: 0,
    blink: 0,
    vx: 0,
    vy: 0,
    dive: null,
    marker: null,
    again: false,
  });
}

function balloonClampX(x) {
  const bounds = currentRoomBounds();
  return Math.max(bounds.left + 34, Math.min(bounds.right - 34, x));
}

function balloonFrontBagX() {
  return boss.x + (boss.facing < 0 ? -10 : 9);
}

function balloonDrift(speed) {
  const ai = boss.ai;
  const dx = balloonClampX(player.x) - boss.x;
  const want = Math.sign(dx) * Math.min(speed, Math.abs(dx) / 30);
  ai.vx += Math.max(-0.03, Math.min(0.03, want - ai.vx));
  boss.x = balloonClampX(boss.x + ai.vx);
  if (Math.abs(dx) > 6) boss.facing = dx < 0 ? -1 : 1;
}

function balloonHold() {
  const ai = boss.ai;
  ai.vx *= 0.8;
  boss.x = balloonClampX(boss.x + ai.vx);
}

function balloonFloatY() {
  const ai = boss.ai;
  const target = balloonRestY();
  const step = target > boss.y ? 1.2 : boss.ai.rise > 0 ? 1.4 : 0.6;
  boss.y += Math.max(-step, Math.min(step, target - boss.y));
}

function balloonStartAction(action, timer) {
  boss.ai.action = action;
  boss.ai.timer = timer;
}

function balloonChooseAttack() {
  const ai = boss.ai;
  if (ai.again) {
    ai.again = false;
    balloonStartDrop();
    return;
  }
  ai.attacks++;
  if (ai.aloft > 140 || ai.attacks % 3 === 0 || ai.bags === 0 || balloonPiles().length >= 2) {
    balloonStartAction('ventWarn', 30);
    balloonSfx('hiss');
    return;
  }
  balloonStartDrop();
}

function balloonStartDrop() {
  const ai = boss.ai;
  balloonStartAction('dropWarn', 26);
  const x = balloonFrontBagX();
  ai.marker = spawnBossShot('balloonShadow', x, balloonGroundBelow(x, boss.y), { bag: null });
}

function balloonDropBag() {
  const ai = boss.ai;
  const x = balloonFrontBagX();
  const bag = spawnBossShot('balloonBag', x, boss.y - 5, { vy: 0.4, marker: ai.marker });
  if (ai.marker) ai.marker.bag = bag;
  ai.marker = null;
  ai.bags--;
  ai.bagTimer = 150;
  ai.lift = Math.min(6, ai.lift + 3);
  spawnEffect('balloonPuff', x, boss.y - 12);
  playSfx('throw');
}

function balloonStartDive() {
  const ai = boss.ai;
  const bounds = currentRoomBounds();
  const center = (bounds.left + bounds.right) / 2;
  const dir = boss.x < center ? 1 : -1;
  boss.facing = dir;
  ai.lift = 0;
  ai.dive = { startX: boss.x, endX: center + dir * 76, startY: boss.y, lowY: ai.floorY - 40, endY: ai.floorY - 66, t: 0, frames: 104 };
  balloonStartAction('dive', 104);
  balloonSfx('roar');
}

function balloonUpdateDive() {
  const ai = boss.ai;
  const dive = ai.dive;
  dive.t = Math.min(1, dive.t + 1 / dive.frames);
  const t = dive.t;
  const ease = t * t * (3 - 2 * t);
  const lineY = dive.startY + (dive.endY - dive.startY) * t;
  const middle = (dive.startY + dive.endY) / 2;
  boss.x = dive.startX + (dive.endX - dive.startX) * ease;
  boss.y = lineY + (dive.lowY - middle) * Math.sin(Math.PI * t);
  if (ai.timer % 8 === 0) spawnEffect('balloonPuff', boss.x - boss.facing * 14, boss.y - 30);
  if (t >= 1) {
    ai.dive = null;
    ai.aloft = 0;
    balloonStartAction('float', 50);
  }
}

function balloonStartPuncture() {
  const ai = boss.ai;
  if (ai.action === 'spin' || ai.action === 'grounded' || ai.action === 'inflate') return;
  if (ai.marker) ai.marker.dead = true;
  ai.marker = null;
  ai.dive = null;
  ai.vy = 0.4;
  ai.vx = 0;
  ai.bagShake = 0;
  ai.again = false;
  for (const shot of bossShots) if (shot.kind === 'balloonFlame') shot.dead = true;
  balloonStartAction('spin', 0);
  balloonSfx('pop');
  balloonSfx('hiss');
}

function balloonUpdateSpin() {
  const ai = boss.ai;
  const bounds = currentRoomBounds();
  const center = (bounds.left + bounds.right) / 2;
  ai.timer++;
  ai.vy = Math.min(ai.vy + 0.1, 2.6);
  boss.y += ai.vy;
  boss.x = balloonClampX(boss.x + Math.sign(center - boss.x) * 0.4);
  if (ai.timer % 4 === 0) boss.facing = -boss.facing;
  if (ai.timer % 5 === 0) spawnEffect('balloonPuff', boss.x + (ai.timer % 10 ? 8 : -8), boss.y - 32);
  if (ai.timer % 24 === 0) balloonSfx('hiss');
  const ground = balloonGroundBelow(boss.x, boss.y - 40);
  if (boss.y >= ground) {
    boss.y = ground;
    spawnEffect('dust', boss.x - 10, boss.y);
    spawnEffect('dust', boss.x + 10, boss.y);
    playSfx('thud');
    bossFacePlayer();
    balloonStartAction('grounded', 64);
  }
}

function balloonSettle() {
  const ground = balloonGroundBelow(boss.x, boss.y - 40);
  if (boss.y < ground) boss.y = Math.min(ground, boss.y + 2);
}

function balloonUpdateFloat() {
  const ai = boss.ai;
  balloonDrift(0.75);
  if (stageEvents.playerFired && ai.dodgeCooldown <= 0 && Math.random() < 0.4) {
    ai.rise = 14;
    ai.dodgeCooldown = 110;
    balloonSfx('roar');
  }
  balloonFloatY();
  const under = Math.abs(player.x - boss.x) < 18 && player.y > boss.y;
  ai.under = under ? ai.under + 1 : Math.max(0, ai.under - 2);
  if (ai.under >= 28 && ai.burnCooldown <= 0) {
    balloonStartAction('burnWarn', 26);
    return;
  }
  if (ai.timer <= 0 || ai.aloft > 140) balloonChooseAttack();
}

function balloonUpdate(boss) {
  const ai = boss.ai;
  ai.blink++;
  ai.bob++;
  ai.timer--;
  if (ai.burnCooldown > 0) ai.burnCooldown--;
  if (ai.dodgeCooldown > 0) ai.dodgeCooldown--;
  ai.rise = Math.max(0, ai.rise - 0.25);
  if (ai.bagShake > 0) ai.bagShake--;
  if (ai.sinkTimer > 0) ai.sinkTimer--;
  else ai.sink = Math.max(0, ai.sink - 0.4);
  if (ai.bags < 2 && --ai.bagTimer <= 0) {
    ai.bags++;
    ai.bagTimer = 150;
  }
  ai.aloft = balloonReachable() ? 0 : ai.aloft + 1;
  switch (ai.action) {
    case 'lift':
      boss.y -= 1;
      balloonDrift(0.4);
      if (ai.timer % 10 === 0) balloonSfx('roar');
      if (boss.y <= balloonRestY()) balloonStartAction('float', 50);
      break;
    case 'float':
      balloonUpdateFloat();
      break;
    case 'dropWarn':
      balloonHold();
      balloonFloatY();
      ai.bagShake = ai.timer;
      if (ai.marker) {
        ai.marker.x = balloonFrontBagX();
        ai.marker.y = balloonGroundBelow(ai.marker.x, boss.y);
      }
      if (ai.timer <= 0) {
        balloonDropBag();
        const again = ai.bags > 0 && !ai.again && balloonPiles().length < 2 && Math.random() < 0.5;
        ai.again = again;
        balloonStartAction('float', again ? 24 : 40 + Math.floor(Math.random() * 30));
      }
      break;
    case 'burnWarn':
      balloonHold();
      if (ai.timer % 6 === 0) {
        balloonSfx('crackle');
        spawnEffect('hitSpark', boss.x + (ai.timer % 12 ? 4 : -4), boss.y + 6);
      }
      if (ai.timer <= 0) {
        spawnBossShot('balloonFlame', boss.x, boss.y + 2, {});
        balloonSfx('roar');
        balloonStartAction('burn', 44);
      }
      break;
    case 'burn':
      balloonHold();
      if (ai.timer % 10 === 0) balloonSfx('roar');
      if (ai.timer <= 0) {
        ai.under = 0;
        ai.burnCooldown = 110;
        balloonStartAction('float', 40);
      }
      break;
    case 'ventWarn':
      balloonHold();
      if (ai.timer % 6 === 0) spawnEffect('balloonPuff', boss.x + (ai.timer % 12 ? 6 : -6), boss.y - 40);
      if (ai.timer <= 0) balloonStartDive();
      break;
    case 'dive':
      balloonUpdateDive();
      break;
    case 'spin':
      balloonUpdateSpin();
      break;
    case 'grounded':
      balloonSettle();
      if (ai.timer <= 0) {
        balloonStartAction('inflate', 36);
        balloonSfx('roar');
      }
      break;
    case 'inflate':
      balloonSettle();
      if (ai.timer % 8 === 0) balloonSfx('roar');
      if (ai.timer <= 0) {
        ai.lift = 0;
        balloonStartAction('lift', 0);
      }
      break;
  }
}

function balloonBodySprite(boss) {
  const ai = boss.ai;
  switch (ai.action) {
    case 'dropWarn':
      return 'balloonBodyReach';
    case 'burnWarn':
    case 'burn':
    case 'lift':
      return 'balloonBodyShout';
    case 'ventWarn':
    case 'dive':
      return 'balloonBodyVent';
    case 'spin':
      return 'balloonBodyFlat';
    case 'grounded':
      return 'balloonBodySit';
    case 'inflate':
      return ai.timer > 18 ? 'balloonBodySit' : 'balloonBodyHalf';
  }
  return ai.blink % 100 < 6 ? 'balloonBodyBlink' : 'balloonBody';
}

function balloonFlameSprite(boss) {
  const ai = boss.ai;
  if (boss.state !== 'fight') return boss.state === 'pose' ? 'balloonFlameBig' : 'balloonFlameSmall';
  if (ai.action === 'spin' || ai.action === 'grounded') return null;
  if (ai.action === 'burnWarn') return Math.floor(ai.timer / 2) % 2 ? 'balloonFlameBig' : null;
  if (ai.action === 'burn' || ai.action === 'lift' || ai.action === 'inflate' || ai.rise > 6) return 'balloonFlameBig';
  if (ai.action === 'ventWarn' || ai.action === 'dive') return null;
  return Math.floor(ai.bob / 6) % 3 ? 'balloonFlameSmall' : null;
}

function balloonIntroSprite(boss) {
  if (boss.state === 'pose') return Math.floor(boss.timer / 12) % 4 === 1 ? 'balloonStand' : 'balloonPose';
  if (boss.state === 'drop') return 'balloonFall';
  return 'balloonStand';
}

function balloonDraw(ctx, boss, sx, sy) {
  const ai = boss.ai;
  const flip = boss.facing < 0;
  const flame = balloonFlameSprite(boss);
  drawSprite(ctx, boss.state === 'fight' ? balloonBodySprite(boss) : balloonIntroSprite(boss), sx, sy, flip, 'boss');
  if (flame) drawSprite(ctx, flame, flip ? sx - 1 : sx, sy - 24, false, 'boss');
  if (boss.state !== 'fight' || ai.action === 'spin') return;
  const shake = ai.bagShake > 0 ? (Math.floor(ai.bagShake / 2) % 2 ? 1 : -1) : 0;
  if (ai.bags >= 2) drawSprite(ctx, 'balloonBag', sx + (flip ? 9 : -10), sy - 11, false, 'boss');
  if (ai.bags >= 1) drawSprite(ctx, 'balloonBag', sx + (flip ? -10 : 9) + shake, sy - 11, false, 'boss');
}

function balloonBox(boss) {
  const flat = boss.ai.action === 'spin' || boss.ai.action === 'grounded';
  return { left: boss.x - 11, top: boss.y - (flat ? 30 : 38), right: boss.x + 11, bottom: boss.y };
}

function balloonContactBox(boss) {
  const box = balloonBox(boss);
  return { left: box.left + 2, top: box.top + 4, right: box.right - 2, bottom: box.bottom - 2 };
}

function balloonOnHit(boss, shot, weak) {
  if (weak) return;
  boss.ai.sink = 10;
  boss.ai.sinkTimer = 30;
}

function balloonOnDefeat() {
  for (const pile of balloonPiles()) sandPileCrumble(pile);
}

function sandPileCrumble(pile) {
  for (let i = 0; i < 4; i++) spawnEffect('sandDust', pile.x - 12 + i * 8, pile.y + 4, { vy: -0.6 });
  pile.alive = false;
}

function balloonMakePile(x, groundY) {
  const piles = balloonPiles();
  const existing = piles.find(pile => Math.abs(pile.x - x) < 26 && (pile.y === groundY || pile.y === groundY - 16));
  if (existing) {
    existing.life = 480;
    return;
  }
  if (piles.length >= 2) sandPileCrumble(piles[0]);
  const bounds = currentRoomBounds();
  const pileX = Math.max(bounds.left + 32, Math.min(bounds.right - 32, x));
  const pile = createPlatform({ type: 'sandPile', x: pileX, y: groundY - 16, room: stage.room.id });
  if (player.onGround && !player.platform && Math.abs(player.x - pileX) < 22 && player.y > pile.y && player.y <= groundY + 1) {
    const result = moveBody(player, 0, pile.y - player.y);
    if (!result.hitCeiling) player.platform = pile;
  }
}

// INITIALIZATION

Object.assign(effectTypes, {
  balloonPuff: {
    update(effect) {
      effect.y -= 0.4;
      return effect.timer >= 15;
    },
    draw: (ctx, effect, sx, sy) => drawSprite(ctx, 'balloonPuff' + Math.min(2, Math.floor(effect.timer / 5)), sx, sy, false, 'boss'),
  },
});

platformTypes.sandPile = {
  w: 32,
  h: 16,
  init(platform) {
    platform.life = 480;
  },
  update(platform) {
    platform.life--;
    if (platform.life <= 0) sandPileCrumble(platform);
  },
  draw(ctx, platform, sx, sy) {
    const flashing = platform.life < 90 && Math.floor(platform.life / 4) % 2 === 0;
    drawSprite(ctx, 'balloonSandPile', sx, sy, false, flashing ? 'sandFlash' : 'boss');
  },
};

Object.assign(bossShotKinds, {
  balloonShadow: {
    size: 12,
    harmless: true,
    behind: true,
    keepOffscreen: true,
    update(shot) {
      if (shot.bag && shot.bag.dead) return false;
      return shot.age < 150;
    },
    draw(ctx, shot, sx, sy) {
      const close = shot.bag && shot.y - shot.bag.y < 48;
      drawSprite(ctx, close ? 'balloonShadowBig' : 'balloonShadowSmall', sx, sy, false, Math.floor(shot.age / 4) % 2 ? 'balloonMark' : 'boss');
    },
  },
  balloonBag: {
    size: 10,
    damage: 3,
    keepOffscreen: true,
    update(shot) {
      shot.vy = Math.min(shot.vy + 0.3, 6);
      shot.y += shot.vy;
      const ground = balloonGroundBelow(shot.x, shot.y - 8);
      if (shot.y + 6 < ground) return true;
      shot.dead = true;
      balloonMakePile(shot.x, ground);
      spawnEffect('sandDust', shot.x - 8, ground - 4, { vy: -0.6 });
      spawnEffect('sandDust', shot.x + 8, ground - 4, { vy: -0.6 });
      playSfx('thud');
      return false;
    },
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'balloonDropBag', sx, sy, false, 'boss'),
  },
  balloonFlame: {
    damage: 3,
    behind: true,
    keepOffscreen: true,
    box(shot) {
      return { left: shot.x - 5, top: shot.y, right: shot.x + 5, bottom: shot.y + shot.length };
    },
    update(shot) {
      shot.x = boss.x;
      shot.y = boss.y + 2;
      const full = balloonGroundBelow(shot.x, shot.y) - shot.y;
      const grow = shot.age < 36 ? shot.age * 10 : (44 - shot.age) * 10;
      shot.length = Math.max(0, Math.min(full, grow));
      return shot.age < 44;
    },
    draw(ctx, shot, sx, sy) {
      if (!shot.length) return;
      const frame = 'balloonFire' + (Math.floor(shot.age / 3) % 2);
      ctx.save();
      ctx.beginPath();
      ctx.rect(sx - 8, sy, 16, shot.length);
      ctx.clip();
      for (let y = 0; y < shot.length; y += 16) drawSprite(ctx, frame, sx, sy + y, false, 'boss');
      ctx.restore();
      if (shot.length >= balloonGroundBelow(shot.x, shot.y) - shot.y - 1) drawSprite(ctx, 'balloonFireTip', sx, sy + shot.length, false, 'boss');
    },
  },
});

bossDefs.balloon = {
  name: 'BALLOON MAN',
  stage: 'balloon',
  weapon: 'balloon',
  w: 22,
  h: 38,
  contactDamage: 4,
  invulnFrames: 20,
  orbPalette: 'orbBalloon',
  portrait: 'balloonFace',
  present: { fall: 'balloonFall', land: 'balloonStand', pose: 'balloonPose' },
  spawn: balloonSpawn,
  update: balloonUpdate,
  draw: balloonDraw,
  box: balloonBox,
  contactBox: balloonContactBox,
  onWeakHit: balloonStartPuncture,
  onHit: balloonOnHit,
  onDefeat: balloonOnDefeat,
};
