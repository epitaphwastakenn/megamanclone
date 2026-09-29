// VARIABLES

const hiveHead = [
  '...........KKK.KKK..........',
  '...........KYK.KYK..........',
  '............K...K...........',
  '............KKKKK...........',
  '..........KKYYLYKK..........',
  '.........KnnnnnnnnK.........',
  '........KYLLYYYYYYYK........',
  '.......KnnnnnnnnnnnnK.......',
  '.......KYLYYYYYKKYYYK.......',
  '......KnnnnnnnnKKKKnnK......',
  '......KYLYYYYYYKKKKYYK......',
  '.....KnnnnnnnnnnKKnnnnK.....',
  '.....KKKKKKKKKKKKKKKKKK.....',
  '......KOKnnKSSSSSSSSK.......',
  '......KOKnnKSSSSSSSSSK......',
  '.......KKnnKSSSSSSSSSK......',
  '........KnnKSSSSSSSSSK......',
  '........KnnKSSSSSSSSSK......',
  '.........KKKKSSSSSSSK.......',
];

const hiveFaces = {
  normal: [['SSSSSWWKS', 'SSSSWWWKS', 'SSSSSWWKS', 'SSSSSSSSS', 'KSSSSKKKS'], 12, 13],
  blink: [['SSSSSSSSS', 'SSSSKKKKS', 'SSSSSSSSS', 'SSSSSSSSS', 'KSSSSKKKS'], 12, 13],
  shout: [['SSSSKWWKS', 'SSSSWWWKS', 'SSSSSWWKS', 'SSSSSKKKS', 'KSSSKKKKS'], 12, 13],
  cough: [['SSSSSSSSS', 'SSSSKSSKS', 'SSSSSKKSS', 'SSSSKKKKS', 'KSSSKKKKS'], 12, 13],
};

const hiveTorso = [
  '..KKKKKKKKKK..',
  '.KYYYYYYYYYYK.',
  'KYYLYYYYYYYYYK',
  'KKKKKKKKKKKKKK',
  'KYYYYYYYYYYYYK',
  'KYYYYYYYYYYYYK',
  'KKKKKKKKKKKKKK',
  '.KYYYYYYYYYYK.',
  '.KKKKKKKKKKKK.',
];

const hiveArms = {
  side: ['.KKKK.', 'KYYYYK', 'KYLYYK', 'KKKKKK', '.KYYK.', 'KKKKKK', 'KDDDDK', 'KDWDDK', '.KKKK.'],
  up: [
    '.KKKK..',
    'KDDDDK.',
    'KDWDDK.',
    'KKKKKK.',
    '.KYYK..',
    '.KYYK..',
    '.KYYYK.',
    '..KYYK.',
    '.KYYYYK',
    '.KYLYYK',
    '..KKKK.',
  ],
  point: [
    '.KKKK..........',
    'KYYYYKKKKKKKKK.',
    'KYLYYKYYKYYKDDK',
    'KKKKKKYYKYYKDWDK',
    '.....KKKKKKKDDDK',
    '...........KKKK.',
  ],
  out: [
    '............KKK.',
    '..........KKDDDK',
    '.KKKK...KKYKDWDK',
    'KYYYYKKKYYKKDDK.',
    'KYLYYKYYYKK.KK..',
    'KKKKKKKKK.......',
  ],
  mouth: [
    '..KKKK.',
    '.KDDDDK',
    '.KDWDDK',
    'KKKKKKK',
    'KYYKK..',
    'KYYK...',
    'KYYYK..',
    'KYLYK..',
    '.KKK...',
  ],
};

const hiveLegs = {
  stand: [
    '.KYYYYK.KYYYYK..',
    '.KYYYYK.KYYYYK..',
    '.KKKKKK.KKKKKK..',
    'KDDDDDK.KDDDDDK.',
    'KDDDDDDKKDDDDDDK',
    'KKKKKKKKKKKKKKKK',
  ],
  jump: [
    '.KYYYYK.KYYYYK..',
    'KYYYYK..KYYYYYK.',
    'KKKKKK...KKKKKK.',
    'KDDDDDK.KDDDDDK.',
    '.KDDDDK.KDDDDDDK',
    '..KKKK...KKKKKKK',
  ],
  dangle: [
    '..KYYYK.KYYYYK..',
    '..KYYYK..KYYYK..',
    '..KKKKK..KKKKK..',
    '..KDDDK...KDDDK.',
    '..KDDK....KDDK..',
    '...KK......KK...',
  ],
  crouch: [
    '.KYYYYKKKYYYYK..',
    'KKKKKKK.KKKKKKK.',
    'KDDDDDK.KDDDDDK.',
    'KDDDDDDKKDDDDDDK',
    'KKKKKKKKKKKKKKKK',
  ],
};

const hiveWings = {
  fold: ['..KKK..', '.KWWWK.', '.KWaaWK', '..KWaaK', '..KWaWK', '...KKK.'],
  up: [
    '.KKK....',
    'KWWWK...',
    'KWaaWK..',
    'KWaaaWK.',
    '.KWaaWK.',
    '..KWaaWK',
    '...KWWK.',
    '....KK..',
  ],
  down: ['...KKKKK.', '.KKWWWWWK', 'KWWaaaaWK', 'KWaaaaWK.', '.KKKKKK..'],
};

const hiveFaceHalf = [
  '................',
  '....KKK.........',
  '...KYYYK........',
  '...KYYYK........',
  '....KKK.........',
  '......K.........',
  '.......K........',
  '.........KKKKKKK',
  '.......KKYYLLYYY',
  '......KnnnnnnnnK',
  '.....KYYLYYYYYYY',
  '....KnnnnnnnnnnK',
  '....KYLYYYYYYYYY',
  '...KnnnnnnnnnnKK',
  '...KYLYYYYYYYKKK',
  '..KnnnnnnnnnnKKK',
  '..KYLYYYYYYYYKKK',
  '.KnnnnnnnnnnnnKK',
  '.KKKKKKKKKKKKKKK',
  '..KOKnKSSSSSSSSS',
  '..KOKnKSSSSSSSSS',
  '...KKnKSKKKKSSSS',
  '....KKSKWWWWKSSS',
  '....KSSKWWKKKSSS',
  '....KSSKWWKKKSSS',
  '....KSSSKKKKSSSS',
  '....KSSSSSSSSSSS',
  '.....KSSSSSSKKKK',
  '......KSSSSSSKKK',
  '.......KKSSSSSSS',
  '..KKKKKKKKKKKKKK',
  '.KYYYYYYYYYYYYYY',
];

const hiveBeeFrames = {
  up: [
    '...KK.KK...',
    '..KWaKWaK..',
    '..KWaKWaK..',
    '..KKKKKKKK.',
    '.KYKYKYYKWK',
    'KKYKYKYYKKK',
    '.KYKYKYYKK.',
    '..KKKKKKK..',
  ],
  down: [
    '...........',
    '...........',
    '.KKKK.KKKK.',
    'KWWaKKKaWKK',
    '.KKKYKYYKWK',
    'KKYKYKYYKKK',
    '.KYKYKYYKK.',
    '..KKKKKKK..',
  ],
};

const hiveSwarmFrames = {
  up: [
    '...KK.KK..',
    '..KWaKWaK.',
    '...KKKKKK.',
    '.KKYKYKKWK',
    'KKYKYKYKKK',
    '.KKYKYKKK.',
    '...KKKK...',
  ],
  down: [
    '..........',
    '..KKK.KKK.',
    '.KWaKKKaWK',
    '.KKYKYKKWK',
    'KKYKYKYKKK',
    '.KKYKYKKK.',
    '...KKKK...',
  ],
};

const hiveDroneFrames = {
  up: [
    '....KKK.KKK.....',
    '...KWWaKWWaK....',
    '...KWaaKWaaK....',
    '....KWKKKWK.....',
    '..KKKKKKKKKKKK..',
    '.KYYKYYKYYKKWWK.',
    'KKYYKYYKYYKKWKKK',
    '.KYYKYYKYYKKKKK.',
    '..KKKKKKKKKKKK..',
    '...K..K..K......',
  ],
  down: [
    '................',
    '................',
    '..KKKKK.KKKKK...',
    'KKWWaaKKKaaWWKK.',
    '.KKKKKKKKKKKKK..',
    '.KYYKYYKYYKKWWK.',
    'KKYYKYYKYYKKWKKK',
    '.KYYKYYKYYKKKKK.',
    '..KKKKKKKKKKKK..',
    '....K..K..K.....',
  ],
};

const hiveSkepRows = [
  '.......KK.......',
  '.......KK.......',
  '.....KKYYKK.....',
  '....KnnnnnnK....',
  '...KYLYYYYYYK...',
  '..KnnnnnnnnnnK..',
  '..KYLYYYYYYYYK..',
  '.KnnnnnnnnnnnnK.',
  '.KYLYYYYYYYYYYK.',
  'KnnnnnnKKKnnnnnK',
  'KYLYYYKKKKKYYYYK',
  'KnnnnnnKKKnnnnnK',
  'KYYYYYYYYYYYYYYK',
  '.KnnnnnnnnnnnnK.',
  '..KKKKKKKKKKKK..',
];

const hiveLadybugRows = {
  walk1: [
    '......KKKKKKK.........',
    '....KKRRRRRRRKK.......',
    '...KRRWRRKKRRRRK......',
    '..KRRRRRRKKRRRRRK.KK..',
    '..KRKKRRRRRRRKKRKKWWK.',
    '.KRRKKRRRRRRRKKRRKWKKK',
    '.KRRRRRRKKRRRRRRRKKKKK',
    '.KRRRRRRKKRRRRRRKKKKK.',
    '..KKKKKKKKKKKKKKKKKK..',
    '...KDK...KDK...KDK....',
    '..KDK...KDK...KDK.....',
  ],
  walk2: [
    '......KKKKKKK.........',
    '....KKRRRRRRRKK.......',
    '...KRRWRRKKRRRRK......',
    '..KRRRRRRKKRRRRRK.KK..',
    '..KRKKRRRRRRRKKRKKWWK.',
    '.KRRKKRRRRRRRKKRRKWKKK',
    '.KRRRRRRKKRRRRRRRKKKKK',
    '.KRRRRRRKKRRRRRRKKKKK.',
    '..KKKKKKKKKKKKKKKKKK..',
    '....KDK...KDK...KDK...',
    '....KDK...KDK...KDK...',
  ],
  open: [
    'KKK...................',
    'KRRKK.........KK......',
    'KRKKRK......KKRRK.....',
    '.KRRRRK....KRRKKRK....',
    '.KRKKRRK..KRRRRRRK....',
    '..KRRRRRKKRRKKRRK.....',
    '...KKKKKKKKKKKKKKKK...',
    '..KKDDDDDWWDDKKKKKDK..',
    '.KDDKKKKKKKKDDDDDDDKK.',
    '.KDDDDDDDDDDDDDDDKWWK.',
    '.KDDDDDDDDDDDDDDDKWKKK',
    '.KKDDDDDDDDDDDDDKKKKKK',
    '..KKKKKKKKKKKKKKKKKK..',
    '...KDK...KDK...KDK....',
    '..KDK...KDK...KDK.....',
  ],
};

const hiveTurretHeads = {
  closed: [
    '.......KK.......',
    '......KPPK......',
    '.....KPPPPK.....',
    '....KPPWPPPK....',
    '....KPPPPPPK....',
    '....KpPPPPpK....',
    '.....KpPPpK.....',
    '....KgKppKgK....',
    '...KggKKKKggK...',
    '....KKgeegKK....',
    '......KegK......',
  ],
  open: [
    '...KK.KKK.KK....',
    '..KPPKPPPKPPK...',
    '.KPPPKPWPKPPPK..',
    'KPPPKKYYYKKPPPK.',
    'KPPKYYnYYYYKPPK.',
    '.KKYYKKKKYnYKK..',
    'KPPKYKKKKKYYKPPK',
    'KPPKYYKKKYnYKPK.',
    '.KPPKYYnYYYKPPK.',
    '..KPPKKKKKKPPK..',
    '...KKgKKKKgKK...',
    '....KggeegggK...',
    '.....KKegKKK....',
  ],
  spit: [
    '...KK.KKK.KK....',
    '..KPPKPPPKPPK...',
    '.KPPPKPWPKPPPK..',
    'KPPPKKYYYKKPPPK.',
    'KPPKYKKKKKYKPPK.',
    '.KKYKKKKKKKYKK..',
    'KPPKYKKKKKKYKPPK',
    'KPPKYKKKKKKYKPK.',
    '.KPPKYKKKKYKPPK.',
    '..KPPKKKKKKPPK..',
    '...KKgKKKKgKK...',
    '....KggeegggK...',
    '.....KKegKKK....',
  ],
};

const hiveTurretStem = [
  '......KegK......',
  '......KegK......',
  '..KK..KegK......',
  '.KhgK.KegK......',
  '.KhggKKegK......',
  '..KhgggegK..KK..',
  '...KKKgegK.KghK.',
  '......KegKKgghK.',
  '......KeggggeK..',
  '......KegKKKK...',
  '......KegK......',
  '.....KKegKK.....',
  '....KgggeggK....',
  '...KKKKKKKKKK...',
];

const hivePetalRows = [
  '.....KKKKKKKKKKK',
  '...KKWWPPPPPPPPP',
  '.KKPPPPPPPPPPPPP',
  'KPPPPPPPPPPPPPPP',
  'KPPPPPPPPPPPpppp',
  '.KPPPPPPPppppKKK',
  '..KKppppppKKK...',
  '....KKKKKK......',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
];

const hiveVineRows = [
  '...KgK....KgK...',
  '...KgKKKKKKgK...',
  '...KgnnnnnngK...',
  '...KgNNNNNNgK...',
  '...KgKKKKKKgK...',
  '...KeK....KeK...',
  '..KheK....KgK...',
  '...KgK....KghK..',
  '...KgK....KgK...',
  '...KgKKKKKKgK...',
  '...KgnnnnnngK...',
  '...KgNNNNNNgK...',
  '...KgKKKKKKgK...',
  '...KgK....KeK...',
  '...KgK....KgK...',
  '...KeK....KgK...',
];

const hiveCombPattern = [
  'bfffffffbfffffff',
  'bfssffffbfssffff',
  'bfsfffffbfsfffff',
  'bfffffffbfffffff',
  'bfffffffbfffffff',
  'bfffffffbfffffff',
  'bbfffffbbbfffffb',
  'ffbbfbbfffbbfbbf',
  'ffffbfffffffbfff',
  'ffffbfssffffbfss',
  'ffffbfsfffffbfsf',
  'ffffbfffffffbfff',
  'ffffbfffffffbfff',
  'ffffbfffffffbfff',
  'fffbbbfffffbbbff',
  'fbbfffbbfbbfffbb',
];

// FUNCTIONS

function buildHive(options) {
  const width = options.width || 38;
  const legs = hiveLegs[options.legs || 'stand'];
  const wings = options.wings || 'fold';
  const arms = options.arms || 'side';
  const parts = [];
  if (wings === 'fold') parts.push([hiveWings.fold, 2, 15]);
  if (wings === 'up') parts.push([hiveWings.up, -1, 11]);
  if (wings === 'down') parts.push([hiveWings.down, -3, 19]);
  if (arms === 'side' || arms === 'point' || arms === 'mouth') parts.push([hiveArms.side, 3, 19]);
  if (arms === 'side') parts.push([hiveArms.side, 19, 19]);
  if (arms === 'point') parts.push([hiveArms.point, 19, 19]);
  if (arms === 'up') parts.push([hiveArms.up, 0, 9], [hiveFlipRows(hiveArms.up), 21, 9]);
  if (arms === 'out') parts.push([hiveFlipRows(hiveArms.out), -6, 18], [hiveArms.out, 19, 18]);
  parts.push([hiveTorso, 7, 19], [legs, 6, 28], [hiveHead, 0, 0]);
  parts.push(hiveFaces[options.face || 'normal']);
  const fists = hiveArms.up.slice(0, 4);
  if (arms === 'up') parts.push([fists, 0, 9], [hiveFlipRows(fists), 21, 9]);
  if (arms === 'mouth') parts.push([hiveArms.mouth, 17, 14]);
  const shifted = parts.map(([rows, x, y]) => [rows, x + 5, y]);
  return trimRight(composeArt(width, 28 + legs.length, shifted));
}

function hiveTrimTop(rows) {
  let start = 0;
  while (start < rows.length - 1 && !/[^.]/.test(rows[start])) start++;
  return rows.slice(start);
}

function hiveFlipRows(rows) {
  return rows.map(row => row.split('').reverse().join(''));
}

function buildHiveDash(wings) {
  const body = hiveTrimTop(rotateArt(buildHive({ wings: 'none' })));
  const width = body[0].length;
  const wingRows = wings === 'up' ? rotateArt(rotateArt(rotateArt(hiveWings.up))) : hiveWings.down;
  return hiveTrimTop(
    composeArt(width, body.length + 8, [
      [wingRows, 10, 8 - wingRows.length],
      [body, 0, 8],
    ]),
  );
}

function hiveCombRows(fill, border, shine) {
  const colors = { b: border, f: fill, s: shine };
  return hiveCombPattern.map(row => row.replace(/[bfs]/g, ch => colors[ch]));
}

function hiveHoneyCombRows() {
  const honey = (ch, x, y) =>
    x > 0 && x < 8 && y < 6 && ch !== 'r' ? (x < 4 && y < 3 ? 'W' : 'Y') : ch;
  return hiveCombRows('o', 'r', 'O').map((row, y) => row.replace(/./g, (ch, x) => honey(ch, x, y)));
}

function hiveDandelionRows(width) {
  const rows = [];
  const seedX = width / 2;
  for (let y = 0; y < 22; y++) {
    const line = new Array(width).fill('.');
    if (y < 8) {
      const inset = [3, 1, 0, 0, 0, 1, 2, 4][y];
      for (let x = inset; x < width - inset; x++) {
        const edge = x === inset || x === width - inset - 1 || y === 7;
        if (y === 0) line[x] = x % 3 === 1 ? 'W' : x % 3 === 2 ? 'K' : '.';
        else if (edge) line[x] = 'K';
        else if (y >= 5) line[x] = (x + y) % 2 ? 'a' : 'W';
        else line[x] = (x * 5 + y * 3) % 13 === 0 ? 'a' : 'W';
      }
      if (y === 7) for (let x = inset + 2; x < width - inset - 2; x += 4) line[x] = 'a';
    } else if (y < 18) {
      for (let strand = 0; strand < 7; strand++) {
        const fromX = 5 + strand * ((width - 10) / 6);
        const t = (y - 8) / 10;
        const x = Math.round(fromX + (seedX - 0.5 - fromX) * t);
        if (line[x] === '.') line[x] = 'G';
      }
    } else {
      const seed = ['KnnK', 'KnNK', '.KK.', '.K..'][y - 18];
      for (let i = 0; i < 4; i++) if (seed[i] !== '.') line[Math.floor(seedX) - 2 + i] = seed[i];
    }
    rows.push(line.join(''));
  }
  return rows;
}

// VARIABLES

const hiveArt = {
  hiveStand: { ox: 18, rows: buildHive({}) },
  hiveBlink: { ox: 18, rows: buildHive({ face: 'blink' }) },
  hivePose: { ox: 18, rows: buildHive({ arms: 'up', wings: 'up', face: 'shout' }) },
  hiveJump: { ox: 18, rows: buildHive({ arms: 'up', wings: 'up', legs: 'jump', face: 'shout' }) },
  hiveSummon: { ox: 18, rows: buildHive({ arms: 'up', face: 'shout' }) },
  hivePoint: { ox: 18, rows: buildHive({ arms: 'point', face: 'shout' }) },
  hiveFling: { ox: 18, rows: buildHive({ arms: 'out', wings: 'up', legs: 'jump', face: 'shout' }) },
  hiveFly1: { ox: 18, rows: buildHive({ wings: 'up', legs: 'dangle' }) },
  hiveFly2: { ox: 18, rows: buildHive({ wings: 'down', legs: 'dangle' }) },
  hiveCough: { ox: 18, rows: buildHive({ arms: 'mouth', face: 'cough', legs: 'crouch' }) },
  hiveCrouch: { ox: 18, rows: buildHive({ face: 'shout', legs: 'crouch' }) },
  hiveDash1: { rows: buildHiveDash('up') },
  hiveDash2: { rows: buildHiveDash('down') },
  hiveFace: { ox: 0, oy: 0, rows: mirrorArt(hiveFaceHalf) },
  hiveBee1: { ox: 5, oy: 4, rows: hiveBeeFrames.up },
  hiveBee2: { ox: 5, oy: 4, rows: hiveBeeFrames.down },
  hiveBeeSleep: { ox: 5, oy: 4, rows: hiveBeeFrames.down.slice().reverse() },
  hiveZ: { ox: 2, oy: 2, rows: ['WWWW', '..W.', '.W..', 'WWWW'] },
  honeyDrop: {
    ox: 3,
    oy: 4,
    rows: ['...K...', '..KOK..', '.KOWOK.', 'KOWOOOK', 'KOOOOOK', 'KoOOOoK', '.KoooK.', '..KKK..'],
  },
  honeyGlob: {
    ox: 6,
    oy: 6,
    rows: [
      '.....KK.....',
      '....KOOK....',
      '...KOOOOK...',
      '..KOWWOOOK..',
      '.KOWWOOOOOK.',
      'KOOWOOOOOOOK',
      'KOOOOOOOOOOK',
      'KOOOOOOOOOoK',
      'KoOOOOOOOooK',
      '.KooOOOOooK.',
      '..KKooooKK..',
      '....KKKK....',
    ],
  },
  honeyMark: {
    ox: 10,
    oy: 4,
    rows: [
      '.K...KK...K...KK...K.',
      'KOK.KOOK.KOK.KOOK.KOK',
      'KOOKOOOOKOOOKOOOOKOOK',
      'KKKKKKKKKKKKKKKKKKKKK',
    ],
  },
  honeyPuddle: {
    ox: 16,
    oy: 5,
    rows: [
      '.....KKKKKKKKKKKKKKKKKKKKKK.....',
      '..KKKYYWWYYYYYYYYYYYYWYYYYYKKK..',
      '.KOOOOOOOOOOOOOOOOOOOOOOOOOOOOK.',
      'KOOoOOOOOOOOOoOOOOOOOOOOoOOOOOOK',
      'KooooooooooooooooooooooooooooooK',
    ],
  },
  honeySplash1: { rows: ['.K......K.', 'KOK.KK.KOK', '.K.KOOK.K.', '..KOOOOK..'] },
  honeySplash2: { rows: ['K........K', '..........', '.K..KK..K.', 'KOKKOOKKOK'] },
  hiveSmoke1: { ox: 3, oy: 3, rows: ['.KKK..', 'KWWWK.', 'KWGWK.', 'KWWGK.', '.KKK..'] },
  hiveSmoke2: {
    ox: 5,
    oy: 4,
    rows: ['..KKK.KK..', '.KWWWKWWK.', 'KWWGWWWWGK', 'KWGGWWGWGK', '.KWWGGWWK.', '..KKKKKK..'],
  },
  hiveSmoke3: {
    ox: 6,
    oy: 5,
    rows: [
      '...KK..KK...',
      '..KGGKKGGK..',
      '.KGGGGGGGGK.',
      'KGGDGGGDGGGK',
      'KGDDGGDDGGK.',
      '.KGGGGGGGK..',
      '..KKKKKKK...',
    ],
  },
  swarmBee1: { ox: 5, oy: 4, rows: hiveSwarmFrames.up },
  swarmBee2: { ox: 5, oy: 4, rows: hiveSwarmFrames.down },
};

const hiveEnemyArt = {
  beeDrone1: { ox: 8, oy: 10, rows: hiveDroneFrames.up },
  beeDrone2: { ox: 8, oy: 10, rows: hiveDroneFrames.down },
  beeHive1: { oy: 0, rows: hiveSkepRows },
  beeHive2: {
    oy: 0,
    rows: [
      ...hiveSkepRows.slice(0, 9),
      'KnnnnnnKLKnnnnnK',
      'KYLYYYKLWLKYYYYK',
      'KnnnnnnKLKnnnnnK',
      ...hiveSkepRows.slice(12),
    ],
  },
  ladybugTank1: { ox: 11, rows: hiveLadybugRows.walk1 },
  ladybugTank2: { ox: 11, rows: hiveLadybugRows.walk2 },
  ladybugTankOpen: { ox: 11, rows: hiveLadybugRows.open },
  seedFlowerClosed: { ox: 8, rows: [...hiveTurretHeads.closed, ...hiveTurretStem] },
  seedFlowerOpen: {
    ox: 8,
    rows: [...hiveTurretHeads.open.slice(0, 12), ...hiveTurretStem.slice(1)],
  },
  seedFlowerSpit: {
    ox: 8,
    rows: [...hiveTurretHeads.spit.slice(0, 12), ...hiveTurretStem.slice(1)],
  },
  hiveSeed: { ox: 3, oy: 3, rows: ['.KKKK.', 'KnWnnK', 'KnnnNK', 'KnnNNK', '.KKKK.'] },
  hiveLadyShot: { ox: 3, oy: 3, rows: ['.KKK..', 'KDWDK.', 'KDDDK.', '.KKK..'] },
  hiveDripNub: {
    ox: 6,
    oy: 0,
    rows: ['KOOOOOOOOOOK', '.KOOWOOOOOK.', '..KKOOOOKK..', '....KOOK....', '.....KK.....'],
  },
  hiveDripSwell1: {
    ox: 6,
    oy: 0,
    rows: [
      'KOOOOOOOOOOK',
      '.KOOWOOOOOK.',
      '..KKOOOOKK..',
      '....KOOK....',
      '....KOWK....',
      '....KOOK....',
      '.....KK.....',
    ],
  },
  hiveDripSwell2: {
    ox: 6,
    oy: 0,
    rows: [
      'KOOOOOOOOOOK',
      '.KOOWOOOOOK.',
      '..KKOOOOKK..',
      '....KOOK....',
      '....KOOK....',
      '...KOWOOK...',
      '...KOOOOK...',
      '...KoOOoK...',
      '....KKKK....',
    ],
  },
  hiveDripSwell3: {
    ox: 6,
    oy: 0,
    rows: [
      'KOOOOOOOOOOK',
      '.KOOWOOOOOK.',
      '..KKOOOOKK..',
      '....KOOK....',
      '.....KOK....',
      '....KOOOK...',
      '...KOWOOOK..',
      '..KOWOOOOOK.',
      '..KOOOOOOOK.',
      '..KoOOOOOoK.',
      '...KoooooK..',
      '....KKKKK...',
    ],
  },
  hiveDandelion: { ox: 24, oy: 1, rows: hiveDandelionRows(48) },
  hiveCloud: {
    ox: 0,
    oy: 0,
    rows: [
      '..............KKKK..............',
      '.........KKK.KWWWWK..KKK........',
      '........KWWWKWWWWWWKKWWWK.......',
      '...KKK.KWWWWWWWWWWWWWWWWWK......',
      '..KWWWKWWWWWWWWWWWWWWWWWWWKKK...',
      '.KWWWWWWWWWWWWWWWWWWWWWWWWWWWK..',
      'KWWWWWWWWWWWWWWWWWWWWWWWWWWWWWK.',
      'KaWWWWaWWWWWWWaWWWWWWWaWWWWWaaK.',
      '.KaaaaaaaaaaaaaaaaaaaaaaaaaaaaK.',
      '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
    ],
  },
};

const hiveTileArt = {
  tileHiveGrass: {
    ox: 0,
    oy: 0,
    rows: [
      'hhhhhhhhhhhhhhhh',
      'hhhhhghhhhhhhghh',
      'ghhhgggghhhhgggh',
      'ggghgegggghggegg',
      'egggeeggggeeggee',
      'eeegNeeegeNeeeNe',
      'NeeNnNeeNNnNeNnN',
      'nNNnnnNNnnnnNnnn',
      'nnnnnnnnnnnnnnnn',
      'nnnNnnnnnnnnnnNn',
      'nnnnnnnoonnnnnnn',
      'nnnnnnnnnnnnnnnn',
      'nNnnnnnnnnnNnnnn',
      'nnnnnnoonnnnnnnn',
      'nnnnnnnnnnnnnNnn',
      'nnnnnnnnnnnnnnnn',
    ],
  },
  tileHiveDirt: {
    ox: 0,
    oy: 0,
    rows: [
      'nnnnnnnnnnnnnnnn',
      'nnnNnnnnnnnnnnNn',
      'nnnnnnnoonnnnnnn',
      'nnnnnnnnnnnnnnnn',
      'nNnnnnnnnnnNnnnn',
      'nnnnnnoonnnnnnnn',
      'nnnnnnnnnnnnnNnn',
      'nnnnnnnnnnnnnnnn',
      'nnnnnnnnnnNnnnnn',
      'nnoonnnnnnnnnnnn',
      'nnnnnnnNnnnnnnnn',
      'nnnnnnnnnnnnoonn',
      'nNnnnnnnnnnnnnnn',
      'nnnnnnnnNnnnnnnn',
      'nnnnnoonnnnnnnnN',
      'nnnnnnnnnnnnnnnn',
    ],
  },
  tileHiveHoneyTop: {
    ox: 0,
    oy: 0,
    rows: [
      'YYWWYYYYYYYWWYYY',
      'OYYYYOOOOYYYYOOO',
      'OOOOOOOOOOOOOOOO',
      'OOoOOOOOOOOOoOOO',
      'OOoOOOOOOOOOoOOO',
      'OOoOOOOOOOOOOOOO',
      'OOOOOOOYYOOOOOOO',
      'OOOOOOYOOYOOOOOO',
      'OOOOOOYOOYOOOoOO',
      'OOOOOOOYYOOOOoOO',
      'OOoOOOOOOOOOOoOO',
      'OOoOOOOOOOOOOOOO',
      'OOoOOOOOOOOOOOOO',
      'OOOOOOOOOOoOOOOO',
      'OOOOOOOOOOoOOOOO',
      'OOOOOOOOOOoOOOOO',
    ],
  },
  tileHiveHoney: {
    ox: 0,
    oy: 0,
    rows: [
      'OOoOOOOOOOOOOOOO',
      'OOoOOOOOOOOOoOOO',
      'OOOOOOOOOOOOoOOO',
      'OOOOOOOOOOOOoOOO',
      'OOOOOYYOOOOOOOOO',
      'OOOOYOOYOOOOOOOO',
      'OOOOYOOYOOOOOOOO',
      'OoOOOYYOOOOOOOOO',
      'OoOOOOOOOOOoOOOO',
      'OoOOOOOOOOOoOOOO',
      'OOOOOOOOOOOoOOOO',
      'OOOOOOOOOOOOOOOO',
      'OOOOOOOOOOOOOYYO',
      'OOOoOOOOOOOOYOOY',
      'OOOoOOOOOOOOYOOY',
      'OOOoOOOOOOOOOYYO',
    ],
  },
  tileHivePetalL: { ox: 0, oy: 0, rows: hivePetalRows },
  tileHivePetalR: { ox: 0, oy: 0, rows: hiveFlipRows(hivePetalRows) },
  tileHivePetalC: {
    ox: 0,
    oy: 0,
    rows: [
      'KKKKKKKKKKKKKKKK',
      'YYYnYYYYYYnYYYYY',
      'YnYYYYnYYYYYYnYY',
      'YYYYYYYYnYYYYYYY',
      'pYYnYYYYYYYYnYYp',
      'KppYYYYnYYYYYppK',
      '.KKpppYYYYYpppK.',
      '...KKKppppppKK..',
      '.....KKgggKK....',
      '......KehgK.....',
      '......KehgK.....',
      '......KehgK.....',
      '......KehgK.....',
      '......KehgK.....',
      '......KehgK.....',
      '......KehgK.....',
    ],
  },
  tileHiveStem: {
    ox: 0,
    oy: 0,
    rows: new Array(16).fill('......KehgK.....'),
  },
  tileHiveStemLeaf: {
    ox: 0,
    oy: 0,
    rows: [
      '......KehgK.....',
      '......KehgK.....',
      '......KehgKKK...',
      '......KehgKhgKK.',
      '......KehgKhhggK',
      '......KehgggghgK',
      '......KeheggggK.',
      '......KehgKKKK..',
      '...KK.KehgK.....',
      '.KKggKKehgK.....',
      'KhhggggehgK.....',
      'KhgggeeehgK.....',
      '.KKeeKKehgK.....',
      '...KK.KehgK.....',
      '......KehgK.....',
      '......KehgK.....',
    ],
  },
  tileHiveBark: {
    ox: 0,
    oy: 0,
    rows: [
      'NnNNNKNNnNNNNKNN',
      'NnNNNKNNnNNNNKNN',
      'NnNNKNNNnNNNKNNN',
      'NnNNKNNNnNNNKNNn',
      'NNnNKNNNNnNNKNNn',
      'NNnNNKNNNnNNNKNn',
      'NNnNNKNNNnNNNKNN',
      'NNnNNKNNNnNNKNNN',
      'NnNNNKNNnNNNKNNN',
      'NnNNKNNNnNNNNKNN',
      'NnNNKNNNnNNNNKNN',
      'NNnNKNNNNnNNNKnN',
      'NNnNNKNNNnNNKNnN',
      'NNnNNKNNNnNNKNnN',
      'NnNNNKNNnNNNKNNN',
      'NnNNNKNNnNNNNKNN',
    ],
  },
  tileHiveWax: { ox: 0, oy: 0, rows: hiveCombRows('Y', 'n', 'L') },
  tileHiveWaxCrack: {
    ox: 0,
    oy: 0,
    rows: recolorArt(hiveCombRows('Y', 'n', 'L'), {}).map((row, y) =>
      y === 3 || y === 9 || y === 13 ? row.slice(0, 4) + 'KKK' + row.slice(7) : row,
    ),
  },
  tileHiveComb: { ox: 0, oy: 0, rows: hiveCombRows('o', 'r', 'O') },
  tileHiveCombHoney: { ox: 0, oy: 0, rows: hiveHoneyCombRows() },
  tileHiveBranch: {
    ox: 0,
    oy: 0,
    rows: [
      'KKKKKKKKKKKKKKKK',
      'nnnnnnnnnnnnnnnn',
      'nnNnnnnnnnnnNnnn',
      'NNNNnnnnNNNNNNNn',
      'NNNNNNNNNNNNNNNN',
      'NnNNNNKNNNNNNnNN',
      'NNNNNNNNNNNNNNNN',
      'NNNNnNNNNNNKNNNN',
      'NNNNNNNNNNNNNNNN',
      'NNKNNNNNnNNNNNNN',
      'NNNNNNNNNNNNNKNN',
      'NNNnNNNNNNNNNNNN',
      'NNNNNNNKNNNNNNNN',
      'KNNNNNNNNNNNNNNK',
      '.KKKNNNNNNNNKKK.',
      '....KKKKKKKK....',
    ],
  },
  tileHiveLeaves: {
    ox: 0,
    oy: 0,
    rows: [
      '...KKK....KKK...',
      '..KhhgK..KhggK..',
      '.KhggggKKhggggK.',
      '.KgggegKKggeggK.',
      '..KgeeKhhKgeeK..',
      '.KKKKKhgggKKKK..',
      'KhhgKKggeggKhhK.',
      'KhgggKgeegKhgggK',
      'KggegKKeeKKggegK',
      '.KeeK.KKKK.KeeK.',
      '..KK.KhhK...KK..',
      '....KhgggK......',
      '....KggegK......',
      '.....KeeK.......',
      '......KK........',
      '................',
    ],
  },
  tileHiveVine: {
    ox: 0,
    oy: 0,
    rows: composeArt(16, 16, [
      [hiveCombRows('o', 'r', 'O'), 0, 0],
      [hiveVineRows, 0, 0],
    ]),
  },
  tileHiveFlowers: {
    ox: 0,
    oy: 0,
    rows: [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '.........KK.....',
      '..KK....KWWK....',
      '.KPPK..KWYYWK...',
      'KPYYPK..KWWK....',
      '.KPPK....KgK....',
      '..KgK....Kg.....',
      '..Kg.K..KgK.....',
      '..KgKgK.Kg...KK.',
      '...KgK..KgK.KYYK',
      '...Kg....Kg..KgK',
    ],
  },
};

// INITIALIZATION

Object.assign(palettes, {
  megaHive: { B: 0x18, C: 0x28, v: 0x08 },
  orbHive: { C: 0x28, W: 0x30 },
  hiveDaisy: { P: 0x30, p: 0x10, W: 0x31 },
  hiveChamber: { o: 0x07, r: 0x0F, O: 0x17 },
});

registerArt(hiveArt, 'boss');
registerArt(hiveEnemyArt, 'enemy');
registerArt(hiveTileArt, 'enemy');

registerAnimations([
  {
    label: 'Hive Man',
    fps: 4,
    frames: [
      'hiveStand',
      'hiveStand',
      'hiveBlink',
      'hiveStand',
      'hivePose',
      'hiveSummon',
      'hivePoint',
      'hiveJump',
      'hiveFling',
      'hiveCough',
    ],
  },
  { label: 'Hive Man voando', fps: 15, frames: ['hiveFly1', 'hiveFly2'] },
  { label: 'Retrato Hive Man', fps: 1, frames: ['hiveFace'] },
  { label: 'Hive Man investida', fps: 15, frames: ['hiveDash1', 'hiveDash2'] },
  { label: 'Abelhas do Hive Man', fps: 15, frames: ['hiveBee1', 'hiveBee2'] },
  {
    label: 'Mel',
    fps: 4,
    frames: ['honeyDrop', 'honeyGlob', 'honeyMark', 'honeyPuddle', 'honeySplash1', 'honeySplash2'],
  },
  { label: 'Fumaca', fps: 6, frames: ['hiveSmoke1', 'hiveSmoke2', 'hiveSmoke3'] },
  { label: 'Hive Swarm', fps: 15, frames: ['swarmBee1', 'swarmBee2'] },
  {
    label: 'Arma Hive Swarm',
    fps: 6,
    frames: [
      { sprite: 'megaShoot', palette: 'mega' },
      { sprite: 'megaShoot', palette: 'megaHive' },
    ],
  },
  { label: 'Bee Drone', fps: 15, frames: ['beeDrone1', 'beeDrone2'] },
  { label: 'Dente-de-leao', fps: 1, frames: ['hiveDandelion'] },
  { label: 'Colmeia', fps: 3, frames: ['beeHive1', 'beeHive2'] },
  {
    label: 'Joaninha',
    fps: 4,
    frames: [
      'ladybugTank1',
      'ladybugTank2',
      'ladybugTank1',
      'ladybugTank2',
      'ladybugTankOpen',
      'ladybugTankOpen',
    ],
  },
  {
    label: 'Flor atiradora',
    fps: 3,
    frames: ['seedFlowerClosed', 'seedFlowerOpen', 'seedFlowerSpit', 'hiveSeed'],
  },
  {
    label: 'Gota de mel',
    fps: 4,
    frames: ['hiveDripNub', 'hiveDripSwell1', 'hiveDripSwell2', 'hiveDripSwell3', 'honeyDrop'],
  },
]);
