# T061 Web landing, login and register
Status: Draft. Not Ready until P0.1 marks the specs below Approved and every task in Needs is merged to main.
Phase: 2
Tier: T2          Agent: Pixel (proposed)
Stories: A1             Needs: T060, T020
Branch: agent/T061-web-auth-screens
Specs to read: 06 section 3 (landing, login, register rows); 02 A1; contract tag auth
Owns:
- `apps/web/src/features/landing/**`
- `apps/web/src/features/auth/**`
Do not touch: anything else, especially:
- other web features
- `apps/web/src/theme/**`
- services/**, packages/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Build the three screens from the Stitch files named in spec 06.
2. Wire to auth through the generated client.
3. Lockout message with countdown from `retryAfterSeconds`; weak password hint.
Done when:
- [ ] Wrong credentials show the generic message.
- [ ] Block message shows a countdown.
- [ ] Weak password shows the hint.
- [ ] Loading, error and empty states exist.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
