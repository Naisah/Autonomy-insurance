# Task board

Kept by Atlas. Updated Nov 28, 2026 (morning board run 3). Specs 00 to 07 Approved Nov 26, 2026. A Ready task starts once its Needs are merged.

Today in one line: T000 (#8), T001, T003 to T006, T014 and T015 are merged, so the three schema tasks (T010, T011, T012) are startable. T007 (#18) is the only open PR and needs a human merge.

## In progress
(none)

## In review
| Task | Agent | PR | State |
|---|---|---|---|
| [T007](../../specs/tasks/T007-mobile-scaffold.md) Scaffold apps/mobile and dart_shared | Flutterby | #18 | `needs-human`. Merge state clean. "App launches on the emulator" not met yet (Android licenses not accepted). |

## Blocked
(none)

## Waiting for a human (not product questions)
1. **Merge PR #18 (T007).** It unblocks T008, T009, T080 and T081. Labeled `needs-human`.
2. **T000 Handoff checks still open.** `docker compose up -d` then `psql -l` should list `autonomy_auth`, `autonomy_core`, `autonomy_rewards` (needs Docker running). Tick "PR template shows" on the first new PR opened after #8, now merged. Neither blocks other tasks.
3. **Android SDK licenses** on the laptop that runs Flutterby and Stride (`flutter doctor --android-licenses`). Until then T007 and T008 cannot meet "app launches on the emulator".
4. **Nightly runner PATH:** Probe's runner has no `flutter` on PATH. Flutter is at `D:\flutter\bin` on the dev laptop. Add it so the nightly `flutter test` rows in the bug log can clear.

## Needs the team lead
(none this run)

## Answers given this run
- Fastify version question (left open in T003 Lens fixes): already decided in docs/decisions.md row FW, Fastify 5 in all three services. No action.
- Bug log: the five Nov 26 blocker rows were all "scaffold not merged yet". T000, T001, T003 to T006 are now merged. T007 and T008 rows stay until #18 and T008 land. Probe's next nightly run should re-test. No new BUG-* drafts exist, so no new bug tasks.
- Earlier answer kept: T007 owner answers (`applicationId` `com.autonomyinsurance.mobile` and `com.autonomyinsurance.rewards`; `AUTH_BASE_URL`, `CORE_API_BASE_URL`, `REWARDS_API_BASE_URL`) are in T008, T081 and T117 Notes. Decisions log row still to be added on Atlas's next decisions PR.

## Ready, start now (all Needs merged)
| Task | Phase | Tier | Agent | Needs |
|---|---|---|---|---|
| [T010](../../specs/tasks/T010-auth-schema.md) auth Prisma schema and first migration | 1 | T1 | Atlas | T003 (merged) |
| [T011](../../specs/tasks/T011-core-api-schema.md) core-api Prisma schema and first migration | 1 | T1 | Atlas | T004 (merged) |
| [T012](../../specs/tasks/T012-rewards-api-schema.md) rewards-api Prisma schema and first migration | 1 | T2 | Atlas | T005 (merged) |

Atlas takes T010 first in this run.

## Ready, waiting on Needs
| Task | Phase | Tier | Agent | Needs |
|---|---|---|---|---|
| [T013](../../specs/tasks/T013-seed-data.md) Seed scripts and docs/seed-readme.md | 1 | T3 | Seedling | T010, T011, T012 |
| [T008](../../specs/tasks/T008-rewards-scaffold.md) Scaffold apps/rewards | 1 | T3 | Stride | T007 |
| [T009](../../specs/tasks/T009-design-tokens.md) Design tokens for web and Flutter | 1 | T3 | Pixel | T006 (merged), T007 |
| [T020](../../specs/tasks/T020-register-login.md) Register and login | 2 | T1 | Forge | T010, T014 (merged) |
| [T021](../../specs/tasks/T021-session-jwks.md) Refresh rotation, logout, /auth/me, JWKS | 2 | T1 | Forge | T020 |
| [T024a](../../specs/tasks/T024a-service-token.md) Service accounts and POST /service/token | 2 | T1 | Forge | T021 |
| [T022](../../specs/tasks/T022-staff-accounts.md) Staff accounts, roles, must-change-password | 2 | T2 | Forge | T021 |
| [T023](../../specs/tasks/T023-directory-outbox.md) Directory outbox to core-api | 2 | T1 | Forge | T022, T024a |
| [T026](../../specs/tasks/T026-assignment.md) Agent assignment and waiting queue | 2 | T1 | Forge | T022, T023 |
| [T027](../../specs/tasks/T027-availability-limits.md) Availability and client limits | 2 | T2 | Forge | T026 |
| [T025](../../specs/tasks/T025-auth-acceptance.md) Auth acceptance suite for A1 and A3 | 2 | T2 | Probe | T021 |
| [T030](../../specs/tasks/T030-core-jwt-plugin.md) core-api JWT plugin | 2 | T1 | Forge | T004 (merged), T021, T014 (merged) |
| [T031](../../specs/tasks/T031-directory-projection.md) Directory projection and /internal/directory-events | 2 | T1 | Forge | T011, T023 |
| [T032](../../specs/tasks/T032-access-module.md) Access module and generated authorization matrix test | 2 | T1 | Forge | T030, T031 |
| [T060](../../specs/tasks/T060-web-shell.md) Web shell: guards, refresh, states, toasts | 2 | T2 | Pixel | T006 (merged), T009, T001 (merged), T014 (merged) |
| [T061](../../specs/tasks/T061-web-auth-screens.md) Web landing, login and register | 2 | T2 | Pixel | T060, T020 |
| [T080](../../specs/tasks/T080-dart-shared-client.md) dart_shared: generated client, models, token storage, premium | 2 | T2 | Flutterby | T007, T001 (merged), T002 (merged), T014 (merged) |
| [T081](../../specs/tasks/T081-mobile-shell.md) Mobile shell: secure storage, refresh, role tabs, states | 2 | T2 | Flutterby | T007, T009, T080 |
| [T083](../../specs/tasks/T083-mobile-auth-screens.md) Mobile sign-in and register | 2 | T3 | Flutterby | T081, T020 |
| [T033b](../../specs/tasks/T033b-chat-attachments-api.md) Chat attachments API (B5) | 3 | T1 | Forge | T033, T034, T011, T014 (merged) |
| [T063b](../../specs/tasks/T063b-web-chat-attachments.md) Web chat attachments (B5) | 3 | T2 | Pixel | T063, T068, T033b |
| [T085c](../../specs/tasks/T085c-mobile-chat-attachments.md) Mobile chat attachments (B5) | 3 | T2 | Flutterby | T085a, T090a, T033b |
| [T115](../../specs/tasks/T115-staging-deploy.md) Staging deploy on the free hosts | 2 | T2 | Forge | T020, T021, T022, T023, T024a, T025, T026, T027, T030, T031, T032, T060, T061, T080, T081, T083, T013 |
| [T116](../../specs/tasks/T116-demo-deploy.md) Demo deploy and local fallback | 8 | T2 | Forge | T115, T110, T111 |
| [T117](../../specs/tasks/T117-signed-apks.md) Signed release APKs for the demo | 8 | T2 | Flutterby | T116, T091, T100 |

## Done
| Task | Agent | PR | Merged |
|---|---|---|---|
| [T000](../../specs/tasks/T000-repo-hygiene.md) Repo hygiene | Forge | #8 | by Nov 28, 2026 |
| [T001](../../specs/tasks/T001-contract-tooling.md) Contract tooling | Atlas | #21 | by Nov 28, 2026 |
| [T002](../../specs/tasks/T002-premium-vectors.md) Premium formula test vectors and TS reference | Probe | #9 | Nov 26, 2026 |
| [T003](../../specs/tasks/T003-auth-scaffold.md) Scaffold services/auth | Forge | #14 | by Nov 28, 2026 |
| [T004](../../specs/tasks/T004-core-api-scaffold.md) Scaffold services/core-api | Forge | #15 | by Nov 28, 2026 |
| [T005](../../specs/tasks/T005-rewards-api-scaffold.md) Scaffold services/rewards-api | Forge | #17 | by Nov 28, 2026 |
| [T006](../../specs/tasks/T006-web-scaffold.md) Scaffold apps/web | Pixel | #16 | by Nov 28, 2026 |
| [T014](../../specs/tasks/T014-openapi-contract.md) OpenAPI contract v1.0.0 | Atlas | #22 | by Nov 28, 2026 |
| [T015](../../specs/tasks/T015-reward-vectors.md) Reward test vectors | Probe | #13 | by Nov 28, 2026 |
