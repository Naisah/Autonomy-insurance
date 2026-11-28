# T117 Signed release APKs for the demo
Status: Ready. B5 and hosting approved Nov 26, 2026 (branch agent/b5-and-hosting). Start only when that PR and every task in Needs are merged to main.
Phase: 8
Tier: T2          Agent: Flutterby
Stories: all             Needs: T116, T091, T100
Branch: agent/T117-signed-apks
Specs to read: docs/deployment-plan.md section 6
Owns:
- `apps/mobile/android/app/build.gradle*`
- `apps/rewards/android/app/build.gradle*`
- `scripts/release/**`
Do not touch: anything else, especially:
- app source under `lib/`
- `packages/**`
- services/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Release signing config that reads a git-ignored `key.properties`; confirm `.gitignore` covers it and the keystore.
2. `scripts/release/build-apks`: release APKs for both apps with hosted URLs via `--dart-define`, and a fallback pair with a LAN address argument.
3. Owner step: create the keystore once, keep it outside the repo, run the script, attach the four APKs to a GitHub Release `demo-v1`.
Done when:
- [ ] Both hosted APKs install on a clean Android device and sign in against the hosted stack.
- [ ] SSO from the main app opens the Rewards app on the same device.
- [ ] No keystore, `key.properties` or password in git (secret scan clean).
Notes (owner answer on T007, Nov 28, 2026):
- Application IDs: `com.autonomyinsurance.mobile` (main app) and `com.autonomyinsurance.rewards` (Rewards app).
- `--dart-define` names: `AUTH_BASE_URL` and `CORE_API_BASE_URL` for the main app; `AUTH_BASE_URL` and `REWARDS_API_BASE_URL` for the Rewards app.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
