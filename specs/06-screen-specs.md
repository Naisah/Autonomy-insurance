# 06 Screen specs: Autonomy Insurance

Status: Draft v2 for team approval (patched for the updated high-level logic). Maps every screen to its stories, API operations (from `packages/contracts/openapi.yaml`), states and checks. Follows specs 00 to 05.

Update (Nov 26, 2026): all screens below now exist as files in design/stitch (38 files). In the Design column, New means it was generated after the first import and is now exported; Change means the Stitch screen still needs the edit described here and in section 7. The Rewards app has four target screens; the older health-score, goals-rewards and effect exports stay in design/stitch for reference until their content is merged into rewards/status.

## 1. How to read this
- Screen ID = `surface/name`, matching the file in `design/stitch/` (`web/`, `mobile/`, `rewards/`).
- Calls use the contract's method and path. "Socket" means the Socket.IO events in the contract header.
- Design: Existing = groupmate's Stitch screen is imported; New = generated from the prompts in the Stitch prompt list (still to be exported); Change = existing screen needs an edit.
- Every screen needs the shared behavior in section 2 as well as its own row.

## 2. Shared behavior (applies to every screen)
| Concern | Rule | Source |
|---|---|---|
| Auth guard | No token: go to login. 401 on any call: refresh once, retry, then show the session-expired modal ("Sign in again") | A3, X2 |
| 403 | Show the "You don't have access to this page" state, never an empty screen | X2, web/states |
| Loading | Skeleton for lists and cards if a call takes over 1 second | X4 |
| Error | Inline banner with Retry; keep prior data visible | X4, web/states |
| Feedback | Every action ends in a toast or a status chip within 1 second | X4 |
| Nav by role | Client web: Home, Chat, Estimate, Claims, Profile. Agent web: Clients, Estimates, Chats, Claims. Manager web: Team, Escalations, Reports. Admin web: Accounts, Roles, Reports, Settings. Mobile client tabs: Home, Chat, Estimate, Claims, Profile. Mobile agent tabs: Clients, Estimates, Chats, Claims | prompts Part A |
| Money | Show as peso with two decimals; payment and payout screens carry "simulated in this demo" | X7 |
| Touch and focus | 44px targets, AA contrast, visible focus | X5 |
| Reward data | Only client screens may show reward fields and the claim payout date. Agent, manager and admin screens have no reward element and no payout date, not even hidden | A2, G4 |
| Waiting for an agent | When the client has no agent (`agentStatus = Waiting`) a banner says "You're waiting for an agent". The AI chatbot, saving estimates and browsing still work. Agent chat and "Send to agent" are disabled with that message (`NO_AGENT_ASSIGNED`) | A1, A4, E2 |
| Notifications | Admin and Manager shells have a bell with in-app notifications (for example "A client is waiting for an agent"). No email or push | F2, F3 |
| Sockets | One connection per signed-in session, token in handshake; on drop show "reconnecting" and queue messages | B1 |

## 3. Web screens (18)

| Screen | Role | Stories | Design | API calls | States and key checks |
|---|---|---|---|---|---|
| web/landing | Public | (entry, E1 seed) | Existing | none | Static. Links to login and register. FAQ text is the AI knowledge seed |
| web/client-register | Public | A1 | Existing | POST /auth/register | Weak password hint; 409 email in use inline; success signs in and opens dashboard |
| web/client-login | Public | A1, A3 | Existing | POST /auth/login | Generic wrong-credentials message; 429 ACCOUNT_BLOCKED shows countdown from retryAfterSeconds; staff with mustChangePassword go to change-password first |
| web/client-dashboard | Client | C5, F4 | Existing | GET /dashboard | Shows policy, agent, recent message, recent estimates, open claims; empty states when no policy or no estimates; waiting banner when no agent |
| web/client-chat | Client | B1, B3, E1, E2 | Existing, Change (AI tab) | GET /conversations, GET /conversations/{id}/messages, POST same (fallback), POST /conversations/{id}/read, Socket, GET /ai/conversation, POST /ai/conversation/messages, POST /ai/conversation/handoff | Agent and AI tabs separate; AI tab labeled "AI assistant"; AI_UNAVAILABLE shows friendly text and keeps agent button; NO_AGENT_ASSIGNED shows "You're waiting for an agent" and disables the agent tab input; the AI tab keeps working and a queued handoff says it will be delivered once an agent is assigned; "Clear my AI chat" action; history paging 30 on scroll up; empty message cannot send; 2,000 char limit |
| web/client-estimate | Client | C1, C2, C3, C4 | Change (remove Step Rewards discount) | POST /estimates, PATCH /estimates/{id}, POST /estimates/{id}/duplicate, POST /estimates/{id}/send, GET /estimates, POST /estimates/preview (tests only) | Live premium under 300 ms from local formula; out-of-range inputs blocked with message; breakdown shows base, adjustments, total, no discount; statuses Draft, Sent, Approved, Changes requested; edit only Draft or Changes requested; shows agent note on Changes requested; "Send to agent" disabled while the client is waiting for an agent (saving still works) |
| web/client-policy | Client | C5, G5 | Existing, Change (extension card) | GET /policies, GET /policies/{id}, GET /policies/{id}/schedule, POST .../pay (demo) | Schedule shows effective due dates; schedule shows effective due dates and an Overdue chip once the extended date passes (no lapse); extension card "Based on your Rewards activity" only when rewardNote present; beneficiaries view only; "simulated" note on pay |
| web/client-claims | Client | D2 | New | GET /claims | Three summary cards from counts; list with status chips; "Needs info" card with Reply; empty state "No claims yet"; right card "Your agent" with chat link |
| web/client-file-claim | Client | D1 | New | GET /policies, POST /claims, PATCH /claims/{id}, POST /claims/{id}/documents, POST /claims/{id}/submit | 4 steps; only own Active policies listed; future event date blocked; amount above coverage blocked; Save draft; submit shows who reviews it and the #CLM number |
| web/client-claim-details | Client | D2, G5 | New | GET /claims/{id}, POST /claims/{id}/reply | Timeline from events; documents; agent updates; "Payout timing" card with the payout date and "Based on your Rewards activity" only when rewardNote present (client only); Reply only when status is Needs info; Chat with agent button |
| web/client-profile | Client | A3, A5 | New (Web 7) | GET /auth/me, PATCH /auth/me, POST /auth/change-password, POST /auth/logout, POST /auth/logout-all, GET /me/preferences, PUT /me/preferences | Success toast on save; "Unlock with Face ID" row is information only on web; Rewards card shows status only |
| web/agent-dashboard | Agent | F1, B1, B2, B4, C4, A4 | Existing, Change (availability toggle) | GET /dashboard, PUT /me/availability, GET /conversations?q=, messages and Socket as above, GET /agent/estimates, GET /estimates/{id}, POST /estimates/{id}/approve, POST /estimates/{id}/request-changes, POST /conversations/{id}/escalate | Available/Away toggle (Away: no new clients, keeps existing ones; messages queue); counts match lists; unread badges; filter by client name; request changes needs a note; approve is idempotent and opens the new policy number; escalate needs a reason; no reward element |
| web/agent-claims | Agent | D3 | New | GET /agent/claims, GET /agent/claims/{id}, POST /agent/claims/{id}/decision, chat panel (Socket) | Filter All, Submitted, Under review, Needs info; note required for Request more info and Reject; approve needs amount not above requested; only the approved amount, approval date and status are shown, never a payout date; no reward element |
| web/manager-dashboard | Manager | F2, A4 | Existing, Change (notifications, waiting clients) | GET /dashboard, GET /manager/team, GET /notifications, POST /notifications/{id}/read, PATCH /users/{id} (maxClients) | Only own team; client and open-chat counts per agent; agent availability and client limit; bell with "no agent available" notifications; waiting-clients count; no chat content |
| web/manager-escalations | Manager | B4, F2 | New | GET /escalations, GET /conversations/{id}/messages (Open only), POST /escalations/{id}/resolve, POST /clients/{id}/reassign | Banner "You only see chats that an agent escalated to you"; drawer shows the thread only while Open; reassign limited to agents in this team with a confirm modal; 403 outside team |
| web/admin-console | Admin | F3, A4 | Existing, Change (rename toggle to "Apply reward effects"; policy settings; notifications; demo actions) | GET /dashboard, GET and PUT /admin/settings/estimate-rate, GET and PUT /admin/settings/reward-rules, GET and PUT /admin/settings/claims-processing, GET and PUT /admin/settings/assignment, GET /notifications, POST /rewards/demo/close-period (demo mode) | Counts only, never chat content; rate change shows new formula version and "applies to new estimates only"; policy settings editable: daily point bands, level thresholds, extension days, delay days, standard processing days (default 7), default max clients (default 10); "Close period now" is labeled "Demo only"; bell for notifications |
| web/admin-accounts | Admin | A4 | New | GET /users, POST /users, PATCH /users/{id} | Create account modal: Agent requires manager; agent rows show availability and client limit (editable); temporary password shown once; deactivate asks confirm; no chat content anywhere |
| web/states | All | X2, X4 | New | none | Loading skeleton, inline error with Retry, 403 page, session expired modal |

(web/client-chat counts once; the Agent-facing chat panel is part of web/agent-dashboard and web/agent-claims.)

## 4. Main mobile app screens (14)

| Screen | Role | Stories | Design | API calls | States and key checks |
|---|---|---|---|---|---|
| mobile/sign-in | Public | A1, A3 | New | POST /auth/login | Same checks as web login; "One account works on web and mobile" |
| mobile/register | Public | A1 | New | POST /auth/register | Strength hint, terms checkbox required |
| mobile/biometric-unlock | Client, Agent | A5 | Existing | none (device `local_auth`), then GET /auth/me | On success the stored session continues; failure, cancel or no biometrics falls back to password; expired session requires password; nothing biometric is sent |
| mobile/client-dashboard | Client | C5, F4 | Existing | GET /dashboard | Same data as web |
| mobile/client-chat | Client | B1, B3, E1, E2 | Existing | same as web/client-chat | AI toggle; "You're waiting for an agent" state; keyboard-safe composer; reconnect banner; thumb-zone send |
| mobile/client-estimate | Client | C1 to C4 | New | same as web/client-estimate | Sticky premium card; sliders and chips; past estimates with status chips; "Send to agent" |
| mobile/client-policy | Client | C5, G5 | New | same as web/client-policy | Payment schedule list; extension card; Chat with agent |
| mobile/client-claims | Client | D2 | New | GET /claims | Floating "File a claim"; chips; empty state |
| mobile/client-file-claim | Client | D1 | New | same as web/client-file-claim | 4-step flow; draft resume |
| mobile/client-claim-details | Client | D2, G5 | New | same as web/client-claim-details | Vertical timeline; documents; agent updates; reward note only when present |
| mobile/client-profile | Client | A3, A5 | New | same as web/client-profile | Face ID or fingerprint toggle is stored on device only, never sent; "Open Rewards" link; sign out calls POST /auth/logout and clears local tokens |
| mobile/agent-home | Agent | F1, B2 | New | GET /dashboard, GET /conversations, PUT /me/availability | Counts for open chats and pending estimates; assigned client list; Available/Away toggle; no reward element |
| mobile/agent-chat | Agent | B1, B3, B4 | Existing | messages and Socket, POST /conversations/{id}/escalate | "Escalate to manager" menu with reason; history paging |
| mobile/agent-review-estimate | Agent | C4 | New | GET /estimates/{id}, POST approve, POST request-changes | Shows client inputs and computed premium; Request changes needs a note; no reward element |

Not in the mobile app (web only for the demo, D4): agent claims review, manager and admin screens.

## 5. Rewards app screens (4)

| Screen | Role | Stories | Design | API calls | States and key checks |
|---|---|---|---|---|---|
| rewards/signin | Client | G1 | Existing | deep link to main app, POST /sso/authorize (main app side), POST /sso/token, fallback POST /auth/login with clientId rewards | "Sign in as [name]" when main app is signed in; never handles a password in the SSO path; code expiry shows retry |
| rewards/client-only-access | Non-clients | G1 | Existing | 403 from /sso/authorize or /auth/login | Clear message that the Rewards app is for clients only |
| rewards/home | Client | G2, G3 | Existing, Change | GET /rewards/today, PUT /rewards/steps, GET /rewards/steps, GET /rewards/summary, POST /rewards/demo/sample-steps (demo) | Today's steps and points earned today (0, 10, 20 or 30), month points, current level and points to the next level, weekly bars; "use sample data" always available (demo-only label); locked past days cannot be edited (409 shown as a friendly message); no custom goal |
| rewards/status | Client | G3, G4, G5 | Existing (health-score), Change | GET /rewards/summary, GET /rewards/effect | Level (Bronze, Silver, Gold, Platinum), month points, points to next level, plain-words effect ("Your Gold level gives you 14 extra days to pay each premium and delays claim payouts by 5 days"), sync chip (Synced, Pending, Failed); empty state when no result yet (Bronze applies); points reset each month |

Dropped: `rewards/health-score` (0 to 100 score), `rewards/goals-rewards` (goals, milestones) and the separate `rewards/effect` screen; their content merges into `rewards/status`.

Rewards app logout: main-app logout ends the Rewards session; on foreground or failed refresh the app returns to rewards/signin.

## 6. Screen to story coverage check
- Every Must story has at least one screen: A1 (login, register), A2 (rules, all screens), A3 (profile, states), A4 (admin-accounts), B1 to B3 (chats), C1 to C4 (estimate, agent-dashboard, agent-review-estimate), E1 (chat AI tab), F1 (agent-dashboard, agent-home), G1 to G4 (rewards screens: home and status).
- Should and Could screens that exist only as design gaps are listed as New: claims (D1 to D3), mobile policy and profile, manager-escalations, admin-accounts.
- B5 (attachments) has no screen yet.

## 7. Stitch edits still to do (all screens are exported)
All gap screens from the earlier prompt list exist in design/stitch. The edits below were sent to Stitch on 2026-11-26. The exports of that day (stitch_remix_of_insuria_life_insurance_platform (1).zip and (2).zip, which differ only in image links) linked the screens and embedded the images, but none of the screen edits are in it. Colors and fonts did not change.

| Screen | Edit | Status (export 2026-11-26) |
|---|---|---|
| web/client-estimate | Remove the "Step Rewards credit -₱500/mo" line and Maya's quote about the rewards tier lowering the rate | Not done |
| web/client-dashboard | Remove "Includes -₱500/mo Step Rewards discount" under the premium (found in this check, not in the earlier prompt) | Not done |
| web/admin-console | Rename "Auto-apply Step Rewards discount" to "Apply reward effects"; policy settings (point bands, level thresholds, extension days, delay days, standard processing days, default max clients); notifications bell; "Close period now" labeled Demo only | Not done (the console has a generic "Policy settings" form, without these fields) |
| rewards/home, rewards/health-score | Monthly points, the four levels, points to the next level, the effect in plain words, sync chip, "Simulated for this course demo" (this becomes rewards/status); retire the 0 to 100 score, rewards/goals-rewards and rewards/effect | Not done (still "Health Score 88 / 100", "+30 days", streaks and goals) |
| web/client-policy, mobile/client-policy | Extension card and Overdue chip | Not done. mobile/client-policy still says "Collection period extended by 30 days"; the logic gives +7, +14 or +21 |
| web/client-chat, mobile/client-chat | AI tab and handoff to the agent | Done (agent and AI tabs, "Talk to my agent") |
| Client dashboard and chat (web and mobile) | Waiting banner; agent chat input disabled, AI tab still works | Not done |
| web/agent-dashboard, mobile/agent-home | Available/Away toggle, no reward data | Toggle not done. No reward data: checked |
| web/manager-dashboard | Notifications bell, waiting clients count, availability and editable client limit per agent | Not done |

Prompts: if the team regenerates a screen in Stitch, use the wording above, never "delayed or reduced", "+30 days" or "7-day step goal" (those came from an earlier draft). After a new export, run design/prototype/link_stitch.py again (see design/prototype/README.md) and update this table.

## 8. Decisions that need approval
- S1 Web profile shows the biometric option as information only; the toggle lives on mobile.
- S2 Mobile apps cover Client and Agent only; Manager and Admin are web only.
- S3 The client dashboard needs no endpoint beyond `/dashboard`; if the design needs more, add fields to `ClientDashboard` in the contract first.
- S4 Where a screen asks for something the contract lacks, the screen change waits for a contract change (spec 05 workflow), not an ad hoc call.
- S5 The Rewards app has four screens; the "goal" is the next level, and custom goals and milestones are dropped (keeps the Rewards app small, G1 to G4 only).
- S6 Agents never see the claim payout date; only the client does.
- S7 A waiting client can use the chatbot, save estimates and browse; agent chat and sending an estimate wait for an agent.
