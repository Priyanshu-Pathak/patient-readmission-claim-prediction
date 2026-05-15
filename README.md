# AdmitGuard Intelligence

**Patient Readmission & Claim Risk Analytics Platform**

AdmitGuard Intelligence is a secure, full-stack healthcare analytics platform designed for diabetes patient readmission risk prediction, insurance claim forecasting, cohort-level analytics, explainable machine learning, batch scoring, and automated PDF report generation.

> **Note**: This is an educational and portfolio ML project inspired by healthcare security best practices. It does not provide medical advice, diagnosis, or treatment recommendations. Final decisions should involve qualified healthcare professionals.

## Documentation Index

**IMPORTANT:** Before starting any work or contributing, you **must** read the following documentation files in order:

1. [START_HERE.md](START_HERE.md) - Required starting point for all developers and AI agents.
2. [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) - High-level project background and constraints.
3. [PRD.md](PRD.md) - Product Requirements Document detailing features and users.
4. [ARCHITECTURE.md](ARCHITECTURE.md) - System design and deployment architecture.
5. [SECURITY_REQUIREMENTS.md](SECURITY_REQUIREMENTS.md) - Authentication, authorization, and data security rules.
6. [AGENT_RULES.md](AGENT_RULES.md) - Strict operating instructions for AI coding agents.
7. [PLAN.md](PLAN.md) - Step-by-step implementation roadmap.
8. [PROGRESS.md](PROGRESS.md) - Current development status and execution log.

## Problem Statement

Healthcare providers need to proactively identify patients at high risk for readmission to improve care quality and optimize resource allocation. Simultaneously, insurance and operations analysts need to forecast the associated claim burden for those readmissions to manage financial risk. AdmitGuard Intelligence provides a comprehensive tool to score patient risk, explain the driving factors behind the prediction, and generate professional reports.

## Key Features

- **Patient-Level Prediction**: Interactive multi-step form for individual readmission risk and claim amount forecasting.
- **Batch CSV Scoring**: Drag-and-drop CSV upload for processing cohorts of patients simultaneously.
- **Analytics Dashboard**: Cohort-level analytics, risk band segmentation, and feature importance visualizations.
- **Explainable AI (XAI)**: Both global and local feature importance (via SHAP/Permutation Importance) to understand model decisions.
- **Automated Reporting**: Generation of professional, downloadable PDF reports for individual patients and full cohorts.
- **Secure Access Control**: Google OAuth login with internal Role-Based Access Control (RBAC: Admin, Analyst, Viewer).
- **Audit Logging**: Robust logging of sensitive operations like batch uploads and report generation.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Recharts (or Plotly), Zod
- **Backend**: FastAPI, SQLAlchemy, Alembic, Pydantic, Python 3.12+
- **Machine Learning**: scikit-learn, XGBoost, Pandas, NumPy, Joblib
- **Database**: PostgreSQL (managed via Docker Compose locally)
- **Deployment**: Vercel (Frontend), Render/Railway/Fly.io (Backend)

## High-Level Architecture Overview

AdmitGuard Intelligence follows a strict separation of concerns:
- **Next.js Frontend**: Handles UI rendering, Google OAuth session management, data visualization, and user interaction.
- **FastAPI Backend**: Serves as the core API, enforcing RBAC, validating inputs, handling database operations, and serving ML predictions.
- **ML Service**: A modular pipeline that loads pre-trained artifacts (`.joblib`), applies identical preprocessing steps used during training, and enforces data quality guardrails.
- **PostgreSQL Database**: Stores user profiles, patient records, prediction history, batch jobs, and audit logs.

*See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed diagrams.*

## Repository Structure

```text
project/
├── frontend/             # Next.js application
├── backend/              # FastAPI application
├── ml/                   # Machine learning pipelines and notebooks
├── data/                 # Raw and processed datasets, sample CSVs
├── docs/                 # Additional architecture and design documentation
├── docker-compose.yml    # Local database and cache infrastructure
├── requirements.txt      # (Inside backend/) Python dependencies
└── package.json          # (Inside frontend/) Node dependencies
```

## Setup Instructions

### Environment Variable Notes

Never commit actual secrets or `.env` files. Ensure you copy the `.env.example` files to `.env` in both the `frontend/` and `backend/` directories and populate them with safe, local dummy values or authorized development credentials.

### 1. Docker Compose Usage (Database & Redis)

Start the local PostgreSQL and Redis containers:

```bash
docker compose up -d
```
Verify they are running with `docker ps`.

### 2. Backend Setup Notes

Navigate to the root directory, activate your Python virtual environment (e.g., `.venv`), and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Run database migrations:
```bash
alembic upgrade head
```

Start the FastAPI development server:
```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup Notes

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
pnpm install
```

Start the Next.js development server:
```bash
pnpm dev
```

## Security Note

This application is built with security in mind:
- All sensitive routes and APIs are protected.
- Authentication relies solely on Google OAuth (no custom password storage).
- Role-Based Access Control (RBAC) is enforced at the backend API level.
- Uploaded files and user inputs are strictly validated.
*See [SECURITY_REQUIREMENTS.md](SECURITY_REQUIREMENTS.md) for full details.*

## Development Roadmap

Development follows a strict phase-by-phase execution model. Please review [PLAN.md](PLAN.md) to understand the current and upcoming milestones. Updates to our progress can be tracked in [PROGRESS.md](PROGRESS.md).
