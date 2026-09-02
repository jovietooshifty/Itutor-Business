# iTutor Business

B2B training/LMS platform for food businesses. Next.js (App Router) + Supabase.

See [`itutor-business-claude-code-handoff.md`](./itutor-business-claude-code-handoff.md) for the
product brief, full data model and build order, and [`design-reference/`](./design-reference/) for
the Claude Design export the screens are built from.

---

## Status

Build steps **1–3** of the handoff are done. Steps 4–10 (course builder, quiz generation, courses
grid, course management, marketplace/player, certificates, portfolio) are not started.

| Step | Scope | State |
|---|---|---|
| 1 | Supabase schema, RLS, quiz retry rule | Done, applied, tested |
| 2 | Business + learner signup, email verification | Done |
| 3 | Business dashboard shell, settings modal, Company Profile page | Done |
| 4–10 | Course builder onwards | Not started (route stubs only) |

---

## Getting started

```bash
npm install
cp .env.example .env.local      # then fill in the Supabase keys
npm run dev
```

`.env.local` is gitignored and already populated locally. Values come from the Supabase
dashboard → Project Settings → API.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on :3000 |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |

---

## Supabase project

Project ref **`zkkvymewfnadmdvdxlxg`** (`https://zkkvymewfnadmdvdxlxg.supabase.co`).
All four migrations in [`supabase/migrations/`](./supabase/migrations/) are applied.

| Migration | Contents |
|---|---|
| `…000100_schema.sql` | 12 enums, 20 tables, the quiz retry rule, auth bootstrap triggers |
| `…000200_rls.sql` | RLS helper functions, ~70 policies, 3 public RPCs |
| `…000300_storage.sql` | 3 buckets (`business-assets`, `avatars`, `certifications`) + policies |
| `…000400_harden_functions.sql` | Moves internal helpers to `app_private` so PostgREST can't reach them |

Regenerate types after a schema change:

```bash
supabase gen types typescript --project-id zkkvymewfnadmdvdxlxg > src/lib/types/database.ts
```

### Permission matrix

`business_members.role` drives everything. **This matrix was inferred** — the handoff refers to
"the matrix in the original spec", which is not in this repo. Confirm it and adjust the role arrays
in `…000200_rls.sql` if it differs.

| Capability | Admin | Operator | Auditor |
|---|:---:|:---:|:---:|
| View company profile / team / settings | ✅ | ✅ | ✅ |
| Edit company profile, locations, certs, languages | ✅ | — | — |
| Invite / remove members, change roles | ✅ | — | — |
| View courses, blocks, quizzes, questions | ✅ | ✅ | ✅ |
| Create / edit courses, blocks, quizzes, questions | ✅ | ✅ | — |
| Delete courses / blocks / quizzes / questions | ✅ | — | — |
| Enroll / unenroll learners | ✅ | ✅ | — |
| View enrollments, progress, attempts, certificates | ✅ | ✅ | ✅ |
| Issue certificates | ✅ | ✅ | — |

### The quiz retries ↔ navigation rule

`quizzes.retry_max` / `retry_cooldown_hours` may only be non-null when the quiz's **effective**
navigation is `allow_back` — that is, `course_blocks.quiz_navigation_override`, falling back to
`courses.quiz_navigation_default` when the override is `inherit`.

The rule spans three tables, so a `CHECK` constraint cannot express it. Three triggers enforce it
so it can't be circumvented from either direction:

1. `quizzes_enforce_retry_rule` — writing retries onto a locked quiz.
2. `course_blocks_enforce_navigation_retry_rule` — locking a block that already has retries.
3. `courses_enforce_navigation_retry_rule` — locking the course default while an inheriting block
   has retries.

This is enforced in the database, so it holds for the API layer, the dashboard, and any direct
SQL — not just the course-builder UI.

### `app_private`

Internal RLS helpers and trigger bodies live in the `app_private` schema, not `public`. PostgREST
only exposes `public`, so they aren't callable as `/rest/v1/rpc/<name>`.

Note: **revoking `EXECUTE` is not a substitute.** RLS policy expressions are evaluated with the
privileges of the *calling* role, so revoking `EXECUTE` from `authenticated` makes every policy
that calls a helper silently deny. Moving the schema is what works — policies and triggers
reference functions by OID, so they follow the move.

Three functions stay in `public` deliberately, because they must be callable by clients:

- `course_by_share_token(text)` — private courses are joinable only via their share link and are
  never listed; this resolves one without granting a table-wide read.
- `verify_certificate(text)` — the no-login public verification page.
- `quiz_questions_for_learner(uuid)` — serves questions without `correct_option`/`explanation`
  (the `quiz_questions` table itself is staff-only). `authenticated` only.

---

## Known issues from the handoff (§7)

| # | Issue | Status |
|---|---|---|
| 1 | Internal pages' logo linked back to signup/landing | **Fixed.** `<Logo href>` is a required prop with no default; `BUSINESS_HOME` / `LEARNER_HOME` / `PUBLIC_HOME` constants. The dashboard wordmark, which was an unlinked `<span>` in the export, is now a link to `/dashboard`. |
| 2 | Certificate screen needs a persistent header | Step 9 — not built yet. |
| 3 | Certificate needs Add-to-LinkedIn + social share | Step 9 — not built yet. |
| 4 | Stamp should render only if uploaded, no placeholder gap | **Groundwork done.** `<OptionalImage>` renders nothing at all when `src` is null; display surfaces must use it. `<ImageUpload>` is the editor and intentionally always shows a drop target. |
| 5 | "What you'll learn" had no editable source | **Fixed at the data layer.** `courses.what_you_will_learn text[]` exists; the builder UI wires it up in step 4. |

---

## Deviations from the handoff data model

Each is marked with a `NOTE:` comment in `…000100_schema.sql`.

- **`users.password_hash` omitted** — Supabase Auth owns credentials in `auth.users`.
  `public.users` is the mirror.
- **`course_blocks.order` → `position`** — `order` is a reserved word.
- **Added** to support screens in the export: `users.full_name`; `businesses.owner_id`,
  `cover_url`, `contact_phone`, `contact_email`, `timezone`; `business_training_languages`;
  `business_notification_prefs`; `business_members.invited_email` (invites precede the account);
  `learner_certifications.visible_on_portfolio`; `learner_profiles.employer_locked` /
  `employer_name`; `courses.what_you_will_learn` (known issue #5).

---

## ⚠️ Email verification — action needed

The designed flow is a **6-digit code** (`VerifyCard`). Supabase's default confirmation email only
contains a link, and **the email template cannot be edited on the free tier with the built-in email
provider** — the Management API rejects it:

> Email template modification is not available for free tier projects using the default email
> provider. Please upgrade your plan or configure a custom SMTP provider.

So today, signup completes via the **link** in the email, handled by
[`src/app/auth/confirm/route.ts`](./src/app/auth/confirm/route.ts), which verifies the token and
routes each account type to its step 2 of 2. The code-entry UI is built and calls the same
`verifyOtp`; it starts working the moment the template includes `{{ .Token }}`.

**To enable the designed flow:** configure a custom SMTP provider (or upgrade the plan), then set
the confirmation template to include `{{ .Token }}`. OTP length is already set to 6.

Auth config already applied: `mailer_otp_length: 6`, `password_min_length: 8`,
`uri_allow_list: http://localhost:3000/**, https://business.myitutor.com/**`.

---

## Design tokens

`src/app/globals.css` is a direct transcription of
`design-reference/_ds/itutor-design-system-<id>/tokens/*.css`. `tailwind.config.ts` aliases those
CSS variables. **Do not invent values** — add them to `globals.css` first, then alias.

Two gradients were derived from inline styles on the Learner Sign-Up screens because the token file
only ships the green-keyed pair: `--gradient-auth-learner` and `--gradient-peach-wash`.

Business surfaces are green-keyed (`--itutor-green`), learner surfaces coral (`--coral`). Most
components take an `accent` prop for this.

---

## Routes

| Route | Notes |
|---|---|
| `/` | Placeholder. The real landing page is step 8. |
| `/login` | Both account types |
| `/business/signup` → `/verify` → `/profile` | Two-step + verification |
| `/learner/signup` → `/verify` → `/profile` | Two-step + verification |
| `/dashboard` | Business home, inside the shell |
| `/company-profile` | Its own route; the settings modal links out to it |
| `/my-profile` | Member's personal profile |
| `/marketplace` | Learner home — stub, step 8 |
| `/courses`, `/learners` | Stubs, steps 4–7 |
| `/auth/confirm` | Email confirmation link handler |

`src/middleware.ts` refreshes the session and keeps each account type on its own side.

---

## Tests

There is no test runner wired up yet. Verification so far was done with throwaway scripts run
against the live project, each cleaning up after itself:

- **Quiz retry rule** — 7/7, all three trigger directions, inside a rolled-back transaction.
- **Permission matrix** — 20/20, signing in as real Admin / Operator / Auditor / outsider users
  and asserting each capability through the anon key.
- **Signup triggers** — 16/16, covering business-owner bootstrap, learner bootstrap, and
  auto-claiming a pending invite.

Worth promoting into a proper suite (Vitest + a seeded local Supabase) before step 4.
