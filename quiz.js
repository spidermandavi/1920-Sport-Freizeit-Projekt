const QUIZ_SIZE = 15;
const ANSWER_KEYS = ['a', 'b', 'c', 'd'];

const allQuestions = Array.from({ length: 20 }, (_, index) => {
  const i = index + 1;
  const correctPattern = [
    'b', 'c', 'a', 'd', 'b',
    'a', 'c', 'd', 'b', 'a',
    'c', 'd', 'b', 'c', 'a',
    'd', 'b', 'a', 'c', 'd',
  ];

  return {
    id: i,
    question: `Platzhalterfrage ${i}: Bitte ersetze diese Frage später durch deine echte Quizfrage.`,
    options: {
      a: `Platzhalter-Antwort A${i}`,
      b: `Platzhalter-Antwort B${i}`,
      c: `Platzhalter-Antwort C${i}`,
      d: `Platzhalter-Antwort D${i}`,
    },
    correct: correctPattern[index],
  };
});

const state = {
  questions: [],
  answers: [],
  currentIndex: 0,
  maxVisitedIndex: 0,
  isAnimating: false,
};

const elements = {
  startScreen: document.getElementById('quizStartScreen'),
  startButton: document.getElementById('quizStartButton'),
  app: document.getElementById('quizApp'),
  resultsScreen: document.getElementById('quizResultsScreen'),

  card: document.getElementById('quizCard'),
  questionMeta: document.getElementById('quizQuestionMeta'),
  questionText: document.getElementById('quizQuestionText'),
  options: document.getElementById('quizOptions'),

  backButton: document.getElementById('quizBackButton'),
  forwardButton: document.getElementById('quizForwardButton'),
  continueButton: document.getElementById('quizContinueButton'),
  abortButton: document.getElementById('quizAbortButton'),

  resultsSummary: document.getElementById('quizResultsSummary'),
  resultsList: document.getElementById('quizResultsList'),
  restartButton: document.getElementById('quizRestartButton'),
};

if (
  elements.startScreen &&
  elements.startButton &&
  elements.app &&
  elements.resultsScreen &&
  elements.card &&
  elements.questionMeta &&
  elements.questionText &&
  elements.options &&
  elements.backButton &&
  elements.forwardButton &&
  elements.continueButton &&
  elements.abortButton &&
  elements.resultsSummary &&
  elements.resultsList &&
  elements.restartButton
) {
  elements.startButton.addEventListener('click', startQuiz);
  elements.backButton.addEventListener('click', goBack);
  elements.forwardButton.addEventListener('click', goForward);
  elements.continueButton.addEventListener('click', handleContinue);
  elements.abortButton.addEventListener('click', abortQuiz);
  elements.restartButton.addEventListener('click', resetToStart);

  showScreen('start');
}

function startQuiz() {
  state.questions = pickRandomQuestions(allQuestions, QUIZ_SIZE);
  state.answers = Array(QUIZ_SIZE).fill(null);
  state.currentIndex = 0;
  state.maxVisitedIndex = 0;
  state.isAnimating = false;

  showScreen('app');
  renderQuestion(false);
}

function resetToStart() {
  state.questions = [];
  state.answers = [];
  state.currentIndex = 0;
  state.maxVisitedIndex = 0;
  state.isAnimating = false;

  showScreen('start');
}

function abortQuiz() {
  const stop = window.confirm('Bist du sicher, dass du das Quiz beenden möchtest?');
  if (stop) {
    resetToStart();
  }
}

function showScreen(screen) {
  const isStart = screen === 'start';
  const isApp = screen === 'app';
  const isResults = screen === 'results';

  elements.startScreen.hidden = !isStart;
  elements.app.hidden = !isApp;
  elements.resultsScreen.hidden = !isResults;
}

function pickRandomQuestions(list, count) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function currentQuestion() {
  return state.questions[state.currentIndex];
}

function currentAnswer() {
  return state.answers[state.currentIndex];
}

function renderQuestion(animate = true, direction = 'forward') {
  const question = currentQuestion();
  if (!question) return;

  const renderContent = () => {
    elements.questionMeta.textContent = `Frage ${state.currentIndex + 1} / ${QUIZ_SIZE}`;
    elements.questionText.textContent = question.question;

    elements.options.innerHTML = '';

    ANSWER_KEYS.forEach((key) => {
      const optionButton = document.createElement('button');
      optionButton.type = 'button';
      optionButton.className = 'quiz-option';
      optionButton.dataset.key = key;

      if (currentAnswer() === key) {
        optionButton.classList.add('is-selected');
        optionButton.setAttribute('aria-pressed', 'true');
      } else {
        optionButton.setAttribute('aria-pressed', 'false');
      }

      optionButton.innerHTML = `
        <span class="quiz-option__key">${key.toUpperCase()}</span>
        <span class="quiz-option__text">${question.options[key]}</span>
      `;

      optionButton.addEventListener('click', () => {
        state.answers[state.currentIndex] = key;
        renderQuestion(false);
      });

      elements.options.appendChild(optionButton);
    });

    elements.backButton.disabled = state.currentIndex === 0;
    elements.forwardButton.disabled = state.currentIndex >= state.maxVisitedIndex;
    elements.continueButton.disabled = currentAnswer() === null;

    elements.continueButton.textContent =
      state.currentIndex === QUIZ_SIZE - 1 ? 'Quiz abschließen' : 'Weiter';
  };

  if (!animate) {
    elements.card.classList.remove(
      'quiz-card--out-left',
      'quiz-card--out-right',
      'quiz-card--in-left',
      'quiz-card--in-right'
    );
    renderContent();
    return;
  }

  if (state.isAnimating) return;
  state.isAnimating = true;

  const outClass = direction === 'back' ? 'quiz-card--out-right' : 'quiz-card--out-left';
  const inClass = direction === 'back' ? 'quiz-card--in-left' : 'quiz-card--in-right';

  elements.backButton.disabled = true;
  elements.forwardButton.disabled = true;
  elements.continueButton.disabled = true;

  elements.card.classList.remove(
    'quiz-card--out-left',
    'quiz-card--out-right',
    'quiz-card--in-left',
    'quiz-card--in-right'
  );
  elements.card.classList.add(outClass);

  window.setTimeout(() => {
    elements.card.classList.remove(outClass);
    renderContent();

    elements.card.classList.add(inClass);
    requestAnimationFrame(() => {
      elements.card.classList.remove(inClass);
      state.isAnimating = false;
      renderQuestion(false);
    });
  }, 180);
}

function goBack() {
  if (state.isAnimating) return;
  if (state.currentIndex === 0) return;

  state.currentIndex -= 1;
  renderQuestion(true, 'back');
}

function goForward() {
  if (state.isAnimating) return;
  if (state.currentIndex >= state.maxVisitedIndex) return;

  state.currentIndex += 1;
  renderQuestion(true, 'forward');
}

function handleContinue() {
  if (state.isAnimating) return;
  if (currentAnswer() === null) return;

  if (state.currentIndex === QUIZ_SIZE - 1) {
    finishQuiz();
    return;
  }

  state.currentIndex += 1;
  state.maxVisitedIndex = Math.max(state.maxVisitedIndex, state.currentIndex);
  renderQuestion(true, 'forward');
}

function finishQuiz() {
  const score = state.questions.reduce((sum, question, index) => {
    return sum + (state.answers[index] === question.correct ? 1 : 0);
  }, 0);

  const grade = getGermanGrade(score);

  elements.resultsSummary.innerHTML = `
    <div class="quiz-summary-card">
      <span class="quiz-summary-label">Punkte</span>
      <strong class="quiz-summary-value">${score} / ${QUIZ_SIZE}</strong>
    </div>
    <div class="quiz-summary-card">
      <span class="quiz-summary-label">Note</span>
      <strong class="quiz-summary-value">${grade.note}</strong>
      <span class="quiz-summary-subvalue">${grade.label}</span>
    </div>
    <div class="quiz-summary-card">
      <span class="quiz-summary-label">Bewertung</span>
      <strong class="quiz-summary-value">${grade.feedback}</strong>
    </div>
  `;

  elements.resultsList.innerHTML = '';

  state.questions.forEach((question, index) => {
    const selectedKey = state.answers[index];
    const isCorrect = selectedKey === question.correct;

    const item = document.createElement('article');
    item.className = `quiz-result-item ${isCorrect ? 'quiz-result-item--correct' : 'quiz-result-item--incorrect'}`;

    const selectedText = selectedKey
      ? `${selectedKey.toUpperCase()} – ${question.options[selectedKey]}`
      : 'Keine Antwort';

    const correctText = `${question.correct.toUpperCase()} – ${question.options[question.correct]}`;

    item.innerHTML = `
      <div class="quiz-result-topline">
        <h3>Frage ${index + 1}</h3>
        <span class="quiz-result-badge ${isCorrect ? 'quiz-result-badge--correct' : 'quiz-result-badge--incorrect'}">
          ${isCorrect ? 'Richtig' : 'Falsch'}
        </span>
      </div>
      <p class="quiz-result-question">${question.question}</p>
      <p><strong>Deine Antwort:</strong> ${selectedText}</p>
      <p><strong>Richtige Antwort:</strong> ${correctText}</p>
    `;

    elements.resultsList.appendChild(item);
  });

  showScreen('results');
}

function getGermanGrade(score) {
  if (score >= 14) return { note: '1', label: 'sehr gut', feedback: 'Ausgezeichnet' };
  if (score >= 12) return { note: '2', label: 'gut', feedback: 'Sehr stark' };
  if (score >= 9) return { note: '3', label: 'befriedigend', feedback: 'Solide Leistung' };
  if (score >= 6) return { note: '4', label: 'ausreichend', feedback: 'Gerade noch bestanden' };
  if (score >= 3) return { note: '5', label: 'mangelhaft', feedback: 'Da ist noch Luft nach oben' };
  return { note: '6', label: 'ungenügend', feedback: 'Nochmal anschauen' };
}
