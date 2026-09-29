// FUNCTIONS

function lureHookReel(shot) {
  shot.phase = 'back';
}

function lureHookRelease(shot) {
  if (shot.item) shot.item.floating = false;
  shot.item = null;
}

function lureHookGrab(shot) {
  const box = centerBox(shot.x, shot.y, 12, 12);
  const item = items.find(entry => !entry.floating && boxesOverlap(box, bodyBox(entry)));
  if (!item) return;
  shot.item = item;
  item.floating = true;
  item.vy = 0;
  lureHookReel(shot);
  playAnglerSfx('latch');
}

function updateLureHookOut(shot) {
  shot.x += shot.dir * 6;
  shot.distance += 6;
  lureHookGrab(shot);
  if (shot.phase !== 'out') return;
  if (solidAt(shot.x + shot.dir * 4, shot.y)) {
    playSfx('tink');
    lureHookReel(shot);
  } else if (shot.distance >= 128) lureHookReel(shot);
}

function updateLureHook(shot) {
  if (player.dead) {
    lureHookRelease(shot);
    return false;
  }
  player.shootTimer = Math.max(player.shootTimer, 2);
  if (shot.phase === 'out') {
    updateLureHookOut(shot);
    return true;
  }
  const targetX = player.x + player.facing * 4;
  const targetY = player.y - 12;
  const dx = targetX - shot.x;
  const dy = targetY - shot.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 8) {
    if (shot.item) {
      shot.item.x = player.x;
      shot.item.y = player.y - 4;
    }
    lureHookRelease(shot);
    return false;
  }
  const speed = Math.min(distance, 7);
  shot.x += (dx / distance) * speed;
  shot.y += (dy / distance) * speed;
  if (shot.item) {
    shot.item.x = shot.x;
    shot.item.y = shot.y + shot.item.h / 2 + 2;
  }
  if (shot.age % 4 === 0) playAnglerSfx('reel');
  return true;
}

function lureHookHit(shot, enemy) {
  enemy.stun = 120;
  lureHookReel(shot);
  return 'pass';
}

function drawLureHook(ctx, shot, sx, sy) {
  if (!shot.reflected) {
    const origin = busterOrigin();
    drawFishingLine(ctx, origin.x - camera.x - player.facing * 3, origin.y - camera.y, sx, sy, shot.phase === 'back' ? 3 : 0);
  }
  drawSprite(ctx, 'anglerLure' + (Math.floor(shot.age / 4) % 2), sx, sy, shot.dir < 0, 'boss');
}

// INITIALIZATION

playerShotKinds.lureHook = {
  weapon: 'angler',
  damage: 2,
  w: 10,
  h: 8,
  bossDamage: 2,
  weakDamage: 6,
  screenMargin: 256,
  update: updateLureHook,
  onShield(shot, enemy) {
    playSfx('tink');
    return lureHookHit(shot, enemy);
  },
  onHitEnemy: lureHookHit,
  onHitBoss(shot) {
    lureHookReel(shot);
    return 'pass';
  },
  onExpire: lureHookRelease,
  draw: drawLureHook,
};

weaponDefs.angler = {
  label: 'LURE HOOK',
  palette: 'megaAngler',
  cost: 1,
  barColors: [0x27, 0x38],
  boss: 'angler',
  pose: 'Shoot',
  icon: { frames: ['anglerLure0', 'anglerLure1'], rate: 8, palette: 'boss' },
  fire() {
    if (countPlayerShots('lureHook')) return false;
    const origin = busterOrigin();
    makePlayerShot('lureHook', origin.x, origin.y, { dir: player.facing, phase: 'out', distance: 0 });
    playAnglerSfx('cast');
    return true;
  },
  onDeselect() {
    for (const shot of playerShots) if (shot.kind === 'lureHook') lureHookRelease(shot);
  },
};
