# T015 Reward test vectors and TS reference
Status: Done. Merged to main (PR #13, Probe). Marked Done by Atlas Nov 28, 2026.
Phase: 1
Tier: T2          Agent: Probe
Stories: G2, G3, G5             Needs: none
Branch: agent/T015-reward-vectors
Specs to read: 02 section 6 (reward rules); 03 sections 9.2 and 9.3; 04 reward_status_history, period_summary
Owns:
- `packages/contracts/test-vectors/rewards.json`
- `packages/contracts/src/rewards.ts`
- `packages/contracts/test/rewards.test.ts`
Do not touch: anything else, especially:
- other files in packages/contracts
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Daily points vectors at 4,999/5,000, 7,999/8,000, 11,999/12,000 steps (0, 10, 20, 30 points).
2. Level vectors at 199/200, 399/400, 599/600 monthly points (Bronze, Silver, Gold, Platinum).
3. Extension and delay days per level (+7, +14, +21 per spec 02).
4. Payout example: Platinum, approved day 0, paid day 14.
5. File header: the status-on-date rule (premium uses status on due date, claim on approval date; Bronze when no result) and that business dates are Asia/Manila (Q6).
6. TS reference in `src/rewards.ts` and a Vitest table test.
Done when:
- [x] Vitest passes all vectors.
- [x] Every edge listed in Steps has a vector.
- [x] Header documents the status-on-date rule and Asia/Manila business dates.
Questions: none.
Handoff:
- What changed: added `packages/contracts/test-vectors/rewards.json` with a header for the status-on-date rule (premium on due date, claim on approval date, Bronze when no result) and Asia/Manila business dates (Q6); daily-point vectors at 4,999/5,000, 7,999/8,000 and 11,999/12,000 steps; level vectors at 199/200, 399/400 and 599/600 points; extension/delay vectors for Bronze (0/0), Silver (7/3), Gold (14/5) and Platinum (21/7); append-only history vectors for date lookups; and the Platinum approved-day-0, paid-day-14 example. Added `packages/contracts/src/rewards.ts` with the integer reference functions (`dailyPoints`, `levelForPoints`, `extensionDays`, `payoutDelayDays`, `statusOnDate`, `addBusinessDays`, `payoutDueDate`) and `packages/contracts/test/rewards.test.ts` with table tests over every vector, including edge-presence checks.
- How to run checks: from `packages/contracts`, run `npx --yes vitest@latest run` (T001's package tooling is not merged yet, so Vitest is invoked directly, as in T002). Result: 2 test files, 104 tests passed.
- What is left: no application code or other contract files changed and no new dependency added. Reward API, core-api and Dart consumers can import these vectors once their tasks merge; T001 still needs to wire a package.json test script. This work was AI-assisted (OpenCode/Probe); Scribe logs it in docs/ai-use-log.md and docs/agent-log.md after merge, since this task forbids edits under docs/**. Reviewer to confirm every Steps edge has a vector.
