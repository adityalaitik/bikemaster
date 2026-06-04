#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# setup.sh — First-time local DB setup for a new developer.
#
# Prerequisites: MySQL 8.0+ running locally.
# Run once after cloning the repo:
#   chmod +x db1/scripts/setup.sh
#   ./db1/scripts/setup.sh
#
# What it does:
#   1. Creates the 'bikemaster' database and 'admin' user
#   2. Applies the full schema     (db1/schema/schema.sql)
#   3. Loads master reference data (db1/seeds/seed_master.sql)
#   4. Loads transactional data    (db1/seeds/seed_transactional.sql)
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Config (override via env vars) ───────────────────────────────────────────
ROOT_USER="${MYSQL_ROOT_USER:-root}"
ROOT_PASS="${MYSQL_ROOT_PASS:-}"   # leave blank → mysql prompts for password
APP_USER="admin"
APP_PASS="LeOmm@8769"
APP_DB="bikemaster"
MYSQL_HOST="${MYSQL_HOST:-localhost}"
MYSQL_PORT="${MYSQL_PORT:-3306}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DB1_DIR="$(dirname "$SCRIPT_DIR")"

SCHEMA_FILE="$DB1_DIR/schema/schema.sql"
MASTER_FILE="$DB1_DIR/seeds/seed_master.sql"
TXNAL_FILE="$DB1_DIR/seeds/seed_transactional.sql"
DCL_FILE="$DB1_DIR/dcl/permissions.sql"

# ── Helpers ───────────────────────────────────────────────────────────────────
run_root() {
  if [[ -n "$ROOT_PASS" ]]; then
    mysql -u"$ROOT_USER" -p"$ROOT_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" "$@"
  else
    mysql -u"$ROOT_USER" -h"$MYSQL_HOST" -P"$MYSQL_PORT" "$@"
  fi
}

run_app() {
  mysql -u"$APP_USER" -p"$APP_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" "$@"
}

# ── Step 1 — Database + user ──────────────────────────────────────────────────
echo "Creating database and user ..."

run_root <<SQL
CREATE DATABASE IF NOT EXISTS \`$APP_DB\`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS '$APP_USER'@'localhost' IDENTIFIED BY '$APP_PASS';
CREATE USER IF NOT EXISTS '$APP_USER'@'%'         IDENTIFIED BY '$APP_PASS';

GRANT ALL PRIVILEGES ON \`$APP_DB\`.* TO '$APP_USER'@'localhost';
GRANT ALL PRIVILEGES ON \`$APP_DB\`.* TO '$APP_USER'@'%';
FLUSH PRIVILEGES;
SQL

echo "  Database '$APP_DB' and user '$APP_USER' ready"

# ── Step 2 — Schema ───────────────────────────────────────────────────────────
[[ -f "$SCHEMA_FILE" ]] || { echo "ERROR: $SCHEMA_FILE not found"; exit 1; }
echo "Applying schema ..."
run_app "$APP_DB" < "$SCHEMA_FILE"
echo "  Schema applied"

# ── Step 3 — Master seed data ─────────────────────────────────────────────────
if [[ -f "$MASTER_FILE" ]]; then
  echo "Loading master reference data ..."
  sed 's/^INSERT INTO/INSERT IGNORE INTO/g' "$MASTER_FILE" | run_app "$APP_DB"
  echo "  Master seed data loaded"
fi

# ── Step 4 — Transactional seed data ──────────────────────────────────────────
if [[ -f "$TXNAL_FILE" ]]; then
  echo "Loading transactional seed data ..."
  sed 's/^INSERT INTO/INSERT IGNORE INTO/g' "$TXNAL_FILE" | run_app "$APP_DB"
  echo "  Transactional seed data loaded"
fi

echo ""
echo "Setup complete! Start the API with:  npm run dev --workspace=apps/api"
echo "Start the web  with:  npm run dev --workspace=apps/web"
