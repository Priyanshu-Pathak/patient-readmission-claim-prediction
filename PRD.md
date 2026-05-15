# Product Requirements Document (PRD)

# AdmitGuard Intelligence  
## Patient Readmission & Claim Risk Analytics Platform

**Document Type:** Product Requirements Document  
**Project Type:** Full-stack healthcare analytics and data science web application  
**Primary Goal:** Resume-grade, production-style machine learning platform  
**Frontend:** Next.js, React, Tailwind CSS, custom healthcare analytics UI  
**Backend:** FastAPI  
**Authentication:** Google OAuth with app-level RBAC  
**Database:** PostgreSQL  
**Reports:** PDF report generation  
**Deployment Target:** Vercel frontend + Render/Railway/Fly.io backend + managed PostgreSQL  
**Status:** Final planning document for implementation agents  

---

## 1. Product Summary

AdmitGuard Intelligence is a secure healthcare analytics web platform for diabetes patient readmission risk prediction, insurance claim amount forecasting, cohort-level analytics, explainable machine learning, batch scoring, and automated PDF report generation.

The application is intended to demonstrate a complete data science product rather than a simple prediction form. It should feel like a modern healthcare analytics or insurance risk intelligence platform that could be used by hospital operations teams, clinical analysts, insurance analysts, or care-management teams.

The system must combine:

- patient-level prediction
- cohort-level dashboard analytics
- batch CSV processing
- explainable AI outputs
- model performance visualization
- secure Google OAuth login
- app-level roles and permissions
- audit logging
- PDF reports
- professional healthcare UI/UX
- refined but restrained animations
- production-style architecture and deployment

The application is for educational and portfolio use only. It must not present itself as a real clinical decision system or medical product.

---

## 2. Product Vision

The product should answer this core question:

> Which patients are at higher risk of diabetes-related readmission, what claim burden may be expected, and what factors contributed to those predictions?

The project should demonstrate that the developer can build a full-stack ML system with:

- modern frontend engineering
- backend API design
- healthcare-style analytics
- data validation
- machine learning pipelines
- explainability
- database-backed workflows
- secure authentication
- report generation
- scalable design thinking

The final app should not look like a generic AI dashboard, shadcn clone, or decorative portfolio demo. It should look like a field-relevant healthcare analytics product.

---

## 3. Target Users

### 3.1 Healthcare Analyst

A healthcare analyst uses the platform to:

- inspect patient risk distribution
- upload patient batches
- identify high-risk cohorts
- generate reports
- analyze claim cost trends
- review model explanations

### 3.2 Hospital Operations User

A hospital operations user uses the platform to:

- understand high-risk patient segments
- monitor readmission patterns
- review predicted claim burden
- compare cohorts
- export summaries for internal review

### 3.3 Insurance / Claims Analyst

An insurance analyst uses the platform to:

- estimate claim amount trends
- identify high-cost segments
- analyze payer and utilization patterns
- review cost-driver explanations
- generate cohort reports

### 3.4 Recruiter / Interviewer

A recruiter or interviewer uses the platform to:

- understand the project workflow
- inspect dashboards
- view the system architecture
- test a demo account
- see model performance
- evaluate engineering maturity

The recruiter-facing experience is important. The app must include a clear `/how-it-works` page that explains the full system in a non-code, visually understandable way.

---

## 4. User Roles and Permissions

Authentication will be handled using Google OAuth. The application will manage roles internally.

### 4.1 Roles

| Role | Purpose |
|---|---|
| Admin | Full access to all dashboards, monitoring, audit logs, users, reports, and platform settings |
| Analyst | Can upload batches, run predictions, generate reports, and view analytics |
| Viewer | Can view dashboards, predictions, and generated reports but cannot upload or modify data |

### 4.2 Permission Matrix

| Feature | Admin | Analyst | Viewer |
|---|---:|---:|---:|
| Login with Google OAuth | Yes | Yes | Yes |
| View dashboard | Yes | Yes | Yes |
| Run single prediction | Yes | Yes | Optional |
| Upload batch CSV | Yes | Yes | No |
| Generate individual PDF report | Yes | Yes | No |
| Generate cohort PDF report | Yes | Yes | No |
| View reports | Yes | Yes | Yes |
| View model performance | Yes | Yes | Yes |
| View monitoring page | Yes | Yes | No |
| View audit logs | Yes | No | No |
| Manage user roles | Yes | No | No |
| Delete uploaded batches | Yes | No | No |

### 4.3 Demo Access

The live project should provide a low-friction recruiter demo flow.

Recommended approach:

- Use a “Continue with Google” login button.
- Assign first-time users the `Viewer` role by default.
- Provide a seeded demo workspace with sample analytics.
- Admin and Analyst roles should be configurable from the database or admin panel.
- Avoid requiring recruiters to register manually with a password.

---

## 5. Authentication and Authorization Requirements

### 5.1 Authentication

The system must use Google OAuth rather than custom password-based authentication.

Requirements:

- Users authenticate using Google OAuth.
- The app must store user metadata in the database after first login.
- Stored fields may include user ID, name, email, avatar URL, role, created timestamp, and last login timestamp.
- No raw passwords should exist in the system.
- No custom password reset flow is required.

### 5.2 Authorization

The app must implement internal role-based access control.

Requirements:

- Every protected backend endpoint must verify authenticated user identity.
- Every protected backend endpoint must verify role permissions.
- Patient records, batch jobs, predictions, and reports must be scoped to the user or workspace.
- Direct object access must be prevented.
- Admin-only APIs must not be accessible from non-admin users.
- Unauthorized access must return clean structured errors.

### 5.3 Session Handling

Requirements:

- Use secure session handling through the frontend auth framework.
- Sessions must expire according to reasonable defaults.
- Logout must clear session state.
- Protected frontend routes must redirect unauthenticated users to login.
- Protected backend endpoints must reject unauthenticated requests.

---

## 6. Core Product Modules

The product will include the following primary modules:

1. Public landing page
2. Google OAuth login
3. Executive analytics dashboard
4. Single patient prediction
5. Batch CSV scoring
6. Report generation
7. Model performance
8. Explainability
9. Data quality and monitoring
10. Admin and audit logs
11. How-it-works project walkthrough
12. About and limitations page

---

## 7. Public Pages

### 7.1 Landing Page `/`

The landing page must quickly communicate the project value.

Required sections:

- hero section
- short product description
- dashboard preview
- key capabilities
- system workflow preview
- security and responsible AI note
- call-to-action buttons
- GitHub link
- live demo entry

Hero messaging:

> Patient Risk Intelligence for Readmission and Claim Forecasting

Supporting text:

> AdmitGuard Intelligence predicts diabetes patient readmission risk, forecasts insurance claim burden, explains model decisions, and generates healthcare-style analytics reports.

Design requirements:

- professional healthcare analytics aesthetic
- no exaggerated AI visuals
- no fake neural network gimmicks
- no generic SaaS template feel
- subtle motion only

### 7.2 How It Works Page `/how-it-works`

This is a recruiter-facing walkthrough page.

Purpose:

- explain the project clearly during interviews
- show the complete ML and software workflow
- reduce the need to open code
- demonstrate architecture and system thinking

Required sections:

1. Problem Statement
2. Dataset and Inputs
3. Data Validation
4. Preprocessing Pipeline
5. Readmission Risk Model
6. Claim Forecasting Model
7. Prediction Guardrails
8. Explainability Layer
9. Dashboard Analytics
10. Batch CSV Scoring
11. PDF Report Generation
12. Security and Access Control
13. Deployment Architecture
14. Limitations and Responsible AI

Required visuals:

- end-to-end workflow diagram
- data pipeline diagram
- prediction pipeline diagram
- report generation flow
- deployment architecture diagram

Animation requirements:

- use subtle step-by-step reveal animations
- diagrams may animate sequentially
- avoid flashy or playful effects
- transitions must feel like enterprise software

### 7.3 About Page `/about`

Required content:

- project purpose
- dataset description
- model scope
- educational disclaimer
- security design summary
- limitations
- future improvements

The About page must clearly state that the system is not a clinical medical device and should not be used for real treatment decisions.

---

## 8. Protected Application Pages

### 8.1 Dashboard `/dashboard`

The dashboard is the core product experience.

Purpose:

- provide cohort-level analytics
- summarize readmission risk
- summarize predicted claim burden
- show trends and risk segments
- rank high-risk patients
- display model health indicators

#### 8.1.1 Dashboard KPIs

Required KPI cards:

- Total patients analyzed
- 30-day readmission rate
- High-risk patient count
- Average predicted claim
- Median predicted claim
- Total predicted claim exposure
- Average hospital stay
- Average number of medications
- Average prior inpatient visits
- Model version
- Latest batch uploaded
- Reports generated

#### 8.1.2 Dashboard Visualizations

Required charts:

1. Readmission risk band distribution
2. Claim amount distribution
3. Readmission risk by age group
4. Claim amount by payer type
5. Hospital stay vs readmission risk
6. Number of medications vs readmission risk
7. Prior inpatient visits vs readmission risk
8. Risk heatmap by age group and hospital stay
9. Top feature importance chart
10. Actual vs predicted claim scatter plot
11. Claim residual error distribution
12. Model confidence distribution
13. Monthly or batch-wise prediction trend
14. High-risk patient ranking table

#### 8.1.3 Dashboard Filters

Required filters:

- age group
- gender
- payer type
- diagnosis category
- risk band
- hospital stay range
- claim amount range
- batch upload date
- prediction confidence band

#### 8.1.4 Dashboard Tables

High-risk patient table columns:

- patient ID
- age
- gender
- hospital stay
- prior inpatient visits
- readmission probability
- risk band
- predicted claim
- confidence score
- report status
- actions

Actions:

- view details
- generate report
- download report
- inspect explanation

---

### 8.2 Single Patient Prediction `/predict`

Purpose:

Allow users to enter one patient encounter and receive readmission and claim predictions.

#### 8.2.1 Form Design

The form must be multi-step rather than a single overwhelming form.

Steps:

1. Demographics
2. Hospital Encounter
3. Utilization History
4. Medication and Diabetes Care
5. Review and Predict

#### 8.2.2 Required Input Fields

Representative fields:

- age
- gender
- weight or BMI
- time in hospital
- number of lab procedures
- number of procedures
- number of medications
- number of outpatient visits
- number of emergency visits
- number of inpatient visits
- number of diagnoses
- insulin status
- diabetes medication status
- payer type
- diagnosis category

Actual fields should align with the final cleaned dataset and feature schema.

#### 8.2.3 Validation Requirements

The frontend and backend must validate:

- required fields
- numeric ranges
- impossible values
- unknown categories
- negative values
- missing values
- out-of-training-range values

Invalid fields must be highlighted clearly.

#### 8.2.4 Prediction Result

The result must include:

- readmission probability
- predicted readmission class
- risk band
- predicted claim amount
- claim range lower bound
- claim range upper bound
- confidence score
- model version
- generated timestamp
- explanation summary
- data quality warnings
- report generation action

Example output:

- Readmission Risk: 68%
- Risk Band: High
- Predicted Claim: ₹82,400
- Estimated Range: ₹76,000 – ₹89,000
- Confidence: Medium
- Main Drivers: prior inpatient visits, hospital stay, medication count

#### 8.2.5 Prediction Animation

During prediction:

- show a professional progress state
- display steps such as validating input, applying preprocessing, running models, computing explanations
- no fake “AI magic” language
- no goofy animations
- no excessive loading time if the API is already complete

---

### 8.3 Batch CSV Scoring `/batch`

Purpose:

Allow users to upload a CSV file of patient records and receive scored predictions.

#### 8.3.1 Upload Requirements

Required features:

- drag-and-drop upload
- CSV file type validation
- file size limit
- schema validation
- missing column detection
- invalid row detection
- preview of uploaded rows
- clear error messages

#### 8.3.2 Batch Processing Flow

Flow:

1. Upload CSV
2. Validate schema
3. Identify invalid rows
4. Clean valid rows
5. Run predictions
6. Generate cohort analytics
7. Save batch job metadata
8. Allow scored CSV download
9. Allow cohort PDF generation

#### 8.3.3 Batch Result Metrics

Required batch summary:

- total rows
- valid rows
- invalid rows
- high-risk count
- medium-risk count
- low-risk count
- average predicted claim
- total predicted claim exposure
- average confidence score
- number of data quality warnings

#### 8.3.4 Batch Outputs

Required outputs:

- scored CSV download
- invalid row report
- cohort dashboard
- top 10 highest-risk patients
- top 10 highest predicted claims
- cohort PDF report

#### 8.3.5 Batch Animation

During batch processing:

- show progress by stage
- show validation progress
- show scoring progress
- show report generation progress
- use restrained motion and enterprise-style progress indicators

---

### 8.4 Reports `/reports`

Purpose:

Allow users to view, generate, preview, and download reports.

#### 8.4.1 Report Types

Required report types:

1. Individual Patient Risk Report
2. Cohort Analytics Report

#### 8.4.2 Individual Report Content

Required sections:

1. Cover page
2. Patient summary
3. Readmission risk prediction
4. Claim amount forecast
5. Risk band explanation
6. Top contributing factors
7. Similar cohort comparison
8. Data quality warnings
9. Prediction confidence
10. Model version and timestamp
11. Responsible AI disclaimer

#### 8.4.3 Cohort Report Content

Required sections:

1. Cover page
2. Dataset or batch overview
3. Readmission risk segmentation
4. Claim burden summary
5. High-risk segment analysis
6. Claim distribution analysis
7. Feature importance summary
8. Model performance summary
9. Data quality summary
10. Operational insights
11. Limitations and disclaimer

#### 8.4.4 PDF Design

The PDF must look professional and healthcare-relevant.

Design requirements:

- clean cover page
- report ID
- generated timestamp
- model version
- risk badge
- summary cards
- charts
- tables
- footer disclaimer
- consistent typography
- not overly colorful
- no decorative AI visuals

#### 8.4.5 Report Generation Flow

Report generation must:

- validate user access
- verify prediction or batch exists
- compute required charts
- generate PDF
- store report metadata
- return a download link
- log the action in audit logs

Errors must be handled gracefully.

---

### 8.5 Model Performance `/model-performance`

Purpose:

Show the quality and reliability of the readmission and claim models.

#### 8.5.1 Readmission Model Metrics

Required metrics:

- accuracy
- precision
- recall
- F1-score
- ROC-AUC
- PR-AUC
- sensitivity
- specificity
- confusion matrix values

Required visualizations:

- confusion matrix
- ROC curve
- precision-recall curve
- calibration curve
- threshold tuning chart
- class distribution chart

#### 8.5.2 Claim Model Metrics

Required metrics:

- MAE
- RMSE
- R²
- MAPE if appropriate
- median absolute error

Required visualizations:

- actual vs predicted scatter plot
- residual distribution
- residuals vs predicted values
- claim decile error chart
- error by age group
- error by payer type

#### 8.5.3 Model Metadata

Show:

- model version
- training date
- dataset size
- train/test split summary
- feature count
- selected model type
- preprocessing version

---

### 8.6 Explainability `/explainability`

Purpose:

Explain model decisions globally and locally.

#### 8.6.1 Global Explainability

Required elements:

- global feature importance chart
- readmission feature importance
- claim feature importance
- top drivers summary
- explanation of how to interpret importance

#### 8.6.2 Local Explainability

For a selected patient or prediction:

- top positive risk drivers
- top negative risk drivers
- feature values
- contribution direction
- contribution magnitude
- plain-language explanation

#### 8.6.3 What-if Analysis

Include optional what-if sliders or comparison controls for:

- time in hospital
- number of medications
- prior inpatient visits
- number of lab procedures
- number of diagnoses

What-if output must be described as simulated model sensitivity, not a medical recommendation.

---

### 8.7 Monitoring `/monitoring`

Purpose:

Show production-style data quality and model monitoring.

Required sections:

- input schema health
- missing value rates
- invalid input rates
- outlier counts
- feature range violations
- prediction confidence distribution
- risk band distribution over time
- drift warnings
- model version status
- API health
- report generation success/failure count

Required alerts:

- BMI outside training range
- unknown category detected
- medication count outside expected range
- batch file contains invalid rows
- prediction confidence reduced
- report generation failed

---

### 8.8 Admin `/admin`

Purpose:

Admin-only operational oversight.

Required sections:

- users
- roles
- audit logs
- batch jobs
- report history
- failed login or access attempts where available
- API error summaries
- model/service health

Admin features should be implemented only after core pages are stable.

---

## 9. Data Requirements

### 9.1 Dataset

The project may use the existing diabetes readmission and claim prediction dataset from the old app as a starting point. The final system should document the dataset clearly.

Expected input fields may include:

- age
- gender
- weight
- BMI
- admission type
- discharge disposition
- time in hospital
- payer code
- number of lab procedures
- number of procedures
- number of medications
- outpatient visits
- emergency visits
- inpatient visits
- diagnoses
- insulin
- diabetes medication
- readmitted label
- claim amount

The exact production feature schema must be defined in a `feature_schema.json` file after final preprocessing decisions.

### 9.2 Data Cleaning

Required cleaning steps:

- remove or fix invalid values
- handle missing values
- normalize categorical labels
- convert binary fields correctly
- remove duplicate records where appropriate
- validate target columns
- handle outliers carefully
- save cleaning summary

### 9.3 Data Versioning

The project should include:

- sample data for demo use
- no private or sensitive patient data
- clear dataset documentation
- processed data schema
- model training configuration
- model artifact version

### 9.4 Data Privacy

The app must not expose real private patient data.

Requirements:

- use synthetic, sample, or anonymized demo records
- do not commit private datasets
- do not commit generated reports with sensitive inputs
- do not store unnecessary patient identifiers
- use generic patient IDs in demo mode

---

## 10. Machine Learning Requirements

### 10.1 ML Tasks

The system includes two ML tasks:

1. Readmission risk classification
2. Claim amount regression

### 10.2 Model Candidates

Readmission classification candidates:

- logistic regression
- random forest
- XGBoost classifier
- LightGBM if added later
- neural network only if justified

Claim regression candidates:

- linear regression
- random forest regressor
- XGBoost regressor
- gradient boosting regressor
- neural network only if justified

### 10.3 Model Selection

The final model should be selected based on:

- validation performance
- interpretability
- inference speed
- deployment simplicity
- robustness
- consistency with project goals

Do not use TensorFlow unless there is a strong reason. The production app should prefer lighter scikit-learn/XGBoost joblib artifacts.

### 10.4 Preprocessing

Requirements:

- use scikit-learn pipelines
- use `ColumnTransformer`
- scale numeric columns when needed
- one-hot encode categorical columns
- handle unknown categories safely
- save preprocessing pipeline with model artifacts
- avoid `LabelEncoder` for nominal input features unless justified

### 10.5 Model Artifacts

Required artifacts:

- readmission model
- claim model
- preprocessing pipeline
- feature schema
- training ranges
- model metrics JSON
- feature importance JSON
- model card
- label mapping
- model version metadata

### 10.6 Prediction Guardrails

The model serving layer must:

- validate input schema
- reject impossible values
- warn for out-of-distribution values
- handle unknown categories
- return prediction confidence
- return model version
- return timestamp
- return responsible AI disclaimer
- avoid treatment advice

### 10.7 Explainability

Preferred options:

- SHAP if deployment remains stable
- permutation importance as fallback
- model-native feature importance where appropriate
- local explanation approximations if needed

Explainability should be presented in plain language.

---

## 11. API Requirements

### 11.1 API Style

Backend API should follow versioned routes:

```text
/api/v1/
```

### 11.2 Required API Groups

Required route groups:

- auth
- users
- patients
- predictions
- batch
- dashboard
- reports
- model-performance
- explainability
- monitoring
- admin
- health

### 11.3 Example Endpoints

```text
GET    /api/v1/health
GET    /api/v1/auth/me
GET    /api/v1/dashboard/summary
POST   /api/v1/predictions/single
GET    /api/v1/predictions/{id}
POST   /api/v1/batch/upload
GET    /api/v1/batch/{id}
GET    /api/v1/batch/{id}/download
POST   /api/v1/reports/patient/{prediction_id}
POST   /api/v1/reports/cohort/{batch_id}
GET    /api/v1/reports
GET    /api/v1/model-performance
GET    /api/v1/explainability/global
GET    /api/v1/monitoring/summary
GET    /api/v1/admin/audit-logs
```

### 11.4 API Response Standard

Successful response:

```json
{
  "success": true,
  "data": {},
  "message": "Request completed successfully"
}
```

Error response:

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

### 11.5 Error Categories

Required error categories:

- VALIDATION_ERROR
- AUTHENTICATION_ERROR
- AUTHORIZATION_ERROR
- RESOURCE_NOT_FOUND
- FILE_UPLOAD_ERROR
- MODEL_LOADING_ERROR
- PREDICTION_ERROR
- REPORT_GENERATION_ERROR
- DATABASE_ERROR
- RATE_LIMIT_ERROR
- UNKNOWN_SERVER_ERROR

---

## 12. Database Requirements

### 12.1 Database

Use PostgreSQL.

### 12.2 Core Tables

Required tables:

1. users
2. patients
3. predictions
4. prediction_explanations
5. batch_jobs
6. batch_rows
7. reports
8. audit_logs
9. model_versions

### 12.3 Users Table

Fields:

- id
- google_sub
- name
- email
- avatar_url
- role
- created_at
- updated_at
- last_login_at
- is_active

### 12.4 Patients Table

Fields:

- id
- user_id
- external_patient_id
- demographic fields
- clinical fields
- utilization fields
- medication fields
- created_at
- updated_at

### 12.5 Predictions Table

Fields:

- id
- patient_id
- user_id
- model_version
- readmission_probability
- readmission_class
- risk_band
- predicted_claim
- claim_range_low
- claim_range_high
- confidence_score
- input_hash
- warnings
- created_at

### 12.6 Batch Jobs Table

Fields:

- id
- user_id
- file_name
- file_hash
- total_rows
- valid_rows
- invalid_rows
- status
- summary_json
- created_at
- completed_at

### 12.7 Reports Table

Fields:

- id
- user_id
- prediction_id
- batch_job_id
- report_type
- file_url
- status
- generated_at
- model_version

### 12.8 Audit Logs Table

Fields:

- id
- user_id
- action
- resource_type
- resource_id
- ip_address
- user_agent
- metadata_json
- created_at

### 12.9 Indexing Requirements

Indexes should exist for:

- users.email
- users.google_sub
- patients.user_id
- predictions.user_id
- predictions.patient_id
- predictions.risk_band
- predictions.created_at
- batch_jobs.user_id
- reports.user_id
- audit_logs.user_id
- audit_logs.created_at

---

## 13. Security Requirements

### 13.1 Core Security

Required security measures:

- Google OAuth authentication
- app-level RBAC
- protected frontend routes
- protected backend routes
- user-scoped records
- audit logging
- restricted CORS
- secure environment variables
- no hardcoded secrets
- structured error handling
- no raw stack traces in production
- rate limiting
- input validation
- file upload validation
- database query parameterization through ORM
- safe generated filenames
- no sensitive reports committed to Git

### 13.2 File Upload Security

Batch CSV upload must:

- accept only CSV files
- enforce file size limits
- reject suspicious file extensions
- validate schema before processing
- never trust original filename
- store uploads outside public web directories
- log upload events
- generate invalid-row reports safely

### 13.3 CORS

Backend must allow only the configured frontend URL in production.

### 13.4 Secrets

The repository must include `.env.example` files but never real `.env` values.

Never commit:

- OAuth secrets
- database passwords
- JWT/session secrets
- production URLs with credentials
- private datasets
- generated patient reports

### 13.5 Audit Logging

Audit logs must record:

- login
- logout if available
- prediction generation
- batch upload
- report generation
- report download
- access denied events
- admin role changes
- failed file validation

---

## 14. Responsible AI and Healthcare Disclaimer Requirements

The system must include disclaimers in:

- landing page
- prediction output
- PDF reports
- about page
- how-it-works page

Required disclaimer language:

> This platform is a machine learning demonstration for educational and analytical use. It does not diagnose patients, recommend treatment, or replace professional medical judgment.

The system must not:

- provide treatment recommendations
- claim medical certification
- claim HIPAA compliance
- imply real clinical deployment
- present predictions as guaranteed outcomes

Allowed phrasing:

- healthcare security best-practice inspired
- decision-support analytics demo
- educational ML platform
- portfolio-grade healthcare analytics project

---

## 15. UI/UX Requirements

### 15.1 Design Philosophy

The UI must resemble:

- healthcare analytics software
- hospital operations dashboard
- insurance risk intelligence platform
- clinical data analysis system
- enterprise BI product

The UI must avoid:

- generic shadcn dashboard appearance
- excessive purple gradients
- fake AI brain graphics
- overused glassmorphism
- childish animations
- flashy cyberpunk styling
- decorative charts with no meaning
- AI-generated visual clutter

### 15.2 Visual Identity

Recommended style:

- deep medical blue
- muted slate
- off-white or very light clinical background
- teal accent
- amber warning
- controlled red for high risk
- clean typography
- strong whitespace
- thin borders
- subtle shadows
- readable dashboard density

### 15.3 Component Requirements

Custom components should include:

- healthcare dashboard cards
- metric cards
- risk badges
- confidence indicators
- patient tables
- upload panels
- report preview cards
- alert boxes
- analytics filters
- model metric cards
- process timeline blocks
- architecture diagram sections

### 15.4 Stitch MCP Usage

Stitch MCP is available in Antigravity and should be used for UI/UX exploration where helpful.

Rules:

- Use Stitch MCP to generate refined page layouts, dashboard concepts, and component inspiration.
- Do not blindly copy generic generated layouts.
- Adapt every UI output to the AdmitGuard healthcare analytics identity.
- Reject outputs that look like generic AI SaaS pages.
- Maintain design consistency across all pages.
- Keep accessibility, readability, and professional tone above visual flashiness.

---

## 16. Animation and Interaction Requirements

Animations must be refined, restrained, and relevant to a healthcare analytics platform.

### 16.1 Allowed Animation Areas

Use subtle animations for:

- page transitions
- dashboard card entrance
- chart loading
- prediction progress
- report generation progress
- CSV upload progress
- button hover states
- tab transitions
- step-by-step workflow diagrams
- risk score reveal
- toast notifications
- modal opening/closing

### 16.2 Animation Rules

Animations must:

- be subtle and professional
- support clarity
- be fast enough to not waste user time
- avoid bouncing, spinning, or playful movement
- avoid excessive delays
- not distract from data
- not make the app feel goofy
- respect enterprise product expectations

### 16.3 Loading States

Prediction loading stages:

1. Validating patient data
2. Applying preprocessing pipeline
3. Running readmission risk model
4. Running claim forecast model
5. Computing explanations
6. Preparing result summary

Report loading stages:

1. Collecting prediction data
2. Rendering charts
3. Building report template
4. Generating PDF
5. Saving report metadata
6. Preparing download link

Batch loading stages:

1. Uploading file
2. Validating schema
3. Checking invalid rows
4. Running predictions
5. Building analytics
6. Preparing outputs

---

## 17. Non-Functional Requirements

### 17.1 Performance

Targets:

- dashboard initial load should feel responsive
- single prediction response should complete quickly
- batch jobs may run asynchronously if large
- PDF generation should show clear progress
- heavy charts should not block the UI

### 17.2 Scalability

Design should support:

- background jobs for batch scoring
- background jobs for PDF generation
- Redis queue if needed
- database indexing
- object storage for reports
- stateless backend API where possible
- future model versioning

### 17.3 Reliability

The app must:

- handle API failures gracefully
- handle model loading failures
- handle database connection errors
- prevent partial report states from appearing as complete
- show meaningful user-facing error messages
- log backend errors

### 17.4 Accessibility

UI should include:

- readable contrast
- keyboard-friendly forms
- labels for form fields
- semantic HTML where possible
- non-color-only risk indicators
- clear error messages

### 17.5 Browser Support

Target:

- latest Chrome
- latest Edge
- latest Firefox
- responsive desktop-first layout
- tablet support desirable
- mobile support for public pages and basic dashboards

---

## 18. Deployment Requirements

### 18.1 Frontend

Target deployment:

- Vercel

Requirements:

- production environment variables
- configured API base URL
- build passes without TypeScript errors
- no unused placeholder pages
- no broken links

### 18.2 Backend

Target deployment:

- Render, Railway, or Fly.io

Requirements:

- production FastAPI server
- environment variables
- CORS configured
- database URL configured
- migrations documented
- model artifacts available
- report generation path configured

### 18.3 Database

Target:

- managed PostgreSQL such as Supabase, Neon, Render PostgreSQL, or Railway PostgreSQL

Requirements:

- migrations
- seeded demo data
- secure connection string
- backups if platform supports them

### 18.4 Storage

Generated PDF reports and uploaded files should be stored safely.

For demo v1:

- local storage may be acceptable in development
- production should prefer object storage if implemented

### 18.5 CI/CD

Recommended:

- GitHub Actions for linting
- frontend build check
- backend test check
- no secret leakage

---

## 19. Documentation Requirements

The repository must include:

1. README.md
2. PROJECT_CONTEXT.md
3. PRD.md
4. PLAN.md
5. AGENT_RULES.md
6. ARCHITECTURE.md
7. SECURITY_REQUIREMENTS.md
8. .env.example files
9. model card
10. API documentation
11. deployment instructions
12. screenshots or demo preview images

### 19.1 README Sections

Required README sections:

- project overview
- live demo
- key features
- architecture
- tech stack
- dashboard screenshots
- ML pipeline
- security design
- report generation
- local setup
- deployment
- limitations
- future scope

---

## 20. Agent Implementation Rules

Agents must follow these rules during implementation.

### 20.1 Completion Rule

If an agent starts a task, it must finish the task to a working state.

Agents must not leave:

- unfinished code
- TODO comments
- placeholder functions
- empty components
- fake endpoints
- broken navigation
- mock-only features presented as complete
- unimplemented buttons
- dangling imports
- unused files
- commented-out broken code

If something cannot be completed, the agent must stop and clearly explain the blocker before moving on.

### 20.2 No Placeholder Policy

Do not use:

- “coming soon”
- “TODO”
- “implement later”
- “placeholder”
- “dummy function”
- empty report generator
- fake auth checks
- fake protected routes
- fake database writes

Temporary sample data is allowed only when clearly isolated for frontend preview and later replaced with backend integration during the relevant phase.

### 20.3 File Safety

Agents must not:

- delete files without approval
- overwrite context documents without approval
- remove security features
- commit secrets
- modify global system settings
- install unnecessary packages
- add large dependencies without justification
- push directly to main without user approval

### 20.4 Verification Rule

After each major task, agents must verify:

- app builds
- no TypeScript errors
- backend imports work
- routes are reachable
- no broken links
- no obvious console errors
- no incomplete components
- no missing env documentation

---

## 21. Definition of Done

A feature is done only when:

- frontend UI is complete
- backend API is complete if required
- database integration is complete if required
- validation is implemented
- loading state is implemented
- error state is implemented
- access control is implemented if protected
- audit logging is added for sensitive actions
- documentation is updated
- no TODOs or placeholders remain
- feature works locally

---

## 22. Development Phases

### Phase 1: Foundation

- finalize docs
- inspect folder structure
- set up monorepo conventions
- confirm frontend and backend run locally
- confirm Docker PostgreSQL and Redis

### Phase 2: Frontend Design System

- custom healthcare analytics layout
- navigation
- risk cards
- metric cards
- tables
- chart containers
- loading states
- error states

### Phase 3: Authentication

- Google OAuth login
- session handling
- user table
- role assignment
- protected routes
- logout
- app-level RBAC

### Phase 4: Backend Core

- FastAPI app structure
- database setup
- SQLAlchemy models
- migrations
- API response format
- centralized error handling
- audit logging

### Phase 5: ML Pipeline

- data cleaning
- preprocessing pipeline
- model training
- model comparison
- metrics export
- model artifacts
- feature importance
- training range export

### Phase 6: Prediction Workflows

- single prediction API
- single prediction frontend
- guardrails
- explanation output
- prediction storage

### Phase 7: Dashboard Analytics

- dashboard API
- KPI cards
- charts
- filters
- patient table
- dashboard loading/error states

### Phase 8: Batch Scoring

- CSV upload
- schema validation
- invalid row handling
- batch prediction
- scored CSV download
- cohort analytics

### Phase 9: PDF Reports

- individual report
- cohort report
- chart rendering
- report metadata
- report download
- report error handling

### Phase 10: Monitoring and Admin

- monitoring dashboard
- audit log view
- user role management
- service health

### Phase 11: Deployment

- production env setup
- frontend deployment
- backend deployment
- database migration
- final README screenshots
- demo testing

---

## 23. Success Criteria

The project is successful when:

- the live app looks like a professional healthcare analytics platform
- recruiters can understand the project through the live UI
- Google OAuth login works
- dashboard shows meaningful analytics
- single prediction works end-to-end
- batch CSV scoring works end-to-end
- PDF reports generate successfully
- model performance page shows real metrics
- explainability page shows useful drivers
- security design is documented and implemented
- no major features are mock-only
- repository is clean and understandable
- README communicates strong data science and engineering value

---

## 24. Resume Positioning

Final resume bullets should truthfully reflect implemented features.

Suggested wording after completion:

- Built a full-stack healthcare analytics platform for diabetes readmission risk prediction and insurance claim forecasting using Next.js, Tailwind CSS, FastAPI, PostgreSQL, and scikit-learn/XGBoost.
- Integrated Google OAuth authentication with role-based access control, protected analytics routes, user-scoped records, and audit logging.
- Developed interactive cohort dashboards for readmission risk segmentation, claim burden analysis, model performance tracking, feature importance, and high-risk patient ranking.
- Implemented batch CSV scoring with schema validation, invalid-row reporting, downloadable scored outputs, and automated cohort-level PDF report generation.
- Added ML guardrails including input validation, out-of-distribution warnings, model versioning, prediction confidence bands, explainability outputs, and responsible AI disclaimers.

---

## 25. Out of Scope for Initial Version

The following are not required for v1:

- real hospital integration
- real EHR connection
- HIPAA certification
- payment system
- real insurance claim adjudication
- treatment recommendation
- doctor-facing clinical workflow
- enterprise SSO
- multi-hospital tenancy
- mobile app
- real-time streaming
- live model retraining in production

These may be listed as future improvements if appropriate.

---

## 26. Final Product Statement

AdmitGuard Intelligence should be presented as:

> A secure, full-stack healthcare analytics platform that combines machine learning, patient-level risk prediction, claim forecasting, explainable AI, cohort dashboards, batch scoring, and automated PDF reports for diabetes readmission and insurance claim analysis.

The project must demonstrate product thinking, data science depth, security awareness, and full-stack execution.
