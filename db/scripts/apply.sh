#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# apply.sh — Apply schema + seeds from db/ folder to the live MySQL DB.
#
# Use this to bring the DB up to date after pulling schema changes from git:
#   ./db/scripts/apply.sh
#
# WARNING: This does NOT drop tables. It runs the schema file in a way that
# adds new tables / alters existing ones without destroying existing data.
# For a full reset, run reset.sh instead.
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

MYSQL_USER="${MYSQL_USER:-admin}"
MYSQL_PASS="${MYSQL_PASS:-LeOmm@8769}"
MYSQL_HOST="${MYSQL_HOST:-localhost}"
MYSQL_PORT="${MYSQL_PORT:-3306}"
MYSQL_DB="${MYSQL_DB:-bikemaster}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DB_DIR="$(dirname "$SCRIPT_DIR")"

SCHEMA_FILE="$DB_DIR/schema/schema.sql"
SEED_FILE="$DB_DIR/seeds/seed_data.sql"

if [[ ! -f "$SCHEMA_FILE" ]]; then
  echo "❌ $SCHEMA_FILE not found. Run dump.sh first."
  exit 1
fi

echo "🚀 Applying schema to $MYSQL_DB@$MYSQL_HOST:$MYSQL_PORT …"

mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" "$MYSQL_DB" < "$SCHEMA_FILE"
echo "  ✅ Schema applied"

if [[ -f "$SEED_FILE" ]]; then
  echo "🌱 Inserting seed data (INSERT IGNORE — won't overwrite existing rows) …"
  # Replace INSERT INTO with INSERT IGNORE INTO so existing rows are skipped
  sed 's/^INSERT INTO/INSERT IGNORE INTO/g' "$SEED_FILE" | \
    mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" "$MYSQL_DB"
  echo "  ✅ Seeds applied"
fi

echo ""
echo "Done. DB is now in sync with db/schema/schema.sql."
