#!/usr/bin/env bash
# Copyright © 2026 Rutgers, the State University of New Jersey. All rights reserved except as defined by the Rutgers Non-Commercial Licensed, included with this software.
#
# codePost — Self-Hosted Installer
#
# Installs codePost on a fresh Linux server. Clone the repo and run:
#   git clone https://github.com/rutgers-lcsr/codePost.git && cd codePost && bash install.sh

set -euo pipefail

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

# Python 3 (for generating Fernet encryption key)
if ! command -v python3 &> /dev/null; then
    error "Python 3 is not installed. Install python3 first."
fi

# RAM check
TOTAL_RAM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
TOTAL_RAM_GB=$((TOTAL_RAM_KB / 1024 / 1024))
if [[ "$TOTAL_RAM_GB" -lt 4 ]]; then
    error "Insufficient RAM: ${TOTAL_RAM_GB}GB detected. Minimum 8GB required (16GB recommended for autograder)."
elif [[ "$TOTAL_RAM_GB" -lt 8 ]]; then
    warn "Only ${TOTAL_RAM_GB}GB RAM detected. 8GB minimum recommended (16GB for autograder)."
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

    # Prompt for required values
    read -rp "  Domain name (e.g., codepost.youruniversity.edu): " DOMAIN
    if [[ -z "$DOMAIN" ]]; then
        error "Domain name is required."
    fi

    read -rp "  Admin email: " ADMIN_EMAIL
    if [[ -z "$ADMIN_EMAIL" ]]; then
        error "Admin email is required."
    fi

    read -rsp "  Admin password: " ADMIN_PASSWORD
    echo ""
    if [[ -z "$ADMIN_PASSWORD" ]]; then
        error "Admin password is required."
    fi

    read -rp "  SMTP host (for sending emails, press Enter to skip): " SMTP_HOST
    SMTP_HOST="${SMTP_HOST:-localhost}"

    # Generate secrets
    SECRET_KEY=$(openssl rand -base64 48 | tr -d '\n')
    FIELD_ENCRYPTION_KEY=$(python3 -c "import base64, os; print(base64.urlsafe_b64encode(os.urandom(32)).decode())")
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
    echo ""
    warn "No SSL certificates found in ./certs/"
    echo ""
    echo "  Options:"
    echo "    1) Place your certificates manually:"
    echo "       cp /path/to/fullchain.pem certs/fullchain.pem"
    echo "       cp /path/to/privkey.pem certs/privkey.pem"
    echo ""
    echo "    2) Use Let's Encrypt (after starting services):"
    echo "       make certbot DOMAIN=$DOMAIN EMAIL=$ADMIN_EMAIL"
    echo ""

    # Generate self-signed cert for initial startup
    info "Generating self-signed certificate for initial startup..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout certs/privkey.pem \
        -out certs/fullchain.pem \
        -subj "/CN=${DOMAIN:-localhost}" \
        2>/dev/null
    warn "Using self-signed certificate. Replace with real certs for production."
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
echo "  Install:  $INSTALL_DIR"
echo ""
echo "  Useful commands:"
echo "    docker compose ps          # Check service status"
echo "    docker compose logs -f     # View logs"
echo "    ./update.sh                # Update to latest version"
echo "    make backup-db             # Backup database"
echo ""
if [[ ! -f "certs/fullchain.pem" ]] || openssl x509 -in certs/fullchain.pem -noout -issuer 2>/dev/null | grep -q "CN = ${DOMAIN:-localhost}"; then
    echo -e "  ${YELLOW}⚠ Using self-signed certificate. Set up real SSL:${NC}"
    echo "    make certbot DOMAIN=${DOMAIN:-yourdomain.com} EMAIL=${ADMIN_EMAIL:-admin@example.com}"
    echo ""
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
