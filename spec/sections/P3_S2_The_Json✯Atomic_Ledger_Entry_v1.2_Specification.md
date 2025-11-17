### [Part 3].[2] - The Json✯Atomic Ledger Entry v1.2 Specification
1. **Abstract**
A signed, canonical record that binds payload and metadata for verification and committing.

2. **Motivation and Design Requirements**
**R1:** Canonical field order. **R2:** Context label required. **R3:** Legacy migration optional but explicit.

3. **Formal Specification**
**Schema (normative excerpt)**  
```json
{
  "$id":"https://spec.logline/v1.2/ledger-entry.json",
  "type":"object",
  "required":["type","id","payload","hash_b3","signature_ed25519","signature_context","public_key"],
  "properties":{
    "type":{"const":"LedgerEntry/1.2"},
    "id":{"type":"string"},
    "payload":{"type":"object"},
    "hash_b3":{"type":"string","pattern":"^[0-9a-f]{64}$"},
    "signature_ed25519":{"type":"string"},
    "signature_context":{"const":"LL/Seal/v1"},
    "public_key":{"type":"string"}
  },
  "additionalProperties":false
}
```

4. **Security Analysis**
Context pinning prevents misuse of signatures; explicit `public_key` enables offline checks.

5. **Relationship to Other Components**
Produced in §2.4; committed in §2.5; verified via §5.4 `/v1/verify`.

6. **Implementation Notes & Best Practices**
Optionally emit a legacy hash for migration but always compute DS hash as normative; log which path validated.

7. **Conformance & Test Vectors**
Vectors: known payload → fixed `hash_b3`; signature fails if context mismatches.

[[END 3.2]]

