# Agent log (one row per task)

| Task | Agent | Review rounds | What went wrong | Minutes | Reviewed by (agent, human) |
|---|---|---|---|---|---|
| T000 repo hygiene (PR #8) | Forge | 2 | Lens: npm install, .env tracking and git checks failed in round 1; fixed | not recorded | Lens, Sentinel |
| T001 contract tooling (PR #21) | Atlas | not recorded | no review comments on PR | not recorded | (none recorded) |
| T003 auth scaffold (PR #14) | Forge | 2 | Lens: GET /health returned status only, contract needs service too; fixed in 9e7a480 | not recorded | Lens |
| T004 core-api scaffold (PR #15) | Forge | 2 | Lens: same /health shape issue, plus error handling; fixed | not recorded | Lens |
| T005 rewards-api scaffold (PR #17) | Forge | 2 | Lens: same /health shape issue; fixed | not recorded | Lens |
| T006 web scaffold (PR #16) | Pixel | 2 | Lens: package-lock.json not updated, npm ci failed; fixed in 923d79b | not recorded | Lens |
| T010 auth schema and first migration (PR #25) | Atlas | 1 | Lens: "changes needed", prisma migrate dev step not done (no Docker); merged with that Done when item unchecked | not recorded | Lens (no approval seen in PR) |
| T014 API contract (PR #22) | Atlas | not recorded | no review comments on PR | not recorded | (none recorded) |
| T015 reward test vectors (PR #13) | Probe | not recorded | no review comments on PR | not recorded | (none recorded) |
