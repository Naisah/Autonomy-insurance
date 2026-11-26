# Decisions log

Status: Nov 26, 2026 (task P0.2, docs/implementation-plan.md section 3). Owner: Atlas. The team lead asked Atlas to decide every open item on their behalf; specs 00 to 07 are Approved on that basis.

One table of every decision ID in specs 01 to 07, so agents read one file instead of seven. This log records; it does not decide. The spec text is the source: if this file and a spec disagree, the spec wins and this file is fixed.

How to read it:
- **Decided**: closed in the spec itself, or answered by the team in docs/implementation-plan.md section 11, or done by the owner (noted in the answer).
- **Open**: left for the team because it changes what users get or how the course grades it.
- **Retired**: listed in the P0.2 scope but defined by no spec.
- "Q" numbers refer to the questions in docs/implementation-plan.md section 11.

## Decision table

### C series (spec 05 API contract, section 4)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| C1 | 05 s4 | Separate staff routes (`/agent/claims`, `/agent/estimates`, `/agent/clients/{id}/policies`) vs client routes, so reward fields stay out of staff responses by type? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| C2 | 05 s4 | One `/dashboard` route with a per-role shape (discriminated by `role`), or four routes? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| C3 | 05 s4 | Compute the estimate premium on the client for live updates and on the server on every write, with `POST /estimates/preview` for comparison? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| C4 | 05 s4 | One claim decision operation with `action` (StartReview, Approve, RequestInfo, Reject, MarkPaid); server computes payout date; agent response never has it? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| C5 | 05 s4 | Admin uses auth `/users` routes; Manager reassign lives in core-api and calls auth `/internal/users/{id}/reports-to` (auth single writer of reports_to)? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| C6 | 05 s4 | Rewards app reads status and effect text via rewards-api, which uses a scoped service key (`reward:read-effects`); Rewards token audience `rewards-api` only; results endpoint service-key only? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| C7 | 05 s4 | `Idempotency-Key` on approve, submit and decision; reward results replace instead (one per client per period)? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| C8 | 05 s4 | One `Error` shape with the listed codes mapped to the states sheet; results endpoint answers 201/400/401/403/404? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |

### A series (spec 03 architecture, section 15)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| A1 | 03 s15 | Manager reads an escalated thread only while the escalation is Open (alternative: keep access after Resolved)? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| A2 | 03 s15 | core-api keeps a directory projection synced by auth events instead of calling auth per request? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| A3 | 03 s15 | SSO with PKCE and deep links between the two apps, with a system-browser fallback? | Decided | Accepted, with the fallback changed: email and password login in the Rewards app; no system-browser page (Q9) | Atlas for the team lead, Nov 26 |
| A4 | 03 s15 | Web refresh token in httpOnly cookie; mobile in secure storage? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| A5 | 03 s15 | Return 404 (not 403) for other users' records where existence would leak? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| A6 | 03 s15 | Integer-centavo calculation with a shared test-vector file for TS and Dart? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| A7 | 03 s15 | Assignment lives in auth (single writer of `reports_to`), triggered by registration, availability change, limit change and agent creation? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| A8 | 03 s15 | Status history append-only; premiums use the status on the due date, claims the status on the approval date? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| A9 | 03 s15 | Notifications in-app only (`notifications` table in core-api), no email or push? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |

### M series (spec 04 data model, section 8)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| M1 | 04 s8 | Auto-assign clients to the Available agent under limit with the fewest clients, else wait and notify Admin and managers (alternative: Admin assigns by hand)? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| M2 | 04 s8 | Generate the full policy schedule at approval (up to 360 rows) rather than on demand? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| M3 | 04 s8 | Store no extension on the policy; read it from `reward_status_history` on each due date? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| M4 | 04 s8 | Claim documents store names and sizes only; real file storage out of scope unless approved? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| M5 | 04 s8 | Manager thread access ends when the escalation is Resolved (matches A1)? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| M6 | 04 s8 | Money as numeric(14,2) plus the shared premium test-vector file? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| M7 | 04 s8 | Status history as a separate append-only table, so a resent result replaces the current one without losing date lookups? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| M8 | 04 s8 | Notifications as an in-app table only? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |

### S series (spec 06 screen specs, section 8)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| S1 | 06 s8 | Web profile shows biometrics as information only; the toggle lives on mobile? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| S2 | 06 s8 | Mobile apps cover Client and Agent only; Manager and Admin web only? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| S3 | 06 s8 | Client dashboard needs no endpoint beyond `/dashboard` (extra fields go into `ClientDashboard` first)? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| S4 | 06 s8 | A screen that needs something the contract lacks waits for a contract change, never an ad hoc call? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| S5 | 06 s8 | Rewards app has four screens; the goal is the next level; custom goals and milestones dropped? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| S6 | 06 s8 | Agents never see the claim payout date; only the client does? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| S7 | 06 s8 | A waiting client can use the chatbot, save estimates and browse; agent chat and sending an estimate wait for an agent? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |

### K series (spec 07 task breakdown, section 10)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| K1 | 07 s10 | Task sizes and tier caps as listed? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| K2 | 07 s10 | Glob-based route loading so parallel agents never edit the same router file? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| K3 | 07 s10 | T042 (AI chat) is T2 with a Tier A review rather than T1? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| K4 | 07 s10 | Claims on mobile (T088) and effect text on the Rewards status screen (T103) are first to drop if time runs out? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| K5 | 07 s10 | Owner does GitHub branch protection (T000) themselves? | Decided | Done by the owner on Nov 26, 2026: `main` protected, PR plus 1 approval, no force push (P0.6) | Owner |
| K6 | 07 s10 | T014 creates openapi.yaml from spec 05 because the file did not exist? | Decided | Q8: T014 starts from the existing draft in packages/contracts/openapi.yaml (see its README). Spec 07 K6 updated to match | Team lead |
| K7 | 07 s10 | Assignment and the waiting queue live in auth (T026, T027) because auth is the single writer of reports_to? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| K8 | 07 s10 | Rewards app has four screens (sign-in, client-only, home, status); T104 merged into T103? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |

### R series (spec 01 agent roster, section 9)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| R1 | 01 s9 | Tier assignments in section 1 (proposed, tuned after week one)? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| R2 | 01 s9 | Antigravity reserve rule (70 percent cap before Sprint 3 T1 tasks)? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| R3 | 01 s9 | Protect `main` and require pull requests even though the team is small? | Decided | Done by the owner on Nov 26, 2026: PR plus 1 approval, no force push (P0.6) | Owner |
| R4 | 01 s9 | Drop agents with failed updates rather than repair them? | Decided | Accepted as proposed | Atlas for the team lead, Nov 26 |
| R5 | 01 s9 | Add `docs/agent-log.md` as a per-task record? | Decided | Accepted as proposed (the file already exists) | Atlas for the team lead, Nov 26 |
| R6 | 01 s9 | The specialty column is a starting guess, tuned after the trial test (section 8)? | Decided | Accepted as proposed; tuned by P0.7 | Atlas for the team lead, Nov 26 |
| R7 | 01 s9 | Human review by a group member required in addition to any agent review? | Decided | Accepted as proposed: every PR gets an agent review, then a random group member (Q4) | Atlas for the team lead, Nov 26 |

### D series (spec 02 section 9, spec 03 section 15, spec 05 section 7)
The D IDs come from an earlier decision list that is not in the repo. Specs 02, 03 and 05 cite them; the question text below is taken from those citations.

| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| D1 | 02 s9, 03 s15, 05 s7 | Does the collection period give a premium discount? | Decided | No discount. Collection period means more days to pay each premium (+7, +14, +21). No discount field anywhere; admin toggle is `applyEffects` | Team lead |
| D2 | 02 s9, 03 s15, 05 s7 | Are payouts reduced or only delayed? | Decided | Delayed, never reduced. `payoutReductionPercent` removed | Team lead |
| D3 | 02 s9, 05 s5 and s7 | Is forgot password in scope? | Decided | Could (A6). Leave unbuilt unless approved. Client dashboard is its own story (F4) | Team lead |
| D4 | 02 s9, 05 s7 | Is agent claims review on mobile? | Decided | Web only for now; endpoints stay the same for a future mobile screen. Manager and admin web only | Team lead |
| D5 | none | Not defined in specs 01 to 07 | Retired | No spec defines it; ID retired so it is never reused | Atlas for the team lead, Nov 26 |
| D6 | 03 s15 | Where do reward rules live? | Decided | In `settings` (rules in settings) | Team lead |
| D7 | none | Not defined in specs 01 to 07 | Retired | No spec defines it; ID retired so it is never reused | Atlas for the team lead, Nov 26 |

Totals: 54 IDs. Decided 52. Retired 2 (D5, D7).

## Other team questions (docs/implementation-plan.md section 11, and gaps found in P0.2 and P0.5)
| ID | Question | Status | Answer | Owner | Specs updated |
|---|---|---|---|---|---|
| Q5 | Build missing screen states without new Stitch exports? | Decided | Yes: from spec 06 and design/design-system.md | Atlas for the team lead, Nov 26 | 02 s9, 06 s8 |
| Q6 | Time zone | Decided (team) | Asia/Manila business dates, UTC timestamps | Team lead | 03 s12, 04 s1 |
| Q7 | Dart client generator | Decided | Pure-Dart `swagger_parser`, run inside packages/dart_shared (T080); no Java | Atlas for the team lead, Nov 26 | implementation plan s11 |
| Q9 | SSO system-browser fallback | Decided | Dropped. Fallback is email and password login in the Rewards app | Atlas for the team lead, Nov 26 | 03 s9.1 and s15 |
| Q10 | Sample steps enough for the demo? | Decided | Yes; no real phone required | Atlas for the team lead, Nov 26 | 02 s9 |
| Q11 | Shared server code | Decided | Copy per service; no shared package | Atlas for the team lead, Nov 26 | 03 s12 |
| Q12 | Admin "Close period now" | Decided | Keep it in the admin console (spec 02 F3); core-api calls rewards-api with a service token scoped `rewards:close-period` | Atlas for the team lead, Nov 26 | 03 s9, 05 s8 |
| Q13 | Chatbot provider and key | Decided in part | Gemini behind `AiProvider`; free tier is enough because tests use the fake provider. Key owner is a team fact still needed | Atlas for the team lead, Nov 26 | 02 s9 |
| PG | Postgres version | Decided | PostgreSQL 16 | Atlas for the team lead, Nov 26 | 00 s4 |
| ST | Service token lifetime | Decided | RS256, 15 minutes, audience of the target service, `scope` claim, no refresh | Atlas for the team lead, Nov 26 | 03 s4 |
| B5 | Chat attachments: build or leave out? | Open | Recommended: leave out (spec 07 already cuts it first) | Team lead | none |
| DEMO | Does the course require a live demo or presentation, and in what form? | Open | | Team lead | none |

## What is still open
Specs 00 to 07 are Approved. These stay with the team:
- **B5 attachments** (product and grading): build them or leave them out? It is a story in the course feature list.
- **Demo or presentation** (grading): is one required, and in what form?
- Team facts, not decisions: who owns the Gemini API key (Q13), Orca quotas (P0.8, Q14), which laptop runs Docker and the emulator for the demo.
