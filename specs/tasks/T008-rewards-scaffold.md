# T008 Scaffold apps/rewards
Status: Draft. Not Ready until P0.1 marks the specs below Approved and every task in Needs is merged to main.
Phase: 1
Tier: T3          Agent: Stride (proposed)
Stories: G1             Needs: T007
Branch: agent/T008-rewards-scaffold
Specs to read: 00 sections 4 and 6; 03 sections 9 and 11
Owns:
- `apps/rewards/**`
Do not touch: anything else, especially:
- apps/mobile/**, packages/dart_shared/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Flutter app for Android only that depends on `packages/dart_shared`.
2. One `routes.dart`; placeholder home screen.
3. Debug base URL for rewards-api and auth via `10.0.2.2`.
Done when:
- [ ] `flutter test` runs and passes.
- [ ] App launches on the Android emulator.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
