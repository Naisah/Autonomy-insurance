# T116 Demo deploy and local fallback
Status: Ready. B5 and hosting approved Nov 26, 2026 (branch agent/b5-and-hosting). Start only when that PR and every task in Needs are merged to main.
Phase: 8
Tier: T2          Agent: Forge
Stories: all             Needs: T115, T110, T111
Branch: agent/T116-demo-deploy
Specs to read: docs/deployment-plan.md sections 5, 7, 8; docs/demo-script.md
Owns:
- `docker-compose.demo.yml`
- `scripts/deploy/**`
- `docs/demo-hosting-runbook.md`
Do not touch: anything else, especially:
- application code
- `render.yaml` (unless the demo pin needs it; say why in the Handoff)
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Re-check free-tier limits and this month's Render hours.
2. Owner step: turn off auto-deploy and pin the release commit on Render and Cloudflare Pages; empty the Supabase bucket.
3. Reseed the hosted databases with the demo seed.
4. Write `docs/demo-hosting-runbook.md` from plan section 7 (day before, 15 minutes before, switch to fallback).
5. `docker-compose.demo.yml`: Postgres, the three services, built web app, `STORAGE_DRIVER=local`, `DEMO_MODE=true`.
6. Rehearse: Playwright smoke (T110) against the hosted URLs, then against the fallback.
Done when:
- [ ] Smoke suite green against the hosted URLs.
- [ ] Fallback starts the full stack on one laptop in under 10 minutes and the smoke suite passes.
- [ ] The runbook lists every step with the command to run.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
