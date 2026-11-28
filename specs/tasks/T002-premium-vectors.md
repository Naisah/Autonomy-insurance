# T002 Premium formula test vectors and TS reference
Status: Done. Merged Nov 26, 2026 (PR #9, Probe).
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
- [x] Vitest passes all vectors.
- [x] At least 20 vectors, including the 1818.88 case.
- [x] Rounding rule is written in the file header.
- [x] `src/premium.ts` uses integers for money (reviewer checks).
Notes:
- This is the Orca trial task (spec 01 section 8, P0.7).
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff:
- What changed: added `packages/contracts/test-vectors/premium.json` with 24 vectors (age edges 18/25/26/65, coverage edges 500000/1999999/2000000/20000000, term edges 10/20/30, and round-half-up cases 500001/500050/500099) plus a header with formula version `v1` (number 1), inputs, exact integer formula and the round-half-up rule; added `packages/contracts/src/premium.ts` with the integer-centavo reference (`monthlyPremiumCentavos`, `formatMoney`, `computePremium`, `FORMULA_VERSION`) using BigInt and no floating-point money; added the Vitest table test `packages/contracts/test/premium.test.ts`.
- How to run checks: `cd packages/contracts && npx --yes vitest@latest run` (the contracts package tooling from T001 is not merged yet, so Vitest is run directly; 75 tests pass, 1 file).
- What is left: no application code outside Owns changed. The contracts package still needs T001's `package.json` and test script wiring; T080 can reuse `premium.json` and the function for the Dart vectors. Reviewer to confirm the integer-only money rule.
