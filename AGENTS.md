# AGENTS.md: rules for every coding agent

Project: Autonomy Insurance (life insurance communication system). Read specs/00-constitution.md first; it is the source of truth. Then read your task file and only the specs it names.

## Workflow
1. Work only on the task file you were given in specs/tasks/. If none, stop and ask.
2. Contract first. Only a contract task edits packages/contracts/openapi.yaml. Everyone else builds against the generated clients and the mock server.
3. One task = one branch = one worktree: `agent/<task-id>-<short-name>`. Never commit to main and never merge your own branch. Only the Merge gate automation merges, and only low-risk PRs (docs/orca-bots.md section 4).
4. File boundary: edit only the paths listed under "Owns" in the task, plus your own tests. Touching anything else is a failed task.
5. Do not invent behavior. If the spec is silent, stop and write the question in the task file's Questions section.
6. No new dependencies without writing the reason in the task file.
7. Run the checks in "Done when". Do not mark done if they fail.
8. Finish by filling the task's Handoff: what changed, how to run the checks, what is left.
9. Log AI-assisted work in docs/ai-use-log.md, and the task result in docs/agent-log.md.

## Hard rules
- The server checks role and ownership on every request. Never rely on the client.
- Agent and manager responses never contain reward fields or the claim payout date. Reward fields: rewardNote, rewardStatus, rewardPoints, payoutDelayDays, payoutDueDate, reasonLabel.
- Admin code never reads chat tables. Passwords exist only in services/auth, as argon2id hashes.
- A client token is rejected on POST /api/rewards/results; the service key is rejected on every client route.
- Never log tokens, passwords or message text. Never store biometric data.
- Sample data only. Payments, payouts and rewards are simulated and screens say so.
- UI follows design/stitch, design/design-system.md and the tokens in design/README.md. Do not invent colors or fonts.
- English only. Small commits. Commit message: `<task-id>: <what>`.

## Never run
Deleting anything outside your worktree, force push, changing git remotes, installing global packages, anything touching the home directory or other repositories, or printing secrets. Keep .env files out of git; only .env.example with placeholders.

## Commands
Filled in per package by the scaffolding tasks (T003 to T009). See each package README.
