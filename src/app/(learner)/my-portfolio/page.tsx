import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import {
  PortfolioControls,
  type PortfolioCertificate,
} from '@/components/learner/portfolio-controls'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'My portfolio — iTutor' }

type CertificateRow = {
  certificate_id: string
  issued_at: string
  visible_on_portfolio: boolean
  enrollments: { courses: { title: string; businesses: { name: string } | null } | null } | null
}

/**
 * The learner's own portfolio management (handoff flow 10). Reads through the
 * learner's own session — certificates_select_learner and
 * enrollments_select_learner cover their own records, so the course titles
 * come straight out of the join. The PUBLIC page cannot do that, which is why
 * it goes through portfolio_certificates() instead.
 */
export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: certificates }] = await Promise.all([
    supabase
      .from('learner_profiles')
      .select('portfolio_slug')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('certificates')
      .select(
        'certificate_id, issued_at, visible_on_portfolio, enrollments(courses(title, businesses(name)))'
      )
      .order('issued_at', { ascending: false }),
  ])

  const rows: PortfolioCertificate[] = ((certificates ?? []) as unknown as CertificateRow[]).map(
    (cert) => ({
      certificateId: cert.certificate_id,
      issuedAt: cert.issued_at,
      visible: cert.visible_on_portfolio,
      courseTitle: cert.enrollments?.courses?.title ?? 'Course',
      businessName: cert.enrollments?.courses?.businesses?.name ?? 'iTutor',
    })
  )

  return (
    <main className="mx-auto max-w-[820px] p-6 md:p-10">
      <h1 className="m-0 font-display text-[28px] font-bold text-ink">My portfolio</h1>
      <p className="m-0 mb-6 mt-1 text-sm text-ink-muted">
        Share your link, and choose which certificates it shows.
      </p>

      <PortfolioControls slug={profile?.portfolio_slug ?? null} certificates={rows} />
    </main>
  )
}
