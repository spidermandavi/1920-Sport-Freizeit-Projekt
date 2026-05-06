const quizForm = document.getElementById('quizForm');
const quizResult = document.getElementById('quizResult');

if (quizForm && quizResult) {
  quizForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const cards = Array.from(quizForm.querySelectorAll('.quiz-card'));
    let score = 0;

    cards.forEach((card) => {
      const correctAnswer = card.dataset.answer;
      const selected = card.querySelector('input[type="radio"]:checked');
      card.classList.remove('correct', 'incorrect');

      if (selected && selected.value === correctAnswer) {
        score += 1;
        card.classList.add('correct');
      } else {
        card.classList.add('incorrect');
      }
    });

    const total = cards.length;
    let feedback = 'Solide Grundlage.';
    if (score === total) feedback = 'Ausgezeichnet.';
    else if (score >= total - 1) feedback = 'Sehr gut.';
    else if (score >= Math.ceil(total / 2)) feedback = 'Gut.';
    else feedback = 'Weiter üben.';

    quizResult.textContent = `Dein Ergebnis: ${score} / ${total} — ${feedback}`;
  });
}
