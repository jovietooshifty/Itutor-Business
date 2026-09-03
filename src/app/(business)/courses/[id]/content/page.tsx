import { notFound, redirect } from 'next/navigation'
import { loadSequence } from '@/lib/builder'
import { getBusinessContext } from '@/lib/business'

/**
 * The walkthrough with no block named — "start filling this course in".
 *
 * Resumes at whichever page the builder was last left on, and falls back to
 * the first block. A course with no blocks has no walkthrough to enter, so it
 * goes back to the sequence, which is the screen that can fix that.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const context = await getBusinessContext()
  if (!context) redirect('/login')
  if (context.role === 'auditor') redirect('/courses')

  const loaded = await loadSequence(id)
  if (!loaded || loaded.course.businessId !== context.businessId) notFound()

  const first = loaded.blocks[0]
  redirect(first ? `/courses/${id}/content/${first.id}` : `/courses/${id}`)
}
