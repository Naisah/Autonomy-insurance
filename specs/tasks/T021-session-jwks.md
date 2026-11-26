# T021 Refresh rotation, logout, /auth/me, JWKS
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 2
Tier: T1          Agent: Forge
Stories: A3             Needs: T020
Branch: agent/T021-session-jwks
Specs to read: 02 A3; 03 section 4; 04 sessions, refresh_tokens; decision A4; contract tag auth
Owns:
- `services/auth/src/modules/session/**`
- `services/auth/src/modules/jwks/**`
- `services/auth/test/session/**`
- `services/auth/test/jwks/**`
Do not touch: anything else, especially:
- other auth modules
- `services/auth/prisma/**`
- other services, apps/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Refresh rotation with reuse detection.
2. Logout and logout-all.
3. `GET /auth/me`.
4. JWKS endpoint for offline verification.
5. Web gets the refresh token in an httpOnly cookie; mobile gets it in the body (A4).
Done when:
- [ ] Reusing an old refresh token revokes the session.
- [ ] Logout-all revokes every session.
- [ ] A token verifies offline against the JWKS.
- [ ] Web response sets the cookie; mobile response has the token in the body.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
