let questions = [];
let currentIndex = 0;
let answers = [];

const quizContainer = document.getElementById('quiz-container');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const progress = document.getElementById('progress');
const scorePreview = document.getElementById('score-preview');
const message = document.getElementById('message');

async function loadQuestions() {
    try {
        const response = await fetch('/api/questions');
        if (!response.ok) throw new Error();
        questions = await response.json();

        if (!questions.length) {
            message.textContent = 'No quiz questions are available.';
            progress.textContent = '0 questions';
            return;
        }

        renderQuestion();
    } catch (error) {
        message.textContent = 'Could not connect to the quiz server.';
    }
}

function renderQuestion() {
    const q = questions[currentIndex];

    progress.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    scorePreview.textContent = `Answered: ${answers.length}`;

    quizContainer.innerHTML = `
        <h3 class="question-title">${escapeHtml(q.question_text)}</h3>
        ${createOption(q, 'A', q.option_a)}
        ${createOption(q, 'B', q.option_b)}
        ${createOption(q, 'C', q.option_c)}
        ${createOption(q, 'D', q.option_d)}
    `;

    const previous = answers.find(a => a.questionId === q.id);
    if (previous) {
        const radio = document.querySelector(
            `input[name="answer"][value="${previous.selectedOption}"]`
        );
        if (radio) radio.checked = true;
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }

    nextBtn.hidden = currentIndex === questions.length - 1;
    submitBtn.hidden = currentIndex !== questions.length - 1;
}

function createOption(q, letter, text) {
    return `
        <label class="option">
            <input type="radio" name="answer" value="${letter}">
            <strong>${letter}.</strong> ${escapeHtml(text)}
        </label>
    `;
}

quizContainer.addEventListener('change', event => {
    if (event.target.name === 'answer') {
        saveAnswer(event.target.value);
        nextBtn.disabled = false;
        submitBtn.disabled = false;
        scorePreview.textContent = `Answered: ${answers.length}`;
    }
});

function saveAnswer(selectedOption) {
    const questionId = questions[currentIndex].id;
    const existing = answers.find(a => a.questionId === questionId);

    if (existing) {
        existing.selectedOption = selectedOption;
    } else {
        answers.push({ questionId, selectedOption });
    }
}

nextBtn.addEventListener('click', () => {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
    }
});

submitBtn.addEventListener('click', submitQuiz);

async function submitQuiz() {
    try {
        submitBtn.disabled = true;

        const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Submission failed');
        }

        window.location.href =
            `/result.html?score=${result.score}&total=${result.total}&percentage=${result.percentage}`;
    } catch (error) {
        message.textContent = error.message;
        submitBtn.disabled = false;
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

loadQuestions();
