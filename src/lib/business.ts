import { createClient } from '@/lib/supabase/server'
import type { CompanyProfileInitial } from '@/components/business/company-profile-form'
import type { Database } from '@/lib/types/database'

export type MemberRole = Database['public']['Enums']['member_role']

export type BusinessContext = {
  userId: string
  email: string
  fullName: string | null
  businessId: string
  role: MemberRole
  businessName: string
}

/**
 * Resolves the signed-in user's active business membership. Returns null when
 * the user has none (which the callers turn into a redirect).
 */
export async function getBusinessContext(): Promise<BusinessContext | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: membership } = await supabase
    .from('business_members')
    .select('business_id, role, businesses(name)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle()

  if (!membership) return null

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, email')
    .eq('id', user.id)
    .maybeSingle()

  return {
    userId: user.id,
    email: profile?.email ?? user.email ?? '',
    fullName: profile?.full_name ?? null,
    businessId: membership.business_id,
    role: membership.role,
    businessName:
      (membership.businesses as { name: string } | null)?.name ?? 'your company',
  }
}

/** Loads the business plus its child collections into the form's shape. */
export async function loadCompanyProfile(
  businessId: string
): Promise<CompanyProfileInitial | null> {
  const supabase = await createClient()

  const [{ data: business }, { data: locations }, { data: certifications }, { data: languages }] =
    await Promise.all([
      supabase.from('businesses').select('*').eq('id', businessId).maybeSingle(),
      supabase
        .from('business_locations')
        .select('street, city, region, country, position')
        .eq('business_id', businessId)
        .order('position'),
      supabase
        .from('business_certifications')
        .select('name, file_url')
        .eq('business_id', businessId)
        .order('created_at'),
      supabase
        .from('business_training_languages')
        .select('language')
        .eq('business_id', businessId),
    ])

  if (!business) return null

  return {
    businessId,
    name: business.name ?? '',
    industry: business.industry ?? '',
    description: business.description ?? '',
    tagline: business.tagline ?? '',
    companySize: business.company_size ?? '',
    yearFounded: business.year_founded ? String(business.year_founded) : '',
    businessType: business.business_type ?? '',
    website: business.website ?? '',
    contactPhone: business.contact_phone ?? '',
    contactEmail: business.contact_email ?? '',
    timezone: business.timezone ?? '',
    logoUrl: business.logo_url,
    stampUrl: business.stamp_url,
    coverUrl: business.cover_url,
    locations: (locations ?? []).map((l) => ({
      street: l.street ?? '',
      city: l.city ?? '',
      region: l.region ?? '',
      country: l.country ?? '',
    })),
    certifications: (certifications ?? []).map((c) => ({
      name: c.name,
      file_url: c.file_url,
    })),
    languages: (languages ?? []).map((l) => l.language),
  }
}
