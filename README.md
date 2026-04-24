# BFHL Graph Analyzer

A full-stack application that processes directed node relationships, constructs hierarchical trees, detects cycles, and provides structured insights.

---

## Features

* Validates node relationships (`X->Y` format)
* Builds hierarchical tree structures
* Detects duplicate edges
* Identifies invalid inputs
* Detects cycles in the graph
* Provides summary insights (trees, cycles, largest tree)
* Ensures fast API response (under 3 seconds for up to 50 nodes)

---

## Tech Stack

* Backend: Node.js, Express
* Frontend: React (Vite)
* Deployment: Render (API), Vercel (Frontend)

---

## API Documentation

### Endpoint

POST `/bfhl`

### Request Body

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

### Response Format

```json
{
  "user_id": "yourname_ddmmyyyy",
  "email_id": "your_email",
  "college_roll_number": "your_roll",
  "hierarchies": [...],
  "invalid_entries": [...],
  "duplicate_edges": [...],
  "summary": {
    "total_trees": number,
    "total_cycles": number,
    "largest_tree_root": "string"
  }
}
```

---

## Sample Test Input

```json
{
  "data": [
    "A->B", "A->C", "B->D", "C->E", "E->F",
    "X->Y", "Y->Z", "Z->X",
    "P->Q", "Q->R",
    "G->H", "G->H", "G->I",
    "hello", "1->2", "A->"
  ]
}
```

---

## Project Structure

```
BFHL-Graph-Analyzer/
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── README.md
```

---

## Running Locally

Open two terminals:

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Deployment

### Backend (Render)

* Create a Web Service
* Root Directory: `backend`
* Build Command: `npm install`
* Start Command: `npm start`

### Frontend (Vercel)

* Import project
* Root Directory: `frontend`
* Add environment variable:

```
VITE_API_URL=https://srihari-bfhl.onrender.com/bfhl
```

---

## Live Links

Frontend: https://bajaj-b52e.vercel.app/
Backend API: https://srihari-bfhl.onrender.com/bfhl

---

## Notes

* CORS is enabled for cross-origin requests
* API is dynamic and does not use hardcoded responses
* Handles multiple trees and edge cases efficiently

---

## Future Improvements

* Tree visualization interface
* Option to download response as JSON
* Additional frontend validation
* UI enhancements

---

## Author

GN Srihari Narayanan
SRM University
