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

## Quick Install (Self-Hosted)

The fastest way to run codePost on your own server is the installer in this repository:

```bash
git clone https://github.com/rutgers-lcsr/codePost.git && cd codePost && bash install.sh
```

The installer checks prerequisites (Linux, Docker 24+, Docker Compose v2), clones the
`codePost-api` and `codePost-ui` repos as siblings, generates a `.env` with secure
secrets, sets up SSL, builds the images from source, and starts everything with
Docker Compose.

Just want to try codePost on your machine without a domain, DNS, or SMTP?

```bash
bash install.sh --local
```

This brings up the full stack on `https://localhost` with a self-signed certificate
and generated admin credentials (printed at the end).

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full deployment guide — configuration
reference, SSL with Let's Encrypt, autograder setup, backups, and upgrades.

---

## Getting Started (Development)

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
git clone https://github.com/rutgers-lcsr/codePost-api.git
git clone https://github.com/rutgers-lcsr/codePost-ui.git
git clone https://github.com/rutgers-lcsr/codepost-python.git
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
pip install git+https://github.com/rutgers-lcsr/codepost-python.git
```

**Quick example:**

```python
from codepost import CodePost

# Or set the CODEPOST_API_KEY env var and call CodePost()
client = CodePost(api_key="your_api_key")

# Who am I?
me = client.users.me()

# List your courses
for course in client.courses.list():
    print(f"{course.name} ({course.period})")
```

Get your API key from the **Settings** page of your codePost instance.

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

Use the installer and Docker Compose stack in **this repository** (see
[Quick Install](#quick-install-self-hosted) above). It runs every required
service as a container on a single host:

- **MariaDB** — database
- **Redis** — Celery task queue and WebSocket support
- **Nginx** — reverse proxy with SSL termination
- **API + Celery worker** — built from `codePost-api`
- **UI** — built from `codePost-ui`
- **Autograder** — sandboxed Docker execution (worker mounts the Docker socket)

Configuration lives in a single `.env` file in this repo, generated by
`install.sh` (or copy [.env.example](.env.example) and edit it). The full
configuration reference, SSL setup, backup, and upgrade procedures are in
[DEPLOYMENT.md](DEPLOYMENT.md).

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
