# T014 Finish packages/contracts/openapi.yaml from spec 05
Status: Done. Merged to main (PR #22, Atlas). Marked Done by Atlas Nov 28, 2026.
Phase: 1
Tier: T1          Agent: Atlas
Stories: all             Needs: T001
Branch: agent/T014-openapi-contract
Specs to read: 05 (all, especially section 8); 02 section 4; 03 sections 4, 5, 5.1, 7, 9
Owns:
- `packages/contracts/openapi.yaml`
- `packages/contracts/generated/**` (regenerated output only)
Do not touch: anything else, especially:
- lint rules and scripts (T001)
- test vectors (T002, T015)
- services/**, apps/**, any prisma/schema.prisma, docs/**, specs/** (a spec gap becomes a Question)
Steps:
1. Start from the Nov 26 draft already in `packages/contracts/openapi.yaml` (Q8).
2. Apply the spec 05 section 8 change list in one commit.
3. Check every story in spec 02 except A2 and A5 has an operation (B5 included: the two attachment operations in spec 05 section 8), with `x-roles`, `x-stories`, `x-priority`.
4. Include `POST /service/token` (T024a) and the Admin close-period operation through core-api that spec 05 section 8 lists (Q12).
5. List the Socket.IO events in the description header (spec 03 section 7).
6. Regenerate clients and run `npm run contract:check`.
Done when:
- [x] `npm run contract:check` passes.
- [x] Every story except A2 and A5 has at least one operation, B5 included (scripted check over `x-stories`).
- [x] Lint fails if a `*Staff` schema gains a reward field.
- [x] Mock server answers one route per tag.
- [x] No `payoutReductionPercent`, `payoutAmount`, `healthScore`, `/rewards/goal`, `/rewards/milestones` remain.
Notes:
- Spec 07 says the file does not exist; that line is out of date (decision K6, Q8).
- Contract decisions C1 to C8 are decided (docs/decisions.md).
Questions:
- Q-T014-1 (contract choice, please confirm in review): spec 03 s9 and Q12 say Admin's "Close period now" goes to core-api, which calls rewards-api with a `rewards:close-period` service token, but no spec names the routes. This PR adds `POST /admin/rewards/close-period` (core-api, Admin, demo) and `POST /internal/rewards/close-period` (rewards-api, service key, scope `rewards:close-period`), both returning `{ period, clientsClosed }`. Spec 06's admin-console row still lists `POST /rewards/demo/close-period`; that row should point to the new core-api route.
- Q-T014-2: `GET /attachments/{id}/content` answers 404 (not 403) to anyone who may not open the file, so a file's existence is not revealed. Spec 05 s8 lists only 401 and 404, which matches.
Handoff:
- What changed: the Nov 26 draft already had almost all of the spec 05 section 8 change list. This task adds what was missing: B5 (`POST /conversations/{id}/attachments` as multipart, `GET /attachments/{id}/content`, schemas `Attachment` and `SendAttachmentRequest`, `Message.attachment`, `MessageKind` value `Attachment`, plus a note on the `message:new` socket event); Admin's demo close-period through core-api (Q12; see Q-T014-1) with schema `ClosePeriodResult` and the `rewards:close-period` scope on `/service/token`; version 1.0.0; `info.contact`. `generated/ts/api.d.ts` was regenerated.
- Counts: 74 paths and 87 operations (the draft had 70 and 83).
- Checks on Nov 28: `npm run contract:check` exit 0 (0 errors; 62 `operation-description` warnings remain); 104 vector tests pass; Prism answered 200 on one route for each of the 16 tags; the removed names have 0 matches.
- Story coverage check (run from packages/contracts): `python3 -c "import yaml;d=yaml.safe_load(open('openapi.yaml'));s={x for v in d['paths'].values() for m,o in v.items() if m in('get','post','put','patch','delete') for x in o['x-stories']};print([f'{c}{i}' for c,k in zip('ABCDEFG',[6,5,5,3,2,4,5]) for i in range(1,k+1) if f'{c}{i}' not in s])"` prints `['A5']`. A2 is also covered, through `/internal/directory-events`.
- Left: operation descriptions (warnings only); updating the packages/contracts README (outside Owns; it still describes the draft); spec 06's admin-console row (Q-T014-1).
