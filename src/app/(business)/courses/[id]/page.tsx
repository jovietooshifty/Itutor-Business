import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { CourseSequence } from '@/components/business/course-sequence'
import { loadSequence } from '@/lib/builder'
import { getBusinessContext } from '@/lib/business'

export const metadata: Metadata = { title: 'Course builder — iTutor Business' }

/** Course Builder step 2a — the lesson sequence for one course. */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const loaded = await loadSequence(id)

  // RLS already hides other businesses' courses, so a miss here is a 404 rather
  // than a permission error — but check the owner explicitly so a course that
  // is merely *visible* (a public one) can never be opened in the editor.
  if (!loaded || loaded.course.businessId !== context.businessId) notFound()

  return (
    <CourseSequence
      course={{ id: loaded.course.id, title: loaded.course.title }}
      initialBlocks={loaded.blocks}
      canDelete={context.role === 'admin'}
    />
  )
}
