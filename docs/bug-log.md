# Bug log

One row per failed test on `main`. Probe (nightly tests) and Scout (nightly QA) add rows here; do not file the same failure twice, add "seen again <date>" to the existing row instead.

Format: date, test, steps, expected, actual, suspected task (the task that should make the test runnable or pass).

| Date | Test | Steps | Expected | Actual | Suspected task | Severity |
|---|---|---|---|---|---|---|
| 2026-11-26 | `npm ci` (repo root) | Fresh worktree of `main` (92bb930), run `npm ci` at the repo root | Lockfile install succeeds so the nightly test suite can run | Fails with `EUSAGE`: no `package.json` or `package-lock.json` at the repo root. Only `legacy/frontend-draft/package.json` exists. Seen again 2026-11-28 (de4dc8b): passes (772 packages added, exit 0). | T000 (workspaces/root scripts), T001 (contract tooling) not merged | blocker |
| 2026-11-26 | `npm test` (repo root) | Fresh worktree of `main` (92bb930), run `npm test` at the repo root | Runs the Vitest suites for the services and `packages/contracts` | Fails with `ENOENT`: cannot read `C:\...\package.json` at the repo root. No test script exists. Seen again 2026-11-28 (de4dc8b): the root `package.json` now exists but still has no `test` script, so `npm test` fails with `npm error Missing script: "test"` (exit 1). The suites pass when run per workspace: `npm test --workspaces --if-present` → 119 tests pass (web 2, auth 4, core-api 5, rewards-api 4, contracts 104). | T000 (root scripts), T003 to T005 (service scaffolds) | blocker |
| 2026-11-28 | `npm run contract:check` (repo root) | Fresh worktree of `main` (de4dc8b), run `npm ci` then `npm run contract:check` at the repo root | Spectral lint, fixture lint and TS type generation from T001 run and pass on `packages/contracts/openapi.yaml` | Fails in `lint:fixtures` (exit 1): all 8 negative fixtures report `got []` (`missing-x-roles`, `bad-x-roles`, `missing-x-stories`, `missing-x-priority`, `bad-x-priority`, and the three `staff-reward-field` fixtures). The rules themselves work: `npx spectral lint <fixture> --ruleset packages/contracts/.spectral.yaml -f json` returns the expected codes. The fixture script calls the extensionless POSIX shim `node_modules/.bin/spectral` with `execFileSync` (no shell); on Windows that shim does not run, `e.stdout` is empty, and every fixture is scored as zero rule hits. `npm run lint` itself shows 0 errors (62 `operation-description` warnings). | T001 (contract tooling: `scripts/check-lint-fixtures.mjs` Windows shim path) | blocker |
| 2026-11-26 | `flutter test` (apps/mobile) | Fresh worktree of `main` (92bb930), run `flutter test` in `apps/mobile` | Flutter widget tests run and pass | `apps/mobile` contains only `.gitkeep` (no `pubspec.yaml`, `lib/` or `test/`), so there is nothing to test. The Flutter CLI is also not installed on this runner (`flutter` is not recognized). Seen again 2026-11-28 (de4dc8b): still only `.gitkeep`; `flutter` is not on `PATH` and `D:\flutter\bin` does not exist on this runner. | T007 (mobile scaffold) not merged; Flutter SDK missing on the runner | blocker |
| 2026-11-26 | `flutter test` (apps/rewards) | Fresh worktree of `main` (92bb930), run `flutter test` in `apps/rewards` | Flutter widget tests run and pass | `apps/rewards` contains only `.gitkeep` (no `pubspec.yaml`, `lib/` or `test/`), so there is nothing to test. The Flutter CLI is also not installed on this runner (`flutter` is not recognized). Seen again 2026-11-28 (de4dc8b): still only `.gitkeep`; `flutter` is not on `PATH` and `D:\flutter\bin` does not exist on this runner. | T008 (Rewards scaffold) not merged; Flutter SDK missing on the runner | blocker |

Notes for 2026-11-26:
- All failures are because the Phase 1 scaffolds (T000, T001, T003 to T008) are not merged to `main` yet, not because of application code. Once those tasks land, re-run this suite.
- The runner also needs the Flutter SDK on `PATH` before `flutter test` can run; that is an environment fix, not an application change.
- Probe did not change application code.

Notes for 2026-11-28 (main de4dc8b):
- `npm ci` passes (772 packages, 20 audit findings; Prisma/esbuild install scripts reported as not yet approved by the scripts policy).
- `npm test --workspaces --if-present` passes: 119 tests across `apps/web`, `services/auth`, `services/core-api`, `services/rewards-api` and `packages/contracts`. The only root failure is the missing `test` script.
- `contract:check` gets past `spectral lint` but fails in `lint:fixtures` because of the Windows `.bin/spectral` shim; see the 2026-11-28 row.
- Both Flutter apps are still empty scaffolds and the Flutter SDK is absent from this runner, so `flutter test` cannot run. These are environment/scaffold gaps, not failures in application code.
- Probe did not change application code; only `docs/bug-log.md`.
