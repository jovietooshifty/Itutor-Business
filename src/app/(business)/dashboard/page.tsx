import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BarChart3, BookOpen, CheckCircle2, PlusCircle, Users } from 'lucide-react'
import { Badge, Button, Card, ProgressBar } from '@/components/ui'
import { CompanyGateBanner } from '@/components/business/company-gate-banner'
import { getBusinessContext } from '@/lib/business'
import { loadCompanyGate } from '@/lib/company-gate'
import { loadCompletionRate } from '@/lib/metrics'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Dashboard — iTutor Business' }

export default async function DashboardPage() {
  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const supabase = await createClient()

  const [{ count: teamCount }, { count: courseCount }, { data: business }, { data: memberProfile }, completion, gate] =
    await Promise.all([
      supabase
        .from('business_members')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', context.businessId),
      supabase
        .from('courses')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', context.businessId),
      supabase.from('businesses').select('name, description').eq('id', context.businessId).maybeSingle(),
      supabase
        .from('member_profiles')
        .select('avatar_url, bio, job_title, phone, preferred_language')
        .eq('user_id', context.userId)
        .maybeSingle(),
      loadCompletionRate(context.businessId),
      loadCompanyGate(context.businessId),
    ])

  // "Complete your personal profile" banner, driven by the same five checks
  // the member profile builder scores itself on.
  const memberChecks = [
    !!context.fullName?.trim(),
    !!memberProfile?.bio?.trim(),
    !!memberProfile?.job_title?.trim(),
    !!memberProfile?.phone?.trim(),
    !!memberProfile?.preferred_language,
  ]
  const memberDone = memberChecks.filter(Boolean).length
  const memberPct = (memberDone / memberChecks.length) * 100
  const memberLabel = `${memberDone}/${memberChecks.length} complete`

  const invitedCount = (teamCount ?? 1) - 1

  return (
    <main className="mx-auto max-w-[960px] p-10">
      <CompanyGateBanner
        gate={gate}
        action="create courses or invite your team"
        className="mb-5"
      />

      {/* "You're all set" is only true once the profile actually clears the
          gate. It used to appear precisely when the description was empty,
          so a brand-new account was congratulated and blocked at the same
          time — and now would be told both things in adjacent banners. */}
      {gate.complete && (courseCount ?? 0) === 0 && (
        <div className="mb-5 flex items-center gap-3.5 rounded-xl border border-[color:color-mix(in_oklab,var(--brand)_30%,transparent)] bg-brand-light px-5 py-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-itutor-green text-white">
            <CheckCircle2 size={20} />
          </span>
          <div>
            <p className="m-0 text-base font-bold text-forest">Your company is live!</p>
            <p className="m-0 mt-0.5 text-sm text-forest/80">
              You&apos;re all set — start inviting your team and building courses right away.
            </p>
          </div>
        </div>
      )}

      {memberDone === 0 && (
        <div className="mb-5 rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div>
              <p className="m-0 text-base font-bold text-ink">Complete your personal profile</p>
              <p className="m-0 mt-0.5 text-sm text-ink-muted">
                Add a photo, bio and contact info so your team can recognize you once messaging
                launches.
              </p>
            </div>
            <Link href="/my-profile">
              <Button>Complete your profile</Button>
            </Link>
          </div>
          <ProgressBar value={memberPct} />
        </div>
      )}

      {memberDone > 0 && memberDone < memberChecks.length && (
        <div className="mb-5 flex items-center gap-4 rounded-xl border border-border bg-surface-soft px-5 py-3.5 opacity-75">
          <div className="flex-1">
            <p className="m-0 mb-1.5 text-sm font-semibold text-ink-muted">
              Personal profile — {memberLabel}
            </p>
            <ProgressBar value={memberPct} height={6} className="max-w-[200px]" />
          </div>
          <Link
            href="/my-profile"
            className="whitespace-nowrap text-xs font-semibold text-[var(--itutor-green)]"
          >
            Finish up →
          </Link>
        </div>
      )}

      <h1 className="m-0 mb-1 font-display text-[28px] font-bold text-ink">
        Welcome, {business?.name || context.businessName}
      </h1>
      <p className="m-0 mb-8 text-sm text-ink-muted">
        Here are your next steps to get training underway.
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Team members" value={String(teamCount ?? 0)} icon={<Users size={18} />} />
        <StatCard label="Courses created" value={String(courseCount ?? 0)} icon={<BookOpen size={18} />} />
        <StatCard
          label="Completion rate"
          value={completion.pct === null ? '—' : `${completion.pct}%`}
          hint={
            completion.pct === null
              ? 'No enrolments yet'
              : `${completion.completed} of ${completion.total} finished`
          }
          icon={<BarChart3 size={18} />}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-7">
          <span className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-[#ede9fe] text-[#7c3aed]">
            <Users size={20} />
          </span>
          <h3 className="m-0 mb-2 text-h4 font-bold text-ink">Invite your team</h3>
          <p className="m-0 mb-5 text-sm leading-relaxed text-[#6b7280]">
            Send invites to your contractors so they can start training.
          </p>
          {invitedCount > 0 ? (
            <div className="flex items-center gap-2.5">
              <Badge tone="success">{invitedCount} invited</Badge>
              <Button variant="secondary" disabled={context.role !== 'admin' || !gate.complete}>
                Invite more
              </Button>
            </div>
          ) : (
            <Button disabled={context.role !== 'admin' || !gate.complete}>Invite team</Button>
          )}
        </Card>

        <Card className="p-7">
          <span className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-brand-light text-[var(--itutor-green)]">
            <PlusCircle size={20} />
          </span>
          <h3 className="m-0 mb-2 text-h4 font-bold text-ink">Create your first course</h3>
          <p className="m-0 mb-5 text-sm leading-relaxed text-[#6b7280]">
            Build a course from scratch, or start with a template.
          </p>
          {gate.complete ? (
            <Link href="/courses/new">
              <Button disabled={context.role === 'auditor'}>Create a course</Button>
            </Link>
          ) : (
            // Not a link at all while the profile is short — a disabled button
            // inside an <a> is still navigable.
            <Button disabled>Create a course</Button>
          )}
        </Card>
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: string
  /** Small line under the figure — what it is a share of, or why it is a dash. */
  hint?: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-sm">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-inset text-ink-muted">
        {icon}
      </span>
      <div>
        <p className="m-0 text-xs font-semibold uppercase tracking-eyebrow text-ink-muted">
          {label}
        </p>
        <p className="m-0 font-display text-2xl font-bold text-ink">{value}</p>
        {hint && <p className="m-0 mt-0.5 text-xs text-[#9ca3af]">{hint}</p>}
      </div>
    </div>
  )
}
