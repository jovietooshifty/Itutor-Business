'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRightLeft,
  CircleAlert,
  CircleCheck,
  Clock,
  ListChecks,
  Lock,
  RotateCcw,
  Target,
} from 'lucide-react'
import { Button, Card, cn } from '@/components/ui'
import { submitQuiz, type QuizOutcome } from '@/app/(learner)/actions'

export type QuizQuestion = {
  id: string
  questionText: string
  options: string[]
}

/**
 * The quiz block. Questions arrive without their answers —
 * quiz_questions_for_learner() strips correct_option — so nothing here can
 * mark itself; submitQuiz grades server-side and hands back the outcome.
 */
export function QuizPlayer({
  courseId,
  blockId,
  questions,
  passingScore,
  allowBack,
  attemptsUsed,
  attemptsAllowed,
  alreadyPassed,
  retryCooldownHours = null,
  retryReadyAt = null,
}: {
  courseId: string
  blockId: string
  questions: QuizQuestion[]
  passingScore: number
  /** Course/quiz navigation: false locks each answer once submitted. */
  allowBack: boolean
  attemptsUsed: number
  attemptsAllowed: number
  alreadyPassed: boolean
  /** Wait imposed between attempts, when the quiz sets one. */
  retryCooldownHours?: number | null
  /** ISO time the cooldown expires; null when they can start now. */
  retryReadyAt?: string | null
}) {
  const router = useRouter()
  /**
   * The rules come first, on their own screen. Attempt count, pass mark and
   * navigation mode were a line of small grey text inside the first question
   * card — which is to say you learned the quiz was one-shot and forward-only
   * at the moment that had already stopped being useful.
   */
  const [started, setStarted] = React.useState(false)
  const [index, setIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, number>>({})
  const [outcome, setOutcome] = React.useState<QuizOutcome | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()
  /** When this sitting began, so the admin's record can show time taken. */
  const startedAt = React.useRef<string | null>(null)

  const question = questions[index]
  const isLast = index === questions.length - 1
  const answeredAll = questions.every((q) => answers[q.id] !== undefined)
  const attemptsLeft = Math.max(0, attemptsAllowed - attemptsUsed)

  function begin() {
    startedAt.current = new Date().toISOString()
    setStarted(true)
  }

  function retry() {
    setOutcome(null)
    setAnswers({})
    setIndex(0)
    // A retry is a new sitting, so it is timed as one.
    startedAt.current = new Date().toISOString()
  }

  /**
   * Always changeable while the question is on screen.
   *
   * Forward-only navigation means you cannot RETURN to a question, not that
   * your answer freezes the instant you touch an option. This used to reject
   * the second click, so a misclick on a single-attempt quiz cost a mark with
   * no recourse — and it contradicted the rules panel, which promises only
   * that you cannot go back. Moving on is what makes an answer final, and the
   * Back button is what enforces that.
   */
  function choose(optionIndex: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
  }

  function submit() {
    setError(null)
    startTransition(async () => {
      const result = await submitQuiz(courseId, blockId, answers, startedAt.current)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setOutcome(result.data!)
      router.refresh()
    })
  }

  if (alreadyPassed && !outcome) {
    return (
      <Card className="p-7 text-center">
        <CircleCheck size={34} className="mx-auto text-[var(--itutor-green)]" aria-hidden />
        <h2 className="m-0 mt-3 font-display text-xl font-bold text-ink">Quiz passed</h2>
        <p className="m-0 mt-1.5 text-sm text-ink-muted">
          You&apos;ve already cleared this one.
        </p>
      </Card>
    )
  }

  /* ── Result states ───────────────────────────────────────────────────── */

  if (outcome) {
    const reviewById = new Map(outcome.review.map((r) => [r.questionId, r]))

    return (
      <Card className="p-7 md:p-8">
        <div className="text-center">
          {outcome.passed ? (
            <CircleCheck size={38} className="mx-auto text-[var(--itutor-green)]" aria-hidden />
          ) : (
            <CircleAlert
              size={38}
              className={cn('mx-auto', outcome.exhausted ? 'text-danger-fg' : 'text-coral')}
              aria-hidden
            />
          )}
          <h2 className="m-0 mt-3 font-display text-2xl font-bold text-ink">
            {outcome.score}%
          </h2>
          <p className="m-0 mt-1 text-sm font-semibold text-ink">
            {outcome.passed ? 'Passed' : 'Not passed'}
            <span className="font-normal text-ink-muted"> · {passingScore}% needed</span>
          </p>
        </div>

        {/* The terminal state: failed with nothing left. Retrying a quiz you
            failed without covering the material again proves nothing, which is
            why attempts are capped at all. */}
        {outcome.exhausted && (
          <div className="mt-5 rounded-md bg-danger-bg px-4 py-3.5 text-sm text-danger-fg">
            <p className="m-0 font-semibold">You&apos;ve used all {outcome.attemptsAllowed} attempts.</p>
            <p className="m-0 mt-1">
              Contact your training administrator to have this quiz reset for you.
            </p>
          </div>
        )}

        {!outcome.passed && !outcome.exhausted && (
          <p className="mt-5 text-center text-sm text-ink-muted">
            Attempt {outcome.attemptsUsed} of {outcome.attemptsAllowed}. Review the material and
            try again.
          </p>
        )}

        {outcome.review.length > 0 && (
          <div className="mt-6 border-t border-border pt-5">
            <h3 className="m-0 mb-3 font-display text-base font-bold text-ink">Review</h3>
            <ol className="m-0 grid list-none gap-3 p-0">
              {questions.map((q, i) => {
                const review = reviewById.get(q.id)
                const chosen = answers[q.id]
                const right = review && chosen === review.correctOption
                return (
                  <li key={q.id} className="rounded-lg border border-surface-border p-3.5">
                    <p className="m-0 text-sm font-semibold text-ink">
                      {i + 1}. {q.questionText}
                    </p>
                    <p
                      className={cn(
                        'm-0 mt-1.5 text-xs font-semibold',
                        right ? 'text-[var(--itutor-green)]' : 'text-danger-fg'
                      )}
                    >
                      {right
                        ? 'Correct'
                        : `Your answer: ${q.options[chosen] ?? '—'} · Correct: ${
                            review ? q.options[review.correctOption] : '—'
                          }`}
                    </p>
                    {review?.explanation && (
                      <p className="m-0 mt-1.5 text-xs leading-relaxed text-ink-muted">
                        {review.explanation}
                      </p>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {outcome.passed ? (
            <Link href={`/learn/${courseId}`} className="no-underline">
              <Button accent="coral" size="lg">
                Back to course
              </Button>
            </Link>
          ) : outcome.exhausted ? (
            <Link href={`/learn/${courseId}`} className="no-underline">
              <Button variant="secondary" size="lg">
                Back to course
              </Button>
            </Link>
          ) : (
            <Button accent="coral" size="lg" onClick={retry}>
              <RotateCcw size={15} /> Try again
            </Button>
          )}
        </div>
      </Card>
    )
  }

  /* ── Question flow ───────────────────────────────────────────────────── */

  if (!question) {
    return (
      <Card className="p-7 text-center">
        <p className="m-0 text-sm text-ink-muted">
          This quiz has no questions yet — check back once your trainer has added them.
        </p>
      </Card>
    )
  }

  /* ── Rules, before the first question ────────────────────────────────── */

  if (!started) {
    const rules: { icon: typeof Target; text: React.ReactNode; loud?: boolean }[] = [
      {
        icon: ListChecks,
        text: `${questions.length} question${questions.length === 1 ? '' : 's'}`,
      },
      { icon: Target, text: `Pass mark ${passingScore}%` },
      {
        icon: RotateCcw,
        // One attempt is where a surprise does the most damage, so it is the
        // one that gets said plainly rather than as "1 of 1".
        text:
          attemptsAllowed === 1 ? (
            <>
              <strong>One attempt only</strong> — there is no retry on this quiz.
            </>
          ) : (
            <>
              {attemptsAllowed} attempts allowed — you have{' '}
              <strong>
                {attemptsLeft} left
              </strong>
            </>
          ),
        loud: attemptsAllowed === 1 || attemptsLeft === 1,
      },
      {
        icon: allowBack ? ArrowRightLeft : Lock,
        text: allowBack
          ? 'You can go back and change your answers before submitting'
          : 'You cannot return to a question once you move on — but you can change your answer before you do',
        loud: !allowBack,
      },
    ]

    if (retryCooldownHours) {
      rules.push({
        icon: Clock,
        text: `If you do not pass, you must wait ${retryCooldownHours} hour${
          retryCooldownHours === 1 ? '' : 's'
        } before trying again`,
      })
    }

    const waiting = Boolean(retryReadyAt)

    return (
      <Card className="p-7 md:p-8">
        <h2 className="m-0 font-display text-xl font-bold text-ink">Before you start</h2>
        <p className="m-0 mt-1 text-sm text-ink-muted">How this quiz works.</p>

        <ul className="m-0 mt-5 grid list-none gap-2.5 p-0">
          {rules.map((rule, i) => (
            <li
              key={i}
              className={cn(
                'flex items-start gap-3 rounded-lg px-3.5 py-2.5 text-sm',
                rule.loud ? 'bg-coral-soft text-ink' : 'bg-surface-inset text-ink'
              )}
            >
              <rule.icon
                size={16}
                aria-hidden
                className={cn('mt-0.5 shrink-0', rule.loud ? 'text-coral' : 'text-[#9ca3af]')}
              />
              <span>{rule.text}</span>
            </li>
          ))}
        </ul>

        {waiting ? (
          <p className="m-0 mt-5 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">
            You have used an attempt recently. You can try again after{' '}
            {new Date(retryReadyAt!).toLocaleString()}.
          </p>
        ) : attemptsLeft === 0 ? (
          <p className="m-0 mt-5 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">
            You have used all {attemptsAllowed} attempts. Contact your training administrator to
            have this quiz reset for you.
          </p>
        ) : (
          <div className="mt-6">
            <Button accent="coral" size="lg" onClick={begin}>
              Start quiz
            </Button>
          </div>
        )}
      </Card>
    )
  }

  return (
    <Card className="p-7 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
          Question {index + 1} of {questions.length}
        </span>
        <span className="text-xs text-[#9ca3af]">
          Attempt {attemptsUsed + 1} of {attemptsAllowed}
        </span>
      </div>

      <h2 className="m-0 mt-3 font-display text-lg font-bold leading-snug text-ink">
        {question.questionText}
      </h2>

      <div className="mt-5 grid gap-2.5">
        {question.options.map((option, optionIndex) => {
          const selected = answers[question.id] === optionIndex
          return (
            <button
              key={optionIndex}
              type="button"
              onClick={() => choose(optionIndex)}
              aria-pressed={selected}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors duration-fast',
                selected
                  ? 'border-coral bg-coral-soft font-semibold text-ink'
                  : 'border-surface-border bg-white text-ink hover:border-coral'
              )}
            >
              <span
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold',
                  selected ? 'border-coral bg-coral text-white' : 'border-surface-border text-ink-muted'
                )}
              >
                {String.fromCharCode(65 + optionIndex)}
              </span>
              {option}
            </button>
          )
        })}
      </div>

      {/* Shown before the choice is made, not after it. Warning someone that
          they cannot come back is only useful while coming back is still
          something they might have wanted. */}
      {!allowBack && (
        <p className="m-0 mt-3 text-xs text-[#9ca3af]">
          This quiz is forward-only — change your answer now if you need to, because{' '}
          {isLast ? 'submitting' : 'moving to the next question'} is final.
        </p>
      )}

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-4 py-3 text-sm text-danger-fg">{error}</p>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          disabled={!allowBack || index === 0 || pending}
          onClick={() => setIndex((i) => i - 1)}
        >
          Back
        </Button>

        {isLast ? (
          <Button
            accent="coral"
            size="lg"
            loading={pending}
            disabled={!answeredAll}
            onClick={submit}
          >
            Submit quiz
          </Button>
        ) : (
          <Button
            accent="coral"
            disabled={answers[question.id] === undefined}
            onClick={() => setIndex((i) => i + 1)}
          >
            Next
          </Button>
        )}
      </div>
    </Card>
  )
}
