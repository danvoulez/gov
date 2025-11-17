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

