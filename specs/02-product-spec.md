# 02 Product spec: stories, acceptance criteria, story points

Status: Draft v2 for team approval. Rewritten on Nov 26, 2026 to match the updated high-level logic (monthly points and four levels, delay-only payouts, automatic agent assignment, service-key separation) and specs 03 to 07. Built from the project guide (feature list A1 to G5), the 38 Stitch screens in design/stitch, and specs/00-constitution.md.

## 1. How to read this
- Each story has an ID that matches the guide's feature list. A6 and F4 are additions (see section 5). Do not renumber.
- Priority: Must, Should, Could (from the guide). Points use 1, 2, 3, 5, 8.
- Surface: W = main web app, M = main mobile app, R = Rewards mobile app, API = back end only.
- Screens name the Stitch files in design/stitch. Screen details are in spec 06, API operations in spec 05, data in spec 04.
- Acceptance criteria are testable. Every criterion becomes a test or a manual check in the task files (spec 07).

## 2. Roles and what each can do (summary)
| Role | Can | Cannot |
|---|---|---|
| Client | Own profile, policies, estimates, claims; chat with own agent; AI chatbot; Rewards app | See anyone else's records |
| Agent | Assigned clients only: chat, review estimates, help with policies and claims, escalate a chat, set own availability | See reward status, reward effects or the claim payout date; see unassigned clients |
| Manager | Own team's agents and their clients: performance, availability and client limits, reassign within team, escalated chats while Open, notifications | Read non-escalated chats; see reward status; see other teams |
| Admin | All accounts and roles, create managers and agents, assign agents to managers, policy settings, system-wide counts, notifications | Read chat content |
All human agents have the same authority. There is no specialty field (closed).

## 3. Cross-cutting acceptance criteria (apply to every story)
- X1 Server-side access: the back end checks role and ownership on every request. A hidden button is never the only protection.
- X2 Errors: no valid token returns 401; a valid token without permission returns 403; a missing or hidden record returns 404. The UI shows the matching state from web/states. Error codes are in spec 05.
- X3 Same account: one email and password works on web and mobile.
- X4 Feedback: every action shows a result (toast, status chip or inline message) within 1 second, or a loading state if longer.
- X5 Responsive and accessible: touch targets at least 44px, text contrast AA, visible focus, readable at 390px wide.
- X6 Sample data: seed accounts and records exist for every role and state so every screen can be demoed. No real personal data.
- X7 Simulated money and rewards: no real payment, underwriting or claims adjudication. Screens that show payments, payouts or reward effects say "simulated".
- X8 AI use is logged in docs/ai-use-log.md.
- X9 Reward data boundary: reward fields and the claim payout date appear only in client screens and client API shapes, never in agent, manager or admin ones (listed in spec 05).

## 4. Stories

### A. Accounts and access

A1 Register and log in with email and password. Client. Must. 5 points. W, M. Screens: web/client-register, web/client-login, mobile/register, mobile/sign-in.
As a client I want to create an account and log in so that I can use the system on web and mobile.
- Register needs full name, email, password and agreement to terms. Email must be unique (409 on repeat).
- Password rule: at least 8 characters with a letter and a number. A weak password shows a hint and is rejected.
- Successful registration creates a Client account, signs the user in and opens the client dashboard (F4).
- Registration assigns an agent automatically (A4 rule): an Active, Available agent under their client limit with the fewest clients. If none qualifies, the client has no agent yet (agentStatus Waiting), joins the waiting queue, and the Admin and all managers get an in-app notification.
- Login with correct credentials opens the dashboard. Wrong credentials show a generic "email or password is incorrect" message.
- After 5 failed attempts in 10 minutes the account is blocked for 5 minutes with a clear message and a countdown (429, retryAfterSeconds).
- Passwords are stored only as argon2id hashes in the Auth service.

A2 Role-based access with the reports_to hierarchy. All. Must. 8 points. API. Screens: none (rules).
- Every user has one role and a reports_to reference. Client reports to an Agent, Agent to a Manager, Manager to the Admin. A client without an agent has reports_to empty (waiting).
- A client reads only their own records. An agent only their assigned clients. A manager only their team's agents and those agents' clients. An admin all accounts.
- Chat content is readable only by the client and their agent, plus the manager for an Open escalation. Admin has no chat content access, including through reports.
- Agent, manager and admin responses never contain reward fields or the claim payout date (X9); separate response types make this structural.
- A client token is rejected on the rewards result endpoint, and the service key is rejected on every client endpoint. Each rule has its own test.
- A test matrix (role x endpoint x own/other record), generated from the contract, passes.

A3 Token-based session and logout. All. Must. 3 points. W, M, API. Screens: web/client-profile, mobile/client-profile, web/states.
- Login returns a 15-minute access token and a 7-day refresh token (rotated on use).
- An expired session shows "session expired, sign in again" and returns to login after one failed refresh.
- Logout ends the session on that device and invalidates its refresh token. "Sign out of all devices" ends every session.
- Logging out of the main app ends the SSO-linked Rewards session (G1).

A4 Admin creates accounts; agent assignment, availability and client limits. Admin, Manager, Agent. Must. 8 points. W, API. Screens: web/admin-console, web/admin-accounts, web/manager-dashboard, web/agent-dashboard.
- Admin can create a Manager (reports to Admin) and an Agent (must pick a manager). Only the Admin can create these roles; others get 403.
- New staff accounts get a temporary password and must change it at first login.
- Admin can deactivate an account; a deactivated user cannot log in. The account list shows name, role, reports to, status, and for agents availability and client limit.
- Agents have availability (Available or Away) and a max-clients limit (default 10, an Admin setting, editable per agent by the Admin and the agent's Manager).
- Assignment rule: choose an Active, Available agent below their limit with the fewest clients (ties: oldest account), in one transaction with the count check so an agent cannot be overfilled.
- A waiting client is served oldest first. Assignment re-runs when an agent becomes Available, when a new agent is created or activated, when an agent's or the default limit is raised, and when a client is reassigned away from a full agent.
- An Away agent gets no new clients and keeps existing ones. Their messages queue as normal; a manager can reassign if the wait is long.
- Admin can move an agent to another manager and reassign a client to another agent.
- No chat content appears anywhere in admin screens.

A5 Biometric unlock on the device. Client, Agent. Should. 5 points. M. Screens: mobile/biometric-unlock, mobile/client-profile.
- The user turns biometric unlock on or off in Profile. When on, reopening the app asks for Face ID or fingerprint; success continues the stored session.
- Failure, cancel or no enrolled biometrics falls back to the password.
- No biometric data is sent to or stored on the server. An expired session needs the password; biometrics alone do not sign in.

A6 Forgot password (simulated reset). Client. Could. 3 points. W, M. Screens: the "Forgot password?" link on web/client-login and mobile/sign-in. The reset screen is a gap.
- The client enters an email and always sees the same message, so registered emails are never revealed.
- In the demo the reset link appears on a simulated inbox page. It works once and expires in 15 minutes.
- A new password follows the A1 rule and ends the other sessions.
- Not built unless the team approves it (spec 05 marks the endpoint Could).

### B. Chat with Agent

B1 Real-time chat between a client and their assigned agent. Client, Agent. Must. 8 points. W, M. Screens: web/client-chat, mobile/client-chat, mobile/agent-chat, web/agent-dashboard (chat panel).
- A message from either side appears on the other side within 2 seconds without refreshing.
- A client can chat only with their assigned agent. Messages are text, 1 to 2,000 characters, empty ones cannot be sent.
- If the connection drops, the UI shows "reconnecting" and sends queued messages when back. Resending after reconnect creates one message, never a duplicate.
- A client with no agent (waiting) sees "You're waiting for an agent". Sending to the agent returns NO_AGENT_ASSIGNED; the AI chatbot still works.
- When an agent is assigned later, the existing conversation and any queued AI handoff summary become visible to the new agent.

B2 Agent sees assigned clients and their conversations. Agent. Must. 5 points. W, M. Screens: web/agent-dashboard, mobile/agent-home.
- The agent sees assigned clients with last message, time and unread count; clients not assigned never appear.
- Search or filter by client name. Selecting a client opens that conversation.

B3 Message history. Client, Agent. Must. 3 points. W, M, API.
- Past messages load when a chat opens, loading older ones on scroll up (page size 30). History survives logout and works on web and mobile.
- When a client is reassigned, the new agent sees the full history and the old agent loses access immediately.

B4 Escalate a chat to the manager. Agent. Should. 3 points. W, M. Screens: web/agent-dashboard, mobile/agent-chat, web/manager-escalations.
- The agent escalates with a required reason. The chat is marked Escalated and the client sees "A manager has been added to this chat".
- The agent's manager can read that conversation only while the escalation is Open. After Resolved the manager sees the metadata only. One Open escalation per conversation.
- The manager sees escalations with client, agent, reason, time and status, and can resolve them or reassign the client within the team (F2).

B5 Attachments in chat. Client, Agent. Could. 3 points. W, M. Not in the API contract yet.
- Image or PDF up to 5 MB; other types rejected. Access follows the chat rules. Left out until the team decides to build it.

### C. Policy and Estimate

C1 Create a policy estimate from inputs. Client. Must. 5 points. W, M. Screens: web/client-estimate, mobile/client-estimate.
- Inputs: age (18 to 65), coverage amount (₱500,000 to ₱20,000,000), term (10, 20 or 30 years). Out-of-range inputs are blocked with a clear message.
- The monthly premium follows the rule in section 6 and is recomputed by the server on every save.
- The screen shows a breakdown (base, adjustments, total). There is no reward discount anywhere (closed decision).

C2 Adjust inputs and see the premium update. Client. Must. 3 points. W, M.
- Changing an input updates the premium within 300 ms with no reload, using a local copy of the rule.
- The local and server results are identical for every shared test vector.

C3 Save and view past estimates. Client. Must. 3 points. W, M, API.
- "Save draft" stores the estimate. The list shows coverage, term, premium, date and status (Draft, Sent, Approved, Changes requested). A client sees only their own.
- Drafts can be reopened, edited or duplicated. Edits are allowed only in Draft or Changes requested.
- The stored premium and formula version never change when the admin changes rates later.

C4 Agent reviews an estimate and approves it into a policy. Agent. Must. 5 points. W, M. Screens: web/agent-dashboard, mobile/agent-review-estimate.
- The client sends a Draft to the agent (status Sent). A waiting client cannot send (NO_AGENT_ASSIGNED); saving still works.
- Only the assigned agent sees it under "Pending estimates". The agent can Approve or Request changes (note required). The client is told in chat and on the estimate.
- Approve creates one Active policy with a number (#INS-xxxx) and the full premium schedule. Approving twice returns the same policy. A policy exists only from an approved estimate.

C5 View policy details and premium payment schedule. Client. Should. 3 points. W, M. Screens: web/client-policy, mobile/client-policy.
- Shows policy number, type, coverage, term, status, beneficiaries (view only, sample data) and agent.
- The schedule lists due dates and amounts with Upcoming, Paid or Overdue. Each date is the original due date plus the reward extension (section 6). A premium whose extended date has passed is marked Overdue; there is no lapse.
- When an extension applies, a card says "Based on your Rewards activity" (client only). "Mark as paid" is a demo action and says it is simulated.

### D. Claims

D1 File a claim. Client. Should. 5 points. W, M. Screens: web/client-file-claim, mobile/client-file-claim.
- Steps: policy, details, documents, review. Types: Death, Critical illness, Disability.
- Required: own Active policy, type, event date (not in the future), amount requested (not above coverage), description. Documents are optional (names and sizes only).
- Save draft. Submit creates #CLM-xxxx with status Submitted.

D2 Track claim status. Client. Should. 3 points. W, M. Screens: web/client-claims, web/client-claim-details, mobile/client-claims, mobile/client-claim-details.
- Statuses: Submitted, Under review, Needs info, Approved, Paid, Rejected. The list shows chips, amount and date.
- Details show a timeline, documents and agent updates. "Needs info" lets the client reply.
- After approval the client sees the payout date (section 6) and, if a reward delay applies, "Based on your Rewards activity". The payout date is client-only.

D3 Agent reviews a claim and updates its status. Agent. Should. 5 points. W. Screens: web/agent-claims. Mobile: none (closed: web only).
- The agent sees claims of assigned clients only, filtered by status.
- Actions: start review, Approve (with approved amount not above requested), Request more info, Reject, Mark paid. A note is required for Request more info and Reject.
- Every change is recorded with who, when and note in the client's timeline.
- The agent sees the approved amount, approval date and status. The agent never sees a payout date or any reward field. Reward delays are applied by the system, never typed by the agent.

### E. AI chatbot

E1 AI chatbot for pre-purchase, in-policy and claim questions. Client. Must. 8 points. W, M. Screens: web/client-chat (AI tab), mobile/client-chat (AI toggle).
- The client switches between "Agent" and "AI assistant". The AI conversation is separate from the agent chat and labeled as an AI assistant.
- The bot answers general questions from a limited knowledge base (about 20 FAQ entries). It never receives the client's own policy, estimate or claim data and points to the relevant screen for personal details. English only.
- It gives no legal or financial advice, no exact personal premiums and no claim decisions. If it does not know, it says so and offers the agent. An output filter replaces replies that break these rules with a safe message.
- Chats are saved and visible only to the owning client, who can clear them. Limit: 20 messages per client per hour.
- If the AI provider is unavailable, canned answers matched by keyword are returned, so the demo still works; with no match, the bot says it cannot help and offers the agent. Gemini is the proposed provider behind a replaceable interface.
- A waiting client can use the chatbot.

E2 Chatbot hands off to the client's agent. Client. Should. 3 points. W, M.
- "Talk to my agent", or two "I don't know" answers in a row, sends a short summary as a Handoff message into the agent chat. The agent sees only that summary, never the AI transcript.
- If the client has no agent yet, the summary waits in the conversation and the client sees "You're waiting for an agent". The agent sees it once assigned.

### F. Dashboards

F1 Agent dashboard. Agent. Must. 5 points. W, M. Screens: web/agent-dashboard, mobile/agent-home.
- Shows assigned clients, open chats (unread) and pending estimates; counts match the lists.
- An Available/Away toggle sets the agent's availability (A4).
- Claims to review appear when D3 is built.

F2 Manager dashboard. Manager. Should. 5 points. W. Screens: web/manager-dashboard, web/manager-escalations.
- Shows team agents with client counts, open chats, availability and client limit (editable for own team), and the number of waiting clients. Own team only.
- A bell shows in-app notifications (for example "A client is waiting for an agent").
- Escalations list (B4). Reassigning a client works only to an agent in the same team, with a confirm step; outside the team returns 403.
- No access to non-escalated chat content or to reward status.

F3 Admin dashboard and policy settings. Admin. Should. 5 points. W. Screens: web/admin-console, web/admin-accounts.
- System-wide counts: accounts by role, active policies, open claims, estimates by status, waiting clients. Counts only, never chat content.
- Policy settings (all sample values, editable): estimate rate factors, reward rules (daily point bands, level thresholds, extension days, delay days, the "Apply reward effects" switch), standard claim processing days (default 7), default max clients per agent (default 10).
- A rate change creates a new formula version and applies to new estimates only.
- Demo only, clearly labeled: "Close period now". A bell shows notifications.

F4 Client dashboard. Client. Must. 3 points. W, M. Screens: web/client-dashboard, mobile/client-dashboard.
- First screen after login. Shows the active policy summary, the assigned agent with a Chat action, latest estimates and open claims.
- Sprint 2 builds a basic version; Sprint 3 completes the summaries.
- A new client without a policy sees an empty state pointing to Estimate. A waiting client sees a banner "You're waiting for an agent".

### G. Rewards app (separate mobile app, own back end and database)

G1 Sign in as [Client name] (SSO) or with email and password. Client. Must. 8 points. R, API. Screens: rewards/signin, rewards/client-only-access.
- If the client is signed in to the main mobile app on the same device, the Rewards app shows "Sign in as [Client name]". Confirming completes sign-in with a token only; the Rewards app never receives the password.
- Otherwise the client signs in with the same email and password.
- Tokens expire. Logging out of the main app ends an SSO-linked Rewards session.
- Agent, Manager or Admin accounts get the client-only screen. The Rewards back end stores no passwords.

G2 Record daily steps using sample data. Client. Must. 3 points. R. Screens: rewards/home.
- Daily steps come from the phone sensor or a sample data source. "Use sample data" is always available and labeled demo-only.
- Daily points follow the rule in section 6 (0, 10, 20 or 30). A day can be edited until midnight, then it is locked (409 with a friendly message).
- Steps are the only input. There are no custom goals, streaks or milestones.

G3 Monthly points, level and progress. Client. Must. 5 points. R. Screens: rewards/home, rewards/status (see spec 06; the older health-score, goals-rewards and effect screens merge into it).
- The client sees today's steps and points, month points, current level (Bronze, Silver, Gold, Platinum), points to the next level and weekly bars. Points reset each month.
- The "goal" is the next level. The screen explains the current effect in plain words ("Your Gold level gives you 14 extra days to pay each premium and delays claim payouts by 5 days").

G4 Send reward results to the main system through the REST API. System. Must. 5 points. R, API. Screens: rewards/status (sync chip).
- The Rewards back end sends one result per client per period (client_id, period YYYY-MM, points, status) to POST /api/rewards/results with its service key, when a day closes, a status changes, or the demo "close period" action runs.
- Responses: 201 saved, 400 invalid body (for example points below 0, unknown status, a status that does not match the points), 401 missing or invalid key, 403 any user token (client, agent, manager, admin), 404 client not found.
- A resend for the same client and period replaces the earlier result. The earlier status stays in an append-only history so date lookups still work. Delivery retries on 5xx; 4xx is not retried.
- The Rewards back end cannot read or change policies or claims. The service key cannot call any other route, and client routes reject the service key.
- If the main system is down, the Rewards app shows "sync pending".
- Results are visible to the client only.

G5 Main system applies reward results to premium due dates and claim payout dates. System. Should. 5 points. W, M, R, API. Screens: rewards/status, web/client-policy, web/client-claim-details, mobile/client-policy, mobile/client-claim-details.
- Premium effect: each premium's effective due date is its due date plus the extension days of the status that applied on that due date. Nothing is stored on the policy, so a resent result changes nothing already passed.
- Claim effect: review is never slowed. On approval the payout date is the approval date plus the standard processing days plus the delay days of the status applied on the approval date. There is no reduction of any amount.
- A status applies from the day its result is saved until a later result replaces it. With no result, Bronze applies.
- Each applied effect is logged with the result that caused it. The client sees the reason; the agent sees only the approved amount, approval date and status.
- Screens that show reward effects carry "Simulated for this course demo". Demo only, labeled: "Close period now" and "Generate sample steps".

## 5. Design items not in the feature list
- Landing page (web/landing): static entry page. Its FAQ text seeds the AI knowledge base.
- F4 Client dashboard and A6 Forgot password are additions to the guide's list, added here so every screen and endpoint has a story.
- Client profile (web and mobile): name, notifications, security; covers A3 logout and A5.
- Beneficiaries on the policy screen: view only, sample data.
- Web states sheet (web/states): loading, error, 403, session expired, used by all stories (X2, X4).

## 6. Simplified rules (sample values; all editable by the Admin where noted)
These stand in for real actuarial and reward logic (guide section 9).

Estimate rule (spec 04 settings key estimate.rate, version v1):
- units = coverage / 1,000
- monthly premium = units x baseRate x ageFactor x termFactor, in whole centavos, round half up
- baseRate = 0.70; ageFactor = 1 + max(0, age - 25) x 0.032; termFactor = 1 + (termYears - 10) x 0.012
- Example: coverage 2,000,000, age 30, 20 years: 2,000 x 0.70 x 1.16 x 1.12 = 1,818.88 per month.
- Inputs: age 18 to 65, coverage 500,000 to 20,000,000, term 10, 20 or 30.
- Web, mobile and server must give identical results; a shared test-vector file proves it.

Daily points from steps (spec 04 settings key reward.rules): under 5,000 = 0; 5,000 to 7,999 = 10; 8,000 to 11,999 = 20; 12,000 or more = 30.

Levels from monthly points (reset each month) and their effects:
| Level | Monthly points | Premium due date extension | Claim payout delay |
|---|---|---|---|
| Bronze | 0 to 199 | none | none |
| Silver | 200 to 399 | +7 days | +3 days |
| Gold | 400 to 599 | +14 days | +5 days |
| Platinum | 600 and above | +21 days | +7 days |
Payout date = approval date + standard processing days (default 7) + level delay. Example: a Platinum client approved on day 0 is paid on day 14.

Other rules:
- "Extend the premium collection period" means more days to pay each due premium. The policy term does not get longer.
- A premium past its extended due date is shown as Overdue only. Grace periods and policy lapse are not simulated.
- A month ending is shown in the demo with "Close period now" and a sample-steps generator, both labeled demo-only. In the real flow a period closes automatically at month end.
- Delay only, never reduction. There is no premium discount.
- In real life, insurers pay valid claims as the contract and regulation require and do not link payouts to activity data. The Rewards effects are a course simulation and every screen that shows them says so.

## 7. Story points by priority and sprint
| Group | Stories | Points |
|---|---|---|
| Sprint 2 (Must core) | A1 5, A2 8, A3 3, A4 8, B1 8, B2 5, B3 3, C1 5, C2 3, C3 3, C4 5, F4 3 (basic) | 59 |
| Sprint 3 (Must) | E1 8, F1 5, G1 8, G2 3, G3 5, G4 5 | 34 |
| Should | A5 5, B4 3, C5 3, D1 5, D2 3, D3 5, E2 3, F2 5, F3 5, G5 5 | 42 |
| Could | A6 3, B5 3 | 6 |
| Total | 30 stories | 141 |
Must total: 93 points. Sprint 2 is the heaviest. Build the contract and Auth first, and move C4 to Sprint 3 if Sprint 2 slips. If time runs short, cut in this order: B5, A6, claims on mobile, G5 screens, manager reports, then the rest of the Should list.

## 8. Definition of Ready (a story can enter a sprint when)
- Acceptance criteria and screens are listed here and the spec is Approved.
- The API operations it needs are in the OpenAPI contract (spec 05) and marked with its story.
- The task file exists in specs/tasks with owned files, tests and an assigned agent (specs 01 and 07).

## 9. Decisions
Closed by the updated high-level logic and the team lead's answers:
- [D1, D2] Collection period means more days to pay each premium (+7, +14, +21). Payouts are delayed, never reduced. No premium discount.
- Four levels from monthly points; daily points 0, 10, 20, 30; steps are the only input. No custom goals or milestones.
- Standard claim processing is 7 days (Admin setting). Review is not slowed; only the payout date moves.
- A premium uses the status on its due date; a claim uses the status on its approval date. Append-only status history. Bronze applies when no result exists.
- Overdue only, no lapse. Demo buttons for a month ending. In-app notifications only.
- Automatic agent assignment with Available/Away and a client limit (default 10). Waiting clients are served oldest first. Admin and all managers are notified when no agent is available.
- A waiting client can use the chatbot, save estimates and browse; agent chat and sending an estimate wait for an agent.
- No agent specialty; all human agents are the same.
- Chatbot: general knowledge only, chats saved and private to the client, handoff by button or after two "I don't know" answers, canned fallback, English only, summary only to the agent. FAQ drafts are AI-assisted: log them and have a human check that none gives legal or financial advice.
- The result endpoint is POST /api/rewards/results (service key only). Agents never see the payout date.
- [D4] Agent claims review is web only. Manager and admin are web only.
- [D3] Forgot password is a Could (A6). The client dashboard is its own story (F4).
- Estimate formula stays the team's linear version (baseRate 0.70, example 1,818.88) so the data model and test vectors agree. Earlier idea of compounding age factors and a maturity-age rule is dropped; revisit only through a formula version change.

Still open:
- Gemini is proposed. The guide lists the chatbot technology as open, so update the guide once the team confirms.
- Which coding agents run cleanly and their quota (specs 01).
- Exact deadline (estimated about Jan 4, 2027) and whether a presentation or demo is required.
- B5 attachments: build or leave out.
- openapi.yaml is not in the repo yet. Task T014 writes it from spec 05.
- The Stitch screens still need edits listed in spec 06 section 7 (remove the discount line, rename the admin toggle, merge the Rewards screens, add waiting banners, availability toggle, notification bell).
