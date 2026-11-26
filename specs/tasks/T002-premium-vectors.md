# T002 Premium formula test vectors and TS reference
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 1
Tier: T2          Agent: Anvil, Probe and Pixel (trial, P0.7); keep the best
Stories: C1, C2             Needs: none
Branch: agent/T002-premium-vectors
Specs to read: 02 sections 6 and 9 (formula, baseRate 0.70); 03 section 8; 04 estimates; decisions A6, M6
Owns:
- `packages/contracts/test-vectors/premium.json`
- `packages/contracts/src/premium.ts`
- `packages/contracts/test/premium.test.ts`
Do not touch: anything else, especially:
- other files in packages/contracts
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Read the linear formula in spec 02 (baseRate 0.70, formula version 1).
2. Write at least 20 vectors: edges of age, coverage and term, plus rounding cases.
3. Include coverage 2,000,000, age 30, term 20 = 1818.88.
4. Write the integer-centavo reference function in `src/premium.ts` (no floating-point money).
5. File header in `premium.json`: formula version, inputs, rounding rule.
6. Vitest table test over every vector.
Done when:
- [ ] Vitest passes all vectors.
- [ ] At least 20 vectors, including the 1818.88 case.
- [ ] Rounding rule is written in the file header.
- [ ] `src/premium.ts` uses integers for money (reviewer checks).
Notes:
- This is the Orca trial task (spec 01 section 8, P0.7).
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
