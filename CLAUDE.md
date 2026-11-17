# Ador Chowdhury portfolio (ador008.github.io)

Personal portfolio and online CV, served by GitHub Pages from `main`. Plain HTML, CSS and JS, no build step.

## Structure
- `index.html`: simple homepage (intro, About/Contact pop-ups, two section cards).
- `personal.html`: Personal details = his academic CV (for cybersecurity job applications). NO esports content here except the short "Outside my studies" card linking to esports.html. Tabs: Profile, Education (degrees + MSc courses by semester), Experience, Thesis & projects (thesis card first, then semester projects; Report/GitHub buttons say "coming soon" until Ador sends files/repos), Skills, Certificates, plus "Save CV as PDF". `education.html` redirects here. Learning Hub was removed at Ador's request.
- `esports.html`: pill tabs: Highlights (depth photo carousel), Story (one year at a time with year buttons), Achievements (grouped by year), Teams, As an Organizer (tournaments he hosted on Lazzy Winners, poster cards, newest first), Skills. Goal: every esports story and achievement with its year.
- `team-bangladesh.html`, `team-redviperz.html`, `team-venom.html`, `team-soulz.html`, `team-kingsmen.html`: one page per club (banner, achievements, photo carousel). Opened from the Teams tab cards.
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
- The portfolio covers his PAST activities only. Do not mention Mobile Esports Denmark anywhere on the site: it is not approved yet. Add it only if Ador says the meeting went well.
- Never invent facts. If a detail is missing (skills, dates, university name), leave it out and ask him.
- Never show notes meant for Ador on the live site (no "to add" lines, no "+ Add ..." boxes). Leave the space blank; use "Coming soon" only where more content is really on the way (Ador, 17 Nov 2026: "sometimes keeping blank looks nicer").
- Use plain, simple English when explaining things to Ador.

## Current status (17 Nov 2026)
- The redesign is LIVE: PR #3 (redesign) and PR #4 (European PDF CV) are merged into `main`. Keep working on branch `claude/busy-hamilton-2lj1l7`; open a new PR for each batch of changes and let Ador merge.
- Preview: private claude.ai artifact https://claude.ai/artifact/K5qdUtUsAxfuw9bRLqSqjZ. It is a copy of the site: `index.html` there has no `<!DOCTYPE>/<html>/<head>/<body>` wrapper (the artifact adds it); the other files are the repo files as-is. Republish it after each change (read it first, then publish to that URL). Save CV as PDF and mailto links do not work inside the preview, only on the real site.
- Floating button on every page is "Email me" (opens a pop-up with Copy / email app / Gmail); WhatsApp is only in the Contact pop-up.
- Cache busting: every page links `css/style.css?v=…` and `js/main.js?v=…`. Bump the `?v=` value on ALL pages (and the preview's index.html) whenever style.css or main.js changes, or browsers keep the old copy (Ador saw an old View all on 17 Nov).
- "View all" grid: moved to <body> by JS, sits below the site header (top: --header-h, z 45) so the header nav stays usable; has its own section bar (.flood-nav); tap outside closes it.
- Hover glow effects are mouse-only (`@media (hover:hover) and (pointer:fine)`), so tapped buttons don't stay lit on phones.
- Earlier work in this project: his proposal PDF "Mobile Esports Denmark – Proposal for Esport Danmark" was redesigned (done, not in this repo).
- Environment: skills.sh and zabulanakakil.github.io are allowed hosts (aau.dk is blocked); Canva connector works; find-skills is installed by the environment setup script; the frontend-design skill was not available in the 16 Nov session.

## Esports facts confirmed by Ador
- In-game name: Ares. Four clubs: Soulz of BD (co-leader, midlaner/ADC), Red Viperz, Venom Esports, and his own team KINGSMEN.
- Virtual Cup 2020 (BD Coins and The Axis): Soulz of BD champions, 3-1 vs Blank Nation, Ador MVP of the final.
- Venom Esports (Arena of Valor): co-leader, Dark Slayer laner (leader Diablo). 2022 Arena of Valor Bangladesh Championship: semi-finalist, top 4. Green jerseys = Arena of Valor Bangladesh Championship tournament jersey; blue = Venom Esports club jersey (confirmed). Links: green photo -> 1Mm7hJi5kn post, blue mirror selfie -> 1GbVzEMYyE post.
- Venom Esports was covered in Jugantar (national daily): Dhaka division final of the Arena of Valor Bangladesh Championship at Jamuna Future Park, BDT 25 lakh prize pool. Ador is third from the left in the photo. Ador called it the semi-final match; confirm wording.
- D1 Cup (MLBB): runner-up with his own team KINGSMEN (jersey says SGC Kingsmen). His last tournament in Bangladesh before moving to Denmark to study. Year: 2024 (from Ador); has its own 2024 chapter in the Story tab.
- BASIS Esports Championship 2023: Red Viperz (RV Gaming) champions, BDT 40,000; same team played IESF. Red Viperz post: share/18oXTTXFjQ (poster image redviperz-basis-2023.jpg). Poster lists Xecution, Raeburn, Blaze, Serjjj, K7, Mr.Rey: ask which name was Ador's.
- Clash of Titans Season 2 (MLBB; Bangladesh, Nepal, Pakistan, India): KINGSMEN won the Bangladesh qualifier. It was an ONLINE tournament: they did not travel to Nepal (never say "played in Nepal"). Post: share/p/152EapeM9ZL. Year: 2024 (from Ador); in the 2024 Story chapter. Result of the main event not given yet.
- His gaming Facebook page is "Lazzy Winners" (share/1JjWPBxP6Y), linked from the homepage, contact pop-up and footer. Ador is collecting screenshots of tournaments he hosted there (Facebook is not readable from this environment).
- Hosted on Lazzy Winners: Grimlock Battle, Roger 1v1 (MLBB), posted 24 Mar 2023, free entry with Grimlock skin, prize pool BDT 1,500, registration 25-28 March, post share/p/1F1kUBCtEf. Brawl Legends, 4v4 brawl (MLBB), posted 6 Mar 2023, prize pool BDT 2,000, registration opened 6 March, post share/p/1E3YbmeKVw (poster spells it "Brawl Lagends"; a later post mentioned its top 8 teams).
- GenJam Season 01: 5v5 draft pick fun tournament, mid-lane heroes only (MLBB), posted 22 Nov 2021 by Niaz Nur, co-hosted with itzDiablo and Carnival Of Ashes; winner 4,500 diamonds, runner-up 3,800; 32 slots; free entry; registration 20 Nov to 1 Dec. Post link not given yet (poster opens larger instead).
- LW Magic Chess Nation Cup Season 01 (MLBB Magic Chess), posted 25 Aug 2021, with BD Coins; prizes 1,100/900/600 diamonds, 4th-8th 79 each; 128 slots; free; registration 25-29 Aug; post share/p/1D1AxS25nU.
- MLBB Cosplay Competition (gaming cosplay contest, poster branded Lazzy Plays): winners announced live on Lazzy Winners 10 August at 2 pm; year not given; post share/p/1DyLiF3veF.
- Queens of MLBB: 4v4 brawl, girl gamers only, presented by Mobile Legends: Bang Bang Official Bangladesh (poster branded Lazzy Plays); winner 2,000 diamonds, runner-up 1,000; free; registration from 25 May; year not given; post share/p/1JNtajHqqc.
- Banner backgrounds (chosen by Ador): Personal details uses the coat photo (images/portrait-coat.jpg, from old pic15.jpg); Esports uses the D1 Cup trophy photo (images/kingsmen-d1-cup.jpg). The homepage cards use the same two photos.
- Team achievements (from Ador): Red Viperz (Ador was team leader; one of the biggest esports organizations in Bangladesh) = national champion in the IESF 2023 Bangladesh qualifier (then played the IESF South Asia qualifier in Saudi Arabia as Team Bangladesh and lost both matches, from Ador 17 Nov 2026; never call it 'regional champion'), BASIS champion, IUB runner-up (he called it "IUB esports expo"; site says IUB Gaming Fest, confirm). All black-and-red jersey photos are Red Viperz. Venom = top 4 AoV Bangladesh + Jugantar coverage. Soulz of BD = Virtual Cup champion, Codashop MLBB Challenge champion (2021, from Ador; own Story chapter, no photo or post yet). KINGSMEN = D1 Cup runner-up, winner Bangladesh regional qualifier for Clash of Titans S2 (online).
- Team Bangladesh (IESF South Asia Qualifier, Saudi Arabia 2023): photos bd-iesf-stage, bd-iesf-kazakhstan, bd-iesf-philippines (post share/p/1FwSNV1282, same link for all three) and bd-iesf-road-to-riyadh poster (no link). Also acv01 (BASIS champion poster) and acv04 (team at venue): Red Viperz jerseys, but this was the full Team Bangladesh squad (Ador).
- Images that have a source post link to that post when clicked.

## MSc facts (from Ador)
- BSc: Computer Science and Engineering, National University, Bangladesh, 2018-2023, CGPA 3.36/4.00 = 7 on the Danish scale (from Ador).
- MSc: Sep 2024 to Jan 2027 (expected), grade average 7. SSC 2014, HSC 2016 (school names not given).
- Experience: part-time at 7-Eleven (dates, country not given); Co-counselor MLBB at BYDESA (Bangladesh Youth Development and Electronic Sports Association); volunteer at official BYDESA tournaments.
- Skills: Python, AI-assisted coding (he said 'vibe coding'); Wireshark, Nmap, Kali Linux; PyTorch, TensorFlow, Hugging Face; Linux, Windows, cloud environments. Languages: Bengali, English, Hindi, Urdu, a little Danish (levels not given).
- PDF CV: "Save CV as PDF" prints ONLY the hidden .cv-print block in personal.html (European/Europass layout, navy accent). Personal biodata (DOB, height, weight, blood group, religion, parents, marital status, children) is shown on the website but must stay OUT of the PDF (Ador, 16 Nov 2026). When CV facts change, update both the tabs and .cv-print.
- Course descriptions on the site are general (written by Claude, AAU site was blocked); Ador should confirm, especially Hacker Space and Advanced Cybersecurity.
- Courses: Sem 1 Fundamentals of Cryptography, Network Security, Internet of Things (IoT). Sem 2 Software Security, Hacker Space, Identity and Access Management. Sem 3 Advanced Cybersecurity, Enterprise Security, Privacy Engineering. Sem 4 thesis (in progress).
- Projects: Sem 1 Data poisoning in distributed learning. Sem 2 Membership inference attacks in federated learning. Sem 3 Hallucinations in large language models. Thesis: Investigating the impact of prompt length on jailbreaks in large language models. He will add a report file and GitHub repo for each.

## Content still needed from Ador
Esports: missing years (2018, 2019, 2021, 2024, 2025); confirm the year he joined Soulz of BD (roster post placed under 2020), other titles and placements with years, years per team and in-game role. Personal details: languages, work experience, certificates/courses, more projects.
Technical skills, MSc dates, academic achievements, other projects, work experience, languages, team years and in-game roles, who won MVP in photo acv06.
