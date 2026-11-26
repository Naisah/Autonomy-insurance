# T031 Directory projection and /internal/directory-events
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 2
Tier: T1          Agent: Forge
Stories: A2             Needs: T011, T023
Branch: agent/T031-directory-projection
Specs to read: 03 sections 3.1 and 5; 04 directory_users; decision A2
Owns:
- `services/core-api/src/modules/directory/**`
- `services/core-api/test/directory/**`
Do not touch: anything else, especially:
- other core-api modules
- `services/core-api/prisma/**`
- other services, apps/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. `POST /internal/directory-events` (service token only).
2. Apply events by per-user version.
3. Handle deactivation, `agent.availability` and `client.waiting`.
Done when:
- [ ] Out-of-order versions are ignored.
- [ ] Deactivation is visible in the projection.
- [ ] `agent.availability` and `client.waiting` events are applied.
- [ ] A user token is rejected.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
