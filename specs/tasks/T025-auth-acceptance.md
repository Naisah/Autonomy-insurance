# T025 Auth acceptance suite for A1 and A3
Status: Draft. Not Ready until P0.1 marks the specs below Approved and every task in Needs is merged to main.
Phase: 2
Tier: T2          Agent: Probe (proposed)
Stories: A1, A3             Needs: T021
Branch: agent/T025-auth-acceptance
Specs to read: 02 A1, A3 and section 3; contract tag auth
Owns:
- `services/auth/test/acceptance/**`
Do not touch: anything else, especially:
- `services/auth/src/**`
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. List every acceptance bullet in spec 02 A1 and A3.
2. Write one HTTP-level test per bullet against a real test database.
3. Name each test after its bullet.
Done when:
- [ ] Every A1 and A3 acceptance bullet maps to a passing test.
- [ ] A table in the Handoff maps bullet to test name.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
