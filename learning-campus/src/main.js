import { createCampus } from "./campus.js";
import {
  GRADES,
  SUBJECTS,
  LINES,
  getLesson,
  generateProblem,
  checkAnswer,
  pickLine,
  gradeLabel,
} from "./content.js";
import { initVoice, speak, setMuted, isMuted } from "./voice.js";
import {
  initTheme,
  startTheme,
  setThemeMuted,
  isThemeMuted,
  duckTheme,
} from "./theme.js";
import {
  loadProgress,
  saveProgress,
  getScore,
  recordAnswer,
  markLesson,
} from "./progress.js";

const MAIN_SUBJECTS = SUBJECTS.filter((s) =>
  ["math", "science", "geography"].includes(s.id)
);

const state = loadProgress();
const ui = {
  gradeScreen: document.getElementById("grade-screen"),
  subjectScreen: document.getElementById("subject-screen"),
  gradeGrid: document.getElementById("grade-grid"),
  subjectGrid: document.getElementById("subject-grid"),
  subjectEyebrow: document.getElementById("subject-eyebrow"),
  hud: document.getElementById("hud"),
  help: document.getElementById("help"),
  gradeChip: document.getElementById("grade-chip"),
  subjectChip: document.getElementById("subject-chip"),
  muteBtn: document.getElementById("mute-btn"),
  themeBtn: document.getElementById("theme-btn"),
  scoreChip: document.getElementById("score-chip"),
  prompt: document.getElementById("prompt"),
  speech: document.getElementById("speech"),
  speechText: document.getElementById("speech-text"),
  panel: document.getElementById("panel"),
  backGrade: document.getElementById("back-to-grade"),
  boot: document.getElementById("boot-screen"),
  bootSub: document.getElementById("boot-sub"),
  bootMute: document.getElementById("boot-mute"),
  quiz: document.getElementById("quiz-board"),
  quizKicker: document.getElementById("quiz-kicker"),
  quizPrompt: document.getElementById("quiz-prompt"),
  quizChoices: document.getElementById("quiz-choices"),
  quizInput: document.getElementById("quiz-input"),
  quizSubmit: document.getElementById("quiz-submit"),
  quizPad: document.getElementById("quiz-pad"),
  quizFb: document.getElementById("quiz-fb"),
  quizHint: document.getElementById("quiz-hint"),
  quizSkip: document.getElementById("quiz-skip"),
};

let campus;
let lastBiome;
let panelMode = null;
let problem = null;
let quizBusy = false;

initVoice({
  muted: state.muted,
  onSpeak(text) {
    ui.speech.classList.remove("hidden");
    ui.speechText.textContent = text;
    campus?.setSpeaking(true);
    duckTheme(true);
    clearTimeout(initVoice._t);
    initVoice._t = setTimeout(() => {
      campus?.setSpeaking(false);
      duckTheme(false);
    }, 1600);
  },
});
initTheme({ muted: state.musicMuted });

function say(text) {
  speak(text);
}

GRADES.forEach((g) => {
  const b = document.createElement("button");
  b.className = "grade-btn";
  b.type = "button";
  b.textContent = g;
  b.addEventListener("click", () => selectGrade(g));
  ui.gradeGrid.appendChild(b);
});

MAIN_SUBJECTS.forEach((s) => {
  const b = document.createElement("button");
  b.className = "subject-btn";
  b.type = "button";
  b.innerHTML = `<div class="icon">${s.icon}</div><strong>${s.name}</strong><span>${s.blurb}</span>`;
  b.addEventListener("click", () => selectSubject(s.id));
  ui.subjectGrid.appendChild(b);
});

ui.backGrade.addEventListener("click", showGrade);
ui.gradeChip.addEventListener("click", showGrade);
ui.subjectChip.addEventListener("click", showSubject);
ui.muteBtn.addEventListener("click", () => {
  state.muted = setMuted(!isMuted());
  saveProgress(state);
  refreshHud();
  say(state.muted ? LINES.muteOn : LINES.muteOff);
});
ui.themeBtn.addEventListener("click", toggleTheme);
ui.bootMute.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleTheme();
});

function toggleTheme() {
  state.musicMuted = setThemeMuted(!isThemeMuted());
  saveProgress(state);
  refreshHud();
  if (!state.musicMuted) startTheme();
}

async function tryTheme() {
  if (state.musicMuted) return;
  const ok = await startTheme();
  ui.bootSub.textContent = ok
    ? "Preparing the trails…"
    : "Click to begin — theme and trails";
}

function finishBoot() {
  const params = new URLSearchParams(location.search);
  if (GRADES.includes(params.get("grade"))) state.grade = params.get("grade");
  if (MAIN_SUBJECTS.some((s) => s.id === params.get("subject"))) {
    state.subject = params.get("subject");
  }
  ui.boot.classList.add("fade");
  setTimeout(() => ui.boot.classList.add("hidden"), 500);
  if (state.grade && state.subject) selectSubject(state.subject);
  else if (state.grade) {
    showSubject();
    say(LINES.pickGrade(state.grade));
  } else showGrade();
}

function showGrade() {
  ui.gradeScreen.classList.remove("hidden");
  ui.subjectScreen.classList.add("hidden");
  ui.quiz.classList.add("hidden");
  say(LINES.welcome);
}

function showSubject() {
  if (!state.grade) return showGrade();
  ui.gradeScreen.classList.add("hidden");
  ui.subjectScreen.classList.remove("hidden");
  ui.quiz.classList.add("hidden");
  ui.subjectEyebrow.textContent = `${gradeLabel(state.grade)} · choose a subject`;
}

function selectGrade(g) {
  state.grade = g;
  saveProgress(state);
  showSubject();
  say(LINES.pickGrade(g));
}

function selectSubject(id) {
  state.subject = id;
  saveProgress(state);
  ui.gradeScreen.classList.add("hidden");
  ui.subjectScreen.classList.add("hidden");
  ui.hud.classList.remove("hidden");
  ui.help.classList.remove("hidden");
  refreshHud();
  if (!campus) {
    campus = createCampus(document.getElementById("scene"), {
      onZone: handleZone,
      onInteract: handleInteract,
    });
  }
  say(LINES.pickSubject(state.grade, id));
  startOnScreenQuiz();
}

function refreshHud() {
  ui.gradeChip.textContent = state.grade ? gradeLabel(state.grade) : "Grade";
  const s = SUBJECTS.find((x) => x.id === state.subject);
  ui.subjectChip.textContent = s ? s.name : "Subject";
  ui.muteBtn.textContent = state.muted ? "Voice off" : "Voice on";
  ui.muteBtn.setAttribute("aria-pressed", String(!state.muted));
  const themeLabel = state.musicMuted ? "Theme off" : "Theme on";
  ui.themeBtn.textContent = themeLabel;
  ui.themeBtn.setAttribute("aria-pressed", String(!state.musicMuted));
  ui.bootMute.textContent = themeLabel;
  const sc = getScore(state, state.grade, state.subject || "math");
  ui.scoreChip.textContent = `${sc.correct} / ${sc.attempted}`;
}

function handleZone(zone) {
  if (!zone) {
    ui.prompt.classList.add("hidden");
    return;
  }
  ui.prompt.textContent = zone.label;
  ui.prompt.classList.remove("hidden");
  if (zone.biome && zone.biome !== lastBiome) {
    lastBiome = zone.biome;
    say(LINES.enterBiome[zone.biome]);
  }
}

function handleInteract(zone) {
  if (!zone || !state.grade || !state.subject) return;
  if (zone.id === "plaza") return openTalk();
  openLesson(zone.subject || state.subject);
}

function openTalk() {
  panelMode = "talk";
  const sc = getScore(state, state.grade, state.subject);
  ui.panel.classList.remove("hidden");
  ui.panel.innerHTML = `
    <h2>Verity</h2>
    <p class="meta">${gradeLabel(state.grade)} · ${SUBJECTS.find((s) => s.id === state.subject).name}</p>
    <p>${LINES.talk(state.grade, state.subject)}</p>
    <p class="feedback">${LINES.progress(sc, state.grade, state.subject)}</p>
    <div class="actions">
      <button class="action-btn primary" id="start-practice">Start practice</button>
      <button class="action-btn" id="close-panel">Keep exploring</button>
    </div>`;
  say(LINES.talk(state.grade, state.subject));
  document.getElementById("start-practice").onclick = () => startPractice();
  document.getElementById("close-panel").onclick = closePanel;
}

function openLesson(subject) {
  const lesson = getLesson(subject, state.grade);
  panelMode = "lesson";
  ui.panel.classList.remove("hidden");
  ui.panel.innerHTML = `
    <h2>${lesson.title}</h2>
    <p class="meta">${gradeLabel(state.grade)} · ${SUBJECTS.find((s) => s.id === subject).name}</p>
    ${lesson.paragraphs.map((p) => `<p>${p}</p>`).join("")}
    <div class="actions">
      <button class="action-btn primary" id="start-check">Check for understanding</button>
      <button class="action-btn" id="close-panel">Close</button>
    </div>`;
  say(LINES.enterLodge(subject, state.grade) + " " + lesson.speak);
  document.getElementById("start-check").onclick = () => startPractice(subject, true);
  document.getElementById("close-panel").onclick = closePanel;
}

function startPractice(subject = state.subject, fromLesson = false) {
  panelMode = fromLesson ? "check" : "practice";
  nextProblem(subject, fromLesson, 0);
}

function nextProblem(subject, fromLesson, n) {
  problem = generateProblem(subject, state.grade);
  const total = fromLesson ? 3 : 5;
  ui.panel.classList.remove("hidden");
  const choices =
    problem.type === "choice"
      ? `<div class="choices">${problem.choices
          .map(
            (c) =>
              `<button class="choice-btn" data-id="${encodeURIComponent(c.id)}">${c.label}</button>`
          )
          .join("")}</div>`
      : `<div class="answer-row"><input id="answer-in" type="text" inputmode="decimal" placeholder="Type your answer" /><button class="action-btn primary" id="submit-ans">Check</button></div>`;
  ui.panel.innerHTML = `
    <h2>${fromLesson ? "Check for understanding" : "Practice with Verity"}</h2>
    <p class="meta">${gradeLabel(state.grade)} · ${SUBJECTS.find((s) => s.id === subject).name} · ${n + 1}/${total}</p>
    <div class="progress-bar"><span style="width:${(n / total) * 100}%"></span></div>
    <p style="white-space:pre-wrap">${problem.prompt}</p>
    ${choices}
    <p class="feedback" id="fb"></p>
    <div class="actions">
      <button class="action-btn" id="hint-btn">Hint</button>
      <button class="action-btn" id="close-panel">Close</button>
    </div>`;
  say(problem.speak);
  ui.panel.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.onclick = () => gradeAnswer(decodeURIComponent(btn.dataset.id), btn, subject, fromLesson, n, total);
  });
  const submit = document.getElementById("submit-ans");
  if (submit) {
    const input = document.getElementById("answer-in");
    const go = () => gradeAnswer(input.value, null, subject, fromLesson, n, total);
    submit.onclick = go;
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") go();
    });
    input.focus();
  }
  document.getElementById("hint-btn").onclick = () => {
    say(LINES.hintLead + problem.hint);
    document.getElementById("fb").textContent = problem.hint;
  };
  document.getElementById("close-panel").onclick = closePanel;
}

function gradeAnswer(value, btn, subject, fromLesson, n, total) {
  const ok = checkAnswer(problem, value);
  const fb = document.getElementById("fb");
  fb.className = "feedback " + (ok ? "good" : "bad");
  fb.textContent = ok ? pickLine(LINES.correct) : pickLine(LINES.incorrect);
  if (btn) btn.classList.add(ok ? "correct" : "wrong");
  if (ok) {
    recordAnswer(state, state.grade, subject, true);
    refreshHud();
    say(fb.textContent);
    setTimeout(() => {
      if (n + 1 >= total) finishPractice(subject, fromLesson);
      else nextProblem(subject, fromLesson, n + 1);
    }, 700);
  } else {
    recordAnswer(state, state.grade, subject, false);
    refreshHud();
    say(fb.textContent + " " + LINES.hintLead + problem.hint);
  }
}

function finishPractice(subject, fromLesson) {
  if (fromLesson) markLesson(state, state.grade, subject);
  const sc = getScore(state, state.grade, subject);
  ui.panel.innerHTML = `
    <h2>Nice work</h2>
    <p>${LINES.lessonDone(subject)}</p>
    <p class="feedback good">${sc.correct} correct of ${sc.attempted} on this computer.</p>
    <div class="actions">
      <button class="action-btn primary" id="start-practice">More practice</button>
      <button class="action-btn" id="close-panel">Back to campus</button>
    </div>`;
  say(LINES.lessonDone(subject));
  document.getElementById("start-practice").onclick = () => startPractice(subject);
  document.getElementById("close-panel").onclick = closePanel;
}

function closePanel() {
  panelMode = null;
  ui.panel.classList.add("hidden");
  ui.panel.innerHTML = "";
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function choicesFor(p) {
  if (p.choices?.length) return p.choices;
  const ans = String(p.answer);
  const n = Number(ans);
  let extras = [ans];
  if (!Number.isNaN(n)) extras = [n, n + 1, n - 1, n + 2, n - 2, n + 10].map(String);
  const uniq = [...new Set(extras)].filter((x) => x !== "" && x !== "NaN");
  if (!uniq.includes(ans)) uniq.unshift(ans);
  return shuffle(uniq)
    .slice(0, 4)
    .map((label) => ({ id: label, label }));
}

function startOnScreenQuiz() {
  ui.quiz.classList.remove("hidden");
  buildNumPad();
  showOnScreenProblem();
}

function showOnScreenProblem() {
  quizBusy = false;
  problem = generateProblem(state.subject, state.grade);
  const subj = SUBJECTS.find((s) => s.id === state.subject);
  ui.quizKicker.textContent = `${gradeLabel(state.grade)} · ${subj.name}`;
  ui.quizPrompt.textContent = problem.prompt;
  ui.quizInput.value = "";
  ui.quizFb.textContent = "";
  ui.quizFb.className = "feedback";
  ui.quizChoices.innerHTML = "";
  choicesFor(problem).forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "choice-btn";
    b.textContent = c.label;
    b.addEventListener("click", () => submitQuiz(c.id, b));
    ui.quizChoices.appendChild(b);
  });
  say(problem.speak);
  ui.quizInput.focus();
}

function buildNumPad() {
  if (ui.quizPad.dataset.ready) return;
  ui.quizPad.dataset.ready = "1";
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "−", "0", ".", "⌫"];
  keys.forEach((k) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = k === "−" ? "−" : k;
    if (k === "⌫") b.classList.add("wide");
    b.addEventListener("click", () => {
      if (k === "⌫") ui.quizInput.value = ui.quizInput.value.slice(0, -1);
      else if (k === "−") ui.quizInput.value += "-";
      else ui.quizInput.value += k === "." ? "." : k;
      ui.quizInput.focus();
    });
    ui.quizPad.appendChild(b);
  });
}

function submitQuiz(raw, choiceBtn) {
  if (quizBusy || !problem) return;
  const value = raw == null ? ui.quizInput.value : raw;
  if (String(value).trim() === "") {
    ui.quizFb.className = "feedback bad";
    ui.quizFb.textContent = "Type an answer or tap a choice, then Submit.";
    return;
  }
  const ok = checkAnswer(problem, value);
  ui.quizFb.className = "feedback " + (ok ? "good" : "bad");
  ui.quizFb.textContent = ok ? pickLine(LINES.correct) : `${pickLine(LINES.incorrect)} ${problem.hint}`;
  if (choiceBtn) choiceBtn.classList.add(ok ? "correct" : "wrong");
  recordAnswer(state, state.grade, state.subject, ok);
  refreshHud();
  if (ok) {
    quizBusy = true;
    say(ui.quizFb.textContent);
    setTimeout(showOnScreenProblem, 850);
  } else {
    say(pickLine(LINES.incorrect) + " " + LINES.hintLead + problem.hint);
  }
}

ui.quizSubmit.addEventListener("click", () => submitQuiz(ui.quizInput.value));
ui.quizHint.addEventListener("click", () => {
  if (!problem) return;
  ui.quizFb.className = "feedback";
  ui.quizFb.textContent = problem.hint;
  say(LINES.hintLead + problem.hint);
});
ui.quizSkip.addEventListener("click", () => showOnScreenProblem());
ui.quizInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submitQuiz(ui.quizInput.value);
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  if (ui.quiz.classList.contains("hidden")) return;
  if (e.target === ui.quizInput) return;
  const tag = e.target?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
  e.preventDefault();
  submitQuiz(ui.quizInput.value);
});

refreshHud();
document.addEventListener(
  "pointerdown",
  (e) => {
    if (e.target.closest("#boot-mute, #theme-btn")) return;
    tryTheme();
  },
  { capture: true }
);
tryTheme();
setTimeout(finishBoot, 1400);
