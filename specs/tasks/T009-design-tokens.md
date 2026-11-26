# T009 Design tokens for web and Flutter
Status: Draft. Not Ready until P0.1 marks the specs below Approved and every task in Needs is merged to main.
Phase: 1
Tier: T3          Agent: Pixel (proposed)
Stories: X5, X7             Needs: T006, T007
Branch: agent/T009-design-tokens
Specs to read: design/README.md; design/design-system.md; 06 section 2
Owns:
- `apps/web/src/theme/**`
- `packages/dart_shared/lib/theme/**`
Do not touch: anything else, especially:
- everything else in apps/ and packages/
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Tailwind theme from design/README.md (colors, type, radius, spacing).
2. Flutter `ThemeData` with the same values in `packages/dart_shared/lib/theme/`.
3. One sample component per platform using only tokens.
Done when:
- [ ] Token values match design/README.md (a test compares the two token files to one source list).
- [ ] One sample component renders on web and in Flutter.
- [ ] No hard-coded color outside the theme folders.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
