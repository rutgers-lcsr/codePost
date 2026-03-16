# Contributing to codePost

Thank you for your interest in contributing to codePost! This guide covers everything you need to set up a development environment and submit changes across the codePost ecosystem.

---

## Development Setup

### Prerequisites

- Python 3.12+
- Node.js 20+ and npm
- Poetry (Python dependency management)
- Git

### Clone the repositories

```bash
git clone <api-repo-url> codePost-api
git clone <ui-repo-url> codePost-ui
git clone <python-sdk-repo-url> codepost-python
```

### API setup

```bash
cd codePost-api
poetry install
python manage.py migrate
python manage.py createsuperuser
./start_dev.sh
```

### UI setup

```bash
cd codePost-ui
npm ci
npm run dev
```

---

## Code Style

### codePost-api (Python / Django)

- **Copyright header** — every file must start with:
    ```
    # Copyright © 2026 Rutgers, the State University of New Jersey. All rights reserved except as defined by the Rutgers Non-Commercial Licensed, included with this software.
    ```
- **Naming** — `camelCase` for serializer fields and API responses (enforced by `djangorestframework-camel-case`); `snake_case` for Python internals.
- **Type checking** — Pyright in `basic` mode. Run `pyright` to check.
- **No auto-formatter** — match the style of surrounding code.
- **OpenAPI docs** — use `@extend_schema` / `@extend_schema_field` from `drf_spectacular` for all new endpoints.

### codePost-ui (TypeScript / React)

- **Prettier** (enforced on commit via Husky + lint-staged):
    - Single quotes, trailing commas, 2-space indent, 120-char line width, semicolons.
- **ESLint**:
    - `@typescript-eslint/no-explicit-any` is a warning — avoid `any` when possible.
    - Prefix unused variables with `_`.
    - Direct imports from `components/code-review/**` are blocked — use the `@code-review/` alias.
- **Components** — functional components with hooks. Use Ant Design components; wrap them with the `CP` prefix pattern (`CPButton`, `CPTooltip`, etc.) for codePost-specific behavior.
- **Colors** — always import from `src/theme/colors.ts`, never use hardcoded hex values.
- **Types** — import domain types from `src/types/models.ts`, not directly from `src/api-client/`.

### codepost-python (Python SDK)

- Match the style of surrounding code.
- Use type hints for public API methods.

---

## Project Structure

### API — adding a new resource

1. Create the model in `core/models.py` (inherit from `BaseModel`).
2. Create the serializer in `core/serializers/<resource>.py` (inherit `ModelSerializerWithPOSTCheck`).
3. Create the view in `core/views/<resource>.py` (inherit `ListProtectedViewSet`).
4. Create permissions in `core/permissions/` if needed (inherit `TemplatePermission`).
5. Register the ViewSet in `codepost/urls.py` router.
6. Generate and apply migrations: `python manage.py makemigrations && python manage.py migrate`.
7. Regenerate the OpenAPI schema: `python manage.py spectacular --file schema.yaml`.

### UI — adding a new feature

1. Create a directory under `src/features/` with its own `components/`, `hooks/`, `types.ts`.
2. Add a path alias in `tsconfig.json` and `vite.config.ts` if needed.
3. Use `React.lazy()` + `<Suspense>` for page-level code splitting.
4. Wrap new page-level views in `ErrorBoundary`.

### API → UI sync

After any API model or endpoint change:

1. Regenerate the schema: `python manage.py spectacular --file schema.yaml`
2. Regenerate the UI client: `./scripts/generate_ts_client.sh` (from the API repo)
3. Update or create service wrappers in `src/services/` as needed.

**Never edit `src/api-client/` manually** — it is auto-generated and changes will be overwritten.

---

## Testing

### API

```bash
# All tests
pytest

# Core app only
pytest core/tests/

# Autograder tests
pytest autograder/tests/
```

**Important:** When writing test factories, always mute `post_save` signals with `@factory.django.mute_signals`. Signals trigger Celery tasks and extra DB work that will cause test failures.

Tests should extend `rest_framework.test.APITestCase`, use `self.client.force_authenticate(user=...)`, hit actual API endpoints, and assert status codes + response data.

### UI

```bash
# Watch mode
npm test

# Single run (CI)
npx vitest run

# Type check
npx tsc --noEmit

# Lint
npm run lint:fix
```

Use `@testing-library/react` and `@testing-library/user-event`. Accessibility tests use `vitest-axe`.

---

## Key Things to Know

- **Permissions belong in permission classes**, not in view bodies. New permissions should inherit `TemplatePermission`.
- **List endpoints return 403** for non-superusers. Users access sub-resources through parent actions (e.g., `courses/{id}/assignments/`).
- **Archived courses block edits** — the serializer raises `ValidationError` for any model attached to an archived `Course`.
- **Auth state in the UI is not global** — it lives in `App.tsx` `useState` and is passed as props. There is no Zustand/Context auth store.
- **`src/api-client/` is auto-generated** — always regenerate it from the API schema, never edit by hand.
- **Celery tasks run eagerly in dev** (`CELERY_TASK_ALWAYS_EAGER=TRUE`). Import tasks inside signal handlers to avoid circular imports.

---

## Submitting Changes

1. Create a feature branch from `main`.
2. Make your changes following the conventions above.
3. Run the relevant test suite and ensure all tests pass.
4. For API changes, regenerate the schema and UI client.
5. Open a pull request with a clear description of what changed and why.

---

## Questions?

Open an issue in the relevant repository or check existing documentation in each repo's `README.md` and `CHANGELOG.md`.
