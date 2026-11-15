# Ador Chowdhury portfolio (ador008.github.io)

Personal portfolio and online CV, served by GitHub Pages from `main`. Plain HTML, CSS and JS, no build step.

## Structure
- `index.html`: simple homepage (intro, About/Contact pop-ups, two section cards).
- `education.html`: Education & CV, pill tabs: Studies, Projects, Achievements, Skills, plus "Save CV as PDF" (print stylesheet).
- `esports.html`: pill tabs: Highlights (depth photo carousel), Career, Achievements, Skills.
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

## Content still needed from Ador
Technical skills, BSc university name and years, MSc dates, academic achievements, other projects, work experience, languages, team years and in-game roles, who won MVP in photo acv06.
