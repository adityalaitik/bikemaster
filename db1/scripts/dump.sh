#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# dump.sh — Snapshot the live DB into db1/ (schema + seeds).
#
# Run after any schema change or to capture updated seed data:
#   ./db1/scripts/dump.sh
#
# Outputs:
#   db1/schema/schema.sql            — Full DDL (no rows)
#   db1/seeds/seed_master.sql        — Reference/lookup data
#   db1/seeds/seed_transactional.sql — Operational data (customers, jobs, etc.)
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

DUMP_OPTS="-u$MYSQL_USER -p$MYSQL_PASS -h$MYSQL_HOST -P$MYSQL_PORT --skip-lock-tables --set-gtid-purged=OFF --no-tablespaces"

echo "Dumping schema from $MYSQL_DB@$MYSQL_HOST:$MYSQL_PORT ..."

# ── 1. DDL only (no data) ─────────────────────────────────────────────────────
mysqldump $DUMP_OPTS \
  --no-data \
  --add-drop-table \
  "$MYSQL_DB" \
  > "$SCHEMA_FILE"
echo "  Schema  -> $SCHEMA_FILE"

# ── 2. Master / reference data ────────────────────────────────────────────────
MASTER_TABLES=(
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

mysqldump $DUMP_OPTS \
  --no-create-info \
  --complete-insert \
  --skip-extended-insert \
  "$MYSQL_DB" \
  "${MASTER_TABLES[@]}" \
  > "$MASTER_FILE"
echo "  Master  -> $MASTER_FILE"

# ── 3. Transactional data ─────────────────────────────────────────────────────
TXNAL_TABLES=(
  customers
  vehicles
  customer_vehicles
  job_cards
  job_complaints
  job_card_technicians
  job_card_images
  vehicle_inspections
  job_spare_items
  job_service_items
  inventory_batches
  inventory_transactions
  invoices
  payments
  discounts
  vehicle_insurance
  insurance_claims
  insurance_providers
  sold_packages
  purchase_orders
  purchase_order_items
  audit_logs
  notifications
  crm_followups
  salvages
  counter_sales
  counter_sale_items
)

mysqldump $DUMP_OPTS \
  --no-create-info \
  --complete-insert \
  --skip-extended-insert \
  "$MYSQL_DB" \
  "${TXNAL_TABLES[@]}" \
  > "$TXNAL_FILE"
echo "  Txnal   -> $TXNAL_FILE"

echo ""
echo "Done. Commit all three files so teammates can sync with apply.sh."
