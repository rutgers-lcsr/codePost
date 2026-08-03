# codePost — Self-Hosted Deployment Guide

This guide walks you through deploying codePost at your university using Docker Compose.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [Configuration Reference](#configuration-reference)
- [SSL / TLS Setup](#ssl--tls-setup)
- [Autograder Setup](#autograder-setup)
- [Operations](#operations)
- [Backup & Restore](#backup--restore)
- [Upgrading](#upgrading)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Requirement | Minimum                                                                   |
| :---------- | :------------------------------------------------------------------------ |
| **OS**      | Linux (Ubuntu 22.04+ or RHEL 8+ recommended)                              |
| **Docker**  | 24.0+ with Docker Compose v2                                              |
| **RAM**     | 8 GB (16 GB recommended for autograder)                                   |
| **Disk**    | 50 GB SSD (more if using autograder with large datasets)                  |
| **Network** | Ports 80 and 443 open; valid domain name with DNS pointing to this server |
| **SMTP**    | An SMTP server for sending emails (password resets, notifications)        |

---

## Architecture Overview

```
                    ┌───────────────────────────┐
                    │      Nginx Proxy          │
                    │   (SSL termination)       │
                    │    Ports 80 / 443         │
                    └─────┬───────────┬─────────┘
                          │           │
              ┌───────────▼──┐   ┌────▼────────┐
              │   API Server │   │   UI Server  │
              │   (Django)   │   │   (React)    │
              │   Port 8000  │   │   Nginx SPA  │
              └───┬──────┬───┘   └──────────────┘
                  │      │
         ┌────────▼┐  ┌──▼───────┐
         │ MariaDB │  │  Redis   │
         │  3306   │  │  6379    │
         └─────────┘  └──┬──────┘
                         │
              ┌──────────▼──────────┐
              │   Celery Worker     │
              │   (Autograder)      │
              │   + Shell Relay     │
              └─────────────────────┘
```

All services run as Docker containers on a single host via Docker Compose. For larger deployments, the worker can be split to a separate machine.

---

## Quick Start

> **Shortcut:** `bash install.sh` automates steps 1–5 below (prerequisite
> checks, cloning, `.env` generation, SSL, build, and startup). Use
> `bash install.sh --local` for a no-domain evaluation install on your own
> machine. The manual steps follow for those who want full control.

### 1. Clone the repositories

All three repositories must be siblings in the same parent directory:

```bash
git clone https://github.com/rutgers-lcsr/codePost.git
git clone https://github.com/rutgers-lcsr/codePost-api.git
git clone https://github.com/rutgers-lcsr/codePost-ui.git
```

Your directory structure should look like:

```
parent/
├── codePost/          ← you are here (deployment files)
├── codePost-api/      ← backend
└── codePost-ui/       ← frontend
```

### 2. Configure environment

```bash
cd codePost

# Copy the example file, then edit .env — change all CHANGE_ME values
make setup
```

At minimum, you must set:

- `SECRET_KEY` — Django secret key
- `FIELD_ENCRYPTION_KEY` — Database field encryption key (must be a valid
  Fernet key — see the generation command in `.env.example`)
- `DB_PASSWORD` / `ROOT_DATABASE_PASSWORD` — Database credentials
- `API_USER` / `API_PASSWORD` — Initial admin account
- `API_URL` / `CLIENT_URL` — Your domain URLs
- `NGINX_SERVER_NAME` — Your domain name(s)
- `EMAIL_HOST` — Your SMTP server
- `WORKER_SHELL_SHARED_SECRET` — Worker relay secret

### 3. Set up SSL certificates

**Option A: Use existing certificates**

Place your certificate files in `./certs/`:

```bash
mkdir -p certs
cp /path/to/fullchain.pem certs/fullchain.pem
cp /path/to/privkey.pem certs/privkey.pem
```

**Option B: Use Let's Encrypt (free)**

```bash
make certbot DOMAIN=codepost.youruniversity.edu EMAIL=admin@youruniversity.edu
```

### 4. Build and start

```bash
make build    # Build all container images
make up       # Start all services
```

The first start will:

1. Initialize the MariaDB database
2. Run Django migrations to create all tables
3. Create the admin user specified in `.env`
4. Start the API, UI, worker, and proxy

### 5. Verify

```bash
make status   # Check all containers are running
make logs     # View logs
```

Visit `https://your-domain` in a browser. Log in with the `API_USER`/`API_PASSWORD` credentials from your `.env`.

### 6. Create your organization

Log in to the Django admin at `https://your-domain/admin/` and create an Organization record with:

- Your university name
- Your email domain (e.g., `youruniversity.edu`)
- SSO configuration (if applicable)

---

## Configuration Reference

### Required Variables

| Variable                     | Description                                                |
| :--------------------------- | :--------------------------------------------------------- |
| `SECRET_KEY`                 | Django secret key for cryptographic signing                |
| `FIELD_ENCRYPTION_KEY`       | Encryption key for sensitive DB fields                     |
| `DB_PASSWORD`                | MariaDB application user password                          |
| `ROOT_DATABASE_PASSWORD`     | MariaDB root password                                      |
| `API_USER`                   | Admin username (created on first boot)                     |
| `API_PASSWORD`               | Admin password                                             |
| `API_URL`                    | Full URL of the API (e.g., `https://codepost.example.edu`) |
| `CLIENT_URL`                 | Full URL of the UI (usually same as API_URL)               |
| `NGINX_SERVER_NAME`          | Space-separated domain names for nginx                     |
| `EMAIL_HOST`                 | SMTP server hostname                                       |
| `WORKER_SHELL_SHARED_SECRET` | Shared secret for worker relay auth                        |

### Optional Variables

| Variable                  | Default              | Description                                    |
| :------------------------ | :------------------- | :--------------------------------------------- |
| `DEBUG`                   | `FALSE`              | Enable Django debug mode (never in production) |
| `DB_NAME`                 | `codepost`           | Database name                                  |
| `DB_USERNAME`             | `codepost_user`      | Database user                                  |
| `DEFAULT_EMAIL_FROM`      | `no-reply@localhost` | Sender address for system emails               |
| `CELERY_CONCURRENCY`      | `4`                  | Number of concurrent autograder workers        |
| `HOST_DATASET_ROOT`       | `/mnt/datasets`      | Host path for assignment datasets              |
| `AUTOGRADER_AUTO_EXECUTE` | `true`               | Auto-run submissions on upload                 |
| `INNODB_BUFFER_POOL_SIZE` | `1G`                 | MariaDB memory buffer (set to ~70% of RAM)     |
| `DB_MAX_CONNECTIONS`      | `500`                | MariaDB connection ceiling (max_connections)   |
| `FLOWER_PORT`             | `5555`               | Port for Flower monitoring dashboard           |
| `WORKER_SHELL_WORKER_ID`  | `worker-1`           | Identifier for the worker shell relay          |

---

## SSL / TLS Setup

### Let's Encrypt (Recommended)

1. Ensure your domain's DNS points to this server
2. Ensure port 80 is reachable from the internet
3. Run:
    ```bash
    make certbot DOMAIN=codepost.youruniversity.edu EMAIL=admin@youruniversity.edu
    ```
4. Start with auto-renewal:
    ```bash
    docker compose --profile certbot up -d
    ```

Certificates auto-renew every 12 hours via the certbot container.

### Manual Certificates

Place your certificate and key in `./certs/`:

- `certs/fullchain.pem` — Full certificate chain
- `certs/privkey.pem` — Private key

Restart the proxy after updating certificates:

```bash
docker compose restart proxy
```

---

## Autograder Setup

The autograder executes student code in isolated Docker containers. It requires:

1. **Docker socket access**: The worker container mounts `/var/run/docker.sock` to spawn sibling containers
2. **Base images**: Pre-pull the language images used by your courses:
    ```bash
    make pull-images   # Pulls Python, Java, Node, C/C++ images
    ```

### Security Considerations

- The worker container runs in **privileged mode** to manage Docker containers
- Student code runs in **unprivileged containers** with strict resource limits:
    - 1 GB RAM limit
    - 1 CPU
    - 500 PID limit
    - No new privileges (`--security-opt=no-new-privileges`)
    - All capabilities dropped (`--cap-drop=ALL`)
- For maximum isolation, run the worker on a **separate dedicated host** and connect it to the same Docker network

### Separate Worker Host

To run the autograder on a different machine:

1. Copy the `.env` file to the worker host
2. Use `docker-compose-worker.yml` from `codePost-api/` on the worker host
3. Set `DB_HOSTNAME` to the IP/hostname of the database server
4. Ensure the worker can reach Redis and MariaDB on the API host

---

## Operations

### Common Commands

```bash
make status          # Show container status
make logs            # Tail all logs
make logs-api        # Tail API logs only
make logs-worker     # Tail worker logs only
make shell           # Open Django management shell
make migrate         # Run database migrations
make monitoring      # Start with Flower dashboard
```

### Checking Health

All containers have health checks. View their status:

```bash
docker compose ps
```

Healthy output:

```
NAME                  STATUS
codepost-api          Up (healthy)
codepost-ui           Up (healthy)
codepost-database     Up (healthy)
codepost-redis        Up (healthy)
codepost-worker       Up (healthy)
codepost-proxy        Up (healthy)
```

### Viewing API Token

The admin user's API token is printed in the API container logs on first startup:

```bash
docker compose logs api | grep "API Token"
```

---

## Backup & Restore

### Database Backup

```bash
make backup-db
```

Backups are saved to `./backups/` with timestamps (e.g., `codepost-20260316-143000.sql`).

### Database Restore

```bash
make restore-db FILE=backups/codepost-20260316-143000.sql
```

### What to Back Up

| Data                | Location                              | Method           |
| :------------------ | :------------------------------------ | :--------------- |
| Database            | `codepost-db-data` volume             | `make backup-db` |
| Assignment datasets | `HOST_DATASET_ROOT` (`/mnt/datasets`) | rsync / tar      |
| Environment config  | `.env`                                | File copy        |
| SSL certificates    | `./certs/`                            | File copy        |

---

## Upgrading

### Standard Upgrade

```bash
make update
```

This will:

1. Pull latest code from all repositories
2. Rebuild Docker images
3. Restart all services
4. Run database migrations

### Manual Upgrade

```bash
# 1. Pull latest code
cd ../codePost-api && git pull && cd ../codePost-ui && git pull && cd ../codePost

# 2. Back up the database first
make backup-db

# 3. Rebuild and restart
make build
make up

# 4. Run migrations
make migrate
```

### Rolling Back

If an upgrade causes issues:

1. Stop services: `make down`
2. Restore the database: `make restore-db FILE=backups/<your-backup>.sql`
3. Check out the previous version: `cd ../codePost-api && git checkout <previous-tag>`
4. Rebuild and restart: `make build && make up`

---

## Troubleshooting

### Container won't start

```bash
# Check logs for the specific service
docker compose logs <service-name>

# Common services: api, ui, database, redis, worker, proxy
```

### Database connection errors

- Ensure `DB_PASSWORD` in `.env` matches what was used on first database creation
- Check that the database container is healthy: `docker compose ps database`
- The database takes ~30 seconds to initialize on first run

### SSL errors

- Verify certificate files exist: `ls -la certs/`
- Check nginx config: `docker compose exec proxy nginx -t`
- For Let's Encrypt, ensure port 80 is reachable from the internet

### API returns 500 errors

- Check API logs: `make logs-api`
- Verify `FIELD_ENCRYPTION_KEY` hasn't changed (changing it breaks encrypted fields)
- Run migrations: `make migrate`

### Autograder not running

- Check worker health: `docker compose ps worker`
- Verify Docker socket is mounted: `docker compose exec worker docker info`
- Check worker logs: `make logs-worker`
- Ensure base images are pulled: `make pull-images`

### Email not sending

- Verify `EMAIL_HOST` is reachable from inside the container:
    ```bash
    docker compose exec api python -c \
      "import smtplib; s = smtplib.SMTP('$EMAIL_HOST', 25); print(s.ehlo()); s.quit()"
    ```
- Check that your SMTP server allows relaying from Docker container IPs

---

## Appendix: Port Reference

| Service       | Internal Port | Exposed Port | Notes                            |
| :------------ | :------------ | :----------- | :------------------------------- |
| Proxy (nginx) | 80, 443       | 80, 443      | Only exposed service             |
| API (Django)  | 8000          | —            | Internal only, proxied           |
| UI (React)    | 8443          | —            | Internal only, proxied           |
| MariaDB       | 3306          | —            | Internal only                    |
| Redis         | 6379          | —            | Internal only                    |
| Worker        | —             | —            | Internal only                    |
| Flower        | 5555          | 5555         | Only with `--profile monitoring` |
