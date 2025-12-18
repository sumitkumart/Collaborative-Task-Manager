## Collaborative Task Manager

Full-stack app with React + Vite (TypeScript, Tailwind, React Query) and Express + TypeScript + MongoDB + Socket.io. Supports JWT auth with HttpOnly cookies, task CRUD, assignment, filters/sorting, and real-time updates/notifications.

### Tech
- Frontend: React (Vite, TS), Tailwind CSS, React Router, React Query, Socket.io client.
- Backend: Node.js, Express (TS), Mongoose, Zod validation, bcrypt, JWT + HttpOnly cookies, Socket.io.
- DB: MongoDB Atlas (use the provided URI).

### Local setup
- Backend
  ```
  cd backend
  cp .env.example .env          # set MONGO_URI, JWT_SECRET, CLIENT_URL
  npm install
  npm run dev                   # or: npm run build && npm start
  npm test                      # runs auth/task/socket unit tests
  ```
- Frontend
  ```
  cd frontend
  cp .env.example .env          # set VITE_API_URL to the backend URL
  npm install
  npm run dev                   # npm run build for production
  ```

### API surface
- `POST /api/auth/register` — name, email, password; returns user and sets JWT cookie.
- `POST /api/auth/login` — email, password; returns user and sets JWT cookie.
- `POST /api/auth/logout` — clears auth cookie.
- `GET /api/auth/me` — current user (protected).
- `GET /api/users` — list users for assignment (protected).
- `GET /api/tasks?filter=assigned|created|overdue&status=&priority=&sort=dueDateAsc|dueDateDesc` — filtered tasks (protected).
- `POST /api/tasks` — create task (title max 100, description, dueDate, priority, status, assignedToId) (protected).
- `PUT /api/tasks/:id` — update task fields/assignee (protected, creator or assignee).
- `DELETE /api/tasks/:id` — remove task (protected, creator or assignee).

All protected routes require the HttpOnly JWT cookie (`taskmgr_token`) issued at login/register.

### MongoDB choice
MongoDB Atlas fits flexible task documents (variable descriptions, due dates, assignment metadata) and offers managed hosting, global SRV connectivity, and easy scaling. Use the provided connection string (`mongodb+srv://sumitkumartiwari627_db_user:v3hPSBknX403GVSV@cluster0.2tj59wn.mongodb.net/`) with the database name `collaborative_task_manager`.

### Socket.io flow
- Server initializes Socket.io alongside Express, reads the JWT from the HttpOnly cookie during the handshake, and maps userIds to socketIds.
- Emitted events:
  - `task:created`, `task:updated`, `task:deleted` — broadcast to all connected clients for live list refresh.
  - `task:assigned` — sent directly to the assigned user for in-app notification.
- Client connects with `withCredentials: true`, listens for the events above, invalidates React Query caches, and shows a notification when receiving `task:assigned`.

### Audit logging
- Every task status change is recorded with userId, taskId, fromStatus, toStatus, and timestamp (model: `AuditLog`).

### Architecture & design decisions
- **Stack choice:** MongoDB + Mongoose for flexible task documents and quick iteration; React + Vite + TS + Tailwind for fast UI development; React Query for caching/invalidation and optimistic updates.
- **Separation of concerns:** Controllers only handle HTTP, services encapsulate business logic, models handle persistence, middleware manages auth/validation/errors.
- **Validation (DTOs):** Zod schemas in `backend/src/routes/schemas.ts` validate inputs for auth and tasks.
- **Auth:** JWT signed with secret, stored in HttpOnly cookies; middleware verifies and injects `userId`.
- **Service layer:** `taskService`, `authService`, `userService` implement business rules (creator/assignee guard, assignment checks, audit logs, real-time emits).
- **Data fetching:** React Query manages server state with optimistic updates for task changes, cache invalidation on socket events, and shared query keys per list.
- **Realtime:** Socket.io server attached to Express HTTP server; cookie JWT read during handshake to map user sockets; emits for create/update/delete and targeted `task:assigned`.
- **Styling/UX:** Tailwind + custom gradients/glass; skeleton loaders for task lists; animated cards; responsive layout for desktop/mobile.

### Trade-offs & assumptions
- User profile update UI/API not implemented (scope focused on tasks/auth); can be added similarly to auth routes.
- No pagination on task lists; acceptable for small/medium datasets, can add later.
- Validation focuses on required fields and date parsing; richer constraints (e.g., dueDate > now) can be layered if needed.
- Tests cover auth, task creation, and socket event emission; more coverage (e.g., audit log queries) can be added if required.

### Deployment
- **Backend (Railway/Render):**
  - Set env vars: `PORT=4000`, `MONGO_URI` (use provided Atlas URI), `JWT_SECRET`, `CLIENT_URL` (your frontend origin), `COOKIE_NAME=taskmgr_token`.
  - Build/start: `npm install`, `npm run build`, `npm start`.
  - Ensure the service allows WebSocket upgrades for Socket.io.
- **Frontend (Vercel):**
  - Set `VITE_API_URL` to the deployed backend URL.
  - Build command: `npm install && npm run build`, output directory: `dist`.
- Use the same Atlas URI in production to keep data live across deployments.

### Features checklist
- JWT auth via HttpOnly cookies, password hashing with bcrypt.
- Protected APIs with Zod validation and proper HTTP status codes.
- Task CRUD with fields: title (max 100), description, dueDate, priority, status, creatorId, assignedToId.
- Assignment support, real-time task updates (status/priority/assignee), and in-app assignment notifications.
- Dashboard views: assigned to me, created by me, overdue; filter by status/priority; sort by due date.
- Backend tests: auth, task creation, socket event.

### Frontend notes
- Dev: `cd frontend && npm run dev` (requires `VITE_API_URL`).
- Build: `cd frontend && npm run build` (outputs `dist/` for Vercel).
- Styling: Tailwind CSS with custom gradients/glass for auth and dashboard; React Query handles caching and invalidation on socket events.

### Docker (one-command stack)
- Prereqs: Docker + Docker Compose.
- Build & run full stack (Mongo, API, frontend):
  ```
  docker-compose up --build
  ```
  - Backend: http://localhost:4000 (env override in compose uses local Mongo)
  - Frontend: http://localhost:5173 (talks to backend service)
  - Mongo: mongodb://localhost:27017/collaborative_task_manager
"# Collaborative-Task-Manager" 
"# Collaborative-Task-Manager" 
"# Collaborative-Task-Manager" 
