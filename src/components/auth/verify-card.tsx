'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Check, Mail } from 'lucide-react'
import { Button, cn } from '@/components/ui'
import { Logo, PUBLIC_HOME } from '@/components/ui/logo'
import { OtpInput } from '@/components/auth/otp-input'
import { resendVerification, verifyEmailCode } from '@/app/(auth)/actions'

/**
 * "Check your inbox" — step 1½ of both signup flows. Identical layout on both
 * sides; only the accent colour and the destination after success differ.
 */
export function VerifyCard({
  accent,
  email,
  nextHref,
  idPrefix,
}: {
  accent: 'brand' | 'coral'
  email: string
  /** Where to land once the code is accepted (the profile builder). */
  nextHref: string
  idPrefix: string
}) {
  const router = useRouter()
  const isCoral = accent === 'coral'

  const [code, setCode] = React.useState('')
  const [verifying, setVerifying] = React.useState(false)
  const [resent, setResent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleVerify() {
    setVerifying(true)
    setError(null)
    const result = await verifyEmailCode({ email, code })
    if (!result.ok) {
      setError(result.error)
      setVerifying(false)
      return
    }
    router.replace(nextHref)
  }

  async function handleResend() {
    setError(null)
    const result = await resendVerification(email)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setResent(true)
    window.setTimeout(() => setResent(false), 2500)
  }

  return (
    <main
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center p-8 font-sans',
        isCoral ? 'bg-peach-wash' : 'bg-mint-wash'
      )}
    >
      {/* Pre-auth screen — the public landing page is the correct home. */}
      <div className="absolute left-10 top-8">
        <Logo href={PUBLIC_HOME} accent={accent} />
      </div>

      <div className="w-full max-w-[440px] rounded-3xl bg-white px-10 py-11 text-center shadow-card">
        <span
          className={cn(
            'relative mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl',
            isCoral ? 'bg-coral-soft text-coral' : 'bg-brand-light text-[var(--itutor-green)]'
          )}
        >
          <Mail size={28} />
          <span
            className={cn(
              'absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full text-white shadow-[0_0_0_3px_#fff]',
              isCoral ? 'bg-coral' : 'bg-itutor-green'
            )}
          >
            <Check size={13} strokeWidth={3} />
          </span>
        </span>

        <h2 className="m-0 mb-2.5 font-display text-[26px] font-bold text-ink">Check your inbox</h2>
        <p className="mb-7 mt-0 text-sm leading-relaxed text-[#6b7280]">
          We sent a 6-digit code to <strong className="text-ink">{email}</strong>. Enter it below to
          verify your account.
        </p>

        <OtpInput value={code} onChange={setCode} idPrefix={idPrefix} disabled={verifying} />

        {error && <p className="mb-3 text-xs font-semibold text-danger-fg">{error}</p>}

        {resent ? (
          <p
            className={cn(
              'mb-4 text-xs font-semibold',
              isCoral ? 'text-coral' : 'text-[var(--itutor-green)]'
            )}
          >
            Code resent!
          </p>
        ) : (
          <p className="mb-4 text-xs text-[#9ca3af]">
            Didn&apos;t get it?{' '}
            <button
              type="button"
              onClick={handleResend}
              className={cn(
                'cursor-pointer font-semibold underline',
                isCoral ? 'text-coral' : 'text-[var(--itutor-green)]'
              )}
            >
              Resend email
            </button>
          </p>
        )}

        <Button
          size="lg"
          fullWidth
          accent={accent}
          loading={verifying}
          disabled={code.length !== 6}
          onClick={handleVerify}
        >
          {verifying ? 'Verifying…' : 'Continue'}
        </Button>

        {/*
          Supabase's default confirmation email sends a link rather than the
          code, and the template is not editable on the free tier with the
          built-in email provider. Until custom SMTP is configured, this line
          points at the path that actually works. See src/app/auth/confirm.
        */}
        <p className="mt-4 text-[11px] leading-relaxed text-[#9ca3af]">
          No code in the email? Use the confirmation link it contains — that works too.
        </p>
      </div>
    </main>
  )
}
