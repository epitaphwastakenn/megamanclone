// VARIABLES

const doors = {};
const camera = { x: 0, y: 0 };
const brokenTiles = [];
const defaultTileTypes = { '#': 'solid', '=': 'solid', M: 'solid', I: 'ice', '^': 'spike', H: 'ladder', D: 'door' };
const solidTileTypes = { solid: true, ice: true, spike: true, breakable: true, slow: true, conveyorLeft: true, conveyorRight: true };
let tileTypes = { ...defaultTileTypes };

// FUNCTIONS

function setStageTileTypes(extra) {
  tileTypes = { ...defaultTileTypes, ...(extra || {}) };
}

function tileAt(col, row) {
  if (row < 0 || row >= levelRows || col < 0 || col >= levelCols) return '.';
  return levelTiles[row][col];
}

function tileTypeAt(col, row) {
  return tileTypes[tileAt(col, row)] || null;
}

function doorKey(col) {
  return 'door' + col;
}

function getDoor(col) {
  const key = doorKey(col);
  if (!doors[key]) doors[key] = { col, openAmount: 0 };
  return doors[key];
}

function isSolidTile(col, row) {
  const type = tileTypeAt(col, row);
  if (!type) return false;
  if (solidTileTypes[type]) return true;
  if (type === 'door') return getDoor(col).openAmount < 64;
  return false;
}

function isIceTile(col, row) {
  return tileTypeAt(col, row) === 'ice';
}

function isSpikeTile(col, row) {
  return tileTypeAt(col, row) === 'spike';
}

function isOneWayTile(col, row) {
  return tileTypeAt(col, row) === 'oneWay';
}

function isWaterTile(col, row) {
  return tileTypeAt(col, row) === 'water';
}

function isWaterAt(x, y) {
  return isWaterTile(Math.floor(x / tileSize), Math.floor(y / tileSize));
}

function feetColumns(body) {
  return {
    row: Math.floor((body.y + 0.5) / tileSize),
    colStart: Math.floor((body.x - body.w / 2) / tileSize),
    colEnd: Math.floor((body.x + body.w / 2 - 0.01) / tileSize),
  };
}

function standingOnType(body, wanted) {
  const { row, colStart, colEnd } = feetColumns(body);
  let found = false;
  for (let col = colStart; col <= colEnd; col++) {
    const type = tileTypeAt(col, row);
    if (type === wanted) found = true;
    else if (isSolidTile(col, row)) return false;
  }
  return found;
}

function standingOnIce(body) {
  return standingOnType(body, 'ice');
}

function standingOnSlow(body) {
  return standingOnType(body, 'slow');
}

function conveyorUnder(body) {
  if (standingOnType(body, 'conveyorLeft')) return -1;
  if (standingOnType(body, 'conveyorRight')) return 1;
  return 0;
}

function bodyTouchesType(body, wanted, margin) {
  const extra = margin || 0;
  const colStart = Math.floor((body.x - body.w / 2 - extra) / tileSize);
  const colEnd = Math.floor((body.x + body.w / 2 + extra - 0.01) / tileSize);
  const rowStart = Math.floor((body.y - body.h) / tileSize);
  const rowEnd = Math.floor((body.y + extra - 0.01) / tileSize);
  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) if (tileTypeAt(col, row) === wanted) return true;
  }
  return false;
}

function touchingSpikes(body) {
  const colStart = Math.floor((body.x - body.w / 2 - 1) / tileSize);
  const colEnd = Math.floor((body.x + body.w / 2) / tileSize);
  const rowStart = Math.floor((body.y - body.h) / tileSize);
  const rowEnd = Math.floor((body.y + 1) / tileSize);
  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) if (isSpikeTile(col, row)) return true;
  }
  return false;
}

function touchingHazard(body) {
  return bodyTouchesType(body, 'hazard', 0);
}

function isLadderTile(col, row) {
  return tileTypeAt(col, row) === 'ladder';
}

function isLadderTopTile(col, row) {
  return isLadderTile(col, row) && !isLadderTile(col, row - 1);
}

function solidAt(x, y) {
  return isSolidTile(Math.floor(x / tileSize), Math.floor(y / tileSize));
}

function ladderAt(x, y) {
  return isLadderTile(Math.floor(x / tileSize), Math.floor(y / tileSize));
}

function breakTile(col, row) {
  if (tileTypeAt(col, row) !== 'breakable') return false;
  brokenTiles.push({ col, row, ch: levelTiles[row][col] });
  levelTiles[row][col] = currentStage.brokenTile || '.';
  spawnEffect('explode', col * tileSize + 8, row * tileSize + 8);
  playSfx('thud');
  return true;
}

function breakTilesInBox(box) {
  let broken = false;
  const colStart = Math.floor(box.left / tileSize);
  const colEnd = Math.floor((box.right - 0.01) / tileSize);
  const rowStart = Math.floor(box.top / tileSize);
  const rowEnd = Math.floor((box.bottom - 0.01) / tileSize);
  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) if (breakTile(col, row)) broken = true;
  }
  return broken;
}

function restoreBrokenTiles() {
  for (const tile of brokenTiles) levelTiles[tile.row][tile.col] = tile.ch;
  brokenTiles.length = 0;
}

function roomAtPoint(x, y) {
  const col = Math.floor(x / tileSize);
  const row = Math.floor(y / tileSize);
  return rooms.find(room => col >= room.col && col < room.col + room.cols && row >= room.row && row < room.row + room.rows) || null;
}

function roomBounds(room) {
  return {
    left: room.col * tileSize,
    top: room.row * tileSize,
    right: (room.col + room.cols) * tileSize,
    bottom: (room.row + room.rows) * tileSize,
  };
}

function cameraTargetFor(room, focusX) {
  const bounds = roomBounds(room);
  const x = Math.max(bounds.left, Math.min(bounds.right - screenWidth, Math.round(focusX - screenWidth / 2)));
  return { x, y: bounds.top };
}

function landsOnTopTile(col, row, previousBottom, options) {
  if (options && options.ignoreLadders) return false;
  if (!isLadderTopTile(col, row) && !isOneWayTile(col, row)) return false;
  return previousBottom <= row * tileSize + 0.01;
}

function moveBody(body, dx, dy, options) {
  const result = { hitWall: false, hitCeiling: false, landed: false };
  const halfWidth = body.w / 2;

  if (dx !== 0) {
    body.x += dx;
    const top = body.y - body.h;
    const bottom = body.y - 0.01;
    const rowStart = Math.floor(top / tileSize);
    const rowEnd = Math.floor(bottom / tileSize);
    if (dx > 0) {
      const col = Math.floor((body.x + halfWidth - 0.01) / tileSize);
      for (let row = rowStart; row <= rowEnd; row++) {
        if (isSolidTile(col, row)) {
          body.x = col * tileSize - halfWidth;
          result.hitWall = true;
          break;
        }
      }
    } else {
      const col = Math.floor((body.x - halfWidth) / tileSize);
      for (let row = rowStart; row <= rowEnd; row++) {
        if (isSolidTile(col, row)) {
          body.x = (col + 1) * tileSize + halfWidth;
          result.hitWall = true;
          break;
        }
      }
    }
  }

  if (dy !== 0) {
    const previousBottom = body.y;
    body.y += dy;
    const colStart = Math.floor((body.x - halfWidth) / tileSize);
    const colEnd = Math.floor((body.x + halfWidth - 0.01) / tileSize);
    if (dy > 0) {
      const row = Math.floor((body.y - 0.01) / tileSize);
      for (let col = colStart; col <= colEnd; col++) {
        if (isSolidTile(col, row) || landsOnTopTile(col, row, previousBottom, options)) {
          body.y = row * tileSize;
          result.landed = true;
          break;
        }
      }
    } else {
      const row = Math.floor((body.y - body.h) / tileSize);
      for (let col = colStart; col <= colEnd; col++) {
        if (isSolidTile(col, row)) {
          body.y = (row + 1) * tileSize + body.h;
          result.hitCeiling = true;
          break;
        }
      }
    }
  }
  return result;
}

function isStandingOn(body) {
  const halfWidth = body.w / 2;
  const row = Math.floor((body.y + 0.5) / tileSize);
  if (Math.abs(body.y - row * tileSize) > 0.02) return false;
  const colStart = Math.floor((body.x - halfWidth) / tileSize);
  const colEnd = Math.floor((body.x + halfWidth - 0.01) / tileSize);
  for (let col = colStart; col <= colEnd; col++) {
    if (isSolidTile(col, row) || isLadderTopTile(col, row) || isOneWayTile(col, row)) return true;
  }
  return false;
}

function boxBlockedAbove(x, y, w, h) {
  const top = y - h;
  const colStart = Math.floor((x - w / 2) / tileSize);
  const colEnd = Math.floor((x + w / 2 - 0.01) / tileSize);
  const rowStart = Math.floor(top / tileSize);
  const rowEnd = Math.floor((y - 0.01) / tileSize);
  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) if (isSolidTile(col, row)) return true;
  }
  return false;
}

function tileSpriteName(col, row) {
  const theme = currentStage;
  const ch = tileAt(col, row);
  const frames = theme.tileFrames && theme.tileFrames[ch];
  if (frames) return frames.names[Math.floor((game.timer + col * (frames.stagger || 0)) / frames.rate) % frames.names.length];
  if (theme.groundTop[ch] && !isSolidTile(col, row - 1) && tileAt(col, row - 1) !== 'H' && !isOneWayTile(col, row - 1)) return theme.groundTop[ch];
  return theme.tiles[ch];
}

function drawTileAt(ctx, col, row, screenX, screenY) {
  const ch = tileAt(col, row);
  if (ch === '.') return;
  if (ch === 'D') {
    drawDoorTile(ctx, col, row, screenX, screenY);
    return;
  }
  const name = tileSpriteName(col, row);
  if (!name) return;
  const palette = (currentStage.tilePalettes && currentStage.tilePalettes[ch]) || currentStage.tilePalette;
  drawSprite(ctx, name, screenX, screenY, false, palette);
}

function drawTiles(ctx) {
  const colStart = Math.floor(camera.x / tileSize);
  const colEnd = Math.floor((camera.x + screenWidth - 1) / tileSize);
  const rowStart = Math.floor(camera.y / tileSize);
  const rowEnd = Math.floor((camera.y + screenHeight - 1) / tileSize);
  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) drawTileAt(ctx, col, row, col * tileSize - camera.x, row * tileSize - camera.y);
  }
}

function drawRoomSkies(ctx) {
  const view = { left: camera.x, top: camera.y, right: camera.x + screenWidth, bottom: camera.y + screenHeight };
  for (const room of rooms) {
    const bounds = roomBounds(room);
    if (bounds.right <= view.left || bounds.left >= view.right || bounds.bottom <= view.top || bounds.top >= view.bottom) continue;
    ctx.fillStyle = nesPalette[room.sky !== undefined ? room.sky : currentStage.sky];
    ctx.fillRect(bounds.left - camera.x, bounds.top - camera.y, bounds.right - bounds.left, bounds.bottom - bounds.top);
  }
}

function drawDoorTile(ctx, col, row, screenX, screenY) {
  const door = getDoor(col);
  let topRow = row;
  while (tileAt(col, topRow - 1) === 'D') topRow--;
  const doorTop = topRow * tileSize;
  const visibleBottom = doorTop + 64 - door.openAmount;
  const tileTop = row * tileSize;
  const visible = Math.max(0, Math.min(tileSize, visibleBottom - tileTop));
  if (visible <= 0) return;
  const canvas = getSpriteCanvas('tileDoor', 'enemy', false);
  ctx.drawImage(canvas, 0, 0, tileSize, visible, screenX, screenY, tileSize, visible);
}
