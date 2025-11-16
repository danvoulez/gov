### [Part 3].[1] - The Deterministic Runnable Intent (DRI) v2.1 Specification
1. **Abstract**
Defines the canonical JSON shape and semantics of a DRI, the unit of execution.

2. **Motivation and Design Requirements**
**R1:** Strict schema. **R2:** Extensible but predictable. **R3:** Human‑readable fields.

3. **Formal Specification**
**JSON Schema (normative excerpt)**  
```json
{
  "$id": "https://spec.logline/v2.1/dri.json",
  "type": "object",
  "required": ["type","id","action","params"],
  "properties": {
    "type": { "const": "DRI/2.1" },
    "id": { "type": "string", "pattern": "^[a-z0-9._-]+$" },
    "action": { "type": "string" },
    "params": { "type": "object", "additionalProperties": false },
    "preconditions": { "type": "array", "items": { "type": "string" } },
    "effects": { "type": "array", "items": { "type": "string" } }
  },
  "additionalProperties": false
}
```

4. **Security Analysis**
Strict schemas prevent field smuggling and covert channels; canonicalization ensures byte‑identical hashing.

5. **Relationship to Other Components**
Produced in §2.3; sealed in §2.4; executed by §5.1–§5.2; reported in §5.3 certificates.

6. **Implementation Notes & Best Practices**
Keep IDs portable; keep `params` flat; document defaults in grammar files; avoid dynamic keys.

7. **Conformance & Test Vectors**
Vectors: DRI differing by one param yields different hash; invalid `additionalProperties` rejected.

[[END 3.1]]

