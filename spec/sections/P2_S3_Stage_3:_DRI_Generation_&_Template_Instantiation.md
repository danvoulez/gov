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

