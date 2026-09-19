/** Original Verity voice via Chrome speechSynthesis only. No game audio. */

let muted = false;
let preferredVoice = null;
let speakingText = "";
let onSpeak;

export function initVoice(options = {}) {
  muted = Boolean(options.muted);
  onSpeak = options.onSpeak;
  if (typeof speechSynthesis === "undefined") return;
  const pick = () => {
    preferredVoice = chooseVoice(speechSynthesis.getVoices());
  };
  pick();
  speechSynthesis.addEventListener("voiceschanged", pick);
}

export function setMuted(value) {
  muted = Boolean(value);
  if (muted) stopSpeaking();
  return muted;
}

export function isMuted() {
  return muted;
}

export function stopSpeaking() {
  speakingText = "";
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}

export function speak(text, { interrupt = true } = {}) {
  if (onSpeak) onSpeak(text);
  if (!text || muted || typeof speechSynthesis === "undefined") return;
  if (interrupt) speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = preferredVoice || chooseVoice(speechSynthesis.getVoices());
  utter.rate = 0.94;
  utter.pitch = 1.12;
  utter.volume = 1;
  utter.lang = utter.voice?.lang || "en-US";
  speakingText = text;
  utter.onend = () => {
    if (speakingText === text) speakingText = "";
  };
  speechSynthesis.speak(utter);
}

function chooseVoice(voices) {
  if (!voices?.length) return null;
  const scored = voices.map((v) => {
    const name = `${v.name} ${v.lang}`.toLowerCase();
    let score = 0;
    if (/en[-_](us|gb|au|ie|za)/.test(name)) score += 4;
    if (/english/.test(name)) score += 2;
    if (/female|woman|girl|samantha|karen|moira|tessa|victoria|zira|fiona|serena|google uk english female/.test(name)) {
      score += 6;
    }
    if (/male|david|daniel|fred|alex/.test(name) && !/female/.test(name)) score -= 3;
    if (v.default) score += 1;
    if (/compact|novelty|whisper/.test(name)) score -= 4;
    return { v, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].v;
}
