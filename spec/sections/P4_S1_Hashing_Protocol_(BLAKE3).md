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

