# T115 Staging deploy on the free hosts
Status: Ready. B5 and hosting approved Nov 26, 2026 (branch agent/b5-and-hosting). Start only when that PR and every task in Needs are merged to main.
Phase: 2
Tier: T2          Agent: Forge
Stories: all             Needs: T020, T021, T022, T023, T024a, T025, T026, T027, T030, T031, T032, T060, T061, T080, T081, T083, T013
Branch: agent/T115-staging-deploy
Specs to read: docs/deployment-plan.md (all); 03 section 12
Owns:
- `render.yaml`
- `apps/web/functions/**` (Pages Function proxy)
- `apps/web/public/_headers`, `apps/web/public/_redirects`
- `scripts/deploy/**`
Do not touch: anything else, especially:
- application code in services/** and apps/** outside the paths above
- `.github/workflows/**`
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Re-check each host's free-tier limits against docs/deployment-plan.md section 1; write any change in the Handoff.
2. `render.yaml` for auth, core-api, rewards-api: free plan, Singapore, start command runs `prisma migrate deploy` first, `healthCheckPath: /health`, every secret as `sync: false`.
3. Cloudflare Pages build settings for apps/web, SPA fallback, and the `/auth/*` proxy function to the auth service.
4. `scripts/deploy/warm-up` (calls each `/health`, then one login) and `scripts/deploy/seed-hosted` (runs `npm run db:reset` with hosted URLs taken from the caller's shell env).
5. Owner step (not the agent): create the Render, Neon, Supabase and Cloudflare accounts and paste secrets into each host's env settings, following the variable table in the plan.
6. Run a secret scan on the branch before opening the PR.
Done when:
- [ ] The hosted web app registers and logs in a client end to end.
- [ ] The refresh cookie is set on the web origin (first-party) and refresh works after a reload.
- [ ] `/health` answers on all three services; Socket.IO connects from the hosted web app.
- [ ] A mobile debug build signs in against the hosted auth.
- [ ] Secret scan is clean; `render.yaml` has no secret values.
Notes:
- Runs at the end of Phase 2, after its exit demo.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
