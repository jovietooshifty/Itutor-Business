/**
 * The resume a learner builds in the app, stored on
 * learner_profiles.resume_data.
 *
 * A resume is mandatory before enrolling, and there are two ways to satisfy
 * that: upload a file, or fill this in. The second path is the one that
 * matters — requiring a document file locks out the contractors and service
 * workers signing up on a phone, who have a work history but not a PDF of it.
 *
 * Both paths render into the same viewer for the admin, so which one a learner
 * took is not something an admin has to think about.
 */

export type ResumeWork = {
  title: string
  employer: string
  /** Free text, not a date. "Mar 2021", "2019", "Summer 2020" are all fine. */
  start: string
  /** Empty means current. */
  end: string
  summary: string
}

export type ResumeEducation = {
  qualification: string
  institution: string
  year: string
}

export type ResumeData = {
  summary: string
  work: ResumeWork[]
  education: ResumeEducation[]
  skills: string[]
}

export const emptyResume = (): ResumeData => ({
  summary: '',
  work: [],
  education: [],
  skills: [],
})

export const emptyResumeWork = (): ResumeWork => ({
  title: '',
  employer: '',
  start: '',
  end: '',
  summary: '',
})

export const emptyResumeEducation = (): ResumeEducation => ({
  qualification: '',
  institution: '',
  year: '',
})

/** File types the upload path accepts, and the cap the bucket enforces. */
export const RESUME_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const
export const RESUME_MAX_BYTES = 10 * 1024 * 1024

/**
 * Whether a built resume is substantial enough to count as one. A name and
 * nothing else is not a resume, but demanding dates and a paragraph from
 * someone filling this in on a phone would just push them to fake it — so the
 * bar is one real job, or a summary of what they do.
 */
export function resumeIsUsable(data: ResumeData | null): boolean {
  if (!data) return false
  const hasWork = data.work.some((w) => w.title.trim() && w.employer.trim())
  return hasWork || data.summary.trim().length >= 40
}

/** Reads whatever is on the jsonb column into a shape the UI can trust. */
export function parseResumeData(value: unknown): ResumeData | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const raw = value as Record<string, unknown>

  const asString = (v: unknown) => (typeof v === 'string' ? v : '')
  const asArray = (v: unknown) => (Array.isArray(v) ? v : [])

  return {
    summary: asString(raw.summary),
    work: asArray(raw.work).map((entry) => {
      const w = (entry ?? {}) as Record<string, unknown>
      return {
        title: asString(w.title),
        employer: asString(w.employer),
        start: asString(w.start),
        end: asString(w.end),
        summary: asString(w.summary),
      }
    }),
    education: asArray(raw.education).map((entry) => {
      const e = (entry ?? {}) as Record<string, unknown>
      return {
        qualification: asString(e.qualification),
        institution: asString(e.institution),
        year: asString(e.year),
      }
    }),
    skills: asArray(raw.skills).filter((s): s is string => typeof s === 'string'),
  }
}
