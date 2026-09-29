// FUNCTIONS

function grizzlySpawn(boss) {
  Object.assign(boss.ai, { action: 'idle', timer: 40, blink: 0, shake: 0, quake: 0, last: [], stunCooldown: 0, slams: 0 });
}

function grizzlyAngry() {
  return boss.health <= 14;
}

function grizzlyArena() {
  const bounds = currentRoomBounds();
  return { left: bounds.left + 16, right: bounds.right - 16, ceiling: bounds.top + 32, floor: bounds.top + 192 };
}

function grizzlySetAction(action, timer) {
  boss.ai.action = action;
  boss.ai.timer = timer;
}

function grizzlyQuake(frames) {
  boss.ai.quake = Math.max(boss.ai.quake, frames);
}

function grizzlyPick(options) {
  const last = boss.ai.last[0];
  const fresh = options.filter(option => option !== last);
  const pool = fresh.length ? fresh : options;
  return pool[Math.floor(Math.random() * pool.length)];
}

function grizzlyChooseAction() {
  const ai = boss.ai;
  bossFacePlayer();
  const distance = Math.abs(player.x - boss.x);
  const options = ['slam', 'slam'];
  if (distance > 56) options.push('charge', 'charge', 'charge');
  if (ai.last[0] !== 'rocks' && ai.last[1] !== 'rocks') options.push('rocks', 'rocks');
  const choice = grizzlyPick(options);
  ai.last.unshift(choice);
  ai.last.length = Math.min(ai.last.length, 3);
  if (choice === 'charge') {
    grizzlySetAction('crouch', 30);
    grizzlySound('rumble');
  } else if (choice === 'slam') {
    ai.slams = grizzlyAngry() ? 2 : 1;
    grizzlySetAction('raise', 24);
    grizzlySound('roar');
  } else {
    grizzlyStartRoar();
  }
}

function grizzlyStartRoar() {
  const arena = grizzlyArena();
  const count = grizzlyAngry() ? 3 : 2;
  const spots = [Math.max(arena.left + 12, Math.min(arena.right - 12, player.x))];
  for (let tries = 0; spots.length < count && tries < 40; tries++) {
    const x = arena.left + 12 + Math.floor(Math.random() * (arena.right - arena.left - 24));
    if (spots.every(spot => Math.abs(spot - x) >= 44)) spots.push(x);
  }
  spots.forEach((x, index) => spawnBossShot('grizzlyRockMark', x, arena.floor, { ceiling: arena.ceiling, delay: 44 + index * 8 }));
  grizzlySetAction('roar', 32);
  grizzlySound('roar');
  grizzlyQuake(36);
}

function grizzlySlam() {
  const speed = grizzlyAngry() ? 2.8 : 2.4;
  for (const dir of [-1, 1]) spawnBossShot('grizzlyWave', boss.x + dir * 18, boss.y, { vx: dir * speed });
  spawnEffect('dust', boss.x - 14, boss.y);
  spawnEffect('dust', boss.x + 14, boss.y);
  playSfx('thud');
  grizzlyQuake(14);
}

function grizzlyUpdateIdle() {
  const ai = boss.ai;
  bossFacePlayer();
  const distance = Math.abs(player.x - boss.x);
  boss.vx = distance > 80 ? boss.facing * 0.6 : 0;
  if (boss.vx !== 0) boss.anim++;
  if (ai.timer <= 0) {
    boss.vx = 0;
    grizzlyChooseAction();
  }
}

function grizzlyUpdateCharge() {
  const ai = boss.ai;
  boss.vx = boss.facing * (grizzlyAngry() ? 3.8 : 3.3);
  boss.anim++;
  if (ai.timer % 4 === 0) spawnEffect('dust', boss.x - boss.facing * 16, boss.y);
  const result = bossPhysics();
  if (!result.hitWall) return;
  boss.w = 28;
  boss.vx = -boss.facing * 1.4;
  boss.vy = -2.2;
  boss.onGround = false;
  grizzlySetAction('bounce', 0);
  playSfx('thud');
  grizzlyQuake(20);
  const arena = grizzlyArena();
  for (let i = 0; i < 4; i++) grizzlyDust(boss.x - 40 + Math.random() * 80, arena.ceiling + 2, 0x10);
}

function grizzlyUpdateStep() {
  const ai = boss.ai;
  switch (ai.action) {
    case 'idle':
      grizzlyUpdateIdle();
      break;
    case 'crouch':
      boss.vx = 0;
      if (ai.timer % 5 === 0) spawnEffect('dust', boss.x - boss.facing * 18, boss.y);
      if (ai.timer % 10 === 0) playSfx('skate');
      if (ai.timer <= 0) {
        boss.w = 36;
        grizzlySetAction('charge', 0);
      }
      break;
    case 'bounce':
      if (boss.onGround) {
        boss.vx = 0;
        grizzlySetAction('dazed', 30);
      }
      break;
    case 'dazed':
      boss.vx = 0;
      if (ai.timer <= 0) grizzlySetAction('idle', 30);
      break;
    case 'raise':
      boss.vx = 0;
      if (ai.timer <= 0) {
        grizzlySlam();
        ai.slams--;
        grizzlySetAction('slam', 18);
      }
      break;
    case 'slam':
      if (ai.timer <= 0) {
        if (ai.slams > 0) grizzlySetAction('raise', 22);
        else grizzlySetAction('idle', grizzlyAngry() ? 36 : 50);
      }
      break;
    case 'roar':
      boss.vx = 0;
      if (ai.timer <= 0) {
        if (grizzlyAngry()) {
          ai.slams = 1;
          grizzlySetAction('raise', 24);
          grizzlySound('roar');
        } else grizzlySetAction('idle', 56);
      }
      break;
    case 'stung':
      boss.vx = ai.timer > 28 ? -boss.facing * 1.2 : 0;
      if (ai.timer % 10 === 0) playSfx('enemyHit');
      if (ai.timer <= 0) {
        ai.stunCooldown = 150;
        grizzlySetAction('idle', 20);
      }
      break;
  }
}

function grizzlyUpdate(boss) {
  const ai = boss.ai;
  ai.blink++;
  ai.timer--;
  if (ai.shake > 0) ai.shake--;
  if (ai.stunCooldown > 0 && ai.action !== 'stung') ai.stunCooldown--;
  if (ai.action === 'charge') grizzlyUpdateCharge();
  else {
    grizzlyUpdateStep();
    bossPhysics();
  }
  if (ai.quake > 0) {
    ai.quake--;
    if (stage.state === 'play') camera.y = currentRoomBounds().top + (Math.floor(ai.quake / 2) % 2 ? 2 : 0);
  }
}

function grizzlyQuadruped(boss) {
  return boss.state === 'fight' && (boss.ai.action === 'crouch' || boss.ai.action === 'charge');
}

function grizzlyBox(boss) {
  if (grizzlyQuadruped(boss)) return { left: boss.x - 17, top: boss.y - 20, right: boss.x + 17, bottom: boss.y };
  return { left: boss.x - 12, top: boss.y - 30, right: boss.x + 12, bottom: boss.y };
}

function grizzlyShielded(boss, shot) {
  if ((shot.weapon || 'buster') === weaknessChart.grizzly) return false;
  const guarding = (boss.ai.action === 'idle' && boss.onGround) || grizzlyQuadruped(boss);
  return guarding && (shot.x - boss.x) * boss.facing > 0;
}

function grizzlyWeakHit(boss) {
  const ai = boss.ai;
  if (ai.stunCooldown > 0 || ai.action === 'stung') {
    ai.shake = 12;
    return;
  }
  if (ai.action === 'charge' || ai.action === 'crouch') boss.w = 28;
  bossFacePlayer();
  boss.vy = -2;
  boss.onGround = false;
  grizzlySetAction('stung', 40);
  grizzlySound('roar');
}

function grizzlyPoseName(boss) {
  const ai = boss.ai;
  if (boss.state === 'pose') return Math.floor(boss.timer / 12) % 4 === 1 ? 'grizzlyStand' : 'grizzlyPose';
  if (boss.state !== 'fight') return boss.onGround ? 'grizzlyStand' : 'grizzlyJump';
  switch (ai.action) {
    case 'crouch':
      return Math.floor(ai.timer / 5) % 2 ? 'grizzlyCrouch' : 'grizzlyRun2';
    case 'charge':
      return Math.floor(boss.anim / 5) % 2 ? 'grizzlyRun1' : 'grizzlyRun2';
    case 'bounce':
    case 'dazed':
      return 'grizzlyDizzy';
    case 'raise':
    case 'roar':
      return 'grizzlyPose';
    case 'slam':
      return 'grizzlySlam';
    case 'stung':
      return Math.floor(ai.timer / 5) % 2 ? 'grizzlyFlail1' : 'grizzlyFlail2';
  }
  if (!boss.onGround) return 'grizzlyJump';
  if (boss.vx !== 0) return Math.floor(boss.anim / 10) % 2 ? 'grizzlyGuardWalk' : 'grizzlyGuard';
  return ai.blink % 90 < 6 ? 'grizzlyBlink' : 'grizzlyGuard';
}

function grizzlyDraw(ctx, boss, sx, sy) {
  const ai = boss.ai;
  drawSprite(ctx, grizzlyPoseName(boss), sx, sy, boss.facing < 0, 'grizzlyBoss');
  if (boss.state !== 'fight') return;
  if (ai.action === 'dazed' || ai.action === 'bounce') {
    for (let i = 0; i < 3; i++) {
      const angle = boss.anim / 6 + ai.timer / 5 + (i * Math.PI * 2) / 3;
      drawSprite(ctx, 'grizzlyStar', sx + Math.cos(angle) * 13, sy - 36 + Math.sin(angle) * 3, false, 'grizzlyBoss');
    }
  }
  if (ai.action === 'stung') {
    for (let i = 0; i < 4; i++) {
      const angle = ai.timer / 4 + (i * Math.PI) / 2;
      const bee = (ai.timer + i) % 4 < 2 ? 'grizzlyBee1' : 'grizzlyBee2';
      drawSprite(ctx, bee, sx + Math.cos(angle) * 16, sy - 30 + Math.sin(angle * 1.5) * 8, Math.sin(angle) > 0, 'grizzlyBoss');
    }
  }
}

function grizzlyDrawShadow(ctx, sx, floorY, width) {
  const half = Math.floor(width / 2);
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(Math.round(sx - half + 2), floorY, half * 2 - 4, 1);
  ctx.fillRect(Math.round(sx - half), floorY + 1, half * 2, 2);
  ctx.fillRect(Math.round(sx - half + 2), floorY + 3, half * 2 - 4, 1);
}

// INITIALIZATION

Object.assign(bossShotKinds, {
  grizzlyWave: {
    damage: 3,
    box: shot => ({ left: shot.x - 6, top: shot.y - 12, right: shot.x + 6, bottom: shot.y }),
    update(shot) {
      shot.x += shot.vx;
      if (shot.age % 6 === 0) spawnEffect('dust', shot.x - Math.sign(shot.vx) * 6, shot.y);
      if (solidAt(shot.x + Math.sign(shot.vx) * 7, shot.y - 6) || !solidAt(shot.x, shot.y + 2)) {
        grizzlyShatter(shot.x, shot.y - 6, 'grizzlyBoss');
        return false;
      }
      return true;
    },
    draw: (ctx, shot, sx, sy) => drawSprite(ctx, 'grizzlyWave' + (1 + (Math.floor(shot.age / 4) % 2)), sx, sy, shot.vx < 0, 'grizzlyBoss'),
  },
  grizzlyRockMark: {
    harmless: true,
    behind: true,
    keepOffscreen: true,
    update(shot) {
      if (shot.age % 6 === 1) grizzlyDust(shot.x - 5 + Math.random() * 10, shot.ceiling + 2, 0x10);
      if (shot.age < shot.delay) return true;
      spawnBossShot('grizzlyRock', shot.x, shot.ceiling + 8, { floor: shot.y, vy: 0 });
      grizzlySound('rumble');
      return false;
    },
    draw(ctx, shot, sx, sy) {
      grizzlyDrawShadow(ctx, sx, sy, 6 + Math.floor((Math.min(shot.age, shot.delay) / shot.delay) * 10));
    },
  },
  grizzlyRock: {
    damage: 4,
    fragile: true,
    keepOffscreen: true,
    box: shot => centerBox(shot.x, shot.y, 14, 14),
    update(shot) {
      shot.vy = Math.min(shot.vy + 0.35, 7);
      shot.y += shot.vy;
      if (shot.y + 7 < shot.floor) return true;
      grizzlyShatter(shot.x, shot.floor - 8, 'grizzlyStone');
      spawnEffect('dust', shot.x - 8, shot.floor);
      spawnEffect('dust', shot.x + 8, shot.floor);
      return false;
    },
    draw(ctx, shot, sx, sy) {
      grizzlyDrawShadow(ctx, sx, shot.floor - camera.y, 16);
      drawSprite(ctx, 'grizzlyRock' + (Math.floor(shot.age / 6) % 2), sx, sy, false, 'grizzlyStone');
    },
  },
});

bossDefs.grizzly = {
  name: 'GRIZZLY MAN',
  stage: 'grizzly',
  weapon: 'grizzly',
  w: 28,
  h: 30,
  contactDamage: 4,
  invulnFrames: 20,
  orbPalette: 'orbGrizzly',
  portrait: 'grizzlyFace',
  palette: 'grizzlyBoss',
  present: { fall: 'grizzlyJump', land: 'grizzlyStand', pose: 'grizzlyPose' },
  spawn: grizzlySpawn,
  update: grizzlyUpdate,
  draw: grizzlyDraw,
  box: grizzlyBox,
  contactBox: grizzlyBox,
  shielded: grizzlyShielded,
  onWeakHit: grizzlyWeakHit,
  updatePose(boss) {
    if (boss.timer === 6) grizzlySound('roar');
  },
};
