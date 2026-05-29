-- ============================================================
-- RAMP WMS - PostgreSQL Row-Level Security & DCL Permissions
-- Compatibility: PostgreSQL 12+
-- Description: Sets up tenant isolation policies and database roles
-- ============================================================

-- 1. Create DB roles for services
-- CREATE ROLE wms_api_user WITH LOGIN PASSWORD 'strong_api_password';

-- 2. Grant basic permissions
-- GRANT CONNECT ON DATABASE bikemaster TO wms_api_user;
-- GRANT USAGE ON SCHEMA public TO wms_api_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO wms_api_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO wms_api_user;

-- 3. Row-Level Security (RLS) Multi-Tenant Policies
-- Enable RLS on core tenant-isolated tables
ALTER TABLE garages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sold_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_spare_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 4. Create multi-tenant filtering policies
-- These policies rely on a session context variable 'app.current_garage_id'
-- which is initialized by NestJS database client extension on every transaction request!

CREATE POLICY garage_isolation_policy ON garages
    FOR ALL
    USING (id = NULLIF(current_setting('app.current_garage_id', true), '')::UUID);

CREATE POLICY employee_isolation_policy ON employees
    FOR ALL
    USING (garage_id = NULLIF(current_setting('app.current_garage_id', true), '')::UUID);

CREATE POLICY customer_isolation_policy ON customers
    FOR ALL
    USING (garage_id = NULLIF(current_setting('app.current_garage_id', true), '')::UUID);

CREATE POLICY job_card_isolation_policy ON job_cards
    FOR ALL
    USING (garage_id = NULLIF(current_setting('app.current_garage_id', true), '')::UUID);

CREATE POLICY invoice_isolation_policy ON invoices
    FOR ALL
    USING (garage_id = NULLIF(current_setting('app.current_garage_id', true), '')::UUID);

CREATE POLICY payment_isolation_policy ON payments
    FOR ALL
    USING (garage_id = NULLIF(current_setting('app.current_garage_id', true), '')::UUID);

-- To bypass RLS for super admin users, we can configure:
-- ALTER TABLE job_cards FORCE ROW LEVEL SECURITY;
