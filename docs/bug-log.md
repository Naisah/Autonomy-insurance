# Bug log

One row per failed test on `main`. Probe (nightly tests) and Scout (nightly QA) add rows here; do not file the same failure twice, add "seen again <date>" to the existing row instead.

Format: date, test, steps, expected, actual, suspected task (the task that should make the test runnable or pass).

| Date | Test | Steps | Expected | Actual | Suspected task | Severity |
|---|---|---|---|---|---|---|
| 2026-11-26 | `npm ci` (repo root) | Fresh worktree of `main` (92bb930), run `npm ci` at the repo root | Lockfile install succeeds so the nightly test suite can run | Fails with `EUSAGE`: no `package.json` or `package-lock.json` at the repo root. Only `legacy/frontend-draft/package.json` exists. | T000 (workspaces/root scripts), T001 (contract tooling) not merged | blocker |
| 2026-11-26 | `npm test` (repo root) | Fresh worktree of `main` (92bb930), run `npm test` at the repo root | Runs the Vitest suites for the services and `packages/contracts` | Fails with `ENOENT`: cannot read `C:\...\package.json` at the repo root. No test script exists. | T000, T003, T004, T005 (service scaffolds) not merged | blocker |
| 2026-11-26 | `npm run contract:check` (repo root) | Fresh worktree of `main` (92bb930), run `npm run contract:check` at the repo root | Runs the Spectral lint and TS type generation from T001 and passes on the draft `openapi.yaml` | Fails with `ENOENT`: cannot read `package.json` at the repo root, so there is no `contract:check` script. `packages/contracts` has no `package.json` either. | T001 (contract tooling) not merged | blocker |
| 2026-11-26 | `flutter test` (apps/mobile) | Fresh worktree of `main` (92bb930), run `flutter test` in `apps/mobile` | Flutter widget tests run and pass | `apps/mobile` contains only `.gitkeep` (no `pubspec.yaml`, `lib/` or `test/`), so there is nothing to test. The Flutter CLI is also not installed on this runner (`flutter` is not recognized). | T007 (mobile scaffold) not merged; Flutter SDK missing on the runner | blocker |
| 2026-11-26 | `flutter test` (apps/rewards) | Fresh worktree of `main` (92bb930), run `flutter test` in `apps/rewards` | Flutter widget tests run and pass | `apps/rewards` contains only `.gitkeep` (no `pubspec.yaml`, `lib/` or `test/`), so there is nothing to test. The Flutter CLI is also not installed on this runner (`flutter` is not recognized). | T008 (Rewards scaffold) not merged; Flutter SDK missing on the runner | blocker |

Notes for 2026-11-26:
- All failures are because the Phase 1 scaffolds (T000, T001, T003 to T008) are not merged to `main` yet, not because of application code. Once those tasks land, re-run this suite.
- The runner also needs the Flutter SDK on `PATH` before `flutter test` can run; that is an environment fix, not an application change.
- Probe did not change application code.
