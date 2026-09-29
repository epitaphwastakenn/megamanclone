// VARIABLES

const tileSize = 16;
const screenWidth = 256;
const screenHeight = 240;
const levelTiles = [];
const levelSpawns = [];
const levelItems = [];
const levelPlatforms = [];
const stageDefs = {};
let levelCols = 0;
let levelRows = 0;
let rooms = [];
let checkpoints = [];
let currentStage = null;

// FUNCTIONS

function paintRoom(roomId) {
  const room = rooms.find(entry => entry.id === roomId);
  return {
    room,
    fill(col, row, width, height, ch) {
      for (let y = row; y < row + height; y++) {
        for (let x = col; x < col + width; x++) levelTiles[room.row + y][room.col + x] = ch;
      }
    },
    back(col, row, width, height, ch) {
      for (let y = row; y < row + height; y++) {
        for (let x = col; x < col + width; x++) {
          if (levelTiles[room.row + y][room.col + x] === '.') levelTiles[room.row + y][room.col + x] = ch;
        }
      }
    },
    ladder(col, rowTop, rowBottom) {
      for (let y = rowTop; y <= rowBottom; y++) levelTiles[room.row + y][room.col + col] = 'H';
    },
    spawn(type, col, row, extra) {
      levelSpawns.push({ type, room: roomId, x: (room.col + col) * tileSize + 8, y: (room.row + row) * tileSize, ...(extra || {}) });
    },
    item(type, col, row) {
      levelItems.push({ type, room: roomId, x: (room.col + col) * tileSize + 8, y: (room.row + row) * tileSize, id: levelItems.length });
    },
    platform(type, col, row, extra) {
      levelPlatforms.push({ type, room: roomId, x: (room.col + col) * tileSize + 8, y: (room.row + row) * tileSize, ...(extra || {}) });
    },
  };
}

function loadStage(id) {
  const def = stageDefs[id];
  currentStage = def;
  levelCols = def.cols;
  levelRows = def.rows;
  rooms = def.rooms;
  checkpoints = def.checkpoints;
  setStageTileTypes(def.tileTypes);
  levelTiles.length = 0;
  for (let row = 0; row < levelRows; row++) levelTiles.push(new Array(levelCols).fill('.'));
  levelSpawns.length = 0;
  levelItems.length = 0;
  levelPlatforms.length = 0;
  brokenTiles.length = 0;
  for (const key in doors) delete doors[key];
  collectedItems.clear();
  def.build();
}
