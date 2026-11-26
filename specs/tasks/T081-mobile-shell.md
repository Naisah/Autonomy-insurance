# T081 Mobile shell: secure storage, refresh, role tabs, states
Status: Draft. Not Ready until P0.1 marks the specs below Approved and every task in Needs is merged to main.
Phase: 2
Tier: T2          Agent: Flutterby (proposed)
Stories: A3, X2             Needs: T007, T009, T080
Branch: agent/T081-mobile-shell
Specs to read: 06 section 4; 03 sections 4 and 11
Owns:
- `apps/mobile/lib/app/**` (including `routes.dart`)
- `apps/mobile/lib/shared/**`
- `apps/mobile/test/app/**`
Do not touch: anything else, especially:
- apps/rewards/**
- `packages/dart_shared/lib/theme/**`
- services/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Tokens in secure storage.
2. Refresh and one retry.
3. Role-based tab bar (Client, Agent only; S2).
4. Session-expired and 403 states.
Done when:
- [ ] Widget test: expired session shows the session-expired state.
- [ ] Widget test: tabs match the role.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
