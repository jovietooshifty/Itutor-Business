'use client'

import * as React from 'react'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/cn'
import { signOut } from '@/app/(auth)/actions'

/**
 * Signs out and lands on /login — signOut() redirects there itself.
 * Rendered in both shells' headers, which had no way out at all.
 */
export function LogoutButton({
  className,
  withIcon = true,
  label = 'Log out',
}: {
  className?: string
  withIcon?: boolean
  label?: string
}) {
  const [pending, startTransition] = React.useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-fast disabled:opacity-50',
        className
      )}
    >
      {withIcon && <LogOut size={14} aria-hidden />}
      {pending ? 'Signing out…' : label}
    </button>
  )
}
