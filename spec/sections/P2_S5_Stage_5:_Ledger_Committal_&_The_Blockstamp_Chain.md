### [Part 2].[5] - Stage 5: Ledger Committal & The Blockstamp Chain
1. **Abstract**
Collects signed entries, builds a Merkle tree, and commits a block with chain ID, height, previous root, and timestamp; optionally anchors to an external TSA.

2. **Motivation and Design Requirements**
**R1:** Batch integrity. **R2:** Public ordering. **R3:** Clear reorg/finality rules.

3. **Formal Specification**
**Merkle (normative):** Leaves are `BLAKE3(canonicalEntryBytes)`. Internal nodes are `BLAKE3(left || right)`. If odd count, promote the last node unchanged. Root is `merkleRoot`.  
**Blockstamp header (normative):** `{ "chainId": "...", "height": N, "prevRoot": "hex", "merkleRoot": "hex", "timestampUTC": "RFC3339Z", "tsaEvidence": { ... }? }`.  
**Finality:** Nodes MUST publish `finalityHorizon` (e.g., `K=12`). Reorgs SHALL follow policy and emit proofs linking old and new branches.

4. **Security Analysis**
Merkle proofs expose tampering; explicit reorg policy prevents silent rollback; TSA reduces single‑clock risk.

5. **Relationship to Other Components**
Produces `blockstamp` and proofs for verifiers and auditors; interacts with §4.4 for TSA.

6. **Implementation Notes & Best Practices**
Monotonic UTC timestamps; left‑to‑right concatenation; promote odd leaves; publish `finalityHorizon`.

7. **Conformance & Test Vectors**
Vector: 3‑leaf Merkle example with published root; reorg scenario with policy result.

[[END 2.5]]

