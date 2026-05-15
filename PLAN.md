# PLAN.md

# AdmitGuard Intelligence  
## Step-by-Step Implementation Roadmap

**Document Type:** Implementation Plan  
**Project:** AdmitGuard Intelligence  
**Purpose:** Give Antigravity agents a strict phase-by-phase roadmap so work remains organized, complete, and verifiable  
**Execution Style:** One milestone at a time  
**Rule:** Do not jump ahead before the current milestone is complete and verified  

---

## 0. How Agents Must Use This Plan

Agents must follow this file in order.

Before starting any task:

1. Read [START_HERE.md](START_HERE.md)
2. Read [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)
3. Read [PRD.md](PRD.md)
4. Read [ARCHITECTURE.md](ARCHITECTURE.md)
5. Read [SECURITY_REQUIREMENTS.md](SECURITY_REQUIREMENTS.md)
6. Read [AGENT_RULES.md](AGENT_RULES.md)
7. Read this [PLAN.md](PLAN.md)

Agents must not randomly build pages, APIs, or models out of order.

Each phase contains:

- objective
- tasks
- files likely to change
- verification checklist
- completion criteria

A phase is complete only when all required checks pass.

---

## 1. Global Implementation Rules

### 1.1 Work One Phase at a Time

Do not start Phase 4 before Phase 3 is complete.

Do not build reports before prediction data exists.

Do not build dashboard analytics before dashboard data contracts exist.

Do not build production deployment before local app works.

### 1.2 No Incomplete Code

Agents must not leave:

- TODO comments
- placeholder components
- empty pages
- fake auth
- fake APIs
- fake reports
- broken buttons
- dangling imports
- unused files
- broken routes
- mock features presented as real

If blocked, stop and report the blocker.

### 1.3 Verify After Every Phase

After each phase, the agent must report:

1. files created or modified
2. what works now
3. commands/checks run
4. errors fixed
5. what remains for the next phase

### 1.4 Protect Documentation

Do not overwrite these files without explicit approval:

- `PROJECT_CONTEXT.md`
- `PRD.md`
- `ARCHITECTURE.md`
- `SECURITY_REQUIREMENTS.md`
- `AGENT_RULES.md`
- `PLAN.md`

Minor append-only updates are acceptable only when required and clearly reported.

---

# PHASE 1 — Repository Inspection and Baseline Setup

## Objective

Confirm the existing folder structure, installed dependencies, local environment, and current repository state before writing application code.

## Tasks

- [ ] Inspect root project folder.
- [ ] Confirm presence of:
  - [ ] `frontend/`
  - [ ] `backend/`
  - [ ] `ml/`
  - [ ] `docs/`
  - [ ] `data/`
  - [ ] `.venv/`
  - [ ] `docker-compose.yml`
  - [ ] `.gitignore`
  - [ ] `PROJECT_CONTEXT.md`
  - [ ] `PRD.md`
  - [ ] `ARCHITECTURE.md`
  - [ ] `AGENT_RULES.md`
  - [ ] `PLAN.md`
- [ ] Inspect `frontend/package.json`.
- [ ] Inspect `backend/requirements.txt`.
- [ ] Confirm Docker Compose defines PostgreSQL and Redis.
- [ ] Confirm frontend can start.
- [ ] Confirm Python backend environment is available.
- [ ] Do not modify code yet unless required to fix environment breakage.

## Likely Commands

```bash
git status
ls
cd frontend && pnpm install
cd frontend && pnpm build
python --version
uv pip list
docker ps
```

## Verification Checklist

- [ ] Frontend dependencies are installable.
- [ ] Frontend build either passes or known baseline issues are documented.
- [ ] Backend dependencies are installed in `.venv`.
- [ ] Docker containers are available or can be started.
- [ ] No secrets are committed.
- [ ] Repository state is understood.

## Completion Criteria

Phase 1 is complete when the agent has summarized the existing project structure and confirmed what is ready.

---

# PHASE 2 — Documentation Bootstrap

## Objective

Create or confirm all source-of-truth documentation files so future agents have stable context.

## Tasks

- [ ] Create `START_HERE.md` if missing.
- [ ] Confirm `PROJECT_CONTEXT.md`.
- [ ] Confirm `PRD.md`.
- [ ] Confirm `ARCHITECTURE.md`.
- [ ] Confirm `SECURITY_REQUIREMENTS.md`.
- [ ] Confirm `AGENT_RULES.md`.
- [ ] Confirm `PLAN.md`.
- [ ] Create a minimal root `README.md` if missing.
- [ ] Add documentation index to README.
- [ ] Do not add implementation claims to README before features exist.

## Required `START_HERE.md` Content

```markdown
# Start Here

Read these files before making changes:

1. PROJECT_CONTEXT.md
2. PRD.md
3. ARCHITECTURE.md
4. SECURITY_REQUIREMENTS.md
5. AGENT_RULES.md
6. PLAN.md

Do not begin implementation before understanding the project architecture, design goals, security requirements, and current roadmap phase.
```

## Files Likely to Change

```text
START_HERE.md
README.md
```

## Verification Checklist

- [ ] All planning documents exist.
- [ ] `START_HERE.md` gives correct read order.
- [ ] README does not claim unfinished features.
- [ ] No project secrets appear in docs.

## Completion Criteria

Phase 2 is complete when the documentation foundation is present and consistent.

---

# PHASE 3 — Monorepo Structure and Shared Conventions

## Objective

Prepare clean folder conventions for frontend, backend, ML, docs, and sample data.

## Tasks

- [ ] Create missing root folders:
  - [ ] `frontend/`
  - [ ] `backend/`
  - [ ] `ml/`
  - [ ] `data/`
  - [ ] `docs/`
- [ ] Create subfolders:
  - [ ] `data/sample/`
  - [ ] `data/processed/`
  - [ ] `docs/screenshots/`
  - [ ] `docs/architecture/`
  - [ ] `docs/api/`
  - [ ] `docs/security/`
  - [ ] `docs/reports/`
- [ ] Confirm `.gitignore` excludes:
  - [ ] `.venv/`
  - [ ] `node_modules/`
  - [ ] `.env`
  - [ ] generated PDFs
  - [ ] private data
  - [ ] uploaded CSVs
- [ ] Create root `.env.example` if useful.
- [ ] Confirm frontend and backend `.env.example` files.

## Files Likely to Change

```text
.gitignore
.env.example
frontend/.env.example
backend/.env.example
docs/
data/
```

## Verification Checklist

- [ ] Folder structure matches architecture.
- [ ] Sensitive files are ignored.
- [ ] Env examples contain dummy values only.
- [ ] No real credentials exist.

## Completion Criteria

Phase 3 is complete when the repository has a stable structure for implementation.

---

# PHASE 4 — Frontend Design System Foundation

## Objective

Build the custom healthcare analytics frontend design system before building feature pages.

## Tasks

- [ ] Inspect current Next.js app.
- [ ] Configure global styles.
- [ ] Define Tailwind theme tokens.
- [ ] Define semantic colors:
  - [ ] primary medical blue
  - [ ] slate neutrals
  - [ ] teal accent
  - [ ] amber warning
  - [ ] controlled red high-risk
  - [ ] clinical green low-risk
- [ ] Create reusable layout components:
  - [ ] `AppShell`
  - [ ] `PublicLayout`
  - [ ] `ProtectedLayout`
  - [ ] `Sidebar`
  - [ ] `Topbar`
  - [ ] `PageHeader`
- [ ] Create reusable UI components:
  - [ ] `MetricCard`
  - [ ] `RiskBadge`
  - [ ] `ConfidenceIndicator`
  - [ ] `StatusPill`
  - [ ] `DashboardPanel`
  - [ ] `ChartCard`
  - [ ] `LoadingTimeline`
  - [ ] `ErrorPanel`
  - [ ] `EmptyState`
  - [ ] `ActionButton`
- [ ] Add professional animation utilities using Framer Motion if already installed.
- [ ] Avoid generic shadcn-style dependency-heavy UI.

## Design Rules

- [ ] No goofy animation.
- [ ] No generic AI SaaS look.
- [ ] No excessive purple gradients.
- [ ] No fake neural graphics.
- [ ] No random glassmorphism.
- [ ] Keep interface clinical, sharp, modern, and data-focused.

## Files Likely to Change

```text
frontend/src/app/globals.css
frontend/src/app/layout.tsx
frontend/src/components/layout/
frontend/src/components/ui/
frontend/src/lib/constants.ts
frontend/src/lib/formatters.ts
```

## Verification Checklist

- [ ] Frontend builds.
- [ ] No broken imports.
- [ ] UI components render.
- [ ] Components are reusable.
- [ ] Design matches healthcare analytics identity.
- [ ] No placeholder components remain.

## Commands

```bash
cd frontend
pnpm lint
pnpm build
```

## Completion Criteria

Phase 4 is complete when the base layout and reusable design system exist and build successfully.

---

# PHASE 5 — Public Pages

## Objective

Build recruiter-facing public pages before authentication and protected app features.

## Pages

- [ ] `/`
- [ ] `/about`
- [ ] `/how-it-works`
- [ ] `/login`

## 5.1 Landing Page `/`

Tasks:

- [ ] Create polished hero section.
- [ ] Add project value proposition.
- [ ] Add dashboard preview section.
- [ ] Add capability cards:
  - [ ] readmission prediction
  - [ ] claim forecasting
  - [ ] dashboard analytics
  - [ ] batch scoring
  - [ ] PDF reports
  - [ ] explainability
  - [ ] security
- [ ] Add responsible AI note.
- [ ] Add CTA buttons:
  - [ ] login/demo
  - [ ] how it works
  - [ ] GitHub link if available
- [ ] Use subtle, professional animations.

## 5.2 About Page `/about`

Tasks:

- [ ] Explain project purpose.
- [ ] Explain dataset at a high level.
- [ ] Explain model scope.
- [ ] Mention security design.
- [ ] Mention limitations.
- [ ] Add educational disclaimer.

## 5.3 How It Works Page `/how-it-works`

Tasks:

- [ ] Build process walkthrough.
- [ ] Add sections:
  - [ ] Problem Statement
  - [ ] Dataset and Inputs
  - [ ] Data Validation
  - [ ] Preprocessing Pipeline
  - [ ] Readmission Risk Model
  - [ ] Claim Forecasting Model
  - [ ] Prediction Guardrails
  - [ ] Explainability Layer
  - [ ] Dashboard Analytics
  - [ ] Batch CSV Scoring
  - [ ] PDF Report Generation
  - [ ] Security and Access Control
  - [ ] Deployment Architecture
- [ ] Add visual workflow diagrams.
- [ ] Add restrained step reveal animation.
- [ ] Make it useful for recruiter explanation.

## 5.4 Login Page `/login`

Tasks:

- [ ] Create professional login layout.
- [ ] Add “Continue with Google” button.
- [ ] Explain demo access.
- [ ] Do not implement fake login.
- [ ] Prepare for auth integration in later phase.

## Files Likely to Change

```text
frontend/src/app/page.tsx
frontend/src/app/about/page.tsx
frontend/src/app/how-it-works/page.tsx
frontend/src/app/login/page.tsx
frontend/src/components/workflow/
```

## Verification Checklist

- [ ] All public routes load.
- [ ] Navigation works.
- [ ] Visual design is consistent.
- [ ] No fake claims.
- [ ] No unfinished sections.
- [ ] Frontend build passes.

## Commands

```bash
cd frontend
pnpm lint
pnpm build
```

## Completion Criteria

Phase 5 is complete when public pages are polished, navigable, and build successfully.

---

# PHASE 6 — Backend Skeleton

## Objective

Create the FastAPI backend structure with health checks, configuration, error handling, and API routing.

## Tasks

- [ ] Create backend app structure.
- [ ] Add `main.py`.
- [ ] Add config management.
- [ ] Add database connection module.
- [ ] Add API v1 router.
- [ ] Add health endpoint.
- [ ] Add standard response helpers.
- [ ] Add centralized exception classes.
- [ ] Add centralized exception handlers.
- [ ] Add logging setup.
- [ ] Add CORS configuration using environment variable.
- [ ] Add rate limiting preparation if practical.
- [ ] Add backend startup documentation.

## Required Endpoint

```text
GET /api/v1/health
```

Expected response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  },
  "message": "Backend service is healthy"
}
```

## Files Likely to Change

```text
backend/app/main.py
backend/app/config.py
backend/app/database.py
backend/app/api/v1/router.py
backend/app/api/v1/health.py
backend/app/core/responses.py
backend/app/core/exceptions.py
backend/app/core/logging.py
backend/app/core/rate_limit.py
backend/README.md
```

## Verification Checklist

- [ ] Backend server starts.
- [ ] Health endpoint works.
- [ ] CORS config exists.
- [ ] Errors return structured JSON.
- [ ] No raw tracebacks exposed in normal API responses.
- [ ] Backend imports cleanly.

## Commands

```bash
uvicorn backend.app.main:app --reload --port 8000
```

Or if module path requires backend context:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

## Completion Criteria

Phase 6 is complete when the FastAPI backend runs locally and returns a working health response.

---

# PHASE 7 — Database Models and Migrations

## Objective

Implement PostgreSQL database models and Alembic migrations.

## Tasks

- [ ] Configure SQLAlchemy.
- [ ] Configure Alembic.
- [ ] Create model files:
  - [ ] users
  - [ ] patients
  - [ ] predictions
  - [ ] prediction_explanations
  - [ ] batch_jobs
  - [ ] batch_rows
  - [ ] reports
  - [ ] audit_logs
  - [ ] model_versions
- [ ] Add timestamp mixins where useful.
- [ ] Add indexes.
- [ ] Create first migration.
- [ ] Test migration against local Docker PostgreSQL.
- [ ] Create database session dependency.
- [ ] Create seed script for demo user/model metadata if needed.

## Files Likely to Change

```text
backend/app/models/
backend/app/database.py
backend/migrations/
backend/alembic.ini
backend/app/dependencies.py
backend/scripts/seed_demo.py
```

## Verification Checklist

- [ ] PostgreSQL container is running.
- [ ] Alembic migration runs.
- [ ] Tables exist.
- [ ] Indexes are created.
- [ ] No destructive schema actions.
- [ ] Database URL comes from env.
- [ ] No credentials hardcoded beyond `.env.example`.

## Commands

```bash
docker ps
alembic revision --autogenerate -m "create core tables"
alembic upgrade head
```

## Completion Criteria

Phase 7 is complete when database tables are created through migrations and backend can connect successfully.

---

# PHASE 8 — Google OAuth and Internal RBAC

## Objective

Implement Google OAuth authentication and internal role-based access control.

## Tasks

- [ ] Choose auth integration approach compatible with Next.js.
- [ ] Configure Google OAuth provider.
- [ ] Add frontend session provider.
- [ ] Add login button.
- [ ] Add logout.
- [ ] Add protected route wrapper.
- [ ] Add backend auth sync endpoint.
- [ ] Store user metadata in `users` table.
- [ ] Assign default role `Viewer` to new users.
- [ ] Add RBAC utilities.
- [ ] Add frontend route guards.
- [ ] Add backend permission dependencies.
- [ ] Add audit log for login/sync.
- [ ] Document required Google OAuth env variables.

## Required Routes

Frontend:

```text
/login
/dashboard
/predict
/batch
/reports
/model-performance
/explainability
/monitoring
/admin
```

Backend:

```text
GET /api/v1/auth/me
POST /api/v1/auth/sync
```

## Role Rules

- [ ] Admin can access all.
- [ ] Analyst can predict, upload batches, generate reports.
- [ ] Viewer can view dashboard/reports/model pages only.
- [ ] Admin routes blocked for non-admins.
- [ ] Batch upload blocked for viewers.

## Files Likely to Change

```text
frontend/src/app/login/page.tsx
frontend/src/components/layout/ProtectedRoute.tsx
frontend/src/features/auth/
frontend/src/lib/auth.ts
backend/app/api/v1/auth.py
backend/app/core/security.py
backend/app/core/permissions.py
backend/app/services/auth_service.py
backend/app/services/user_service.py
```

## Verification Checklist

- [ ] Login page displays Google login.
- [ ] Authenticated user is synced to backend.
- [ ] New user gets Viewer role.
- [ ] Protected frontend routes redirect unauthenticated users.
- [ ] Backend protected endpoints reject unauthenticated requests.
- [ ] RBAC blocks unauthorized roles.
- [ ] No OAuth secrets are committed.
- [ ] Audit log records login/sync.

## Completion Criteria

Phase 8 is complete when Google OAuth login works locally and protected route/RBAC structure is functional.

---

# PHASE 9 — ML Data Pipeline

## Objective

Build the real data cleaning, preprocessing, training, evaluation, and artifact export pipeline.

## Tasks

- [ ] Inspect available dataset.
- [ ] Document dataset in `data/README.md`.
- [ ] Create sample dataset if needed for demo.
- [ ] Create cleaning script.
- [ ] Fix invalid values.
- [ ] Define feature schema.
- [ ] Define targets:
  - [ ] readmission label
  - [ ] claim amount
- [ ] Split train/test data.
- [ ] Build preprocessing pipeline:
  - [ ] numeric imputation
  - [ ] categorical imputation
  - [ ] one-hot encoding
  - [ ] scaling if needed
- [ ] Train classification model candidates.
- [ ] Train regression model candidates.
- [ ] Evaluate all models.
- [ ] Select best deployable models.
- [ ] Export model artifacts.
- [ ] Export metrics JSON.
- [ ] Export feature importance JSON.
- [ ] Export training ranges JSON.
- [ ] Create/update `model_card.md`.

## Required Artifacts

```text
ml/models/readmission_model.joblib
ml/models/claim_model.joblib
ml/models/preprocessor.joblib
ml/artifacts/feature_schema.json
ml/artifacts/training_ranges.json
ml/artifacts/label_mappings.json
ml/artifacts/model_version.json
ml/artifacts/feature_importance.json
ml/metrics/readmission_metrics.json
ml/metrics/claim_metrics.json
ml/metrics/model_comparison.json
ml/model_card.md
```

## Files Likely to Change

```text
ml/src/load_data.py
ml/src/clean_data.py
ml/src/feature_schema.py
ml/src/train_readmission.py
ml/src/train_claim.py
ml/src/evaluate.py
ml/src/explain.py
ml/src/export_artifacts.py
ml/models/
ml/artifacts/
ml/metrics/
data/README.md
```

## Verification Checklist

- [ ] Pipeline runs end-to-end.
- [ ] No fake metrics.
- [ ] No random predictions.
- [ ] Preprocessor is saved.
- [ ] Models are saved.
- [ ] Metrics are saved.
- [ ] Feature schema is saved.
- [ ] Training ranges are saved.
- [ ] Model card is updated.
- [ ] Artifacts are lightweight enough for repo or documented if excluded.

## Completion Criteria

Phase 9 is complete when real trained model artifacts and metrics exist.

---

# PHASE 10 — Backend ML Model Loader and Prediction Engine

## Objective

Connect trained ML artifacts to backend prediction services.

## Tasks

- [ ] Create model loader.
- [ ] Load preprocessor.
- [ ] Load readmission model.
- [ ] Load claim model.
- [ ] Load feature schema.
- [ ] Load training ranges.
- [ ] Load model metrics.
- [ ] Add model health check.
- [ ] Create prediction engine.
- [ ] Add risk band logic.
- [ ] Add claim range logic.
- [ ] Add confidence score logic.
- [ ] Add guardrails:
  - [ ] missing fields
  - [ ] impossible values
  - [ ] out-of-range warnings
  - [ ] unknown categories
- [ ] Add explanation engine.
- [ ] Add unit tests or smoke tests.

## Files Likely to Change

```text
backend/app/ml/model_loader.py
backend/app/ml/prediction_engine.py
backend/app/ml/guardrails.py
backend/app/ml/explanation_engine.py
backend/app/ml/schemas.py
backend/app/services/prediction_service.py
```

## Verification Checklist

- [ ] Backend can load model artifacts.
- [ ] Missing artifacts produce clear error.
- [ ] Prediction engine returns structured output.
- [ ] Guardrails work.
- [ ] No fake predictions.
- [ ] Model version is returned.
- [ ] Confidence and warnings are returned.

## Completion Criteria

Phase 10 is complete when backend can generate real predictions from model artifacts through service code.

---

# PHASE 11 — Single Patient Prediction API

## Objective

Create the protected backend API for single patient prediction and persistence.

## Tasks

- [ ] Create prediction request schema.
- [ ] Create prediction response schema.
- [ ] Implement endpoint:
  - [ ] `POST /api/v1/predictions/single`
- [ ] Verify authenticated user.
- [ ] Verify role permissions.
- [ ] Validate request input.
- [ ] Run prediction engine.
- [ ] Save patient record.
- [ ] Save prediction record.
- [ ] Save explanation records.
- [ ] Add audit log.
- [ ] Return structured response.
- [ ] Add endpoint to fetch prediction by ID.
- [ ] Add endpoint to list user predictions.

## Required Endpoints

```text
POST /api/v1/predictions/single
GET /api/v1/predictions
GET /api/v1/predictions/{prediction_id}
```

## Files Likely to Change

```text
backend/app/api/v1/predictions.py
backend/app/schemas/prediction.py
backend/app/schemas/patient.py
backend/app/services/prediction_service.py
backend/app/services/patient_service.py
backend/app/services/audit_service.py
```

## Verification Checklist

- [ ] Unauthenticated request fails.
- [ ] Unauthorized role fails.
- [ ] Valid request returns prediction.
- [ ] Invalid request returns validation error.
- [ ] Prediction saved in DB.
- [ ] Audit log created.
- [ ] User cannot fetch another user's prediction.
- [ ] No raw tracebacks returned.

## Completion Criteria

Phase 11 is complete when single prediction API works end-to-end.

---

# PHASE 12 — Single Patient Prediction Frontend

## Objective

Build the protected `/predict` page and connect it to the prediction API.

## Tasks

- [ ] Build multi-step form.
- [ ] Add frontend Zod validation.
- [ ] Add field-level errors.
- [ ] Add review step.
- [ ] Connect to backend prediction endpoint.
- [ ] Add professional prediction loading timeline.
- [ ] Display result:
  - [ ] readmission probability
  - [ ] risk band
  - [ ] predicted claim
  - [ ] claim range
  - [ ] confidence score
  - [ ] top drivers
  - [ ] warnings
  - [ ] model version
  - [ ] timestamp
- [ ] Add generate report button.
- [ ] Add responsible AI disclaimer.
- [ ] Add error state.
- [ ] Add empty state if needed.

## Files Likely to Change

```text
frontend/src/app/predict/page.tsx
frontend/src/components/forms/PatientPredictionForm.tsx
frontend/src/features/predictions/
frontend/src/components/ui/LoadingTimeline.tsx
frontend/src/lib/validators.ts
frontend/src/types/prediction.ts
```

## Verification Checklist

- [ ] Route is protected.
- [ ] Form validates inputs.
- [ ] Prediction API is called.
- [ ] Loading state appears.
- [ ] Result displays clearly.
- [ ] Error state works.
- [ ] No inactive buttons.
- [ ] Frontend build passes.

## Completion Criteria

Phase 12 is complete when a user can run a single prediction through the UI.

---

# PHASE 13 — Dashboard Backend APIs

## Objective

Create backend dashboard aggregation endpoints.

## Tasks

- [ ] Create dashboard service.
- [ ] Aggregate total patients.
- [ ] Aggregate readmission rate.
- [ ] Aggregate high-risk count.
- [ ] Aggregate average/median claim.
- [ ] Aggregate risk band distribution.
- [ ] Aggregate claim distribution.
- [ ] Aggregate risk by age group.
- [ ] Aggregate claim by payer type.
- [ ] Aggregate hospital stay vs risk.
- [ ] Aggregate medication count vs risk.
- [ ] Aggregate high-risk patient table.
- [ ] Return chart-ready JSON.
- [ ] Add filters.
- [ ] Add authorization checks.

## Required Endpoints

```text
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/risk-distribution
GET /api/v1/dashboard/claim-distribution
GET /api/v1/dashboard/high-risk-patients
GET /api/v1/dashboard/filters
```

## Files Likely to Change

```text
backend/app/api/v1/dashboard.py
backend/app/schemas/dashboard.py
backend/app/services/dashboard_service.py
```

## Verification Checklist

- [ ] Dashboard endpoints require auth.
- [ ] User-scoped data is enforced.
- [ ] Admin can view broader data if designed.
- [ ] Endpoints return chart-ready JSON.
- [ ] Empty dataset returns clean empty states.
- [ ] No backend crashes with no predictions.

## Completion Criteria

Phase 13 is complete when dashboard API returns real database-backed analytics.

---

# PHASE 14 — Dashboard Frontend

## Objective

Build the main protected analytics dashboard.

## Tasks

- [ ] Create `/dashboard` page.
- [ ] Add KPI cards.
- [ ] Add filters.
- [ ] Add risk band chart.
- [ ] Add claim distribution chart.
- [ ] Add risk by age group chart.
- [ ] Add claim by payer chart.
- [ ] Add hospital stay vs risk visualization.
- [ ] Add medication vs risk visualization.
- [ ] Add feature importance preview.
- [ ] Add high-risk patient table.
- [ ] Add loading skeletons.
- [ ] Add empty state.
- [ ] Add error state.
- [ ] Connect to backend APIs.
- [ ] Use professional chart styling.
- [ ] Add subtle entrance animations.

## Files Likely to Change

```text
frontend/src/app/dashboard/page.tsx
frontend/src/features/dashboard/
frontend/src/components/charts/
frontend/src/components/tables/
frontend/src/types/dashboard.ts
```

## Verification Checklist

- [ ] Dashboard route is protected.
- [ ] Real backend data loads.
- [ ] Empty data state works.
- [ ] Filters do not break charts.
- [ ] Charts are labeled.
- [ ] Table is readable.
- [ ] Frontend build passes.

## Completion Criteria

Phase 14 is complete when the dashboard looks professional and works with backend data.

---

# PHASE 15 — Model Performance Backend and Frontend

## Objective

Expose model metrics and display them in a polished model performance page.

## Backend Tasks

- [ ] Load readmission metrics JSON.
- [ ] Load claim metrics JSON.
- [ ] Load model comparison JSON.
- [ ] Create endpoint:
  - [ ] `GET /api/v1/model-performance`
- [ ] Return model metadata.
- [ ] Return classification metrics.
- [ ] Return regression metrics.
- [ ] Return chart-ready curve/plot data where available.

## Frontend Tasks

- [ ] Create `/model-performance` page.
- [ ] Add classification metric cards.
- [ ] Add regression metric cards.
- [ ] Add confusion matrix.
- [ ] Add ROC/PR chart if data available.
- [ ] Add actual vs predicted chart.
- [ ] Add residual distribution.
- [ ] Add model version metadata.
- [ ] Add explanation text for metrics.

## Files Likely to Change

```text
backend/app/api/v1/model_performance.py
backend/app/services/model_performance_service.py
frontend/src/app/model-performance/page.tsx
frontend/src/features/model-performance/
frontend/src/components/charts/
```

## Verification Checklist

- [ ] Metrics are real from JSON files.
- [ ] No fake metrics.
- [ ] Page handles missing metric files gracefully.
- [ ] Charts are readable.
- [ ] Frontend build passes.

## Completion Criteria

Phase 15 is complete when model performance is displayed from real artifacts.

---

# PHASE 16 — Explainability Backend and Frontend

## Objective

Add global and local explainability features.

## Backend Tasks

- [ ] Load feature importance JSON.
- [ ] Create global explainability endpoint.
- [ ] Create local prediction explanation endpoint.
- [ ] Return top features.
- [ ] Return direction and magnitude.
- [ ] Handle missing explanation data gracefully.

## Frontend Tasks

- [ ] Create `/explainability` page.
- [ ] Add global feature importance charts.
- [ ] Add local explanation viewer.
- [ ] Add plain-language explanation.
- [ ] Add optional what-if controls if feasible.
- [ ] Add disclaimer that explanations are model-based, not medical advice.

## Required Endpoints

```text
GET /api/v1/explainability/global
GET /api/v1/explainability/prediction/{prediction_id}
```

## Files Likely to Change

```text
backend/app/api/v1/explainability.py
backend/app/services/explainability_service.py
frontend/src/app/explainability/page.tsx
frontend/src/features/explainability/
```

## Verification Checklist

- [ ] Global feature importance loads.
- [ ] Local explanation works for saved prediction.
- [ ] Missing data shows clean message.
- [ ] No fake explanations.
- [ ] Frontend build passes.

## Completion Criteria

Phase 16 is complete when users can understand model drivers globally and locally.

---

# PHASE 17 — Batch CSV Upload Backend

## Objective

Implement secure batch CSV upload, validation, prediction, and scored output generation.

## Tasks

- [ ] Create batch upload endpoint.
- [ ] Validate authentication.
- [ ] Validate role permission.
- [ ] Accept CSV only.
- [ ] Enforce file size limit.
- [ ] Store upload safely.
- [ ] Validate schema.
- [ ] Identify missing columns.
- [ ] Validate row values.
- [ ] Separate valid and invalid rows.
- [ ] Run predictions for valid rows.
- [ ] Save patients/predictions.
- [ ] Save batch job record.
- [ ] Save batch row records.
- [ ] Generate scored CSV.
- [ ] Generate invalid row report.
- [ ] Add audit logs.
- [ ] Return batch summary.

## Required Endpoints

```text
POST /api/v1/batch/upload
GET /api/v1/batch/{batch_id}
GET /api/v1/batch/{batch_id}/download
GET /api/v1/batch/{batch_id}/invalid-rows
```

## Files Likely to Change

```text
backend/app/api/v1/batch.py
backend/app/schemas/batch.py
backend/app/services/batch_service.py
backend/app/utils/csv_utils.py
backend/app/utils/file_utils.py
```

## Verification Checklist

- [ ] Viewer cannot upload.
- [ ] Non-CSV rejected.
- [ ] Oversized file rejected.
- [ ] Missing columns reported.
- [ ] Invalid rows reported.
- [ ] Valid rows are scored.
- [ ] Batch metadata saved.
- [ ] Scored CSV downloadable.
- [ ] Audit log created.
- [ ] No uploaded files committed.

## Completion Criteria

Phase 17 is complete when backend batch scoring works end-to-end.

---

# PHASE 18 — Batch CSV Upload Frontend

## Objective

Build the protected `/batch` page and connect it to backend batch APIs.

## Tasks

- [ ] Create drag-and-drop upload UI.
- [ ] Add CSV file validation on frontend.
- [ ] Show upload progress.
- [ ] Show batch processing stages.
- [ ] Display validation errors.
- [ ] Display missing columns.
- [ ] Display invalid row count.
- [ ] Display batch summary.
- [ ] Display risk distribution for batch.
- [ ] Display top high-risk patients.
- [ ] Add scored CSV download button.
- [ ] Add invalid row report download.
- [ ] Add generate cohort PDF button.
- [ ] Add empty and error states.

## Files Likely to Change

```text
frontend/src/app/batch/page.tsx
frontend/src/features/batch/
frontend/src/components/ui/UploadPanel.tsx
frontend/src/components/ui/LoadingTimeline.tsx
frontend/src/types/batch.ts
```

## Verification Checklist

- [ ] Route is protected.
- [ ] Viewer access is blocked or limited.
- [ ] File upload UI works.
- [ ] Backend response is displayed.
- [ ] Download buttons work.
- [ ] Error states are clear.
- [ ] Frontend build passes.

## Completion Criteria

Phase 18 is complete when users can upload a CSV and see scored batch results in the UI.

---

# PHASE 19 — PDF Report Backend

## Objective

Implement individual and cohort PDF report generation.

## Tasks

- [ ] Choose PDF library:
  - [ ] ReportLab preferred if WeasyPrint is problematic.
- [ ] Create report templates.
- [ ] Create chart rendering utilities.
- [ ] Create individual patient report generator.
- [ ] Create cohort report generator.
- [ ] Save report metadata.
- [ ] Save report file safely.
- [ ] Verify ownership before generating.
- [ ] Verify ownership before downloading.
- [ ] Add report status.
- [ ] Add audit logs.
- [ ] Add structured errors.

## Required Endpoints

```text
POST /api/v1/reports/patient/{prediction_id}
POST /api/v1/reports/cohort/{batch_id}
GET /api/v1/reports
GET /api/v1/reports/{report_id}
GET /api/v1/reports/{report_id}/download
```

## Individual Report Must Include

- [ ] report ID
- [ ] timestamp
- [ ] patient summary
- [ ] readmission risk
- [ ] claim estimate
- [ ] claim range
- [ ] risk band
- [ ] top contributing factors
- [ ] warnings
- [ ] model version
- [ ] disclaimer

## Cohort Report Must Include

- [ ] report ID
- [ ] timestamp
- [ ] batch summary
- [ ] risk segmentation
- [ ] claim burden
- [ ] high-risk segment
- [ ] feature importance
- [ ] data quality summary
- [ ] model metrics summary
- [ ] disclaimer

## Files Likely to Change

```text
backend/app/api/v1/reports.py
backend/app/schemas/report.py
backend/app/services/report_service.py
backend/app/reports/pdf_generator.py
backend/app/reports/patient_report.py
backend/app/reports/cohort_report.py
backend/app/reports/charts.py
backend/app/reports/templates/
```

## Verification Checklist

- [ ] Reports generate actual PDFs.
- [ ] Report metadata saved.
- [ ] User cannot download another user's report.
- [ ] Report generation errors are handled.
- [ ] Generated reports are ignored by Git.
- [ ] Audit logs are created.

## Completion Criteria

Phase 19 is complete when both report types generate and download successfully.

---

# PHASE 20 — Reports Frontend

## Objective

Build the `/reports` page for report listing, preview, generation status, and downloads.

## Tasks

- [ ] Create reports page.
- [ ] List generated reports.
- [ ] Add report type filter.
- [ ] Add report status badges.
- [ ] Add report preview cards.
- [ ] Add download action.
- [ ] Add individual report generation flow from prediction result.
- [ ] Add cohort report generation flow from batch result.
- [ ] Add professional report loading animation.
- [ ] Add error states.
- [ ] Add empty state.

## Files Likely to Change

```text
frontend/src/app/reports/page.tsx
frontend/src/features/reports/
frontend/src/components/reports/
frontend/src/types/report.ts
```

## Verification Checklist

- [ ] Route is protected.
- [ ] Report list loads.
- [ ] Report generation state is shown.
- [ ] Download works.
- [ ] Access errors handled.
- [ ] Frontend build passes.

## Completion Criteria

Phase 20 is complete when report generation and download are usable from the frontend.

---

# PHASE 21 — Monitoring Backend and Frontend

## Objective

Add production-style monitoring for data quality, model health, and system activity.

## Backend Tasks

- [ ] Create monitoring service.
- [ ] Aggregate data quality warnings.
- [ ] Count invalid inputs.
- [ ] Count out-of-range values.
- [ ] Count predictions by risk band.
- [ ] Count report generation failures.
- [ ] Check model artifact status.
- [ ] Check database connectivity.
- [ ] Create monitoring endpoints.

## Frontend Tasks

- [ ] Create `/monitoring` page.
- [ ] Add service health cards.
- [ ] Add data quality cards.
- [ ] Add drift warning panel.
- [ ] Add prediction confidence distribution.
- [ ] Add report generation status panel.
- [ ] Add batch failure panel.
- [ ] Add empty/error states.

## Required Endpoints

```text
GET /api/v1/monitoring/summary
GET /api/v1/monitoring/data-quality
GET /api/v1/monitoring/service-health
GET /api/v1/monitoring/drift
```

## Files Likely to Change

```text
backend/app/api/v1/monitoring.py
backend/app/services/monitoring_service.py
frontend/src/app/monitoring/page.tsx
frontend/src/features/monitoring/
```

## Verification Checklist

- [ ] Monitoring route is protected.
- [ ] Viewer access is blocked if required.
- [ ] Data quality metrics load.
- [ ] Service health loads.
- [ ] Empty state works.
- [ ] Frontend build passes.

## Completion Criteria

Phase 21 is complete when monitoring page gives useful production-style signals.

---

# PHASE 22 — Admin Backend and Frontend

## Objective

Add admin-only user, role, audit log, batch, and report oversight.

## Backend Tasks

- [ ] Create admin endpoints.
- [ ] List users.
- [ ] Update user roles.
- [ ] List audit logs.
- [ ] List batch jobs.
- [ ] List reports.
- [ ] Enforce admin-only access.
- [ ] Audit role changes.

## Frontend Tasks

- [ ] Create `/admin` page.
- [ ] Add users table.
- [ ] Add role management controls.
- [ ] Add audit log table.
- [ ] Add batch job history.
- [ ] Add report history.
- [ ] Add unauthorized state.

## Required Endpoints

```text
GET /api/v1/admin/users
PATCH /api/v1/admin/users/{user_id}/role
GET /api/v1/admin/audit-logs
GET /api/v1/admin/batch-jobs
GET /api/v1/admin/reports
```

## Files Likely to Change

```text
backend/app/api/v1/admin.py
backend/app/services/admin_service.py
frontend/src/app/admin/page.tsx
frontend/src/features/admin/
```

## Verification Checklist

- [ ] Admin page blocks non-admins.
- [ ] Admin endpoints block non-admins.
- [ ] User role updates work.
- [ ] Role changes are audit logged.
- [ ] Tables display cleanly.
- [ ] Frontend build passes.

## Completion Criteria

Phase 22 is complete when admin oversight is functional and secured.

---

# PHASE 23 — Security Hardening

## Objective

Review and harden security controls across the application.

## Tasks

- [ ] Verify Google OAuth setup.
- [ ] Verify protected frontend routes.
- [ ] Verify backend auth checks.
- [ ] Verify backend role checks.
- [ ] Verify resource ownership checks.
- [ ] Verify CORS restrictions.
- [ ] Verify file upload restrictions.
- [ ] Verify no secrets in repo.
- [ ] Verify `.gitignore`.
- [ ] Verify no raw traces in production responses.
- [ ] Verify audit logging for sensitive actions.
- [ ] Verify rate limiting where configured.
- [ ] Verify generated reports are not publicly exposed across users.
- [ ] Verify environment variable documentation.
- [ ] Update `SECURITY_REQUIREMENTS.md` only if needed.

## Security Test Cases

- [ ] Unauthenticated user cannot access dashboard API.
- [ ] Viewer cannot upload batch.
- [ ] Viewer cannot generate reports if not allowed.
- [ ] Analyst cannot access admin APIs.
- [ ] User cannot access another user's prediction.
- [ ] User cannot download another user's report.
- [ ] Invalid CSV is rejected.
- [ ] Oversized CSV is rejected.
- [ ] Missing columns return structured error.
- [ ] Production CORS is not wildcard.

## Completion Criteria

Phase 23 is complete when core security controls are implemented and verified.

---

# PHASE 24 — Error Handling and UX Polish

## Objective

Ensure every page and major action has complete loading, success, empty, and error states.

## Tasks

- [ ] Review all public pages.
- [ ] Review all protected pages.
- [ ] Add missing loading states.
- [ ] Add missing empty states.
- [ ] Add missing error states.
- [ ] Add toast notifications where useful.
- [ ] Improve form error messages.
- [ ] Improve API failure messages.
- [ ] Improve report generation status.
- [ ] Improve batch processing status.
- [ ] Ensure animations remain professional.
- [ ] Remove unused components.
- [ ] Remove console logs.
- [ ] Remove dead code.

## Pages to Review

- [ ] `/`
- [ ] `/about`
- [ ] `/how-it-works`
- [ ] `/login`
- [ ] `/dashboard`
- [ ] `/predict`
- [ ] `/batch`
- [ ] `/reports`
- [ ] `/model-performance`
- [ ] `/explainability`
- [ ] `/monitoring`
- [ ] `/admin`

## Verification Checklist

- [ ] No page crashes if API fails.
- [ ] No unstyled browser errors.
- [ ] No broken buttons.
- [ ] No goofy animation.
- [ ] No unfinished UI sections.
- [ ] Frontend build passes.

## Completion Criteria

Phase 24 is complete when the app feels polished and robust.

---

# PHASE 25 — Testing and Quality Checks

## Objective

Run final local quality checks before deployment.

## Frontend Checks

```bash
cd frontend
pnpm lint
pnpm build
```

## Backend Checks

```bash
ruff check backend
python -m pytest
```

If tests are limited, add minimal smoke tests for:

- [ ] health endpoint
- [ ] prediction guardrails
- [ ] dashboard service empty state
- [ ] batch CSV validation
- [ ] report generation helper
- [ ] RBAC permission utility

## Manual End-to-End Checks

- [ ] landing page loads
- [ ] how-it-works page loads
- [ ] login works
- [ ] protected route redirects work
- [ ] dashboard loads
- [ ] prediction works
- [ ] prediction saves
- [ ] report generation works
- [ ] report download works
- [ ] batch upload works
- [ ] invalid CSV handling works
- [ ] model performance page loads
- [ ] explainability page loads
- [ ] monitoring page loads
- [ ] admin blocking works
- [ ] no browser console errors
- [ ] no backend tracebacks exposed to users

## Completion Criteria

Phase 25 is complete when local testing passes and known issues are documented.

---

# PHASE 26 — Deployment Preparation

## Objective

Prepare the project for frontend, backend, and database deployment.

## Tasks

- [ ] Confirm frontend env variables.
- [ ] Confirm backend env variables.
- [ ] Confirm OAuth callback URLs.
- [ ] Confirm production CORS.
- [ ] Confirm model artifact paths.
- [ ] Confirm report output path/storage.
- [ ] Confirm database migrations.
- [ ] Confirm seed data strategy.
- [ ] Confirm generated files are ignored.
- [ ] Add deployment instructions to README.
- [ ] Add production limitations.

## Frontend Deployment

Target:

```text
Vercel
```

Required:

- [ ] build passes
- [ ] `NEXT_PUBLIC_API_BASE_URL` configured
- [ ] auth variables configured
- [ ] no local-only URLs hardcoded

## Backend Deployment

Target:

```text
Render / Railway / Fly.io
```

Required:

- [ ] production start command
- [ ] `DATABASE_URL`
- [ ] CORS frontend URL
- [ ] model artifact availability
- [ ] report directory/storage
- [ ] migrations documented

## Database Deployment

Target:

```text
Supabase / Neon / Render PostgreSQL / Railway PostgreSQL
```

Required:

- [ ] migration instructions
- [ ] seed instructions
- [ ] connection string environment variable

## Completion Criteria

Phase 26 is complete when deployment config and instructions are ready.

---

# PHASE 27 — Deployment

## Objective

Deploy the working app.

## Tasks

- [ ] Deploy backend.
- [ ] Run backend migrations.
- [ ] Verify backend health endpoint.
- [ ] Deploy frontend.
- [ ] Configure frontend API URL.
- [ ] Configure Google OAuth production callbacks.
- [ ] Configure CORS production frontend URL.
- [ ] Test production login.
- [ ] Test dashboard.
- [ ] Test prediction.
- [ ] Test report generation.
- [ ] Test batch upload.
- [ ] Test protected routes.
- [ ] Fix production-only issues.

## Verification Checklist

- [ ] Production frontend opens.
- [ ] Production backend health works.
- [ ] OAuth works in production.
- [ ] API calls work.
- [ ] Prediction works.
- [ ] Reports work or limitations documented.
- [ ] No secrets visible.
- [ ] No broken routes.

## Completion Criteria

Phase 27 is complete when the deployed app is usable for recruiters.

---

# PHASE 28 — Final README and Portfolio Polish

## Objective

Update public-facing documentation and make the repository resume-ready.

## README Sections

- [ ] Project title
- [ ] Live demo link
- [ ] GitHub repo link
- [ ] Overview
- [ ] Key features
- [ ] Tech stack
- [ ] Architecture diagram
- [ ] Dashboard screenshots
- [ ] ML pipeline
- [ ] Security design
- [ ] Report generation
- [ ] Local setup
- [ ] Deployment
- [ ] Limitations
- [ ] Future improvements
- [ ] Disclaimer

## Screenshots to Add

- [ ] landing page
- [ ] dashboard
- [ ] prediction page
- [ ] batch upload
- [ ] report preview/PDF
- [ ] model performance
- [ ] how-it-works page

## Resume Bullets

Add final truthful resume bullets to README or a docs file.

Suggested after implementation:

```text
Built a full-stack healthcare analytics platform for diabetes readmission risk prediction and insurance claim forecasting using Next.js, Tailwind CSS, FastAPI, PostgreSQL, and scikit-learn/XGBoost.

Integrated Google OAuth authentication with role-based access control, protected analytics routes, user-scoped records, and audit logging.

Developed interactive cohort dashboards for readmission risk segmentation, claim burden analysis, model performance tracking, feature importance, and high-risk patient ranking.

Implemented batch CSV scoring with schema validation, invalid-row reporting, downloadable scored outputs, and automated PDF report generation.

Added ML guardrails including input validation, out-of-distribution warnings, model versioning, prediction confidence bands, explainability outputs, and responsible AI disclaimers.
```

## Verification Checklist

- [ ] README does not exaggerate unfinished features.
- [ ] Screenshots match actual app.
- [ ] Setup instructions are accurate.
- [ ] Disclaimer is included.
- [ ] Repo looks clean.
- [ ] Live demo link works.
- [ ] No private files committed.

## Completion Criteria

Phase 28 is complete when the project is ready to show on resume, GitHub, and interviews.

---

# PHASE 29 — Final Agent Audit

## Objective

Perform one final repository-wide check.

## Tasks

- [ ] Search for `TODO`.
- [ ] Search for `placeholder`.
- [ ] Search for `coming soon`.
- [ ] Search for unused fake/mock production code.
- [ ] Search for committed secrets.
- [ ] Search for broken imports.
- [ ] Search for hardcoded localhost in production code.
- [ ] Search for dead pages.
- [ ] Confirm `.env` is not committed.
- [ ] Confirm generated PDFs are not committed.
- [ ] Confirm uploaded CSVs are not committed.
- [ ] Confirm no raw private dataset is committed.
- [ ] Confirm docs are consistent.

## Suggested Searches

```bash
grep -R "TODO" .
grep -R "placeholder" .
grep -R "coming soon" .
grep -R "localhost" frontend backend
grep -R "SECRET" .
grep -R "PASSWORD" .
```

On Windows PowerShell:

```powershell
Select-String -Path .\* -Pattern "TODO" -Recurse
Select-String -Path .\* -Pattern "placeholder" -Recurse
Select-String -Path .\* -Pattern "coming soon" -Recurse
```

## Completion Criteria

Phase 29 is complete when no unfinished work, secrets, or misleading claims remain.

---

# Final Project Completion Definition

The project is complete when all of the following are true:

- [ ] Public landing page is polished.
- [ ] How-it-works page explains the full system.
- [ ] Google OAuth login works.
- [ ] Internal RBAC works.
- [ ] Protected routes work.
- [ ] Backend API works.
- [ ] PostgreSQL database works.
- [ ] ML pipeline has real artifacts.
- [ ] Single prediction works end-to-end.
- [ ] Dashboard shows meaningful analytics.
- [ ] Batch CSV scoring works.
- [ ] PDF reports generate and download.
- [ ] Model performance page shows real metrics.
- [ ] Explainability page shows real feature drivers.
- [ ] Monitoring page shows useful signals.
- [ ] Admin page is protected.
- [ ] Security controls are documented and implemented.
- [ ] Frontend build passes.
- [ ] Backend checks pass.
- [ ] Deployment works.
- [ ] README is complete.
- [ ] No TODOs/placeholders remain.
- [ ] No secrets are committed.
- [ ] The live app is recruiter-ready.

---

# Important Reminder for Agents

Do not optimize for speed over correctness.

This is a portfolio project meant to demonstrate:

- product thinking
- data science depth
- ML engineering
- dashboard analytics
- secure full-stack development
- professional UI/UX
- healthcare domain awareness
- deployment readiness

Work carefully, finish each phase, verify before moving forward, and never leave half-built features behind.
