CREATE DATABASE IF NOT EXISTS online_quiz;
USE online_quiz;

CREATE TABLE IF NOT EXISTS questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_text VARCHAR(500) NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option ENUM('A','B','C','D') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO questions
(question_text, option_a, option_b, option_c, option_d, correct_option)
VALUES
('Which language is primarily used to style HTML pages?', 'JavaScript', 'CSS', 'SQL', 'Java', 'B'),
('Which HTML element is used for the largest heading?', '<h6>', '<head>', '<h1>', '<header>', 'C'),
('Which keyword declares a block-scoped variable in JavaScript?', 'var', 'let', 'define', 'dim', 'B'),
('Which SQL command is used to retrieve data?', 'GET', 'FETCH', 'SELECT', 'READ', 'C'),
('Which technology is used to create database tables and queries?', 'CSS3', 'MySQL', 'HTML5', 'Node Package Manager', 'B');
