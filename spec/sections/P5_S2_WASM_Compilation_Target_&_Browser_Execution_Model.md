### [Part 5].[2] - WASM Compilation Target & Browser Execution Model
1. **Abstract**
Specifies the portable target and the subset of syscalls allowed in server and browser sandboxes.

2. **Motivation and Design Requirements**
**R1:** Portability. **R2:** No nondeterministic syscalls. **R3:** Browser parity.

3. **Formal Specification**
Target `wasm32-unknown-unknown`; allow memory and pipe I/O; deny clocks/RNG; in browsers, no `Date.now()` or `crypto.getRandomValues()`; message‑passing only.

4. **Security Analysis**
Eliminating clocks/RNG blocks divergence; browser sandbox reduces cross‑site leakage.

5. **Relationship to Other Components**
Underpins §5.1 execution; referenced by allowlists (§3.4).

6. **Implementation Notes & Best Practices**
Avoid dynamic linking; cap memory/time/gas deterministically; version engine images; pre‑warm caches for cold‑start parity.

7. **Conformance & Test Vectors**
Vector: module attempting a forbidden syscall fails with deterministic error.

[[END 5.2]]

