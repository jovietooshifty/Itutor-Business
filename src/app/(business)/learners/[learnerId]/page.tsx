import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Avatar, Badge, Card, ProgressBar } from '@/components/ui'
import { getBusinessContext } from '@/lib/business'
import { loadBusinessLearners } from '@/lib/learners'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Learner — iTutor Business' }

/**
 * The per-learner drill-down, read-only. RLS decides whether this learner is
 * visible at all: can_read_learner() is true only for someone enrolled in one
 * of the caller's courses (or who lists them as employer), so a miss here is a
 * 404 rather than a permission error.
 */
export default async function Page({ params }: { params: Promise<{ learnerId: string }> }) {
  const { learnerId } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const supabase = await createClient()
  const [{ data: learner }, { data: profile }, { data: skills }, rows] = await Promise.all([
    supabase.from('users').select('id, full_name, email').eq('id', learnerId).maybeSingle(),
    supabase
      .from('learner_profiles')
      .select('bio, job_title, employed, years_experience, phone_country_code, phone')
      .eq('user_id', learnerId)
      .maybeSingle(),
    supabase.from('learner_skills').select('skill').eq('user_id', learnerId),
    loadBusinessLearners(context.businessId),
  ])

  if (!learner) notFound()

  // Their enrolments, narrowed to this business's courses.
  const enrolments = rows.filter((row) => row.learnerId === learnerId)

  return (
    <main className="mx-auto max-w-[880px] p-6 md:p-10">
      <Link
        href="/learners"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted no-underline hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden /> All learners
      </Link>

      <Card className="mt-4 p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar name={learner.full_name || learner.email} size={56} />
          <div className="min-w-0">
            <h1 className="m-0 font-display text-[24px] font-bold text-ink">
              {learner.full_name || learner.email}
            </h1>
            <p className="m-0 mt-0.5 text-sm text-ink-muted">{learner.email}</p>
            {profile?.job_title && (
              <p className="m-0 mt-0.5 text-sm text-ink-muted">{profile.job_title}</p>
            )}
          </div>
        </div>

        {profile?.bio && <p className="mt-5 text-sm leading-relaxed text-ink">{profile.bio}</p>}

        {(skills ?? []).length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {(skills ?? []).map((s) => (
              <Badge key={s.skill} tone="neutral">
                {s.skill}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      <h2 className="mb-3 mt-7 font-display text-lg font-bold text-ink">
        Enrolments in your courses
      </h2>

      {enrolments.length === 0 ? (
        <Card className="py-10 text-center">
          <p className="m-0 text-sm text-ink-muted">
            This learner is not enrolled in any of your courses.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {enrolments.map((row) => (
            <Card key={row.enrollmentId} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/courses/${row.courseId}/manage/learners`}
                  className="text-sm font-semibold text-ink no-underline hover:underline"
                >
                  {row.courseTitle}
                </Link>
                <Badge tone={row.status === 'completed' ? 'success' : 'neutral'}>
                  {row.status === 'completed' ? 'Completed' : 'In progress'}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-5">
                <div className="min-w-[180px] flex-1">
                  <div className="mb-1 text-xs text-ink-muted">{row.completionPct}% complete</div>
                  <ProgressBar value={row.completionPct} />
                </div>
                <div className="text-sm">
                  <span className="text-ink-muted">Latest quiz: </span>
                  {row.latestQuizScore === null ? (
                    <span className="text-[#9ca3af]">none</span>
                  ) : (
                    <span className="font-semibold text-ink">{row.latestQuizScore}%</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
