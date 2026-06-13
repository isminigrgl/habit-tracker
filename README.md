![CI](https://github.com/isminigrgl/habit-tracker/actions/workflows/ci.yml/badge.svg)
# habit-tracker
Habit tracker app — Group Assignment 3

## Project Overview

The Habit Tracker application allows users to:

- Create an account and log in
- Create and manage habits
- Track daily habit completion
- Monitor progress and statistics
- Receive habit-related tracking functionality through a web interface

## Technology Stack

**Frontend**
- React
- Vite
- Axios
- React Router DOM

**Backend**
- Node.js
- Express.js
- JWT Authentication
- Bcrypt

**Database**
- MySQL

**Project Management / Collaboration**
- GitHub
- Jira


## Installation Instructions

### 1. Clone the repository

```bash
git clone https://github.com/isminigrgl/habit-tracker.git
```

### 2. Navigate to the project folder

```bash
cd habit-tracker
```

### 3. Install dependencies

```bash
npm install
```


## Database Configuration

The application requires a local MySQL server.

Create a MySQL database named:

```sql
habit_tracker
```

Then import the provided database files:

- `schema.sql`
- `seed.sql`


## Environment Variables

Create a `.env` file in the project root and configure:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=habit_tracker
DB_PORT=3306
```


## Running the Application

### Start Backend Server

```bash
npm run server
```

Backend runs on:

```text
http://localhost:3000
```


### Start Frontend Application

Open a second terminal and run:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```


## Project Structure/Architecture

```text
habit-tracker/
│
├── config/
├── controllers/
├── routes/
├── src/
├── schema.sql
├── seed.sql
├── server.js
├── package.json
└── .env
```

---

## Notes

- MySQL must be running before starting the backend server.
- The backend must be started before attempting registration/login.
- Frontend and backend must run simultaneously in different terminals.
