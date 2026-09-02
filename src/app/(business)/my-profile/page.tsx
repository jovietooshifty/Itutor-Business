import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { MemberProfileForm } from '@/components/business/member-profile-form'
import { getBusinessContext } from '@/lib/business'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Your personal profile — iTutor Business' }

/** The member's own profile, reached from the dashboard's completion banner. */
export default async function MyProfilePage() {
  const context = await getBusinessContext()
  if (!context) redirect('/login')

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('member_profiles')
    .select('avatar_url, bio, job_title, phone_country_code, phone, preferred_language')
    .eq('user_id', context.userId)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-surface-soft pb-[110px]">
      <div className="mx-auto max-w-[1200px] px-6 pt-8">
        <h1 className="font-display text-[28px] font-bold text-ink">Your personal profile</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Tell your team who you are. Only people in your organization can see this.
        </p>
      </div>

      <MemberProfileForm
        userId={context.userId}
        initial={{
          fullName: context.fullName ?? '',
          avatarUrl: profile?.avatar_url ?? null,
          bio: profile?.bio ?? '',
          jobTitle: profile?.job_title ?? '',
          phoneCountryCode: profile?.phone_country_code ?? '',
          phone: profile?.phone ?? '',
          preferredLanguage: profile?.preferred_language ?? '',
        }}
      />
    </div>
  )
}
