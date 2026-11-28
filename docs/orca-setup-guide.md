# Orca setup guide: rebuild the bot team on any computer

Status: Nov 27, 2026. This is a step-by-step record of how the bot team was set up on the first laptop on Nov 26. Follow it to set up the same thing on another computer. The roles live in docs/orca-bots.md section 3, and the merge rules in section 4.1. This file gives the order to do things in and the exact settings used. Where docs/orca-bots.md section 5 differs from this file, this file shows what was actually configured.

## Phase 0. Decide which computer runs the bots
Orca bots and automations live on the computer that runs them, so they are not copied between computers. If two computers run the **same** bots on the same schedule, they waste usage on duplicate runs. The claim check (skip a task with an open PR or an `agent/<task-id>-*` branch) prevents most duplicate PRs, but not all of them.

Pick one of these:
- **Move everything (recommended).** Set up the new computer with this guide. Once it has run correctly for one day, open Orca on the old laptop and **pause every Autonomy-insurance automation** there: open the "..." menu on each row and choose Pause. Keep its bots, which cost nothing while paused.
- **Run both.** Keep device 1 as it is, and give the new computer **different** bots with their own names: Keel, Canvas, Wren and Gauge from docs/orca-second-device.md. Never create the same bot name or the same automation on both.

Never create a second Merge gate, Morning board or Daily logs. Exactly one computer runs those three.

## Phase 1. Install the tools (about 1 hour)
1. **Git and GitHub CLI.** Install Git for Windows and the GitHub CLI. Run `gh auth login` with a GitHub account that has write access to `Naisah/Autonomy-insurance`. The Merge gate uses `gh pr merge --admin`, so on the computer that runs the gate, this must be the repo owner's account.
2. **Node.js 22 LTS.**
3. **Docker Desktop and the PostgreSQL client (`psql`).** Lens needs them to re-run "Done when" checks that start the database. On Nov 26 they were missing, so Lens could not approve PR #8 (T000).
4. **Flutter SDK and Android Studio** (Android SDK, one emulator). Needed for Flutterby, Stride and the Nightly tests.
5. **Clone the repo** into a folder that is not inside another repo:
   ```
   git clone https://github.com/Naisah/Autonomy-insurance.git
   cd Autonomy-insurance
   git config user.name "<your name>"
   git config user.email "<your GitHub email>"
   ```
6. **Agent CLIs.** Install each one and sign in once from a terminal in the repo folder:

   | CLI | Used by | Account or plan |
   |---|---|---|
   | Claude Code (`claude`) | Atlas, Forge | Claude subscription |
   | Antigravity (`agy`) | Sentinel, Scout, Weekly audit | Google AI Pro |
   | Gemini CLI (`gemini`) | Flutterby, Stride | Google AI Pro |
   | Codex (`codex`) | Anvil | Free tier |
   | OpenCode (`opencode`) | Probe, Merge gate | Free model |
   | Kilocode (`kilo`) | Pixel | Free model |
   | GitHub Copilot CLI (`copilot`) | Lens | Free tier |
   | Kiro (`kiro-cli`) | Seedling | Free tier |
   | Grok (`grok`) | Scribe | Free tier |

7. **Claude plugins (optional, save usage).** In the same terminal:
   ```
   claude plugin marketplace add JuliusBrussee/caveman
   claude plugin install caveman@caveman
   claude plugin marketplace add mksglu/context-mode
   claude plugin install context-mode@context-mode
   ```
8. **Never put secrets in git.** Copy the `.env` files from the old laptop by hand, for example over a USB drive. Never commit them and never paste keys into a prompt.

## Phase 2. Orca project (10 minutes)
1. Install Orca and sign in.
2. **Add project**, then choose the cloned folder. Name it `Autonomy-insurance`.
3. In Orca's agent list, check that every CLI from Phase 1 shows as ready. Cursor and Qwen Code are not used.
4. Open a chat with Claude in the project and ask it to read AGENTS.md. This confirms the agent starts in the right folder.

## Phase 3. Create the 11 bots (30 minutes)
**New bot** for each: Name, Computer = this computer, Agent and model below. Paste the role text from docs/orca-bots.md section 3 into the bot's Soul (Settings > Soul). The description field holds only 200 characters, so put just one line there.

| Bot | Role (orca-bots.md) | Agent | Model |
|---|---|---|---|
| Atlas | 3.1 Architect | Claude | Opus |
| Sentinel | 3.2 Security reviewer | Antigravity | Pro |
| Forge | 3.3 Backend lead (T1) | Claude | Sonnet |
| Anvil | 3.4 Backend modules | Codex | default free model |
| Pixel | 3.5 Web frontend | Kilocode | best free model (Cline is the backup) |
| Flutterby | 3.6 Mobile app | Gemini | Pro (gemini-3.1-pro-preview) |
| Stride | 3.7 Rewards app | Gemini | Flash (gemini-3.8-flash) |
| Probe | 3.8 QA and tests | OpenCode | best free model |
| Lens | 3.9 First-pass reviewer | Copilot | default |
| Seedling | 3.10 Data and seed | Kiro | default |
| Scribe | 3.11 Logs and docs | Grok | default |
| Scout | 3.12 Nightly QA | Antigravity | Gemini Pro (built-in browser) |

The Merge gate is an automation, not a bot.

## Phase 4. Create the 15 automations (1 to 2 hours)
**Create automation** for each. These settings are the same for all of them:
- **Project:** Autonomy-insurance. **Host:** this computer.
- **Workspace:** New run, branch from `origin/main (default)`. Never use the main clone folder.
- **Session:** Fresh.
- **Schedule:** Custom cron (Asia/Manila time), or the preset named in the table.
- **Grace: 30 minutes.** It was "No grace" at first, and every run after 3 PM on Nov 26 was skipped while the laptop slept or Orca was closed.
- **Precheck** (review and gate automations only): `gh pr list --json number -q '.[0].number'`, timeout 1 min. The run is skipped when there are no open PRs, which saves usage.
- Orca can't create an automation paused. If the old computer is still running, pause each new one right after **Create** and resume it in Phase 6.

### 4.1 Work loops (one per builder bot)

| Automation | Agent and model | Cron | Runs at |
|---|---|---|---|
| Forge work loop | Claude Sonnet | `0 2,6,10,14,18,22 * * *` | every 4 hours from 2 AM |
| Anvil work loop | Codex | `0 3,9,15,21 * * *` | 3 and 9 AM, 3 and 9 PM |
| Pixel work loop | Kilocode | `0 2,8,14,20 * * *` | 2 and 8 AM, 2 and 8 PM |
| Flutterby work loop | Gemini Pro | `0 1,7,13,19 * * *` | 1 and 7 AM, 1 and 7 PM |
| Stride work loop | Gemini Flash | `0 4,10,22 * * *` | 4 and 10 AM, 10 PM |
| Probe work loop | OpenCode | `0 6,14 * * *` | 6 AM and 2 PM |
| Seedling work loop | Kiro | `0 11 * * *` | 11 AM |

Prompt. Replace `<Bot>` with the bot's name and `<n>` with its section number from the table in Phase 3:
```
You are <Bot>. Read AGENTS.md and follow your role in docs/orca-bots.md section 3.<n>.
Work loop, one task per run:
1. In specs/tasks/ find task files with Status: Ready and Agent: <Bot> whose Needs are all merged into main.
2. Skip any task that already has an open PR or a remote branch agent/<task-id>-*.
3. If none is left, or your usage limit is reached, stop quietly without changing anything.
4. Otherwise take the lowest task ID: work on branch agent/<task-id>-<name>, set its Status to In progress, do it exactly as the task file says, run its tests, open a PR to main, then set Status to In review and fill the Handoff.
If the spec is silent, write the question under Questions, set Status to Blocked, open the PR as a draft and stop.
Never merge and never push to main.
```
For Probe, add before the last line: `Never fix application code.`

### 4.2 Board, reviews, gate and reports

| Automation | Agent and model | Schedule | Precheck |
|---|---|---|---|
| Morning board | Claude Opus (Atlas) | cron `0 8,16 * * *` (8 AM, 4 PM) | no |
| PR first review | Copilot (Lens) | cron `0 11,17 * * *` (11 AM, 5 PM) | yes |
| Security review | Antigravity (Sentinel) | Weekdays, 5:00 PM | yes |
| Merge gate | OpenCode, free model | cron `30 9,12,15,18,21 * * *` | yes |
| Nightly tests | OpenCode (Probe) | Daily, 10:00 PM | no |
| Daily logs | Grok (Scribe) | Daily, 9:00 PM | no |
| Nightly QA | Antigravity (Scout) | cron `0 23 * * *` (11 PM) | no |
| Weekly dependency audit | Antigravity | Weekly, Monday 9:00 AM | no |

Prompts:

**Morning board**
```
You are Atlas. Read AGENTS.md and follow docs/orca-bots.md sections 3.1 and 4.1.
Board run:
1. Read docs/orca/board.md, open PRs, task files, docs/bug-log.md and any specs/tasks/BUG-* drafts.
2. Mark merged tasks Done. Set Status: Ready on every task whose Needs are all merged into main.
3. Answer Blocked questions from the specs and docs/decisions.md. Turn Scout's blocker and major bugs into Ready tasks for the bot that owns the lane.
4. Questions that would change what users see or how the course grades the work go under "Needs the team lead" on the board; do not guess those.
5. Commit only docs/orca/board.md, specs and task files on branch agent/board-<date>-<am|pm> and open a PR.
6. Then, if usage is left, take your own lowest Ready task (Agent: Atlas) whose Needs are merged and has no open PR or remote branch agent/<task-id>-*: do it on branch agent/<task-id>-<name> exactly as the task file says, run its tests, open a PR, set Status to In review and fill the Handoff.
Never merge and never push to main. If your usage limit is reached, stop quietly.
```

**PR first review**
```
You are Lens, the first-pass reviewer. Read AGENTS.md and follow your role in docs/orca-bots.md section 3.9.
Review every open PR to main whose latest commit has no "Lens:" review yet, following your role. Re-run the task's Done when tests. Reply on the PR starting with exactly "Lens: approve" or "Lens: changes needed" and a numbered list. The Merge gate relies on that wording (docs/orca-bots.md section 4.1).
Do not push code. Never merge and never push to main.
```

**Security review**
```
You are Sentinel, the security reviewer. Read AGENTS.md and follow your role in docs/orca-bots.md section 3.2.
Review open PRs that touch auth, tokens, access, chat access, the service key or reward data and have no "Security:" review. Comment only.
Never merge and never push to main.
```

**Merge gate**
```
You are the Merge gate. Read AGENTS.md and docs/orca-bots.md section 4.1, and follow 4.1 exactly.
For each open PR to main (gh pr list):
1. Skip it if it is a draft, has a merge conflict, or has the label needs-human.
2. Decide if it is high-risk using the list in section 4.1 (check the changed files with gh pr diff --name-only, and the task file's Tier). If high-risk, add the label needs-human (once) and move on.
3. Merge only if its latest commit has a "Lens: approve" review or comment with nothing newer saying "changes needed", every CI check on the latest commit passed, and it has fewer than 3 "changes needed" rounds. If it has 3 or more, add needs-human instead.
4. Merge with gh pr merge <number> --merge --admin.
Never push code, never approve, never edit files, never touch a needs-human PR.
At the end, print one line per PR: merged, skipped (why) or needs-human (why).
```

**Nightly tests**
```
You are Probe, the QA bot. Read AGENTS.md and follow your role in docs/orca-bots.md section 3.8.
On a fresh worktree of main, run npm ci, npm test, npm run contract:check and flutter test in each Flutter app. Add any failure to docs/bug-log.md on branch agent/bugs-<date> and open a PR. Do not fix application code.
Never merge and never push to main.
```

**Daily logs**
```
You are Scribe. Read AGENTS.md and follow your role in docs/orca-bots.md section 3.11.
For PRs merged today, add rows to docs/ai-use-log.md and docs/agent-log.md. Write docs/daily/<date>.md for the team lead in plain words: what merged, what waits for a human (needs-human PRs and "Needs the team lead" items), new bugs, and bots that hit their usage limit. Branch agent/logs-<date>, open a PR.
Never merge and never push to main.
```

**Nightly QA**
```
You are Scout. Read AGENTS.md and follow your role in docs/orca-bots.md section 3.12 exactly: test the app end to end like a human user, log every bug with steps to reproduce in docs/bug-log.md, draft BUG task files for blocker and major bugs, write docs/qa/<date>.md, and open one PR on branch agent/qa-<date>.
If nothing user-facing is merged yet, write a short report saying so and stop. If your usage limit is reached, stop quietly.
Never fix application code. Never merge and never push to main.
```

**Weekly dependency audit**
```
You are Sentinel. Read AGENTS.md and follow your role in docs/orca-bots.md section 3.2.
Run npm audit and flutter pub outdated. Summarize risky changes in docs/security-review.md on branch agent/deps-<date> and open a PR; do not upgrade anything.
Never merge and never push to main.
```

## Phase 5. Check that it works (30 minutes)
1. On the Automations page, every row shows a **Next run** time, and none of them says Paused except on purpose.
2. Use **Run Now** on **PR first review**. On the **Runs** tab it should show Launched, then Done. If there are open PRs, a "Lens:" comment appears on each one on GitHub.
3. Use **Run Now** on one work loop, for example Anvil. It either opens a PR or stops quietly because no Ready task fits. Both are correct.
4. Open the run's workspace from the Runs tab and read the chat. A run still showing "Launched" with **No output** after an hour is stuck: open its workspace to see what it is waiting for. On Nov 26, Pixel's run was cut off when Orca closed, and it resumed when Orca reopened.
5. The next day, check GitHub: new `agent/*` branches, PRs with Lens comments, low-risk PRs merged by the gate, and `needs-human` labels on high-risk PRs.

## Phase 6. Switch over
1. Once the new computer has passed Phase 5, pause every Autonomy-insurance automation on the old laptop (Phase 0).
2. Resume the new computer's automations if you paused them.
3. Do not touch automations from other projects, for example Curate Complete Runner.

## Lessons from Nov 26
- **Keep Orca open and the computer awake and plugged in.** Automations run only while Orca is running. In Windows, set Power > Screen and sleep > "When plugged in, put my device to sleep after" to **Never**. Closing the lid can also sleep the laptop, so set the lid action to "Do nothing" when plugged in.
- **Grace 30 minutes on every automation**, so a run delayed by a sleep or restart still happens instead of being skipped.
- **The whole build waits on T000.** Most Ready tasks need T000 (PR #8), which is high-risk and needs a human merge. Merge `needs-human` PRs promptly, or the builders find nothing to do.
- **Lens needs Docker and psql** on the computer to verify database tasks (Phase 1, step 3).
- **Don't run two automations on the same paid quota at the same time.** Atlas and Forge share Claude. Flutterby, Stride, Sentinel and Scout probably share Google. The crons above are already staggered for this.
