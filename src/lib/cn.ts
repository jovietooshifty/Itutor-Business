/**
 * Class-name joiner. Lives outside the 'use client' UI module so that server
 * components (e.g. <Logo>) can call it too.
 */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}
