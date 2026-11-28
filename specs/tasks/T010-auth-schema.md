# T010 auth Prisma schema and first migration
Status: In review (Atlas, branch agent/T010-auth-schema).
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
- [x] Role and parent check exists (Agent needs a Manager parent).
- [x] availability and max_clients allowed only for agents (check constraint).
- [x] Every constraint in spec 04 section 5 for the auth database exists (test or migration SQL review).
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff:
- What changed: `services/auth/prisma/schema.prisma` (users, sessions, refresh_tokens, sso_codes, login_attempts, service_accounts, auth_events, four enums, citext email) and migration `20261128000000_init` (generated SQL plus hand-written checks, partial indexes and two triggers). No other files, no new dependencies.
- Constraints in the migration SQL: agent-only availability and max_clients; max_clients 1 to 100; Admin has no parent, Manager and Agent require one; role/parent trigger (Client under Agent, Agent under Manager, Manager under Admin; blocks a role change that orphans children); waiting_since only for a Client with no agent; lowercase email; partial indexes on users(waiting_since) and undelivered auth_events; SSO codes only for Client users; service account scopes not empty; auth_events type and version checks. The trigger also sets availability to Available for a new agent.
- How I checked: `npx prisma validate` passes. The SQL came from `prisma migrate diff --from-empty --to-schema-datamodel`. Docker was off, so I could NOT run `prisma migrate dev` on a real `autonomy_auth`. I ran the whole migration.sql on PGlite (Postgres in WASM, throwaway, not committed) and 20 insert/update cases behaved as expected (valid chains accepted; wrong parent role, orphaning role change, bad availability, max_clients 0, duplicate email by case, bad SSO user, bad event type rejected).
- Left: reviewer runs `docker compose up -d`, then `cd services/auth && npx prisma migrate dev` against an empty `autonomy_auth` to tick the first Done when box. Not logged in docs/agent-log.md or docs/ai-use-log.md (docs/** is outside Owns): Scribe please log. Note: spec 04 does not say whether an Agent row must have max_clients set; the schema allows null and leaves the default (setting `assignment.defaultMaxClients`) to T022.
