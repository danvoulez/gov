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

