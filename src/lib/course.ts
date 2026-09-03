import { FileText, Globe, HelpCircle, Video, type LucideIcon } from 'lucide-react'
import type { Database } from '@/lib/types/database'

export type BlockType = Database['public']['Enums']['block_type']
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

export const BLOCK_TYPES: BlockTypeMeta[] = [
  {
    type: 'video',
    label: 'Video',
    description: 'Upload a video or paste a link',
    icon: Video,
    iconBg: '#fce7f3',
    iconColor: '#db2777',
  },
  {
    type: 'text',
    label: 'Text',
    description: 'Rich text, a document, or a URL',
    icon: FileText,
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
  },
  {
    type: 'website',
    label: 'Website',
    description: 'Link out to an external page',
    icon: Globe,
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
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
  // Every block_type enum member has an entry above, so this cannot miss.
  return BLOCK_TYPES.find((meta) => meta.type === type)!
}

/* ── content_ref payloads ──────────────────────────────────────────────── */

/**
 * `course_blocks.content_ref` is a free-form jsonb column. These are the shapes
 * this app writes into it, one per block type. Readers must treat every field
 * as possibly absent — rows written by an earlier build, or by a future block
 * type, are not guaranteed to match.
 */
export type VideoContent = {
  method: 'upload' | 'link'
  url: string | null
  fileName: string | null
  captions: boolean
}

export type TextContent = {
  mode: 'rich' | 'upload' | 'url'
  body: string
  url: string | null
  fileName: string | null
}

export type WebsiteContent = { url: string | null }

export const EMPTY_CONTENT: Record<BlockType, unknown> = {
  video: { method: 'upload', url: null, fileName: null, captions: true } satisfies VideoContent,
  text: { mode: 'rich', body: '', url: null, fileName: null } satisfies TextContent,
  website: { url: null } satisfies WebsiteContent,
  quiz: {},
}

/* ── Quiz configuration ────────────────────────────────────────────────── */

export const QUIZ_SCOPE_OPTIONS: { value: QuizScope; label: string }[] = [
  { value: 'preceding_block', label: 'The block(s) immediately before it' },
  { value: 'since_last_quiz', label: 'All material since the last quiz' },
  { value: 'specific_blocks', label: 'Specific blocks' },
  { value: 'whole_course', label: 'Whole course' },
  { value: 'none', label: 'None — general knowledge' },
]

export const PASSING_SCORE_OPTIONS = [60, 70, 80, 90] as const

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

export const COURSE_TAG_SUGGESTIONS = [
  'Food Safety',
  'Sanitation',
  'Allergen Awareness',
  'Customer Service',
  'Cash Handling',
  'Safety',
  'Inventory Management',
  'Leadership',
  'Loss Prevention',
  'Conflict Resolution',
] as const

/* ── Builder steps ─────────────────────────────────────────────────────── */

/**
 * The builder asks for things in the order they can actually be answered:
 * what the course IS first, then the material, then the settings that only
 * mean something once material exists (how long it takes, how its quizzes
 * behave), then review & publish (build step 6) once all of that is set.
 */
export const COURSE_BUILD_STEPS = [
  { key: 'basics', label: 'Basics' },
  { key: 'content', label: 'Content' },
  { key: 'details', label: 'Details' },
  { key: 'publish', label: 'Publish' },
] as const

export type CourseStepKey = (typeof COURSE_BUILD_STEPS)[number]['key']

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
