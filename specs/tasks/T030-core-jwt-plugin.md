# T030 core-api JWT plugin
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 2
Tier: T1          Agent: Forge
Stories: X1, X2             Needs: T004, T021, T014
Branch: agent/T030-core-jwt-plugin
Specs to read: 03 sections 4, 5, 6, 13; 02 section 3
Owns:
- `services/core-api/src/plugins/auth/**`
- `services/core-api/test/plugins/auth/**`
Do not touch: anything else, especially:
- other core-api modules
- `services/core-api/prisma/**`
- other services, apps/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Verify tokens with a cached JWKS; check audience.
2. Rate limit and CORS.
3. Reject service tokens on user routes and user tokens on service-key routes.
Done when:
- [ ] Expired token returns 401.
- [ ] Wrong audience returns 401.
- [ ] A token with the rewards-api audience is rejected.
- [ ] A service token is rejected on user routes.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
