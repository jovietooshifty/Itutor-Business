'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Button,
  Checkbox,
  Chip,
  cn,
  Field,
  Input,
  SectionCard,
  Select,
  Textarea,
  Toggle,
} from '@/components/ui'
import { RoleCombobox } from '@/components/ui/combobox'
import { ImageUpload } from '@/components/ui/image-upload'
import { ProfileStrength, StickyFooterBar, type StrengthItem } from '@/components/ui/profile-strength'
import {
  COUNTRY_CODES,
  countWords,
  DEFAULT_PHONE_COUNTRY,
  LEARNER_BIO_TARGET_WORDS,
  LEARNER_LANGUAGES,
  ORG_ROLES,
  SUGGESTED_SKILLS,
  TIMEZONE_OPTIONS,
  YEARS_EXPERIENCE_OPTIONS,
} from '@/lib/constants'
import { saveLearnerProfile, type LearnerCertificationInput } from '@/app/(learner)/actions'

export type LearnerProfileInitial = {
  userId: string
  email: string
  fullName: string
  dateOfBirth: string
  avatarUrl: string | null
  bio: string
  employed: boolean | null
  jobTitle: string
  yearsExperience: string
  employerName: string
  /** True when the learner was invited by a business — employer is then locked. */
  employerLocked: boolean
  phoneCountryCode: string
  phone: string
  preferredLanguage: string
  timezone: string
  skills: string[]
  certifications: LearnerCertificationInput[]
  publicPortfolio: boolean
  portfolioSlug: string
}

export function LearnerProfileForm({
  initial,
  mode,
}: {
  initial: LearnerProfileInitial
  mode: 'onboarding' | 'manage'
}) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  const [fullName, setFullName] = React.useState(initial.fullName)
  const [dateOfBirth, setDateOfBirth] = React.useState(initial.dateOfBirth)
  const [avatarUrl, setAvatarUrl] = React.useState(initial.avatarUrl)
  const [bio, setBio] = React.useState(initial.bio)
  const [employed, setEmployed] = React.useState<boolean | null>(initial.employed)
  const [jobTitle, setJobTitle] = React.useState(initial.jobTitle)
  const [jobTitleQuery, setJobTitleQuery] = React.useState(initial.jobTitle)
  const [showOtherRole, setShowOtherRole] = React.useState(false)
  const [yearsExperience, setYearsExperience] = React.useState(initial.yearsExperience)
  const [employerName, setEmployerName] = React.useState(initial.employerName)
  const [phoneCountryCode, setPhoneCountryCode] = React.useState(
    initial.phoneCountryCode || DEFAULT_PHONE_COUNTRY
  )
  const [phone, setPhone] = React.useState(initial.phone)
  const [preferredLanguage, setPreferredLanguage] = React.useState(initial.preferredLanguage)
  const [timezone, setTimezone] = React.useState(initial.timezone)
  const [skills, setSkills] = React.useState<string[]>(initial.skills)
  const [skillInput, setSkillInput] = React.useState('')
  const [certifications, setCertifications] = React.useState<LearnerCertificationInput[]>(
    initial.certifications
  )
  const [publicPortfolio, setPublicPortfolio] = React.useState(initial.publicPortfolio)
  const [copied, setCopied] = React.useState(false)

  const bioWordCount = countWords(bio)

  // Employment is a gate: answering "No" marks the employment-dependent rows
  // complete rather than leaving them permanently unsatisfiable.
  const strengthItems: StrengthItem[] = [
    { label: 'Full name', done: !!fullName.trim() },
    { label: 'Date of birth', done: !!dateOfBirth },
    { label: `Bio (~${LEARNER_BIO_TARGET_WORDS} words)`, done: bioWordCount >= LEARNER_BIO_TARGET_WORDS },
    { label: 'Employment status answered', done: employed !== null },
    { label: 'Job title', done: employed === false ? true : !!jobTitle.trim() },
    { label: 'Years of experience', done: employed === false ? true : !!yearsExperience },
    {
      label: 'Employer / business name',
      done: employed === false ? true : initial.employerLocked ? true : !!employerName.trim(),
    },
    { label: 'A skill or interest added', done: skills.length > 0 },
    { label: 'Phone', done: !!phone.trim() },
    { label: 'Preferred language', done: !!preferredLanguage },
    { label: 'Timezone', done: !!timezone },
    { label: 'A certification added', done: certifications.some((c) => c.name.trim()) },
  ]
  const done = strengthItems.filter((i) => i.done).length

  function addSkill(value: string) {
    const trimmed = value.trim()
    if (!trimmed || skills.includes(trimmed)) return
    setSkills((prev) => [...prev, trimmed])
    setSkillInput('')
  }

  function pickRole(role: string) {
    if (role === 'Other') {
      setJobTitle('')
      setJobTitleQuery('Other')
      setShowOtherRole(true)
    } else {
      setJobTitle(role)
      setJobTitleQuery(role)
      setShowOtherRole(false)
    }
  }

  const portfolioUrl = `myitutor.com/p/${initial.portfolioSlug}`

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await saveLearnerProfile({
        fullName,
        dateOfBirth,
        avatarUrl,
        bio,
        employed,
        jobTitle,
        yearsExperience,
        employerName,
        phoneCountryCode,
        phone,
        preferredLanguage,
        timezone,
        skills,
        certifications,
        publicPortfolio,
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      if (mode === 'onboarding') {
        router.replace('/marketplace')
        router.refresh()
      } else {
        setSaved(true)
        router.refresh()
        window.setTimeout(() => setSaved(false), 2500)
      }
    })
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
                path={initial.userId}
                value={avatarUrl}
                onChange={setAvatarUrl}
                width={88}
                height={88}
                placeholder="Photo"
                className="shrink-0"
              />
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Persad"
                  />
                </Field>
                <Field label="Date of birth">
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="About you">
            <Field
              label="Bio"
              hint={`Tell us about your role and experience — helps trainers understand your background. Around ${LEARNER_BIO_TARGET_WORDS} words is a good length, but it's not required.`}
            >
              <Textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself..."
              />
              <div className="mt-1 text-right">
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: bioWordCount >= LEARNER_BIO_TARGET_WORDS ? '#16a34a' : '#9ca3af',
                  }}
                >
                  {bioWordCount} words
                </span>
              </div>
            </Field>
          </SectionCard>

          <SectionCard title="Role & experience">
            <p className="m-0 mb-2.5 text-sm font-medium text-[#374151]">
              Are you currently employed?
            </p>
            <div className="flex max-w-[320px] gap-2.5">
              {[
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ].map((opt) => {
                const active = employed === opt.value
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setEmployed(opt.value)}
                    className={cn(
                      'flex-1 rounded-md border p-3 text-sm font-bold transition-colors',
                      active
                        ? 'border-coral bg-coral-soft text-[#9a3412]'
                        : 'border-surface-border bg-white text-ink-muted hover:border-[#d1d5db]'
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>

            {employed === false && (
              <p className="m-0 mt-3.5 text-xs text-[#9ca3af]">
                No problem — you can update this anytime from your profile.
              </p>
            )}

            {employed === true && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Current job title">
                  <RoleCombobox
                    options={ORG_ROLES}
                    query={jobTitleQuery}
                    onQueryChange={(q) => {
                      setJobTitleQuery(q)
                      setJobTitle('')
                      setShowOtherRole(false)
                    }}
                    onPick={pickRole}
                    placeholder="Search or select a role…"
                  />
                  {showOtherRole && (
                    <Input
                      className="mt-2"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Please specify your role"
                    />
                  )}
                </Field>

                <Field label="Years of experience">
                  <Select
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                  >
                    <option value="">Select</option>
                    {YEARS_EXPERIENCE_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Employer / business name" className="sm:col-span-2">
                  <Input
                    value={employerName}
                    readOnly={initial.employerLocked}
                    onChange={(e) => setEmployerName(e.target.value)}
                    placeholder="e.g. Riverside Catering Co."
                  />
                  {initial.employerLocked && (
                    <p className="mt-1.5 text-xs text-[#9ca3af]">
                      Auto-filled — you were invited by this business.
                    </p>
                  )}
                </Field>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Skills & interests"
            subtitle="e.g. Food Safety, Knife Skills, Customer Service, Inventory Management"
          >
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#d1d5db] px-3 py-1.5 text-xs font-semibold text-[#6b7280] hover:border-coral hover:text-coral"
                >
                  + {s}
                </button>
              ))}
            </div>

            <div className="mt-3.5 flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSkill(skillInput)
                  }
                }}
                placeholder="Type a skill and press Enter"
              />
              <Button accent="coral" onClick={() => addSkill(skillInput)} type="button">
                Add
              </Button>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-2">
              {skills.map((s) => (
                <Chip
                  key={s}
                  accent="coral"
                  onRemove={() => setSkills((prev) => prev.filter((x) => x !== s))}
                >
                  {s}
                </Chip>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Contact & preferences">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <Input value={initial.email} readOnly />
                <p className="mt-1 text-[11px] text-[#9ca3af]">
                  Your login email — visible to businesses that invite you.
                </p>
              </Field>

              <Field label="Phone" optional>
                <div className="flex gap-2">
                  <Select
                    className="w-[130px] px-1.5 text-xs"
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
                      setPhone(digits.length > 3 ? `${digits.slice(0, 3)} ${digits.slice(3)}` : digits)
                    }}
                    placeholder="622 1234"
                  />
                </div>
              </Field>

              <Field label="Preferred language">
                <Select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                >
                  <option value="">Select</option>
                  {LEARNER_LANGUAGES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Timezone">
                <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="">Select</option>
                  {TIMEZONE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </SectionCard>

          <SectionCard
            title="Certifications held"
            optional
            subtitle="Visible to any business that invites you to their courses."
          >
            <div className="grid gap-2.5">
              {certifications.map((cert, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center gap-2.5 rounded-lg border border-surface-border px-3.5 py-2.5"
                >
                  <Input
                    className="min-w-[160px] flex-1 border-none px-0 py-2"
                    value={cert.name}
                    onChange={(e) =>
                      setCertifications((prev) =>
                        prev.map((c, idx) => (idx === i ? { ...c, name: e.target.value } : c))
                      )
                    }
                    placeholder="Certification name"
                  />
                  <Checkbox
                    className="text-[11.5px] text-[#6b7280]"
                    label="Show on portfolio"
                    checked={cert.visible_on_portfolio}
                    onChange={(e) =>
                      setCertifications((prev) =>
                        prev.map((c, idx) =>
                          idx === i ? { ...c, visible_on_portfolio: e.target.checked } : c
                        )
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setCertifications((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-xs text-[#9ca3af] hover:text-danger-fg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setCertifications((prev) => [
                  ...prev,
                  { name: '', file_url: null, visible_on_portfolio: true },
                ])
              }
              className="mt-3.5 inline-flex items-center gap-1.5 text-sm font-semibold text-coral"
            >
              + Add certification
            </button>
          </SectionCard>

          <SectionCard title="Privacy">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="m-0 text-sm font-semibold text-ink">Public portfolio</p>
                <p className="m-0 mt-0.5 text-xs text-[#9ca3af]">
                  A shareable page showing your bio, skills and visible certificates — no login
                  required to view.
                </p>
              </div>
              <Toggle
                checked={publicPortfolio}
                onChange={setPublicPortfolio}
                accent="coral"
                label="Public portfolio"
              />
            </div>

            {publicPortfolio && (
              <>
                <div className="mt-3.5 flex gap-2">
                  <Input value={portfolioUrl} readOnly className="flex-1 text-[12.5px]" />
                  <Button
                    type="button"
                    accent="coral"
                    onClick={() => {
                      void navigator.clipboard.writeText(`https://${portfolioUrl}`)
                      setCopied(true)
                      window.setTimeout(() => setCopied(false), 2000)
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy link'}
                  </Button>
                </div>
                <p className="mt-2.5">
                  <Link
                    href={`/p/${initial.portfolioSlug}`}
                    className="text-[13px] font-semibold text-coral"
                  >
                    View public page →
                  </Link>
                </p>
              </>
            )}
          </SectionCard>

          {error && (
            <p className="rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-fg">{error}</p>
          )}
        </div>

        <aside className="sticky top-[76px] grid gap-4">
          <ProfileStrength items={strengthItems} accent="coral" />
        </aside>
      </div>

      <StickyFooterBar
        left={saved ? 'Saved' : `${done}/${strengthItems.length} sections complete`}
      >
        <Button size="lg" accent="coral" loading={pending} onClick={handleSave}>
          {pending
            ? 'Saving…'
            : mode === 'onboarding'
              ? 'Finish Setup'
              : 'Save profile'}
        </Button>
      </StickyFooterBar>
    </>
  )
}
