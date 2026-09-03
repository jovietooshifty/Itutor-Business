import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ResetPasswordForm } from './form'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Set a new password — iTutor Business' }

/**
 * Where a recovery link lands after /auth/confirm verifies it. That link is
 * what establishes the session, so arriving here without one means it has
 * already been used or has expired — there is nothing to reset.
 */
export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/forgot-password?error=expired')

  const { data: profile } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <main className="flex min-h-screen items-center justify-center bg-forest p-5 font-sans md:p-8">
      <div className="w-full max-w-[440px] rounded-3xl bg-white px-8 py-10 shadow-card md:px-10">
        <div className="mb-7">
          <Logo href={PUBLIC_HOME} />
        </div>

        <h1 className="m-0 font-display text-[26px] font-bold tracking-heading text-ink">
          Set a new password
        </h1>
        <p className="mb-6 mt-1.5 text-sm text-[#6b7280]">
          You&apos;re signed in as <span className="font-semibold text-ink">{user.email}</span>.
          Choose a new password to finish.
        </p>

        <ResetPasswordForm userType={profile?.user_type ?? 'learner'} />

        <p className="m-0 mt-6 border-t border-border pt-5 text-center text-sm text-[#6b7280]">
          <Link href="/login" className="font-semibold text-[var(--itutor-green)] underline">
            Back to log in
          </Link>
        </p>
      </div>
    </main>
  )
}
