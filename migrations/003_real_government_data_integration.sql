-- =====================================================================================
-- Migration 003: Real Government Data Integration Architecture Schema
-- Platform: ShramSetu Democratic Labour Cooperative System
-- Compliance: Official CLC (Central) & Ministry of Labour e-Shram Guidelines
--
-- Security & Privacy Guarantees:
-- 1. Does NOT store Aadhaar numbers, biometric data, or sensitive PII.
-- 2. Stores cryptographic raw_response_hash (SHA-256) of permitted payload for auditability.
-- 3. Accommodates official external reference numbers and standardized error tracking.
-- =====================================================================================

-- 1. Add Real Government Verification Provider fields to government_verifications
ALTER TABLE government_verifications
    ADD COLUMN IF NOT EXISTS provider VARCHAR(64) NOT NULL DEFAULT 'CLC',
    ADD COLUMN IF NOT EXISTS external_reference VARCHAR(255) NULL,
    ADD COLUMN IF NOT EXISTS verification_status VARCHAR(64) NOT NULL DEFAULT 'NOT_CONFIGURED'
        CHECK (verification_status IN ('VERIFIED', 'PENDING', 'REJECTED', 'NOT_VERIFIED', 'NOT_CONFIGURED', 'FAILED', 'EXPIRED')),
    ADD COLUMN IF NOT EXISTS verified_name VARCHAR(255) NULL,
    ADD COLUMN IF NOT EXISTS verified_worker_category VARCHAR(128) NULL,
    ADD COLUMN IF NOT EXISTS verified_registration_date TIMESTAMP NULL,
    ADD COLUMN IF NOT EXISTS raw_response_hash VARCHAR(128) NULL,
    ADD COLUMN IF NOT EXISTS error_code VARCHAR(64) NULL,
    ADD COLUMN IF NOT EXISTS error_message TEXT NULL;

-- 2. Index for rapid provider queries and external reference lookup
CREATE INDEX IF NOT EXISTS idx_gov_verif_provider_ref
    ON government_verifications(provider, external_reference);

CREATE INDEX IF NOT EXISTS idx_gov_verif_verification_status
    ON government_verifications(verification_status);

-- 3. Verification Audit Trail Log Table
CREATE TABLE IF NOT EXISTS government_verification_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    worker_id VARCHAR(64) NOT NULL,
    provider VARCHAR(64) NOT NULL,
    request_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    response_status VARCHAR(64) NOT NULL,
    verification_result VARCHAR(64) NOT NULL,
    error_code VARCHAR(64) NULL,
    raw_response_hash VARCHAR(128) NULL,
    actor_id VARCHAR(64) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,

    CONSTRAINT fk_gov_audit_worker
        FOREIGN KEY (worker_id)
        REFERENCES workers(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_gov_audit_worker
    ON government_verification_audit_logs(worker_id, request_timestamp DESC);

