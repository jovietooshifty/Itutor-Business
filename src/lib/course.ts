import { FileText, HelpCircle, Video, type LucideIcon } from 'lucide-react'
import type { Database } from '@/lib/types/database'

export type BlockType = Database['public']['Enums']['block_type']
export type BlockSourceStatus = Database['public']['Enums']['block_source_status']
export type CourseBuildStage = Database['public']['Enums']['course_build_stage']
export type QuizScope = Database['public']['Enums']['quiz_scope']
export type QuizNavigation = Database['public']['Enums']['quiz_navigation']
export type QuizNavigationOverride = Database['public']['Enums']['quiz_navigation_override']
export type CourseVisibility = Database['public']['Enums']['course_visibility']
export type CourseStatus = Database['public']['Enums']['course_status']

/* ── Block types ───────────────────────────────────────────────────────── */

export type BlockTypeMeta = {
  type: BlockType
  label: string
  description: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

/**
 * There is no website block. A link cannot be fetched reliably enough to
 * generate questions from — paywalls, consent walls, client-rendered pages and
 * pages that simply change — so authored material is uploaded or typed, and
 * the quiz always has something real to read.
 */
export const BLOCK_TYPES: BlockTypeMeta[] = [
  {
    type: 'video',
    label: 'Video',
    description: 'A video file, with notes and guidance',
    icon: Video,
    iconBg: '#fce7f3',
    iconColor: '#db2777',
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Written material or a document',
    icon: FileText,
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
  },
  {
    type: 'quiz',
    label: 'Quiz',
    description: 'Test what learners just covered',
    icon: HelpCircle,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
]

export function blockTypeMeta(type: BlockType): BlockTypeMeta {
  // Every block_type enum member has an entry above, so this cannot miss —
  // except for a row written before a type was retired, which falls back to
  // Text rather than crashing the page it appears on.
  return BLOCK_TYPES.find((meta) => meta.type === type) ?? BLOCK_TYPES[1]
}

/* ── Uploaded material ─────────────────────────────────────────────────── */

/** The private bucket every uploaded video and document lands in. */
export const MATERIAL_BUCKET = 'course-material'

/** Path convention the bucket's RLS policies key off: course id comes first. */
export function materialPath(courseId: string, blockId: string, fileName: string): string {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-80)
  return `${courseId}/${blockId}/${Date.now()}-${safe}`
}

export const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-m4v',
] as const

export const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'text/markdown',
] as const

/* ── content_ref payloads ──────────────────────────────────────────────── */

/**
 * `course_blocks.content_ref` is a free-form jsonb column. These are the shapes
 * this app writes into it, one per block type. Readers must treat every field
 * as possibly absent — rows written by an earlier build, or by a future block
 * type, are not guaranteed to match. Use `asVideo` / `asText` rather than
 * casting.
 */
export type VideoContent = {
  /** Object path in MATERIAL_BUCKET. Null until something is uploaded. */
  path: string | null
  fileName: string | null
  /**
   * Legacy only. Rows written when videos could be linked hold an external
   * URL here; the player still honours it so those courses keep working. The
   * builder never writes it.
   */
  url: string | null
  captions: boolean
  /** What the learner should DO with this material, shown before the player. */
  guidelines: string
  /** Extra material shown alongside the video. */
  notes: string
  /**
   * What quizzes after this block are generated from. Produced by the
   * transcribe action or pasted in, and editable either way — a transcript is
   * a first draft, not a fact.
   */
  transcript: string
}

export type TextContent = {
  mode: 'rich' | 'upload'
  body: string
  /** Object path in MATERIAL_BUCKET, when mode is 'upload'. */
  path: string | null
  fileName: string | null
  /** What to focus on while reading, shown above the content. */
  pointers: string
  /** The takeaway, shown after it. */
  summary: string
}

/** Reads a jsonb payload defensively — rows may predate the current shape. */
export function asVideo(content: unknown): VideoContent {
  const c = (content ?? {}) as Partial<VideoContent>
  return {
    path: c.path ?? null,
    fileName: c.fileName ?? null,
    url: c.url ?? null,
    captions: c.captions ?? true,
    guidelines: c.guidelines ?? '',
    notes: c.notes ?? '',
    transcript: c.transcript ?? '',
  }
}

export function asText(content: unknown): TextContent {
  const c = (content ?? {}) as Partial<TextContent>
  return {
    mode: c.mode === 'upload' ? 'upload' : 'rich',
    body: c.body ?? '',
    path: c.path ?? null,
    fileName: c.fileName ?? null,
    pointers: c.pointers ?? '',
    summary: c.summary ?? '',
  }
}

export const EMPTY_CONTENT: Record<BlockType, unknown> = {
  video: {
    path: null,
    fileName: null,
    url: null,
    captions: true,
    guidelines: '',
    notes: '',
    transcript: '',
  } satisfies VideoContent,
  text: {
    mode: 'rich',
    body: '',
    path: null,
    fileName: null,
    pointers: '',
    summary: '',
  } satisfies TextContent,
  quiz: {},
}

/**
 * Presets rather than a blank box, so the sentence a learner reads before a
 * video is consistent across a course and across authors — with "Something
 * else" for the cases four presets do not cover.
 */
export const VIDEO_GUIDELINE_PRESETS = [
  'Just watch — nothing to write down.',
  'Take notes as you watch.',
  'Watch, then try it yourself before moving on.',
  'Watch twice: once straight through, once pausing to reflect.',
] as const

/** Whether a stored guideline came from the preset list or was typed. */
export function isGuidelinePreset(value: string): boolean {
  return (VIDEO_GUIDELINE_PRESETS as readonly string[]).includes(value)
}

/* ── Quiz configuration ────────────────────────────────────────────────── */

export const QUIZ_SCOPE_OPTIONS: { value: QuizScope; label: string }[] = [
  { value: 'preceding_block', label: 'The block(s) immediately before it' },
  { value: 'since_last_quiz', label: 'All material since the last quiz' },
  { value: 'specific_blocks', label: 'Specific blocks' },
  { value: 'whole_course', label: 'Whole course' },
]

export const PASSING_SCORE_OPTIONS = [60, 70, 80, 90] as const

/**
 * The counts offered when "specific number" is chosen. `null` — no specific
 * number, the model decides from the material — is the default, because a
 * 90-second video and a 40-page manual should not both get five questions just
 * because five is the number in the box. See quizzes.generation_count.
 */
export const GENERATION_COUNT_CHOICES = [3, 5, 10, 15, 20] as const

/** `null` means retries are off entirely; `0` means retry with no wait. */
export const RETRY_COOLDOWN_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: 'None' },
  { value: 1, label: '1 hour' },
  { value: 24, label: '24 hours' },
]

export const NAVIGATION_LABELS: Record<QuizNavigation, string> = {
  allow_back: 'Allow going back',
  lock_forward: 'Lock forward-only',
}

/**
 * Resolves a quiz block's navigation the same way the database's
 * `effective_quiz_navigation()` does: the block's override, or the course
 * default when the override is `inherit`.
 */
export function effectiveNavigation(
  courseDefault: QuizNavigation,
  override: QuizNavigationOverride
): QuizNavigation {
  return override === 'inherit' ? courseDefault : override
}

/**
 * The retries/navigation dependency rule from the handoff spec: retry limits
 * only mean something when a learner can move backwards through the quiz.
 *
 * The database enforces this with triggers across three tables. This mirror
 * exists so the UI can grey the controls out and the server action can reject
 * with a readable message instead of surfacing a raw Postgres exception.
 */
export function retriesAllowed(navigation: QuizNavigation): boolean {
  return navigation === 'allow_back'
}

/* ── Setup screen ──────────────────────────────────────────────────────── */

/**
 * What a course is ABOUT, grouped for browsing.
 *
 * These were ten fixed strings rendered as chips with no text input, so those
 * ten were the only categories that could exist. They are now seeds for a
 * typeahead that also takes anything typed — a list of categories cannot
 * anticipate every trade, and a course nobody can categorise is a course
 * nobody can find.
 *
 * Kept separate from SKILL_GROUPS in constants.ts, which answers the different
 * question of what a *person* can do.
 */
export const COURSE_TAG_GROUPS = [
  {
    label: 'Compliance & Safety',
    options: [
      'Food Safety',
      'HACCP',
      'Sanitation',
      'Allergen Awareness',
      'Workplace Safety',
      'PPE',
      'Fire Safety',
      'First Aid',
      'Electrical Safety',
      'Working at Heights',
      'Confined Spaces',
      'Manual Handling',
      'Chemical Handling',
      'Environmental Compliance',
    ],
  },
  {
    label: 'Operations',
    options: [
      'Inventory Management',
      'Loss Prevention',
      'Quality Control',
      'Equipment Operation',
      'Maintenance',
      'Logistics',
      'Scheduling',
    ],
  },
  {
    label: 'Customer & Sales',
    options: [
      'Customer Service',
      'Sales',
      'Upselling',
      'Complaint Handling',
      'Cash Handling',
      'POS Systems',
    ],
  },
  {
    label: 'People',
    options: [
      'Leadership',
      'Onboarding',
      'Conflict Resolution',
      'Communication',
      'Time Management',
      'Teamwork',
      'Performance Management',
    ],
  },
  {
    label: 'Technical & Trade',
    options: [
      'Installation',
      'Troubleshooting',
      'Blueprint Reading',
      'Welding',
      'Plumbing',
      'HVAC',
      'Solar Installation',
      'Battery Systems',
    ],
  },
  {
    label: 'Digital & Admin',
    options: [
      'Data Entry',
      'Spreadsheets',
      'Reporting',
      'Documentation',
      'Cybersecurity Basics',
    ],
  },
] as const

export const COURSE_TAG_SUGGESTIONS = COURSE_TAG_GROUPS.flatMap((group) => group.options)

/** More than this and a category stops narrowing anything down. */
export const COURSE_TAG_MAX = 5

/**
 * One spelling per concept. Without this you get `Safety`, `safety` and
 * `Safety ` as three separate tags, which browse as three separate categories
 * holding a third of the courses each.
 *
 * Words already capitalised in an unusual way are left alone — HACCP and HVAC
 * must not become Haccp and Hvac.
 */
export function normalizeCourseTag(tag: string): string {
  const trimmed = tag.trim().replace(/\s+/g, ' ')
  if (!trimmed) return ''

  // An exact case-insensitive hit on a seeded tag wins, so the canonical
  // spelling is whatever the taxonomy says it is.
  const seeded = COURSE_TAG_SUGGESTIONS.find(
    (option) => option.toLowerCase() === trimmed.toLowerCase()
  )
  if (seeded) return seeded

  return trimmed
    .split(' ')
    .map((word) =>
      // Already mixed- or all-caps beyond the first letter: the author meant it.
      /[A-Z]/.test(word.slice(1)) ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
}

/* ── Builder steps ─────────────────────────────────────────────────────── */

/**
 * The builder asks for things in the order they can actually be answered:
 * what the course IS first, then the material, then the settings that only
 * mean something once material exists (how long it takes, how its quizzes
 * behave), then review & publish.
 *
 * "Content" is two screens, not one: the sequence (what blocks, in what order)
 * and then a walkthrough with one page per block. Planning the shape of a
 * course and filling each block in are different jobs, and doing them in one
 * accordion meant doing neither well.
 */
export const COURSE_BUILD_STEPS = [
  { key: 'basics', label: 'Basics' },
  { key: 'content', label: 'Content' },
  { key: 'details', label: 'Details' },
  { key: 'publish', label: 'Publish' },
] as const

export type CourseStepKey = (typeof COURSE_BUILD_STEPS)[number]['key']

/**
 * Where "Resume" on the courses index sends someone back to. A walkthrough
 * cursor whose block has since been deleted falls back to the sequence, which
 * is the screen that can put it right.
 */
export function resumeHref(
  courseId: string,
  stage: CourseBuildStage,
  blockId: string | null
): string {
  switch (stage) {
    case 'basics':
      return `/courses/${courseId}/basics`
    case 'walkthrough':
      return blockId ? `/courses/${courseId}/content/${blockId}` : `/courses/${courseId}`
    case 'details':
      return `/courses/${courseId}/details`
    case 'publish':
      return `/courses/${courseId}/publish`
    case 'sequence':
    default:
      return `/courses/${courseId}`
  }
}

/* ── Step 1: basics ────────────────────────────────────────────────────── */

/** What the course is. Answerable before a single block exists. */
export type CourseBasics = {
  title: string
  description: string
  visibility: CourseVisibility
  tags: string[]
  whatYouWillLearn: string[]
  thumbnailUrl: string | null
}

export function emptyCourseBasics(): CourseBasics {
  return {
    title: '',
    description: '',
    visibility: 'private',
    tags: [],
    whatYouWillLearn: [],
    thumbnailUrl: null,
  }
}

/* ── Step 3: details ───────────────────────────────────────────────────── */

/**
 * Settings that need the material to exist first: you cannot estimate a
 * duration for content you have not added, and quiz defaults are meaningless
 * until the course has a quiz to apply them to.
 */
export type CourseDetails = {
  durationLabel: string
  quizNavigationDefault: QuizNavigation
  retryMaxDefault: number | null
  retryCooldownHoursDefault: number | null
}

/** What a brand-new course gets until step 3 is filled in. */
export const DEFAULT_COURSE_DETAILS: CourseDetails = {
  durationLabel: '',
  quizNavigationDefault: 'allow_back',
  retryMaxDefault: null,
  retryCooldownHoursDefault: null,
}
