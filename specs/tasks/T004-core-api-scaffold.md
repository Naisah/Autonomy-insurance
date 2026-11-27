# T004 Scaffold services/core-api
Status: In review (Forge, branch agent/T004-core-api-scaffold; local only, push got 403).
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
Handoff: Added services/core-api: Fastify 4 + TypeScript + Zod + Vitest app (src/app.ts buildApp); auto-load of src/modules/*/routes.ts (K2); GET /health; Error shape with the C8 codes plus INTERNAL (src/errors.ts, matches the openapi Error enum); x-request-id on every response and requestId on every log line (a safe incoming id is honoured); Socket.IO placeholder plugin (src/plugins/socket.ts, no events); lazy Prisma client (src/db.ts, reads DATABASE_URL, loaded dynamically because prisma/** and `prisma generate` do not exist yet). Scripts: dev, build, test.
Checks run: `npm test` in services/core-api: 4/4 pass (health, module auto-load via a test fixture folder, unknown route Error shape + request id, Socket.IO connects). `npm run build` ok.
New dependencies (reason): fastify, fastify-plugin, zod, socket.io, @prisma/client, prisma, typescript, tsx, vitest, @types/node as the task lists; socket.io-client (dev only) to test the Socket.IO plugin. Root package-lock.json updated by npm install (outside Owns, unavoidable).
Left: JWT plugin (T030), schema and prisma generate (T011). Based on origin/agent/T000-repo-hygiene (PR #8 unmerged), so the PR must target that branch. Push to origin failed with 403, so no PR is open yet.
