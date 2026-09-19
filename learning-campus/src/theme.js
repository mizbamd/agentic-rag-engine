/** Original Verity theme via Web Audio. No game music or samples. */

const MELODY = [
  [349.23, 0.7],
  [440.0, 0.7],
  [392.0, 0.35],
  [440.0, 0.35],
  [523.25, 1.4],
  [0, 0.2],
  [587.33, 0.7],
  [523.25, 0.7],
  [440.0, 0.7],
  [349.23, 0.7],
  [392.0, 0.7],
  [440.0, 0.35],
  [466.16, 0.35],
  [440.0, 0.7],
  [392.0, 0.7],
  [349.23, 1.6],
  [0, 0.8],
];

let ctx;
let master;
let padGain;
let timer;
let playing = false;
let muted = false;
let started = false;
let padOn = false;

export function initTheme({ muted: startMuted = false } = {}) {
  muted = Boolean(startMuted);
}

export function setThemeMuted(value) {
  muted = Boolean(value);
  if (master) master.gain.setTargetAtTime(muted ? 0 : 0.09, ctx?.currentTime || 0, 0.05);
  if (muted) stopTheme();
  else if (started) startTheme();
  return muted;
}

export function isThemeMuted() {
  return muted;
}

export function isThemePlaying() {
  return playing && !muted;
}

export async function startTheme() {
  started = true;
  if (muted || playing) return playing;
  const audio = ensureContext();
  if (!audio) return false;
  try {
    if (audio.state === "suspended") await audio.resume();
  } catch {
    return false;
  }
  if (audio.state !== "running") return false;
  playing = true;
  master.gain.setTargetAtTime(0.09, audio.currentTime, 0.08);
  if (!padOn) {
    hum(audio);
    padOn = true;
  }
  schedule(audio, audio.currentTime + 0.05);
  return true;
}

export function stopTheme() {
  playing = false;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (master && ctx) master.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
}

export function duckTheme(on) {
  if (!master || !ctx || muted || !playing) return;
  master.gain.setTargetAtTime(on ? 0.03 : 0.09, ctx.currentTime, 0.08);
}

function ensureContext() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1400;
    padGain = ctx.createGain();
    padGain.gain.value = 0.18;
    padGain.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);
  }
  return ctx;
}

function hum(audio) {
  const freqs = [174.61, 220.0, 261.63];
  freqs.forEach((f, i) => {
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.type = i === 0 ? "sine" : "triangle";
    o.frequency.value = f;
    g.gain.value = 0.12 / (i + 1);
    o.connect(g);
    g.connect(padGain);
    o.start();
  });
}

function tone(audio, freq, when, dur) {
  if (!freq) return;
  const o = audio.createOscillator();
  const g = audio.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, when);
  g.gain.linearRampToValueAtTime(0.22, when + 0.04);
  g.gain.exponentialRampToValueAtTime(0.001, when + dur);
  o.connect(g);
  g.connect(master);
  o.start(when);
  o.stop(when + dur + 0.02);
}

function schedule(audio, startAt) {
  if (!playing || muted) return;
  let t = startAt;
  const beat = 0.42;
  for (const [freq, beats] of MELODY) {
    const dur = beats * beat;
    tone(audio, freq, t, dur * 0.92);
    t += dur;
  }
  const wait = Math.max(0, (t - audio.currentTime) * 1000 - 40);
  timer = setTimeout(() => schedule(audio, Math.max(audio.currentTime, t)), wait);
}
