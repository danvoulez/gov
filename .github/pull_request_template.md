# PR — Conformidade LogLine Foundation

> Preencha os campos e marque os itens. Este PR **não deve** ser aprovado se algum item crítico estiver ❌.

## Resumo
- **Título/escopo:**  
- **Motivação (problema/objetivo):**  
- **Artefatos tocados:** Páginas | POL | RIT | DIR | Ledger | Scripts | CI

## Checklist de Conformidade (crítico)
- [ ] **Uso Pacífico:** todo artefato **POL**/distribuído define `usage_decl.peaceful_only = true`.
- [ ] **Bilinguismo PT–EN:** `lang=['pt-PT-cplp','en']` em **POL** e **RIT `publicacao_bilingue`**; links cruzados PT↔EN.
- [ ] **Machine Gate:** `POL|RIT|DIR` com `machine_gate: PASSED` + `compliance_attestation` assinada.
- [ ] **Provas por padrão:** hash **BLAKE3** + assinatura **Ed25519** gerados; verificador local OK.
- [ ] **CI — Provas:** rodou `ci:proof` localmente ou via GitHub Action; anexe evidência (print/JSON).

## Checklist de Governança
- [ ] **Rito adequado** (aprov., ratificação, publicação bilíngue etc.) e campos obrigatórios preenchidos.
- [ ] **Conflitos de interesse:** declarações anexadas (hash/assinatura) quando aplicável.
- [ ] **Orçamento:** impacto avaliado; se T0/T1, respeita **Cap de Transição** (EUR 25k ou 10%).

## Segurança, Privacidade e Acessibilidade
- [ ] **Chaves/Segredos**: nenhuma chave cometida no repo; secrets só em CI/ambiente.
- [ ] **Privacidade/minimização**: coleta mínima; dados pessoais evitados/anonimizados.
- [ ] **Acessibilidade**: headings, contraste, labels, navegação por teclado.

## Testes e Verificação
- [ ] `npm run ci:proof` — **OK** (anexar trecho do relatório `public/status/*.report.json`)
- [ ] Validação manual em `/transparencia/ledger` — **OK**
- [ ] Navegar `/provas-ao-vivo` — index atualizado
- [ ] Links PT↔EN (publicação bilíngue) — **OK**

## Deploy
- [ ] **Preview Vercel**: URL
- [ ] Domínios configurados: `logline.world` (público) e `lofline.foundation` (institucional)
- [ ] Pós-release: `npm run release:cut` (manifesto de hashes) e atualização do **/press**

## Notas adicionais
-

> Referências úteis: `/manifesto`, `/comparativo`, `/engenharia/logline-101`, `/rituais/publicacao-bilingue`, `/provas-ao-vivo`, `/roadmap`.
