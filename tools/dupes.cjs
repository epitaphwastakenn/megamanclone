const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

// VARIABLES

const root = path.resolve(__dirname, '..');
const registries = ['enemyTypes', 'playerShotKinds', 'bossShotKinds', 'effectTypes', 'platformTypes', 'palettes', 'weaponDefs', 'bossDefs', 'stageDefs', 'chordTones', 'chordRoots'];

// FUNCTIONS

function listScripts() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  return [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match => match[1]);
}

function scanFile(file, found) {
  const lines = fs.readFileSync(path.join(root, file), 'utf8').split('\n');
  let registry = null;
  lines.forEach((line, index) => {
    const where = file + ':' + (index + 1);
    const declaration = /^(?:async )?function (\w+)\(|^(?:const|let|var) (\w+)/.exec(line);
    if (declaration) (found['global ' + (declaration[1] || declaration[2])] ||= []).push(where);
    const assign = /^Object\.assign\((\w+), \{(.*)$/.exec(line);
    if (assign && registries.includes(assign[1])) {
      if (assign[2].includes('});')) {
        for (const inline of assign[2].matchAll(/(\w+|'[^']+'): /g)) (found[assign[1] + '.' + inline[1].replace(/'/g, '')] ||= []).push(where);
        return;
      }
      registry = assign[1];
      return;
    }
    if (registry && /^\}\);/.test(line)) {
      registry = null;
      return;
    }
    const key = /^  (\w+|'[^']+'): /.exec(line);
    if (registry && key) (found[registry + '.' + key[1].replace(/'/g, '')] ||= []).push(where);
    const direct = /^(\w+)\.(\w+) = /.exec(line);
    if (direct && registries.includes(direct[1])) (found[direct[1] + '.' + direct[2]] ||= []).push(where);
  });
}

async function findDuplicates() {
  const found = {};
  for (const file of listScripts()) scanFile(file, found);
  let count = 0;
  for (const name in found) {
    if (found[name].length < 2) continue;
    count++;
    console.log('duplicate ' + name + ': ' + found[name].join(', '));
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.join(root, 'index.html'));
  const sprites = await page.evaluate(() => {
    const seen = {};
    artGroups.forEach((group, index) => {
      for (const name in group) (seen[name] ||= []).push(index);
    });
    return Object.entries(seen).filter(([, groups]) => groups.length > 1).map(([name, groups]) => name + ' in groups ' + groups.join(','));
  });
  for (const line of sprites) console.log('duplicate sprite ' + line);
  count += sprites.length;
  console.log(count ? count + ' duplicates' : 'no duplicates');
  await browser.close();
}

// INITIALIZATION

findDuplicates();
