# Build phases: Autonomy Insurance web and mobile system

The system is built in eight phases. Each phase ends with something you can run and click, and its own branch (`phase/N-name`) and pull request. The team reviews and merges each phase before the next one starts. Task IDs refer to specs/07-task-breakdown.md. Dates are targets and assume the Jan 4, 2027 deadline.

Every feature is built for web and mobile in the same phase, because both apps use the same API.

| Phase | Name | Target dates | Result you can try |
|---|---|---|---|
| 1 | Foundation | Nov 26 to Nov 30 | Database, three empty services, API contract with a mock server, empty web and mobile apps in the Stitch style |
| 2 | Accounts and sign-in | Dec 1 to Dec 4 | Register and log in on web and mobile; new clients get an agent or wait in the queue |
| 3 | Chat and dashboards | Dec 4 to Dec 7 | Client and agent chat live between web and mobile |
| 4 | Estimates and policies | Dec 8 to Dec 10 | Client builds an estimate, agent approves it, the policy and payment schedule appear |
| 5 | AI chatbot | Dec 10 to Dec 12 | AI tab answers from the knowledge base and hands off to the agent |
| 6 | Rewards app | Dec 12 to Dec 16 | Rewards app signs in from the main app, counts steps and points, and extends due dates |
| 7 | Claims, manager and admin | Dec 16 to Dec 22 | Claims end to end, manager escalations and reassign, admin console, biometrics |
| 8 | Hardening and demo | Dec 22 to Jan 4 | Security review, smoke tests per role, one-command demo reset |

## Phase 1: Foundation
Goal: everything later phases build on, with nothing user-facing yet.
Tasks: T000 (the GitHub branch protection is yours to set), T001, T014, T002, T015, T003, T004, T005, T006, T007, T008, T009, T010, T011, T012, T013.
Scope:
- Monorepo with npm workspaces; `docker-compose.yml` with one Postgres and the databases `autonomy_auth`, `autonomy_core`, `autonomy_rewards`.
- `packages/contracts/openapi.yaml` written from spec 05 (all paths, roles, `*Client` and `*Staff` schemas, error codes), lint, generated TypeScript types, mock server.
- Premium and reward test vectors with TypeScript reference functions.
- services/auth, core-api and rewards-api scaffolds (Fastify, Zod, Prisma, Vitest) with `/health` and the error model.
- Prisma schemas and first migrations for all three databases; seed data (admin, managers, agents including Maya Santos, clients including Elena Rostova and one waiting client).
- apps/web (React, Vite, Tailwind), apps/mobile and apps/rewards (Flutter) with a shared Dart package; design tokens from design/README.md.
Done when:
- `docker compose up` starts Postgres; migrations and seed run with one command.
- `npm run contract:check` passes and the mock server answers a route in every group.
- All service and vector tests pass; each service answers `/health`.
- The web app and both Flutter apps start and show a placeholder screen in the Stitch colours and fonts.

## Phase 2: Accounts and sign-in
Goal: real users can register and sign in on web and mobile, with the right screens per role.
Tasks: T020, T021, T022, T023, T025, T026, T027, T030, T031, T032, T060, T061, T080, T081, T083.
Done when:
- Register and login work on web and mobile; weak passwords, wrong credentials and lockout behave as in spec 02 A1.
- A new client is assigned the agent with the fewest clients, or waits in the queue when none is Available or has room.
- Tokens refresh; logout and logout-all work; each role sees only its own navigation and gets a 403 page elsewhere.
- The authorization matrix test passes for every route built so far.

## Phase 3: Chat and dashboards
Goal: the core of the product, a client talking to their agent.
Tasks: T033, T034, T039, T062, T063, T068, T084, T085 (agent tab), T090 (home and chat).
Done when:
- A message sent from the client (web or mobile) reaches the agent within 2 seconds, and the reverse.
- History pages by 30, unread counts and reconnect work; one message is stored after a resend.
- A waiting client sees the waiting banner, cannot send to an agent, and can still browse.
- Client and agent dashboards show counts that match the lists.

## Phase 4: Estimates and policies
Tasks: T036, T037, T038, T065, T066, T069, T086, T087, T090 (review estimate).
Done when:
- The premium on screen matches the server and all premium vectors (no Step Rewards discount anywhere).
- Agent approves or requests changes; approval creates one policy with term x 12 payments, even if clicked twice.
- Policy screens show the schedule and the Overdue chip; agents see no reward fields.

## Phase 5: AI chatbot
Tasks: T042, T043, T064, T085 (AI tab).
Done when:
- The AI tab answers from the knowledge base, refuses legal or financial advice, and is rate limited.
- "Talk to my agent" posts a summary into the agent chat (the agent sees the summary only), or explains the wait when no agent is assigned.
- Tests run with the fake AI provider, so no API key is needed for tests.

## Phase 6: Rewards app
Tasks: T024, T044, T045, T050, T051, T052, T053, T091, T100, T102, T103.
Done when:
- Opening Rewards from the main app signs the client in through SSO; non-clients get the client-only screen.
- Steps give 0, 10, 20 or 30 points a day; the month total gives Bronze, Silver, Gold or Platinum.
- Closing a period sends the result with the service key; the main app extends due dates by 7, 14 or 21 days and delays payouts by 3, 5 or 7 days.
- The status history keeps every change; reward test vectors pass.

## Phase 7: Claims, manager and admin
Tasks: T035, T040, T041, T046, T047, T048, T049, T067, T070, T071, T072, T073, T074, T082, T088, T089.
Done when:
- Clients file, edit, submit and reply on claims (web and mobile); agents decide on web; the payout date shows to the client only.
- Managers see escalations, join escalated chats and reassign clients; the waiting-client notification reaches the admin and managers.
- The admin creates accounts, sets limits and edits the reward rules ("Apply reward effects").
- Biometric unlock works on mobile with a password fallback; web profile and settings are done.

## Phase 8: Hardening and demo
Tasks: T120, T110, T111, T112.
Done when:
- The security review checks pass (authorization matrix, no reward fields in staff responses, admin never reads chat tables, no tokens or message text in logs).
- A Playwright smoke test passes for each role.
- One command resets and seeds everything for the demo, and the demo script runs start to finish.
- The UI/UX checklist is applied to every screen.

## Course deliverables along the way
These are not part of the build, but some phases are a good moment for them: the glossary, out-of-scope list and risk register (any time), the bug log (from Phase 2), the UI/UX review (Phase 8), and the documentation and final Scrum guide (T113, T114, after Phase 8).

## How each phase runs
1. Claude builds the phase on `phase/N-name`, runs its tests and checks the "Done when" list.
2. Claude reports what works, what changed and how to run it, then pushes only after you say so.
3. You or your groupmates review the pull request and merge it; the next phase starts from the merged `main`.
