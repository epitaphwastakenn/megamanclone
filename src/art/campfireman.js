// VARIABLES

const campfireFlames = {
  n0: [
    '......R.......',
    '.....ROR......',
    '..R..ROR...R..',
    '..RR.ROYR.RR..',
    '.ROR.ROYRROR..',
    '.ROYRRYYRROYR.',
    'RROYORYWYROYR.',
    'ROYYYYWWYYYOR.',
    'ROYYWWWWWWYOR.',
    '.ROYWWWWWWYOR.',
  ],
  n1: [
    '....R.........',
    '....ROR.......',
    '...ROR...R....',
    '..ROYR...RR...',
    '..ROYR.RROR...',
    '.ROYRROYYOR...',
    '.ROYYRYYYORR..',
    'RROYYWYYYYOR..',
    'ROYYWWWWWWYOR.',
    '.ROYWWWWWWYOR.',
  ],
  n2: [
    '........R.....',
    '.......RR.....',
    '...R..ROR.....',
    '..RR..ROYR.R..',
    '..ROR.RYOR.RR.',
    '..ROYRRYYORYOR',
    '.RROYORYWYOYOR',
    '.ROYYYWWYYYYOR',
    'ROYYWWWWWWYOR.',
    '.ROYWWWWWWYOR.',
  ],
  b0: [
    '.......R........',
    '......ROR.......',
    '.R....ROR....R..',
    '.RR..ROYOR..RR..',
    '.ROR.ROYOR.ROR..',
    'ROYR.RYWYR.ROYR.',
    'ROYRROYWYORRYOR.',
    'ROYYRYWWWYRYYOR.',
    'ROYWYYWWWYYWYYOR',
    'RYYWWWWWWWWWWYOR',
    'ROYWWWWWWWWWWYOR',
    '.RYWWWWWWWWWWYR.',
    '.ROYWWWWWWWWYOR.',
  ],
  b1: [
    '........R.......',
    '.......ROR......',
    '..R....ROR...R..',
    '..RR..ROYOR.RR..',
    '.ROR..ROYOR.ROR.',
    '.ROYR.RYWYR.RYOR',
    'RROYRROYWYORRYOR',
    'ROYYORYWWWYRYYOR',
    'ROYWYYWWWYYWYYOR',
    'ROYWWWWWWWWWWYYR',
    'ROYWWWWWWWWWWYOR',
    '.RYWWWWWWWWWWYR.',
    '.ROYWWWWWWWWYOR.',
  ],
  s0: [
    '.......KKKK...',
    '......KGWWGK..',
    '..KKK.KGWGGDK.',
    '.KGWGKKGGGDDK.',
    '.KGGGKKKDDDK..',
    '..KDDKGWWGK...',
    '...KKGWWGGGKK.',
    '..KGGWGGGGDGGK',
    '.KGWGGGGGDDDDK',
    '.KGGGGGDDDDKK.',
  ],
  s1: [
    '..KKK.........',
    '.KGWGK..KKK...',
    '.KGGDK.KGWGK..',
    '..KKK.KGWGGDK.',
    '....KKKGGGDDK.',
    '...KGWWKDDDK..',
    '..KGWWGGKKKKK.',
    '..KGWGGGGDGGK.',
    '.KGWGGGGGDDDDK',
    '.KGGGGGDDDDKK.',
  ],
};

const campfireStoneBig = [
  '..KKKK..',
  '.KWWGGK.',
  'KWWGGGGK',
  'KWGGGGDK',
  'KGGGGDDK',
  '.KKKKKK.',
];

const campfireStoneSmall = [
  '.KKKK.',
  'KWGGGK',
  'KGGGDK',
  'KGGDDK',
  '.KKKK.',
];

const campfireHelmet = [
  '..KKKKKKKKKKKKKK..',
  '.KDDDDDDDDDDDDDDK.',
  '.KDDDDDDDDDDDDDDK.',
  '.KDDKKKDKKKKKKKKKK',
  '.KDKOYOKKSSSSSSSSK',
  '.KDKYWYKKSSKKSSSKK',
  '.KDKOYOKKSWWKKSKWK',
  '.KDDKKKDKSWWKKSKWK',
  '.KDDDDDDKSSSSSSSSK',
  '..KDDDDDKSSSKKKKSK',
  '...KKKKKKKKKKKKKK.',
];

const campfireFaces = {
  blink: [['SSSSSSSS', 'SKKKKSKK', 'SSSSSSSS'], 9, 5],
  shout: [['SKKKSSKK', 'SWWKKSKW', 'SWWKKSKW', 'SSSSSSSS', 'SSSKKKKS', 'SSSKrrKS'], 9, 4],
  hurt: [['SKSSSSKS', 'SSKKSKKS', 'SKSSSSKS', 'SSSSSSSS', 'SSSKKKKS'], 9, 4],
};

const campfireTorso = [
  '...KKKKKKKKKKKKKK...',
  '..KVVVVVVVVVVVVVVK..',
  '.KVVVVVVKKKKVVVVVpK.',
  '.KVVVVVKOYYOKVVVVpK.',
  '.KVVVVKOYWWYOKVVVpK.',
  '.KVVVVKOYWWYOKVVVpK.',
  '.KpVVVVKOYYOKVVVppK.',
  '..KpVVVVKKKKVVVppK..',
  '..KNNNNNNYYNNNNNNK..',
  '..KKKKKKKKKKKKKKKK..',
];

const campfireShoulder = [
  '..KKKK..',
  '.KWWGGK.',
  'KWGGGGGK',
  'KGGGGGDK',
  '.KKKKKK.',
];

const campfireArms = {
  side: [
    '.KKKKK.',
    'KnNnnNK',
    'KnNnnNK',
    'KnNnnNK',
    'KnNnNNK',
    'KnNnnNK',
    'KKKKKKK',
    'KWWGGGK',
    'KGGGGDK',
    '.KKKKK.',
  ],
  up: [
    '.KKKKK.',
    'KWWGGGK',
    'KGGGGDK',
    'KKKKKKK',
    'KnNnnNK',
    'KnNnnNK',
    'KnNnNNK',
    'KnNnnNK',
    'KnNnnNK',
    '.KKKKK.',
  ],
  throw: [
    '.KKKKKKKK.....',
    'KNNNNNNNNKKKK.',
    'KnnnnnnnnKWWGK',
    'KnnnnnnnnKGGGK',
    'KNNNnnNNNKGGDK',
    '.KKKKKKKK.KKK.',
  ],
  back: [
    '.KKKKK.',
    'KWWGGGK',
    'KGGGGDK',
    'KKKKKKK',
    'KnNnnNK',
    'KnNnnNK',
    'KnNnNNK',
    'KnNnnNK',
    'KnNnnNK',
    'KnNnnNK',
    '.KKKKK.',
  ],
  fist: [
    '.KKKKK.',
    'KnNnnNK',
    'KnNnnNK',
    'KKKKKKK',
    'KWWGGGK',
    'KGGGGDK',
    'KKKKKKK',
  ],
};

const campfireStick = [
  '..........KKK',
  '.........KWWSK',
  '........KKWSSK',
  '.......KNKKKK.',
  '......KNK.....',
  '.....KNK......',
  '....KNK.......',
  '...KNK........',
  '..KNK.........',
  '..KK..........',
];

const campfireHeldLog = [
  '....R....R...R..',
  '...ROR..ROR.ROR.',
  '..RYOR.RYORRYOYR',
  '..RYYORRYYORYYOR',
  '.KKKKKKKKKKKKKK.',
  'KSSKNNnnnNNnnnNK',
  'KSnSKnnnnnnnnnnK',
  'KSSKNNnnNNnnnNNK',
  '.KKKKKKKKKKKKKK.',
];

const campfireLegs = {
  stand: [
    '....KnNnnK..KnNnnK...',
    '....KnNnnK..KnNnnK...',
    '....KnNNnK..KnNnnK...',
    '...KKKKKKK.KKKKKKKK..',
    '..KWWGGGGK.KWWGGGGGK.',
    '..KGGGGGDK.KGGGGGGDK.',
    '..KKKKKKKK.KKKKKKKKK.',
  ],
  crouch: [
    '..KnNnnNKKnNnnNK.....',
    '.KKKKKKKKKKKKKKKK....',
    'KWWGGGGGKKWWGGGGGK...',
    'KGGGGGGDKKGGGGGGDK...',
    'KKKKKKKKKKKKKKKKKK...',
  ],
  jump: [
    '....KnNnnK..KnNnnK...',
    '....KnNnnK..KKKKKKKK.',
    '....KnNNnK.KWWGGGGGK.',
    '...KKKKKKK.KGGGGGGDK.',
    '..KWWGGGGK.KKKKKKKKK.',
    '..KGGGGGDK...........',
    '..KKKKKKKK...........',
  ],
  dash: [
    '....KnNnnK.KnNnnK....',
    '...KnNnnK...KnNnnK...',
    '..KnNNnK.....KKKKKKKK',
    '.KKKKKKK....KWWGGGGGK',
    'KWWGGGGK....KGGGGGGDK',
    'KGGGGGDK....KKKKKKKKK',
    'KKKKKKKK.............',
  ],
};

const campfireLogBody = [
  '.KKKKKKKKKKKK.',
  'KSSKnNNnnnNNnK',
  'KSnSKnnnnnnnnK',
  'KSSKNnnNNnnnNK',
  '.KKKKKKKKKKKK.',
];

const campfireStickLog = [
  '.KKKKKKKK.',
  'KSSKnNNnnK',
  'KSnSKnnnnK',
  'KSSKNnnNNK',
  '.KKKKKKKK.',
];

const campfireFireBase = [
  '.KKKKKKKKKKKKKK.',
  'KNNnnnNNnnnnNNnK',
  'KnRnnOnnnRnnOnnK',
  '.KKKKKKKKKKKKKK.',
];

const campfireFireProfiles = [
  [2, 5, 9, 7, 12, 16, 20, 22, 18, 14, 11, 15, 12, 7, 4, 2],
  [3, 7, 6, 10, 14, 18, 16, 21, 22, 17, 12, 9, 13, 9, 5, 2],
  [2, 4, 8, 12, 10, 15, 21, 19, 22, 16, 13, 16, 10, 8, 6, 3],
];

const campfireEmberArt = [
  [
    '.RRR.',
    'ROYOR',
    'RYWYR',
    'ROYOR',
    '.RRR.',
  ],
  [
    '..R..',
    '.ROR.',
    'ROYWR',
    '.ROR.',
    '..R..',
  ],
];

const campfireSparkArt = [
  [
    '..Y..',
    '.YWY.',
    'YWWWY',
    '.YWY.',
    '..Y..',
  ],
  [
    '.....',
    '..O..',
    '.OYO.',
    '..O..',
    '.....',
  ],
];

const campfireSmokeArt = [
  [
    '.GGG..',
    'GWWGG.',
    'GWGGGD',
    'GGGGDD',
    '.GDDD.',
  ],
  [
    '..GGGG..',
    '.GWWGGG.',
    'GWWGGGGD',
    'GWGGGGDD',
    'GGGGGDDD',
    '.GGDDDD.',
    '..DDDD..',
  ],
  [
    '...DDDD...',
    '..DGGGDDD.',
    '.DGG.GGDDD',
    'DGG...GGDD',
    'DG.....GDD',
    'DG......DD',
    '.DG....DD.',
    '..DDDDDD..',
  ],
];

const campfireFaceHalf = [
  '...............R',
  '..............RO',
  '.......R......RO',
  '.......RR....ROY',
  '......ROR....ROY',
  '......ROYR..ROYY',
  '.....ROYYR.ROYYW',
  '.....ROYYORRYYWW',
  '....ROYYYYOYYWWW',
  '...KKKKKYYYWWWWW',
  '..KWWGGKKKKKKKKK',
  '.KWGGGGDKWWGGGGG',
  '.KGGGGDDKWGGGGGG',
  'KKKKKKKKKGGGGGGD',
  'KWWGGGKKKKKKKKKK',
  'KWGGGGDKDDDDDDDD',
  'KGGGGDDKDDDDDDDD',
  '.KKKKKKDDKKKKKKK',
  '.KDDDDDDKKKKKKKK',
  'KDDKKKDKSSSSSSSS',
  'KDKOYOKKSKKKKSSS',
  'KDKYWYKKSWWWWKSS',
  'KDKOYOKKSWWKKKSS',
  'KDDKKKDKSWWKKKSS',
  '.KDDDDDKSSSSSSSq',
  '..KDDDDKSSSSSSSq',
  '..KDDDDKSSSSSKKK',
  '...KKKKKKKSSSSSS',
  'KKKK..KKKKKKKKKK',
  'WWGGKKVVVVVKKKKK',
  'WGGGKVVVVVKOYYYY',
  'GGGDKVVVVVKOYWWW',
];

const campfireBatHalves = {
  hang: [
    '....K',
    '...KK',
    '..Krr',
    '.KOrr',
    'KOrrr',
    'KORrr',
    'KORrr',
    'KOrKK',
    '.KrK.',
    '..K..',
  ],
  wake: [
    '....K',
    '...KK',
    '..Krr',
    '.KOrr',
    'KOrYr',
    'KORrr',
    'KORrr',
    'KOrKK',
    '.KrK.',
    '..K..',
  ],
  up: [
    'KK.......',
    'KOK......',
    'KROK..K..',
    'KrROK.KK.',
    '.KrROKKrr',
    '..KrROKYr',
    '...KKKrrr',
    '......KKr',
    '........K',
  ],
  down: [
    '.........',
    '......K..',
    '......KK.',
    '...KKKKrr',
    '..KOrrKYr',
    '.KORrrKrr',
    'KORrKKKKr',
    'KOrK....K',
    'KrK......',
    'KK.......',
  ],
};

const campfireBotBody = [
  '....KKKKKK....',
  '...KnnnnnnK...',
  '..KnOOOOOOnK..',
  'KKKKKKKKKKKKKK',
  'KNNNNNNNNNNNNK',
  '.KggggggggggK.',
  '.KgKKKKKKKKgK.',
  '.KgKYYKKYYKgK.',
  '.KgKKKKKKKKgK.',
  '.KggggggggggK.',
  'KegggggggggggK',
  'KeegggggggggeK',
  'KeeggggggggeeK',
  'KeeegggggeeeeK',
  '.KeeeeeeeeeeK.',
  '..KKKKKKKKKK..',
  '.KnSSnnnSSnnK.',
  '.KnnNnnnnNnnK.',
  '.KnNnnnNnnnnK.',
  '.KKKKKKKKKKKK.',
];

const campfireBotArms = {
  roast: [
    '.........KKK.',
    '........KWWSK',
    '.......KNWSSK',
    '......KNKKKK.',
    '....KKNK.....',
    '..KKnNK......',
    '.KnnnK.......',
    'KnnKK........',
    'KKK..........',
  ],
  lower: [
    '.............',
    '.............',
    '.........KKK.',
    '........KWWSK',
    '......KKNWSSK',
    '...KKKNKKKKK.',
    '.KKnnNK......',
    'KnnnKK.......',
    'KKKK.........',
  ],
  raise: [
    '..KKKK',
    '.KWWWSK',
    '.KWWSSK',
    '..KKKK.',
    '...KNK.',
    '...KNK.',
    '...KNK.',
    '...KNK.',
    '..KnnK.',
    '.KnnnK.',
    'KnnKK..',
    'KKK....',
  ],
  throw: [
    '.KKKKK......',
    'KnnnnKKKKKK.',
    'KnnnnNNNNNNK',
    '.KKKKKKKKKK.',
  ],
};

const campfireMallowBody = [
  '.KKKK.',
  'KWWWSK',
  'KWWSSK',
  '.KKKK.',
];

const campfireRollFace = [
  '....KKKKKK....',
  '..KKNNNNNNKK..',
  '.KNNSSSSSSNNK.',
  '.KNSSnnnnSSNK.',
  'KNSSnSSSSnSSNK',
  'KNSnSSnnSSnSNK',
  'KNSnSnSSnSnSNK',
  'KNSnSnSRnSnSNK',
  'KNSnSSnROSnSNK',
  'KNSSnSSSORnSNK',
  '.KNSSnnnnROSK.',
  '.KNNSSSSSSRONK',
  '..KKNNNNNNKK..',
  '....KKKKKK....',
];

const campfireLogEnd = [
  '..KKKKKK..',
  '.KNNNNNNK.',
  'KNSSSSSSNK',
  'KNSnnnnSNK',
  'KNSnSSnSNK',
  'KNSnSSnSNK',
  'KNSnnnnSNK',
  'KNSSSSSSNK',
  '.KNNNNNNK.',
  '..KKKKKK..',
];

const campfireLogEndSmall = [
  '.KKKKK.',
  'KNNNNNK',
  'KNSSSNK',
  'KNSnSNK',
  'KNSSSNK',
  'KNNNNNK',
  '.KKKKK.',
];

const campfireDirtRows = [
  'NNNNNNNNNNNNNNNN',
  'NNVNNNNNNNNNKNNN',
  'NNNNNNNnNNNNNNNN',
  'NKNNNNNNNNNNNNVN',
  'NNNNNVNNNNKNNNNN',
  'NNNNNNNNNNNNNNNN',
  'NNnNNNNNNVNNNNNN',
  'NNNNNNKNNNNNNnNN',
  'NNNNNNNNNNNNNNNN',
  'NVNNNNNNNNNNKNNN',
  'NNNNNnNNNNVNNNNN',
  'NNNNNNNNNNNNNNNN',
  'NNNKNNNNNnNNNNVN',
  'NNNNNNNNNNNNNNNN',
  'NnNNNNVNNNNNKNNN',
  'NNNNNNNNNNNNNNNN',
];

const campfireLogWallRows = [
  'KKKKKKKKKKKKKKKK',
  'ooooOooooooooOoo',
  'oVoooooooVoooooo',
  'VVVVVVVVVVVVVVVV',
  'VVVNVVVVVVVVNVVV',
  'NNNNNNNNNNNNNNNN',
  'nKnnKnnnKnnnKnnK',
  'KKKKKKKKKKKKKKKK',
];

const campfireTableRows = [
  'KKKKKKKKKKKKKKKK',
  'OOOOOOOOOOOOOOOO',
  'nnnnnnnnnnnnnnnn',
  'NNNNNNNNNNNNNNNN',
  'KKKKKKKKKKKKKKKK',
  '....KnK.........',
  '....KnK.........',
  '...KnK..........',
  'KKKKKKKKKKKKKKKK',
  'OOOOOOOOOOOOOOOO',
  'NNNNNNNNNNNNNNNN',
  'KKKKKKKKKKKKKKKK',
  '..KnK...........',
  '.KnK............',
  '.KnK............',
  'KnK.............',
];

const campfirePitRows = [
  [
    '..R...K.K..Y..R.',
    '.ROR.KNKNK.RY.K.',
    'RYOKNKRYOKNROKNK',
    'KKKKKKKKKKKKKKKK',
    'KWWGGKWWGGGKWWGK',
    'KWGGGKWGGGDKWGGK',
    'KGGGDKGGGDDKGGDK',
    'KKKKKKKKKKKKKKKK',
  ],
  [
    '...R..K.K.R...Y.',
    '..RYR.KNKNRO..R.',
    'ROYKNKOYRKNRYKNK',
    'KKKKKKKKKKKKKKKK',
    'KWWGGKWWGGGKWWGK',
    'KWGGGKWGGGDKWGGK',
    'KGGGDKGGGDDKGGDK',
    'KKKKKKKKKKKKKKKK',
  ],
];

// FUNCTIONS

function campfireCrown(dx, dy) {
  return [
    [campfireStoneSmall, dx, dy + 1],
    [campfireStoneBig, dx + 4, dy + 2],
    [campfireStoneBig, dx + 10, dy + 2],
    [campfireStoneSmall, dx + 16, dy + 1],
  ];
}

function buildCampfire(options) {
  const base = 6;
  const flame = campfireFlames[options.flame || 'n0'];
  const drop = options.drop || 0;
  const lean = options.lean || 0;
  const front = options.front || 'side';
  const back = options.back || 'side';
  const top = 4 + drop + (options.legs === 'crouch' ? 2 : 0);
  const upper = (rows, x, y) => [rows, base + x + lean, y + top];
  const parts = [];
  if (back === 'back') parts.push(upper(campfireHeldLog, -9, -1));
  parts.push(upper(flame, 6 - (flame[0].length > 14 ? 1 : 0), 9 - flame.length));
  parts.push(upper(campfireHelmet, 4, 9));
  if (options.face && options.face !== 'normal') {
    const [rows, fx, fy] = campfireFaces[options.face];
    parts.push(upper(rows, 4 + fx, 9 + fy));
  }
  for (const [rows, x, y] of campfireCrown(2, 4)) parts.push(upper(rows, x, y));
  const legs = campfireLegs[options.legs || 'stand'];
  parts.push([legs, base + 2, 39 - legs.length]);
  if (back === 'side') parts.push(upper(campfireArms.side, 0, 21));
  if (back === 'up') parts.push(upper(campfireArms.up, 0, 11));
  if (back === 'back') parts.push(upper(campfireArms.back, -2, 8));
  parts.push(upper(campfireTorso, 3, 19));
  parts.push(upper(campfireShoulder, -1, 18));
  if (front === 'side' || front === 'stick') parts.push(upper(campfireArms.side, 21, 21));
  if (front === 'stick') parts.push(upper(campfireStick, 22, 12));
  if (front === 'up') parts.push(upper(campfireArms.up, 21, 11));
  if (front === 'throw') parts.push(upper(campfireArms.throw, 20, 21));
  if (front === 'fist') parts.push(upper(campfireArms.fist, 20, 21));
  parts.push(upper(campfireShoulder, 20, 18));
  return composeArt(44, 39, parts);
}

function campfireSprite(options) {
  return { ox: 19, rows: trimRight(buildCampfire(options)) };
}

function campfireFlameArt(profile) {
  const width = profile.length;
  const height = Math.max(...profile);
  const inside = (x, y) => x >= 0 && x < width && (y >= height || y >= height - profile[x]);
  const rows = [];
  for (let y = 0; y < height; y++) {
    let row = '';
    for (let x = 0; x < width; x++) {
      if (!inside(x, y)) {
        row += '.';
        continue;
      }
      let depth = 1;
      while (depth < 6 && inside(x - depth, y) && inside(x + depth, y) && inside(x, y - depth)) depth++;
      row += depth === 6 && y > height * 0.4 ? 'W' : 'ROOYYY'[depth - 1];
    }
    rows.push(row);
  }
  return rows;
}

function campfireColumnArt(seed) {
  const [left, middle, right] = [0, 1, 2].map(i => campfireFlameArt(campfireScaleProfile(campfireFireProfiles[(seed + i) % 3], [2.3, 2.9, 2.5][i])));
  return composeArt(32, 64, [[left, 0, 64 - left.length], [right, 16, 64 - right.length], [middle, 8, 64 - middle.length]]);
}

function campfirePlankArt(width) {
  const rows = ['K'.repeat(width), '', '', '', '', 'K'.repeat(width)];
  for (let x = 0; x < width; x++) {
    const seam = x % 16 === 15;
    rows[1] += seam ? 'K' : 'O';
    rows[2] += seam ? 'K' : 'n';
    rows[3] += seam ? 'K' : x % 7 === 3 ? 'N' : 'n';
    rows[4] += seam ? 'K' : 'N';
  }
  rows[0] = '.' + rows[0].slice(1, -1) + '.';
  rows[5] = '.' + rows[5].slice(1, -1) + '.';
  return rows;
}

function campfireScaleProfile(profile, scale) {
  return profile.map(height => Math.max(1, Math.round(height * scale)));
}

function campfireFireArt(profile) {
  const flame = campfireFlameArt(profile);
  const height = flame.length + 2;
  return { ox: 8, rows: composeArt(16, height, [[flame, 0, 0], [campfireFireBase, 0, height - 4]]) };
}

function campfireBurningLog(vertical, frame) {
  if (vertical) {
    const flame = campfireFlameArt(frame ? [2, 5, 6, 4, 3, 1] : [1, 3, 4, 6, 5, 2]);
    return { ox: 3, oy: 11, rows: composeArt(7, 19, [[flame, 0, 0], [rotateArt(campfireLogBody), 1, 5]]) };
  }
  const flame = campfireFlameArt(frame ? [2, 4, 3, 5, 6, 3, 2, 5, 4, 2, 3, 1] : [1, 3, 5, 3, 2, 4, 6, 4, 2, 3, 5, 2]);
  return { ox: 7, oy: 7, rows: composeArt(14, 10, [[flame, 1, 0], [campfireLogBody, 0, 5]]) };
}

function campfireThrownLog(vertical, frame) {
  if (vertical) {
    const flame = campfireFlameArt(frame ? [2, 4, 3, 1, 1] : [1, 2, 4, 3, 1]);
    return { ox: 2, oy: 8, rows: composeArt(5, 13, [[flame, 0, 0], [rotateArt(campfireStickLog), 0, 3]]) };
  }
  const flame = campfireFlameArt(frame ? [2, 4, 3, 1, 2, 4, 3, 1] : [1, 3, 4, 2, 3, 4, 2, 1]);
  return { ox: 5, oy: 5, rows: composeArt(10, 8, [[flame, 1, 0], [campfireStickLog, 0, 3]]) };
}

function campfireMoonArt(radius) {
  const size = radius * 2;
  const craters = [[-3, -2, 2.2], [3, 3, 3], [4, -5, 1.5], [-5, 5, 1.5]];
  const rows = [];
  for (let y = 0; y < size; y++) {
    let row = '';
    for (let x = 0; x < size; x++) {
      const dx = x - radius + 0.5;
      const dy = y - radius + 0.5;
      if (Math.hypot(dx, dy) > radius) row += '.';
      else if (craters.some(([cx, cy, r]) => Math.hypot(dx - cx, dy - cy) <= r)) row += 'L';
      else row += dx + dy > radius * 0.95 ? 'L' : 'S';
    }
    rows.push(row);
  }
  return rows;
}

function campfirePineArt(width, height) {
  const trunk = Math.max(2, Math.floor(height / 9));
  const crown = height - trunk;
  const tiers = 4;
  const rows = [];
  for (let y = 0; y < height; y++) {
    let half = 1;
    if (y < crown) {
      const tier = Math.floor((y * tiers) / crown);
      const local = (y * tiers) / crown - tier;
      half = (width / 2) * (0.3 + (0.7 * (tier + 1)) / tiers) * (0.25 + 0.75 * local);
    }
    let row = '';
    for (let x = 0; x < width; x++) row += Math.abs(x - width / 2 + 0.5) <= half ? 'e' : '.';
    rows.push(row);
  }
  return rows;
}

function campfireTentArt() {
  const rows = [];
  for (let y = 0; y < 32; y++) {
    let row = '';
    for (let x = 0; x < 32; x++) {
      const dx = x - 15.5;
      const half = (y + 1) / 2;
      const door = y >= 13 ? (y - 13) / 2.4 : -1;
      let ch = '.';
      if (Math.abs(dx) <= half) ch = Math.abs(dx) > half - 1 || y === 31 ? 'K' : dx < 0 ? (Math.abs(dx) > half - 2.5 ? 'O' : 'o') : 'V';
      if (ch !== '.' && y < 31 && Math.abs(dx) < door + 1) ch = Math.abs(dx) >= door ? 'K' : y > 26 ? 'L' : 'Y';
      if (ch !== '.' && y > 3 && y < 13 && Math.abs(dx) < 0.6) ch = 'K';
      row += ch;
    }
    rows.push(row);
  }
  return rows;
}

function campfireTileSlice(rows, col, row) {
  return { ox: 0, oy: 0, rows: rows.slice(row * 16, row * 16 + 16).map(line => line.slice(col * 16, col * 16 + 16)) };
}

function campfireTile(rows) {
  return { ox: 0, oy: 0, rows };
}

function campfireFlipRows(rows) {
  return rows.map(row => row.split('').reverse().join(''));
}

function campfireBotArt(arm) {
  const parts = [[campfireBotBody, 0, 8]];
  if (arm === 'roast') parts.push([campfireBotArms.roast, 11, 16]);
  if (arm === 'lower') parts.push([campfireBotArms.lower, 11, 16]);
  if (arm === 'raise') parts.push([campfireBotArms.raise, 10, 6], [campfireFlameArt([1, 3, 4, 5, 3, 1]), 10, 1]);
  if (arm === 'throw') parts.push([campfireBotArms.throw, 11, 19]);
  return { ox: 7, rows: trimRight(composeArt(26, 28, parts)) };
}

function campfireMallowArt(frame) {
  const flame = campfireFlameArt(frame ? [2, 4, 3, 5, 2, 1] : [1, 3, 5, 4, 3, 2]);
  return { ox: 3, oy: 5, rows: composeArt(6, 9, [[flame, 0, 0], [campfireMallowBody, 0, 5]]) };
}

function campfirePileArt(shake) {
  return {
    ox: 15,
    rows: composeArt(30, 21, [
      [campfireLogEnd, 0, 11],
      [campfireLogEnd, 10, 11],
      [campfireLogEnd, 20, 11],
      [campfireLogEnd, 5, 2],
      [campfireLogEnd, 15 + shake, 1 + Math.abs(shake)],
    ]),
  };
}

// VARIABLES

const campfireArt = {};
const campfireShotArt = {};
const campfireEnemyArt = {};
const campfireSceneryArt = {};

for (const key of ['n0', 'n1', 'n2']) {
  const i = key[1];
  campfireArt['campfireStand' + i] = campfireSprite({ flame: key, front: 'stick' });
  campfireArt['campfireBlink' + i] = campfireSprite({ flame: key, front: 'stick', face: 'blink' });
  campfireArt['campfirePose' + i] = campfireSprite({ flame: key, front: 'up', back: 'up', face: 'shout' });
  campfireArt['campfireWindup' + i] = campfireSprite({ flame: key, back: 'back', front: 'fist', face: 'shout' });
  campfireArt['campfireThrow' + i] = campfireSprite({ flame: key, front: 'throw', face: 'shout' });
  campfireArt['campfireCrouch' + i] = campfireSprite({ flame: key, legs: 'crouch', front: 'fist', drop: 2 });
  campfireArt['campfireJump' + i] = campfireSprite({ flame: key, legs: 'jump', front: 'up', back: 'up', face: 'shout' });
}
for (const key of ['b0', 'b1']) {
  const i = key[1];
  campfireArt['campfireStoke' + i] = campfireSprite({ flame: key, front: 'fist', legs: 'crouch', drop: 1, face: 'shout' });
  campfireArt['campfireDash' + i] = campfireSprite({ flame: key === 'b0' ? 'n1' : 'n0', front: 'fist', back: 'none', legs: 'dash', lean: 2, face: 'shout' });
}
for (const key of ['s0', 's1']) campfireArt['campfireSmother' + key[1]] = campfireSprite({ flame: key, face: 'hurt', drop: 1 });
campfireArt.campfireFace = { ox: 0, oy: 0, rows: mirrorArt(campfireFaceHalf) };

campfireFireProfiles.forEach((profile, i) => {
  campfireShotArt['campfireFireL' + i] = campfireFireArt(profile);
  campfireShotArt['campfireFireM' + i] = campfireFireArt(campfireScaleProfile(profile, 0.6));
  campfireShotArt['campfireFireS' + i] = campfireFireArt(campfireScaleProfile(profile, 0.3));
  campfireShotArt['campfireIcon' + i] = { ox: 8, oy: 8, rows: composeArt(16, 15, [[campfireFlameArt(campfireScaleProfile(profile, 0.5)), 0, 0], [campfireFireBase, 0, 11]]) };
});
campfireShotArt.campfireAsh = { ox: 8, rows: recolorArt(campfireFireBase, { R: 'p', O: 'N' }) };
for (let i = 0; i < 2; i++) {
  campfireShotArt['campfireLogH' + i] = campfireBurningLog(false, i);
  campfireShotArt['campfireLogV' + i] = campfireBurningLog(true, i);
  campfireShotArt['campfireStickH' + i] = campfireThrownLog(false, i);
  campfireShotArt['campfireStickV' + i] = campfireThrownLog(true, i);
  campfireShotArt['campfireEmber' + i] = { ox: 2, oy: 2, rows: campfireEmberArt[i] };
  campfireShotArt['campfireSpark' + i] = { ox: 2, oy: 2, rows: campfireSparkArt[i] };
}
campfireSmokeArt.forEach((rows, i) => {
  campfireShotArt['campfireSmoke' + i] = { ox: Math.floor(rows[0].length / 2), oy: Math.floor(rows.length / 2), rows };
});

for (const key in campfireBatHalves) campfireEnemyArt['emberBat' + key[0].toUpperCase() + key.slice(1)] = { rows: mirrorArt(campfireBatHalves[key]) };
for (const arm of ['roast', 'lower', 'raise', 'throw']) campfireEnemyArt['mallowBot' + arm[0].toUpperCase() + arm.slice(1)] = campfireBotArt(arm);
for (let i = 0; i < 2; i++) campfireEnemyArt['mallowShot' + i] = campfireMallowArt(i);
let campfireRollFrame = campfireRollFace;
for (let i = 0; i < 4; i++) {
  campfireEnemyArt['rollingLog' + i] = { ox: 7, rows: campfireRollFrame };
  campfireRollFrame = rotateArt(campfireRollFrame);
}
for (let i = 0; i < 2; i++) campfireEnemyArt['rollingLogFlame' + i] = { ox: 5, rows: campfireFlameArt(i ? [2, 4, 7, 5, 3, 6, 8, 4, 3, 1] : [1, 3, 5, 8, 6, 4, 7, 5, 2, 2]) };
campfireEnemyArt.logPile0 = campfirePileArt(0);
campfireEnemyArt.logPile1 = campfirePileArt(1);
campfireEnemyArt.logPile2 = campfirePileArt(-1);

for (let i = 0; i < 3; i++) campfireShotArt['campfireFlare' + i] = { ox: 16, rows: campfireColumnArt(i) };
campfireShotArt.campfireLift = { ox: 24, oy: 0, rows: composeArt(48, 9, [[campfirePlankArt(48), 0, 0], [['KKKK', 'KWGK', 'KGDK', 'KGDK', 'KDDK', 'KKKK', '.KK.', 'KWGK', '.KK.'], 1, 0], [['KKKK', 'KWGK', 'KGDK', 'KGDK', 'KDDK', 'KKKK', '.KK.', 'KWGK', '.KK.'], 43, 0]]) };

campfireSceneryArt.campfireMoon = { ox: 0, oy: 0, rows: campfireMoonArt(11) };
campfireSceneryArt.campfirePineSmall = { ox: 8, rows: campfirePineArt(16, 34) };
campfireSceneryArt.campfirePineBig = { ox: 12, rows: campfirePineArt(24, 56) };

const campfireTentRows = campfireTentArt();

const campfireTileArt = {
  tileCampDirt: campfireTile(campfireDirtRows),
  tileCampGrass: campfireTile([
    '..g...g..g....g.',
    '.ggg.gge.gg..ggg',
    'ggeggeeegeeggege',
    'eeeeeeeeeeeeeeee',
    'eKeeeKeeeeKeeeKe',
    'KNKeKNNKeKNNKeKN',
    ...campfireDirtRows.slice(6),
  ]),
  tileCampPlank: campfireTile([
    'KKKKKKKKKKKKKKKK',
    'OOOOOOOKOOOOOOOK',
    'nnnnnnnKnnnnnnnK',
    'nnNnnnnKnnnnNnnK',
    'NNNNNNNKNNNNNNNK',
    'KKKKKKKKKKKKKKKK',
    '.KNK........KNK.',
    '.KNK........KNK.',
    '..K..........K..',
  ]),
  tileCampPost: campfireTile(new Array(16).fill(0).map((zero, row) => (row === 7 ? '.....KKKKKK.....' : row === 8 ? '.....KOOOOK.....' : '......KnNK......'))),
  tileCampLadder: campfireTile([
    '..KnK......KnK..',
    '..KnKKKKKKKKnK..',
    '..KnOOOOOOOOnK..',
    '..KnNNNNNNNNnK..',
    '..KnKKKKKKKKnK..',
    '..KnK......KnK..',
    '..KnK......KnK..',
    '..KnK......KnK..',
    '..KnK......KnK..',
    '..KnKKKKKKKKnK..',
    '..KnOOOOOOOOnK..',
    '..KnNNNNNNNNnK..',
    '..KnKKKKKKKKnK..',
    '..KnK......KnK..',
    '..KnK......KnK..',
    '..KnK......KnK..',
  ]),
  tileCampLogWall: campfireTile([...campfireLogWallRows, ...campfireLogWallRows]),
  tileCampLogBack: campfireTile(recolorArt([...campfireLogWallRows, ...campfireLogWallRows], { O: 'V', o: 'V', V: 'N', N: 'K', n: 'N' })),
  tileCampStone: campfireTile([
    'KKKKKKKKKKKKKKKK',
    'KWWGGGKKWWGGGGGK',
    'KWGGGDKKWGGGGGDK',
    'KGGGGDKKGGGGGDDK',
    'KGGDDDKKKKKKKKKK',
    'KKKKKKKWWGGGKKKK',
    'KWWGGKKWGGGDKWWK',
    'KWGGGDKGGGDDKWGK',
    'KGGGDDKKKKKKKGGK',
    'KKKKKKKKWWGGKKKK',
    'KWWGGGKKWGGGDKWK',
    'KWGGGDKKGGGDDKGK',
    'KGGGDDKKGGDDDKGK',
    'KGGDDDKKKKKKKKKK',
    'KKKKKKKWWGGGGDKK',
    'KKKKKKKKKKKKKKKK',
  ]),
  tileCampRoof: campfireTile([
    'KKKKKKKKKKKKKKKK',
    'oVVVKoVVVKoVVVKo',
    'VVVNKVVVNKVVVNKV',
    'VVNNKVVNNKVVNNKV',
    'KKKKKKKKKKKKKKKK',
    'VVKoVVVKoVVVKoVV',
    'VNKVVVNKVVVNKVVV',
    'NNKVVNNKVVNNKVVN',
    'KKKKKKKKKKKKKKKK',
    'oVVVKoVVVKoVVVKo',
    'VVVNKVVVNKVVVNKV',
    'VVNNKVVNNKVVNNKV',
    'KKKKKKKKKKKKKKKK',
    'VVKoVVVKoVVVKoVV',
    'VNKVVVNKVVVNKVVV',
    'KKKKKKKKKKKKKKKK',
  ]),
  tileCampWindow: campfireTile([
    'KKKKKKKKKKKKKKKK',
    'KNNNNNNNNNNNNNNK',
    'KNKKKKKKKKKKKKNK',
    'KNKYYYYKKYYYYKNK',
    'KNKYLLYKKYLLYKNK',
    'KNKYLYYKKYLYYKNK',
    'KNKYYYOKKYYYOKNK',
    'KNKKKKKKKKKKKKNK',
    'KNKYYYOKKYYYOKNK',
    'KNKYYYOKKYYYOKNK',
    'KNKYYOOKKYYOOKNK',
    'KNKOOOOKKOOOOKNK',
    'KNKKKKKKKKKKKKNK',
    'KNNNNNNNNNNNNNNK',
    'KOOOOOOOOOOOOOOK',
    'KKKKKKKKKKKKKKKK',
  ]),
  tileCampTableL: campfireTile(campfireTableRows),
  tileCampTableR: campfireTile(campfireFlipRows(campfireTableRows)),
  tileCampSign: campfireTile([
    '................',
    '................',
    'KKKKKKKKKKKK....',
    'KOOOOOOOOOOOK...',
    'KnnnnnnnnnnnnK..',
    'KnKKKnKKnKKnnnK.',
    'KnnnnnnnnnnnnnnK',
    'KnKKnKKKnKKnnnK.',
    'KNNNNNNNNNNNNK..',
    'KKKKKKnKKKKKK...',
    '.....KnNK.......',
    '.....KnNK.......',
    '.....KnNK.......',
    '.....KnNK.......',
    '....KKnNKK......',
    '...KnnnNNNK.....',
  ]),
  tileCampBrace: campfireTile([
    'KnK..........KnK',
    'KnnK........KnnK',
    '.KnnK......KnnK.',
    '..KnnK....KnnK..',
    '...KnnK..KnnK...',
    '....KnnKKnnK....',
    '.....KnnnnK.....',
    '......KnnK......',
    '......KnnK......',
    '.....KnnnnK.....',
    '....KnnKKnnK....',
    '...KnnK..KnnK...',
    '..KnnK....KnnK..',
    '.KnnK......KnnK.',
    'KnnK........KnnK',
    'KnK..........KnK',
  ]),
  tileCampStump: campfireTile([
    '................',
    '..KKKKKKKKKKKK..',
    '.KSSSSSSSSSSSSK.',
    'KSSnnnnnnnnnnSSK',
    'KSnSSnnnnnnSSnSK',
    'KSSnnnnnnnnnnSSK',
    'KNSSSSSSSSSSSSNK',
    'KNNKKKKKKKKKKNNK',
    'KnNNnNNnNNnNNnNK',
    'KnNnnNnnNnnNnnNK',
    'KnNnnNnnNnnNnnNK',
    'KnNnnNnnNnnNnnNK',
    'KnNnnNnnNnnNnnNK',
    'KNNnNNnnNnnNNnNK',
    'NNeNNNnnNNNNeNNe',
    'eeeeeeeeeeeeeeee',
  ]),
  tileCampWoodpile: campfireTile(composeArt(16, 16, [[campfireLogEndSmall, 0, 9], [campfireLogEndSmall, 8, 9], [campfireLogEndSmall, 4, 3]])),
  tileCampLights0: campfireTile([
    'D..............D',
    '.DD..........DD.',
    '...DDD....DDD...',
    '...K..DDDD..K...',
    '..KYK......KRK..',
    '..YWY......RWR..',
    '...Y........R...',
  ]),
  tileCampLights1: campfireTile([
    'D..............D',
    '.DD..........DD.',
    '...DDD....DDD...',
    '...K..DDDD..K...',
    '..KRK......KYK..',
    '..RWR......YWY..',
    '...R........Y...',
  ]),
  tileCampLantern0: campfireTile([
    '....KKKKKKKKKKK.',
    '....KnnnnnnnnnK.',
    '....KnKKKKKKKKK.',
    '....KnK.....K...',
    '....KnK....KKK..',
    '....KnK...KDDDK.',
    '....KnK...KYWYK.',
    '....KnK...KWWWK.',
    '....KnK...KYWYK.',
    '....KnK...KDDDK.',
    '....KnK....KKK..',
    '....KnK.........',
    '....KnK.........',
    '....KnK.........',
    '....KnK.........',
    '....KnK.........',
  ]),
  tileCampLampPost: campfireTile(new Array(16).fill('....KnK.........')),
};

campfireTileArt.tileCampLantern1 = campfireTile(recolorArt(campfireTileArt.tileCampLantern0.rows, { Y: 'O', W: 'Y' }));
campfirePitRows.forEach((rows, i) => {
  const full = [...rows, ...campfireDirtRows.slice(8)];
  campfireTileArt['tileCampPitL' + i] = campfireTile(full);
  campfireTileArt['tileCampPitR' + i] = campfireTile(campfireFlipRows(full));
});
for (let i = 0; i < 4; i++) campfireTileArt['tileCampTent' + i] = campfireTileSlice(campfireTentRows, i % 2, Math.floor(i / 2));

// INITIALIZATION

Object.assign(palettes, {
  campfireBoss: { V: 0x06, p: 0x07, r: 0x16, n: 0x18, N: 0x08 },
  campfireHot: { V: 0x16, p: 0x06, r: 0x16, n: 0x27, N: 0x17, R: 0x28, O: 0x38, Y: 0x30, D: 0x10, G: 0x30 },
  campfireCold: { V: 0x07, p: 0x08, r: 0x16, n: 0x08, N: 0x0F, O: 0x00, Y: 0x10, W: 0x10 },
  campfireTiles: { V: 0x07, r: 0x06, R: 0x16 },
  campfireFar: { e: 0x0C },
  campfireNear: { e: 0x0F },
  megaCampfire: { B: 0x27, C: 0x38, v: 0x17 },
  orbCampfire: { C: 0x27, W: 0x30 },
});

registerArt(campfireArt, 'campfireBoss');
registerArt(campfireShotArt, 'campfireBoss');
registerArt(campfireEnemyArt, 'enemy');
registerArt(campfireTileArt, 'campfireTiles');
registerArt(campfireSceneryArt, 'campfireFar');
registerAnimations([
  { label: 'Campfire Man', fps: 4, frames: ['campfireStand0', 'campfireStand1', 'campfireStand2', 'campfireBlink0', 'campfirePose1', 'campfirePose2', 'campfireWindup0', 'campfireWindup1', 'campfireThrow2', 'campfireCrouch0', 'campfireJump1', 'campfireStoke0', { sprite: 'campfireStoke1', palette: 'campfireHot' }, 'campfireDash0', 'campfireDash1', 'campfireSmother0', 'campfireSmother1'] },
  { label: 'Campfire Man chama', fps: 10, frames: ['campfireStand0', 'campfireStand1', 'campfireStand2'] },
  { label: 'Campfire Man atiçando', fps: 12, frames: ['campfireStoke0', { sprite: 'campfireStoke1', palette: 'campfireHot' }] },
  { label: 'Tora em chamas', fps: 8, frames: ['campfireLogH0', 'campfireLogV1', 'campfireLogH1', 'campfireLogV0'] },
  { label: 'Fogueira', fps: 10, frames: ['campfireFireL0', 'campfireFireL1', 'campfireFireL2', 'campfireFireL1', 'campfireFireM0', 'campfireFireM1', 'campfireFireS0', 'campfireFireS1', 'campfireAsh'] },
  { label: 'Brasas / faiscas / fumaca', fps: 6, frames: ['campfireEmber0', 'campfireEmber1', 'campfireSpark0', 'campfireSpark1', 'campfireSmoke0', 'campfireSmoke1', 'campfireSmoke2'] },
  { label: 'Arma Campfire', fps: 6, frames: [{ sprite: 'megaThrow', palette: 'mega' }, { sprite: 'megaThrow', palette: 'megaCampfire' }] },
  { label: 'Campfire (Mega Man)', fps: 8, frames: ['campfireStickH0', 'campfireStickV1', 'campfireStickH1', 'campfireStickV0'] },
  { label: 'Icone Campfire', fps: 10, frames: ['campfireIcon0', 'campfireIcon1', 'campfireIcon2'] },
  { label: 'Orbes do Campfire Man', fps: 16, frames: ['orbSmall', 'orbBig1', 'orbBig2', 'orbBig1'].map(sprite => ({ sprite, palette: 'orbCampfire' })) },
  { label: 'Ember Bat', fps: 6, frames: ['emberBatHang', 'emberBatHang', 'emberBatWake', 'emberBatHang', 'emberBatWake', 'emberBatUp', 'emberBatDown', 'emberBatUp', 'emberBatDown'] },
  { label: 'Mallow Bot', fps: 4, frames: ['mallowBotRoast', 'mallowBotLower', 'mallowBotRoast', 'mallowBotLower', 'mallowBotRaise', 'mallowBotRaise', 'mallowBotThrow', 'mallowBotThrow'] },
  { label: 'Marshmallow em chamas', fps: 10, frames: ['mallowShot0', 'mallowShot1'] },
  { label: 'Tora rolando', fps: 10, frames: ['rollingLog0', 'rollingLog1', 'rollingLog2', 'rollingLog3'] },
  { label: 'Pilha de toras', fps: 12, frames: ['logPile0', 'logPile0', 'logPile1', 'logPile2', 'logPile1', 'logPile2'] },
  { label: 'Retrato Campfire Man', fps: 1, frames: ['campfireFace'] },
  { label: 'Fogueira de pedras', fps: 5, frames: ['tileCampPitL0', 'tileCampPitL1'] },
  { label: 'Labareda da fogueira', fps: 12, frames: ['campfireFlare0', 'campfireFlare1', 'campfireFlare2'] },
  { label: 'Lampiao / luzes', fps: 4, frames: ['tileCampLantern0', 'tileCampLantern1', 'tileCampLights0', 'tileCampLights1'] },
]);
