import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { BlockWalkthrough } from '@/components/business/block-walkthrough'
import { loadWalkthrough } from '@/lib/builder'
import { getBusinessContext } from '@/lib/business'

export const metadata: Metadata = { title: 'Course content — iTutor Business' }

/**
 * Course Builder step 2b — one page for one block.
 *
 * The sequence set on the previous screen is this wizard's route: this page
 * knows its own position in it, and where Back and Continue go, from the block
 * order alone. There is no separate notion of "walkthrough step" to keep in
 * sync — reordering the sequence reorders the walkthrough.
 */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; blockId: string }>
  searchParams: Promise<{ from?: string }>
}) {
  const { id, blockId } = await params
  const { from } = await searchParams

  const context = await getBusinessContext()
  if (!context) redirect('/login')
  if (context.role === 'auditor') redirect('/courses')

  const loaded = await loadWalkthrough(id, blockId)

  // RLS already hides other businesses' courses, so a miss here is a 404 rather
  // than a permission error — but check the owner explicitly so a course that
  // is merely *visible* (a public one) can never be opened in the editor.
  if (!loaded || loaded.course.businessId !== context.businessId) notFound()

  return (
    <BlockWalkthrough
      courseId={loaded.course.id}
      courseTitle={loaded.course.title}
      block={loaded.block}
      index={loaded.index}
      total={loaded.total}
      priorBlocks={loaded.priorBlocks}
      previousBlockId={loaded.previousBlockId}
      nextBlockId={loaded.nextBlockId}
      mode={from === 'manage' ? 'manage' : 'wizard'}
    />
  )
}
