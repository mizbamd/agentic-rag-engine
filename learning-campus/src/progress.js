const KEY = "learning-campus-v1";

const DEFAULT = {
  grade: null,
  subject: null,
  muted: false,
  musicMuted: false,
  scores: {},
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT, scores: {} };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT,
      ...parsed,
      scores: parsed.scores && typeof parsed.scores === "object" ? parsed.scores : {},
    };
  } catch {
    return { ...DEFAULT, scores: {} };
  }
}

export function saveProgress(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function scoreKey(grade, subject) {
  return `${grade}:${subject}`;
}

export function getScore(state, grade, subject) {
  const k = scoreKey(grade, subject);
  return (
    state.scores[k] || {
      correct: 0,
      attempted: 0,
      streak: 0,
      bestStreak: 0,
      lessonDone: false,
    }
  );
}

export function recordAnswer(state, grade, subject, correct) {
  const k = scoreKey(grade, subject);
  const prev = getScore(state, grade, subject);
  const streak = correct ? prev.streak + 1 : 0;
  state.scores[k] = {
    ...prev,
    correct: prev.correct + (correct ? 1 : 0),
    attempted: prev.attempted + 1,
    streak,
    bestStreak: Math.max(prev.bestStreak, streak),
  };
  saveProgress(state);
  return state.scores[k];
}

export function markLesson(state, grade, subject) {
  const k = scoreKey(grade, subject);
  const prev = getScore(state, grade, subject);
  state.scores[k] = { ...prev, lessonDone: true };
  saveProgress(state);
  return state.scores[k];
}
