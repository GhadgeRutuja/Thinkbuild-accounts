-- ============================================================================
-- ThinkBuild Accounts - V1 Foundation Migration
-- ============================================================================

-- 1. Roles table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL REFERENCES roles(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    failed_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by VARCHAR(50),
    updated_by VARCHAR(50)
);

-- 3. Role Permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL REFERENCES roles(id),
    module VARCHAR(30) NOT NULL,
    can_view BOOLEAN NOT NULL DEFAULT FALSE,
    can_create BOOLEAN NOT NULL DEFAULT FALSE,
    can_edit BOOLEAN NOT NULL DEFAULT FALSE,
    can_delete BOOLEAN NOT NULL DEFAULT FALSE,
    can_approve BOOLEAN NOT NULL DEFAULT FALSE,
    can_print BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(role_id, module)
);

-- 4. Audit Log table
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    entity VARCHAR(50),
    entity_id VARCHAR(50),
    details JSONB,
    ip VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Application Settings table
CREATE TABLE IF NOT EXISTS app_settings (
    key VARCHAR(100) PRIMARY KEY,
    value VARCHAR(500) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by VARCHAR(50)
);

-- 6. Seed Roles
INSERT INTO roles (name) VALUES 
    ('Admin'), 
    ('Accountant'), 
    ('Store Keeper'), 
    ('Sales'), 
    ('Cashier'), 
    ('Viewer')
ON CONFLICT (name) DO NOTHING;

-- 7. Seed Role Permissions (13 modules x 6 roles = 78 rows)
-- Modules: DASHBOARD, COA, JOURNAL, PURCHASE, SALES, QUOTATION, PARTY, PAYMENT, RECEIPT, INVENTORY, POS, REPORTS, USERS

-- Admin: all permissions enabled across all modules
INSERT INTO role_permissions (role_id, module, can_view, can_create, can_edit, can_delete, can_approve, can_print)
SELECT r.id, m.module, true, true, true, true, true, true
FROM roles r
CROSS JOIN (
    VALUES 
        ('DASHBOARD'), ('COA'), ('JOURNAL'), ('PURCHASE'), ('SALES'), 
        ('QUOTATION'), ('PARTY'), ('PAYMENT'), ('RECEIPT'), ('INVENTORY'), 
        ('POS'), ('REPORTS'), ('USERS')
) AS m(module)
WHERE r.name = 'Admin'
ON CONFLICT (role_id, module) DO NOTHING;

-- Accountant:
-- can_view, can_create, can_edit, can_print for COA, JOURNAL, PAYMENT, RECEIPT, REPORTS, PARTY, PURCHASE, SALES, QUOTATION
-- DASHBOARD: view only
-- INVENTORY: view + print
-- USERS, POS: no access
INSERT INTO role_permissions (role_id, module, can_view, can_create, can_edit, can_delete, can_approve, can_print)
SELECT r.id, v.module, v.can_view, v.can_create, v.can_edit, v.can_delete, v.can_approve, v.can_print
FROM roles r
CROSS JOIN (
    VALUES 
        ('DASHBOARD', true,  false, false, false, false, false),
        ('COA',       true,  true,  true,  false, false, true),
        ('JOURNAL',   true,  true,  true,  false, false, true),
        ('PURCHASE',  true,  true,  true,  false, false, true),
        ('SALES',     true,  true,  true,  false, false, true),
        ('QUOTATION', true,  true,  true,  false, false, true),
        ('PARTY',     true,  true,  true,  false, false, true),
        ('PAYMENT',   true,  true,  true,  false, false, true),
        ('RECEIPT',   true,  true,  true,  false, false, true),
        ('INVENTORY', true,  false, false, false, false, true),
        ('POS',       false, false, false, false, false, false),
        ('REPORTS',   true,  true,  true,  false, false, true),
        ('USERS',     false, false, false, false, false, false)
) AS v(module, can_view, can_create, can_edit, can_delete, can_approve, can_print)
WHERE r.name = 'Accountant'
ON CONFLICT (role_id, module) DO NOTHING;

-- Store Keeper:
-- INVENTORY: all permissions
-- PURCHASE: view + print
-- DASHBOARD: view
-- Others: no access
INSERT INTO role_permissions (role_id, module, can_view, can_create, can_edit, can_delete, can_approve, can_print)
SELECT r.id, v.module, v.can_view, v.can_create, v.can_edit, v.can_delete, v.can_approve, v.can_print
FROM roles r
CROSS JOIN (
    VALUES 
        ('DASHBOARD', true,  false, false, false, false, false),
        ('COA',       false, false, false, false, false, false),
        ('JOURNAL',   false, false, false, false, false, false),
        ('PURCHASE',  true,  false, false, false, false, true),
        ('SALES',     false, false, false, false, false, false),
        ('QUOTATION', false, false, false, false, false, false),
        ('PARTY',     false, false, false, false, false, false),
        ('PAYMENT',   false, false, false, false, false, false),
        ('RECEIPT',   false, false, false, false, false, false),
        ('INVENTORY', true,  true,  true,  true,  true,  true),
        ('POS',       false, false, false, false, false, false),
        ('REPORTS',   false, false, false, false, false, false),
        ('USERS',     false, false, false, false, false, false)
) AS v(module, can_view, can_create, can_edit, can_delete, can_approve, can_print)
WHERE r.name = 'Store Keeper'
ON CONFLICT (role_id, module) DO NOTHING;

-- Sales:
-- SALES, QUOTATION, PARTY: all permissions
-- INVENTORY: view
-- DASHBOARD: view
-- POS: create + view
-- REPORTS: view
-- Others: no access
INSERT INTO role_permissions (role_id, module, can_view, can_create, can_edit, can_delete, can_approve, can_print)
SELECT r.id, v.module, v.can_view, v.can_create, v.can_edit, v.can_delete, v.can_approve, v.can_print
FROM roles r
CROSS JOIN (
    VALUES 
        ('DASHBOARD', true,  false, false, false, false, false),
        ('COA',       false, false, false, false, false, false),
        ('JOURNAL',   false, false, false, false, false, false),
        ('PURCHASE',  false, false, false, false, false, false),
        ('SALES',     true,  true,  true,  true,  true,  true),
        ('QUOTATION', true,  true,  true,  true,  true,  true),
        ('PARTY',     true,  true,  true,  true,  true,  true),
        ('PAYMENT',   false, false, false, false, false, false),
        ('RECEIPT',   false, false, false, false, false, false),
        ('INVENTORY', true,  false, false, false, false, false),
        ('POS',       true,  true,  false, false, false, false),
        ('REPORTS',   true,  false, false, false, false, false),
        ('USERS',     false, false, false, false, false, false)
) AS v(module, can_view, can_create, can_edit, can_delete, can_approve, can_print)
WHERE r.name = 'Sales'
ON CONFLICT (role_id, module) DO NOTHING;

-- Cashier:
-- POS: all permissions
-- RECEIPT: create + view + print
-- DASHBOARD: view
-- REPORTS: view only
-- Others: no access
INSERT INTO role_permissions (role_id, module, can_view, can_create, can_edit, can_delete, can_approve, can_print)
SELECT r.id, v.module, v.can_view, v.can_create, v.can_edit, v.can_delete, v.can_approve, v.can_print
FROM roles r
CROSS JOIN (
    VALUES 
        ('DASHBOARD', true,  false, false, false, false, false),
        ('COA',       false, false, false, false, false, false),
        ('JOURNAL',   false, false, false, false, false, false),
        ('PURCHASE',  false, false, false, false, false, false),
        ('SALES',     false, false, false, false, false, false),
        ('QUOTATION', false, false, false, false, false, false),
        ('PARTY',     false, false, false, false, false, false),
        ('PAYMENT',   false, false, false, false, false, false),
        ('RECEIPT',   true,  true,  false, false, false, true),
        ('INVENTORY', false, false, false, false, false, false),
        ('POS',       true,  true,  true,  true,  true,  true),
        ('REPORTS',   true,  false, false, false, false, false),
        ('USERS',     false, false, false, false, false, false)
) AS v(module, can_view, can_create, can_edit, can_delete, can_approve, can_print)
WHERE r.name = 'Cashier'
ON CONFLICT (role_id, module) DO NOTHING;

-- Viewer:
-- can_view = true, can_print = true for all except USERS
-- USERS: no access
INSERT INTO role_permissions (role_id, module, can_view, can_create, can_edit, can_delete, can_approve, can_print)
SELECT r.id, v.module, v.can_view, v.can_create, v.can_edit, v.can_delete, v.can_approve, v.can_print
FROM roles r
CROSS JOIN (
    VALUES 
        ('DASHBOARD', true,  false, false, false, false, true),
        ('COA',       true,  false, false, false, false, true),
        ('JOURNAL',   true,  false, false, false, false, true),
        ('PURCHASE',  true,  false, false, false, false, true),
        ('SALES',     true,  false, false, false, false, true),
        ('QUOTATION', true,  false, false, false, false, true),
        ('PARTY',     true,  false, false, false, false, true),
        ('PAYMENT',   true,  false, false, false, false, true),
        ('RECEIPT',   true,  false, false, false, false, true),
        ('INVENTORY', true,  false, false, false, false, true),
        ('POS',       true,  false, false, false, false, true),
        ('REPORTS',   true,  false, false, false, false, true),
        ('USERS',     false, false, false, false, false, false)
) AS v(module, can_view, can_create, can_edit, can_delete, can_approve, can_print)
WHERE r.name = 'Viewer'
ON CONFLICT (role_id, module) DO NOTHING;

-- 8. Seed Application Settings
INSERT INTO app_settings (key, value) VALUES
    ('company_name', 'ThinkBuild Trading LLC'),
    ('currency_code', 'OMR'),
    ('decimals', '3'),
    ('default_tax_rate', '5'),
    ('financial_year_start_month', '1')
ON CONFLICT (key) DO NOTHING;
