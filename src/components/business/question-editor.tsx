'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, RefreshCw, Sparkles, Trash2, Upload } from 'lucide-react'
import { Button, Field, SegmentedControl, Input, Select, Textarea, cn } from '@/components/ui'
import { GENERATION_COUNT_CHOICES } from '@/lib/course'
import {
  addQuestion,
  deleteQuestion,
  generateQuestions,
  importQuestionsCsv,
  regenerateOneQuestion,
  updateQuestion,
  type QuestionInput,
} from '@/app/(business)/courses/quiz-actions'

export type EditableQuestion = {
  id: string
  questionText: string
  options: string[]
  correctOption: number
  explanation: string | null
}

const OPTION_COUNT = 4
const emptyDraft = (): QuestionInput => ({
  questionText: '',
  options: Array(OPTION_COUNT).fill(''),
  correctOption: 0,
  explanation: null,
})

type Mode = 'idle' | 'generate' | 'manual' | 'csv'

/**
 * Questions for one quiz block: AI generation, manual entry and CSV import,
 * all landing in the same editable list — the three paths the handoff asks
 * for, converging rather than branching.
 */
export function QuestionEditor({
  courseId,
  blockId,
  questions,
  generationCount,
  onGenerationCountChange,
  onBeforeGenerate,
  sourceSummary,
  canGenerate = true,
}: {
  courseId: string
  blockId: string
  questions: EditableQuestion[]
  /** `null` is "no specific number" — see quizzes.generation_count. */
  generationCount: number | null
  onGenerationCountChange: (next: number | null) => void
  /**
   * Flushes the page holding this editor before generating. Generation reads
   * the quiz's scope from the database, so an unsaved scope change would
   * otherwise produce questions about the wrong material.
   */
  onBeforeGenerate?: () => Promise<boolean>
  /** What this quiz will read from, worked out by the page above. */
  sourceSummary?: React.ReactNode
  /** False when nothing in scope has readable material yet. */
  canGenerate?: boolean
}) {
  const router = useRouter()
  const [mode, setMode] = React.useState<Mode>('idle')
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [notice, setNotice] = React.useState<string | null>(null)

  /* The count field keeps its value while "no specific number" is selected, so
     switching back does not lose what was set. That is why the last chosen
     number lives here rather than being derived from `generationCount`. */
  const [lastCount, setLastCount] = React.useState(generationCount ?? 5)
  const [csv, setCsv] = React.useState('')
  const [draft, setDraft] = React.useState<QuestionInput>(emptyDraft)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [edit, setEdit] = React.useState<QuestionInput>(emptyDraft)

  function run(
    action: () => Promise<{ ok: boolean; error?: string; data?: unknown }>,
    onDone?: () => void
  ) {
    setError(null)
    setNotice(null)
    startTransition(async () => {
      const result = await action()
      if (!result.ok) {
        setError(result.error ?? 'Something went wrong.')
        return
      }
      onDone?.()
      router.refresh()
    })
  }

  function generate() {
    setError(null)
    setNotice(null)
    startTransition(async () => {
      if (onBeforeGenerate && !(await onBeforeGenerate())) return

      const result = await generateQuestions(
        courseId,
        blockId,
        generationCount === null ? 'auto' : generationCount
      )
      if (!result.ok) {
        setError(result.error)
        return
      }
      const { added, blocksUsed, warnings } = result.data!
      /* Saying which blocks were read matters most in "no specific number"
         mode: without it, seven questions is a number with no explanation, and
         there is no way to tell the model's judgement from a failure to find
         more material. */
      setNotice(
        `Generated ${added} question${added === 1 ? '' : 's'} from ${blocksUsed} ` +
          `${blocksUsed === 1 ? 'block' : 'blocks'}.` +
          (warnings.length ? ` ${warnings.join(' ')}` : '')
      )
      setMode('idle')
      router.refresh()
    })
  }

  function startEditing(question: EditableQuestion) {
    setEditingId(question.id)
    setEdit({
      questionText: question.questionText,
      options: [...question.options],
      correctOption: question.correctOption,
      explanation: question.explanation,
    })
  }

  return (
    <div className="rounded-lg border border-surface-border bg-surface-inset p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink">
          Questions{questions.length > 0 && ` (${questions.length})`}
        </span>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={mode === 'generate' ? 'primary' : 'secondary'}
            onClick={() => setMode(mode === 'generate' ? 'idle' : 'generate')}
          >
            <Sparkles size={13} /> Generate
          </Button>
          <Button
            size="sm"
            variant={mode === 'manual' ? 'primary' : 'secondary'}
            onClick={() => setMode(mode === 'manual' ? 'idle' : 'manual')}
          >
            <Plus size={13} /> Add
          </Button>
          <Button
            size="sm"
            variant={mode === 'csv' ? 'primary' : 'secondary'}
            onClick={() => setMode(mode === 'csv' ? 'idle' : 'csv')}
          >
            <Upload size={13} /> CSV
          </Button>
        </div>
      </div>

      {mode === 'generate' && (
        <div className="mt-4 rounded-md border border-surface-border bg-white p-4">
          {sourceSummary ?? (
            <p className="m-0 mb-3 text-xs leading-relaxed text-ink-muted">
              Questions are written from the material this quiz covers, following its scope
              setting above.
            </p>
          )}

          <div className="mt-3">
            <span className="mb-1.5 block text-sm font-medium text-[#374151]">
              How many questions
            </span>
            <SegmentedControl
              options={[
                { value: 'auto', label: 'No specific number' },
                { value: 'fixed', label: 'Specific number' },
              ]}
              value={generationCount === null ? 'auto' : 'fixed'}
              onChange={(next) =>
                onGenerationCountChange(next === 'auto' ? null : lastCount)
              }
            />
            <p className="m-0 mb-3 mt-1.5 text-xs text-[#9ca3af]">
              {generationCount === null
                ? 'Coverage decides: one question per distinct point in the material, up to 20.'
                : 'Exactly this many, whatever the material covers.'}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            {/* Disabled rather than hidden, so the relationship between the two
                controls stays visible — the same pattern the Details step uses
                for retries under forward-only navigation. */}
            <Field label="Number of questions" htmlFor="generate-count">
              <Select
                id="generate-count"
                value={generationCount ?? lastCount}
                disabled={generationCount === null}
                onChange={(e) => {
                  const next = Number(e.target.value)
                  setLastCount(next)
                  onGenerationCountChange(next)
                }}
                className="w-[110px]"
              >
                {GENERATION_COUNT_CHOICES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
            </Field>
            <Button
              loading={pending}
              disabled={!canGenerate}
              title={canGenerate ? undefined : 'Nothing in this quiz’s scope is readable yet'}
              onClick={generate}
            >
              Generate questions
            </Button>
          </div>
        </div>
      )}

      {mode === 'manual' && (
        <div className="mt-4 rounded-md border border-surface-border bg-white p-4">
          <QuestionFields value={draft} onChange={setDraft} idPrefix="new" />
          <div className="mt-3 flex gap-2">
            <Button
              loading={pending}
              onClick={() =>
                run(
                  () => addQuestion(courseId, blockId, draft),
                  () => {
                    setDraft(emptyDraft())
                    setMode('idle')
                  }
                )
              }
            >
              Add question
            </Button>
            <Button variant="ghost" onClick={() => setMode('idle')}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {mode === 'csv' && (
        <div className="mt-4 rounded-md border border-surface-border bg-white p-4">
          <p className="m-0 mb-2 text-xs leading-relaxed text-ink-muted">
            One question per line:{' '}
            <span className="font-mono">question, option 1, option 2, option 3, option 4, correct, explanation</span>
            . &ldquo;Correct&rdquo; may be 1&ndash;4 or A&ndash;D. A header row is optional.
          </p>
          <input
            type="file"
            accept=".csv,text/csv"
            className="mb-3 block w-full text-xs text-ink-muted file:mr-3 file:rounded-md file:border file:border-surface-border file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) setCsv(await file.text())
            }}
          />
          <Textarea
            rows={5}
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder="Or paste rows here…"
          />
          <div className="mt-3 flex gap-2">
            <Button
              loading={pending}
              disabled={!csv.trim()}
              onClick={() =>
                run(
                  () => importQuestionsCsv(courseId, blockId, csv),
                  () => {
                    setCsv('')
                    setMode('idle')
                  }
                )
              }
            >
              Import
            </Button>
            <Button variant="ghost" onClick={() => setMode('idle')}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-md bg-danger-bg px-3 py-2 text-xs text-danger-fg">{error}</p>
      )}
      {notice && (
        <p className="mt-3 rounded-md bg-brand-light px-3 py-2 text-xs text-[var(--itutor-green)]">
          {notice}
        </p>
      )}

      {questions.length === 0 ? (
        <p className="m-0 mt-4 text-xs text-[#9ca3af]">
          No questions yet — generate them from the material, add one by hand, or import a CSV.
        </p>
      ) : (
        <ol className="m-0 mt-4 grid list-none gap-2.5 p-0">
          {questions.map((question, index) => (
            <li key={question.id} className="rounded-md border border-surface-border bg-white p-3.5">
              {editingId === question.id ? (
                <>
                  <QuestionFields value={edit} onChange={setEdit} idPrefix={question.id} />
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      loading={pending}
                      onClick={() =>
                        run(
                          () => updateQuestion(courseId, question.id, edit),
                          () => setEditingId(null)
                        )
                      }
                    >
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <p className="m-0 text-sm font-semibold text-ink">
                      {index + 1}. {question.questionText}
                    </p>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => startEditing(question)}
                        className="text-xs font-semibold text-ink-muted hover:text-ink"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        title="Replace with a fresh question on the same material"
                        aria-label="Regenerate this question"
                        onClick={() =>
                          run(() => regenerateOneQuestion(courseId, blockId, question.id))
                        }
                        className="text-ink-muted hover:text-ink disabled:opacity-40"
                      >
                        <RefreshCw size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={pending}
                        aria-label="Delete this question"
                        onClick={() => run(() => deleteQuestion(courseId, question.id))}
                        className="text-[#9ca3af] hover:text-[var(--danger-fg)] disabled:opacity-40"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <ul className="m-0 mt-2 grid list-none gap-1 p-0">
                    {question.options.map((option, optionIndex) => (
                      <li
                        key={optionIndex}
                        className={cn(
                          'text-xs',
                          optionIndex === question.correctOption
                            ? 'font-semibold text-[var(--itutor-green)]'
                            : 'text-ink-muted'
                        )}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                        {optionIndex === question.correctOption && ' ✓'}
                      </li>
                    ))}
                  </ul>
                  {question.explanation && (
                    <p className="m-0 mt-2 text-xs italic text-[#9ca3af]">{question.explanation}</p>
                  )}
                </>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

/* ── Shared field set for adding and editing ───────────────────────────── */

function QuestionFields({
  value,
  onChange,
  idPrefix,
}: {
  value: QuestionInput
  onChange: (next: QuestionInput) => void
  idPrefix: string
}) {
  return (
    <div className="grid gap-3">
      <Field label="Question" htmlFor={`${idPrefix}-text`}>
        <Textarea
          id={`${idPrefix}-text`}
          rows={2}
          value={value.questionText}
          onChange={(e) => onChange({ ...value, questionText: e.target.value })}
          placeholder="What should learners be able to answer?"
        />
      </Field>

      <div className="grid gap-2">
        <span className="text-sm font-medium text-[#374151]">
          Options — select the correct one
        </span>
        {value.options.map((option, index) => (
          <label key={index} className="flex items-center gap-2.5">
            <input
              type="radio"
              name={`${idPrefix}-correct`}
              checked={value.correctOption === index}
              onChange={() => onChange({ ...value, correctOption: index })}
              aria-label={`Option ${String.fromCharCode(65 + index)} is correct`}
              className="h-4 w-4 shrink-0 accent-[var(--itutor-green)]"
            />
            <Input
              value={option}
              onChange={(e) => {
                const options = [...value.options]
                options[index] = e.target.value
                onChange({ ...value, options })
              }}
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
            />
          </label>
        ))}
      </div>

      <Field label="Explanation" hint="Shown after submitting, when the quiz reveals answers.">
        <Textarea
          rows={2}
          value={value.explanation ?? ''}
          onChange={(e) => onChange({ ...value, explanation: e.target.value || null })}
          placeholder="Why is that the right answer?"
        />
      </Field>
    </div>
  )
}
