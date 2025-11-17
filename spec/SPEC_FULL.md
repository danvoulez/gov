# The LogLine Protocol v1.0 — Technical Specification (Full Edition)

> **Epigraph**
> We know our craft.  
> We listen first, then prove.

---

**Part 1 — Foundations: We name things so no one gets lost.**

### [Part 1].[1] - Core Philosophy & Terminology
1. **Abstract**
This section states the aims of LogLine—clear words, deterministic outcomes, and visible proof—and defines the core language used everywhere else. It ensures that every reader attaches the same meaning to the same term, so later requirements can be short, precise, and testable.

2. **Motivation and Design Requirements**
**R1 (Clarity):** Terms MUST be unambiguous and referenced consistently.  
**R2 (Determinism):** The same input MUST yield the same output across conformant systems.  
**R3 (Accountability):** Each step MUST leave evidence you can check offline.  
**R4 (Human agency):** Human text MUST remain readable and reviewable; automation serves judgment, not the other way around.

3. **Formal Specification**
**Normative terms**  
- **Intent:** Human request before normalization (§2.1).  
- **Canonical Intent:** Intent after §2.1; a byte‑exact JSON✯Atomic map.  
- **Grammar / Rule:** Deterministic patterns with `priority`, `specificity`, `ruleId`, and versioned `grammarId`.  
- **DRI (Deterministic Runnable Intent):** Execution‑ready plan (§3.1).  
- **Ledger Entry:** Canonical, signed record (§3.2).  
- **Allowlist:** Execution capabilities (§3.4).  
- **Orchestrator:** Deterministic executor (§5.1).

4. **Security Analysis**
Fixed vocabulary blocks equivocation: a word maps to one operation. It also narrows the attack surface for prompt‑level tampering or social engineering by making unapproved terms invalid inputs.

5. **Relationship to Other Components**
All later sections import these definitions; this section emits no machine data.

6. **Implementation Notes & Best Practices**
Write short sentences. Define before use. Prefer active voice.  
    **Listening Pledge:**  
    - We start by hearing you out.  
- We repeat back what we heard.  
- We show the plan before we run.  
- We invite your edit, every step.

7. **Conformance & Test Vectors**
**MUST:** Use these names exactly. **Test:** A glossary checker maps terms → sections with no collisions; unknown terms cause a hard error.

[[END 1.1]]


### [Part 1].[2] - System Architecture & The Binaries
1. **Abstract**
Describes roles (Producer, Verifier, Orchestrator, Ledger Node, TSA Bridge), boundaries between them, and the minimal set of binaries that implement the protocol end‑to‑end.

2. **Motivation and Design Requirements**
**R1:** Clear role separation. **R2:** Reproducible builds. **R3:** Offline verification. **R4:** Minimal trusted computing base.

3. **Formal Specification**
**Roles**  
- **Producer:** Performs §§2.1–2.4.  
- **Verifier:** Recomputes §§2.1–2.4; checks §2.5 proofs.  
- **Ledger Node:** Runs §2.5, maintains chain state.  
- **Orchestrator:** Executes §5.1 with allowlists (§3.4).  
- **TSA Bridge:** Adds external timestamp evidence (§4.4).

**Binaries & Interfaces**  
- `logline-compile`, `logline-seal`, `logline-commit`, `logline-verify`, `logline-httpd` (§5.4).  
- Transport: JSON over HTTP; streaming via SSE for events.  
- Reproducibility: builds MUST be byte‑identical under pinned toolchains; publish SBOM and signed checksums.

4. **Security Analysis**
Small, purpose‑built binaries reduce attack surface; offline verification breaks dependence on network trust; SBOM aids incident response.

5. **Relationship to Other Components**
This architecture frames all pipeline stages (Part 2) and execution (Part 5).

6. **Implementation Notes & Best Practices**
Prefer static linking; pin compiler + dependency versions; verify with `--frozen-lockfile`; run `logline-verify` entirely offline.

7. **Conformance & Test Vectors**
**MUST:** Publish SHA‑256 (or BLAKE3) of all artifacts. **Test:** CI rebuild matches published hash.

[[END 1.2]]


### [Part 1].[3] - The Security Model & Threat Analysis
1. **Abstract**
Defines adversaries, trust boundaries, and how each protocol feature mitigates a concrete threat. This section is the map that security reviews should follow.

2. **Motivation and Design Requirements**
**R1:** Tamper‑evidence. **R2:** Forgery resistance. **R3:** Replay/rollback protection. **R4:** Downgrade prevention. **R5:** Side‑channel minimization.

3. **Formal Specification**
**Adversaries**: passive eavesdropper, active tamperer, coercive censor, key thief, equivocation attacker.  
**Boundaries**: producer private keys; canonical byte streams; network transport; ledger state.  
**Controls**: domain‑separated hashing (§4.1); Ed25519 signatures (§4.2) over exact bytes (§2.4); total‑order tie‑break (§2.2); Merkle + blockstamp (§2.5); allowlists (§3.4).

4. **Security Analysis**
Covers tampering, forgery, replay, rollback, equivocation, downgrade, key compromise, TOCTOU, and side‑channels. Each subsection later references this model explicitly.

5. **Relationship to Other Components**
Feeds the Security Analysis in every later section.

6. **Implementation Notes & Best Practices**
Maintain a living threat register; every mitigation maps to a requirement R#; unknown input fields fail closed; logs are privacy‑aware.

7. **Conformance & Test Vectors**
**MUST:** Provide the matrix (threat → mitigation → section). **Test:** Verifier cross‑checks presence of each required control.

[[END 1.3]]



---

**Part 2 — Pipeline: From your words to real action—no detours.**

### [Part 2].[1] - Stage 1: Canonical Normalization
1. **Abstract**
Takes free‑form input and produces a byte‑stable, locale‑free JSON✯Atomic map. Everything else depends on these exact bytes.

2. **Motivation and Design Requirements**
**R1:** Same input → same bytes. **R2:** Locale‑free. **R3:** No hidden state. **R4:** Reject unsafe encodings.

3. **Formal Specification**
**JSON✯Atomic Canonicalization (normative):**
- UTF‑8; keys sorted lexicographically by bytes; arrays keep order.
- Numbers: finite only; integral as `"-?[0-9]+"`; non‑integral as JSON decimal without trailing zeros; forbid NaN/Inf.
- Booleans/literals: `true|false|null` lowercase.
- Newline `\n`; no trailing spaces; no tabs; NFC input normalization.
- Canonical byte form: UTF‑8 encoding of the minimal JSON text satisfying the above.

    **Text to structure**: Tokenize only after NFC normalization; avoid locale‑dependent rules. Emit minimal shapes—no computed fields.  
    **Deterministic whitespace**: spaces only; single `\n`; never tabs.

4. **Security Analysis**
Canonicalization kills confusion attacks (homoglyphs, alternate encodings) and prevents downstream ambiguity in signing.

5. **Relationship to Other Components**
Outputs the canonical intent for §2.2 grammar matching.

6. **Implementation Notes & Best Practices**
Reject control characters; fold case only if the rule says so; keep a reversible log of redactions.

7. **Conformance & Test Vectors**
Vectors: Unicode accents; mixed whitespace; numeric forms; each yields the exact canonical byte string.

[[END 2.1]]


### [Part 2].[2] - Stage 2: Grammar Matching & The Total Order Tie-Breaking Algorithm
1. **Abstract**
Given canonical input, multiple rules may match; this section defines the one true way to choose exactly one rule everywhere.

2. **Motivation and Design Requirements**
**R1:** Total order. **R2:** Stability across implementations. **R3:** Resistance to spoofing and silent downgrades.

3. **Formal Specification**
**Total order tuple (normative):**
`(priority, specificity, grammarSemVer, grammarIdHash, ruleId, H)`  
where `H = BLAKE3("LL/Tie/v1" || canonicalInput || grammarId || ruleId || grammarSemVer)`.
Compare byte‑wise, lexicographically; use a **stable sort**. Zero‑pad numeric fields to a fixed width before compare.

    **Pseudo‑code**
    ```text
    candidates := enumerate_rules(canonicalInput)
    rows := []
    for c in candidates:
      H := BLAKE3("LL/Tie/v1" || canonicalInput || c.grammarId || c.ruleId || c.grammarSemVer)
      tuple := (pad10(c.priority), pad10(c.specificity), c.grammarSemVer, c.grammarIdHash, c.ruleId, H)
      rows.push((tuple, c))
    sort_stable(rows, by=tuple_lexicographic_bytes)
    selected := rows[0].c
    ```

    **Micro Example E1 (flows across §§2–5):**

4. **Security Analysis**
Domain separation stops cross‑context collisions; stable sort removes iteration‑order randomness; explicit versions block downgrade.

5. **Relationship to Other Components**
Consumes §2.1 output; emits selected rule for §2.3.

6. **Implementation Notes & Best Practices**
Zero‑pad numbers; compare as raw bytes; normalize SemVer (e.g., `1.10` > `1.2`).

7. **Conformance & Test Vectors**
Vectors: rules tying on p/s; different `ruleId` and `grammarSemVer`; publish expected winner for each case.

[[END 2.2]]


### [Part 2].[3] - Stage 3: DRI Generation & Template Instantiation
1. **Abstract**
Transforms (canonical input, selected rule) into a Deterministic Runnable Intent (DRI) with explicit bindings and no hidden defaults.

2. **Motivation and Design Requirements**
**R1:** Pure function. **R2:** Explainable. **R3:** No clocks/RNG. **R4:** Schema‑checked output.

3. **Formal Specification**
**DRI (excerpt; full §3.1)**  
```json
{ "type":"DRI/2.1", "id":"...", "action":"...", "params":{ }, "preconditions":[ ], "effects":[ ] }
```
Bindings are explicit; defaults live in the grammar and are copied verbatim at instantiation time. No environment reads.

4. **Security Analysis**
Purity prevents TOCTOU; explicit defaults prevent ambiguity; schema validation blocks injection.

5. **Relationship to Other Components**
Feeds §2.4 for sealing; later §5.1 executes DRIs under allowlists.

6. **Implementation Notes & Best Practices**
Record `(grammarId, ruleId, bindings)` in a trace for §5.3 explainability; keep IDs deterministic.

7. **Conformance & Test Vectors**
Vectors: two inputs map to two DRIs; byte‑identical across implementations, including field order.

[[END 2.3]]


### [Part 2].[4] - Stage 4: Cryptographic Sealing (Hashing & Signatures)
1. **Abstract**
Adds tamper‑evidence and provenance: a domain‑separated BLAKE3 digest and an Ed25519 signature over exact bytes.

2. **Motivation and Design Requirements**
**R1:** Context‑separated hashing. **R2:** Canonical bytes only. **R3:** Non‑exportable keys by reference.

3. **Formal Specification**
**Exact signable message bytes (normative):**
`BLAKE3("LL/Seal/v1" || algo="Ed25519" || proto="LogLine/1.0" || ct="application/json; profile=json-atomic" || canonicalBytes(payload))`

Sign and verify Ed25519 over the precise byte stream above (or Ed25519ph uniformly if chosen, with BLAKE3‑256 prehash).

**Ledger fields (see §3.2):** `hash_b3`, `signature_ed25519`, `signature_context`, `public_key`.

4. **Security Analysis**
Stops cross‑protocol replay; ties every signature to its content and context; avoids malleability by signing one canonical stream.

5. **Relationship to Other Components**
Consumes §2.3 DRI; produces a signed entry for §2.5.

6. **Implementation Notes & Best Practices**
Use constant‑time libs; wipe secrets; verify immediately after signing; store `public_key` with entry.

7. **Conformance & Test Vectors**
Vector: fixed DRI → fixed `hash_b3`; signature verifies; wrong context label must fail.

[[END 2.4]]


### [Part 2].[5] - Stage 5: Ledger Committal & The Blockstamp Chain
1. **Abstract**
Collects signed entries, builds a Merkle tree, and commits a block with chain ID, height, previous root, and timestamp; optionally anchors to an external TSA.

2. **Motivation and Design Requirements**
**R1:** Batch integrity. **R2:** Public ordering. **R3:** Clear reorg/finality rules.

3. **Formal Specification**
**Merkle (normative):** Leaves are `BLAKE3(canonicalEntryBytes)`. Internal nodes are `BLAKE3(left || right)`. If odd count, promote the last node unchanged. Root is `merkleRoot`.  
**Blockstamp header (normative):** `{ "chainId": "...", "height": N, "prevRoot": "hex", "merkleRoot": "hex", "timestampUTC": "RFC3339Z", "tsaEvidence": { ... }? }`.  
**Finality:** Nodes MUST publish `finalityHorizon` (e.g., `K=12`). Reorgs SHALL follow policy and emit proofs linking old and new branches.

4. **Security Analysis**
Merkle proofs expose tampering; explicit reorg policy prevents silent rollback; TSA reduces single‑clock risk.

5. **Relationship to Other Components**
Produces `blockstamp` and proofs for verifiers and auditors; interacts with §4.4 for TSA.

6. **Implementation Notes & Best Practices**
Monotonic UTC timestamps; left‑to‑right concatenation; promote odd leaves; publish `finalityHorizon`.

7. **Conformance & Test Vectors**
Vector: 3‑leaf Merkle example with published root; reorg scenario with policy result.

[[END 2.5]]



---

**Part 3 — Structures: What matters fits on the page.**

### [Part 3].[1] - The Deterministic Runnable Intent (DRI) v2.1 Specification
1. **Abstract**
Defines the canonical JSON shape and semantics of a DRI, the unit of execution.

2. **Motivation and Design Requirements**
**R1:** Strict schema. **R2:** Extensible but predictable. **R3:** Human‑readable fields.

3. **Formal Specification**
**JSON Schema (normative excerpt)**  
```json
{
  "$id": "https://spec.logline/v2.1/dri.json",
  "type": "object",
  "required": ["type","id","action","params"],
  "properties": {
    "type": { "const": "DRI/2.1" },
    "id": { "type": "string", "pattern": "^[a-z0-9._-]+$" },
    "action": { "type": "string" },
    "params": { "type": "object", "additionalProperties": false },
    "preconditions": { "type": "array", "items": { "type": "string" } },
    "effects": { "type": "array", "items": { "type": "string" } }
  },
  "additionalProperties": false
}
```

4. **Security Analysis**
Strict schemas prevent field smuggling and covert channels; canonicalization ensures byte‑identical hashing.

5. **Relationship to Other Components**
Produced in §2.3; sealed in §2.4; executed by §5.1–§5.2; reported in §5.3 certificates.

6. **Implementation Notes & Best Practices**
Keep IDs portable; keep `params` flat; document defaults in grammar files; avoid dynamic keys.

7. **Conformance & Test Vectors**
Vectors: DRI differing by one param yields different hash; invalid `additionalProperties` rejected.

[[END 3.1]]


### [Part 3].[2] - The Json✯Atomic Ledger Entry v1.2 Specification
1. **Abstract**
A signed, canonical record that binds payload and metadata for verification and committing.

2. **Motivation and Design Requirements**
**R1:** Canonical field order. **R2:** Context label required. **R3:** Legacy migration optional but explicit.

3. **Formal Specification**
**Schema (normative excerpt)**  
```json
{
  "$id":"https://spec.logline/v1.2/ledger-entry.json",
  "type":"object",
  "required":["type","id","payload","hash_b3","signature_ed25519","signature_context","public_key"],
  "properties":{
    "type":{"const":"LedgerEntry/1.2"},
    "id":{"type":"string"},
    "payload":{"type":"object"},
    "hash_b3":{"type":"string","pattern":"^[0-9a-f]{64}$"},
    "signature_ed25519":{"type":"string"},
    "signature_context":{"const":"LL/Seal/v1"},
    "public_key":{"type":"string"}
  },
  "additionalProperties":false
}
```

4. **Security Analysis**
Context pinning prevents misuse of signatures; explicit `public_key` enables offline checks.

5. **Relationship to Other Components**
Produced in §2.4; committed in §2.5; verified via §5.4 `/v1/verify`.

6. **Implementation Notes & Best Practices**
Optionally emit a legacy hash for migration but always compute DS hash as normative; log which path validated.

7. **Conformance & Test Vectors**
Vectors: known payload → fixed `hash_b3`; signature fails if context mismatches.

[[END 3.2]]


### [Part 3].[3] - The Grammar DSL (YAML) v1.1 Specification
1. **Abstract**
Defines a deterministic YAML subset for grammars, forbidding features that introduce ambiguity or hidden references.

2. **Motivation and Design Requirements**
**R1:** Determinism. **R2:** Human‑editable. **R3:** Stable serialization.

3. **Formal Specification**
**Allowed:** scalars, sequences, mappings with explicit types. **Single document** only.  
**Forbidden:** anchors (`&`), aliases (`*`), merge keys (`<<`), arbitrary tags.  
**Shape:**  
```yaml
grammarId: default
version: "1.1"
rules:
  - ruleId: R-12
    priority: 1
    specificity: 12
    pattern: 'publish policy <policy_id> allow ledger commit'
    template:
      action: publish_policy
      params:
        policy_id: $policy_id
        effect: allow
        capability: ledger.commit
```

4. **Security Analysis**
No anchors/aliases removes accidental reference sharing; single‑doc avoids multi‑root ambiguity.

5. **Relationship to Other Components**
Consumed by §2.2–§2.3; published via §5.4 `/v1/grammars`.

6. **Implementation Notes & Best Practices**
Pin YAML emitter settings; lint for forbidden features; keep examples close to production rules.

7. **Conformance & Test Vectors**
Vectors: two candidate rules producing a deterministic winner under the total order.

[[END 3.3]]


### [Part 3].[4] - The Allowlist Specification
1. **Abstract**
Describes what a DRI may do at execution time; capabilities and ceilings are explicit and portable.

2. **Motivation and Design Requirements**
**R1:** Least privilege. **R2:** Deterministic ceilings. **R3:** Clear identifiers.

3. **Formal Specification**
**Allowlist JSON**
```json
{
  "allowlistId":"baseline",
  "version":"1.0",
  "capabilities":[
    "fs.read:/spans",
    "wasm.mem.max:64MiB",
    "time.now:deny",
    "net.dial:deny"
  ]
}
```

4. **Security Analysis**
Least privilege constrains blast radius; ceilings mitigate DoS through resource exhaustion.

5. **Relationship to Other Components**
Used by §5.1 orchestrator; published/queried via §5.4.

6. **Implementation Notes & Best Practices**
Prefer deny‑by‑default; diff allowlists as text; review changes with two humans.

7. **Conformance & Test Vectors**
Vector: action denied by allowlist MUST fail with deterministic error.

[[END 3.4]]



---

**Part 4 — Trust: Promises that don’t crack.**

### [Part 4].[1] - Hashing Protocol (BLAKE3)
1. **Abstract**
Standardizes BLAKE3‑256 with strict domain separation contexts and lowercase hex encoding.

2. **Motivation and Design Requirements**
**R1:** One algorithm. **R2:** Domain separation per use. **R3:** Streaming equivalence.

3. **Formal Specification**
Contexts (registry): `LL/Seal/v1`, `LL/Grammar/v1`, `LL/Tie/v1`, `LL/Merkle/v1`. Output: 32‑byte digest, lowercase hex. Streaming MUST equal one‑shot for same bytes.

4. **Security Analysis**
Context labels prevent cross‑use collisions; fixed size avoids truncation ambiguity.

5. **Relationship to Other Components**
Used by §§2.2, 2.4, 2.5; referenced by schemas in §3.2.

6. **Implementation Notes & Best Practices**
Check library vectors; never reuse a context string for a different purpose; treat hex case as lowercase only.

7. **Conformance & Test Vectors**
Vector: hash the same payload under two contexts—digests MUST differ.

[[END 4.1]]


### [Part 4].[2] - Signature Protocol (Ed25519)
1. **Abstract**
Fixes how to sign and verify the exact canonical bytes, with optional Ed25519ph if used consistently.

2. **Motivation and Design Requirements**
**R1:** Deterministic message, one format. **R2:** Offline verification. **R3:** Safe key handling.

3. **Formal Specification**
Sign/verify the stream from §2.4 exactly; store `public_key` with the entry; verification MUST succeed offline without network I/O.

4. **Security Analysis**
Deterministic signing eliminates malleability; offline checks prevent network tampering; wrong context labels cause hard failure.

5. **Relationship to Other Components**
Seals §2.3; feeds §2.5; checked in §5.4 `/v1/verify`.

6. **Implementation Notes & Best Practices**
Zeroize secrets; constant‑time verify; reject non‑canonical inputs before signature checks.

7. **Conformance & Test Vectors**
Vector: a signature computed over legacy (wrong) bytes MUST fail under DS rules.

[[END 4.2]]


### [Part 4].[3] - Key Management & The privateKeyRef Abstraction
1. **Abstract**
References keys without exposing them, supports rotation and revocation, and allows M‑of‑N multi‑sign policies.

2. **Motivation and Design Requirements**
**R1:** Non‑exportable keys. **R2:** Rotation & revocation. **R3:** Multi‑sign.

3. **Formal Specification**
`privateKeyRef` may be `kms:...`, `hsm:...`, or `did:key:...`. Policies include `maxSignatureAge`, rotation windows, and a revocation list tied to `public_key`.

4. **Security Analysis**
Non‑exportability reduces theft; rotation limits exposure time; revocation provides recovery.

5. **Relationship to Other Components**
Used in §2.4 sealing and §5.4 signing endpoints.

6. **Implementation Notes & Best Practices**
Prefer hardware‑backed refs; log reason/scope for each signature; support threshold signatures when needed.

7. **Conformance & Test Vectors**
Vector: rotate keys; older signatures remain valid; new entries show changed `public_key`.

[[END 4.3]]


### [Part 4].[4] - Timestamping Protocols (Blockstamp vs. TSA)
1. **Abstract**
Explains how built‑in block timestamps and external TSA anchors complement each other without mutating canonical data.

2. **Motivation and Design Requirements**
**R1:** Dual evidence. **R2:** Clear precedence. **R3:** Immutable payloads.

3. **Formal Specification**
Blockstamp time orders blocks; TSA evidence is attached alongside but never alters payloads; verifiers MAY check both.

4. **Security Analysis**
Dual anchors resist falsified time and service capture; immutable payloads prevent time‑based mutation.

5. **Relationship to Other Components**
Complements §2.5; verifiers record presence/absence of TSA without failing determinism.

6. **Implementation Notes & Best Practices**
Cache TSA results; pin TSA roots; store raw responses verbatim.

7. **Conformance & Test Vectors**
Vector: a block with TSA and one without both verify identically for payload integrity.

[[END 4.4]]



---

**Part 5 — Execution: Do it. Explain it. Show it.**

### [Part 5].[1] - The Execution Engine & The Role of the Orchestrator
1. **Abstract**
Runs DRIs in a deterministic sandbox, producing explainable artifacts and pre/post state digests.

2. **Motivation and Design Requirements**
**R1:** Deterministic runtime. **R2:** Capability enforcement. **R3:** Resource ceilings.

3. **Formal Specification**
Disable `clock_time_get`/`random_get`; deny network and filesystem by default; allow only declared capabilities; emit frontier certificates (§5.3).

4. **Security Analysis**
No clocks/RNG removes nondeterminism; least privilege limits impact of malicious code.

5. **Relationship to Other Components**
Consumes §3.1 DRIs and §3.4 allowlists; emits §5.3 certificates.

6. **Implementation Notes & Best Practices**
Pin WASI version; snapshot I/O; stream spans as NDJSON; keep runs reproducible by build hash.

7. **Conformance & Test Vectors**
Vector: identical DRI + allowlist on two nodes yield identical post‑state digests.

[[END 5.1]]


### [Part 5].[2] - WASM Compilation Target & Browser Execution Model
1. **Abstract**
Specifies the portable target and the subset of syscalls allowed in server and browser sandboxes.

2. **Motivation and Design Requirements**
**R1:** Portability. **R2:** No nondeterministic syscalls. **R3:** Browser parity.

3. **Formal Specification**
Target `wasm32-unknown-unknown`; allow memory and pipe I/O; deny clocks/RNG; in browsers, no `Date.now()` or `crypto.getRandomValues()`; message‑passing only.

4. **Security Analysis**
Eliminating clocks/RNG blocks divergence; browser sandbox reduces cross‑site leakage.

5. **Relationship to Other Components**
Underpins §5.1 execution; referenced by allowlists (§3.4).

6. **Implementation Notes & Best Practices**
Avoid dynamic linking; cap memory/time/gas deterministically; version engine images; pre‑warm caches for cold‑start parity.

7. **Conformance & Test Vectors**
Vector: module attempting a forbidden syscall fails with deterministic error.

[[END 5.2]]


### [Part 5].[3] - Frontier Certificates & Explainability
1. **Abstract**
Provides a signed narrative of how input became action—hash‑linked, minimal, and readable.

2. **Motivation and Design Requirements**
**R1:** Traceability. **R2:** Human‑readable. **R3:** No secrets.

3. **Formal Specification**
**Shape (excerpt)**
```json
{
  "type":"FrontierCertificate/1.0",
  "inputHash":"...",
  "selectedRule":{"grammarId":"...","version":"...","ruleId":"..."},
  "driHash":"...",
  "preStateHash":"...",
  "postStateHash":"...",
  "explain":[ "matched rule R-12", "instantiated params: {...}" ],
  "signature":"..."
}
```

4. **Security Analysis**
Hashes give tamper‑evidence; redact secrets; keep explanations succinct to avoid leakage.

5. **Relationship to Other Components**
Produced by §5.1; served via §5.4; audited alongside ledger entries.

6. **Implementation Notes & Best Practices**
Prefer NDJSON; one line per certificate; include human summaries; sign certificates over canonical bytes.

7. **Conformance & Test Vectors**
Vector: recompute `driHash` from the DRI and match the certificate’s field.

[[END 5.3]]


### [Part 5].[4] - The logline-httpd API Specification (Endpoints & Payloads)
1. **Abstract**
Defines versioned endpoints, request/response shapes, idempotency rules, errors, and SSE event streams.

2. **Motivation and Design Requirements**
**R1:** Stable contracts. **R2:** Idempotency. **R3:** Structured errors. **R4:** Streaming events.

3. **Formal Specification**
**Endpoints**  
- `POST /v1/compile` → `{ canonical, selectedRule, dri }`  
- `POST /v1/seal` → `{ hash_b3, signature_ed25519, signature_context, public_key }`  
- `POST /v1/commit` → `{ height, merkleRoot, blockstamp{...} }`  
- `POST /v1/verify` → `{ results:[{index,ok,hashOk,sigOk,ds}] }`  
- `GET/POST /v1/grammars`  
- `GET/POST /v1/allowlists`  
- `GET /v1/events` (SSE)

**Headers**: `Idempotency-Key` for POST; `ETag`/`If-Match` for updates.  
**Errors**: `{ "code":"string", "reason":"string", "doc":"url", "details":{...} }`.

4. **Security Analysis**
Idempotency protects against replay; ETag avoids lost updates; structured errors reduce accidental data leakage.

5. **Relationship to Other Components**
Binds Parts 2–3 to external systems; exposes verification for auditors.

6. **Implementation Notes & Best Practices**
Return deterministic error codes; document rate limits; never echo secrets; include correlation IDs.

7. **Conformance & Test Vectors**
Vectors: golden 200/400/409 responses with exact shapes; SSE sequence for commit confirmation.

[[END 5.4]]

