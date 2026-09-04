import { createClient } from '@/lib/supabase/server'
import type { CompanyPanelData } from '@/components/company-panel'

/**
 * Loads the company panel for a join surface.
 *
 * Goes through company_for_join(), a definer function, because /c/[token] is
 * served to anonymous visitors who cannot read `businesses` at all. It returns
 * nothing for a business with no published course, so a caller has to tolerate
 * null — the panel is simply omitted then.
 */
export async function loadCompanyPanel(businessId: string): Promise<CompanyPanelData | null> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('company_for_join', { p_business_id: businessId })
  const row = data?.[0]
  if (!row) return null

  const location = [row.city, row.region, row.country].filter(Boolean).join(', ')

  return {
    name: row.name,
    logoUrl: row.logo_url,
    coverUrl: row.cover_url,
    description: row.description,
    tagline: row.tagline,
    industry: row.industry,
    website: row.website,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    location: location || null,
    courseCount: Number(row.course_count ?? 0),
    learnerCount: Number(row.learner_count ?? 0),
  }
}
