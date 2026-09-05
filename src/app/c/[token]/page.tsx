import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, Lock } from 'lucide-react'
import { Badge, Button } from '@/components/ui'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'
import { CompanyPanel } from '@/components/company-panel'
import { loadCompanyPanel } from '@/lib/company-panel'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Course — iTutor' }

/**
 * A course share link. Public to anyone holding the token, signed in or not —
 * course_by_share_token() is SECURITY DEFINER for exactly this, resolving one
 * course without granting any table-wide read of private rows. It only returns
 * published courses, so a draft's link stays inert until it goes live.
 */
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const supabase = await createClient()
  const { data } = await supabase.rpc('course_by_share_token', { p_token: token })
  const course = data?.[0]
  if (!course) notFound()

  /* Who is asking. This page used to print course.business_name and nothing
     else, which is not enough to decide whether to hand over a resume. */
  const company = await loadCompanyPanel(course.business_id)

  const outcomes = course.what_you_will_learn ?? []

  return (
    <main className="min-h-screen bg-mint-wash font-sans">
      <header className="px-6 py-6 md:px-10">
        <Logo href={PUBLIC_HOME} />
      </header>

      <div className="mx-auto max-w-[760px] px-6 pb-16 md:px-10">
        <div className="rounded-3xl bg-white p-8 shadow-card md:p-10">
          <div className="flex flex-wrap items-center gap-2.5">
            {course.business_name && (
              <span className="text-sm font-semibold text-ink-muted">{course.business_name}</span>
            )}
            {course.visibility === 'private' && (
              <Badge tone="neutral">
                <span className="inline-flex items-center gap-1">
                  <Lock size={11} aria-hidden /> Private
                </span>
              </Badge>
            )}
          </div>

          <h1 className="m-0 mt-2 font-display text-[32px] font-bold leading-tight text-ink">
            {course.title}
          </h1>

          {course.tagline && <p className="m-0 mt-2 text-base text-ink-muted">{course.tagline}</p>}

          {/* The company's banner, which the panel below already shows in full.
              Courses have no artwork of their own any more, so repeating it
              here would just be the same image twice on one screen. */}

          {course.description && (
            <p className="mt-6 text-[15px] leading-relaxed text-ink">{course.description}</p>
          )}

          {outcomes.length > 0 && (
            <div className="mt-7 border-t border-border pt-6">
              <h2 className="m-0 mb-3 font-display text-lg font-bold text-ink">
                What you&apos;ll learn
              </h2>
              <ul className="m-0 grid list-none gap-2 p-0">
                {outcomes.map((outcome, index) => (
                  <li key={`${outcome}-${index}`} className="flex items-start gap-2.5 text-sm text-ink">
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-[var(--itutor-green)]"
                      aria-hidden
                    />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
            {/* Enrolling is the course player's job (build step 8); until then
                this gets them an account, which they need either way. */}
            <Link href="/learner/signup" className="no-underline">
              <Button size="lg">Sign up to enrol</Button>
            </Link>
            <Link href="/login" className="no-underline">
              <Button variant="secondary" size="lg">
                Log in
              </Button>
            </Link>
          </div>
        </div>

        {company && (
          <div className="mt-5">
            <CompanyPanel company={company} />
          </div>
        )}
      </div>
    </main>
  )
}
