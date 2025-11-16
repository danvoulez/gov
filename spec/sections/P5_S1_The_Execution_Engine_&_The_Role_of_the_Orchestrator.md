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

