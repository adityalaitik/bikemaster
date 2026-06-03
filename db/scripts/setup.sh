#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# setup.sh — First-time local DB setup for a new developer.
#
# Run once after cloning the repo (MySQL must already be running):
#   ./db/scripts/setup.sh
#
# What it does:
#   1. Creates the 'bikemaster' database and 'admin' user (if they don't exist)
#   2. Applies the full schema  (db/schema/schema.sql)
#   3. Loads all seed / reference data (db/seeds/seed_data.sql)
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
ROOT_USER="${MYSQL_ROOT_USER:-root}"
ROOT_PASS="${MYSQL_ROOT_PASS:-}"          # leave blank to be prompted
APP_USER="admin"
APP_PASS="LeOmm@8769"
APP_DB="bikemaster"
MYSQL_HOST="${MYSQL_HOST:-localhost}"
MYSQL_PORT="${MYSQL_PORT:-3306}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DB_DIR="$(dirname "$SCRIPT_DIR")"

SCHEMA_FILE="$DB_DIR/schema/schema.sql"
SEED_FILE="$DB_DIR/seeds/seed_data.sql"

# ── Helper ────────────────────────────────────────────────────────────────────
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

# ── Step 1 — Create DB and user ───────────────────────────────────────────────
echo "🔧 Creating database and user …"

run_root <<SQL
CREATE DATABASE IF NOT EXISTS \`$APP_DB\`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS '$APP_USER'@'%' IDENTIFIED BY '$APP_PASS';
CREATE USER IF NOT EXISTS '$APP_USER'@'localhost' IDENTIFIED BY '$APP_PASS';

GRANT ALL PRIVILEGES ON \`$APP_DB\`.* TO '$APP_USER'@'%';
GRANT ALL PRIVILEGES ON \`$APP_DB\`.* TO '$APP_USER'@'localhost';
FLUSH PRIVILEGES;
SQL

echo "  ✅ Database '$APP_DB' and user '$APP_USER' ready"

# ── Step 2 — Apply schema ─────────────────────────────────────────────────────
if [[ ! -f "$SCHEMA_FILE" ]]; then
  echo "❌ $SCHEMA_FILE not found. Make sure you pulled the latest code."
  exit 1
fi

echo "📐 Applying schema …"
run_app "$APP_DB" < "$SCHEMA_FILE"
echo "  ✅ Schema applied ($(grep -c 'CREATE TABLE' "$SCHEMA_FILE") tables)"

# ── Step 3 — Load seed data ───────────────────────────────────────────────────
if [[ -f "$SEED_FILE" ]]; then
  echo "🌱 Loading seed data …"
  run_app "$APP_DB" < "$SEED_FILE"
  echo "  ✅ Seed data loaded"
fi

echo ""
echo "🎉 Setup complete! Start the API with: npm run dev --workspace=apps/api"
