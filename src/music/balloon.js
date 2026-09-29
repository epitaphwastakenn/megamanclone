// VARIABLES

const balloonChords = ['D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A', 'G', 'A', 'F#m', 'Bm', 'Em', 'G', 'A', 'A'];

// INITIALIZATION

Object.assign(chordTones, {
  Bm: ['B3', 'D4', 'F#4', 'B4'],
  'F#m': ['F#4', 'A4', 'C#5', 'F#5'],
});

Object.assign(chordRoots, { Bm: 'B', 'F#m': 'F#' });

// VARIABLES

const balloonStageSong = {
  bpm: 152,
  loop: true,
  tracks: [
    {
      wave: 0.5,
      volume: 0.085,
      decay: 0.3,
      vibrato: true,
      notes: parseMelody(`
        A4:2 D5:2 F#5:2 A5:6 G5:2 F#5:2
        E5:4 C#5:2 E5:2 A5:8
        F#5:6 D5:2 B4:4 D5:2 F#5:2
        G5:8 B5:4 A5:2 G5:2
        F#5:2 A5:2 D6:6 C#6:2 B5:2 A5:2
        C#6:4 B5:2 A5:2 E5:8
        D5:2 E5:2 G5:4 B5:4 A5:2 G5:2
        A5:12 .:2 A4:2
        B4:2 D5:2 G5:4 F#5:2 G5:2 A5:4
        E5:6 C#5:2 A4:4 C#5:2 E5:2
        F#5:4 A5:4 C#6:6 A5:2
        B5:8 F#5:4 D5:4
        E5:2 G5:2 B5:4 A5:2 G5:2 E5:4
        D5:2 G5:2 B5:4 D6:6 B5:2
        C#6:4 A5:2 E5:2 C#6:4 E6:4
        A5:8 E5:2 C#5:2 A4:2 C#5:2
      `),
    },
    {
      wave: 0.125,
      volume: 0.045,
      notes: arpeggioTrack(balloonChords, 16, [0, 2, 3, 1, 2, 3]),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: bassTrack(balloonChords, 16),
    },
    {
      wave: 'noise',
      volume: 0.11,
      notes: drumTrack(16, bar => (bar % 8 === 7 ? 'k h s h k h s k k h s h s s s s' : bar % 4 === 3 ? 'k h s h k h s h k k s h k h s o' : 'k h s h k h s h k h s h k h s h')),
    },
  ],
};
