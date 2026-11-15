# Ador Chowdhury portfolio (ador008.github.io)

Personal portfolio and online CV, served by GitHub Pages from `main`. Plain HTML, CSS and JS, no build step.

## Structure
- `index.html`: simple homepage (intro, About/Contact pop-ups, two section cards).
- `personal.html`: Personal details (for cybersecurity job applications, and the source for his CV). Tabs: Profile, Education, Experience, Projects, Skills, Certificates, plus "Save CV as PDF" (print stylesheet). `education.html` redirects here.
- `esports.html`: pill tabs: Highlights (depth photo carousel), Story (one year at a time with year buttons), Achievements (grouped by year), Teams, Skills. Goal: every esports story and achievement with its year.
- `achievement.html`: redirect to `esports.html`. Keep it: the proposal PDF links to it.
- `css/style.css`: all styles, colour tokens at the top (dark default, `[data-theme="light"]` overrides).
- `js/main.js`: theme toggle, menu, pop-ups, tabs, carousel, View all, lightbox, print.
- Icons are inline SVG (Lucide and Font Awesome brands). Edit the HTML files directly.

## Design direction (chosen by Ador)
- Modelled on the Dreamers Den site. Full pattern catalogue: `docs/design-reference.md`. Read it before design work.
- Dark theme with keycap buttons, pill tabs with a glow, Outfit + Source Sans 3, red accent for Education, gold/amber for Esports.
- Homepage must stay very simple. Section details live on their own pages, split into tabs, never one long scroll.
- Photo galleries use the depth carousel: sharp centre photo, blurred smaller neighbours, tick scrubber, description card that changes per photo, "View all".

## Working rules
- Show Ador a clickable preview before anything is merged. He does not want screenshots. Publish the preview as a private claude.ai artifact (raw.githack did not load the CSS on his phone).
- Work on a branch and open a pull request; Ador merges, and GitHub Pages deploys from `main`.
- Never invent facts. If a detail is missing (skills, dates, university name), leave it out or show "Coming soon", and ask him.
- Use plain, simple English when explaining things to Ador.

## Current status (handoff, 15 Nov 2026)
- Branch `claude/busy-hamilton-2lj1l7` holds the redesign; it is NOT merged yet. `main` still has the old site plus the LinkedIn/WhatsApp/Denmark contact updates (PRs #1 and #2, merged).
- Ador said the current design "is okay for now"; next step is optimising it page by page.
- Preview: private claude.ai artifact https://claude.ai/artifact/K5qdUtUsAxfuw9bRLqSqjZ. It is a copy of the site: `index.html` there has no `<!DOCTYPE>/<html>/<head>/<body>` wrapper (the artifact adds it); the other files are the repo files as-is. Republish it after each change (read it first, then publish to that URL). Save CV as PDF and mailto/tel links do not work inside the preview, only on the real site.
- When Ador approves: open a PR from the branch to `main` and let him merge.
- Earlier work in this project: his proposal PDF "Mobile Esports Denmark – Proposal for Esport Danmark" was redesigned (done, not in this repo).
- Environment: skills.sh and zabulanakakil.github.io are allowed hosts; Canva connector works; find-skills is installed by the environment setup script; Ador enabled the frontend-design skill (load it for design work).

## Esports facts confirmed by Ador
- In-game name: Ares. Four clubs: Soulz of BD (co-leader, midlaner/ADC), Red Viperz, Venom Esports, and his own team KINGSMEN.
- Virtual Cup 2020 (BD Coins and The Axis): Soulz of BD champions, 3-1 vs Blank Nation, Ador MVP of the final.
- Venom Esports (Arena of Valor): co-leader, Dark Slayer laner (leader Diablo). 2022 Arena of Valor Bangladesh Championship: semi-finalist, top 4. Green jerseys = Arena of Valor Bangladesh Championship tournament jersey; blue = Venom Esports club jersey (confirmed). Links: green photo -> 1Mm7hJi5kn post, blue mirror selfie -> 1GbVzEMYyE post.
- Venom Esports was covered in Jugantor (national daily): Dhaka division final of the Arena of Valor Bangladesh Championship at Jamuna Future Park, BDT 25 lakh prize pool. Ador is third from the left in the photo. Ador called it the semi-final match; confirm wording.
- D1 Cup (MLBB): runner-up with his own team KINGSMEN (jersey says SGC Kingsmen). His last tournament in Bangladesh before moving to Denmark to study. Year not given yet: shown as "Year to add"; add to the Story tab once known.
- BASIS Esports Championship 2023: Red Viperz (RV Gaming) champions, BDT 40,000; same team played IESF. Red Viperz post: share/18oXTTXFjQ (poster image redviperz-basis-2023.jpg). Poster lists Xecution, Raeburn, Blaze, Serjjj, K7, Mr.Rey: ask which name was Ador's.
- Clash of Titans Season 2 (MLBB; Bangladesh, Nepal, Pakistan, India): KINGSMEN won the Bangladesh qualifier and went to Nepal for the main event. Year, result in Nepal and post link not given yet.
- Ador is collecting screenshots of tournaments he hosted on his gaming Facebook page (Facebook is not readable from this environment).
- Images that have a source post link to that post when clicked.

## Content still needed from Ador
Esports: missing years (2018, 2019, 2021, 2024, 2025); confirm the year he joined Soulz of BD (roster post placed under 2020), other titles and placements with years, years per team and in-game role. Personal details: languages, work experience, certificates/courses, more projects.
Technical skills, BSc university name and years, MSc dates, academic achievements, other projects, work experience, languages, team years and in-game roles, who won MVP in photo acv06.
