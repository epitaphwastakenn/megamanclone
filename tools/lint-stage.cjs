const path = require('path');
const { chromium } = require('playwright');

// VARIABLES

const root = path.resolve(__dirname, '..');
const stageIds = process.argv.slice(2);

// FUNCTIONS

async function lintStages() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('file://' + path.join(root, 'index.html'));
  const ids = stageIds.length ? stageIds : await page.evaluate(() => Object.keys(stageDefs));
  for (const id of ids) {
    const report = await page.evaluate(stageId => {
      loadStage(stageId);
      const warnings = [];
      const spawnTile = spawn => ({ col: Math.floor(spawn.x / tileSize), row: Math.floor(spawn.y / tileSize) - 1 });
      const roomOf = (col, row) => roomAtPoint(col * tileSize + 8, row * tileSize + 8);
      const ladderEnds = [];
      for (let col = 0; col < levelCols; col++) {
        for (let row = 0; row < levelRows; row++) {
          if (!isLadderTile(col, row)) continue;
          if (!isLadderTile(col, row - 1)) ladderEnds.push({ col, row, end: 'top' });
          if (!isLadderTile(col, row + 1)) ladderEnds.push({ col, row, end: 'bottom' });
        }
      }
      const ladderColumns = [];
      for (let col = 0; col < levelCols; col++) {
        let start = -1;
        for (let row = 0; row <= levelRows; row++) {
          const ladder = row < levelRows && isLadderTile(col, row);
          if (ladder && start < 0) start = row;
          if (!ladder && start >= 0) {
            ladderColumns.push({ col, top: start, bottom: row - 1 });
            start = -1;
          }
        }
      }
      const tunnels = [];
      for (let row = 1; row < levelRows - 1; row++) {
        let start = -1;
        for (let col = 0; col <= levelCols; col++) {
          const tunnel = col < levelCols && !isSolidTile(col, row) && isSolidTile(col, row - 1) && isSolidTile(col, row + 1);
          if (tunnel && start < 0) start = col;
          if (!tunnel && start >= 0) {
            if (col - start >= 2) tunnels.push({ row, from: start, to: col - 1 });
            start = -1;
          }
        }
      }
      const shooters = ['met', 'screw', 'blaster', 'joe', 'picketMan'];
      for (const spawn of levelSpawns) {
        const tile = spawnTile(spawn);
        const type = enemyTypes[spawn.type];
        const flies = !type.update.toString().includes('applyEnemyGravity');
        for (const end of ladderEnds) {
          if (roomOf(end.col, end.row) !== roomOf(tile.col, tile.row)) continue;
          const dx = Math.abs(end.col - tile.col);
          const dy = Math.abs(end.row - tile.row);
          if (dx <= 5 && dy <= 4) warnings.push(`${spawn.type} at room ${spawn.room} (${tile.col - roomOf(tile.col, tile.row).col},${tile.row - roomOf(tile.col, tile.row).row}) is ${dx} cols / ${dy} rows from a ladder ${end.end}`);
        }
        if (shooters.includes(spawn.type)) {
          for (const ladder of ladderColumns) {
            const room = roomOf(ladder.col, ladder.bottom);
            if (room !== roomOf(tile.col, tile.row)) continue;
            const dx = Math.abs(ladder.col - tile.col);
            if (dx <= 7 && tile.row >= ladder.top - 3 && tile.row <= ladder.bottom + 3) warnings.push(`shooter ${spawn.type} at room ${spawn.room} has a line of fire on the ladder at col ${ladder.col - room.col} (dx ${dx})`);
          }
        }
        for (const tunnel of tunnels) {
          if (Math.abs(tile.row - tunnel.row) > 3) continue;
          const near = tile.col >= tunnel.from - 6 && tile.col <= tunnel.to + 6;
          if (near && (flies || shooters.includes(spawn.type) || (tile.col >= tunnel.from && tile.col <= tunnel.to))) {
            const room = roomOf(tunnel.from, tunnel.row);
            warnings.push(`${spawn.type} at room ${spawn.room} is next to a low passage in room ${room && room.id} cols ${tunnel.from - room.col}-${tunnel.to - room.col}`);
          }
        }
      }
      for (const room of rooms) {
        const bottomRow = room.row + room.rows - 1;
        for (let col = room.col; col < room.col + room.cols; col++) {
          if (isSolidTile(col, bottomRow) || isLadderTile(col, bottomRow)) continue;
          const other = roomAtPoint(col * tileSize + 8, (bottomRow + 1) * tileSize + 8);
          if (!other) continue;
          let landing = bottomRow + 1;
          while (landing < levelRows && !isSolidTile(col, landing) && !isLadderTile(col, landing) && !isOneWayTile(col, landing)) {
            if (tileTypeAt(col, landing) === 'hazard' || !roomAtPoint(col * tileSize + 8, landing * tileSize + 8)) break;
            landing++;
          }
          const target = roomAtPoint(col * tileSize + 8, landing * tileSize + 8);
          if (landing >= levelRows || !target) warnings.push(`falling from ${room.id} at col ${col - room.col} never lands`);
          else if (isSpikeTile(col, landing) || tileTypeAt(col, landing) === 'hazard') warnings.push(`falling from ${room.id} at col ${col - room.col} lands on a hazard in ${target.id}`);
        }
      }
      for (const room of rooms) {
        const spawnsInRoom = levelSpawns.filter(spawn => spawn.room === room.id);
        for (const checkpoint of checkpoints.filter(entry => entry.room === room.id)) {
          for (const spawn of spawnsInRoom) {
            const tile = spawnTile(spawn);
            if (Math.abs(tile.col - checkpoint.col) <= 6 && Math.abs(tile.row - checkpoint.row) <= 5) warnings.push(`${spawn.type} within 6 tiles of checkpoint in room ${room.id}`);
          }
        }
      }
      return { stage: stageId, spawns: levelSpawns.length, items: levelItems.length, platforms: levelPlatforms.length, ladders: ladderColumns.length, tunnels: tunnels.length, warnings: [...new Set(warnings)] };
    }, id);
    console.log(`\n== ${report.stage}: ${report.spawns} spawns, ${report.items} items, ${report.platforms} platforms, ${report.ladders} ladders, ${report.tunnels} low passages`);
    for (const warning of report.warnings) console.log('  - ' + warning);
    if (!report.warnings.length) console.log('  no warnings');
  }
  if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
  await browser.close();
}

// INITIALIZATION

lintStages();
