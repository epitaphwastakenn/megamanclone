// FUNCTIONS

function updateMet(enemy) {
  aimAtPlayer(enemy);
  if (enemy.state === 'hide') {
    enemy.h = 10;
    enemy.timer--;
    if (enemy.timer <= 0 && Math.abs(player.x - enemy.x) < 96) {
      enemy.state = 'open';
      enemy.timer = 0;
    }
  } else {
    enemy.h = 14;
    enemy.timer++;
    if (enemy.timer === 10) {
      for (const vy of [-1.2, 0, 1.2]) fireEnemyShot(enemy.x + enemy.facing * 6, enemy.y - 8, enemy.facing * 2, vy);
      playSfx('enemyShot');
    }
    if (enemy.timer >= 44) {
      enemy.state = 'hide';
      enemy.timer = 60 + Math.floor(Math.random() * 50);
    }
  }
  applyEnemyGravity(enemy);
}

function updateBlader(enemy) {
  enemy.anim++;
  if (enemy.state === 'approach') {
    aimAtPlayer(enemy);
    enemy.x += enemy.facing * 1;
    enemy.y = enemy.baseY + Math.sin(enemy.anim / 8) * 3;
    if (Math.abs(player.x - enemy.x) < 52 && player.y - 10 > enemy.y) {
      enemy.state = 'dive';
      enemy.vx = enemy.facing * 1.6;
      enemy.vy = Math.min(3.4, 1.2 + (player.y - 10 - enemy.y) / 28);
    }
  } else {
    enemy.x += enemy.vx;
    enemy.y += enemy.vy;
    enemy.vy -= 0.09;
    if (enemy.vy < 0 && enemy.y <= enemy.baseY) {
      enemy.y = enemy.baseY;
      enemy.state = 'approach';
    }
  }
}

function updateScrew(enemy) {
  if (enemy.state === 'closed') {
    enemy.h = 8;
    enemy.timer--;
    if (enemy.timer <= 0 && Math.abs(player.x - enemy.x) < 112) {
      enemy.state = 'open';
      enemy.timer = 0;
    }
  } else {
    enemy.h = 12;
    enemy.timer++;
    enemy.anim++;
    if (enemy.timer === 14 || enemy.timer === 38) {
      const directions = [[-1, 0], [-0.7, -0.7], [0, -1], [0.7, -0.7], [1, 0]];
      for (const [dx, dy] of directions) fireEnemyShot(enemy.x + dx * 6, enemy.y - 10 + dy * 4, dx * 2, dy * 2);
      playSfx('enemyShot');
    }
    if (enemy.timer >= 56) {
      enemy.state = 'closed';
      enemy.timer = 70;
    }
  }
  applyEnemyGravity(enemy);
}

function updateBlaster(enemy) {
  enemy.timer--;
  if (enemy.state === 'closed') {
    if (enemy.timer <= 0) {
      enemy.state = 'open';
      enemy.timer = 64;
    }
  } else {
    const shotIndex = [54, 44, 34, 24].indexOf(enemy.timer);
    if (shotIndex >= 0) {
      const vy = [-1.6, -0.6, 0.6, 1.6][shotIndex];
      fireEnemyShot(enemy.x + enemy.facing * 8, enemy.y - 8, enemy.facing * 2.2, vy, 2, 'beakShot');
      playSfx('enemyShot');
    }
    if (enemy.timer <= 0) {
      enemy.state = 'closed';
      enemy.timer = 90;
    }
  }
}

function updateBigEye(enemy) {
  enemy.justLanded = false;
  if (enemy.onGround) {
    enemy.vx = 0;
    enemy.timer--;
    if (enemy.timer <= 0) {
      aimAtPlayer(enemy);
      enemy.jumps++;
      const high = enemy.jumps % 3 === 0;
      enemy.vy = high ? -6.8 : -4.2;
      enemy.vx = enemy.facing * (high ? 1.1 : 1.5);
      enemy.onGround = false;
      playSfx('jumpBig');
    }
  }
  const result = applyEnemyGravity(enemy);
  if (result.hitWall) enemy.vx = 0;
  if (enemy.justLanded) {
    enemy.timer = 40;
    playSfx('thud');
  }
}

function updateFlea(enemy) {
  enemy.justLanded = false;
  if (enemy.onGround) {
    enemy.vx = 0;
    enemy.timer--;
    if (enemy.timer <= 0) {
      aimAtPlayer(enemy);
      const high = Math.random() < 0.35;
      enemy.vy = high ? -5.2 : -3.6;
      enemy.vx = enemy.facing * (high ? 1.2 : 1.8);
      enemy.onGround = false;
    }
  }
  const result = applyEnemyGravity(enemy);
  if (result.hitWall) enemy.vx = 0;
  if (enemy.justLanded) enemy.timer = 16 + Math.floor(Math.random() * 24);
}

function updatePengSpawner(enemy) {
  enemy.timer--;
  if (enemy.timer > 0) return;
  enemy.timer = 70 + Math.floor(Math.random() * 40);
  const alive = enemies.filter(other => other.type === 'peng' && other.alive).length;
  if (alive >= 3) return;
  const y = enemy.y + Math.floor(Math.random() * 5) * 8 - 16;
  createEnemy({ type: 'peng', x: camera.x + screenWidth + 10, y, vx: -1.4, state: null });
}

function updatePeng(enemy) {
  enemy.anim++;
  enemy.x += enemy.vx;
  enemy.y = enemy.baseY + Math.sin(enemy.anim / 10) * 14;
}

function updateJoe(enemy) {
  enemy.justLanded = false;
  aimAtPlayer(enemy);
  enemy.timer--;
  if (enemy.state === 'guard') {
    if (enemy.timer <= 0) {
      enemy.state = 'lower';
      enemy.timer = 8;
    }
  } else if (enemy.state === 'lower') {
    if (enemy.timer <= 0) {
      enemy.state = 'shoot';
      enemy.timer = 48;
    }
  } else if (enemy.state === 'shoot') {
    if (enemy.timer % 16 === 8) {
      fireEnemyShot(enemy.x + enemy.facing * 12, enemy.y - 8, enemy.facing * 2.6, 0, 3, 'joeShot');
      playSfx('enemyShot');
    }
    if (enemy.timer <= 0) {
      enemy.jumps++;
      if (enemy.jumps % 2 === 0 && enemy.onGround) {
        enemy.state = 'jump';
        enemy.vy = -5;
        enemy.onGround = false;
      } else {
        enemy.state = 'guard';
        enemy.timer = 60 + Math.floor(Math.random() * 40);
      }
    }
  }
  applyEnemyGravity(enemy);
  if (enemy.state === 'jump' && enemy.justLanded) {
    enemy.state = 'guard';
    enemy.timer = 50;
  }
}

function updatePicketMan(enemy) {
  aimAtPlayer(enemy);
  enemy.timer--;
  if (enemy.state === 'guard') {
    if (enemy.timer <= 0) {
      enemy.state = 'windup';
      enemy.timer = 14;
      enemy.throwsLeft = 2 + Math.floor(Math.random() * 2);
    }
  } else if (enemy.state === 'windup') {
    if (enemy.timer <= 0) {
      const vx = Math.max(-2.6, Math.min(2.6, (player.x - enemy.x) / 49));
      fireEnemyShot(enemy.x, enemy.y - 22, vx, -4.4, 3, 'picket0', { gravity: 0.18, frames: ['picket0', 'picket1', 'picket2', 'picket3'], frameRate: 3, w: 10, h: 10 });
      playSfx('throw');
      enemy.state = 'release';
      enemy.timer = 10;
    }
  } else if (enemy.state === 'release' && enemy.timer <= 0) {
    enemy.throwsLeft--;
    if (enemy.throwsLeft > 0) {
      enemy.state = 'windup';
      enemy.timer = 12;
    } else {
      enemy.state = 'guard';
      enemy.timer = 50 + Math.floor(Math.random() * 40);
    }
  }
  applyEnemyGravity(enemy);
}

// INITIALIZATION

Object.assign(enemyTypes, {
  met: {
    w: 16,
    h: 10,
    hp: 1,
    damage: 2,
    init(enemy) {
      enemy.state = 'hide';
    },
    update: updateMet,
    shielded: enemy => enemy.state === 'hide',
    sprite: enemy => (enemy.state === 'hide' ? 'metHide' : 'metOpen'),
  },
  blader: {
    w: 14,
    h: 12,
    hp: 1,
    damage: 3,
    init(enemy, spawn) {
      enemy.state = 'approach';
      enemy.baseY = spawn.y + 8;
      enemy.y = enemy.baseY;
    },
    update: updateBlader,
    sprite: enemy => (Math.floor(enemy.anim / 3) % 2 ? 'blader1' : 'blader2'),
    drawOffset: () => ({ x: 0, y: 4 }),
  },
  screw: {
    w: 16,
    h: 8,
    hp: 3,
    damage: 2,
    init(enemy) {
      enemy.state = 'closed';
    },
    update: updateScrew,
    sprite(enemy) {
      if (enemy.state === 'closed') return 'screw0';
      if (enemy.timer < 4 || enemy.timer > 52) return 'screw1';
      return 'screw' + (2 + (Math.floor(enemy.anim / 3) % 3));
    },
  },
  blaster: {
    w: 14,
    h: 16,
    hp: 1,
    damage: 2,
    init(enemy, spawn) {
      enemy.facing = spawn.facing;
      enemy.x = spawn.x - 8 + spawn.facing * 7;
      enemy.y = spawn.y + 16;
      enemy.state = 'closed';
      enemy.timer = 40;
    },
    update: updateBlaster,
    shielded: enemy => enemy.state === 'closed',
    sprite(enemy) {
      if (enemy.state === 'closed') return enemy.timer < 6 ? 'beak1' : 'beak0';
      if (enemy.timer > 58 || enemy.timer < 6) return enemy.timer > 61 || enemy.timer < 3 ? 'beak1' : 'beak2';
      return 'beak3';
    },
    drawOffset: enemy => ({ x: enemy.facing > 0 ? -7 : 7, y: -8 }),
  },
  bigEye: {
    w: 26,
    h: 36,
    hp: 20,
    damage: 10,
    init(enemy) {
      enemy.timer = 50;
      enemy.jumps = 0;
    },
    update: updateBigEye,
    sprite(enemy) {
      if (!enemy.onGround) return enemy.vy < 0 ? 'bigEye2' : 'bigEye3';
      return enemy.timer < 8 ? 'bigEye1' : 'bigEye0';
    },
  },
  flea: {
    w: 14,
    h: 10,
    hp: 1,
    damage: 2,
    init(enemy) {
      enemy.timer = 20;
    },
    update: updateFlea,
    sprite: enemy => (enemy.onGround ? 'flea1' : 'flea2'),
  },
  pengs: {
    w: 2,
    h: 2,
    hp: 1,
    damage: 0,
    intangible: true,
    init(enemy) {
      enemy.timer = 20;
    },
    update: updatePengSpawner,
    sprite: () => null,
  },
  peng: {
    w: 20,
    h: 12,
    hp: 1,
    damage: 2,
    faceLeft: true,
    init(enemy, spawn) {
      enemy.baseY = spawn.y;
      enemy.vx = spawn.vx;
      enemy.facing = Math.sign(spawn.vx);
    },
    update: updatePeng,
    sprite: enemy => (Math.floor(enemy.anim / 8) % 2 ? 'peng2' : 'peng1'),
    drawOffset: () => ({ x: 0, y: -6 }),
  },
  joe: {
    w: 18,
    h: 24,
    hp: 10,
    damage: 4,
    faceLeft: true,
    init(enemy) {
      enemy.state = 'guard';
      enemy.timer = 40;
      enemy.jumps = 0;
    },
    update: updateJoe,
    shielded: enemy => enemy.state === 'guard' || enemy.state === 'jump',
    sprite(enemy) {
      if (enemy.state === 'jump') return 'joeJump';
      if (enemy.state === 'shoot') return 'joeShoot';
      return enemy.state === 'lower' ? 'joeLower' : 'joeShield';
    },
  },
  picketMan: {
    w: 20,
    h: 22,
    hp: 8,
    damage: 4,
    init(enemy) {
      enemy.state = 'guard';
      enemy.timer = 30;
    },
    update: updatePicketMan,
    shielded: enemy => enemy.state === 'guard',
    sprite(enemy) {
      if (enemy.state === 'windup') return 'picketMan1';
      return enemy.state === 'release' ? 'picketMan2' : 'picketMan0';
    },
  },
});
