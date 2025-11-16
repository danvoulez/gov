### [Part 2].[1] - Stage 1: Canonical Normalization
1. **Abstract**
Takes free‑form input and produces a byte‑stable, locale‑free JSON✯Atomic map. Everything else depends on these exact bytes.

2. **Motivation and Design Requirements**
**R1:** Same input → same bytes. **R2:** Locale‑free. **R3:** No hidden state. **R4:** Reject unsafe encodings.

3. **Formal Specification**
**JSON✯Atomic Canonicalization (normative):**
- UTF‑8; keys sorted lexicographically by bytes; arrays keep order.
- Numbers: finite only; integral as `"-?[0-9]+"`; non‑integral as JSON decimal without trailing zeros; forbid NaN/Inf.
- Booleans/literals: `true|false|null` lowercase.
- Newline `\n`; no trailing spaces; no tabs; NFC input normalization.
- Canonical byte form: UTF‑8 encoding of the minimal JSON text satisfying the above.

    **Text to structure**: Tokenize only after NFC normalization; avoid locale‑dependent rules. Emit minimal shapes—no computed fields.  
    **Deterministic whitespace**: spaces only; single `\n`; never tabs.

4. **Security Analysis**
Canonicalization kills confusion attacks (homoglyphs, alternate encodings) and prevents downstream ambiguity in signing.

5. **Relationship to Other Components**
Outputs the canonical intent for §2.2 grammar matching.

6. **Implementation Notes & Best Practices**
Reject control characters; fold case only if the rule says so; keep a reversible log of redactions.

7. **Conformance & Test Vectors**
Vectors: Unicode accents; mixed whitespace; numeric forms; each yields the exact canonical byte string.

[[END 2.1]]

