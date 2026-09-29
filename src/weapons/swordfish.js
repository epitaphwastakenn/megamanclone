// VARIABLES

const swordDash = { timer: 0, dir: 1, airUsed: false, trail: [] };
const swordDashStats = { speed: 5, frames: 18, shieldExtra: 8 };

// FUNCTIONS

function swordDashShot() {
  return playerShots.find(shot => shot.kind === 'swordDash' && !shot.reflected) || null;
}

function resetSwordDash() {
  swordDash.timer = 0;
  swordDash.airUsed = false;
  swordDash.trail.length = 0;
}

function finishSwordDash() {
  swordDash.timer = 0;
  swordDash.trail.length = 0;
  const shot = swordDashShot();
  if (shot) shot.dead = true;
  player.onGround = isStandingOn(player);
}

function startSwordDash() {
  if (swordDash.timer > 0 || swordDash.airUsed) return false;
  player.climbing = false;
  player.sliding = false;
  player.platform = null;
  player.vy = 0;
  swordDash.timer = swordDashStats.frames;
  swordDash.dir = player.facing;
  swordDash.airUsed = true;
  swordDash.trail.length = 0;
  player.shieldTimer = swordDashStats.frames + swordDashStats.shieldExtra;
  makePlayerShot('swordDash', player.x + player.facing * 13, player.y - 11, { dir: player.facing });
  playSfx('throw');
  playSfx('skate');
  return true;
}

function updateSwordDash() {
  if (swordDash.timer === 0 && (player.onGround || player.climbing)) swordDash.airUsed = false;
  if (swordDash.timer <= 0) return false;
  if (!swordDashShot() || player.dead) {
    finishSwordDash();
    return false;
  }
  swordDash.timer--;
  player.facing = swordDash.dir;
  player.vy = 0;
  player.platform = null;
  swordDash.trail.unshift({ x: player.x, y: player.y });
  if (swordDash.trail.length > 10) swordDash.trail.pop();
  const result = moveBody(player, swordDash.dir * swordDashStats.speed, 0);
  player.onGround = isStandingOn(player);
  if (swordDash.timer % 3 === 0) {
    if (player.inWater) spawnEffect('bubble', player.x - swordDash.dir * 10, player.y - 8 - Math.random() * 10);
    else spawnEffect('dust', player.x - swordDash.dir * 12, player.y - 6);
  }
  if (result.hitWall) {
    spawnEffect('hitSpark', player.x + swordDash.dir * 16, player.y - 11);
    playSfx('tink');
    finishSwordDash();
    return true;
  }
  if (swordDash.timer === 0) finishSwordDash();
  return true;
}

function drawSwordDashTrail(ctx, sx, sy) {
  if (swordDash.timer <= 0) return;
  const flip = swordDash.dir < 0;
  for (const index of [8, 5, 2]) {
    const spot = swordDash.trail[index];
    if (!spot || (index === 8 && player.frame % 2)) continue;
    drawSprite(ctx, 'megaDash', spot.x - camera.x, spot.y - camera.y, flip, 'swordDashGhost');
  }
  drawSprite(ctx, player.pose, sx, sy, flip, playerPalette());
}

// INITIALIZATION

Object.assign(playerShotKinds, {
  swordDash: {
    weapon: 'swordfish',
    damage: 3,
    w: 40,
    h: 18,
    bossDamage: 2,
    weakDamage: 6,
    pierceBoss: true,
    drawReflected: false,
    screenMargin: 64,
    update(shot) {
      shot.x = player.x + swordDash.dir * 13;
      shot.y = player.y - 11;
      return swordDash.timer > 0 && !player.dead;
    },
    onShield() {
      playSfx('tink');
      return 'pass';
    },
    onHitEnemy: () => 'pass',
    onHitBoss: () => 'pass',
    draw(ctx, shot, sx, sy) {
      const frame = Math.floor(shot.age / 3) % 2;
      drawSprite(ctx, 'swordDashBlade' + frame, sx + swordDash.dir * 6, sy, swordDash.dir < 0, 'swordfishBoss');
    },
  },
});

weaponDefs.swordfish = {
  label: 'SWORD DASH',
  palette: 'megaSwordfish',
  cost: 2,
  barColors: [0x12, 0x30],
  boss: 'swordfish',
  pose: 'Shoot',
  noPose: true,
  icon: { frames: ['swordDashIcon0', 'swordDashIcon0', 'swordDashIcon1'], rate: 8, palette: 'swordfishBoss' },
  fire: startSwordDash,
  controlPlayer: updateSwordDash,
  playerPose: () => (swordDash.timer > 0 ? 'megaDash' : null),
  drawPlayer: drawSwordDashTrail,
  onSelect: resetSwordDash,
  onDeselect: resetSwordDash,
};
