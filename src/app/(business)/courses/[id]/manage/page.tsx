import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Badge, Button, Card } from '@/components/ui'
import { CourseTabs } from '@/components/business/course-tabs'
import { DeleteCourse } from '@/components/business/delete-course'
import { getBusinessContext } from '@/lib/business'
import { loadCourseLearners } from '@/lib/learners'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Course overview — iTutor Business' }

/** Course management, Overview tab (handoff flow 7). */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const supabase = await createClient()
  const [{ data: course }, { data: blocks }, learners] = await Promise.all([
    supabase
      .from('courses')
      .select('id, business_id, title, description, visibility, status, duration_label')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('course_blocks').select('id, type').eq('course_id', id),
    loadCourseLearners(id),
  ])

  if (!course || course.business_id !== context.businessId) notFound()

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

  const blockCount = (blocks ?? []).length
  const quizCount = (blocks ?? []).filter((b) => b.type === 'quiz').length

  return (
    <main className="mx-auto max-w-[960px] p-6 md:p-10">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="m-0 font-display text-[28px] font-bold text-ink">{course.title}</h1>
          {course.description && (
            <p className="m-0 mt-1 text-sm text-ink-muted">{course.description}</p>
          )}
        </div>
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

      <Card className="mt-5 p-6">
        <h2 className="m-0 mb-3 font-display text-base font-bold text-ink">Content</h2>
        <p className="m-0 text-sm text-ink-muted">
          {blockCount === 0
            ? 'No blocks yet.'
            : `${blockCount} ${blockCount === 1 ? 'block' : 'blocks'}${
                quizCount ? `, ${quizCount} ${quizCount === 1 ? 'quiz' : 'quizzes'}` : ''
              }`}
          {course.duration_label ? ` · ${course.duration_label}` : ''}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/courses/${course.id}/manage/sequence`} className="no-underline">
            <Button variant="secondary">Edit the sequence</Button>
          </Link>
          <Link href={`/courses/${course.id}/publish`} className="no-underline">
            <Button variant="secondary">
              {course.status === 'published' ? 'Publishing' : 'Review & publish'}
            </Button>
          </Link>
        </div>
      </Card>

      <DeleteCourse
        courseId={course.id}
        courseTitle={course.title}
        enrolledCount={learners.length}
        isAdmin={context.role === 'admin'}
      />
    </main>
  )
}
