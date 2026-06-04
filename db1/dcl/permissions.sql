-- ============================================================
-- BikeMaster WMS — DCL: Database Users & Permissions
-- MySQL 8.0+
-- ============================================================
-- Run this ONCE as the MySQL root (or a user with GRANT OPTION)
-- BEFORE running setup.sh / apply.sh
-- ============================================================

-- ── 1. Application user (used by NestJS API) ─────────────────
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'LeOmm@8769';
CREATE USER IF NOT EXISTS 'admin'@'%'         IDENTIFIED BY 'LeOmm@8769';

GRANT ALL PRIVILEGES ON `bikemaster`.* TO 'admin'@'localhost';
GRANT ALL PRIVILEGES ON `bikemaster`.* TO 'admin'@'%';

-- ── 2. Read-only reporting user (optional, safe for BI tools) ─
-- CREATE USER IF NOT EXISTS 'bikemaster_ro'@'%' IDENTIFIED BY 'change_me_ro';
-- GRANT SELECT ON `bikemaster`.* TO 'bikemaster_ro'@'%';

FLUSH PRIVILEGES;

-- ============================================================
-- Tenant Isolation Contract
-- ============================================================
-- MySQL has NO row-level security. Multi-branch data isolation
-- is enforced entirely in the NestJS application layer.
--
-- Every query against the tables below MUST include:
--   WHERE garage_id = :garageId
-- derived from the authenticated user's JWT payload.
--
-- Garage-scoped tables:
--   garages, employees, designations, customers, customer_sources,
--   vehicle_categories, job_cards, job_complaints, spare_parts,
--   inventory_batches, inventory_transactions, services,
--   packages, sold_packages, job_spare_items, job_service_items,
--   invoices, payments, offers
--
-- Garage IDs in this seed:
--   BBR-001  11111111-1111-1111-1111-111111111111  (Bhubaneswar Branch)
--   PTI-003  33333333-3333-3333-3333-000000000001  (Patia Branch)
-- ============================================================
