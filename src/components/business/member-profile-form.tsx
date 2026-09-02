'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button, Field, Input, SectionCard, Select, Textarea } from '@/components/ui'
import { RoleCombobox } from '@/components/ui/combobox'
import { ImageUpload } from '@/components/ui/image-upload'
import { ProfileStrength, StickyFooterBar, type StrengthItem } from '@/components/ui/profile-strength'
import {
  COUNTRY_CODES,
  DEFAULT_PHONE_COUNTRY,
  ORG_ROLES,
  STANDARD_LANGUAGES,
} from '@/lib/constants'
import { saveMemberProfile } from '@/app/(business)/member-actions'

export type MemberProfileInitial = {
  fullName: string
  avatarUrl: string | null
  bio: string
  jobTitle: string
  phoneCountryCode: string
  phone: string
  preferredLanguage: string
}

export function MemberProfileForm({
  userId,
  initial,
}: {
  userId: string
  initial: MemberProfileInitial
}) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  const [fullName, setFullName] = React.useState(initial.fullName)
  const [avatarUrl, setAvatarUrl] = React.useState(initial.avatarUrl)
  const [bio, setBio] = React.useState(initial.bio)
  const [jobTitle, setJobTitle] = React.useState(initial.jobTitle)
  const [jobTitleQuery, setJobTitleQuery] = React.useState(initial.jobTitle)
  const [showOther, setShowOther] = React.useState(false)
  const [phoneCountryCode, setPhoneCountryCode] = React.useState(
    initial.phoneCountryCode || DEFAULT_PHONE_COUNTRY
  )
  const [phone, setPhone] = React.useState(initial.phone)
  const [preferredLanguage, setPreferredLanguage] = React.useState(initial.preferredLanguage)

  const strengthItems: StrengthItem[] = [
    { label: 'Full name', done: !!fullName.trim() },
    { label: 'Bio', done: !!bio.trim() },
    { label: 'Job title', done: !!jobTitle.trim() },
    { label: 'Phone', done: !!phone.trim() },
    { label: 'Preferred language', done: !!preferredLanguage },
  ]
  const done = strengthItems.filter((i) => i.done).length

  function pickRole(role: string) {
    if (role === 'Other') {
      setJobTitle('')
      setJobTitleQuery('Other')
      setShowOther(true)
    } else {
      setJobTitle(role)
      setJobTitleQuery(role)
      setShowOther(false)
    }
  }

  return (
    <>
      <div className="mx-auto grid max-w-[1200px] items-start gap-7 px-6 py-8 lg:grid-cols-[1fr_300px]">
        <div className="grid min-w-0 gap-6">
          <SectionCard title="">
            <p className="m-0 mb-4 text-xs font-bold uppercase tracking-[0.06em] text-ink-muted">
              Your profile
            </p>
            <div className="flex items-start gap-5">
              <ImageUpload
                bucket="avatars"
                path={userId}
                value={avatarUrl}
                onChange={setAvatarUrl}
                width={88}
                height={88}
                placeholder="Photo"
                className="shrink-0"
              />
              <div className="flex-1">
                <Field label="Full name">
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arjun Rambally"
                  />
                </Field>
              </div>
            </div>

            <Field label="Bio" hint="Tell your team a bit about yourself." className="mt-4">
              <Textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your team a bit about yourself"
              />
            </Field>
          </SectionCard>

          <SectionCard title="Role & contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Job title / position">
                <RoleCombobox
                  options={ORG_ROLES}
                  query={jobTitleQuery}
                  onQueryChange={(q) => {
                    setJobTitleQuery(q)
                    setJobTitle('')
                    setShowOther(false)
                  }}
                  onPick={pickRole}
                  placeholder="Search or select a role…"
                />
                {showOther && (
                  <Input
                    className="mt-2"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Please specify your role"
                  />
                )}
              </Field>

              <Field label="Preferred language">
                <Select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                >
                  <option value="">Select</option>
                  {STANDARD_LANGUAGES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Phone" optional className="sm:col-span-2">
                <div className="flex gap-2">
                  <Select
                    className="w-[150px] px-2 text-xs"
                    value={phoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={`${c.name}-${c.code}`} value={c.code}>
                        {c.code} {c.name}
                      </option>
                    ))}
                  </Select>
                  <Input
                    value={phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 7)
                      setPhone(
                        digits.length > 3 ? `${digits.slice(0, 3)} ${digits.slice(3)}` : digits
                      )
                    }}
                    placeholder="622 1234"
                  />
                </div>
              </Field>
            </div>
          </SectionCard>

          {error && (
            <p className="rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-fg">{error}</p>
          )}
        </div>

        <aside className="sticky top-[76px] grid gap-4">
          <ProfileStrength items={strengthItems} autosaveNote={false} />
        </aside>
      </div>

      <StickyFooterBar left={saved ? 'Saved' : `${done}/${strengthItems.length} complete`}>
        <Button
          size="lg"
          loading={pending}
          onClick={() =>
            startTransition(async () => {
              setError(null)
              const result = await saveMemberProfile({
                fullName,
                avatarUrl,
                bio,
                jobTitle,
                phoneCountryCode,
                phone,
                preferredLanguage,
              })
              if (!result.ok) {
                setError(result.error)
                return
              }
              setSaved(true)
              router.refresh()
              window.setTimeout(() => setSaved(false), 2500)
            })
          }
        >
          Save profile
        </Button>
      </StickyFooterBar>
    </>
  )
}
