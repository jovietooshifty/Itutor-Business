import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
 * Local-only escape hatch: mirrors the one in supabase/middleware.ts. When
 * active, getBusinessContext() below returns a fake context instead of
 * hitting Supabase, so layouts/pages that redirect on null render normally.
 * Writes that reference this fake businessId will fail (no matching row in
 * the DB) since this is for browsing, not exercising persistence.
 */
const DEV_AUTH_BYPASS =
  process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

const DEV_BUSINESS_CONTEXT: BusinessContext = {
  userId: 'dev-bypass-user',
  email: 'dev@localhost',
  fullName: 'Dev User',
  businessId: 'dev-bypass-business',
  role: 'admin',
  businessName: 'Dev Business (local bypass)',
}

/**
 * Resolves the signed-in user's active business membership. Returns null when
 * the user has none (which the callers turn into a redirect).
 */
export async function getBusinessContext(): Promise<BusinessContext | null> {
  if (DEV_AUTH_BYPASS) return DEV_BUSINESS_CONTEXT

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  async function activeMembership() {
    const { data } = await supabase
      .from('business_members')
      .select('business_id, role, businesses(name)')
      .eq('user_id', user!.id)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()
    return data
  }

  // Only when there is nothing active is it worth looking for an invite — that
  // is exactly the case the caller is about to turn into a redirect, and it
  // keeps the claim off the path every normal page load takes.
  let membership = await activeMembership()
  if (!membership && (await claimPendingInvite(user.id))) {
    membership = await activeMembership()
  }

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

/**
 * Activates an invite that was addressed to an account which ALREADY existed
 * when it was sent — inviteMember stamps user_id on those rows but leaves them
 * 'invited', and no database trigger covers them: users_claim_pending_invites
 * fires on insert into public.users, which never happens for an existing user.
 * Invites sent to a stranger are that trigger's job, at signup.
 *
 * Needs the service role: the invitee is not a member yet, so
 * business_members_update_admin (Admin-only) would reject the update.
 */
async function claimPendingInvite(userId: string) {
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('business_members')
    .update({
      status: 'active',
      joined_at: new Date().toISOString(),
      // Matches what the trigger leaves behind, so a claimed row looks the
      // same however it got claimed.
      invited_email: null,
    })
    .eq('user_id', userId)
    .eq('status', 'invited')
    .select('id')

  return !error && (data ?? []).length > 0
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
