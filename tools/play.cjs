const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

// VARIABLES

const root = path.resolve(__dirname, '..');
const scriptFile = process.argv[2];

// FUNCTIONS

async function saveCanvas(page, file, scale) {
  const dataUrl = await page.evaluate(zoom => {
    const source = document.getElementById('screen');
    const canvas = document.createElement('canvas');
    canvas.width = source.width * zoom;
    canvas.height = source.height * zoom;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }, scale || 2);
  fs.writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('wrote', file);
}

async function runScript() {
  const script = JSON.parse(fs.readFileSync(scriptFile, 'utf8'));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message + '\n' + (error.stack || '')));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
    else if (message.type() === 'log') console.log('[page]', message.text());
  });
  await page.goto('file://' + path.join(root, 'index.html'));
  await page.evaluate(setup => {
    Math.random = (() => {
      let seed = setup.seed || 12345;
      return () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };
    })();
    window.debugStep = frames => {
      for (let i = 0; i < frames; i++) {
        updateInput();
        updateGame();
      }
      drawGame(document.getElementById('screen').getContext('2d'));
    };
    window.debugHold = names => {
      for (const name of buttonNames) keyboardHeld[name] = names.includes(name);
    };
    window.debugTap = names => {
      for (const name of names) keyboardLatch[name] = true;
    };
    if (setup.defeated === 'all') for (const id of Object.keys(bossDefs)) game.defeated.add(id);
    else for (const id of setup.defeated || []) game.defeated.add(id);
    enterStage(setup.stage);
    if (setup.room) {
      const room = rooms.find(entry => entry.id === setup.room);
      const x = (room.col + setup.col) * tileSize + tileSize / 2;
      const y = (room.row + setup.row) * tileSize;
      stage.room = room;
      stage.checkpointIndex = Math.max(0, checkpoints.findIndex(checkpoint => checkpoint.room === room.id));
      clearPlatforms();
      spawnRoomPlatforms(room.id);
      resetPlayer(x, y);
      const target = cameraTargetFor(room, x);
      camera.x = target.x;
      camera.y = target.y;
      player.control = true;
      player.visible = true;
      stage.state = 'play';
      stage.timer = 0;
      if (room.boss && setup.boss !== false) {
        player.control = false;
        stage.state = 'bossIntro';
        stage.bossPhase = { phase: 'wait', timer: 0 };
      }
    } else {
      debugStep(200);
    }
    if (setup.weapon) {
      refillWeapons();
      selectWeapon(setup.weapon);
    }
    if (setup.invincible) window.debugInvincible = true;
  }, script.setup);
  for (const step of script.steps) {
    if (step.hold) await page.evaluate(names => debugHold(names), step.hold);
    if (step.tap) await page.evaluate(names => debugTap(names), step.tap);
    if (step.eval) console.log('eval:', JSON.stringify(await page.evaluate(step.eval)));
    if (step.frames) {
      const chunk = step.every || step.frames;
      for (let done = 0; done < step.frames; done += chunk) {
        await page.evaluate(count => {
          debugStep(count);
          if (window.debugInvincible) player.health = playerStats.maxHealth;
        }, Math.min(chunk, step.frames - done));
        if (step.every && step.shot) await saveCanvas(page, step.shot.replace('#', String(done + chunk)), step.scale);
      }
    }
    if (step.shot && !step.every) await saveCanvas(page, step.shot, step.scale);
    if (step.log) console.log(JSON.stringify(await page.evaluate(() => ({ scene: game.scene, state: stage.state, room: stage.room && stage.room.id, x: +player.x.toFixed(1), y: +player.y.toFixed(1), health: player.health, dead: player.dead, boss: boss.active ? { id: boss.id, health: boss.health, state: boss.state, x: Math.round(boss.x), y: Math.round(boss.y) } : null }))));
  }
  if (errors.length) {
    console.log('ERRORS:\n' + errors.join('\n'));
    process.exitCode = 1;
  }
  await browser.close();
}

// INITIALIZATION

runScript();
