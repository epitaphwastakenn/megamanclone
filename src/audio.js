// VARIABLES

const frameTime = 1 / 60;
const noiseRates = [447443, 223721, 111860, 55930, 27965, 18643, 13982, 11186, 8860, 7046, 4709, 3523, 2348, 1761, 880, 440];

let audioCtx = null;
let masterGain = null;
let musicGain = null;
let sfxGain = null;
let audioMuted = false;
const pulseWaves = {};
let noiseLong = null;
let noiseShort = null;
const activeSfx = {};
let chargeVoice = null;

let currentSong = null;
let songTracks = [];
let songTimer = null;
let songStartTime = 0;
let songToken = 0;

// FUNCTIONS

function initAudio() {
  if (audioCtx) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioCtx = new AudioContextClass();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = audioMuted ? 0 : 0.55;
  masterGain.connect(audioCtx.destination);
  musicGain = audioCtx.createGain();
  musicGain.gain.value = 0.8;
  musicGain.connect(masterGain);
  sfxGain = audioCtx.createGain();
  sfxGain.gain.value = 1;
  sfxGain.connect(masterGain);
  for (const duty of [0.125, 0.25, 0.5]) pulseWaves[duty] = makePulseWave(duty);
  pulseWaves.tri = makeTriangleWave();
  noiseLong = makeNoiseBuffer(false);
  noiseShort = makeNoiseBuffer(true);
}

function toggleMute() {
  audioMuted = !audioMuted;
  if (masterGain) masterGain.gain.value = audioMuted ? 0 : 0.55;
}

function makePulseWave(duty) {
  const harmonics = 48;
  const real = new Float32Array(harmonics);
  const imag = new Float32Array(harmonics);
  for (let n = 1; n < harmonics; n++) {
    real[n] = Math.sin(2 * Math.PI * n * duty) / (n * Math.PI);
    imag[n] = (1 - Math.cos(2 * Math.PI * n * duty)) / (n * Math.PI);
  }
  return audioCtx.createPeriodicWave(real, imag);
}

function makeTriangleWave() {
  const harmonics = 48;
  const steps = 32;
  const samples = [];
  for (let i = 0; i < steps; i++) {
    const level = i < 16 ? 15 - i : i - 16;
    samples.push(level / 7.5 - 1);
  }
  const real = new Float32Array(harmonics);
  const imag = new Float32Array(harmonics);
  for (let n = 1; n < harmonics; n++) {
    let a = 0;
    let b = 0;
    for (let i = 0; i < steps; i++) {
      const phase = (2 * Math.PI * n * i) / steps;
      a += samples[i] * Math.cos(phase);
      b += samples[i] * Math.sin(phase);
    }
    real[n] = (2 * a) / steps;
    imag[n] = (2 * b) / steps;
  }
  return audioCtx.createPeriodicWave(real, imag);
}

function makeNoiseBuffer(shortMode) {
  const length = shortMode ? 93 * 64 : 32767;
  const buffer = audioCtx.createBuffer(1, length, 44100);
  const data = buffer.getChannelData(0);
  let register = 1;
  for (let i = 0; i < length; i++) {
    const bit = shortMode ? ((register & 1) ^ ((register >> 6) & 1)) : ((register & 1) ^ ((register >> 1) & 1));
    register = (register >> 1) | (bit << 14);
    data[i] = register & 1 ? 1 : -1;
  }
  return buffer;
}

function noteFrequency(name) {
  const match = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!match) return 0;
  const semitones = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[match[1]];
  const accidental = match[2] === '#' ? 1 : match[2] === 'b' ? -1 : 0;
  const midi = (Number(match[3]) + 1) * 12 + semitones + accidental;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function stopSfx(name) {
  const voice = activeSfx[name];
  if (!voice) return;
  try {
    voice.source.stop();
  } catch (error) {
    voice.source.disconnect();
  }
  delete activeSfx[name];
}

function playFrames(name, wave, frames, volumeScale) {
  if (!audioCtx) return;
  stopSfx(name);
  const now = audioCtx.currentTime + 0.005;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.connect(sfxGain);
  let source;
  const isNoise = wave === 'noise' || wave === 'noiseShort';
  if (isNoise) {
    source = audioCtx.createBufferSource();
    source.buffer = wave === 'noise' ? noiseLong : noiseShort;
    source.loop = true;
  } else {
    source = audioCtx.createOscillator();
    source.setPeriodicWave(pulseWaves[wave]);
  }
  source.connect(gain);
  frames.forEach((frame, index) => {
    const time = now + index * frameTime;
    const value = frame[0];
    const volume = frame[1] * (volumeScale || 1);
    if (isNoise) source.playbackRate.setValueAtTime(Math.max(0.01, value / 44100), time);
    else if (value > 0) source.frequency.setValueAtTime(value, time);
    gain.gain.setValueAtTime(value > 0 ? volume : 0, time);
  });
  const end = now + frames.length * frameTime;
  gain.gain.setValueAtTime(0, end);
  source.start(now);
  source.stop(end + 0.02);
  const voice = { source };
  activeSfx[name] = voice;
  source.onended = () => {
    if (activeSfx[name] === voice) delete activeSfx[name];
    gain.disconnect();
  };
}

function sweepFrames(fromFreq, toFreq, count, fromVol, toVol) {
  const frames = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    frames.push([fromFreq * Math.pow(toFreq / fromFreq, t), fromVol + (toVol - fromVol) * t]);
  }
  return frames;
}

function sequenceFrames(notes, framesEach, volume) {
  const frames = [];
  for (const note of notes) {
    const freq = typeof note === 'number' ? note : noteFrequency(note);
    for (let i = 0; i < framesEach; i++) frames.push([freq, volume * (1 - i / (framesEach * 1.6))]);
  }
  return frames;
}

function playSfx(name) {
  if (!audioCtx) return;
  switch (name) {
    case 'shoot':
      playFrames('shoot', 0.5, sweepFrames(1600, 520, 6, 0.32, 0.12));
      break;
    case 'shootMid':
      playFrames('shoot', 0.25, [...sweepFrames(300, 1400, 3, 0.35, 0.35), ...sweepFrames(1400, 400, 8, 0.35, 0.05)]);
      break;
    case 'shootFull':
      playFrames('shoot', 0.5, [...sweepFrames(200, 1600, 4, 0.4, 0.4), ...sweepFrames(1600, 300, 12, 0.4, 0.05)]);
      playFrames('shootNoise', 'noise', sweepFrames(20000, 4000, 12, 0.25, 0));
      break;
    case 'tink':
      playFrames('tink', 0.125, [[2637, 0.3], [2637, 0.25], [0, 0], [3136, 0.25], [3136, 0.15]]);
      break;
    case 'enemyHit':
      playFrames('enemyHit', 0.125, [[1760, 0.3], [1318, 0.28], [880, 0.22], [660, 0.12]]);
      break;
    case 'explode':
      playFrames('explode', 'noise', sweepFrames(28000, 1800, 20, 0.45, 0));
      break;
    case 'hurt':
      playFrames('hurt', 0.25, [
        [1046, 0.3], [523, 0.3], [1046, 0.3], [523, 0.28], [988, 0.26], [494, 0.24],
        [988, 0.22], [494, 0.2], [932, 0.16], [466, 0.14], [880, 0.1], [440, 0.06],
      ]);
      playFrames('hurtNoise', 'noise', sweepFrames(12000, 3000, 10, 0.2, 0));
      break;
    case 'land':
      playFrames('land', 0.5, [[196, 0.22], [165, 0.16], [131, 0.1], [110, 0.05]]);
      break;
    case 'death': {
      const frames = [];
      for (let rep = 0; rep < 20; rep++) {
        const fade = 1 - rep / 22;
        frames.push(...sweepFrames(1500, 420, 6, 0.36 * fade, 0.18 * fade));
      }
      playFrames('death', 0.5, frames);
      break;
    }
    case 'bossDeath': {
      const frames = [];
      for (let rep = 0; rep < 32; rep++) {
        const fade = 1 - rep / 34;
        frames.push(...sweepFrames(1800, 380, 6, 0.36 * fade, 0.16 * fade));
      }
      playFrames('death', 0.5, frames);
      playFrames('bossDeathNoise', 'noise', sweepFrames(20000, 900, 90, 0.3, 0));
      break;
    }
    case 'teleportIn':
      playFrames('teleport', 0.25, [...sweepFrames(180, 1400, 10, 0.3, 0.3), [1760, 0.3], [1400, 0.26], [1760, 0.22], [1400, 0.18], [1760, 0.12]]);
      break;
    case 'teleportOut':
      playFrames('teleport', 0.25, [[1760, 0.3], [1400, 0.3], [1760, 0.26], ...sweepFrames(1400, 180, 12, 0.26, 0.05)]);
      break;
    case 'tick':
      playFrames('tick', 0.125, [[1976, 0.26], [1976, 0.18], [0, 0]]);
      break;
    case 'oneUp':
      playFrames('oneUp', 0.5, sequenceFrames(['C6', 'E6', 'G6', 'C7', 'G6', 'C7', 'E7'], 4, 0.3));
      break;
    case 'door': {
      const frames = [];
      for (let i = 0; i < 44; i++) frames.push([i % 6 < 3 ? 3523 : 2348, i % 6 < 3 ? 0.32 : 0.18]);
      playFrames('door', 'noiseShort', frames);
      break;
    }
    case 'cutter':
      playFrames('cutter', 0.125, [[2349, 0.14], [2349, 0.12], [1568, 0.12], [1568, 0.1], [2349, 0.1], [2349, 0.08], [1568, 0.08], [1568, 0.06]]);
      break;
    case 'thud':
      playFrames('thud', 'noise', sweepFrames(4709, 440, 12, 0.5, 0));
      break;
    case 'enemyShot':
      playFrames('enemyShot', 0.25, sweepFrames(1100, 500, 5, 0.2, 0.06));
      break;
    case 'menu':
      playFrames('menu', 0.5, [[1318, 0.3], [1318, 0.25], [1318, 0.15]]);
      break;
    case 'blip':
      playFrames('blip', 0.125, [[1568, 0.22], [1568, 0.14]]);
      break;
    case 'pause':
      playFrames('pause', 0.5, [[784, 0.3], [784, 0.3], [784, 0.25], [0, 0], [1046, 0.3], [1046, 0.3], [1046, 0.2], [1046, 0.1]]);
      break;
    case 'bossFill':
      playFrames('tick', 0.5, [[1318, 0.2], [0, 0]]);
      break;
    case 'jumpBig':
      playFrames('jumpBig', 'noise', sweepFrames(8000, 2000, 6, 0.2, 0));
      break;
  }
}

function startChargeSound() {
  if (!audioCtx || chargeVoice) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  osc.setPeriodicWave(pulseWaves[0.25]);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.09, now + 0.3);
  osc.frequency.setValueAtTime(110, now);
  osc.frequency.linearRampToValueAtTime(880, now + 1.3);
  const lfo = audioCtx.createOscillator();
  lfo.type = 'square';
  lfo.frequency.value = 20;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.setValueAtTime(0, now);
  lfoGain.gain.setValueAtTime(140, now + 1.3);
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(gain);
  gain.connect(sfxGain);
  osc.start(now);
  lfo.start(now);
  chargeVoice = { osc, lfo, gain };
}

function stopChargeSound() {
  if (!chargeVoice) return;
  const now = audioCtx.currentTime;
  chargeVoice.gain.gain.setValueAtTime(0, now);
  chargeVoice.osc.stop(now + 0.02);
  chargeVoice.lfo.stop(now + 0.02);
  chargeVoice = null;
}

function compileTrack(track) {
  const events = [];
  let step = 0;
  for (const token of track.notes) {
    events.push({ step, note: token.note, length: token.length });
    step += token.length;
  }
  return { ...track, events, totalSteps: step };
}

function playSong(song) {
  if (!audioCtx) return;
  if (currentSong === song) return;
  stopSong();
  currentSong = song;
  songToken++;
  const token = songToken;
  songTracks = song.tracks.map(track => {
    const compiled = compileTrack(track);
    return { ...compiled, index: 0, loopOffset: 0 };
  });
  songStartTime = audioCtx.currentTime + 0.06;
  const scheduleAhead = () => {
    if (token !== songToken) return;
    scheduleSong(song);
  };
  scheduleAhead();
  songTimer = setInterval(scheduleAhead, 25);
}

function stopSong() {
  songToken++;
  currentSong = null;
  if (songTimer) clearInterval(songTimer);
  songTimer = null;
  for (const track of songTracks) {
    for (const voice of track.voices || []) {
      try {
        voice.stop();
      } catch (error) {
        voice.disconnect();
      }
    }
  }
  songTracks = [];
}

function scheduleSong(song) {
  const stepDuration = 60 / song.bpm / 4;
  const horizon = audioCtx.currentTime + 0.15;
  for (const track of songTracks) {
    track.voices = (track.voices || []).filter(voice => !voice.finished);
    while (true) {
      if (track.index >= track.events.length) {
        if (!song.loop) break;
        track.index = 0;
        track.loopOffset += track.totalSteps;
      }
      const event = track.events[track.index];
      const time = songStartTime + (track.loopOffset + event.step) * stepDuration;
      if (time > horizon) break;
      if (event.note !== '-') scheduleNote(track, event, time, event.length * stepDuration);
      track.index++;
    }
  }
}

function scheduleNote(track, event, time, duration) {
  const gain = audioCtx.createGain();
  gain.connect(musicGain);
  let source;
  const volume = track.volume;
  if (track.wave === 'noise') {
    const drum = drumKit[event.note];
    if (!drum) return;
    source = audioCtx.createBufferSource();
    source.buffer = drum.short ? noiseShort : noiseLong;
    source.loop = true;
    source.playbackRate.setValueAtTime(drum.rate / 44100, time);
    if (drum.endRate) source.playbackRate.linearRampToValueAtTime(drum.endRate / 44100, time + drum.length);
    gain.gain.setValueAtTime(volume * drum.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + drum.length);
    source.connect(gain);
    source.start(time);
    source.stop(time + drum.length + 0.01);
  } else {
    source = audioCtx.createOscillator();
    source.setPeriodicWave(pulseWaves[track.wave]);
    source.frequency.setValueAtTime(noteFrequency(event.note), time);
    source.connect(gain);
    const release = Math.min(duration * 0.92, duration - 0.004);
    if (track.wave === 'tri') {
      gain.gain.setValueAtTime(volume, time);
      gain.gain.setValueAtTime(0, time + release);
    } else {
      const decay = track.decay || 0;
      const sustain = volume * (1 - decay);
      gain.gain.setValueAtTime(volume, time);
      gain.gain.linearRampToValueAtTime(Math.max(0.0001, sustain), time + Math.min(release, 0.12));
      gain.gain.setValueAtTime(Math.max(0.0001, sustain), time + release - 0.003);
      gain.gain.linearRampToValueAtTime(0, time + release);
    }
    if (track.vibrato && duration > 0.25) {
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.value = 6;
      lfoGain.gain.setValueAtTime(0, time);
      lfoGain.gain.setValueAtTime(noteFrequency(event.note) * 0.012, time + 0.18);
      lfo.connect(lfoGain);
      lfoGain.connect(source.frequency);
      lfo.start(time);
      lfo.stop(time + duration);
    }
    source.start(time);
    source.stop(time + duration);
  }
  source.onended = () => {
    source.finished = true;
    gain.disconnect();
  };
  track.voices.push(source);
}
