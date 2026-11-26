# Decisions log

Status: Draft, Nov 26, 2026 (task P0.2, docs/implementation-plan.md section 3). Owner: Atlas.

One table of every decision ID in specs 01 to 07, so agents read one file instead of seven. This log records; it does not decide. The spec text is the source: if this file and a spec disagree, the spec wins and this file is fixed.

How to read it:
- **Decided**: closed in the spec itself, or answered by the team in docs/implementation-plan.md section 11, or done by the owner (noted in the answer).
- **Needs approval**: proposed in the spec, not yet confirmed. The owner is who must approve it (P0.1).
- **Not found**: the ID is listed in the P0.2 scope but no spec 01 to 07 defines it.
- "Q" numbers refer to the questions in docs/implementation-plan.md section 11.
- No spec is marked Approved by this log. That is P0.1 (team lead).

## Decision table

### C series (spec 05 API contract, section 4)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| C1 | 05 s4 | Separate staff routes (`/agent/claims`, `/agent/estimates`, `/agent/clients/{id}/policies`) vs client routes, so reward fields stay out of staff responses by type? | Needs approval | | Team lead |
| C2 | 05 s4 | One `/dashboard` route with a per-role shape (discriminated by `role`), or four routes? | Needs approval | | Team lead |
| C3 | 05 s4 | Compute the estimate premium on the client for live updates and on the server on every write, with `POST /estimates/preview` for comparison? | Needs approval | | Team lead |
| C4 | 05 s4 | One claim decision operation with `action` (StartReview, Approve, RequestInfo, Reject, MarkPaid); server computes payout date; agent response never has it? | Needs approval | | Team lead |
| C5 | 05 s4 | Admin uses auth `/users` routes; Manager reassign lives in core-api and calls auth `/internal/users/{id}/reports-to` (auth single writer of reports_to)? | Needs approval | | Team lead |
| C6 | 05 s4 | Rewards app reads status and effect text via rewards-api, which uses a scoped service key (`reward:read-effects`); Rewards token audience `rewards-api` only; results endpoint service-key only? | Needs approval | | Team lead |
| C7 | 05 s4 | `Idempotency-Key` on approve, submit and decision; reward results replace instead (one per client per period)? | Needs approval | | Team lead |
| C8 | 05 s4 | One `Error` shape with the listed codes mapped to the states sheet; results endpoint answers 201/400/401/403/404? | Needs approval | | Team lead |

### A series (spec 03 architecture, section 15)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| A1 | 03 s15 | Manager reads an escalated thread only while the escalation is Open (alternative: keep access after Resolved)? | Needs approval | | Team lead |
| A2 | 03 s15 | core-api keeps a directory projection synced by auth events instead of calling auth per request? | Needs approval | | Team lead |
| A3 | 03 s15 | SSO with PKCE and deep links between the two apps, with a system-browser fallback? | Needs approval | Fallback part is open as Q9 | Team lead (Q9) |
| A4 | 03 s15 | Web refresh token in httpOnly cookie; mobile in secure storage? | Needs approval | | Team lead |
| A5 | 03 s15 | Return 404 (not 403) for other users' records where existence would leak? | Needs approval | | Team lead |
| A6 | 03 s15 | Integer-centavo calculation with a shared test-vector file for TS and Dart? | Needs approval | | Team lead |
| A7 | 03 s15 | Assignment lives in auth (single writer of `reports_to`), triggered by registration, availability change, limit change and agent creation? | Needs approval | | Team lead |
| A8 | 03 s15 | Status history append-only; premiums use the status on the due date, claims the status on the approval date? | Needs approval | | Team lead |
| A9 | 03 s15 | Notifications in-app only (`notifications` table in core-api), no email or push? | Needs approval | | Team lead |

### M series (spec 04 data model, section 8)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| M1 | 04 s8 | Auto-assign clients to the Available agent under limit with the fewest clients, else wait and notify Admin and managers (alternative: Admin assigns by hand)? | Needs approval | | Team lead |
| M2 | 04 s8 | Generate the full policy schedule at approval (up to 360 rows) rather than on demand? | Needs approval | | Team lead |
| M3 | 04 s8 | Store no extension on the policy; read it from `reward_status_history` on each due date? | Needs approval | | Team lead |
| M4 | 04 s8 | Claim documents store names and sizes only; real file storage out of scope unless approved? | Needs approval | | Team lead |
| M5 | 04 s8 | Manager thread access ends when the escalation is Resolved (matches A1)? | Needs approval | | Team lead |
| M6 | 04 s8 | Money as numeric(14,2) plus the shared premium test-vector file? | Needs approval | | Team lead |
| M7 | 04 s8 | Status history as a separate append-only table, so a resent result replaces the current one without losing date lookups? | Needs approval | | Team lead |
| M8 | 04 s8 | Notifications as an in-app table only? | Needs approval | | Team lead |

### S series (spec 06 screen specs, section 8)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| S1 | 06 s8 | Web profile shows biometrics as information only; the toggle lives on mobile? | Needs approval | | Team lead |
| S2 | 06 s8 | Mobile apps cover Client and Agent only; Manager and Admin web only? | Needs approval | | Team lead |
| S3 | 06 s8 | Client dashboard needs no endpoint beyond `/dashboard` (extra fields go into `ClientDashboard` first)? | Needs approval | | Team lead |
| S4 | 06 s8 | A screen that needs something the contract lacks waits for a contract change, never an ad hoc call? | Needs approval | | Team lead |
| S5 | 06 s8 | Rewards app has four screens; the goal is the next level; custom goals and milestones dropped? | Needs approval | | Team lead |
| S6 | 06 s8 | Agents never see the claim payout date; only the client does? | Needs approval | | Team lead |
| S7 | 06 s8 | A waiting client can use the chatbot, save estimates and browse; agent chat and sending an estimate wait for an agent? | Needs approval | | Team lead |

### K series (spec 07 task breakdown, section 10)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| K1 | 07 s10 | Task sizes and tier caps as listed? | Needs approval | | Team lead |
| K2 | 07 s10 | Glob-based route loading so parallel agents never edit the same router file? | Needs approval | | Team lead |
| K3 | 07 s10 | T042 (AI chat) is T2 with a Tier A review rather than T1? | Needs approval | | Team lead |
| K4 | 07 s10 | Claims on mobile (T088) and effect text on the Rewards status screen (T103) are first to drop if time runs out? | Needs approval | | Team lead |
| K5 | 07 s10 | Owner does GitHub branch protection (T000) themselves? | Decided | Done by the owner on Nov 26, 2026: `main` protected, PR plus 1 approval, no force push (P0.6) | Owner |
| K6 | 07 s10 | T014 creates openapi.yaml from spec 05 because the file did not exist? | Decided | Q8: T014 starts from the existing draft in packages/contracts/openapi.yaml (see its README). Spec 07 wording is out of date | Team lead |
| K7 | 07 s10 | Assignment and the waiting queue live in auth (T026, T027) because auth is the single writer of reports_to? | Needs approval | | Team lead |
| K8 | 07 s10 | Rewards app has four screens (sign-in, client-only, home, status); T104 merged into T103? | Needs approval | | Team lead |

### R series (spec 01 agent roster, section 9)
| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| R1 | 01 s9 | Tier assignments in section 1 (proposed, tuned after week one)? | Needs approval | | Team lead |
| R2 | 01 s9 | Antigravity reserve rule (70 percent cap before Sprint 3 T1 tasks)? | Needs approval | | Team lead |
| R3 | 01 s9 | Protect `main` and require pull requests even though the team is small? | Decided | Done by the owner on Nov 26, 2026: PR plus 1 approval, no force push (P0.6) | Owner |
| R4 | 01 s9 | Drop agents with failed updates rather than repair them? | Needs approval | | Team lead |
| R5 | 01 s9 | Add `docs/agent-log.md` as a per-task record? | Needs approval | File exists in the repo; the rule itself is not confirmed | Team lead |
| R6 | 01 s9 | The specialty column is a starting guess, tuned after the trial test (section 8)? | Needs approval | Tuned by P0.7 | Team lead |
| R7 | 01 s9 | Human review by a group member required in addition to any agent review? | Needs approval | Q4 says human reviewers are picked at random per PR; it does not confirm R7 itself | Team lead |

### D series (spec 02 section 9, spec 03 section 15, spec 05 section 7)
The D IDs come from an earlier decision list that is not in the repo. Specs 02, 03 and 05 cite them; the question text below is taken from those citations.

| ID | Spec, section | Question | Status | Answer (if decided) | Owner |
|---|---|---|---|---|---|
| D1 | 02 s9, 03 s15, 05 s7 | Does the collection period give a premium discount? | Decided | No discount. Collection period means more days to pay each premium (+7, +14, +21). No discount field anywhere; admin toggle is `applyEffects` | Team lead |
| D2 | 02 s9, 03 s15, 05 s7 | Are payouts reduced or only delayed? | Decided | Delayed, never reduced. `payoutReductionPercent` removed | Team lead |
| D3 | 02 s9, 05 s5 and s7 | Is forgot password in scope? | Decided | Could (A6). Leave unbuilt unless approved. Client dashboard is its own story (F4) | Team lead |
| D4 | 02 s9, 05 s7 | Is agent claims review on mobile? | Decided | Web only for now; endpoints stay the same for a future mobile screen. Manager and admin web only | Team lead |
| D5 | none | Not defined in specs 01 to 07 | Not found | | Team lead (confirm the ID or retire it) |
| D6 | 03 s15 | Where do reward rules live? | Decided | In `settings` (rules in settings) | Team lead |
| D7 | none | Not defined in specs 01 to 07 | Not found | | Team lead (confirm the ID or retire it) |

Totals: 54 IDs. Decided 8 (K5, K6, R3, D1, D2, D3, D4, D6). Needs approval 44. Not found 2 (D5, D7).

## What still blocks each spec from Approved
Taken from each spec's own open list and docs/implementation-plan.md sections 9 to 11. Approval itself is P0.1.

**Spec 01 Agent roster**
- R1, R2, R4, R5, R6, R7 need approval.
- Quota column is empty (P0.8, Q14).
- Tiers and specialties wait for the Orca trial (P0.7).

**Spec 02 Product spec**
- Chatbot technology: Gemini is proposed, not confirmed; key owner and free tier (Q13).
- B5 attachments: build or leave out.
- Presentation or demo requirement is not stated (deadline itself answered by Q2: Jan 4, 2027).
- "openapi.yaml is not in the repo yet" is out of date (draft exists, Q8); line needs a fix.
- Stitch edits listed in spec 06 section 7 still pending; Q5 decides if agents build missing states without new exports.

**Spec 03 Architecture**
- A1 to A9 need approval.
- A3 fallback depends on Q9.
- Time zone (Asia/Manila business dates, UTC timestamps, Q6) is answered but not yet written into the spec.
- Q11 (shared server code) and Q12 (admin "Close period now") open.

**Spec 04 Data model**
- M1 to M8 need approval.
- Time zone rule (Q6) not yet written into the spec.

**Spec 05 API contract**
- C1 to C8 need approval.
- Q12 decides whether the admin close-period operation exists.
- B5 attachments not defined.
- Status line still says openapi.yaml was not available; T014 change list (section 8) not yet applied to the draft.

**Spec 06 Screen specs**
- S1 to S7 need approval.
- Q5: build waiting banner, availability toggle, bell and Rewards status from spec 06 without new Stitch exports?

**Spec 07 Task breakdown**
- K1 to K4, K7, K8 need approval.
- K6 text out of date (Q8).
- Plan section 9 edits not yet applied: waves W0 to W4 replaced by phases 0 to 8; T024 split into T024a and T024b; T042, T085, T090 splits; Available/Away toggle added to T068 and T090a.
- Agent column empty until quotas are known (Q14).

**All specs**
- D5 and D7 are named in the P0.2 scope but defined nowhere; the team lead confirms or retires them.
