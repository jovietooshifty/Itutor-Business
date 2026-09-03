import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { CourseTabs } from '@/components/business/course-tabs'
import { CourseBasicsForm } from '@/components/business/course-basics-form'
import { CourseDetailsForm } from '@/components/business/course-details-form'
import { getBusinessContext } from '@/lib/business'
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
  const [{ data: course }, { data: tags }, { data: blocks }] = await Promise.all([
    supabase
      .from('courses')
      // One unbroken literal: supabase-js infers the row type from this string.
      // prettier-ignore
      .select('id, business_id, title, description, visibility, what_you_will_learn, thumbnail_url, duration_label, quiz_navigation_default, quiz_retry_max_default, quiz_retry_cooldown_hours_default')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('course_tags').select('tag').eq('course_id', id),
    supabase.from('course_blocks').select('type').eq('course_id', id),
  ])

  if (!course || course.business_id !== context.businessId) notFound()

  return (
    <main className="mx-auto max-w-[960px] p-6 md:p-10">
      <h1 className="m-0 mb-5 font-display text-[28px] font-bold text-ink">{course.title}</h1>

      <CourseTabs courseId={course.id} active="settings" />

      <section>
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
    </main>
  )
}
