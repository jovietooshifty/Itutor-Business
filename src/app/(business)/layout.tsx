import { redirect } from 'next/navigation'
import { BusinessTopNav } from '@/components/business/top-nav'
import type { SettingsInitial } from '@/components/business/settings-modal'
import { getBusinessContext } from '@/lib/business'
import { createClient } from '@/lib/supabase/server'

/**
 * Shell for every signed-in business screen: the dark top nav, the gear-icon
 * settings modal, and the page body. Company Profile is its OWN route
 * (/company-profile) rather than a tab in the modal — the modal links out to it.
 */
export default async function BusinessLayout({ children }: { children: React.ReactNode }) {
  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const supabase = await createClient()

  const [{ data: business }, { data: members }, { data: prefs }] = await Promise.all([
    supabase.from('businesses').select('name, timezone').eq('id', context.businessId).maybeSingle(),
    supabase
      .from('business_members')
      // business_members has two FKs to users (user_id and invited_by), so the
      // embed must name which one it follows.
      .select('id, role, status, invited_email, user_id, users!business_members_user_id_fkey(full_name, email)')
      .eq('business_id', context.businessId)
      .order('created_at'),
    supabase
      .from('business_notification_prefs')
      .select('notify_course_complete, notify_signups, notify_product_updates')
      .eq('business_id', context.businessId)
      .eq('user_id', context.userId)
      .maybeSingle(),
  ])

  const settings: SettingsInitial = {
    businessId: context.businessId,
    businessName: business?.name ?? context.businessName,
    timezone: business?.timezone ?? '',
    email: context.email,
    role: context.role,
    team: (members ?? []).map((m) => {
      const user = m.users as { full_name: string | null; email: string } | null
      return {
        id: m.id,
        name: user?.full_name || user?.email || m.invited_email || 'Pending invite',
        email: user?.email ?? m.invited_email ?? '',
        role: m.role,
        isYou: m.user_id === context.userId,
        status: m.status,
      }
    }),
    notifications: {
      notify_course_complete: prefs?.notify_course_complete ?? true,
      notify_signups: prefs?.notify_signups ?? true,
      notify_product_updates: prefs?.notify_product_updates ?? false,
    },
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <BusinessTopNav settings={settings} />
      {children}
    </div>
  )
}
