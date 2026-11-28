# T006 Scaffold apps/web
Status: In review (Pixel, branch agent/T006-web-scaffold, PR #16).
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
- [x] `npm run dev` shows a placeholder page.
- [x] `npm test` runs and passes.
- [x] Adding a folder under `src/features/` with a `route.ts` adds a route with no edit to a shared router file.
- [x] Playwright config runs one smoke test.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: Added the Vite/React/TypeScript/Tailwind web workspace, a placeholder route discovered through `import.meta.glob`, Vitest coverage for discovery and rendering, and a Playwright smoke test. Added the requested workspace dependencies for this scaffold; no other packages were introduced. Fixed the root `package-lock.json` so `npm ci` installs the web workspace. Verified `npm ci`, `npm test --workspace apps/web` (2 tests), `npm run build --workspace apps/web`, and `npm run test:e2e --workspace apps/web` (1 smoke test). For the browser test, install Chromium in the worktree with `$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.playwright-browsers'; npx playwright install chromium` before running `npm run test:e2e --workspace apps/web`. PR #16 targets `main`; T060 owns replacing the placeholder with the role-aware app shell.
