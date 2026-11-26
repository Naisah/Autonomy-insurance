# T023 Directory outbox to core-api
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 2
Tier: T1          Agent: Forge
Stories: A2             Needs: T022, T024a
Branch: agent/T023-directory-outbox
Specs to read: 03 sections 3.1 and 5; 04 auth_events; decision A2
Owns:
- `services/auth/src/modules/directory/**`
- `services/auth/test/directory/**`
Do not touch: anything else, especially:
- other auth modules
- `services/auth/prisma/**`
- other services, apps/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Write `auth_events` in the same transaction as each user change.
2. Worker gets a service token (T024a) and posts events to core-api `/internal/directory-events` in order.
3. Each event has a per-user version.
4. Retry failed deliveries with backoff.
Done when:
- [ ] Events are delivered in order.
- [ ] Duplicates are ignored by version (receiver contract test).
- [ ] A failed delivery is retried and later succeeds.
- [ ] A user change that rolls back writes no event.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
