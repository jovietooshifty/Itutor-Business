import type { Metadata } from 'next'
import { CircleAlert } from 'lucide-react'
import { CertificateCard } from '@/components/learner/certificate-card'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Verify a certificate — iTutor' }

/**
 * Public, no-login certificate verification (handoff flow 9). Nothing here
 * requires an account: verify_certificate() is SECURITY DEFINER and granted to
 * anon precisely so an employer can check a certificate without one.
 *
 * An unknown id is a normal answer, not an error — "we have no record of this"
 * is exactly what someone checking a suspicious certificate needs to be told.
 */
export default async function Page({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params

  const supabase = await createClient()
  const { data } = await supabase.rpc('verify_certificate', { p_certificate_id: certificateId })
  const details = data?.[0]

  return (
    <main className="min-h-screen bg-mint-wash font-sans">
      <header className="px-6 py-6 md:px-10 print:hidden">
        <Logo href={PUBLIC_HOME} />
      </header>

      <div className="mx-auto max-w-[720px] px-6 pb-16 md:px-10">
        {details ? (
          <>
            <CertificateCard
              verified
              details={{
                certificateId: details.certificate_id,
                issuedAt: details.issued_at,
                learnerName: details.learner_name,
                courseTitle: details.course_title,
                businessName: details.business_name,
                businessStampUrl: details.business_stamp_url,
              }}
            />
            <p className="mt-5 text-center text-sm text-ink-muted print:hidden">
              This certificate is recorded with iTutor and was issued by{' '}
              <span className="font-semibold text-ink">{details.business_name}</span>.
            </p>
          </>
        ) : (
          <div className="rounded-2xl bg-white px-8 py-12 text-center shadow-card">
            <CircleAlert size={38} className="mx-auto text-danger-fg" aria-hidden />
            <h1 className="m-0 mt-4 font-display text-2xl font-bold text-ink">
              No matching certificate
            </h1>
            <p className="m-0 mt-2 text-sm text-ink-muted">
              We have no record of certificate{' '}
              <span className="font-mono font-semibold text-ink">{certificateId}</span>. Check the
              ID and try again.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
