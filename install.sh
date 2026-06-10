#!/usr/bin/env bash
# Copyright © 2026 Rutgers, the State University of New Jersey. All rights reserved except as defined by the Rutgers Non-Commercial Licensed, included with this software.
#
# codePost — Self-Hosted Installer
#
# Installs codePost on a fresh Linux server. Clone the repo and run:
#   git clone https://github.com/rutgers-lcsr/codePost.git && cd codePost && bash install.sh
#
# For a quick local evaluation (no domain, DNS, or SMTP required):
#   bash install.sh --local

set -euo pipefail

# ─── Options ──────────────────────────────────────────────────────────
LOCAL_MODE=false
GENERATED_ADMIN_PASSWORD=false
SELF_SIGNED=false
for arg in "$@"; do
    case "$arg" in
        --local) LOCAL_MODE=true ;;
        -h|--help)
            echo "Usage: install.sh [--local]"
            echo ""
            echo "  --local   Evaluation install on this machine: uses localhost,"
            echo "            a self-signed certificate, and generated admin"
            echo "            credentials. No domain, DNS, or SMTP needed."
            echo ""
            echo "Environment overrides (skip the corresponding prompt, for"
            echo "non-interactive installs):"
            echo "  CODEPOST_INSTALL_DIR, CODEPOST_DOMAIN, CODEPOST_ADMIN_EMAIL,"
            echo "  CODEPOST_ADMIN_PASSWORD, CODEPOST_SMTP_HOST"
            exit 0 ;;
        *) echo "Unknown option: $arg (see --help)" >&2; exit 1 ;;
    esac
done

# ─── Colors ───────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }

# ─── Banner ───────────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}"
echo "  ██████╗ ██████╗ ██████╗ ███████╗██████╗  ██████╗ ███████╗████████╗"
echo " ██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝"
echo " ██║     ██║   ██║██║  ██║█████╗  ██████╔╝██║   ██║███████╗   ██║   "
echo " ██║     ██║   ██║██║  ██║██╔══╝  ██╔═══╝ ██║   ██║╚════██║   ██║   "
echo " ╚██████╗╚██████╔╝██████╔╝███████╗██║     ╚██████╔╝███████║   ██║   "
echo "  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚══════╝   ╚═╝   "
echo -e "${NC}"
echo "  Self-Hosted Installer"
echo ""

# ─── Prerequisite Checks ─────────────────────────────────────────────
info "Checking prerequisites..."

# Must be Linux
if [[ "$(uname -s)" != "Linux" ]]; then
    error "This installer only supports Linux. Detected: $(uname -s)"
fi

# Docker
if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Install Docker 24+ first: https://docs.docker.com/engine/install/"
fi

DOCKER_VERSION=$(docker version --format '{{.Server.Version}}' 2>/dev/null || echo "0.0.0")
DOCKER_MAJOR=$(echo "$DOCKER_VERSION" | cut -d. -f1)
if [[ "$DOCKER_MAJOR" -lt 24 ]]; then
    warn "Docker version $DOCKER_VERSION detected. Version 24+ is recommended."
fi

# Docker Compose v2
if ! docker compose version &> /dev/null; then
    error "Docker Compose v2 is not available. Install it: https://docs.docker.com/compose/install/"
fi

# Git
if ! command -v git &> /dev/null; then
    error "Git is not installed. Install git first: https://git-scm.com/downloads"
fi

# OpenSSL (for generating secrets and self-signed certs)
if ! command -v openssl &> /dev/null; then
    error "OpenSSL is not installed. Install openssl first."
fi

# RAM check
TOTAL_RAM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
TOTAL_RAM_GB=$((TOTAL_RAM_KB / 1024 / 1024))
if [[ "$TOTAL_RAM_GB" -lt 4 ]]; then
    error "Insufficient RAM: ${TOTAL_RAM_GB}GB detected. At least 4GB is required to build and run (8GB recommended, 16GB with autograder)."
elif [[ "$TOTAL_RAM_GB" -lt 8 ]]; then
    warn "Only ${TOTAL_RAM_GB}GB RAM detected. 8GB recommended (16GB with autograder)."
fi

# Ports 80/443 must be free for the reverse proxy
if command -v ss &> /dev/null; then
    for port in 80 443; do
        if ss -ltn "( sport = :$port )" 2>/dev/null | grep -q LISTEN; then
            warn "Port $port is already in use. The codePost proxy needs ports 80 and 443 — stop the conflicting service before starting."
        fi
    done
fi

ok "Prerequisites satisfied (Docker $DOCKER_VERSION, ${TOTAL_RAM_GB}GB RAM)"

# ─── Installation Directory ──────────────────────────────────────────
if [[ -n "${CODEPOST_INSTALL_DIR:-}" ]]; then
    INSTALL_DIR="$CODEPOST_INSTALL_DIR"
elif [[ -f "./docker-compose.yml" ]] && grep -q "codepost" "./docker-compose.yml" 2>/dev/null; then
    INSTALL_DIR="$(pwd)"
else
    read -rp "  Install directory [$(pwd)]: " INSTALL_DIR
    INSTALL_DIR="${INSTALL_DIR:-$(pwd)}"
fi

if [[ ! -f "$INSTALL_DIR/docker-compose.yml" ]]; then
    info "Installing to $INSTALL_DIR"
    mkdir -p "$INSTALL_DIR"
    if [[ -n "$(ls -A "$INSTALL_DIR" 2>/dev/null)" ]]; then
        error "Directory $INSTALL_DIR is not empty and does not contain a codePost installation. Choose an empty directory."
    fi
    cd "$INSTALL_DIR"
    # Clone the deployment repo if not already present
    info "Cloning codePost deployment repo..."
    git clone https://github.com/rutgers-lcsr/codePost.git .
fi

cd "$INSTALL_DIR"
info "Working directory: $INSTALL_DIR"

# ─── Clone Source Repositories ────────────────────────────────────────
# The docker-compose.yml builds images from sibling repos: ../codePost-api and ../codePost-ui
GITHUB_ORG="https://github.com/rutgers-lcsr"

if [[ ! -d "../codePost-api" ]]; then
    info "Cloning codePost-api..."
    git clone "${GITHUB_ORG}/codePost-api.git" ../codePost-api
else
    ok "codePost-api repo found at ../codePost-api"
fi

if [[ ! -d "../codePost-ui" ]]; then
    info "Cloning codePost-ui..."
    git clone "${GITHUB_ORG}/codePost-ui.git" ../codePost-ui
else
    ok "codePost-ui repo found at ../codePost-ui"
fi

# ─── Configuration ───────────────────────────────────────────────────
if [[ -f ".env" ]]; then
    warn ".env already exists. Skipping configuration."
    echo "  To reconfigure, delete .env and re-run this script."
else
    info "Generating configuration..."
    echo ""

    if [[ "$LOCAL_MODE" == true ]]; then
        DOMAIN="${CODEPOST_DOMAIN:-localhost}"
        ADMIN_EMAIL="${CODEPOST_ADMIN_EMAIL:-admin@example.com}"
        if [[ -n "${CODEPOST_ADMIN_PASSWORD:-}" ]]; then
            ADMIN_PASSWORD="$CODEPOST_ADMIN_PASSWORD"
        else
            ADMIN_PASSWORD=$(openssl rand -base64 18 | tr -d '/+=' | head -c 16)
            GENERATED_ADMIN_PASSWORD=true
        fi
        SMTP_HOST="${CODEPOST_SMTP_HOST:-localhost}"
        info "Local evaluation mode: domain=localhost, self-signed SSL, admin=${ADMIN_EMAIL}"
    else
        # Prompt for required values (env vars skip the prompt)
        DOMAIN="${CODEPOST_DOMAIN:-}"
        if [[ -z "$DOMAIN" ]]; then
            read -rp "  Domain name (e.g., codepost.youruniversity.edu): " DOMAIN
        fi
        if [[ -z "$DOMAIN" ]]; then
            error "Domain name is required."
        fi

        ADMIN_EMAIL="${CODEPOST_ADMIN_EMAIL:-}"
        if [[ -z "$ADMIN_EMAIL" ]]; then
            read -rp "  Admin email: " ADMIN_EMAIL
        fi
        if [[ -z "$ADMIN_EMAIL" ]]; then
            error "Admin email is required."
        fi

        ADMIN_PASSWORD="${CODEPOST_ADMIN_PASSWORD:-}"
        if [[ -z "$ADMIN_PASSWORD" ]]; then
            read -rsp "  Admin password: " ADMIN_PASSWORD
            echo ""
        fi
        if [[ -z "$ADMIN_PASSWORD" ]]; then
            error "Admin password is required."
        fi

        SMTP_HOST="${CODEPOST_SMTP_HOST:-}"
        if [[ -z "$SMTP_HOST" ]]; then
            read -rp "  SMTP host (for sending emails, press Enter to skip): " SMTP_HOST
        fi
        SMTP_HOST="${SMTP_HOST:-localhost}"
    fi

    # Generate secrets
    SECRET_KEY=$(openssl rand -base64 48 | tr -d '\n')
    # FIELD_ENCRYPTION_KEY must be a valid Fernet key: urlsafe base64 of 32 bytes
    FIELD_ENCRYPTION_KEY=$(openssl rand -base64 32 | tr '+/' '-_')
    WORKER_SHELL_SECRET=$(openssl rand -base64 32 | tr -d '\n')
    DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+\n' | head -c 32)
    ROOT_DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+\n' | head -c 32)

    # Determine URLs
    API_URL="https://${DOMAIN}"
    CLIENT_URL="https://${DOMAIN}"

    # Write .env
    cat > .env << EOF
# ─── codePost Configuration ──────────────────────────────────────────
# Generated by install.sh on $(date -u +"%Y-%m-%d %H:%M:%S UTC")

# ─── Domain & URLs ───────────────────────────────────────────────────
NGINX_SERVER_NAME=${DOMAIN}
API_URL=${API_URL}
CLIENT_URL=${CLIENT_URL}

# ─── Security ────────────────────────────────────────────────────────
SECRET_KEY=${SECRET_KEY}
FIELD_ENCRYPTION_KEY=${FIELD_ENCRYPTION_KEY}
WORKER_SHELL_SHARED_SECRET=${WORKER_SHELL_SECRET}

# ─── Admin Account ───────────────────────────────────────────────────
API_USER=${ADMIN_EMAIL}
API_PASSWORD=${ADMIN_PASSWORD}

# ─── Database ────────────────────────────────────────────────────────
DB_NAME=codepost
DB_USERNAME=codepost_user
DB_PASSWORD=${DB_PASSWORD}
ROOT_DATABASE_PASSWORD=${ROOT_DB_PASSWORD}

# ─── Email ───────────────────────────────────────────────────────────
EMAIL_HOST=${SMTP_HOST}
DEFAULT_EMAIL_FROM=no-reply@${DOMAIN}

# ─── Autograder ──────────────────────────────────────────────────────
CELERY_CONCURRENCY=4
AUTOGRADER_AUTO_EXECUTE=true
HOST_DATASET_ROOT=/mnt/datasets

# ─── Optional ────────────────────────────────────────────────────────
# DEBUG=FALSE
# FLOWER_PORT=5555
# INNODB_BUFFER_POOL_SIZE=1G
# SUPPORT_URL=https://github.com/rutgers-lcsr/codePost/issues
# ADMIN_EMAILS=
EOF

    ok "Configuration written to .env"
fi

# ─── SSL Certificates ────────────────────────────────────────────────
mkdir -p certs

if [[ -f "certs/fullchain.pem" ]] && [[ -f "certs/privkey.pem" ]]; then
    ok "SSL certificates found in ./certs/"
else
    if [[ "$LOCAL_MODE" != true ]]; then
        echo ""
        warn "No SSL certificates found in ./certs/"
        echo ""
        echo "  Options:"
        echo "    1) Place your certificates manually:"
        echo "       cp /path/to/fullchain.pem certs/fullchain.pem"
        echo "       cp /path/to/privkey.pem certs/privkey.pem"
        echo ""
        echo "    2) Use Let's Encrypt (after starting services):"
        echo "       make certbot DOMAIN=${DOMAIN:-yourdomain.com} EMAIL=${ADMIN_EMAIL:-admin@example.com}"
        echo ""
    fi

    # Generate self-signed cert for initial startup
    info "Generating self-signed certificate for initial startup..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout certs/privkey.pem \
        -out certs/fullchain.pem \
        -subj "/CN=${DOMAIN:-localhost}" \
        2>/dev/null
    SELF_SIGNED=true
    if [[ "$LOCAL_MODE" != true ]]; then
        warn "Using self-signed certificate. Replace with real certs for production."
    fi
fi

# ─── Build & Start ───────────────────────────────────────────────────
echo ""
info "Building Docker images from source (this may take a few minutes)..."
docker compose build

echo ""
info "Starting codePost..."
docker compose up -d

# ─── Wait for Health ─────────────────────────────────────────────────
info "Waiting for services to become healthy..."
ATTEMPTS=0
MAX_ATTEMPTS=60

while [[ $ATTEMPTS -lt $MAX_ATTEMPTS ]]; do
    if docker compose ps --format json 2>/dev/null | grep -q '"Health":"healthy"' || \
       docker compose ps 2>/dev/null | grep -q "(healthy)"; then
        # Check if API is healthy specifically
        if docker inspect codepost-api --format='{{.State.Health.Status}}' 2>/dev/null | grep -q "healthy"; then
            break
        fi
    fi
    ATTEMPTS=$((ATTEMPTS + 1))
    sleep 5
done

if [[ $ATTEMPTS -ge $MAX_ATTEMPTS ]]; then
    warn "Services are still starting. Check status with: docker compose ps"
    echo "  View logs with: docker compose logs -f"
else
    ok "All services are healthy!"
fi

# ─── Summary ─────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e " ${GREEN}codePost is running!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  URL:      https://${DOMAIN:-localhost}"
echo "  Admin:    ${ADMIN_EMAIL:-<from .env>}"
if [[ "$GENERATED_ADMIN_PASSWORD" == true ]]; then
    echo "  Password: ${ADMIN_PASSWORD}   (generated — also saved as API_PASSWORD in .env)"
fi
echo "  Install:  $INSTALL_DIR"
if [[ "$LOCAL_MODE" == true ]]; then
    echo ""
    echo "  Local evaluation mode uses a self-signed certificate — your"
    echo "  browser will show a security warning you can safely bypass."
fi
echo ""
echo "  Next steps:"
echo "    1. Log in at https://${DOMAIN:-localhost} with the admin account above"
echo "    2. Create your Organization at https://${DOMAIN:-localhost}/admin/"
echo "       (university name, email domain, SSO settings)"
echo "    3. Pre-pull autograder base images:  make pull-images"
if [[ "$SELF_SIGNED" == true ]] && [[ "$LOCAL_MODE" != true ]]; then
    echo -e "    4. ${YELLOW}Replace the self-signed certificate with real SSL:${NC}"
    echo "       make certbot DOMAIN=${DOMAIN:-yourdomain.com} EMAIL=${ADMIN_EMAIL:-admin@example.com}"
fi
echo ""
echo "  Useful commands:"
echo "    docker compose ps          # Check service status"
echo "    docker compose logs -f     # View logs"
echo "    ./update.sh                # Update to latest version"
echo "    make backup-db             # Backup database"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
