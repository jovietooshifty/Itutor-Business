'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, Check, Clock, GripVertical, Plus, Trash2 } from 'lucide-react'
import { Button, cn } from '@/components/ui'
import { CourseSteps } from '@/components/business/course-steps'
import {
  BLOCK_TYPES,
  blockTypeMeta,
  type BlockSourceStatus,
  type BlockType,
} from '@/lib/course'
import {
  addBlock,
  deleteBlock,
  recordBuildProgress,
  reorderBlocks,
  updateBlock,
} from '@/app/(business)/courses/actions'

/**
 * Only what the sequence screen itself needs. The rest of the course record is
 * step 1's (basics) or step 3's (details) to load and edit.
 */
export type BuilderCourse = {
  id: string
  title: string
}

export type BuilderBlock = {
  id: string
  type: BlockType
  title: string
  /** Whether this block has material a later quiz could be generated from. */
  sourceStatus: BlockSourceStatus
  /** Quiz blocks only: how many questions are on it so far. */
  questionCount: number
}

/**
 * Course Builder step 2a — planning the sequence.
 *
 * This screen decides WHAT the course contains and in WHAT ORDER, and nothing
 * else. Picking "Video" adds a video slot; it does not ask for a file. Filling
 * each block in is step 2b, one page per block, walked in the order set here.
 *
 * The split is the whole point of the rework. The old screen expanded each row
 * into a configuration panel, so planning a ten-block course meant ten
 * accordions of half-answered forms, and the ordering — the thing this screen
 * is actually for — was buried under them.
 *
 * Structural edits (add, delete, reorder) hit the server as they happen
 * because they need real row ids and positions. Titles stay local and are
 * flushed by "Save changes", or by moving on.
 */
export function CourseSequence({
  course,
  initialBlocks,
  canDelete,
  variant = 'wizard',
}: {
  course: BuilderCourse
  initialBlocks: BuilderBlock[]
  canDelete: boolean
  /**
   * 'wizard' is the build flow — step rail, Back to basics, Continue into the
   * walkthrough. 'manage' is the Sequence tab of an existing course, where
   * that chrome would be wrong: you are rearranging one thing, not walking a
   * path, and each row links straight to its own page.
   */
  variant?: 'wizard' | 'manage'
}) {
  const isWizard = variant === 'wizard'
  const router = useRouter()
  const [blocks, setBlocks] = React.useState(initialBlocks)
  const [insertAt, setInsertAt] = React.useState<number | null>(null)
  const [dragging, setDragging] = React.useState<string | null>(null)
  const [dirty, setDirty] = React.useState<Set<string>>(new Set())

  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  // Leaving from here and coming back should land here. Bookkeeping only —
  // a failure changes nothing on screen, so it is not surfaced.
  React.useEffect(() => {
    if (!isWizard) return
    void recordBuildProgress(course.id, 'sequence', null)
  }, [isWizard, course.id])

  function renameBlock(id: string, title: string) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, title } : b)))
    setDirty((prev) => new Set(prev).add(id))
    setSaved(false)
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
        sourceStatus: 'empty',
        questionCount: 0,
      }
      setBlocks((prev) => [...prev.slice(0, index), created, ...prev.slice(index)])
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
    // Cleared up front: every path out of here ends the drag, and a path that
    // returned without clearing left the source block stuck at opacity-40.
    // onDragEnd covers the drops that never reach this function at all.
    const source = dragging
    setDragging(null)

    if (!source || source === targetId) return

    const from = blocks.findIndex((b) => b.id === source)
    const to = blocks.findIndex((b) => b.id === targetId)
    if (from < 0 || to < 0) return

    const next = [...blocks]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)

    setBlocks(next)
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
   * Flushes renamed blocks. `then` runs only on a clean save, so stepping away
   * never silently drops what was typed.
   */
  function saveTitles(then?: () => void) {
    setError(null)
    startTransition(async () => {
      for (const id of dirty) {
        const block = blocks.find((b) => b.id === id)
        if (!block) continue

        const result = await updateBlock(course.id, block.id, { title: block.title })
        if (!result.ok) {
          setError(result.error)
          return
        }
      }

      setDirty(new Set())
      setSaved(true)
      then?.()
    })
  }

  const firstBlockId = blocks[0]?.id ?? null

  return (
    <div className={isWizard ? 'mx-auto max-w-[880px] p-6 md:p-10' : ''}>
      {isWizard && (
        <>
          <CourseSteps current="content" courseId={course.id} />

          <h1 className="m-0 mb-1.5 font-display text-[28px] font-bold text-ink">
            {course.title.trim() || 'Untitled course'}
          </h1>
          <p className="m-0 mb-8 text-sm text-ink-muted">
            Plan the running order first — what learners work through, and in what sequence. You
            will fill each one in next, one page at a time.
          </p>
        </>
      )}

      <div className="rounded-xl border border-[#f3f4f6] bg-white p-4 shadow-sm md:p-6">
        {/* A course with no blocks is the one state where the + has to be
            pointed at rather than merely present: there is no list yet for it
            to sit between, so it reads as a divider ornament. Goes as soon as
            there is a block, because by then it has been understood. */}
        {blocks.length === 0 && (
          <p className="m-0 mb-3 flex items-start gap-2 rounded-md bg-brand-light px-3.5 py-2.5 text-sm font-semibold text-[var(--itutor-green)]">
            <ArrowDown size={15} className="mt-0.5 shrink-0" aria-hidden />
            Click the + to add your first block — video, text, or quiz.
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
              dragging={dragging === block.id}
              canDelete={canDelete}
              editHref={`/courses/${course.id}/content/${block.id}${isWizard ? '' : '?from=manage'}`}
              onRename={(title) => renameBlock(block.id, title)}
              onDelete={() => handleDelete(block.id)}
              onDragStart={() => setDragging(block.id)}
              onDragEnd={() => setDragging(null)}
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
        {/* Both moves flush pending renames first — see saveTitles(). */}
        {isWizard ? (
          <Button
            variant="ghost"
            loading={pending}
            onClick={() => saveTitles(() => router.push(`/courses/${course.id}/basics`))}
          >
            <ArrowLeft size={15} /> Back to basics
          </Button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-3">
          <Button
            variant={isWizard ? 'secondary' : 'primary'}
            size={isWizard ? 'md' : 'lg'}
            onClick={() => saveTitles()}
            loading={pending}
            disabled={dirty.size === 0}
          >
            Save changes
          </Button>
          {isWizard && (
            <Button
              size="lg"
              loading={pending}
              disabled={!firstBlockId}
              title={firstBlockId ? undefined : 'Add at least one block first'}
              onClick={() =>
                saveTitles(() => router.push(`/courses/${course.id}/content/${firstBlockId}`))
              }
            >
              Continue <ArrowRight size={15} />
            </Button>
          )}
        </div>
      </div>

      {isWizard && blocks.length > 0 && (
        <p className="mt-2.5 text-right text-xs text-[#9ca3af]">
          Next: {blocks.length} {blocks.length === 1 ? 'page' : 'pages'}, one per block, in this
          order.
        </p>
      )}

      {saved && (
        <p className="mt-2.5 text-right text-xs font-semibold text-[var(--itutor-green)]">
          Saved
        </p>
      )}
    </div>
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
            // Solid and filled, not an outline. A 28px white circle with a grey
            // icon between two hairlines read as part of the divider rather
            // than as the control that builds the course.
            'grid h-9 w-9 shrink-0 place-items-center rounded-full text-white shadow-sm',
            'transition-colors duration-fast',
            open
              ? 'bg-[var(--itutor-green)]'
              : 'bg-ink hover:bg-[color:var(--itutor-green)]'
          )}
        >
          <Plus size={18} strokeWidth={2.5} className={cn('transition-transform', open && 'rotate-45')} />
        </button>
        <span className="h-px flex-1 bg-surface-border" />
      </div>

      {open && (
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
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

/**
 * What the row says about a block's state. Not a nag — the point is that after
 * the walkthrough you can look down the sequence and see, in one pass, which
 * blocks still need something.
 */
function statusHint(block: BuilderBlock): { label: string; tone: 'ok' | 'wait' | 'todo' } {
  if (block.type === 'quiz') {
    return block.questionCount > 0
      ? { label: `${block.questionCount} question${block.questionCount === 1 ? '' : 's'}`, tone: 'ok' }
      : { label: 'No questions yet', tone: 'todo' }
  }
  if (block.sourceStatus === 'ready') return { label: 'Ready', tone: 'ok' }
  if (block.sourceStatus === 'pending') return { label: 'Needs a transcript', tone: 'wait' }
  if (block.sourceStatus === 'failed') return { label: 'Could not be read', tone: 'wait' }
  return { label: 'Empty', tone: 'todo' }
}

function BlockRow({
  block,
  index,
  dragging,
  canDelete,
  editHref,
  onRename,
  onDelete,
  onDragStart,
  onDragEnd,
  onDrop,
}: {
  block: BuilderBlock
  index: number
  dragging: boolean
  canDelete: boolean
  editHref: string
  onRename: (title: string) => void
  onDelete: () => void
  onDragStart: () => void
  onDragEnd: () => void
  onDrop: () => void
}) {
  const meta = blockTypeMeta(block.type)
  const Icon = meta.icon
  const hint = statusHint(block)
  const HintIcon = hint.tone === 'ok' ? Check : hint.tone === 'wait' ? Clock : AlertTriangle

  return (
    <div
      draggable
      onDragStart={onDragStart}
      // Fires however the drag ends — dropped on a block, dropped into empty
      // space, or cancelled with Escape — so the faded state always clears.
      onDragEnd={onDragEnd}
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
          onChange={(e) => onRename(e.target.value)}
          placeholder={`${meta.label} block ${index + 1}`}
          aria-label={`Title for ${meta.label.toLowerCase()} block ${index + 1}`}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold text-ink outline-none placeholder:font-normal placeholder:text-[#9ca3af]"
        />

        <span
          className={cn(
            'hidden shrink-0 items-center gap-1.5 text-xs font-semibold sm:inline-flex',
            hint.tone === 'ok' && 'text-[var(--itutor-green)]',
            hint.tone === 'wait' && 'text-[#b45309]',
            hint.tone === 'todo' && 'text-[#9ca3af]'
          )}
        >
          <HintIcon size={12} aria-hidden /> {hint.label}
        </span>

        <Link
          href={editHref}
          className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-ink-muted no-underline transition-colors duration-fast hover:bg-surface-inset hover:text-ink"
        >
          Open
        </Link>

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
      </div>
    </div>
  )
}
