-- ============================================================
-- RAMP WMS - MySQL Complete DDL Create Script
-- Compatibility: MySQL 8.0+
-- Description: Standard relational DDL for Workshop Management System
-- ============================================================

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ============================================================
-- TIER 1: SUPER ADMIN / PLATFORM LEVEL
-- ============================================================

CREATE TABLE organizations (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    plan ENUM('starter', 'pro', 'enterprise') NOT NULL DEFAULT 'starter',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_organizations_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE garages (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    organization_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    gstin VARCHAR(20),
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_garages_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 2: USER & ACCESS MANAGEMENT
-- ============================================================

CREATE TABLE users (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    organization_id CHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role ENUM('super_admin', 'org_admin', 'garage_manager', 'service_advisor', 'technician', 'cashier', 'viewer') NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    CONSTRAINT fk_users_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_garage_assignments (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    garage_id CHAR(36) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_garage (user_id, garage_id),
    CONSTRAINT fk_uga_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_uga_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE designations (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_designations_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employees (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    user_id CHAR(36),
    garage_id CHAR(36) NOT NULL,
    designation_id CHAR(36),
    employee_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    type ENUM('technician', 'supervisor', 'service_advisor') NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_employees_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_employees_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_employees_designation FOREIGN KEY (designation_id) REFERENCES designations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 3: VEHICLE & CUSTOMER MASTER
-- ============================================================

CREATE TABLE vehicle_brands (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    organization_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_vbrands_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehicle_models (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    brand_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    fuel_type ENUM('petrol', 'diesel', 'electric', 'cng', 'hybrid') NOT NULL DEFAULT 'petrol',
    vehicle_type ENUM('two_wheeler', 'three_wheeler', 'four_wheeler', 'commercial') NOT NULL DEFAULT 'two_wheeler',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_vmodels_brand FOREIGN KEY (brand_id) REFERENCES vehicle_brands(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehicle_variants (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    model_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_vvariants_model FOREIGN KEY (model_id) REFERENCES vehicle_models(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehicle_categories (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_vcategories_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE customer_sources (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    company_name VARCHAR(255),
    gstin VARCHAR(20),
    contact_person VARCHAR(255),
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_csources_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE customers (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    gstin VARCHAR(20),
    customer_type ENUM('individual', 'corporate') NOT NULL DEFAULT 'individual',
    source_id CHAR(36),
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_customers_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_customers_source FOREIGN KEY (source_id) REFERENCES customer_sources(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehicles (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    registration_no VARCHAR(20) NOT NULL,
    organization_id CHAR(36) NOT NULL,
    model_id CHAR(36) NOT NULL,
    variant_id CHAR(36),
    category_id CHAR(36),
    number_plate_color ENUM('white', 'yellow', 'green', 'black', 'blue') NOT NULL DEFAULT 'white',
    chassis_no VARCHAR(100),
    engine_no VARCHAR(100),
    mfg_year SMALLINT,
    date_of_registration DATE,
    color VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_vehicles_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT fk_vehicles_model FOREIGN KEY (model_id) REFERENCES vehicle_models(id),
    CONSTRAINT fk_vehicles_variant FOREIGN KEY (variant_id) REFERENCES vehicle_variants(id),
    CONSTRAINT fk_vehicles_category FOREIGN KEY (category_id) REFERENCES vehicle_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE customer_vehicles (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    customer_id CHAR(36) NOT NULL,
    vehicle_id CHAR(36) NOT NULL,
    garage_id CHAR(36) NOT NULL,
    is_primary_owner BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_cvehicles_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_cvehicles_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_cvehicles_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 4: JOB CARD & SERVICE WORKFLOW
-- ============================================================

CREATE TABLE job_cards (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    job_card_no VARCHAR(50) NOT NULL,
    garage_id CHAR(36) NOT NULL,
    vehicle_id CHAR(36) NOT NULL,
    customer_id CHAR(36) NOT NULL,
    service_advisor_id CHAR(36),
    odometer_in INTEGER NOT NULL,
    odometer_out INTEGER,
    status ENUM('draft', 'under_servicing', 'next_day_delivery', 'upcoming_delivery', 'ready_for_delivery', 'payment_processing', 'completed', 'deleted') NOT NULL DEFAULT 'draft',
    service_type ENUM('regular', 'accidental', 'insurance_claim', 'express', 'free_service') NOT NULL DEFAULT 'regular',
    date_of_arrival DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    promised_delivery_date DATETIME,
    actual_delivery_date DATETIME,
    customer_complaints TEXT,
    workshop_findings TEXT,
    internal_notes TEXT,
    customer_notes TEXT,
    gate_pass_no VARCHAR(50),
    gate_pass_issued_at DATETIME,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    rating_feedback TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_job_card_no (job_card_no),
    CONSTRAINT fk_jc_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_jc_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    CONSTRAINT fk_jc_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_jc_advisor FOREIGN KEY (service_advisor_id) REFERENCES employees(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE job_card_technicians (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    job_card_id CHAR(36) NOT NULL,
    technician_id CHAR(36) NOT NULL,
    supervisor_id CHAR(36),
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    completed_at DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_jct_jc FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_jct_tech FOREIGN KEY (technician_id) REFERENCES employees(id),
    CONSTRAINT fk_jct_supervisor FOREIGN KEY (supervisor_id) REFERENCES employees(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE job_card_images (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    job_card_id CHAR(36) NOT NULL,
    image_url TEXT NOT NULL,
    image_type ENUM('vehicle_in', 'vehicle_out', 'damage', 'work_progress', 'other') NOT NULL DEFAULT 'other',
    uploaded_by CHAR(36) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_jci_jc FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_jci_user FOREIGN KEY (uploaded_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehicle_inspections (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    job_card_id CHAR(36) NOT NULL,
    checklist_data JSON NOT NULL,
    inspected_by CHAR(36) NOT NULL,
    inspected_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_vi_jc FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_vi_emp FOREIGN KEY (inspected_by) REFERENCES employees(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 5: COMPLAINTS & SERVICES IN JOB
-- ============================================================

CREATE TABLE job_complaints (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    job_card_id CHAR(36) NOT NULL,
    complaint_text TEXT NOT NULL,
    workshop_finding TEXT,
    action ENUM('repair_now', 'repair_later', 'inform_customer', 'monitor', 'rejected') NOT NULL DEFAULT 'repair_now',
    is_rejected BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_jcomplaint_jc FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 12: TAX & GST (Required by Spares and Services master)
-- ============================================================

CREATE TABLE tax_rates (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    organization_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    cgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    sgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    igst_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_taxrates_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 6: INVENTORY / SPARES MASTER
-- ============================================================

CREATE TABLE spare_brands (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    organization_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_sbrands_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE spare_parts (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    brand_id CHAR(36),
    hsn_code VARCHAR(20),
    unit VARCHAR(20) NOT NULL DEFAULT 'PCS',
    tax_category_id CHAR(36),
    reorder_level INTEGER NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_sparts_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_sparts_brand FOREIGN KEY (brand_id) REFERENCES spare_brands(id),
    CONSTRAINT fk_sparts_tax FOREIGN KEY (tax_category_id) REFERENCES tax_rates(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vendors (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    gstin VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_vendors_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inventory_batches (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    spare_part_id CHAR(36) NOT NULL,
    garage_id CHAR(36) NOT NULL,
    batch_no VARCHAR(100) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    mrp DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    quantity INTEGER NOT NULL DEFAULT 0,
    available_qty INTEGER NOT NULL DEFAULT 0,
    expiry_date DATE,
    vendor_id CHAR(36),
    purchase_date DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_ibatches_part FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id) ON DELETE CASCADE,
    CONSTRAINT fk_ibatches_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_ibatches_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inventory_transactions (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    spare_part_id CHAR(36) NOT NULL,
    garage_id CHAR(36) NOT NULL,
    batch_id CHAR(36),
    transaction_type ENUM('purchase', 'issue', 'return', 'transfer_in', 'transfer_out', 'adjustment') NOT NULL,
    reference_type ENUM('job_card', 'counter_sale', 'transfer', 'adjustment') NOT NULL,
    reference_id CHAR(36),
    quantity INTEGER NOT NULL, -- positive=in, negative=out
    unit_price DECIMAL(10,2) NOT NULL,
    created_by CHAR(36) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_itxn_part FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id) ON DELETE CASCADE,
    CONSTRAINT fk_itxn_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_itxn_batch FOREIGN KEY (batch_id) REFERENCES inventory_batches(id) ON DELETE SET NULL,
    CONSTRAINT fk_itxn_user FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 7: SERVICES MASTER
-- ============================================================

CREATE TABLE services (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_code VARCHAR(50) NOT NULL,
    hsn_sac_code VARCHAR(20),
    default_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_category_id CHAR(36),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_services_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_services_tax FOREIGN KEY (tax_category_id) REFERENCES tax_rates(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 8: PACKAGES
-- ============================================================

CREATE TABLE packages (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    description TEXT,
    total_price DECIMAL(10,2) NOT NULL,
    validity_days INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_packages_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE package_items (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    package_id CHAR(36) NOT NULL,
    item_type ENUM('spare', 'service') NOT NULL,
    spare_part_id CHAR(36),
    service_id CHAR(36),
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1.000,
    rate DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_pkgitems_pkg FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    CONSTRAINT fk_pkgitems_part FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id) ON DELETE SET NULL,
    CONSTRAINT fk_pkgitems_svc FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sold_packages (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    package_id CHAR(36) NOT NULL,
    customer_id CHAR(36) NOT NULL,
    vehicle_id CHAR(36) NOT NULL,
    garage_id CHAR(36) NOT NULL,
    sold_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_until DATE NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'consumed', 'expired') NOT NULL DEFAULT 'active',
    PRIMARY KEY (id),
    CONSTRAINT fk_soldpkg_pkg FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    CONSTRAINT fk_soldpkg_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_soldpkg_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_soldpkg_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 9: ESTIMATION / INVOICE ITEMS
-- ============================================================

CREATE TABLE job_spare_items (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    job_card_id CHAR(36) NOT NULL,
    spare_part_id CHAR(36) NOT NULL,
    batch_id CHAR(36),
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1.000,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    mrp DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    billed_to ENUM('customer', 'insurance') NOT NULL DEFAULT 'customer',
    status ENUM('estimated', 'issued', 'returned', 'rejected') NOT NULL DEFAULT 'estimated',
    from_package_id CHAR(36),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_jsi_jc FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_jsi_part FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id),
    CONSTRAINT fk_jsi_batch FOREIGN KEY (batch_id) REFERENCES inventory_batches(id),
    CONSTRAINT fk_jsi_pkg FOREIGN KEY (from_package_id) REFERENCES sold_packages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE job_service_items (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    job_card_id CHAR(36) NOT NULL,
    service_id CHAR(36) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1.000,
    rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    billed_to ENUM('customer', 'insurance') NOT NULL DEFAULT 'customer',
    status ENUM('estimated', 'completed', 'rejected') NOT NULL DEFAULT 'estimated',
    from_package_id CHAR(36),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_jsvi_jc FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_jsvi_svc FOREIGN KEY (service_id) REFERENCES services(id),
    CONSTRAINT fk_jsvi_pkg FOREIGN KEY (from_package_id) REFERENCES sold_packages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 10: INVOICES & PAYMENTS
-- ============================================================

CREATE TABLE invoices (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    invoice_no VARCHAR(50) NOT NULL,
    job_card_id CHAR(36),
    garage_id CHAR(36) NOT NULL,
    customer_id CHAR(36) NOT NULL,
    invoice_type ENUM('tax_invoice', 'estimate', 'counter_sale') NOT NULL DEFAULT 'tax_invoice',
    subtotal DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    coupon_code VARCHAR(50),
    coupon_discount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL,
    customer_amount DECIMAL(12,2) NOT NULL,
    insurance_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status ENUM('draft', 'sent', 'paid', 'partial', 'cancelled') NOT NULL DEFAULT 'draft',
    pdf_url TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_invoice_no (invoice_no),
    CONSTRAINT fk_invoices_jc FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE SET NULL,
    CONSTRAINT fk_invoices_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_invoices_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payments (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    invoice_id CHAR(36) NOT NULL,
    garage_id CHAR(36) NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('cash', 'upi', 'card', 'netbanking', 'cheque', 'insurance', 'credit_note') NOT NULL DEFAULT 'cash',
    reference_no VARCHAR(100),
    notes TEXT,
    created_by CHAR(36) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_payments_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_user FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE discounts (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    job_card_id CHAR(36) NOT NULL,
    discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    reason TEXT,
    approved_by CHAR(36) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_discounts_jc FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_discounts_user FOREIGN KEY (approved_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 11: INSURANCE
-- ============================================================

CREATE TABLE insurance_providers (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    organization_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_iprov_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehicle_insurance (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    vehicle_id CHAR(36) NOT NULL,
    garage_id CHAR(36) NOT NULL,
    provider_id CHAR(36) NOT NULL,
    policy_number VARCHAR(100) NOT NULL,
    insured_name VARCHAR(255) NOT NULL,
    insured_amount DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('active', 'expired', 'claimed') NOT NULL DEFAULT 'active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_vins_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_vins_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_vins_provider FOREIGN KEY (provider_id) REFERENCES insurance_providers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE insurance_claims (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    job_card_id CHAR(36) NOT NULL,
    insurance_id CHAR(36) NOT NULL,
    claim_no VARCHAR(100) NOT NULL,
    claimed_amount DECIMAL(12,2) NOT NULL,
    approved_amount DECIMAL(12,2) DEFAULT 0.00,
    status ENUM('pending', 'approved', 'partial', 'rejected') NOT NULL DEFAULT 'pending',
    surveyor_name VARCHAR(255),
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_iclaims_jc FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_iclaims_ins FOREIGN KEY (insurance_id) REFERENCES vehicle_insurance(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 13: PURCHASES
-- ============================================================

CREATE TABLE purchase_orders (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    vendor_id CHAR(36) NOT NULL,
    po_number VARCHAR(50) NOT NULL,
    order_date DATE NOT NULL,
    expected_date DATE,
    status ENUM('draft', 'sent', 'received', 'partial', 'cancelled') NOT NULL DEFAULT 'draft',
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_by CHAR(36) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_po_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_po_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    CONSTRAINT fk_po_user FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE purchase_order_items (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    po_id CHAR(36) NOT NULL,
    spare_part_id CHAR(36) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    tax_category_id CHAR(36),
    received_qty INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_poitems_po FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_poitems_part FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id),
    CONSTRAINT fk_poitems_tax FOREIGN KEY (tax_category_id) REFERENCES tax_rates(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 14: CRM & FOLLOWUPS
-- ============================================================

CREATE TABLE crm_followups (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    customer_id CHAR(36) NOT NULL,
    vehicle_id CHAR(36) NOT NULL,
    followup_type ENUM('upcoming_service', 'insurance_renewal', 'feedback', 'dropout_recovery', 'new_customer') NOT NULL,
    scheduled_date DATE NOT NULL,
    notes TEXT,
    status ENUM('pending', 'done', 'no_response', 'rescheduled') NOT NULL DEFAULT 'pending',
    assigned_to CHAR(36),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_crm_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_crm_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_crm_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    CONSTRAINT fk_crm_user FOREIGN KEY (assigned_to) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE message_templates (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    channel ENUM('sms', 'whatsapp', 'email') NOT NULL,
    template_body TEXT NOT NULL,
    variables JSON, -- Array of strings e.g. ["customer_name", "vehicle_no"]
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_msgtpl_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 15: COUNTER SALES
-- ============================================================

CREATE TABLE counter_sales (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    sale_no VARCHAR(50) NOT NULL,
    garage_id CHAR(36) NOT NULL,
    customer_id CHAR(36),
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) NOT NULL,
    payment_method ENUM('cash', 'upi', 'card', 'netbanking', 'cheque', 'insurance', 'credit_note') NOT NULL DEFAULT 'cash',
    created_by CHAR(36) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_sale_no (sale_no),
    CONSTRAINT fk_csales_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE,
    CONSTRAINT fk_csales_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    CONSTRAINT fk_csales_user FOREIGN KEY (created_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE counter_sale_items (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    sale_id CHAR(36) NOT NULL,
    spare_part_id CHAR(36) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1.000,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_total DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_csitems_sale FOREIGN KEY (sale_id) REFERENCES counter_sales(id) ON DELETE CASCADE,
    CONSTRAINT fk_csitems_part FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 16: SALVAGE
-- ============================================================

CREATE TABLE salvages (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    job_card_id CHAR(36) NOT NULL,
    garage_id CHAR(36) NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'claimed', 'disposed') NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_salvages_jc FOREIGN KEY (job_card_id) REFERENCES job_cards(id) ON DELETE CASCADE,
    CONSTRAINT fk_salvages_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 17: OFFERS & PROMOTIONS
-- ============================================================

CREATE TABLE offers (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    garage_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    offer_type ENUM('percentage', 'fixed', 'free_service', 'free_part') NOT NULL DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    applicable_to ENUM('all', 'specific_vehicle', 'specific_service', 'specific_brand') NOT NULL DEFAULT 'all',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_offers_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 18: AUDIT LOG
-- ============================================================

CREATE TABLE audit_logs (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    organization_id CHAR(36) NOT NULL,
    garage_id CHAR(36),
    user_id CHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id CHAR(36) NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_audit_org FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT fk_audit_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE SET NULL,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TIER 19: NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id CHAR(36) NOT NULL DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    garage_id CHAR(36),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type ENUM('job_update', 'payment', 'reminder', 'system') NOT NULL DEFAULT 'system',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    reference_type VARCHAR(50),
    reference_id CHAR(36),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_garage FOREIGN KEY (garage_id) REFERENCES garages(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET foreign_key_checks = 1;
