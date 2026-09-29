// VARIABLES

const game = {
  scene: 'title',
  timer: 0,
  lives: 3,
  fade: null,
  fadeLevel: 0,
  stars: [],
  snow: [],
  defeated: new Set(),
  weaponEnergy: { timber: 28, pine: 28 },
  cursor: { col: 0, row: 1 },
  selectTimer: 0,
  bossId: null,
  weaponId: null,
  choice: 0,
  present: null,
};

const stage = {
  state: 'ready',
  timer: 0,
  room: null,
  checkpointIndex: 0,
  fills: [],
  fillTimer: 0,
  transition: null,
  doorSequence: null,
  bossPhase: null,
  bossDefeated: false,
  pauseReturn: null,
  pauseCursor: 0,
  snowCameraX: 0,
};

const selectSlots = [
  { col: 0, row: 1, boss: 'timber' },
  { col: 2, row: 1, boss: 'pine' },
];

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

function makeSnow() {
  game.snow = [];
  for (let i = 0; i < 48; i++) {
    game.snow.push({ x: Math.random() * screenWidth, y: Math.random() * screenHeight, speed: 0.35 + Math.random() * 0.8, drift: Math.random() * Math.PI * 2, size: Math.random() < 0.3 ? 2 : 1 });
  }
  stage.snowCameraX = camera.x;
}

function updateSnow() {
  const scroll = (camera.x - stage.snowCameraX) * 0.5;
  stage.snowCameraX = camera.x;
  for (const flake of game.snow) {
    flake.y += flake.speed;
    flake.x += Math.sin(flake.drift + flake.y / 24) * 0.3 - scroll;
    if (flake.y >= screenHeight) {
      flake.y -= screenHeight;
      flake.x = Math.random() * screenWidth;
    }
    if (flake.x < 0) flake.x += screenWidth;
    if (flake.x >= screenWidth) flake.x -= screenWidth;
  }
}

function drawSnow(ctx) {
  for (const flake of game.snow) {
    ctx.fillStyle = flake.size > 1 ? nesPalette[0x30] : nesPalette[0x31];
    ctx.fillRect(Math.floor(flake.x), Math.floor(flake.y), flake.size, flake.size);
  }
}

function currentRoomBounds() {
  return roomBounds(stage.room);
}

function enterStage(id) {
  loadStage(id);
  refillWeapons();
  startStage(0);
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
  stage.fills = [];
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
  if (currentStage.snow) makeSnow();
  stage.state = 'ready';
  stage.timer = 0;
  playSong(currentStage.song);
}

function queueFill(target, amount) {
  const full = target === 'health' ? player.health >= playerStats.maxHealth : game.weaponEnergy[target] >= weaponMaxEnergy;
  if (!full) stage.fills.push({ target, amount });
}

function updateStage() {
  stageEvents.playerFired = false;
  if (currentStage.snow) updateSnow();
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
      updatePause();
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

function openPause() {
  stage.pauseReturn = 'play';
  stage.state = 'paused';
  stage.pauseCursor = Math.max(0, ownedWeapons().indexOf(player.weapon));
  playSfx('pause');
  stopChargeSound();
  player.charge = 0;
}

function updatePause() {
  const owned = ownedWeapons();
  if (input.pressed.up || input.pressed.down) {
    const step = input.pressed.up ? -1 : 1;
    stage.pauseCursor = (stage.pauseCursor + step + owned.length) % owned.length;
    playSfx('blip');
  }
  if (input.pressed.start) {
    selectWeapon(owned[stage.pauseCursor]);
    stage.state = stage.pauseReturn || 'play';
    playSfx('pause');
  }
}

function updatePlay() {
  if (input.pressed.start && player.control) {
    openPause();
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
  if (stage.fills.length > 0) {
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
      spawnBoss(currentStage.boss, bounds.left + 12 * tileSize, bounds.top + 40);
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
    if (intro.timer % 3 === 0 && boss.health < bossMaxHealth) {
      boss.health++;
      playSfx('bossFill');
    }
    if (boss.health >= bossMaxHealth && intro.timer > 90) {
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
  const fill = stage.fills[0];
  if (!fill) {
    stage.state = 'play';
    return;
  }
  const health = fill.target === 'health';
  const full = health ? player.health >= playerStats.maxHealth : game.weaponEnergy[fill.target] >= weaponMaxEnergy;
  if (fill.amount > 0 && !full) {
    if (health) player.health++;
    else game.weaponEnergy[fill.target]++;
    fill.amount--;
    playSfx('tick');
    return;
  }
  stage.fills.shift();
  if (!stage.fills.length) stage.state = 'play';
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
        game.choice = 0;
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
  game.defeated.add(currentStage.boss);
  game.weaponId = bossDefs[currentStage.boss].weapon;
  game.weaponEnergy[game.weaponId] = weaponMaxEnergy;
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
  ctx.fillStyle = nesPalette[currentStage.sky];
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  if (currentStage.snow) drawSnow(ctx);
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
  const owned = ownedWeapons();
  const height = 56 + owned.length * 22;
  const top = Math.floor((screenHeight - height) / 2);
  drawPanel(ctx, 40, top, 176, height);
  owned.forEach((id, index) => {
    const def = weaponDefs[id];
    const y = top + 14 + index * 22;
    const selected = index === stage.pauseCursor;
    if (selected && Math.floor(game.timer / 8) % 2 === 0) drawText(ctx, '>', 52, y, nesPalette[0x30]);
    drawText(ctx, def.label, 64, y, selected ? nesPalette[0x30] : nesPalette[0x10]);
    const value = id === 'buster' ? player.health : game.weaponEnergy[id];
    drawEnergyBarWide(ctx, 64, y + 10, value, weaponMaxEnergy, def.barColors);
  });
  const bottom = top + height - 34;
  drawSprite(ctx, 'oneUp', 80, bottom + 16, false, weaponDefs[owned[stage.pauseCursor]].palette);
  drawText(ctx, 'X ' + game.lives, 96, bottom + 5, nesPalette[0x30]);
  drawText(ctx, 'PAUSE', 144, bottom + 5, nesPalette[0x28]);
}

function newGame() {
  game.lives = 3;
  game.defeated.clear();
  refillWeapons();
  game.cursor = { col: 0, row: 1 };
}

function openStageSelect() {
  setScene('stageSelect');
  game.selectTimer = 0;
  const current = slotAt(game.cursor.col, game.cursor.row);
  const next = selectSlots.find(slot => !game.defeated.has(slot.boss));
  if (current && game.defeated.has(current.boss) && next) game.cursor = { col: next.col, row: next.row };
  makeStars();
  playSong(stageSelectSong);
}

function updateTitle() {
  game.timer++;
  updateStars(1);
  if (input.pressed.start || input.pressed.jump || input.pressed.fire) {
    initAudio();
    playSfx('menu');
    startFade(() => {
      stopSong();
      newGame();
      openStageSelect();
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
  if (Math.floor(game.timer / 20) % 2 === 0) drawTextCentered(ctx, 'PRESS START', screenWidth / 2, 150, nesPalette[0x30]);
  drawText(ctx, 'SETAS   MOVER', 48, 164, nesPalette[0x10]);
  drawText(ctx, 'X       PULAR', 48, 174, nesPalette[0x10]);
  drawText(ctx, 'Z       ATIRAR', 48, 184, nesPalette[0x10]);
  drawText(ctx, 'SEGURE Z CARREGAR', 48, 194, nesPalette[0x10]);
  drawText(ctx, 'BAIXO+X DESLIZAR', 48, 204, nesPalette[0x10]);
  drawText(ctx, 'SHIFT   TROCAR ARMA', 48, 214, nesPalette[0x10]);
  drawTextCentered(ctx, 'ENTER PAUSA   M SOM', screenWidth / 2, 226, nesPalette[0x00]);
}

function slotAt(col, row) {
  return selectSlots.find(slot => slot.col === col && slot.row === row) || null;
}

function moveSelectCursor(dx, dy) {
  const cursor = game.cursor;
  cursor.col = (cursor.col + dx + 3) % 3;
  cursor.row = (cursor.row + dy + 3) % 3;
  if (cursor.col === 1 && cursor.row === 1) {
    cursor.col = (cursor.col + dx + 3) % 3;
    cursor.row = (cursor.row + dy + 3) % 3;
  }
  playSfx('blip');
}

function updateStageSelect() {
  game.timer++;
  if (game.selectTimer > 0) {
    game.selectTimer++;
    if (game.selectTimer === 50) {
      startFade(() => {
        stopSong();
        setScene('bossPresent');
        makeStars();
        playSong(bossIntroSong);
      });
    }
    return;
  }
  if (input.pressed.left) moveSelectCursor(-1, 0);
  else if (input.pressed.right) moveSelectCursor(1, 0);
  else if (input.pressed.up) moveSelectCursor(0, -1);
  else if (input.pressed.down) moveSelectCursor(0, 1);
  if (input.pressed.start || input.pressed.jump || input.pressed.fire) {
    const slot = slotAt(game.cursor.col, game.cursor.row);
    if (!slot || game.defeated.has(slot.boss)) {
      playSfx('error');
      return;
    }
    game.bossId = slot.boss;
    game.selectTimer = 1;
    playSfx('select');
  }
}

function drawStageSelect(ctx) {
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  drawStars(ctx, 0, screenHeight);
  drawTextCentered(ctx, 'STAGE SELECT', screenWidth / 2, 8, nesPalette[0x2C]);
  const cursor = game.cursor;
  const flashRate = game.selectTimer > 0 ? 3 : 8;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = 24 + col * 80;
      const y = 24 + row * 64;
      const selected = cursor.col === col && cursor.row === row;
      ctx.fillStyle = nesPalette[0x0F];
      ctx.fillRect(x + 4, y + 4, 40, 40);
      drawSprite(ctx, selected && Math.floor(game.timer / flashRate) % 2 === 0 ? 'selectPanel1' : 'selectPanel0', x, y, false, 'mega');
      if (col === 1 && row === 1) {
        const face = (cursor.row * 3) + cursor.col;
        drawSprite(ctx, 'megaSelect' + face, x + 8, y + 8, false, 'mega');
        continue;
      }
      const slot = slotAt(col, row);
      if (!slot) {
        drawTextCentered(ctx, '?', x + 24, y + 20, nesPalette[0x2D]);
        continue;
      }
      const def = bossDefs[slot.boss];
      if (!game.defeated.has(slot.boss)) drawSprite(ctx, def.portrait, x + 8, y + 8, false, 'boss');
      drawTextCentered(ctx, def.name, x + 24, y + 52, game.defeated.has(slot.boss) ? nesPalette[0x2D] : nesPalette[0x30]);
    }
  }
  if (game.selectTimer === 0 && Math.floor(game.timer / 20) % 2 === 0) drawTextCentered(ctx, 'PUSH START', screenWidth / 2, 222, nesPalette[0x30]);
}

function updateBossPresent() {
  game.timer++;
  updateStars(1);
  const def = bossDefs[game.bossId];
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
  const step = game.timer - present.landTime - 30;
  const typed = present.landed ? Math.floor(step / 6) : -1;
  if (typed >= 0 && typed < def.name.length && step % 6 === 0 && def.name[typed] !== ' ') playSfx('blip');
  if (game.timer === 330 || (game.timer > 60 && input.pressed.start)) {
    startFade(() => enterStage(def.stage));
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
  const def = bossDefs[game.bossId];
  let pose = def.present.fall;
  if (present.landed) {
    const since = game.timer - present.landTime;
    pose = since < 16 ? def.present.land : since < 40 ? def.present.pose : Math.floor(since / 12) % 3 === 1 ? def.present.land : def.present.pose;
  }
  drawSprite(ctx, pose, screenWidth / 2, present.y, false, 'boss');
  if (present.landed) {
    const count = Math.max(0, Math.min(def.name.length, Math.floor((game.timer - present.landTime - 30) / 6) + 1));
    drawText(ctx, def.name.slice(0, count), screenWidth / 2 - def.name.length * 4, 172, nesPalette[0x30]);
  }
}

function updateWeaponGet() {
  game.timer++;
  updateStars(-1);
  if (game.timer > 240 && (input.pressed.start || input.pressed.jump)) {
    startFade(() => {
      stopSong();
      if (selectSlots.every(slot => game.defeated.has(slot.boss))) {
        setScene('ending');
        makeStars();
        playSong(titleSong);
      } else {
        openStageSelect();
      }
    });
  }
}

function drawWeaponGet(ctx) {
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  drawStars(ctx, 0, screenHeight);
  const def = weaponDefs[game.weaponId];
  const flashing = game.timer < 150;
  const palette = flashing ? (Math.floor(game.timer / 6) % 2 ? def.palette : 'mega') : def.palette;
  drawSprite(ctx, 'megaWeaponGet', 64, 172, false, palette);
  const lineOne = 'YOU GOT';
  const lineTwo = def.label;
  const typedOne = Math.max(0, Math.min(lineOne.length, Math.floor((game.timer - 40) / 5)));
  const typedTwo = Math.max(0, Math.min(lineTwo.length, Math.floor((game.timer - 90) / 5)));
  drawText(ctx, lineOne.slice(0, typedOne), 120, 92, nesPalette[0x30]);
  drawText(ctx, lineTwo.slice(0, typedTwo), 120, 108, nesPalette[0x30]);
  if (game.timer > 170) {
    const frame = Math.floor(game.timer / 4) % 4;
    drawSpriteScaled(ctx, (game.weaponId === 'timber' ? 'axeSmall' : 'cone') + frame, 164, 146, false, 'boss', 2);
  }
  if (game.timer > 240 && Math.floor(game.timer / 20) % 2 === 0) drawTextCentered(ctx, 'PRESS START', screenWidth / 2, 200, nesPalette[0x30]);
  if (game.timer > 20 && game.timer < 150 && game.timer % 5 === 0) playSfx('blip');
}

function updateEnding() {
  game.timer++;
  updateStars(1);
  if (game.timer > 240 && (input.pressed.start || input.pressed.jump)) {
    startFade(() => {
      stopSong();
      setScene('title');
      makeStars();
      playSong(titleSong);
    });
  }
}

function drawEnding(ctx) {
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  drawStars(ctx, 0, screenHeight);
  drawTextCentered(ctx, 'CONGRATULATIONS!', screenWidth / 2, 24, nesPalette[0x28]);
  selectSlots.forEach((slot, index) => {
    const x = 40 + index * 128;
    ctx.fillStyle = nesPalette[0x0F];
    ctx.fillRect(x + 4, 44, 40, 40);
    drawSprite(ctx, 'selectPanel0', x, 40, false, 'mega');
    drawSprite(ctx, bossDefs[slot.boss].portrait, x + 8, 48, false, 'boss');
    drawTextCentered(ctx, bossDefs[slot.boss].name, x + 24, 92, nesPalette[0x30]);
  });
  const pose = Math.floor(game.timer / 6) % 40 === 0 ? 'megaBlink' : 'megaStand';
  drawSpriteScaled(ctx, pose, screenWidth / 2, 104, false, 'mega', 2);
  if (game.timer > 60) drawTextCentered(ctx, 'THE ROBOT MASTERS', screenWidth / 2, 124, nesPalette[0x30]);
  if (game.timer > 90) drawTextCentered(ctx, 'HAVE BEEN DEFEATED!', screenWidth / 2, 136, nesPalette[0x30]);
  if (game.timer > 150) drawTextCentered(ctx, 'THANK YOU FOR PLAYING', screenWidth / 2, 168, nesPalette[0x2C]);
  if (game.timer > 240 && Math.floor(game.timer / 20) % 2 === 0) drawTextCentered(ctx, 'PRESS START', screenWidth / 2, 200, nesPalette[0x30]);
}

function updateGameOver() {
  game.timer++;
  if (input.pressed.up || input.pressed.down) {
    game.choice = 1 - game.choice;
    playSfx('blip');
  }
  if (game.timer > 60 && (input.pressed.start || input.pressed.jump)) {
    playSfx('menu');
    startFade(() => {
      stopSong();
      game.lives = 3;
      if (game.choice === 0) startStage(stage.checkpointIndex);
      else openStageSelect();
    });
  }
}

function drawGameOver(ctx) {
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(0, 0, screenWidth, screenHeight);
  drawTextCentered(ctx, 'GAME OVER', screenWidth / 2, 88, nesPalette[0x30]);
  const options = ['CONTINUE', 'STAGE SELECT'];
  options.forEach((label, index) => {
    const y = 120 + index * 16;
    drawText(ctx, label, 88, y, index === game.choice ? nesPalette[0x30] : nesPalette[0x10]);
    if (index === game.choice && game.timer > 60 && Math.floor(game.timer / 10) % 2 === 0) drawText(ctx, '>', 72, y, nesPalette[0x2C]);
  });
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
    case 'stageSelect':
      updateStageSelect();
      break;
    case 'bossPresent':
      updateBossPresent();
      break;
    case 'stage':
      game.timer++;
      updateStage();
      break;
    case 'weaponGet':
      updateWeaponGet();
      break;
    case 'ending':
      updateEnding();
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
    case 'stageSelect':
      drawStageSelect(ctx);
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
    case 'ending':
      drawEnding(ctx);
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
