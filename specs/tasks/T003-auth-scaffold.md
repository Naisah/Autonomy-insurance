# T003 Scaffold services/auth
Status: In review.
Phase: 1
Tier: T3          Agent: Forge
Stories: A1             Needs: T000
Branch: agent/T003-auth-scaffold
Specs to read: 00 sections 4 to 6; 03 sections 3, 6, 12, 13; 05 section 4 (C8)
Owns:
- `services/auth/**` except the prisma folder
Do not touch: anything else, especially:
- `services/auth/prisma/**` (schema tasks and T013)
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
- [ ] `npm test` passes.
- [ ] `GET /health` returns ok.
- [ ] A test module folder added under `src/modules/` is served with no edit to a shared file.
- [ ] An unknown route returns the `Error` shape with a request id.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff:
- Changed: services/auth scaffold. Fastify 5 + TypeScript + Zod + Vitest; Prisma client is lazy (`src/shared/db.ts`, reads DATABASE_URL, typed loosely until T010 adds the schema). `src/shared/modules.ts` autoloads `src/modules/*/routes.(ts|js)` (K2). `src/shared/errors.ts` has the C8 Error shape and codes; every response carries `x-request-id` and logs carry `reqId`. `GET /health` returns `{status:"ok", service:"auth"}`. Scripts: dev, build, start, test.
- New dependencies (reasons): fastify (framework, spec 00 s4), zod (validation), @prisma/client and prisma (ORM, schema comes in T010), vitest (tests), tsx (dev runner), typescript and @types/node (build).
- Run checks: `npm install` at root, then `npm test --workspace services/auth` (3 tests pass), `npx tsc --noEmit` in services/auth.
- Notes: root package-lock.json updated by npm install (outside Owns but unavoidable). Shared code lives in `src/shared/` because root .gitignore ignores `lib/`. docs/agent-log.md and docs/ai-use-log.md not updated (docs/** is off limits in this task); please log them.
- Left: Prisma generate and DB use wait for T010; PR review by Sentinel.
- Lens fixes (PR #14): health returns service; 500 code is INTERNAL; field errors use `fields` string map (contract Error). Fastify version (5 here, 4 in T004/T005) left for the team to decide.
