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

