-- ============================================================
-- RAMP WMS - MySQL Complete DDL Rollback Script
-- Compatibility: MySQL 8.0+
-- Description: Drops all tables in reverse dependency order
-- ============================================================

SET foreign_key_checks = 0;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS salvages;
DROP TABLE IF EXISTS counter_sale_items;
DROP TABLE IF EXISTS counter_sales;
DROP TABLE IF EXISTS message_templates;
DROP TABLE IF EXISTS crm_followups;
DROP TABLE IF EXISTS purchase_order_items;
DROP TABLE IF EXISTS purchase_orders;
DROP TABLE IF EXISTS insurance_claims;
DROP TABLE IF EXISTS vehicle_insurance;
DROP TABLE IF EXISTS insurance_providers;
DROP TABLE IF EXISTS discounts;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS job_service_items;
DROP TABLE IF EXISTS job_spare_items;
DROP TABLE IF EXISTS sold_packages;
DROP TABLE IF EXISTS package_items;
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS inventory_transactions;
DROP TABLE IF EXISTS inventory_batches;
DROP TABLE IF EXISTS vendors;
DROP TABLE IF EXISTS spare_parts;
DROP TABLE IF EXISTS spare_brands;
DROP TABLE IF EXISTS tax_rates;
DROP TABLE IF EXISTS job_complaints;
DROP TABLE IF EXISTS vehicle_inspections;
DROP TABLE IF EXISTS job_card_images;
DROP TABLE IF EXISTS job_card_technicians;
DROP TABLE IF EXISTS job_cards;
DROP TABLE IF EXISTS customer_vehicles;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS customer_sources;
DROP TABLE IF EXISTS vehicle_categories;
DROP TABLE IF EXISTS vehicle_variants;
DROP TABLE IF EXISTS vehicle_models;
DROP TABLE IF EXISTS vehicle_brands;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS designations;
DROP TABLE IF EXISTS user_garage_assignments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS garages;
DROP TABLE IF EXISTS organizations;

SET foreign_key_checks = 1;
