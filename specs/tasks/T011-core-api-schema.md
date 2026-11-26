# T011 core-api Prisma schema and first migration
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 1
Tier: T1          Agent: Atlas
Stories: B to G             Needs: T004
Branch: agent/T011-core-api-schema
Specs to read: 04 sections 1, 3, 5, 7; decisions M1 to M8
Owns:
- `services/core-api/prisma/schema.prisma`
- `services/core-api/prisma/migrations/**`
Do not touch: anything else, especially:
- `services/core-api/prisma/seed.ts` (T013)
- `services/core-api/src/**`
- other services
- openapi.yaml, specs/**
Steps:
1. Write the tables from spec 04 section 3: directory_users, conversations, conversation_reads, messages, escalations, ai_conversations, ai_messages, estimates, policies, premium_schedule_items, claims, claim_documents, claim_events, reward_results, reward_status_history, reward_effects, settings, user_preferences, notifications; sequences starting at 4829 and 1042.
2. Add the constraints from spec 04 section 5 (checks, unique and partial indexes).
3. Timestamps stored in UTC; business dates as date columns (Q6, Asia/Manila).
4. Create the first migration with `prisma migrate dev`.
5. If spec 04 and this task disagree, stop and write a Question (spec 04 wins).
Done when:
- [ ] `prisma migrate dev` succeeds on an empty `autonomy_core`.
- [ ] Partial unique index allows only one Open escalation per conversation.
- [ ] Unique (client, period) on reward_results.
- [ ] No discount or payout-reduction column anywhere (D1, D2).
- [ ] Every constraint in spec 04 section 5 for the core database exists.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
