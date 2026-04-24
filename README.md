# BFHL Full-stack Application

A full-stack application built using Node.js (Express) and React (Vite) for analyzing Directed Acyclic Graphs, detecting cycles, and returning deep structured hierarchies.

## Directory Structure

```
Bajaj/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── services/
│   ├── index.js
│   ├── package.json
│   └── test.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md (you are here)
```

## Running Locally

### Backend
1. `cd backend`
2. `npm install`
3. `npm start` (or `node src/index.js`) 
4. The server runs on `http://localhost:3000`

### Frontend
1. `cd frontend`
2. `npm install`
3. Create a `.env` file and set `VITE_API_URL=http://localhost:3000/bfhl` (Default fallback is built in)
4. `npm run dev`

## Deployment Instructions

### Deploying the Backend (Render)
1. Commit your code to a GitHub repository.
2. Sign in to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Set Build Command to `npm install`.
6. Set Start Command to `node src/index.js`.
7. Click **Deploy**. Once finished, copy the deployed URL (e.g., `https://your-api.onrender.com/bfhl`).

### Deploying the Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com/) and create a **New Project**.
2. Import the same GitHub repository.
3. In the Vercel project configuration, set the **Framework Preset** to Vite.
4. Set the **Root Directory** to `frontend`.
5. Under Environment Variables, add:
   - Name: `VITE_API_URL`
   - Value: `https://your-api.onrender.com/bfhl` (Use your actual Render URL)
6. Click **Deploy**. Your React application will be live in seconds.
