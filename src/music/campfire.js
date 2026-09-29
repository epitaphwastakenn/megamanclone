// VARIABLES

const campfireChords = ['Em', 'C', 'G', 'D', 'Em', 'C', 'D', 'D', 'C', 'D', 'G', 'Em', 'C', 'D', 'B', 'B'];

const campfireStageSong = {
  bpm: 152,
  loop: true,
  tracks: [
    {
      wave: 0.5,
      volume: 0.085,
      decay: 0.3,
      vibrato: true,
      notes: parseMelody(`
        E5:3 B4:1 E5:2 G5:2 F#5:2 E5:2 D5:2 B4:2
        C5:4 E5:2 G5:4 E5:2 C5:2 G4:2
        D5:3 B4:1 D5:2 G5:2 A5:2 G5:2 F#5:2 D5:2
        F#5:6 E5:2 D5:4 A4:4
        E5:3 B4:1 E5:2 G5:2 B5:4 A5:2 G5:2
        A5:4 G5:2 E5:2 C6:4 B5:2 A5:2
        F#5:2 G5:2 A5:2 D6:6 C6:2 A5:2
        B5:8 A5:4 F#5:4
        G5:2 .:1 G5:1 E5:2 G5:2 C6:4 B5:2 A5:2
        A5:2 .:1 A5:1 F#5:2 A5:2 D6:4 C6:2 A5:2
        B5:4 A5:2 G5:2 D5:4 G5:4
        E5:6 G5:2 B5:8
        C6:4 B5:2 A5:2 G5:4 E5:4
        F#5:2 A5:2 D6:2 C6:2 A5:4 F#5:4
        D#5:4 F#5:4 B5:4 A5:2 F#5:2
        D#5:8 .:4 B4:2 D#5:2
      `),
    },
    {
      wave: 0.125,
      volume: 0.045,
      notes: arpeggioTrack(campfireChords, 16, [0, 1, 2, 3, 2, 1, 2, 3]),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: bassTrack(campfireChords, 16, 'drive'),
    },
    {
      wave: 'noise',
      volume: 0.11,
      notes: drumTrack(16, bar => (bar % 8 === 7 ? 'k h s h k h s s k s s h s s s s' : bar % 2 === 1 ? 'k h s h k k s h k h s h k k s o' : 'k h s h k h s h k k s h k h s h')),
    },
  ],
};
