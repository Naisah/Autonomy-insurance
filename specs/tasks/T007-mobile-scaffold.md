# T007 Scaffold apps/mobile and packages/dart_shared
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 1
Tier: T3          Agent: Flutterby
Stories: all             Needs: T000
Branch: agent/T007-mobile-scaffold
Specs to read: 00 sections 4 and 6; 03 section 11; 07 section 1 (Flutter routes convention)
Owns:
- `apps/mobile/**`
- `packages/dart_shared/**` except `lib/theme/**`
Do not touch: anything else, especially:
- `packages/dart_shared/lib/theme/**` (T009)
- apps/rewards/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Flutter app for Android only (Q3).
2. `packages/dart_shared` with an empty API client folder and a premium function stub.
3. One `routes.dart` in the app (owned by the shell task T081 later).
4. Debug base URL `http://10.0.2.2:<port>` for the emulator; port from `.env.example`.
Done when:
- [ ] `flutter test` runs and passes in `apps/mobile` and `packages/dart_shared`.
- [ ] App launches on the Android emulator.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
