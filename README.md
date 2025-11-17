# LogLine Foundation — Official Website

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Verifiable Governance](https://img.shields.io/badge/Governance-Verifiable-green)](https://logline.foundation)

Official website for the **LogLine Foundation** — promoting verifiable corporate governance through cryptographic audit protocols.

## 🎯 Overview

This repository contains the Next.js-based website for LogLine Foundation, featuring:

- **Bilingual content** (Portuguese/CPLP + English)
- **Technical specifications** for the LogLine Protocol v1.0
- **Governance documentation** (policies, manifestos, transparency reports)
- **Cryptographic tooling** (BLAKE3, Ed25519, JSON✯Atomic)
- **Public ledger viewer** and audit trails

## 🏗️ Architecture

```
├── pages/              # MDX-based pages (bilingual)
│   ├── index.mdx       # Homepage (PT)
│   ├── manifesto.mdx   # Foundation manifesto
│   ├── engenharia/     # Engineering documentation
│   └── politicas/      # Governance policies
├── components/         # React components
├── public/             # Static assets & data
│   ├── ledger/         # Public audit ledger (NDJSON)
│   ├── schemas/        # JSON schemas
│   └── press/          # Press kit assets
├── spec/               # LogLine Protocol v1.0 specification
│   ├── SPEC_FULL.md    # Complete 20-section spec
│   └── sections/       # Individual sections
├── scripts/            # Cryptographic utilities
│   ├── gen_vectors.mjs # Test vector generator
│   ├── verify.mjs      # Ledger verifier
│   └── ci_proof.mjs    # CI proof generation
└── api/                # OpenAPI specifications
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for cryptographic primitives)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm start
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run verify` | Verify ledger signatures |
| `npm run demo:gen` | Generate demo ledger entries |
| `npm run ci:proof` | Generate CI proof artifacts |
| `npm run publish:span` | Publish ledger span |
| `npm run release:cut` | Cut a versioned release |
| `npm run lint:atomic` | Lint JSON✯Atomic compliance |

## 📚 LogLine Protocol Specification

This bundle includes the **full edition** of the 20-section LogLine Protocol spec:

### Core Files
- `spec/SPEC_FULL.md` — Complete specification with epigraph, taglines, and 20 sections
- `spec/sections/` — Individual section files for granular reviews
- `registries/registries.md` — Context, chain, algorithm, and error registries
- `grammars/default@1.1.yaml` — Deterministic grammar subset
- `allowlists/baseline.json` — Deny-by-default execution allowlist
- `api/logline-httpd-openapi.yaml` — HTTP API specification

### Generate Test Vectors

```bash
# Install cryptographic dependencies
npm install

# Generate deterministic test vectors
node scripts/gen_vectors.mjs

# Output: vectors/logline_test_vectors.ndjson
cat vectors/logline_test_vectors.ndjson
```

## 🔐 Cryptographic Foundations

LogLine uses:

- **JSON✯Atomic** — Canonical JSON serialization
- **BLAKE3** — Domain-separated cryptographic hashing
- **Ed25519** — Digital signatures (RFC 8032)
- **Blockstamp chains** — Tamper-evident audit logs

**⚠️ Security Note:** Test keys in this repository are for **demonstration only**. Never use them in production.

## 🌐 Governance Model

LogLine Foundation operates under **verifiable governance** principles:

1. **Computational Rituals** — Decisions encoded as deterministic operations
2. **Public Ledger** — All governance actions cryptographically signed
3. **Transparency by Default** — Minutes, votes, budgets publicly auditable
4. **Human-AI Partnership** — Policy execution verified by both humans and machines

See [/manifesto](/pages/manifesto.mdx) for full ethical framework.

## 📖 Documentation Structure

- **Institutional** — Foundation mission, values, contact
- **Governance** — Policies, committees, decision processes
- **Standards** — Technical protocols (LogLine, JSON✯Atomic, TDLN)
- **Transparency** — Public ledger, audits, financials
- **Engineering** — Technical deep-dives, architecture diagrams

## 🔧 Development

### TypeScript Configuration

The project uses TypeScript with relaxed settings for MDX compatibility. See `tsconfig.json`.

### MDX Support

Pages use `.mdx` for enhanced markdown with React components:

```jsx
import HeroManifesto from '../components/HeroManifesto'

# My Page Title

<HeroManifesto />
```

### Vercel Deployment

Optimized for Vercel with caching rules in `vercel.json`:
- Static assets: 1 year cache
- Status endpoints: No cache
- Press/data: 10 min cache

## 📄 License & Usage

The LogLine Protocol specification is released under open standards. Website content copyright LogLine Foundation 2025.

## 🤝 Contributing

We welcome contributions! Please:

1. Read `/politicas` for governance policies
2. Follow the **Listening Pledge** (spec §1.1 item 6)
3. Submit deterministic, reproducible changes
4. Include cryptographic proofs where applicable

## 📞 Contact

- Website: [logline.foundation](https://logline.foundation) (when deployed)
- Email: See `/contato` page
- Press Kit: `/press`

## 🗓️ Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

**Nota:** Este projeto utiliza português (CPLP) como idioma principal, com documentação técnica em inglês. Bilinguismo é uma política fundacional.

Generated: 2025-11-16T23:03:00Z