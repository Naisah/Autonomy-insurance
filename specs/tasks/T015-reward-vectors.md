# T015 Reward test vectors and TS reference
Status: Draft. Not Ready until P0.1 marks the specs below Approved and every task in Needs is merged to main.
Phase: 1
Tier: T2          Agent: Probe (proposed)
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
- [ ] Vitest passes all vectors.
- [ ] Every edge listed in Steps has a vector.
- [ ] Header documents the status-on-date rule and Asia/Manila business dates.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
