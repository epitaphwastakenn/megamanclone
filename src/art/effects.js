// FUNCTIONS

function circleArt(size, rings) {
  const rows = [];
  const center = (size - 1) / 2;
  for (let y = 0; y < size; y++) {
    let line = '';
    for (let x = 0; x < size; x++) {
      const distance = Math.hypot(x - center, y - center);
      let ch = '.';
      for (const [radius, letter] of rings) {
        if (distance <= radius) {
          ch = letter;
          break;
        }
      }
      line += ch;
    }
    rows.push(line);
  }
  return rows;
}

function starArt(size, innerRadius, outerRadius, spikes, rotation, fill, edge) {
  const rows = [];
  const center = (size - 1) / 2;
  for (let y = 0; y < size; y++) {
    let line = '';
    for (let x = 0; x < size; x++) {
      const dx = x - center;
      const dy = y - center;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) + rotation;
      const wave = Math.pow(Math.abs(Math.cos(angle * spikes / 2)), 6);
      const reach = innerRadius + (outerRadius - innerRadius) * wave;
      if (distance <= reach - 1.2) line += fill;
      else if (distance <= reach) line += edge;
      else line += '.';
    }
    rows.push(line);
  }
  return rows;
}

function ringDotsArt(size, radius, count, dotRadius, letter) {
  const grid = [];
  for (let y = 0; y < size; y++) grid.push(new Array(size).fill('.'));
  const center = (size - 1) / 2;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const cx = center + Math.cos(angle) * radius;
    const cy = center + Math.sin(angle) * radius;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (Math.hypot(x - cx, y - cy) <= dotRadius) grid[y][x] = letter;
      }
    }
  }
  return grid.map(row => row.join(''));
}

// VARIABLES

const effectArt = {
  busterShot: {
    oy: 3,
    rows: [
      '..LLLL..',
      '.LWWWWL.',
      'LWWWWWWL',
      'LWWWWWWL',
      '.LWWWWL.',
      '..LLLL..',
    ],
  },
  chargeMid1: {
    oy: 6,
    rows: [
      '......LLLL......',
      '....LLWWWWLL....',
      '..LLWWLLLLWWLL..',
      '.LWWLL....LLWWL.',
      'LWWL..LLLL..LWWL',
      'LWL..LWWWWL..LWL',
      'LWL..LWWWWL..LWL',
      'LWWL..LLLL..LWWL',
      '.LWWLL....LLWWL.',
      '..LLWWLLLLWWLL..',
      '....LLWWWWLL....',
      '......LLLL......',
    ],
  },
  chargeMid2: {
    oy: 6,
    rows: [
      '......YYYY......',
      '....YYLLLLYY....',
      '..YYLLYYYYLLYY..',
      '.YLLYY....YYLLY.',
      'YLLY..YYYY..YLLY',
      'YLY..YLWWLY..YLY',
      'YLY..YLWWLY..YLY',
      'YLLY..YYYY..YLLY',
      '.YLLYY....YYLLY.',
      '..YYLLYYYYLLYY..',
      '....YYLLLLYY....',
      '......YYYY......',
    ],
  },
  chargeFull1: {
    ox: 20,
    oy: 10,
    rows: [
      '...........OOOOOOOOO....',
      '........OOOLLLLLLLLLOO..',
      '.....OOOLLLWWWWWWWWLLLO.',
      '...OOLLLWWWWWWWWWWWWWLLO',
      '.OOLLWWWWWWWWWWWWWWWWWLO',
      'OLLWWWWWWWWWWWWWWWWWWWWL',
      'OLLWWWWWWWWWWWWWWWWWWWWL',
      '.OOLLWWWWWWWWWWWWWWWWWLO',
      '...OOLLLWWWWWWWWWWWWWLLO',
      '.....OOOLLLWWWWWWWWLLLO.',
      '........OOOLLLLLLLLLOO..',
      '...........OOOOOOOOO....',
    ],
  },
  chargeFull2: {
    ox: 20,
    oy: 10,
    rows: [
      '..........YYYYYYYYYY....',
      '.......YYYLLLLLLLLLLYY..',
      '....YYYLLLWWWWWWWWWWLLY.',
      '..YYLLLWWWWWWWWWWWWWWLLY',
      'YYLLWWWWWWWWWWWWWWWWWWLY',
      'YLLWWWWWWWWWWWWWWWWWWWWL',
      'YLLWWWWWWWWWWWWWWWWWWWWL',
      'YYLLWWWWWWWWWWWWWWWWWWLY',
      '..YYLLLWWWWWWWWWWWWWWLLY',
      '....YYYLLLWWWWWWWWWWLLY.',
      '.......YYYLLLLLLLLLLYY..',
      '..........YYYYYYYYYY....',
    ],
  },
  explode1: { oy: 8, rows: circleArt(16, [[2.2, 'W'], [3.6, 'L'], [4.6, 'O']]) },
  explode2: { oy: 8, rows: starArt(16, 3.5, 7.8, 8, 0, 'W', 'O') },
  explode3: { oy: 8, rows: starArt(16, 2.5, 7.8, 8, Math.PI / 8, 'L', 'O') },
  explode4: { oy: 8, rows: ringDotsArt(16, 6, 8, 1.2, 'O') },
  orbBig1: { oy: 6, rows: circleArt(12, [[1.8, 'W'], [3.4, 'C'], [5.6, 'B']]) },
  orbBig2: { oy: 6, rows: circleArt(12, [[2.6, 'W'], [4.2, 'C'], [5.6, 'B']]) },
  orbSmall: { oy: 6, rows: circleArt(12, [[1.2, 'W'], [2.4, 'C'], [3.4, 'B']]) },
  hurtSpark1: { oy: 12, rows: starArt(24, 3, 11.5, 8, 0, 'W', 'L') },
  hurtSpark2: { oy: 12, rows: starArt(24, 2.5, 10.5, 8, Math.PI / 8, 'L', 'Y') },
  hitSpark: { oy: 4, rows: starArt(8, 1.2, 3.9, 4, 0, 'W', 'W') },
  dust1: { oy: 8, rows: circleArt(8, [[1.6, 'W'], [2.6, 'G']]) },
  dust2: { oy: 8, rows: circleArt(8, [[1.6, 'G'], [3.4, 'D']]) },
  dust3: { oy: 8, rows: ringDotsArt(8, 2.6, 5, 0.8, 'D') },
};

const itemArt = {
  energySmall1: {
    rows: [
      '.KKKKKK.',
      'KOOWWOOK',
      'KOWWWWOK',
      'KOWWWWOK',
      'KOOWWOOK',
      '.KKKKKK.',
    ],
  },
  energySmall2: {
    rows: [
      '.KKKKKK.',
      'KYYWWYYK',
      'KYWWWWYK',
      'KYWWWWYK',
      'KYYWWYYK',
      '.KKKKKK.',
    ],
  },
  energyBig1: {
    rows: [
      '..KKKKKKKKKKKK..',
      '.KOOOKWWWWKOOOK.',
      'KOOLOKWWWWKOOOOK',
      'KOLOOKWWWWKOOOOK',
      'KOOOOKWWWWKOOOOK',
      'KOOOOKWWWWKOOOOK',
      'KOOOOKWWWWKOOOOK',
      'KOOOOKWWWWKOOOOK',
      'KOOOOKWWWWKOOOOK',
      '.KOOOKWWWWKOOOK.',
      '..KKKKKKKKKKKK..',
    ],
  },
  energyBig2: {
    rows: [
      '..KKKKKKKKKKKK..',
      '.KYYYKWWWWKYYYK.',
      'KYYLYKWWWWKYYYYK',
      'KYLYYKWWWWKYYYYK',
      'KYYYYKWWWWKYYYYK',
      'KYYYYKWWWWKYYYYK',
      'KYYYYKWWWWKYYYYK',
      'KYYYYKWWWWKYYYYK',
      'KYYYYKWWWWKYYYYK',
      '.KYYYKWWWWKYYYK.',
      '..KKKKKKKKKKKK..',
    ],
  },
  oneUp: {
    rows: [
      '.....KKKKK......',
      '...KKBBBCCKK....',
      '..KBBBBBCCCBK...',
      '.KBBBBBBCCCBBK..',
      '.KBBBBBBBCCBBBK.',
      'KBBBBBBBBBBBBBK.',
      'KBBBBBBSSSSSSSK.',
      'KBBBBBSWWKSSWKK.',
      'KBBBBBSWWKSSWKK.',
      'KBBBBBSSSSSSSSK.',
      '.KBBBBSSSSSKKSK.',
      '..KKBBBSSSSSSK..',
      '....KKKKKKKKK...',
    ],
  },
};
