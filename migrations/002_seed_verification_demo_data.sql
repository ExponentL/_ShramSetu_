-- =====================================================================================
-- Migration 002: Seed Verification Demo / Prototype Records
-- Platform: ShramSetu Democratic Labour Cooperative System
--
-- Notice:
--   All government records below are simulated DEMO/PROTOTYPE data created for the
--   hackathon demonstration environment.
--   No real citizen PII or live government API keys are included.
-- =====================================================================================

-- Seed 4 distinct worker verification states

-- Worker 1: Vikramaditya Verma (w-101)
-- State: Government VERIFIED | Cooperative VERIFIED | ShramSetu VERIFIED
UPDATE workers
SET
    cooperative_verification_status = 'VERIFIED',
    cooperative_verified_at = '2023-04-10 10:30:00',
    cooperative_verified_by = 'DLACS Registrar Inspection Board (Reg #DL/COOP/2018/491-A)',
    shramsetu_verification_status = 'VERIFIED',
    shramsetu_verified_at = '2023-04-12 14:15:00',
    shramsetu_verified_by = 'ShramSetu Trust & Safety Automated Engine'
WHERE id = 'w-101';

INSERT INTO government_verifications (
    id,
    worker_id,
    authority,
    verification_reference,
    verification_type,
    status,
    verified_at,
    last_checked_at,
    source,
    notes,
    created_at,
    updated_at
) VALUES (
    'gv-demo-101',
    'w-101',
    'CLC',
    'DEMO-CLC-DEL-2024-***842',
    'WORKER_REGISTRATION',
    'VERIFIED',
    '2024-04-15 11:00:00',
    '2026-09-20 08:30:00',
    'DEMO_PROTOTYPE_GATEWAY_CLC',
    '[DEMO/PROTOTYPE DATA] Simulated record for Chief Labour Commissioner (Central) worker registry. Architecture ready for official API integration.',
    '2024-04-15 11:00:00',
    '2026-09-20 08:30:00'
) ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    notes = EXCLUDED.notes;

-- Worker 2: Harpreet Singh (w-102)
-- State: Government PENDING | Cooperative VERIFIED | ShramSetu VERIFIED
UPDATE workers
SET
    cooperative_verification_status = 'VERIFIED',
    cooperative_verified_at = '2023-06-18 09:45:00',
    cooperative_verified_by = 'Punjab Shramik Sahakari Sabha Executive Council',
    shramsetu_verification_status = 'VERIFIED',
    shramsetu_verified_at = '2023-06-20 16:20:00',
    shramsetu_verified_by = 'ShramSetu Trust & Safety Automated Engine'
WHERE id = 'w-102';

INSERT INTO government_verifications (
    id,
    worker_id,
    authority,
    verification_reference,
    verification_type,
    status,
    verified_at,
    last_checked_at,
    source,
    notes,
    created_at,
    updated_at
) VALUES (
    'gv-demo-102',
    'w-102',
    'STATE_LABOUR_DEPARTMENT',
    'DEMO-PB-LAB-2025-***109',
    'LABOUR_REGISTRATION',
    'PENDING',
    NULL,
    '2026-09-20 14:10:00',
    'DEMO_PROTOTYPE_GATEWAY_STATE',
    '[DEMO/PROTOTYPE DATA] Application submitted to State Labour Department portal; official verification audit pending queue clearance.',
    '2025-11-12 10:00:00',
    '2026-09-20 14:10:00'
) ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    notes = EXCLUDED.notes;

-- Worker 3: Rajeshwari Devi (w-103)
-- State: Government NOT_VERIFIED | Cooperative VERIFIED | ShramSetu VERIFIED
UPDATE workers
SET
    cooperative_verification_status = 'VERIFIED',
    cooperative_verified_at = '2023-11-25 11:15:00',
    cooperative_verified_by = 'DLACS Women Artisans & Domestic Workers Cell',
    shramsetu_verification_status = 'VERIFIED',
    shramsetu_verified_at = '2023-11-28 13:00:00',
    shramsetu_verified_by = 'ShramSetu Trust & Safety Automated Engine'
WHERE id = 'w-103';

INSERT INTO government_verifications (
    id,
    worker_id,
    authority,
    verification_reference,
    verification_type,
    status,
    verified_at,
    last_checked_at,
    source,
    notes,
    created_at,
    updated_at
) VALUES (
    'gv-demo-103',
    'w-103',
    'STATE_LABOUR_DEPARTMENT',
    'DEMO-DL-REG-2026-***377',
    'WORKER_REGISTRATION',
    'NOT_VERIFIED',
    NULL,
    '2026-09-18 09:25:00',
    'DEMO_PROTOTYPE_GATEWAY_STATE',
    '[DEMO/PROTOTYPE DATA] State labour database lookup returned unverified. Awaiting updated trade certificate submission.',
    '2026-01-10 15:30:00',
    '2026-09-18 09:25:00'
) ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    notes = EXCLUDED.notes;

-- Worker 4: Mohammed Arif (w-104)
-- State: Government VERIFIED | Cooperative VERIFIED | ShramSetu PENDING
UPDATE workers
SET
    cooperative_verification_status = 'VERIFIED',
    cooperative_verified_at = '2023-08-05 14:00:00',
    cooperative_verified_by = 'DLACS Central Carpentry & Joinery Guild',
    shramsetu_verification_status = 'PENDING',
    shramsetu_verified_at = NULL,
    shramsetu_verified_by = NULL
WHERE id = 'w-104';

INSERT INTO government_verifications (
    id,
    worker_id,
    authority,
    verification_reference,
    verification_type,
    status,
    verified_at,
    last_checked_at,
    source,
    notes,
    created_at,
    updated_at
) VALUES (
    'gv-demo-104',
    'w-104',
    'SKILL_CERTIFICATION_AUTHORITY',
    'DEMO-NCVT-SKILL-2024-***512',
    'SKILL_CERTIFICATION',
    'VERIFIED',
    '2024-06-12 16:30:00',
    '2026-09-19 12:00:00',
    'DEMO_PROTOTYPE_GATEWAY_SKILL',
    '[DEMO/PROTOTYPE DATA] Verified against NCVT / Skill India vocational registry. Platform onboarding document review pending.',
    '2024-06-12 16:30:00',
    '2026-09-19 12:00:00'
) ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    notes = EXCLUDED.notes;

