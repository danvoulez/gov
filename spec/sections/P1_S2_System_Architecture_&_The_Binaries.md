### [Part 1].[2] - System Architecture & The Binaries
1. **Abstract**
Describes roles (Producer, Verifier, Orchestrator, Ledger Node, TSA Bridge), boundaries between them, and the minimal set of binaries that implement the protocol end‑to‑end.

2. **Motivation and Design Requirements**
**R1:** Clear role separation. **R2:** Reproducible builds. **R3:** Offline verification. **R4:** Minimal trusted computing base.

3. **Formal Specification**
**Roles**  
- **Producer:** Performs §§2.1–2.4.  
- **Verifier:** Recomputes §§2.1–2.4; checks §2.5 proofs.  
- **Ledger Node:** Runs §2.5, maintains chain state.  
- **Orchestrator:** Executes §5.1 with allowlists (§3.4).  
- **TSA Bridge:** Adds external timestamp evidence (§4.4).

**Binaries & Interfaces**  
- `logline-compile`, `logline-seal`, `logline-commit`, `logline-verify`, `logline-httpd` (§5.4).  
- Transport: JSON over HTTP; streaming via SSE for events.  
- Reproducibility: builds MUST be byte‑identical under pinned toolchains; publish SBOM and signed checksums.

4. **Security Analysis**
Small, purpose‑built binaries reduce attack surface; offline verification breaks dependence on network trust; SBOM aids incident response.

5. **Relationship to Other Components**
This architecture frames all pipeline stages (Part 2) and execution (Part 5).

6. **Implementation Notes & Best Practices**
Prefer static linking; pin compiler + dependency versions; verify with `--frozen-lockfile`; run `logline-verify` entirely offline.

7. **Conformance & Test Vectors**
**MUST:** Publish SHA‑256 (or BLAKE3) of all artifacts. **Test:** CI rebuild matches published hash.

[[END 1.2]]

