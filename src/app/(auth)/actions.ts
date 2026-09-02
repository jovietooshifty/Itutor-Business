'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

const EMAIL_RE = /^\S+@\S+\.\S+$/

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
  const { error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: {
        user_type: 'business_owner',
        org_name: input.orgName.trim(),
        position: input.position.trim(),
      },
    },
  })

  if (error) return { ok: false, error: error.message }
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
  const { error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: { user_type: 'learner', date_of_birth: input.dateOfBirth },
    },
  })

  if (error) return { ok: false, error: error.message }
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
  const { error } = await supabase.auth.resend({ type: 'signup', email })
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
