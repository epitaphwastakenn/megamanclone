// FUNCTIONS

function anglerArpTrack(chords, pattern, length) {
  const notes = [];
  for (const chord of chords) {
    const tones = chordTones[chord];
    for (let i = 0; i < 16 / length; i++) notes.push({ note: tones[pattern[i % pattern.length]], length });
  }
  return notes;
}

function anglerCalmBass(chords) {
  const notes = [];
  for (const chord of chords) {
    const root = chordRoots[chord];
    notes.push({ note: root + '2', length: 6 }, { note: root + '3', length: 2 }, { note: root + '2', length: 8 });
  }
  return notes;
}

function playAnglerSfx(name) {
  if (!audioCtx) return;
  switch (name) {
    case 'reel':
      playFrames('anglerReel', 0.125, [[2794, 0.18], [0, 0], [2349, 0.12]]);
      break;
    case 'cast':
      playFrames('anglerCast', 0.25, sweepFrames(1800, 300, 10, 0.2, 0.04));
      playFrames('anglerCastNoise', 'noise', sweepFrames(12000, 30000, 8, 0.12, 0));
      break;
    case 'latch':
      playFrames('anglerLatch', 0.125, [[1568, 0.3], [2093, 0.3], [0, 0], [2093, 0.2], [2637, 0.2]]);
      break;
    case 'snap':
      playFrames('anglerSnap', 0.5, [[3136, 0.3], [1568, 0.25], [784, 0.2], [392, 0.14], [196, 0.08]]);
      playFrames('anglerSnapNoise', 'noise', sweepFrames(30000, 6000, 8, 0.3, 0));
      break;
    case 'splash':
      playFrames('anglerSplash', 'noise', sweepFrames(22000, 3000, 16, 0.3, 0));
      break;
    case 'plop':
      playFrames('anglerPlop', 0.5, sweepFrames(300, 900, 5, 0.22, 0.05));
      break;
    case 'flop':
      playFrames('anglerFlop', 'noise', sweepFrames(6000, 2500, 5, 0.25, 0));
      break;
    case 'squawk':
      playFrames('anglerSquawk', 0.25, [[880, 0.2], [988, 0.22], [880, 0.2], [0, 0], [932, 0.2], [830, 0.14]]);
      break;
    case 'clack':
      playFrames('anglerClack', 0.125, [[1976, 0.2], [0, 0], [1976, 0.16]]);
      break;
    case 'fuse':
      playFrames('anglerFuse', 0.125, [[3520, 0.12], [0, 0]]);
      break;
  }
}

// VARIABLES

const anglerCalmChords = ['G', 'D', 'Em', 'C', 'G', 'D', 'C', 'D'];
const anglerDriveChords = ['Em', 'C', 'D', 'G', 'Em', 'C', 'D', 'B', 'C', 'D', 'G', 'Em', 'Am', 'D', 'G', 'D'];

const anglerStageSong = {
  bpm: 150,
  loop: true,
  tracks: [
    {
      wave: 0.5,
      volume: 0.085,
      decay: 0.35,
      vibrato: true,
      notes: parseMelody(`
        D5:4 G5:4 F#5:2 E5:2 D5:4
        A4:6 B4:2 C5:4 D5:4
        B4:4 E5:4 D5:2 B4:2 G4:4
        E5:8 D5:4 C5:4
        D5:4 G5:4 A5:2 B5:2 A5:4
        F#5:6 E5:2 D5:4 A4:4
        G5:4 E5:4 C5:4 E5:4
        D5:12 .:4
        E5:2 .:1 E5:1 G5:2 B5:2 A5:2 G5:2 F#5:2 G5:2
        E5:4 C5:2 E5:2 G5:6 .:2
        F#5:2 .:1 F#5:1 A5:2 D6:2 C6:2 B5:2 A5:2 F#5:2
        G5:8 D5:4 B4:4
        E5:2 .:1 E5:1 G5:2 B5:2 C6:2 B5:2 A5:2 G5:2
        A5:4 G5:2 E5:2 C6:6 B5:2
        A5:2 G5:2 F#5:2 E5:2 F#5:2 A5:2 D6:4
        D#6:8 B5:4 F#5:4
        G5:2 .:2 G5:2 A5:2 G5:4 E5:4
        F#5:2 .:2 F#5:2 G5:2 A5:4 D5:4
        B5:4 A5:2 G5:2 D5:4 G5:4
        E5:6 F#5:2 G5:4 B5:4
        C6:4 B5:2 A5:2 E5:4 A5:4
        F#5:4 E5:2 D5:2 A5:4 F#5:4
        G5:2 A5:2 B5:4 D6:4 B5:4
        A5:8 .:4 F#5:2 A5:2
      `),
    },
    {
      wave: 0.125,
      volume: 0.045,
      notes: [...anglerArpTrack(anglerCalmChords, [0, 1, 2, 3, 2, 1, 2, 1], 2), ...anglerArpTrack(anglerDriveChords, [0, 1, 2, 3, 2, 1], 1)],
    },
    {
      wave: 'tri',
      volume: 0.2,
      notes: [...anglerCalmBass(anglerCalmChords), ...bassTrack(anglerDriveChords, 16, 'drive')],
    },
    {
      wave: 'noise',
      volume: 0.1,
      notes: drumTrack(24, bar => {
        if (bar < 7) return 'k . . . h . . . k . h . h . . .';
        if (bar === 7) return 'k . . . s . . . k . s . s s s s';
        if (bar % 4 === 3) return 'k h s h k h s h k k s h s s s s';
        return bar % 2 ? 'k h s h k h s h k k s h k h s o' : 'k h s h k h s h k h s h k h s h';
      }),
    },
  ],
};
