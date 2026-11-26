# T080 dart_shared: generated client, models, token storage, premium
Status: Draft. Not Ready until P0.1 marks the specs below Approved and every task in Needs is merged to main.
Phase: 2
Tier: T2          Agent: Flutterby (proposed)
Stories: C2, X3             Needs: T007, T001, T002, T014
Branch: agent/T080-dart-shared-client
Specs to read: 05 section 6; 03 section 11; T002 vectors
Owns:
- `packages/dart_shared/lib/**` except `lib/theme/**`
- `packages/dart_shared/test/**`
Do not touch: anything else, especially:
- apps/rewards/**
- `packages/dart_shared/lib/theme/**`
- services/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Bring in the generated Dart client from T001 (Q7 generator).
2. Models and a token storage interface.
3. Dart premium function in integer centavos; table test over `premium.json`.
Done when:
- [ ] `flutter test` passes every T002 vector.
- [ ] The client compiles against the current contract.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
