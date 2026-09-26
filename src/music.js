// FUNCTIONS

function parseMelody(text) {
  return text.trim().split(/\s+/).map(token => {
    const [note, length] = token.split(':');
    return { note: note === '.' ? '-' : note, length: Number(length) };
  });
}

function arpeggioTrack(chords, stepsPerChord, pattern) {
  const notes = [];
  for (const chord of chords) {
    const tones = chordTones[chord];
    for (let i = 0; i < stepsPerChord; i++) notes.push({ note: tones[pattern[i % pattern.length]], length: 1 });
  }
  return notes;
}

function bassTrack(chords, stepsPerChord, style) {
  const notes = [];
  for (const chord of chords) {
    const root = chordRoots[chord];
    const low = root + '2';
    const high = root + '3';
    for (let i = 0; i < stepsPerChord; i += 2) {
      let note = i % 4 === 0 ? low : high;
      if (style === 'drive') note = i % 8 === 6 ? high : low;
      notes.push({ note, length: 2 });
    }
  }
  return notes;
}

function drumTrack(bars, pattern) {
  const notes = [];
  for (let bar = 0; bar < bars; bar++) {
    const barPattern = typeof pattern === 'function' ? pattern(bar) : pattern;
    for (const hit of barPattern.split(' ')) notes.push({ note: hit === '.' ? '-' : hit, length: 1 });
  }
  return notes;
}

// VARIABLES

const drumKit = {
  k: { rate: 4709, endRate: 880, length: 0.09, volume: 1, short: false },
  s: { rate: 27965, endRate: 7046, length: 0.12, volume: 0.9, short: false },
  h: { rate: 111860, length: 0.03, volume: 0.45, short: false },
  o: { rate: 55930, length: 0.08, volume: 0.5, short: false },
  c: { rate: 18643, length: 0.25, volume: 0.7, short: false },
};

const chordTones = {
  Am: ['A4', 'C5', 'E5', 'A5'],
  F: ['F4', 'A4', 'C5', 'F5'],
  G: ['G4', 'B4', 'D5', 'G5'],
  E: ['E4', 'G#4', 'B4', 'E5'],
  Em: ['E4', 'G4', 'B4', 'E5'],
  C: ['C5', 'E5', 'G5', 'C6'],
  D: ['D4', 'F#4', 'A4', 'D5'],
  B: ['B3', 'D#4', 'F#4', 'B4'],
  Dm: ['D4', 'F4', 'A4', 'D5'],
};

const chordRoots = { Am: 'A', F: 'F', G: 'G', E: 'E', Em: 'E', C: 'C', D: 'D', B: 'B', Dm: 'D' };

const stageChords = ['Am', 'F', 'G', 'E', 'Am', 'F', 'G', 'Am', 'F', 'G', 'Em', 'Am', 'F', 'G', 'E', 'E'];

const stageSong = {
  bpm: 150,
  loop: true,
  tracks: [
    {
      wave: 0.5,
      volume: 0.085,
      decay: 0.35,
      vibrato: true,
      notes: parseMelody(`
        A4:4 C5:2 E5:4 D5:2 C5:2 B4:2
        C5:6 A4:2 F4:4 A4:2 C5:2
        B4:4 D5:2 G5:4 F5:2 E5:2 D5:2
        E5:8 G#4:4 B4:4
        A4:4 C5:2 E5:4 A5:2 G5:2 E5:2
        F5:6 E5:2 C5:4 A4:2 C5:2
        D5:4 E5:2 F5:4 E5:2 D5:2 B4:2
        A4:12 .:4
        F5:2 E5:2 F5:2 A5:6 G5:4
        E5:2 D5:2 E5:2 G5:6 F5:4
        E5:2 D5:2 B4:2 G4:2 B4:2 E5:2 G5:4
        A5:8 E5:4 C5:4
        F5:2 E5:2 F5:2 A5:6 C6:4
        B5:4 A5:2 G5:4 F5:2 G5:4
        G#5:6 E5:2 B4:4 D5:4
        E5:8 .:4 E4:2 G#4:2
      `),
    },
    {
      wave: 0.125,
      volume: 0.045,
      notes: arpeggioTrack(stageChords, 16, [0, 1, 2, 3, 2, 1]),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: bassTrack(stageChords, 16),
    },
    {
      wave: 'noise',
      volume: 0.12,
      notes: drumTrack(16, bar => (bar % 4 === 3 ? 'k h s h k h s h k k s h s s s s' : 'k h s h k h s h k h s h k h s o')),
    },
  ],
};

const bossChords = ['Em', 'Em', 'C', 'D', 'Em', 'Em', 'C', 'B'];

const bossSong = {
  bpm: 168,
  loop: true,
  tracks: [
    {
      wave: 0.25,
      volume: 0.085,
      decay: 0.3,
      vibrato: true,
      notes: parseMelody(`
        E5:2 .:2 E5:2 .:2 D5:2 E5:2 G5:2 E5:2
        B5:4 A5:2 G5:2 F#5:4 G5:2 F#5:2
        E5:6 C5:2 G4:4 C5:4
        D5:6 F#5:2 A5:4 F#5:4
        E5:2 .:2 E5:2 .:2 D5:2 E5:2 G5:2 E5:2
        B5:4 C6:2 B5:2 A5:4 G5:2 A5:2
        G5:4 E5:4 C6:4 B5:2 A5:2
        B5:8 D#5:4 F#5:4
      `),
    },
    {
      wave: 0.125,
      volume: 0.045,
      notes: arpeggioTrack(bossChords, 16, [0, 2, 1, 3]),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: bassTrack(bossChords, 16, 'drive'),
    },
    {
      wave: 'noise',
      volume: 0.12,
      notes: drumTrack(8, bar => (bar % 4 === 3 ? 'k h s k k h s h k s s h s s s s' : 'k h s k k h s h k h s k k h s h')),
    },
  ],
};

const titleChords = ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'G'];

const titleSong = {
  bpm: 132,
  loop: true,
  tracks: [
    {
      wave: 0.5,
      volume: 0.085,
      decay: 0.3,
      vibrato: true,
      notes: parseMelody(`
        E5:4 G5:4 C6:6 B5:2
        B5:4 A5:2 G5:2 D5:8
        E5:4 A5:4 C6:6 B5:2
        A5:4 G5:2 F5:2 C5:8
        E5:4 G5:4 C6:6 D6:2
        D6:4 C6:2 B5:2 G5:8
        A5:4 C6:4 F5:4 A5:4
        G5:12 .:4
      `),
    },
    {
      wave: 0.125,
      volume: 0.04,
      notes: arpeggioTrack(titleChords, 16, [0, 1, 2, 1]),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: bassTrack(titleChords, 16),
    },
    {
      wave: 'noise',
      volume: 0.1,
      notes: drumTrack(8, 'k h h h s h h h k h k h s h h o'),
    },
  ],
};

const bossIntroSong = {
  bpm: 150,
  loop: false,
  tracks: [
    {
      wave: 0.5,
      volume: 0.09,
      decay: 0.2,
      notes: parseMelody('E5:2 E5:2 E5:2 G5:2 E5:2 B5:4 A5:2 G5:2 F#5:2 G5:2 A5:2 B5:8 .:8'),
    },
    {
      wave: 0.25,
      volume: 0.05,
      notes: parseMelody('B4:2 B4:2 B4:2 D5:2 B4:2 G5:4 F#5:2 E5:2 D#5:2 E5:2 F#5:2 D#5:8 .:8'),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: parseMelody('E2:2 E3:2 E2:2 E3:2 C2:2 C3:2 C2:2 C3:2 D2:2 D3:2 D2:2 D3:2 B1:8 .:8'),
    },
    {
      wave: 'noise',
      volume: 0.12,
      notes: drumTrack(1, 'k h s h k h s h k h s h k k s s').concat(drumTrack(1, 'c . . . . . . . . . . . . . . .')),
    },
  ],
};

const victorySong = {
  bpm: 150,
  loop: false,
  tracks: [
    {
      wave: 0.5,
      volume: 0.09,
      decay: 0.2,
      notes: parseMelody('C5:2 E5:2 G5:2 C6:4 G5:2 A5:2 B5:2 C6:2 D6:2 E6:8 D6:2 E6:2 G6:12 .:4'),
    },
    {
      wave: 0.25,
      volume: 0.05,
      notes: parseMelody('G4:2 C5:2 E5:2 G5:4 E5:2 F5:2 G5:2 A5:2 B5:2 C6:8 B5:2 C6:2 E6:12 .:4'),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: parseMelody('C3:2 C3:2 C3:2 C3:4 F2:2 F2:2 G2:2 G2:2 G2:2 A2:8 G2:2 G2:2 C3:12 .:4'),
    },
    {
      wave: 'noise',
      volume: 0.1,
      notes: drumTrack(1, 'k h s h k h s h k h s h k k s s').concat(drumTrack(1, 'k h s h k h s h c . . . . . . .'), drumTrack(1, '. . . . . . . . . . . . . . . .')),
    },
  ],
};

const weaponGetSong = {
  bpm: 140,
  loop: true,
  tracks: [
    {
      wave: 0.5,
      volume: 0.08,
      decay: 0.3,
      vibrato: true,
      notes: parseMelody(`
        G5:4 E5:2 G5:2 C6:4 B5:2 A5:2
        G5:4 F5:2 E5:2 D5:8
        E5:4 C5:2 E5:2 A5:4 G5:2 F5:2
        E5:4 D5:2 E5:2 G5:8
      `),
    },
    {
      wave: 0.125,
      volume: 0.04,
      notes: arpeggioTrack(['C', 'G', 'F', 'G'], 16, [0, 1, 2, 1]),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: bassTrack(['C', 'G', 'F', 'G'], 16),
    },
    {
      wave: 'noise',
      volume: 0.08,
      notes: drumTrack(4, 'k . h . s . h . k . k . s . h .'),
    },
  ],
};

const gameOverSong = {
  bpm: 100,
  loop: false,
  tracks: [
    {
      wave: 0.5,
      volume: 0.09,
      decay: 0.3,
      notes: parseMelody('E5:4 D5:4 C5:4 B4:4 A4:4 G#4:4 A4:8 .:8'),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: parseMelody('A2:8 F2:8 E2:8 A2:8 .:8'),
    },
  ],
};
