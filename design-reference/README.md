# Design reference

Claude Design export for iTutor Business. This is a visual/interaction reference to reimplement in real React components — not code to port directly.

## Use these (readable source)
- `*.dc.html` (8 files, root of this folder) — one per screen: Certificate, Course Builder, Course Player, Courses, Landing Page, Learner Portfolio, Learner Sign-Up, Organization Sign-Up. Plain markup using Claude Design's `x-import`/`sc-if`/`sc-for`/`image-slot` tags — readable structure, copy, and logic (see the `<script type="text/x-dc">` block at the bottom of each file for state/behavior).
- `_ds/*/tokens/*.css` — the actual design tokens (colors, spacing, fonts, effects). Pull real values from here into the app's theme/Tailwind config rather than guessing.
- `_ds/*/styles.css` and `_ds_bundle.js` — the component styling/behavior these screens reference.
- `uploads/` — placeholder images used across the mockups.

## Don't parse these
- `preview-only/standalone/*.dc.html` — self-contained, browser-viewable bundles of the same 8 screens (everything inlined/base64'd for standalone rendering). Same designs, but not useful as source — the markup isn't readable. Kept only in case a rendered preview is needed; ignore for implementation reference.

See the main handoff doc (`itutor-business-claude-code-handoff.md`, repo root) for the full data model, build order, and known-issues checklist tied to these screens.
