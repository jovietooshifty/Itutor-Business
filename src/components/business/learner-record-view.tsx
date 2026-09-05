import Link from 'next/link'
import { Award, Briefcase, FileText, Mail, Phone } from 'lucide-react'
import { Avatar, Badge, Card, ProgressBar, cn } from '@/components/ui'
import { InviteToRetake } from '@/components/business/invite-to-retake'
import { ResetQuizAttempts } from '@/components/business/reset-quiz-attempts'
import type { LearnerRecord } from '@/lib/learner-record'
import type { LearnerQuiz } from '@/lib/learners'

/**
 * One learner, as their training administrator sees them. Rendered by both the
 * global directory (/learners/[id]) and the course-scoped route
 * (/courses/[id]/manage/learners/[id]) so the two never drift.
 *
 * Read-only throughout. The point is closer to a CV in an interview than to an
 * editable record: who they are, what they have done, and — per course — what
 * they actually did on the material.
 */
export function LearnerRecordView({
  record,
  canInvite = false,
}: {
  record: LearnerRecord
  /** Admin/Operator get the retake offer on a past student. */
  canInvite?: boolean
}) {
  const facts = [
    { icon: Mail, label: 'Email', value: record.email },
    { icon: Phone, label: 'Phone', value: record.phone },
    { icon: Briefcase, label: 'Job title', value: record.jobTitle },
    { icon: Briefcase, label: 'Employer', value: record.employerName },
    {
      icon: Briefcase,
      label: 'Employment',
      value:
        record.employed === null
          ? null
          : record.employed
            ? 'Currently employed'
            : 'Not currently employed',
    },
    { icon: Award, label: 'Experience', value: record.yearsExperience },
  ].filter((fact) => Boolean(fact.value))

  return (
    <>
      <Card className="p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={record.name} src={record.avatarUrl} size={56} />
          <div className="min-w-0">
            <h1 className="m-0 font-display text-[24px] font-bold text-ink">{record.name}</h1>
            {record.jobTitle && (
              <p className="m-0 mt-0.5 text-sm text-ink-muted">
                {record.jobTitle}
                {record.employerName && ` · ${record.employerName}`}
              </p>
            )}
          </div>
        </div>

        {/* Everything the query already returned. Phone, employment status and
            years of experience were being fetched and thrown away. */}
        <dl className="m-0 mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label} className="flex items-start gap-2.5">
              <fact.icon size={15} className="mt-0.5 shrink-0 text-[#9ca3af]" aria-hidden />
              <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
                  {fact.label}
                </dt>
                <dd className="m-0 break-words text-sm text-ink">{fact.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {record.bio && <p className="mt-5 text-sm leading-relaxed text-ink">{record.bio}</p>}

        {record.skills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {record.skills.map((skill) => (
              <Badge key={skill} tone="neutral">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      <h2 className="mb-3 mt-7 font-display text-lg font-bold text-ink">Resume</h2>
      <ResumePanel resume={record.resume} name={record.name} />

      {record.certifications.length > 0 && (
        <Card className="mt-3 p-5">
          <h3 className="m-0 mb-2.5 font-display text-sm font-bold text-ink">Certifications</h3>
          <p className="m-0 mb-3 text-xs text-[#9ca3af]">
            Self-reported and unverified — offered as context, not as proof.
          </p>
          <ul className="m-0 grid list-none gap-2 p-0">
            {record.certifications.map((cert) => (
              <li key={cert.id} className="flex items-center gap-2 text-sm text-ink">
                <Award size={14} className="shrink-0 text-[#9ca3af]" aria-hidden />
                {cert.fileUrl ? (
                  <a href={cert.fileUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                    {cert.name}
                  </a>
                ) : (
                  cert.name
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <h2 className="mb-3 mt-7 font-display text-lg font-bold text-ink">
        Enrolments in your courses
      </h2>

      {record.enrolments.length === 0 ? (
        <Card className="py-10 text-center">
          <p className="m-0 text-sm text-ink-muted">
            This learner is not enrolled in any of your courses.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {record.enrolments.map((row) => (
            <Card key={row.enrollmentId} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/courses/${row.courseId}/manage/learners`}
                  className="text-sm font-semibold text-ink no-underline hover:underline"
                >
                  {row.courseTitle}
                </Link>
                <div className="flex shrink-0 items-center gap-2">
                  {row.cycle > 1 && <Badge tone="neutral">Retake {row.cycle}</Badge>}
                  <Badge tone={row.status === 'completed' ? 'success' : 'neutral'}>
                    {row.status !== 'completed'
                      ? 'In progress'
                      : row.isPastStudent
                        ? 'Past student'
                        : 'Completed'}
                  </Badge>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-5">
                <div className="min-w-[180px] flex-1">
                  <div className="mb-1 text-xs text-ink-muted">{row.completionPct}% complete</div>
                  <ProgressBar value={row.completionPct} />
                </div>
              </div>

              {/* Past students are complete and stay complete. What changed is
                  the course, so that is what the line says. */}
              {row.isPastStudent && (
                <p className="m-0 mt-2.5 text-xs text-ink-muted">
                  Finished all {row.completedBlockTotal} block
                  {row.completedBlockTotal === 1 ? '' : 's'} this course had at the time.{' '}
                  {row.liveBlockTotal - (row.completedBlockTotal ?? 0)} block
                  {row.liveBlockTotal - (row.completedBlockTotal ?? 0) === 1 ? ' has' : 's have'}{' '}
                  been added since.
                </p>
              )}

              {/* Offered only on the newest cycle of a past student: a
                  superseded row is history, and inviting from it would make a
                  third. */}
              {canInvite && row.isPastStudent && row.cycle === newestCycle(record, row) && (
                <InviteToRetake
                  courseId={row.courseId}
                  learnerId={record.learnerId}
                  learnerName={record.name}
                  courseTitle={row.courseTitle}
                />
              )}

              <QuizHistory
                quizzes={row.quizzes}
                courseId={row.courseId}
                learnerId={record.learnerId}
                canReset={canInvite}
              />
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

/** The highest cycle this learner has on that row's course. */
function newestCycle(record: LearnerRecord, row: LearnerRecord['enrolments'][number]): number {
  return Math.max(
    ...record.enrolments.filter((e) => e.courseId === row.courseId).map((e) => e.cycle)
  )
}

/* ── Resume ────────────────────────────────────────────────────────────── */

function ResumePanel({ resume, name }: { resume: LearnerRecord['resume']; name: string }) {
  if (!resume) {
    return (
      <Card className="py-8 text-center">
        <p className="m-0 text-sm text-ink-muted">
          {name.split(' ')[0]} has not added a resume yet.
        </p>
      </Card>
    )
  }

  if (resume.kind === 'file') {
    const view = resume.view
    if (!view) {
      return (
        <Card>
          <p className="m-0 p-6 text-sm text-ink-muted">
            The uploaded resume could not be opened. It may have been removed.
          </p>
        </Card>
      )
    }

    /* Read in place, whatever the format. A download makes an admin leave the
       page, open a file manager and come back — for something they are only
       going to glance at. A PDF goes to the browser's viewer; a .docx is
       converted to its own markup, because browsers have no viewer for one. */
    return (
      <Card className="overflow-hidden p-0">
        {view.kind === 'embed' && (
          <iframe
            src={view.url}
            title={`${name}'s resume`}
            className="h-[720px] w-full border-0 bg-surface-inset"
          />
        )}

        {view.kind === 'html' && (
          <div
            className="prose-material max-h-[720px] overflow-y-auto p-6 text-sm leading-relaxed text-ink md:p-7"
            // Sanitised server-side — see sanitizeDocumentHtml.
            dangerouslySetInnerHTML={{ __html: view.html }}
          />
        )}

        {view.kind === 'text' && (
          <div className="max-h-[720px] overflow-y-auto whitespace-pre-wrap p-6 text-sm leading-relaxed text-ink md:p-7">
            {view.text}
          </div>
        )}

        {view.kind === 'link' && (
          <p className="m-0 px-6 pt-6 text-sm text-ink-muted">
            {view.reason ?? 'This resume cannot be shown in the page.'}
          </p>
        )}

        <div className="border-t border-border px-4 py-2.5">
          <a
            href={view.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted no-underline hover:text-ink"
          >
            <FileText size={13} aria-hidden /> Open the original
          </a>
        </div>
      </Card>
    )
  }

  const { data } = resume
  return (
    <Card className="p-6">
      {data.summary && <p className="m-0 text-sm leading-relaxed text-ink">{data.summary}</p>}

      {data.work.length > 0 && (
        <section className={data.summary ? 'mt-6' : undefined}>
          <h3 className="m-0 mb-3 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
            Work history
          </h3>
          <ol className="m-0 grid list-none gap-4 p-0">
            {data.work.map((job, i) => (
              <li key={`${job.employer}-${i}`}>
                <p className="m-0 text-sm font-semibold text-ink">
                  {job.title}
                  {job.employer && <span className="font-normal text-ink-muted"> · {job.employer}</span>}
                </p>
                {(job.start || job.end) && (
                  <p className="m-0 mt-0.5 text-xs text-[#9ca3af]">
                    {job.start}
                    {job.start && ' — '}
                    {job.end || 'Present'}
                  </p>
                )}
                {job.summary && (
                  <p className="m-0 mt-1.5 text-sm leading-relaxed text-ink-muted">{job.summary}</p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mt-6">
          <h3 className="m-0 mb-3 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
            Education
          </h3>
          <ul className="m-0 grid list-none gap-2 p-0">
            {data.education.map((entry, i) => (
              <li key={`${entry.institution}-${i}`} className="text-sm text-ink">
                {entry.qualification}
                {entry.institution && <span className="text-ink-muted"> · {entry.institution}</span>}
                {entry.year && <span className="text-[#9ca3af]"> · {entry.year}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mt-6">
          <h3 className="m-0 mb-2.5 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <Badge key={skill} tone="neutral">
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}
    </Card>
  )
}

/* ── Quiz attempts ─────────────────────────────────────────────────────── */

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return rest ? `${minutes}m ${rest}s` : `${minutes}m`
}

/**
 * Every attempt, not just the latest score. An admin deciding whether someone
 * has understood the material needs to see 40 → 55 → 70 differently from a
 * single 70, and the old record could not tell those apart.
 */
function QuizHistory({
  quizzes,
  courseId,
  learnerId,
  canReset,
}: {
  quizzes: LearnerQuiz[]
  courseId: string
  learnerId: string
  canReset: boolean
}) {
  if (quizzes.length === 0) {
    return <p className="m-0 mt-3 text-xs text-[#9ca3af]">No quizzes attempted in this course.</p>
  }

  return (
    <div className="mt-4 grid gap-3 border-t border-border pt-4">
      {quizzes.map((quiz) => (
        <div key={quiz.quizId}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-semibold text-ink">{quiz.title}</span>
            <span className="text-xs text-ink-muted">
              {quiz.attemptsUsed} of {quiz.attemptsAllowed} attempt
              {quiz.attemptsAllowed === 1 ? '' : 's'} used · pass mark {quiz.passingScore}%
            </span>
          </div>

          {quiz.attemptsUsed === 0 ? (
            <p className="m-0 mt-1 text-xs text-ink-muted">
              Attempts reset — nothing counted yet on this quiz.
            </p>
          ) : (
            <p className="m-0 mt-1 text-xs text-ink-muted">
              Best {quiz.bestScore}% · latest {quiz.latestScore}% ·{' '}
              <span
                className={
                  quiz.passed
                    ? 'font-semibold text-[var(--itutor-green)]'
                    : 'font-semibold text-danger-fg'
                }
              >
                {quiz.passed ? 'Passed' : 'Not passed'}
              </span>
            </p>
          )}

          {quiz.supersededCount > 0 && (
            <p className="m-0 mt-1 text-xs text-[#9ca3af]">
              {quiz.supersededCount} earlier attempt
              {quiz.supersededCount === 1 ? '' : 's'} reset by an administrator, kept below.
            </p>
          )}

          {canReset && (
            <ResetQuizAttempts
              courseId={courseId}
              quizId={quiz.quizId}
              learnerId={learnerId}
              quizTitle={quiz.title}
              attemptsUsed={quiz.attemptsUsed}
              attemptsAllowed={quiz.attemptsAllowed}
            />
          )}

          <ol className="m-0 mt-2 grid list-none gap-1 p-0">
            {quiz.attempts.map((attempt) => (
              <li
                key={attempt.attemptNumber}
                className={cn(
                  'flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-md bg-surface-inset px-2.5 py-1.5 text-xs',
                  // Reset away: still readable, visibly not current.
                  attempt.superseded && 'opacity-60'
                )}
              >
                <span className="font-semibold text-ink">Attempt {attempt.attemptNumber}</span>
                {attempt.superseded && (
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#9ca3af]">
                    Reset
                  </span>
                )}
                <span
                  className={
                    attempt.passed ? 'font-semibold text-[var(--itutor-green)]' : 'text-ink-muted'
                  }
                >
                  {attempt.score}%
                </span>
                <span className="text-[#9ca3af]">
                  {new Date(attempt.submittedAt).toLocaleString()}
                </span>
                {attempt.durationSeconds !== null && (
                  <span className="text-[#9ca3af]">
                    took {formatDuration(attempt.durationSeconds)}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
