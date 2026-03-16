# codePost

**codePost** is an open-source platform for code review and grading, built for universities. It provides a modern web interface for students to submit code, for graders to review and annotate it, and for instructors to manage courses, rubrics, and autograders.

This repository serves as the central hub for the codePost ecosystem — linking together all the components you need to develop with or deploy codePost at your university.

---

## Ecosystem Overview

| Repository                              | Description                                       | Tech Stack                             |
| :-------------------------------------- | :------------------------------------------------ | :------------------------------------- |
| [**codePost-api**](#codepost-api)       | Backend REST API — the core of the platform       | Django 6, DRF, Celery, MySQL/SQLite    |
| [**codePost-ui**](#codepost-ui)         | Web frontend — the student/grader/admin interface | React 19, TypeScript, Vite, Ant Design |
| [**codepost-python**](#codepost-python) | Python SDK — scripting and automation             | Python 3.9+, Pydantic                  |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    codePost Platform                    │
├────────────────────┬────────────────────────────────────┤
│                    │                                    │
│   codePost-ui      │         SDKs / Clients             │
│   (React SPA)      │                                    │
│   Port 3000        │   codepost-python  (Python SDK)    │
│        │           │         │                          │
│        ▼           │         ▼                          │
│  ┌─────────────────┴────────────────────┐               │
│  │          codePost-api                │               │
│  │      (Django REST API)               │               │
│  │         Port 8000                    │               │
│  ├──────────┬───────────┬───────────────┤               │
│  │  core/   │autograder/│  webhooks/    │               │
│  │ (models, │ (Docker   │  (event       │               │
│  │  views,  │  sandboxed│   hooks)      │               │
│  │  perms)  │  exec)    │              │               │
│  └────┬─────┴─────┬─────┴───────────────┘               │
│       │           │                                     │
│       ▼           ▼                                     │
│   Database     Redis        S3 (optional)               │
│  (MySQL/       (Celery      (file storage)              │
│   SQLite)       broker)                                 │
└─────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Python 3.12+** (API backend)
- **Node.js 20+** and **npm** (UI frontend)
- **Poetry** (Python dependency management)
- **Docker** (optional — required for autograder sandboxed execution)
- **Redis** (optional in development — required for Celery workers and WebSockets in production)
- **MySQL/MariaDB** (production database — SQLite works for development)

### Quick Start (Development)

Clone all repositories into the same parent directory:

```bash
git clone <api-repo-url> codePost-api
git clone <ui-repo-url> codePost-ui
git clone <python-sdk-repo-url> codepost-python
```

#### 1. Start the API

```bash
cd codePost-api
poetry install
python manage.py migrate
./start_dev.sh
```

The API server starts at `http://localhost:8000`. In dev mode it uses SQLite and runs Celery tasks eagerly (no Redis needed).

Use `./start_dev.sh --local` to force local shell mode (no Redis), or `./start_dev.sh --env` to load a `.env` file for MySQL/Redis configuration.

#### 2. Start the UI

```bash
cd codePost-ui
npm ci
npm run dev
```

The frontend starts at `http://localhost:3000` and connects to the API at `http://localhost:8000` by default (configurable via `REACT_APP_API_URL`).

#### 3. Create a superuser

```bash
cd codePost-api
python manage.py createsuperuser
```

You can now log in to the UI and start creating courses, assignments, and rubrics.

---

## Repository Details

### codePost-api

The Django REST Framework backend that powers the entire platform.

**Key components:**

- **`core/`** — All domain models (courses, assignments, submissions, rubrics, comments), views, serializers, and permissions
- **`autograder/`** — Sandboxed code execution via Docker containers, managed through Celery
- **`webhooks/`** — Asynchronous event hook delivery
- **`log/`** — Audit event storage

**Useful commands:**

```bash
# Run tests
pytest

# Run only core tests
pytest core/tests/

# Generate OpenAPI schema (used by SDKs)
python manage.py spectacular --file schema.yaml

# Regenerate the TypeScript API client for codePost-ui
./scripts/generate_ts_client.sh
```

**Configuration:**

| Variable                  | Purpose                             | Default           |
| :------------------------ | :---------------------------------- | :---------------- |
| `DB_HOSTNAME`             | MySQL host (omit for SQLite)        | —                 |
| `DB_NAME`                 | Database name                       | `codepost`        |
| `DB_USER` / `DB_PASSWORD` | Database credentials                | —                 |
| `REDIS_URL`               | Redis connection string             | —                 |
| `AWS_STORAGE_BUCKET_NAME` | S3 bucket for file storage          | — (local storage) |
| `FIELD_ENCRYPTION_KEY`    | Encryption key for sensitive fields | —                 |
| `SECRET_KEY`              | Django secret key                   | Set in settings   |

---

### codePost-ui

The React single-page application that students, graders, and course administrators use.

**Key directories:**

- **`src/api-client/`** — Auto-generated TypeScript API client (**never edit manually**)
- **`src/services/`** — Typed wrappers around the generated API client
- **`src/components/`** — UI components organized by role: `admin/`, `grader/`, `student/`, `core/`
- **`src/features/`** — Feature modules (e.g., `code-review/`) with their own components, hooks, and types
- **`src/stores/`** — Zustand state management stores

**Useful commands:**

```bash
# Type check
npx tsc --noEmit

# Lint and fix
npm run lint:fix

# Run tests
npx vitest run

# Production build
npm run build:production

# Bundle analysis
npm run analyze
```

**Configuration:**

| Variable            | Purpose         | Default                 |
| :------------------ | :-------------- | :---------------------- |
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8000` |

---

### codepost-python

The official Python SDK for automating codePost workflows — uploading submissions, managing rosters, pulling grades, and more.

**Installation:**

```bash
pip install codepost
```

**Quick example:**

```python
import codepost

client = codepost.create_client(api_key="your_api_key")

# List courses
courses = client.courses.list()

# Upload a submission
client.submissions.create(
    assignment=assignment_id,
    students=["student@university.edu"],
    files=[{"name": "main.py", "code": "print('hello')", "extension": "py"}]
)
```

**Useful for:**

- Bulk uploading student submissions
- Exporting grades to your university's LMS
- Automating rubric creation
- Building custom grading scripts
- Integration with CI/CD pipelines for automated feedback

---

## Deployment Guide

### Development (Single Machine)

The simplest setup for local development or evaluation:

1. Start the API with SQLite: `./start_dev.sh` (no external dependencies)
2. Start the UI: `npm run dev`
3. Access at `http://localhost:3000`

### Production

A production deployment requires:

1. **Database**: MySQL/MariaDB instance
2. **Redis**: For Celery task queue and WebSocket support
3. **Reverse proxy**: Nginx (configuration included in both repos)
4. **File storage**: S3-compatible object storage (optional — can use local filesystem)
5. **Docker** (optional): Required if using the autograder for sandboxed code execution

#### Docker Compose

Both the API and UI include Docker configurations:

```bash
# API — start all services (API + worker + Redis + database)
cd codePost-api
docker compose up

# UI — build and serve with Nginx
cd codePost-ui
docker compose up
```

#### Environment Configuration

Create a `.env` file in the API root:

```env
# Database
DB_HOSTNAME=db.example.com
DB_NAME=codepost
DB_USER=codepost
DB_PASSWORD=<secure-password>

# Redis
REDIS_URL=redis://redis:6379/0

# Security
SECRET_KEY=<random-secret-key>
FIELD_ENCRYPTION_KEY=<random-encryption-key>

# File storage (optional — omit for local filesystem)
AWS_STORAGE_BUCKET_NAME=your-bucket
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
```

---

## Schema & SDK Generation

The API, UI, and Python SDK are kept in sync through an OpenAPI schema:

```
codePost-api                codePost-ui              codepost-python
     │                           │                       │
     │  manage.py spectacular    │                       │
     ├──────► schema.yaml ───────┤                       │
     │                           │                       │
     │  generate_ts_client.sh    │                       │
     ├───────────────────────────► src/api-client/        │
     │                                                   │
     │  generate_sdk.sh                                  │
     ├───────────────────────────────────────────────────►│
```

After making API changes:

1. Regenerate the schema: `python manage.py spectacular --file schema.yaml`
2. Regenerate the UI client: `./scripts/generate_ts_client.sh` (from the API repo)
3. Regenerate the Python SDK: `./scripts/generate_sdk.sh` (from the API repo)

---

## For Universities

### Why codePost?

- **Built for CS courses**: Purpose-built for code review, not repurposed from industry tools
- **Rubric-based grading**: Create reusable rubrics with point values and apply them inline with code
- **Autograding**: Run student code in sandboxed Docker containers with custom test suites
- **Roster management**: Integrate with your university's student information system
- **Sections and TAs**: Organize courses into sections with grader assignments
- **Bulk operations**: Upload submissions, export grades, and manage rosters via SDKs
- **Self-hostable**: Run on your own infrastructure for full data control

### Getting Help

- Open an issue in the relevant repository
- Check existing documentation in each repo's `README.md` and `CHANGELOG.md`

---

## Contributing

We welcome contributions from the university community. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Setting up the development environment
- Code style and conventions per repository
- Running tests
- Submitting pull requests

---

## License

Each repository is licensed individually. See the `LICENSE` file in each repository for details.
