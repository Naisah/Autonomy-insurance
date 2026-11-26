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
