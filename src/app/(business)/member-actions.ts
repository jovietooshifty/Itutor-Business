'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/app/(auth)/actions'

export async function saveMemberProfile(input: {
  fullName: string
  avatarUrl: string | null
  bio: string
  jobTitle: string
  phoneCountryCode: string
  phone: string
  preferredLanguage: string
}): Promise<ActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  const { error: userError } = await supabase
    .from('users')
    .update({ full_name: input.fullName.trim() || null })
    .eq('id', user.id)
  if (userError) return { ok: false, error: userError.message }

  const { error } = await supabase.from('member_profiles').upsert({
    user_id: user.id,
    avatar_url: input.avatarUrl,
    bio: input.bio.trim() || null,
    job_title: input.jobTitle.trim() || null,
    phone_country_code: input.phoneCountryCode || null,
    phone: input.phone.trim() || null,
    preferred_language: input.preferredLanguage || null,
  })
  if (error) return { ok: false, error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/my-profile')
  return { ok: true }
}
