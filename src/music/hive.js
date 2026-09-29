// VARIABLES

const hiveChords = ['G', 'Em', 'C', 'D', 'G', 'C', 'Am', 'D', 'C', 'D', 'Em', 'Am', 'G', 'E', 'Am', 'D'];

const hiveStageSong = {
  bpm: 156,
  loop: true,
  tracks: [
    {
      wave: 0.5,
      volume: 0.08,
      decay: 0.4,
      vibrato: true,
      notes: parseMelody(`
        G5:1 F#5:1 G5:1 A5:1 G5:2 D5:2 B4:2 D5:2 G5:4
        E5:1 D#5:1 E5:1 F#5:1 E5:2 B4:2 G4:2 B4:2 E5:4
        C5:2 E5:2 G5:2 C6:4 B5:2 A5:2 G5:2
        A5:4 F#5:2 D5:2 E5:2 F#5:2 A5:4
        G5:1 F#5:1 G5:1 A5:1 G5:2 D5:2 B4:2 D5:2 G5:2 B5:2
        C6:2 B5:2 A5:2 G5:2 E5:4 G5:4
        A5:2 C6:2 B5:2 A5:2 E5:4 C5:4
        D5:2 F#5:2 A5:2 D6:6 .:4
        E5:2 G5:2 E5:2 C5:2 E5:2 G5:2 C6:4
        F#5:2 A5:2 F#5:2 D5:2 F#5:2 A5:2 D6:4
        G5:2 B5:2 G5:2 E5:2 G5:2 B5:2 E6:4
        C6:2 B5:2 A5:2 G5:2 E5:2 G5:2 A5:4
        B5:4 A5:2 G5:2 D5:4 G5:4
        G#5:4 F#5:2 E5:2 B4:4 E5:4
        A5:2 B5:2 C6:2 A5:2 D6:2 C6:2 B5:2 A5:2
        F#5:4 A5:4 D6:2 .:2 D5:1 E5:1 F#5:2
      `),
    },
    {
      wave: 0.125,
      volume: 0.045,
      notes: arpeggioTrack(hiveChords, 16, [0, 1, 2, 3, 2, 1, 2, 1]),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: bassTrack(hiveChords, 16),
    },
    {
      wave: 'noise',
      volume: 0.11,
      notes: drumTrack(16, bar => (bar % 8 === 7 ? 'k h s h k k s h k h s s k s s s' : bar % 2 === 1 ? 'k h s h k k s h k h s h k h s o' : 'k h s h k h s k k h s h k h s h')),
    },
  ],
};
