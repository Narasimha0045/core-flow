# Team Task Manager

A full-stack collaborative task management web application built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB Atlas, Mongoose, JWT authentication, and Axios.

## Features

- User signup, login, JWT auth, password hashing, and protected routes
- Project creation with automatic admin ownership
- Project member management by admin email invites
- Admin task create, edit, assign, and delete workflows
- Member task viewing and status updates for assigned tasks
- Dashboard cards for total tasks, tasks by status, tasks per user, and overdue work
- Project-scoped task filtering by status, priority, and search
- Responsive sidebar dashboard UI with dark mode
- Railway-ready backend deployment configuration

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Lucide icons
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs
- Database: MongoDB Atlas
- Deployment: Railway

## Project Structure

```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
frontend/
  src/
    api/
    components/
    context/
    hooks/
    layouts/
    pages/
    utils/
```

## Installation

```bash
npm run install:all
```

Create environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Update `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the apps in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## API Routes

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`

### Tasks

- `POST /api/tasks`
- `GET /api/tasks/project/:projectId`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`

### Dashboard

- `GET /api/dashboard`

## Railway Deployment

1. Push this repository to GitHub.
2. Create a Railway project from the repository.
3. Add backend environment variables in Railway:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
4. Railway can use the included `railway.json` to install and start the backend.
5. Deploy the frontend separately as a static Vite app and set `VITE_API_URL` to your Railway backend URL plus `/api`.

## Screenshots

Add screenshots here after running locally:

- Dashboard
- Projects
- Project Details
- Tasks

## Notes

- The project creator is automatically added as project admin and member.
- Members can only see tasks assigned to them.
- Admins can manage all tasks inside their projects.
- JWTs are stored in `localStorage` for a beginner-friendly implementation.
