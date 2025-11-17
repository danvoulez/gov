# CI — Provas & Ledger

Esta pasta traz a esteira para **provar** artefatos e **verificar** o ledger automaticamente.

## 1) GitHub Action
Arquivo: `.github/workflows/proof.yml`

- Roda em `push` no `main` quando mexer em `public/ledger/**`, `pages/files/**` etc.
- Instala `blake3` e `@noble/ed25519`.
- Executa `node scripts/ci_proof.mjs`:
  - Verifica **todos** os `.ndjson` em `public/ledger/` (BLAKE3 + Ed25519).
  - Gera `public/status/*.report.json` com o veredito.
  - Gera `public/files/*.hash.json` para cada arquivo em `pages/files/`.
- Publica os JSONs como artefatos e **auto-commita** as provas (hashes/relatórios) no repositório.

### Chaves (opcional)
- Defina `ED25519_PRIV_HEX` e `ED25519_PUB_HEX` como **secrets** do repositório para
  *verificação reforçada* (a CI não assina o ledger por padrão).

## 2) CLI — Ledger Publisher
Script: `scripts/ledger_publish.mjs`

Exemplo:
```bash
node scripts/ledger_publish.mjs --type=POL --id=POL-EX-0001 --payload=./payload.json --ledger=public/ledger/sample.ndjson --pub=$ED25519_PUB_HEX --priv=$ED25519_PRIV_HEX --gate=PASSED
```

## 3) Widget — Caixa de Prova
Componente: `components/ProofBox.jsx`

Uso:
```mdx
import ProofBox from '../../components/ProofBox.jsx'

<ProofBox src="/files/constituicao-curta.hash.json" title="Prova — Constituição Curta" />
```
