# 02 Product spec: stories, acceptance criteria, story points

Status: Draft v1 for team approval. Built from the project guide (feature list A1 to G5), the Stitch screens in design/stitch, and specs/00-constitution.md. Tech-stack-neutral: it says what the system does, not how.

## 1. How to read this
- Each story has an ID that matches the guide's feature list. Do not renumber.
- Priority: Must, Should, Could (from the guide). Points use 1, 2, 3, 5, 8 (one point is roughly a small, well-understood piece of work for one agent plus review).
- Surface: W = main web app, M = main mobile app, R = Rewards mobile app, API = back end only.
- Screens name the Stitch files that show the intended UI. Where "none" appears, the screen is a gap.
- Acceptance criteria are testable. Every criterion becomes a test or a manual check in the task files (spec 07).

## 2. Roles and what each can do (summary)
| Role | Can | Cannot |
|---|---|---|
| Client | Own profile, policies, estimates, claims; chat with own agent; AI chatbot; Rewards app | See anyone else's records |
| Agent | Assigned clients only: chat, review estimates, help with policies and claims, escalate a chat | See reward status; see unassigned clients; see other agents' clients |
| Manager | Own team's agents and those agents' clients: performance, reassign within team, escalated chats | Read non-escalated chats; see reward status; see other teams |
| Admin | All accounts and roles, create managers and agents, assign agents to managers, policy settings, system-wide reports | Read chat content |

## 3. Cross-cutting acceptance criteria (apply to every story)
- X1 Server-side access: the back end checks role and ownership on every request. A client-side hidden button is never the only protection.
- X2 Errors: a request without a valid token returns 401; a valid token without permission or ownership returns 403; a missing record returns 404. The UI shows the matching state from web/states.
- X3 Same account: one email and password works on web and mobile.
- X4 Feedback: every action shows a result (toast, status chip, or inline message) within 1 second, or a loading state if longer.
- X5 Responsive and accessible: touch targets at least 44px, text contrast AA, visible focus, readable on a 390px wide screen (Week 3 checklist: touch targets, contrast, thumb zone, feedback).
- X6 Sample data: seed accounts and records exist for every role so every screen can be demoed. No real personal data.
- X7 Simulated money: no real payment, underwriting or claims adjudication. Screens that show payment or payout say it is simulated.
- X8 Audit trail for AI use: AI-assisted work is logged in docs/ai-use-log.md.

## 4. Stories

### A. Accounts and access

A1 Register and log in with email and password. Client. Must. 5 points. W, M. Screens: web/client-register, web/client-login, mobile/register, mobile/sign-in.
As a client I want to create an account and log in so that I can use the system on web and mobile.
- Register needs full name, email, password, and agreement to terms. Email must be unique.
- Password rule: at least 8 characters with a letter and a number. A weak password shows a hint and is rejected.
- Successful registration creates a Client account and signs the user in.
- Login with correct credentials opens the client dashboard. Wrong credentials show a generic "email or password is incorrect" message (never says which).
- After 5 failed attempts in 10 minutes the account is blocked for 5 minutes with a clear message.
- Passwords are stored only as hashes in the Auth service.
- The same credentials work on web and mobile.

A2 Role-based access with the reports_to hierarchy. All. Must. 8 points. API (all surfaces). Screens: none (rules).
As the system I want every request checked by role and ownership so that each person sees only their own branch.
- Every user has one role (Admin, Manager, Agent, Client) and a reports_to reference. Client reports to an Agent, Agent to a Manager, Manager to the Admin.
- Each client has exactly one assigned agent.
- A client can read only their own records. An agent only their assigned clients. A manager only their team's agents and those agents' clients. An admin all accounts.
- Chat content is readable only by the client and their agent, plus the manager for escalated chats. No admin read access to chat content, including through reports.
- Agents and managers cannot read reward status or health score.
- A test matrix (role x endpoint x own/other record) exists and passes.

A3 Token-based session and logout. All. Must. 3 points. W, M, API. Screens: web/client-profile, mobile/client-profile, web/states.
As a user I want a session that expires and a logout so that my account stays safe.
- Login returns a short-lived access token and a longer refresh token.
- Expired token shows the "session expired, sign in again" state and returns to login.
- Logout ends the session on that device and invalidates the refresh token.
- Logout in the main app ends the Rewards session for the same account on the same device.
- "Sign out of all devices" invalidates all refresh tokens for the account.

A4 Admin creates manager and agent accounts and assigns agents to managers. Admin. Must. 5 points. W. Screens: web/admin-console, web/admin-accounts.
As an admin I want to create manager and agent accounts and set who reports to whom so that the hierarchy is correct.
- Admin can create a Manager (reports to Admin) and an Agent (must pick a manager).
- Admin can assign a client to an agent and move an agent to another manager.
- Only the Admin can create these roles. A manager or agent doing so gets 403.
- New staff accounts get a temporary password and must change it at first login.
- The account list shows name, role, reports to, status. Admin can deactivate an account; a deactivated user cannot log in.
- No chat content is shown anywhere in the admin screens.

A5 Biometric unlock on the device. Client, Agent. Should. 5 points. M. Screens: mobile/biometric-unlock, mobile/client-profile.
As a user I want to unlock the app with Face ID or fingerprint so that I do not retype my password every time.
- The user can turn biometric unlock on or off in Profile.
- When on, reopening the app asks for biometrics; success shows the app, with the stored session still valid.
- Failure, cancel, or no enrolled biometrics falls back to the password.
- No biometric data is sent to or stored on the server. The back end still verifies the token on every request.
- If the session has expired, biometrics alone do not sign the user in; the password is required.

A6 Forgot password (simulated reset). Client. Could. 3 points. W, M. Screens: "Forgot password?" link on web/client-login and mobile/sign-in; reset screen is a gap.
- The client enters their email and always sees the same message ("If this email exists, a reset link was sent"), so the system never reveals which emails are registered.
- In the demo the reset link is shown in a simulated inbox page instead of a real email. The link works once and expires in 15 minutes.
- Setting a new password follows the A1 password rule and ends all other sessions.

### B. Chat with Agent

B1 Real-time chat between a client and their assigned agent. Client, Agent. Must. 8 points. W, M. Screens: web/client-chat, mobile/client-chat, mobile/agent-chat, web/agent-dashboard (chat panel).
As a client I want to message my agent and get replies live so that I get human help quickly.
- A message sent by either side appears on the other side within 2 seconds without refreshing.
- A client can only chat with their assigned agent. Sending to anyone else is rejected.
- Messages show sender, time, and sent state. Typing indicator and online state are Could.
- Messages are text up to 2,000 characters. Empty messages cannot be sent.
- If the connection drops, the UI shows "reconnecting" and sends queued messages when back.
- Agent view has the same behavior for each assigned client.

B2 Agent sees assigned clients and their conversations. Agent. Must. 5 points. W, M. Screens: web/agent-dashboard, mobile/agent-home.
- The agent sees a list of assigned clients, each with last message, time, and unread count.
- Selecting a client opens that conversation. Clients not assigned to the agent never appear.
- Search or filter by client name.

B3 Message history. Client, Agent. Must. 3 points. W, M, API.
- Past messages load when a chat opens, oldest to newest, loading older ones on scroll up (page size 30).
- History survives logout and login and works on web and mobile for the same account.
- When a client is reassigned to a new agent, the new agent sees the existing history. The old agent loses access.

B4 Escalate a chat to the manager. Agent. Should. 3 points. W, M. Screens: web/agent-dashboard, mobile/agent-chat, web/manager-escalations.
- The agent chooses "Escalate" and adds a short reason. The chat is marked Escalated.
- Only then can the agent's manager read that conversation. Non-escalated chats stay hidden from the manager.
- The manager sees escalated chats with client, agent, reason, time, and status (Open, Resolved).
- The manager can mark it Resolved or reassign the client within the team (F2). The client sees a note that a manager is now involved.

B5 Attachments in chat. Client, Agent. Could. 3 points. W, M.
- A user can attach an image or PDF up to 5 MB. Other types are rejected.
- The recipient can open or download it. Access follows the same chat rules.

### C. Policy and Estimate

C1 Create a policy estimate from inputs. Client. Must. 5 points. W, M. Screens: web/client-estimate, mobile/client-estimate.
- Inputs: age (18 to 60), coverage amount (₱500,000 to ₱20,000,000), term (10, 20 or 30 years).
- Maturity age rule: age plus term must not exceed 70 (so a 30-year term is offered up to age 40). A combination that breaks it shows a clear message and suggests a shorter term.
- The premium is computed by the rule in section 6 and shown as monthly premium.
- Out-of-range inputs are blocked with a clear message.
- The screen shows a breakdown (base, adjustments, total). It shows no reward-based discount (see open decision D1).

C2 Adjust inputs and see the premium update. Client. Must. 3 points. W, M.
- Changing any input updates the premium immediately (under 300 ms, no page reload).
- The same inputs always give the same result on web, mobile, and the server.

C3 Save and view past estimates. Client. Must. 3 points. W, M, API.
- "Save draft" stores the estimate with a Draft status. The list shows coverage, term, monthly premium, date, and status (Draft, Sent, Approved, Changes requested).
- A client can reopen a draft to edit, or duplicate a past estimate. A client sees only their own.
- The computed premium is stored with the estimate, and the formula version, so old estimates do not change when rates change.

C4 Agent reviews an estimate and approves it into a policy. Agent. Must. 5 points. W, M. Screens: web/agent-dashboard, mobile/agent-review-estimate.
- The client sends a Draft to their agent (status Sent). Only the assigned agent sees it, in "Pending estimates".
- The agent can Approve or Request changes (note required). The client is notified in chat and on the estimate.
- Approve creates a Policy in Active status with a policy number (#INS-xxxx), coverage, term, premium, start date, and premium schedule (C5). Approving the same estimate twice does not create two policies.
- A policy can exist only from an approved estimate. Clients cannot create policies directly.
- After Changes requested the client can edit and resend.

C5 View policy details and premium payment schedule. Client. Should. 3 points. W, M. Screens: web/client-policy, mobile/client-policy.
- Shows policy number, type, coverage, term, status, beneficiaries (view only, sample data), and agent.
- Payment schedule lists due dates, amounts, and Paid or Upcoming status. Payments are simulated (X7); a "mark as paid" action is available for the demo.
- If a reward result extends the collection period, the schedule shows the extension and its reason (G5).

### D. Claims

D1 File a claim. Client. Should. 5 points. W, M. Screens: web/client-file-claim, mobile/client-file-claim.
- Steps: policy, details, documents, review. Claim types: Death, Critical illness, Disability.
- Required: policy (own, Active), type, date of event (not in the future), amount requested (not above coverage), description.
- Documents are optional file attachments (names and sizes stored; no real adjudication).
- Draft can be saved. Submit creates a claim #CLM-xxxx with status Submitted and tells the client who reviews it.

D2 Track claim status. Client. Should. 3 points. W, M. Screens: web/client-claims, web/client-claim-details, mobile/client-claims, mobile/client-claim-details.
- Statuses: Submitted, Under review, Needs info, Approved, Paid, Rejected. The list shows a status chip, amount, and date.
- Details show a timeline, documents, and agent updates. "Needs info" lets the client reply with text or a document.
- If a reward result delays or reduces the payout, the details show it as "Based on your Rewards activity" (G5).

D3 Agent reviews a claim and updates its status. Agent. Should. 5 points. W. Screens: web/agent-claims. Mobile: none (gap).
- The agent sees claims of assigned clients only, filtered by status.
- Decision actions: Approve, Request more info, Reject. A note is required for Request more info and Reject.
- Every status change is recorded with who, when, and note, and appears in the client's timeline.
- Agent screens show no reward data. The payout effect is applied by the Claims module, not entered by the agent.

### E. AI chatbot

E1 AI chatbot for pre-purchase, in-policy, and claim questions. Client. Must. 8 points. W, M. Screens: web/client-chat (AI tab), mobile/client-chat (AI toggle).
- The client can switch between "Agent" and "AI assistant" in the chat screen. The AI conversation is separate from the agent chat.
- The bot answers general questions from a limited knowledge base (how policies, estimates and claims work, FAQs from the landing page).
- It does not give legal or financial advice, quote exact personal premiums, or decide claims. For those it says so and offers the agent.
- If it does not know, it says so and offers the agent. It does not invent policy terms.
- It labels itself as an AI assistant.
- AI conversations are visible only to the client. Agents see them only if the client hands off (E2).
- If the AI service is unavailable, the UI shows a friendly message and the agent option stays available.

E2 Chatbot hands off to the client's agent. Client. Should. 3 points. W, M.
- A "Talk to my agent" action in the AI chat, or the bot suggesting it, creates a handoff message in the agent chat with a short summary of the AI conversation, visible to the agent.
- The client sees confirmation that the agent was notified. A client with no assigned agent sees a clear message.

### F. Dashboards

F1 Agent dashboard. Agent. Must. 5 points. W, M. Screens: web/agent-dashboard, mobile/agent-home.
- Shows assigned clients, open chats (unread), and pending estimates. Counts match the lists.
- Quick actions: open chat, review estimate.
- Claims to review appear when D3 is built.

F2 Manager dashboard. Manager. Should. 5 points. W. Screens: web/manager-dashboard, web/manager-escalations.
- Shows team agents with client counts and open chats. Only the manager's own team.
- Escalations list (B4). The manager can reassign a client to another agent in the same team, with a confirmation step. Reassigning outside the team is rejected.
- No access to non-escalated chat content or to reward status.

F3 Admin dashboard. Admin. Should. 5 points. W. Screens: web/admin-console, web/admin-accounts.
- System-wide counts: accounts by role, active policies, open claims, estimates by status, chats per day (counts only).
- Policy settings: the base rate and factors used by the estimate rule (section 6). A change applies only to new estimates (C3).
- No chat content is available anywhere.

F4 Client dashboard. Client. Must. 3 points. W, M. Screens: web/client-dashboard, mobile/client-dashboard.
- It is the first screen after login (A1). It shows the active policy summary, the assigned agent with a "Chat" action, the latest estimates, and open claims.
- Sprint 2 builds a basic version (greeting, agent card, links to Chat and Estimate). Sprint 3 completes the summaries as the other features land.
- A new client with no policy sees a friendly empty state that points to Estimate.

### G. Rewards app (separate mobile app, own back end and database)

G1 Sign in as [Client name] (SSO) or with email and password. Client. Must. 8 points. R, API. Screens: rewards/signin, rewards/client-only-access.
- If the client is signed in to the main mobile app on the same device, the Rewards app shows "Sign in as [Client name]". Confirming completes sign-in with a token only; the Rewards app never receives the password.
- Otherwise the client signs in with the same email and password.
- Tokens expire. Logging out of the main app ends the Rewards session.
- Agent, Manager, or Admin accounts are rejected with the client-only screen.
- The Rewards back end trusts tokens issued by the common Auth service and stores no passwords.

G2 Record daily steps using sample data. Client. Must. 3 points. R. Screens: rewards/home.
- Daily step count comes from the phone sensor or a sample data source; a "use sample data" mode is always available for the demo.
- Steps are saved per day to the Rewards database. A day can be updated until midnight, then locked.
- No wearable or third-party health integration.

G3 Step goals and reward progress. Client. Must. 5 points. R. Screens: rewards/home, rewards/health-score, rewards/goals-rewards.
- The client sees today's steps against the daily goal and weekly progress.
- A health score is shown with how it is calculated (section 6).
- Reward milestones (for example, 7 days in a row) show progress and when they unlock.

G4 Send reward results to the main system through the REST API. System. Must. 5 points. R, API. Screens: rewards/health-score (sync status).
- The Rewards back end sends a reward result per client (health score and reward status) to the main system's REST API, authenticated as a service.
- Sent when a day closes or a milestone changes. Retries on failure; the same result sent twice has no extra effect (idempotent).
- The main system rejects results for unknown clients or with invalid values.
- The Rewards back end cannot read or change policies or claims directly.
- Results are visible to the client only, never to agents or managers.

G5 Main system applies reward results to premium collection and claims payouts. System. Should. 5 points. W, M, R, API. Screens: rewards/effect, web/client-policy, web/client-claim-details, mobile/client-policy, mobile/client-claim-details.
- When a reward result meets the rule (section 6), the Policy module extends the premium collection period; the schedule and the client's Rewards effect screen show it.
- When a claim is approved, the Claims module delays the payout release date by the rule (delay only; see decision D2). Approval itself is never changed by reward results. The client sees the reason; the agent sees only the release date and status, with no reward reason.
- Screens that show a reward effect carry a note: "Simulated for this course demo."
- The effect is calculated by the main system, not the Rewards app. Every effect is logged with the result that caused it.
- No reward-based discount on the premium (decision D1).

## 5. Design items not in the feature list
- Landing page (web/landing): a static marketing and portal-entry page. Must-lite: it is the demo entry point. No account needed. Its FAQ text is also the AI knowledge base seed.
- Client dashboard: now story F4.
- Client profile (web/client-profile, mobile/client-profile): name and email edit, notifications, security. Covers A3 logout and A5. Not a separate feature.
- "Forgot password?" appears on login screens: now story A6 (Could).
- Beneficiaries on the policy screen: view-only sample data. No editing.
- Web states sheet (web/states): loading, error, 403, session expired states used by all stories (X2, X4).

## 6. Simplified rules (proposed; sample rates only)
These stand in for real actuarial and reward logic (guide section 9). Admin settings (F3) can change the base values. Needs team approval.

Estimate rule (adapted from the groupmate's calculator in legacy/frontend-draft/src/utils/premiumCalculator.js, with the reward discount and health-tier inputs removed):
- units = coverage amount / 1,000
- monthly premium = units x baseRate x ageFactor x termFactor, rounded to 2 decimals
- baseRate = 0.65 per 1,000 per month (admin setting)
- ageFactor = 1.05 raised to max(0, age - 25). Cost of cover rises faster as people get older, so it compounds instead of growing in a straight line (the old draft used a straight line).
- termFactor = 1 + (termYears - 10) x 0.012
- Example: coverage 2,000,000, age 30, 20 years: 2000 x 0.65 x 1.2763 x 1.12 = 1,858.27 per month, close to the 1,850 shown in the Stitch mockup.
- Issue rules: age 18 to 60, age plus term at most 70, coverage 500,000 to 20,000,000. Real insurers also check income and health (underwriting); out of scope here.

Health score (Rewards app): 0 to 100, from the last 30 days: share of days the step goal was met (70 percent weight) and average steps against goal, capped (30 percent weight). Default daily goal 8,000 steps.

Reward status and effects:
| Reward status | Rule | Policy effect | Claims effect |
|---|---|---|---|
| Bronze | score under 50 | none | none |
| Silver | score 50 to 74 | premium collection period extended by 15 days | payout delayed 7 days |
| Gold | score 75 or more | premium collection period extended by 30 days | payout delayed 14 days |
The extension and delay values are placeholders. Payouts are delayed only, never reduced (decision D2). What "extend the premium collection period" means exactly is the first question for the team (Q1 in section 9).

## 7. Story points by priority and sprint
Sprint plan follows the guide: Sprint 2 builds core (A1 to A4, B1 to B3, C1 to C4), Sprint 3 builds E1, F1, G1 to G4, Sprint 4 finalizes. Should and Could stories are built after Must stories if time allows, otherwise delivered as designed screens.

| Group | Stories | Points |
|---|---|---|
| Sprint 2 (Must core) | A1 5, A2 8, A3 3, A4 5, B1 8, B2 5, B3 3, C1 5, C2 3, C3 3, C4 5, F4 3 (basic) | 56 |
| Sprint 3 (Must) | E1 8, F1 5, G1 8, G2 3, G3 5, G4 5 | 34 |
| Should | A5 5, B4 3, C5 3, D1 5, D2 3, D3 5, E2 3, F2 5, F3 5, G5 5 | 42 |
| Could | A6 3, B5 3 | 6 |
| Total | 30 stories | 138 |
Must total: 90 points. Sprint 2 is the heaviest: build the Auth service and the API contract first, and move C4 to Sprint 3 if Sprint 2 slips.

## 8. Definition of Ready (a story can enter a sprint when)
- Acceptance criteria and screens are listed here and the spec is Approved.
- The API calls it needs are in the OpenAPI contract (spec 05).
- The task file exists in specs/tasks with owned files, tests, and an assigned agent tier (spec 01).

## 9. Decisions

Decided by the team lead's delegate (Claude, acting as insurance-domain and full-stack lead). Change any of these by editing this section.

- D1 No reward discount. Remove the "Step Rewards" discount line from the estimate screen and rename the admin toggle "Auto-apply Step Rewards discount" to "Apply reward effects". Reason: the guide defines the reward effect as collection period and payout timing only. A premium discount is a pricing and underwriting decision, and the estimate must stay a pure function of age, coverage and term so it is explainable and testable. This is a design edit in Stitch (web/client-estimate, web/admin-console).
- D2 Payouts are delayed only, never reduced. Reason: in a real policy, the benefit amount is fixed by the contract. Changing the amount based on a wellness score would not be defensible, while a release-date delay is a simple demo mechanism. The guide says "delay or reduce", so delay alone satisfies it. Reduction is not built. Approval decisions are never changed by reward results.
- D3 Forgot password is included as story A6 (Could, simulated reset page instead of a real email). Reason: any real login system needs it, and the login screens already show the link.
- D4 Agent claims review is web only (D3 story). Reason: reviewing documents and writing decision notes is desktop work. The agent's mobile app covers chat, estimate review and the client list.
- D5 The client dashboard is its own story F4 (Must, 3 points). Reason: it is the screen shown after login.
- D6 Rates and thresholds in section 6 are accepted as sample values, pending the team's answers below. The estimate rule is a pure function in one shared place so changing a rate never touches screens.
- D7 Real-world note. In real life, insurers pay valid claims as the contract and regulation require, and do not link payouts to activity data. The Rewards effects are a course simulation. The documentation and the demo labels must say so ("Simulated for this course demo").

Questions to confirm with the team and the professor
- Q1 What does "extend the premium collection period" mean: the client gets more days to pay a due premium (a longer grace period), or the insurer keeps collecting premiums for more months or years? The spec currently treats it as extra days on the schedule; it must match the course brief.
- Q2 Does the professor require payout reduction, or is delay enough?
- Q3 Did the professor give sample rates, a formula, or required estimate inputs (for example smoker or gender)?
- Q4 Which health data counts: steps only, or also other measures? Is 8,000 steps a day an acceptable default goal?
- Q5 Are three reward levels (Bronze, Silver, Gold) fine, and are the 50 and 75 score thresholds acceptable?
- Q6 Was the premium discount in the estimate mockup intentional? (D1 removes it.)
- Q7 Exact deadline, and is a presentation or demo required?
