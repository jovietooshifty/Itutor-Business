import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CertificateCard } from '@/components/learner/certificate-card'
import { CertificateActions } from '@/components/learner/certificate-actions'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Certificate — iTutor' }

/**
 * The holder's view of a certificate. Reads through verify_certificate() —
 * the same source the public page uses — so the two renderings cannot drift,
 * with RLS on certificates deciding whether this person may open the page at
 * all.
 */
export default async function Page({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // certificates_select_learner limits this to the holder (staff and the
  // public portfolio have their own policies).
  const { data: owned } = await supabase
    .from('certificates')
    .select('certificate_id')
    .eq('certificate_id', certificateId.toUpperCase())
    .maybeSingle()
  if (!owned) notFound()

  const { data } = await supabase.rpc('verify_certificate', { p_certificate_id: certificateId })
  const details = data?.[0]
  if (!details) notFound()

  const card = {
    certificateId: details.certificate_id,
    issuedAt: details.issued_at,
    learnerName: details.learner_name,
    courseTitle: details.course_title,
    businessName: details.business_name,
    businessStampUrl: details.business_stamp_url,
  }

  return (
    <main className="mx-auto max-w-[720px] p-6 md:p-10">
      {/* Handoff §7: the certificate screen needs a way back. */}
      <Link
        href="/my-portfolio"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted no-underline hover:text-ink print:hidden"
      >
        <ArrowLeft size={15} aria-hidden /> My portfolio
      </Link>

      <CertificateCard details={card} />

      <div className="mt-6">
        <CertificateActions details={card} />
      </div>
    </main>
  )
}
