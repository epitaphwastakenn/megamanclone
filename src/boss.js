// VARIABLES

const bossDefs = {};
const bossShots = [];
const bossShotKinds = {};
const bossMaxHealth = 28;
const weaknessChart = {
  timber: 'swordfish',
  pine: 'timber',
  balloon: 'pine',
  campfire: 'balloon',
  hive: 'campfire',
  grizzly: 'hive',
  angler: 'grizzly',
  swordfish: 'angler',
};

const boss = {
  active: false,
  id: null,
  def: null,
  x: 0,
  y: 0,
  w: 18,
  h: 28,
  vx: 0,
  vy: 0,
  facing: -1,
  health: 0,
  state: 'none',
  timer: 0,
  invuln: 0,
  onGround: false,
  anim: 0,
  visible: false,
  ai: {},
};

// FUNCTIONS

function spawnBoss(id, x, y) {
  const def = bossDefs[id];
  Object.assign(boss, {
    active: true,
    id,
    def,
    x,
    y,
    w: def.w,
    h: def.h,
    vx: 0,
    vy: 0,
    facing: -1,
    health: 0,
    state: 'drop',
    timer: 0,
    invuln: 0,
    onGround: false,
    anim: 0,
    visible: true,
    ai: {},
  });
  bossShots.length = 0;
  def.spawn(boss);
}

function clearBoss() {
  boss.active = false;
  boss.visible = false;
  boss.state = 'none';
  bossShots.length = 0;
}

function bossFacePlayer() {
  boss.facing = player.x < boss.x ? -1 : 1;
}

function bossPhysics() {
  boss.vy = Math.min(boss.vy + 0.25, 7);
  const result = moveBody(boss, boss.vx, boss.vy);
  if (result.hitWall) boss.vx = 0;
  boss.justLanded = false;
  if (result.landed) {
    if (!boss.onGround) {
      boss.vx = 0;
      boss.justLanded = true;
    }
    boss.onGround = true;
    boss.vy = 0;
  } else if (boss.vy > 0) {
    boss.onGround = false;
  }
  return result;
}

function updateBoss(allowContact) {
  if (!boss.active) return;
  if (boss.invuln > 0) boss.invuln--;
  if (boss.state === 'drop') {
    bossPhysics();
    if (boss.onGround) {
      boss.state = 'pose';
      boss.timer = 0;
      playSfx('land');
    }
  } else if (boss.state === 'pose') {
    boss.timer++;
    bossFacePlayer();
    if (boss.def.updatePose) boss.def.updatePose(boss);
  } else if (boss.state === 'fight') {
    boss.def.update(boss);
  } else if (boss.state === 'idle') {
    bossPhysics();
  }
  updateBossShots();
  const contact = boss.def.contactBox ? boss.def.contactBox(boss) : bossBox();
  if (allowContact && boss.visible && boss.state !== 'dead' && !player.dead && contact && boxesOverlap(contact, playerHitBox())) hurtPlayer(boss.def.contactDamage);
}

function spawnBossShot(kind, x, y, extra) {
  const shot = { kind, x, y, vx: 0, vy: 0, age: 0, ...(extra || {}) };
  bossShots.push(shot);
  return shot;
}

function bossShotBox(shot, kind) {
  if (kind.box) return kind.box(shot);
  return centerBox(shot.x, shot.y, kind.w || kind.size, kind.h || kind.size);
}

function updateBossShots() {
  for (let i = bossShots.length - 1; i >= 0; i--) {
    const shot = bossShots[i];
    shot.age++;
    const kind = bossShotKinds[shot.kind];
    if (shot.dead || !kind.update(shot) || shot.dead || (!kind.keepOffscreen && !onScreen(shot.x, shot.y, 48))) {
      if (kind.onRemove) kind.onRemove(shot);
      bossShots.splice(i, 1);
      continue;
    }
    if (kind.harmless || !kind.damage) continue;
    if (!player.dead && boxesOverlap(bossShotBox(shot, kind), playerHitBox())) {
      const wasHurt = player.invulnTimer > 0 || player.shieldTimer > 0;
      hurtPlayer(kind.damage);
      if (kind.onHitPlayer) kind.onHitPlayer(shot, wasHurt);
      if (kind.fragile && !wasHurt) {
        if (kind.onRemove) kind.onRemove(shot);
        bossShots.splice(i, 1);
      }
    }
  }
}

function bossBox() {
  return boss.def.box ? boss.def.box(boss) : bodyBox(boss);
}

function bossDamageFor(shot) {
  const def = boss.def;
  if (def.damage && shot.kind in def.damage) return def.damage[shot.kind];
  const kind = playerShotKinds[shot.kind];
  const weapon = shot.weapon || 'buster';
  if (weapon === def.weapon) return 0;
  if (weapon === weaknessChart[boss.id] && kind.weakDamage !== undefined) return kind.weakDamage;
  return kind.bossDamage !== undefined ? kind.bossDamage : shot.damage;
}

function hitBossWithShot(shot, box) {
  if (!boss.active || !boss.visible || boss.state !== 'fight') return false;
  if (!boxesOverlap(box, bossBox())) return false;
  if (boss.def.shielded && boss.def.shielded(boss, shot)) {
    reflectShot(shot);
    return 'reflect';
  }
  const damage = bossDamageFor(shot);
  if (damage <= 0) {
    if (playerShotKinds[shot.kind].immuneResult === 'consume') {
      playSfx('tink');
      return 'consumed';
    }
    reflectShot(shot);
    return 'reflect';
  }
  if (boss.invuln > 0) return false;
  boss.health = Math.max(0, boss.health - damage);
  boss.invuln = boss.def.invulnFrames;
  spawnEffect('hitSpark', shot.x, shot.y);
  const weak = (shot.weapon || 'buster') === weaknessChart[boss.id];
  if (boss.health <= 0) defeatBoss();
  else {
    playSfx('enemyHit');
    if (weak && boss.def.onWeakHit) boss.def.onWeakHit(boss, shot);
    if (boss.def.onHit) boss.def.onHit(boss, shot, weak);
  }
  return 'hit';
}

function defeatBoss() {
  boss.state = 'dead';
  boss.visible = false;
  if (boss.def.onDefeat) boss.def.onDefeat(boss);
  bossShots.length = 0;
  spawnDeathOrbs(boss.x, boss.y - 14, boss.def.orbPalette);
  stopSong();
  playSfx('bossDeath');
  onBossDefeated();
}

function drawBoss(ctx) {
  if (!boss.active) return;
  const behind = bossShots.filter(shot => bossShotKinds[shot.kind].behind);
  for (const shot of behind) bossShotKinds[shot.kind].draw(ctx, shot, shot.x - camera.x, shot.y - camera.y);
  if (boss.visible && !(boss.invuln > 0 && Math.floor(boss.invuln / 2) % 2 === 0)) {
    const shake = boss.ai.shake ? (Math.floor(boss.ai.shake / 2) % 2 ? 1 : -1) : 0;
    const sx = boss.x - camera.x + shake;
    const sy = boss.y - camera.y;
    if (boss.def.draw) boss.def.draw(ctx, boss, sx, sy);
    else drawSprite(ctx, boss.def.sprite(boss), sx, sy, boss.facing < 0, boss.def.palette || 'boss');
  }
  for (const shot of bossShots) if (!bossShotKinds[shot.kind].behind) bossShotKinds[shot.kind].draw(ctx, shot, shot.x - camera.x, shot.y - camera.y);
}
