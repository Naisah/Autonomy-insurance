# 01 Agent roster and task tiers

Status: Draft. Tiers are my assumption from general capability. The team lead marks real quota in the "Quota" column and I adjust.

14 agents detected in Orca: Antigravity (default, Pro subscription), Claude, Codex, Gemini, GitHub Copilot, Grok, OpenCode, Amp, Kilocode, Kiro, Cline, Cursor, Kimi, Qwen Code. All except Antigravity are limited or free.

## Tiers
| Tier | Agents | Use for | Quota |
|---|---|---|---|
| A: lead | Antigravity (Pro) | Hardest and highest-risk work: Auth service and SSO token exchange, role and ownership checks, real-time chat, estimate-to-policy flow, reward-result effects, final integration, reviewing other agents' output | Pro (fill in) |
| B: strong free | Claude, Codex, Gemini, GitHub Copilot | Medium work: a full service module, Flutter screens with state, OpenAPI contract, ERD and Prisma schema, AI chatbot service | (fill in) |
| C: small free | Cursor, Kimi, Qwen Code, OpenCode, Kilocode, Kiro, Cline, Grok, Amp | Small, well-bounded work: one React screen from a Stitch file, one Flutter widget, seed data, unit tests, README and docs, lint and bug fixes | (fill in) |

Cursor and Qwen Code showed "update failed" and Kimi/Kilocode/Codex/Claude were mid-update. Retry updates before assigning them.

## Rules for assigning tasks
1. One task per agent per worktree. File ownership never overlaps between running tasks.
2. Task size by tier: A up to a full feature slice; B up to one module or 5 to 8 files; C up to 3 files and one clear test.
3. Every task file lists: Goal, Specs to read, Stitch files, Owns (files), Do not touch, Acceptance checks, Tests, Result.
4. Cheap agents never get security-critical tasks (auth, role checks, token handling). Those go to tier A or B and get reviewed by a different agent.
5. Review: a different agent than the author reviews each task before merge (satisfies "reviewed by a teammate"). Tier A reviews tier B and C security-related work.
6. When an agent runs out of quota mid-task, the task file keeps the progress notes so another agent can continue from the branch.
7. Spread similar work across several tier C agents in parallel (for example, one Stitch screen each) to stay inside each free quota.
8. All agents read AGENTS.md. GEMINI.md and CLAUDE.md point to it. Agents that read other instruction files (Cursor, Cline, Copilot, Kiro) get the same rules via a short pointer file when we add them.
