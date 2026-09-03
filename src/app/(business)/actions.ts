'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Database } from '@/lib/types/database'
import type { ActionResult } from '@/app/(auth)/actions'
import type { MemberRole } from '@/lib/business'

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

/* ── Team management ───────────────────────────────────────────────────── */

const EMAIL_RE = /^\S+@\S+\.\S+$/
const ROLES: MemberRole[] = ['admin', 'operator', 'auditor']

/** Every write below is Admin-only; RLS enforces it, this reads better. */
async function requireAdmin(businessId: string): Promise<ActionResult<{ userId: string }>> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'You are not signed in.' }

  const { data: membership } = await supabase
    .from('business_members')
    .select('role')
    .eq('business_id', businessId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (membership?.role !== 'admin') {
    return { ok: false, error: 'Only an Admin can manage the team.' }
  }
  return { ok: true, data: { userId: user.id } }
}

/**
 * Invites someone to the business. The membership row is the thing that
 * actually grants access, so it is always written — the email is a courtesy
 * and a failure to send it does not fail the invite.
 *
 * The row is created as 'invited' either way. If the address already has an
 * account we attach its user_id up front, but activation still happens when
 * they next land in the business area (see claimPendingInvites), so nobody is
 * silently dropped into a business without signing in first.
 */
export async function inviteMember(
  businessId: string,
  input: { email: string; role: MemberRole }
): Promise<ActionResult<{ emailed: boolean }>> {
  const auth = await requireAdmin(businessId)
  if (!auth.ok) return auth

  const email = input.email.trim().toLowerCase()
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: 'Enter a valid email address.', fieldErrors: { email: 'Invalid email' } }
  }
  if (!ROLES.includes(input.role)) return { ok: false, error: 'Pick a role.' }

  const supabase = await createClient()
  const admin = createAdminClient()

  // Existing account? A business admin cannot read users outside their own
  // business, so this lookup has to bypass RLS.
  const { data: existingUser } = await admin
    .from('users')
    .select('id, user_type')
    .ilike('email', email)
    .maybeSingle()

  if (existingUser) {
    // Two cases this app cannot honestly deliver on, refused here rather than
    // written as an invite that would never activate:
    //
    //  - a learner account: user_type drives routing, and the middleware sends
    //    learners out of every business route
    //  - an account already active in a business: getBusinessContext resolves
    //    a single membership, so a second one is never reached
    if (existingUser.user_type === 'learner') {
      return {
        ok: false,
        error: 'That address is registered as a learner account and cannot join a team.',
        fieldErrors: { email: 'Learner account' },
      }
    }

    const { count } = await admin
      .from('business_members')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', existingUser.id)
      .eq('status', 'active')

    if (count) {
      return {
        ok: false,
        error: 'That address already belongs to another business.',
        fieldErrors: { email: 'Already on a team' },
      }
    }
  }

  // Already on this team, by either identity. Two queries rather than one
  // `.or()`: the email goes into the filter as a value, not as filter syntax.
  const [{ data: byEmail }, { data: byUser }] = await Promise.all([
    supabase
      .from('business_members')
      .select('id, status')
      .eq('business_id', businessId)
      .ilike('invited_email', email)
      .maybeSingle(),
    existingUser
      ? supabase
          .from('business_members')
          .select('id, status')
          .eq('business_id', businessId)
          .eq('user_id', existingUser.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const clash = byEmail ?? byUser
  if (clash) {
    return {
      ok: false,
      error:
        clash.status === 'active'
          ? 'That person is already on your team.'
          : 'That address already has a pending invite.',
      fieldErrors: { email: 'Already invited' },
    }
  }

  const { error } = await supabase.from('business_members').insert({
    business_id: businessId,
    user_id: existingUser?.id ?? null,
    invited_email: email,
    role: input.role,
    invited_by: auth.data!.userId,
    status: 'invited',
  })
  if (error) return { ok: false, error: error.message }

  // Only worth emailing someone who has no account yet — this is the message
  // that gets them one. Supabase's built-in mailer is heavily rate limited, so
  // treat a send failure as a warning, not a failed invite.
  let emailed = false
  if (!existingUser) {
    const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      // handle_new_user branches on this. Without it the account defaults to
      // 'learner', and the middleware would bounce the very person we just
      // invited out of every business route. 'company_member' is the branch
      // that creates a profile without creating a business of its own.
      data: { user_type: 'company_member' },
    })
    emailed = !inviteError
  }

  revalidatePath('/dashboard')
  return { ok: true, data: { emailed } }
}

/** Changes a member's role. Refuses to remove the business's last Admin. */
export async function changeMemberRole(
  businessId: string,
  memberId: string,
  role: MemberRole
): Promise<ActionResult> {
  const auth = await requireAdmin(businessId)
  if (!auth.ok) return auth
  if (!ROLES.includes(role)) return { ok: false, error: 'Pick a valid role.' }

  const supabase = await createClient()
  const guard = await wouldOrphanBusiness(businessId, memberId, role)
  if (guard) return guard

  const { error, count } = await supabase
    .from('business_members')
    .update({ role }, { count: 'exact' })
    .eq('id', memberId)
    .eq('business_id', businessId)

  if (error) return { ok: false, error: error.message }
  if (count === 0) return { ok: false, error: 'That member is no longer on your team.' }

  revalidatePath('/dashboard')
  return { ok: true }
}

/** Removes a member or revokes a pending invite. */
export async function removeMember(
  businessId: string,
  memberId: string
): Promise<ActionResult> {
  const auth = await requireAdmin(businessId)
  if (!auth.ok) return auth

  const supabase = await createClient()
  const guard = await wouldOrphanBusiness(businessId, memberId, null)
  if (guard) return guard

  const { error, count } = await supabase
    .from('business_members')
    .delete({ count: 'exact' })
    .eq('id', memberId)
    .eq('business_id', businessId)

  if (error) return { ok: false, error: error.message }
  if (count === 0) return { ok: false, error: 'That member is no longer on your team.' }

  revalidatePath('/dashboard')
  return { ok: true }
}

/**
 * A business with no active Admin cannot be administered by anyone — nobody
 * could invite, promote, or edit the company profile again. Guards the two
 * ways to get there: demoting the last Admin, or removing them.
 *
 * `nextRole` is the role being moved to, or null for a removal.
 */
async function wouldOrphanBusiness(
  businessId: string,
  memberId: string,
  nextRole: MemberRole | null
): Promise<ActionResult | null> {
  if (nextRole === 'admin') return null

  const supabase = await createClient()
  const { data: admins } = await supabase
    .from('business_members')
    .select('id')
    .eq('business_id', businessId)
    .eq('role', 'admin')
    .eq('status', 'active')

  const isLastAdmin = (admins ?? []).length === 1 && admins![0].id === memberId
  if (!isLastAdmin) return null

  return {
    ok: false,
    error:
      nextRole === null
        ? 'You cannot remove the last Admin — promote someone else first.'
        : 'You cannot change the last Admin’s role — promote someone else first.',
  }
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
