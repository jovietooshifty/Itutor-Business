import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Link-based email confirmation.
 *
 * The designed flow is the 6-digit code (see VerifyCard). Supabase's DEFAULT
 * confirmation email only contains {{ .ConfirmationURL }} and does not show
 * the code, and the template cannot be edited on the free tier with the
 * built-in email provider. This route handles that link so signup works as
 * shipped; once a custom SMTP provider is configured and the template
 * includes {{ .Token }}, the code entry path works too. Both call verifyOtp.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/login?error=missing_token`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=invalid_or_expired_link`)
  }

  // Land each account type on its own step 2 of 2.
  const { data: profile } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', data.user.id)
    .maybeSingle()

  // A company_member got here from a team invite, not a signup form: they are
  // joining a business that already exists, and the invite gave them an
  // account with no password. Both make the company-profile builder the wrong
  // destination.
  const destination =
    profile?.user_type === 'company_member'
      ? '/invite/accept'
      : profile?.user_type === 'learner'
        ? '/learner/signup/profile'
        : '/business/signup/profile'

  return NextResponse.redirect(`${origin}${destination}`)
}
