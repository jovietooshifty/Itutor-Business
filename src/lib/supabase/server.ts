import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { REMEMBER_COOKIE } from '@/lib/supabase/cookies'
import type { Database } from '@/lib/types/database'

/**
 * Request-scoped Supabase client for Server Components, Server Actions and
 * Route Handlers. Reads and writes the auth cookies on the current request.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // "Remember me" is really a question about cookie lifetime: dropping
          // maxAge/expires turns Supabase's auth cookies into session cookies,
          // which the browser discards when it closes. Read per write rather
          // than captured once, so a sign-in that sets the preference earlier
          // in this same request is already honoured by the cookies it writes.
          const remember = cookieStore.get(REMEMBER_COOKIE)?.value !== 'false'

          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (remember) return cookieStore.set(name, value, options)

              const { maxAge: _maxAge, expires: _expires, ...sessionOptions } = options ?? {}
              cookieStore.set(name, value, sessionOptions)
            })
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // The middleware refreshes the session, so this is safe to ignore.
          }
        },
      },
    }
  )
}
