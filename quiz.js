const allQuestions = [
  { q: "Welche Sportart war in den 1920er Jahren sehr populär?", a: ["E-Sport", "Fußball", "Skateboarden", "Tennis"], correct: "b" },
  { q: "Welche Veranstaltung war international besonders wichtig?", a: ["Tennis WM", "Tour de France", "Olympische Spiele", "Boxkampf Liga"], correct: "c" },
  { q: "Was wurde als Freizeitaktivität bedeutender?", a: ["Kino", "Videospiele", "Streaming", "VR"], correct: "a" },
  { q: "Welche Rolle hatten Sportvereine oft?", a: ["Online Gruppen", "Soziale Treffpunkte", "Nur Schule", "Nur Profisport"], correct: "b" },

  // placeholders (16 more)
  ...Array.from({ length: 16 }, (_, i) => ({
    q: `Platzhalterfrage ${i + 5}`,
    a: ["Antwort A", "Antwort B", "Antwort C", "Antwort D"],
    correct: ["a", "b", "c", "d"][i % 4]
  }))
];

let questions = [];
let currentIndex = 0;
let maxVisited = 0;
let answers = [];

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const quizContainer = document.getElementById("quizContainer");
const questionBox = document.getElementById("questionBox");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const abortBtn = document.getElementById("abortBtn");
const progress = document.getElementById("progress");
const results = document.getElementById("results");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startQuiz() {
  questions = shuffle([...allQuestions]).slice(0, 15);
  answers = Array(15).fill(null);
  currentIndex = 0;
  maxVisited = 0;

  startScreen.classList.add("hidden");
  quizContainer.classList.remove("hidden");

  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentIndex];

  progress.textContent = `Frage ${currentIndex + 1} / ${questions.length}`;

  questionBox.innerHTML = `
    <h2>${q.q}</h2>
    <div class="answers">
      ${q.a.map((ans, i) => {
        const key = ["a","b","c","d"][i];
        return `<div class="answer ${answers[currentIndex] === key ? "selected" : ""}"
                    onclick="selectAnswer('${key}', this)">
                  ${ans}
                </div>`;
      }).join("")}
    </div>
  `;

  backBtn.disabled = currentIndex === 0;

  nextBtn.textContent = currentIndex === questions.length - 1 ? "Finish" : "Weiter";

  nextBtn.onclick = nextStep;
}

function selectAnswer(val, el) {
  answers[currentIndex] = val;
  renderQuestion();
}

function nextStep() {
  if (currentIndex === questions.length - 1) {
    showResults();
    return;
  }

  if (answers[currentIndex] === null) return;

  currentIndex++;
  maxVisited = Math.max(maxVisited, currentIndex);
  renderQuestion();
}

backBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
};

abortBtn.onclick = () => {
  if (confirm("Are you sure you want to stop the quiz?")) {
    location.reload();
  }
};

function showResults() {
  quizContainer.classList.add("hidden");
  results.classList.remove("hidden");

  let score = 0;

  results.innerHTML = `<h1>Ergebnis</h1>`;

  questions.forEach((q, i) => {
    const correct = q.correct;
    const user = answers[i];

    if (user === correct) score++;

    results.innerHTML += `
      <div style="margin-bottom:15px; padding:10px; border:1px solid #ddd;">
        <strong>${q.q}</strong><br/>
        Deine Antwort: ${user || "—"} | Richtig: ${correct}
        ${user === correct ? "✔" : "✖"}
      </div>
    `;
  });

  let grade;
  if (score >= 14) grade = 1;
  else if (score >= 12) grade = 2;
  else if (score >= 9) grade = 3;
  else if (score >= 6) grade = 4;
  else if (score >= 3) grade = 5;
  else grade = 6;

  results.innerHTML =
    `<h1>Ergebnis</h1>
     <h2>${score} / 15 Punkte</h2>
     <h3>Note: ${grade}</h3>
     <button onclick="location.reload()">Zurück zum Start</button>
    ` + results.innerHTML;
}

startBtn.onclick = startQuiz;
