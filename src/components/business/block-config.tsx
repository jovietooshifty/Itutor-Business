'use client'

import * as React from 'react'
import { Globe } from 'lucide-react'
import { Checkbox, Field, Input, SegmentedControl, Select, Textarea } from '@/components/ui'
import {
  PASSING_SCORE_OPTIONS,
  QUIZ_SCOPE_OPTIONS,
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

/**
 * Deliberately does not ask about navigation or retries — both are course-wide
 * settings from the Details step (step 3), which comes after this one. Asking
 * here would mean asking before the course even has a navigation default to
 * show, and retries only mean anything once that default is settled (a quiz
 * failed and retried without new material covered proves nothing, which is
 * exactly why forward-only navigation disables retries entirely).
 */
export function QuizConfig({
  quiz,
  priorBlocks,
  onChange,
}: {
  quiz: QuizState
  priorBlocks: { id: string; label: string }[]
  onChange: (quiz: QuizState) => void
}) {
  const scopeGroup = React.useId()

  function patchQuiz(patch: Partial<QuizState>) {
    onChange({ ...quiz, ...patch })
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

      <p className="m-0 rounded-md border border-dashed border-surface-border px-4 py-4 text-center text-xs text-[#9ca3af]">
        Navigation and retries are set once for the whole course, on the Details step. Questions —
        AI generation, manual entry and CSV import — are build step 5.
      </p>
    </div>
  )
}
