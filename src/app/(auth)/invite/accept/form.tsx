'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button, Field, Input } from '@/components/ui'
import { PasswordMeter } from '@/components/auth/auth-shell'
import { passwordStrength } from '@/lib/constants'
import { acceptInvite } from '@/app/(auth)/actions'

export function AcceptInviteForm({ defaultName }: { defaultName: string }) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()

  const [fullName, setFullName] = React.useState(defaultName)
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [formError, setFormError] = React.useState<string | null>(null)

  const strength = passwordStrength(password)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    startTransition(async () => {
      const result = await acceptInvite({ fullName, password, confirmPassword })
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {})
        setFormError(result.fieldErrors ? null : result.error)
        return
      }
      setErrors({})
      router.push('/dashboard')
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4">
        <Field label="Your name" error={errors.fullName} htmlFor="fullName">
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Alex Persad"
            invalid={!!errors.fullName}
            autoComplete="name"
          />
        </Field>

        <div>
          <Field label="Create a password" error={errors.password} htmlFor="password">
            <Input
              id="password"
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

        <Field label="Confirm password" error={errors.confirmPassword} htmlFor="confirmPassword">
          <Input
            id="confirmPassword"
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
          {pending ? 'Setting up…' : 'Join the team'}
        </Button>
      </div>
    </form>
  )
}
