#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# dump.sh — Export the live bikemaster MySQL DB into the db/ folder.
#
# Run this after ANY schema change or when you want to capture current seed data:
#   ./db/scripts/dump.sh
#
# What it produces:
#   db/schema/schema.sql   — DDL only (CREATE TABLE / INDEX / FK — no rows)
#   db/seeds/seed_data.sql — Master/reference data rows (brands, services, etc.)
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

echo "📦 Dumping schema from $MYSQL_DB@$MYSQL_HOST:$MYSQL_PORT …"

# ── 1. Schema (DDL only — no data) ───────────────────────────────────────────
mysqldump \
  -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" \
  --no-data \
  --single-transaction \
  --routines \
  --triggers \
  --set-gtid-purged=OFF \
  --add-drop-table \
  "$MYSQL_DB" \
  > "$SCHEMA_FILE"

echo "  ✅ Schema → $SCHEMA_FILE"

# ── 2. Seed / master reference data ──────────────────────────────────────────
# These are relatively static lookup tables. Transactional tables (job_cards,
# customers, invoices, payments, etc.) are intentionally excluded.
SEED_TABLES=(
  organizations
  garages
  designations
  users
  user_garage_assignments
  employees
  vehicle_categories
  vehicle_brands
  vehicle_models
  vehicle_variants
  customer_sources
  spare_brands
  spare_parts
  services
  packages
  package_items
  offers
  tax_rates
  message_templates
  vendors
)

mysqldump \
  -u"$MYSQL_USER" -p"$MYSQL_PASS" -h"$MYSQL_HOST" -P"$MYSQL_PORT" \
  --no-create-info \
  --single-transaction \
  --skip-extended-insert \
  --set-gtid-purged=OFF \
  --complete-insert \
  "$MYSQL_DB" \
  "${SEED_TABLES[@]}" \
  > "$SEED_FILE"

echo "  ✅ Seeds  → $SEED_FILE"
echo ""
echo "Done. Commit both files to keep the repo in sync with your DB."
