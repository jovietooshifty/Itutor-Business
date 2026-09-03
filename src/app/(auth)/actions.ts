'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { REMEMBER_COOKIE } from '@/lib/supabase/cookies'

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

const EMAIL_RE = /^\S+@\S+\.\S+$/

/**
 * Supabase's signUp() never errors for an email that's already registered —
 * it returns 200 with a user whose `identities` array is empty instead, so
 * it doesn't leak which emails exist. Callers must check for this themselves,
 * or the caller ends up on the "check your inbox" screen for a code that will
 * never arrive.
 */
function isAlreadyRegistered(user: User | null) {
  return !!user && user.identities?.length === 0
}

const ALREADY_REGISTERED_RESULT: ActionResult = {
  ok: false,
  error: 'An account with this email already exists.',
  fieldErrors: { email: 'An account with this email already exists. Log in instead.' },
}

/* ── Step 1: create the preliminary account ─────────────────────────────── */

export async function signUpBusiness(input: {
  orgName: string
  position: string
  email: string
  password: string
  confirmPassword: string
  rememberMe?: boolean
}): Promise<ActionResult> {
  const fieldErrors: Record<string, string> = {}
  if (!input.orgName.trim()) fieldErrors.orgName = 'Enter your organization name'
  if (!input.position.trim()) fieldErrors.position = 'Select or enter your role'
  if (!EMAIL_RE.test(input.email)) fieldErrors.email = 'Enter a valid email address'
  if (input.password.length < 8) fieldErrors.password = 'Use at least 8 characters'
  if (input.confirmPassword !== input.password)
    fieldErrors.confirmPassword = "Passwords don't match"

  if (Object.keys(fieldErrors).length) {
    return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors }
  }

  // Recorded now so the session created after email verification already
  // honours it.
  await rememberPreference(input.rememberMe !== false)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      data: {
        user_type: 'business_owner',
        org_name: input.orgName.trim(),
        position: input.position.trim(),
      },
    },
  })

  if (error) return { ok: false, error: error.message }
  if (isAlreadyRegistered(data.user)) return ALREADY_REGISTERED_RESULT
  return { ok: true }
}

export async function signUpLearner(input: {
  email: string
  password: string
  confirmPassword: string
  dateOfBirth: string
  rememberMe?: boolean
}): Promise<ActionResult> {
  const fieldErrors: Record<string, string> = {}
  if (!EMAIL_RE.test(input.email)) fieldErrors.email = 'Enter a valid email address'
  if (input.password.length < 8) fieldErrors.password = 'Use at least 8 characters'
  if (input.confirmPassword !== input.password)
    fieldErrors.confirmPassword = "Passwords don't match"
  if (!input.dateOfBirth) fieldErrors.dateOfBirth = 'Enter your date of birth'

  if (Object.keys(fieldErrors).length) {
    return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors }
  }

  await rememberPreference(input.rememberMe !== false)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      data: { user_type: 'learner', date_of_birth: input.dateOfBirth },
    },
  })

  if (error) return { ok: false, error: error.message }
  if (isAlreadyRegistered(data.user)) return ALREADY_REGISTERED_RESULT
  return { ok: true }
}

/* ── Step 1½: email verification ────────────────────────────────────────── */

export async function verifyEmailCode(input: {
  email: string
  code: string
}): Promise<ActionResult<{ userType: string }>> {
  if (!/^\d{6}$/.test(input.code)) {
    return { ok: false, error: 'Enter the 6-digit code from your email.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    email: input.email,
    token: input.code,
    type: 'signup',
  })

  if (error) return { ok: false, error: error.message }
  if (!data.user) return { ok: false, error: 'Verification failed. Request a new code.' }

  const userType = (data.user.user_metadata?.user_type as string) ?? 'learner'
  return { ok: true, data: { userType } }
}

export async function resendVerification(email: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm` },
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

/**
 * Finishes a team invite. The invite link already signed them in, but the
 * account Supabase created for them has no password — without one they could
 * never get back in after this session expires.
 */
export async function acceptInvite(input: {
  fullName: string
  password: string
  confirmPassword: string
}): Promise<ActionResult> {
  const fieldErrors: Record<string, string> = {}
  if (!input.fullName.trim()) fieldErrors.fullName = 'Enter your name'
  if (input.password.length < 8) fieldErrors.password = 'Use at least 8 characters'
  if (input.confirmPassword !== input.password) {
    fieldErrors.confirmPassword = "Passwords don't match"
  }
  if (Object.keys(fieldErrors).length) {
    return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Your invite link has expired. Ask for a new one.' }

  const { error } = await supabase.auth.updateUser({
    password: input.password,
    data: { full_name: input.fullName.trim() },
  })
  if (error) return { ok: false, error: error.message }

  const { error: profileError } = await supabase
    .from('users')
    .update({ full_name: input.fullName.trim() })
    .eq('id', user.id)
  if (profileError) return { ok: false, error: profileError.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}

/* ── Sign in / out ──────────────────────────────────────────────────────── */

/**
 * Records whether this browser should stay signed in after it closes.
 *
 * The flag itself is always a persistent cookie — otherwise it would vanish
 * with the session it is meant to describe, and the next sign-in would forget
 * the choice. It is the AUTH cookies that become session cookies; see
 * lib/supabase/cookies.ts.
 */
async function rememberPreference(remember: boolean) {
  const store = await cookies()
  store.set(REMEMBER_COOKIE, remember ? 'true' : 'false', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })
}

export async function signIn(input: {
  email: string
  password: string
  rememberMe?: boolean
}): Promise<ActionResult<{ userType: string }>> {
  // Written BEFORE signing in, because the sign-in is what sets the auth
  // cookies and createClient() reads this to decide their lifetime.
  await rememberPreference(input.rememberMe !== false)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  })

  if (error) return { ok: false, error: error.message }

  const { data: profile } = await supabase
    .from('users')
    .select('user_type')
    .eq('id', data.user.id)
    .single()

  revalidatePath('/', 'layout')
  return { ok: true, data: { userType: profile?.user_type ?? 'learner' } }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

/* ── Password reset ────────────────────────────────────────────────────── */

/**
 * Sends a reset link. Always reports success: whether an address has an
 * account is not something an unauthenticated caller should be able to probe,
 * and Supabase's own response is deliberately uninformative for the same
 * reason.
 */
export async function requestPasswordReset(email: string): Promise<ActionResult> {
  if (!EMAIL_RE.test(email.trim())) {
    return { ok: false, error: 'Enter a valid email address.' }
  }

  const supabase = await createClient()
  // `next` is read back by /auth/confirm. A recovery link can come back as
  // either a code exchange or a token_hash depending on the flow, and only one
  // of those carries a `type` we could branch on — so the destination travels
  // on the link itself rather than being inferred at the other end.
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm?next=/reset-password`,
  })

  /*
   * Whether the address has an account stays hidden — but a send that failed
   * for a reason having nothing to do with the account must not be reported as
   * success. Rate limits and SMTP failures are project-wide facts, identical
   * for a registered address and an unknown one, so surfacing them leaks
   * nothing while turning "the email never arrived" from a mystery into a
   * message. Supabase's shared mailer allows only a couple of sends an hour,
   * which is exactly the case this was hiding.
   */
  if (error) {
    console.error('[requestPasswordReset]', error.status, error.message)

    const status = error.status ?? 0
    const rateLimited = status === 429 || /rate limit|too many/i.test(error.message)

    return {
      ok: false,
      error: rateLimited
        ? 'Too many emails have been sent recently. Wait a few minutes and try again.'
        : 'We could not send the email just now. Try again shortly.',
    }
  }

  return { ok: true }
}

/**
 * Sets the new password. The recovery link already established a session, so
 * this is an ordinary updateUser — there is no token to pass, and if the link
 * has expired there is no session and nothing to update.
 */
export async function resetPassword(input: {
  password: string
  confirmPassword: string
}): Promise<ActionResult> {
  const fieldErrors: Record<string, string> = {}
  if (input.password.length < 8) fieldErrors.password = 'Use at least 8 characters'
  if (input.confirmPassword !== input.password) {
    fieldErrors.confirmPassword = "Passwords don't match"
  }
  if (Object.keys(fieldErrors).length) {
    return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { ok: false, error: 'That reset link has expired. Request a new one.' }
  }

  const { error } = await supabase.auth.updateUser({ password: input.password })
  if (error) return { ok: false, error: error.message }

  revalidatePath('/', 'layout')
  return { ok: true }
}
