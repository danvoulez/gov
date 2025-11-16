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

