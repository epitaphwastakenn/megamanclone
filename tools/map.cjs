const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

// VARIABLES

const stageId = process.argv[2];
const outFile = process.argv[3] || stageId + '-map.png';
const roomFilter = process.argv[4] ? process.argv[4].split(',') : null;
const root = path.resolve(__dirname, '..');

// FUNCTIONS

async function renderMap() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('file://' + path.join(root, 'index.html'));
  const dataUrl = await page.evaluate(([id, filter]) => {
    loadStage(id);
    const width = levelCols * tileSize;
    const height = levelRows * tileSize;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, width, height);
    for (const room of rooms) {
      ctx.fillStyle = nesPalette[currentStage.sky];
      ctx.fillRect(room.col * tileSize, room.row * tileSize, room.cols * tileSize, room.rows * tileSize);
    }
    camera.x = 0;
    camera.y = 0;
    for (let row = 0; row < levelRows; row++) {
      for (let col = 0; col < levelCols; col++) drawTileAt(ctx, col, row, col * tileSize, row * tileSize);
    }
    ctx.lineWidth = 1;
    for (const room of rooms) {
      ctx.strokeStyle = room.boss ? '#ff4040' : '#ffff00';
      ctx.strokeRect(room.col * tileSize + 0.5, room.row * tileSize + 0.5, room.cols * tileSize - 1, room.rows * tileSize - 1);
      ctx.fillStyle = '#ffff00';
      ctx.font = '10px monospace';
      ctx.fillText(room.id, room.col * tileSize + 3, room.row * tileSize + 11);
    }
    ctx.font = '8px monospace';
    for (const spawn of levelSpawns) {
      ctx.fillStyle = 'rgba(255,0,0,0.55)';
      ctx.fillRect(spawn.x - 6, spawn.y - 12, 12, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(spawn.type, spawn.x - 10, spawn.y - 14);
    }
    for (const spawn of levelPlatforms) {
      ctx.strokeStyle = '#00ffff';
      ctx.strokeRect(spawn.x - 8 + 0.5, spawn.y + 0.5, 16, 6);
      ctx.fillStyle = '#00ffff';
      ctx.fillText(spawn.type, spawn.x - 10, spawn.y + 16);
    }
    for (const item of levelItems) {
      ctx.fillStyle = 'rgba(0,255,0,0.7)';
      ctx.fillRect(item.x - 4, item.y - 8, 8, 8);
      ctx.fillStyle = '#80ff80';
      ctx.fillText(item.type, item.x - 10, item.y + 8);
    }
    checkpoints.forEach((checkpoint, index) => {
      ctx.fillStyle = '#ff80ff';
      ctx.fillRect(checkpoint.col * tileSize + 4, checkpoint.row * tileSize - 16, 8, 16);
      ctx.fillText('CP' + index, checkpoint.col * tileSize, checkpoint.row * tileSize - 18);
    });
    if (!filter) return canvas.toDataURL('image/png');
    const chosen = rooms.filter(room => filter.includes(room.id));
    const left = Math.min(...chosen.map(room => room.col)) * tileSize;
    const top = Math.min(...chosen.map(room => room.row)) * tileSize;
    const right = Math.max(...chosen.map(room => room.col + room.cols)) * tileSize;
    const bottom = Math.max(...chosen.map(room => room.row + room.rows)) * tileSize;
    const crop = document.createElement('canvas');
    crop.width = right - left;
    crop.height = bottom - top;
    crop.getContext('2d').drawImage(canvas, -left, -top);
    return crop.toDataURL('image/png');
  }, [stageId, roomFilter]);
  fs.writeFileSync(outFile, Buffer.from(dataUrl.split(',')[1], 'base64'));
  if (errors.length) console.log('page errors:', errors);
  console.log('wrote', outFile);
  await browser.close();
}

// INITIALIZATION

renderMap();
