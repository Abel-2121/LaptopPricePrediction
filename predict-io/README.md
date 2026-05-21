# Predict.io | AI Hardware Valuation Platform

Predict.io is a professional, full-stack application designed to provide real-time market valuations for laptops using advanced machine learning.

## 📁 Project Structure

```
predict-io/
├── backend/             # Node.js Express Server
│   ├── models/          # Data schemas and placeholders
│   ├── routes/          # API endpoint logic
│   ├── ml/              # Machine Learning integration layer
│   └── server.js        # Main entry point
├── frontend/            # React + Vite + Tailwind UI
│   ├── public/          # Static assets (laptop render)
│   ├── src/             
│   │   ├── components/  # Modular UI components
│   │   ├── App.jsx      # Main application logic
│   │   └── index.css    # Premium design system
│   └── tailwind.config.js
└── README.md
```

## 🚀 Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
-   **Backend**: Node.js, Express, Axios.
-   **AI Core**: Python, Flask, Scikit-Learn (RandomForestRegressor), Pandas.

## 🛠️ Installation & Running

1.  **AI Service**: Ensure Python dependencies are installed and run `python backend/ml/app.py`.
2.  **Backend**: Navigate to `backend/` and run `npm install` followed by `node server.js`.
3.  **Frontend**: Navigate to `frontend/` and run `npm install` followed by `npm run dev`.

*Alternatively, use the provided `run.ps1` script in the root directory to initialize all services concurrently.*

---
Developed by Antigravity AI Systems.
