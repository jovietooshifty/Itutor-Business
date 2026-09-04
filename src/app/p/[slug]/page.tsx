import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BadgeCheck } from 'lucide-react'
import { Avatar, Badge, Card } from '@/components/ui'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Portfolio — iTutor',
  /* A portfolio is private by being unguessable, and an unguessable link that
     Google has crawled is not unguessable. Paired with the /p/ disallow in
     robots.ts — the meta tag is what stops a crawler that ignores the file. */
  robots: { index: false, follow: false },
}

/**
 * A learner's public portfolio (handoff flow 10). No account needed.
 *
 * The profile and its certificates come from portfolio_by_slug() and
 * portfolio_certificates(), which exist because the row policies alone cannot
 * express the joins this needs — the learner's name and each certificate's
 * course both live in tables anon cannot read. Those functions also decide
 * what "public" means here: no phone, no timezone, no employer.
 *
 * Skills come straight from the table, which has its own public-portfolio
 * policy.
 */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const supabase = await createClient()
  const [{ data: profiles }, { data: certificates }] = await Promise.all([
    supabase.rpc('portfolio_by_slug', { p_slug: slug }),
    supabase.rpc('portfolio_certificates', { p_slug: slug }),
  ])

  const profile = profiles?.[0]
  // A private or unknown portfolio is a 404 either way: whether the person
  // exists but is private is not something a visitor should be able to tell.
  if (!profile) notFound()

  const { data: skills } = await supabase
    .from('learner_skills')
    .select('skill')
    .eq('user_id', profile.user_id)

  const certs = certificates ?? []

  return (
    <main className="min-h-screen bg-mint-wash font-sans">
      <header className="px-6 py-6 md:px-10">
        <Logo href={PUBLIC_HOME} />
      </header>

      <div className="mx-auto max-w-[760px] px-6 pb-16 md:px-10">
        <Card className="p-7 md:p-9">
          <div className="flex flex-wrap items-center gap-5">
            <Avatar name={profile.full_name ?? 'Learner'} src={profile.avatar_url} size={72} />
            <div className="min-w-0">
              <h1 className="m-0 font-display text-[28px] font-bold leading-tight text-ink">
                {profile.full_name}
              </h1>
              {profile.job_title && (
                <p className="m-0 mt-1 text-sm text-ink-muted">
                  {profile.job_title}
                  {profile.years_experience ? ` · ${profile.years_experience}` : ''}
                </p>
              )}
            </div>
          </div>

          {profile.bio && (
            <p className="mt-5 text-[15px] leading-relaxed text-ink">{profile.bio}</p>
          )}

          {(skills ?? []).length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {(skills ?? []).map((s) => (
                <Badge key={s.skill} tone="neutral">
                  {s.skill}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        <h2 className="mb-3 mt-7 font-display text-lg font-bold text-ink">
          Certificates{certs.length > 0 && ` (${certs.length})`}
        </h2>

        {certs.length === 0 ? (
          <Card className="py-10 text-center">
            <p className="m-0 text-sm text-ink-muted">
              No certificates are being shown on this portfolio.
            </p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {certs.map((cert) => (
              <Card key={cert.certificate_id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="m-0 font-display text-base font-bold text-ink">
                      {cert.course_title}
                    </p>
                    <p className="m-0 mt-0.5 text-sm text-ink-muted">{cert.business_name}</p>
                    <p className="m-0 mt-1 text-xs text-[#9ca3af]">
                      Issued {new Date(cert.issued_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/verify/${cert.certificate_id}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[color:var(--itutor-green)] px-3.5 py-1.5 text-xs font-semibold text-[var(--itutor-green)] no-underline hover:bg-brand-light"
                  >
                    <BadgeCheck size={13} aria-hidden /> Verify
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
