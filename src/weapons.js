// VARIABLES

const weaponMaxEnergy = 28;
const weaponOrder = ['buster', 'timber', 'pine'];

const weaponDefs = {
  buster: { label: 'M.BUSTER', palette: 'mega', cost: 0, barColors: [0x38, 0x30] },
  timber: { label: 'TIMBER AXE', palette: 'megaTimber', cost: 1, barColors: [0x27, 0x30], boss: 'timber' },
  pine: { label: 'PINE BURST', palette: 'megaPine', cost: 2, barColors: [0x2A, 0x30], boss: 'pine' },
};

// FUNCTIONS

function ownedWeapons() {
  return weaponOrder.filter(id => id === 'buster' || game.defeated.has(weaponDefs[id].boss));
}

function hasSpecialWeapons() {
  return ownedWeapons().length > 1;
}

function refillWeapons() {
  for (const id of weaponOrder) if (id !== 'buster') game.weaponEnergy[id] = weaponMaxEnergy;
}

function selectWeapon(id) {
  if (player.weapon === id) return;
  player.weapon = id;
  player.charge = 0;
  stopChargeSound();
  playerShots.length = 0;
}

function cycleWeapon(direction) {
  const owned = ownedWeapons();
  if (owned.length < 2) return;
  const index = owned.indexOf(player.weapon);
  selectWeapon(owned[(index + direction + owned.length) % owned.length]);
  playSfx('blip');
}

function weaponRefillTarget() {
  if (player.weapon !== 'buster') return player.weapon;
  const owned = ownedWeapons().filter(id => id !== 'buster');
  if (!owned.length) return null;
  return owned.reduce((low, id) => (game.weaponEnergy[id] < game.weaponEnergy[low] ? id : low), owned[0]);
}

function fireSpecialWeapon() {
  const def = weaponDefs[player.weapon];
  if (game.weaponEnergy[player.weapon] < def.cost) return false;
  const kind = player.weapon === 'timber' ? 'axe' : 'cone';
  if (playerShots.some(shot => shot.kind === kind)) return false;
  const origin = busterOrigin();
  if (kind === 'axe') {
    playerShots.push({ kind, x: origin.x, y: origin.y, vx: player.facing * 6, vy: 0, dir: player.facing, phase: 'out', damage: 3, w: 14, h: 14, reflected: false, age: 0, hitList: [] });
    playSfx('axe');
  } else {
    playerShots.push({ kind, x: origin.x, y: origin.y - 2, vx: player.facing * 2.6, vy: -3.4, dir: player.facing, damage: 2, w: 8, h: 8, reflected: false, age: 0, hitList: [] });
    playSfx('throw');
  }
  game.weaponEnergy[player.weapon] -= def.cost;
  player.shootTimer = playerStats.shootPoseFrames;
  stageEvents.playerFired = true;
  return true;
}

function burstCone(shot) {
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    playerShots.push({ kind: 'needle', x: shot.x, y: shot.y, vx: Math.cos(angle) * 3.5, vy: Math.sin(angle) * 3.5, dir: 1, damage: 1, w: 6, h: 6, reflected: false, age: 0, hitList: [] });
  }
  spawnEffect('hitSpark', shot.x, shot.y);
  playSfx('burst');
}

function moveSpecialShot(shot) {
  if (shot.kind === 'axe') {
    if (shot.age % 8 === 1) playSfx('axe');
    if (shot.phase === 'out') {
      shot.vx -= shot.dir * 0.15;
      shot.x += shot.vx;
      if (Math.sign(shot.vx) !== shot.dir) shot.phase = 'back';
      return true;
    }
    const dx = player.x - shot.x;
    const dy = player.y - 12 - shot.y;
    const distance = Math.hypot(dx, dy);
    const speed = Math.min(6, Math.max(1, (shot.age - 40) * 0.12));
    if (distance < 10 || player.dead) return false;
    shot.x += (dx / distance) * speed;
    shot.y += (dy / distance) * speed;
    return true;
  }
  if (shot.kind === 'cone') {
    shot.vy = Math.min(shot.vy + 0.22, 6);
    shot.x += shot.vx;
    shot.y += shot.vy;
    if (solidAt(shot.x, shot.y + 3) || solidAt(shot.x + shot.dir * 3, shot.y) || shot.age > 70) {
      burstCone(shot);
      return false;
    }
    return true;
  }
  if (shot.kind === 'needle') {
    shot.x += shot.vx;
    shot.y += shot.vy;
    return shot.age < 26 && !solidAt(shot.x, shot.y);
  }
  shot.x += shot.vx;
  shot.y += shot.vy;
  return true;
}

function needleSprite(vx, vy) {
  const octant = Math.round(Math.atan2(vy, vx) / (Math.PI / 4));
  switch (octant) {
    case 0:
      return ['needleRight', false];
    case 1:
      return ['needleDownRight', false];
    case 2:
      return ['needleDown', false];
    case 3:
      return ['needleDownRight', true];
    case -1:
      return ['needleUpRight', false];
    case -2:
      return ['needleUp', false];
    case -3:
      return ['needleUpRight', true];
  }
  return ['needleRight', true];
}

function drawSpecialShot(ctx, shot, sx, sy) {
  if (shot.kind === 'axe') {
    drawSprite(ctx, 'axeSmall' + (Math.floor(shot.age / 2) % 4), sx, sy, shot.dir < 0, 'boss');
  } else if (shot.kind === 'cone') {
    drawSprite(ctx, 'cone' + (Math.floor(shot.age / 4) % 4), sx, sy, false, 'boss');
  } else if (shot.kind === 'needle') {
    const [name, flip] = needleSprite(shot.vx, shot.vy);
    drawSprite(ctx, name, sx, sy, flip, 'boss');
  }
}
