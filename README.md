# Handoff: Huddle Marketing Website

## Overview
Huddle is a leadership-team diagnostics company. This package contains the design
for its marketing website — three scroll-driven pages that explain the value
proposition, the product system, and the team behind it. The design language is
dark, cinematic, and motion-led: full-bleed video, an animated brand-spectrum
gradient, and choreographed scroll sequences.

Pages:
1. **Landing ("This is Huddle")** — hero video + tagline sequence, value-prop
   is/is-not lockup, definition panel, and a pinned "playbook" dot-narrative CTA.
2. **The System** — three product pillars (Diagnostic, Program, Recruitment)
   presented via a 3D "crane" reveal, expandable flip-cards, and an interactive
   ring diagram.
3. **About Us** — team hero, rotating brand ring, and a scroll-driven quote panel.

## About the Design Files
The files in this bundle are **design references created in HTML** — working
prototypes that demonstrate the intended look, motion, and behaviour. They are
**not production code to copy verbatim**. Each `.dc.html` file is a "Design
Component": an HTML template plus a JavaScript logic class, loaded by the shared
`support.js` runtime. This is a prototyping format, not a shipping framework.

**The task is to recreate these designs in the target codebase's own
environment** (React/Next, Vue/Nuxt, Astro, Svelte, etc.), using its established
component patterns, routing, and asset pipeline. If no codebase exists yet, pick
the framework best suited to a content-driven marketing site — a React/Next.js or
Astro setup handles the scroll-animation work well. Treat the HTML/JS here as the
source of truth for **structure, exact values, copy, and motion timing**, then
rebuild it idiomatically.

The heavy motion pieces (dot particle field, 3D crane, ring diagram) are
implemented in plain Canvas / Three.js / GSAP and can be ported largely as-is
inside a component wrapper — the maths and timings are the valuable part.

## Fidelity
**High-fidelity (hifi).** These are final, pixel-level designs — real colours,
type, spacing, copy, and fully-tuned scroll choreography. Recreate the UI
faithfully. The exact motion timings (documented below and present in the JS) are
intentional and were iterated with the client; preserve them.

## Screens / Views

### 1. Landing — "This is Huddle" (`Huddle Landing Page.dc.html`)
Purpose: first impression; establish what Huddle is.
Min design width: 1100px (desktop-first marketing layout).

Sections, top to bottom:

- **Nav** (`huddle-nav.js`) — fixed-height 74px bar. Left: Huddle logo. Centre:
  "THIS IS HUDDLE / THE SYSTEM / ABOUT" with an animated indicator dot on the
  active item. Right: "LET'S HUDDLE" pill button. Shared across all pages;
  `active` prop marks the current page.
- **Hero** (`#hero-pin`, 260vh tall, sticky inner) — a pinned scroll sequence:
  - Full-bleed background `<video>` `assets/huddle-hero.mp4` (opacity 1) with a
    slight vertical parallax (`top:-80px; height:calc(100% + 160px)`).
  - A soft top-and-bottom darkening overlay for text legibility:
    `linear-gradient(180deg, rgba(12,17,23,0.28), rgba(12,17,23,0.18) 42%, rgba(12,17,23,0.55))`.
  - A rotating **conic-gradient ring** (`#hero-ring`, 80vh circle) using the
    brand spectrum, masked to a thin ring via a radial-gradient mask. On scroll
    it blurs and floats up out of frame.
  - **Tagline** (Poppins 700, 7.4vh, white): "Great teams" on line 1; line 2
    crossfades from "don't just happen." (floats up + blurs out) to "start with a
    Huddle" (rises from below + unblurs). The brandmark
    (`assets/HuddleBrandmark.svg`) then rises in beneath the wordmark.
  - Bottom: a `linear-gradient` fade to `#0a0a0a` (42vh tall) blending the video
    into the next section.
- **Value prop lockup** (`huddle-valueprop.js`) — dark section (`#0a0a0a`). A
  settled headline, then two cards that float in on scroll:
  - "Huddle is not" (muted card `#101316`, border `#24292e`, hollow-dot bullets):
    Open-ended facilitation / Culture surveys / Team building days / Personality
    tests / Frameworks without findings.
  - "Huddle is" (elevated card with iridescent gradient border, pulsing cyan
    dot): "A **fixed-scope team diagnostic** that uses surveys and interviews to
    measure the structural conditions of a leadership team against a
    **research-backed model.**"
  - The "is" card leads by ~130ms so it reads as the winner.
- **Definition panel** (`#who-we-are`) — light section
  (`linear-gradient(180deg,#FAFAF9,#EDF1F4)`). Animated "Huddle" wordmark
  (spectrum gradient sweep), "/ˈhʌdl/ noun", a spectrum progress line with a
  travelling dot, and the definition copy. Reveals on scroll into view.
- **Playbook CTA** (`#playbook`, 360vh pinned) — dot-narrative sequence
  (`huddle-dotfield.js`) over `assets/huddle-footer.mp4`; scroll drives dots from
  an aimless wide scatter into a "pause" formation while narrative lines fade
  through. Tagline "Maybe you need a Huddle" (Poppins 300, ~clamp(24px,2.88vw,36px)).
- **Footer** (`huddle-footer.js`).

### 2. The System (`Huddle The System.dc.html`)
Purpose: explain the three-part product system and how they interconnect.
Dependencies: Three.js r128 + GSAP 3.12.5 + ScrollTrigger (CDN).

- **Nav** (shared).
- **Top bookend** (`#top-region`):
  - Sticky title overlay "One smart system." (animated full-spectrum gradient
    text, seamless loop) + subline "Wherever you start, every people decision
    becomes **intentional and evidence-based**."
  - Three grey 3D cylinders ("pillars") rendered in a Three.js canvas that
    **cranes** from a low angle to top-down as you scroll. Their top faces are
    sized and positioned (via JS reading the DOM) to land exactly on three
    labelled disc circles that cross-fade in: Diagnostic → "Intelligence" (cyan),
    Program → "Performance" (pink), Recruitment → "Integration" (amber). Discs sit
    on the same 3-column grid as the cards below, so each disc is centred over its
    card. As scroll completes, discs + title fade and the cards float up.
- **Flip cards** (`#cards`, 3-col grid, max-width 1220px) — one per pillar
  (accent colours: Diagnostic `#00B9DA`, Program `#F2065B`, Recruitment `#F7AA00`).
  - Front: eyebrow "HUDDLE TEAM" + pillar name (accent), an animated line→dots
    "morph" icon (left-aligned, below the title), a mic-drop line, an opening
    line, and a "HOW IT WORKS ›" button.
  - **Interaction:** clicking "HOW IT WORKS" lifts the card to `position:fixed`,
    animates it to screen centre while expanding to fit its full back content,
    and flips it (rotateY). The other two cards + a blurred scrim fade behind it.
    The back shows: white eyebrow "HOW IT WORKS", accent-coloured title "Huddle
    Team <Pillar>", body copy, a bulleted list, and a meta line. Clicking × (or
    the scrim, or Esc) flips it back and animates it home to its grid slot.
  - Cards float in on scroll with a staggered delay (700ms + 200ms each), expo
    easing `cubic-bezier(.16,1,.3,1)`.
- **Shared meta bar** — animated spectrum gradient pill "Fixed scope · Data-
  directed · Measured quarterly"; floats up after the cards.
- **Bottom bookend** (`#bottom-pin`, 200vh) — a second Three.js crane reveal that
  cross-fades into an **interactive ring diagram**: three pillar nodes on a ring;
  hovering/clicking a node lights its accent colour, animates its icon (line↔dots
  morph), draws glowing flow arrows with labels describing how the parts feed each
  other, and shows a centre panel with a "LEARN MORE ›" link to that card.
- **Footer** (shared).

### 3. About Us (`Huddle About Us - Ring.dc.html`)
Purpose: introduce the team and philosophy.
- **Nav** (shared).
- **Header banner** — grayscale full-bleed `<video>` `assets/team-hero.mp4` with a
  radial vignette to `#060606`; heading with animated spectrum-gradient phrase
  "behind the team" (seamless loop).
- Team/ring content + a scroll-driven **quote panel** (`huddle-quote.js`) over
  `assets/huddle-footer.mp4`.
- **Footer** (shared).

## Interactions & Behavior
- **Scroll choreography** is the core mechanic. Pinned sections use tall wrappers
  (`260vh`/`360vh`/`190vh`/`200vh`) with a `position:sticky; height:100vh` inner;
  progress `p = clamp(-rect.top / (rect.height - vh))` drives every transform.
  Re-implement with the codebase's preferred approach (GSAP ScrollTrigger, a
  scroll hook, or IntersectionObserver + rAF) but keep the progress ranges.
- **Reveal-on-view**: value-prop cards, definition panel, and system cards use an
  IntersectionObserver to trigger a float-up (translateY + opacity), reveal-only
  (they don't animate back out).
- **The System flip cards**: FLIP-style expand-to-centre + rotateY flip; scrim +
  sibling fade; focus moves to × on open and back to the CTA on close; Esc/scrim
  close. See `_openCard` / `_closeCard` in the file.
- **3D crane**: PerspectiveCamera orbits from ~12° to ~90° over scroll; pillar top
  faces are matched to the DOM disc diameter/positions (recomputed on resize).
- **Animated gradients**: text uses a doubled-stop `linear-gradient`,
  `background-size:200% 100%`, `-webkit-background-clip:text`, animated
  `@keyframes gradmove{to{background-position:-100% 0}}` — doubled stops make the
  loop seamless (no jump).
- **Reduced motion / mobile (≤820px)**: The System falls back to static 2D discs
  + non-3D layout (`.no-crane`); animations disabled under
  `prefers-reduced-motion`.

## State Management
Mostly local UI state driven by scroll position, not app data:
- Scroll progress per pinned section (transient, from scroll listener + rAF).
- Reveal flags (booleans) once a section enters the viewport.
- The System: `_openFlip` (which card is expanded), `_animating` guard, saved
  original card geometry for the return animation; active pillar for the ring
  diagram. No data fetching — all content is static copy.

## Design Tokens

**Brand spectrum (used across gradients, in order):**
`#03C3DD` (or `#00B9DA`) cyan · `#2f86dd`/`#0063C8` blue · `#6b5cd6` indigo ·
`#b74fbf` magenta · `#F2065B` pink · `#f85a3b`/`#F96002` red-orange ·
`#F96816` orange · `#F9AE06`/`#F7AA00` amber.

**Pillar accents:** Diagnostic `#00B9DA` · Program `#F2065B` · Recruitment `#F7AA00`.

**Neutrals:** page black `#0a0a0a`; deep black `#060606`/`#05070a`; card
`#101010`/`#101316`; card border `#24292e`; hairline `#222`; muted text
`#98a0a9`/`#b9b9b9`/`#8a8a8a`; brand ink `#293B4E`; hero base `#1c2836`.
Light section: `#FAFAF9`→`#EDF1F4`, text `#293B4E`, subtle `#8695A4`.

**Typography:** Poppins (400/600/700/800/900) for display/headings; Roboto
(300/400/500/700) for body. Headings letter-spacing ~-0.01em. Slide/section
display sizes use `clamp()` and `vh`-relative sizes in the hero.

**Radii:** cards 22–24px; pills/buttons 999px; discs/ring 50%.

**Shadows:** card `0 26px 74px rgba(0,0,0,.55)` + accent glow
`0 0 46px rgba(<accent>,.12–.22)`; disc `0 22px 62px rgba(0,0,0,.55)`.

**Motion:** float-in easing `cubic-bezier(.16,1,.3,1)` (~.95s); flip
`cubic-bezier(.5,0,.2,1)` (~.6s); gradient sweep `gradmove` 8–9s linear infinite.

## Assets
In `assets/` (all client-supplied brand assets — reuse the client's real files in
production):
- `huddle-hero.mp4` — landing hero background video.
- `huddle-footer.mp4` — playbook CTA + quote panel background video.
- `team-hero.mp4` — About page header video (rendered grayscale).
- `HuddleBrandmark.svg`, `HuddleBrandmark-dark.svg` — dot brandmark.
- `HuddleLogo-Primary-colour.svg`, `-white.svg`, `-colour-white.svg`,
  `HuddleLogo-stacked-colour.svg` — wordmark logos.
- Nav and footer logos are drawn inline as SVG within their JS components.
Fonts: Poppins + Roboto via Google Fonts. The System also loads Three.js r128,
GSAP 3.12.5, ScrollTrigger from CDN.

## Files
Page prototypes:
- `Huddle Landing Page.dc.html`
- `Huddle The System.dc.html`
- `Huddle About Us - Ring.dc.html`

Shared components (plain-JS web components / custom elements):
- `huddle-nav.js` — site navigation (`<huddle-nav>`), props: `active`,
  `home-href`, `system-href`, `about-href`.
- `huddle-footer.js` — site footer (`<huddle-footer>`); contact info
  (info@huddletalent.com, +61 (424) 348 925, LinkedIn) lives here.
- `huddle-valueprop.js` — landing is/is-not lockup (`<huddle-valueprop>`).
- `huddle-dotfield.js` — landing playbook particle field (`<huddle-dotfield>`,
  `setProgress(p)`).
- `huddle-quote.js` — About scroll quote panel (`<huddle-quote>`).

Runtime:
- `support.js` — the Design Component runtime that mounts `.dc.html` files. **Not
  needed in production** — it only exists to run these prototypes in the browser.
  Do not port it; recreate the pages as native components instead.

### How to preview the prototypes
Serve the folder over a static HTTP server (needed for the video/module loads)
and open any `.dc.html` file, e.g. `npx serve .` then visit the page. Opening via
`file://` will block the videos and module fetches.
