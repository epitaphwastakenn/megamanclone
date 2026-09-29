// VARIABLES

const platforms = [];
const platformTypes = {};

// FUNCTIONS

function createPlatform(spawn) {
  const type = platformTypes[spawn.type];
  if (!type) throw new Error('Unknown platform ' + spawn.type);
  const platform = {
    type: spawn.type,
    spawn,
    room: spawn.room,
    x: spawn.x,
    y: spawn.y,
    prevY: spawn.y,
    w: type.w || 32,
    h: type.h || 8,
    vx: 0,
    vy: 0,
    timer: 0,
    alive: true,
    carrying: false,
  };
  if (type.init) type.init(platform, spawn);
  platforms.push(platform);
  return platform;
}

function spawnRoomPlatforms(roomId) {
  for (const spawn of levelPlatforms) {
    if (spawn.room !== roomId) continue;
    if (platforms.some(platform => platform.spawn === spawn)) continue;
    createPlatform(spawn);
  }
}

function keepRoomPlatforms(roomId) {
  for (let i = platforms.length - 1; i >= 0; i--) {
    if (platforms[i].spawn && platforms[i].room !== roomId) platforms.splice(i, 1);
  }
  if (player.platform && !platforms.includes(player.platform)) player.platform = null;
}

function clearPlatforms() {
  platforms.length = 0;
  player.platform = null;
}

function platformBox(platform) {
  return { left: platform.x - platform.w / 2, top: platform.y, right: platform.x + platform.w / 2, bottom: platform.y + platform.h };
}

function platformLanding(body, previousBottom) {
  for (const platform of platforms) {
    if (!platform.alive || platform.solid === false) continue;
    const box = platformBox(platform);
    if (body.x + body.w / 2 <= box.left || body.x - body.w / 2 >= box.right) continue;
    const top = Math.max(platform.y, platform.prevY);
    if (previousBottom <= top + 0.01 && body.y >= platform.y) return platform;
  }
  return null;
}

function carryPlayer(platform, dx, dy) {
  if (player.platform !== platform || !player.onGround || player.climbing || player.dead || player.teleport) return;
  if (dx) moveBody(player, dx, 0);
  if (dy < 0) {
    const result = moveBody(player, 0, dy);
    if (result.hitCeiling) player.platform = null;
  } else if (dy > 0) {
    const result = moveBody(player, 0, dy);
    if (result.landed) player.platform = null;
  }
}

function updatePlatforms() {
  for (let i = platforms.length - 1; i >= 0; i--) {
    const platform = platforms[i];
    const type = platformTypes[platform.type];
    const oldX = platform.x;
    const oldY = platform.y;
    platform.prevY = platform.y;
    platform.carrying = player.platform === platform && player.onGround;
    platform.timer++;
    if (type.update) type.update(platform);
    carryPlayer(platform, platform.x - oldX, platform.y - oldY);
    if (!platform.alive) {
      if (player.platform === platform) player.platform = null;
      platforms.splice(i, 1);
    }
  }
}

function drawPlatforms(ctx) {
  for (const platform of platforms) {
    const sx = platform.x - camera.x;
    const sy = platform.y - camera.y;
    if (sx < -64 || sx > screenWidth + 64 || sy < -64 || sy > screenHeight + 64) continue;
    const type = platformTypes[platform.type];
    if (type.draw) type.draw(ctx, platform, sx, sy);
    else drawSprite(ctx, type.sprite, sx, sy, false, type.palette || currentStage.tilePalette);
  }
}
