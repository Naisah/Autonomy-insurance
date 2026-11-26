# Task board

Kept by Atlas. Updated Nov 26, 2026 (P0.5). Specs 00 to 07 Approved Nov 26, 2026 (PR #2). A Ready task starts once PR #2 and its Needs are merged.

## In progress
(none)

## In review
(none)

## Blocked
(none)

## Ready (start each when its Needs are merged)
| Task | Phase | Tier | Agent | Needs |
|---|---|---|---|---|
| [T000](../../specs/tasks/T000-repo-hygiene.md) Repo hygiene: workspaces, docker-compose, env examples, PR template | 1 | T3 | Forge | none |
| [T001](../../specs/tasks/T001-contract-tooling.md) Contract tooling: Spectral lint, type generation, Prism mock, contract:check | 1 | T2 | Atlas | T000 |
| [T014](../../specs/tasks/T014-openapi-contract.md) Finish packages/contracts/openapi.yaml from spec 05 | 1 | T1 | Atlas | T001 |
| [T002](../../specs/tasks/T002-premium-vectors.md) Premium formula test vectors and TS reference | 1 | T2 | Anvil, Probe and Pixel (trial, P0.7); keep the best | none |
| [T015](../../specs/tasks/T015-reward-vectors.md) Reward test vectors and TS reference | 1 | T2 | Probe | none |
| [T003](../../specs/tasks/T003-auth-scaffold.md) Scaffold services/auth | 1 | T3 | Forge | T000 |
| [T004](../../specs/tasks/T004-core-api-scaffold.md) Scaffold services/core-api | 1 | T3 | Forge | T000 |
| [T005](../../specs/tasks/T005-rewards-api-scaffold.md) Scaffold services/rewards-api | 1 | T3 | Forge | T000 |
| [T010](../../specs/tasks/T010-auth-schema.md) auth Prisma schema and first migration | 1 | T1 | Atlas | T003 |
| [T011](../../specs/tasks/T011-core-api-schema.md) core-api Prisma schema and first migration | 1 | T1 | Atlas | T004 |
| [T012](../../specs/tasks/T012-rewards-api-schema.md) rewards-api Prisma schema and first migration | 1 | T2 | Atlas | T005 |
| [T013](../../specs/tasks/T013-seed-data.md) Seed scripts and docs/seed-readme.md | 1 | T3 | Seedling | T010, T011, T012 |
| [T006](../../specs/tasks/T006-web-scaffold.md) Scaffold apps/web | 1 | T3 | Pixel | T000 |
| [T007](../../specs/tasks/T007-mobile-scaffold.md) Scaffold apps/mobile and packages/dart_shared | 1 | T3 | Flutterby | T000 |
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
| [T080](../../specs/tasks/T080-dart-shared-client.md) dart_shared: generated client, models, token storage, premium | 2 | T2 | Flutterby | T007, T001, T002, T014 |
| [T081](../../specs/tasks/T081-mobile-shell.md) Mobile shell: secure storage, refresh, role tabs, states | 2 | T2 | Flutterby | T007, T009, T080 |
| [T083](../../specs/tasks/T083-mobile-auth-screens.md) Mobile sign-in and register | 2 | T3 | Flutterby | T081, T020 |

## Done
(none)
