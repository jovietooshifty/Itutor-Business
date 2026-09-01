# iTutor Design System

iTutor (myitutor.com) is a Caribbean education platform that connects students and parents with
verified tutors across Trinidad & Tobago and the wider Caribbean. The product is built around the
regional exam calendar: SEA, CSEC and CAPE. Students find a tutor, book a 1-on-1 session that runs
on Google Meet or Zoom, or join a paid or free group class; tutors build a listing, get verified,
manage sessions and get paid in TTD.

Operating company: Astronova Technologies Ltd. Support: support@myitutor.com.

## Surfaces in this system

| Surface | What it is |
|---|---|
| **Marketing site** | Public pages — landing, how it works, FAQ, about, help, legal. Black nav, mint-wash hero, pastel step cards, black footer with inline FAQ. |
| **Auth** | Login / signup / verify — dark green gradient split layout with a white card. |
| **Student app** | `/student/*` — dashboard, explore tutors, classes, bookings, subscriptions, transactions, tools. Dark sidebar with coloured icon tiles. |
| **Parent app** | `/parent/*` — dashboard, approvals, children, calendar, feedback, plus notifications and settings from the top bar. Billing is a section inside Settings. Same dark sidebar; child-colour left-border accents throughout. Built to the parent/student/tutor design spec rather than copied from the current build. |
| **Tutor app** | `/tutor/*` — dashboard, classes, sessions, students, wallet, reviews, business, iTutor AI. Same dark sidebar, bare icons, plus a "get listed" completion banner. |
| Admin, reviewer | Exist in the codebase (`components/admin`, reviewer routes) but are out of scope for the design spec and were not recreated here. |

## Sources

- GitHub: **https://github.com/Bobthebuilder1012/itutor-platform** (branch `main`) — Next.js 14 App
  Router + Tailwind + Supabase. Read further for anything this system doesn't cover; the styling
  ground truth is `app/globals.css`, `tailwind.config.ts` and `components/**`.
- No Figma file, brand book or slide template was provided. Nothing in this system was invented from
  a screenshot — every value is lifted from the repo.
- See `github.md` for the sync record and the screen → source-file map.

## Index

| Path | Contents |
|---|---|
| `styles.css` | Entry point — imports every token file. Link this one file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css` |
| `components/core/` | Button, Input, SearchField, Icon, Badge, SubjectPill, Card, Avatar, VerifiedBadge, StarRating, Checkbox, ProgressBar, Modal |
| `components/patterns/` | TutorCard, GroupCard, StatCard, StepCard, FaqItem, SidebarNavItem |
| `ui_kits/marketing/` | Landing page recreation |
| `ui_kits/auth/` | Login screen |
| `ui_kits/student-app/` | Student dashboard, explore, classes, booking flow |
| `ui_kits/tutor-app/` | Tutor dashboard and class management |
| `ui_kits/parent-app/` | Parent surface, spec-led — attention card, approvals with the seat warning, checkout states, booking flow, family calendar, settings; plus eight iOS screens |
| `ui_kits/student-app/parent-linked.html` | Student §4 — request instead of checkout, pending requests, tutor cards, read-only attendance, messaging disclosure |
| `ui_kits/tutor-app/students.html` | Tutor §5 — class roster with the parent block, uneditable attendance grid, feedback template |
| `guidelines/` | Foundation specimen cards (colors, type, spacing, brand) |
| `assets/` | Logos, imagery, team photos, avatars, social |
| `SKILL.md` | Agent Skills wrapper for use in Claude Code |

Each component directory carries `<Name>.d.ts` (props) and `<Name>.prompt.md` (what/when + usage).

## Content fundamentals

**Voice.** Plain, warm, results-first. It sounds like a teacher who knows the syllabus, not a
startup. Sentences are short and concrete; claims are specific ("94% pass rate", "150+ verified
iTutors", "1,000+ students").

**Person.** Address the reader as **you**; refer to the platform as **iTutor** in the third person.
Product-owned things are possessive-second-person: "Your Next Session", "My Classes", "My Wallet",
"Your next step". Note the split — navigation uses **My** (My Classes, My Bookings, My Students,
My Wallet), page headers and cards use **Your** (Your Next Session, Your next step).

**Casing.** Title Case for section headings and nav ("Find Your iTutor", "Explore by Subject",
"My Bookings"). Sentence case for body copy, button labels beyond one word, empty states and
banners ("Complete your profile to get listed and start teaching.", "View session details",
"Find another iTutor").

**Vocabulary.** Tutors are **iTutors** when spoken about as members of the platform ("Find an
iTutor", "Verified iTutors", "New iTutor") — "tutor" alone is fine generically. Exams are always
named: **SEA**, **CSEC**, **CAPE**, plus **SBA** and **past papers**. Grades use the Caribbean
scale — "Grade I", "Grade I–II", "a 3 on her mocks". Currency is always **TTD**, priced per hour or
per session ("$120/hr TTD", "$250/mo"). Spelling leans British/Caribbean: "personalised",
"programmes", "Frequently Asked".

**Copy shapes.**
- Headline: 3–5 words, benefit-led, often two-tone — "Unlock Your **Academic Potential**".
- Sub-copy: one or two sentences, ~20 words, naming the exam and the outcome — "Connect with
  verified Caribbean tutors for CSEC, CAPE & beyond. Personalised 1-on-1 sessions that turn
  struggles into strengths."
- Buttons: verb-first, 2–4 words — "Find a Tutor", "Become a Tutor", "Send request",
  "Complete profile", "Add Subjects".
- Empty states: state the gap, then the one action — "No upcoming sessions yet / Let's book your
  first one and start learning!" with a single "Find an iTutor" button.
- Errors: blunt and human, no codes — "Incorrect email or password", "Connect to the Internet",
  "Unable to log in. Please try again."

**Emoji.** Used sparingly and only in the signed-in app, as a warmth signal at the end of a
greeting or confirmation: "Welcome back, Maya 👋", "You're all set ✅". Never in marketing copy,
never in buttons, never more than one per line. Unicode stars (★☆) appear as a compact rating
display on group cards.

**Punctuation.** Ampersands in headings and short lists ("CSEC, CAPE & beyond"). Em dashes for
asides. The middot separates metadata ("Parent · Chaguanas", "4:00 PM · 60 min"). Arrows on
in-place links ("View all →").

## Visual foundations

**Colour.** One brand colour: green, in two lineages that coexist in the codebase — the legacy hex
`#199356` (`--itutor-green`, dashboards) and the newer `oklch(0.74 0.19 145)` (`--brand`,
marketing). Use `--brand` on marketing surfaces and `--itutor-green` inside the app. Text is
near-black desaturated blue (`--ink`, `oklch(0.18 0.02 240)`) with `--ink-muted` for secondary.
Coral (`oklch(0.74 0.18 40)`) is the only warm accent — ratings, the second stat, the far end of
the CTA gradient. A pastel set (mint, lavender, peach, sky) tints backgrounds and icon tiles;
never type. Black (`#000`) is a real surface, not just text: the nav and the footer are pure black.
Two background colours per page maximum: white plus either mint wash or black.

**Type.** Two Google families, loaded via `next/font`: **Space Grotesk** for headings
(`--font-display`, tracking -0.02em, -0.03em at display sizes) and **Inter** for everything else
(`--font-sans`). Weights run 400–800; headings are 700, "extrabold" 800 appears on prices and small
card titles. Marketing h1 is 72px at 1.02 line-height; section heads clamp(36px, 5vw, 60px); body
18px on marketing, 14px in the app, 12px for meta, 10–11px for uppercase eyebrows. Eyebrows are
uppercase, semibold, widest tracking, in green. Numbers are tabular where they update.

**Spacing & layout.** 4px scale, but the repo uses odd exact values where it wants them (18px group
card padding, 14px radius) — copy them, don't round. Marketing sections are 80px vertical padding
inside `max-w-7xl` (1280px) or `max-w-6xl` (1152px). The app is a fixed dark sidebar
(240px tutor / 256px student, collapsing to 64px) plus a sticky 56px top bar; content padding 32px.
Fixed elements: the marketing nav is sticky, the app top bar is sticky, the mobile bottom nav is
fixed with a 96px content bottom-pad to clear it.

**Backgrounds.** No photographic full-bleeds, no repeating patterns, no textures, no hand-drawn
illustration. Depth comes from three moves: the **mint wash** (`bg-mint-wash` — two soft radial
colour-mix gradients over mint), large blurred **blobs** (`blur(64px)`, 320–384px, slowly drifting
via the `blob` keyframes) and flat gradients on CTA bands (green → green → coral at 120°) and auth
(`#071a0e → #0d2318 → #0a1e14` at 135°). Imagery is real photography of Caribbean students,
tutors and classrooms — warm, naturally lit, mid-saturation, no grain, no duotone. Photos get 24–32px
radius and a 1px `ink/5` ring.

**Cards.** Dashboard: white, 1px `#f3f4f6` hairline, 16px radius, `shadow-sm`, lifting 2px to
`shadow-md` on hover. Group cards: 14px radius, 1px `#e5e7eb`, no resting shadow, lifting 4px with
an emerald border and a two-layer shadow on hover. Marketing: 24px radius, `white/80` +
`backdrop-blur`, hairline border. Featured tutor cards are the one frosted-glass treatment —
translucent white gradient, inset white highlight, `blur(24px) saturate(150%)` — and only read on
a coloured backdrop. Nested blocks inside cards are gray-50 at 12px radius.

**Shadows.** Two signature shadows: `--shadow-pop` (`0 20px 50px -20px rgba(25,147,86,0.4)`) — a
green glow reserved for primary CTAs and hero imagery — and `--shadow-card`
(`0 10px 30px -12px rgba(17,24,39,0.18)`) for floating cards. Everything else is Tailwind's
sm/md/lg. Inset highlights (`inset 0 1px 0 rgba(255,255,255,0.3)`) appear on gradient buttons and
glass cards. No inner shadows on inputs.

**Borders & radii.** 6 / 8 / 12 / 14 / 16 / 24 / 32 / 40px and full pills. Marketing controls are
pills; app controls are 12px; inputs and sidebar rows are 8px. Borders are 1px hairlines
(`#e5e7eb` / `#f3f4f6` / `--border`), 2px only for outline buttons and toggled subject pills.

**Motion.** Understated. Hover: cards translate -2px (dashboard) or -4px (group), marketing CTAs
scale 1.04; press: scale 0.95. Durations 150ms (inputs) / 200ms (nav, cards) / 300ms (lifts,
accordions), ease-out. Scroll reveals are opacity 0→1 with y 30→0 over 600ms (framer-motion).
Ambient loops: blobs 18s, float-y 6s, marquees 55–60s linear, paused on hover. No bounce, no
spring overshoot, no parallax.

**Hover & press states.** Links and dark-surface nav go from 70% white to 100% white. Sidebar rows
go to `white/10` background. Solid green buttons darken to `emerald-600`. Outline buttons darken
their border and pick up green text. Destructive rows tint `coral-soft` with coral text.

**Transparency & blur.** Used for exactly three things: sticky bars (`rgba(0,0,0,0.92)` +
`blur(24px) saturate(180%)` on marketing; `white/90` + `blur(8px)` in the app), badges sitting on
imagery (`white/90` + `blur(4px)`), and glass tutor cards. Marquees fade at the edges with a mask
gradient rather than a solid capsule.

## Iconography

**Lucide is the icon set** (`lucide-react`, plus `@heroicons/react` installed and a number of
hand-inlined Heroicons outline paths in older dashboard cards — same 24×24 grid, so they mix
without looking off). Default 16px at stroke-width 2; dashboard cards use 1.8, marketing step icons
32px at 2.2. Icons take `currentColor` and inherit the text colour, except inside tinted tiles
where they take the tile's accent.

There is **no icon font and no SVG sprite in the repo** — icons come from the npm package at build
time, so nothing could be copied into `assets/`. This system loads Lucide from
`https://unpkg.com/lucide@latest/dist/umd/lucide.min.js` and wraps it in `components/core/Icon.jsx`.
That is the same icon set, not a substitution.

Icon containers: a rounded square tile is the dominant pattern — 32/40/44px at 8–12px radius with a
10% brand tint, or 64px at 24px radius with a pastel tint on marketing steps. Social icons in the
footer are 40px circles on `white/5`, filling brand green on hover; those four glyphs are inlined
SVG paths in `components/landing/Footer.tsx`.

Emoji are not used as icons. Unicode is used in three places only: ★☆ ratings on group cards,
→ on inline links, and · as a metadata separator.

## Logo

`assets/logo/` holds the real marks from the repo:

- `itutor-logo-dark.png` — the horizontal lockup: green dot-and-slash "i" glyph plus a **white**
  wordmark. `itutor-logo-light.png` and `itutor-logo-new.png` are byte-identical to it.
- `itutor-mark.png` — the glyph alone on a black tile, for the collapsed sidebar.
- `favicon.svg`, `itutor-og-logo.png`, `og-image-v3.png` — favicon and social.

**Caveat:** every wordmark file supplied is white-on-transparent, so the lockup only works on black,
`--ink` or `--forest`. The app itself uses the same white file in a light top bar, where it is
invisible. On light backgrounds use the mark plus "iTutor" set in Space Grotesk, and ask the brand
owner for a dark-wordmark export. No mark was drawn or reconstructed here.

## Intentional additions

- **Icon** — a thin wrapper over the Lucide UMD build. The app imports icons directly from
  `lucide-react`, which can't run in a bundler-less HTML page; the wrapper keeps the same glyph set.
- **SearchField, SidebarNavItem, StepCard, FaqItem, StatCard** — these exist in the repo as inline
  markup inside `StudentShell`, `TutorShell`, `HowItWorksSection`, `Footer` and `StatsRow` rather
  than as exported components. They are extracted here so kits can compose them; the visual values
  are unchanged.
