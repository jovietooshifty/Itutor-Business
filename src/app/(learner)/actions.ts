'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/constants'
import type { ActionResult } from '@/app/(auth)/actions'

export type LearnerCertificationInput = {
  name: string
  file_url: string | null
  visible_on_portfolio: boolean
}

export type LearnerProfileInput = {
  fullName: string
  dateOfBirth: string
  avatarUrl: string | null
  bio: string
  employed: boolean | null
  jobTitle: string
  yearsExperience: string
  employerName: string
  phoneCountryCode: string
  phone: string
  preferredLanguage: string
  timezone: string
  skills: string[]
  certifications: LearnerCertificationInput[]
  publicPortfolio: boolean
}

export async function saveLearnerProfile(input: LearnerProfileInput): Promise<ActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  if (!input.fullName.trim()) {
    return {
      ok: false,
      error: 'Your name is required.',
      fieldErrors: { fullName: 'Enter your full name' },
    }
  }

  const { error: userError } = await supabase
    .from('users')
    .update({ full_name: input.fullName.trim() })
    .eq('id', user.id)
  if (userError) return { ok: false, error: userError.message }

  // Read the existing profile first: employer_business_id is locked when the
  // learner arrived through a business invite and must not be overwritten here.
  const { data: existing } = await supabase
    .from('learner_profiles')
    .select('employer_locked, employer_business_id, portfolio_slug')
    .eq('user_id', user.id)
    .maybeSingle()

  const slug =
    existing?.portfolio_slug ??
    `${slugify(input.fullName) || 'learner'}-${user.id.slice(0, 6)}`

  const { error: profileError } = await supabase.from('learner_profiles').upsert({
    user_id: user.id,
    date_of_birth: input.dateOfBirth || null,
    avatar_url: input.avatarUrl,
    bio: input.bio.trim() || null,
    employed: input.employed,
    job_title: input.employed ? input.jobTitle.trim() || null : null,
    years_experience: input.employed ? input.yearsExperience || null : null,
    employer_name: existing?.employer_locked
      ? undefined
      : input.employed
        ? input.employerName.trim() || null
        : null,
    phone_country_code: input.phoneCountryCode || null,
    phone: input.phone.trim() || null,
    preferred_language: input.preferredLanguage || null,
    timezone: input.timezone || null,
    public_portfolio: input.publicPortfolio,
    portfolio_slug: slug,
  })
  if (profileError) return { ok: false, error: profileError.message }

  await supabase.from('learner_skills').delete().eq('user_id', user.id)
  const skills = [...new Set(input.skills.map((s) => s.trim()).filter(Boolean))]
  if (skills.length) {
    const { error } = await supabase
      .from('learner_skills')
      .insert(skills.map((skill) => ({ user_id: user.id, skill })))
    if (error) return { ok: false, error: error.message }
  }

  await supabase.from('learner_certifications').delete().eq('user_id', user.id)
  const certs = input.certifications.filter((c) => c.name.trim())
  if (certs.length) {
    const { error } = await supabase.from('learner_certifications').insert(
      certs.map((c) => ({
        user_id: user.id,
        name: c.name.trim(),
        file_url: c.file_url,
        visible_on_portfolio: c.visible_on_portfolio,
      }))
    )
    if (error) return { ok: false, error: error.message }
  }

  revalidatePath('/marketplace')
  revalidatePath('/learner/signup/profile')
  return { ok: true }
}
