import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CourseTabs } from '@/components/business/course-tabs'
import { CourseBasicsForm } from '@/components/business/course-basics-form'
import { CourseDetailsForm } from '@/components/business/course-details-form'
import { CoursePublishToggle } from '@/components/business/course-publish-toggle'
import { DeleteCourse } from '@/components/business/delete-course'
import { getBusinessContext } from '@/lib/business'
import { currentCycles, loadCourseLearners } from '@/lib/learners'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Course settings — iTutor Business' }

/**
 * Course management, Settings tab.
 *
 * Everything the build flow asks for at the course level, editable directly:
 * what the course is (step 1) and how it runs (step 3), on one page, saved in
 * place. The wizard exists to get a course made; once it exists, changing its
 * description should not mean walking four screens to get back out — and it
 * certainly should not mean passing back through Publish.
 *
 * Per-block edits are not here. They live on each block's own page, reachable
 * from the Sequence tab, because a block's fields depend on its type.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')
  // Auditors are read-only per the RLS matrix; the forms would only fail on save.
  if (context.role === 'auditor') redirect(`/courses/${id}/manage`)

  const supabase = await createClient()
  const [{ data: course }, { data: tags }, { data: blocks }, allEnrolments] = await Promise.all([
    supabase
      .from('courses')
      // One unbroken literal: supabase-js infers the row type from this string.
      // prettier-ignore
      .select('id, business_id, title, description, visibility, status, what_you_will_learn, thumbnail_url, duration_label, quiz_navigation_default, quiz_retry_max_default, quiz_retry_cooldown_hours_default')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('course_tags').select('tag').eq('course_id', id),
    supabase.from('course_blocks').select('type').eq('course_id', id),
    loadCourseLearners(id),
  ])

  if (!course || course.business_id !== context.businessId) notFound()

  const learners = currentCycles(allEnrolments)

  return (
    <main className="mx-auto max-w-[960px] p-6 md:p-10">
      <Link
        href="/courses"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted no-underline hover:text-ink"
      >
        <ArrowLeft size={15} aria-hidden /> All courses
      </Link>
      <h1 className="m-0 mb-5 font-display text-[28px] font-bold text-ink">{course.title}</h1>

      <CourseTabs courseId={course.id} active="settings" />

      <section>
        <h2 className="m-0 mb-1 font-display text-lg font-bold text-ink">Publishing</h2>
        <p className="m-0 mb-4 text-sm text-ink-muted">
          Whether anyone outside your business can reach this course at all.
        </p>
        <CoursePublishToggle
          courseId={course.id}
          status={course.status}
          visibility={course.visibility}
          blockCount={(blocks ?? []).length}
          hasTitle={Boolean(course.title.trim())}
        />
      </section>

      <section className="mt-10">
        <h2 className="m-0 mb-1 font-display text-lg font-bold text-ink">About this course</h2>
        <p className="m-0 mb-4 text-sm text-ink-muted">
          What learners see before they join — the marketplace card, the landing page, and who can
          find it.
        </p>
        <CourseBasicsForm
          variant="settings"
          businessId={context.businessId}
          courseId={course.id}
          initial={{
            title: course.title,
            description: course.description ?? '',
            visibility: course.visibility,
            tags: (tags ?? []).map((t) => t.tag),
            whatYouWillLearn: course.what_you_will_learn ?? [],
            thumbnailUrl: course.thumbnail_url,
          }}
        />
      </section>

      <section className="mt-10">
        <h2 className="m-0 mb-1 font-display text-lg font-bold text-ink">How it runs</h2>
        <p className="m-0 mb-4 text-sm text-ink-muted">
          The estimate learners see, and the rules every quiz in this course inherits.
        </p>
        <CourseDetailsForm
          variant="settings"
          courseId={course.id}
          hasQuiz={(blocks ?? []).some((block) => block.type === 'quiz')}
          blockCount={(blocks ?? []).length}
          initial={{
            durationLabel: course.duration_label ?? '',
            quizNavigationDefault: course.quiz_navigation_default,
            retryMaxDefault: course.quiz_retry_max_default,
            retryCooldownHoursDefault: course.quiz_retry_cooldown_hours_default,
          }}
        />
      </section>

      {/* Last on the page, on the tab you have to go looking for. It used to
          sit under the Overview tab, directly below "Resume building". */}
      <section className="mt-10">
        <h2 className="m-0 mb-1 font-display text-lg font-bold text-ink">Danger zone</h2>
        <p className="m-0 text-sm text-ink-muted">Irreversible, and not only for you.</p>
        <DeleteCourse
          courseId={course.id}
          courseTitle={course.title}
          enrolledCount={learners.length}
          isAdmin={context.role === 'admin'}
        />
      </section>
    </main>
  )
}
