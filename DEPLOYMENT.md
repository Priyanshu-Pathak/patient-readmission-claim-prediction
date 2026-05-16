# AdmitGuard Deployment Guide

This guide describes how to deploy the AdmitGuard Intelligence platform to **Render** (Backend) and **Vercel** (Frontend).

## 🚀 Backend Deployment (Render)

1.  **Create a New Web Service**:
    *   Connect your GitHub repository.
    *   **Root Directory**: Leave blank (run from project root).
    *   **Runtime**: `Python 3`.
    *   **Build Command**: `pip install -r backend/requirements.txt`.
    *   **Start Command**: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`.

2.  **Environment Variables**:
    *   `ENVIRONMENT`: `production`
    *   `BACKEND_CORS_ORIGINS`: `["https://your-frontend-url.vercel.app"]` (Update this *after* your Vercel deployment is ready).
    *   `PYTHONPATH`: `backend`

3.  **Required Files**:
    *   Ensure `ml/artifacts/*.joblib` and `data/raw/hospital_analytics/*.csv` are staged in Git (use `git add -f` as they are normally ignored).

---

## 🎨 Frontend Deployment (Vercel)

1.  **Create a New Project**:
    *   Connect your GitHub repository.
    *   **Root Directory**: `frontend`.
    *   **Framework Preset**: `Next.js`.

2.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_BASE_URL`: `https://your-backend-url.onrender.com/api/v1` (Update this *after* your Render backend is live).

---

## 🔗 Connection Checklist

1.  **Step 1**: Deploy the Backend to Render.
2.  **Step 2**: Copy the Render URL (e.g., `https://admitguard-api.onrender.com`).
3.  **Step 3**: Deploy the Frontend to Vercel, providing the Render URL + `/api/v1` as the `NEXT_PUBLIC_API_BASE_URL`.
4.  **Step 4**: Copy the Vercel URL (e.g., `https://admitguard.vercel.app`).
5.  **Step 5**: Go back to Render Environment Variables and update `BACKEND_CORS_ORIGINS` to include the Vercel URL.
6.  **Step 6**: Restart the Render service to apply the new CORS policy.

---

## ⚠️ Important Notes
- **Free Tier Latency**: Render free tier services "spin down" after inactivity. The first request to the backend may take 30-60 seconds to respond.
- **Security**: Update `JWT_SECRET_KEY` on Render for production environments.
