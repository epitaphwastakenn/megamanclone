// FUNCTIONS

function vultureCanSee(enemy) {
  const dx = Math.abs(player.x - enemy.x);
  return dx < 112 && dx > 20 && player.y > enemy.y - 8 && !player.climbing;
}

function vultureStartSwoop(enemy) {
  const targetX = player.x;
  const targetY = player.y - 10;
  const dx = targetX - enemy.x;
  const dy = Math.max(24, targetY - enemy.y);
  const distance = Math.hypot(dx, dy);
  enemy.state = 'swoop';
  enemy.vx = (dx / distance) * 2.6;
  enemy.vy = (dy / distance) * 2.6;
  enemy.targetY = enemy.y + dy;
  enemy.timer = 80;
  enemy.facing = Math.sign(enemy.vx) || enemy.facing;
  playSfx('jumpBig');
}

function updateVulture(enemy) {
  enemy.anim++;
  enemy.timer--;
  if (enemy.state === 'perch' || enemy.state === 'hover') {
    aimAtPlayer(enemy);
    enemy.h = enemy.state === 'perch' ? 16 : 12;
    if (enemy.state === 'hover') enemy.y = enemy.homeY + Math.sin(enemy.anim / 10) * 3;
    if (enemy.timer <= 0 && vultureCanSee(enemy)) {
      enemy.state = 'alert';
      enemy.timer = 32;
      enemy.lift = enemy.h === 16 ? 1 : 0;
      playSfx('enemyShot');
    }
  } else if (enemy.state === 'alert') {
    aimAtPlayer(enemy);
    enemy.h = 12;
    if (enemy.lift && enemy.timer > 16) enemy.y -= 1;
    if (enemy.timer <= 0) vultureStartSwoop(enemy);
  } else if (enemy.state === 'swoop') {
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;
    if (enemy.y >= enemy.targetY || enemy.timer <= 0 || solidAt(enemy.x, enemy.y + 2)) {
      enemy.state = 'climb';
      enemy.timer = 70;
      enemy.vx = Math.sign(enemy.vx || enemy.facing) * 1.5;
    }
  } else if (enemy.state === 'climb') {
    enemy.x += enemy.vx;
    enemy.y -= 1.3;
    if (enemy.y <= enemy.homeY || enemy.timer <= 0) {
      enemy.state = 'hover';
      enemy.homeY = enemy.y;
      enemy.timer = 100;
    }
  }
}

function vultureSprite(enemy) {
  if (enemy.state === 'perch') return 'vulturePerch';
  if (enemy.state === 'swoop') return 'vultureDive';
  const rate = enemy.state === 'alert' ? 3 : 7;
  return Math.floor(enemy.anim / rate) % 2 ? 'vultureUp' : 'vultureDown';
}

function updateKiteBot(enemy) {
  enemy.anim++;
  const gust = canyonWindAt(enemy.x);
  enemy.x += enemy.dir * 0.85 + gust * 1.6;
  enemy.y = enemy.baseY + Math.sin(enemy.anim / 16) * 16;
  if (enemy.anim % 4 === 0) {
    enemy.trail.unshift({ x: enemy.x, y: enemy.y });
    if (enemy.trail.length > 6) enemy.trail.pop();
  }
}

function drawKiteBot(ctx, enemy, sx, sy, palette) {
  ctx.fillStyle = nesPalette[0x0F];
  enemy.trail.forEach((point, index) => {
    const tx = point.x - camera.x - enemy.dir * (6 + index * 3);
    const ty = point.y - camera.y + 2;
    if (index % 2 === 1) drawSprite(ctx, 'kiteBow', tx, ty, false, palette);
    else ctx.fillRect(Math.round(tx), Math.round(ty), 1, 1);
  });
  drawSprite(ctx, 'kiteBot' + (Math.floor(enemy.anim / 12) % 2), sx, sy - 7, false, palette);
}

function updateAirMine(enemy) {
  enemy.anim++;
  const targetX = Math.max(enemy.homeX - 32, Math.min(enemy.homeX + 32, player.x));
  const targetY = Math.max(enemy.homeY - 16, Math.min(enemy.homeY + 16, player.y - 8));
  enemy.driftX += Math.sign(targetX - enemy.driftX) * Math.min(0.25, Math.abs(targetX - enemy.driftX));
  enemy.driftY += Math.sign(targetY - enemy.driftY) * Math.min(0.2, Math.abs(targetY - enemy.driftY));
  enemy.x = enemy.driftX;
  enemy.y = enemy.driftY + Math.sin(enemy.anim / 20) * 3;
}

function popAirMine(enemy) {
  const cx = enemy.x;
  const cy = enemy.y - 7;
  for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) fireEnemyShot(cx + dx * 4, cy + dy * 4, dx * 1.1, dy * 1.1, 2, 'airMinePellet', { w: 4, h: 4, palette: 'canyonMine' });
  playSfx('burst');
}

// INITIALIZATION

Object.assign(enemyTypes, {
  vultureBot: {
    w: 18,
    h: 16,
    hp: 3,
    damage: 3,
    init(enemy, spawn) {
      enemy.state = spawn.hover ? 'hover' : 'perch';
      enemy.homeY = spawn.y;
      enemy.timer = 20;
    },
    update: updateVulture,
    sprite: vultureSprite,
    drawOffset: enemy => ({ x: 0, y: enemy.state === 'perch' ? 0 : enemy.state === 'swoop' ? -2 : 1 }),
  },
  kiteBot: {
    w: 14,
    h: 14,
    hp: 1,
    damage: 2,
    init(enemy, spawn) {
      enemy.dir = spawn.dir || (player.x < spawn.x ? -1 : 1);
      enemy.baseY = spawn.y + 4;
      enemy.anim = spawn.phase || 0;
      enemy.trail = [];
    },
    update: updateKiteBot,
    draw: drawKiteBot,
  },
  airMine: {
    w: 14,
    h: 14,
    hp: 1,
    damage: 3,
    palette: 'canyonMine',
    init(enemy, spawn) {
      enemy.homeX = spawn.x;
      enemy.homeY = spawn.y;
      enemy.driftX = spawn.x;
      enemy.driftY = spawn.y;
      enemy.anim = Math.floor(Math.random() * 40);
    },
    update: updateAirMine,
    onDestroy: popAirMine,
    sprite: enemy => 'airMine' + (Math.floor(enemy.anim / 16) % 2),
    drawOffset: () => ({ x: 0, y: -7 }),
  },
});
