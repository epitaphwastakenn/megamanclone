// VARIABLES

const grizzlyChords = ['grizzlyCm', 'grizzlyCm', 'grizzlyAb', 'grizzlyBb', 'grizzlyCm', 'grizzlyCm', 'grizzlyFm', 'grizzlyG', 'grizzlyAb', 'grizzlyBb', 'grizzlyEb', 'grizzlyCm', 'grizzlyAb', 'grizzlyBb', 'grizzlyG', 'grizzlyG'];

// INITIALIZATION

Object.assign(chordTones, {
  grizzlyCm: ['C4', 'Eb4', 'G4', 'C5'],
  grizzlyAb: ['Ab3', 'C4', 'Eb4', 'Ab4'],
  grizzlyBb: ['Bb3', 'D4', 'F4', 'Bb4'],
  grizzlyG: ['G3', 'B3', 'D4', 'G4'],
  grizzlyFm: ['F3', 'Ab3', 'C4', 'F4'],
  grizzlyEb: ['Eb4', 'G4', 'Bb4', 'Eb5'],
});

Object.assign(chordRoots, { grizzlyCm: 'C', grizzlyAb: 'Ab', grizzlyBb: 'Bb', grizzlyG: 'G', grizzlyFm: 'F', grizzlyEb: 'Eb' });

// VARIABLES

const grizzlyStageSong = {
  bpm: 144,
  loop: true,
  tracks: [
    {
      wave: 0.5,
      volume: 0.085,
      decay: 0.3,
      vibrato: true,
      notes: parseMelody(`
        C5:3 C5:1 G4:2 C5:2 Eb5:4 D5:2 C5:2
        G5:6 F5:2 Eb5:2 D5:2 Eb5:4
        C5:3 C5:1 Ab4:2 C5:2 Eb5:4 F5:2 Eb5:2
        D5:6 Bb4:2 F5:4 D5:4
        C5:3 C5:1 G4:2 C5:2 Eb5:4 G5:2 C6:2
        Bb5:4 G5:2 Eb5:2 F5:4 G5:4
        Ab5:4 G5:2 F5:2 Eb5:2 D5:2 C5:2 Eb5:2
        D5:8 B4:4 G4:4
        Eb5:2 Ab5:2 C6:4 Bb5:2 Ab5:2 G5:4
        F5:2 Bb5:2 D6:4 C6:2 Bb5:2 F5:4
        G5:6 Eb5:2 Bb5:4 G5:4
        C6:8 G5:4 Eb5:4
        Ab5:4 C6:2 Ab5:2 Eb5:4 C5:4
        Bb5:4 D6:2 Bb5:2 F5:4 D5:4
        G5:2 F5:2 Eb5:2 D5:2 B4:2 D5:2 F5:2 G5:2
        G5:8 .:4 G4:2 B4:2
      `),
    },
    {
      wave: 0.125,
      volume: 0.045,
      notes: arpeggioTrack(grizzlyChords, 16, [0, 0, 2, 0, 3, 0, 2, 1]),
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: bassTrack(grizzlyChords, 16, 'drive'),
    },
    {
      wave: 'noise',
      volume: 0.12,
      notes: drumTrack(16, bar => {
        if (bar === 15) return 'k k s k s s s s k s k s s s s s';
        if (bar % 4 === 3) return 'k h s h k k s h k s s h k s s s';
        return 'k h s h k k s h k h s h k k s o';
      }),
    },
  ],
};
