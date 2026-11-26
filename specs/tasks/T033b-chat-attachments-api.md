# T033b Chat attachments API (B5)
Status: Ready. B5 and hosting approved Nov 26, 2026 (branch agent/b5-and-hosting). Start only when that PR and every task in Needs are merged to main.
Phase: 3
Tier: T1          Agent: Forge
Stories: B5             Needs: T033, T034, T011, T014
Branch: agent/T033b-chat-attachments-api
Specs to read: 02 B5; 03 sections 5, 7 (Attachments) and 12; 04 message_attachments; 05 section 8 (attachment operations); docs/deployment-plan.md section 3
Owns:
- `services/core-api/src/modules/attachments/**`
- `services/core-api/test/attachments/**`
Do not touch: anything else, especially:
- other core-api modules (use the chat-socket module's exported emitter; do not edit it)
- `services/core-api/prisma/**`
- other services, apps/**
- openapi.yaml, any prisma/schema.prisma, docs/**, specs/** (except this task file's Status, Questions and Handoff)
Steps:
1. `FileStore` interface with `put`, `get`, `delete`; drivers `local` (folder from env, outside the repo tree) and `supabase` (private bucket, service key from env), chosen by `STORAGE_DRIVER`.
2. `POST /conversations/{id}/attachments`: multipart limit 5,242,880 bytes; one `file`, `clientMessageId`, optional `body` (0 to 2,000).
3. Check the file signature (magic bytes) is JPEG, PNG or PDF and that the declared MIME type and extension match; otherwise 400 VALIDATION with `FILE_TOO_LARGE` or `FILE_TYPE_NOT_ALLOWED`. Nothing is stored on rejection.
4. Same write rule as sending a message (access module); a waiting client gets NO_AGENT_ASSIGNED. Rate limit 20 uploads per user per hour.
5. Store the object at `conv/{conversationId}/{attachmentId}`, then write the message (kind Attachment) and the attachment row in one transaction; delete the object if the transaction fails. Dedupe by `clientMessageId`.
6. Emit `message:new` with `attachment { id, fileName, mimeType, sizeBytes }` through the chat-socket emitter.
7. `GET /attachments/{id}/content`: same read check as the conversation (manager only while Open; others 404); headers from spec 03 section 7.
8. Never log file names or bytes; never pass files to the AI module.
Done when:
- [ ] JPEG, PNG and PDF up to 5 MB upload and stream back byte-identical (sha256 matches).
- [ ] A text file, a PNG renamed `.pdf`, and a 5,242,881-byte file are rejected, and no object or row exists afterwards.
- [ ] A reassigned-away agent and an Admin get 404 on content; a manager gets it only while the escalation is Open.
- [ ] A waiting client gets NO_AGENT_ASSIGNED.
- [ ] A forced transaction failure leaves no object in the store.
- [ ] The 21st upload in an hour returns 429.
- [ ] Responses include `X-Content-Type-Options: nosniff`, the stored content type and `Cache-Control: private, no-store`.
- [ ] Tests run on the `local` driver; the `supabase` driver has a contract test against a fake.
Notes:
- Security-list PR: Sentinel reviews (docs/orca-bots.md section 3.2).
Questions: (agent writes here, sets Status to Blocked and stops if the spec is silent)
Handoff: (agent fills in: what changed, how to run checks, what is left)
