# T022 Staff accounts, roles, must-change-password
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 2
Tier: T2          Agent: Forge
Stories: A4             Needs: T021
Branch: agent/T022-staff-accounts
Specs to read: 02 A4; 03 section 5; 04 users; contract tag users
Owns:
- `services/auth/src/modules/accounts/**`
- `services/auth/test/accounts/**`
Do not touch: anything else, especially:
- other auth modules
- `services/auth/prisma/**`
- other services, apps/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. `GET/POST /users`, `PATCH /users/{id}`.
2. Change password and the must-change-password flow.
3. Role and parent validation (Agent needs a Manager).
Done when:
- [ ] Only Admin may create accounts; non-admin gets 403.
- [ ] Creating an Agent without a Manager fails.
- [ ] A deactivated user cannot log in.
- [ ] A user with must-change-password must change it before other routes work.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
