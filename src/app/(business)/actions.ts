'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database'
import type { ActionResult } from '@/app/(auth)/actions'

type BusinessType = Database['public']['Enums']['business_type']

export type LocationInput = {
  street: string
  city: string
  region: string
  country: string
}

export type CertificationInput = {
  name: string
  file_url: string | null
}

export type CompanyProfileInput = {
  name: string
  industry: string
  description: string
  tagline: string
  companySize: string
  yearFounded: string
  businessType: string
  website: string
  contactPhone: string
  contactEmail: string
  timezone: string
  logoUrl: string | null
  stampUrl: string | null
  coverUrl: string | null
  locations: LocationInput[]
  certifications: CertificationInput[]
  languages: string[]
}

/** Resolves the business the signed-in user administers, plus their role. */
export async function getCurrentBusinessContext() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: membership } = await supabase
    .from('business_members')
    .select('business_id, role, status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle()

  if (!membership) return null

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', membership.business_id)
    .single()

  return { user, business, role: membership.role }
}

export async function saveCompanyProfile(
  businessId: string,
  input: CompanyProfileInput
): Promise<ActionResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  if (!input.name.trim()) {
    return {
      ok: false,
      error: 'Company name is required.',
      fieldErrors: { name: 'Enter your company name' },
    }
  }

  const year = parseInt(input.yearFounded, 10)
  const businessType = ['independent', 'franchise', 'chain'].includes(input.businessType)
    ? (input.businessType as BusinessType)
    : null

  // RLS (businesses_update_admin) is what actually enforces Admin-only here —
  // a non-admin's update matches no rows and comes back as a 0-row result.
  const { error: updateError, count } = await supabase
    .from('businesses')
    .update(
      {
        name: input.name.trim(),
        industry: input.industry || null,
        description: input.description.trim() || null,
        tagline: input.tagline.trim() || null,
        company_size: input.companySize || null,
        year_founded: Number.isFinite(year) ? year : null,
        business_type: businessType,
        website: input.website.trim() || null,
        contact_phone: input.contactPhone.trim() || null,
        contact_email: input.contactEmail.trim() || null,
        timezone: input.timezone || null,
        logo_url: input.logoUrl,
        stamp_url: input.stampUrl,
        cover_url: input.coverUrl,
      },
      { count: 'exact' }
    )
    .eq('id', businessId)

  if (updateError) return { ok: false, error: updateError.message }
  if (count === 0) {
    return { ok: false, error: 'Only an Admin can edit the company profile.' }
  }

  // Child collections are small and fully re-sent by the form, so replace them.
  const meaningfulLocations = input.locations.filter(
    (l) => l.street.trim() || l.city.trim() || l.region.trim() || l.country.trim()
  )
  await supabase.from('business_locations').delete().eq('business_id', businessId)
  if (meaningfulLocations.length) {
    const { error } = await supabase.from('business_locations').insert(
      meaningfulLocations.map((l, i) => ({
        business_id: businessId,
        street: l.street.trim() || null,
        city: l.city.trim() || null,
        region: l.region.trim() || null,
        country: l.country.trim() || null,
        position: i,
      }))
    )
    if (error) return { ok: false, error: error.message }
  }

  const meaningfulCerts = input.certifications.filter((c) => c.name.trim())
  await supabase.from('business_certifications').delete().eq('business_id', businessId)
  if (meaningfulCerts.length) {
    const { error } = await supabase.from('business_certifications').insert(
      meaningfulCerts.map((c) => ({
        business_id: businessId,
        name: c.name.trim(),
        file_url: c.file_url,
      }))
    )
    if (error) return { ok: false, error: error.message }
  }

  await supabase.from('business_training_languages').delete().eq('business_id', businessId)
  if (input.languages.length) {
    const { error } = await supabase.from('business_training_languages').insert(
      input.languages.map((language) => ({ business_id: businessId, language }))
    )
    if (error) return { ok: false, error: error.message }
  }

  revalidatePath('/company-profile')
  revalidatePath('/dashboard')
  return { ok: true }
}

/** General tab of the settings modal. */
export async function saveGeneralSettings(
  businessId: string,
  input: { name: string; timezone: string }
): Promise<ActionResult> {
  const supabase = await createClient()

  if (!input.name.trim()) {
    return { ok: false, error: 'Company name is required.' }
  }

  const { error, count } = await supabase
    .from('businesses')
    .update({ name: input.name.trim(), timezone: input.timezone || null }, { count: 'exact' })
    .eq('id', businessId)

  if (error) return { ok: false, error: error.message }
  if (count === 0) return { ok: false, error: 'Only an Admin can change company settings.' }

  revalidatePath('/dashboard')
  revalidatePath('/company-profile')
  return { ok: true }
}

/** Account tab — email and password live in Supabase Auth, not our tables. */
export async function saveAccountSettings(input: {
  email: string
  newPassword: string
}): Promise<ActionResult> {
  const supabase = await createClient()

  const payload: { email?: string; password?: string } = {}
  if (input.email.trim()) payload.email = input.email.trim()
  if (input.newPassword) {
    if (input.newPassword.length < 8) {
      return { ok: false, error: 'New password must be at least 8 characters.' }
    }
    payload.password = input.newPassword
  }
  if (!Object.keys(payload).length) return { ok: true }

  const { error } = await supabase.auth.updateUser(payload)
  if (error) return { ok: false, error: error.message }

  revalidatePath('/dashboard')
  return { ok: true }
}

export async function saveNotificationPrefs(
  businessId: string,
  input: {
    notify_course_complete: boolean
    notify_signups: boolean
    notify_product_updates: boolean
  }
): Promise<ActionResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  const { error } = await supabase
    .from('business_notification_prefs')
    .upsert({ business_id: businessId, user_id: user.id, ...input })

  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard')
  return { ok: true }
}
