# SolveIt

SolveIt is a modern, sleek, and highly-interactive competitive programming platform where users can browse algorithmic problems, write solutions in a browser-based coding environment, and receive automatic verdicts (similar to LeetCode or Codeforces). 

It features an AI Assistant for code reviews, complexity analysis, and debugging, wrapped in a beautiful minimalist dark-mode UI with glassmorphism and fluid animations.

## Tech Stack

The application is built using the MERN stack along with a few other technologies for secure code execution and AI features:

- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Code Execution:** Docker Sandboxing (C++, Java, Python 3 containers to safely execute user-submitted code)
- **AI Integration:** Groq SDK (Llama3 for instantaneous code insights)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt

## Installation & Setup

You can run SolveIt either fully containerized via Docker (Recommended), or manually using your local Node.js environment.

### Option A: Docker (Recommended)
This approach automatically installs the C++ and Java compilers inside the container.
1. Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. The application will be available at `http://localhost:5173`.

### Option B: Manual Setup
If you want to run the servers individually in your terminal:

**1. Compiler Service (Port 5001)**
```bash
cd compiler
npm install
node server.js
```
*Note: You must have `g++`, `python3`, and Java JDK installed on your machine and mapped to your system PATH for all languages to work locally.*

**2. Backend Server (Port 5000)**
```bash
cd backend
npm install
npm run start
```

**3. Frontend Server (Port 5173)**
```bash
cd frontend
npm install
npm run dev
```

## Seeding the Database

If you are setting up the project for the first time, you can seed the database with an Admin account and 10 default competitive programming problems:

```bash
cd backend
npm run seed
```

This creates the following admin account:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`
