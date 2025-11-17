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

