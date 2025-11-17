📚 Fullstack Task App (Node.js + Express + Prisma + RBAC)
A complete production-grade backend for a fullstack task management application.
Built with Node.js, Express, Prisma ORM, PostgreSQL, and JWT Authentication, featuring role-based access control (RBAC) and an admin approval workflow.

🚀 Features
🔐 Authentication
Login with email or mobile

Secure hashed passwords (bcrypt)

JWT-based authentication

Admin-approved registration system

Automatic session invalidation on new device login

👥 Role-Based Access Control (RBAC)
Roles supported:

ADMIN

FACULTY

STUDENT

Admins can:

Approve users

Manage users (view/edit/delete)

Access all resources

Faculty can:

Manage tasks, students (limited access)

Students can:

Access their own profiles & tasks only

📝 Task Management
Create, update, delete tasks

Assign tasks to users

Status tracking (Pending / In Progress / Completed)

🛢️ Database (Prisma + PostgreSQL)
Strong schema-based models

Migrations support

Auto-generated Prisma Client

Seed script to create default Admin user

📁 Project Structure
fullstack-task-app/
│── prisma/
│   ├── schema.prisma
│   └── seed.js
│
│── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
│── .env
│── package.json
│── README.md
🛠️ Tech Stack
Layer	Technology
Backend Framework	Node.js, Express.js
ORM	Prisma ORM
Database	PostgreSQL
Auth	JWT, bcrypt
Validation	Zod (if used)
Deployment	Render / Railway / AWS
🔧 Environment Variables
Create a .env file:

DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@school.com
ADMIN_PASSWORD=Admin@123
ADMIN_MOBILE=9999999999
PORT=5000
🧪 Running the Project
1️⃣ Install dependencies
npm install
2️⃣ Generate Prisma Client
npx prisma generate
3️⃣ Run migrations
npx prisma migrate dev --name init
4️⃣ Seed Admin User
node prisma/seed.js
5️⃣ Start Development Server
npm run dev
📌 API Overview
🔐 Auth Routes
POST /auth/register
POST /auth/login
GET  /auth/me
👤 User Management (Admin only)
GET    /admin/users
PATCH  /admin/users/:id/approve
DELETE /admin/users/:id
📝 Tasks
POST   /tasks
GET    /tasks
PATCH  /tasks/:id
DELETE /tasks/:id
🧰 Scripts
"scripts": {
  "dev": "nodemon src/server.js",
  "start": "node src/server.js",
  "seed": "node prisma/seed.js"
}
🛡️ Security
Bcrypt password hashing

JWT with expiration

Role-based middleware checks

Input validation

Secure environment variables

📦 Deployment
Supported platforms:

Render

Railway

Vercel (Serverless)

AWS EC2

Docker

Use production-ready environment variables & PostgreSQL instance.

🎉 Author
Anil Vishwakarma
GitHub: anilvishwakarma7076