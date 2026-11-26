# T014 Finish packages/contracts/openapi.yaml from spec 05
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 1
Tier: T1          Agent: Atlas
Stories: all             Needs: T001
Branch: agent/T014-openapi-contract
Specs to read: 05 (all, especially section 8); 02 section 4; 03 sections 4, 5, 5.1, 7, 9
Owns:
- `packages/contracts/openapi.yaml`
- `packages/contracts/generated/**` (regenerated output only)
Do not touch: anything else, especially:
- lint rules and scripts (T001)
- test vectors (T002, T015)
- services/**, apps/**, any prisma/schema.prisma, docs/**, specs/** (a spec gap becomes a Question)
Steps:
1. Start from the Nov 26 draft already in `packages/contracts/openapi.yaml` (Q8).
2. Apply the spec 05 section 8 change list in one commit.
3. Check every story in spec 02 except A2 and A5 has an operation (B5 included: the two attachment operations in spec 05 section 8), with `x-roles`, `x-stories`, `x-priority`.
4. Include `POST /service/token` (T024a) and the Admin close-period operation through core-api that spec 05 section 8 lists (Q12).
5. List the Socket.IO events in the description header (spec 03 section 7).
6. Regenerate clients and run `npm run contract:check`.
Done when:
- [ ] `npm run contract:check` passes.
- [ ] Every story except A2 and A5 has at least one operation, B5 included (scripted check over `x-stories`).
- [ ] Lint fails if a `*Staff` schema gains a reward field.
- [ ] Mock server answers one route per tag.
- [ ] No `payoutReductionPercent`, `payoutAmount`, `healthScore`, `/rewards/goal`, `/rewards/milestones` remain.
Notes:
- Spec 07 says the file does not exist; that line is out of date (decision K6, Q8).
- Contract decisions C1 to C8 are decided (docs/decisions.md).
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
