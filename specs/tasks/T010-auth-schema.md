# T010 auth Prisma schema and first migration
Status: Draft. Not Ready until P0.1 marks the specs below Approved and every task in Needs is merged to main.
Phase: 1
Tier: T1          Agent: Atlas
Stories: A1 to A4             Needs: T003
Branch: agent/T010-auth-schema
Specs to read: 04 sections 1, 2, 5, 7; decisions M1 to M8
Owns:
- `services/auth/prisma/schema.prisma`
- `services/auth/prisma/migrations/**`
Do not touch: anything else, especially:
- `services/auth/prisma/seed.ts` (T013)
- `services/auth/src/**`
- other services
- openapi.yaml, specs/**
Steps:
1. Write the tables from spec 04 section 2: users (with availability, max_clients, waiting_since), sessions, refresh_tokens, sso_codes, login_attempts, service_accounts, auth_events.
2. Add the constraints from spec 04 section 5 (checks, unique and partial indexes).
3. Timestamps stored in UTC; business dates as date columns (Q6, Asia/Manila).
4. Create the first migration with `prisma migrate dev`.
5. If spec 04 and this task disagree, stop and write a Question (spec 04 wins).
Done when:
- [ ] `prisma migrate dev` succeeds on an empty `autonomy_auth`.
- [ ] Role and parent check exists (Agent needs a Manager parent).
- [ ] availability and max_clients allowed only for agents (check constraint).
- [ ] Every constraint in spec 04 section 5 for the auth database exists (test or migration SQL review).
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
