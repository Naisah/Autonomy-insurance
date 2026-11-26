# T063b Web chat attachments (B5)
Status: Ready. B5 and hosting approved Nov 26, 2026 (branch agent/b5-and-hosting). Start only when that PR and every task in Needs are merged to main.
Phase: 3
Tier: T2          Agent: Pixel
Stories: B5             Needs: T063, T068, T033b
Branch: agent/T063b-web-chat-attachments
Specs to read: 02 B5; 06 web/client-chat, web/agent-dashboard; design/design-system.md
Owns:
- `apps/web/src/features/chat-attachments/**`
- attachment button and message rendering in `apps/web/src/features/client-chat/**` and `apps/web/src/features/agent-clients/**` only
Do not touch: anything else, especially:
- other web features
- `apps/web/src/{app,shared,theme}/**`
- services/**, packages/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. Attachment components: picker (JPEG, PNG, PDF, 5 MB checked before upload), upload with progress, file chip, image preview, PDF download.
2. Fetch content with the bearer token and show it from an object URL; revoke the URL on close.
3. Wire into the client chat agent tab and the agent chat panel; disabled while the client waits for an agent.
4. Show the server's reason for a rejected type or size, and the note: Do not upload real personal documents.
Done when:
- [ ] Tests: a rejected type and an oversize file show the reason and send nothing.
- [ ] Upload shows progress, then a chip in both chats.
- [ ] Image preview opens; PDF downloads.
- [ ] Attach is disabled while the client is waiting.
- [ ] No attach button on the AI tab.
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
