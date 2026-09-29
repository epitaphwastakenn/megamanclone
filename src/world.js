// VARIABLES

const doors = {};
const camera = { x: 0, y: 0 };
const solidTiles = '#=MI^';

// FUNCTIONS

function tileAt(col, row) {
  if (row < 0 || row >= levelRows || col < 0 || col >= levelCols) return '.';
  return levelTiles[row][col];
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
  const ch = tileAt(col, row);
  if (solidTiles.includes(ch)) return true;
  if (ch === 'D') return getDoor(col).openAmount < 64;
  return false;
}

function isIceTile(col, row) {
  return tileAt(col, row) === 'I';
}

function isSpikeTile(col, row) {
  return tileAt(col, row) === '^';
}

function standingOnIce(body) {
  const row = Math.floor((body.y + 0.5) / tileSize);
  const colStart = Math.floor((body.x - body.w / 2) / tileSize);
  const colEnd = Math.floor((body.x + body.w / 2 - 0.01) / tileSize);
  let ice = false;
  for (let col = colStart; col <= colEnd; col++) {
    if (isIceTile(col, row)) ice = true;
    else if (isSolidTile(col, row)) return false;
  }
  return ice;
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

function isLadderTile(col, row) {
  return tileAt(col, row) === 'H';
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
        const tileTop = row * tileSize;
        const solid = isSolidTile(col, row);
        const ladderTop = !(options && options.ignoreLadders) && isLadderTopTile(col, row) && previousBottom <= tileTop + 0.01;
        if (solid || ladderTop) {
          body.y = tileTop;
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
    if (isSolidTile(col, row) || isLadderTopTile(col, row)) return true;
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

function drawTiles(ctx) {
  const theme = currentStage;
  const colStart = Math.floor(camera.x / tileSize);
  const colEnd = Math.floor((camera.x + screenWidth - 1) / tileSize);
  const rowStart = Math.floor(camera.y / tileSize);
  const rowEnd = Math.floor((camera.y + screenHeight - 1) / tileSize);
  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) {
      const ch = tileAt(col, row);
      if (ch === '.') continue;
      const screenX = col * tileSize - camera.x;
      const screenY = row * tileSize - camera.y;
      if (ch === 'D') {
        drawDoorTile(ctx, col, row, screenX, screenY);
        continue;
      }
      let name = theme.tiles[ch];
      if (theme.groundTop[ch] && !isSolidTile(col, row - 1) && tileAt(col, row - 1) !== 'H') name = theme.groundTop[ch];
      if (name) drawSprite(ctx, name, screenX, screenY, false, theme.tilePalette);
    }
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
