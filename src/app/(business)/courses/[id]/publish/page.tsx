import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { CoursePublishForm } from '@/components/business/course-publish-form'
import { getBusinessContext } from '@/lib/business'
import { createClient } from '@/lib/supabase/server'
import { blockTypeMeta, type BlockType } from '@/lib/course'

export const metadata: Metadata = { title: 'Review & publish — iTutor Business' }

/** Course Builder step 4 — Review & publish (build step 6). */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')
  if (context.role === 'auditor') redirect('/courses')

  const supabase = await createClient()
  // The banner every course of this business shows.
  const { data: business } = await supabase
    .from('businesses')
    .select('cover_url')
    .eq('id', context.businessId)
    .maybeSingle()

  const [{ data: course }, { data: blocks }] = await Promise.all([
    supabase
      .from('courses')
      .select(
        'id, business_id, title, description, thumbnail_url, visibility, status, duration_label, quiz_navigation_default, quiz_retry_max_default'
      )
      .eq('id', id)
      .maybeSingle(),
    supabase.from('course_blocks').select('type').eq('course_id', id),
  ])

  if (!course || course.business_id !== context.businessId) notFound()

  const counts = (blocks ?? []).reduce<Partial<Record<BlockType, number>>>((acc, b) => {
    acc[b.type] = (acc[b.type] ?? 0) + 1
    return acc
  }, {})

  return (
    <CoursePublishForm
      courseId={course.id}
      status={course.status}
      title={course.title}
      description={course.description}
      thumbnailUrl={business?.cover_url ?? null}
      visibility={course.visibility}
      durationLabel={course.duration_label}
      blockSummary={Object.entries(counts).map(([type, count]) => ({
        label: blockTypeMeta(type as BlockType).label,
        count: count as number,
      }))}
      blockCount={(blocks ?? []).length}
      hasQuiz={(counts.quiz ?? 0) > 0}
      quizNavigationDefault={course.quiz_navigation_default}
      quizRetryMaxDefault={course.quiz_retry_max_default}
    />
  )
}
