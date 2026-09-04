import { redirect } from 'next/navigation'

/**
 * The Sequence tab is gone — its editor is on the Overview tab now, which is
 * where a course with three cards' worth of summary above it did not need to
 * be a second click away.
 *
 * The route stays as a redirect because it was linked from several places
 * (block pages' "Save and close", learner-facing bookmarks, the tab bar itself)
 * and a 404 is a worse answer than the page they were after.
 */
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/courses/${id}/manage`)
}
