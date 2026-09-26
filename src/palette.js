// VARIABLES

const nesPalette = [
  '#7C7C7C', '#0000FC', '#0000BC', '#4428BC', '#940084', '#A80020', '#A81000', '#881400',
  '#503000', '#007800', '#006800', '#005800', '#004058', '#000000', '#000000', '#000000',
  '#BCBCBC', '#0078F8', '#0058F8', '#6844FC', '#D800CC', '#E40058', '#F83800', '#E45C10',
  '#AC7C00', '#00B800', '#00A800', '#00A844', '#008888', '#000000', '#000000', '#000000',
  '#F8F8F8', '#3CBCFC', '#6888FC', '#9878F8', '#F878F8', '#F85898', '#F87858', '#FCA044',
  '#F8B800', '#B8F818', '#58D854', '#58F898', '#00E8D8', '#787878', '#000000', '#000000',
  '#FCFCFC', '#A4E4FC', '#B8B8F8', '#D8B8F8', '#F8B8F8', '#F8A4C0', '#F0D0B0', '#FCE0A8',
  '#F8D878', '#D8F878', '#B8F8B8', '#B8F8D8', '#00FCFC', '#F8D8F8', '#000000', '#000000',
];

const basePalette = {
  K: 0x0F,
  W: 0x30,
  S: 0x37,
  B: 0x11,
  C: 0x2C,
  R: 0x16,
  r: 0x06,
  O: 0x27,
  o: 0x17,
  Y: 0x28,
  L: 0x38,
  G: 0x10,
  D: 0x00,
  g: 0x1A,
  e: 0x0A,
  P: 0x25,
  p: 0x15,
  V: 0x13,
  T: 0x2D,
  N: 0x08,
  n: 0x18,
  A: 0x21,
  a: 0x31,
  h: 0x2A,
  j: 0x1C,
  u: 0x1C,
  v: 0x0C,
};

const palettes = {
  mega: {},
  megaCharge1: { K: 0x0F, B: 0x2C, C: 0x30 },
  megaCharge2: { K: 0x2C, B: 0x11, C: 0x2C },
  megaCharge3: { K: 0x30, B: 0x21, C: 0x31 },
  megaTimber: { B: 0x16, C: 0x10, A: 0x16, v: 0x06 },
  megaFlash: { K: 0x30, B: 0x30, C: 0x30, S: 0x30 },
  boss: {},
  orbBoss: { C: 0x16, W: 0x30 },
  enemy: {},
  enemyFlash: { all: 0x30, K: 0x0F },
  bossFlash: { all: 0x30, K: 0x0F },
};

// FUNCTIONS

function paletteColor(letter, paletteName) {
  const overrides = palettes[paletteName] || {};
  let index = letter in overrides ? overrides[letter] : basePalette[letter];
  if (!(letter in overrides) && 'all' in overrides) index = overrides.all;
  if (index === undefined) return null;
  return nesPalette[index];
}
