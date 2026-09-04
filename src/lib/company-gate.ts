import { createClient } from '@/lib/supabase/server'

/**
 * Whether a business has told learners enough about itself to be asking them
 * to join.
 *
 * Nothing used to block an empty company profile: a business could invite
 * people and publish courses while its join page said nothing but a name.
 * These eight are the fields a learner actually reads when deciding whether
 * this is a real employer — see the company panel on /c/[token] and
 * /learn/[courseId].
 *
 * Every column already exists on `businesses` (schema.sql:56-79); this is the
 * check, not new storage.
 */
export type CompanyGate = {
  complete: boolean
  /** Human-readable names of what is still missing, in profile order. */
  missing: string[]
}

export async function loadCompanyGate(businessId: string): Promise<CompanyGate> {
  const supabase = await createClient()

  const [{ data: business }, { count: locationCount }] = await Promise.all([
    supabase
      .from('businesses')
      .select('name, industry, description, logo_url, cover_url, contact_email, contact_phone')
      .eq('id', businessId)
      .maybeSingle(),
    supabase
      .from('business_locations')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', businessId),
  ])

  const filled = (value: string | null | undefined) => Boolean(value?.trim())

  const checks: { label: string; done: boolean }[] = [
    { label: 'Company name', done: filled(business?.name) },
    { label: 'Industry', done: filled(business?.industry) },
    { label: 'Company logo', done: filled(business?.logo_url) },
    { label: 'Cover image', done: filled(business?.cover_url) },
    { label: 'Description', done: filled(business?.description) },
    { label: 'At least one location', done: (locationCount ?? 0) > 0 },
    { label: 'Contact email', done: filled(business?.contact_email) },
    { label: 'Contact phone', done: filled(business?.contact_phone) },
  ]

  const missing = checks.filter((check) => !check.done).map((check) => check.label)
  return { complete: missing.length === 0, missing }
}
