const path = require('path');
const { chromium } = require('playwright');

// VARIABLES

const root = path.resolve(__dirname, '..');
const bossId = process.argv[2];
const weaponId = process.argv[3] || 'buster';
const seed = Number(process.argv[4] || 7);

// FUNCTIONS

async function runDuel() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message + '\n' + (error.stack || '')));
  await page.goto('file://' + path.join(root, 'index.html'));
  const result = await page.evaluate(([id, weapon, randomSeed]) => {
    let value = randomSeed;
    Math.random = () => {
      value = (value * 1103515245 + 12345) & 0x7fffffff;
      return value / 0x7fffffff;
    };
    for (const key of Object.keys(bossDefs)) game.defeated.add(key);
    game.defeated.delete(id);
    enterStage(bossDefs[id].stage);
    const room = rooms.find(entry => entry.boss);
    stage.room = room;
    clearPlatforms();
    spawnRoomPlatforms(room.id);
    resetPlayer((room.col + 3) * tileSize + 8, (room.row + 12) * tileSize);
    const target = cameraTargetFor(room, player.x);
    camera.x = target.x;
    camera.y = target.y;
    player.visible = true;
    stage.state = 'bossIntro';
    stage.bossPhase = { phase: 'wait', timer: 0 };
    refillWeapons();
    selectWeapon(weapon);
    let damageTaken = 0;
    let hits = 0;
    let frames = 0;
    let lastHealth = null;
    const originalHurt = hurtPlayer;
    hurtPlayer = amount => {
      const before = player.health;
      originalHurt(amount);
      if (player.health < before) {
        damageTaken += before - player.health;
        hits++;
      }
      player.health = playerStats.maxHealth;
    };
    let fightStart = null;
    const bossHits = [];
    for (frames = 0; frames < 60 * 180; frames++) {
      for (const name of buttonNames) keyboardHeld[name] = false;
      if (stage.state === 'play' && boss.state === 'fight') {
        if (fightStart === null) fightStart = frames;
        const toward = boss.x < player.x ? 'left' : 'right';
        if ((toward === 'left') !== (player.facing < 0)) keyboardHeld[toward] = true;
        if (frames % 12 === 0) keyboardLatch.fire = true;
        if (game.weaponEnergy[weapon] !== undefined && game.weaponEnergy[weapon] < 4) game.weaponEnergy[weapon] = weaponMaxEnergy;
      }
      updateInput();
      updateGame();
      if (boss.active && lastHealth !== null && boss.health < lastHealth && boss.state === 'fight') bossHits.push(lastHealth - boss.health);
      lastHealth = boss.health;
      if (stage.state === 'victory' || (fightStart !== null && boss.state === 'dead')) break;
    }
    return {
      boss: id,
      weapon,
      seconds: fightStart === null ? null : +((frames - fightStart) / 60).toFixed(1),
      killed: boss.state === 'dead',
      bossHealth: boss.health,
      bossHits,
      damageTaken,
      hitsTaken: hits,
    };
  }, [bossId, weaponId, seed]);
  console.log(JSON.stringify(result));
  if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
  await browser.close();
}

// INITIALIZATION

runDuel();
