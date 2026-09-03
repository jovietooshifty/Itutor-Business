'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

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

/* ── Sign in / out ──────────────────────────────────────────────────────── */

export async function signIn(input: {
  email: string
  password: string
}): Promise<ActionResult<{ userType: string }>> {
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
