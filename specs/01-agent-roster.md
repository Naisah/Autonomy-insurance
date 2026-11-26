# 01 Agent roster and orchestration rules: Autonomy Insurance

Status: Draft v2 for team approval (patched for the updated high-level logic; adds the specialty column and a trial test). Follows specs/00-constitution.md (principle 6: small, independent tasks with file boundaries). Used by spec 07 to assign tasks.

## 0. Which "agent" is which
Three different things are called agents in this project. This spec is only about the third.
1. Human insurance agents in the app: real people, all with the same authority, no specialty field (spec 02, closed item).
2. The AI chatbot in the app: a bot, not an agent. It hands off to a human agent.
3. Coding agents in Orca (Antigravity, Claude, Codex and so on): they build the app. Everything below is about these.

## 1. Who is on the roster
Orca detects 14 agents. Antigravity is the only paid one (Pro) and is the default. The rest are free or limited. Quota is unknown, so each agent has a quota column to fill in; a task is never assigned to an agent with no quota left (section 5).

| Agent | Command (as shown in Orca) | Proposed tier | Specialty (starting guess) | Good for | Notes now | Quota left (fill in) |
|---|---|---|---|---|---|---|
| Antigravity (Pro) | `agy` | A, heavy | Lead, security, reviewer | Security-critical and cross-cutting work; contract and schema changes; reviews of Tier A tasks | Default agent, paid | |
| Claude | `claude` | B, medium | Backend modules, contract drafts | Backend routes, tests, refactors, careful spec-following | Update available | |
| Codex | `codex` | B, medium | Backend modules, tests | Backend and test-heavy tasks | Updating in Orca | |
| Gemini | `gemini` | B, medium | Flutter state, AI provider | Flutter and web screens, AI chatbot provider | Free tier is rate limited | |
| GitHub Copilot | `copilot` | B, medium | Flutter state, small backend | Screens, small features | | |
| Cursor | `cursor-agent` | B, medium | React screens | Web screens | Update failed in Orca (retry before use) | |
| Kiro | `kiro-cli` | C, light | Docs, spec-shaped small tasks | Spec-shaped small tasks, docs | | |
| OpenCode | `opencode` | C, light | Seed scripts, scaffolding | Seed scripts, scaffolding | | |
| Kilocode | `kilo` | C, light | Tests, scaffolding | Scaffolding, tests | Updating in Orca | |
| Cline | `cline` | C, light | React screens, Flutter widgets | Small UI and test tasks | | |
| Qwen Code | `qwen` | C, light | Tests, boilerplate | Boilerplate, tests | Update failed in Orca (retry before use) | |
| Kimi | `kimi` | C, light | Docs, boilerplate | Boilerplate, docs | Updating in Orca, CLI mode | |
| Grok | `grok` | C, light | Docs, small scripts | Docs, small scripts | | |
| Amp | `amp` | C, light | Flutter widgets, small tasks | Small tasks | No Chat or CLI toggle shown | |

The tiers and specialties are proposals from general fit, not measured results. Specialty is a preference for assigning tasks, not a restriction; Antigravity is the only agent that may take Tier A tasks without review. After the first two or three tasks, move an agent up or down based on how many review rounds its output needs (section 6).

## 2. Task tiers (what each tier may be given)
| Tier | Size cap | Examples from the specs | Assigned to |
|---|---|---|---|
| T1 heavy | 1 owner, up to about 400 changed lines | Auth service and token rules, SSO, access module and role matrix test, Socket.IO chat, estimate approve transaction, reward result apply, contract changes, Prisma schemas | Antigravity (Pro), or a Tier B agent reviewed by Antigravity |
| T2 medium | up to about 250 lines | CRUD routes from the contract, screens with data and states, Flutter API client, tests for one tag | Tier B agents |
| T3 light | up to about 120 lines | Seed scripts, theme tokens, static screens, empty and error states, docs, scaffolding | Tier C agents |

A task that needs more than its tier's cap is split before it starts. Antigravity Pro is limited too, so spend it where a mistake is most costly: anything touching passwords, tokens, roles, reports_to, chat access, money or reward data.

## 3. Rules every agent follows
These go into `AGENTS.md` (CLAUDE.md and GEMINI.md already point to it).
1. Read `specs/00-constitution.md`, the task file, and only the specs the task names. Do not invent behavior; if the spec is silent, stop and write the question in the task file's `Questions` section.
2. Contract first. Only a contract task edits `packages/contracts/openapi.yaml`. Everyone else builds against generated clients.
3. File boundary. A task lists the files and folders it owns. An agent edits only those, plus its own tests. Touching anything else is a failed task.
4. One task, one branch, one worktree: branch `agent/<task-id>-<short-name>`. Never commit to `main`. Never merge your own branch.
5. Definition of Done (constitution section 7): acceptance checks in the task file pass, tests pass, no lint errors, no secrets, AI use logged. "Reviewed by a teammate" means a human group member; an agent review is an extra step, not a replacement.
6. Security rules that never bend: the server checks role and ownership on every request; agent and manager responses never contain reward fields or the claim payout date (reward fields: `rewardNote`, `rewardStatus`, `rewardPoints`, `payoutDelayDays`, `payoutDueDate`, `reasonLabel`); admin code never reads chat tables; passwords exist only in the auth service.
7. No new dependencies without writing the reason in the task file.
8. Finish by writing a handoff note in the task file: what changed, how to run the checks, anything left undone.

## 4. Safety for permission-skipping modes
Orca launches most agents with flags that skip permission prompts (for example `--dangerously-skip-permissions`, `--yolo`, `--auto-approve`). That is workable only with guardrails:
- Run each agent in its own Orca worktree, never in your main clone folder.
- Keep `main` protected on GitHub (pull request and your approval required), so an agent cannot push to it.
- Keep secrets out of the repo. `.env` files are git-ignored, and `.env.example` holds placeholders only. Do not paste real keys (such as your Gemini key) into prompts.
- `AGENTS.md` lists commands that are never to be run: deleting outside the worktree, force push, changing git remotes, installing global packages, anything involving your home directory.
- Review every diff before merging. For T1 tasks, a second agent reviews first, then you.
- Do not give any agent access to your personal files or other repositories.

## 5. Quota and fallback
- Before starting a batch, check each agent's remaining quota and fill the roster column. Mark agents with none left as Out for today.
- If an agent runs out mid-task: commit work in progress to its branch, write the state into the task file, and reassign the task to another agent of the same tier (or one tier up for T1). The new agent starts from the handoff note, not from scratch.
- Keep a reserve: do not spend more than about 70 percent of Antigravity's quota before the Sprint 3 T1 tasks (SSO, rewards integration) are done.
- If both Update-failed agents stay broken, drop them from the roster rather than spend time debugging them.

## 6. Reviews and tuning
- Tier B and C work is reviewed by a different agent than the one that wrote it, then by the human owner. A human group member must also review each item before it counts as Done.
- Security review by Antigravity is required on Auth, the service key, role and ownership checks, and the reward endpoint.
- Track in `docs/agent-log.md` per task: task id, agent, review rounds, what went wrong, minutes spent. After the first week, rebalance tiers using that table.
- Every task also gets an entry in `docs/ai-use-log.md` (X8).

## 7. Instruction files per tool
`AGENTS.md` is the single source of rules. Some tools read it directly and some look for their own file. After the first task, check which agents ignored it, and add a one-line pointer file in that tool's own format (for example a rules file for Cline, a steering file for Kiro, a context file for Qwen) that says "follow AGENTS.md". Do not copy rules into several files; copies drift.

## 8. Trial test: same task, three free agents
Before assigning specialties for good, give three free agents the same small task (suggested: T002 premium test vectors, or one T3 scaffold) with the same acceptance criteria.
- Score each result against the Definition of Done: tests pass, file boundary respected, review rounds needed, minutes spent.
- Record it in `docs/agent-log.md`, and move agents between tiers and specialties from the result.
- Log the test in `docs/ai-use-log.md` (X8), since the work is AI-generated.

## 9. Decisions needing approval
- R1 Tier assignments in section 1 (proposed, to be tuned after week one).
- R2 Antigravity reserve rule (70 percent cap before Sprint 3 T1 tasks).
- R3 Protect `main` on GitHub and require pull requests, even though the team is small.
- R4 Drop agents with failed updates rather than repair them.
- R5 Add `docs/agent-log.md` as a per-task record.
- R6 The specialty column in section 1 is a starting guess, tuned after the trial test in section 8.
- R7 Human review by a group member is required in addition to any agent review.
