'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Checkbox, Field, Input } from '@/components/ui'
import { signIn } from '../actions'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = React.useTransition()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await signIn({ email, password, rememberMe })
      if (!result.ok) {
        setError(result.error)
        return
      }

      const next = searchParams.get('next')
      const home = result.data?.userType === 'learner' ? '/marketplace' : '/dashboard'
      router.replace(next || home)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4">
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Checkbox
          label="Remember me on this device"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-[var(--itutor-green)] no-underline hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-fg">{error}</p>
      )}

      <div className="mt-6">
        <Button type="submit" size="lg" fullWidth loading={pending}>
          {pending ? 'Signing in…' : 'Log in'}
        </Button>
      </div>
    </form>
  )
}
