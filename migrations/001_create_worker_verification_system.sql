-- =====================================================================================
-- Migration 001: Worker Verification System - 3-Tier Separation Schema
-- Platform: ShramSetu Democratic Labour Cooperative System
-- Compliance: Cooperative Societies Act & Worker Welfare Regulations
-- Architecture Note on CLC & Official Gateways:
--   This migration establishes the foundation for 3 distinct, non-overlapping
--   verification layers:
--     1. Government / Official Verification (e.g. CLC, State Labour Dept, Skill Authority)
--     2. Cooperative Verification (Co-op Society & Federation KYC/membership)
--     3. ShramSetu Platform Verification (Safety handshake, platform onboarding KYC)
--   IMPORTANT: Prototype simulated records are clearly marked with DEMO tags.
--   No live scraping or unauthorized government calls are executed.
-- =====================================================================================

-- 1. Ensure Workers table has the 3-Tier Verification status fields
CREATE TABLE IF NOT EXISTS workers (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    email VARCHAR(255) NOT NULL,
    service_area VARCHAR(255) NOT NULL,
    cooperative_id VARCHAR(64) NOT NULL,
    cooperative_name VARCHAR(255) NOT NULL,
    primary_trade VARCHAR(64) NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    base_charge DECIMAL(10, 2) NOT NULL DEFAULT 249.00,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    rating DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,
    completed_jobs_count INT NOT NULL DEFAULT 0,
    joined_date DATE NOT NULL,
    aadhar_verified BOOLEAN NOT NULL DEFAULT FALSE,
    police_verification_status VARCHAR(32) NOT NULL DEFAULT 'pending',

    -- Cooperative Layer Verification
    cooperative_verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING'
        CHECK (cooperative_verification_status IN ('PENDING', 'VERIFIED', 'NOT_VERIFIED', 'EXPIRED', 'REQUIRES_REVIEW')),
    cooperative_verified_at TIMESTAMP NULL,
    cooperative_verified_by VARCHAR(255) NULL,

    -- ShramSetu Platform Layer Verification
    shramsetu_verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING'
        CHECK (shramsetu_verification_status IN ('PENDING', 'VERIFIED', 'NOT_VERIFIED', 'EXPIRED', 'REQUIRES_REVIEW')),
    shramsetu_verified_at TIMESTAMP NULL,
    shramsetu_verified_by VARCHAR(255) NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create GovernmentVerification table
CREATE TABLE IF NOT EXISTS government_verifications (
    id VARCHAR(64) PRIMARY KEY,
    worker_id VARCHAR(64) NOT NULL,
    authority VARCHAR(64) NOT NULL
        CHECK (authority IN (
            'CLC',
            'STATE_LABOUR_DEPARTMENT',
            'COOPERATIVE_FEDERATION',
            'COOPERATIVE_SOCIETY',
            'SKILL_CERTIFICATION_AUTHORITY',
            'OTHER_AUTHORIZED_AUTHORITY'
        )),
    verification_reference VARCHAR(128) NOT NULL,
    verification_type VARCHAR(64) NOT NULL
        CHECK (verification_type IN (
            'WORKER_REGISTRATION',
            'COOPERATIVE_MEMBERSHIP',
            'SKILL_CERTIFICATION',
            'LABOUR_REGISTRATION',
            'IDENTITY_VERIFICATION',
            'OTHER'
        )),
    status VARCHAR(32) NOT NULL
        CHECK (status IN (
            'PENDING',
            'VERIFIED',
            'NOT_VERIFIED',
            'EXPIRED',
            'REQUIRES_REVIEW'
        )),
    verified_at TIMESTAMP NULL,
    last_checked_at TIMESTAMP NOT NULL,
    source VARCHAR(128) NOT NULL,
    notes TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_gov_verif_worker
        FOREIGN KEY (worker_id)
        REFERENCES workers(id)
        ON DELETE CASCADE
);

-- 3. Create Strategic Indexes for High-Performance Verification Queries
CREATE INDEX IF NOT EXISTS idx_gov_verif_worker_id
    ON government_verifications(worker_id);

CREATE INDEX IF NOT EXISTS idx_gov_verif_authority
    ON government_verifications(authority);

CREATE INDEX IF NOT EXISTS idx_gov_verif_status
    ON government_verifications(status);

CREATE INDEX IF NOT EXISTS idx_gov_verif_type
    ON government_verifications(verification_type);

CREATE INDEX IF NOT EXISTS idx_gov_verif_ref
    ON government_verifications(verification_reference);

CREATE INDEX IF NOT EXISTS idx_workers_coop_status
    ON workers(cooperative_verification_status);

CREATE INDEX IF NOT EXISTS idx_workers_shramsetu_status
    ON workers(shramsetu_verification_status);

