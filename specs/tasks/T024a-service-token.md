# T024a Service accounts and POST /service/token
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 2
Tier: T1          Agent: Forge
Stories: A2, G4             Needs: T021
Branch: agent/T024a-service-token
Specs to read: 03 sections 4 and 9.2; 04 service_accounts; 05 decision C6; contract tag auth
Owns:
- `services/auth/src/modules/service-token/**`
- `services/auth/test/service-token/**`
Do not touch: anything else, especially:
- other auth modules
- `services/auth/prisma/**`
- other services, apps/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. `POST /service/token`: service account id and secret in, short-lived RS256 token out, with audience and scopes. Lifetime 15 minutes, `scope` claim, no refresh token (spec 03 section 4).
2. Secrets stored only as hashes in service_accounts.
3. Scopes: directory delivery (T023), `reward:read-effects` (C6), the results-posting scope for rewards-api and `rewards:close-period` (Q12).
4. Service tokens carry no user role and are rejected on user routes.
Done when:
- [ ] Valid id and secret return a token with the right audience and scopes.
- [ ] Wrong secret returns 401.
- [ ] A service token on a user route is rejected.
- [ ] Only the secret hash is in the database.
Notes:
- New split from T024 (docs/implementation-plan.md section 9); spec 07 updated in PR #2.
- `/internal/users/{id}/reports-to` and SSO stay in T024b (Phase 6).
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
