# Clickable prototype (deliverable 12)

Open `index.html` in a browser (double-click works, no server needed). It has one entry point per role: client web, client mobile, agent, manager, admin and the Rewards app. Mobile screens open in a phone frame (`phone.html`). Every screen has a small "Prototype" chip at the bottom left that comes back here. The screens load Tailwind and fonts from the web, so you need an internet connection.

## Files
- `link_stitch.py`: turns a Stitch ZIP export into design/stitch. It copies each screen to its real file name, rewrites Stitch's internal links (`../client-login/ClientLogin.html` and so on) and adds `proto-links.js` to every page.
- `proto-links.js`: wires the buttons, cards and forms that Stitch left unlinked (landing portal links, sign-in forms, biometric unlock, policy and claim cards, file a claim, and so on) and adds the "Prototype" chip. The list is `HOTSPOTS` at the top.
- `index.html`, `phone.html`: the launcher and the phone frame.

## After a new Stitch export
1. Unzip the export somewhere outside the repo.
2. `python design/prototype/link_stitch.py "<unzipped folder>/stitch_remix_of_insuria_life_insurance_platform" .`
3. If it prints NOT MAPPED, add the new screen or link name to `FOLDERS` or `TARGETS` in the script and run it again.
4. Click through the flows on the launcher, and update the edit table in specs/06-screen-specs.md section 7.

## Known limits
- Mobile agent "Claims" opens the web agent claims screen; there is no mobile agent claims screen yet.
- The Rewards screens still show the old 0 to 100 health score; see spec 06 section 7.
