# Agent Rules

# AdmitGuard Intelligence  
## AI Development Agent Rules and Operating Instructions

**Document Type:** Agent Rules / AI Coding Instructions  
**Project:** AdmitGuard Intelligence  
**Purpose:** Control how Antigravity agents and other AI coding agents modify this repository  
**Priority:** Must be read before any implementation work  
**Applies To:** Antigravity agents, Stitch MCP-assisted UI generation, code agents, refactoring agents, documentation agents  

---

## 1. Read Order

Before making any code changes, every agent must read these files in order:

1. [START_HERE.md](START_HERE.md)
2. [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)
3. [PRD.md](PRD.md)
4. [ARCHITECTURE.md](ARCHITECTURE.md)
5. [SECURITY_REQUIREMENTS.md](SECURITY_REQUIREMENTS.md)
6. [PLAN.md](PLAN.md)
7. [AGENT_RULES.md](AGENT_RULES.md)

If any of these files are missing, the agent must report which files are missing before continuing.

Do not begin implementation until the project goal, architecture, security requirements, and current phase are understood.

---

## 2. Project Identity

This project is:

> AdmitGuard Intelligence — a secure, full-stack healthcare analytics platform for diabetes patient readmission risk prediction, insurance claim forecasting, explainable ML, batch scoring, dashboard analytics, Google OAuth authentication, RBAC, audit logging, and automated PDF report generation.

This project is not:

- a basic Flask form app
- a generic AI dashboard
- a shadcn clone
- a decorative portfolio landing page
- a fake clinical system
- a real medical device
- a HIPAA-certified product

The final result must look and behave like a modern healthcare analytics / insurance risk intelligence platform.

---

## 3. Primary Agent Objective

The agent's goal is to build a working, polished, production-style portfolio project.

Every implementation decision must support:

- data science depth
- full-stack engineering quality
- security awareness
- healthcare-domain relevance
- recruiter-friendly demonstration
- clean code organization
- reliable local and deployed execution

---

## 4. Non-Negotiable Rule: No Incomplete Work

If an agent starts a task, it must complete that task to a working state.

Agents must not leave:

- `TODO`
- `FIXME`
- `placeholder`
- `coming soon`
- empty functions
- empty components
- fake endpoints
- fake auth checks
- fake report generation
- fake database writes
- fake prediction logic presented as real
- broken buttons
- dangling imports
- commented-out broken code
- unused routes
- dead files
- unfinished pages
- temporary hacks without documentation
- console errors caused by incomplete code

If completion is blocked, the agent must stop and clearly report:

1. what was attempted
2. what is blocking completion
3. which files were changed
4. how to fix or continue safely

Do not silently move on to another task while leaving the previous task incomplete.

---

## 5. Placeholder Policy

### 5.1 Not Allowed

Do not use placeholder code for core functionality.

Not allowed:

```text
TODO: implement later
Coming soon
This is a placeholder
Mock API for now
Fake auth check
Dummy report generator
Temporary prediction response
Return random score
Button does nothing
```

### 5.2 Allowed Temporary Sample Data

Temporary sample data is allowed only for isolated frontend preview before backend integration, and only if:

- it is clearly named as demo/sample data
- it is stored in a dedicated sample file
- it does not pretend to be live backend data
- it is replaced or connected during the planned backend integration phase
- it does not block the user from understanding what is real

Use names like:

```text
sampleDashboardData.ts
demoPatientRows.ts
```

Do not mix sample data with production services.

---

## 6. File Safety Rules

Agents must not:

- delete files without explicit user approval
- overwrite documentation files without explicit user approval
- remove environment files or `.env.example`
- modify `.gitignore` to allow secrets
- remove security controls
- remove validation
- remove audit logging
- remove role checks
- remove error handling
- rewrite the whole project without approval
- move large folder structures without explaining why
- modify global system settings
- run destructive shell commands

### 6.1 Forbidden Commands Without Approval

Do not run these without explicit user approval:

```bash
rm -rf
del /s
rmdir /s
git reset --hard
git clean -fd
git push --force
docker system prune -a
drop database
truncate table
```

### 6.2 Safe Change Behavior

Before large changes:

1. inspect current files
2. explain the planned change
3. modify only necessary files
4. preserve existing working code
5. verify after changes

---

## 7. Git and Commit Rules

Agents must not push directly to `main` unless the user explicitly asks.

Recommended workflow:

```text
inspect → plan → modify → test → summarize → wait for user approval → commit/push
```

Commit messages should be specific.

Good:

```text
feat: add protected dashboard layout
feat: implement batch CSV validation
fix: handle report generation errors
docs: add security requirements document
```

Bad:

```text
update files
changes
final
fix stuff
```

Do not commit:

- `.env`
- OAuth secrets
- database credentials
- private datasets
- generated PDFs
- uploaded patient CSV files
- model artifacts if too large or private
- node_modules
- `.venv`

---

## 8. Package Installation Rules

Agents must not install packages randomly.

Before adding a dependency, the agent must check:

1. Is this already installed?
2. Is it necessary?
3. Is there a lighter alternative?
4. Does it increase deployment complexity?
5. Does it conflict with the planned stack?

Preferred existing stack:

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts or Plotly
- React Hook Form
- Zod
- TanStack Table
- Lucide React
- Framer Motion for restrained animations only
- PapaParse for CSV handling
- FileSaver for downloads

### Backend

- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy
- Alembic
- psycopg
- Pandas
- NumPy
- scikit-learn
- XGBoost
- joblib
- SHAP if stable
- Matplotlib / Plotly / Kaleido
- ReportLab or WeasyPrint
- python-dotenv
- slowapi
- loguru
- pytest
- ruff
- black

Avoid adding:

- heavy UI kits unless necessary
- unnecessary state libraries
- unnecessary auth providers beyond Google OAuth setup
- TensorFlow unless explicitly justified
- random charting libraries when one is already chosen
- duplicate form libraries
- duplicate validation libraries

---

## 9. UI/UX Rules

The UI must look like a professional healthcare analytics platform.

### 9.1 Required Design Direction

The design should feel like:

- hospital operations dashboard
- clinical analytics product
- insurance claim intelligence platform
- healthcare BI system
- enterprise data product

### 9.2 Avoid

Do not create:

- generic shadcn dashboards
- random purple gradient SaaS pages
- fake neural network backgrounds
- AI brain graphics
- cartoon medical graphics
- goofy animations
- cyberpunk dashboards
- excessive glassmorphism
- overly playful cards
- cluttered hero sections
- decorative charts with no purpose

### 9.3 Visual Style

Use:

- deep medical blue
- slate neutrals
- teal accents
- controlled amber warnings
- controlled red for high risk
- clinical green for low risk
- off-white or pale slate backgrounds
- strong contrast
- readable typography
- thin borders
- subtle shadows
- consistent spacing

### 9.4 Custom Components

Build a custom visual system instead of relying on a generic UI kit.

Required reusable UI components:

- `MetricCard`
- `RiskBadge`
- `ConfidenceIndicator`
- `StatusPill`
- `DashboardPanel`
- `ChartCard`
- `DataTable`
- `UploadPanel`
- `ReportCard`
- `ReportGenerationProgress`
- `LoadingTimeline`
- `ErrorPanel`
- `EmptyState`
- `WorkflowStep`
- `ArchitectureDiagramBlock`

---

## 10. Stitch MCP Rules

Stitch MCP is available and may be used for UI/UX generation.

Rules:

1. Use Stitch MCP for layout inspiration, not blind copying.
2. Reject outputs that look generic or AI-generated.
3. Adapt every design to the AdmitGuard healthcare analytics identity.
4. Maintain consistent typography, spacing, colors, and component behavior.
5. Do not introduce unrelated visual systems.
6. Do not let Stitch-generated visuals override the PRD or architecture.
7. Do not create flashy, childish, or decorative pages.
8. Use Stitch mainly for:
   - landing page structure
   - dashboard layout inspiration
   - form layout refinement
   - report preview design
   - workflow diagram layout
   - professional empty/error states

After using Stitch MCP, the agent must review and refine the output before implementing.

---

## 11. Animation Rules

Animations must be subtle, professional, and domain-appropriate.

### 11.1 Allowed Animation Areas

Animations may be used for:

- page transitions
- dashboard card entrance
- chart loading
- prediction progress
- report generation progress
- CSV upload progress
- workflow diagram steps
- button hover states
- modal transitions
- toast notifications
- risk score reveal

### 11.2 Not Allowed

Avoid:

- bouncing
- excessive spinning
- goofy transitions
- long fake loading delays
- confetti
- cartoon-like motion
- flashy neon motion
- animated fake AI brains
- distracting chart movement

### 11.3 Loading Stage Requirements

Prediction loading should show stages such as:

```text
Validating patient data
Applying preprocessing pipeline
Running readmission risk model
Running claim forecast model
Computing explanation
Preparing result summary
```

Report generation loading should show stages such as:

```text
Collecting prediction data
Rendering charts
Building report template
Generating PDF
Saving report metadata
Preparing download link
```

Batch loading should show stages such as:

```text
Uploading file
Validating schema
Checking invalid rows
Running predictions
Building analytics
Preparing outputs
```

Do not add fake long delays. Progress indicators should reflect actual process where practical.

---

## 12. Authentication Rules

The project uses Google OAuth, not custom password authentication.

### 12.1 Required Auth Behavior

Implement:

- Google OAuth login
- session handling
- logout
- protected frontend routes
- backend auth verification
- internal user records
- app-level roles
- RBAC permissions
- audit logging for sensitive actions

### 12.2 App Roles

Required roles:

```text
Admin
Analyst
Viewer
```

Default new user role:

```text
Viewer
```

### 12.3 Forbidden Auth Behavior

Do not implement:

- raw password storage
- custom password login unless explicitly requested
- fake auth checks
- frontend-only security
- public access to protected APIs
- admin access by URL only
- hardcoded production users
- committed OAuth secrets

### 12.4 Protected Routes

Protect:

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

Public pages:

```text
/
/about
/how-it-works
/login
```

---

## 13. Authorization and Data Ownership Rules

Every protected backend request must verify:

1. user is authenticated
2. user role has permission
3. requested resource belongs to that user or their permitted workspace
4. admin-only operations are admin-only

Do not rely only on frontend hiding.

Backend must enforce access control.

Examples:

- A Viewer must not upload batches.
- A Viewer must not generate reports if not allowed.
- An Analyst must not access Admin audit logs.
- A user must not access another user's report by changing the URL.
- Admin role changes must be audit logged.

---

## 14. Security Rules

Security is a core part of the project.

### 14.1 Required Controls

Implement or document:

- Google OAuth authentication
- RBAC
- protected routes
- backend authorization checks
- CORS restrictions
- input validation
- file upload validation
- structured error handling
- no raw stack traces in production
- audit logging
- rate limiting where appropriate
- safe filenames
- environment variables
- no hardcoded secrets
- database indexing
- ORM/parameterized queries
- user-scoped data access

### 14.2 Forbidden

Do not:

- commit `.env`
- expose OAuth secrets
- expose database credentials
- log OAuth tokens
- log secrets
- log full patient records unnecessarily
- store sensitive reports in public folders
- use wildcard CORS in production
- disable validation to make code pass
- bypass RBAC for convenience
- expose raw backend error traces to users

### 14.3 Healthcare Safety

Do not claim:

- HIPAA compliance
- medical certification
- clinical deployment readiness
- doctor-level recommendation ability
- treatment recommendation

Allowed phrasing:

- healthcare security best-practice inspired
- educational ML platform
- decision-support analytics demo
- portfolio-grade healthcare analytics project

---

## 15. Database Rules

Use PostgreSQL with SQLAlchemy and Alembic.

### 15.1 Required Tables

Core tables:

- `users`
- `patients`
- `predictions`
- `prediction_explanations`
- `batch_jobs`
- `batch_rows`
- `reports`
- `audit_logs`
- `model_versions`

### 15.2 Migration Rules

- use Alembic for schema changes
- do not manually edit production schema
- create migrations for model changes
- keep seed data separate from migrations
- do not drop tables without approval

### 15.3 Data Privacy Rules

Do not commit:

- private patient data
- real identifying records
- generated reports
- uploaded user CSVs
- database dumps with user data

Use anonymized or sample data only.

---

## 16. API Rules

All backend APIs must be versioned under:

```text
/api/v1/
```

### 16.1 Standard Response Format

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

### 16.2 Required Error Codes

Use consistent error codes:

- `VALIDATION_ERROR`
- `AUTHENTICATION_ERROR`
- `AUTHORIZATION_ERROR`
- `RESOURCE_NOT_FOUND`
- `FILE_UPLOAD_ERROR`
- `MODEL_LOADING_ERROR`
- `PREDICTION_ERROR`
- `REPORT_GENERATION_ERROR`
- `DATABASE_ERROR`
- `RATE_LIMIT_ERROR`
- `UNKNOWN_SERVER_ERROR`

### 16.3 API Quality Rules

Every API route must have:

- clear input schema
- clear response schema where practical
- validation
- auth check if protected
- role check if needed
- resource ownership check if needed
- structured error handling
- audit logging for sensitive actions

---

## 17. ML Rules

The ML system must be real and explainable.

### 17.1 Required ML Tasks

Implement:

1. readmission risk classification
2. claim amount regression

### 17.2 Preferred Model Stack

Prefer:

- scikit-learn pipelines
- XGBoost models
- joblib artifacts
- JSON metrics
- feature schema files

Avoid TensorFlow unless explicitly justified.

### 17.3 Required ML Artifacts

Create and maintain:

- readmission model artifact
- claim model artifact
- preprocessing pipeline
- feature schema
- training ranges
- model metrics JSON
- feature importance JSON
- model version metadata
- model card

### 17.4 Preprocessing Rules

Use:

- `ColumnTransformer`
- proper numeric preprocessing
- proper categorical preprocessing
- `OneHotEncoder(handle_unknown="ignore")`
- imputation where needed
- saved preprocessing pipeline

Avoid:

- using `LabelEncoder` for nominal input features unless justified
- hardcoded feature order without schema
- silently dropping columns
- training-serving skew
- different preprocessing in training and API

### 17.5 Prediction Guardrails

Every prediction must include:

- input validation
- impossible value rejection
- out-of-training-range warnings
- unknown category handling
- readmission probability
- risk band
- claim prediction
- claim range
- confidence score
- model version
- timestamp
- top drivers if available
- responsible AI disclaimer

### 17.6 No Fake ML

Do not:

- return random predictions
- hardcode scores
- fake metrics
- fake feature importance
- pretend sample data is model output
- present untrained models as complete

If model artifacts are not ready, state that the ML pipeline must be completed first.

---

## 18. Dashboard Rules

The dashboard must be analytics-heavy and meaningful.

Required dashboard elements:

- KPI cards
- risk distribution
- claim distribution
- risk by age group
- claim by payer type
- hospital stay vs risk
- medications vs risk
- prior inpatient visits vs risk
- risk heatmap
- feature importance
- model confidence distribution
- actual vs predicted claim
- residual error distribution
- high-risk patient table

Charts must be readable, labeled, and useful.

Do not add decorative charts with no analytical purpose.

---

## 19. Batch Upload Rules

Batch upload must include:

- CSV-only validation
- file size limit
- schema validation
- missing column reporting
- invalid row reporting
- row-level errors
- batch status
- scored CSV output
- batch summary analytics
- top high-risk patients
- top high-claim patients
- audit logging

Invalid rows must not crash the whole batch.

---

## 20. Report Generation Rules

Report generation must be functional, not fake.

Required reports:

1. Individual Patient Risk Report
2. Cohort Analytics Report

### 20.1 Individual Report Must Include

- report ID
- generated timestamp
- patient summary
- readmission risk
- claim estimate
- claim range
- risk band
- top contributing factors
- data quality warnings
- model version
- responsible AI disclaimer

### 20.2 Cohort Report Must Include

- report ID
- batch/dataset summary
- risk segmentation
- claim burden summary
- high-risk segment analysis
- feature importance
- data quality summary
- model performance summary
- charts
- disclaimer

### 20.3 Report Safety

Do not:

- save reports in public folders without access control
- expose reports across users
- generate reports without verifying ownership
- commit generated reports to Git
- leave report buttons non-functional

---

## 21. Error Handling Rules

Every major feature must have:

- loading state
- success state
- empty state
- error state

User-facing errors must be clear and safe.

Bad:

```text
psycopg.errors.UndefinedTable traceback...
```

Good:

```text
The prediction service is temporarily unavailable. Please try again later.
```

Technical details may be logged server-side, but not exposed in the UI.

---

## 22. Documentation Rules

Documentation must be kept current.

When agents add or change major features, update relevant docs:

- README.md
- PLAN.md
- ARCHITECTURE.md if architecture changes
- SECURITY_REQUIREMENTS.md if security changes
- PRD.md only with approval if requirements change
- PROJECT_CONTEXT.md only with approval if project direction changes

Do not overwrite large documentation files without approval.

---

## 23. Environment Rules

Use environment variables for config.

Never hardcode production values.

### 23.1 Frontend Env

Use:

```text
NEXT_PUBLIC_API_BASE_URL
NEXTAUTH_URL or equivalent
AUTH_SECRET / NEXTAUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

Only expose variables with `NEXT_PUBLIC_` when they are safe for the browser.

### 23.2 Backend Env

Use:

```text
ENVIRONMENT
DATABASE_URL
FRONTEND_URL
CORS_ALLOWED_ORIGINS
MODEL_VERSION
REPORT_OUTPUT_DIR
MAX_UPLOAD_SIZE_MB
```

### 23.3 Do Not Commit

Do not commit:

```text
.env
.env.local
.env.production
```

Only commit:

```text
.env.example
```

---

## 24. Testing and Verification Rules

After each major change, run the appropriate checks.

### 24.1 Frontend Checks

Run from `frontend/`:

```bash
pnpm lint
pnpm build
```

If build fails, fix it before claiming completion.

### 24.2 Backend Checks

Run from project root or backend context:

```bash
python -m pytest
ruff check backend
```

If tests are not available yet, at minimum verify imports and server startup.

### 24.3 Manual Checks

Verify:

- landing page loads
- navigation works
- auth flow works if implemented
- protected routes are protected
- dashboard renders
- prediction form validates
- prediction API works
- batch upload handles errors
- reports generate
- no obvious console errors
- no backend tracebacks shown in UI

---

## 25. Accessibility Rules

The UI must be usable and readable.

Requirements:

- sufficient color contrast
- form labels
- visible validation messages
- keyboard-accessible controls where practical
- non-color-only risk indicators
- responsive layout
- readable chart labels
- accessible buttons and links

Do not use tiny text or low-contrast chart labels.

---

## 26. Performance Rules

Keep the app responsive.

Rules:

- avoid unnecessary heavy frontend libraries
- do not render huge tables without pagination
- paginate large datasets
- lazy load heavy charts if needed
- avoid blocking UI during batch/report generation
- use backend aggregation for dashboard data
- cache aggregate metrics where appropriate
- avoid loading full CSVs into frontend memory unnecessarily

---

## 27. Deployment Rules

Deployment must be planned for:

- Vercel frontend
- Render/Railway/Fly.io backend
- managed PostgreSQL
- optional object storage for reports

Before deployment:

- confirm environment variables
- confirm CORS
- confirm build passes
- confirm model artifacts are available
- confirm database migrations
- confirm no secrets are committed
- confirm generated reports are not in Git

---

## 28. Responsible AI Rules

Every prediction/report must make clear:

- this is educational and analytical
- the model does not diagnose
- the model does not recommend treatment
- predictions are based on historical patterns
- unusual inputs may reduce reliability
- final decisions require qualified professionals

Do not generate medical advice.

Do not tell users what treatment to take.

Do not claim clinical validity.

---

## 29. Communication Rules for Agents

When reporting work, agents should summarize:

1. files changed
2. features implemented
3. checks run
4. remaining blockers, if any
5. next recommended step

Agents should not say a feature is complete unless it is actually complete.

Use precise language.

Bad:

```text
Everything is done.
```

Good:

```text
Implemented the dashboard shell, metric cards, and chart containers. Verified frontend build. Backend API integration is not started yet.
```

---

## 30. Phase Discipline

Agents should work according to `PLAN.md`.

Do not randomly jump from:

- frontend dashboard
- to auth
- to ML
- to reports

without completing stable milestones.

Recommended milestone order:

1. documentation and structure
2. frontend shell
3. public pages
4. auth
5. backend skeleton
6. database
7. ML pipeline
8. prediction
9. dashboard
10. batch
11. reports
12. monitoring/admin
13. deployment

---

## 31. Definition of Done for Any Feature

A feature is done only when:

- UI is implemented
- backend is implemented if required
- database integration is implemented if required
- validation is implemented
- loading state exists
- error state exists
- access control exists if protected
- audit logging exists for sensitive actions
- docs are updated if needed
- no TODOs/placeholders remain
- build/checks pass
- feature works locally

---

## 32. Final Agent Reminder

This project is intended to become a strong resume-grade data science and full-stack engineering project.

Do not optimize for quick superficial output.

Optimize for:

- correctness
- completeness
- clean architecture
- secure defaults
- professional UI
- understandable analytics
- recruiter-friendly demonstration
- maintainable code

When uncertain, ask before making large architectural changes.
