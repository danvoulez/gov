### [Part 5].[3] - Frontier Certificates & Explainability
1. **Abstract**
Provides a signed narrative of how input became action—hash‑linked, minimal, and readable.

2. **Motivation and Design Requirements**
**R1:** Traceability. **R2:** Human‑readable. **R3:** No secrets.

3. **Formal Specification**
**Shape (excerpt)**
```json
{
  "type":"FrontierCertificate/1.0",
  "inputHash":"...",
  "selectedRule":{"grammarId":"...","version":"...","ruleId":"..."},
  "driHash":"...",
  "preStateHash":"...",
  "postStateHash":"...",
  "explain":[ "matched rule R-12", "instantiated params: {...}" ],
  "signature":"..."
}
```

4. **Security Analysis**
Hashes give tamper‑evidence; redact secrets; keep explanations succinct to avoid leakage.

5. **Relationship to Other Components**
Produced by §5.1; served via §5.4; audited alongside ledger entries.

6. **Implementation Notes & Best Practices**
Prefer NDJSON; one line per certificate; include human summaries; sign certificates over canonical bytes.

7. **Conformance & Test Vectors**
Vector: recompute `driHash` from the DRI and match the certificate’s field.

[[END 5.3]]

