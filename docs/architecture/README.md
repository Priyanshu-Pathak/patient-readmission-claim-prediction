# Architecture Overview

AdmitGuard operates on a decoupled Monorepo architecture designed to separate concerns between presentation and inference.

## 1. Client Layer (Frontend)
- **Framework**: Next.js 16
- **Routing**: App Router
- **State/Fetch**: React hooks with native `fetch` utilizing `Promise.allSettled` for concurrent model queries.
- **Styling**: TailwindCSS, establishing a clinical "glassmorphism" aesthetic without heavy component libraries.

## 2. API Layer (Backend)
- **Framework**: FastAPI
- **Schemas**: Pydantic 2.x enforces strict typing for incoming ML payloads.
- **Structure**: Endpoint routers map to internal `services/` logic to prevent bloat. Configured via `pydantic-settings` to dynamically locate ML artifacts relative to the project root.

## 3. Machine Learning Layer (ML)
- **Pipeline**: Structured around `scikit-learn` ColumnTransformers.
- **Artifact Generation**: Training scripts drop strict anti-leakage variables (e.g. `readmitted`, `claim`), process valid rows, and export deterministic `.joblib` models into `ml/artifacts/`.
- **Inference**: FastAPI's Service layer lazy-loads the `.joblib` artifacts strictly on application startup (or first request) to ensure rapid response times during prediction.
