'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button, Field, Input } from '@/components/ui'
import { OtpInput } from '@/components/auth/otp-input'
import { requestPasswordReset, verifyRecoveryCode } from '@/app/(auth)/actions'

export function ForgotPasswordForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [sent, setSent] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()

  function send(e?: React.FormEvent) {
    e?.preventDefault()
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

  function verify() {
    setError(null)
    startTransition(async () => {
      const result = await verifyRecoveryCode({ email, code })
      if (!result.ok) {
        setError(result.error)
        return
      }
      // The code established a session; that is what /reset-password needs.
      router.replace('/reset-password')
      router.refresh()
    })
  }

  /*
   * The code is the primary path, not a fallback. Mail scanners follow links
   * in email, and these tokens are single-use, so a robot routinely burns the
   * link before the person clicks it — which is exactly what was happening.
   * A typed code cannot be consumed that way.
   */
  if (sent) {
    return (
      <div>
        <p className="m-0 mb-1 text-sm text-ink">
          We sent a 6-digit code to <span className="font-semibold">{email.trim()}</span>.
        </p>
        <p className="m-0 mb-5 text-xs text-[#9ca3af]">
          If that address has an account, the code is on its way. Enter it below.
        </p>

        <OtpInput value={code} onChange={setCode} idPrefix="recovery" disabled={pending} />

        {error && <p className="mb-3 text-xs font-semibold text-danger-fg">{error}</p>}

        <Button
          size="lg"
          fullWidth
          loading={pending}
          disabled={code.length !== 6}
          onClick={verify}
        >
          {pending ? 'Checking…' : 'Continue'}
        </Button>

        <p className="m-0 mt-4 text-center text-xs text-[#9ca3af]">
          Didn&apos;t get it?{' '}
          <button
            type="button"
            onClick={() => send()}
            disabled={pending}
            className="font-semibold text-[var(--itutor-green)] underline disabled:opacity-50"
          >
            Send another
          </button>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={send} noValidate>
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
          {pending ? 'Sending…' : 'Send reset code'}
        </Button>
      </div>
    </form>
  )
}
