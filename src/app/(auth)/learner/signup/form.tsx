'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button, Checkbox, Field, Input } from '@/components/ui'
import { PasswordMeter } from '@/components/auth/auth-shell'
import { passwordStrength } from '@/lib/constants'
import { signUpLearner } from '../../actions'

export function LearnerSignupForm() {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [dateOfBirth, setDateOfBirth] = React.useState('')

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [rememberMe, setRememberMe] = React.useState(true)
  const [formError, setFormError] = React.useState<string | null>(null)

  const strength = passwordStrength(password)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    startTransition(async () => {
      const result = await signUpLearner({ email, password, confirmPassword, dateOfBirth, rememberMe })
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {})
        setFormError(result.fieldErrors ? null : result.error)
        return
      }
      setErrors({})
      router.push(`/learner/signup/verify?email=${encodeURIComponent(email.trim())}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4">
        <Field label="Email" error={errors.email} htmlFor="email">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            invalid={!!errors.email}
            autoComplete="email"
          />
        </Field>

        <div>
          <Field label="Password" error={errors.password} htmlFor="password">
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

        <Field label="Date of birth" error={errors.dateOfBirth} htmlFor="dob">
          <Input
            id="dob"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            invalid={!!errors.dateOfBirth}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Checkbox
          label="Remember me on this device"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
      </div>

      {formError && (
        <p className="mt-4 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-fg">{formError}</p>
      )}

      <div className="mt-6">
        <Button type="submit" size="lg" fullWidth accent="coral" loading={pending}>
          {pending ? 'Creating account…' : 'Create Account'}
        </Button>
      </div>
    </form>
  )
}
