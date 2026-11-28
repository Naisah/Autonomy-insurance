# T020 Register and login
Status: In review (Forge, branch agent/T020-register-login, PR #29).
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
- [x] Weak password rejected.
- [x] Wrong email and wrong password give the identical message.
- [x] 6th attempt within the window returns 429 with `retryAfterSeconds`.
- [x] Token carries `sub`, `role`, `sid`, `aud`.
- [x] Only the hash is stored in the database.
- [x] Register with the stub returning none creates a waiting client.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff:
- Changed: `POST /auth/register` and `POST /auth/login` in `services/auth/src/modules/{register,login}`; argon2id hashing (new dependency `argon2`, added because spec 03 requires argon2id and Node 22 has no stable one); RS256 access token (15 min; `sub`, `role`, `sid`, `aud=core-api`, `iss`, `iat`, `exp`) signed with node:crypto; refresh token is opaque, only its SHA-256 hash is stored (cookie `ai_refresh` for web, body for mobile); lockout 5 fails in 10 min then 5 min block, 429 `ACCOUNT_BLOCKED` with `retryAfterSeconds`; assignment stub in `register/assignment.ts` returns none, so the client is created waiting.
- Run checks: `npm test --workspace services/auth` (25 pass), `npx tsc --noEmit` in services/auth. `npm run contract:check` could not run here (`spectral` binary missing locally).
- Left: T021 (refresh, JWKS, key management; signing key now comes from `AUTH_JWT_PRIVATE_KEY` or is ephemeral), T023 (auth_events outbox rows for user.created and client.waiting), T026 (real assignment). The Prisma store is typechecked but untested against Postgres. docs/ai-use-log.md and docs/agent-log.md rows not added (docs/** is off limits here).
