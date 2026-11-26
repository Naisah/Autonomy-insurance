# T004 Scaffold services/core-api
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 1
Tier: T3          Agent: Forge
Stories: all             Needs: T000
Branch: agent/T004-core-api-scaffold
Specs to read: 00 sections 4 to 6; 03 sections 3, 6, 12, 13; 05 section 4 (C8)
Owns:
- `services/core-api/**` except the prisma folder
Do not touch: anything else, especially:
- `services/core-api/prisma/**` (schema tasks and T013)
- other services, apps/**, packages/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Fastify + TypeScript + Zod + Vitest + Prisma client (reads `DATABASE_URL`).
2. Load routes automatically from `src/modules/*/routes.ts` (decision K2), so adding a module never edits a shared file.
3. `GET /health` returns ok.
4. Error model with the `Error` shape and codes from spec 05 decision C8; request id on every response and log line.
5. Socket.IO plugin placeholder (registered, no events yet).
6. npm scripts `dev`, `build`, `test`.
7. Shared server code is copied per service (Q11); no shared package.
Done when:
- [ ] `npm test` passes.
- [ ] `GET /health` returns ok.
- [ ] A test module folder added under `src/modules/` is served with no edit to a shared file.
- [ ] An unknown route returns the `Error` shape with a request id.
- [ ] Socket.IO plugin loads without error.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
