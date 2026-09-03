import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { CourseBasicsForm } from '@/components/business/course-basics-form'
import { getBusinessContext } from '@/lib/business'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Course basics — iTutor Business' }

/** Course Builder step 1, for a course that already exists — the "Back" target. */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')
  if (context.role === 'auditor') redirect('/courses')

  const supabase = await createClient()
  const [{ data: course }, { data: tags }] = await Promise.all([
    supabase
      .from('courses')
      .select('id, business_id, title, description, visibility, what_you_will_learn, thumbnail_url')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('course_tags').select('tag').eq('course_id', id),
  ])

  // Matches the sequence screen: a course that is merely visible (a public one
  // from another business) must never open in the editor.
  if (!course || course.business_id !== context.businessId) notFound()

  return (
    <CourseBasicsForm
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
  )
}
