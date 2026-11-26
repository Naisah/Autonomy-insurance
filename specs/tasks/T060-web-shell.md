# T060 Web shell: guards, refresh, states, toasts
Status: Draft. Not Ready until P0.1 marks the specs below Approved and every task in Needs is merged to main.
Phase: 2
Tier: T2          Agent: Pixel (proposed)
Stories: A3, X2, X4             Needs: T006, T009, T001, T014
Branch: agent/T060-web-shell
Specs to read: 06 section 2; 03 sections 4 and 11; 02 section 3
Owns:
- `apps/web/src/app/**`
- `apps/web/src/shared/**`
Do not touch: anything else, especially:
- other web features
- `apps/web/src/theme/**`
- services/**, packages/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Role-based route guard and nav per role.
2. Wire the generated API client.
3. Token refresh and one retry; session-expired modal.
4. 403 page, error banner, toast, skeletons.
5. Use the Prism mock until auth routes exist.
Done when:
- [ ] Playwright: a 401 triggers one refresh, then the modal.
- [ ] Playwright: a role cannot open another role's route.
- [ ] 403 page and toast render in tests.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
