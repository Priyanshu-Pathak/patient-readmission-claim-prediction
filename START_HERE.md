# START_HERE.md

# AdmitGuard Intelligence  
## Start Here Before Making Any Changes

This repository is for **AdmitGuard Intelligence**, a secure full-stack healthcare analytics platform for diabetes patient readmission risk prediction, insurance claim forecasting, explainable ML, cohort dashboards, batch CSV scoring, Google OAuth authentication, RBAC, audit logging, and automated PDF report generation.

This file tells human developers and AI coding agents how to begin work safely.

---

## 1. Required Read Order

Before writing or modifying code, read these files in order:

1. [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)
2. [PRD.md](PRD.md)
3. [ARCHITECTURE.md](ARCHITECTURE.md)
4. [SECURITY_REQUIREMENTS.md](SECURITY_REQUIREMENTS.md)
5. [AGENT_RULES.md](AGENT_RULES.md)
6. [PLAN.md](PLAN.md)
7. [PROGRESS.md](PROGRESS.md)

Do not begin implementation until these files are understood.

---

## 2. Current Project Goal

The goal is to rebuild an older Flask-based diabetes readmission and claim prediction app into a production-style, resume-grade healthcare analytics platform.

The final app should include:

- Next.js frontend
- Tailwind CSS custom healthcare analytics UI
- FastAPI backend
- PostgreSQL database
- Google OAuth authentication
- internal RBAC with Admin, Analyst, and Viewer roles
- patient readmission risk prediction
- insurance claim amount forecasting
- interactive analytics dashboard
- batch CSV scoring
- model explainability
- model performance page
- monitoring page
- admin/audit page
- automated PDF report generation
- responsible AI disclaimers
- secure deployment setup

---

## 3. What This Project Is Not

This project is not:

- a basic ML form app
- a generic shadcn dashboard
- an AI-themed SaaS template
- a fake hospital production system
- a medical diagnosis tool
- a treatment recommendation system
- a HIPAA-certified product

Do not claim clinical certification or real-world medical readiness.

---

## 4. Design Direction

The UI must look like:

- healthcare analytics software
- hospital operations dashboard
- insurance risk intelligence platform
- clinical data analytics product
- enterprise BI system

Avoid:

- generic shadcn-style dashboards
- excessive purple gradients
- fake AI brain graphics
- random neural network visuals
- goofy animations
- cyberpunk styling
- excessive glassmorphism
- placeholder-looking pages

Use:

- deep medical blue
- slate neutrals
- teal accents
- amber warning states
- controlled red high-risk states
- clinical green low-risk states
- clean typography
- readable charts
- subtle professional animations

---

## 5. Agent Operating Rule

Agents must work **one phase at a time** using `PLAN.md`.

Do not jump ahead.

Do not start backend, auth, ML, dashboard, reports, and deployment all at once.

Recommended workflow:

```text
1. Read docs
2. Inspect current repository
3. Identify current phase from PROGRESS.md
4. Propose exact file-level plan
5. Wait for approval if the change is large
6. Implement only that phase
7. Run verification commands
8. Fix errors
9. Update PROGRESS.md
10. Summarize work
```

---

## 6. No Incomplete Work Policy

Do not leave:

- TODO comments
- placeholders
- fake endpoints
- fake auth
- fake reports
- fake predictions
- unused files
- broken buttons
- broken navigation
- dangling imports
- commented-out broken code
- "coming soon" sections

If blocked, stop and explain:

1. what was attempted
2. what failed
3. which files changed
4. what is needed next

---

## 7. Security First

Security is part of the project scope.

Required security direction:

- Google OAuth for login
- internal RBAC
- protected frontend routes
- protected backend APIs
- resource ownership checks
- audit logging
- input validation
- CSV upload validation
- protected report downloads
- restricted CORS
- no hardcoded secrets
- no raw error tracebacks in UI
- no committed `.env` files
- no generated reports committed to Git

Read `SECURITY_REQUIREMENTS.md` before implementing auth, API, uploads, reports, or deployment.

---

## 8. Authentication Direction

Use:

```text
Google OAuth
```

Do not build custom password login for v1.

The app handles:

- internal user record
- role assignment
- protected routes
- RBAC
- audit logs
- user-scoped records

New users should default to:

```text
Viewer
```

---

## 9. Stitch MCP Usage

Stitch MCP is available for UI/UX assistance.

Use it for:

- layout inspiration
- dashboard composition
- landing page refinement
- report preview design
- workflow page visualization

Do not blindly copy generated UI.

Every design must be adapted to the AdmitGuard healthcare analytics identity.

Reject generic AI SaaS outputs.

---

## 10. Animation Direction

Animations should be:

- subtle
- professional
- fast
- useful
- domain-appropriate

Good animation areas:

- page transitions
- chart loading
- prediction progress
- report generation progress
- batch upload progress
- workflow step reveal
- button hover states

Avoid:

- bouncing
- confetti
- fake AI thinking
- flashy neon motion
- long artificial loading
- goofy motion

---

## 11. Verification Commands

Frontend checks:

```bash
cd frontend
pnpm lint
pnpm build
```

Backend checks:

```bash
ruff check backend
python -m pytest
```

Backend manual run:

```bash
uvicorn backend.app.main:app --reload --port 8000
```

If using backend folder context:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Docker check:

```bash
docker ps
```

---

## 12. Environment Setup Assumption

The development environment has already been prepared.

Expected tools:

- Git
- Node.js LTS
- pnpm
- uv
- Python virtual environment in `.venv`
- Docker Desktop
- PostgreSQL and Redis through Docker Compose
- Next.js frontend in `frontend/`
- FastAPI backend planned in `backend/`

Do not waste agent requests reinstalling base tools unless a required dependency is missing.

---

## 13. Current Repo Structure Target

Expected root structure:

```text
project/
│
├── START_HERE.md
├── PROJECT_CONTEXT.md
├── PRD.md
├── ARCHITECTURE.md
├── SECURITY_REQUIREMENTS.md
├── AGENT_RULES.md
├── PLAN.md
├── PROGRESS.md
├── README.md
├── docker-compose.yml
├── .gitignore
│
├── frontend/
├── backend/
├── ml/
├── data/
└── docs/
```

---

## 14. Before Every New Agent Session

Use this prompt:

```text
Read START_HERE.md, PROJECT_CONTEXT.md, PRD.md, ARCHITECTURE.md, SECURITY_REQUIREMENTS.md, AGENT_RULES.md, PLAN.md, and PROGRESS.md.

Inspect the repository.

Do not write code yet.

Summarize the current project state, identify the next incomplete phase, and propose the exact files you would modify.
```

---

## 15. Final Reminder

This project should demonstrate:

- data science depth
- ML engineering
- secure full-stack development
- professional dashboard design
- healthcare domain awareness
- explainability
- reporting
- deployment readiness
- recruiter-friendly storytelling

Work carefully. Finish each phase. Verify before moving forward.
