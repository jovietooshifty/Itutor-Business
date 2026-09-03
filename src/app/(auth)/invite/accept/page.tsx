import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AcceptInviteForm } from './form'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Join the team — iTutor Business' }

/**
 * Where a team invite lands after /auth/confirm verifies the link. The invitee
 * already has an account and (via the users_claim_pending_invites trigger) an
 * active membership — what they do not have is a password, so this is the one
 * thing standing between them and being able to log in again.
 */
export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // No session means the link was already used or has expired.
  if (!user) redirect('/login?error=invite_expired')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, user_type')
    .eq('id', user.id)
    .maybeSingle()

  // Anyone who did not arrive here from an invite has a normal home to go to.
  if (profile && profile.user_type !== 'company_member') {
    redirect(profile.user_type === 'learner' ? '/marketplace' : '/dashboard')
  }

  const { data: membership } = await supabase
    .from('business_members')
    .select('businesses(name)')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle()

  const businessName = (membership?.businesses as { name: string } | null)?.name

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-mint-wash p-8 font-sans">
      <div className="absolute left-10 top-8">
        <Logo href={PUBLIC_HOME} />
      </div>

      <div className="w-full max-w-[440px] rounded-3xl bg-white px-10 py-11 shadow-card">
        <h1 className="m-0 font-display text-[26px] font-bold tracking-heading text-ink">
          {businessName ? `Join ${businessName}` : 'Join the team'}
        </h1>
        <p className="mb-6 mt-1.5 text-sm text-[#6b7280]">
          Set a password so you can get back in, and you&apos;re done.
        </p>

        <AcceptInviteForm defaultName={profile?.full_name ?? ''} />
      </div>
    </main>
  )
}
