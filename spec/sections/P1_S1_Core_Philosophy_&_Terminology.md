### [Part 1].[1] - Core Philosophy & Terminology
1. **Abstract**
This section states the aims of LogLine—clear words, deterministic outcomes, and visible proof—and defines the core language used everywhere else. It ensures that every reader attaches the same meaning to the same term, so later requirements can be short, precise, and testable.

2. **Motivation and Design Requirements**
**R1 (Clarity):** Terms MUST be unambiguous and referenced consistently.  
**R2 (Determinism):** The same input MUST yield the same output across conformant systems.  
**R3 (Accountability):** Each step MUST leave evidence you can check offline.  
**R4 (Human agency):** Human text MUST remain readable and reviewable; automation serves judgment, not the other way around.

3. **Formal Specification**
**Normative terms**  
- **Intent:** Human request before normalization (§2.1).  
- **Canonical Intent:** Intent after §2.1; a byte‑exact JSON✯Atomic map.  
- **Grammar / Rule:** Deterministic patterns with `priority`, `specificity`, `ruleId`, and versioned `grammarId`.  
- **DRI (Deterministic Runnable Intent):** Execution‑ready plan (§3.1).  
- **Ledger Entry:** Canonical, signed record (§3.2).  
- **Allowlist:** Execution capabilities (§3.4).  
- **Orchestrator:** Deterministic executor (§5.1).

4. **Security Analysis**
Fixed vocabulary blocks equivocation: a word maps to one operation. It also narrows the attack surface for prompt‑level tampering or social engineering by making unapproved terms invalid inputs.

5. **Relationship to Other Components**
All later sections import these definitions; this section emits no machine data.

6. **Implementation Notes & Best Practices**
Write short sentences. Define before use. Prefer active voice.  
    **Listening Pledge:**  
    - We start by hearing you out.  
- We repeat back what we heard.  
- We show the plan before we run.  
- We invite your edit, every step.

7. **Conformance & Test Vectors**
**MUST:** Use these names exactly. **Test:** A glossary checker maps terms → sections with no collisions; unknown terms cause a hard error.

[[END 1.1]]

