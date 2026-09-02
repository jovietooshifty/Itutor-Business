import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/types/database'

/**
 * Routes that require a signed-in user, keyed by which side of the app they
 * belong to. Trailing slashes matter: '/learn' without one would also swallow
 * '/learner/signup', which must stay public.
 */
const BUSINESS_PREFIXES = ['/dashboard', '/company-profile', '/my-profile', '/courses', '/learners']
const LEARNER_PREFIXES = ['/marketplace', '/my-portfolio', '/learn/']

/** Always public, even though they sit under a protected-looking path. */
const PUBLIC_PREFIXES = ['/login', '/business/signup', '/learner/signup', '/auth/', '/p/']

function matches(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`))
}

export async function updateSession(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
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
