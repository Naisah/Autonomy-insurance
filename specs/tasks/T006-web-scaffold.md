# T006 Scaffold apps/web
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 1
Tier: T3          Agent: Pixel
Stories: all             Needs: T000
Branch: agent/T006-web-scaffold
Specs to read: 00 sections 4 and 6; 07 section 1 (conflict-avoidance conventions); 06 section 2
Owns:
- `apps/web/**` except `apps/web/src/theme/**`
Do not touch: anything else, especially:
- `apps/web/src/theme/**` (T009)
- services/**, packages/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Vite + React + TypeScript + Tailwind + Vitest + Playwright config.
2. Glob-based feature routes: each `src/features/*/route.ts` registers itself.
3. Create `src/app/` and `src/shared/` with a placeholder layout (T060 owns them after this task).
4. One example feature proving the glob loader.
Done when:
- [ ] `npm run dev` shows a placeholder page.
- [ ] `npm test` runs and passes.
- [ ] Adding a folder under `src/features/` with a `route.ts` adds a route with no edit to a shared router file.
- [ ] Playwright config runs one smoke test.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
