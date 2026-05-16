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

## 🔗 Live Environment (Production)

- **Frontend (Vercel)**: [https://admitguard.site](https://admitguard.site)
- **Backend (Render)**: [https://admitguard-api.onrender.com](https://admitguard-api.onrender.com)
- **API Base URL**: `https://admitguard-api.onrender.com/api/v1`

### Final Configuration Settings
- **Vercel `NEXT_PUBLIC_API_BASE_URL`**: `https://admitguard-api.onrender.com/api/v1`
- **Render `BACKEND_CORS_ORIGINS`**: `["https://admitguard.site", "https://admitguard.vercel.app"]`
- **Namecheap Configuration**: `admitguard.site` is CNAME-mapped to the Vercel deployment.

---

## ⚠️ Important Notes
- **Free Tier Latency**: Render free tier services "spin down" after inactivity. The first request to the backend may take 30-60 seconds to respond.
- **Security**: Update `JWT_SECRET_KEY` on Render for production environments.
