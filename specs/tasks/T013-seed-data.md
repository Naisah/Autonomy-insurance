# T013 Seed scripts and docs/seed-readme.md
Status: Ready. Specs 00 to 07 Approved Nov 26, 2026 (PR #2). Start only when PR #2 and every task in Needs are merged to main.
Phase: 1
Tier: T3          Agent: Seedling
Stories: X6             Needs: T010, T011, T012
Branch: agent/T013-seed-data
Specs to read: 04 section 6; 02 section 6
Owns:
- `services/*/prisma/seed.ts`
- `docs/seed-readme.md`
Do not touch: anything else, especially:
- schema.prisma and migrations
- services/*/src/**
- openapi.yaml, specs/**
Steps:
1. Auth seed: 1 admin, 2 managers, 3 agents (incl. Maya Santos; one Away; one at its client limit), 6 clients (incl. Elena Rostova and Leo Mendoza; one waiting for an agent).
2. Core seed: estimates, policy INS-4829, claim CLM-1042 and claims in each status, messages, one Open escalation, reward results for all four levels incl. 199/200 and 599/600.
3. Rewards seed: matching rewards users and daily steps.
4. IDs that cross databases match (auth user ids in directory_users and rewards_users).
5. Demo passwords only in `docs/seed-readme.md`, never in code comments or other docs.
Done when:
- [ ] `npm run db:reset` rebuilds all three databases from empty.
- [ ] Every role and every listed state exists after reset (a check script or test queries them).
- [ ] `docs/seed-readme.md` lists every demo login.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
