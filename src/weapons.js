// VARIABLES

const weaponMaxEnergy = 28;
const weaponOrder = ['buster', 'timber', 'pine', 'balloon', 'campfire', 'hive', 'grizzly', 'angler', 'swordfish'];

const weaponDefs = {
  buster: { label: 'M.BUSTER', palette: 'mega', cost: 0, barColors: [0x38, 0x30], pose: 'Shoot' },
};

// FUNCTIONS

function ownedWeapons() {
  return weaponOrder.filter(id => id === 'buster' || (weaponDefs[id] && game.defeated.has(weaponDefs[id].boss)));
}

function hasSpecialWeapons() {
  return ownedWeapons().length > 1;
}

function refillWeapons() {
  for (const id of weaponOrder) if (id !== 'buster') game.weaponEnergy[id] = weaponMaxEnergy;
}

function selectWeapon(id) {
  if (player.weapon === id) return;
  const previous = weaponDefs[player.weapon];
  if (previous.onDeselect) previous.onDeselect();
  player.weapon = id;
  player.charge = 0;
  stopChargeSound();
  playerShots.length = 0;
  if (weaponDefs[id].onSelect) weaponDefs[id].onSelect();
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
