// VARIABLES

const metHelmet = [
  '.......KKKK.......',
  '.....KKYYYYKK.....',
  '....KYYLLYYYYK....',
  '...KYYLLYYYYYYK...',
  '...KYYYYYYYYYYK...',
  '..KYYYYYYYYYYYYK..',
  '..KOOOOOOOOOOOOK..',
  '.KOOOOOOOOOOOOOOK.',
  'KKKKKKKKKKKKKKKKKK',
];

const bladerHead = [
  '.....KKKKKK.....',
  '...KKRRRRRRKK...',
  '..KRROORRRRRRK..',
  '.KRROORRRRRRRRK.',
  '.KRRRRRRRRRRRRK.',
  'KRRRRKKKKKKRRRRK',
  'KRRRKWWWWWWKRRRK',
  'KRRRKWWWKKWKRRRK',
  'KRRRKWWWKKWKRRRK',
  '.KRRKWWWWWWKRRK.',
  '..KRRKKKKKKRRK..',
  '...KKKKKKKKKK...',
];

function bigEyeBodyArt() {
  const width = 32;
  const height = 30;
  const rows = [];
  const cx = 15.5;
  const cy = 15;
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const nx = (x - cx) / 15.5;
      const ny = (y - cy) / 15;
      const body = nx * nx + ny * ny;
      const eye = Math.hypot(x - 18.5, y - 13);
      const pupil = Math.hypot(x - 20.5, y - 13);
      const shine = Math.hypot(x - 8, y - 6);
      let ch = '.';
      if (body <= 1) {
        ch = body > 0.86 ? 'K' : 'R';
        if (ch === 'R' && shine < 3.2) ch = 'O';
        if (eye <= 8.5) ch = 'K';
        if (eye <= 7.5) ch = 'W';
        if (pupil <= 3.4) ch = 'K';
        if (Math.hypot(x - 21.5, y - 11.5) <= 0.8) ch = 'W';
      }
      line += ch;
    }
    rows.push(line);
  }
  return rows;
}

const bigEyeBody = composeArt(32, 34, [
  [bigEyeBodyArt(), 0, 0],
  [[
    '....KKKKKKKKKKKKKKKKKKKKKKKK....',
    '...KGWWWWWWWWWWWWWWWWWWWWWWGK...',
    '...KGGGGGGGGGGGGGGGGGGGGGGGGK...',
    '....KKKKKKKKKKKKKKKKKKKKKKKK....',
  ], 0, 28],
]);

const bigEyeFoot = [
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  '.KGGWWWWWWWWWWWWWWWWWWWWWWWWGGK.',
  'KGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGK',
  'KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
];

const enemyArt = {
  metHide: {
    rows: [
      ...metHelmet,
      '.KKKKKKKKKKKKKKKK.',
    ],
  },
  metOpen: {
    rows: [
      ...metHelmet,
      '..KKKKKKKKKKKKKK..',
      '...KKWWKKKKWWKK...',
      '...KKWKKKKKKWKK...',
      '....KKKKKKKKKK....',
      '....KRRK..KRRK....',
      '...KRRRK..KRRRK...',
      '...KKKKK..KKKKK...',
    ],
  },
  blader1: {
    rows: [
      'KKKKKKKKKKKKKKKK',
      'KGGGGGGGGGGGGGGK',
      'KKKKKKKGGKKKKKKK',
      '.......KGK......',
      ...bladerHead,
    ],
  },
  blader2: {
    rows: [
      '................',
      '.....KKKKKK.....',
      '.....KGGGGK.....',
      '......KGGK......',
      ...bladerHead,
    ],
  },
  screwClosed: {
    rows: [
      '.......KKKK.......',
      '.....KKOOOOKK.....',
      '....KOOLLOOOOK....',
      '...KOOOOOOOOOOK...',
      '...KKKKKKKKKKKK...',
      '..KGGGGGGGGGGGGK..',
      '..KDDDDDDDDDDDDK..',
      '.KKKKKKKKKKKKKKKK.',
    ],
  },
  screwOpen1: {
    rows: [
      '.......KKKK.......',
      '.....KKOOOOKK.....',
      '....KOOLLOOOOK....',
      '...KOOOOOOOOOOK...',
      '...KKKKKKKKKKKK...',
      '......KWGGDK......',
      '......KGGDDK......',
      '......KWGGDK......',
      '......KGGDDK......',
      '..KGGGGGGGGGGGGK..',
      '..KDDDDDDDDDDDDK..',
      '.KKKKKKKKKKKKKKKK.',
    ],
  },
  screwOpen2: {
    rows: [
      '.......KKKK.......',
      '.....KKOOOOKK.....',
      '....KOOOOLLOOK....',
      '...KOOOOOOOOOOK...',
      '...KKKKKKKKKKKK...',
      '......KGGDDK......',
      '......KWGGDK......',
      '......KGGDDK......',
      '......KWGGDK......',
      '..KGGGGGGGGGGGGK..',
      '..KDDDDDDDDDDDDK..',
      '.KKKKKKKKKKKKKKKK.',
    ],
  },
  blasterClosed: {
    ox: 0,
    oy: 8,
    rows: [
      'KKKKK...........',
      'KGGGKKKK........',
      'KGGGKPPPKK......',
      'KGGGKPPPPPKK....',
      'KGGGKPPPPPPPK...',
      'KGGGKPPPPPPPPK..',
      'KGGGKPPpppppPK..',
      'KGGGKPPPPPPPPPK.',
      'KGGGKPPPPPPPPPK.',
      'KGGGKPPpppppPK..',
      'KGGGKPPPPPPPPK..',
      'KGGGKPPPPPPPK...',
      'KGGGKPPPPPKK....',
      'KGGGKPPPKK......',
      'KGGGKKKK........',
      'KKKKK...........',
    ],
  },
  blasterOpen: {
    ox: 0,
    oy: 8,
    rows: [
      'KKKKK...........',
      'KGGGKKKK........',
      'KGGGKPPPKK......',
      'KGGGKPPPPPKK....',
      'KGGGKPPPPPPK....',
      'KGGGKKKKKKKKK...',
      'KGGGKDDDDKWWK...',
      'KGGGKDDDDKWKKK..',
      'KGGGKDDDDKWKKK..',
      'KGGGKDDDDKWWK...',
      'KGGGKKKKKKKKK...',
      'KGGGKPPPPPPK....',
      'KGGGKPPPPPKK....',
      'KGGGKPPPKK......',
      'KGGGKKKK........',
      'KKKKK...........',
    ],
  },
  bigEyeStand: {
    rows: composeArt(32, 42, [
      [bigEyeBody, 0, 0],
      [['..........KKKKKKKKKKKK..........', '.........KRRROOOOOORRRK.........', '.........KRRRRRRRRRRRRK.........', '......KKKKRRRRRRRRRRRRKKKK......'], 0, 32],
      [bigEyeFoot, 0, 36],
      [['..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..'], 0, 41],
    ]),
  },
  bigEyeJump: {
    rows: composeArt(32, 50, [
      [bigEyeBody, 0, 0],
      [[
        '...........KKKKKKKKKK...........',
        '...........KRROOOORRK...........',
        '...........KRRRRRRRRK...........',
        '...........KKKKKKKKKK...........',
        '............KGGWWGGK............',
        '............KGGWWGGK............',
        '............KGGWWGGK............',
        '...........KKKKKKKKKK...........',
        '...........KRROOOORRK...........',
        '..........KRRRRRRRRRRK..........',
        '......KKKKRRRRRRRRRRRRKKKK......',
      ], 0, 32],
      [bigEyeFoot, 0, 43],
      [['..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..'], 0, 47],
    ]),
  },
  enemyShot: {
    oy: 3,
    rows: [
      '.LLLL.',
      'LWWWWL',
      'LWWWWL',
      'LWWWWL',
      'LWWWWL',
      '.LLLL.',
    ],
  },
};
