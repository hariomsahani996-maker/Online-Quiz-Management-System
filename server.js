const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// DATABASE CONNECTION
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'root',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'online_quiz',
  waitForConnections: true,
  connectionLimit: 10
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.static(__dirname));
app.get('/api/questions', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, question_text, option_a, option_b, option_c, option_d
             FROM questions ORDER BY id`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to load questions.' });
    }
});

app.post('/api/quiz/submit', async (req, res) => {
    try {
        const answers = req.body.answers;

        if (!Array.isArray(answers)) {
            return res.status(400).json({ error: 'Answers must be an array.' });
        }

        const ids = answers.map(a => Number(a.questionId)).filter(Number.isInteger);

        if (ids.length === 0) {
            return res.status(400).json({ error: 'No answers submitted.' });
        }

        const placeholders = ids.map(() => '?').join(',');
        const [questions] = await pool.query(
            `SELECT id, correct_option FROM questions WHERE id IN (${placeholders})`,
            ids
        );

        const correctMap = new Map(
            questions.map(q => [q.id, q.correct_option])
        );

        let score = 0;

        answers.forEach(answer => {
            const questionId = Number(answer.questionId);
            const selected = String(answer.selectedOption || '').toUpperCase();
            if (correctMap.get(questionId) === selected) {
                score++;
            }
        });

        res.json({
            score,
            total: questions.length,
            percentage: questions.length
                ? Math.round((score / questions.length) * 100)
                : 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to submit quiz.' });
    }
});

app.get('/api/admin/questions', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM questions ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to load questions.' });
    }
});

app.post('/api/admin/questions', async (req, res) => {
    try {
        const {
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option
        } = req.body;

        if (!question_text || !option_a || !option_b || !option_c || !option_d) {
            return res.status(400).json({ error: 'All question fields are required.' });
        }

        if (!['A', 'B', 'C', 'D'].includes(correct_option)) {
            return res.status(400).json({ error: 'Correct option must be A, B, C, or D.' });
        }

        const [result] = await pool.query(
            `INSERT INTO questions
             (question_text, option_a, option_b, option_c, option_d, correct_option)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [question_text, option_a, option_b, option_c, option_d, correct_option]
        );

        res.status(201).json({ id: result.insertId, message: 'Question added.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to add question.' });
    }
});

app.delete('/api/admin/questions/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({ error: 'Invalid question ID.' });
        }

        const [result] = await pool.query(
            'DELETE FROM questions WHERE id = ?',
            [id]
        );

        if (!result.affectedRows) {
            return res.status(404).json({ error: 'Question not found.' });
        }

        res.json({ message: 'Question deleted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to delete question.' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Online Quiz Management System running at http://localhost:${PORT}`);
});
