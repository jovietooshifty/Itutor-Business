'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button, Field, Input } from '@/components/ui'
import { PasswordMeter } from '@/components/auth/auth-shell'
import { passwordStrength } from '@/lib/constants'
import { resetPassword } from '@/app/(auth)/actions'

export function ResetPasswordForm({ userType }: { userType: string }) {
  const router = useRouter()
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [pending, startTransition] = React.useTransition()

  const strength = passwordStrength(password)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    startTransition(async () => {
      const result = await resetPassword({ password, confirmPassword })
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {})
        setFormError(result.fieldErrors ? null : result.error)
        return
      }
      setErrors({})
      // The recovery link already signed them in, so there is nowhere to go
      // but their own home.
      router.replace(userType === 'learner' ? '/marketplace' : '/dashboard')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4">
        <div>
          <Field label="New password" error={errors.password} htmlFor="new-password">
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              invalid={!!errors.password}
              autoComplete="new-password"
            />
          </Field>
          {password.length > 0 && <PasswordMeter score={strength.score} label={strength.label} />}
        </div>

        <Field label="Confirm password" error={errors.confirmPassword} htmlFor="confirm-password">
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            invalid={!!errors.confirmPassword}
            autoComplete="new-password"
          />
        </Field>
      </div>

      {formError && (
        <p className="mt-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-fg">{formError}</p>
      )}

      <div className="mt-6">
        <Button type="submit" size="lg" fullWidth loading={pending}>
          {pending ? 'Saving…' : 'Set new password'}
        </Button>
      </div>
    </form>
  )
}
