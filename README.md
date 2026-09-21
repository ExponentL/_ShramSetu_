# ShramSetu 
A direct service marketplace connecting customers with verified electricians, plumbers, carpenters, and technicians through local worker cooperatives.

---

### Why this exists

Most home service apps (like Urban Company) act as centralized middlemen:
1. **High commission cuts:** They take 20% to 35% from every job, cutting into the worker's earnings.
2. **Unpredictable hourly billing:** Customers get billed by the hour or through hidden surge prices, leading to distrust over job duration and final costs.
3. **No real guild oversight:** "Background checks" are often just basic phone OTP verification with no tie-in to actual trade skill or official registries.

**ShramSetu cuts out the middleman cut.** Workers belong to registered local labour cooperatives, keep 100% of their base labour charges, and are accountable through their local trade master and society.

---

### How it works in practice

#### 1. Flat, Job-Based Pricing (No Hourly Rates)
Customers don't get billed for "hours worked" where workers are incentivized to take longer. Instead:
- **Base inspection / visit:** ₹249 upfront.
- **Fixed repair rates:** Every standard task has a fixed tariff (e.g. ₹150 for ceiling fan installation, ₹220 for tap replacement, ₹350 for MCB replacement).
- **Itemized digital invoice:** Extra parts and diagnosis problems are documented and confirmed by the customer with an on-site OTP before payment.

#### 2. Truthful Multi-Tier Verification
We do not mark a worker as "Government Verified" based on a marketing checkbox:
- **Government Registries (e-Shram / CLC / State Labour):** The backend checks official government registration references. If an official government API is not configured or offline, the system explicitly returns `NOT_CONFIGURED` instead of generating fake verification badges.
- **Data Privacy (DPDP Compliance):** Sensitive PII (Aadhaar numbers, bank details) is stripped before any external API response is processed or displayed. Audit logs store deterministic SHA-256 hashes instead of raw personal records.
- **Cooperative Verification:** The worker's local cooperative society verifies membership, trade tools, and peer skill history.

#### 3. Live Dispatch & Arrival Tracking
- When a customer books, the nearest available cooperative artisan is dispatched.
- Customers can track the worker's live location on an interactive Leaflet map.
- Arrival and start of work require entering a 4-digit customer OTP, preventing workers from claiming false arrivals.

---

### Key Technical Details

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Maps:** Leaflet / OpenStreetMap (live route simulation, cluster filtering, worker coordinates)
- **Architecture:** Provider-based government verification adapter (`CLCProvider`, `EShramProvider`, `StateLabourProvider`) with fallback unconfigured states
- **Testing:** 73 automated tests covering provider fail-safes, privacy data sanitization, tariff rules, and responsive layouts (`bun test`)

---

**URL:** https://shramsetuu.netlify.app/
