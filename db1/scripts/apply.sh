#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# apply.sh — Apply schema + seeds to an existing DB (safe, no data loss).
#
# Use this after pulling schema changes from a teammate:
#   ./db1/scripts/apply.sh
#
# NOTE: Uses INSERT IGNORE so existing rows are never overwritten.
#       For a full reset use reset.sh instead.
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

run() { mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" "$@"; }

# Schema
[[ -f "$SCHEMA_FILE" ]] || { echo "ERROR: $SCHEMA_FILE not found"; exit 1; }
echo "Applying schema ..."
run "$MYSQL_DB" < "$SCHEMA_FILE"
echo "  Schema applied"

# Master seeds (idempotent)
if [[ -f "$MASTER_FILE" ]]; then
  echo "Inserting master seed data (INSERT IGNORE) ..."
  sed 's/^INSERT INTO/INSERT IGNORE INTO/g' "$MASTER_FILE" | run "$MYSQL_DB"
  echo "  Master seeds applied"
fi

# Transactional seeds (idempotent)
if [[ -f "$TXNAL_FILE" ]]; then
  echo "Inserting transactional seed data (INSERT IGNORE) ..."
  sed 's/^INSERT INTO/INSERT IGNORE INTO/g' "$TXNAL_FILE" | run "$MYSQL_DB"
  echo "  Transactional seeds applied"
fi

echo ""
echo "Done. DB is in sync with db1/."
