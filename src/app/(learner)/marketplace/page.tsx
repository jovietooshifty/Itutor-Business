import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { MarketplaceGrid, type MarketplaceCourse } from '@/components/learner/marketplace-grid'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Browse courses — iTutor' }

/**
 * The learner marketplace. What is listed here is decided entirely by RLS:
 * courses_select_public returns public + published rows, and
 * courses_select_enrolled adds anything this learner has already joined — so a
 * private course they were given a link to stays visible once they are in it,
 * without ever being listed for anyone else.
 */
export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: courses, error }, { data: enrollments }] = await Promise.all([
    supabase
      .from('courses')
      /* course_blocks is disambiguated by foreign key: courses.build_block_id
         gives a second relationship between these tables, which makes a bare
         embed ambiguous and fails the query outright. */
      .select(
        'id, title, description, thumbnail_url, duration_label, businesses(name, cover_url), course_tags(tag), course_blocks!course_blocks_course_id_fkey(id)'
      )
      .order('updated_at', { ascending: false }),
    supabase.from('enrollments').select('course_id').eq('learner_id', user.id),
  ])

  if (error) throw new Error(`Could not load the marketplace: ${error.message}`)

  const enrolledIds = new Set((enrollments ?? []).map((e) => e.course_id))

  const rows: MarketplaceCourse[] = (courses ?? []).map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    /* Falls back to the provider's cover image so no card is ever blank.
       A course thumbnail_url always wins. */
    thumbnailUrl:
      course.thumbnail_url ??
      (course.businesses as { cover_url: string | null } | null)?.cover_url ??
      null,
    durationLabel: course.duration_label,
    businessName: (course.businesses as { name: string } | null)?.name ?? 'iTutor',
    tags: ((course.course_tags as { tag: string }[] | null) ?? []).map((t) => t.tag),
    blockCount: ((course.course_blocks as { id: string }[] | null) ?? []).length,
    enrolled: enrolledIds.has(course.id),
  }))

  return (
    <main className="mx-auto max-w-[1120px] p-6 md:p-10">
      <h1 className="m-0 mb-1.5 font-display text-[30px] font-bold text-ink">Browse courses</h1>
      <p className="m-0 mb-7 text-base text-ink-muted">
        Explore what&apos;s available, or continue where you left off.
      </p>

      <MarketplaceGrid courses={rows} />
    </main>
  )
}
