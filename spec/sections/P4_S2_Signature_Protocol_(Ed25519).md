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

