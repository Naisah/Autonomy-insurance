# packages/contracts

`openapi.yaml` here is a **draft** (version 0.1.0-draft, Nov 26, 2026), written by Claude from spec 05 section 8, specs 03 and 04. The team chose it as the starting point for task T014.

State of the draft:
- 70 paths, 83 operations. Every operation has `x-roles`, `x-stories` and `x-priority`.
- Spectral (`spectral:oas`) reports 0 errors; the warnings are missing operation descriptions and the info contact.
- `openapi-typescript` generates types from it without errors.
- No `*Staff` schema has a reward field.
- Not reviewed by a human or by the security reviewer yet.

T014 finishes it: review against spec 05, add the custom lint rules from T001, fill descriptions, generate clients, and bump the version to 1.0.0.
Decisions the draft makes that spec 05 does not state yet: the refresh cookie name `ai_refresh`; a `client` field (`web` or `mobile`) on login and register; a separate `rewardsBearer` security scheme for rewards-api; `GET /settings/estimate-rate` readable by every role (the client needs it for the live premium); `/health` declared once for all three services.

## Commands (T001)
Run from the repo root after `npm install`, or from this folder.

| Command | What it does |
|---|---|
| `npm run contract:check` (root) or `npm run check` | Lint, prove the lint rules with fixtures, generate TS types, type-check |
| `npm run lint` | Spectral with `.spectral.yaml`: `spectral:oas` plus the project rules below; fails on errors only |
| `npm run lint:fixtures` | Lints each file in `test/lint-fixtures/` and checks it fails with the expected rule (good.yaml must pass) |
| `npm run types` | `openapi-typescript` into `generated/ts/api.d.ts`, then `tsc --noEmit` |
| `npm run mock` | Prism mock of the whole contract on http://127.0.0.1:4010 |
| `npm run mock:smoke` | Starts Prism, checks `GET /health` and `POST /auth/login` answer 200, stops it |
| `npm test` | Vitest: premium and reward vectors (T002, T015) |

Project lint rules (errors):
- `operation-x-roles`, `operation-x-stories`, `operation-x-priority`, `operation-x-priority-defined`: every operation has them, with valid values.
- `staff-schema-no-reward-fields`: no schema named `*Staff` has `rewardNote`, `rewardStatus`, `rewardPoints`, `payoutDelayDays`, `payoutDueDate` or `reasonLabel`, including through `allOf`, `$ref`, nested objects and array items (`functions/noRewardFieldsInStaff.js`).

`generated/ts/` is generated output. Do not edit it by hand; rerun `npm run types`. Dart generation lives in packages/dart_shared (T080, Q7).
