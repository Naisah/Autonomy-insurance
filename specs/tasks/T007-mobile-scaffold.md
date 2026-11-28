# T007 Scaffold apps/mobile and packages/dart_shared
Status: Blocked
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
- [x] `flutter test` runs and passes in `apps/mobile` and `packages/dart_shared`.
- [ ] App launches on the Android emulator.
Questions:
1. **Open:** The task requires an Android emulator launch, but this environment has no emulator and Android licenses are not accepted (per the Flutterby run instructions, do not accept them). May the owner waive this Done when line, or provide an emulator with licenses already accepted?
2. **Resolved (Nov 28, 2026):** Flutter SDK is available at `D:\flutter`; run it with `D:\flutter\bin\flutter.bat`. Android licenses remain unaccepted, so emulator launch/build was skipped as directed.
3. **Android `applicationId` / `--org` (answered Nov 28, 2026):** The original spec did not specify the Android organization or `applicationId` for `apps/mobile` (only deep link schemes `autonomy://` and `autonomyrewards://`).
   - **Answer (owner, Nov 28, 2026):** Use `com.autonomyinsurance.mobile` as the `applicationId` for `apps/mobile`. The rewards app (T008) uses `com.autonomyinsurance.rewards`.
4. **`--dart-define` variable names for base URLs (answered Nov 28, 2026):** `apps/mobile` calls both `services/auth` (`PORT=4001`) and `services/core-api` (`PORT=4002`), and `docs/deployment-plan.md` section 6 / `T117` pass hosted and fallback URLs via `--dart-define`.
   - **Answer (owner, Nov 28, 2026):** Use `AUTH_BASE_URL` (default `http://10.0.2.2:4001`) and `CORE_API_BASE_URL` (default `http://10.0.2.2:4002`). Use the same names in T007, T008, T081 and T117.
Handoff:
- **What changed:** Created the Android-only Flutter app in `apps/mobile` with application ID `com.autonomyinsurance.mobile`, a central `lib/app/routes.dart`, and emulator/hosted URL defines. Created `packages/dart_shared` with an empty API folder and premium function stub. Added one widget test per package. No application dependencies were added beyond Flutter SDK dependencies and the local shared package.
- **Checks run:** `D:\flutter\bin\flutter.bat test` passes in `apps/mobile` and `packages/dart_shared`.
- **Skipped:** Android emulator launch/build. `flutter doctor` reports Android licenses are not accepted and no emulator is running; no licenses were accepted.
- **Route handoff:** T081, please add the shell's route registrations in `apps/mobile/lib/app/routes.dart` (the route table is currently empty).
- **What is left:** Android launch validation is blocked pending an emulator available without accepting Android licenses, or the owner explicitly waiving this Done when line; T081 route registration and later feature screens.
