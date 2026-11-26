# T083 Mobile sign-in and register
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 2
Tier: T3          Agent: Flutterby
Stories: A1             Needs: T081, T020
Branch: agent/T083-mobile-auth-screens
Specs to read: 06 section 4 (sign-in, register rows); 02 A1
Owns:
- `apps/mobile/lib/features/auth/**`
- `apps/mobile/test/features/auth/**`
Do not touch: anything else, especially:
- apps/rewards/**
- `packages/dart_shared/lib/theme/**`
- services/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Build both screens from the Stitch files named in spec 06.
2. Wire to auth via `dart_shared`.
3. Ask for the one-line `routes.dart` registration in the Handoff.
Done when:
- [ ] Same checks as T061: generic error, countdown on block, weak password hint (widget tests).
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
