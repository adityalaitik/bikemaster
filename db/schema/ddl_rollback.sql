-- ============================================================
-- RAMP WMS - PostgreSQL Complete DDL Rollback Script
-- Compatibility: PostgreSQL 12+
-- Description: Standard rollback SQL dropping all tables and types
--             in reverse dependency order to prevent constraints violations
-- ============================================================

-- Drop tables in dependency order
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS salvages CASCADE;
DROP TABLE IF EXISTS counter_sale_items CASCADE;
DROP TABLE IF EXISTS counter_sales CASCADE;
DROP TABLE IF EXISTS message_templates CASCADE;
DROP TABLE IF EXISTS crm_followups CASCADE;
DROP TABLE IF EXISTS purchase_order_items CASCADE;
DROP TABLE IF EXISTS purchase_orders CASCADE;
DROP TABLE IF EXISTS insurance_claims CASCADE;
DROP TABLE IF EXISTS vehicle_insurance CASCADE;
DROP TABLE IF EXISTS insurance_providers CASCADE;
DROP TABLE IF EXISTS discounts CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS job_service_items CASCADE;
DROP TABLE IF EXISTS job_spare_items CASCADE;
DROP TABLE IF EXISTS sold_packages CASCADE;
DROP TABLE IF EXISTS package_items CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS inventory_transactions CASCADE;
DROP TABLE IF EXISTS inventory_batches CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS spare_parts CASCADE;
DROP TABLE IF EXISTS spare_brands CASCADE;
DROP TABLE IF EXISTS tax_rates CASCADE;
DROP TABLE IF EXISTS job_complaints CASCADE;
DROP TABLE IF EXISTS vehicle_inspections CASCADE;
DROP TABLE IF EXISTS job_card_images CASCADE;
DROP TABLE IF EXISTS job_card_technicians CASCADE;
DROP TABLE IF EXISTS job_cards CASCADE;
DROP TABLE IF EXISTS customer_vehicles CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS customer_sources CASCADE;
DROP TABLE IF EXISTS vehicle_categories CASCADE;
DROP TABLE IF EXISTS vehicle_variants CASCADE;
DROP TABLE IF EXISTS vehicle_models CASCADE;
DROP TABLE IF EXISTS vehicle_brands CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS designations CASCADE;
DROP TABLE IF EXISTS user_garage_assignments CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS garages CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS subscription_plan CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS employee_type CASCADE;
DROP TYPE IF EXISTS fuel_type_enum CASCADE;
DROP TYPE IF EXISTS vehicle_type_enum CASCADE;
DROP TYPE IF EXISTS customer_type_enum CASCADE;
DROP TYPE IF EXISTS plate_color_enum CASCADE;
DROP TYPE IF EXISTS job_card_status CASCADE;
DROP TYPE IF EXISTS service_type_enum CASCADE;
DROP TYPE IF EXISTS image_type_enum CASCADE;
DROP TYPE IF EXISTS complaint_action_enum CASCADE;
DROP TYPE IF EXISTS transaction_type_enum CASCADE;
DROP TYPE IF EXISTS reference_type_enum CASCADE;
DROP TYPE IF EXISTS item_type_enum CASCADE;
DROP TYPE IF EXISTS sold_package_status CASCADE;
DROP TYPE IF EXISTS billed_to_enum CASCADE;
DROP TYPE IF EXISTS spare_item_status CASCADE;
DROP TYPE IF EXISTS service_item_status CASCADE;
DROP TYPE IF EXISTS invoice_type_enum CASCADE;
DROP TYPE IF EXISTS invoice_status_enum CASCADE;
DROP TYPE IF EXISTS payment_method_enum CASCADE;
DROP TYPE IF EXISTS discount_type_enum CASCADE;
DROP TYPE IF EXISTS insurance_status_enum CASCADE;
DROP TYPE IF EXISTS claim_status_enum CASCADE;
DROP TYPE IF EXISTS po_status_enum CASCADE;
DROP TYPE IF EXISTS followup_type_enum CASCADE;
DROP TYPE IF EXISTS followup_status_enum CASCADE;
DROP TYPE IF EXISTS message_channel_enum CASCADE;
DROP TYPE IF EXISTS salvage_status_enum CASCADE;
DROP TYPE IF EXISTS offer_type_enum CASCADE;
DROP TYPE IF EXISTS offer_applicable_enum CASCADE;
DROP TYPE IF EXISTS notification_type_enum CASCADE;

-- Disable UUID extension (Optional)
-- DROP EXTENSION IF EXISTS "uuid-ossp";
