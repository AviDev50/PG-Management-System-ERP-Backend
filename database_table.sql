CREATE DATABASE pg_erp;
USE pg_erp;

-- ============================
-- TABLE 1: roles
-- ============================
CREATE TABLE roles (
    role_id    INT         NOT NULL AUTO_INCREMENT,
    name       VARCHAR(50) NOT NULL,
    created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME    NULL DEFAULT NULL,
    PRIMARY KEY (role_id)
);

-- INSERT INTO roles (name) VALUES ('super_admin'), ('admin'), ('branch_manager');

-- ============================
-- TABLE 2: users
-- ============================
CREATE TABLE users (
    user_id       INT          NOT NULL AUTO_INCREMENT,
    role_id       INT          NOT NULL,
    name          VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login_at DATETIME     NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    DATETIME     NULL DEFAULT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (role_id)
);

-- ============================
-- TABLE 3: properties
-- ============================
CREATE TABLE properties (
    property_id INT          NOT NULL AUTO_INCREMENT,
    user_id     INT          NOT NULL COMMENT ,
    name        VARCHAR(150) NOT NULL,
    address     TEXT         NOT NULL,
    city        VARCHAR(100) NOT NULL,
    state       VARCHAR(100) NOT NULL,
    pincode     VARCHAR(10)  NULL,
    phone       VARCHAR(15)  NULL,
    email       VARCHAR(150) NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME     NULL DEFAULT NULL,
    PRIMARY KEY (property_id),
    CONSTRAINT fk_properties_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- ============================
-- TABLE 4: branches
-- ============================
CREATE TABLE branches (
    branch_id    INT          NOT NULL AUTO_INCREMENT,
    property_id  INT          NOT NULL,
    name         VARCHAR(150) NOT NULL,
    address      TEXT         NOT NULL,
    city         VARCHAR(100) NOT NULL,
    state        VARCHAR(100) NOT NULL,
    pincode      VARCHAR(10)  NULL,
    phone        VARCHAR(15)  NULL,
    manager_id   INT          NULL ,
    total_rooms  INT          NULL,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   DATETIME     NULL DEFAULT NULL,
    PRIMARY KEY (branch_id),
    CONSTRAINT fk_branches_property FOREIGN KEY (property_id) REFERENCES properties (property_id) ON DELETE CASCADE,
    CONSTRAINT fk_branches_manager FOREIGN KEY (manager_id) REFERENCES users (user_id) ON DELETE SET NULL
);

-- ============================
-- TABLE 5: user_branches
-- ============================
CREATE TABLE user_branches (
    user_branch_id INT      NOT NULL AUTO_INCREMENT,
    user_id        INT      NOT NULL,
    branch_id      INT      NOT NULL,
    assigned_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at     DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (user_branch_id),
    UNIQUE KEY uq_user_branch (user_id, branch_id),
    CONSTRAINT fk_ub_user   FOREIGN KEY (user_id)   REFERENCES users    (user_id)   ON DELETE CASCADE,
    CONSTRAINT fk_ub_branch FOREIGN KEY (branch_id) REFERENCES branches (branch_id) ON DELETE CASCADE
);

-- ============================
-- TABLE 6: amenities
-- ============================
CREATE TABLE amenities (
    amenity_id  INT          NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    description TEXT         NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  DATETIME     NULL DEFAULT NULL,
    PRIMARY KEY (amenity_id),
    UNIQUE KEY uq_amenities_name (name)
);

-- ============================
-- TABLE 7: rooms
-- ============================
CREATE TABLE rooms (
    room_id          INT                                          NOT NULL AUTO_INCREMENT,
    branch_id        INT                                          NOT NULL,
    name             VARCHAR(50)                                  NOT NULL,
    floor            INT                                          NULL,
    capacity         INT                                          NOT NULL,
    electricity_type ENUM('inclusive', 'exclusive')               NOT NULL DEFAULT 'exclusive',
    room_type        ENUM('single', 'double', 'triple')           NOT NULL,
    room_monthly_rent     DECIMAL(10,2)                           NOT NULL,
    is_active        BOOLEAN                                      NOT NULL DEFAULT TRUE,
    created_at       DATETIME                                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME                                     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at       DATETIME                                     NULL DEFAULT NULL,
    PRIMARY KEY (room_id),
    CONSTRAINT fk_rooms_branch FOREIGN KEY (branch_id) REFERENCES branches (branch_id) ON DELETE CASCADE
);

-- ============================
-- TABLE 8: room_amenities
-- ============================
CREATE TABLE room_amenities (
    room_amenity_id INT      NOT NULL AUTO_INCREMENT,
    room_id         INT      NOT NULL,
    amenity_id      INT      NOT NULL,
    assigned_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (room_amenity_id),
    UNIQUE KEY uq_room_amenity (room_id, amenity_id),
    CONSTRAINT fk_ra_room    FOREIGN KEY (room_id)    REFERENCES rooms     (room_id)    ON DELETE CASCADE,
    CONSTRAINT fk_ra_amenity FOREIGN KEY (amenity_id) REFERENCES amenities (amenity_id) ON DELETE CASCADE
);

-- ============================
-- TABLE 9: beds
-- ============================
	CREATE TABLE beds (
		bed_id       INT                                               NOT NULL AUTO_INCREMENT,
		room_id      INT                                               NOT NULL,
		label        VARCHAR(20)                                       NOT NULL,
		bed_type     ENUM('single', 'bunk_lower', 'bunk_upper', 'mattress') NOT NULL,
		status       ENUM('vacant', 'occupied')                        NOT NULL DEFAULT 'vacant',
		bed_monthly_rent DECIMAL(10,2)                                    NULL,
		created_at   DATETIME                                          NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at   DATETIME                                          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		deleted_at   DATETIME                                          NULL DEFAULT NULL,
		PRIMARY KEY (bed_id),
		CONSTRAINT fk_beds_room FOREIGN KEY (room_id) REFERENCES rooms (room_id) ON DELETE CASCADE
	);

-- ============================
-- TABLE 10: managers 
-- ============================
CREATE TABLE managers (
    manager_id   INT          NOT NULL AUTO_INCREMENT,
    user_id      INT          NOT NULL COMMENT 'Reference to users table',
    branch_id    INT          NOT NULL,
    phone        VARCHAR(15)  NOT NULL,
    salary       DECIMAL(10,2) NULL,
    joining_date DATE         NOT NULL,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   DATETIME     NULL DEFAULT NULL,
    PRIMARY KEY (manager_id),
    CONSTRAINT fk_managers_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_managers_branch FOREIGN KEY (branch_id) REFERENCES branches (branch_id) ON DELETE CASCADE
);

-- ============================
-- TABLE 11: tenants
-- ============================
CREATE TABLE tenants (
    tenant_id          INT                                          NOT NULL AUTO_INCREMENT,
    bed_id             INT                                          NOT NULL,
    branch_id          INT                                          NOT NULL,
    first_name         VARCHAR(100)                                 NOT NULL,
    last_name          VARCHAR(100)                                 NOT NULL,
    phone              VARCHAR(15)                                  NOT NULL,
    email              VARCHAR(150)                                 NULL,
    id_proof_type      ENUM('aadhar', 'pan', 'passport', 'driving_license') NULL,
    id_proof_number    VARCHAR(50)                                  NULL,
    check_in_date DATE NOT NULL,                                       
    expected_exit_date DATE                                         NULL,
    security_deposit   DECIMAL(10,2)                                NOT NULL DEFAULT 0.00,
    emergency_contact  VARCHAR(15)                                  NULL,
    status             ENUM('active', 'vacated')                    NOT NULL DEFAULT 'active',
    created_at         DATETIME                                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         DATETIME                                     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at         DATETIME                                     NULL DEFAULT NULL,
    PRIMARY KEY (tenant_id),
    CONSTRAINT fk_tenants_bed    FOREIGN KEY (bed_id)    REFERENCES beds     (bed_id),
    CONSTRAINT fk_tenants_branch FOREIGN KEY (branch_id) REFERENCES branches (branch_id)
);

-- ============================
-- TABLE 12: tenant_transfers
-- ============================
CREATE TABLE tenant_transfers (
    transfer_id     INT                                      NOT NULL AUTO_INCREMENT,
    tenant_id       INT                                      NOT NULL,
    old_room_id     INT                                      NOT NULL,
    old_bed_id      INT                                      NOT NULL,
    new_room_id     INT                                      NOT NULL,
    new_bed_id      INT                                      NOT NULL,
    transfer_date   DATE                                     NOT NULL,
    reason          TEXT                                     NULL,
    transfer_status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    transferred_by  INT                                      NULL,
    created_at      DATETIME                                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME                                 NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME                                 NULL DEFAULT NULL,
    PRIMARY KEY (transfer_id),
    CONSTRAINT fk_tt_tenant      FOREIGN KEY (tenant_id)     REFERENCES tenants (tenant_id),
    CONSTRAINT fk_tt_old_room    FOREIGN KEY (old_room_id)   REFERENCES rooms   (room_id),
    CONSTRAINT fk_tt_old_bed     FOREIGN KEY (old_bed_id)    REFERENCES beds    (bed_id),
    CONSTRAINT fk_tt_new_room    FOREIGN KEY (new_room_id)   REFERENCES rooms   (room_id),
    CONSTRAINT fk_tt_new_bed     FOREIGN KEY (new_bed_id)    REFERENCES beds    (bed_id),
    CONSTRAINT fk_tt_transferred FOREIGN KEY (transferred_by) REFERENCES users  (user_id)
);

-- ============================
-- TABLE 13: meal_plans
-- ============================
CREATE TABLE meal_plans (
    meal_plan_id INT          NOT NULL AUTO_INCREMENT,
    branch_id    INT          NOT NULL,
    name         VARCHAR(100) NOT NULL,
    breakfast    BOOLEAN      NOT NULL DEFAULT FALSE,
    lunch        BOOLEAN      NOT NULL DEFAULT FALSE,
    dinner       BOOLEAN      NOT NULL DEFAULT FALSE,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at   DATETIME     NULL DEFAULT NULL,
    PRIMARY KEY (meal_plan_id),
    CONSTRAINT fk_mp_branch FOREIGN KEY (branch_id) REFERENCES branches (branch_id) ON DELETE CASCADE
);

-- ============================
-- TABLE 14: tenant_meal_plans
-- ============================
CREATE TABLE tenant_meal_plans (
    tenant_meal_plan_id INT      NOT NULL AUTO_INCREMENT,
    tenant_id           INT      NOT NULL,
    meal_plan_id        INT      NOT NULL,
    assigned_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (tenant_meal_plan_id),
    CONSTRAINT fk_tmp_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_tmp_meal_plan FOREIGN KEY (meal_plan_id) REFERENCES meal_plans (meal_plan_id)
);

-- ============================
-- TABLE 15: electricity_readings
-- ============================
CREATE TABLE electricity_readings (
    reading_id    INT           NOT NULL AUTO_INCREMENT,
    room_id       INT           NOT NULL,
    start_reading DECIMAL(10,2) NOT NULL,
    end_reading   DECIMAL(10,2) NOT NULL,
    total_units   DECIMAL(10,2) GENERATED ALWAYS AS (end_reading - start_reading) STORED,
    unit_price    DECIMAL(8,4)  NOT NULL,
    total_amount  DECIMAL(10,2) GENERATED ALWAYS AS ((end_reading - start_reading) * unit_price) STORED,
    bill_month    DATE          NOT NULL,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    DATETIME      NULL DEFAULT NULL,
    PRIMARY KEY (reading_id),
    CONSTRAINT fk_er_room FOREIGN KEY (room_id) REFERENCES rooms (room_id) ON DELETE CASCADE
);

-- ============================
-- TABLE 16: tenant_electricity_bills
-- ============================
CREATE TABLE tenant_electricity_bills (
    bill_id    INT                    NOT NULL AUTO_INCREMENT,
    tenant_id  INT                    NOT NULL,
    reading_id INT                    NOT NULL,
    amount     DECIMAL(10,2)          NOT NULL,
    status     ENUM('pending', 'paid') NOT NULL DEFAULT 'pending',
    paid_at    DATETIME               NULL,
    created_at DATETIME               NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME               NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME               NULL DEFAULT NULL,
    PRIMARY KEY (bill_id),
    CONSTRAINT fk_teb_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants               (tenant_id) ON DELETE CASCADE,
    CONSTRAINT fk_teb_reading FOREIGN KEY (reading_id) REFERENCES electricity_readings  (reading_id) ON DELETE CASCADE
);

-- ============================
-- TABLE 17: complaints
-- ============================
CREATE TABLE complaints (
    complaint_id    INT                                                       NOT NULL AUTO_INCREMENT,
    tenant_id       INT                                                       NOT NULL,
    branch_id       INT                                                       NOT NULL,
    title           VARCHAR(200)                                              NOT NULL,
    description     TEXT                                                      NOT NULL,
    category        ENUM('maintenance', 'noise', 'cleanliness', 'food', 'security', 'other') NOT NULL,
    status          ENUM('open', 'in_progress', 'resolved')                  NOT NULL DEFAULT 'open',

    created_at      DATETIME                                                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME                                                  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME                                                  NULL DEFAULT NULL,

    PRIMARY KEY (complaint_id),
    CONSTRAINT fk_complaints_tenant FOREIGN KEY (tenant_id) REFERENCES tenants  (tenant_id),
    CONSTRAINT fk_complaints_branch FOREIGN KEY (branch_id) REFERENCES branches (branch_id)
);

-- ============================
-- TABLE 18: payments
-- ============================
CREATE TABLE payments (
    payment_id      INT                                         NOT NULL AUTO_INCREMENT,
    tenant_id       INT                                         NOT NULL,
    branch_id       INT                                         NOT NULL,
    amount          DECIMAL(10,2)                               NOT NULL,
    payment_mode    ENUM('cash', 'upi', 'bank_transfer', 'cheque') NOT NULL,
    payment_date    DATE                                        NOT NULL,
    billing_month DATE NOT NULL,
    status          ENUM('paid', 'pending')                    NOT NULL DEFAULT 'paid',
    transaction_ref VARCHAR(100)                                NULL,
    notes           TEXT                                        NULL,
    created_at      DATETIME                                    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME                                    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      DATETIME                                    NULL DEFAULT NULL,
    PRIMARY KEY (payment_id),
    CONSTRAINT fk_payments_tenant FOREIGN KEY (tenant_id) REFERENCES tenants  (tenant_id),
    CONSTRAINT fk_payments_branch FOREIGN KEY (branch_id) REFERENCES branches (branch_id)
);

-- ============================
-- TABLE 19: expenses
-- ============================


CREATE TABLE expense_categories (
    expense_category_id INT          NOT NULL AUTO_INCREMENT,
    name                VARCHAR(100) NOT NULL,
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME     NULL DEFAULT NULL,
    PRIMARY KEY (expense_category_id)
   
);



CREATE TABLE expenses (
    expense_id          INT           NOT NULL AUTO_INCREMENT,
    branch_id           INT           NOT NULL,
    expense_category_id INT           NOT NULL,
    amount              DECIMAL(10,2) NOT NULL,
    expense_date        DATE          NOT NULL,
    description         TEXT          NULL,
    receipt_url         VARCHAR(255)  NULL,

    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at          DATETIME      NULL DEFAULT NULL,
    PRIMARY KEY (expense_id),
    CONSTRAINT fk_expenses_branch 
        FOREIGN KEY (branch_id) 
        REFERENCES branches (branch_id),

    CONSTRAINT fk_expenses_category
        FOREIGN KEY (expense_category_id)
        REFERENCES expense_categories (expense_category_id)
);


