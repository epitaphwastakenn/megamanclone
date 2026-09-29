// VARIABLES

const bossDefs = {};
const bossShots = [];
const bossShotKinds = {};
const bossBaseDamage = { pellet: 2, mid: 3, full: 5, axe: 2, cone: 2, needle: 1 };
const bossMaxHealth = 28;

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
  } else if (boss.state === 'fight') {
    boss.def.update(boss);
  } else if (boss.state === 'idle') {
    bossPhysics();
  }
  updateBossShots();
  if (allowContact && boss.visible && !player.dead && boxesOverlap(bodyBox(boss), playerHitBox())) hurtPlayer(boss.def.contactDamage);
}

function updateBossShots() {
  for (let i = bossShots.length - 1; i >= 0; i--) {
    const shot = bossShots[i];
    shot.age++;
    const kind = bossShotKinds[shot.kind];
    if (!kind.update(shot) || !onScreen(shot.x, shot.y, 48)) {
      bossShots.splice(i, 1);
      continue;
    }
    if (!player.dead && boxesOverlap(centerBox(shot.x, shot.y, kind.size, kind.size), playerHitBox())) {
      hurtPlayer(kind.damage);
      if (kind.fragile) bossShots.splice(i, 1);
    }
  }
}

function bossDamageFor(kind) {
  const table = boss.def.damage;
  return kind in table ? table[kind] : bossBaseDamage[kind];
}

function hitBossWithShot(shot, box) {
  if (!boss.active || !boss.visible || boss.state !== 'fight') return false;
  if (!boxesOverlap(box, bodyBox(boss))) return false;
  const damage = bossDamageFor(shot.kind);
  if (damage <= 0) {
    if (shot.kind === 'needle') {
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
  if (boss.health <= 0) defeatBoss();
  else playSfx('enemyHit');
  return 'hit';
}

function defeatBoss() {
  boss.state = 'dead';
  boss.visible = false;
  bossShots.length = 0;
  spawnDeathOrbs(boss.x, boss.y - 14, boss.def.orbPalette);
  stopSong();
  playSfx('bossDeath');
  onBossDefeated();
}

function drawBoss(ctx) {
  if (!boss.active) return;
  if (boss.visible && !(boss.invuln > 0 && Math.floor(boss.invuln / 2) % 2 === 0)) {
    const shake = boss.ai.shake ? (Math.floor(boss.ai.shake / 2) % 2 ? 1 : -1) : 0;
    drawSprite(ctx, boss.def.sprite(boss), boss.x - camera.x + shake, boss.y - camera.y, boss.facing < 0, 'boss');
  }
  for (const shot of bossShots) bossShotKinds[shot.kind].draw(ctx, shot, shot.x - camera.x, shot.y - camera.y);
}
