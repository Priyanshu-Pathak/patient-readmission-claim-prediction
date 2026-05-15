# SECURITY_REQUIREMENTS.md

# AdmitGuard Intelligence  
## Security Requirements and Controls

**Document Type:** Security Requirements  
**Project:** AdmitGuard Intelligence  
**Purpose:** Define the security, privacy, access-control, validation, and operational safeguards for the project  
**Scope:** Frontend, backend, database, authentication, file uploads, reports, ML serving, deployment, and agent-generated code  
**Authentication Strategy:** Google OAuth with internal role-based access control  
**Important Positioning:** This is a healthcare analytics portfolio project inspired by healthcare security best practices. It must not claim HIPAA certification or clinical production readiness.

---

## 1. Security Objective

AdmitGuard Intelligence handles healthcare-style patient records, prediction results, uploaded CSV files, and generated PDF reports. Even though the project is for educational and portfolio use, it must be designed with professional security practices.

The main security goals are:

- protect access to patient records
- prevent unauthorized viewing of predictions and reports
- secure authentication using Google OAuth
- enforce internal roles and permissions
- prevent insecure file upload handling
- validate all inputs before processing
- prevent accidental exposure of secrets
- avoid raw error leakage
- maintain audit logs for sensitive operations
- keep generated reports private to the correct user
- avoid misleading claims about medical or regulatory compliance

---

## 2. Security Model Summary

The application uses layered security.

```text
Google OAuth Authentication
        ↓
Frontend Protected Routes
        ↓
Backend Authentication Verification
        ↓
Role-Based Access Control
        ↓
Resource Ownership Checks
        ↓
Input and File Validation
        ↓
Database Persistence
        ↓
Audit Logging
        ↓
Safe User-Facing Errors
```

The frontend may hide inaccessible pages, but the backend must enforce all security checks.

Frontend-only security is not acceptable.

---

## 3. Authentication Requirements

### 3.1 Authentication Method

The system must use:

```text
Google OAuth
```

The system must not implement custom password-based authentication for v1.

### 3.2 Required Behavior

The app must:

- allow users to sign in with Google
- create or update user records after successful login
- store basic user metadata
- assign a default role to new users
- support logout
- protect private pages
- reject unauthenticated backend API requests

### 3.3 User Metadata

The `users` table may store:

```text
id
google_sub
name
email
avatar_url
role
is_active
created_at
updated_at
last_login_at
```

### 3.4 Forbidden Authentication Practices

Do not:

- store raw passwords
- build password reset flows unless custom auth is explicitly added later
- hardcode production users
- hardcode admin sessions
- use frontend-only auth checks
- expose OAuth secrets to the browser
- commit OAuth client secrets
- log OAuth tokens
- use fake auth checks

---

## 4. Authorization Requirements

### 4.1 Internal Roles

The application must support these roles:

```text
Admin
Analyst
Viewer
```

### 4.2 Default Role

New users must receive:

```text
Viewer
```

Admin role must be assigned through a controlled process, such as:

- database seed script
- admin panel
- manual local development update

### 4.3 Role Permissions

| Capability | Admin | Analyst | Viewer |
|---|---:|---:|---:|
| View dashboard | Yes | Yes | Yes |
| Run single prediction | Yes | Yes | Optional |
| Upload batch CSV | Yes | Yes | No |
| Generate patient report | Yes | Yes | No |
| Generate cohort report | Yes | Yes | No |
| View own reports | Yes | Yes | Yes |
| View model performance | Yes | Yes | Yes |
| View explainability | Yes | Yes | Yes |
| View monitoring page | Yes | Yes | No |
| View audit logs | Yes | No | No |
| Manage user roles | Yes | No | No |
| Delete or manage batch jobs | Yes | Limited/No | No |

### 4.4 Backend Enforcement

Every protected backend route must verify:

1. user is authenticated
2. user account is active
3. user role is allowed
4. requested resource belongs to the user or is permitted by role
5. admin-only operations are restricted to Admin users

### 4.5 Direct Object Access Protection

The system must prevent insecure direct object references.

Examples:

- A user must not access another user's prediction by changing the prediction ID.
- A user must not download another user's PDF report by changing the report ID.
- A Viewer must not upload a batch by directly calling the API.
- An Analyst must not access admin audit logs by entering the admin route.

---

## 5. Protected and Public Routes

### 5.1 Public Frontend Routes

These routes may be public:

```text
/
/about
/how-it-works
/login
```

### 5.2 Protected Frontend Routes

These routes require login:

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

### 5.3 Backend Route Protection

All backend routes are protected except:

```text
GET /api/v1/health
GET /api/v1/public/* if explicitly created
```

All routes involving patients, predictions, batches, reports, monitoring, and admin must require authentication.

---

## 6. Database Security Requirements

### 6.1 Database

Use PostgreSQL.

### 6.2 ORM

Use SQLAlchemy or an equivalent ORM layer. Do not manually concatenate SQL strings with untrusted user input.

### 6.3 Required Tables

Security-relevant tables:

```text
users
patients
predictions
prediction_explanations
batch_jobs
batch_rows
reports
audit_logs
model_versions
```

### 6.4 Ownership Fields

User-owned tables must include a `user_id` field where appropriate:

```text
patients.user_id
predictions.user_id
batch_jobs.user_id
reports.user_id
audit_logs.user_id
```

### 6.5 Indexes

Add indexes for:

```text
users.email
users.google_sub
patients.user_id
predictions.user_id
predictions.patient_id
predictions.created_at
batch_jobs.user_id
reports.user_id
audit_logs.user_id
audit_logs.created_at
model_versions.version
```

### 6.6 Database Secrets

Never commit:

```text
DATABASE_URL
production database username
production database password
database dumps with user data
```

Only dummy local development credentials may appear in `.env.example`.

---

## 7. Input Validation Requirements

### 7.1 Backend Validation

All API inputs must be validated using backend schemas.

Use:

```text
Pydantic
```

Validate:

- required fields
- field types
- numeric ranges
- categorical values
- impossible values
- missing values
- invalid dates
- invalid IDs
- invalid file metadata

### 7.2 Frontend Validation

Frontend validation improves UX but is not enough.

Use frontend validation for:

- form field errors
- CSV file type hints
- required field prompts
- numeric range warnings

Backend validation remains mandatory.

### 7.3 Patient Input Validation

Patient prediction inputs must reject or warn for:

- negative age
- impossible BMI
- negative hospital stay
- negative medication count
- negative lab procedure count
- negative inpatient/outpatient/emergency visit counts
- unknown categorical values
- missing required fields
- values outside training ranges

### 7.4 Structured Validation Errors

Validation errors must use standard response format:

```json
{
  "success": false,
  "error_code": "VALIDATION_ERROR",
  "message": "Invalid request input.",
  "details": {
    "field": "bmi",
    "reason": "BMI must be within the accepted numeric range."
  }
}
```

---

## 8. File Upload Security Requirements

Batch CSV upload is a major security area.

### 8.1 Allowed File Type

Only allow:

```text
.csv
```

### 8.2 Reject

Reject:

- `.exe`
- `.bat`
- `.cmd`
- `.ps1`
- `.js`
- `.html`
- `.php`
- `.zip`
- `.rar`
- files with multiple suspicious extensions
- files that are not parseable as CSV

### 8.3 File Size Limit

Define a maximum file size using environment variable:

```text
MAX_UPLOAD_SIZE_MB
```

Recommended demo default:

```text
5 MB or 10 MB
```

### 8.4 Safe File Storage

Uploaded files must:

- be stored outside public frontend directories
- use generated safe filenames
- not rely on original uploaded names
- be excluded from Git
- be cleaned up if temporary
- be associated with the authenticated user

### 8.5 CSV Schema Validation

Uploaded CSV files must be checked for:

- required columns
- unexpected missing values
- invalid numeric values
- unsupported categories
- row count
- malformed rows

Invalid rows must not crash the whole batch.

### 8.6 Invalid Row Reporting

If invalid rows exist, return:

- row number
- field name
- error reason
- whether the row was skipped

### 8.7 Audit Logging

Every batch upload attempt must be audit logged.

Log:

- user ID
- file name
- file hash if available
- total rows
- valid rows
- invalid rows
- status
- timestamp

Do not log full file content.

---

## 9. Report Security Requirements

Reports may contain patient-like inputs and prediction outputs. They must be protected.

### 9.1 Report Ownership

Every generated report must belong to a user.

The `reports` table must include:

```text
user_id
prediction_id or batch_job_id
report_type
file_path or file_url
status
generated_at
```

### 9.2 Report Access

Before download, backend must verify:

1. user is authenticated
2. user has permission
3. report belongs to user or user is Admin
4. report file exists
5. report status is completed

### 9.3 Generated File Storage

Generated reports must not be stored in:

```text
frontend/public/
```

unless the links are protected and access-controlled.

Preferred:

```text
backend/reports/generated/
object storage with signed access if implemented
```

### 9.4 Git Ignore

Generated reports must be ignored by Git.

Required `.gitignore` entries:

```gitignore
reports/generated/
backend/reports/generated/
*.pdf
```

### 9.5 Report Generation Audit Logs

Log:

- patient report generation
- cohort report generation
- report download
- report generation failure

---

## 10. API Security Requirements

### 10.1 API Versioning

All APIs must use:

```text
/api/v1/
```

### 10.2 Standard Response Format

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
  "error_code": "AUTHORIZATION_ERROR",
  "message": "You do not have permission to perform this action.",
  "details": {}
}
```

### 10.3 Error Codes

Use consistent error codes:

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

### 10.4 Rate Limiting

Add rate limiting where practical for:

- prediction endpoint
- batch upload endpoint
- report generation endpoint
- admin endpoints if needed

The implementation may use:

```text
slowapi
Redis if configured
```

### 10.5 CORS

Development CORS:

```text
http://localhost:3000
```

Production CORS:

```text
deployed frontend domain only
```

Do not use wildcard CORS in production.

### 10.6 Request Size Limits

Large requests must be limited.

Apply limits to:

- file uploads
- JSON body size if supported by deployment platform
- batch row count if needed

---

## 11. Error Handling and Leakage Prevention

### 11.1 User-Facing Errors

Do not expose:

- raw stack traces
- database errors
- full file paths
- OAuth token details
- secrets
- internal model paths
- SQL error details

Bad:

```text
psycopg.errors.UndefinedTable: relation users does not exist
```

Good:

```text
The service is temporarily unavailable. Please try again later.
```

### 11.2 Backend Logs

Backend logs may contain technical details, but must not contain:

- OAuth tokens
- production secrets
- full patient records
- raw uploaded CSV content
- generated report content
- database credentials

### 11.3 Centralized Exception Handling

FastAPI must use centralized handlers for:

- validation errors
- authentication errors
- authorization errors
- missing resources
- model errors
- report errors
- database errors
- unexpected exceptions

---

## 12. ML Security and Guardrail Requirements

### 12.1 Model Loading

The backend must:

- load model artifacts from configured paths
- fail safely if artifacts are missing
- return a clean model service error
- not expose local filesystem paths to users

### 12.2 Prediction Guardrails

Every prediction must check:

- required input fields
- impossible values
- out-of-training-range values
- unknown categories
- null or missing values
- feature schema compatibility

### 12.3 Prediction Response

Prediction responses must include:

- readmission probability
- risk band
- predicted claim
- claim range
- confidence score
- model version
- timestamp
- warnings
- responsible AI disclaimer

### 12.4 No Fake Predictions

Do not:

- return random predictions
- hardcode prediction values
- fake feature importance
- fake metrics
- present a mock model as real

If model artifacts are unavailable, return:

```text
MODEL_LOADING_ERROR
```

or a clear development-only message.

### 12.5 Responsible AI Constraints

The system must not:

- diagnose a patient
- recommend treatment
- claim clinical validity
- claim medical certification
- claim HIPAA compliance
- guarantee outcomes

Required disclaimer:

```text
This platform is a machine learning demonstration for educational and analytical use. It does not diagnose patients, recommend treatment, or replace professional medical judgment.
```

---

## 13. Audit Logging Requirements

Audit logs must be stored in the database.

### 13.1 Required Audit Events

Log:

- user login or auth sync
- prediction generation
- batch upload
- batch validation failure
- report generation
- report download
- access denied event
- admin role change
- admin user status change
- model loading failure if relevant
- report generation failure

### 13.2 Audit Log Fields

Recommended fields:

```text
id
user_id
action
resource_type
resource_id
ip_address
user_agent
metadata_json
created_at
```

### 13.3 Audit Log Safety

Do not store:

- OAuth tokens
- secrets
- full uploaded CSV content
- full patient records
- generated PDF binary content

Store metadata only.

---

## 14. Frontend Security Requirements

### 14.1 Route Guards

Protected pages must require authentication.

If unauthenticated:

```text
redirect to /login
```

If unauthorized:

```text
show a professional unauthorized state
```

### 14.2 Role-Based UI

Frontend must hide unavailable actions, but backend must still enforce permissions.

Examples:

- Viewer should not see batch upload button.
- Non-admin should not see admin navigation.
- Report generation button should be hidden or disabled if user lacks permission.

### 14.3 Client-Side Environment Variables

Only expose public-safe values with:

```text
NEXT_PUBLIC_
```

Never expose:

```text
GOOGLE_CLIENT_SECRET
DATABASE_URL
AUTH_SECRET
SESSION_SECRET
```

### 14.4 Browser Error Handling

The UI must not display raw backend errors.

Use:

- clean error panels
- toast messages
- retry buttons
- empty states
- loading states

---

## 15. Environment Variable Requirements

### 15.1 Backend Environment Variables

Recommended backend variables:

```text
ENVIRONMENT=development
DATABASE_URL=postgresql+psycopg://...
FRONTEND_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000
MODEL_VERSION=dev_v1
REPORT_OUTPUT_DIR=backend/reports/generated
MAX_UPLOAD_SIZE_MB=10
```

Depending on final auth architecture, backend may also need auth verification variables.

### 15.2 Frontend Environment Variables

Recommended frontend variables:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change_this_in_production
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 15.3 Never Commit

Never commit:

```text
.env
.env.local
.env.production
OAuth client secret
database passwords
session secrets
production API keys
```

Commit only:

```text
.env.example
```

with dummy values.

---

## 16. Deployment Security Requirements

### 16.1 Frontend Deployment

Target:

```text
Vercel
```

Requirements:

- configure production environment variables
- no hardcoded localhost URLs
- Google OAuth production callback configured
- frontend build passes
- protected route behavior works

### 16.2 Backend Deployment

Target:

```text
Render / Railway / Fly.io
```

Requirements:

- production environment variables configured
- CORS restricted to production frontend domain
- database URL configured securely
- model artifacts available
- generated report storage configured
- no debug mode in production
- no raw stack traces

### 16.3 Database Deployment

Use managed PostgreSQL where possible:

```text
Supabase
Neon
Render PostgreSQL
Railway PostgreSQL
```

Requirements:

- migrations applied
- credentials stored in deployment env vars
- no public database exposure
- backups if platform supports them

### 16.4 OAuth Deployment

Google OAuth settings must include correct authorized redirect URLs for:

- local development
- production frontend

Do not commit OAuth secrets.

---

## 17. Data Privacy Requirements

### 17.1 Demo Data

Use only:

- sample data
- synthetic data
- anonymized data
- non-sensitive public dataset records where license allows

### 17.2 Do Not Commit

Do not commit:

- private patient data
- raw identifying records
- user-uploaded CSV files
- generated reports
- database dumps
- production logs with user data

### 17.3 Data Minimization

Store only fields needed for:

- prediction
- dashboard analytics
- reports
- auditability

Avoid storing unnecessary personally identifiable information.

### 17.4 Patient IDs

Use generic internal IDs for demo:

```text
PAT-0001
PAT-0002
```

Do not use real names.

---

## 18. Agent Security Rules

Antigravity agents and coding agents must follow these security rules.

### 18.1 Forbidden Agent Actions

Agents must not:

- commit secrets
- disable auth to make pages work
- disable validation to bypass errors
- use fake auth
- use fake RBAC
- expose reports publicly
- remove audit logging
- use wildcard CORS in production config
- hardcode admin credentials
- run destructive database commands without approval
- delete `.gitignore` protections
- leave TODO security work

### 18.2 Required Agent Behavior

Agents must:

- inspect files before editing
- follow `AGENT_RULES.md`
- follow `PLAN.md`
- work one phase at a time
- verify after changes
- report security assumptions
- update documentation when security architecture changes

### 18.3 No Security Placeholders

Not allowed:

```text
TODO: add auth later
TODO: secure this endpoint later
temporary admin bypass
allow all users for now
disable CORS for production
skip ownership check for now
```

If a security feature cannot be implemented yet, the agent must stop and explain the blocker.

---

## 19. Security Verification Checklist

Before considering the project complete, verify:

### Authentication

- [ ] Google OAuth login works.
- [ ] Logout works.
- [ ] User record is created or updated.
- [ ] New user gets default Viewer role.
- [ ] OAuth secrets are not committed.

### Authorization

- [ ] Protected frontend pages require login.
- [ ] Protected backend APIs require login.
- [ ] Viewer cannot upload batch.
- [ ] Viewer cannot generate restricted reports.
- [ ] Analyst cannot access admin APIs.
- [ ] Non-admin cannot manage roles.
- [ ] Resource ownership checks work.

### File Uploads

- [ ] Only CSV uploads allowed.
- [ ] Oversized file rejected.
- [ ] Invalid schema rejected.
- [ ] Invalid rows reported.
- [ ] Uploaded files not committed.
- [ ] Original filenames are not trusted.

### Reports

- [ ] Reports require authentication.
- [ ] Report downloads verify ownership.
- [ ] Generated PDFs are not committed.
- [ ] Report generation failures are handled.

### API

- [ ] CORS restricted.
- [ ] Standard error responses used.
- [ ] No raw tracebacks in UI.
- [ ] Rate limiting exists where implemented.
- [ ] No hardcoded localhost in production config.

### Database

- [ ] Migrations work.
- [ ] User-owned records include `user_id`.
- [ ] Indexes exist.
- [ ] No production credentials committed.

### ML

- [ ] Model artifacts load safely.
- [ ] Missing artifacts return clean error.
- [ ] Prediction guardrails work.
- [ ] Out-of-range inputs create warnings.
- [ ] No fake predictions or metrics.

### Documentation

- [ ] README includes security section.
- [ ] SECURITY_REQUIREMENTS.md is accurate.
- [ ] .env.example files use dummy values.
- [ ] No claims of HIPAA compliance.
- [ ] Responsible AI disclaimer present.

---

## 20. Security Response Standards

### 20.1 Unauthorized User

Response:

```json
{
  "success": false,
  "error_code": "AUTHENTICATION_ERROR",
  "message": "Authentication is required to access this resource.",
  "details": {}
}
```

### 20.2 Forbidden Role

Response:

```json
{
  "success": false,
  "error_code": "AUTHORIZATION_ERROR",
  "message": "You do not have permission to perform this action.",
  "details": {}
}
```

### 20.3 Missing Resource

Response:

```json
{
  "success": false,
  "error_code": "RESOURCE_NOT_FOUND",
  "message": "The requested resource was not found.",
  "details": {}
}
```

### 20.4 Invalid CSV

Response:

```json
{
  "success": false,
  "error_code": "FILE_UPLOAD_ERROR",
  "message": "The uploaded CSV file does not match the required schema.",
  "details": {
    "missing_columns": ["age", "bmi", "num_medications"]
  }
}
```

### 20.5 Model Error

Response:

```json
{
  "success": false,
  "error_code": "MODEL_LOADING_ERROR",
  "message": "Prediction service is temporarily unavailable.",
  "details": {}
}
```

---

## 21. Compliance and Claims Policy

Do not claim:

```text
HIPAA compliant
medical-grade
clinically validated
FDA-approved
production hospital system
doctor replacement
treatment recommendation engine
```

Allowed wording:

```text
healthcare analytics portfolio project
healthcare security best-practice inspired
educational machine learning platform
decision-support analytics demonstration
not for clinical use
```

Required disclaimer in app and reports:

```text
This platform is a machine learning demonstration for educational and analytical use. It does not diagnose patients, recommend treatment, or replace professional medical judgment.
```

---

## 22. Final Security Definition of Done

Security implementation is complete when:

- [ ] Google OAuth works.
- [ ] Internal RBAC works.
- [ ] Protected routes work.
- [ ] Backend auth checks work.
- [ ] Resource ownership checks work.
- [ ] CSV upload validation works.
- [ ] Report access control works.
- [ ] Audit logging records sensitive actions.
- [ ] CORS is environment-based.
- [ ] Secrets are excluded from Git.
- [ ] Errors are structured and safe.
- [ ] Prediction guardrails work.
- [ ] Responsible AI disclaimers are visible.
- [ ] No fake security controls remain.
- [ ] No TODO security items remain.
- [ ] README accurately describes implemented security.

---

## 23. Security Summary

AdmitGuard Intelligence must be built as a secure portfolio-grade healthcare analytics platform.

The core security design is:

```text
Google OAuth identity
+ internal RBAC
+ protected routes
+ backend permission checks
+ user-owned data
+ secure file validation
+ protected report downloads
+ audit logging
+ safe error handling
+ responsible AI disclaimers
```

Security must be implemented, not only documented.
