# Online Quiz Management System

A full-stack Online Quiz Management System built with JavaScript, HTML5, CSS3, Node.js/Express, and MySQL.

## Features
- Student quiz interface
- Multiple-choice questions
- Automatic score calculation
- Result page
- Admin dashboard
- Add and delete quiz questions
- MySQL database
- REST API using Express
- Responsive HTML5/CSS3 frontend

## Requirements
- Node.js 18+
- MySQL 8+

## Setup

### 1. Create the database
Open MySQL and run `database.sql`.

### 2. Install dependencies
```bash
npm install
```

### 3. Configure MySQL
Copy `.env.example` to `.env` and update:
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME
- PORT

### 4. Start the server
```bash
npm start
```

Open:
http://localhost:3000

## Project structure

- `server.js` - Express server and REST API
- `database.sql` - MySQL schema and sample questions
- `public/index.html` - Quiz UI
- `public/admin.html` - Admin question management
- `public/result.html` - Result screen
- `public/css/style.css` - Styling
- `public/js/app.js` - Quiz frontend logic
- `public/js/admin.js` - Admin frontend logic
- `.env.example` - Database configuration template

## Note
This is an educational project. For production use, add authentication, authorization, input validation, CSRF protection, rate limiting, and secure deployment configuration.
