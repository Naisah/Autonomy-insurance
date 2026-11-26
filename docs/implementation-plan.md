# Implementation plan: Autonomy Insurance (spec-driven, for Orca)

Status: Draft for team approval, Nov 26, 2026. Team answers recorded in section 11 (Q1 to Q4, Q6). Builds on docs/build-phases.md and specs 00 to 07. It does not replace any spec. Where it changes a spec (task split, phase order), section 9 lists the edit to make in that spec.

## 1. What this plan is for
The web app, the main mobile app and the Rewards app are built as one system by coding agents in Orca (spec 01), one small task at a time. This plan says:
- the order of work (phases 0 to 8), and what each phase must prove before the next starts;
- which spec drives each task, and which contract or interface must exist before the task starts;
- which tasks can run at the same time in different Orca worktrees;
- what planning is still missing (section 10) and the questions the team must answer (section 11).

## 2. The spec-driven workflow
Every change follows the same chain. Nothing is coded that is not written down first.

```
Approved spec (02 to 06)  ->  contract (openapi.yaml, Prisma schema, test vectors)
  ->  task file (specs/tasks/T###-name.md)  ->  agent branch and worktree
  ->  tests from the task's "Done when"  ->  agent review  ->  human review  ->  merge to main
```

Rules (from the constitution and spec 01, collected here):
1. **Specs first.** Agents build only from Approved specs (specs/README.md). If a spec is silent, the agent stops and writes the question in the task file. The team lead answers in the spec, not in a chat.
2. **Contract first.** API shapes live only in `packages/contracts/openapi.yaml`; database shapes only in each service's `prisma/schema.prisma`; business numbers only in `packages/contracts/test-vectors/`. A task that needs a new field waits for a contract task.
3. **One task, one owner.** One task file, one branch `agent/T###-name`, one Orca worktree, one pull request. The task lists the paths it owns; touching anything else fails the task.
4. **Mocks unblock the front ends.** Web and mobile tasks code against the generated client and the Prism mock server, so they never wait for the backend route.
5. **Tests are the acceptance criteria.** Every "Done when" line becomes a test where it can. The reviewer re-runs them.
6. **Gates.** A task starts only when its Needs are merged. A phase ends only when its exit demo passes on a fresh `main`.

### Definition of Ready (a task can be given to an agent when)
- The specs it names are Approved, and its contract operations, schema tables and vectors are merged.
- Its task file exists with Owns, Do not touch, Steps, Done when, and an assigned agent with quota left.

### Definition of Done (spec 00 section 7, plus)
- Done when checks pass in CI; lint and type checks pass; no secrets; file boundary respected.
- Reviewed by a different agent, then by a group member (spec 01 R7).
- Logged in docs/agent-log.md and docs/ai-use-log.md.

## 3. Phase 0: finish planning (Nov 26 to Nov 28)
No app code. This phase turns the specs into something Orca can run safely.

| ID | Task | Owner | Output | Done when |
|---|---|---|---|---|
| P0.1 | Approve the specs: walk through the open decision IDs (section 10.1) and mark each spec Approved | Team lead | specs 00 to 07 status lines | Every spec says Approved, or lists what still blocks it |
| P0.2 | Decisions log: one table of every decision ID (C1 to C8, A1 to A9, M1 to M8, S1 to S7, K1 to K8, R1 to R7, D1 to D7) with status | Claude or Kiro | docs/decisions.md | No decision is marked "needs approval" without an owner |
| P0.3 | Test strategy (section 7 of this plan, expanded) | Claude | docs/test-strategy.md | Each test type has a tool, an owner task and a CI job |
| P0.4 | Environment setup guide and check script (section 8) | Claude | docs/dev-setup.md, scripts/doctor | Every group member runs the check script green |
| P0.5 | Write the task files for Phases 1 and 2 from spec 07 and this plan | Claude or Antigravity | specs/tasks/T0**.md | Each file fills every template field |
| P0.6 | Protect `main`, enable PRs only, add CI skeleton (lint and test jobs) | You (GitHub settings), agent (workflow file) | .github/workflows/ci.yml | A test PR shows the CI checks and needs approval |
| P0.7 | Orca trial (spec 01 section 8): three free agents do T002 | You in Orca | docs/agent-log.md rows | Tiers and specialties updated from the result |
| P0.8 | Fill the quota column in spec 01 | You | spec 01 | Every agent has a quota or "Out" |

Exit gate: specs Approved, Phase 1 and 2 task files exist, CI runs on PRs, `main` is protected.

## 4. Phases 1 to 8 at a glance
| Phase | Goal | Driving specs | Interfaces that must land first | Exit demo |
|---|---|---|---|---|
| 1 Foundation | Repo, DB, contract, scaffolds | 00, 03 s2-3 and s12, 04, 05 | T014 contract, T010 to T012 schemas, T002 and T015 vectors | `docker compose up`, migrate and seed; three `/health`; mock server; web and Flutter placeholders in Stitch colours |
| 2 Accounts | Register, login, roles, assignment | 02 A1 to A4, 03 s4 to s5.1, 04 s2 | auth routes in contract; JWKS; access module | Register on web and mobile; agent assigned or waiting; role guards and 403 page |
| 3 Chat | Live client and agent chat, dashboards | 02 B1 to B3, F1, F4; 03 s7; 06 | Socket.IO events (contract header); `/dashboard` shapes | Message web to mobile in under 2 s; waiting banner; dashboards |
| 4 Estimates | Estimate, approve, policy, schedule | 02 C1 to C5; 04 estimates, policies | premium vectors in TS and Dart | Premium matches vectors everywhere; approve twice = one policy |
| 5 AI | Chatbot and handoff | 02 E1, E2; 03 s10 | `AiProvider` interface; knowledge base files | Answer from FAQ; refusal; handoff summary in agent chat |
| 6 Rewards | SSO, steps, points, effects | 02 G1 to G5; 03 s9; 04 s4 | SSO and service-key routes; reward vectors; `POST /api/rewards/results` | SSO from main app; level from points; due date +7/14/21, payout +3/5/7 |
| 7 Should set | Claims, manager, admin, biometrics | 02 A5, B4, D1 to D3, F2, F3 | claim decision op; settings ops; notifications | Claim end to end; escalation and reassign; admin settings; biometric unlock |
| 8 Hardening | Security, smoke tests, demo | 00 s7, 03 s13 | none new | Security checks pass; one-command demo reset; smoke test per role |

## 5. Tasks per phase
Columns: Tier (spec 01), Lane (for parallel work, section 6), Needs (must be merged first), Key checks (the "Done when" in short; the full list is in spec 07 and goes into the task file).

### Phase 1: Foundation (Nov 28 to Dec 1)
| Task | What | Tier | Lane | Needs | Key checks |
|---|---|---|---|---|---|
| T000 | Workspaces, docker-compose (3 DBs), editorconfig, PR template, `.env.example` | T3 | Infra | none | `docker compose up` gives 3 databases |
| T001 | Contract tooling: Spectral rules (x-roles, x-stories, x-priority on every op; no reward field in `*Staff`), TS type generation, Prism mock, Dart client generation | T2 | Contract | T000 | `npm run contract:check` passes; mock answers one route per tag |
| T014 | `openapi.yaml` from spec 05 section 8 | T1 | Contract | T001 | Lint passes; every story except A2, A5, B5 has an operation |
| T002 | Premium vectors + TS reference | T2 | Rules | none | 20+ vectors incl. 1818.88; Vitest green |
| T015 | Reward vectors + TS reference | T2 | Rules | none | Edges 4,999/5,000, 199/200, 599/600; Platinum day 0 -> day 14 |
| T003 to T005 | Service scaffolds (Fastify, Zod, Prisma, Vitest, `/health`, error model, request id, module auto-load) | T3 | Services | T000 | `npm test` and `/health` per service |
| T010 to T012 | Prisma schemas and first migrations (auth, core, rewards) | T1, T1, T2 | Data | T003 to T005 | Constraints from spec 04 section 5 exist |
| T013 | Seed scripts and docs/seed-readme.md | T3 | Data | T010 to T012 | One reset command rebuilds all 3 DBs with every role and state |
| T006, T009 | Web scaffold + design tokens | T3 | Web | T000 | Placeholder page in Stitch tokens |
| T007, T008 | Flutter mobile and Rewards scaffolds + `dart_shared` + tokens | T3 | Mobile | T000 | `flutter test` green; apps launch on the Android emulator |

### Phase 2: Accounts and sign-in (Dec 1 to Dec 4)
| Task | What | Tier | Lane | Needs | Key checks |
|---|---|---|---|---|---|
| T020 | Register and login, lockout, RS256 tokens | T1 | Auth | T010, T014 | Generic error; 6th attempt 429; hash only in DB |
| T021 | Refresh rotation, logout, logout-all, `/auth/me`, JWKS | T1 | Auth | T020 | Reuse revokes session; JWKS verifies offline |
| T024a | **New split:** service accounts and `POST /service/token` (needed by T023 and later by rewards) | T1 | Auth | T021 | Service token cannot call user routes |
| T022 | Staff accounts, roles, must-change-password | T2 | Auth | T021 | Only Admin creates; Agent needs a Manager |
| T023 | Directory outbox to core-api | T1 | Auth | T022, T024a | Ordered delivery, versions, retry |
| T026 | Assignment and waiting queue | T1 | Auth | T022, T023 | Fewest clients wins; no overfill under concurrency |
| T027 | Availability and limits | T2 | Auth | T026 | Raising a limit assigns waiting clients |
| T025 | Auth acceptance suite (A1, A3) | T2 | Auth QA | T021 | Every A1 and A3 bullet is a test |
| T030 | Core JWT plugin (JWKS, audience, rate limit, CORS) | T1 | Core | T021 | Wrong audience 401; service key rejected on user routes |
| T031 | Directory projection + `/internal/directory-events` | T1 | Core | T011, T023 | Out-of-order versions ignored |
| T032 | Access module + generated authorization matrix test | T1 | Core | T030, T031 | Fails if a route lacks `x-roles` |
| T060 | Web shell: role guard, refresh and retry, states (403, expired), toasts | T2 | Web | T006, T009, T001 | Playwright: 401 refreshes once then shows modal |
| T061 | Web landing, login, register | T2 | Web | T060 | Lockout countdown; weak password hint |
| T080 | `dart_shared`: generated client, models, token storage, Dart premium passing T002 vectors | T2 | Mobile | T007, T001, T002 | Dart vectors green |
| T081 | Mobile shell: secure storage, refresh, role tabs, states | T2 | Mobile | T080 | Widget tests for expired session and role tabs |
| T083 | Mobile sign-in and register | T3 | Mobile | T081 | Same checks as T061 |

After the Phase 2 exit demo: T115 staging deploy on the free hosts (docs/deployment-plan.md).

### Phase 3: Chat and dashboards (Dec 4 to Dec 7)
| Task | What | Tier | Lane | Needs | Key checks |
|---|---|---|---|---|---|
| T033 | Chat REST (list, history 30, send, read) | T2 | Core | T032 | Reassignment: new agent sees history, old gets 403; NO_AGENT_ASSIGNED |
| T034 | Chat Socket.IO (auth, rooms, persist then emit, ack, dedupe, access_revoked) | T1 | Core | T033 | Under 2 s; one message after resend |
| T039 | `/dashboard` for Client and Agent | T2 | Core | T033 | Counts equal list lengths; `agentStatus` |
| T062 | Web client dashboard (with waiting banner) | T2 | Web | T060, T039 | Banner when Waiting |
| T063 | Web client chat, agent tab, reconnect, paging | T2 | Web | T060, T034 | Reconnect banner; history paging |
| T068 | Web agent desk part 1 (clients, chat panel, unread, search, Available/Away toggle) | T2 | Web | T060, T034, T027 | Unread clears on open |
| T084 | Mobile client dashboard | T2 | Mobile | T081, T039 | Banner when Waiting |
| T085a | Mobile client chat, agent tab | T2 | Mobile | T081, T034 | Same as T063 on mobile |
| T090a | Mobile agent home and chat (with Available/Away toggle) | T2 | Mobile | T081, T034, T027 | No reward element on any agent screen |
| T033b | Chat attachments API (B5): FileStore, upload, content route | T1 | Core | T033, T034, T011, T014 | Spoofed type and 5 MB + 1 rejected; access as chat |
| T063b | Web chat attachments | T2 | Web | T063, T068, T033b | Reason shown on reject; disabled while waiting |
| T085c | Mobile chat attachments | T2 | Mobile | T085a, T090a, T033b | Same as T063b |

### Phase 4: Estimates and policies (Dec 8 to Dec 10)
| Task | What | Tier | Lane | Needs | Key checks |
|---|---|---|---|---|---|
| T036 | Estimates CRUD, preview, send, formula versions | T2 | Core | T032, T002 | All vectors; edit only in Draft or ChangesRequested |
| T037 | Approve (policy + full schedule, idempotent), request changes | T1 | Core | T036 | Approve twice = same policy |
| T038 | Policies, schedule with effective due date, demo pay, agent view | T2 | Core | T037, T015 | Term x 12 items; agent DTO has no reward fields |
| T065, T066 | Web estimate (no discount line) and policy | T2 | Web | T036, T038 | Live premium = server preview |
| T069 | Web agent desk part 2 (pending estimates, approve, changes, escalate button) | T2 | Web | T068, T037 | Note required for changes |
| T086, T087 | Mobile estimate and policy | T2 | Mobile | T080, T036, T038 | Dart premium = server |
| T090b | Mobile agent review estimate | T2 | Mobile | T090a, T037 | Same as T069 |

### Phase 5: AI chatbot (Dec 10 to Dec 12)
| Task | What | Tier | Lane | Needs | Key checks |
|---|---|---|---|---|---|
| T042a | **New split:** knowledge base content (about 20 FAQ entries), human-checked for no legal or financial advice | T3 | Content | none | Reviewed by a group member; logged in ai-use-log |
| T042 | `AiProvider`, Gemini provider, fake provider, filter, rate limit, routes | T2 (Tier A review) | Core | T032, T042a | Tests use the fake provider only |
| T043 | Handoff summary into agent chat | T2 | Core | T042, T033 | Agent sees summary only |
| T064, T085b | Web and mobile AI tab and handoff | T2 | Web, Mobile | T063 or T085a, T043 | Waiting client can still use the AI tab |

### Phase 6: Rewards app (Dec 12 to Dec 16)
| Task | What | Tier | Lane | Needs | Key checks |
|---|---|---|---|---|---|
| T024b | SSO authorize and token (PKCE), child sessions | T1 | Auth | T021 | Code single use, 60 s; non-client 403 |
| T044 | `POST /api/rewards/results`, status history, effects log | T1 | Core | T038, T024a | 201/400/401/403/404 as specified; resend replaces |
| T045 | `/me/reward-effects` and internal effect read | T2 | Core | T044 | Client only |
| T050 | rewards-api token verification | T1 | Rewards | T005, T024b | Audience rewards-api, Client only |
| T051, T052 | Steps, daily points, monthly summary and level, demo actions | T2 | Rewards | T050, T012, T015 | Vectors green; locked day 409 |
| T053 | Outbox delivery with service key, sync status, `/rewards/effect` | T1 | Rewards | T052, T044 | Retry on 5xx only |
| T091 | Main app SSO authorizer (deep link, confirm screen) | T1 | Mobile | T081, T024b | Non-client sees client-only screen |
| T100 | Rewards shell and SSO sign-in, fallback login | T1 | Rewards app | T008, T024b, T091 | Parent logout ends the Rewards session |
| T102, T103 | Rewards home and status screens (no Stitch design for status; build from spec 06) | T2 | Rewards app | T100, T051 to T053 | "Simulated for this course demo" shown |

### Phase 7: Claims, manager, admin, biometrics (Dec 16 to Dec 22)
Core lane: T035 (escalations, reassign), T040, T041 (claims; payout date client-only), T046 (preferences), T047 (manager and admin dashboards), T048 (settings), T049 (notifications).
Web lane: T067 (profile), T070 (claims), T071 (agent claims review), T072 (manager, with bell, waiting count, availability and limits), T073 (admin console with "Apply reward effects" and policy settings), T074 (states sheet everywhere).
Mobile lane: T082 (biometric unlock), T088 (claims), T089 (profile with Rewards link).
Exit demo: claim filed on mobile, decided on web, payout date visible only to the client; escalation, manager join and reassign; admin changes a rule and a new estimate uses formula v2.

### Phase 8: Hardening and demo (Dec 22 to Jan 4)
T120 (security review, Antigravity), T110 (Playwright smoke per role), T111 (demo script and one-command reset), T112 (UI/UX pass), T116 (demo deploy on the free hosts, local fallback), T117 (signed APKs). Course documentation tasks T113 and T114 follow, outside the build.

## 6. Parallel lanes and the critical path
Run one agent per lane at a time; lanes never own the same paths.

| Lane | Owns | Typical agents (spec 01) |
|---|---|---|
| Contract | packages/contracts/** | Antigravity (T1) |
| Auth | services/auth/** | Antigravity, Claude |
| Core | services/core-api/** (one module folder per task) | Claude, Codex |
| Rewards | services/rewards-api/** | Codex, Claude |
| Web | apps/web/src/features/<task>/** | Cursor, Gemini, Cline |
| Mobile | apps/mobile/lib/features/<task>/**, packages/dart_shared/** | Gemini, Copilot |
| Rewards app | apps/rewards/** | Gemini, Amp |
| Data and content | prisma/seed.ts, knowledge/** | OpenCode, Kiro |

Critical path (start first, never let it wait): T000 -> T001 -> T014 -> T010/T011 -> T020 -> T021 -> T024a -> T023 -> T026 -> T030 -> T032 -> T033 -> T034 -> T036 -> T037. Front-end lanes run beside it on the mock server.

Maximum useful parallelism: about 5 agents at once (Contract or Auth, Core, Web, Mobile, plus one light task). More than that creates merge conflicts and review backlog for the humans.

## 7. Test strategy (summary; P0.3 writes the full doc)
| Level | Tool | Where | Runs in CI |
|---|---|---|---|
| Business rules | Vitest and flutter_test on the shared vectors | packages/contracts, packages/dart_shared | Yes |
| Unit and route | Vitest + Fastify inject | each service | Yes |
| Database integration | Vitest against a real Postgres (CI service container) | each service | Yes |
| Contract | Responses validated against openapi.yaml | each service | Yes |
| Authorization matrix | Generated from `x-roles` (role x endpoint x own/other) | core-api, auth | Yes |
| Security lints | No reward fields in `*Staff`; admin modules never import chat tables | contracts, core-api | Yes |
| Web end to end | Playwright per role | apps/web | Yes (Phase 8 smoke) |
| Mobile | Widget tests; integration_test on the Android emulator by hand | apps/mobile, apps/rewards | Widget tests yes |

## 8. Environment and tooling
Each group member's laptop needs: Git, Node 22, Docker Desktop, Flutter SDK with Android Studio and one Android emulator, and Java 17 if the Dart client is generated with openapi-generator. The demo is Android only (Q3 answered), so no Mac is needed.
Local run: `docker compose up -d`, `npm run db:reset`, then `npm run dev:auth`, `dev:core`, `dev:rewards`, `dev:web`, and `flutter run` in each Flutter app. The Android emulator reaches the laptop at `10.0.2.2`, so the mobile apps need that base URL in debug builds.
Secrets: `.env` per service from `.env.example`; the Gemini key stays in the owner's `.env` only. Tests never need it.

## 9. Changes this plan makes to existing specs
- Spec 07 section 2: replace waves W0 to W4 with phases 0 to 8 (same tasks, Phase 0 added; estimates moved from W1 to Phase 4).
- Spec 07: split T024 into T024a (service tokens, Phase 2) and T024b (SSO, Phase 6), because the directory outbox (T023) needs service tokens long before SSO.
- Spec 07: split T042 into T042a (knowledge base content) and T042, and T085 and T090 into a/b parts per phase.
- Spec 07: add the Available/Away toggle to T068 and T090a (it was only implied by spec 06).

## 10. What planning still needs
### 10.1 Blocking (must be done in Phase 0)
1. **No spec is Approved.** specs/README says agents build only from Approved specs. About 50 decision IDs are open across specs 01 to 07 (C, A, M, S, K, R series). P0.1 and P0.2.
2. **Task files do not exist.** specs/tasks has only the template; Orca needs one file per task. P0.5.
3. **No CI and `main` is not protected.** Agents run with permission prompts skipped (spec 01 section 4). P0.6.
4. **Time zone (answered: Asia/Manila).** Business dates (a step day closing at midnight, due dates, Overdue, approval dates) use Asia/Manila; timestamps are stored in UTC. Specs 03 and 04 and the reward vectors must say so.
5. **Service tokens are scheduled too late** (T024 in Phase 6, needed in Phase 2). Fixed by the T024a split above once approved.
6. **openapi.yaml is a draft.** The Nov 26 draft is in packages/contracts (0 lint errors, types generate); T014 reviews and finishes it.

### 10.2 Needed before the phase that uses it
7. Test strategy doc and the contract-test harness (no task owns "validate responses against openapi.yaml" yet). Add to T003 to T005 or a new T016.
8. Environment setup doc and a check script (P0.4).
9. Dart client generation choice: openapi-generator (needs Java) or a pure-Dart generator (Q7).
10. Rewards status screen has no Stitch design; the waiting banner, Available/Away toggle and notification bell are not in the Stitch screens either. Agents build them from spec 06 and the design system (decide if that is acceptable, Q5).
11. SSO fallback: spec 03 mentions a hosted auth page in the system browser if deep links fail on the emulator, but no task builds it. Add to T100 or drop the fallback (Q9).
12. Step data on the emulator: emulators have no step sensor, so the demo relies on "Use sample data". Confirm a real phone is not required (Q10).
13. Shared server code: the three services each need the same error model, JWT verification and request-id code. Decide between copying it per service (simple, matches file boundaries) or a small `packages/server-common` (one owner) (Q11).
14. Demo admin "Close period now": spec 03 says Admin can trigger it, but the contract has it only for the Client in the Rewards app. Decide whether the admin console needs it (Q12).

### 10.3 Nice to have
15. A decisions log (P0.2) so agents read one table instead of seven specs.
16. A glossary, risk register and out-of-scope list are course deliverables; the risk register also helps planning (deadline, quota, emulator).

## 11. Questions for the team
Answered on Nov 26, 2026:
- **Q1 Stack: answered.** Flutter for both mobile apps. Web stays React + Vite + Tailwind and the services stay as in spec 00 section 4 (no change requested).
- **Q2 Deadline: answered.** Jan 4, 2027, and the team wants to finish earlier. Phase dates are targets; any phase can start as soon as the previous exit demo passes.
- **Q3 Platforms: answered.** Android only for the demo. iOS is out of scope.
- **Q4 Team split: answered.** Reviewers are picked at random per pull request; there are no fixed lanes for humans.
- **Q6 Time zone: answered.** Asia/Manila for business dates, UTC for stored timestamps.
- **Q8 Contract draft: answered.** T014 starts from the draft in packages/contracts/openapi.yaml (see its README).
- **Bots: answered.** Orca bots, roles, models and automations are in docs/orca-bots.md.

Answered on Nov 26, 2026 by Atlas for the team lead (docs/decisions.md):
- **Q5 Designs: answered.** Build the missing states (waiting banner, availability toggle, bell, Rewards status) from spec 06 and the design system; no new Stitch exports.
- **Q7 Dart client: answered.** Pure-Dart `swagger_parser`, run inside packages/dart_shared (T080). No Java needed.
- **Q9 SSO fallback: answered.** No system-browser page. Deep links, with email and password login in the Rewards app as the fallback.
- **Q10 Steps: answered.** Sample step data is enough for the demo; no real phone required.
- **Q11 Shared server code: answered.** Copy per service; no shared package.
- **Q12 Admin close period: answered.** Keep it in the admin console (spec 02 F3); core-api calls rewards-api with a service token scoped `rewards:close-period`.
- **Q13 Gemini key: partly answered.** Gemini is confirmed; the free tier is enough because tests use the fake provider. Still open: who owns the key.
- **Q14 Orca quotas: data, not a decision.** Filled in P0.8.
- Which laptop runs Docker and the Android emulator together for the demo (about 16 GB RAM)?
