# AGENTS.md: rules for every coding agent

Project: Autonomy Insurance (life insurance communication system). Read specs/00-constitution.md first. It is the source of truth.

## Workflow
1. Work only on the task file you were given in specs/tasks/. If none, stop and ask.
2. Read the linked specs, the OpenAPI contract and the Stitch screens named in the task before writing code.
3. One task = one branch = one worktree: `task/<id>-<short-name>`. Never commit to main.
4. Touch only the files listed under "Owns" in the task. If you need another file, stop and note it in the task under "Blocked".
5. Do not edit packages/contracts/openapi.yaml unless the task says so. API changes go through a spec change first.
6. Write the tests listed in the task. Run them. Do not mark done if they fail.
7. Finish by filling the task's "Result" section: what changed, how to verify, anything left.

## Hard rules
- The server checks role and ownership on every request. Never rely on the client.
- Passwords exist only in services/auth, as hashes. Never log tokens or passwords.
- Never store biometric data. Biometrics are device-side only.
- Admins cannot read chat content. Managers read escalated chats only. Agents cannot see reward status.
- Sample data only. No real personal data. Payments and claims are simulated.
- UI follows design/stitch and the tokens in design/README.md. Do not invent new colors or fonts.
- English only. Keep commits small. Commit message: `<task-id>: <what>`.
- Log AI-assisted work in docs/ai-use-log.md.

## Commands (filled in when each package exists)
See each package README.
