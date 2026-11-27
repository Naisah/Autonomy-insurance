# T007 Scaffold apps/mobile and packages/dart_shared
Status: Blocked (Flutterby, branch agent/T007-mobile-scaffold). Blocked on missing Flutter SDK on the runner. Questions 2 and 3 answered Nov 28, 2026.
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
Questions:
1. **Environment blocker (Flutter SDK missing on runner):** Neither `flutter` nor `dart` is installed or on `PATH` on this runner (checked system/user `PATH`, `C:\`, `C:\Program Files`, `C:\Program Files (x86)`, `C:\ProgramData`, `C:\opt`, `D:\`, and `D:\Android`; also noted by Probe in `docs/bug-log.md` on 2026-11-26). Android SDK (`D:\Android\Sdk`), AVD (`D:\Android\avd\Medium_Phone.avd`), and JDK 17 are present, so installing the Flutter SDK, adding `flutter\bin` to `PATH`, and setting `ANDROID_HOME=D:\Android\Sdk` should unblock `flutter create --platforms=android`, `flutter test`, and emulator launch. Per `AGENTS.md`, agents must not install global packages or touch the home directory, and must not mark `Done when` complete without running the required checks.
2. **Android `applicationId` / `--org` (spec silent):** Neither `specs/03-architecture.md`, `specs/06-screen-specs.md`, nor `docs/deployment-plan.md` specifies the Android organization or `applicationId` for `apps/mobile` (only deep link schemes `autonomy://` and `autonomyrewards://`). Please confirm what `--org` / `applicationId` to use (for example `com.autonomyinsurance.mobile`).
   - **Answer (owner, Nov 28, 2026):** Use `com.autonomyinsurance.mobile` as the `applicationId` for `apps/mobile`. The rewards app (T008) uses `com.autonomyinsurance.rewards`.
3. **`--dart-define` variable names for base URLs (spec silent):** `apps/mobile` calls both `services/auth` (`PORT=4001`) and `services/core-api` (`PORT=4002`), and `docs/deployment-plan.md` section 6 / `T117` pass hosted and fallback URLs via `--dart-define`. Please confirm the standard key names to use across T007, T008, T081, and T117 (for example `AUTH_BASE_URL` defaulting to `http://10.0.2.2:4001` and `CORE_API_BASE_URL` defaulting to `http://10.0.2.2:4002`).
   - **Answer (owner, Nov 28, 2026):** Use `AUTH_BASE_URL` (default `http://10.0.2.2:4001`) and `CORE_API_BASE_URL` (default `http://10.0.2.2:4002`). Use the same names in T007, T008, T081 and T117.
Handoff:
- **What changed:** Updated `specs/tasks/T007-mobile-scaffold.md` (`Status: Blocked`, `Questions`, `Handoff`) only. No application code or dependencies added.
- **Checks run:** Verified environment prerequisites (`flutter --version`, `dart --version` -> command not found; Android SDK and `Medium_Phone.avd` verified present under `D:\Android\Sdk` and `D:\Android\avd`; `services/auth/.env.example` has `PORT=4001`, `services/core-api/.env.example` has `PORT=4002`).
- **What is left:** Once the Flutter SDK is installed on `PATH` (and `ANDROID_HOME=D:\Android\Sdk` is set) and Questions 2 and 3 are answered in the spec/task file, re-run T007 to scaffold `apps/mobile` (Android only, `lib/app/routes.dart`, debug `10.0.2.2` URLs) and `packages/dart_shared` (empty `lib/api/`, premium function stub, excluding `lib/theme/**`), verify `flutter test` in both packages, and verify launch on the Android emulator.
