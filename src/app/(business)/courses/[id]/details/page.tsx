import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { CourseDetailsForm } from '@/components/business/course-details-form'
import { getBusinessContext } from '@/lib/business'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Course details — iTutor Business' }

/**
 * Course Builder step 3 — duration and quiz defaults, asked only once there is
 * material to describe. Whether the course has a quiz decides whether the quiz
 * defaults are shown at all.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')
  if (context.role === 'auditor') redirect('/courses')

  const supabase = await createClient()
  const [{ data: course }, { data: blocks }] = await Promise.all([
    supabase
      .from('courses')
      .select(
        'id, business_id, duration_label, quiz_navigation_default, quiz_retry_max_default, quiz_retry_cooldown_hours_default'
      )
      .eq('id', id)
      .maybeSingle(),
    supabase.from('course_blocks').select('type').eq('course_id', id),
  ])

  if (!course || course.business_id !== context.businessId) notFound()

  return (
    <CourseDetailsForm
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
  )
}
