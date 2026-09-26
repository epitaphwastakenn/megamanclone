// VARIABLES

const playerStats = {
  walkSpeed: 1.375,
  jumpSpeed: 4.87,
  gravity: 0.25,
  maxFall: 7,
  climbSpeed: 1.3,
  slideSpeed: 2.5,
  slideFrames: 26,
  standHeight: 22,
  slideHeight: 14,
  width: 14,
  maxHealth: 28,
  hurtFrames: 32,
  invulnFrames: 100,
  shootPoseFrames: 18,
  chargeMid: 30,
  chargeFull: 90,
};

const player = {
  x: 0,
  y: 0,
  w: playerStats.width,
  h: playerStats.standHeight,
  vx: 0,
  vy: 0,
  facing: 1,
  onGround: false,
  climbing: false,
  climbStep: 0,
  sliding: false,
  slideTimer: 0,
  shootTimer: 0,
  stepTimer: 0,
  runTimer: 0,
  blinkTimer: 0,
  hurtTimer: 0,
  invulnTimer: 0,
  health: playerStats.maxHealth,
  charge: 0,
  dead: false,
  visible: true,
  control: true,
  pose: 'megaStand',
  teleport: null,
  wasOnGround: false,
  frame: 0,
};

// FUNCTIONS

function resetPlayer(x, y) {
  Object.assign(player, {
    x,
    y,
    w: playerStats.width,
    h: playerStats.standHeight,
    vx: 0,
    vy: 0,
    facing: 1,
    onGround: true,
    climbing: false,
    sliding: false,
    slideTimer: 0,
    shootTimer: 0,
    stepTimer: 0,
    runTimer: 0,
    blinkTimer: 0,
    hurtTimer: 0,
    invulnTimer: 0,
    health: playerStats.maxHealth,
    charge: 0,
    dead: false,
    visible: true,
    control: false,
    pose: 'megaStand',
    teleport: null,
    wasOnGround: true,
    frame: 0,
  });
}

function startTeleportIn(groundY) {
  player.teleport = { mode: 'in', beamY: camera.y - 32, groundY, timer: 0 };
  player.control = false;
  player.visible = true;
}

function startTeleportOut() {
  player.teleport = { mode: 'out', beamY: player.y, groundY: player.y, timer: 0 };
  player.control = false;
  stopChargeSound();
  player.charge = 0;
}

function updateTeleport() {
  const tp = player.teleport;
  tp.timer++;
  if (tp.mode === 'in') {
    if (tp.beamY < tp.groundY) {
      tp.beamY = Math.min(tp.groundY, tp.beamY + 8);
      player.pose = 'megaBeam';
      player.y = tp.beamY;
      if (tp.beamY >= tp.groundY) {
        tp.timer = 0;
        playSfx('teleportIn');
      }
      return;
    }
    player.y = tp.groundY;
    if (tp.timer < 4) player.pose = 'megaTeleportB';
    else if (tp.timer < 8) player.pose = 'megaTeleportA';
    else {
      player.pose = 'megaStand';
      player.teleport = null;
      player.control = true;
      player.onGround = true;
    }
    return;
  }
  if (tp.timer === 1) playSfx('teleportOut');
  if (tp.timer < 5) player.pose = 'megaTeleportA';
  else if (tp.timer < 9) player.pose = 'megaTeleportB';
  else {
    player.pose = 'megaBeam';
    player.y -= 8;
    if (player.y < camera.y - 40) {
      player.visible = false;
      tp.done = true;
    }
  }
}

function playerShotCount() {
  return playerShots.filter(shot => !shot.reflected).length;
}

function busterOrigin() {
  let dy = -10;
  if (player.climbing) dy = -11;
  else if (!player.onGround) dy = -11;
  return { x: player.x + player.facing * 17, y: player.y + dy };
}

function fireBuster(kind) {
  if (playerShotCount() >= 3) return false;
  const origin = busterOrigin();
  firePlayerShot(origin.x, origin.y, player.facing, kind);
  player.shootTimer = playerStats.shootPoseFrames;
  stageEvents.playerFired = true;
  return true;
}

function hurtPlayer(damage) {
  if (player.dead || player.invulnTimer > 0 || player.teleport || !player.control) return;
  player.health = Math.max(0, player.health - damage);
  if (player.health <= 0) {
    killPlayer(false);
    return;
  }
  playSfx('hurt');
  player.hurtTimer = playerStats.hurtFrames;
  player.invulnTimer = playerStats.invulnFrames;
  player.climbing = false;
  if (player.sliding && !boxBlockedAbove(player.x, player.y, player.w, playerStats.standHeight)) {
    player.sliding = false;
    player.h = playerStats.standHeight;
  }
  player.vy = Math.max(player.vy, 0);
  player.charge = 0;
  stopChargeSound();
}

function killPlayer(fromPit) {
  if (player.dead) return;
  player.dead = true;
  player.visible = false;
  player.health = 0;
  player.charge = 0;
  stopChargeSound();
  stopSong();
  playSfx('death');
  if (!fromPit) spawnDeathOrbs(player.x, player.y - 12, 'mega');
  stageEvents.playerDied = true;
}

function startClimb(ladderCol) {
  player.climbing = true;
  player.sliding = false;
  player.h = playerStats.standHeight;
  player.x = ladderCol * tileSize + tileSize / 2;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.climbStep = 0;
}

function updateClimbing() {
  const up = input.held.up;
  const down = input.held.down;
  if (input.pressed.left) player.facing = -1;
  if (input.pressed.right) player.facing = 1;
  if (input.pressed.jump) {
    player.climbing = false;
    player.vy = 0;
    return;
  }
  let dy = 0;
  if (player.shootTimer === 0) {
    if (up && !down) dy = -playerStats.climbSpeed;
    else if (down && !up) dy = playerStats.climbSpeed;
  }
  if (dy !== 0) {
    player.climbStep += Math.abs(dy);
    const result = moveBody(player, 0, dy, { ignoreLadders: true });
    if (dy > 0 && result.landed) {
      player.climbing = false;
      player.onGround = true;
      return;
    }
  }
  if (dy < 0 && !ladderAt(player.x, player.y - 1)) {
    player.y = (Math.floor((player.y - 1) / tileSize) + 1) * tileSize;
    player.climbing = false;
    player.onGround = true;
    return;
  }
  if (!ladderAt(player.x, player.y - 8) && !ladderAt(player.x, player.y - 1)) {
    player.climbing = false;
    player.vy = 0;
  }
}

function tryGrabLadder() {
  const offsets = [0, -6, 6];
  if (input.held.up && !input.held.down) {
    for (const offset of offsets) {
      const x = player.x + offset;
      if (ladderAt(x, player.y - 12) || ladderAt(x, player.y - 2)) {
        startClimb(Math.floor(x / tileSize));
        return true;
      }
    }
  }
  if (input.held.down && !input.held.up && player.onGround && !input.pressed.jump) {
    const below = Math.floor(player.y / tileSize);
    for (const offset of offsets) {
      const col = Math.floor((player.x + offset) / tileSize);
      if (isLadderTopTile(col, below)) {
        startClimb(col);
        player.y += 10;
        return true;
      }
    }
  }
  return false;
}

function startSlide() {
  player.sliding = true;
  player.slideTimer = playerStats.slideFrames;
  player.h = playerStats.slideHeight;
  player.shootTimer = 0;
  spawnEffect('dust', player.x - player.facing * 8, player.y);
}

function updatePlayerControl() {
  const dir = (input.held.right ? 1 : 0) - (input.held.left ? 1 : 0);

  if (player.hurtTimer > 0) {
    player.hurtTimer--;
    moveBody(player, -player.facing * 0.5, 0);
    applyPlayerGravity();
    return;
  }

  if (player.climbing) {
    updateClimbing();
    handleShooting();
    return;
  }

  if (tryGrabLadder()) return;

  if (player.sliding) {
    if (dir !== 0) player.facing = dir;
    const blocked = boxBlockedAbove(player.x, player.y, player.w, playerStats.standHeight);
    if (input.pressed.jump && !blocked && !input.held.down) {
      endSlide();
      player.vy = -playerStats.jumpSpeed;
      player.onGround = false;
    } else {
      player.slideTimer--;
      const result = moveBody(player, player.facing * playerStats.slideSpeed, 0);
      if (player.slideTimer % 6 === 0) spawnEffect('dust', player.x - player.facing * 10, player.y);
      const stillBlocked = boxBlockedAbove(player.x, player.y, player.w, playerStats.standHeight);
      if ((player.slideTimer <= 0 || result.hitWall) && !stillBlocked) endSlide();
      else if (player.slideTimer <= 0) player.slideTimer = 1;
    }
    applyPlayerGravity();
    if (!player.onGround && player.sliding) endSlide();
    handleShooting();
    return;
  }

  if (player.onGround && input.pressed.jump && input.held.down) {
    startSlide();
    return;
  }

  if (dir !== 0) {
    player.facing = dir;
    if (player.onGround) {
      player.stepTimer++;
      if (player.stepTimer === 1) moveBody(player, dir, 0);
      else if (player.stepTimer < 8) moveBody(player, dir * 0.125, 0);
      else moveBody(player, dir * playerStats.walkSpeed, 0);
    } else {
      player.stepTimer = 8;
      moveBody(player, dir * playerStats.walkSpeed, 0);
    }
  } else {
    player.stepTimer = 0;
  }

  if (player.onGround && input.pressed.jump) {
    player.vy = -playerStats.jumpSpeed;
    player.onGround = false;
  }
  if (player.vy < 0 && !input.held.jump) player.vy = 0;

  applyPlayerGravity();
  handleShooting();
}

function endSlide() {
  player.sliding = false;
  player.h = playerStats.standHeight;
  player.slideTimer = 0;
}

function applyPlayerGravity() {
  player.vy = Math.min(player.vy + playerStats.gravity, playerStats.maxFall);
  const result = moveBody(player, 0, player.vy);
  if (result.hitCeiling) player.vy = 0;
  if (result.landed) {
    if (!player.onGround && player.vy > 1) playSfx('land');
    player.onGround = true;
    player.vy = 0;
  } else if (player.vy > 0 || !isStandingOn(player)) {
    player.onGround = false;
  }
}

function handleShooting() {
  if (player.sliding) {
    if (input.held.fire) player.charge++;
    else releaseCharge();
    updateChargeSound();
    return;
  }
  if (input.pressed.fire) {
    if (fireBuster('pellet')) playSfx('shoot');
    player.charge = 0;
  }
  if (input.held.fire) player.charge++;
  else releaseCharge();
  updateChargeSound();
}

function releaseCharge() {
  if (player.charge >= playerStats.chargeFull) {
    if (fireBuster('full')) playSfx('shootFull');
  } else if (player.charge >= playerStats.chargeMid) {
    if (fireBuster('mid')) playSfx('shootMid');
  }
  player.charge = 0;
}

function updateChargeSound() {
  if (player.charge >= 16) startChargeSound();
  else stopChargeSound();
}

function updatePlayer() {
  player.frame++;
  if (player.dead) return;
  if (player.teleport) {
    updateTeleport();
    return;
  }
  if (player.invulnTimer > 0) player.invulnTimer--;
  if (player.shootTimer > 0) player.shootTimer--;
  if (player.control) updatePlayerControl();
  else if (!player.climbing) applyPlayerGravity();
  choosePlayerPose();
}

function autoWalk(dx) {
  player.facing = Math.sign(dx) || player.facing;
  player.x += dx;
  player.stepTimer = 8;
  player.runTimer++;
  player.pose = 'megaRun' + (1 + (Math.floor(player.runTimer / 7) % 4));
}

function choosePlayerPose() {
  const shooting = player.shootTimer > 0;
  if (player.hurtTimer > 0) {
    player.pose = 'megaHurt';
    return;
  }
  if (player.climbing) {
    if (shooting) player.pose = 'megaClimbShoot';
    else if (!ladderAt(player.x, player.y - 20) && ladderAt(player.x, player.y - 1)) player.pose = 'megaClimbTop';
    else player.pose = 'megaClimb';
    return;
  }
  if (player.sliding) {
    player.pose = 'megaSlide';
    return;
  }
  if (!player.onGround) {
    player.pose = shooting ? 'megaJumpShoot' : 'megaJump';
    return;
  }
  const moving = input.held.left !== input.held.right && player.control;
  if (moving && player.stepTimer >= 8) {
    player.runTimer++;
    const index = 1 + (Math.floor(player.runTimer / 7) % 4);
    player.pose = (shooting ? 'megaRunShoot' : 'megaRun') + index;
    return;
  }
  player.runTimer = 0;
  if (moving) {
    player.pose = shooting ? 'megaShoot' : 'megaStep';
    return;
  }
  if (shooting) {
    player.pose = 'megaShoot';
    return;
  }
  player.blinkTimer++;
  player.pose = player.blinkTimer % 120 > 110 ? 'megaBlink' : 'megaStand';
}

function playerPalette() {
  if (player.charge >= playerStats.chargeFull) return ['megaCharge2', 'megaCharge3', 'mega'][Math.floor(player.frame / 2) % 3];
  if (player.charge >= playerStats.chargeMid) return Math.floor(player.frame / 4) % 2 ? 'megaCharge1' : 'mega';
  return 'mega';
}

function drawPlayer(ctx) {
  if (!player.visible || player.dead) return;
  if (player.invulnTimer > 0 && player.hurtTimer === 0 && Math.floor(player.invulnTimer / 2) % 2 === 0) return;
  const screenX = player.x - camera.x;
  const screenY = player.y - camera.y;
  let flip = player.facing < 0;
  if (player.pose === 'megaClimb') flip = Math.floor(player.climbStep / 10) % 2 === 1;
  if (player.pose === 'megaClimbTop' || player.pose === 'megaBeam' || player.pose.startsWith('megaTeleport')) flip = false;
  drawSprite(ctx, player.pose, screenX, screenY, flip, playerPalette());
  if (player.hurtTimer > 0) {
    if (player.hurtTimer > 16 && Math.floor(player.hurtTimer / 2) % 2 === 0) drawSprite(ctx, 'megaHitStar', screenX, screenY - 12, false, 'enemy');
    const sweat = 'megaSweat' + (1 + (Math.floor((playerStats.hurtFrames - player.hurtTimer) / 6) % 3));
    drawSprite(ctx, sweat, screenX - player.facing * 2, screenY - 26, flip, 'enemy');
  }
}
