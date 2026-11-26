# Deployment plan: free hosting for the live demo

Status: Approved Nov 26, 2026 (team lead asked for a hosted live demo on free tiers; Atlas chose the hosts). Decisions H1 to H10 in docs/decisions.md. Tasks: T115 (staging after Phase 2), T116 (demo deploy, Phase 8), T117 (signed APKs, Phase 8).

Free tiers change often. The limits below were checked on Nov 26, 2026; T115 and T116 re-check them on each host's own pricing page before relying on them, and record any change here.

## 0. Hard rule: free, and no card
The team lead's rule (Nov 26, 2026): every host must be free and must never ask for a credit card or any payment method, at sign-up or later. If a host starts asking for a card, or a free limit would only be lifted by adding one, do not add it: switch that part to another card-free host or to the local docker compose fallback, and record the change here and in docs/decisions.md.

Checked Nov 26, 2026:
- Cloudflare Pages: vendor page says "no credit card required".
- Render (free web services): Render's own article (Apr 23, 2026) says no credit card is required. Without a card, going over a free limit suspends the service until next month; it is never billed.
- Neon: Neon's free-tier FAQ (updated Nov 9, 2026) says no credit card required; the Free plan has no time limit.
- Supabase: the pricing page and billing FAQ list no card requirement for the Free plan (cards are only mentioned for paid billing). Confirm at sign-up; if Supabase asks for a card, store attachments in core-api's Neon database instead and cap uploads to stay under 1 GB.
- Not allowed: Railway, Fly.io and Cloudflare R2 (they need a card), and Render's paid plans.

## 1. Hosts
| Part | Host (free tier) | Card needed | Limits that matter | Sleep and cold start |
|---|---|---|---|---|
| Web app (React, Vite, static) | Cloudflare Pages | No | 500 builds a month, 20,000 files per site; Pages Functions use the Workers free quota (100,000 requests a day) | None for static files |
| auth, core-api (with Socket.IO), rewards-api | Render, three free web services, Singapore region | No | 750 free instance hours a month shared by the whole workspace; about 5 GB bandwidth a month (without a card, going over suspends services instead of billing); no persistent disk; no background workers | Sleeps after 15 minutes without HTTP or WebSocket traffic; wake takes about one minute |
| Postgres (three databases) | Neon, three projects (`autonomy-auth`, `autonomy-core`, `autonomy-rewards`), AWS Singapore | No | Per project: 1 GB storage, 100 CU-hours a month, 5 GB transfer | Scales to zero after 5 minutes idle; wakes in under a second |
| Attachment files (B5) | Supabase Storage, one project, private bucket `chat-attachments`, Singapore | No | 1 GB storage, 5 GB egress a month | The free project pauses after 7 days without activity; restore it in the dashboard |
| Android APKs | GitHub Releases on this repo | No | 2 GB per file | None |

Why these:
- **Render** is the only free host in the shortlist that runs long-lived Node processes with WebSockets and no card. Fly.io and Railway no longer have a lasting free tier; Koyeb's free tier allows one service only.
- **Neon instead of Render Postgres:** Render's free database expires after 30 days. One Neon project per service keeps the spec 04 rule (one database per service) and gives each its own compute quota.
- **Supabase Storage instead of Cloudflare R2:** R2 needs a card on file. Storing files in Postgres would eat the 1 GB Neon limit and bandwidth on every read.
- **Cloudflare Pages** serves the static build from a CDN and can run one small function to proxy auth (section 3).

## 2. Architecture when hosted
```
Browser ── https://<project>.pages.dev  (Cloudflare Pages: static web app)
   │   └─ /auth/*  ──Pages Function proxy──▶ auth.onrender.com     (refresh cookie stays first-party)
   ├─ REST + Socket.IO (bearer token) ─────▶ core-api.onrender.com ──▶ Neon autonomy-core
   │                                                            └──▶ Supabase Storage (service key)
Android main app ── auth / core-api directly (tokens in the body, A4)
Rewards app ──────── auth (SSO) / rewards-api.onrender.com ──▶ Neon autonomy-rewards
auth.onrender.com ──▶ Neon autonomy-auth; directory events ──▶ core-api (service token)
rewards-api ── results ──▶ core-api /api/rewards/results (service token)
```

## 3. Rules each service must follow on these hosts
- **Cross-site cookie:** the web refresh token is an httpOnly cookie (A4). `pages.dev` and `onrender.com` are different sites, so browsers can block that cookie. The web app therefore calls auth through a Cloudflare Pages Function at `/auth/*` on its own origin, which forwards to the auth service. The cookie is set for the web origin with `Secure; HttpOnly; SameSite=Lax; Path=/auth`. core-api and rewards-api use bearer tokens only, so they need CORS for the Pages origin but no cookies.
- **Socket.IO:** core-api serves it on the same port (spec 03 section 7). Render supports WebSockets. When the service sleeps, sockets drop; the clients' reconnect and resend (`clientMessageId`) already handle that.
- **No background workers on the free tier:** the directory outbox worker (T023), the rewards outbox and day-close job (T052, T053) run inside their web service process. On start they catch up on anything missed while asleep. The demo uses "Close period now" anyway.
- **Migrations:** each service's start command runs `prisma migrate deploy` before starting the server (Render's pre-deploy step is not on the free tier). Neon gives two URLs: `DATABASE_URL` (pooled) for the app and `DIRECT_URL` (direct) for migrations.
- **Files:** core-api uses `STORAGE_DRIVER=supabase` when hosted and `local` on laptops and in the fallback (spec 03 section 7, B5).
- **Health:** every service keeps `GET /health` cheap and database-free, so warm-up pings do not burn Neon compute.
- **Region:** Singapore everywhere (closest to Asia/Manila), so a request does not cross oceans between service and database.

## 4. Secrets
- Secrets live only in each host's environment settings (Render service Environment, Cloudflare Pages project settings, Neon and Supabase dashboards) and in each developer's local `.env`, which git ignores. Never in git, task files, PR text, logs or chat prompts.
- `render.yaml` lists every variable with `sync: false` for secrets, so the blueprint carries names, never values. `.env.example` files list the same names with placeholders.
- The JWT private key is a PEM string in auth's env only. The Supabase service key is in core-api's env only; the browser and the apps never see it.
- The Gemini key is set by its owner directly in core-api's env (team fact still needed: who owns it).
- T115 and T116 run a secret scan (for example `gitleaks`) on the branch before opening their PR.

| Service | Variables (names only) |
|---|---|
| auth | `DATABASE_URL`, `DIRECT_URL`, `JWT_PRIVATE_KEY`, `JWT_KEY_ID`, `WEB_ORIGIN`, service account secrets for core-api and rewards-api |
| core-api | `DATABASE_URL`, `DIRECT_URL`, `AUTH_JWKS_URL`, `AUTH_URL`, `REWARDS_API_URL`, `SERVICE_CLIENT_ID`, `SERVICE_CLIENT_SECRET`, `CORS_ORIGIN`, `GEMINI_API_KEY`, `STORAGE_DRIVER`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_BUCKET`, `DEMO_MODE` |
| rewards-api | `DATABASE_URL`, `DIRECT_URL`, `AUTH_JWKS_URL`, `CORE_API_URL`, `SERVICE_CLIENT_ID`, `SERVICE_CLIENT_SECRET`, `CORS_ORIGIN`, `DEMO_MODE` |
| web (build time) | `VITE_CORE_API_URL`, `VITE_REWARDS_API_URL`; `AUTH_ORIGIN` for the Pages Function |

## 5. Environments
- **Staging (T115, right after Phase 2):** auto-deploys from `main` (Render and Cloudflare Pages both watch the branch). Seeded with the demo seed. Used by the team to test on real phones from Phase 3 on.
- **Demo (T116, Phase 8):** the same services and databases, switched to the demo: auto-deploy off and pinned to the release commit, fresh demo seed (`npm run db:reset` with the hosted URLs, run from a laptop), Supabase bucket emptied. One environment, not two, because the 750 free Render hours are shared per workspace.
- **Local fallback:** `docker-compose.demo.yml` (T116) starts Postgres, the three services and the built web app on one laptop, with `STORAGE_DRIVER=local`. Use it if any host is down, suspended or slow on the day.

## 6. Android apps for the demo
- T117 builds signed release APKs of the main app and the Rewards app with `flutter build apk --release` and the hosted URLs passed as `--dart-define` values. A second pair is built for the local fallback with the laptop's LAN address.
- The signing keystore is created once by the owner, kept outside the repo (password manager plus one backup), and read through a git-ignored `key.properties`. CI never holds it.
- The APKs are attached to a GitHub Release (`demo-v1`) on this repo. Presenters install both on the demo phone the day before ("Install unknown apps" allowed) and keep the emulator as a backup. People without repo access get the files from the presenter, not from a public link.
- Deep links between the two apps (SSO, A3) work because both are installed on the same device.

## 7. Demo day checklist (T116 writes the full runbook)
1. Day before: open the Supabase dashboard and restore the project if it paused; run the hosted smoke test; confirm Render hours left for the month.
2. 15 minutes before: run the warm-up script (calls each `/health`, then one real login so Neon wakes). Keep a pinger running every 5 minutes during the talk, then stop it.
3. If a service does not answer within 2 minutes: switch to the local fallback and the fallback APKs.

## 8. Risks
| Risk | Effect | Mitigation |
|---|---|---|
| Cold starts (about one minute) | First click in the demo hangs | Warm-up script and pinger (section 7) |
| Shared 750 Render hours run out | All three services suspended until next month | Do not keep services awake outside tests and the demo; check usage weekly from Phase 3 |
| Supabase project pauses after 7 days idle | Attachments fail | Restore the day before; staging use in Phase 3 to 8 keeps it active |
| Free tier terms change | A host stops being free | Recheck in T115 and T116; the local fallback always works |
| Bandwidth over 5 GB on Render | Services suspended (no card) | Attachments capped at 5 MB; demo traffic is small |
