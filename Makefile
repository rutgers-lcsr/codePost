# Copyright © 2026 Rutgers, the State University of New Jersey. All rights reserved except as defined by the Rutgers Non-Commercial Licensed, included with this software.
#
# codePost — Deployment Makefile
# Common operations for managing a self-hosted codePost instance.

COMPOSE := docker compose
COMPOSE_MONITOR := $(COMPOSE) --profile monitoring
COMPOSE_CERTBOT := $(COMPOSE) --profile certbot

.PHONY: help setup up down restart logs status build \
        backup-db restore-db migrate shell certbot monitoring update

help: ## Show this help
	@echo "codePost Deployment Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
	@echo ""

# ─── Setup ────────────────────────────────────────────────────────────

setup: ## Initial setup — create .env from template
	@if [ -f .env ]; then \
		echo ".env already exists. Use 'make setup-force' to overwrite."; \
	else \
		cp .env.example .env; \
		echo "Created .env from template. Edit it with your values before running 'make up'."; \
		echo ""; \
		echo "Required: change all CHANGE_ME values in .env"; \
		echo "Or run the full installer instead: bash install.sh"; \
	fi

setup-force: ## Recreate .env from template (overwrites existing)
	cp .env.example .env
	@echo "Created .env from template. Edit it with your values."

# ─── Core Operations ─────────────────────────────────────────────────

build: ## Build Docker images from source
	$(COMPOSE) build

up: ## Build and start all services
	$(COMPOSE) up -d --build
	@echo ""
	@echo "codePost is starting. Check status with: make status"
	@echo "View logs with: make logs"

down: ## Stop all services
	$(COMPOSE) down

restart: ## Restart all services
	$(COMPOSE) restart

status: ## Show container status
	$(COMPOSE) ps

logs: ## Tail logs from all services
	$(COMPOSE) logs -f --tail=100

logs-api: ## Tail API logs only
	$(COMPOSE) logs -f --tail=100 api

logs-worker: ## Tail worker logs only
	$(COMPOSE) logs -f --tail=100 worker

# ─── Database ─────────────────────────────────────────────────────────

migrate: ## Run Django database migrations
	$(COMPOSE) exec api python manage.py migrate --noinput

shell: ## Open Django management shell
	$(COMPOSE) exec api python manage.py shell

backup-db: ## Backup database to ./backups/
	@mkdir -p backups
	$(COMPOSE) exec -T database sh -c \
		'mariadb-dump -u root --password="$$MARIADB_ROOT_PASSWORD" \
		--single-transaction --routines --triggers "$$MARIADB_DATABASE"' \
		> backups/codepost-$$(date +%Y%m%d-%H%M%S).sql
	@echo "Backup saved to backups/"

restore-db: ## Restore database from backup (usage: make restore-db FILE=backups/file.sql)
	@if [ -z "$(FILE)" ]; then echo "Usage: make restore-db FILE=backups/file.sql"; exit 1; fi
	$(COMPOSE) exec -T database sh -c \
		'mariadb -u root --password="$$MARIADB_ROOT_PASSWORD" "$$MARIADB_DATABASE"' \
		< $(FILE)
	@echo "Database restored from $(FILE)"

# ─── Autograder ──────────────────────────────────────────────────────

pull-images: ## Pre-pull Docker images used by the autograder
	@echo "Pulling autograder base images..."
	docker pull python:3.12-slim
	docker pull openjdk:8-jdk-alpine
	docker pull eclipse-temurin:17-jdk
	docker pull node:20-slim
	docker pull gcc:latest
	@echo "All base images pulled."

# ─── Monitoring & SSL ────────────────────────────────────────────────

monitoring: ## Start with Flower monitoring dashboard
	$(COMPOSE_MONITOR) up -d
	@echo "Flower dashboard available at http://localhost:$${FLOWER_PORT:-5555}"

certbot: ## Initialize Let's Encrypt SSL (usage: make certbot DOMAIN=... EMAIL=...)
	@if [ -z "$(DOMAIN)" ] || [ -z "$(EMAIL)" ]; then \
		echo "Usage: make certbot DOMAIN=yourdomain.com EMAIL=admin@yourdomain.com"; exit 1; \
	fi
	bash deploy/certbot-init.sh $(DOMAIN) $(EMAIL)

# ─── Updates ─────────────────────────────────────────────────────────

update: ## Pull latest source, rebuild, migrate, and restart
	bash update.sh
