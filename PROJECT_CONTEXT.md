# PROJECT_CONTEXT.md

## Project Name

**AdmitGuard Intelligence**

## One-Line Summary

AdmitGuard Intelligence is a secure, full-stack healthcare analytics platform for diabetes patient readmission risk prediction, insurance claim forecasting, cohort-level analytics, explainable machine learning, batch scoring, and automated PDF report generation.

---

## Purpose of This File

This file is the persistent context source for AI coding agents working on this repository.

Agents should read this file before planning or implementing changes.

This project must not become a generic ML demo or a generic AI SaaS dashboard. It should look and behave like a modern healthcare analytics / insurance risk intelligence platform.

---

## Background

The original project was a basic Flask-based diabetes patient readmission and claim amount prediction app. It used simple forms, two model files, and basic result pages.

The goal now is to rebuild it into a resume-grade, production-style data science web application that demonstrates:

- Full-stack ML product development
- Healthcare analytics dashboarding
- Predictive modeling
- Batch inference
- Explainable AI
- PDF report generation
- Secure authentication
- Database-backed workflows
- Error handling and guardrails
- Scalable system design
- Deployment-ready architecture

The final project should be suitable for a data science / ML engineer / AI engineer resume.

---

## Core Product Vision

AdmitGuard Intelligence should help users analyze diabetes patient records, estimate readmission risk, forecast insurance claim burden, understand risk drivers, and generate professional reports.

The platform should support both individual patient analysis and cohort-level analytics.

It should be presented as:

> A healthcare risk intelligence platform that combines machine learning, analytics dashboards, explainability, batch scoring, secure access control, and automated reporting.

It should not be presented as:

> A simple Flask form that predicts readmission and claim amount.

---

## Target Users

The product should be designed around the following fictional user types:

### 1. Hospital Analyst

Uses the dashboard to monitor readmission risk, claim trends, and high-risk patient segments.

### 2. Care Management Team

Uses patient-level predictions and reports to identify cases that may require closer review.

### 3. Insurance / Claims Analyst

Uses claim amount forecasting and cohort reports to understand financial exposure.

### 4. Recruiter / Interviewer

Uses the live demo and `/how-it-works` page to understand the project architecture, ML pipeline, and engineering decisions.

---

## Important Disclaimer

This is an educational and portfolio ML project.

The app must not claim to be:

- A medical diagnosis system
- A clinical decision replacement
- A real hospital production system
- HIPAA compliant
- Certified healthcare software

Use wording such as:

> This system is intended for educational and analytical demonstration purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. Final decisions should involve qualified healthcare professionals.

For security wording, use:

> Inspired by healthcare security best practices.

Do not claim actual HIPAA compliance unless the whole deployment, vendor configuration, operations, policies, and data handling are genuinely compliant.

---

## Final Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Custom design system
- Recharts or Plotly for charts
- TanStack Table for advanced tables
- React Hook Form for forms
- Zod for frontend validation
- Lucide React for icons
- Framer Motion only for subtle transitions

### Frontend Design Rule

Do not create a generic shadcn/ui-looking dashboard.

shadcn/ui may be used sparingly only for low-level primitives if absolutely useful, but the visual identity must be custom.

Avoid:

- Generic AI SaaS templates
- Purple gradients
- Fake neural-network backgrounds
- Overused glassmorphism
- Excessive animations
- Random glowing UI
- Buzzword-heavy AI visuals
- Cluttered cards with no hierarchy

Use:

- Healthcare analytics design language
- Deep medical blue
- Slate / off-white backgrounds
- Teal accents
- Amber warnings
- Controlled red for high-risk states
- Clean enterprise dashboard layouts
- Dense but readable analytics panels
- Professional charts
- Subtle borders and shadows
- Clear typography

The UI should resemble:

- Healthcare analytics software
- Insurance risk dashboards
- Hospital operations dashboards
- Clinical intelligence platforms
- Enterprise BI products

### Backend

- FastAPI
- Pydantic
- SQLAlchemy
- Alembic
- PostgreSQL
- Redis optional for background jobs / queues
- Pandas
- NumPy
- scikit-learn
- XGBoost
- SHAP or permutation importance
- Joblib for model artifacts
- ReportLab or WeasyPrint for PDF generation
- Loguru / standard logging
- Pytest for testing

### Authentication

Use Google OAuth instead of custom email/password authentication.

Reason:

- More secure for a portfolio app
- Less risk of AI-agent mistakes in custom auth
- Cleaner login experience
- Reduced password handling burden

Recommended implementation:

- Use Google OAuth on the frontend
- Store user profile and app role in the database
- Google handles identity
- AdmitGuard handles authorization and permissions

Required app-level roles:

- Admin
- Analyst
- Viewer

Do not build full enterprise SSO or complex multi-tenant auth in v1.

### Database

Use PostgreSQL.

Recommended local database through Docker Compose:

- PostgreSQL container
- Redis container, optional for queues/background tasks

### Deployment

Recommended production-style deployment:

- Frontend: Vercel
- Backend: Render / Railway / Fly.io
- Database: Supabase PostgreSQL / Neon / Render PostgreSQL
- File storage: Supabase Storage / S3-compatible storage
- CI/CD: GitHub Actions optional

---

## Project Folder Structure

Target structure:

```text
project/
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
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── styles/
│   └── public/
│
├── backend/
│   ├── app/
│   ├── tests/
│   ├── migrations/
│   └── requirements.txt
│
├── ml/
│   ├── notebooks/
│   ├── src/
│   ├── models/
│   ├── metrics/
│   ├── reports/
│   ├── model_card.md
│   └── training_pipeline.md
│
├── data/
│   ├── sample/
│   └── README.md
│
└── docs/
    ├── architecture/
    ├── api_design.md
    ├── security_design.md
    ├── report_template_preview.md
    └── screenshots/
```

---

## Required Pages

### Public Pages

#### `/`

Landing page.

Must include:

- Product hero section
- Clear project value proposition
- Dashboard preview
- Feature overview
- Security/responsible AI note
- GitHub link
- Demo login CTA

#### `/how-it-works`

Recruiter-facing walkthrough page.

This page is very important. It should explain the complete system clearly so the project can be presented in interviews without opening the source code.

Sections:

1. Problem Statement
2. Data Pipeline
3. Feature Engineering
4. Model Training
5. Prediction Workflow
6. Explainability Layer
7. Dashboard Analytics
8. Batch Scoring
9. PDF Report Generation
10. Security Architecture
11. Deployment Architecture
12. Limitations and Responsible AI

Include clean process diagrams such as:

```text
Patient Data
   ↓
Validation & Cleaning
   ↓
Preprocessing Pipeline
   ↓
Readmission Model + Claim Model
   ↓
Risk Score + Claim Estimate
   ↓
Explainability + Dashboard + PDF Report
```

#### `/about`

Project background, dataset information, limitations, responsible AI disclaimer.

#### `/login`

Google OAuth login page.

### Protected Pages

- `/dashboard` — main analytics dashboard
- `/predict` — single patient prediction workflow
- `/batch` — CSV upload and batch scoring
- `/reports` — generated report history, preview, and download
- `/model-performance` — model evaluation dashboard
- `/explainability` — global and local feature importance
- `/monitoring` — data quality and drift monitoring
- `/admin` — admin-only page with audit logs, system health, users, batch history, and errors

---

## Dashboard Requirements

The dashboard must feel like a real healthcare analytics console.

### KPI Cards

Include:

- Total patients analyzed
- 30-day readmission rate
- High-risk patients
- Average predicted claim
- Total predicted claim exposure
- Median hospital stay
- Average number of medications
- Model version
- Last batch uploaded
- Reports generated

### Visualizations

Include high-quality charts such as:

1. Readmission risk distribution
2. Risk band segmentation: Low / Medium / High
3. Claim amount distribution
4. Age group vs readmission rate
5. Hospital stay duration vs readmission risk
6. Number of medications vs risk
7. Prior inpatient visits vs risk
8. Payer type vs claim amount
9. Diagnosis type vs readmission risk
10. Risk heatmap by age group and hospital stay
11. Top feature importance chart
12. Actual vs predicted claim scatter plot
13. Regression residual distribution
14. Model confidence distribution
15. Monthly / batch-level cohort trend

### Tables

Create a high-risk patient table with:

- Patient ID
- Age
- Gender
- Hospital stay
- Prior inpatient visits
- Readmission probability
- Risk band
- Predicted claim
- Confidence
- Data quality warnings
- Report action

Use sorting, filtering, pagination, and clear risk badges.

---

## Single Patient Prediction Requirements

Use a multi-step form instead of one huge form.

### Step 1: Demographics

- Age
- Gender
- BMI
- Weight

### Step 2: Hospital Encounter

- Time in hospital
- Number of lab procedures
- Number of procedures
- Number of medications
- Number of diagnoses

### Step 3: Utilization History

- Outpatient visits
- Emergency visits
- Inpatient visits

### Step 4: Diabetes Treatment / Claims Context

- Insulin status
- Diabetes medication status
- Diagnosis type
- Payer type

### Output

Return:

- Readmission probability
- Predicted class
- Risk band
- Estimated claim amount
- Claim prediction range
- Claim percentile compared to cohort
- Prediction confidence
- Top contributing factors
- Data quality warnings
- Similar patient cohort comparison
- PDF report generation button

Example result format:

```text
Readmission Risk: 68%
Risk Band: High
Prediction: Likely readmission within 30 days

Estimated Claim Amount: ₹82,400
Estimated Range: ₹76,000 – ₹89,000
Claim Percentile: 78th percentile
```

---

## Batch Prediction Requirements

The batch scoring page should support CSV upload.

Flow:

```text
Upload CSV
   ↓
Validate schema
   ↓
Detect invalid rows
   ↓
Clean and transform
   ↓
Run predictions
   ↓
Generate cohort analytics
   ↓
Download scored CSV / Generate PDF report
```

Required features:

- Drag-and-drop CSV upload
- Required schema validation
- File size limit
- Invalid row detection
- Missing column report
- Safe file naming
- Batch prediction
- Downloadable scored CSV
- Batch summary dashboard
- Top 10 highest-risk patients
- Total predicted claim exposure
- Batch PDF report

The backend must reject invalid files safely and return structured errors.

---

## PDF Report Generation

Create two report types.

### 1. Individual Patient Risk Report

Sections:

1. Cover / Report Metadata
2. Patient Summary
3. Readmission Risk Score
4. Insurance Claim Forecast
5. Risk Band Explanation
6. Top Contributing Factors
7. Similar Patient Cohort Comparison
8. Data Quality Warnings
9. Model Reliability / Confidence
10. Responsible AI Disclaimer

Include:

- Report ID
- Timestamp
- Model version
- Risk gauge
- Top drivers chart
- Claim estimate card
- Cohort percentile chart
- Footer disclaimer

### 2. Cohort Analytics Report

Sections:

1. Dataset Overview
2. Patient Risk Segmentation
3. Claim Burden Summary
4. High-Risk Segment Analysis
5. Feature Importance
6. Model Performance
7. Data Quality Issues
8. Operational Recommendations
9. Appendix

PDFs should look like professional healthcare analytics reports, not plain exported web pages.

---

## Machine Learning Requirements

### Model Tasks

1. Readmission risk classification
2. Insurance claim amount regression

### Recommended Models

For readmission classification:

- Logistic Regression baseline
- Random Forest
- XGBoost
- Optional Neural Network only if useful

For claim regression:

- Linear Regression baseline
- Random Forest Regressor
- XGBoost Regressor
- Optional Neural Network only if useful

Avoid TensorFlow in v1 unless the existing models are intentionally reused. The final deployment should prefer lighter scikit-learn / XGBoost joblib artifacts.

### ML Pipeline

Use proper pipelines:

```text
Raw Data
  ↓
Data Validation
  ↓
Cleaning
  ↓
Train-Test Split
  ↓
Preprocessing Pipeline
  ↓
Model Training
  ↓
Evaluation
  ↓
Model Selection
  ↓
Calibration / Threshold Tuning
  ↓
Explainability
  ↓
Model Export
  ↓
API Serving
```

### Artifacts to Save

```text
readmission_model.joblib
claim_model.joblib
preprocessor.joblib
feature_schema.json
training_ranges.json
model_metrics.json
feature_importance.json
model_card.md
```

### Classification Metrics

Include:

- Accuracy
- Precision
- Recall
- F1-score
- Macro-F1
- ROC-AUC
- PR-AUC
- Confusion matrix
- Calibration curve
- Threshold tuning chart

### Regression Metrics

Include:

- MAE
- RMSE
- R²
- MAPE
- Median absolute error
- Actual vs predicted plot
- Residual plot
- Error by age group
- Error by payer type

---

## Explainability Requirements

Add an explainability layer for both dashboard and patient prediction.

Preferred options:

- SHAP if deployment remains manageable
- Permutation importance as fallback
- Model coefficients for interpretable baseline
- Feature sensitivity / what-if simulation

Required features:

- Global feature importance chart
- Local prediction explanation
- Top risk driver cards
- Direction of contribution
- What-if sliders where practical
- Similar cohort comparison

Example explanation:

```text
Increasing prior inpatient visits from 1 to 4 raised readmission risk by 17.8 percentage points in the what-if simulation.
```

Do not present explanations as medical advice.

---

## Data Quality and Monitoring Requirements

Create a monitoring page with:

- Missing value percentage
- Invalid input count
- Duplicate row count
- Outlier count
- Schema validation status
- Feature range violations
- Prediction confidence distribution
- Out-of-distribution warnings
- Model version
- Last retraining date
- Batch upload quality summary

Example warning:

```text
BMI is outside the training data range. Prediction reliability may be reduced.
```

```text
Number of medications exceeds the 99th percentile of the training distribution. Review before interpreting the prediction.
```

---

## Security Requirements

The project should include serious security design, but should not overclaim regulatory compliance.

### Authentication

Use Google OAuth.

Store app-level user records in PostgreSQL.

Users table should include:

- id
- google_sub or provider_id
- name
- email
- avatar_url
- role
- created_at
- last_login_at
- is_active

### Authorization

Implement role-based access control.

Roles:

| Role | Access |
|---|---|
| Admin | Full access, admin dashboard, audit logs |
| Analyst | Dashboard, prediction, batch upload, reports |
| Viewer | Read-only access to reports and predictions |

Every protected backend endpoint must check:

1. User is authenticated
2. User role is allowed
3. User owns the resource or has admin permission

### Data Security

Include:

- User-owned patient records
- Resource ownership checks
- No direct object access without authorization
- Database indexes on user_id, patient_id, created_at, risk_band
- Safe environment variables
- No hardcoded secrets
- No secrets committed to GitHub
- No private patient data committed
- Local dummy credentials only in `.env.example`

### API Security

Include:

- HTTPS assumption in production
- Restricted CORS
- Rate limiting
- Request body size limits
- File upload size limits
- Structured JSON errors
- Centralized exception handling
- No raw stack traces in production
- API versioning with `/api/v1`

### File Upload Security

CSV upload must include:

- File type validation
- File size validation
- Schema validation
- Randomized server-side filenames
- No trusting original filenames
- No executable file uploads
- Storage outside public directories
- Invalid row report
- Safe deletion / cleanup of temporary files

### Audit Logging

Log major actions:

- Login
- Logout if possible
- Prediction created
- Batch uploaded
- Report generated
- Report downloaded
- Admin viewed logs
- Unauthorized access attempt
- Invalid file upload
- API error

Audit log fields:

- id
- user_id
- action
- resource_type
- resource_id
- ip_address
- user_agent
- created_at

---

## Error Handling Requirements

Use consistent structured API errors.

Example:

```json
{
  "success": false,
  "error_code": "INVALID_INPUT_SCHEMA",
  "message": "Uploaded CSV is missing required columns.",
  "details": {
    "missing_columns": ["age", "bmi", "num_medications"]
  }
}
```

### Required Error Categories

```text
VALIDATION_ERROR
AUTHENTICATION_ERROR
AUTHORIZATION_ERROR
FILE_UPLOAD_ERROR
MODEL_LOADING_ERROR
PREDICTION_ERROR
REPORT_GENERATION_ERROR
DATABASE_ERROR
RATE_LIMIT_ERROR
UNKNOWN_SERVER_ERROR
```

Frontend should show user-friendly messages.

Do not expose internal stack traces, local paths, database queries, or model internals to the user.

---

## Prediction Guardrails

Before prediction:

- Validate required fields
- Validate numeric ranges
- Reject impossible values
- Check known categories
- Handle unknown categories safely
- Check model availability
- Check preprocessing pipeline version
- Check input feature shape
- Detect out-of-training-range values
- Return confidence warnings
- Include model version and timestamp
- Include responsible AI disclaimer

The model should not return confident-looking outputs for clearly invalid inputs.

---

## Scalability Requirements

The first deployed version can be simple, but architecture should support scaling.

### Initial Demo Scale

```text
Next.js frontend
FastAPI backend
PostgreSQL database
Synchronous prediction
Synchronous PDF generation
```

### Scalable Design

```text
Next.js frontend
   ↓
FastAPI API layer
   ↓
Prediction service
   ↓
Background worker for batch jobs and reports
   ↓
PostgreSQL + object storage
```

Heavy tasks should later move to background jobs:

- Batch CSV scoring
- PDF report generation
- Chart export
- Model retraining
- Drift monitoring

Redis can be used later with Celery/RQ for queueing.

### Caching

Cache only safe aggregate data:

- Dashboard summaries
- Static model metrics
- Feature importance results
- Cohort-level analytics

Avoid caching sensitive patient-level data unless access control and expiry are implemented.

---

## Database Schema Requirements

Recommended tables:

### users

```text
id
google_sub
name
email
avatar_url
role
is_active
created_at
last_login_at
```

### patients

```text
id
user_id
external_patient_id
age
gender
weight
bmi
time_in_hospital
num_lab_procedures
num_procedures
num_medications
number_outpatient
number_emergency
number_inpatient
diagnosis
insulin
diabetes_med
payer_code
created_at
updated_at
```

### predictions

```text
id
patient_id
user_id
model_version
readmission_probability
readmission_class
risk_band
predicted_claim
claim_range_low
claim_range_high
confidence_score
input_hash
created_at
```

### prediction_explanations

```text
id
prediction_id
feature_name
feature_value
contribution
direction
created_at
```

### batch_jobs

```text
id
user_id
file_name
stored_file_path
total_rows
valid_rows
invalid_rows
status
error_message
created_at
completed_at
```

### reports

```text
id
user_id
prediction_id
batch_job_id
report_type
file_url
status
generated_at
```

### audit_logs

```text
id
user_id
action
resource_type
resource_id
ip_address
user_agent
created_at
```

---

## API Design Requirements

Use versioned routes:

```text
/api/v1
```

Suggested routes:

```text
GET    /api/v1/health
GET    /api/v1/me
GET    /api/v1/dashboard/summary
GET    /api/v1/dashboard/charts
POST   /api/v1/patients
GET    /api/v1/patients
GET    /api/v1/patients/{id}
POST   /api/v1/predictions/single
GET    /api/v1/predictions/{id}
POST   /api/v1/batch/upload
GET    /api/v1/batch/{id}
GET    /api/v1/batch/{id}/download
POST   /api/v1/reports/patient/{prediction_id}
POST   /api/v1/reports/cohort/{batch_id}
GET    /api/v1/reports
GET    /api/v1/reports/{id}/download
GET    /api/v1/model/performance
GET    /api/v1/model/feature-importance
GET    /api/v1/monitoring/data-quality
GET    /api/v1/admin/audit-logs
```

All protected routes must verify Google-authenticated identity and app-level role.

---

## UI Design System Requirements

Create custom reusable components.

Examples:

```text
RiskBadge
MetricCard
AnalyticsPanel
ChartContainer
ClinicalFormSection
PatientRiskSummary
ClaimEstimateCard
ReportPreviewCard
DataQualityAlert
ModelConfidenceIndicator
AuditLogTable
BatchUploadDropzone
```

### Risk Band Design

Low risk:

- calm green or teal
- not too bright

Medium risk:

- amber

High risk:

- controlled red

Do not use alarmist language.

Use:

```text
High Risk
Review Recommended
```

Avoid:

```text
Danger
Critical Patient
Emergency
```

---

## Recruiter-Facing `/how-it-works` Page

This page is a required part of the live app.

It should be visually polished and educational.

Goal:

Help a recruiter or interviewer understand the technical depth of the project in 2–3 minutes.

Required content:

1. Product overview
2. High-level architecture diagram
3. Data pipeline diagram
4. ML pipeline diagram
5. Prediction flow
6. Dashboard analytics explanation
7. Report generation flow
8. Security model
9. Deployment model
10. Future improvements

Tone:

- Professional
- Clear
- Technical enough for recruiters
- Not overly academic
- No fake AI hype

---

## README Requirements

The README should present the project as a complete ML engineering product.

Suggested sections:

```text
# AdmitGuard Intelligence

## Overview
## Live Demo
## Key Features
## Screenshots
## Tech Stack
## Architecture
## Dataset
## Machine Learning Pipeline
## Dashboard Analytics
## Explainability
## PDF Report Generation
## Security Measures
## API Design
## Local Setup
## Deployment
## Limitations
## Future Improvements
```

Suggested tagline:

> A secure full-stack healthcare analytics platform for diabetes patient readmission risk prediction, insurance claim forecasting, explainable ML, batch scoring, and automated PDF reporting.

---

## GitHub Repo Description

Use:

> Full-stack healthcare analytics platform for diabetes readmission risk prediction and claim forecasting with explainable ML, dashboards, batch scoring, Google OAuth, and PDF reports.

---

## Suggested GitHub Topics

```text
machine-learning
healthcare
data-science
fastapi
nextjs
tailwindcss
postgresql
readmission-prediction
claim-prediction
predictive-analytics
explainable-ai
mlops
dashboard
pdf-report
```

---

## Resume Positioning

After implementation, the project should support resume bullets such as:

- Designed and deployed a full-stack healthcare analytics platform for diabetes readmission risk prediction and insurance claim forecasting using Next.js, Tailwind CSS, FastAPI, PostgreSQL, and scikit-learn/XGBoost.

- Built interactive cohort dashboards with risk segmentation, claim distribution analysis, feature importance, model performance monitoring, and high-risk patient ranking.

- Integrated Google OAuth authentication with role-based access control, protected analytics routes, user-scoped patient records, and audit logging.

- Developed batch CSV scoring and automated PDF report generation for patient-level and cohort-level analytics.

- Added ML guardrails including out-of-distribution input warnings, data quality checks, prediction confidence bands, model versioning, and responsible AI disclaimers.

---

## Agent Development Rules

Agents working on this project must follow these rules:

1. Do not delete files without approval.
2. Do not overwrite existing architecture or context docs without approval.
3. Do not install unnecessary packages.
4. Do not add random UI libraries.
5. Do not use generic shadcn dashboard templates.
6. Do not create duplicate components when reusable components exist.
7. Do not hardcode secrets.
8. Do not commit `.env` files.
9. Do not commit generated PDFs with private data.
10. Do not commit raw private datasets.
11. Do not expose stack traces to users.
12. Do not claim HIPAA compliance.
13. Do not add treatment advice or medical diagnosis language.
14. Always use structured API errors.
15. Always validate inputs before prediction.
16. Always maintain user ownership checks for sensitive records.
17. Always keep code modular.
18. Always update README or docs when architecture changes.
19. Always prefer clear, maintainable code over clever code.
20. Always keep the UI professional and healthcare-relevant.

---

## Current Environment Assumptions

The local development environment was prepared with:

- Git
- Node.js LTS
- pnpm
- uv
- Python 3.12 through uv
- Local `.venv` in project root
- Docker Desktop
- PostgreSQL through Docker Compose
- Redis through Docker Compose
- Next.js frontend scaffold
- FastAPI backend dependencies in `backend/requirements.txt`

Do not waste agent steps reinstalling these unless they are missing or broken.

---

## Implementation Order

Recommended build order:

```text
1. Documentation files and architecture plan
2. Frontend custom design system
3. Landing page and /how-it-works page
4. Dashboard with mock/sample data
5. FastAPI backend foundation
6. Database schema and migrations
7. Google OAuth integration
8. Patient prediction workflow
9. ML training and model artifact pipeline
10. Prediction API integration
11. Batch CSV upload and scoring
12. PDF report generation
13. Model performance page
14. Explainability page
15. Monitoring and data quality page
16. Admin audit log page
17. Security hardening
18. Deployment configuration
19. README polish and screenshots
```

---

## Final Quality Bar

The final application should feel like:

> A serious healthcare analytics platform built by a data scientist who also understands software engineering.

It should demonstrate:

- Strong ML pipeline design
- Strong dashboarding
- Clean frontend engineering
- Secure backend design
- Database modeling
- Explainability
- Reporting
- Production-style deployment thinking
- Responsible AI awareness

The project must not look like a basic student ML form app.
