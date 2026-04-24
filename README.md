# BFHL Graph Analyzer

A full-stack application that analyzes Directed Acyclic Graphs (DAG), detects cyclical dependencies, and extracts nested hierarchical trees.

## Tech Stack
- **Backend**: Node.js & Express
- **Frontend**: React (Vite)

## Running Locally

Open two separate terminals and run the following commands:

**1. Start the Backend API**
```bash
cd backend
npm install
npm start
```

**2. Start the Frontend UI**
```bash
cd frontend
npm install
npm run dev
```

## Deployment Overview

Since this is a monorepo, deploy the folders independently by configuring the **Root Directories** on your hosting platform:

- **Backend ([Render](https://render.com))**: Create a Web Service. Set root directory to `backend`. Build command: `npm install`, Start command: `npm start`.
- **Frontend ([Vercel](https://vercel.com))**: Create a Vite project. Set root directory to `frontend`. Add a `VITE_API_URL` environment variable containing your deployed Render backend URL (e.g. `https://your-api.onrender.com/bfhl`).
