# T012 rewards-api Prisma schema and first migration
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 1
Tier: T2          Agent: Atlas
Stories: G2 to G4             Needs: T005
Branch: agent/T012-rewards-api-schema
Specs to read: 04 sections 1, 4, 5, 7; decisions M1 to M8
Owns:
- `services/rewards-api/prisma/schema.prisma`
- `services/rewards-api/prisma/migrations/**`
Do not touch: anything else, especially:
- `services/rewards-api/prisma/seed.ts` (T013)
- `services/rewards-api/src/**`
- other services
- openapi.yaml, specs/**
Steps:
1. Write the tables from spec 04 section 4: rewards_users, daily_steps, period_summary, outbox.
2. Add the constraints from spec 04 section 5 (checks, unique and partial indexes).
3. Timestamps stored in UTC; business dates as date columns (Q6, Asia/Manila).
4. Create the first migration with `prisma migrate dev`.
5. If spec 04 and this task disagree, stop and write a Question (spec 04 wins).
Done when:
- [ ] `prisma migrate dev` succeeds on an empty `autonomy_rewards`.
- [ ] daily_steps unique on (user, day).
- [ ] Every constraint in spec 04 section 5 for the rewards database exists.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
