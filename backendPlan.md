# DACS — Backend Implementation Plan

> Companion document to the DACS frontend. This plan describes a **modular, scalable, production-grade backend** that the existing React frontend can adopt by swapping `src/services/*` implementations — no page-level changes required.

---

## 1. Goals & Non-Goals

### Goals
- **Tamper-proof credentials** anchored on a public/permissioned blockchain.
- **Role-based multi-tenancy** for Institutions, Students, Verifiers, Government regulators.
- **Sub-second public verification** of any credential hash without authentication.
- **Horizontal scalability** — stateless API tier, queue-based blockchain workers.
- **Auditability** — every state change emits a domain event persisted to an append-only log.
- **Modularity** — bounded contexts (Identity, Credentials, Verification, Blockchain, Notifications, Analytics) deployable as a modular monolith first, microservices later.

### Non-Goals (v1)
- Replacing institutional SIS/LMS systems (we integrate, we don't replace).
- Cross-chain bridging (single chain at launch).
- Fully decentralized identity (DID is a v2 milestone).

---

## 2. High-Level Architecture

```
                ┌────────────────────────────────────────────────┐
                │                React Frontend                  │
                │  (services/* layer → REST/GraphQL + WebSocket) │
                └───────────────┬────────────────────────────────┘
                                │ HTTPS / WSS
                ┌───────────────▼────────────────┐
                │        API Gateway / BFF       │  (NestJS / FastAPI)
                │  Auth · Rate-limit · Routing   │
                └───────────────┬────────────────┘
                                │
   ┌─────────────┬──────────────┼──────────────┬──────────────┐
   ▼             ▼              ▼              ▼              ▼
┌────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐
│Identity│  │Credential│  │Verification│  │Blockchain│  │ Notify   │
│Service │  │ Service  │  │  Service   │  │ Worker   │  │ Service  │
└───┬────┘  └────┬─────┘  └─────┬──────┘  └────┬─────┘  └────┬─────┘
    │            │              │              │             │
    └────────────┴──────┬───────┴──────────────┴─────────────┘
                        ▼
        ┌───────────────────────────────────┐
        │  PostgreSQL (primary) · Redis     │
        │  IPFS · Object storage · Kafka    │
        └───────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │    EVM chain (Polygon / Base)     │
        │    Smart contracts: Registry,     │
        │    CredentialNFT, Revocation      │
        └───────────────────────────────────┘
```

---

## 3. Bounded Contexts (Modules)

Each module owns its data, exposes a clear API, and communicates with others **only via events or its public interface**.

| Module | Responsibility | Owns tables |
|---|---|---|
| **Identity** | Auth, accounts, roles, wallets, sessions, MFA | `users`, `user_roles`, `wallets`, `sessions`, `password_resets` |
| **Institutions** | Accreditation, public keys, signing capability | `institutions`, `institution_keys` |
| **Credentials** | Issue, revoke, query, hash, IPFS pin | `credentials`, `credential_metadata`, `revocations` |
| **Verification** | Public lookup, history, anti-abuse | `verification_requests`, `verification_cache` |
| **Blockchain** | Tx submission, confirmation, gas mgmt, retries | `tx_jobs`, `tx_receipts` |
| **Notifications** | In-app, email, webhooks | `notifications`, `notification_prefs` |
| **Analytics** | Aggregations, dashboards, alerts | read-models / materialized views |

> **v1 deployment:** modular monolith (single repo, single process, module boundaries enforced in code).
> **v2 deployment:** carve out Blockchain Worker, Notifications, and Analytics as independent services backed by Kafka.

---

## 4. Recommended Stack

| Concern | Choice | Why |
|---|---|---|
| Language / framework | **NestJS (TypeScript)** | Mature DI, modular, shares types with frontend. Alt: FastAPI (Python). |
| Database | **PostgreSQL 15** | Strong consistency, JSONB, partial indexes, RLS. |
| Cache / queue | **Redis 7** + **BullMQ** | Hot-path cache + job queue for blockchain workers. |
| Event bus (v2) | **Kafka** or **NATS JetStream** | Durable domain events. |
| Object storage | **S3-compatible** (R2 / MinIO) | Credential PDFs, logos. |
| Decentralized storage | **IPFS** via web3.storage / Pinata | Tamper-evident metadata. |
| Blockchain | **Polygon PoS** (mainnet) + **Mumbai** (test) | Low fees, EVM, mature tooling. |
| Smart contracts | **Solidity + Foundry/Hardhat** | Industry standard. |
| Web3 lib | **viem** or **ethers v6** | Type-safe RPC. |
| Auth | **JWT (RS256) + refresh rotation** + **WebAuthn** for high-value roles | Stateless API, secure. |
| Email | **Resend** / **SES** | Transactional. |
| Observability | **OpenTelemetry → Grafana / Datadog** | Traces, metrics, logs. |
| CI/CD | **GitHub Actions → Docker → Kubernetes** | Standard. |

---

## 5. Data Model (PostgreSQL)

> Mirrors `src/types/index.ts`. Roles live in a **separate `user_roles` table** (never on `users`) to avoid privilege-escalation risk.

```sql
-- Identity
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           CITEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,             -- argon2id
  name            TEXT NOT NULL,
  avatar_url      TEXT,
  mfa_secret      TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE app_role AS ENUM ('institution','student','employer','government','admin');

CREATE TABLE user_roles (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role      app_role NOT NULL,
  scope_id  UUID,                            -- e.g. institution_id when role=institution
  UNIQUE (user_id, role, scope_id)
);

CREATE TABLE wallets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address     TEXT NOT NULL,                 -- 0x…
  chain_id    INT  NOT NULL,
  is_primary  BOOLEAN DEFAULT false,
  UNIQUE (address, chain_id)
);

-- Institutions
CREATE TABLE institutions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  country          TEXT NOT NULL,
  accreditation_id TEXT UNIQUE NOT NULL,
  public_key       TEXT NOT NULL,
  logo_url         TEXT,
  status           TEXT DEFAULT 'active',
  joined_at        TIMESTAMPTZ DEFAULT now()
);

-- Credentials
CREATE TYPE credential_status AS ENUM ('pending','active','revoked');

CREATE TABLE credentials (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        UUID NOT NULL REFERENCES users(id),
  institution_id    UUID NOT NULL REFERENCES institutions(id),
  certificate_type  TEXT NOT NULL,
  course            TEXT NOT NULL,
  grade             TEXT,
  issue_date        DATE NOT NULL,
  expiry_date       DATE,
  credential_hash   BYTEA NOT NULL UNIQUE,   -- 32-byte keccak256
  ipfs_cid          TEXT,
  nft_token_id      NUMERIC,
  status            credential_status DEFAULT 'pending',
  issued_by         UUID NOT NULL REFERENCES users(id),
  created_at        TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON credentials (student_id);
CREATE INDEX ON credentials (institution_id);
CREATE INDEX ON credentials USING hash (credential_hash);

CREATE TABLE revocations (
  credential_id UUID PRIMARY KEY REFERENCES credentials(id),
  reason        TEXT NOT NULL,
  revoked_by    UUID NOT NULL REFERENCES users(id),
  revoked_at    TIMESTAMPTZ DEFAULT now(),
  tx_hash       BYTEA
);

-- Blockchain
CREATE TYPE tx_status AS ENUM ('queued','submitted','confirmed','failed');
CREATE TYPE tx_kind   AS ENUM ('issue','revoke');

CREATE TABLE tx_jobs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind           tx_kind NOT NULL,
  credential_id  UUID REFERENCES credentials(id),
  payload        JSONB NOT NULL,
  status         tx_status DEFAULT 'queued',
  attempts       INT DEFAULT 0,
  tx_hash        BYTEA,
  block_number   BIGINT,
  gas_used       NUMERIC,
  error          TEXT,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- Verification
CREATE TYPE verification_result AS ENUM ('valid','invalid','pending');

CREATE TABLE verification_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verifier_id     UUID REFERENCES users(id),         -- nullable for anonymous public lookups
  verifier_org    TEXT,
  credential_hash BYTEA NOT NULL,
  result          verification_result NOT NULL,
  response_ms     INT,
  ip_hash         BYTEA,                              -- privacy-preserving rate limit key
  created_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON verification_requests (credential_hash);
CREATE INDEX ON verification_requests (created_at);

-- Notifications
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  type        TEXT NOT NULL,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON notifications (user_id, created_at DESC);
```

### Row-Level Security pattern

```sql
-- Helper that bypasses RLS recursion
CREATE OR REPLACE FUNCTION has_role(_uid UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = _uid AND role = _role);
$$;

ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students see their own" ON credentials FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "institutions see what they issued" ON credentials FOR SELECT
  USING (institution_id IN (
    SELECT scope_id FROM user_roles
    WHERE user_id = auth.uid() AND role = 'institution'
  ));

CREATE POLICY "government sees all" ON credentials FOR SELECT
  USING (has_role(auth.uid(), 'government'));
```

---

## 6. Smart Contracts

Three small, audited contracts — keep logic minimal, store only hashes:

### 6.1 `InstitutionRegistry.sol`
```solidity
mapping(address => bool) public approved;     // institution wallet → approved
event InstitutionApproved(address indexed inst, bytes32 accreditationId);
event InstitutionRevoked (address indexed inst);
// onlyGovernment
```

### 6.2 `CredentialAnchor.sol`
```solidity
struct Anchor { address issuer; uint64 issuedAt; bool revoked; }
mapping(bytes32 => Anchor) public anchors;    // credentialHash → Anchor

function issue(bytes32 hash) external onlyApprovedInstitution;
function revoke(bytes32 hash, string calldata reason) external;
function verify(bytes32 hash) external view returns (Anchor memory);
event Issued (bytes32 indexed hash, address indexed issuer);
event Revoked(bytes32 indexed hash, string reason);
```

### 6.3 `CredentialNFT.sol` *(optional, ERC-721)*
- Mint a soulbound NFT (`ERC-5192`) to the **student wallet** referencing the IPFS CID.
- Non-transferable; revocable by burning.

**Gas strategy:** batch up to N issuances per tx via a `issueBatch(bytes32[])` for institutions doing graduations.

---

## 7. API Surface (REST, JSON, versioned `/api/v1`)

> The frontend's `services/*` layer will call these. Names mirror existing functions.

### Auth
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/signup` | email, password, role |
| POST | `/auth/login` | returns `{ access, refresh }` |
| POST | `/auth/refresh` | rotate refresh token |
| POST | `/auth/logout` | revoke refresh |
| POST | `/auth/forgot-password` | sends email |
| POST | `/auth/reset-password` | token + new password |
| GET  | `/auth/me` | current user + roles |

### Credentials
| Method | Path | Roles |
|---|---|---|
| POST   | `/credentials` | institution — enqueues issue |
| GET    | `/credentials` | filter by `?status&course&institutionId` |
| GET    | `/credentials/:id` | owner / institution / gov |
| GET    | `/credentials/student/:studentId` | self / gov |
| GET    | `/credentials/institution/:institutionId` | inst / gov |
| POST   | `/credentials/:id/revoke` | issuing institution |

### Verification
| Method | Path | Auth |
|---|---|---|
| POST | `/verify` | **public**, rate-limited; body `{ hash }` |
| GET  | `/verify/history` | verifier role |

### Institutions / Government
| Method | Path |
|---|---|
| GET   | `/institutions` |
| GET   | `/institutions/:id` |
| POST  | `/gov/institutions` (approve) |
| GET   | `/gov/analytics` |
| GET   | `/gov/alerts` |

### Notifications
| Method | Path |
|---|---|
| GET   | `/notifications` |
| POST  | `/notifications/:id/read` |
| WS    | `/ws/notifications` (real-time push) |

**Conventions**
- All responses `{ data, error?, meta? }`.
- Pagination: `?page=&pageSize=` with `meta.total`.
- Idempotency: `Idempotency-Key` header on all `POST /credentials`.

---

## 8. Issuance Flow (end-to-end)

```
Institution UI → POST /credentials
   │
   ▼
API validates payload + RLS
   │
   ▼
Credentials Service:
   1. canonicalize JSON → keccak256 → credential_hash
   2. INSERT credentials (status='pending')
   3. pin metadata to IPFS → cid
   4. enqueue tx_job(kind='issue', payload={hash, cid, studentWallet})
   5. emit domain event CredentialDrafted
   │
   ▼
Blockchain Worker (BullMQ):
   - signs tx with institution-scoped HSM key
   - submits to RPC, waits N confirmations
   - on success: UPDATE credentials SET status='active', tx_hash, block_number
   - emits CredentialIssued
   │
   ▼
Notifications Service → student + institution dashboards (WS push)
```

Failure handling:
- 3 retries with exponential backoff and **EIP-1559 fee bump**.
- After final failure → `status='failed'`, alert ops, notify institution.

---

## 9. Verification Flow

```
Anyone → POST /verify { hash }
   │
   ▼
1. Hit Redis cache (key = hash, TTL 60s) → return if present
2. SELECT credentials WHERE credential_hash = $1
3. Cross-check on-chain: CredentialAnchor.verify(hash)
4. Compare DB ⇆ chain; mismatch ⇒ result='invalid' + alert
5. Persist verification_requests row (with response_ms)
6. Return { result, credential?, proof: { txHash, blockNumber, network } }
```

Target: **p95 < 300 ms** for cached, **< 1.5 s** for cold path.

---

## 10. Security

- **Passwords:** Argon2id, ≥ 12 chars, breached-password check (HIBP k-anonymity).
- **Tokens:** JWT RS256, 15 min access / 30 day rotating refresh, stored httpOnly + SameSite=strict.
- **MFA:** TOTP for all roles; **WebAuthn required** for institution + government.
- **Roles:** stored in `user_roles`, **never** on `users`. Server-side checks only.
- **RLS:** enabled on every multi-tenant table.
- **Rate limiting:** Redis token bucket — `/verify` 10 req/min/IP, `/auth/*` 5/min/IP.
- **Secrets:** AWS Secrets Manager / Vault; chain signing keys in **HSM/KMS**, never in env.
- **Audit log:** append-only `audit_events` table + S3 mirror with object lock.
- **Input validation:** zod schemas at every boundary.
- **CSP, HSTS, CORS allowlist, anti-CSRF on cookie auth.**
- **Dependency scanning:** Dependabot + `npm audit` in CI; SBOM published per release.
- **Smart-contract audit:** mandatory third-party audit before mainnet.

---

## 11. Observability

- **Logs:** pino → Loki, structured JSON, request-id propagation.
- **Metrics:** Prometheus — RED metrics per route, queue depth, tx confirmation latency, gas spend.
- **Traces:** OpenTelemetry across API → worker → RPC.
- **Alerts:** PagerDuty on (a) tx_jobs failure rate > 2%, (b) verify p95 > 1s, (c) DB replication lag.
- **Health:** `/healthz` (liveness), `/readyz` (DB + Redis + RPC), `/metrics`.

---

## 12. Scalability Plan

| Tier | v1 (≤ 10k creds/day) | v2 (≤ 1M creds/day) |
|---|---|---|
| API | 2 pods, HPA on CPU | 10+ pods, autoscale on RPS |
| DB | Single Postgres + read replica | Partition `credentials` by month; PgBouncer |
| Cache | Single Redis | Redis Cluster |
| Worker | 1 BullMQ worker | N workers, sharded by `credential_id` hash |
| Chain | Single Polygon mainnet | Add L2 rollup, batch issuance |
| Storage | Pinata | Self-hosted IPFS cluster + Filecoin pin |

---

## 13. Testing Strategy

- **Unit:** services + pure logic (Jest / Vitest), ≥ 85% coverage.
- **Contract:** Foundry — fuzz `issue/revoke/verify` invariants.
- **Integration:** Testcontainers (Postgres, Redis, Anvil local chain).
- **Contract tests** between frontend `services/*` and backend (Pact).
- **E2E:** Playwright against staging, including on-chain flows on Mumbai.
- **Load:** k6 — 1k RPS verify, 100 RPS issuance.
- **Chaos:** kill RPC, kill worker, partition DB — verify graceful degradation.

---

## 14. CI/CD & Environments

```
feature branch → PR → CI (lint, typecheck, unit, contract)
       │
       ▼
   merge main → build image → deploy to staging (Mumbai chain)
       │
       ▼
   tag v* → manual approval → deploy to production (Polygon mainnet)
```

Environments: **local · ci · staging · production**. Each gets its own contract addresses, RPC URL, and KMS key.

Database migrations: **Prisma Migrate** or **Flyway**, forward-only, reviewed in PRs.

---

## 15. Repository Layout (proposed)

```
backend/
├── apps/
│   ├── api/              # NestJS HTTP/WebSocket gateway
│   └── chain-worker/     # BullMQ blockchain worker
├── libs/
│   ├── identity/
│   ├── credentials/
│   ├── verification/
│   ├── blockchain/       # viem clients, contract ABIs
│   ├── notifications/
│   └── shared/           # zod schemas, domain events, errors
├── contracts/            # Solidity + Foundry tests
├── db/
│   ├── migrations/
│   └── seeds/
├── infra/
│   ├── helm/
│   ├── terraform/
│   └── docker/
└── docs/
    ├── adr/              # Architecture Decision Records
    └── openapi.yaml
```

---

## 16. Frontend Migration (zero page changes)

Replace each function in `src/services/*` with a real `fetch` call. Example:

```ts
// src/services/credentialService.ts
import { api } from '@/lib/http';
import type { Credential } from '@/types';

export const getAllCredentials = (filters?) =>
  api.get<Credential[]>('/credentials', { params: filters });

export const issueCredential = (data: Partial<Credential>) =>
  api.post<Credential>('/credentials', data, {
    headers: { 'Idempotency-Key': crypto.randomUUID() },
  });
```

`AuthContext` keeps its shape — only `authService` changes. Notifications swap polling for the WebSocket channel.

---

## 17. Roadmap

| Milestone | Scope |
|---|---|
| **M1 — Foundation (4 wks)** | Identity, Institutions CRUD, Postgres schema, JWT auth, RLS, CI/CD skeleton |
| **M2 — Credentials (4 wks)** | Credential issue/revoke API, IPFS pin, contracts on Mumbai, worker queue |
| **M3 — Verification (3 wks)** | Public `/verify`, caching, rate-limit, verifier history |
| **M4 — Government (3 wks)** | Analytics read-models, alerts, institution approval flow |
| **M5 — Hardening (4 wks)** | Audit, load test, observability, mainnet deploy |
| **M6 — v2 (future)** | DID/VC support (W3C), microservice carve-out, multi-chain |

---

## 18. Architecture Decision Records (ADR — to author)

1. **ADR-001** Modular monolith over microservices for v1.
2. **ADR-002** Polygon PoS as launch chain.
3. **ADR-003** Hash-only on-chain; PII off-chain.
4. **ADR-004** Roles in separate table with RLS.
5. **ADR-005** BullMQ over Kafka for v1 job queue.
6. **ADR-006** NestJS over FastAPI (TypeScript parity with frontend).

---

## 19. Open Questions

- Soulbound NFT (ERC-5192) vs pure hash anchor — do students need a token in their wallet?
- KYC requirements for verifier accounts in regulated jurisdictions?
- Long-term archival: Filecoin deal vs institutional self-hosting?
- Cross-border accreditation recognition — federate registries or single source?

---

*Document version 1.0 — owner: DACS platform team.*
