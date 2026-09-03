'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
} from 'lucide-react'
import { Button, cn } from '@/components/ui'
import { CourseSteps } from '@/components/business/course-steps'
import {
  QuizConfig,
  TextConfig,
  VideoConfig,
  WebsiteConfig,
  type QuizState,
} from '@/components/business/block-config'
import {
  BLOCK_TYPES,
  EMPTY_CONTENT,
  blockTypeMeta,
  type BlockType,
  type QuizNavigation,
  type QuizNavigationOverride,
} from '@/lib/course'
import {
  addBlock,
  deleteBlock,
  reorderBlocks,
  updateBlock,
  updateQuizConfig,
} from '@/app/(business)/courses/actions'

/**
 * Only what the sequence screen itself needs. The rest of the course record is
 * step 1's (basics) or step 3's (details) to load and edit.
 */
export type BuilderCourse = {
  id: string
  title: string
  quizNavigationDefault: QuizNavigation
  retryMaxDefault: number | null
  retryCooldownHoursDefault: number | null
}

export type BuilderBlock = {
  id: string
  type: BlockType
  title: string
  content: unknown
  navigationOverride: QuizNavigationOverride
  quiz: QuizState | null
}

const DEFAULT_QUIZ: QuizState = {
  passingScore: 80,
  scope: 'preceding_block',
  scopeBlockIds: [],
  revealAnswers: false,
  retryMax: null,
  retryCooldownHours: null,
}

/**
 * Course Builder step 2 — the lesson sequence.
 *
 * Structural edits (add, delete, reorder) hit the server as they happen because
 * they need real row ids and positions. Field edits stay local and are flushed
 * by "Save draft", which is the model the design draws: a save button and a
 * "Draft saved" confirmation, not an autosave.
 *
 * Course-level settings are deliberately NOT here. Title and the rest are step
 * 1 ("Back"), duration and quiz defaults are step 3 ("Continue") — asking for
 * them beside the sequence is what made the old settings panel a dead end: its
 * fields never marked the draft dirty, so Save draft stayed disabled.
 */
export function CourseSequence({
  course,
  initialBlocks,
  canDelete,
}: {
  course: BuilderCourse
  initialBlocks: BuilderBlock[]
  canDelete: boolean
}) {
  const router = useRouter()
  const [blocks, setBlocks] = React.useState(initialBlocks)
  const [expanded, setExpanded] = React.useState<string | null>(null)
  const [insertAt, setInsertAt] = React.useState<number | null>(null)
  const [dragging, setDragging] = React.useState<string | null>(null)
  const [dirty, setDirty] = React.useState<Set<string>>(new Set())

  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  function markDirty(id: string) {
    setDirty((prev) => new Set(prev).add(id))
    setSaved(false)
  }

  function patchBlock(id: string, patch: Partial<BuilderBlock>) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))
    markDirty(id)
  }

  /* ── Structural edits ───────────────────────────────────────────────── */

  function handleAdd(index: number, type: BlockType) {
    setError(null)
    setInsertAt(null)

    startTransition(async () => {
      const result = await addBlock(course.id, type, index)
      if (!result.ok) {
        setError(result.error)
        return
      }

      const created: BuilderBlock = {
        id: result.data!.id,
        type,
        title: '',
        content: EMPTY_CONTENT[type],
        navigationOverride: 'inherit',
        quiz:
          type === 'quiz'
            ? {
                ...DEFAULT_QUIZ,
                retryMax: course.retryMaxDefault,
                retryCooldownHours:
                  course.retryMaxDefault === null ? null : course.retryCooldownHoursDefault,
              }
            : null,
      }

      setBlocks((prev) => [...prev.slice(0, index), created, ...prev.slice(index)])
      setExpanded(created.id)
    })
  }

  function handleDelete(id: string) {
    setError(null)
    startTransition(async () => {
      const result = await deleteBlock(course.id, id)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setBlocks((prev) => prev.filter((b) => b.id !== id))
      setDirty((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    })
  }

  function handleDrop(targetId: string) {
    if (!dragging || dragging === targetId) return

    const from = blocks.findIndex((b) => b.id === dragging)
    const to = blocks.findIndex((b) => b.id === targetId)
    if (from < 0 || to < 0) return

    const next = [...blocks]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)

    setBlocks(next)
    setDragging(null)
    setError(null)

    const orderedIds = next.map((b) => b.id)
    startTransition(async () => {
      const result = await reorderBlocks(course.id, orderedIds)
      // The list is already reordered on screen; a failed write would leave the
      // two out of step, so put it back rather than lie about the order.
      if (!result.ok) {
        setError(result.error)
        setBlocks(blocks)
      }
    })
  }

  /* ── Saving ─────────────────────────────────────────────────────────── */

  /**
   * Flushes pending field edits. `then` runs only on a clean save, so stepping
   * away never silently drops what the user typed.
   */
  function saveDraft(then?: () => void) {
    setError(null)
    startTransition(async () => {
      for (const id of dirty) {
        const block = blocks.find((b) => b.id === id)
        if (!block) continue

        const blockResult = await updateBlock(course.id, block.id, {
          title: block.title,
          content: block.content,
        })
        if (!blockResult.ok) {
          setError(blockResult.error)
          return
        }

        if (block.type === 'quiz' && block.quiz) {
          const quizResult = await updateQuizConfig(course.id, block.id, {
            passingScore: block.quiz.passingScore,
            scope: block.quiz.scope,
            scopeBlockIds: block.quiz.scopeBlockIds,
            revealAnswers: block.quiz.revealAnswers,
            navigationOverride: block.navigationOverride,
            retryMax: block.quiz.retryMax,
            retryCooldownHours: block.quiz.retryCooldownHours,
          })
          if (!quizResult.ok) {
            setError(quizResult.error)
            return
          }
        }
      }

      setDirty(new Set())
      setSaved(true)
      then?.()
    })
  }

  return (
    <main className="mx-auto max-w-[880px] p-6 md:p-10">
      <CourseSteps current="content" courseId={course.id} />

      <h1 className="m-0 mb-1.5 font-display text-[28px] font-bold text-ink">
        {course.title.trim() || 'Untitled course'}
      </h1>
      <p className="m-0 mb-8 text-sm text-ink-muted">
        Add the material, in the order learners should work through it.
      </p>

      <div className="rounded-xl border border-[#f3f4f6] bg-white p-4 shadow-sm md:p-6">
        {blocks.length === 0 && insertAt === null && (
          <p className="py-6 text-center text-sm text-[#9ca3af]">
            Nothing here yet — add your first block below.
          </p>
        )}

        <InsertRow
          open={insertAt === 0}
          onToggle={() => setInsertAt(insertAt === 0 ? null : 0)}
          onPick={(type) => handleAdd(0, type)}
        />

        {blocks.map((block, index) => (
          <React.Fragment key={block.id}>
            <BlockRow
              block={block}
              index={index}
              expanded={expanded === block.id}
              dragging={dragging === block.id}
              canDelete={canDelete}
              courseNavigationDefault={course.quizNavigationDefault}
              priorBlocks={blocks.slice(0, index).map((b) => ({
                id: b.id,
                label: b.title.trim() || `${blockTypeMeta(b.type).label} block`,
              }))}
              onToggleExpand={() => setExpanded(expanded === block.id ? null : block.id)}
              onPatch={(patch) => patchBlock(block.id, patch)}
              onDelete={() => handleDelete(block.id)}
              onDragStart={() => setDragging(block.id)}
              onDrop={() => handleDrop(block.id)}
            />
            <InsertRow
              open={insertAt === index + 1}
              onToggle={() => setInsertAt(insertAt === index + 1 ? null : index + 1)}
              onPick={(type) => handleAdd(index + 1, type)}
            />
          </React.Fragment>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {/* Both moves flush pending edits first — see saveDraft(). */}
        <Button
          variant="ghost"
          loading={pending}
          onClick={() => saveDraft(() => router.push(`/courses/${course.id}/basics`))}
        >
          <ArrowLeft size={15} /> Back to basics
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => saveDraft()}
            loading={pending}
            disabled={dirty.size === 0}
          >
            Save draft
          </Button>
          <Button
            size="lg"
            loading={pending}
            onClick={() => saveDraft(() => router.push(`/courses/${course.id}/details`))}
          >
            Continue to details
          </Button>
        </div>
      </div>

      {saved && (
        <p className="mt-2.5 text-right text-xs font-semibold text-[var(--itutor-green)]">
          Draft saved
        </p>
      )}
    </main>
  )
}

/* ── Insert affordance ─────────────────────────────────────────────────── */

function InsertRow({
  open,
  onToggle,
  onPick,
}: {
  open: boolean
  onToggle: () => void
  onPick: (type: BlockType) => void
}) {
  return (
    <div className="py-1.5">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-surface-border" />
        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? 'Cancel adding a block' : 'Add a block here'}
          aria-expanded={open}
          className={cn(
            'grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors duration-fast',
            open
              ? 'border-[color:var(--itutor-green)] bg-brand-light text-[var(--itutor-green)]'
              : 'border-surface-border bg-white text-ink-muted hover:border-[color:var(--itutor-green)] hover:text-[var(--itutor-green)]'
          )}
        >
          <Plus size={13} className={cn('transition-transform', open && 'rotate-45')} />
        </button>
        <span className="h-px flex-1 bg-surface-border" />
      </div>

      {open && (
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {BLOCK_TYPES.map((meta) => {
            const Icon = meta.icon
            return (
              <button
                key={meta.type}
                type="button"
                onClick={() => onPick(meta.type)}
                className="rounded-lg border border-surface-border bg-white p-3.5 text-left transition-[border-color,box-shadow] duration-fast hover:border-[color:var(--itutor-green)] hover:shadow-sm"
              >
                <span
                  className="mb-2 grid h-8 w-8 place-items-center rounded-md"
                  style={{ background: meta.iconBg, color: meta.iconColor }}
                >
                  <Icon size={15} aria-hidden />
                </span>
                <span className="block text-sm font-bold text-ink">{meta.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-[#9ca3af]">
                  {meta.description}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── One block ─────────────────────────────────────────────────────────── */

function BlockRow({
  block,
  index,
  expanded,
  dragging,
  canDelete,
  courseNavigationDefault,
  priorBlocks,
  onToggleExpand,
  onPatch,
  onDelete,
  onDragStart,
  onDrop,
}: {
  block: BuilderBlock
  index: number
  expanded: boolean
  dragging: boolean
  canDelete: boolean
  courseNavigationDefault: QuizNavigation
  priorBlocks: { id: string; label: string }[]
  onToggleExpand: () => void
  onPatch: (patch: Partial<BuilderBlock>) => void
  onDelete: () => void
  onDragStart: () => void
  onDrop: () => void
}) {
  const meta = blockTypeMeta(block.type)
  const Icon = meta.icon

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        onDrop()
      }}
      className={cn(
        'rounded-lg border border-surface-border bg-white transition-opacity',
        dragging && 'opacity-40'
      )}
    >
      <div className="flex items-center gap-2.5 p-3">
        <span className="cursor-grab text-[#9ca3af]" aria-hidden>
          <GripVertical size={15} />
        </span>
        <span
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
          style={{ background: meta.iconBg, color: meta.iconColor }}
        >
          <Icon size={15} aria-hidden />
        </span>

        <input
          value={block.title}
          onChange={(e) => onPatch({ title: e.target.value })}
          placeholder={`${meta.label} block ${index + 1}`}
          aria-label={`Title for ${meta.label.toLowerCase()} block ${index + 1}`}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-[#9ca3af]"
        />

        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          title={canDelete ? 'Remove this block' : 'Only an admin can delete blocks'}
          aria-label={`Remove ${meta.label.toLowerCase()} block ${index + 1}`}
          className="shrink-0 text-[#9ca3af] transition-colors duration-fast hover:text-[var(--danger-fg)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={14} />
        </button>

        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse block' : 'Configure block'}
          className="shrink-0 text-ink-muted hover:text-ink"
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-surface-border p-4">
          {block.type === 'video' && (
            <VideoConfig content={block.content} onChange={(content) => onPatch({ content })} />
          )}
          {block.type === 'text' && (
            <TextConfig content={block.content} onChange={(content) => onPatch({ content })} />
          )}
          {block.type === 'website' && (
            <WebsiteConfig content={block.content} onChange={(content) => onPatch({ content })} />
          )}
          {block.type === 'quiz' && block.quiz && (
            <QuizConfig
              quiz={block.quiz}
              navigationOverride={block.navigationOverride}
              courseNavigationDefault={courseNavigationDefault}
              priorBlocks={priorBlocks}
              onChange={({ quiz, navigationOverride }) => onPatch({ quiz, navigationOverride })}
            />
          )}
        </div>
      )}
    </div>
  )
}
