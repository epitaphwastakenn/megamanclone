// VARIABLES

const swordfishChords = ['swordBm', 'G', 'D', 'A', 'swordBm', 'G', 'Em', 'swordFs', 'G', 'A', 'swordFsm', 'swordBm', 'G', 'A', 'D', 'swordFs'];

// INITIALIZATION

Object.assign(chordTones, {
  swordBm: ['B4', 'D5', 'F#5', 'B5'],
  swordFsm: ['F#4', 'A4', 'C#5', 'F#5'],
  swordFs: ['F#4', 'A#4', 'C#5', 'F#5'],
});

Object.assign(chordRoots, { swordBm: 'B', swordFsm: 'F#', swordFs: 'F#' });

const swordfishStageSong = {
  bpm: 144,
  loop: true,
  tracks: [
    {
      wave: 0.5,
      volume: 0.085,
      decay: 0.3,
      vibrato: true,
      notes: parseMelody(`
        F#5:4 B5:4 A5:2 F#5:2 D5:2 E5:2
        D5:6 B4:2 G4:4 B4:2 D5:2
        F#5:4 A5:4 G5:2 F#5:2 E5:2 D5:2
        E5:8 C#5:4 A4:4
        F#5:4 B5:4 C#6:2 D6:2 C#6:2 B5:2
        A5:6 G5:2 D5:4 G5:2 A5:2
        B5:4 G5:2 E5:2 G5:4 B5:2 A5:2
        A#5:8 C#6:4 F#5:4
        B5:2 A5:2 G5:2 D5:2 G5:4 A5:4
        C#6:2 B5:2 A5:2 E5:2 A5:4 B5:4
        C#6:4 A5:2 F#5:2 C#5:4 F#5:2 A5:2
        B5:8 F#5:4 D5:4
        D6:4 B5:2 G5:2 D6:4 C#6:2 B5:2
        C#6:4 A5:2 E5:2 A5:4 B5:2 C#6:2
        D6:6 C#6:2 B5:2 A5:2 F#5:2 A5:2
        A#5:4 C#6:4 F#5:4 .:2 C#5:2
      `),
    },
    {
      wave: 0.125,
      volume: 0.045,
      notes: arpeggioTrack(swordfishChords, 16, [0, 1, 2, 3, 2, 1]),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: bassTrack(swordfishChords, 16),
    },
    {
      wave: 'noise',
      volume: 0.1,
      notes: drumTrack(16, bar => (bar % 8 === 7 ? 'k h s h k h s h k k s h s s s o' : bar % 4 === 3 ? 'k h s h k h s k h k s h k h s o' : 'k h h s h h k h h s h h k h s h')),
    },
  ],
};
