# Smart Leads Dashboard

Full-stack assignment project with:

- `backend`: Express, TypeScript, MongoDB, JWT auth
- `frontend`: React, TypeScript, Vite, Tailwind

## Project Structure

```text
backend/
frontend/
```

## Local Setup

### 1. Backend

Copy `backend/.env.example` to `backend/.env` and configure:

```env
DATABASE_URL=your_mongodb_connection_string
PORT=2000
secretkey=your_jwt_secret
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

Install and run:

```bash
cd backend
npm install
npm run dev
```

To seed the admin:

```bash
npm run seed:admin
```

### 2. Frontend

Copy `frontend/.env.example` to `frontend/.env` and configure:

```env
VITE_API_URL=http://localhost:2000/api/auth
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

## Production Scripts

### Backend

```bash
npm run build
npm start
```

### Frontend

```bash
npm run build
npm run preview
```

## Deployment Notes

- Set backend environment variables on your hosting provider.
- Set `FRONTEND_URL` on the backend to your deployed frontend domain.
- Set `VITE_API_URL` on the frontend to your deployed backend URL, for example:
  `https://your-backend-domain.com/api/auth`
- Seed the admin user after the backend is connected to the production database.

## GitHub Ready Checklist

- Do not commit `backend/.env` or `frontend/.env`
- Commit `package.json`, lockfiles, source files, `.env.example`, and `README.md`
- Run `npm run build` in both apps before pushing
# LeadDashboard
