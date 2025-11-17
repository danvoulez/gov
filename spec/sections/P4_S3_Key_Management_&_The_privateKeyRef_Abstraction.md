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

