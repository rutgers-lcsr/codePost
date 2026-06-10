#!/usr/bin/env bash
# Copyright © 2026 Rutgers, the State University of New Jersey. All rights reserved except as defined by the Rutgers Non-Commercial Licensed, included with this software.
#
# codePost — Update Script
#
# Updates a running codePost installation by pulling the latest source
# and rebuilding Docker images.
#
# Usage:
#   ./update.sh                # Update to latest

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }

echo ""
info "Updating codePost..."
echo ""

# ─── Verify Install Directory ────────────────────────────────────────
if [[ ! -f ".env" ]] || [[ ! -f "docker-compose.yml" ]]; then
    error "No codePost installation found in $(pwd). Run this script from your install directory."
fi

# ─── Backup Database ─────────────────────────────────────────────────
if docker inspect codepost-database --format='{{.State.Running}}' 2>/dev/null | grep -q true; then
    info "Backing up database before update..."
    mkdir -p backups
    BACKUP_FILE="backups/codepost-pre-update-$(date +%Y%m%d-%H%M%S).sql"
    if docker compose exec -T database sh -c \
        'mariadb-dump -u root --password="$MARIADB_ROOT_PASSWORD" \
        --single-transaction --routines --triggers "$MARIADB_DATABASE"' \
        > "$BACKUP_FILE"; then
        ok "Database backed up to $BACKUP_FILE"
    else
        rm -f "$BACKUP_FILE"
        error "Database backup failed. Aborting update — fix the backup first or run 'make backup-db' manually."
    fi
else
    warn "Database container is not running — skipping pre-update backup."
fi

# ─── Pull Latest Source ──────────────────────────────────────────────
info "Pulling latest source code..."

for repo in . ../codePost-api ../codePost-ui; do
    if [[ -d "$repo/.git" ]]; then
        info "  Updating $(cd "$repo" && basename "$(pwd)")..."
        git -C "$repo" pull --ff-only || warn "  Could not fast-forward $(basename "$repo"). You may need to resolve conflicts manually."
    else
        warn "  $repo is not a git repository — skipping."
    fi
done

# ─── Rebuild Images ──────────────────────────────────────────────────
info "Rebuilding Docker images..."
docker compose build

# ─── Restart Services ────────────────────────────────────────────────
info "Restarting services..."
docker compose up -d

# ─── Run Migrations ──────────────────────────────────────────────────
info "Waiting for API to become healthy..."
ATTEMPTS=0
MAX_ATTEMPTS=36  # 3 minutes

while [[ $ATTEMPTS -lt $MAX_ATTEMPTS ]]; do
    if docker inspect codepost-api --format='{{.State.Health.Status}}' 2>/dev/null | grep -q "healthy"; then
        break
    fi
    ATTEMPTS=$((ATTEMPTS + 1))
    sleep 5
done

if [[ $ATTEMPTS -ge $MAX_ATTEMPTS ]]; then
    error "API did not become healthy in time. Check logs: docker compose logs api"
fi

info "Running database migrations..."
docker compose exec api python manage.py migrate --noinput

# ─── Health Check ────────────────────────────────────────────────────
ok "API is healthy."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e " ${GREEN}Update complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Check status:  docker compose ps"
echo "  View logs:     docker compose logs -f"
echo ""
