# T020 Register and login
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 2
Tier: T1          Agent: Forge
Stories: A1             Needs: T010, T014
Branch: agent/T020-register-login
Specs to read: 02 A1 and section 3; 03 sections 4 and 5.1; 04 users, login_attempts; contract tag auth
Owns:
- `services/auth/src/modules/register/**`
- `services/auth/src/modules/login/**`
- `services/auth/test/register/**`
- `services/auth/test/login/**`
Do not touch: anything else, especially:
- other auth modules
- `services/auth/prisma/**`
- other services, apps/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Password rule from spec 02 A1; argon2id hashing.
2. Login with one generic error for wrong email or password.
3. Lockout: 5 fails in 10 min, then 5 min block; 429 with `retryAfterSeconds`.
4. RS256 access token, 15 min, claims `sub`, `role`, `sid`, `aud`.
5. Register calls an assignment hook (stub until T026); when it returns no agent, the client is created as waiting.
Done when:
- [ ] Weak password rejected.
- [ ] Wrong email and wrong password give the identical message.
- [ ] 6th attempt within the window returns 429 with `retryAfterSeconds`.
- [ ] Token carries `sub`, `role`, `sid`, `aud`.
- [ ] Only the hash is stored in the database.
- [ ] Register with the stub returning none creates a waiting client.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
