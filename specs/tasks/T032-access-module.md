# T032 Access module and generated authorization matrix test
Status: Draft. Not Ready until P0.1 marks the specs below Approved and every task in Needs is merged to main.
Phase: 2
Tier: T1          Agent: Forge (proposed)
Stories: A2             Needs: T030, T031
Branch: agent/T032-access-module
Specs to read: 03 section 5; 02 section 2; decision A5; contract `x-roles`
Owns:
- `services/core-api/src/access/**`
- `services/core-api/test/matrix/**`
Do not touch: anything else, especially:
- other core-api modules
- `services/core-api/prisma/**`
- other services, apps/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. `can(user, action, resource)` using role and reports_to from the projection.
2. Return 404, not 403, where existence would leak (A5).
3. Generate the matrix test (role x endpoint x own/other) from `x-roles`.
Done when:
- [ ] Matrix test passes for all current routes.
- [ ] Matrix test fails if a route has no `x-roles`.
- [ ] Another user's record returns 404 where A5 applies.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
