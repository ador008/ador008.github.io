# Design reference: Dreamers Den patterns

Study notes from the Dreamers Den Event Management site
(`zabulanakakil.github.io/dreamers-den-event-management`, source `github.com/zabulanakakil/dreamers-den-event-management`),
which Ador chose as the model for this portfolio. These are patterns to reuse in our own code and branding,
not files to copy. Status column: **in use** = already on this site, **ready** = a good fit to add next.

## 1. Visual system

| Pattern | How it works there | Status |
|---|---|---|
| Dark-first theme | `#0a0a0a` page, `#141414` raised surfaces, `#1a1a1a` cards, `#f0f0f0` text, `#a3a3a3` muted. Borders are white at 6% / 12% / 20% opacity instead of grey lines. | in use |
| Light theme | Full token swap under `[data-theme="light"]` (`#f4f6f9` page, white cards). Toggle remembers the choice in `localStorage`; first visit follows the system setting. | in use (we default to dark; system-following is **ready**) |
| Two accent colours, one per division | Blue for Events, amber + teal for Garments. Each division's tabs, pills, glows and hovers use its own accent. | in use: red = Education, gold/amber = Esports |
| Fonts | Outfit (headings) + Source Sans 3 (body), both Google Fonts. | in use |
| Radius scale | 6 / 12 / 20 px, 16 px for icon tiles. | in use (8 / 12 / 20) |
| Soft coloured shadows | Card shadows tinted with the accent (`rgba(accent, .08)` at rest, `.15` on hover). | ready |

## 2. Controls

| Pattern | How it works there | Status |
|---|---|---|
| **Keycap buttons** | Face colour + 1px dark edge + **4px bottom border**, inset top highlight, drop shadow. Hover lifts 1px; press moves down 2px and the bottom border shrinks to 2px, so it feels like a physical key. Active page = accent-coloured keycap. | in use (`.key`) |
| Pill tabs with glow | Large rounded pills; the selected one gets an accent border, a 3px soft ring and an outer glow. Horizontal scroll on phones with the scrollbar hidden. | in use (`.pill`) |
| Division switcher | Two big tabs side by side inside one rounded panel, each with a numbered circle (01/02), a title and a one-line meta. The active tab fills with its division's gradient. Stacks to one column under 600px. | ready (alternative to our homepage cards) |
| Roving-tab keyboard support | Arrow keys move between tabs, only the active tab is in the tab order. | in use |
| Hash deep links | Each division/tab has its own `#id`, the page opens on it, and switching updates the URL. | in use |

## 3. Layout pieces

| Pattern | How it works there | Status |
|---|---|---|
| Sticky header | 76px, logo + name + small subtitle, keycap nav, theme toggle. | in use |
| Slide-over drawer (mobile) | Slides in from the right with a backdrop, closes on link/backdrop/Esc; division shortcut pills inside. | ours drops down instead; slide-over is **ready** |
| Division portal cards | Two large cards, radial accent glow in the top-right corner, badge, title, text, CTA; lift 6px and glow in their accent on hover. | in use (with photo backgrounds) |
| Division stage banner | Big header card for a section: eyebrow, title, tagline, description, highlight pills, plus a decorative glowing orb and a huge faint watermark word (e.g. "APPAREL"). | ready (e.g. "ESPORTS" / "CYBER" watermark on our page heads) |
| Sticky in-page jump bar | Small pill nav that sticks under the header and highlights the section in view (scroll-spy, `aria-current="location"`). | ready (for long tabs) |
| Breadcrumbs | Small "Home / Services / Garments" trail at the top of inner pages. | ours is a simple "← Home" link |
| CTA strip | Full-width rounded band near the bottom: one line + one button. | ready |
| WhatsApp floating button | Green pill bottom-right with label on desktop, round icon-only on phones. | in use |
| Skip link | Hidden "Skip to content" link that appears on keyboard focus. | ready |

## 4. Galleries and motion (the important part)

### 4a. Depth carousel ("Try the Look") — in use on Esports › Highlights
- One float `position`; every slide gets `d = i - position` (wrapped for an endless loop).
- Per slide: `translateX(d × ~56%) scale(1 − 0.2|d|)`, `opacity 1 − 0.32|d|`, `blur(|d| × 3.5px)`, z-index from `|d|`; hidden beyond ±2.6.
- Pointer events follow the finger/mouse 1:1; on release it keeps the throw speed and eases to the nearest slide (~450ms, cubic ease-out) with `requestAnimationFrame`.
- Tick-mark scrubber: a native `<input type="range">` styled as a thin line + amber thumb over a row of tick marks.
- Side panel ("In this photo") with an `n / total` counter, chips, title, note and a link, updated when a new slide reaches the centre; `aria-live="polite"`.
- "VIEW" cursor: an accent circle that follows the mouse over the centre slide (fine pointers only).
- "View all (n)" opens a full grid overlay; clicking an item closes it and jumps the carousel there.
- Reduced motion: no blur, instant moves.
- Their plan for it is in their repo: `garments_try_the_look_carousel.md`.

### 4b. Auto-rotating crossfade ("Gift combos") — ready
- Two stacked `<img>` elements; the next image loads into the hidden one, then they swap `is-active` for a crossfade.
- Filter chips above (All / Drinkware / Tech …) re-feed the list.
- Info card beside it (name, pills, "what's in the box"), an `n / total` counter and a queue of the next thumbnails on wide screens.
- Auto-advances on a timer; pauses on hover, when off-screen (IntersectionObserver) and under reduced motion.
- Good fit for: certificates, project screenshots, a "moments" reel.

### 4c. 3D perspective slider ("Events through the years") — ready
- Classic one-slide-at-a-time track (`translateX(-100% × i)`), but non-active slides are `scale(.92) rotateY(-8deg)`, 55% opacity and slightly desaturated; easing `cubic-bezier(.22,1,.36,1)`.
- Year pill on each image, caption under it, prev/next keycaps and dots.
- Good fit for: a year-by-year esports or study timeline with one photo per year.

### 4d. Year scrubber + chapter timeline (Journey page) — ready
- Sticky, blurred bar of year pills; the year in view is highlighted as you scroll.
- Each year is a "chapter" with events (photo cards with a lightbox, or text-only cards) and a vertical rail.
- Filters and a progress indicator; back-to-top button.
- Good fit for: a full esports career page once there is more history.

### 4e. 3D tilt cards — ready
- On fine pointers, cards tilt toward the mouse (`perspective(1050px) rotateX/rotateY` from CSS variables set in JS) with a soft radial glare that follows the cursor.
- Applied to service cards, testimonial cards and timeline photo cards. Disabled on touch and reduced motion.

### 4f. Reveal on scroll — ready
- `.reveal` elements fade/slide in once via IntersectionObserver (threshold .08); everything is visible immediately under reduced motion.
- Page-enter animation on `<main>` (fade from 35% + 8px rise).

### 4g. Lightbox — in use (simple version)
- Full-screen photo with caption and close; theirs supports moving between photos in a group.

## 5. Content patterns

| Pattern | Notes | Status |
|---|---|---|
| Content in a config file | Almost all text, services and images live in `js/config.js` / `js/garments-data.js` and the pages render from it. Editing content never touches layout code. | ready: worth doing once Ador sends his skills/CV details |
| Stats row | 2–4 big numbers with short labels on the About page. | in use as mini-stat chips |
| Testimonials | Quote cards with name/role, tilt effect. | ready, needs real quotes |
| FAQ accordion | `<details>`-style questions. | ready if needed |
| "What we do / don't do" | Two contrasting lists (blue vs red). | probably not needed |

## 6. Accessibility and performance habits worth keeping
- Every motion effect checks `prefers-reduced-motion`.
- Hover-only effects are gated with `(hover: hover) and (pointer: fine)`.
- Overlays make the rest of the page inert, close on Esc and return focus.
- Only `transform`/`opacity` are animated; blur is limited to the few visible slides.
- Images outside the visible range load lazily.
