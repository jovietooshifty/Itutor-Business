'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Clock, Sparkles } from 'lucide-react'
import {
  Button,
  Checkbox,
  Field,
  Input,
  ProgressBar,
  SegmentedControl,
  Select,
  Textarea,
} from '@/components/ui'
import { CourseSteps } from '@/components/business/course-steps'
import { MaterialUpload } from '@/components/business/material-upload'
import { QuestionEditor, type EditableQuestion } from '@/components/business/question-editor'
import {
  PASSING_SCORE_OPTIONS,
  QUIZ_SCOPE_OPTIONS,
  VIDEO_GUIDELINE_PRESETS,
  asText,
  asVideo,
  blockTypeMeta,
  isGuidelinePreset,
  type BlockSourceStatus,
  type BlockType,
  type QuizNavigationOverride,
  type QuizScope,
  type TextContent,
  type VideoContent,
} from '@/lib/course'
import {
  recordBuildProgress,
  saveBlockPage,
  transcribeBlockVideo,
} from '@/app/(business)/courses/actions'

export type QuizState = {
  passingScore: number
  scope: QuizScope
  scopeBlockIds: string[]
  revealAnswers: boolean
  retryMax: number | null
  retryCooldownHours: number | null
  /** `null` is "no specific number" — the model decides. */
  generationCount: number | null
}

export type WalkthroughBlock = {
  id: string
  type: BlockType
  title: string
  content: unknown
  sourceStatus: BlockSourceStatus
  sourceError: string | null
  navigationOverride: QuizNavigationOverride
  quiz: QuizState | null
  /** Quiz blocks only. */
  questions: EditableQuestion[]
}

/** Everything before this block, which is what a quiz can be built from. */
export type PriorBlock = {
  id: string
  label: string
  type: BlockType
  sourceStatus: BlockSourceStatus
}

/**
 * Course Builder step 2b — the walkthrough.
 *
 * The sequence planned on the previous screen becomes this wizard's route:
 * video → quiz → text → quiz is four consecutive pages, in that order. One
 * block, one page, all of its questions asked at once — which is the trade the
 * rework makes against the old inline accordion, where a block's settings were
 * a panel you had to remember to open.
 */
export function BlockWalkthrough({
  courseId,
  courseTitle,
  block,
  index,
  total,
  priorBlocks,
  previousBlockId,
  nextBlockId,
  mode = 'wizard',
}: {
  courseId: string
  courseTitle: string
  block: WalkthroughBlock
  /** Zero-based position in the sequence. */
  index: number
  total: number
  priorBlocks: PriorBlock[]
  previousBlockId: string | null
  nextBlockId: string | null
  /**
   * 'wizard' walks the whole sequence. 'manage' is the same page opened from
   * the Sequence tab to fix one block, so it saves and goes back rather than
   * marching on to the next one.
   */
  mode?: 'wizard' | 'manage'
}) {
  const router = useRouter()
  const meta = blockTypeMeta(block.type)

  const [title, setTitle] = React.useState(block.title)
  const [content, setContent] = React.useState<unknown>(block.content)
  const [quiz, setQuiz] = React.useState<QuizState | null>(block.quiz)

  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  // Close the tab here and "Resume" comes back here. Bookkeeping only, and
  // only in the build flow — editing one block from the Sequence tab is not
  // where the wizard left off.
  React.useEffect(() => {
    if (mode !== 'wizard') return
    void recordBuildProgress(courseId, 'walkthrough', block.id)
  }, [mode, courseId, block.id])

  /**
   * The write itself, awaitable on its own. Generation needs this: it reads
   * the quiz's scope from the database, so pressing Generate with an unsaved
   * scope change would build questions from the material the quiz used to
   * cover, not the material the screen is showing.
   */
  async function persist(): Promise<{ ok: boolean; warnings: string[] }> {
    const result = await saveBlockPage(courseId, block.id, {
      title,
      content: block.type === 'quiz' ? undefined : content,
      quiz:
        block.type === 'quiz' && quiz
          ? {
              passingScore: quiz.passingScore,
              scope: quiz.scope,
              scopeBlockIds: quiz.scopeBlockIds,
              revealAnswers: quiz.revealAnswers,
              navigationOverride: block.navigationOverride,
              retryMax: quiz.retryMax,
              retryCooldownHours: quiz.retryCooldownHours,
              generationCount: quiz.generationCount,
            }
          : undefined,
    })

    if (!result.ok) {
      setError(result.error)
      return { ok: false, warnings: [] }
    }

    setSaved(true)
    return { ok: true, warnings: result.data?.warnings ?? [] }
  }

  function save(then?: () => void) {
    setError(null)
    setNotice(null)

    startTransition(async () => {
      const result = await persist()
      if (!result.ok) return

      // A warning is worth reading before moving on; an author who wanted to
      // continue can press Continue again now that they have seen it.
      if (result.warnings.length === 0) {
        then?.()
        return
      }
      setNotice(result.warnings.join(' '))
      router.refresh()
    })
  }

  const isLast = nextBlockId === null

  /**
   * Where leaving this page goes. Opened from course management it goes back
   * to the course, not to the builder's sequence step — management never
   * hands you back into the build flow. Inside the flow, the sequence step is
   * exactly where Back belongs.
   */
  const leaveHref = mode === 'manage' ? `/courses/${courseId}/manage` : `/courses/${courseId}`

  return (
    <main className="mx-auto max-w-[880px] p-6 md:p-10">
      {mode === 'wizard' && <CourseSteps current="content" courseId={courseId} />}

      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
            <span
              className="grid h-6 w-6 place-items-center rounded-md"
              style={{ background: meta.iconBg, color: meta.iconColor }}
            >
              <meta.icon size={13} aria-hidden />
            </span>
            Step {index + 1} of {total} · {meta.label}
          </span>
          {/* No second way out up here. The footer's Back already leaves this
              page, and it goes somewhere that depends on how you arrived —
              this link always went to the builder's sequence step, which is
              the wrong place entirely when the block was opened to be fixed. */}
        </div>
        <ProgressBar value={Math.round(((index + 1) / Math.max(total, 1)) * 100)} />
      </div>

      <h1 className="m-0 mb-1.5 font-display text-[28px] font-bold text-ink">{courseTitle}</h1>
      <p className="m-0 mb-8 text-sm text-ink-muted">{PAGE_INTROS[block.type]}</p>

      <div className="rounded-xl border border-[#f3f4f6] bg-white p-6 shadow-sm md:p-7">
        <Field
          label={`${meta.label} title`}
          hint="What learners see in the course outline."
          htmlFor="block-title"
        >
          <Input
            id="block-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`${meta.label} ${index + 1}`}
          />
        </Field>

        <div className="mt-6">
          {block.type === 'video' && (
            <VideoPage
              courseId={courseId}
              blockId={block.id}
              value={asVideo(content)}
              sourceStatus={block.sourceStatus}
              sourceError={block.sourceError}
              onChange={setContent}
              onBeforeTranscribe={async () => {
                setError(null)
                const result = await persist()
                return result.ok
              }}
              onTranscribed={(transcript) =>
                setContent({ ...asVideo(content), transcript })
              }
            />
          )}
          {block.type === 'text' && (
            <TextPage
              courseId={courseId}
              blockId={block.id}
              value={asText(content)}
              sourceStatus={block.sourceStatus}
              sourceError={block.sourceError}
              onChange={setContent}
            />
          )}
          {block.type === 'quiz' && quiz && (
            <QuizPage
              courseId={courseId}
              blockId={block.id}
              quiz={quiz}
              priorBlocks={priorBlocks}
              questions={block.questions}
              onChange={setQuiz}
              onBeforeGenerate={async () => {
                setError(null)
                const result = await persist()
                return result.ok
              }}
            />
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">{error}</p>
      )}
      {notice && (
        <p className="mt-4 rounded-md bg-[#fffbeb] px-4 py-3 text-sm text-[#92400e]">{notice}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {/* Every move saves first, so leaving a page never loses what is on it. */}
        <Button
          variant="ghost"
          loading={pending}
          onClick={() =>
            save(() =>
              router.push(
                previousBlockId
                  ? `/courses/${courseId}/content/${previousBlockId}${mode === 'manage' ? '?from=manage' : ''}`
                  : leaveHref
              )
            )
          }
        >
          <ArrowLeft size={15} />{' '}
          {previousBlockId ? 'Back' : mode === 'manage' ? 'Back to the course' : 'Back to the sequence'}
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="secondary" loading={pending} onClick={() => save()}>
            Save
          </Button>

          {mode === 'manage' ? (
            <Button
              size="lg"
              loading={pending}
              onClick={() => save(() => router.push(`/courses/${courseId}/manage`))}
            >
              Save and close
            </Button>
          ) : (
            <Button
              size="lg"
              loading={pending}
              onClick={() =>
                save(() =>
                  router.push(
                    /* The last block returns to the sequence rather than
                       marching on to Details. Filling in the final block is
                       not the same as being finished with the content: the
                       usual next move is adding another block or fixing an
                       earlier one, and both live on the sequence screen. From
                       there, Continue goes to Details when the author says so. */
                    isLast
                      ? `/courses/${courseId}`
                      : `/courses/${courseId}/content/${nextBlockId}`
                  )
                )
              }
            >
              {isLast ? (
                <>
                  <Check size={15} /> Done
                </>
              ) : (
                <>
                  Continue to next page <ArrowRight size={15} />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {saved && !notice && (
        <p className="mt-2.5 text-right text-xs font-semibold text-[var(--itutor-green)]">Saved</p>
      )}
    </main>
  )
}

const PAGE_INTROS: Record<BlockType, string> = {
  video: 'Add the video, and tell learners what to do with it.',
  text: 'Add the written material, and frame it — what to look for, and what to take away.',
  quiz: 'Set what this quiz tests and how it behaves, then write or generate its questions.',
}

/* ── Video page ────────────────────────────────────────────────────────── */

function VideoPage({
  courseId,
  blockId,
  value,
  sourceStatus,
  sourceError,
  onChange,
  onBeforeTranscribe,
  onTranscribed,
}: {
  courseId: string
  blockId: string
  value: VideoContent
  sourceStatus: BlockSourceStatus
  sourceError: string | null
  onChange: (next: VideoContent) => void
  /** Flushes the page so the upload is on the row before it is fetched. */
  onBeforeTranscribe: () => Promise<boolean>
  onTranscribed: (transcript: string) => void
}) {
  const usingPreset = value.guidelines === '' || isGuidelinePreset(value.guidelines)

  const [transcribing, setTranscribing] = React.useState(false)
  const [transcribeError, setTranscribeError] = React.useState<string | null>(null)

  async function transcribe() {
    setTranscribeError(null)
    setTranscribing(true)
    try {
      if (!(await onBeforeTranscribe())) return
      const result = await transcribeBlockVideo(courseId, blockId)
      if (!result.ok) {
        setTranscribeError(result.error)
        return
      }
      onTranscribed(result.data!.transcript)
    } finally {
      setTranscribing(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Field label="Video file" hint="Uploaded, not linked — a link cannot be read for quiz generation.">
        <MaterialUpload
          courseId={courseId}
          blockId={blockId}
          kind="video"
          value={{ path: value.path, fileName: value.fileName }}
          onChange={(next) => onChange({ ...value, ...next })}
        />
      </Field>

      {/* Only ever true for a course built before uploads existed. */}
      {!value.path && value.url && (
        <p className="m-0 rounded-md bg-surface-inset px-4 py-3 text-xs leading-relaxed text-ink-muted">
          This lesson still points at an external video ({value.url}). It plays for learners, but
          questions cannot be generated from it. Upload the file above to replace it.
        </p>
      )}

      <div>
        <span className="mb-1.5 block text-sm font-medium text-[#374151]">Guidelines</span>
        <p className="mb-2 mt-0 text-xs leading-relaxed text-[#9ca3af]">
          What the learner should do with this material. Shown before the player — telling someone
          to take notes after they have watched is too late.
        </p>
        <Select
          value={usingPreset ? value.guidelines : '__other'}
          onChange={(e) =>
            onChange({
              ...value,
              guidelines: e.target.value === '__other' ? ' ' : e.target.value,
            })
          }
        >
          <option value="">No guidance</option>
          {VIDEO_GUIDELINE_PRESETS.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
          <option value="__other">Something else…</option>
        </Select>

        {!usingPreset && (
          <Textarea
            className="mt-2"
            rows={2}
            value={value.guidelines}
            onChange={(e) => onChange({ ...value, guidelines: e.target.value })}
            placeholder="e.g. Watch with the allergen matrix from block 2 open beside you."
          />
        )}
      </div>

      <Field
        label="Additional notes"
        optional
        hint="Shown alongside the video — context, corrections, or anything the recording does not cover."
      >
        <Textarea
          rows={4}
          value={value.notes}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
          placeholder="Anything learners should read while watching…"
        />
      </Field>

      <Field
        label="Transcript"
        optional
        hint="What quizzes after this block are generated from. Transcribe the upload, or paste one you already have — and correct it either way; a transcript is a first draft, not a fact."
      >
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={transcribing}
            disabled={!value.path}
            title={value.path ? undefined : 'Upload a video first'}
            onClick={() => void transcribe()}
          >
            <Sparkles size={13} /> {value.transcript ? 'Transcribe again' : 'Transcribe the video'}
          </Button>
          {/* Said before the click, not after it: this is a hosted model call
              on a whole recording, and a spinner with no expectation attached
              reads as a hang. */}
          <span className="text-xs text-[#9ca3af]">
            {transcribing
              ? 'Transcribing — this runs on the whole recording and can take a few minutes.'
              : sourceStatus === 'ready'
                ? 'Ready — quizzes after this block can be generated from it.'
                : 'Takes a few minutes for a long video. You can paste one instead.'}
          </span>
        </div>

        {transcribeError && (
          <p className="mb-2 flex items-start gap-2 text-xs leading-relaxed text-[var(--danger-fg)]">
            <AlertTriangle size={13} className="mt-0.5 shrink-0" aria-hidden />
            {transcribeError}
          </p>
        )}
        {!transcribeError && sourceError && sourceStatus === 'pending' && (
          <p className="mb-2 text-xs leading-relaxed text-[#92400e]">{sourceError}</p>
        )}

        <Textarea
          rows={6}
          value={value.transcript}
          onChange={(e) => onChange({ ...value, transcript: e.target.value })}
          placeholder="Transcribe the upload above, paste a transcript here, or leave it and come back…"
        />
      </Field>

      <Checkbox
        label="Show captions by default"
        checked={value.captions}
        onChange={(e) => onChange({ ...value, captions: e.target.checked })}
      />
    </div>
  )
}

/* ── Text page ─────────────────────────────────────────────────────────── */

function TextPage({
  courseId,
  blockId,
  value,
  sourceStatus,
  sourceError,
  onChange,
}: {
  courseId: string
  blockId: string
  value: TextContent
  sourceStatus: BlockSourceStatus
  sourceError: string | null
  onChange: (next: TextContent) => void
}) {
  return (
    <div className="grid gap-6">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-[#374151]">Content</span>
        <SegmentedControl
          className="mb-3"
          options={[
            { value: 'rich', label: 'Write it here' },
            { value: 'upload', label: 'Upload a document' },
          ]}
          value={value.mode}
          onChange={(mode) => onChange({ ...value, mode: mode as TextContent['mode'] })}
        />

        {value.mode === 'rich' ? (
          <Textarea
            rows={12}
            value={value.body}
            onChange={(e) => onChange({ ...value, body: e.target.value })}
            placeholder="Write the lesson content…"
          />
        ) : (
          <>
            <MaterialUpload
              courseId={courseId}
              blockId={blockId}
              kind="document"
              value={{ path: value.path, fileName: value.fileName }}
              onChange={(next) => onChange({ ...value, ...next })}
            />
            {/* The extraction verdict from the last save. A PDF that is really
                a scan is worth knowing about here, not at the quiz. */}
            {value.path && sourceStatus === 'failed' && (
              <p className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-[var(--danger-fg)]">
                <AlertTriangle size={13} className="mt-0.5 shrink-0" aria-hidden />
                {sourceError ?? 'That document could not be read.'} Saving again retries it.
              </p>
            )}
            {value.path && sourceStatus === 'ready' && sourceError && (
              <p className="mt-2 text-xs leading-relaxed text-[#92400e]">{sourceError}</p>
            )}
            {value.path && sourceStatus === 'ready' && !sourceError && (
              <p className="mt-2 text-xs text-[var(--itutor-green)]">
                Read successfully — quizzes after this block can be generated from it.
              </p>
            )}
          </>
        )}
      </div>

      <Field
        label="Pointers"
        optional
        hint="Key things to focus on while reading. Shown above the content."
      >
        <Textarea
          rows={3}
          value={value.pointers}
          onChange={(e) => onChange({ ...value, pointers: e.target.value })}
          placeholder="e.g. Pay attention to the four temperature bands and what each one means."
        />
      </Field>

      <Field
        label="Summary and important notes"
        optional
        hint="The takeaway. Shown after the content."
      >
        <Textarea
          rows={3}
          value={value.summary}
          onChange={(e) => onChange({ ...value, summary: e.target.value })}
          placeholder="e.g. If in doubt, throw it out — and log it."
        />
      </Field>
    </div>
  )
}

/* ── Quiz page ─────────────────────────────────────────────────────────── */

/**
 * Which earlier blocks a quiz's scope actually resolves to. This mirrors
 * `gatherSourceText` in quiz-actions.ts so the page can say up front what it
 * will read — including that a video is still waiting on a transcript, which
 * is the one case worth knowing BEFORE pressing Generate.
 */
function blocksInScope(scope: QuizScope, scopeBlockIds: string[], priors: PriorBlock[]) {
  if (scope === 'none') return []
  if (scope === 'preceding_block') return priors.slice(-1)
  if (scope === 'specific_blocks') return priors.filter((b) => scopeBlockIds.includes(b.id))
  if (scope === 'since_last_quiz') {
    const lastQuiz = priors.map((b) => b.type).lastIndexOf('quiz')
    return lastQuiz === -1 ? priors : priors.slice(lastQuiz + 1)
  }
  return priors
}

function QuizPage({
  courseId,
  blockId,
  quiz,
  priorBlocks,
  questions,
  onChange,
  onBeforeGenerate,
}: {
  courseId: string
  blockId: string
  quiz: QuizState
  priorBlocks: PriorBlock[]
  questions: EditableQuestion[]
  onChange: (next: QuizState) => void
  /** Flushes this page before generating. False means the save failed. */
  onBeforeGenerate: () => Promise<boolean>
}) {
  const scopeGroup = React.useId()

  function patchQuiz(patch: Partial<QuizState>) {
    onChange({ ...quiz, ...patch })
  }

  const inScope = blocksInScope(quiz.scope, quiz.scopeBlockIds, priorBlocks).filter(
    (b) => b.type !== 'quiz'
  )
  const ready = inScope.filter((b) => b.sourceStatus === 'ready')
  const waiting = inScope.filter((b) => b.sourceStatus === 'pending')
  const unreadable = inScope.filter(
    (b) => b.sourceStatus === 'failed' || b.sourceStatus === 'empty'
  )

  return (
    <div className="grid gap-6">
      <div>
        <span className="mb-2 block text-sm font-medium text-[#374151]">
          What should this quiz test?
        </span>
        <div className="grid gap-1.5">
          {QUIZ_SCOPE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
            >
              <input
                type="radio"
                name={scopeGroup}
                checked={quiz.scope === option.value}
                onChange={() => patchQuiz({ scope: option.value, scopeBlockIds: [] })}
                className="h-4 w-4 accent-[var(--itutor-green)]"
              />
              {option.label}
            </label>
          ))}
        </div>

        {quiz.scope === 'specific_blocks' && (
          <div className="mt-3 rounded-md bg-surface-inset p-3">
            {priorBlocks.length === 0 ? (
              <p className="m-0 text-xs text-[#9ca3af]">
                No earlier blocks yet — add content above this quiz first.
              </p>
            ) : (
              <div className="grid gap-1.5">
                {priorBlocks.map((prior) => (
                  <Checkbox
                    key={prior.id}
                    label={prior.label}
                    checked={quiz.scopeBlockIds.includes(prior.id)}
                    onChange={(e) =>
                      patchQuiz({
                        scopeBlockIds: e.target.checked
                          ? [...quiz.scopeBlockIds, prior.id]
                          : quiz.scopeBlockIds.filter((id) => id !== prior.id),
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* The dependency the plan calls out: a quiz sitting right after a
          just-uploaded video cannot be generated until there is a transcript.
          Said here, plainly, rather than as a spinner that blocks the wizard. */}
      {waiting.length > 0 && (
        <p className="m-0 flex items-start gap-2 rounded-md bg-[#fffbeb] px-4 py-3 text-xs leading-relaxed text-[#92400e]">
          <Clock size={14} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            {waiting.map((b) => `“${b.label}”`).join(', ')}{' '}
            {waiting.length === 1 ? 'is' : 'are'} waiting on a transcript. Carry on building — you
            can come back and generate this quiz once a transcript is in, either from that block&rsquo;s
            page or from the Sequence tab later.
          </span>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Passing score" htmlFor="passing-score">
          <Select
            id="passing-score"
            value={quiz.passingScore}
            onChange={(e) => patchQuiz({ passingScore: Number(e.target.value) })}
          >
            {PASSING_SCORE_OPTIONS.map((score) => (
              <option key={score} value={score}>
                {score}%
              </option>
            ))}
          </Select>
        </Field>

        <div className="flex items-end pb-2.5">
          <Checkbox
            label="Reveal answers after submitting"
            checked={quiz.revealAnswers}
            onChange={(e) => patchQuiz({ revealAnswers: e.target.checked })}
          />
        </div>
      </div>

      <QuestionEditor
        courseId={courseId}
        blockId={blockId}
        questions={questions}
        generationCount={quiz.generationCount}
        onGenerationCountChange={(generationCount) => patchQuiz({ generationCount })}
        onBeforeGenerate={onBeforeGenerate}
        canGenerate={ready.length > 0}
        sourceSummary={
          <div className="text-xs leading-relaxed text-ink-muted">
            {ready.length > 0 ? (
              <p className="m-0">
                Reading from {ready.length} {ready.length === 1 ? 'block' : 'blocks'}:{' '}
                {ready.map((b) => b.label).join(', ')}.
              </p>
            ) : (
              <p className="m-0">
                Nothing in this quiz&rsquo;s scope can be read yet. Add material to the blocks above
                it, or widen the scope.
              </p>
            )}
            {waiting.length > 0 && (
              <p className="m-0 mt-1 text-[#92400e]">
                Skipping {waiting.length} waiting on a transcript.
              </p>
            )}
            {unreadable.length > 0 && (
              <p className="m-0 mt-1 text-[#9ca3af]">
                Skipping {unreadable.length} with no readable material.
              </p>
            )}
          </div>
        }
      />

      <p className="m-0 text-center text-xs text-[#9ca3af]">
        Navigation and retries are set once for the whole course, on the Details step.
      </p>
    </div>
  )
}
