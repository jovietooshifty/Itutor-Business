import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

/**
 * Service-role client. Bypasses RLS entirely, so it must NEVER be imported
 * into a client component — only from 'use server' files, and only for the two
 * things RLS genuinely cannot express:
 *
 *  - looking up whether an invited email already has an account (a business
 *    admin cannot read users outside their own business, by design)
 *  - activating a pending invite, which the invitee themselves performs but
 *    business_members_update_admin reserves for admins
 *
 * Every other write in this app goes through the caller's own session so RLS
 * stays the real authorization boundary.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')

  return createSupabaseClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
