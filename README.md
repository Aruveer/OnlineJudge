# OnlineJudge

OnlineJudge is a full-stack competitive programming platform where users can browse algorithmic problems, write solutions in a browser-based coding environment, and receive automatic verdicts (similar to LeetCode or Codeforces). 

## Proposed Tech Stack

The application will be built using the MERN stack along with a few other technologies for secure code execution and queue management:

- **Frontend:** React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Message Queue:** Bull + Redis (for handling asynchronous code execution jobs)
- **Code Execution:** Docker Sandboxing (C++, Java, Python 3 containers to safely execute user-submitted code)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt

## Features Planned

- User registration, login, and global leaderboards.
- Problem browsing with difficulty tags.
- Full coding arena with inline test case execution and submission.
- Secure evaluation of code against hidden test cases.
- Support for C++, Java, and Python.
