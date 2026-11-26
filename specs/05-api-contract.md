# 05 REST API contract: Autonomy Insurance

Status: Approved v2, Nov 26, 2026, by Atlas for the team lead (docs/decisions.md) (patched for the updated high-level logic). A draft openapi.yaml is now in packages/contracts (Q8); section 8 lists exactly what the contract task (T014) must change in it. The contract itself is `packages/contracts/openapi.yaml` (one file for all three services). This note explains how to read it, which decisions it makes, and what it changes in earlier specs. Follows specs 00, 02, 03, 04.

## 1. How to use it
- Put the file at `packages/contracts/openapi.yaml`. It is the source of truth for request and response shapes. Code that disagrees with it is wrong, or the contract is changed first (constitution principle 2).
- Each path declares its service with a path-level `servers` entry: auth 4001, core-api 4002, rewards-api 4003.
- Every operation has `x-roles` (who may call it), `x-stories` (which product-spec stories it serves) and `x-priority` (Must, Should, Could). Task files (spec 07) and the authorization test matrix (A2) are generated from these three fields.
- Schemas ending in `Client` carry reward fields. Schemas ending in `Staff` never do. A lint check should fail the build if a `*Staff` schema ever gains a field from the reward set (`rewardNote`, `rewardStatus`, `rewardPoints`, `payoutDelayDays`, `payoutDueDate`, `reasonLabel`).
- Generate typed clients: TypeScript for web (for example `openapi-typescript`), Dart for mobile and Rewards (for example `openapi-generator` dart-dio). Generated code is not edited by hand.
- Chat events over Socket.IO are described in the contract's top description because OpenAPI cannot express them.

## 2. Size and coverage
- Before the patch: 62 paths, 74 operations. After the changes in section 8 the totals change (new: availability, notifications, rewards result, demo actions, AI clear; removed: goal, milestones, health-score, internal reward-results). Recount when T014 lands; do not trust the old numbers.
- Every story in spec 02 has at least one operation except A2 (rules, covered by the test matrix and `/internal/directory-events`), A5 (device-only, no endpoint by design) and B5 (attachments, Could, left out until the team decides to build it).

## 3. Endpoint groups by story

| Group | Stories | Operations |
|---|---|---|
| Accounts and sessions | A1, A3, A4 | register, login, refresh, logout, logout-all, me, change-password, forgot-password (Could), users list, create staff, patch user (including `maxClients`), set availability |
| SSO and service tokens | G1, G4 | sso/authorize, sso/token, service/token, jwks |
| Chat | B1 to B4, F2 | conversations, messages (history and send), read, escalate, escalations, resolve, reassign |
| AI | E1, E2 | ai/conversation, ai/conversation/messages, ai/conversation/handoff |
| Estimates | C1 to C4 | list, create, preview, get, edit, duplicate, send, agent pending list, approve, request-changes |
| Policies | C5, G5 | list, get, schedule, demo pay, agent view of a client's policies |
| Claims | D1 to D3, G5 | client create, edit, documents, submit, reply, list, get; agent list, get, decision |
| Dashboards and settings | F1 to F3 | dashboard (role-specific), manager team, estimate-rate, reward-rules, preferences |
| Rewards effects | G4, G5 | `POST /api/rewards/results` (service key), me/reward-effects, internal client reward-effects |
| Rewards app | G2 to G3 | today, steps, summary (points, level, points to next level), effect, demo sample-steps, demo close-period |
| Assignment and notifications | A1, A4, F2 | agent availability, client limit, notifications list and mark read |

## 4. Decisions made in the contract (need approval)
All decided on Nov 26, 2026 by Atlas for the team lead; the answers are in docs/decisions.md.
- C1 Separate staff routes. Agents use `/agent/claims`, `/agent/estimates`, `/agent/clients/{id}/policies`, and clients use `/claims`, `/policies`. This keeps reward fields out of staff responses by type, not by filtering.
- C2 One `/dashboard` route returns a different shape per role (discriminated by `role`). Alternative: four routes. One route is simpler for the clients; the server still checks role.
- C3 The estimate premium is computed on the client for live updates (C2) and by the server on every write. `POST /estimates/preview` exists so tests can compare the two.
- C4 A claim decision is one operation with `action` (StartReview, Approve, RequestInfo, Reject, MarkPaid). The agent supplies `amountApproved` and a note; the server computes the payout date and applies the reward delay (D3, G5). The agent response never includes the payout date.
- C5 Client admin screens use auth's `/users` routes for accounts. The Manager reassign route lives in core-api and calls auth's `/internal/users/{id}/reports-to`, so auth stays the single writer of reports_to.
- C6 The Rewards app reads its status and effect text from rewards-api, which asks core-api through a scoped service key (`reward:read-effects`). The Rewards app token has the audience `rewards-api` only and is never accepted by core-api. Key separation: `POST /api/rewards/results` accepts only the service key; client endpoints reject the service key (tested in T030 and T120).
- C7 Every state-changing action that must not duplicate (approve, submit, decision) takes `Idempotency-Key`. Reward results do not: there is one result per client per period and a resend replaces the earlier one.
- C8 Errors follow one shape (`Error`), with codes the UI maps to the states sheet: UNAUTHORIZED (session expired), FORBIDDEN (403 page), NOT_FOUND, VALIDATION, CONFLICT, ACCOUNT_BLOCKED, RATE_LIMITED, AI_UNAVAILABLE, NO_AGENT_ASSIGNED (client is waiting for an agent), INVALID_STATE. The rewards result endpoint answers 201, 400, 401, 403 and 404 as the logic specifies.

## 5. Changes this makes to earlier specs
- `user_preferences` is now in spec 04. Spec 04 v2 also adds `notifications`, `reward_status_history`, agent `availability` and `max_clients`, and renames `service_clients`, `step_days` and `health_scores` to `service_accounts`, `daily_steps` and `period_summary`.
- Spec 03 sections 5.1, 9.2 and 9.3 define assignment, the rewards endpoint and the effect rules that this contract exposes.
- The forgot-password endpoint is Could and depends on decision D3. Leave it unbuilt unless approved.
- Attachments (B5) are not in the contract; adding them later needs `POST /conversations/{id}/attachments` and a files table.

## 6. Contract-first workflow for agents
1. Any change to a request or response shape edits `openapi.yaml` first, in its own task and commit, then regenerates clients.
2. Backend tasks implement the operations for one tag at a time and must pass contract tests (responses validated against the schemas).
3. Front-end tasks use the generated clients and a mock server (for example Prism) until the backend route exists, so web, mobile and Rewards can be built in parallel.
4. The authorization matrix test is generated from `x-roles` and must pass for each service before its tag is marked done.

## 7. Open items affecting the contract
- D1 (closed): no reward discount. The contract has no discount field anywhere, and the admin toggle is `applyEffects`.
- D2 (closed): delay only. `payoutReductionPercent` is removed from schemas and settings.
- D3: forgot-password is marked Could.
- D4: agent claims review is web only for now; the endpoints are the same for a future mobile screen.
- B5: attachments are not defined yet.

## 8. Change list for `openapi.yaml` (task T014)
The contract task makes exactly these edits, in one commit, then regenerates clients and runs `contract:check`.

**Remove or rename**
- Remove `/rewards/goal`, `/rewards/milestones`, `/rewards/health-score` (custom goals and milestones are dropped; the level is the goal).
- Remove `POST /internal/reward-results` and its `resultId`, 422 response and idempotency header.
- Remove `payoutReductionPercent`, `payoutAmount` and `healthScore` from all schemas and from the lint field set.
- Rename `HealthScore` schemas to `RewardSummary`; `RewardStatus` enum gains `Platinum`.

**Add**
- `POST /api/rewards/results` on core-api. Body `{ client_id, period (YYYY-MM), points (integer, 0 or more), status (Bronze, Silver, Gold, Platinum) }`. Responses 201, 400, 401, 403, 404. Security: service key only (`x-roles`: service). Description: one result per client per period; a resend replaces the earlier result.
- `GET /rewards/summary` (rewards-api, Client): `{ period, points, status, pointsToNextLevel, nextLevel, todayPoints, syncStatus }`.
- `POST /rewards/demo/sample-steps` and `POST /rewards/demo/close-period` (rewards-api, demo mode only; sample-steps Client, close-period Admin through core-api (core-api calls rewards-api with a service token scoped `rewards:close-period`, Q12) or Client for own data; mark `x-priority: Should`, `x-demo: true`).
- `PUT /me/availability` (auth, Agent) and `maxClients` on `PATCH /users/{id}` (Admin; Manager for own team). `User` and `StaffDirectoryEntry` gain `availability` and `maxClients` for agents.
- `GET /notifications` and `POST /notifications/{id}/read` (core-api, Admin and Manager; Agent for `ClientAssigned` if built).
- `DELETE /ai/conversation/messages` (client clears their own bot chat).
- Admin settings: `reward-rules` schema gets `dailyPoints` and four tiers with `minPoints`, `extensionDays`, `payoutDelayDays`; new `claims/processing` (`standardProcessingDays`) and `assignment` (`defaultMaxClients`) settings.
- `ClientDashboard` and `ClientProfile` gain `agentStatus` (`Assigned` or `Waiting`); `Estimate` send and conversation send return `NO_AGENT_ASSIGNED` while waiting.

**Change**
- `ClientClaim` gains `payoutDueDate` and `payoutDelayDays`. `StaffClaim` has neither (and no reward field of any kind).
- Policy schedule items return `effectiveDueDate` and `displayStatus` (Upcoming, Paid, Overdue); `ClientPolicy` loses `collectionExtensionDays`.
- Service-key rules: security scheme `serviceKey` is accepted only by `POST /api/rewards/results` and the internal reads; every other operation lists only the user bearer scheme.
- Rewards-api server/auth: the Rewards app calls rewards-api only.
