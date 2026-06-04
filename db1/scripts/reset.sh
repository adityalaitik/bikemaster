#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# reset.sh — DESTRUCTIVE: drop the database, recreate it, reload everything.
#
# Use this to get a completely clean slate:
#   ./db1/scripts/reset.sh
#
# !! ALL DATA WILL BE LOST !!
# Run dump.sh first if you need to preserve current data.
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

MYSQL_USER="${MYSQL_USER:-admin}"
MYSQL_PASS="${MYSQL_PASS:-LeOmm@8769}"
MYSQL_HOST="${MYSQL_HOST:-localhost}"
MYSQL_PORT="${MYSQL_PORT:-3306}"
MYSQL_DB="${MYSQL_DB:-bikemaster}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DB1_DIR="$(dirname "$SCRIPT_DIR")"

SCHEMA_FILE="$DB1_DIR/schema/schema.sql"
MASTER_FILE="$DB1_DIR/seeds/seed_master.sql"
TXNAL_FILE="$DB1_DIR/seeds/seed_transactional.sql"

[[ -f "$SCHEMA_FILE" ]] || { echo "ERROR: $SCHEMA_FILE not found"; exit 1; }

echo "WARNING: This will DROP and recreate the entire '$MYSQL_DB' database."
read -rp "Type 'yes' to confirm: " CONFIRM
[[ "$CONFIRM" == "yes" ]] || { echo "Aborted."; exit 0; }

run() { mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" "$@"; }

echo "Dropping and recreating database $MYSQL_DB ..."
run <<SQL
DROP DATABASE IF EXISTS \`$MYSQL_DB\`;
CREATE DATABASE \`$MYSQL_DB\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SQL
echo "  Database recreated"

echo "Applying schema ..."
run "$MYSQL_DB" < "$SCHEMA_FILE"
echo "  Schema applied"

if [[ -f "$MASTER_FILE" ]]; then
  echo "Loading master seed data ..."
  run "$MYSQL_DB" < "$MASTER_FILE"
  echo "  Master seeds loaded"
fi

if [[ -f "$TXNAL_FILE" ]]; then
  echo "Loading transactional seed data ..."
  run "$MYSQL_DB" < "$TXNAL_FILE"
  echo "  Transactional seeds loaded"
fi

echo ""
echo "Done. Fresh DB is ready."
