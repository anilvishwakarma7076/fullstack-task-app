# Fullstack Task App

This repository contains a complete **full-stack application** with:

- **Frontend:** Angular (inside `/frontend`)
- **Backend:** Node.js + Express (inside `/backend`)

Both projects are separated for clean development, deployment, and scaling.

---

## 🚀 Project Structure

fullstack-task-app/
│
├── frontend/ # Angular application
└── backend/ # Node.js + Express REST API

yaml

---

# 🖥️ Frontend (Angular)

The frontend application is located in the **`/frontend`** directory.

### ▶️ Start Development Server


cd frontend
ng serve
Then open your browser:

arduino
http://localhost:4200/
Angular automatically reloads on file changes.

📦 Generating Components (Frontend)
ng generate component component-name
List all schematics:

ng generate --help
🏗️ Build Angular App
ng build
Build output will be created in:

frontend/dist/
🔧 Backend (Node.js + Express)
The backend API is located in the /backend folder.
It provides:

Authentication

User management

Secure routes

Middleware

Powerful REST API endpoints

▶️ Install Backend Dependencies
cd backend
npm install
▶️ Start Backend Server
npm start
Your Backend API will run at:

arduino
http://localhost:5000/
(or whichever port you configured)

🧪 Testing
✔ Run Angular Unit Tests
cd frontend
ng test
✔ Run Backend Tests (Jest or Mocha)
cd backend
npm test
⚡ End-to-End Testing (Optional)
Angular does not include e2e tools by default.
You may install Cypress, Playwright, or WebDriver depending on your needs.

📚 Additional Resources
Angular CLI: https://angular.dev/tools/cli

Express Documentation: https://expressjs.com/

Node.js Docs: https://nodejs.org

