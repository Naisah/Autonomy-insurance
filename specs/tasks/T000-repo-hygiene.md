# T000 Repo hygiene: workspaces, docker-compose, env examples, PR template
Status: In review. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 1
Tier: T3          Agent: Forge
Stories: all             Needs: none
Branch: agent/T000-repo-hygiene
Specs to read: 00 sections 4 to 6; 03 section 12; 04 sections 1 and 7 (database names)
Owns:
- root `package.json` (npm workspaces) and workspace files
- `docker-compose.yml` and its Postgres init script
- `.editorconfig`, `.gitignore`
- `services/*/.env.example`
- `.github/pull_request_template.md`
Do not touch: anything else, especially:
- `.github/workflows/**` (P0.6)
- apps/**, services/*/src/**, packages/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Root `package.json` with npm workspaces for `apps/web`, `services/*` and `packages/contracts` (Flutter apps stay outside npm).
2. Root scripts that forward to workspaces: `contract:check`, `db:reset`, `dev:auth`, `dev:core`, `dev:rewards`, `dev:web` (each may fail until its task lands).
3. `docker-compose.yml`: one Postgres container whose init script creates `autonomy_auth`, `autonomy_core`, `autonomy_rewards`. Use PostgreSQL 16 (spec 00 section 4).
4. `.env.example` per service listing every variable by name with a placeholder value only (database URL, ports, JWT keys path, Gemini key for core-api).
5. `.gitignore`: `.env`, `node_modules`, build output, Flutter build folders. Add `.editorconfig`.
6. PR template: task file link, Owns respected, Done when tests listed, AI use logged.
Done when:
- [ ] `docker compose up -d` then `psql -l` lists `autonomy_auth`, `autonomy_core`, `autonomy_rewards`.
- [ ] `git check-ignore services/auth/.env` succeeds; no `.env` is tracked.
- [ ] No `.env.example` contains a real key, password or token.
- [ ] `npm install` at the root succeeds.
- [ ] A new PR on GitHub shows the PR template.
Notes:
- Branch protection on `main` is already done by the owner (decisions K5, R3).
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: Added root package.json (workspaces apps/web, services/*, packages/contracts; forwarding scripts), package-lock.json, docker-compose.yml (postgres:16) with docker/postgres-init.sql creating autonomy_auth, autonomy_core, autonomy_rewards, .env.example for auth, core-api, rewards-api (placeholders only), .gitignore additions (node_modules, .env.*, !.env.example, Flutter build), .editorconfig, .github/pull_request_template.md. No new dependencies.
Checks run: `npm install` ok; `git check-ignore services/auth/.env` ok; no .env tracked; `docker compose config` valid.
Left: `docker compose up -d` + `psql -l` NOT run (Docker daemon was off). Reviewer please run it. Confirm the PR template shows on this PR. Env variable names beyond spec 03 section 12 (e.g. AUTH_JWKS_URL, JWT_ISSUER, REWARDS_API_URL) are my guesses; T003 to T005 may rename them.
