# 00 Constitution: Autonomy Insurance

Status: Draft v2 (updated Nov 26, 2026 for the high-level logic; needs team confirmation). Source of truth for decisions. If code or another spec disagrees with this file, this file wins until it is changed here first.

## 1. Product in one paragraph
Life insurance communication system. Main feature: Chat with Agent. Also: policy estimates reviewed by the agent, claims, an AI chatbot that hands off to the agent, and a separate mobile-only Rewards app (step-based) whose results affect premium collection periods and claims payouts. Course requirement: a working web app and a working mobile app using the same credentials, plus written documentation.

## 2. Principles
1. Spec first. No feature code without an approved spec and task file in /specs.
2. Contract first. The REST API contract (packages/contracts/openapi.yaml) is written before any client or server code. Web, mobile and Rewards build against it.
3. Must before Should before Could. Must features (guide section 6) must run in code.
4. Security by the server. The back end checks role and ownership on every request. Clients never decide access.
5. Simulated, not real. Payments, underwriting and claims adjudication are simple rule-based simulations with sample data (guide section 9).
6. Small, independent tasks. Every task is sized for one agent in one worktree with a clear file boundary and a testable result.
7. Design fidelity. UI follows the Stitch exports in /design/stitch and the tokens in /design/README.md.

## 3. Decisions carried from the project guide (do not change without team approval)
- Three tiers: web and mobile front ends, REST back end, database.
- Roles: Admin > Manager > Agent > Client. Each user has role and reports_to. Each client has one assigned agent.
- Chat content: client and agent only. Managers see escalated chats only. Admins never see chat content.
- Rewards app: separate mobile app, own back end and own database, Client role only. Shares credentials through the common Auth service (the only place password hashes live). Sends one result per client per month to the main system by REST (POST /api/rewards/results, service key only). Policy and Claims modules apply the results. Agents and managers cannot see reward status or the claim payout date.
- Rewards logic: steps are the only input; daily points 0, 10, 20, 30; four levels (Bronze, Silver, Gold, Platinum) from monthly points; a level gives extra days to pay each premium and delays claim payouts. Payouts are never reduced and there is no premium discount. Details in specs/02 section 6.
- Client assignment: automatic, to an Available agent under their client limit with the fewest clients. If none, the client waits and the Admin and all managers are notified in-app.
- All human agents have the same authority. No specialty field.
- SSO: OAuth 2.0 style. Rewards app receives only a token, never the password. Tokens expire. Logout in the main app ends the Rewards session.
- Biometrics unlock the app on the device only. Nothing biometric is stored on the server.
- Chat uses real-time messaging. The AI chatbot hands off to the agent.
- Agent reviews a client estimate before it becomes a policy.
- React for web, Flutter for mobile apps (decided Nov 23, 2026).

## 4. Stack decisions (proposed by Claude, delegated by the team lead; confirm)
| Area | Choice | Why |
|---|---|---|
| Back end language | TypeScript on Node 22 | One language for API and web; agents are strongest here |
| API framework | Fastify with Zod validation | Small, fast, schema-first |
| Database | PostgreSQL (local Docker for dev; Supabase or Neon free tier if hosting is wanted) | Relational fit for role and reports_to hierarchy and ERD |
| ORM and migrations | Prisma | Schema file doubles as ERD source |
| Real-time chat | Socket.IO | Simple server; Flutter and React clients exist |
| AI chatbot | Gemini API free tier behind an AiProvider interface, answering from a small markdown knowledge base | Free; replaceable; stays inside "no legal or financial advice" |
| Web | React + Vite + TypeScript + Tailwind (tokens from Stitch) | Matches Stitch output |
| Mobile and Rewards | Flutter (two separate apps, one shared Dart package for API client and theme) | Matches decision; biometrics via local_auth |
| Tokens | RS256 JWT issued by Auth; other services verify with its public key (JWKS) | Services never see passwords; matches SSO decision |
| Tests | Vitest (TS), flutter_test (Dart), Playwright (web smoke) | Cheap, agent-friendly |
| Hosting | Local only for the demo; production deployment is out of scope | Guide section 9 |

Why not Supabase as the whole back end: the course asks for an explicit REST endpoint list and a separate Auth service with SSO to a second back end. Custom services make that visible and gradable. Supabase remains fine as a hosted Postgres.

## 5. Services and data ownership
- services/auth: users (role, reports_to, agent availability and client limit), password hashes, sessions and refresh tokens, SSO token exchange for Rewards, service accounts, automatic client-to-agent assignment. Own database.
- services/core-api: chat, estimates, policies, claims, AI assistant, admin settings, dashboards, notifications, reward results and effects. Own database. Keeps a read-only copy of the user directory from Auth events; never stores passwords.
- services/rewards-api: daily steps, monthly points and level, an outbox of results. Own database. Pushes results to core-api with a service key and cannot read policies or claims.
Frontends talk to Auth for login and to core-api (or rewards-api for the Rewards app) with the bearer token.

## 6. Repository layout
```
AGENTS.md            rules for every coding agent (CLAUDE.md and GEMINI.md point here; other tools get a one-line pointer file)
specs/               numbered specs and per-feature task files
packages/contracts/  openapi.yaml and shared types (single contract)
services/{auth,core-api,rewards-api}/
apps/{web,mobile,rewards}/
design/stitch/       raw Stitch exports, one HTML file per screen
design/README.md     tokens and screen inventory
design/design-system.md  Stitch design system (brand, type, components)
docs/                course documentation, ai-use-log.md, agent-log.md, sprint records
packages/dart_shared/  Dart API client, models, theme and premium function (created in T007)
legacy/frontend-draft/  groupmate's first React draft (reference only, do not extend)
```

## 7. Definition of Done (from the guide, plus two)
Meets acceptance criteria; reviewed by a teammate; saved in the shared repository; consistent with the architecture (roles, access rules, SSO); tests for the task pass; AI use logged in docs/ai-use-log.md.

## 8. Assumptions and open items
Assumptions: all human agents have the same authority; the payout delay and reward effects are a simulation; thresholds, rates and day counts are sample values editable by the Admin; grace periods and policy lapse are not simulated.

- Deadline: estimated first week of January 2027 (not confirmed by the professor). About 6 weeks from Nov 24, so the 4 one-week sprints fit with about 2 weeks of buffer. Confirm the exact date; if it moves earlier, drop Should and Could features first.
- Whether a presentation or demo is required.
- Which coding agents run cleanly and their quota (fill in the roster in specs/01-agent-roster.md).
- Confirm the stack table in section 4. Gemini is proposed; the project guide lists the chatbot technology as open, so update the guide once confirmed.
- openapi.yaml does not exist yet; task T014 writes it from spec 05.

## 9. Proposed schedule (working back from about Jan 4, 2027)
| Dates | Focus |
|---|---|
| Nov 24 to Nov 30 | Specs approved, Stitch edits done, setup (protected main, agent pointer files, agent trial, automation, scaffolds, task files), one pilot task |
| Dec 1 to Dec 7 | Sprint 2: contract, Auth service with assignment, A1 to A4, B1 to B3, C1 to C4, F4 basic |
| Dec 8 to Dec 14 | Sprint 3: E1, F1, Rewards G1 to G4, mobile apps |
| Dec 15 to Dec 21 | Should features (claims, dashboards, biometrics), bug fixes, UI/UX review |
| Dec 22 to Jan 4 | Sprint 4: polish, documentation, final Scrum guide; holiday buffer |
