import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/constants'
import type { LearnerProfileInitial } from '@/components/learner/learner-profile-form'

/** Loads the signed-in learner's profile into the builder's shape. */
export async function loadLearnerProfile(): Promise<LearnerProfileInitial | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: account }, { data: profile }, { data: skills }, { data: certifications }] =
    await Promise.all([
      supabase.from('users').select('full_name, email').eq('id', user.id).maybeSingle(),
      supabase.from('learner_profiles').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('learner_skills').select('skill').eq('user_id', user.id),
      supabase
        .from('learner_certifications')
        .select('name, file_url, visible_on_portfolio')
        .eq('user_id', user.id)
        .order('created_at'),
    ])

  const fullName = account?.full_name ?? ''

  // If the learner was invited by a business, show that employer's name and
  // keep the field locked (learner_profiles.employer_locked).
  let employerName = profile?.employer_name ?? ''
  if (profile?.employer_business_id && !employerName) {
    const { data: employer } = await supabase
      .from('businesses')
      .select('name')
      .eq('id', profile.employer_business_id)
      .maybeSingle()
    employerName = employer?.name ?? ''
  }

  return {
    userId: user.id,
    email: account?.email ?? user.email ?? '',
    fullName,
    dateOfBirth: profile?.date_of_birth ?? '',
    avatarUrl: profile?.avatar_url ?? null,
    bio: profile?.bio ?? '',
    employed: profile?.employed ?? null,
    jobTitle: profile?.job_title ?? '',
    yearsExperience: profile?.years_experience ?? '',
    employerName,
    employerLocked: profile?.employer_locked ?? false,
    phoneCountryCode: profile?.phone_country_code ?? '',
    phone: profile?.phone ?? '',
    preferredLanguage: profile?.preferred_language ?? '',
    timezone: profile?.timezone ?? '',
    skills: (skills ?? []).map((s) => s.skill),
    certifications: (certifications ?? []).map((c) => ({
      name: c.name,
      file_url: c.file_url,
      visible_on_portfolio: c.visible_on_portfolio,
    })),
    publicPortfolio: profile?.public_portfolio ?? false,
    portfolioSlug:
      profile?.portfolio_slug ?? `${slugify(fullName) || 'you'}-${user.id.slice(0, 6)}`,
  }
}
