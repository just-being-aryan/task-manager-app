# ✅ Task Manager App

Live Deployment Link -> https://task-manager-app-iota-three.vercel.app

TEST CREDENTIALS :

email : aryan@example.com
password : aryantest

--------------------

A full-stack task management application built using:

- **MySQL** (Database)
- **Express.js + Node.js** (Backend API)
- **React.js + Vite** (Frontend UI)
- **JWT + bcrypt** (Authentication)
- **Tailwind CSS** (Styling)
- **Axios** (API Communication)

---

## 🔧 Features

- 🔐 JWT-based Auth (Login, Register)
- ✅ Task CRUD (Create, Read, Update, Delete)
- 🔍 Filter by priority or completion
- 📅 Sort by due date
- 🧑‍💻 User-specific task management
- 💅 Fully responsive (Web + Mobile)
- 📦 Production-ready setup (Vercel + Render)

---

## 🛠️ Project Structure

task-manager-app/
├── client/ # Frontend (React + Vite)
├── server/ # Backend (Express + Node.js)



---

## 🚀 Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/just-being-aryan/task-manager-app.git
cd task-manager-app
 
 -----------------------
 
📦 Backend Setup (/server)
Install dependencies (npm i)

cd server
npm install

------------------

3. Create .env file

PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=taskmanager
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

----------------------
4. Start the Backend

npm run dev
Backend runs on http://localhost:5000

--------------------

🎨 Frontend Setup (/client)
5. Install dependencies

cd client
npm install

------------------

6. Create .env file

VITE_API_URL=http://localhost:5000/api

-------------------
7. Start the Frontend

npm run dev
Frontend runs on http://localhost:5173

