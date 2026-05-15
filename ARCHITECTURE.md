# Architecture Document

# AdmitGuard Intelligence  
## Patient Readmission & Claim Risk Analytics Platform

**Document Type:** System Architecture Document  
**Project Type:** Full-stack healthcare analytics and machine learning web application  
**Frontend:** Next.js, React, Tailwind CSS  
**Backend:** FastAPI  
**Authentication:** Google OAuth with internal RBAC  
**Database:** PostgreSQL  
**ML Stack:** scikit-learn, XGBoost, Pandas, NumPy, SHAP/permutation importance  
**Reports:** PDF generation using ReportLab or WeasyPrint  
**Deployment Target:** Vercel frontend + Render/Railway/Fly.io backend + managed PostgreSQL  
**Status:** Architecture source of truth for implementation agents  

---

## 1. Architecture Goals

AdmitGuard Intelligence is designed as a production-style healthcare analytics platform, not a simple ML prediction demo.

The architecture must support:

- secure Google OAuth login
- app-level user roles and permissions
- patient-level readmission risk prediction
- claim amount forecasting
- batch CSV scoring
- interactive analytics dashboards
- explainable model outputs
- model performance monitoring
- data quality checks
- PDF report generation
- audit logging
- scalable backend services
- clean frontend-backend separation
- recruiter-friendly project walkthrough pages

The system should remain practical enough to build as a portfolio project while demonstrating real-world engineering maturity.

---

## 2. Architectural Principles

### 2.1 Separation of Concerns

The system must separate:

- frontend UI
- backend API logic
- authentication/session handling
- database persistence
- ML model serving
- batch processing
- report generation
- monitoring and logging

No major feature should be implemented as one large unstructured file.

### 2.2 API-First Design

The frontend should communicate with the backend through versioned APIs.

```text
/api/v1/
```

Frontend pages should not directly access database credentials, model files, or private backend logic.

### 2.3 Secure by Design

The architecture must enforce:

- authenticated access to protected routes
- app-level role-based access control
- user-scoped records
- audit logging
- input validation
- file upload validation
- safe report generation
- environment-based secrets
- restricted CORS
- no raw error traces in production

### 2.4 Explainable and Responsible ML

Predictions must include:

- model version
- timestamp
- confidence indicator
- data quality warnings
- top contributing features
- responsible AI disclaimer

The system must never provide medical treatment advice.

### 2.5 Recruiter-Friendly Demonstrability

The live app must include a clear `/how-it-works` page explaining:

- data flow
- model pipeline
- dashboard logic
- report generation
- security architecture
- deployment architecture

This page should make the project understandable without reading code.

---

## 3. High-Level System Architecture

```text
┌────────────────────────────────────────────────────────────────────┐
│                            User / Recruiter                         │
│           Admin / Analyst / Viewer / Interview Demo User            │
└───────────────────────────────┬────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│                        Next.js Frontend                             │
│                                                                    │
│  Public Pages:                                                     │
│  Landing, About, How It Works                                      │
│                                                                    │
│  Protected Pages:                                                  │
│  Dashboard, Predict, Batch, Reports, Model Performance,             │
│  Explainability, Monitoring, Admin                                  │
│                                                                    │
│  Responsibilities:                                                 │
│  UI rendering, charts, forms, Google OAuth session, route guards,   │
│  loading states, error states, API communication                    │
└───────────────────────────────┬────────────────────────────────────┘
                                │ HTTPS / JSON API
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│                         FastAPI Backend                             │
│                                                                    │
│  Responsibilities:                                                 │
│  API routing, auth verification, RBAC, validation, prediction,      │
│  batch processing, report generation, audit logging, monitoring     │
└──────────────┬────────────────┬─────────────────┬─────────────────┘
               │                │                 │
               ▼                ▼                 ▼
┌─────────────────────┐ ┌─────────────────┐ ┌──────────────────────┐
│   PostgreSQL DB      │ │   ML Service     │ │   Report Service      │
│                     │ │                 │ │                      │
│ users               │ │ preprocessing   │ │ templates             │
│ patients            │ │ readmission ML  │ │ charts                │
│ predictions         │ │ claim ML        │ │ PDF generation        │
│ batch_jobs          │ │ explanations    │ │ report metadata       │
│ reports             │ │ guardrails      │ │ file output/storage   │
│ audit_logs          │ │ model versions  │ │                      │
└─────────────────────┘ └─────────────────┘ └──────────────────────┘
               │                │                 │
               ▼                ▼                 ▼
┌─────────────────────┐ ┌─────────────────┐ ┌──────────────────────┐
│ Managed Postgres     │ │ Model Artifacts  │ │ Object/File Storage   │
│ Supabase/Neon/etc.   │ │ joblib/json      │ │ PDFs, uploads, CSVs   │
└─────────────────────┘ └─────────────────┘ └──────────────────────┘
```

---

## 4. Deployment Architecture

### 4.1 Recommended Deployment

```text
┌─────────────────────┐
│ Vercel              │
│ Next.js Frontend    │
└──────────┬──────────┘
           │ HTTPS
           ▼
┌─────────────────────┐
│ Render/Railway/Fly  │
│ FastAPI Backend     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Managed PostgreSQL  │
│ Supabase/Neon/etc.  │
└─────────────────────┘

Optional:
┌─────────────────────┐
│ Object Storage      │
│ Supabase Storage/S3 │
│ Generated PDFs      │
└─────────────────────┘
```

### 4.2 Local Development Deployment

```text
Local Machine
│
├── frontend/
│   └── Next.js dev server on http://localhost:3000
│
├── backend/
│   └── FastAPI dev server on http://localhost:8000
│
├── Docker Compose
│   ├── PostgreSQL on localhost:5432
│   └── Redis on localhost:6379
│
└── .venv
    └── Python backend dependencies
```

### 4.3 Environment Separation

Use separate environment configs for:

- development
- staging if needed
- production

Never commit real secrets.

---

## 5. Repository Architecture

Recommended repository structure:

```text
patient-readmission-claim-prediction/
│
├── START_HERE.md
├── PROJECT_CONTEXT.md
├── PRD.md
├── PLAN.md
├── AGENT_RULES.md
├── ARCHITECTURE.md
├── SECURITY_REQUIREMENTS.md
├── README.md
├── docker-compose.yml
├── .gitignore
├── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── lib/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.ts
│   └── .env.example
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── ml/
│   │   ├── reports/
│   │   └── utils/
│   ├── migrations/
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── ml/
│   ├── notebooks/
│   ├── src/
│   ├── models/
│   ├── metrics/
│   ├── artifacts/
│   ├── reports/
│   └── model_card.md
│
├── data/
│   ├── sample/
│   ├── processed/
│   └── README.md
│
├── docs/
│   ├── architecture/
│   ├── screenshots/
│   ├── api/
│   ├── security/
│   └── reports/
│
└── .github/
    └── workflows/
```

---

## 6. Frontend Architecture

### 6.1 Frontend Responsibilities

The frontend is responsible for:

- public landing experience
- Google OAuth login flow
- protected route handling
- page layouts
- dashboard charts
- prediction forms
- batch upload UI
- report previews
- loading states
- error states
- professional animations
- recruiter-facing workflow pages
- API communication

The frontend must not:

- directly access the database
- load model artifacts
- expose private environment variables
- bypass backend authorization checks
- contain fake production logic

### 6.2 Frontend Folder Structure

```text
frontend/src/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── login/
│   ├── about/
│   ├── how-it-works/
│   ├── dashboard/
│   ├── predict/
│   ├── batch/
│   ├── reports/
│   ├── model-performance/
│   ├── explainability/
│   ├── monitoring/
│   └── admin/
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── ui/
│   │   ├── MetricCard.tsx
│   │   ├── RiskBadge.tsx
│   │   ├── ConfidenceIndicator.tsx
│   │   ├── StatusPill.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorPanel.tsx
│   │   └── LoadingTimeline.tsx
│   │
│   ├── charts/
│   │   ├── RiskDistributionChart.tsx
│   │   ├── ClaimDistributionChart.tsx
│   │   ├── FeatureImportanceChart.tsx
│   │   ├── ConfusionMatrix.tsx
│   │   ├── ResidualPlot.tsx
│   │   └── HeatmapChart.tsx
│   │
│   ├── forms/
│   │   ├── PatientPredictionForm.tsx
│   │   ├── FormStep.tsx
│   │   └── FieldError.tsx
│   │
│   ├── reports/
│   │   ├── ReportCard.tsx
│   │   ├── ReportPreview.tsx
│   │   └── ReportGenerationProgress.tsx
│   │
│   └── workflow/
│       ├── SystemFlowDiagram.tsx
│       ├── DataPipelineDiagram.tsx
│       └── DeploymentDiagram.tsx
│
├── features/
│   ├── dashboard/
│   ├── predictions/
│   ├── batch/
│   ├── reports/
│   ├── auth/
│   ├── monitoring/
│   └── admin/
│
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── validators.ts
│   ├── formatters.ts
│   ├── constants.ts
│   └── routes.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useDashboard.ts
│   ├── usePrediction.ts
│   └── useReports.ts
│
└── types/
    ├── api.ts
    ├── patient.ts
    ├── prediction.ts
    ├── report.ts
    └── auth.ts
```

### 6.3 Frontend Pages

#### Public Pages

```text
/
about
how-it-works
login
```

#### Protected Pages

```text
dashboard
predict
batch
reports
model-performance
explainability
monitoring
admin
```

### 6.4 Frontend State Management

Use simple state management unless complexity demands more.

Recommended:

- React state for local UI
- React Hook Form for forms
- Zod for schema validation
- SWR/React Query optional for server data
- Context provider for auth/session state if needed

Avoid unnecessary global state libraries unless justified.

### 6.5 Frontend API Layer

All API calls should go through a central API client.

```text
frontend/src/lib/api.ts
```

Responsibilities:

- base URL config
- auth headers/session forwarding if needed
- JSON response parsing
- standardized error handling
- timeout behavior
- file download handling

### 6.6 Frontend Validation

Use Zod schemas for frontend form validation.

Backend validation remains mandatory even if frontend validation exists.

---

## 7. UI Design Architecture

### 7.1 Design Identity

The UI must look like a modern healthcare analytics platform.

Preferred visual direction:

- clinical
- enterprise-grade
- structured
- trustworthy
- readable
- data-focused
- refined
- calm

Avoid:

- generic shadcn dashboard clones
- excessive purple gradients
- cyberpunk style
- fake AI art
- childish illustrations
- overdone glassmorphism
- random glowing cards
- cluttered visuals

### 7.2 Color System

Suggested semantic palette:

```text
Primary: deep medical blue
Secondary: slate
Accent: teal
Success: clinical green
Warning: amber
High risk: controlled red
Background: off-white / pale slate
Text: dark slate / near black
Muted text: slate gray
Borders: light slate
```

### 7.3 Risk Color Rules

Risk indicators must use consistent colors:

```text
Low Risk: green / teal
Medium Risk: amber
High Risk: red
Unknown / insufficient data: gray
```

Risk must not be communicated by color alone. Use labels and icons/text.

### 7.4 Animation Architecture

Animations should be implemented as reusable components.

Allowed animation areas:

- page transition fade/slide
- card entrance
- chart skeleton loading
- progress stepper
- report generation stages
- CSV upload status
- prediction stages
- button hover
- modal transitions

Rules:

- professional and subtle
- no bouncing
- no goofy movement
- no fake AI “thinking”
- no long delays
- no excessive spinning
- motion must support clarity

### 7.5 Stitch MCP Usage

Stitch MCP may be used to generate UI/UX inspiration and page layouts.

Rules:

- use outputs as inspiration, not blind implementation
- reject generic SaaS layouts
- adapt everything to healthcare analytics style
- maintain consistent custom design system
- prioritize clarity and recruiter comprehension
- do not introduce unrelated design systems

---

## 8. Backend Architecture

### 8.1 Backend Responsibilities

The FastAPI backend is responsible for:

- API routing
- auth verification
- RBAC enforcement
- database access
- patient record handling
- prediction serving
- batch scoring
- PDF report generation
- audit logging
- dashboard aggregation
- model performance serving
- monitoring summaries
- error handling
- input validation
- file validation

### 8.2 Backend Folder Structure

```text
backend/app/
│
├── main.py
├── config.py
├── database.py
├── dependencies.py
│
├── api/
│   ├── v1/
│   │   ├── router.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── patients.py
│   │   ├── predictions.py
│   │   ├── batch.py
│   │   ├── dashboard.py
│   │   ├── reports.py
│   │   ├── model_performance.py
│   │   ├── explainability.py
│   │   ├── monitoring.py
│   │   └── admin.py
│
├── core/
│   ├── security.py
│   ├── permissions.py
│   ├── exceptions.py
│   ├── responses.py
│   ├── logging.py
│   ├── rate_limit.py
│   └── audit.py
│
├── models/
│   ├── user.py
│   ├── patient.py
│   ├── prediction.py
│   ├── batch_job.py
│   ├── report.py
│   ├── audit_log.py
│   └── model_version.py
│
├── schemas/
│   ├── user.py
│   ├── patient.py
│   ├── prediction.py
│   ├── batch.py
│   ├── report.py
│   ├── dashboard.py
│   ├── monitoring.py
│   └── common.py
│
├── services/
│   ├── auth_service.py
│   ├── user_service.py
│   ├── patient_service.py
│   ├── prediction_service.py
│   ├── batch_service.py
│   ├── dashboard_service.py
│   ├── report_service.py
│   ├── monitoring_service.py
│   └── audit_service.py
│
├── ml/
│   ├── model_loader.py
│   ├── preprocessing.py
│   ├── prediction_engine.py
│   ├── explanation_engine.py
│   ├── guardrails.py
│   ├── drift.py
│   └── schemas.py
│
├── reports/
│   ├── templates/
│   ├── charts.py
│   ├── pdf_generator.py
│   ├── patient_report.py
│   └── cohort_report.py
│
└── utils/
    ├── file_utils.py
    ├── csv_utils.py
    ├── hashing.py
    ├── datetime_utils.py
    └── pagination.py
```

### 8.3 Backend API Versioning

All routes should be mounted under:

```text
/api/v1
```

Example:

```text
/api/v1/dashboard/summary
/api/v1/predictions/single
/api/v1/reports/patient/{prediction_id}
```

### 8.4 Backend Response Format

All APIs should use consistent responses.

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Request completed successfully"
}
```

Error:

```json
{
  "success": false,
  "error_code": "VALIDATION_ERROR",
  "message": "Invalid request input.",
  "details": {}
}
```

### 8.5 Backend Exception Handling

Use centralized exception handling for:

- validation errors
- authentication errors
- authorization errors
- missing resources
- file upload errors
- model errors
- report generation errors
- database errors
- unexpected errors

Production errors must not expose raw stack traces.

---

## 9. Authentication Architecture

### 9.1 Authentication Choice

The project uses Google OAuth instead of custom password authentication.

Rationale:

- reduces security risk
- avoids weak password implementation
- improves recruiter demo flow
- avoids agent-generated auth vulnerabilities
- lets the app focus on RBAC and data security

### 9.2 Auth Responsibilities

Google OAuth handles:

- user identity
- login
- account verification
- OAuth flow

The application handles:

- internal user record
- role assignment
- authorization
- audit logs
- user ownership
- protected routes

### 9.3 Auth Flow

```text
User clicks "Continue with Google"
        ↓
Frontend starts Google OAuth flow
        ↓
Google authenticates user
        ↓
Frontend receives session/user info
        ↓
Frontend calls backend /auth/me or session-sync endpoint
        ↓
Backend creates or updates user record
        ↓
Backend assigns default role if new user
        ↓
User accesses protected app pages
        ↓
Backend verifies identity and role on protected requests
```

### 9.4 User Role Assignment

Default new user role:

```text
Viewer
```

Admin role should be assigned manually through:

- database seed
- admin panel
- controlled backend script

### 9.5 Protected Routes

Frontend protected routes:

```text
/dashboard
/predict
/batch
/reports
/model-performance
/explainability
/monitoring
/admin
```

Backend protected APIs:

- all patient APIs
- all prediction APIs
- all batch APIs
- all report APIs
- monitoring APIs
- admin APIs

Public APIs:

- health check
- public project metadata if needed

### 9.6 RBAC Matrix

| Feature | Admin | Analyst | Viewer |
|---|---:|---:|---:|
| View dashboard | Yes | Yes | Yes |
| Run prediction | Yes | Yes | Optional |
| Upload batch | Yes | Yes | No |
| Generate report | Yes | Yes | No |
| View report | Yes | Yes | Yes |
| View model performance | Yes | Yes | Yes |
| View monitoring | Yes | Yes | No |
| View audit logs | Yes | No | No |
| Manage users | Yes | No | No |

---

## 10. Database Architecture

### 10.1 Database Choice

Use PostgreSQL.

Reasons:

- relational data fits the domain
- strong indexing
- good JSON support
- compatible with SQLAlchemy
- easy deployment via managed providers
- professional architecture choice

### 10.2 Database Entity Relationship Overview

```text
users
  ├── patients
  │     └── predictions
  │            └── prediction_explanations
  │            └── reports
  │
  ├── batch_jobs
  │     ├── batch_rows
  │     └── reports
  │
  └── audit_logs

model_versions
  └── predictions
  └── reports
```

### 10.3 Core Tables

#### users

Stores authenticated users.

Fields:

```text
id UUID primary key
google_sub unique nullable/string
name string
email string unique
avatar_url string nullable
role enum(admin, analyst, viewer)
is_active boolean
created_at timestamp
updated_at timestamp
last_login_at timestamp nullable
```

#### patients

Stores patient input records.

Fields:

```text
id UUID primary key
user_id foreign key users.id
external_patient_id string nullable
age string/int depending schema
gender string
bmi float nullable
weight float nullable
time_in_hospital int
num_lab_procedures int
num_procedures int
num_medications int
number_outpatient int
number_emergency int
number_inpatient int
number_diagnoses int
diagnosis_category string nullable
payer_code string nullable
insulin string
diabetes_med string
raw_input_json jsonb
created_at timestamp
updated_at timestamp
```

#### predictions

Stores prediction output.

Fields:

```text
id UUID primary key
user_id foreign key users.id
patient_id foreign key patients.id
model_version_id foreign key model_versions.id nullable
model_version string
readmission_probability float
readmission_class string
risk_band string
predicted_claim float
claim_range_low float
claim_range_high float
confidence_score float
input_hash string
warnings jsonb
created_at timestamp
```

#### prediction_explanations

Stores local explanation output.

Fields:

```text
id UUID primary key
prediction_id foreign key predictions.id
feature_name string
feature_value string
contribution float
direction string
rank int
created_at timestamp
```

#### batch_jobs

Stores CSV upload and processing metadata.

Fields:

```text
id UUID primary key
user_id foreign key users.id
file_name string
stored_file_path string nullable
file_hash string
total_rows int
valid_rows int
invalid_rows int
status enum(pending, processing, completed, failed)
summary_json jsonb
error_message text nullable
created_at timestamp
completed_at timestamp nullable
```

#### batch_rows

Stores row-level batch outputs if needed.

Fields:

```text
id UUID primary key
batch_job_id foreign key batch_jobs.id
row_number int
patient_id foreign key patients.id nullable
prediction_id foreign key predictions.id nullable
is_valid boolean
validation_errors jsonb nullable
created_at timestamp
```

#### reports

Stores report metadata.

Fields:

```text
id UUID primary key
user_id foreign key users.id
prediction_id foreign key predictions.id nullable
batch_job_id foreign key batch_jobs.id nullable
report_type enum(patient, cohort)
file_url string
file_path string nullable
status enum(pending, generating, completed, failed)
model_version string
error_message text nullable
generated_at timestamp nullable
created_at timestamp
```

#### audit_logs

Stores security and user activity logs.

Fields:

```text
id UUID primary key
user_id foreign key users.id nullable
action string
resource_type string
resource_id string nullable
ip_address string nullable
user_agent string nullable
metadata_json jsonb nullable
created_at timestamp
```

#### model_versions

Stores model metadata.

Fields:

```text
id UUID primary key
version string unique
readmission_model_name string
claim_model_name string
training_date timestamp
dataset_version string
metrics_json jsonb
feature_schema_json jsonb
artifact_paths_json jsonb
is_active boolean
created_at timestamp
```

### 10.4 Indexing Strategy

Required indexes:

```text
users.email
users.google_sub
patients.user_id
patients.created_at
predictions.user_id
predictions.patient_id
predictions.risk_band
predictions.created_at
batch_jobs.user_id
batch_jobs.status
reports.user_id
reports.report_type
audit_logs.user_id
audit_logs.created_at
model_versions.version
model_versions.is_active
```

### 10.5 Database Migrations

Use Alembic.

Rules:

- every schema change must have a migration
- no manual production schema edits
- migrations must be documented
- seed scripts should be separate from migrations

---

## 11. Machine Learning Architecture

### 11.1 ML Pipeline Overview

```text
Raw dataset
   ↓
Data validation
   ↓
Data cleaning
   ↓
Feature schema definition
   ↓
Train/test split
   ↓
Preprocessing pipeline
   ↓
Model training
   ↓
Model comparison
   ↓
Model evaluation
   ↓
Feature importance
   ↓
Artifact export
   ↓
Backend model loading
   ↓
Prediction API serving
```

### 11.2 ML Folder Structure

```text
ml/
│
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_model_training.ipynb
│   └── 03_evaluation.ipynb
│
├── src/
│   ├── config.py
│   ├── load_data.py
│   ├── clean_data.py
│   ├── feature_schema.py
│   ├── train_readmission.py
│   ├── train_claim.py
│   ├── evaluate.py
│   ├── explain.py
│   └── export_artifacts.py
│
├── models/
│   ├── readmission_model.joblib
│   ├── claim_model.joblib
│   └── preprocessor.joblib
│
├── artifacts/
│   ├── feature_schema.json
│   ├── training_ranges.json
│   ├── label_mappings.json
│   ├── model_version.json
│   └── feature_importance.json
│
├── metrics/
│   ├── readmission_metrics.json
│   ├── claim_metrics.json
│   └── model_comparison.json
│
└── model_card.md
```

### 11.3 Model Tasks

Task 1:

```text
Readmission risk classification
```

Task 2:

```text
Claim amount regression
```

### 11.4 Candidate Models

Readmission:

- Logistic Regression
- Random Forest Classifier
- XGBoost Classifier
- Gradient Boosting Classifier

Claim:

- Linear Regression
- Random Forest Regressor
- XGBoost Regressor
- Gradient Boosting Regressor

### 11.5 Preprocessing Architecture

Use scikit-learn `Pipeline` and `ColumnTransformer`.

Numeric columns:

- imputation
- scaling if needed

Categorical columns:

- imputation
- one-hot encoding
- handle unknown categories safely

Do not use LabelEncoder for nominal feature inputs unless explicitly justified.

### 11.6 Model Artifact Loading

Backend ML service should load artifacts once during startup or lazily with caching.

```text
backend/app/ml/model_loader.py
```

Responsibilities:

- load preprocessor
- load readmission model
- load claim model
- load feature schema
- load training ranges
- load model metrics
- expose active model version

### 11.7 Prediction Engine

```text
backend/app/ml/prediction_engine.py
```

Responsibilities:

- receive validated input
- convert to model-ready dataframe
- apply preprocessing
- run readmission model
- run claim model
- compute confidence
- assign risk band
- attach warnings
- return structured prediction output

### 11.8 Risk Band Logic

Suggested default:

```text
Low Risk: probability < 0.30
Medium Risk: 0.30 <= probability < 0.60
High Risk: probability >= 0.60
```

Thresholds should be configurable.

### 11.9 Claim Range Logic

Claim prediction should include a reasonable uncertainty range.

Approaches:

- residual-based interval
- quantile estimate
- fixed percentage band as fallback
- model error based on validation MAE

Example:

```text
claim_range_low = predicted_claim - validation_mae
claim_range_high = predicted_claim + validation_mae
```

### 11.10 ML Guardrails

Before prediction:

- validate required features
- validate numeric ranges
- check known categorical values
- check missing values
- check training range violations
- check impossible values
- compute warnings

After prediction:

- attach confidence score
- attach model version
- attach disclaimers
- save audit log
- save prediction record if user is authenticated

### 11.11 Explainability Architecture

Global explanation sources:

- model feature importance
- permutation importance
- SHAP values if stable

Local explanation sources:

- SHAP values if available
- approximation based on feature contribution
- model-native explanation fallback

Output format:

```json
[
  {
    "feature_name": "number_inpatient",
    "feature_value": "4",
    "contribution": 0.18,
    "direction": "increases_risk",
    "rank": 1
  }
]
```

---

## 12. Prediction Workflow Architecture

### 12.1 Single Prediction Flow

```text
User opens /predict
   ↓
Frontend loads form schema
   ↓
User enters patient data
   ↓
Frontend validates input
   ↓
Frontend sends POST /api/v1/predictions/single
   ↓
Backend verifies auth and role
   ↓
Backend validates schema
   ↓
Backend runs guardrails
   ↓
Backend preprocesses input
   ↓
Backend runs readmission model
   ↓
Backend runs claim model
   ↓
Backend computes explanation
   ↓
Backend saves patient and prediction
   ↓
Backend writes audit log
   ↓
Frontend displays result
   ↓
User may generate PDF report
```

### 12.2 Prediction Loading UI

Frontend loading stages:

1. Validating patient data
2. Applying preprocessing pipeline
3. Running readmission model
4. Running claim forecast model
5. Computing explanation
6. Preparing risk summary

These stages are UI states only and must not add fake long delays.

---

## 13. Batch Processing Architecture

### 13.1 Batch Flow

```text
User uploads CSV
   ↓
Frontend validates file type and size
   ↓
Backend receives file
   ↓
Backend stores temporary upload safely
   ↓
Backend validates schema
   ↓
Backend identifies invalid rows
   ↓
Backend processes valid rows
   ↓
Backend runs predictions
   ↓
Backend stores batch job summary
   ↓
Backend prepares scored CSV
   ↓
Frontend shows batch analytics
   ↓
User downloads scored CSV or generates cohort PDF
```

### 13.2 Batch Job Status

Statuses:

```text
pending
processing
completed
failed
```

### 13.3 Batch Processing Options

For v1:

- synchronous processing is acceptable for small demo files

For scalable design:

- use Redis + background worker for larger files
- show polling-based progress updates
- store status in `batch_jobs`

### 13.4 Batch Validation

CSV validation must check:

- file type
- file size
- required columns
- invalid numeric values
- missing required fields
- unsupported categories
- row-level errors

Invalid rows should not crash the entire batch.

### 13.5 Batch Outputs

Outputs:

- scored CSV
- invalid row report
- batch analytics summary
- top high-risk patients
- top high-claim patients
- optional cohort report

---

## 14. Dashboard Analytics Architecture

### 14.1 Dashboard Data Sources

Dashboard can use:

- database prediction records
- seeded demo records
- uploaded batch records
- saved model metrics
- model artifact metadata

### 14.2 Dashboard Service

```text
backend/app/services/dashboard_service.py
```

Responsibilities:

- aggregate KPI metrics
- compute risk distributions
- compute claim distributions
- compute patient ranking
- compute filter summaries
- return chart-ready JSON

### 14.3 Dashboard API

Example endpoints:

```text
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/risk-distribution
GET /api/v1/dashboard/claim-distribution
GET /api/v1/dashboard/high-risk-patients
GET /api/v1/dashboard/filters
```

### 14.4 Dashboard Caching

Cache low-risk aggregate results where appropriate.

Do not cache sensitive patient-level data unless access control and expiry are handled.

### 14.5 Chart Data Format

Charts should receive normalized JSON from backend.

Example:

```json
{
  "labels": ["Low", "Medium", "High"],
  "values": [420, 210, 95]
}
```

---

## 15. Report Generation Architecture

### 15.1 Report Types

Required:

1. Individual Patient Risk Report
2. Cohort Analytics Report

### 15.2 Report Generation Flow

```text
User requests report
   ↓
Backend verifies auth and permission
   ↓
Backend verifies resource ownership
   ↓
Backend fetches prediction or batch data
   ↓
Backend generates charts
   ↓
Backend renders report template
   ↓
Backend converts to PDF
   ↓
Backend stores PDF file
   ↓
Backend creates report metadata row
   ↓
Backend writes audit log
   ↓
Frontend receives download link/status
```

### 15.3 Report Service Structure

```text
backend/app/reports/
│
├── templates/
│   ├── patient_report.html
│   └── cohort_report.html
│
├── charts.py
├── pdf_generator.py
├── patient_report.py
└── cohort_report.py
```

### 15.4 PDF Library Options

Preferred:

- ReportLab for programmatic PDFs
- WeasyPrint for HTML/CSS-styled PDFs

If WeasyPrint causes Windows or deployment dependency issues, use ReportLab first.

### 15.5 Report Storage

Development:

```text
backend/reports/generated/
```

Production:

```text
object storage or persistent backend storage
```

Do not commit generated reports to Git.

### 15.6 Report Metadata

Report metadata is stored in the `reports` table.

File storage path or URL must be stored.

### 15.7 Report Loading UI

Report generation stages:

1. Collecting prediction data
2. Rendering charts
3. Building report template
4. Generating PDF
5. Saving report metadata
6. Preparing download link

---

## 16. Monitoring Architecture

### 16.1 Monitoring Scope

Monitoring is not full enterprise observability, but should demonstrate production-style awareness.

Track:

- API health
- model artifact status
- prediction volume
- report generation count
- report generation failures
- batch upload failures
- invalid input frequency
- out-of-range input frequency
- risk distribution shifts
- confidence distribution
- audit events

### 16.2 Monitoring API

```text
GET /api/v1/monitoring/summary
GET /api/v1/monitoring/data-quality
GET /api/v1/monitoring/service-health
GET /api/v1/monitoring/drift
```

### 16.3 Drift Monitoring

For v1, simple drift indicators are acceptable:

- compare current input feature distributions to training ranges
- count percentage of values outside training ranges
- track unknown category frequency
- track confidence score degradation

Do not claim advanced production drift detection unless implemented.

---

## 17. Admin Architecture

### 17.1 Admin Responsibilities

Admin page provides operational oversight.

Required sections:

- users
- role management
- audit logs
- batch job history
- report history
- API errors
- model status

### 17.2 Admin Access

Only users with role:

```text
Admin
```

can access admin APIs and admin frontend pages.

### 17.3 Admin API Examples

```text
GET /api/v1/admin/users
PATCH /api/v1/admin/users/{id}/role
GET /api/v1/admin/audit-logs
GET /api/v1/admin/reports
GET /api/v1/admin/batch-jobs
```

All admin actions must be audit logged.

---

## 18. Security Architecture

### 18.1 Security Layers

```text
Layer 1: Google OAuth identity
Layer 2: frontend protected routes
Layer 3: backend authentication verification
Layer 4: backend RBAC checks
Layer 5: resource ownership checks
Layer 6: database constraints and indexes
Layer 7: audit logging
Layer 8: input/file validation
Layer 9: safe error handling
```

### 18.2 CORS

Development:

```text
http://localhost:3000
```

Production:

```text
configured frontend domain only
```

Never use wildcard CORS in production.

### 18.3 File Upload Security

Rules:

- CSV only
- file size limit
- reject dangerous extensions
- random stored filenames
- schema validation before processing
- no public direct execution path
- no trusting original filename
- audit log upload event

### 18.4 Secrets Management

Never commit:

- Google OAuth client secret
- production database URL
- session secret
- backend secret keys
- private data
- generated PDFs

Use:

- `.env.example`
- deployment platform environment variables

### 18.5 Audit Logging

Audit log required for:

- login/sync
- prediction generation
- batch upload
- report generation
- report download
- unauthorized access
- admin role change
- model artifact load failure where appropriate

### 18.6 Error Handling

User-facing errors must be clear but not leak internals.

Bad:

```text
psycopg.errors.UndefinedTable: relation users does not exist
```

Good:

```text
The service is temporarily unavailable. Please try again later.
```

Backend logs can contain technical details.

---

## 19. API Architecture

### 19.1 Route Groups

```text
/api/v1/auth
/api/v1/users
/api/v1/patients
/api/v1/predictions
/api/v1/batch
/api/v1/dashboard
/api/v1/reports
/api/v1/model-performance
/api/v1/explainability
/api/v1/monitoring
/api/v1/admin
/api/v1/health
```

### 19.2 Route Responsibility Examples

#### Auth

```text
GET /api/v1/auth/me
POST /api/v1/auth/sync
```

#### Predictions

```text
POST /api/v1/predictions/single
GET /api/v1/predictions
GET /api/v1/predictions/{prediction_id}
```

#### Batch

```text
POST /api/v1/batch/upload
GET /api/v1/batch/{batch_id}
GET /api/v1/batch/{batch_id}/download
```

#### Reports

```text
POST /api/v1/reports/patient/{prediction_id}
POST /api/v1/reports/cohort/{batch_id}
GET /api/v1/reports
GET /api/v1/reports/{report_id}/download
```

### 19.3 API Validation

Use Pydantic schemas for:

- request bodies
- response models
- patient inputs
- batch metadata
- report metadata
- dashboard responses

---

## 20. Data Flow Diagrams

### 20.1 Single Prediction Data Flow

```text
Frontend Form
   ↓
Zod validation
   ↓
FastAPI endpoint
   ↓
Pydantic validation
   ↓
Guardrail checks
   ↓
Preprocessor
   ↓
Readmission model
   ↓
Claim model
   ↓
Explanation engine
   ↓
Database save
   ↓
Audit log
   ↓
Frontend result display
```

### 20.2 Batch Upload Data Flow

```text
CSV Upload UI
   ↓
File validation
   ↓
Backend upload endpoint
   ↓
Safe file storage
   ↓
Schema validation
   ↓
Row validation
   ↓
Prediction engine loop
   ↓
Batch summary aggregation
   ↓
Scored CSV creation
   ↓
Database metadata
   ↓
Dashboard display
```

### 20.3 PDF Report Data Flow

```text
Report request
   ↓
Auth + RBAC check
   ↓
Resource ownership check
   ↓
Fetch prediction/batch data
   ↓
Generate charts
   ↓
Render report template
   ↓
Generate PDF
   ↓
Store file
   ↓
Save report row
   ↓
Audit log
   ↓
Return download link
```

---

## 21. Error Handling Architecture

### 21.1 Error Categories

```text
VALIDATION_ERROR
AUTHENTICATION_ERROR
AUTHORIZATION_ERROR
RESOURCE_NOT_FOUND
FILE_UPLOAD_ERROR
MODEL_LOADING_ERROR
PREDICTION_ERROR
REPORT_GENERATION_ERROR
DATABASE_ERROR
RATE_LIMIT_ERROR
UNKNOWN_SERVER_ERROR
```

### 21.2 Backend Error Response

```json
{
  "success": false,
  "error_code": "MODEL_LOADING_ERROR",
  "message": "Prediction service is temporarily unavailable.",
  "details": {}
}
```

### 21.3 Frontend Error States

Every major page must include:

- loading state
- empty state
- error state
- success state

Pages must not crash visually if the backend fails.

---

## 22. Scalability Architecture

### 22.1 V1 Scale

V1 can use:

- one frontend deployment
- one backend deployment
- one PostgreSQL database
- synchronous single predictions
- synchronous small batch jobs
- local/persistent report storage

### 22.2 Future Scale

Future scalable design:

```text
Frontend
   ↓
API backend
   ↓
Queue
   ↓
Worker service
   ↓
Database + object storage
```

Use background workers for:

- large batch scoring
- report generation
- chart rendering
- drift checks

### 22.3 Redis Usage

Redis can be used for:

- job queue
- caching dashboard summaries
- rate limiting
- temporary progress states

For v1, Redis may remain prepared but lightly used.

---

## 23. Logging and Observability

### 23.1 Application Logs

Backend logs should include:

- request ID if possible
- route
- status
- duration
- error category
- user ID where safe
- model version for predictions

### 23.2 Audit Logs vs App Logs

Audit logs are database records of user/security activity.

App logs are runtime diagnostic logs.

Both are needed.

### 23.3 Sensitive Data Logging

Do not log:

- OAuth tokens
- secrets
- raw uploaded files
- full patient records
- generated report content

---

## 24. Configuration Architecture

### 24.1 Backend Environment Variables

```text
ENVIRONMENT
DATABASE_URL
FRONTEND_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET if backend needs it
SESSION_SECRET or AUTH_SECRET
MODEL_VERSION
REPORT_OUTPUT_DIR
CORS_ALLOWED_ORIGINS
MAX_UPLOAD_SIZE_MB
```

### 24.2 Frontend Environment Variables

```text
NEXT_PUBLIC_API_BASE_URL
NEXTAUTH_URL or auth framework equivalent
NEXTAUTH_SECRET or AUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Only variables prefixed with `NEXT_PUBLIC_` should be exposed to the browser.

### 24.3 Environment Files

Use:

```text
.env.example
```

Do not commit:

```text
.env
.env.local
.env.production
```

---

## 25. Testing Architecture

### 25.1 Backend Tests

Test:

- health endpoint
- auth dependency behavior
- RBAC checks
- patient validation
- prediction guardrails
- model loader
- report service
- CSV validation
- dashboard aggregation
- error response format

### 25.2 Frontend Tests

At minimum:

- build check
- TypeScript check
- route rendering
- form validation behavior
- protected route behavior
- main component smoke tests if configured

### 25.3 Manual Testing Checklist

Before deployment:

- login works
- dashboard loads
- single prediction works
- validation errors show properly
- batch upload works
- invalid CSV shows errors
- PDF generation works
- report download works
- unauthorized route redirects
- admin page blocks non-admin users
- no console errors
- no raw backend traces visible
- mobile layout does not break badly

---

## 26. CI/CD Architecture

Recommended GitHub Actions:

```text
frontend-build.yml
backend-tests.yml
lint.yml
```

Frontend pipeline:

- install dependencies
- run lint
- run TypeScript check
- run build

Backend pipeline:

- install dependencies
- run ruff
- run pytest
- optionally test imports

Do not run secrets or production database migrations from basic CI without clear setup.

---

## 27. Documentation Architecture

Required root docs:

```text
START_HERE.md
PROJECT_CONTEXT.md
PRD.md
PLAN.md
AGENT_RULES.md
ARCHITECTURE.md
SECURITY_REQUIREMENTS.md
README.md
```

Documentation responsibility:

- `PROJECT_CONTEXT.md`: persistent project memory
- `PRD.md`: product requirements
- `PLAN.md`: implementation roadmap
- `AGENT_RULES.md`: rules for coding agents
- `ARCHITECTURE.md`: system architecture
- `SECURITY_REQUIREMENTS.md`: security controls
- `README.md`: public-facing project explanation

Agents must not overwrite these files without approval.

---

## 28. Implementation Order

Recommended implementation order:

1. Confirm repo structure
2. Add documentation files
3. Build custom frontend shell
4. Build public pages
5. Add Google OAuth
6. Add protected route structure
7. Build backend app skeleton
8. Add database models and migrations
9. Add user sync and RBAC
10. Build ML pipeline
11. Export model artifacts
12. Implement prediction API
13. Build prediction frontend
14. Build dashboard backend aggregations
15. Build dashboard frontend
16. Implement batch upload and scoring
17. Implement report generation
18. Add model performance page
19. Add explainability page
20. Add monitoring/admin
21. Add deployment configuration
22. Final README, screenshots, and demo validation

---

## 29. Agent-Specific Architecture Rules

Agents must follow these rules:

### 29.1 No Incomplete Work

Do not leave:

- TODO comments
- placeholder APIs
- empty components
- fake auth
- fake report generation
- non-working buttons
- dangling imports
- broken navigation
- unfinished files

If a task cannot be completed, stop and explain the blocker.

### 29.2 No Destructive Actions

Do not:

- delete files without approval
- overwrite documentation without approval
- remove security checks
- remove validation
- commit secrets
- install unnecessary dependencies
- push to main without approval

### 29.3 Verify After Changes

After major changes, verify:

- frontend builds
- backend imports work
- routes are reachable
- env examples are updated
- no obvious console errors
- no placeholder code remains
- security rules remain intact

---

## 30. Architecture Definition of Done

The architecture is implemented successfully when:

- public pages are complete
- protected app shell works
- Google OAuth works
- user records sync to DB
- RBAC checks work
- dashboard displays real or seeded analytics
- single prediction works end-to-end
- batch scoring works end-to-end
- PDF reports generate and download
- model performance page shows metrics
- explainability page shows feature drivers
- monitoring page shows data quality and service signals
- audit logs are recorded
- deployment works
- documentation is accurate
- no major TODOs/placeholders remain

---

## 31. Final Architecture Summary

AdmitGuard Intelligence uses a modern full-stack architecture:

```text
Next.js frontend
   ↓
Google OAuth authentication
   ↓
FastAPI backend
   ↓
RBAC + validation + audit logging
   ↓
ML prediction service
   ↓
PostgreSQL persistence
   ↓
Analytics dashboards + PDF reports
```

The architecture is intentionally designed to show:

- data science skill
- backend engineering skill
- frontend product skill
- security awareness
- healthcare domain awareness
- scalable system design
- recruiter-friendly storytelling

This document is the source of truth for system design decisions.
