import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { LogoutButton } from '@/components/auth/logout-button'
import { createClient } from '@/lib/supabase/server'

/**
 * Shell for every signed-in learner screen. The business side has the dark top
 * nav; this side is coral-keyed and much lighter — a learner has two places to
 * be, courses and their portfolio.
 */
export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, email')
    .eq('id', user.id)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-surface-soft font-sans">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border bg-white px-6 py-4 md:px-10">
        <Logo href="/marketplace" accent="coral" />

        <nav className="flex gap-5">
          <Link
            href="/marketplace"
            className="text-sm font-bold text-ink no-underline hover:text-coral"
          >
            Courses
          </Link>
          <Link
            href="/my-portfolio"
            className="text-sm font-semibold text-ink-muted no-underline hover:text-ink"
          >
            My Portfolio
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden text-sm text-ink-muted sm:inline">
            Signed in as {profile?.full_name || profile?.email || user.email}
          </span>
          <Link
            href="/learner/signup/profile"
            className="text-sm font-semibold text-coral no-underline hover:underline"
          >
            Edit profile
          </Link>
          <LogoutButton className="text-ink-muted hover:text-ink" />
        </div>
      </header>

      {children}
    </div>
  )
}
