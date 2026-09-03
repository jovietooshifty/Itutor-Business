'use client'

import * as React from 'react'
import { MailCheck } from 'lucide-react'
import { Button, Field, Input } from '@/components/ui'
import { requestPasswordReset } from '@/app/(auth)/actions'

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState('')
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await requestPasswordReset(email)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setSent(true)
    })
  }

  /*
   * Deliberately says "if that address has an account" rather than confirming
   * one exists — the action does not reveal it either, so this screen must not
   * become the thing that does.
   */
  if (sent) {
    return (
      <div className="rounded-lg bg-brand-light px-4 py-5 text-center">
        <MailCheck size={26} className="mx-auto text-[var(--itutor-green)]" aria-hidden />
        <p className="m-0 mt-2.5 text-sm font-semibold text-ink">Check your inbox</p>
        <p className="m-0 mt-1 text-sm text-ink-muted">
          If <span className="font-semibold text-ink">{email.trim()}</span> has an account, a reset
          link is on its way.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field label="Email" htmlFor="reset-email">
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
        />
      </Field>

      {error && (
        <p className="mt-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-fg">{error}</p>
      )}

      <div className="mt-6">
        <Button type="submit" size="lg" fullWidth loading={pending} disabled={!email.trim()}>
          {pending ? 'Sending…' : 'Send reset link'}
        </Button>
      </div>
    </form>
  )
}
