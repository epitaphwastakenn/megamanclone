// VARIABLES

const spriteDefs = {};
const spriteCache = new Map();

// FUNCTIONS

function defineSprite(name, rows, ox, oy) {
  const width = Math.max(...rows.map(row => row.length));
  const height = rows.length;
  spriteDefs[name] = {
    rows,
    width,
    height,
    ox: ox === undefined ? Math.floor(width / 2) : ox,
    oy: oy === undefined ? height : oy,
  };
}

function defineSprites(group) {
  for (const name in group) {
    const def = group[name];
    defineSprite(name, def.rows, def.ox, def.oy);
  }
}

function buildSpriteCanvas(def, paletteName, flip) {
  const canvas = document.createElement('canvas');
  canvas.width = def.width;
  canvas.height = def.height;
  const ctx = canvas.getContext('2d');
  for (let y = 0; y < def.height; y++) {
    const row = def.rows[y];
    for (let x = 0; x < row.length; x++) {
      const letter = row[x];
      if (letter === '.' || letter === ' ') continue;
      const color = paletteColor(letter, paletteName);
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(flip ? def.width - 1 - x : x, y, 1, 1);
    }
  }
  return canvas;
}

function getSpriteCanvas(name, paletteName, flip) {
  const key = name + '|' + paletteName + '|' + (flip ? 1 : 0);
  let canvas = spriteCache.get(key);
  if (!canvas) {
    const def = spriteDefs[name];
    if (!def) throw new Error('Unknown sprite ' + name);
    canvas = buildSpriteCanvas(def, paletteName, flip);
    spriteCache.set(key, canvas);
  }
  return canvas;
}

function drawSprite(ctx, name, x, y, flip, paletteName) {
  const def = spriteDefs[name];
  const canvas = getSpriteCanvas(name, paletteName || 'mega', flip);
  const drawX = flip ? x - (def.width - def.ox) : x - def.ox;
  ctx.drawImage(canvas, Math.round(drawX), Math.round(y - def.oy));
}
