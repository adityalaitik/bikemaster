-- ============================================================
-- RAMP WMS - MySQL Complete DML Seed Script
-- Compatibility: MySQL 8.0+
-- Description: Inserts realistic seed data for testing
-- ============================================================

SET foreign_key_checks = 0;

-- TIER 1: ORGANIZATIONS
INSERT IGNORE INTO organizations (id, name, slug, plan, is_active)
VALUES (
    '8843e4fb-63d2-4376-976b-ab9b61c65eec',
    'Bike Masters Group',
    'bike-masters',
    'enterprise',
    TRUE
);

-- TIER 1: GARAGES
INSERT IGNORE INTO garages (id, organization_id, name, code, city, state, pincode, phone, email, gstin, is_active)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    '8843e4fb-63d2-4376-976b-ab9b61c65eec',
    'Bhubaneswar Branch',
    'BBR-001',
    'Bhubaneswar',
    'Odisha',
    '751024',
    '+91 674 123456',
    'bbr@bikemasters.in',
    '21AAAAA0000A1Z0',
    TRUE
),
(
    '22222222-2222-2222-2222-222222222222',
    '8843e4fb-63d2-4376-976b-ab9b61c65eec',
    'Cuttack Branch',
    'CTC-002',
    'Cuttack',
    'Odisha',
    '753001',
    '+91 671 654321',
    'ctc@bikemasters.in',
    '21BBBBB0000A1Z1',
    TRUE
);

-- TIER 2: USERS (Passwords hashed using bcrypt 'password123')
INSERT IGNORE INTO users (id, organization_id, email, phone, password_hash, first_name, last_name, role, is_active)
VALUES
(
    '33333333-3333-3333-3333-333333333333',
    '8843e4fb-63d2-4376-976b-ab9b61c65eec',
    'admin@bikemasters.in',
    '+91 98765 43210',
    '$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y',
    'Aditya',
    'Pradhan',
    'super_admin',
    TRUE
),
(
    '44444444-4444-4444-4444-444444444444',
    '8843e4fb-63d2-4376-976b-ab9b61c65eec',
    'manager.bbr@bikemasters.in',
    '+91 99999 88888',
    '$2b$10$Y1r7R55C.rBmW918N3yJ1uXG2Psw6wPqCgJjGepw85Xv.RzQ1gE6y',
    'Subhashis',
    'Sen',
    'garage_manager',
    TRUE
);

-- TIER 2: GARAGE ASSIGNMENTS
INSERT IGNORE INTO user_garage_assignments (user_id, garage_id, is_primary)
VALUES
('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', TRUE),
('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', TRUE);

-- TIER 2: DESIGNATIONS
INSERT IGNORE INTO designations (id, garage_id, name)
VALUES
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Senior Technician'),
('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Service Advisor');

-- TIER 2: EMPLOYEES
INSERT IGNORE INTO employees (id, user_id, garage_id, designation_id, employee_code, name, phone, type, is_active)
VALUES
(
    '77777777-7777-7777-7777-777777777777',
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '66666666-6666-6666-6666-666666666666',
    'EMP-BBR-001',
    'Subhashis Sen',
    '+91 99999 88888',
    'service_advisor',
    TRUE
),
(
    '88888888-8888-8888-8888-888888888888',
    NULL,
    '11111111-1111-1111-1111-111111111111',
    '55555555-5555-5555-5555-555555555555',
    'EMP-BBR-102',
    'Manoj Kumar',
    '+91 88888 77777',
    'technician',
    TRUE
);

-- TIER 3: BRANDS & MODELS
INSERT IGNORE INTO vehicle_brands (id, organization_id, name, is_active)
VALUES ('99999999-9999-9999-9999-999999999999', '8843e4fb-63d2-4376-976b-ab9b61c65eec', 'Honda', TRUE);

INSERT IGNORE INTO vehicle_models (id, brand_id, name, fuel_type, vehicle_type, is_active)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '99999999-9999-9999-9999-999999999999', 'Activa 6G', 'petrol', 'two_wheeler', TRUE);

-- TIER 12: TAXES
INSERT IGNORE INTO tax_rates (id, organization_id, name, cgst_rate, sgst_rate, igst_rate, is_active)
VALUES
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '8843e4fb-63d2-4376-976b-ab9b61c65eec',
    'GST 18%',
    9.00,
    9.00,
    18.00,
    TRUE
);

-- TIER 6: SPARES MASTER
INSERT IGNORE INTO spare_parts (id, garage_id, part_name, part_number, unit, reorder_level, is_active)
VALUES
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '11111111-1111-1111-1111-111111111111',
    'Brake Pad Front',
    'BP-HON-098',
    'PCS',
    10,
    TRUE
);

-- TIER 7: SERVICES MASTER
INSERT IGNORE INTO services (id, garage_id, service_name, service_code, default_rate, is_active)
VALUES
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '11111111-1111-1111-1111-111111111111',
    'General Washing and Foam Polish',
    'SRV-WSH-01',
    450.00,
    TRUE
);

SET foreign_key_checks = 1;
