# Orca bots and automations: Autonomy Insurance

Status: Draft, Nov 26, 2026. Turns spec 01 (agent roster) into concrete Orca bots, each with one role, one agent CLI and a model, plus scheduled automations. Where this file and spec 01 section 1 differ, this file is newer; update spec 01 once the team confirms.

## 1. The idea in one paragraph
Each bot is a specialist with a fixed lane (architecture, backend, web, mobile, tests, review). Bots do not chat freely. They talk through the repo: a task file in `specs/tasks/`, a branch, a pull request, and comments on it. That keeps every decision written down, lets any bot pick up where another stopped, and lets you check everything before it reaches `main`. Paid subscriptions (Claude, Google AI Pro) go to the work where a mistake costs the most; free agents take the high-volume, low-risk work.

## 2. Your subscriptions and what they are good for
| Agent CLI in Orca | Plan | Use it for | Watch out for |
|---|---|---|---|
| Claude (`claude`) | Paid | Architecture, contract, security-critical backend, final agent review | Usage limits reset every few hours; keep it to the T1 lane and reviews |
| Antigravity (`agy`) | Google AI Pro (paid) | Security review, cross-cutting fixes | Likely shares the Google quota with Gemini CLI; check in Orca which models it offers |
| Gemini (`gemini`) | Google AI Pro (paid) | Flutter mobile and Rewards app; long-context reading of specs | Same Google quota as Antigravity (probably); use the fast model for small tasks |
| Codex (`codex`) | Free tier | Backend CRUD modules and their tests | Free limits are tight; small tasks only |
| OpenCode (`opencode`) | Free (pick a free model in its model list) | Tests, test matrix, seed data | Free models vary in quality; review carefully |
| Kilocode (`kilo`) | Free models | React web screens | Was updating in Orca; confirm it starts |
| Cline (`cline`) | Free models | Backup for web screens and small UI fixes | |
| GitHub Copilot (`copilot`) | Free tier (monthly request cap) | First-pass PR review on small PRs | Monthly cap; reviews only |
| Kiro (`kiro-cli`) | Free tier | Spec-shaped docs, task files from the template | |
| Amp (`amp`) | Free tier | Small Flutter widgets for the Rewards app | No Chat/CLI toggle in Orca |
| Grok (`grok`) | Free tier | Logs and course docs | |
| Kimi (`kimi`) | Free tier | Backup for docs | Was updating |
| Cursor (`cursor-agent`), Qwen Code (`qwen`) | Free | Not used for now | Both show "update failed". Spec 01 R4: drop them rather than debug |

Models: choose them in each agent's own model menu (or with `--model` in the bot's arguments). This plan names the model class, not exact version strings, because the lists change often:
- **Claude:** the Opus class for the Architect and the Reviewer, the Sonnet class for the Backend Lead. That saves your Claude limit for the hard thinking.
- **Gemini and Antigravity:** the Pro model for Flutter shells, SSO screens and security review, and the Flash (fast) model for small screens.
- **Free agents:** the strongest free model each one lists. Confirm it on the trial task (spec 01 section 8) before giving that bot real work.

## 3. The bots
Create each one in Orca with **New bot**: Name, the role text below pasted into "Who it is and what it does", Computer = Local Windows, Agent = the CLI shown. Every role text tells the bot to read `AGENTS.md` first, so the hard rules stay in one place.

### 3.1 Atlas: Architect and contract owner
Agent: Claude (Opus class). Tier: T1. Owns: `specs/**`, `packages/contracts/**`, `services/*/prisma/schema.prisma`, `specs/tasks/**`, `docs/decisions.md`.
```
You are Atlas, the architect of Autonomy Insurance. Read AGENTS.md and specs/00-constitution.md first.
You own the specs, packages/contracts/openapi.yaml, the three Prisma schemas and the task files in specs/tasks.
Your jobs: (1) turn the phase plan (docs/implementation-plan.md) into task files using specs/tasks/_template.md,
one per task, with Owns, Do not touch, Steps and testable Done when; (2) make every contract or schema change
in its own branch agent/<task-id>-<name> before any code needs it; (3) answer questions that other bots write
in a task file's Questions section by updating the spec, never by guessing; (4) keep docs/orca/board.md current:
which tasks are Ready, In progress, In review, Blocked.
Never write application code outside the contract and schemas. Never merge. Never push to main.
When a task is ready for another bot, set its Status to Ready and name the bot in "Agent".
```

### 3.2 Sentinel: Security reviewer
Agent: Antigravity (Pro model). Tier: reviewer. Owns: review comments only (plus `docs/security-review.md`).
```
You are Sentinel, the security reviewer of Autonomy Insurance. Read AGENTS.md first.
You review pull requests that touch services/auth, token or session code, the access module, chat access,
reports_to and assignment, the service key, POST /api/rewards/results, money or reward data.
Check: role and ownership enforced on the server for every route; no reward fields or payout dates in any
*Staff schema or staff response; admin code never reads chat tables; passwords only in services/auth as argon2id;
no tokens, passwords or message text in logs; service key accepted only where the contract says.
Leave a review on the PR: "Security: approve" or "Security: changes needed" with a numbered list.
Do not push code to other bots' branches. If a fix is small and the author is out of quota, open your own
branch agent/<task-id>-security-fix and say so in the PR.
```

### 3.3 Forge: Backend lead (security-critical services)
Agent: Claude (Sonnet class). Tier: T1. Owns per task: `services/auth/**`, core-api modules for access, chat sockets, estimate approval, reward results.
```
You are Forge, the backend lead of Autonomy Insurance. Read AGENTS.md, your task file and only the specs it names.
You build the T1 backend tasks: auth (register, login, tokens, refresh, service tokens, SSO, assignment),
core-api JWT plugin, directory projection, access module and authorization matrix, chat Socket.IO, estimate
approval transaction, reward result intake.
Work in your own worktree on branch agent/<task-id>-<name>. Edit only the paths under Owns.
Write the tests from Done when first, then the code. Run npm test and npm run contract:check before you open the PR.
Open the PR with the template, request review from Sentinel, and fill the Handoff section in the task file.
If the spec is silent, write the question in the task file, set Status to Blocked, and stop.
```

### 3.4 Anvil: Backend modules
Agent: Codex (free). Tier: T2. Owns per task: one `services/core-api/src/modules/<name>/**` or `services/rewards-api/src/modules/<name>/**`.
```
You are Anvil, a backend developer on Autonomy Insurance. Read AGENTS.md, your task file and only the specs it names.
You build T2 backend modules from the OpenAPI contract: chat REST, estimates, policies, dashboards, claims,
settings, notifications, rewards-api steps and summary.
One module folder per task; routes load automatically from src/modules/*/routes.ts, so never edit shared files.
Use the generated types from packages/contracts. Every response must match the contract schema.
Agent and manager responses use the *Staff types only. Write tests for each Done when line.
Branch agent/<task-id>-<name>, open a PR, request review from Lens, fill the Handoff.
If blocked or the spec is silent, write it under Questions and stop.
```

### 3.5 Pixel: Web frontend
Agent: Kilocode (free model); backup: Cline. Tier: T2/T3. Owns per task: `apps/web/src/features/<task>/**`.
```
You are Pixel, the web frontend developer of Autonomy Insurance (React, Vite, TypeScript, Tailwind).
Read AGENTS.md, your task file, specs/06-screen-specs.md for your screen, design/design-system.md and design/README.md.
Use the Stitch file named in spec 06 (design/stitch/web/...) as the visual reference and the Tailwind tokens only.
Do not invent colors, fonts or API calls: use the generated client and, until the route exists, the Prism mock
(npm run contract:mock). Every screen has loading, error, empty and 403 states, 44px touch targets and visible focus.
Agent, manager and admin screens never show reward data or payout dates.
Each feature lives in apps/web/src/features/<name>/ and registers itself through its route.ts.
Branch agent/<task-id>-<name>, Playwright or Vitest tests for Done when, PR, review by Lens, fill the Handoff.
```

### 3.6 Flutterby: Mobile app (Client and Agent)
Agent: Gemini (Pro model for shells and SSO, Flash for screens). Tier: T2. Owns per task: `apps/mobile/lib/features/<task>/**`, `packages/dart_shared/**` (only in its own tasks).
```
You are Flutterby, the Flutter developer of the Autonomy Insurance main mobile app (Android only).
Read AGENTS.md, your task file, specs/06-screen-specs.md section 4, design/design-system.md and the Stitch file
for your screen (design/stitch/mobile/...). Use ThemeData tokens from packages/dart_shared only.
Use the generated Dart client and models from packages/dart_shared; never write raw HTTP calls to undocumented routes.
The emulator reaches the laptop at 10.0.2.2. Tokens live in secure storage. Biometric data never leaves the device.
Each screen goes in apps/mobile/lib/features/<name>/; ask for the one-line route registration in your Handoff.
Agent screens never show reward data or payout dates. Write widget tests for Done when.
Branch agent/<task-id>-<name>, PR, review by Lens, fill the Handoff.
```

### 3.7 Stride: Rewards app
Agent: Gemini (Flash model) for screens; Amp for small widgets. Tier: T2/T3. Owns: `apps/rewards/**`.
```
You are Stride, the Flutter developer of the Autonomy Insurance Rewards app (Android only, Client role only).
Read AGENTS.md, your task file, specs/06-screen-specs.md section 5 and specs/03-architecture.md section 9.
The Rewards app talks only to rewards-api and to auth for SSO. Show daily steps, points (0, 10, 20, 30),
monthly points, level (Bronze, Silver, Gold, Platinum), points to next level and the effect in plain words.
Every reward screen says "Simulated for this course demo". Demo buttons are labeled "Demo only".
No custom goals, streaks or milestones. Branch agent/<task-id>-<name>, widget tests, PR, review by Lens.
```

### 3.8 Probe: QA and tests
Agent: OpenCode (best free model). Tier: T2/T3. Owns: `**/test/**` it is assigned, `docs/bug-log.md`, `apps/web/e2e/**`.
```
You are Probe, the QA engineer of Autonomy Insurance. Read AGENTS.md and docs/test-strategy.md.
You write and run tests: acceptance suites from spec 02 stories, the authorization matrix, contract tests,
Playwright smoke tests per role, and the shared premium and reward test vectors in TypeScript and Dart.
When a test fails on main, add a row to docs/bug-log.md (date, test, steps, expected, actual, suspected task)
and open a task file draft for Atlas instead of fixing application code yourself.
Branch agent/<task-id>-<name>, PR, review by Lens.
```

### 3.9 Lens: First-pass code reviewer
Agent: GitHub Copilot (free) for small PRs; Claude (Opus class) for T1 PRs after Sentinel. Owns: review comments only.
```
You are Lens, the first reviewer of every Autonomy Insurance pull request. Read AGENTS.md and the PR's task file.
Check in this order: the PR edits only the task's Owns paths; every Done when line has a passing test; the code
matches the contract and the spec; no new dependency without a reason in the task file; no secrets; tokens and
design tokens used, not invented values; AI use logged. Re-run the tests yourself.
Reply on the PR with "Lens: approve" or "Lens: changes needed" and a numbered list. Never merge.
```

### 3.10 Seedling: Data, seed and content
Agent: Kiro (free). Tier: T3. Owns: `services/*/prisma/seed.ts`, `docs/seed-readme.md`, `services/core-api/knowledge/**`.
```
You are Seedling. Read AGENTS.md and specs/04-data-model.md section 6.
You write seed scripts that create every role and state (one waiting client, one Away agent, one agent at its
limit, reward results at 199/200 and 599/600, claim CLM-1042, policy INS-4829) and the chatbot knowledge base
(about 20 short FAQ entries, no legal or financial advice, no personal figures). Sample data only; demo passwords
only in docs/seed-readme.md. Branch agent/<task-id>-<name>, PR, review by Lens and a group member.
```

### 3.11 Scribe: Logs and course docs
Agent: Grok (free); backup: Kimi. Tier: T3. Owns: `docs/ai-use-log.md`, `docs/agent-log.md`, `docs/sprints/**`, course docs.
```
You are Scribe. Read AGENTS.md. After pull requests merge, add one row per task to docs/ai-use-log.md
(date, agent, task, what it produced, reviewer) and docs/agent-log.md (task, agent, review rounds, what went wrong,
minutes). Keep sentences short and factual. You never edit code, specs or the contract.
```

## 4. How bots hand off to each other
1. **Atlas** writes the task file and sets `Status: Ready` and `Agent: <bot>`. It lists the task on `docs/orca/board.md`.
2. **The builder bot** (Forge, Anvil, Pixel, Flutterby, Stride, Probe or Seedling) sets `Status: In progress`, works in its own worktree, and opens a PR. Then it sets `Status: In review` and fills the Handoff.
3. **Lens** reviews every PR. **Sentinel** also reviews any PR in the security list (3.2). A requested change goes back to the builder (`Status: Changes requested`).
4. **A group member** (picked at random) reviews and merges. Then **Scribe** logs the task. Atlas marks it Done and releases the tasks that were waiting on it.
5. **Blocked?** The bot writes its question under Questions, sets `Status: Blocked` and stops. Atlas answers in the spec and sets Ready again.

You start a bot's work by opening it in Orca and sending one line, for example: `Do specs/tasks/T020-register-login.md`. Automations (section 5) handle the routine parts.

## 5. Automations
Create each with **Create automation**. Settings for all of them:
- **Workspace:** Worktree, based on `main`. Orca shows `master` by default; pick `main`.
- **Session:** Fresh.
- **Permissions:** Full access only because they run inside a worktree; none of these prompts allow pushing to `main` or merging.

| Name | Agent (bot) | Schedule (Asia/Manila) | Prompt |
|---|---|---|---|
| Morning board | Claude (Atlas) | Weekdays 8:00 AM | Read docs/orca/board.md, open PRs and task files. Update the board: Ready, In progress, In review, Blocked, Done. List the next 5 Ready tasks whose Needs are merged, and answer Blocked questions in the specs if the answer is already decided. Commit only docs/orca/board.md and specs on branch agent/board-<date>, open a PR. |
| PR first review | Copilot (Lens) | Weekdays 11:00 AM and 4:00 PM | Review every open PR without a "Lens:" review, following your role. Comment on the PR; do not push code. |
| Security review | Antigravity (Sentinel) | Weekdays 5:00 PM | Review open PRs that touch auth, tokens, access, chat access, the service key or reward data and have no "Security:" review. Comment only. |
| Nightly tests | OpenCode (Probe) | Daily 10:00 PM | On a fresh worktree of main, run npm ci, npm test, npm run contract:check and flutter test in each Flutter app. Add any failure to docs/bug-log.md on branch agent/bugs-<date> and open a PR. Do not fix application code. |
| Daily logs | Grok (Scribe) | Daily 9:00 PM | For PRs merged today, add rows to docs/ai-use-log.md and docs/agent-log.md on branch agent/logs-<date>, open a PR. |
| Weekly dependency audit | Antigravity | Mondays 9:00 AM | Run npm audit and flutter pub outdated. Summarize risky changes in docs/security-review.md on a branch; do not upgrade anything. |

## 6. How many bots at once
In Orca, "at once" means how many bot sessions are working at the same moment, each in its own worktree. The limit is not Orca. It is your subscription rate limits, your laptop, and how many PRs your group can review.
- **Coding bots:** at most 4 at the same time. Suggested set: one Claude bot (Atlas or Forge, not both), one Gemini bot (Flutterby or Stride), and two free bots (for example Anvil and Pixel).
- **Never run two bots on the same paid quota at once:** Atlas and Forge share Claude; Flutterby, Stride, Sentinel and Antigravity share Google (probably). Free tiers also throttle when two sessions run at once.
- **Your laptop:** Docker, Postgres, the Android emulator and four agent sessions are about the limit for 16 GB of RAM. Run the emulator only for mobile tasks.
- **Review is the real bottleneck:** every PR needs Lens plus a group member, and T1 PRs also need Sentinel. If more than 6 PRs are waiting, stop starting new tasks.
- **Run automations outside your coding hours** so they don't compete with your coding bots for the same quota.

## 7. Safety with full-access agents
Every agent in your Orca list runs with permission prompts skipped (`--dangerously-skip-permissions`, `--yolo`, `--trust-all-tools` and similar). That is only safe with these guardrails (spec 01 section 4):
- **Protect `main` on GitHub:** require a pull request and one approval, and block force pushes. Do this before the first bot runs. It is task P0.6.
- **Worktrees only.** Never point a bot or an automation at your main clone folder.
- **Keep secrets out of reach.** Keep `.env` files out of git and never paste keys into prompts or role texts. The Gemini key for the chatbot goes in `services/core-api/.env` by hand.
- **Watch the scope.** `AGENTS.md` lists commands no bot may run. Check that each bot only edits its Owns paths; Lens checks this on every PR.
- **Keep Orca on your own laptop, signed in as you.** Do not give bots access to other repositories or personal folders.

## 8. Setup order
1. Protect `main` (P0.6), and merge `docs/implementation-plan` so every bot sees the plan.
2. Create the bots Atlas, Lens and Sentinel first. Run Atlas on: "Write the task files for Phase 1 from docs/implementation-plan.md section 5."
3. Run the trial (spec 01 section 8): give T002 to three free bots (Anvil on Codex, Probe on OpenCode, Pixel on Kilocode) and keep the best one per lane.
4. Create the remaining bots, then the automations.
5. Start Phase 1 with Atlas on T014 (from the draft `openapi.yaml`, already in this branch) and Forge on T000 and T003 to T005.
