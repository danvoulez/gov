### [Part 5].[4] - The logline-httpd API Specification (Endpoints & Payloads)
1. **Abstract**
Defines versioned endpoints, request/response shapes, idempotency rules, errors, and SSE event streams.

2. **Motivation and Design Requirements**
**R1:** Stable contracts. **R2:** Idempotency. **R3:** Structured errors. **R4:** Streaming events.

3. **Formal Specification**
**Endpoints**  
- `POST /v1/compile` → `{ canonical, selectedRule, dri }`  
- `POST /v1/seal` → `{ hash_b3, signature_ed25519, signature_context, public_key }`  
- `POST /v1/commit` → `{ height, merkleRoot, blockstamp{...} }`  
- `POST /v1/verify` → `{ results:[{index,ok,hashOk,sigOk,ds}] }`  
- `GET/POST /v1/grammars`  
- `GET/POST /v1/allowlists`  
- `GET /v1/events` (SSE)

**Headers**: `Idempotency-Key` for POST; `ETag`/`If-Match` for updates.  
**Errors**: `{ "code":"string", "reason":"string", "doc":"url", "details":{...} }`.

4. **Security Analysis**
Idempotency protects against replay; ETag avoids lost updates; structured errors reduce accidental data leakage.

5. **Relationship to Other Components**
Binds Parts 2–3 to external systems; exposes verification for auditors.

6. **Implementation Notes & Best Practices**
Return deterministic error codes; document rate limits; never echo secrets; include correlation IDs.

7. **Conformance & Test Vectors**
Vectors: golden 200/400/409 responses with exact shapes; SSE sequence for commit confirmation.

[[END 5.4]]

