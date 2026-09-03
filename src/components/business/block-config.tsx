'use client'

import * as React from 'react'
import { Globe } from 'lucide-react'
import { Checkbox, Field, Input, SegmentedControl, Select, Textarea } from '@/components/ui'
import {
  NAVIGATION_LABELS,
  PASSING_SCORE_OPTIONS,
  QUIZ_SCOPE_OPTIONS,
  RETRY_COOLDOWN_OPTIONS,
  effectiveNavigation,
  retriesAllowed,
  type QuizNavigation,
  type QuizNavigationOverride,
  type QuizScope,
  type TextContent,
  type VideoContent,
  type WebsiteContent,
} from '@/lib/course'

export type QuizState = {
  passingScore: number
  scope: QuizScope
  scopeBlockIds: string[]
  revealAnswers: boolean
  retryMax: number | null
  retryCooldownHours: number | null
}

/** Reads a jsonb payload defensively — rows may predate the current shape. */
function asVideo(content: unknown): VideoContent {
  const c = (content ?? {}) as Partial<VideoContent>
  return {
    method: c.method === 'link' ? 'link' : 'upload',
    url: c.url ?? null,
    fileName: c.fileName ?? null,
    captions: c.captions ?? true,
  }
}

function asText(content: unknown): TextContent {
  const c = (content ?? {}) as Partial<TextContent>
  return {
    mode: c.mode === 'upload' || c.mode === 'url' ? c.mode : 'rich',
    body: c.body ?? '',
    url: c.url ?? null,
    fileName: c.fileName ?? null,
  }
}

function asWebsite(content: unknown): WebsiteContent {
  const c = (content ?? {}) as Partial<WebsiteContent>
  return { url: c.url ?? null }
}

/* ── Video ─────────────────────────────────────────────────────────────── */

export function VideoConfig({
  content,
  onChange,
}: {
  content: unknown
  onChange: (next: VideoContent) => void
}) {
  const value = asVideo(content)

  return (
    <div className="grid gap-4">
      <SegmentedControl
        options={[
          { value: 'upload', label: 'Upload file' },
          { value: 'link', label: 'Paste a link' },
        ]}
        value={value.method}
        onChange={(method) =>
          onChange({ ...value, method: method as VideoContent['method'] })
        }
      />

      {value.method === 'upload' ? (
        /*
         * Video upload is intentionally not wired here. The storage migration
         * provisions image buckets only ('business-assets', 'avatars'), and
         * video needs its own bucket, size limit and the speech-to-text pass
         * that feeds quiz generation — all of which is flow 5. Pasting a link
         * is the path that works end to end today.
         */
        <p className="m-0 rounded-md border border-dashed border-surface-border px-4 py-6 text-center text-xs text-[#9ca3af]">
          Video file upload arrives with the transcription pipeline (build step 5). Paste a link
          for now.
        </p>
      ) : (
        <Field label="Video URL" htmlFor="video-url">
          <Input
            id="video-url"
            value={value.url ?? ''}
            onChange={(e) => onChange({ ...value, url: e.target.value || null })}
            placeholder="https://youtube.com/…"
          />
        </Field>
      )}

      <Checkbox
        label="Show captions by default"
        checked={value.captions}
        onChange={(e) => onChange({ ...value, captions: e.target.checked })}
      />
    </div>
  )
}

/* ── Text ──────────────────────────────────────────────────────────────── */

export function TextConfig({
  content,
  onChange,
}: {
  content: unknown
  onChange: (next: TextContent) => void
}) {
  const value = asText(content)

  return (
    <div className="grid gap-4">
      <SegmentedControl
        options={[
          { value: 'rich', label: 'Rich text' },
          { value: 'upload', label: 'Upload file' },
          { value: 'url', label: 'Paste URL' },
        ]}
        value={value.mode}
        onChange={(mode) => onChange({ ...value, mode: mode as TextContent['mode'] })}
      />

      {value.mode === 'rich' && (
        <Textarea
          rows={5}
          value={value.body}
          onChange={(e) => onChange({ ...value, body: e.target.value })}
          placeholder="Write the lesson content…"
        />
      )}

      {value.mode === 'upload' && (
        <p className="m-0 rounded-md border border-dashed border-surface-border px-4 py-6 text-center text-xs text-[#9ca3af]">
          Document upload arrives with the text-extraction pipeline (build step 5). Use rich text
          or a URL for now.
        </p>
      )}

      {value.mode === 'url' && (
        <Field label="Document URL" htmlFor="text-url">
          <Input
            id="text-url"
            value={value.url ?? ''}
            onChange={(e) => onChange({ ...value, url: e.target.value || null })}
            placeholder="https://example.com/article"
          />
        </Field>
      )}
    </div>
  )
}

/* ── Website ───────────────────────────────────────────────────────────── */

export function WebsiteConfig({
  content,
  onChange,
}: {
  content: unknown
  onChange: (next: WebsiteContent) => void
}) {
  const value = asWebsite(content)

  let domain: string | null = null
  if (value.url) {
    try {
      domain = new URL(value.url).hostname
    } catch {
      domain = null
    }
  }

  return (
    <div className="grid gap-4">
      <Field label="Page URL" htmlFor="website-url">
        <Input
          id="website-url"
          value={value.url ?? ''}
          onChange={(e) => onChange({ url: e.target.value || null })}
          placeholder="https://example.com/article"
        />
      </Field>

      {domain && (
        <div className="flex items-center gap-3 rounded-md bg-surface-inset px-4 py-3">
          <Globe size={18} className="shrink-0 text-[#9ca3af]" aria-hidden />
          <div>
            <p className="m-0 text-sm font-semibold text-ink">{domain}</p>
            <p className="m-0 text-xs text-[#9ca3af]">
              Preview will render once the course is published.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Quiz ──────────────────────────────────────────────────────────────── */

export function QuizConfig({
  quiz,
  navigationOverride,
  courseNavigationDefault,
  priorBlocks,
  onChange,
}: {
  quiz: QuizState
  navigationOverride: QuizNavigationOverride
  courseNavigationDefault: QuizNavigation
  priorBlocks: { id: string; label: string }[]
  onChange: (next: { quiz: QuizState; navigationOverride: QuizNavigationOverride }) => void
}) {
  const navigation = effectiveNavigation(courseNavigationDefault, navigationOverride)
  const canRetry = retriesAllowed(navigation)
  const scopeGroup = React.useId()

  /**
   * Any navigation change routes through here so retries can be dropped in the
   * same update. Both the API layer and three database triggers reject retries
   * under forward-only navigation, so leaving them set would only surface as a
   * failed save.
   */
  function setNavigationOverride(next: QuizNavigationOverride) {
    const nextNavigation = effectiveNavigation(courseNavigationDefault, next)
    onChange({
      navigationOverride: next,
      quiz: retriesAllowed(nextNavigation)
        ? quiz
        : { ...quiz, retryMax: null, retryCooldownHours: null },
    })
  }

  function patchQuiz(patch: Partial<QuizState>) {
    onChange({ navigationOverride, quiz: { ...quiz, ...patch } })
  }

  return (
    <div className="grid gap-5">
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
                {priorBlocks.map((block) => (
                  <Checkbox
                    key={block.id}
                    label={block.label}
                    checked={quiz.scopeBlockIds.includes(block.id)}
                    onChange={(e) =>
                      patchQuiz({
                        scopeBlockIds: e.target.checked
                          ? [...quiz.scopeBlockIds, block.id]
                          : quiz.scopeBlockIds.filter((id) => id !== block.id),
                      })
                    }
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

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

      <div>
        <span className="mb-1.5 block text-sm font-medium text-[#374151]">Navigation</span>
        {navigationOverride === 'inherit' ? (
          <p className="m-0 text-xs text-ink-muted">
            Use course default ({NAVIGATION_LABELS[courseNavigationDefault]}) —{' '}
            <button
              type="button"
              onClick={() => setNavigationOverride(courseNavigationDefault)}
              className="font-semibold text-[var(--itutor-green)] underline"
            >
              Override for this quiz
            </button>
          </p>
        ) : (
          <div>
            <SegmentedControl
              options={[
                { value: 'allow_back', label: NAVIGATION_LABELS.allow_back },
                { value: 'lock_forward', label: NAVIGATION_LABELS.lock_forward },
              ]}
              value={navigationOverride}
              onChange={(v) => setNavigationOverride(v as QuizNavigationOverride)}
            />
            <p className="m-0 mt-1.5 text-xs">
              <button
                type="button"
                onClick={() => setNavigationOverride('inherit')}
                className="text-ink-muted underline hover:text-ink"
              >
                Use course default instead
              </button>
            </p>
          </div>
        )}
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-[#374151]">Retries</span>
        {!canRetry ? (
          <p className="m-0 text-xs text-[#9ca3af]">
            Not available — requires &ldquo;{NAVIGATION_LABELS.allow_back}&rdquo;
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Maximum attempts" htmlFor="block-retry-max">
              <Input
                id="block-retry-max"
                type="number"
                min={1}
                value={quiz.retryMax ?? ''}
                placeholder="No retries"
                onChange={(e) => {
                  const raw = e.target.value.trim()
                  patchQuiz({ retryMax: raw === '' ? null : Number(raw) })
                }}
              />
            </Field>
            <Field label="Wait before retry" htmlFor="block-retry-cooldown">
              <Select
                id="block-retry-cooldown"
                value={quiz.retryCooldownHours ?? 0}
                disabled={quiz.retryMax === null}
                onChange={(e) => patchQuiz({ retryCooldownHours: Number(e.target.value) })}
              >
                {RETRY_COOLDOWN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        )}
      </div>

      <p className="m-0 rounded-md border border-dashed border-surface-border px-4 py-4 text-center text-xs text-[#9ca3af]">
        Questions — AI generation, manual entry and CSV import — are build step 5.
      </p>
    </div>
  )
}
