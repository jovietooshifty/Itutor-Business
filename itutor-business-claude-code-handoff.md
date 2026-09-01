# iTutor Business — Claude Code Handoff

## 1. What this is
A B2B training/LMS platform for food businesses (restaurants, catering, food manufacturing, distribution, retail, food trucks, hospitality). Businesses sign up, build a company profile, add team members with roles, build training courses out of a flexible drag-and-drop sequence of content blocks, and enroll/track learners through quizzes, completion, and certificates. Learners can also sign up independently and browse a public course marketplace.

This is a **new project, built from scratch** — not related to the `itutor-platform` repo (that's an unrelated tutor/student marketplace project).

## 2. Design reference
A full set of Claude Design exports is provided in `/design-reference/` (unzipped `Product_launch_planning.zip`). These `.dc.html` files are the **visual and interaction source of truth** — layout, copy, spacing, component behavior, and the design token values in `_ds/.../tokens/*.css` — but they are **not production code**. They use a Claude-Design-specific component bundler (`x-import`, `sc-if`, `sc-for`, `image-slot` custom tags) that doesn't exist outside that tool. Treat every `.dc.html` file as a high-fidelity mockup to reimplement in real React components, not something to literally port.

Files and what each one covers:
- `Landing Page.dc.html` — marketing homepage, gated marketplace preview (course cards visible to anonymous visitors, clicking "Enroll" opens a signup modal dismissable only by clicking outside it, no close button)
- `Organization Sign-Up.dc.html` — business signup (prelim account → email verification → company profile), plus the business dashboard shell, gear-icon settings modal (General/Account/Team/Notifications + a link out to the full Company Profile page), and the Company Profile page itself
- `Learner Sign-Up.dc.html` — learner signup (account basics → email verification → profile builder with the employment yes/no gate, skill tags, phone with country code defaulting to +1 868/Trinidad first), plus the marketplace grid learners land on
- `Course Builder.dc.html` — course setup screen 1, the drag-and-drop sequence builder (video/text/website/quiz blocks), quiz block config (scope, AI-generate/manual/upload paths, navigation lock + retries with the dependency rule), course-level quiz defaults
- `Courses.dc.html` — business-side courses grid, Share class modal (link + social + reset link), course management tabs (Overview/Sequence/Learners), Learners tab with filters and per-learner drill-down
- `Course Player.dc.html` — learner-facing course landing page, the block-by-block player (video/text/website/quiz), quiz result states including the terminal "contact your training administrator" state
- `Certificate.dc.html` — certificate display and actions
- `Learner Portfolio.dc.html` — public learner portfolio page

Extract the design tokens from `_ds/.../tokens/*.css` (colors, spacing, fonts) as the actual theme values for whatever styling approach is used in the real app (Tailwind config, CSS variables, etc.) — don't reinvent a palette.

## 3. Tech stack
- **Frontend/backend:** Next.js (App Router)
- **DB/Auth:** Supabase (Postgres + Auth + Row-Level Security)
- **File storage:** Supabase Storage (logos, avatars, stamps, course files, certificates)
- **Email:** Supabase Auth emails or Resend/Postmark for verification + invites
- **AI (quiz generation):** text-in/JSON-out call to an LLM, treated as a swappable service behind an internal interface — not hardcoded to one vendor. Video content needs a separate speech-to-text pass to produce a transcript before quiz generation runs; PDFs/Word/website content go through their own text-extraction step first. All paths converge on the same "generate quiz from text" call.

## 4. Data model

```sql
-- Accounts
users (
  id, email, password_hash, user_type enum('business_owner','company_member','learner'),
  email_verified boolean, created_at
)

businesses (
  id, name, position_of_owner, logo_url, stamp_url, description, tagline,
  industry, company_size, year_founded, business_type enum('independent','franchise','chain'),
  website, status enum('active') default 'active', -- auto-activated, no manual approval
  quiz_retake_policy jsonb, -- default { max_attempts, cooldown_hours } for the org
  created_at
)

business_locations (
  id, business_id, street, city, region, country
)

business_certifications (
  id, business_id, name, file_url
)

business_members (
  id, business_id, user_id, role enum('admin','operator','auditor'),
  invited_by, status enum('invited','active'), joined_at
)

member_profiles ( -- distinct from learner_profiles, trimmed to avoid redundancy
  user_id, avatar_url, bio, job_title, phone_country_code, phone, preferred_language
)

learner_profiles (
  user_id, date_of_birth, avatar_url, bio,
  employed boolean, job_title, years_experience, employer_business_id (nullable, locked if invited),
  phone_country_code, phone, preferred_language, timezone,
  public_portfolio boolean default false, portfolio_slug
)

learner_skills ( id, user_id, skill )
learner_certifications ( id, user_id, name, file_url )

-- Courses
courses (
  id, business_id, title, thumbnail_url, description, tagline,
  visibility enum('public','private'), share_token, -- unguessable, regeneratable
  quiz_navigation_default enum('allow_back','lock_forward') default 'allow_back',
  created_by, created_at
)

course_tags ( id, course_id, tag )

course_blocks (
  id, course_id, type enum('video','text','website','quiz'), order,
  title, content_ref jsonb, -- points at the video/text/url content
  quiz_navigation_override enum('allow_back','lock_forward','inherit') default 'inherit'
)

quizzes (
  id, block_id, title, passing_score,
  scope enum('preceding_block','since_last_quiz','specific_blocks','whole_course','none'),
  scope_block_ids uuid[], -- when scope = specific_blocks
  reveal_answers boolean,
  retry_max int, retry_cooldown_hours int -- null when navigation is locked (enforce at app layer)
)

quiz_questions ( id, quiz_id, question_text, options jsonb, correct_option, explanation )

-- Enrollment & progress
enrollments (
  id, course_id, learner_id, business_id nullable,
  status enum('in_progress','completed'), enrolled_at, completed_at
)

block_progress ( id, enrollment_id, block_id, status enum('locked','unlocked','completed'), completed_at )

quiz_attempts ( id, quiz_id, learner_id, score, passed boolean, attempted_at )

certificates (
  id, enrollment_id, certificate_id (public), issued_at,
  visible_on_portfolio boolean default true
)
```

## 5. Core flows to wire up (in rough build order)
1. Auth — business signup (2-step) + email verification; learner signup (2-step) + email verification
2. Business dashboard shell — top nav, gear → settings modal, Company Profile as its own page
3. Team management — invite, assign role, RLS enforcing Admin/Operator/Auditor permissions per the matrix in the original spec
4. Course builder — setup screen 1, drag-and-drop sequence (reorderable blocks), quiz block config with the scope + navigation/retries dependency rule (retries can only be non-null when navigation = allow_back — enforce this in the API layer, not just the UI)
5. Quiz generation pipeline — text extraction per content type → LLM call → editable question list; manual entry and CSV upload as parallel paths into the same editable list
6. Courses grid + Share class modal (public courses discoverable + linkable; private courses joinable **only** via the link, never listed)
7. Course management — Overview/Sequence/Learners tabs, learner filtering by score/completion, click-through to learner profile (admin read-only view)
8. Learner marketplace + course player — gated preview on the landing page, block rendering per type, video watched-once gating, text scroll-to-end gating, quiz question flow, result states including the terminal "message admin" state wired into messaging
9. Certificates — generation on course completion, certificate screen (Download/Add-to-LinkedIn/Copy-link/Share, business stamp rendered only if uploaded), separate public no-login verification page with a "Verified" badge
10. Learner portfolio — public toggle, per-certificate visibility, portfolio page excluding private contact fields

## 6. Deployment
Deploy to Vercel as a **new project**, separate from the existing `itutor-platform` project in this Vercel account (that project is an unrelated repo — do not deploy into or reuse it).

Set up via the Vercel CLI:
1. `vercel login` (if not already authenticated)
2. From the project root: `vercel link` — create a new project when prompted, do not link to `itutor-platform`
3. `vercel --prod` for the first production deployment once the app builds successfully
4. `vercel domains add business.myitutor.com` to attach the custom domain to this new project
5. Vercel will output the required DNS record (a CNAME, typically `business.myitutor.com` → `cname.vercel-dns.com`) — this needs to be added in whatever registrar/DNS provider manages `myitutor.com` (already owned, not registered through Vercel). Print the exact record Vercel outputs so it can be handed off for that DNS step.
6. Confirm with `vercel domains inspect business.myitutor.com` that it's verified once the DNS record propagates

Environment variables (Supabase URL/keys, any LLM API key for quiz generation, email provider keys) should be set via `vercel env add` for each environment (production/preview) rather than committed to the repo.

## 7. Known issues from the last design review — verify these are resolved in the current export before wiring up
- Every internal page's logo/home link must point to that side's actual home (business → dashboard, learner → marketplace/landing), not back to a signup screen
- Certificate screen needs a persistent header/way back to the dashboard or portfolio
- Certificate screen needs Add-to-LinkedIn (pre-filled certification, distinct from generic link sharing) and social share icons
- Stamp should render only if uploaded — no placeholder gap
- The course landing page should show the real block-by-block sequence (Udemy-style expandable curriculum), not a one-line summary — and "What you'll learn" needs an actual admin-editable field/source instead of being an orphaned data binding
