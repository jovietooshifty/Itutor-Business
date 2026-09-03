import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Every email link lands here — signup confirmation, team invites and password
 * recovery — and Supabase does not hand them all back the same way.
 *
 *  - `token_hash` + `type`: verifyOtp. What the signup and invite templates
 *    send.
 *  - `code`: exchangeCodeForSession. What PKCE sends, and what
 *    resetPasswordForEmail produced — the recovery link arrived with no
 *    token_hash at all and this route turned it away as "missing_token",
 *    which is why the reset link appeared to send fine and then do nothing.
 *
 * `next` is our own parameter, put on the redirectTo when the link is
 * created. It survives either flow, so where someone lands does not depend on
 * which one Supabase chose.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')

  // Only ever a path on this origin — never an absolute URL, or this becomes
  // an open redirect.
  const nextParam = searchParams.get('next')
  const next = nextParam?.startsWith('/') ? nextParam : null

  const supabase = await createClient()

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error || !data.user) {
      return NextResponse.redirect(`${origin}/login?error=invalid_or_expired_link`)
    }
    return NextResponse.redirect(`${origin}${next ?? (await landingFor(data.user.id))}`)
  }

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/login?error=missing_token`)
  }

  const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })
  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=invalid_or_expired_link`)
  }

  // A recovery link is not onboarding — it belongs to someone who already has
  // an account and cannot get into it. The verify above is what gives them the
  // session that lets them set a new password.
  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}${next ?? '/reset-password'}`)
  }

  return NextResponse.redirect(`${origin}${next ?? (await landingFor(data.user.id))}`)
}

/** Step 2 of 2 for whichever kind of account just confirmed. */
async function landingFor(userId: string): Promise<string> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', userId)
    .maybeSingle()

  // A company_member got here from a team invite, not a signup form: they are
  // joining a business that already exists, and the invite gave them an
  // account with no password. Both make the company-profile builder the wrong
  // destination.
  if (profile?.user_type === 'company_member') return '/invite/accept'
  if (profile?.user_type === 'learner') return '/learner/signup/profile'
  return '/business/signup/profile'
}
