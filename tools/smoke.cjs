const path = require('path');
const { chromium } = require('playwright');

// VARIABLES

const root = path.resolve(__dirname, '..');
const stageIds = process.argv.slice(2);

// FUNCTIONS

async function runSmoke() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message + '\n' + (error.stack || '')));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  for (const file of ['index.html', 'sprites.html']) {
    await page.goto('file://' + path.join(root, file));
    await page.waitForTimeout(300);
  }
  await page.goto('file://' + path.join(root, 'index.html'));
  const ids = stageIds.length ? stageIds : await page.evaluate(() => Object.keys(stageDefs));
  for (const id of ids) {
    const report = await page.evaluate(stageId => {
      enterStage(stageId);
      for (let i = 0; i < 400; i++) {
        updateInput();
        updateGame();
      }
      drawGame(document.getElementById('screen').getContext('2d'));
      return { stage: stageId, state: stage.state, room: stage.room.id, x: Math.round(player.x), y: Math.round(player.y), dead: player.dead };
    }, id);
    console.log(JSON.stringify(report));
  }
  await page.evaluate(() => {
    for (const id of Object.keys(bossDefs)) game.defeated.add(id);
    refillWeapons();
    const ctx = document.getElementById('screen').getContext('2d');
    for (const id of ownedWeapons()) {
      selectWeapon(id);
      drawGame(ctx);
    }
    setScene('ending');
    for (let i = 0; i < 300; i++) drawGame(ctx), (game.timer += 1);
    setScene('stageSelect');
    drawGame(ctx);
  });
  if (errors.length) {
    console.log('ERRORS:\n' + errors.join('\n'));
    process.exitCode = 1;
  } else console.log('no errors');
  await browser.close();
}

// INITIALIZATION

runSmoke();
