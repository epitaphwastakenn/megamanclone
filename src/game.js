// VARIABLES

const game = {
  scene: 'title',
  timer: 0,
  lives: 3,
  fade: null,
  fadeLevel: 0,
  stars: [],
};

const stage = {
  state: 'ready',
  timer: 0,
  room: null,
  checkpointIndex: 0,
  fillQueue: 0,
  fillTimer: 0,
  transition: null,
  doorSequence: null,
  bossPhase: null,
  bossDefeated: false,
  pauseReturn: null,
};

// FUNCTIONS

function startFade(callback) {
  if (game.fade) return;
  game.fade = { dir: 1, timer: 0, callback };
}

function updateFade() {
  if (!game.fade) return;
  game.fade.timer++;
  if (game.fade.timer % 4 !== 0) return;
  game.fadeLevel += game.fade.dir;
  if (game.fade.dir > 0 && game.fadeLevel >= 4) {
    game.fadeLevel = 4;
    const callback = game.fade.callback;
    game.fade.dir = -1;
    game.fade.timer = 0;
    game.fade.hold = 6;
    if (callback) callback();
  } else if (game.fade.dir < 0 && game.fadeLevel <= 0) {
    game.fadeLevel = 0;
    game.fade = null;
  }
}

function setScene(scene) {
  game.scene = scene;
  game.timer = 0;
}

function makeStars() {
  game.stars = [];
  for (let i = 0; i < 40; i++) {
    game.stars.push({ x: Math.random() * screenWidth, y: Math.random() * screenHeight, speed: 0.5 + Math.random() * 2.5, twinkle: Math.floor(Math.random() * 30) });
  }
}

function updateStars(direction) {
  for (const star of game.stars) {
    star.x -= star.speed * (direction || 1);
    if (star.x < 0) star.x += screenWidth;
    if (star.x >= screenWidth) star.x -= screenWidth;
  }
}

function drawStars(ctx, top, bottom) {
  for (const star of game.stars) {
    if (star.y < top || star.y > bottom) continue;
    const bright = (game.timer + star.twinkle) % 30 < 20;
    ctx.fillStyle = bright ? nesPalette[0x30] : nesPalette[0x10];
    const size = star.speed > 2 ? 2 : 1;
    ctx.fillRect(Math.floor(star.x), Math.floor(star.y), size, size);
  }
}

function currentRoomBounds() {
  return roomBounds(stage.room);
}

function startStage(checkpointIndex) {
  setScene('stage');
  stage.checkpointIndex = checkpointIndex;
  const checkpoint = checkpoints[checkpointIndex];
  stage.room = rooms.find(room => room.id === checkpoint.room);
  for (const key in doors) doors[key].openAmount = 0;
  resetSpawns();
  resetLevelItems();
  effects.length = 0;
  clearBoss();
  stage.fillQueue = 0;
  stage.transition = null;
  stage.doorSequence = null;
  stage.bossPhase = null;
  stage.bossDefeated = false;
  const x = checkpoint.col * tileSize + tileSize / 2;
  const y = checkpoint.row * tileSize;
  resetPlayer(x, y);
  player.visible = false;
  const target = cameraTargetFor(stage.room, x);
  camera.x = target.x;
  camera.y = target.y;
  stage.state = 'ready';
  stage.timer = 0;
  playSong(stageSong);
}

function updateStage() {
  stageEvents.playerFired = false;
  switch (stage.state) {
    case 'ready':
      updateReady();
      break;
    case 'play':
      updatePlay();
      break;
    case 'transition':
      updateTransition();
      break;
    case 'door':
      updateDoorSequence();
      break;
    case 'fill':
      updateFill();
      break;
    case 'bossIntro':
      updateBossIntro();
      break;
    case 'dead':
      updateDead();
      break;
    case 'victory':
      updateVictory();
      break;
    case 'paused':
      if (input.pressed.start) {
        stage.state = stage.pauseReturn || 'play';
        playSfx('pause');
      }
      break;
  }
}

function updateReady() {
  stage.timer++;
  updateSpawns(stage.room);
  updateItems();
  if (stage.timer === 120) {
    startTeleportIn(player.y);
  }
  if (stage.timer > 120) {
    updatePlayer();
    if (player.control) {
      stage.state = 'play';
      stage.timer = 0;
    }
  }
}

function updatePlay() {
  if (input.pressed.start && player.control) {
    stage.pauseReturn = 'play';
    stage.state = 'paused';
    playSfx('pause');
    stopChargeSound();
    return;
  }
  updatePlayer();
  if (stage.state !== 'play') return;
  if (checkRoomTransitions()) return;
  if (checkDoors()) return;
  clampPlayerToRoom();
  followCamera();
  updateSpawns(stage.room);
  updateEnemies(true);
  updateBoss(true);
  updatePlayerShots();
  updateEnemyShots();
  updateItems();
  updateEffects();
  if (player.dead) {
    stage.state = 'dead';
    stage.timer = 0;
    return;
  }
  if (stage.fillQueue > 0) {
    stage.state = 'fill';
    stage.fillTimer = 0;
    stopChargeSound();
  }
}

function clampPlayerToRoom() {
  const bounds = currentRoomBounds();
  const half = player.w / 2;
  if (player.x < bounds.left + half) player.x = bounds.left + half;
  if (player.x > bounds.right - half) player.x = bounds.right - half;
}

function followCamera() {
  const target = cameraTargetFor(stage.room, player.x);
  camera.x = target.x;
  camera.y = target.y;
}

function checkRoomTransitions() {
  const bounds = currentRoomBounds();
  if (player.climbing && player.y < bounds.top + 8 && input.held.up) {
    const above = roomAtPoint(player.x, bounds.top - 8);
    if (above) {
      startTransition(above, 'up');
      return true;
    }
  }
  if (player.y > bounds.bottom + 2) {
    const below = roomAtPoint(player.x, bounds.bottom + 8);
    if (below) {
      startTransition(below, 'down');
      return true;
    }
    if (player.y - player.h > bounds.bottom) {
      killPlayer(true);
      stage.state = 'dead';
      stage.timer = 0;
      return true;
    }
  }
  return false;
}

function startTransition(room, direction) {
  stopChargeSound();
  player.charge = 0;
  enemies.length = 0;
  enemyShots.length = 0;
  playerShots.length = 0;
  items.splice(0, items.length, ...items.filter(item => item.levelId !== undefined));
  const target = cameraTargetFor(room, player.x);
  stage.transition = { room, direction, fromX: camera.x, fromY: camera.y, toX: target.x, toY: target.y, timer: 0, frames: 64 };
  stage.state = 'transition';
}

function updateTransition() {
  const transition = stage.transition;
  transition.timer++;
  const t = transition.timer / transition.frames;
  camera.x = Math.round(transition.fromX + (transition.toX - transition.fromX) * t);
  camera.y = Math.round(transition.fromY + (transition.toY - transition.fromY) * t);
  const step = 26 / transition.frames;
  if (transition.direction === 'up') {
    player.y -= step;
    player.climbStep += step;
  } else {
    player.y += step;
    if (player.climbing) player.climbStep += step;
  }
  player.frame++;
  choosePlayerPose();
  if (transition.timer >= transition.frames) {
    stage.room = transition.room;
    stage.transition = null;
    stage.state = 'play';
    for (const spawn of levelSpawns) if (spawn.room === stage.room.id) spawn.state = 'ready';
    updateCheckpoint();
  }
}

function updateCheckpoint() {
  const index = checkpoints.findIndex(checkpoint => checkpoint.room === stage.room.id);
  if (index > stage.checkpointIndex) stage.checkpointIndex = index;
}

function checkDoors() {
  if (!player.onGround || !input.held.right) return false;
  const probeX = player.x + player.w / 2 + 1;
  const col = Math.floor(probeX / tileSize);
  const row = Math.floor((player.y - 8) / tileSize);
  if (tileAt(col, row) !== 'D') return false;
  const doorList = [getDoor(col)];
  let lastCol = col;
  while (tileAt(lastCol + 1, row) === 'D') {
    lastCol++;
    doorList.push(getDoor(lastCol));
  }
  const next = roomAtPoint((lastCol + 1) * tileSize + 8, player.y - 8);
  if (!next || next === stage.room) return false;
  stopChargeSound();
  player.charge = 0;
  player.control = false;
  player.shootTimer = 0;
  enemies.length = 0;
  enemyShots.length = 0;
  playerShots.length = 0;
  stage.doorSequence = { doors: doorList, next, phase: 'open', timer: 0, walkTo: (lastCol + 1) * tileSize + 12 };
  stage.state = 'door';
  playSfx('door');
  return true;
}

function setDoorsOpen(sequence, amount) {
  for (const door of sequence.doors) door.openAmount = amount;
}

function updateDoorSequence() {
  const sequence = stage.doorSequence;
  const openAmount = sequence.doors[0].openAmount;
  sequence.timer++;
  player.frame++;
  if (sequence.phase === 'open') {
    player.pose = 'megaStand';
    if (sequence.timer % 6 === 0) setDoorsOpen(sequence, Math.min(64, openAmount + 16));
    if (openAmount >= 64 && sequence.timer > 26) {
      sequence.phase = 'scroll';
      sequence.timer = 0;
      const target = cameraTargetFor(sequence.next, sequence.next.col * tileSize);
      sequence.fromX = camera.x;
      sequence.toX = target.x;
      stage.room = sequence.next;
      if (stage.room.boss) stopSong();
    }
  } else if (sequence.phase === 'scroll') {
    const frames = 80;
    camera.x = Math.round(sequence.fromX + (sequence.toX - sequence.fromX) * Math.min(1, sequence.timer / frames));
    if (player.x < sequence.walkTo) autoWalk(Math.min(1, sequence.walkTo - player.x));
    else player.pose = 'megaStand';
    if (sequence.timer >= frames && player.x >= sequence.walkTo) {
      sequence.phase = 'close';
      sequence.timer = 0;
      playSfx('door');
    }
  } else if (sequence.phase === 'close') {
    player.pose = 'megaStand';
    if (sequence.timer % 6 === 0) setDoorsOpen(sequence, Math.max(0, openAmount - 16));
    if (openAmount <= 0 && sequence.timer > 26) {
      stage.doorSequence = null;
      updateCheckpoint();
      for (const spawn of levelSpawns) if (spawn.room === stage.room.id) spawn.state = 'ready';
      if (stage.room.boss && !stage.bossDefeated) {
        stage.state = 'bossIntro';
        stage.bossPhase = { phase: 'wait', timer: 0 };
      } else {
        player.control = true;
        stage.state = 'play';
      }
    }
  }
}

function updateBossIntro() {
  const intro = stage.bossPhase;
  intro.timer++;
  updatePlayer();
  updateBoss(false);
  updateEffects();
  if (intro.phase === 'wait') {
    if (intro.timer >= 40) {
      const bounds = currentRoomBounds();
      spawnBoss(bounds.left + 12 * tileSize, bounds.top + 40);
      intro.phase = 'drop';
      intro.timer = 0;
    }
  } else if (intro.phase === 'drop') {
    if (boss.state === 'pose') {
      intro.phase = 'pose';
      intro.timer = 0;
    }
  } else if (intro.phase === 'pose') {
    if (intro.timer >= 50) {
      intro.phase = 'fill';
      intro.timer = 0;
      boss.state = 'idle';
    }
  } else if (intro.phase === 'fill') {
    if (intro.timer % 3 === 0 && boss.health < bossStats.maxHealth) {
      boss.health++;
      playSfx('bossFill');
    }
    if (boss.health >= bossStats.maxHealth && intro.timer > 90) {
      boss.state = 'fight';
      player.control = true;
      stage.state = 'play';
      stage.bossPhase = null;
      playSong(bossSong);
    }
  }
}

function updateFill() {
  stage.fillTimer++;
  if (stage.fillTimer % 3 !== 0) return;
  if (stage.fillQueue > 0 && player.health < playerStats.maxHealth) {
    player.health++;
    stage.fillQueue--;
    playSfx('tick');
  } else {
    stage.fillQueue = 0;
    stage.state = 'play';
  }
}

function updateDead() {
  stage.timer++;
  updateEnemies(false);
  updateBoss(false);
  updateEnemyShots();
  updateEffects();
  if (stage.timer === 200) {
    startFade(() => {
      if (game.lives <= 0) {
        setScene('gameOver');
        playSong(gameOverSong);
        return;
      }
      game.lives--;
      startStage(stage.checkpointIndex);
    });
  }
}

function onBossDefeated() {
  stage.state = 'victory';
  stage.timer = 0;
  stage.bossDefeated = true;
  player.control = false;
  player.shootTimer = 0;
  enemyShots.length = 0;
}

function updateVictory() {
  stage.timer++;
  updateEffects();
  if (!player.teleport) {
    player.frame++;
    applyPlayerGravity();
    if (player.climbing) player.pose = 'megaClimb';
    else choosePlayerPose();
  }
  if (stage.timer === 170) playSong(victorySong);
  if (stage.timer === 470) {
    player.climbing = false;
    startTeleportOut();
  }
  if (player.teleport) {
    updateTeleport();
    if (player.teleport && player.teleport.done && !game.fade) {
      startFade(() => {
        stopSong();
        setScene('weaponGet');
        makeStars();
        playSong(weaponGetSong);
      });
    }
  }
}

function drawStage(ctx) {
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  drawTiles(ctx);
  drawItems(ctx);
  drawEnemies(ctx);
  drawBoss(ctx);
  drawPlayer(ctx);
  drawPlayerShots(ctx);
  drawEnemyShots(ctx);
  drawEffects(ctx);
  if (stage.state !== 'ready' || stage.timer > 120) drawHud(ctx);
  if (stage.state === 'ready' && stage.timer < 120 && Math.floor(stage.timer / 15) % 2 === 0) {
    drawTextCentered(ctx, 'READY', screenWidth / 2, 112, nesPalette[0x30]);
  }
  if (stage.state === 'paused') drawPauseMenu(ctx);
}

function drawPauseMenu(ctx) {
  drawPanel(ctx, 56, 64, 144, 104);
  drawText(ctx, 'P', 72, 80, nesPalette[0x30]);
  for (let i = 0; i < playerStats.maxHealth; i++) {
    ctx.fillStyle = i < player.health ? nesPalette[0x30] : nesPalette[0x00];
    ctx.fillRect(88 + i * 3, 80, 2, 8);
  }
  drawText(ctx, 'MEGA BUSTER', 72, 96, nesPalette[0x2C]);
  drawSprite(ctx, 'oneUp', 88, 140, false, 'mega');
  drawText(ctx, 'X ' + game.lives, 104, 128, nesPalette[0x30]);
  drawTextCentered(ctx, 'PAUSE', 128, 152, nesPalette[0x28]);
}

function updateTitle() {
  game.timer++;
  updateStars(1);
  if (input.pressed.start || input.pressed.jump || input.pressed.fire) {
    initAudio();
    playSfx('menu');
    startFade(() => {
      stopSong();
      setScene('bossPresent');
      makeStars();
      playSong(bossIntroSong);
    });
  }
}

function drawTitle(ctx) {
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  drawStars(ctx, 0, screenHeight);
  ctx.fillStyle = nesPalette[0x02];
  ctx.fillRect(0, 28, screenWidth, 60);
  ctx.fillStyle = nesPalette[0x11];
  ctx.fillRect(0, 28, screenWidth, 2);
  ctx.fillRect(0, 86, screenWidth, 2);
  drawTextCentered(ctx, 'MEGA MAN', screenWidth / 2 + 2, 38, nesPalette[0x0F], 3);
  drawTextCentered(ctx, 'MEGA MAN', screenWidth / 2, 36, nesPalette[0x2C], 3);
  drawTextCentered(ctx, 'NES REMAKE', screenWidth / 2, 68, nesPalette[0x30]);
  const pose = Math.floor(game.timer / 6) % 40 === 0 ? 'megaBlink' : 'megaStand';
  drawSpriteScaled(ctx, pose, screenWidth / 2, 140, false, 'mega', 2);
  if (Math.floor(game.timer / 20) % 2 === 0) drawTextCentered(ctx, 'PRESS START', screenWidth / 2, 152, nesPalette[0x30]);
  drawText(ctx, 'SETAS   MOVER', 48, 170, nesPalette[0x10]);
  drawText(ctx, 'X       PULAR', 48, 180, nesPalette[0x10]);
  drawText(ctx, 'Z       ATIRAR', 48, 190, nesPalette[0x10]);
  drawText(ctx, 'SEGURE Z CARREGAR', 48, 200, nesPalette[0x10]);
  drawText(ctx, 'BAIXO+X DESLIZAR', 48, 210, nesPalette[0x10]);
  drawTextCentered(ctx, 'ENTER PAUSA   M SOM', screenWidth / 2, 222, nesPalette[0x00]);
}

function updateBossPresent() {
  game.timer++;
  updateStars(1);
  const present = game.present || (game.present = { y: -20, vy: 0, landed: false, landTime: 0 });
  if (game.timer === 1) Object.assign(present, { y: -20, vy: 0, landed: false, landTime: 0 });
  if (!present.landed) {
    present.vy = Math.min(present.vy + 0.35, 7);
    present.y += present.vy;
    if (present.y >= 140) {
      present.y = 140;
      present.landed = true;
      present.landTime = game.timer;
    }
  }
  const typed = present.landed ? Math.floor((game.timer - present.landTime - 30) / 6) : -1;
  if (typed >= 0 && typed < 10 && (game.timer - present.landTime - 30) % 6 === 0 && 'TIMBER MAN'[typed] !== ' ') playSfx('blip');
  if (game.timer === 330 || (game.timer > 60 && input.pressed.start)) {
    startFade(() => {
      game.lives = 3;
      startStage(0);
    });
  }
}

function drawBossPresent(ctx) {
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  ctx.fillStyle = nesPalette[0x01];
  ctx.fillRect(0, 88, screenWidth, 64);
  ctx.fillStyle = nesPalette[0x11];
  ctx.fillRect(0, 88, screenWidth, 2);
  ctx.fillRect(0, 150, screenWidth, 2);
  drawStars(ctx, 92, 148);
  const present = game.present;
  if (!present) return;
  let pose = 'timberJump';
  if (present.landed) {
    const since = game.timer - present.landTime;
    pose = since < 16 ? 'timberStand' : since < 40 ? 'timberPose' : Math.floor(since / 12) % 3 === 1 ? 'timberStand' : 'timberPose';
  }
  drawSprite(ctx, pose, screenWidth / 2, present.y, false, 'boss');
  if (present.landed) {
    const count = Math.max(0, Math.min(10, Math.floor((game.timer - present.landTime - 30) / 6) + 1));
    drawText(ctx, 'TIMBER MAN'.slice(0, count), screenWidth / 2 - 40, 172, nesPalette[0x30]);
  }
}

function updateWeaponGet() {
  game.timer++;
  updateStars(-1);
  if (game.timer > 240 && (input.pressed.start || input.pressed.jump)) {
    startFade(() => {
      stopSong();
      setScene('title');
      makeStars();
      playSong(titleSong);
    });
  }
}

function drawWeaponGet(ctx) {
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  drawStars(ctx, 0, screenHeight);
  const flashing = game.timer < 150;
  const palette = flashing ? (Math.floor(game.timer / 6) % 2 ? 'megaTimber' : 'mega') : 'megaTimber';
  drawSprite(ctx, 'megaWeaponGet', 64, 172, false, palette);
  const lineOne = 'YOU GOT';
  const lineTwo = 'TIMBER AXE';
  const typedOne = Math.max(0, Math.min(lineOne.length, Math.floor((game.timer - 40) / 5)));
  const typedTwo = Math.max(0, Math.min(lineTwo.length, Math.floor((game.timer - 90) / 5)));
  drawText(ctx, lineOne.slice(0, typedOne), 120, 92, nesPalette[0x30]);
  drawText(ctx, lineTwo.slice(0, typedTwo), 120, 108, nesPalette[0x30]);
  if (game.timer > 170) drawSprite(ctx, 'axe' + (Math.floor(game.timer / 4) % 4), 176, 140, false, 'boss');
  if (game.timer > 240 && Math.floor(game.timer / 20) % 2 === 0) drawTextCentered(ctx, 'PRESS START', screenWidth / 2, 200, nesPalette[0x30]);
  if (game.timer > 20 && game.timer < 130 && game.timer % 5 === 0) playSfx('blip');
}

function updateGameOver() {
  game.timer++;
  if (game.timer > 60 && (input.pressed.start || input.pressed.jump)) {
    startFade(() => {
      stopSong();
      game.lives = 3;
      startStage(stage.checkpointIndex);
    });
  }
}

function drawGameOver(ctx) {
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  drawTextCentered(ctx, 'GAME OVER', screenWidth / 2, 96, nesPalette[0x30]);
  if (game.timer > 60 && Math.floor(game.timer / 20) % 2 === 0) drawTextCentered(ctx, 'PRESS START', screenWidth / 2, 136, nesPalette[0x2C]);
  drawTextCentered(ctx, 'CONTINUE', screenWidth / 2, 120, nesPalette[0x10]);
}

function updateGame() {
  if (game.fade && game.fade.dir > 0) {
    updateFade();
    return;
  }
  switch (game.scene) {
    case 'title':
      updateTitle();
      break;
    case 'bossPresent':
      updateBossPresent();
      break;
    case 'stage':
      updateStage();
      break;
    case 'weaponGet':
      updateWeaponGet();
      break;
    case 'gameOver':
      updateGameOver();
      break;
  }
  updateFade();
}

function drawGame(ctx) {
  switch (game.scene) {
    case 'title':
      drawTitle(ctx);
      break;
    case 'bossPresent':
      drawBossPresent(ctx);
      break;
    case 'stage':
      drawStage(ctx);
      break;
    case 'weaponGet':
      drawWeaponGet(ctx);
      break;
    case 'gameOver':
      drawGameOver(ctx);
      break;
  }
  if (game.fadeLevel > 0) {
    ctx.fillStyle = 'rgba(0,0,0,' + game.fadeLevel * 0.25 + ')';
    ctx.fillRect(0, 0, screenWidth, screenHeight);
  }
}
