# T026 Agent assignment and waiting queue
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 2
Tier: T1          Agent: Forge
Stories: A1, A4             Needs: T022, T023
Branch: agent/T026-assignment
Specs to read: 02 A1, A4; 03 section 5.1; 04 users; decisions A7, M1, K7
Owns:
- `services/auth/src/modules/assignment/**`
- `services/auth/test/assignment/**`
Do not touch: anything else, especially:
- other auth modules
- `services/auth/prisma/**`
- other services, apps/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Assignment rule in one transaction with the client-count check.
2. Set `waiting_since` when no agent fits; emit `client.waiting` and `user.reassigned` events.
3. Re-run on: agent set Available, new or activated agent, limit raised, client reassigned away.
4. Replace the T020 stub hook.
Done when:
- [ ] Fewest clients wins; ties go to the oldest account.
- [ ] Away or full agents are skipped.
- [ ] Two simultaneous registrations cannot overfill an agent (concurrency test).
- [ ] Waiting clients are served oldest first when room appears.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
