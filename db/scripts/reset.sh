#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# reset.sh — DESTRUCTIVE: drop all tables, recreate schema, reload seeds.
#
# Use this when you want a completely clean slate:
#   ./db/scripts/reset.sh
#
# ⚠️  ALL DATA WILL BE LOST. Run dump.sh first if you need a backup.
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

echo "⚠️  This will DROP and recreate the entire '$MYSQL_DB' database."
read -rp "Type 'yes' to confirm: " CONFIRM
if [[ "$CONFIRM" != "yes" ]]; then
  echo "Aborted."
  exit 0
fi

echo "💣 Dropping and recreating database $MYSQL_DB …"
mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" <<SQL
DROP DATABASE IF EXISTS \`$MYSQL_DB\`;
CREATE DATABASE \`$MYSQL_DB\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SQL
echo "  ✅ Database recreated"

echo "📐 Applying schema …"
mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" "$MYSQL_DB" < "$SCHEMA_FILE"
echo "  ✅ Schema applied"

if [[ -f "$SEED_FILE" ]]; then
  echo "🌱 Loading seed data …"
  mysql -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" "$MYSQL_DB" < "$SEED_FILE"
  echo "  ✅ Seeds loaded"
fi

echo ""
echo "Done. Fresh DB ready."
