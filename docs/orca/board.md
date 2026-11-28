# Task board

Kept by Atlas. Updated Nov 28, 2026 (morning board run). Specs 00 to 07 Approved Nov 26, 2026. A Ready task starts once its Needs are merged.

Today in one line: only T002 has merged. T000 (PR #8) is the gate for almost every other task and needs a human merge, so no new task became startable this run.

## In progress
(none)

## In review
| Task | Agent | PR | State |
|---|---|---|---|
| [T000](../../specs/tasks/T000-repo-hygiene.md) Repo hygiene | Forge | #8 | `needs-human` (touches `.github/**`). Lens: changes needed (see "Waiting for a human" below). Sentinel: approve. |
| [T015](../../specs/tasks/T015-reward-vectors.md) Reward test vectors | Probe | #13 | Waiting for Lens. Opened from a fork (Probe's token is read-only). |
| [T003](../../specs/tasks/T003-auth-scaffold.md) Scaffold services/auth | Forge | #14 | Waiting for Lens and Sentinel. Based on `agent/T000-repo-hygiene`; retarget to `main` after #8 merges. |
| [T004](../../specs/tasks/T004-core-api-scaffold.md) Scaffold services/core-api | Forge | #15 | Waiting for Lens. Based on the T000 branch; retarget after #8. |
| [T005](../../specs/tasks/T005-rewards-api-scaffold.md) Scaffold services/rewards-api | Forge | #17 | Waiting for Lens. Based on the T000 branch; retarget after #8. |
| [T006](../../specs/tasks/T006-web-scaffold.md) Scaffold apps/web | Pixel | #16 | Waiting for Lens. Based on the T000 branch; retarget after #8. |
| [T007](../../specs/tasks/T007-mobile-scaffold.md) Scaffold apps/mobile and dart_shared | Flutterby | #18 | Waiting for Lens. Based on the T000 branch; retarget after #8. Done when "app launches on the emulator" is not met yet (Android licenses not accepted). |

Docs PRs with "Lens: approve", waiting for the Merge gate: #10 (Probe bug log), #11 (Scout QA report), #12 (Orca setup guide).

Note: T003 to T007 started before their Need T000 merged and are stacked on its branch. That works, but none of them can merge to `main` before #8.

## Blocked
(none)

## Waiting for a human (not product questions)
1. **Merge PR #8 (T000).** It is high-risk only because it adds `.github/pull_request_template.md`. Lens asked for two checks:
   - `docker compose up -d` then `psql -l` lists `autonomy_auth`, `autonomy_core`, `autonomy_rewards`. Needs a machine with Docker running.
   - "A new PR shows the template" cannot pass before merge, because GitHub reads the template from the base branch. Atlas answer: check it on the first PR opened after #8 merges, and tick it in the T000 Handoff then. It does not block the merge.
2. **Android SDK licenses** on the laptop that runs Flutterby and Stride (`flutter doctor --android-licenses`). Until then T007 and T008 cannot meet "app launches on the emulator".
3. **Nightly runner PATH:** Probe's runner has no `flutter` on PATH. Flutter is at `D:\flutter\bin` on the dev laptop (T007). Add it to the runner's PATH so the nightly `flutter test` rows in the bug log can clear.

## Needs the team lead
(none this run)

## Answers given this run
- T007 owner answers (Nov 28): `applicationId` `com.autonomyinsurance.mobile` and `com.autonomyinsurance.rewards`; base URL defines `AUTH_BASE_URL` and `CORE_API_BASE_URL`. Copied into T008, T081 and T117 as Notes. For the Rewards app, Atlas added `REWARDS_API_BASE_URL` (default `http://10.0.2.2:4003`) on the same pattern. Decisions log row to be added on Atlas's next decisions PR.
- Bug log (PR #10, Probe, Nov 26): all five blocker rows are "scaffold not merged yet" and map to T000, T001 and T003 to T008, which already exist. No new bug task. The Flutter SDK row is item 3 above.
- Scout QA (PR #11, Nov 26): nothing user-facing on `main`, no bugs, no BUG-* drafts.

## Ready (start each when its Needs are merged)
No task below has all of its Needs merged yet. The first ones to open up when #8 merges: T001 (Atlas), and T008 once #18 merges.

| Task | Phase | Tier | Agent | Needs |
|---|---|---|---|---|
| [T001](../../specs/tasks/T001-contract-tooling.md) Contract tooling: Spectral lint, type generation, Prism mock, contract:check | 1 | T2 | Atlas | T000 |
| [T014](../../specs/tasks/T014-openapi-contract.md) Finish packages/contracts/openapi.yaml from spec 05 | 1 | T1 | Atlas | T001 |
| [T010](../../specs/tasks/T010-auth-schema.md) auth Prisma schema and first migration | 1 | T1 | Atlas | T003 |
| [T011](../../specs/tasks/T011-core-api-schema.md) core-api Prisma schema and first migration | 1 | T1 | Atlas | T004 |
| [T012](../../specs/tasks/T012-rewards-api-schema.md) rewards-api Prisma schema and first migration | 1 | T2 | Atlas | T005 |
| [T013](../../specs/tasks/T013-seed-data.md) Seed scripts and docs/seed-readme.md | 1 | T3 | Seedling | T010, T011, T012 |
| [T008](../../specs/tasks/T008-rewards-scaffold.md) Scaffold apps/rewards | 1 | T3 | Stride | T007 |
| [T009](../../specs/tasks/T009-design-tokens.md) Design tokens for web and Flutter | 1 | T3 | Pixel | T006, T007 |
| [T020](../../specs/tasks/T020-register-login.md) Register and login | 2 | T1 | Forge | T010, T014 |
| [T021](../../specs/tasks/T021-session-jwks.md) Refresh rotation, logout, /auth/me, JWKS | 2 | T1 | Forge | T020 |
| [T024a](../../specs/tasks/T024a-service-token.md) Service accounts and POST /service/token | 2 | T1 | Forge | T021 |
| [T022](../../specs/tasks/T022-staff-accounts.md) Staff accounts, roles, must-change-password | 2 | T2 | Forge | T021 |
| [T023](../../specs/tasks/T023-directory-outbox.md) Directory outbox to core-api | 2 | T1 | Forge | T022, T024a |
| [T026](../../specs/tasks/T026-assignment.md) Agent assignment and waiting queue | 2 | T1 | Forge | T022, T023 |
| [T027](../../specs/tasks/T027-availability-limits.md) Availability and client limits | 2 | T2 | Forge | T026 |
| [T025](../../specs/tasks/T025-auth-acceptance.md) Auth acceptance suite for A1 and A3 | 2 | T2 | Probe | T021 |
| [T030](../../specs/tasks/T030-core-jwt-plugin.md) core-api JWT plugin | 2 | T1 | Forge | T004, T021, T014 |
| [T031](../../specs/tasks/T031-directory-projection.md) Directory projection and /internal/directory-events | 2 | T1 | Forge | T011, T023 |
| [T032](../../specs/tasks/T032-access-module.md) Access module and generated authorization matrix test | 2 | T1 | Forge | T030, T031 |
| [T060](../../specs/tasks/T060-web-shell.md) Web shell: guards, refresh, states, toasts | 2 | T2 | Pixel | T006, T009, T001, T014 |
| [T061](../../specs/tasks/T061-web-auth-screens.md) Web landing, login and register | 2 | T2 | Pixel | T060, T020 |
| [T080](../../specs/tasks/T080-dart-shared-client.md) dart_shared: generated client, models, token storage, premium | 2 | T2 | Flutterby | T007, T001, T002 (merged), T014 |
| [T081](../../specs/tasks/T081-mobile-shell.md) Mobile shell: secure storage, refresh, role tabs, states | 2 | T2 | Flutterby | T007, T009, T080 |
| [T083](../../specs/tasks/T083-mobile-auth-screens.md) Mobile sign-in and register | 2 | T3 | Flutterby | T081, T020 |
| [T033b](../../specs/tasks/T033b-chat-attachments-api.md) Chat attachments API (B5) | 3 | T1 | Forge | T033, T034, T011, T014 |
| [T063b](../../specs/tasks/T063b-web-chat-attachments.md) Web chat attachments (B5) | 3 | T2 | Pixel | T063, T068, T033b |
| [T085c](../../specs/tasks/T085c-mobile-chat-attachments.md) Mobile chat attachments (B5) | 3 | T2 | Flutterby | T085a, T090a, T033b |
| [T115](../../specs/tasks/T115-staging-deploy.md) Staging deploy on the free hosts | 2 | T2 | Forge | T020, T021, T022, T023, T024a, T025, T026, T027, T030, T031, T032, T060, T061, T080, T081, T083, T013 |
| [T116](../../specs/tasks/T116-demo-deploy.md) Demo deploy and local fallback | 8 | T2 | Forge | T115, T110, T111 |
| [T117](../../specs/tasks/T117-signed-apks.md) Signed release APKs for the demo | 8 | T2 | Flutterby | T116, T091, T100 |

## Done
| Task | Agent | PR | Merged |
|---|---|---|---|
| [T002](../../specs/tasks/T002-premium-vectors.md) Premium formula test vectors and TS reference | Probe | #9 | Nov 26, 2026 |
