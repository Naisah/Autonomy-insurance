# 07 Task breakdown for Orca: Autonomy Insurance

Status: Approved v2, Nov 26, 2026, by Atlas for the team lead (docs/decisions.md), patched Nov 26, 2026 for the updated logic (monthly points, four levels, delay-only payouts, assignment and waiting queue, service key, new tasks T014, T015, T026, T027, T049; T104 merged into T103). Turns specs 00 to 06 into small tasks that one agent can finish in one worktree. Agents are assigned by tier only (spec 01); fill the Agent column when quotas are known.

## 1. How tasks work
- One task = one file `specs/tasks/T###-short-name.md` = one branch `agent/T###-short-name` = one Orca worktree = one pull request.
- Size caps by tier (spec 01): T1 up to about 400 changed lines, T2 about 250, T3 about 120. A task over its cap is split before it starts.
- Each task owns a list of paths. The agent edits only those paths and its own tests. Another agent never owns the same path in the same wave.
- A task starts only when everything in its Needs column is merged to `main`.
- Any task that calls or serves an API route also needs T014 (the contract) merged, even where its Needs column does not say so.
- Each task's Done when line is checked by tests where possible. The reviewer (a different agent, then you) re-runs them.

### Task file template
```
# T### Title
Tier: T1 | T2 | T3          Agent: (assigned later)
Stories: A1, ...             Needs: T###, ...
Specs to read: 00, 03 section 4, contract tag auth (only these)
Owns: services/auth/src/modules/login/**, services/auth/test/login/**
Do not touch: anything else, especially openapi.yaml and prisma/schema.prisma
Steps: (3 to 8 short steps)
Done when: (testable checks from the table)
Questions: (agent writes here and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
```

### Conflict-avoidance conventions (set once in scaffolding tasks)
- core-api and auth load routes automatically from `src/modules/*/routes.ts`, so adding a module never edits a shared file.
- web loads features from `src/features/*/route.ts` using a glob, so adding a screen never edits a shared router file.
- Flutter apps register screens in one `routes.dart` owned by the shell task; screen tasks add a file under `lib/features/<name>/` and request the one-line registration in their handoff note, which the shell owner applies at merge (or the human does).
- Shared files with a single owner: `packages/contracts/openapi.yaml` (contract tasks only), each service's `prisma/schema.prisma` (schema tasks only), root `package.json` and workspace files (you).

## 2. Waves and dates
Phases 0 to 8 in docs/implementation-plan.md sections 3 to 5 replace these waves (same tasks; Phase 0 added; estimates move to Phase 4). The wave names below stay only for reference; the phase is the schedule. Deadline Jan 4, 2027 (Q2).

Dates follow the schedule in the constitution (about Jan 4, 2027 deadline, not confirmed).
| Wave | Dates | Goal |
|---|---|---|
| W0 | Nov 24 to Nov 30 | Specs approved, scaffolding, schemas, contract tooling, formula vectors |
| W1 | Dec 1 to Dec 7 | Auth, token verification, access module, chat, estimates, web and mobile shells (Sprint 2 core) |
| W2 | Dec 8 to Dec 14 | AI chatbot, agent dashboards, policies, Rewards app and integration, mobile screens (Sprint 3) |
| W3 | Dec 15 to Dec 21 | Should features: claims, manager and admin, biometrics, reward effects, fixes, UI/UX review |
| W4 | Dec 22 to Jan 4 | Polish, e2e demo script, documentation, final Scrum guide, holiday buffer |

Critical path: T001 -> T014 contract, beside T010/T011 schemas -> T020 auth login -> T026 assignment -> T030 token verify -> T032 access module -> T034 chat sockets -> T037 estimate approve. Start these first; everything else can run in parallel beside them.

If the schedule slips, cut in this order: B5 and forgot-password (already out), claims on mobile, the reward effect text on the status screen, manager reports, then the rest of the Should list.

## 3. Wave 0: foundation (Nov 24 to Nov 30)
| ID | Task | Tier | Owns | Needs | Stories | Done when |
|---|---|---|---|---|---|---|
| T000 | Repo hygiene: protect `main` on GitHub, `.gitignore`, `.env.example` per service, root `docker-compose.yml` (Postgres with three databases), editorconfig, PR template | T3 (you do the GitHub setting) | root config files, `.github/**` | none | all | `docker compose up` starts Postgres with `autonomy_auth`, `autonomy_core`, `autonomy_rewards`; PRs to `main` require approval |
| T001 | Contract tooling: Spectral lint of `openapi.yaml`, scripts to generate TS types and Dart client, Prism mock server config, npm script `contract:check` | T2 | `packages/contracts/**` (not `openapi.yaml` content) | none | all | `npm run contract:check` passes; mock server answers `GET /health` and one auth route |
| T002 | Premium formula test vectors: `packages/contracts/test-vectors/premium.json` with at least 20 cases (edges of age, coverage, term), including coverage 2,000,000 age 30 term 20 = 1818.88; integer-centavo reference function in TS | T2 | `packages/contracts/test-vectors/**`, `packages/contracts/src/premium.ts` | none | C1, C2 | Vitest passes all vectors; rounding rule documented in the file header |
| T003 | Scaffold services/auth: Fastify, Zod, Prisma, Vitest, auto-load routes, `GET /health`, error model, request id | T3 | `services/auth/**` (except `prisma/schema.prisma`) | T000 | A1 | `npm test` passes; `/health` returns ok |
| T004 | Scaffold services/core-api (same pattern, plus Socket.IO plugin placeholder) | T3 | `services/core-api/**` (except schema) | T000 | all | same as T003 |
| T005 | Scaffold services/rewards-api (same pattern) | T3 | `services/rewards-api/**` (except schema) | T000 | G2 | same as T003 |
| T006 | Scaffold apps/web: Vite, React, TypeScript, Tailwind, Vitest, Playwright config, glob-based feature routes | T3 | `apps/web/**` | T000 | all | `npm run dev` shows a placeholder page; test runs |
| T007 | Scaffold apps/mobile (Flutter) and `packages/dart_shared` (empty API client folder, theme, premium function stub) | T3 | `apps/mobile/**`, `packages/dart_shared/**` | T000 | all | `flutter test` runs; app launches on emulator |
| T008 | Scaffold apps/rewards (Flutter) using `packages/dart_shared` | T3 | `apps/rewards/**` | T007 | G1 | `flutter test` runs; app launches |
| T009 | Design tokens: Tailwind theme and Flutter `ThemeData` from `design/README.md` (colors, type, radius, spacing) | T3 | `apps/web/src/theme/**`, `packages/dart_shared/lib/theme/**` | T006, T007 | X5, X7 | Token values match design/README.md; one sample component per platform |
| T010 | Auth Prisma schema and first migration from spec 04 section 2 (users with availability, max_clients, waiting_since; sessions; sso_codes; service_accounts; auth_events) | T1 | `services/auth/prisma/**` | T003 | A1 to A4 | `prisma migrate dev` succeeds; role/parent check exists; availability and max_clients allowed only for agents |
| T011 | Core Prisma schema and first migration from spec 04 section 3 (directory_users, chat, estimates, policies, schedule, claims, reward_results, reward_status_history, reward_effects, settings, user_preferences, notifications; sequences starting 4829 and 1042) | T1 | `services/core-api/prisma/**` | T004 | B to G | migrate succeeds; partial unique index for one Open escalation exists; unique (client, period) on reward_results exists |
| T012 | Rewards Prisma schema and migration from spec 04 section 4 (rewards_users, daily_steps, period_summary, outbox) | T2 | `services/rewards-api/prisma/**` | T005 | G2 to G4 | migrate succeeds; daily_steps unique on (user, day) |
| T013 | Seed scripts: auth seed (1 admin, 2 managers, 3 agents incl. Maya Santos, one Away and one at its client limit, 6 clients incl. Elena Rostova and Leo Mendoza, one waiting for an agent), core seed (estimates, INS-4829, claims in each status, messages, one Open escalation, reward results for all four levels incl. 199/200 and 599/600), rewards seed | T3 | `services/*/prisma/seed.ts`, `docs/seed-readme.md` | T010 to T012 | X6 | reset command rebuilds all three databases; demo logins listed in seed-readme |
| T014 | Write `packages/contracts/openapi.yaml` from spec 05 (all paths, `x-roles`, `x-stories`, `x-priority`, `*Client` and `*Staff` schemas, error codes, Socket.IO events in the description), then generate clients. The file does not exist in the repo yet | T1 | `packages/contracts/openapi.yaml` | T001 | all | `contract:check` passes; every story except A2, A5 and B5 has an operation; lint fails if a `*Staff` schema gains a reward field; mock server answers one route per tag |
| T015 | Reward test vectors: `packages/contracts/test-vectors/rewards.json` (daily points edges 4,999/5,000, 7,999/8,000, 11,999/12,000; level edges 199/200, 399/400, 599/600; extension and delay days; payout example: Platinum approved day 0 is paid day 14) and a TypeScript reference | T2 | `packages/contracts/test-vectors/rewards.json`, `packages/contracts/src/rewards.ts` | none | G2, G3, G5 | Vitest passes all vectors; header documents the status-on-date rule |

## 4. Wave 1: auth, access, chat, estimates (Dec 1 to Dec 7)
### Auth service
| ID | Task | Tier | Owns | Needs | Stories | Done when |
|---|---|---|---|---|---|---|
| T020 | Register and login: argon2id hashing, password rule, generic error, lockout (5 fails in 10 min then 5 min block, 429 with retryAfterSeconds), RS256 access token (15 min) | T1 | `services/auth/src/modules/{register,login}/**`, tests | T010 | A1 | Tests: weak password rejected; wrong credentials give identical message; 6th attempt blocked; token carries `sub`, `role`, `sid`, `aud`; hash only in DB; register calls an assignment hook (stub until T026) and creates the client as waiting when it returns none |
| T021 | Refresh rotation, reuse detection, logout, logout-all, `GET /auth/me`, JWKS endpoint, web cookie vs mobile body | T1 | `services/auth/src/modules/{session,jwks}/**`, tests | T020 | A3 | Tests: old refresh token reuse revokes session; logout-all revokes every session; JWKS verifies a token offline |
| T022 | Accounts: `GET/POST /users`, `PATCH /users/{id}`, change-password, must-change-password flow, role/parent validation | T2 | `services/auth/src/modules/accounts/**`, tests | T021 | A4 | Tests: only Admin may create; Agent needs a manager; deactivated user cannot log in; non-admin gets 403 |
| T023 | Directory outbox: write `auth_events` in the same transaction as user changes; worker posts to core-api with retry; service-client credentials | T1 | `services/auth/src/modules/directory/**`, tests | T022 | A2 | Test: events delivered in order, duplicates ignored by version; failed delivery retried |
| T024a | Service accounts and `POST /service/token` (RS256, 15 minutes, audience and `scope` claim, no refresh) | T1 | `services/auth/src/modules/service-token/**`, tests | T021 | A2, G4 | Tests: valid secret gives a scoped token; wrong secret 401; service token rejected on user routes; only the secret hash is stored |
| T024b | SSO: `/sso/authorize`, `/sso/token` with PKCE, `/internal/users/{id}/reports-to`, child sessions revoked on parent logout | T1 | `services/auth/src/modules/sso/**`, tests | T021, T024a | G1, G4, F2 | Tests: code is single use and expires in 60 s; non-client gets 403; wrong verifier fails; parent logout revokes the Rewards session |
| T025 | Auth acceptance suite for A1 and A3 (HTTP-level tests from the stories) | T2 | `services/auth/test/acceptance/**` | T021 | A1, A3 | Every A1 and A3 acceptance bullet maps to a passing test |
| T026 | Agent assignment and waiting queue: rule in one transaction with the client-count check, `waiting_since`, `client.waiting` and `user.reassigned` events, re-run triggers (agent Available, new or activated agent, limit raised, client reassigned away) | T1 | `services/auth/src/modules/assignment/**`, tests | T022, T023 | A1, A4 | Tests: fewest clients wins, ties by oldest account; Away or full agents skipped; two simultaneous registrations cannot overfill an agent; waiting clients served oldest first when room appears |
| T027 | Availability and limits: `PUT /me/availability`, `maxClients` on `PATCH /users/{id}` (Admin, and Manager for own team), default from the assignment setting | T2 | `services/auth/src/modules/availability/**`, tests | T026 | A4, F1 | Agent can set only own availability; manager cannot change another team's limit; raising a limit assigns waiting clients |

### Core API foundation
| ID | Task | Tier | Owns | Needs | Stories | Done when |
|---|---|---|---|---|---|---|
| T030 | JWT verification plugin (JWKS cache, audience check), error model, request ids, rate limit, CORS | T1 | `services/core-api/src/plugins/auth/**`, tests | T004, T021 | X1, X2 | Expired token 401; wrong audience 401; tokens from rewards audience rejected |
| T031 | Directory projection and `POST /internal/directory-events` | T1 | `services/core-api/src/modules/directory/**`, tests | T011, T023 | A2 | Out-of-order versions ignored; deactivation visible; handles `agent.availability` and `client.waiting` events |
| T032 | Access module `can(user, action, resource)` and the generated authorization matrix test (role x endpoint x own/other from `x-roles`) | T1 | `services/core-api/src/access/**`, `services/core-api/test/matrix/**` | T030, T031 | A2 | Matrix test passes for all current routes; fails if a route has no `x-roles` |
| T033 | Chat REST: conversations list (agent search, unread), message history paging 30, send, read | T2 | `services/core-api/src/modules/chat/**`, tests | T032 | B1 to B3 | Client cannot read another client's thread; reassignment test: new agent sees history, old gets 403; sending for a client with no agent returns NO_AGENT_ASSIGNED |
| T034 | Chat Socket.IO: handshake auth, room join check, persist then emit, ack, dedupe by clientMessageId, `access_revoked` on reassignment | T1 | `services/core-api/src/modules/chat-socket/**`, tests | T033 | B1 | Test: message arrives to other side within 2 seconds; resend after reconnect gives one message; unauthorized join rejected |
| T036 | Estimates: list, create, preview, get, patch, duplicate, send; server formula using T002 vectors; formula version | T2 | `services/core-api/src/modules/estimates/**`, tests | T032, T002 | C1 to C3 | All vectors pass; out-of-range blocked; edit only in Draft or ChangesRequested; send for a waiting client returns NO_AGENT_ASSIGNED, saving still works |
| T037 | Agent estimate review: pending list, approve (single transaction creates policy and full schedule, idempotent), request-changes with note | T1 | `services/core-api/src/modules/estimate-review/**`, tests | T036 | C4 | Test: approving twice returns the same policy; policy only from approved estimate; client sees note |
| T038 | Policies: list, get, schedule with effective due date, demo pay, agent view of client policies (no reward fields) | T2 | `services/core-api/src/modules/policies/**`, tests | T037 | C5 | Schedule count equals term x 12; agent response has no reward fields; effective due date equals due date plus the extension of the status on that date; Overdue only when past and unpaid |
| T039 | Dashboard route for Client and Agent (counts match lists) | T2 | `services/core-api/src/modules/dashboard/**`, tests | T033, T037 | F1 | Agent counts equal list lengths; client dashboard returns agentStatus (Assigned or Waiting) |

### Front-end shells
| ID | Task | Tier | Owns | Needs | Stories | Done when |
|---|---|---|---|---|---|---|
| T060 | Web shell: routing guard by role, generated API client wiring, token refresh and retry, session-expired modal, 403 page, error banner, toast, skeleton components, nav per role | T2 | `apps/web/src/{app,shared}/**` | T006, T009, T001 | A3, X2, X4 | Playwright: 401 triggers refresh once then modal; role cannot open another role's route |
| T061 | Web landing, login, register screens wired to auth | T2 | `apps/web/src/features/{landing,auth}/**` | T060, T020 | A1 | Wrong credentials message; block message with countdown; weak password hint |
| T080 | `dart_shared`: generated API client, models, token storage interface, premium function passing the T002 vectors | T2 | `packages/dart_shared/lib/**` | T007, T001, T002 | C2, X3 | `flutter test` passes all vectors |
| T081 | Mobile shell: secure token storage, refresh and retry, role-based tab bar, session-expired and 403 states | T2 | `apps/mobile/lib/{app,shared}/**` | T007, T009, T080 | A3, X2 | Widget tests for expired session; tabs match role |
| T083 | Mobile sign-in and register screens | T3 | `apps/mobile/lib/features/auth/**` | T081, T020 | A1 | Same checks as T061 |

## 5. Wave 2: AI, dashboards, Rewards, mobile screens (Dec 8 to Dec 14)
### Core API
| ID | Task | Tier | Owns | Needs | Stories | Done when |
|---|---|---|---|---|---|---|
| T042a | Knowledge base content: about 20 FAQ entries from the landing FAQ, human-checked for no legal or financial advice | T3 | `services/core-api/knowledge/**` | none | E1 | Reviewed by a group member; logged in docs/ai-use-log.md |
| T042 | AI chat: `AiProvider` interface, Gemini provider, `FakeAiProvider`, knowledge base loader, system prompt rules, output filter, rate limit 20 per hour, routes | T2 (reviewed by Tier A agent) | `services/core-api/src/modules/ai/**`, tests | T032, T042a | E1 | Fake provider tests: refuses legal and financial advice; labels itself AI; says it does not know and offers agent; AI_UNAVAILABLE returns friendly error; no cross-user access; two consecutive 'I don't know' answers trigger a handoff; clear-my-chat route; keyword fallback when the provider fails |
| T043 | AI handoff: summary message into agent chat, NO_AGENT_ASSIGNED case | T2 | `services/core-api/src/modules/ai-handoff/**`, tests | T042, T033 | E2 | Agent sees only the summary, never the AI transcript; with no agent the summary waits in the conversation and is visible once an agent is assigned |
| T044 | Reward result intake: `POST /api/rewards/results` (service key only), validation, replace on resend, status history, `reward_effects` log | T1 | `services/core-api/src/modules/rewards/**`, tests | T038, T024a, T014 | G4, G5 | 201, 400 (including a status that does not match the points), 401, 403 (any user token), 404; resend replaces and keeps history; service key rejected on client routes; extension follows the status on the due date (+7, +14, +21) |
| T045 | Client reward-effects routes and internal effect read for rewards-api | T2 | `services/core-api/src/modules/reward-effects/**`, tests | T044 | G5 | Client sees own effects only; agent token gets 403 |
| T046 | Preferences routes (`/me/preferences`) | T3 | `services/core-api/src/modules/preferences/**`, tests | T032 | A3 | Round trip works; other user's preferences unreachable |
| T049 | Notifications: handle `client.waiting` by creating NoAgentAvailable notices for the Admin and every Manager; `GET /notifications`, `POST /notifications/{id}/read` | T2 | `services/core-api/src/modules/notifications/**`, tests | T031, T032 | A4, F2, F3 | Admin and each Manager get one notice per waiting client; other roles get 403; notice text has no chat content |

### Rewards service
| ID | Task | Tier | Owns | Needs | Stories | Done when |
|---|---|---|---|---|---|---|
| T050 | rewards-api token verification (audience rewards-api, client role only) | T2 | `services/rewards-api/src/plugins/auth/**`, tests | T005, T024b | G1 | Main-app token rejected; non-client rejected |
| T051 | Steps routes: today, record steps, sample steps (demo), locked-day rule (409), daily points from the rules | T2 | `services/rewards-api/src/modules/steps/**`, tests | T050, T012, T015 | G2 | Update after midnight rejected; points match the T015 vectors; no goal or milestone routes |
| T052 | Monthly summary and level: sum of daily points, level thresholds, points to next level, day-close job, demo close-period | T2 | `services/rewards-api/src/modules/summary/**`, tests | T051, T015 | G3 | Table-driven tests at 199/200, 399/400, 599/600; points reset each month |
| T053 | Outbox and delivery worker: service key, `POST /api/rewards/results`, retry with backoff, sync status, `/rewards/effect` | T1 | `services/rewards-api/src/modules/outbox/**`, tests | T052, T044 | G4, G5 | Delivery survives core-api downtime; 4xx is not retried; resend replaces; sync state changes Pending to Synced |

### Web screens
| ID | Task | Tier | Owns | Needs | Stories | Done when |
|---|---|---|---|---|---|---|
| T062 | Web client dashboard | T2 | `apps/web/src/features/client-dashboard/**` | T060, T039 | F4 | Empty states for no policy and no estimates; waiting banner when the client has no agent |
| T063 | Web client chat with Socket.IO (agent tab), history paging, reconnect banner, unread | T2 | `apps/web/src/features/client-chat/**` | T060, T034 | B1, B3 | Playwright: two browsers exchange messages live; reconnect resends once; with no agent the agent tab is disabled with "You're waiting for an agent" while the AI tab keeps working |
| T064 | Web chat AI tab and handoff | T2 | `apps/web/src/features/client-ai/**` | T063, T043 | E1, E2 | AI label visible; unavailable state keeps agent button |
| T065 | Web client estimate (live premium from shared formula, breakdown, past estimates, send) with D1 discount removed | T2 | `apps/web/src/features/client-estimate/**` | T060, T036, T002 | C1 to C4 | Shows no discount; matches server preview for all vectors; Send to agent disabled while waiting |
| T066 | Web client policy and schedule | T2 | `apps/web/src/features/client-policy/**` | T060, T038 | C5 | Extension card only when `rewardNote` present; Overdue chip once the extended date has passed |
| T068 | Web agent dashboard part 1: client list, chat panel, unread, search, Available/Away toggle | T2 | `apps/web/src/features/agent-clients/**` | T060, T034, T027 | B2, F1 | Only assigned clients; counts match; Available/Away toggle |
| T069 | Web agent dashboard part 2: pending estimates, approve, request changes, escalate action | T2 | `apps/web/src/features/agent-estimates/**` | T068, T037 | C4 | Request changes blocks without a note; approve shows policy number |

### Mobile and Rewards screens
| ID | Task | Tier | Owns | Needs | Stories | Done when |
|---|---|---|---|---|---|---|
| T084 | Mobile client dashboard | T3 | `apps/mobile/lib/features/dashboard/**` | T081, T039 | F4 | Same as T062; waiting banner |
| T085a | Mobile client chat, agent tab | T2 | `apps/mobile/lib/features/chat/**` | T081, T034 | B1 | Reconnect and queue test; waiting state disables the agent tab |
| T085b | Mobile AI tab and handoff | T2 | `apps/mobile/lib/features/ai-chat/**` | T085a, T043 | E1, E2 | Waiting client can still use the AI tab; handoff works |
| T086 | Mobile estimate | T2 | `apps/mobile/lib/features/estimate/**` | T081, T036, T080 | C1 to C4 | Same vectors pass on device; Send to agent disabled while waiting |
| T087 | Mobile policy | T3 | `apps/mobile/lib/features/policy/**` | T081, T038 | C5 | Schedule list with chips |
| T090a | Mobile agent home and chat, Available/Away toggle | T2 | `apps/mobile/lib/features/agent/**` | T081, T034, T027 | B2, F1 | No reward element anywhere; Available/Away toggle works |
| T090b | Mobile agent review estimate | T2 | `apps/mobile/lib/features/agent-estimates/**` | T090a, T037 | C4 | Same checks as T069; no reward element |
| T091 | Main mobile app SSO authorizer: deep link handler, confirm screen "Open Rewards as [name]", `/sso/authorize` call | T1 | `apps/mobile/lib/features/sso/**` | T081, T024b | G1 | Never sends or reads a password; non-client path unreachable |
| T100 | Rewards shell and SSO sign-in: PKCE verifier, deep link callback, token exchange, email and password fallback, logout detection on resume | T1 | `apps/rewards/lib/{app,features/auth}/**` | T008, T024b, T091 | G1 | Parent logout makes next resume return to sign-in; non-client sees client-only screen |
| T102 | Rewards home: steps, sample data mode, weekly bars, points today, month points, level | T2 | `apps/rewards/lib/features/home/**` | T100, T051 | G2, G3 | Sample mode works offline; locked day message; no custom goal |
| T103 | Rewards status screen: level, month points, points to next level, plain-words effect, sync chip | T2 | `apps/rewards/lib/features/status/**` | T100, T052, T053 | G3, G4, G5 | Sync chip reflects Pending, Synced, Failed; effect text matches the level; empty state shows Bronze |

## 6. Wave 3: Should features and hardening (Dec 15 to Dec 21)
| ID | Task | Tier | Owns | Needs | Stories | Done when |
|---|---|---|---|---|---|---|
| T035 | Escalation and reassign routes (manager can read only Open escalation threads; reassign within team via auth internal call) | T2 | `services/core-api/src/modules/escalation/**`, tests | T034, T024 | B4, F2 | Manager cannot read non-escalated chats; reassign outside team 403 |
| T040 | Claims client routes: create, edit, documents, submit (idempotent), reply, list with counts, get with timeline | T2 | `services/core-api/src/modules/claims/**`, tests | T038 | D1, D2 | Event date not future; amount not above coverage; other client's claim 404 |
| T041 | Claims agent routes and decision: list, get, decision actions, note rules, events; on approval payout date = approval date + standardProcessingDays + delay for the status on the approval date | T1 | `services/core-api/src/modules/claims-review/**`, tests | T040, T044 | D3, G5 | Agent response has no reward field or payout date (lint); Platinum approved day 0 gives payout day 14; status on the approval date is used; rewards never change approval or amount |
| T047 | Dashboards for Manager and Admin plus manager team route (counts only) | T2 | `services/core-api/src/modules/dashboard-staff/**`, tests | T039, T035 | F2, F3 | Admin code does not import chat tables (lint rule) |
| T048 | Admin settings routes: estimate-rate (new version), reward-rules (point bands, thresholds, extension and delay days, `applyEffects`), claims-processing (standard days), assignment (default max clients) | T2 | `services/core-api/src/modules/settings/**`, tests | T036, T044 | F3 | Rate change applies only to new estimates; non-admin gets 403; invalid thresholds rejected |
| T067 | Web client profile and security | T3 | `apps/web/src/features/client-profile/**` | T060, T046 | A3 | Toast on save; logout-all works |
| T070 | Web client claims: list, file claim stepper, details with timeline | T2 | `apps/web/src/features/client-claims/**` | T060, T040 | D1, D2 | Needs-info reply works; reward note only when present |
| T071 | Web agent claims review | T2 | `apps/web/src/features/agent-claims/**` | T060, T041 | D3 | Note required for request info and reject |
| T072 | Web manager dashboard and escalations (drawer, reassign confirm) | T2 | `apps/web/src/features/manager/**` | T060, T035, T047 | F2, B4 | Banner shown; thread visible only for Open; notification bell and waiting-clients count |
| T073 | Web admin console and accounts | T2 | `apps/web/src/features/admin/**` | T060, T022, T048 | A4, F3 | Temp password shown once; no chat content on any admin page; policy settings forms (rate, reward rules, processing days, default max clients), notification bell, demo "Close period now" labeled |
| T074 | Web states sheet components finalized and used everywhere | T3 | `apps/web/src/shared/states/**` | T060 | X2, X4 | Each state reachable in a Playwright test |
| T082 | Mobile biometric unlock via `local_auth` with password fallback | T2 | `apps/mobile/lib/features/biometric/**` | T081 | A5 | Expired session requires password; nothing biometric sent |
| T088 | Mobile claims: list, file, details | T2 | `apps/mobile/lib/features/claims/**` | T081, T040 | D1, D2 | Same checks as T070 |
| T089 | Mobile profile with biometric toggle and Rewards link | T3 | `apps/mobile/lib/features/profile/**` | T081, T082, T046 | A3, A5 | Toggle stored on device only |
| T120 | Security review: authorization matrix, reward-leak lint on `*Staff` schemas, admin chat-table lint, SSO tests, log scan for message text and tokens | T1 (reviewer) | `docs/security-review.md`, lint config | T041, T047, T100 | A2, G4, X1 | Written report with every finding fixed or accepted; service key rejected on client routes and a client token rejected on `POST /api/rewards/results`; payout date absent from every staff response |

## 7. Wave 4: polish and delivery (Dec 22 to Jan 4)
| ID | Task | Tier | Owns | Needs | Stories | Done when |
|---|---|---|---|---|---|---|
| T110 | Playwright smoke suite for each role | T2 | `apps/web/e2e/**` | T073 | all Must | Login, chat, estimate to policy, claim, admin create account all pass |
| T111 | Demo script and reset: `docs/demo-script.md`, one command resets and seeds all databases | T3 | `docs/demo-script.md`, root `scripts/**` | T013, T110 | X6 | A teammate runs the demo from scratch in under 20 minutes |
| T112 | UI/UX review pass: touch targets, contrast, focus, thumb zone, feedback checklist on all screens | T2 | `docs/ux-review.md`, small CSS and widget fixes in a branch per screen group | T074 | X5 | Checklist complete; defects fixed or logged |
| T113 | Course documentation: architecture summary, API list, how to run, AI use disclosure compiled from `docs/ai-use-log.md` | T3 | `docs/**` (not specs) | T120 | X8 | Matches the guide's documentation list |
| T114 | Final Scrum guide updates (sprint records, retrospective notes, burndown) | T3 | `docs/sprints/**` | all | guide | Matches what was actually delivered |

## 8. Parallelism plan
- W0 can run up to about 10 tasks at once because they own different folders; limit yourself to what your quotas allow. Do T010 and T011 on Antigravity first, since all other service tasks depend on them.
- W1: auth tasks T020 to T027 are mostly sequential; run T030 to T039 in parallel as soon as T021 is merged (they need JWKS, not the rest of auth). Web shell T060 and mobile shell T081 run beside the backend using the Prism mock from T001.
- W2: three independent lanes: core (T042 to T046, T049), rewards (T050 to T053), clients (T062 to T066, T084 to T090). T091 and T100 are linked; the same T1 agent should do both, or give both agents the SSO section of spec 03.

## 9. Counts
- 84 tasks total: 19 T1, 46 T2, 19 T3 (T120 counts as T1 for review work).
- Antigravity Pro workload: all 19 T1 tasks, which fits the reserve rule only if Tier B agents review and fix small things, not Antigravity.
- If quota is short, move the lowest-risk T1 tasks (T031, T091) to a Tier B agent with Antigravity as reviewer.

## 10. Decisions needing approval
All decided on Nov 26, 2026 by Atlas for the team lead; the answers are in docs/decisions.md.
- K1 Task sizes and tier caps as listed.
- K2 The glob-based route loading conventions so parallel agents never edit the same router file.
- K3 T042 (AI chat) is T2 with a Tier A review rather than T1.
- K4 Claims on mobile (T088) and the effect text on the Rewards status screen (T103) are first to be dropped if time runs out.
- K6 T014 finishes openapi.yaml starting from the draft in packages/contracts (Q8). It runs first in Phase 1 on Atlas.
- K7 Assignment and the waiting queue live in auth (T026, T027) because auth is the single writer of reports_to.
- K8 The Rewards app has four screens (sign-in, client-only, home, status); T104 is merged into T103.
- K5 You do the GitHub branch protection in T000 yourself.
