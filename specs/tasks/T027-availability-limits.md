# T027 Availability and client limits
Status: Draft. Not Ready until P0.1 marks the specs below Approved and every task in Needs is merged to main.
Phase: 2
Tier: T2          Agent: Forge (proposed)
Stories: A4, F1             Needs: T026
Branch: agent/T027-availability-limits
Specs to read: 02 A4, F1; 03 section 5.1; contract tags users and me
Owns:
- `services/auth/src/modules/availability/**`
- `services/auth/test/availability/**`
Do not touch: anything else, especially:
- other auth modules
- `services/auth/prisma/**`
- other services, apps/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. `PUT /me/availability` for agents.
2. `maxClients` on `PATCH /users/{id}` for Admin, and for a Manager on their own team.
3. Default limit from the assignment setting (10).
Done when:
- [ ] An agent can set only their own availability.
- [ ] A manager cannot change another team's limit.
- [ ] Raising a limit assigns waiting clients.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
