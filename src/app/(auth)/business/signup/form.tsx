'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button, Field, Input } from '@/components/ui'
import { RoleCombobox } from '@/components/ui/combobox'
import { PasswordMeter } from '@/components/auth/auth-shell'
import { ORG_ROLES, passwordStrength } from '@/lib/constants'
import { signUpBusiness } from '../../actions'

export function BusinessSignupForm() {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()

  const [orgName, setOrgName] = React.useState('')
  const [position, setPosition] = React.useState('')
  const [positionQuery, setPositionQuery] = React.useState('')
  const [showOther, setShowOther] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [formError, setFormError] = React.useState<string | null>(null)

  const strength = passwordStrength(password)

  function pickRole(role: string) {
    if (role === 'Other') {
      setPosition('')
      setPositionQuery('Other')
      setShowOther(true)
    } else {
      setPosition(role)
      setPositionQuery(role)
      setShowOther(false)
    }
    setErrors((e) => ({ ...e, position: '' }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)

    startTransition(async () => {
      const result = await signUpBusiness({
        orgName,
        position,
        email,
        password,
        confirmPassword,
      })

      if (!result.ok) {
        setErrors(result.fieldErrors ?? {})
        setFormError(result.fieldErrors ? null : result.error)
        return
      }

      setErrors({})
      router.push(`/business/signup/verify?email=${encodeURIComponent(email.trim())}`)
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4">
        <Field label="Organization name" error={errors.orgName} htmlFor="orgName">
          <Input
            id="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="e.g. Riverside Catering Co."
            invalid={!!errors.orgName}
            autoComplete="organization"
          />
        </Field>

        <Field label="Your role" error={errors.position} htmlFor="position">
          <RoleCombobox
            id="position"
            options={ORG_ROLES}
            query={positionQuery}
            onQueryChange={(q) => {
              setPositionQuery(q)
              setPosition('')
              setShowOther(false)
            }}
            onPick={pickRole}
            invalid={!!errors.position}
          />
        </Field>

        {showOther && (
          <Field label="Please specify your role">
            <Input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Assistant Manager"
            />
          </Field>
        )}

        <Field label="Email" error={errors.email} htmlFor="email">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
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
          {password.length > 0 && (
            <PasswordMeter score={strength.score} label={strength.label} />
          )}
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
          {pending ? 'Creating account…' : 'Create Account'}
        </Button>
      </div>
    </form>
  )
}
