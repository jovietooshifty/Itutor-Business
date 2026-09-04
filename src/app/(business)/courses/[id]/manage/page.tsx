import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Badge, Button, Card } from '@/components/ui'
import { CourseTabs } from '@/components/business/course-tabs'
import { CourseSequence } from '@/components/business/course-sequence'
import { getBusinessContext } from '@/lib/business'
import { loadSequence } from '@/lib/builder'
import { resumeHref } from '@/lib/course'
import { currentCycles, loadCourseLearners } from '@/lib/learners'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Course overview — iTutor Business' }

/**
 * Course management, Overview tab (handoff flow 7).
 *
 * This is where a course is worked on once it exists, so the sequence editor
 * is here rather than behind its own tab: the two screens were a summary of
 * the content and the content itself, one click apart, and the summary said
 * nothing the editor below does not show directly.
 *
 * Nothing on this page leads back into the build flow. The one exception is
 * "Resume building" on a draft — an unfinished course, where the flow is still
 * the thing being walked, and resumeHref() returns to the screen it was left
 * on rather than to step one.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const supabase = await createClient()
  const [{ data: course }, sequence, allEnrolments] = await Promise.all([
    supabase
      .from('courses')
      .select('id, business_id, title, description, visibility, status, build_stage, build_block_id')
      .eq('id', id)
      .maybeSingle(),
    loadSequence(id),
    loadCourseLearners(id),
  ])

  if (!course || course.business_id !== context.businessId) notFound()
  if (!sequence) notFound()

  // One row per learner, not one per retake — see currentCycles().
  const learners = currentCycles(allEnrolments)
  const scored = learners.filter((l) => l.latestQuizScore !== null)
  const stats = [
    { label: 'Enrolled', value: String(learners.length) },
    {
      label: 'Completed',
      value: String(learners.filter((l) => l.status === 'completed').length),
    },
    {
      label: 'Avg. completion',
      value: learners.length
        ? `${Math.round(learners.reduce((sum, l) => sum + l.completionPct, 0) / learners.length)}%`
        : '—',
    },
    {
      label: 'Avg. quiz score',
      value: scored.length
        ? `${Math.round(scored.reduce((sum, l) => sum + (l.latestQuizScore ?? 0), 0) / scored.length)}%`
        : '—',
    },
  ]

  return (
    <main className="mx-auto max-w-[960px] p-6 md:p-10">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="m-0 font-display text-[28px] font-bold text-ink">{course.title}</h1>
          {course.description && (
            <p className="m-0 mt-1 text-sm text-ink-muted">{course.description}</p>
          )}
        </div>
        {/* Publishing state, stated once. The action that changes it is on the
            Settings tab — see CoursePublishToggle. */}
        <div className="flex shrink-0 items-center gap-2">
          <Badge tone={course.status === 'published' ? 'success' : 'neutral'}>
            {course.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
          <Badge tone="neutral">{course.visibility === 'public' ? 'Public' : 'Private'}</Badge>
        </div>
      </div>

      <CourseTabs courseId={course.id} active="overview" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[#9ca3af]">
              {stat.label}
            </p>
            <p className="m-0 mt-1.5 font-display text-[26px] font-bold text-ink">{stat.value}</p>
          </Card>
        ))}
      </div>

      {course.status === 'draft' && (
        <Card className="mt-5 flex flex-wrap items-center justify-between gap-3 p-5">
          <p className="m-0 text-sm text-ink-muted">
            This course is still a draft. Pick the build flow back up where you left it, or edit it
            directly below.
          </p>
          <Link
            href={resumeHref(course.id, course.build_stage, course.build_block_id)}
            className="shrink-0 no-underline"
          >
            <Button>Resume building</Button>
          </Link>
        </Card>
      )}

      <section className="mt-7">
        <h2 className="m-0 mb-1 font-display text-lg font-bold text-ink">Content</h2>
        <p className="m-0 mb-4 text-sm text-ink-muted">
          What learners work through, in this order. Each row opens that block on its own page.
        </p>
        <CourseSequence
          variant="manage"
          course={{ id: course.id, title: course.title }}
          initialBlocks={sequence.blocks}
          canDelete={context.role === 'admin'}
        />
      </section>
    </main>
  )
}
