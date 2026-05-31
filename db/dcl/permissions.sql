-- ============================================================
-- RAMP WMS - MySQL DCL Permissions & Tenant Isolation
-- Compatibility: MySQL 8.0+
-- Description: Sets up DB user grants for the API service.
--
-- NOTE: MySQL does not support Row-Level Security (RLS).
-- Multi-tenant garage isolation is enforced at the application
-- layer inside NestJS. Every query from the API must include a
-- WHERE garage_id = ? clause derived from the authenticated
-- user's JWT claims. DO NOT run raw queries without this filter.
-- ============================================================

-- 1. Create application DB user (run as root)
CREATE USER IF NOT EXISTS 'bikemaster'@'%' IDENTIFIED BY 'bikemasterpassword';

-- 2. Grant least-privilege access on the bikemaster database
GRANT SELECT, INSERT, UPDATE, DELETE ON bikemaster.* TO 'bikemaster'@'%';

-- 3. Allow the user to execute stored procedures (if added later)
GRANT EXECUTE ON bikemaster.* TO 'bikemaster'@'%';

FLUSH PRIVILEGES;

-- ============================================================
-- Application-layer tenant isolation contract
-- ============================================================
-- The following tables contain a garage_id column and MUST
-- always be queried with a garage_id filter in application code:
--
--   garages, employees, designations, customers, customer_sources,
--   vehicle_categories, job_cards, job_complaints, spare_parts,
--   inventory_batches, inventory_transactions, services, packages,
--   sold_packages, job_spare_items, job_service_items,
--   invoices, payments
--
-- The NestJS JwtAuthGuard extracts garage_id from the JWT and
-- injects it into every service method via the request context.
-- ============================================================
