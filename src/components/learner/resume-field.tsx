'use client'

import * as React from 'react'
import { FileText, Plus, Trash2, Upload, X } from 'lucide-react'
import { Button, Chip, Field, Input, SegmentedControl, Textarea, cn } from '@/components/ui'
import {
  RESUME_MAX_BYTES,
  RESUME_MIME_TYPES,
  emptyResume,
  emptyResumeEducation,
  emptyResumeWork,
  resumeIsUsable,
  type ResumeData,
} from '@/lib/resume'
import { uploadResume } from '@/app/(learner)/actions'

export type ResumeValue = {
  /** Storage path in the private bucket, when a file was uploaded. */
  url: string | null
  /** The in-app resume, when one was built instead. */
  data: ResumeData | null
  /** Original file name, for display only. */
  fileName: string | null
}

const ACCEPT = '.pdf,.doc,.docx'

/**
 * A resume, either way round.
 *
 * A resume is required before enrolling, and there are two ways to give one.
 * The second is not a courtesy: requiring a document file would exclude the
 * contractors and service workers signing up on a phone, who are most of who
 * this platform is for — they have a work history, just not a PDF of it.
 */
export function ResumeField({
  value,
  onChange,
  invalid,
}: {
  value: ResumeValue
  onChange: (next: ResumeValue) => void
  invalid?: boolean
}) {
  // Whichever path they are already on stays selected across a remount.
  const [mode, setMode] = React.useState<'upload' | 'build'>(value.data ? 'build' : 'upload')
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const data = value.data ?? emptyResume()

  function editData(next: Partial<ResumeData>) {
    onChange({ ...value, url: null, fileName: null, data: { ...data, ...next } })
  }

  async function upload(file: File) {
    setError(null)

    if (file.size > RESUME_MAX_BYTES) {
      setError(
        `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is ${
          RESUME_MAX_BYTES / 1024 / 1024
        }MB.`
      )
      return
    }
    // Some browsers report an empty type for .doc, so the extension is the
    // fallback rather than the primary check.
    if (
      file.type &&
      !(RESUME_MIME_TYPES as readonly string[]).includes(file.type) &&
      !/\.(pdf|docx?)$/i.test(file.name)
    ) {
      setError('Upload a PDF or a Word document.')
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.set('file', file)
      const result = await uploadResume(form)
      if (!result.ok) {
        setError(result.error)
        return
      }
      onChange({ url: result.data!.path, fileName: file.name, data: null })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-4 md:p-5',
        invalid ? 'border-[#fca5a5] bg-[#fef2f2]' : 'border-surface-border bg-white'
      )}
    >
      <SegmentedControl
        options={[
          { value: 'upload', label: 'Upload a file' },
          { value: 'build', label: 'Build one here' },
        ]}
        value={mode}
        onChange={(next) => setMode(next as 'upload' | 'build')}
      />

      {mode === 'upload' ? (
        <div className="mt-4">
          {value.url ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-surface-inset px-3.5 py-3">
              <FileText size={16} className="shrink-0 text-[var(--itutor-green)]" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                {value.fileName || 'Your resume'}
              </span>
              <button
                type="button"
                onClick={() => onChange({ url: null, fileName: null, data: null })}
                className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-danger-fg"
              >
                <X size={13} aria-hidden /> Remove
              </button>
            </div>
          ) : (
            <>
              <label
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-surface-border px-4 py-8 text-center',
                  'transition-colors duration-fast hover:border-coral',
                  uploading && 'pointer-events-none opacity-60'
                )}
              >
                <Upload size={20} className="text-[#9ca3af]" aria-hidden />
                <span className="text-sm font-semibold text-ink">
                  {uploading ? 'Uploading…' : 'Choose a PDF or Word document'}
                </span>
                <span className="text-xs text-[#9ca3af]">
                  Up to {RESUME_MAX_BYTES / 1024 / 1024}MB. Only businesses running a course you
                  join can see it.
                </span>
                <input
                  type="file"
                  accept={ACCEPT}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    // Cleared so choosing the same file twice still fires.
                    e.target.value = ''
                    if (file) void upload(file)
                  }}
                />
              </label>
              <p className="m-0 mt-2.5 text-xs text-[#9ca3af]">
                No file to hand? Switch to <strong>Build one here</strong> and answer a few
                questions instead.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="mt-4 grid gap-5">
          <Field
            label="Summary"
            hint="A couple of sentences on what you do and what you are good at."
          >
            <Textarea
              rows={3}
              value={data.summary}
              onChange={(e) => editData({ summary: e.target.value })}
              placeholder="e.g. Six years on commercial kitchen installs across Trinidad, mostly gas and refrigeration."
            />
          </Field>

          <div>
            <span className="mb-2 block text-sm font-medium text-[#374151]">Work history</span>
            <div className="grid gap-3">
              {data.work.map((job, i) => (
                <div key={i} className="rounded-lg border border-surface-border p-3.5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      value={job.title}
                      onChange={(e) =>
                        editData({
                          work: data.work.map((w, idx) =>
                            idx === i ? { ...w, title: e.target.value } : w
                          ),
                        })
                      }
                      placeholder="Job title"
                    />
                    <Input
                      value={job.employer}
                      onChange={(e) =>
                        editData({
                          work: data.work.map((w, idx) =>
                            idx === i ? { ...w, employer: e.target.value } : w
                          ),
                        })
                      }
                      placeholder="Employer"
                    />
                    {/* Free text, not date pickers. "2019", "Summer 2020" and
                        "about three years ago" are all the truth someone has. */}
                    <Input
                      value={job.start}
                      onChange={(e) =>
                        editData({
                          work: data.work.map((w, idx) =>
                            idx === i ? { ...w, start: e.target.value } : w
                          ),
                        })
                      }
                      placeholder="From — e.g. Mar 2021"
                    />
                    <Input
                      value={job.end}
                      onChange={(e) =>
                        editData({
                          work: data.work.map((w, idx) =>
                            idx === i ? { ...w, end: e.target.value } : w
                          ),
                        })
                      }
                      placeholder="To — leave blank if current"
                    />
                  </div>
                  <Textarea
                    className="mt-3"
                    rows={2}
                    value={job.summary}
                    onChange={(e) =>
                      editData({
                        work: data.work.map((w, idx) =>
                          idx === i ? { ...w, summary: e.target.value } : w
                        ),
                      })
                    }
                    placeholder="What did you do there?"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      editData({ work: data.work.filter((_, idx) => idx !== i) })
                    }
                    className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#9ca3af] hover:text-danger-fg"
                  >
                    <Trash2 size={13} aria-hidden /> Remove this job
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => editData({ work: [...data.work, emptyResumeWork()] })}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-coral"
            >
              <Plus size={14} aria-hidden /> Add a job
            </button>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-[#374151]">
              Education &amp; training
            </span>
            <div className="grid gap-2.5">
              {data.education.map((entry, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2.5">
                  <Input
                    className="min-w-[160px] flex-1"
                    value={entry.qualification}
                    onChange={(e) =>
                      editData({
                        education: data.education.map((x, idx) =>
                          idx === i ? { ...x, qualification: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Qualification"
                  />
                  <Input
                    className="min-w-[160px] flex-1"
                    value={entry.institution}
                    onChange={(e) =>
                      editData({
                        education: data.education.map((x, idx) =>
                          idx === i ? { ...x, institution: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="School or institution"
                  />
                  <Input
                    className="w-[100px]"
                    value={entry.year}
                    onChange={(e) =>
                      editData({
                        education: data.education.map((x, idx) =>
                          idx === i ? { ...x, year: e.target.value } : x
                        ),
                      })
                    }
                    placeholder="Year"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      editData({ education: data.education.filter((_, idx) => idx !== i) })
                    }
                    aria-label="Remove this qualification"
                    className="text-[#9ca3af] hover:text-danger-fg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => editData({ education: [...data.education, emptyResumeEducation()] })}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-coral"
            >
              <Plus size={14} aria-hidden /> Add education
            </button>
          </div>

          <ResumeSkills
            skills={data.skills}
            onChange={(skills) => editData({ skills })}
          />

          {!resumeIsUsable(data) && (
            <p className="m-0 text-xs text-[#b45309]">
              Add at least one job, or a summary of a couple of sentences.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="m-0 mt-3 rounded-md bg-danger-bg px-3 py-2 text-xs text-danger-fg">
          {error}
        </p>
      )}
    </div>
  )
}

function ResumeSkills({
  skills,
  onChange,
}: {
  skills: string[]
  onChange: (next: string[]) => void
}) {
  const [draft, setDraft] = React.useState('')

  function add() {
    const value = draft.trim()
    if (!value || skills.includes(value)) return
    onChange([...skills, value])
    setDraft('')
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-[#374151]">
        Skills on your resume
      </span>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            e.preventDefault()
            add()
          }}
          placeholder="Type a skill and press Enter"
        />
        <Button type="button" accent="coral" onClick={add}>
          Add
        </Button>
      </div>
      {skills.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Chip
              key={skill}
              accent="coral"
              onRemove={() => onChange(skills.filter((s) => s !== skill))}
            >
              {skill}
            </Chip>
          ))}
        </div>
      )}
    </div>
  )
}
