#!/bin/bash
# Copyright © 2026 Rutgers, the State University of New Jersey. All rights reserved except as defined by the Rutgers Non-Commercial Licensed, included with this software.
#
# Certbot / Let's Encrypt initialization script
# Obtains initial SSL certificates for your domain.
#
# Usage:
#   ./deploy/certbot-init.sh yourdomain.com admin@yourdomain.com
#
# Prerequisites:
#   - DNS for your domain must point to this server
#   - Port 80 must be reachable from the internet
#   - The proxy container must be running (for ACME challenge)
set -e

DOMAIN="${1:?Usage: $0 <domain> <email>}"
EMAIL="${2:?Usage: $0 <domain> <email>}"
COMPOSE_FILE="${3:-docker-compose.yml}"

echo "═══════════════════════════════════════════════════"
echo "  codePost — Let's Encrypt Certificate Setup"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  Domain: ${DOMAIN}"
echo "  Email:  ${EMAIL}"
echo ""

# Create temporary self-signed cert so nginx can start
mkdir -p ./certs/live/"${DOMAIN}"
if [ ! -f ./certs/live/"${DOMAIN}"/fullchain.pem ]; then
    echo "[certbot] Creating temporary self-signed certificate..."
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout ./certs/live/"${DOMAIN}"/privkey.pem \
        -out ./certs/live/"${DOMAIN}"/fullchain.pem \
        -subj "/CN=${DOMAIN}" 2>/dev/null
    echo "[certbot] Temporary cert created."
fi

# Symlink certs to where nginx expects them
ln -sf live/"${DOMAIN}"/fullchain.pem ./certs/fullchain.pem
ln -sf live/"${DOMAIN}"/privkey.pem ./certs/privkey.pem

# Start proxy for ACME challenge (if not already running)
echo "[certbot] Starting proxy for ACME challenge..."
docker compose -f "${COMPOSE_FILE}" up -d proxy

echo "[certbot] Requesting certificate from Let's Encrypt..."
docker compose -f "${COMPOSE_FILE}" run --rm certbot \
    certbot certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email "${EMAIL}" \
    --agree-tos \
    --no-eff-email \
    -d "${DOMAIN}"

echo "[certbot] Certificate obtained. Restarting proxy with real cert..."
docker compose -f "${COMPOSE_FILE}" restart proxy

echo ""
echo "═══════════════════════════════════════════════════"
echo "  SSL certificate installed successfully!"
echo ""
echo "  Certificate auto-renewal is handled by the"
echo "  certbot container (runs every 12 hours)."
echo ""
echo "  To enable auto-renewal, start with:"
echo "    docker compose -f ${COMPOSE_FILE} --profile certbot up -d"
echo "═══════════════════════════════════════════════════"
