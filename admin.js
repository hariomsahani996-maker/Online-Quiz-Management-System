const form = document.getElementById('question-form');
const list = document.getElementById('question-list');
const message = document.getElementById('admin-message');

async function loadQuestions() {
    try {
        const response = await fetch('/api/admin/questions');
        const questions = await response.json();

        if (!questions.length) {
            list.innerHTML = '<p>No questions found.</p>';
            return;
        }

        list.innerHTML = questions.map(q => `
            <div class="admin-question">
                <strong>${escapeHtml(q.question_text)}</strong>
                <p>A. ${escapeHtml(q.option_a)}</p>
                <p>B. ${escapeHtml(q.option_b)}</p>
                <p>C. ${escapeHtml(q.option_c)}</p>
                <p>D. ${escapeHtml(q.option_d)}</p>
                <p><strong>Correct: ${q.correct_option}</strong></p>
                <button class="btn delete-btn" onclick="deleteQuestion(${q.id})">
                    Delete
                </button>
            </div>
        `).join('');
    } catch (error) {
        message.textContent = 'Unable to load questions.';
    }
}

form.addEventListener('submit', async event => {
    event.preventDefault();

    const data = {
        question_text: document.getElementById('question_text').value.trim(),
        option_a: document.getElementById('option_a').value.trim(),
        option_b: document.getElementById('option_b').value.trim(),
        option_c: document.getElementById('option_c').value.trim(),
        option_d: document.getElementById('option_d').value.trim(),
        correct_option: document.getElementById('correct_option').value
    };

    try {
        const response = await fetch('/api/admin/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Could not add question.');
        }

        message.textContent = 'Question added successfully.';
        message.style.color = '#168a5b';
        form.reset();
        loadQuestions();
    } catch (error) {
        message.textContent = error.message;
        message.style.color = '#c0392b';
    }
});

async function deleteQuestion(id) {
    if (!confirm('Delete this question?')) return;

    try {
        const response = await fetch(`/api/admin/questions/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Could not delete question.');
        }

        loadQuestions();
    } catch (error) {
        message.textContent = error.message;
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
