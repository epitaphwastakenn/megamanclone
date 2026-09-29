// FUNCTIONS

function drawEnergyBar(ctx, x, y, value, max, colors) {
  const [outer, inner] = colors || [0x38, 0x30];
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(x, y, 8, max * 2);
  for (let i = 0; i < value; i++) {
    const row = y + max * 2 - 2 - i * 2;
    ctx.fillStyle = nesPalette[outer];
    ctx.fillRect(x + 1, row, 6, 1);
    ctx.fillStyle = nesPalette[inner];
    ctx.fillRect(x + 2, row, 4, 1);
  }
}

function drawEnergyBarWide(ctx, x, y, value, max, colors) {
  const [outer, inner] = colors || [0x38, 0x30];
  for (let i = 0; i < max; i++) {
    const column = x + i * 3;
    if (i < value) {
      ctx.fillStyle = nesPalette[outer];
      ctx.fillRect(column, y, 2, 7);
      ctx.fillStyle = nesPalette[inner];
      ctx.fillRect(column, y + 1, 2, 5);
    } else {
      ctx.fillStyle = nesPalette[0x2D];
      ctx.fillRect(column, y + 3, 2, 1);
    }
  }
}

function drawHud(ctx) {
  if (player.weapon !== 'buster') drawEnergyBar(ctx, 16, 17, game.weaponEnergy[player.weapon], weaponMaxEnergy, weaponDefs[player.weapon].barColors);
  drawEnergyBar(ctx, 24, 17, player.health, playerStats.maxHealth);
  if (boss.active && (boss.health > 0 || boss.state === 'fight')) drawEnergyBar(ctx, 40, 17, boss.health, bossMaxHealth);
}

function drawPanel(ctx, x, y, width, height) {
  ctx.fillStyle = nesPalette[0x0F];
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = nesPalette[0x30];
  ctx.fillRect(x + 2, y + 2, width - 4, 1);
  ctx.fillRect(x + 2, y + height - 3, width - 4, 1);
  ctx.fillRect(x + 2, y + 2, 1, height - 4);
  ctx.fillRect(x + width - 3, y + 2, 1, height - 4);
}

function drawSpriteScaled(ctx, name, x, y, flip, paletteName, scale) {
  const def = spriteDefs[name];
  const canvas = getSpriteCanvas(name, paletteName, flip);
  const ox = flip ? def.width - def.ox : def.ox;
  ctx.drawImage(canvas, Math.round(x - ox * scale), Math.round(y - def.oy * scale), def.width * scale, def.height * scale);
}
