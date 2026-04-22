# DACS — Decentralized Academic Credential System

A blockchain-based platform for issuing, owning, and verifying tamper-proof academic credentials. Institutions issue cryptographically signed credentials, students hold them in digital wallets, and employers/verifiers instantly confirm authenticity against an immutable on-chain record.

> **Status:** Frontend reference implementation (mock API). Backend to be implemented per [`backendPlan.md`](./backendPlan.md).

---

## ✨ Features

- **Multi-role workspaces** — Institution, Student, Employer/Verifier, Government regulator
- **Credential issuance** — Hash-anchored, optionally minted as NFT, IPFS-pinned metadata
- **Public verification** — Anyone can verify a credential hash without an account
- **Wallet integration** — Each user has an associated wallet address (mock today, EVM-ready)
- **Government oversight** — System-wide analytics, alerts, institution accreditation
- **Notifications** — Real-time activity feed per user
- **Dark-first UI** — Professional "Blockchain Trust" theme with semantic design tokens

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Routing | React Router v6 |
| State | React Context + `useReducer` |
| Charts | Recharts |
| Icons | lucide-react |
| Tests | Vitest |

---

## 📂 Project Structure

```
src/
├── api/              # Mock API (single source of truth for fake data)
│   └── mockApi.ts
├── assets/           # Images, illustrations
├── components/
│   ├── blockchain/   # NetworkBadge, TxHashLink, BlockchainProof
│   ├── credentials/  # CredentialCard, CredentialTable, HashDisplay…
│   ├── charts/       # LineChart, BarChart wrappers
│   ├── layout/       # AppLayout (dashboard), PublicLayout (marketing)
│   ├── stats/        # StatsCard, StatsGrid
│   ├── ui/           # shadcn primitives + custom shared widgets
│   └── verification/ # VerifyInput, VerifySteps, VerificationResult
├── context/          # AuthContext, NotificationContext
├── hooks/
├── pages/
│   ├── auth/         # Login, Signup, ForgotPassword, ResetPassword
│   ├── public/       # Home, HowItWorks, Verify, About
│   ├── institution/  # Dashboard, IssueCredential, ManageCredentials, Transactions
│   ├── student/      # Dashboard, Wallet, ShareCredential, Activity
│   ├── verifier/     # Dashboard, VerifyCredential, History
│   ├── government/   # Dashboard, Institutions, Analytics, Alerts
│   └── shared/       # CredentialDetail, Settings
├── services/         # Thin wrappers around mockApi (swap for real API later)
├── types/            # Centralized TypeScript types
└── lib/
```

### Architectural rules

1. **Pages never call `mockApi` directly** — always go through `src/services/*`.
2. **All TypeScript types live in `src/types/index.ts`**.
3. **All mock data lives in `src/api/mockApi.ts`** — one source of truth.
4. **No raw color values in components** — use semantic Tailwind tokens defined in `index.css`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or Bun 1.x)

### Install & run

```bash
# install
npm install        # or: bun install

# dev server
npm run dev        # http://localhost:8080

# production build
npm run build

# preview production build
npm run preview

# tests
npm run test
```

### Demo accounts

The mock auth accepts any email/password combination — pick a role on the login screen to enter the corresponding workspace.

| Role        | Default route             |
|-------------|---------------------------|
| Institution | `/institution/dashboard`  |
| Student     | `/student/dashboard`      |
| Employer    | `/verifier/dashboard`     |
| Government  | `/government/dashboard`   |

---

## 🎨 Design System

- **Theme:** Dark by default (`html.dark` applied at boot)
- **Primary palette:** navy background `#1a1f2e`, teal accent `#00d4aa`
- **Typography:** Sans for UI, **monospace for hashes/addresses/tx ids**
- All tokens defined in `src/index.css` and `tailwind.config.ts`

---

## 🔌 Backend Integration

The frontend is intentionally decoupled from any specific backend through the `src/services/*` layer. To wire a real backend, replace the body of each service function — page components do not need to change.

See **[`backendPlan.md`](./backendPlan.md)** for the full backend architecture, data model, API contract, blockchain layer, and rollout plan.

---

## 🧪 Testing

```bash
npm run test          # run vitest once
npm run test:watch    # watch mode
```

Tests live alongside source under `src/test/`.

---

## 📜 License

MIT — see `LICENSE`.

---

## 🙏 Acknowledgements

Built with [shadcn/ui](https://ui.shadcn.com/), [Lucide](https://lucide.dev/), [Recharts](https://recharts.org/), and [Vite](https://vitejs.dev/).
