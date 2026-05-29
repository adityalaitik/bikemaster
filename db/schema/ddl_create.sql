-- ============================================================
-- RAMP WMS - PostgreSQL Complete DDL Create Script
-- Compatibility: PostgreSQL 12+
-- Description: Standard relational DDL for Workshop Management System
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TIER 1: SUPER ADMIN / PLATFORM LEVEL
-- ============================================================

CREATE TYPE subscription_plan AS ENUM ('starter', 'pro', 'enterprise');

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan subscription_plan NOT NULL DEFAULT 'starter',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE garages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 2: USER & ACCESS MANAGEMENT
-- ============================================================

CREATE TYPE user_role AS ENUM (
    'super_admin',
    'org_admin',
    'garage_manager',
    'service_advisor',
    'technician',
    'cashier',
    'viewer'
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'viewer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_garage_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, garage_id)
);

CREATE TABLE designations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE employee_type AS ENUM ('technician', 'supervisor', 'service_advisor');

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    designation_id UUID REFERENCES designations(id) ON DELETE SET NULL,
    employee_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    type employee_type NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 3: VEHICLE & CUSTOMER MASTER
-- ============================================================

CREATE TABLE vehicle_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TYPE fuel_type_enum AS ENUM ('petrol', 'diesel', 'electric', 'cng', 'hybrid');
CREATE TYPE vehicle_type_enum AS ENUM ('two_wheeler', 'three_wheeler', 'four_wheeler', 'commercial');

CREATE TABLE vehicle_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES vehicle_brands(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    fuel_type fuel_type_enum NOT NULL DEFAULT 'petrol',
    vehicle_type vehicle_type_enum NOT NULL DEFAULT 'two_wheeler',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE vehicle_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES vehicle_models(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE vehicle_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE customer_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    company_name VARCHAR(255),
    gstin VARCHAR(20),
    contact_person VARCHAR(255),
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TYPE customer_type_enum AS ENUM ('individual', 'corporate');

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    gstin VARCHAR(20),
    customer_type customer_type_enum NOT NULL DEFAULT 'individual',
    source_id UUID REFERENCES customer_sources(id) ON DELETE SET NULL,
    loyalty_points INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE plate_color_enum AS ENUM ('white', 'yellow', 'green', 'black', 'blue');

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_no VARCHAR(20) NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    model_id UUID NOT NULL REFERENCES vehicle_models(id),
    variant_id UUID REFERENCES vehicle_variants(id),
    category_id UUID REFERENCES vehicle_categories(id),
    number_plate_color plate_color_enum NOT NULL DEFAULT 'white',
    chassis_no VARCHAR(100),
    engine_no VARCHAR(100),
    mfg_year SMALLINT,
    date_of_registration DATE,
    color VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    is_primary_owner BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 4: JOB CARD & SERVICE WORKFLOW
-- ============================================================

CREATE TYPE job_card_status AS ENUM (
    'draft',
    'under_servicing',
    'next_day_delivery',
    'upcoming_delivery',
    'ready_for_delivery',
    'payment_processing',
    'completed',
    'deleted'
);

CREATE TYPE service_type_enum AS ENUM (
    'regular',
    'accidental',
    'insurance_claim',
    'express',
    'free_service'
);

CREATE TABLE job_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_card_no VARCHAR(50) UNIQUE NOT NULL,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    service_advisor_id UUID REFERENCES employees(id),
    odometer_in INTEGER NOT NULL,
    odometer_out INTEGER,
    status job_card_status NOT NULL DEFAULT 'draft',
    service_type service_type_enum NOT NULL DEFAULT 'regular',
    date_of_arrival TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    promised_delivery_date TIMESTAMPTZ,
    actual_delivery_date TIMESTAMPTZ,
    customer_complaints TEXT,
    workshop_findings TEXT,
    internal_notes TEXT,
    customer_notes TEXT,
    gate_pass_no VARCHAR(50),
    gate_pass_issued_at TIMESTAMPTZ,
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
    rating_feedback TEXT,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_card_technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_card_id UUID NOT NULL REFERENCES job_cards(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES employees(id),
    supervisor_id UUID REFERENCES employees(id),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE TYPE image_type_enum AS ENUM ('vehicle_in', 'vehicle_out', 'damage', 'work_progress', 'other');

CREATE TABLE job_card_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_card_id UUID NOT NULL REFERENCES job_cards(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type image_type_enum NOT NULL DEFAULT 'other',
    uploaded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_card_id UUID NOT NULL REFERENCES job_cards(id) ON DELETE CASCADE,
    checklist_data JSONB NOT NULL,
    inspected_by UUID NOT NULL REFERENCES employees(id),
    inspected_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 5: COMPLAINTS & SERVICES IN JOB
-- ============================================================

CREATE TYPE complaint_action_enum AS ENUM ('repair_now', 'repair_later', 'inform_customer', 'monitor', 'rejected');

CREATE TABLE job_complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_card_id UUID NOT NULL REFERENCES job_cards(id) ON DELETE CASCADE,
    complaint_text TEXT NOT NULL,
    workshop_finding TEXT,
    action complaint_action_enum NOT NULL DEFAULT 'repair_now',
    is_rejected BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 12: TAX & GST (Required by Spares and Services master)
-- ============================================================

CREATE TABLE tax_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    cgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    sgst_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    igst_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- TIER 6: INVENTORY / SPARES MASTER
-- ============================================================

CREATE TABLE spare_brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE spare_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    part_name VARCHAR(255) NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    brand_id UUID REFERENCES spare_brands(id),
    hsn_code VARCHAR(20),
    unit VARCHAR(20) NOT NULL DEFAULT 'PCS',
    tax_category_id UUID REFERENCES tax_rates(id),
    reorder_level INTEGER NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    gstin VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE inventory_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id) ON DELETE CASCADE,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    batch_no VARCHAR(100) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    mrp DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    selling_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    quantity INTEGER NOT NULL DEFAULT 0,
    available_qty INTEGER NOT NULL DEFAULT 0,
    expiry_date DATE,
    vendor_id UUID REFERENCES vendors(id),
    purchase_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE transaction_type_enum AS ENUM ('purchase', 'issue', 'return', 'transfer_in', 'transfer_out', 'adjustment');
CREATE TYPE reference_type_enum AS ENUM ('job_card', 'counter_sale', 'transfer', 'adjustment');

CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id) ON DELETE CASCADE,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES inventory_batches(id) ON DELETE SET NULL,
    transaction_type transaction_type_enum NOT NULL,
    reference_type reference_type_enum NOT NULL,
    reference_id UUID,
    quantity INTEGER NOT NULL, -- positive=in, negative=out
    unit_price DECIMAL(10,2) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 7: SERVICES MASTER
-- ============================================================

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_code VARCHAR(50) NOT NULL,
    hsn_sac_code VARCHAR(20),
    default_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_category_id UUID REFERENCES tax_rates(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 8: PACKAGES
-- ============================================================

CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    package_name VARCHAR(255) NOT NULL,
    description TEXT,
    total_price DECIMAL(10,2) NOT NULL,
    validity_days INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE item_type_enum AS ENUM ('spare', 'service');

CREATE TABLE package_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    item_type item_type_enum NOT NULL,
    spare_part_id UUID REFERENCES spare_parts(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1.000,
    rate DECIMAL(10,2) NOT NULL
);

CREATE TYPE sold_package_status AS ENUM ('active', 'consumed', 'expired');

CREATE TABLE sold_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    sold_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_until DATE NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    status sold_package_status NOT NULL DEFAULT 'active'
);

-- ============================================================
-- TIER 9: ESTIMATION / INVOICE ITEMS
-- ============================================================

CREATE TYPE billed_to_enum AS ENUM ('customer', 'insurance');
CREATE TYPE spare_item_status AS ENUM ('estimated', 'issued', 'returned', 'rejected');

CREATE TABLE job_spare_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_card_id UUID NOT NULL REFERENCES job_cards(id) ON DELETE CASCADE,
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    batch_id UUID REFERENCES inventory_batches(id),
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1.000,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    mrp DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    billed_to billed_to_enum NOT NULL DEFAULT 'customer',
    status spare_item_status NOT NULL DEFAULT 'estimated',
    from_package_id UUID REFERENCES sold_packages(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE service_item_status AS ENUM ('estimated', 'completed', 'rejected');

CREATE TABLE job_service_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_card_id UUID NOT NULL REFERENCES job_cards(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id),
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1.000,
    rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    billed_to billed_to_enum NOT NULL DEFAULT 'customer',
    status service_item_status NOT NULL DEFAULT 'estimated',
    from_package_id UUID REFERENCES sold_packages(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 10: INVOICES & PAYMENTS
-- ============================================================

CREATE TYPE invoice_type_enum AS ENUM ('tax_invoice', 'estimate', 'counter_sale');
CREATE TYPE invoice_status_enum AS ENUM ('draft', 'sent', 'paid', 'partial', 'cancelled');

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    job_card_id UUID REFERENCES job_cards(id) ON DELETE SET NULL,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    invoice_type invoice_type_enum NOT NULL DEFAULT 'tax_invoice',
    subtotal DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    coupon_code VARCHAR(50),
    coupon_discount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL,
    customer_amount DECIMAL(12,2) NOT NULL,
    insurance_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status invoice_status_enum NOT NULL DEFAULT 'draft',
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE payment_method_enum AS ENUM ('cash', 'upi', 'card', 'netbanking', 'cheque', 'insurance', 'credit_note');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method payment_method_enum NOT NULL DEFAULT 'cash',
    reference_no VARCHAR(100),
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE discount_type_enum AS ENUM ('percentage', 'fixed');

CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_card_id UUID NOT NULL REFERENCES job_cards(id) ON DELETE CASCADE,
    discount_type discount_type_enum NOT NULL DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    reason TEXT,
    approved_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 11: INSURANCE
-- ============================================================

CREATE TABLE insurance_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TYPE insurance_status_enum AS ENUM ('active', 'expired', 'claimed');

CREATE TABLE vehicle_insurance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES insurance_providers(id) ON DELETE CASCADE,
    policy_number VARCHAR(100) NOT NULL,
    insured_name VARCHAR(255) NOT NULL,
    insured_amount DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status insurance_status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE claim_status_enum AS ENUM ('pending', 'approved', 'partial', 'rejected');

CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_card_id UUID NOT NULL REFERENCES job_cards(id) ON DELETE CASCADE,
    insurance_id UUID NOT NULL REFERENCES vehicle_insurance(id) ON DELETE CASCADE,
    claim_no VARCHAR(100) NOT NULL,
    claimed_amount DECIMAL(12,2) NOT NULL,
    approved_amount DECIMAL(12,2) DEFAULT 0.00,
    status claim_status_enum NOT NULL DEFAULT 'pending',
    surveyor_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 13: PURCHASES
-- ============================================================

CREATE TYPE po_status_enum AS ENUM ('draft', 'sent', 'received', 'partial', 'cancelled');

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    po_number VARCHAR(50) NOT NULL,
    order_date DATE NOT NULL,
    expected_date DATE,
    status po_status_enum NOT NULL DEFAULT 'draft',
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    tax_category_id UUID REFERENCES tax_rates(id),
    received_qty INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- TIER 14: CRM & FOLLOWUPS
-- ============================================================

CREATE TYPE followup_type_enum AS ENUM ('upcoming_service', 'insurance_renewal', 'feedback', 'dropout_recovery', 'new_customer');
CREATE TYPE followup_status_enum AS ENUM ('pending', 'done', 'no_response', 'rescheduled');

CREATE TABLE crm_followups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    followup_type followup_type_enum NOT NULL,
    scheduled_date DATE NOT NULL,
    notes TEXT,
    status followup_status_enum NOT NULL DEFAULT 'pending',
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE message_channel_enum AS ENUM ('sms', 'whatsapp', 'email');

CREATE TABLE message_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    channel message_channel_enum NOT NULL,
    template_body TEXT NOT NULL,
    variables JSONB, -- Array of strings e.g. ["customer_name", "vehicle_no"]
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- TIER 15: COUNTER SALES
-- ============================================================

CREATE TABLE counter_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_no VARCHAR(50) UNIQUE NOT NULL,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL, -- Nullable for anonymous walk-ins
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) NOT NULL,
    payment_method payment_method_enum NOT NULL DEFAULT 'cash',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE counter_sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID NOT NULL REFERENCES counter_sales(id) ON DELETE CASCADE,
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id),
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1.000,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_total DECIMAL(10,2) NOT NULL
);

-- ============================================================
-- TIER 16: SALVAGE
-- ============================================================

CREATE TYPE salvage_status_enum AS ENUM ('pending', 'claimed', 'disposed');

CREATE TABLE salvages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_card_id UUID NOT NULL REFERENCES job_cards(id) ON DELETE CASCADE,
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    part_name VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status salvage_status_enum NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 17: OFFERS & PROMOTIONS
-- ============================================================

CREATE TYPE offer_type_enum AS ENUM ('percentage', 'fixed', 'free_service', 'free_part');
CREATE TYPE offer_applicable_enum AS ENUM ('all', 'specific_vehicle', 'specific_service', 'specific_brand');

CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    garage_id UUID NOT NULL REFERENCES garages(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    offer_type offer_type_enum NOT NULL DEFAULT 'percentage',
    discount_value DECIMAL(10,2) NOT NULL,
    applicable_to offer_applicable_enum NOT NULL DEFAULT 'all',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 18: AUDIT LOG
-- ============================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    garage_id UUID REFERENCES garages(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g., "job_card.status_changed"
    entity_type VARCHAR(50) NOT NULL, -- e.g., "job_cards"
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TIER 19: NOTIFICATIONS
-- ============================================================

CREATE TYPE notification_type_enum AS ENUM ('job_update', 'payment', 'reminder', 'system');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    garage_id UUID REFERENCES garages(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type notification_type_enum NOT NULL DEFAULT 'system',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    reference_type VARCHAR(50),
    reference_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
