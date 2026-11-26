# Design: Stitch exports, tokens, screen inventory

Raw exports: one HTML file per screen under design/stitch/{web,mobile,rewards}. They are reference, not production code. Rebuild them as components in apps/web (React) and apps/mobile, apps/rewards (Flutter). Stitch project: https://stitch.google.com/projects/1279067432465216666 (needs sign-in; agents use the HTML files).

## Tokens (from the Tailwind config in the exports)
Colors: primary #D52B1E, primary-hover/deep-red #A81F16, primary-container #FFEDEA, secondary/gold #F2B705, secondary-container #FFEFD4, surface/warm-white #FAF7F2, card #FFFFFF, on-surface #4B4B4D, strong text #1B1B1D, muted text #5E5E60, outline #D9D9DA, success #15803D, warning #B45309, error #BA1A1A.
Fonts: Hanken Grotesk (display, headline), DM Sans (title, body, label), DM Mono (numbers, IDs).
Radius: sm 8, default 16, md 20, lg 24, xl 32, full 9999. Spacing: 4, 8, 16, 24, 32; section 64 and 96; page margin 24.
Type scale: display-xl 84/84, display-lg 64/68, display-md 48/52, headline-lg 36/42, headline-md 24/30, title-lg 20/26, title-md 16/22, body-lg 18/28, body-md 16/24, body-sm 14/20, label-lg 14/20, label-sm 12/16, mono-md 14/20. Mobile variants exist for display and headline-lg.
Motion: state-change 150ms, card-lift 240ms, surface-enter 320ms, surface-exit 180ms.
Full values live in the tailwind config at the top of each exported file.

## Screen inventory (38 screens exported, complete as of the zip export)
Web (18)
| Screen | File | Features |
|---|---|---|
| Landing | web/landing | entry to portals |
| Client login, register | web/client-login, web/client-register | A1, A3 |
| Client dashboard | web/client-dashboard | C5, overview, G5 effect |
| Chat with Agent (agent and AI tabs) | web/client-chat | B1, B3, E1, E2 |
| Estimate and past estimates | web/client-estimate | C1, C2, C3 |
| Policy details and payment schedule | web/client-policy | C5 |
| Claims list, file a claim, claim details | web/client-claims, web/client-file-claim, web/client-claim-details | D1, D2 |
| Client profile and security | web/client-profile | A5 info, Rewards link |
| Agent desk (clients, estimates, chat, escalate) | web/agent-dashboard | B2, B4, C4, F1 |
| Agent claims review | web/agent-claims | D3 |
| Manager dashboard, escalations and reassign | web/manager-dashboard, web/manager-escalations | F2, B4 |
| Admin console, accounts | web/admin-console, web/admin-accounts | A4, F3 |
| States sheet (loading, error, 403, session expired) | web/states | all |

Mobile main app (14)
| Screen | File | Features |
|---|---|---|
| Sign in, create account | mobile/sign-in, mobile/register | A1, A3 |
| Biometric unlock | mobile/biometric-unlock | A5 |
| Client dashboard | mobile/client-dashboard | overview |
| Chat with Agent (agent and AI toggle) | mobile/client-chat | B1, E1, E2 |
| Estimate, policy details | mobile/client-estimate, mobile/client-policy | C1 to C5 |
| Claims list, file a claim, claim details | mobile/client-claims, mobile/client-file-claim, mobile/client-claim-details | D1, D2 |
| Profile | mobile/client-profile | A5, settings |
| Agent home, chat, review estimate | mobile/agent-home, mobile/agent-chat, mobile/agent-review-estimate | B2, B4, C4, F1 |

Rewards app (6 exported, 4 target screens)
rewards/signin (G1), rewards/client-only-access (G1 role check), rewards/home (G2, G3), rewards/health-score (G3, G4), rewards/goals-rewards (G3), rewards/effect (G5 shown to the client). Target (spec 06): rewards/signin, rewards/client-only-access, rewards/home, rewards/status. rewards/status is made by editing rewards/health-score; rewards/goals-rewards and rewards/effect are retired once merged into it.

## Notes and open design points
- Admin console has a toggle "Auto-apply Step Rewards discount". The guide defines the reward effect as extending the premium collection period and delaying or reducing claims payouts, not a discount. Align the label or the rule before building (decide in spec 03).
- The exports are linked into a clickable prototype: open design/prototype/index.html. Stitch's own link paths are rewritten by design/prototype/link_stitch.py, and design/prototype/proto-links.js wires the buttons Stitch left unlinked. Re-run the script after every new export (design/prototype/README.md).
- Access rules were checked against the screens: agent and manager screens show no reward data, admin screens show no chat content, managers see escalated chats only.

## Still missing
- Mobile manager and admin screens are not designed. Assumed web-only for those roles unless the team decides otherwise.
- Agent claims review on mobile (D3).
- Source of truth for brand and components: design/design-system.md (exported from Stitch). Raw files came from stitch_remix_of_insuria_life_insurance_platform (2).zip, exported 2026-11-26.

- Full list of Stitch edits still to do: specs/06-screen-specs.md section 7.
