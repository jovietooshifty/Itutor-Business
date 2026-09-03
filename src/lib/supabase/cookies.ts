/**
 * Set to 'false' when someone signs in without ticking "Remember me". Both the
 * server client and the middleware read it before writing auth cookies, and
 * drop maxAge/expires when it says so — which is what makes those cookies last
 * only until the browser closes.
 *
 * Its own module because the middleware runs on the edge runtime and cannot
 * import anything that reaches next/headers, which supabase/server.ts does.
 */
export const REMEMBER_COOKIE = 'itutor-remember'
