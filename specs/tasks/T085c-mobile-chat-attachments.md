# T085c Mobile chat attachments (B5)
Status: Ready. B5 and hosting approved Nov 26, 2026 (branch agent/b5-and-hosting). Start only when that PR and every task in Needs are merged to main.
Phase: 3
Tier: T2          Agent: Flutterby
Stories: B5             Needs: T085a, T090a, T033b
Branch: agent/T085c-mobile-chat-attachments
Specs to read: 02 B5; 06 mobile/client-chat, mobile/agent-chat
Owns:
- `apps/mobile/lib/features/chat-attachments/**`
- `apps/mobile/test/features/chat-attachments/**`
- attachment wiring in `apps/mobile/lib/features/chat/**` and `apps/mobile/lib/features/agent/**` only
Do not touch: anything else, especially:
- other mobile features
- `packages/dart_shared/**`
- apps/rewards/**
- services/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Pick from files or gallery (JPEG, PNG, PDF, 5 MB checked before upload).
2. Upload with progress through the generated client; file chip, image preview, PDF opened in the system viewer.
3. Wire into client and agent chat; disabled while waiting; agent tab only.
Done when:
- [ ] Widget tests: same checks as T063b.
- [ ] Upload works on the Android emulator against the local stack (noted in the Handoff).
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
