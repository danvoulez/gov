### [Part 3].[4] - The Allowlist Specification
1. **Abstract**
Describes what a DRI may do at execution time; capabilities and ceilings are explicit and portable.

2. **Motivation and Design Requirements**
**R1:** Least privilege. **R2:** Deterministic ceilings. **R3:** Clear identifiers.

3. **Formal Specification**
**Allowlist JSON**
```json
{
  "allowlistId":"baseline",
  "version":"1.0",
  "capabilities":[
    "fs.read:/spans",
    "wasm.mem.max:64MiB",
    "time.now:deny",
    "net.dial:deny"
  ]
}
```

4. **Security Analysis**
Least privilege constrains blast radius; ceilings mitigate DoS through resource exhaustion.

5. **Relationship to Other Components**
Used by §5.1 orchestrator; published/queried via §5.4.

6. **Implementation Notes & Best Practices**
Prefer deny‑by‑default; diff allowlists as text; review changes with two humans.

7. **Conformance & Test Vectors**
Vector: action denied by allowlist MUST fail with deterministic error.

[[END 3.4]]

