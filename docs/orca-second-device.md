# Orca on a second device: Claude-only bots

Status: Draft, Nov 26, 2026. Adds a second computer (its own Orca account, Claude Code only) to the bot team in docs/orca-bots.md. Read that file first; everything there still applies. This file only adds what is different on device 2.

## 1. Will device 2 add usage, or share it?
It depends on which Claude account device 2 signs in to.

| Device 2 signs in to | Usage limit | What that means |
|---|---|---|
| The **same** Claude account as device 1 | Shared with Atlas, Forge and Morning board | Device 2 adds hands and a second laptop, not more Claude usage. When device 1's Claude limit is at 0, device 2's Claude bots are at 0 too. Stagger the schedules (section 6) so they don't drain the limit together. |
| A **different** Claude account | Its own limit | Device 2 can keep working when device 1's Claude limit is used up. Staggering still helps, but it is not required. |

The Orca account doesn't matter for usage. Only the Claude account does. Each device also needs its own bots: Orca bots and automations live on the computer that runs them, so device 1's bots never appear on device 2.

## 2. One-time setup on device 2 (Windows)
1. **Git and GitHub.** Install Git for Windows and the GitHub CLI. Run `gh auth login` and sign in to a GitHub account with write access to `Naisah/Autonomy-insurance`. If it's a different GitHub account, the repo owner adds it under Settings > Collaborators first.
2. **Node.** Install Node.js 22 LTS. Both plugins below need it.
3. **Clone.** In a folder that is not inside any other repo:
   ```
   git clone https://github.com/Naisah/Autonomy-insurance.git
   cd Autonomy-insurance
   git config user.name "<your name>"
   git config user.email "<your GitHub email>"
   ```
4. **Claude Code.** In PowerShell: `irm https://claude.ai/install.ps1 | iex`. Then run `claude` once in the repo folder and sign in (see section 1 for which account).
5. **Plugins.** In the same terminal:
   ```
   claude plugin marketplace add JuliusBrussee/caveman
   claude plugin install caveman@caveman
   claude plugin marketplace add mksglu/context-mode
   claude plugin install context-mode@context-mode
   ```
   Caveman makes Claude's replies shorter. Context-mode keeps large tool output out of the context window. Both save usage. Caveman starts **off** in scripted runs (`claude -p`). If an automation runs that way, set the environment variable `CAVEMAN_DEFAULT_MODE=caveman` so it stays on. Restart Claude Code after installing.
6. **Orca.** Sign in, add the cloned folder as a project (Autonomy-insurance), and check that the Claude agent starts in a chat.
7. **Never point a bot at the main clone folder.** Bots work in worktrees or "New run" workspaces only (orca-bots.md section 7).

## 3. How the two devices avoid taking the same task
- **Lanes by bot name.** Every task file has exactly one `Agent:` name. Device 2's bots have their own names (section 4) and only take tasks with their own name. Two bots never share a name, so the two devices never pick the same task.
- **Atlas assigns.** Atlas (device 1) decides which tasks go to device 2 by writing a device 2 bot name in `Agent:`. A device 2 bot never takes a task assigned to a device 1 bot, even when that bot is out of usage. To move a task, Atlas changes the `Agent:` line.
- **Claim check.** Before starting, every bot skips a task that already has an open PR or a remote branch `agent/<task-id>-*`. This is the same rule the device 1 work loops use, and it catches any mistake in the assignment.
- **Always start from a fresh `origin/main`.** Run `git fetch` before every task, so device 2 sees what device 1 merged.

What Atlas should give device 2: work that can run in parallel with device 1's lanes. That means a second backend module lane, a second web lane, a second Flutter lane and extra tests. Security-critical T1 tasks stay with Forge, and contract and schema tasks stay with Atlas.

## 4. Device 2 bots
Create each one with **New bot**: Name, a short description, Computer = this device, Agent = Claude, and the model shown. Put the role text below in the bot's SOUL.md (Settings > Soul), because the description field is limited to 200 characters.

Models: **Sonnet** for building, **Haiku** for light, repetitive work (tests from a clear spec, seed rows, small fixes). Don't use Opus on device 2; keep it for Atlas and final reviews on device 1.

| Bot | Lane | Model | Works next to (device 1) |
|---|---|---|---|
| Keel | Backend modules (T2) | Sonnet | Anvil |
| Canvas | Web screens | Sonnet | Pixel |
| Wren | Flutter screens, main app and Rewards app | Sonnet | Flutterby, Stride |
| Gauge | Tests and seed data | Haiku | Probe, Seedling |

Short descriptions (each under 200 characters):
- Keel: `Backend module builder (device 2). Builds T2 core-api and rewards-api modules from the contract. Only takes tasks with Agent: Keel.`
- Canvas: `Web screen builder (device 2). React, Vite, Tailwind screens from spec 06 and Stitch. Only takes tasks with Agent: Canvas.`
- Wren: `Flutter builder (device 2) for the main app and Rewards app. Only takes tasks with Agent: Wren.`
- Gauge: `Tests and seed data (device 2). Writes tests and seed rows from Done when lines. Only takes tasks with Agent: Gauge.`

### 4.1 Keel: Backend modules (Sonnet)
```
You are Keel, a backend developer on Autonomy Insurance, working from a second computer.
Read AGENTS.md, specs/00-constitution.md, your task file and only the specs it names.
Take only task files with Agent: Keel. Never take a task assigned to another bot.
You build T2 backend modules from the OpenAPI contract, one module folder per task:
services/core-api/src/modules/<name>/** or services/rewards-api/src/modules/<name>/**.
Routes load automatically from src/modules/*/routes.ts, so never edit shared files.
Use the generated types from packages/contracts. Every response must match the contract schema.
Agent and manager responses use the *Staff types only. Write tests for each Done when line first.
Branch agent/<task-id>-<name>, open a PR to main, request review from Lens, fill the Handoff.
If the spec is silent, write the question under Questions, set Status to Blocked and stop.
Never merge. Never push to main. Never edit openapi.yaml or any prisma/schema.prisma.
```

### 4.2 Canvas: Web screens (Sonnet)
```
You are Canvas, a web frontend developer on Autonomy Insurance (React, Vite, TypeScript, Tailwind),
working from a second computer. Read AGENTS.md, your task file, specs/06-screen-specs.md for your screen,
design/design-system.md and design/README.md.
Take only task files with Agent: Canvas. Never take a task assigned to another bot.
Use the Stitch file named in spec 06 as the visual reference and the Tailwind tokens only. Do not invent
colors, fonts or API calls: use the generated client and, until the route exists, the Prism mock.
Every screen has loading, error, empty and 403 states, 44px touch targets and visible focus.
Agent, manager and admin screens never show reward data or payout dates.
Each feature lives in apps/web/src/features/<name>/ and registers itself through its route.ts.
Branch agent/<task-id>-<name>, tests for Done when, PR to main, review by Lens, fill the Handoff.
If the spec is silent, write the question under Questions, set Status to Blocked and stop. Never merge.
```

### 4.3 Wren: Flutter screens (Sonnet)
```
You are Wren, a Flutter developer on Autonomy Insurance (Android only), working from a second computer.
Read AGENTS.md, your task file, specs/06-screen-specs.md (section 4 for the main app, section 5 for the
Rewards app), design/design-system.md and the Stitch file for your screen.
Take only task files with Agent: Wren. Never take a task assigned to another bot.
Main app: screens go in apps/mobile/lib/features/<name>/; use ThemeData tokens and the generated Dart client
from packages/dart_shared; ask for the route registration in your Handoff.
Rewards app: apps/rewards/** talks only to rewards-api and auth; every reward screen says
"Simulated for this course demo" and demo buttons say "Demo only".
Agent screens never show reward data or payout dates. Tokens live in secure storage. Never store biometric data.
Branch agent/<task-id>-<name>, widget tests for Done when, PR to main, review by Lens, fill the Handoff.
If the spec is silent, write the question under Questions, set Status to Blocked and stop. Never merge.
```

### 4.4 Gauge: Tests and seed data (Haiku)
```
You are Gauge, a test and seed-data developer on Autonomy Insurance, working from a second computer.
Read AGENTS.md, your task file and only the specs it names.
Take only task files with Agent: Gauge. Never take a task assigned to another bot.
You write tests from Done when lines and spec 02 stories, and seed rows from specs/04-data-model.md section 6.
Edit only the paths under Owns. Never fix application code: if a test fails on main, add a row to
docs/bug-log.md and write the problem under Questions for Atlas.
Sample data only; demo passwords only in docs/seed-readme.md.
Branch agent/<task-id>-<name>, PR to main, review by Lens, fill the Handoff.
If the spec is silent, write the question under Questions, set Status to Blocked and stop. Never merge.
```

## 5. Work loop automations
Create one automation per bot with **Create automation**:
- **Agent:** Claude, with the bot's model (section 4). Open as chat.
- **Bot or project:** Autonomy-insurance.
- **Workspace:** New run, branch from `origin/main`.
- **Session:** Fresh. **Grace:** No grace, so missed runs are skipped rather than all run at once.
- **Schedule:** Custom cron from section 6.
- Orca can't create an automation paused. Pause it right after **Create**, and resume it only once task files for that bot exist on `main`.

Prompt (replace `<Bot>` with the bot's name, for example Keel):
```
You are <Bot>. Read AGENTS.md and follow your role in docs/orca-second-device.md section 4.
Work loop, one task per run:
1. git fetch. In specs/tasks/ find task files with Status: Ready and Agent: <Bot> whose Needs are all merged into main.
2. Skip any task that already has an open PR or a remote branch agent/<task-id>-*.
3. If none is left, or your usage limit is reached, stop quietly without changing anything.
4. Otherwise take the lowest task ID: work on branch agent/<task-id>-<name>, set its Status to In progress, do it exactly as the task file says, run its tests, open a PR to main, then set Status to In review and fill the Handoff.
If the spec is silent, write the question under Questions, set Status to Blocked, open the PR as a draft and stop.
Never merge and never push to main.
```

## 6. Schedules (Asia/Manila), staggered against device 1
Device 1's Claude runs: Forge at 2, 6 and 10 AM and 2, 6 and 10 PM, Morning board on weekdays at 8 AM, and Atlas when you message it. Device 2's Claude bots run only in the hours between those, and never two at the same time:

| Bot | Cron | Runs at |
|---|---|---|
| Keel | `0 1,5,9,13,17,21 * * *` | 1, 5, 9 AM; 1, 5, 9 PM |
| Canvas | `0 3,7,11,15,19,23 * * *` | 3, 7, 11 AM; 3, 7, 11 PM |
| Wren | `0 0,12,20 * * *` | 12 AM, 12 PM, 8 PM |
| Gauge | `0 4,16 * * *` | 4 AM, 4 PM |

If device 2 uses the same Claude account, keep these times. If one run usually takes more than an hour, drop a time slot rather than letting two runs overlap. If device 2 uses a different Claude account, you can add slots, but keep at most two device 2 bots running at once so the laptop stays usable.

## 7. What changes elsewhere
- **Atlas:** when writing task files, assign parallel T2 and T3 work to Keel, Canvas, Wren or Gauge as well as to device 1's bots. Don't assign two tasks that own the same paths to bots that may run at the same time.
- **Lens and Sentinel (device 1)** review device 2's PRs like any other. A group member merges, as before.
- **docs/orca-bots.md:** once the team confirms device 2, add these four bots to the roster in section 3.
