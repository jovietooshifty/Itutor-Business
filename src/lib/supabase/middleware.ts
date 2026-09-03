import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { REMEMBER_COOKIE } from '@/lib/supabase/cookies'
import type { Database } from '@/lib/types/database'

/**
 * Routes that require a signed-in user, keyed by which side of the app they
 * belong to. Trailing slashes matter: '/learn' without one would also swallow
 * '/learner/signup', which must stay public.
 */
const BUSINESS_PREFIXES = ['/dashboard', '/company-profile', '/my-profile', '/courses', '/learners']
const LEARNER_PREFIXES = ['/marketplace', '/my-portfolio', '/learn/']

/**
 * Always public, even though they sit under a protected-looking path.
 * '/p/' is a learner's public portfolio; '/c/' is a course share link, which
 * has to work for someone with no account at all — that is the whole point of
 * it. The token is what authorizes the read (course_by_share_token).
 */
const PUBLIC_PREFIXES = [
  '/login',
  '/business/signup',
  '/learner/signup',
  '/auth/',
  '/p/',
  '/c/',
]

function matches(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`))
}

/**
 * Local-only escape hatch: skips every auth check so you can click through
 * protected routes without signing in. Requires NODE_ENV=development (true
 * for `next dev`, never for a deployed build) AND an explicit opt-in var, so
 * it can't activate by accident in a real environment. Set in .env.local only
 * — never commit it, never set it anywhere a real user could hit.
 */
const DEV_AUTH_BYPASS =
  process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'

export async function updateSession(request: NextRequest) {
  if (DEV_AUTH_BYPASS) return NextResponse.next({ request })

  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Mirrors createClient()'s rule: without "Remember me" the auth
          // cookies are session cookies. This refresh runs on nearly every
          // request, so re-adding maxAge here would quietly undo the choice.
          const remember = request.cookies.get(REMEMBER_COOKIE)?.value !== 'false'

          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            if (remember) return response.cookies.set(name, value, options)

            const { maxAge: _maxAge, expires: _expires, ...sessionOptions } = options ?? {}
            response.cookies.set(name, value, sessionOptions)
          })
        },
      },
    }
  )

  // Refreshes the auth token. Must run before any redirect decision.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (matches(pathname, PUBLIC_PREFIXES)) return response

  const isBusinessRoute = matches(pathname, BUSINESS_PREFIXES)
  const isLearnerRoute = matches(pathname, LEARNER_PREFIXES)

  if (!user && (isBusinessRoute || isLearnerRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Keep each account on its own side of the app.
  if (user && (isBusinessRoute || isLearnerRoute)) {
    const { data: profile } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', user.id)
      .single()

    const isLearner = profile?.user_type === 'learner'
    const url = request.nextUrl.clone()

    if (isLearner && isBusinessRoute) {
      url.pathname = '/marketplace'
      url.search = ''
      return NextResponse.redirect(url)
    }
    if (!isLearner && isLearnerRoute) {
      url.pathname = '/dashboard'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return response
}
