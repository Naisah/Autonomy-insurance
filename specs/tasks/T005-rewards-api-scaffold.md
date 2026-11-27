# T005 Scaffold services/rewards-api
Status: In review
Phase: 1
Tier: T3          Agent: Forge
Stories: G2             Needs: T000
Branch: agent/T005-rewards-api-scaffold
Specs to read: 00 sections 4 to 6; 03 sections 3, 6, 12, 13; 05 section 4 (C8)
Owns:
- `services/rewards-api/**` except the prisma folder
Do not touch: anything else, especially:
- `services/rewards-api/prisma/**` (schema tasks and T013)
- other services, apps/**, packages/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Fastify + TypeScript + Zod + Vitest + Prisma client (reads `DATABASE_URL`).
2. Load routes automatically from `src/modules/*/routes.ts` (decision K2), so adding a module never edits a shared file.
3. `GET /health` returns ok.
4. Error model with the `Error` shape and codes from spec 05 decision C8; request id on every response and log line.
5. npm scripts `dev`, `build`, `test`.
6. Shared server code is copied per service (Q11); no shared package.
Done when:
- [x] `npm test` passes.
- [x] `GET /health` returns ok.
- [x] A test module folder added under `src/modules/` is served with no edit to a shared file.
- [x] An unknown route returns the `Error` shape with a request id.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: Added services/rewards-api: Fastify 4 + TypeScript + Zod + Vitest app (src/app.ts buildApp), copied from the core-api scaffold per Q11 minus Socket.IO. Auto-loads src/modules/*/routes.ts (K2); GET /health returns {status:'ok'}; Error shape with C8 codes plus INTERNAL (src/errors.ts); x-request-id on every response and requestId on every log line; lazy Prisma client (src/db.ts, reads DATABASE_URL, dynamic import because prisma/** and `prisma generate` do not exist yet). Default PORT 4003. Scripts: dev, build, test.
Checks run: `npm test` in services/rewards-api: 3/3 pass (health, module auto-load via a test fixture folder, unknown route Error shape + request id). `tsc -p tsconfig.build.json` ok.
New dependencies (reason): fastify, zod, @prisma/client, prisma, typescript, tsx, vitest, @types/node as the task lists. Root package-lock.json updated by npm install (outside Owns, unavoidable).
Left: JWT/auth plugin and routes (later tasks), schema and prisma generate (T012). Based on origin/agent/T000-repo-hygiene (PR #8 unmerged), so this PR targets that branch.
