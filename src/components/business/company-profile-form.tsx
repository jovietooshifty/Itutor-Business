'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button, Chip, Field, Input, SectionCard, Select, Textarea } from '@/components/ui'
import { MultiSelectCombobox, RoleCombobox } from '@/components/ui/combobox'
import { ImageUpload } from '@/components/ui/image-upload'
import { ProfileStrength, StickyFooterBar, type StrengthItem } from '@/components/ui/profile-strength'
import {
  COMPANY_SIZE_OPTIONS,
  countWords,
  DESCRIPTION_MIN_WORDS,
  INDUSTRY_GROUPS,
  BUSINESS_TYPE_OPTIONS,
  STANDARD_LANGUAGES,
  TAGLINE_MAX_LENGTH,
  TIMEZONE_OPTIONS,
} from '@/lib/constants'
import {
  saveCompanyProfile,
  type CertificationInput,
  type LocationInput,
} from '@/app/(business)/actions'

export type CompanyProfileInitial = {
  businessId: string
  name: string
  industry: string
  description: string
  tagline: string
  companySize: string
  yearFounded: string
  businessType: string
  website: string
  contactPhone: string
  contactEmail: string
  timezone: string
  logoUrl: string | null
  stampUrl: string | null
  coverUrl: string | null
  locations: LocationInput[]
  certifications: CertificationInput[]
  languages: string[]
}

const EMPTY_LOCATION: LocationInput = { street: '', city: '', region: '', country: '' }

export function CompanyProfileForm({
  initial,
  /** 'onboarding' is step 2 of signup; 'manage' is the standalone routed page. */
  mode,
  canEdit,
}: {
  initial: CompanyProfileInitial
  mode: 'onboarding' | 'manage'
  canEdit: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [saved, setSaved] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [name, setName] = React.useState(initial.name)
  const [industry, setIndustry] = React.useState(initial.industry)
  const [description, setDescription] = React.useState(initial.description)
  const [tagline, setTagline] = React.useState(initial.tagline)
  const [companySize, setCompanySize] = React.useState(initial.companySize)
  const [yearFounded, setYearFounded] = React.useState(initial.yearFounded)
  const [businessType, setBusinessType] = React.useState(initial.businessType)
  const [website, setWebsite] = React.useState(initial.website)
  const [contactPhone, setContactPhone] = React.useState(initial.contactPhone)
  const [contactEmail, setContactEmail] = React.useState(initial.contactEmail)
  const [timezone, setTimezone] = React.useState(initial.timezone)
  const [logoUrl, setLogoUrl] = React.useState(initial.logoUrl)
  const [stampUrl, setStampUrl] = React.useState(initial.stampUrl)
  const [coverUrl, setCoverUrl] = React.useState(initial.coverUrl)
  const [locations, setLocations] = React.useState<LocationInput[]>(
    initial.locations.length ? initial.locations : [EMPTY_LOCATION]
  )
  const [certifications, setCertifications] = React.useState<CertificationInput[]>(
    initial.certifications
  )
  const [languages, setLanguages] = React.useState<string[]>(initial.languages)

  const descWordCount = countWords(description)

  const strengthItems: StrengthItem[] = [
    /* Both are gate requirements — loadCompanyGate blocks course creation and
       invites without them — and neither was on this list, so a profile could
       read as complete here and still be refused. The banner now carries more
       weight than that: it is the image shown on every course this business
       publishes. */
    { label: 'Company logo', done: !!logoUrl },
    { label: 'Banner (shown on your courses)', done: !!coverUrl },
    { label: 'Company name', done: !!name.trim() },
    { label: 'Industry', done: !!industry },
    { label: `Description (${DESCRIPTION_MIN_WORDS}+ words)`, done: descWordCount >= DESCRIPTION_MIN_WORDS },
    { label: 'Tagline', done: !!tagline.trim() },
    { label: 'Company size', done: !!companySize },
    { label: 'Year founded', done: !!yearFounded.trim() },
    { label: 'Business type', done: !!businessType },
    {
      label: 'At least one location',
      done: locations.some((l) => l.street.trim() && l.city.trim() && l.country.trim()),
    },
    { label: 'Contact phone', done: !!contactPhone.trim() },
    { label: 'Contact email', done: !!contactEmail.trim() },
    { label: 'A training language added', done: languages.length > 0 },
  ]
  const done = strengthItems.filter((i) => i.done).length

  function updateLocation(index: number, field: keyof LocationInput, value: string) {
    setLocations((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)))
  }

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await saveCompanyProfile(initial.businessId, {
        name,
        industry,
        description,
        tagline,
        companySize,
        yearFounded,
        businessType,
        website,
        contactPhone,
        contactEmail,
        timezone,
        logoUrl,
        stampUrl,
        coverUrl,
        locations,
        certifications,
        languages,
      })

      if (!result.ok) {
        setError(result.error)
        return
      }

      /* Both modes land on the dashboard. Only 'onboarding' used to, and
         /company-profile passes mode="manage" — so the page people actually
         use set a "Saved" flag and then sat there, with nothing saying the work
         was finished or where to go next. */
      setSaved(true)
      router.replace('/dashboard')
      router.refresh()
    })
  }

  const disabled = !canEdit || pending

  return (
    <>
      <div className="mx-auto grid max-w-[1200px] items-start gap-7 px-6 py-8 lg:grid-cols-[1fr_300px]">
        <div className="grid min-w-0 gap-6">
          {!canEdit && (
            <div className="rounded-xl border border-[color:var(--info-fg)]/25 bg-info-bg px-5 py-4 text-sm text-info-fg">
              You have read-only access to the company profile. Only an Admin can make changes.
            </div>
          )}

          {/* Identity: cover, logo, stamp, name, industry */}
          <div className="overflow-hidden rounded-xl border border-[#f3f4f6] bg-white shadow-sm">
            <ImageUpload
              bucket="business-assets"
              path={`${initial.businessId}/cover`}
              preset="cover"
              value={coverUrl}
              onChange={setCoverUrl}
              shape="rect"
              width="100%"
              height={140}
              placeholder="Add your banner — shown on every course you publish"
              className="[&>button]:rounded-none [&>button]:border-x-0 [&>button]:border-t-0"
            />
            <div className="px-7 pb-7">
              {/*
                Only the logo overlaps the banner, and it is the only thing on
                this row. The stamp used to sit here too, at a different height
                and with its own caption, so with each upload's "Remove" control
                underneath them the three collided into each other and into the
                heading. The stamp has its own row below now, where it has room.
              */}
              <div className="-mt-12 flex items-end gap-4">
                <div className="shrink-0 rounded-full bg-white p-1 shadow-sm">
                  <ImageUpload
                    bucket="business-assets"
                    path={`${initial.businessId}/logo`}
                    preset="avatar"
                    value={logoUrl}
                    onChange={setLogoUrl}
                    width={88}
                    height={88}
                    placeholder="Logo"
                  />
                </div>
                <p className="m-0 pb-3 text-xs font-bold uppercase tracking-[0.06em] text-ink-muted">
                  Business profile
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Company name">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={disabled}
                  />
                </Field>
                {/* A searchable combobox over grouped industries, the same
                    treatment ORG_ROLES already has. As a plain <select> over
                    eight food-service options, a solar installer or a haulage
                    firm had nothing to pick but "Other". */}
                <Field label="Industry" htmlFor="company-industry">
                  <RoleCombobox
                    id="company-industry"
                    groups={INDUSTRY_GROUPS}
                    query={industry}
                    onQueryChange={setIndustry}
                    onPick={setIndustry}
                    placeholder="Search or type your industry…"
                  />
                </Field>
              </div>

              {/* Its own row, with its purpose stated. It was a 56px square
                  wedged between the logo and the heading, captioned only
                  "Stamp (optional)" — which does not say where it appears. */}
              <div className="mt-6 flex items-start gap-4 border-t border-[#f3f4f6] pt-5">
                <ImageUpload
                  bucket="business-assets"
                  path={`${initial.businessId}/stamp`}
                  preset="stamp"
                  value={stampUrl}
                  onChange={setStampUrl}
                  width={56}
                  height={56}
                  placeholder="Stamp"
                  className="shrink-0"
                />
                <div className="min-w-0">
                  <p className="m-0 text-sm font-semibold text-ink">Certificate stamp</p>
                  <p className="m-0 mt-0.5 text-xs text-ink-muted">
                    Optional. Printed on every certificate this business issues, so a PNG with a
                    transparent background sits best.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <SectionCard title="About your business">
            <Field
              label="Description"
              hint={`Describe what your business does and why training matters to you — minimum ${DESCRIPTION_MIN_WORDS} words.`}
            >
              <Textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does your business do, and what will your team be training for?"
                disabled={disabled}
              />
              <div className="mt-1 text-right">
                <span
                  className="text-xs font-semibold"
                  style={{ color: descWordCount >= DESCRIPTION_MIN_WORDS ? '#16a34a' : '#9ca3af' }}
                >
                  {descWordCount} / {DESCRIPTION_MIN_WORDS} words
                </span>
              </div>
            </Field>

            <Field
              label="Tagline"
              hint="One line. Shown on your marketplace card if you list public courses."
              className="mt-4"
            >
              <Input
                value={tagline}
                maxLength={TAGLINE_MAX_LENGTH}
                onChange={(e) => setTagline(e.target.value.slice(0, TAGLINE_MAX_LENGTH))}
                placeholder="e.g. Hands-on food safety training for busy kitchens"
                disabled={disabled}
              />
              <div className="mt-1 text-right text-xs text-[#9ca3af]">
                {tagline.length}/{TAGLINE_MAX_LENGTH}
              </div>
            </Field>
          </SectionCard>

          <SectionCard title="Company details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company size">
                <Select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  disabled={disabled}
                >
                  <option value="">Select size</option>
                  {COMPANY_SIZE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o} employees
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Year founded">
                <Input
                  value={yearFounded}
                  onChange={(e) => setYearFounded(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="e.g. 2015"
                  inputMode="numeric"
                  disabled={disabled}
                />
              </Field>
              <Field label="Business type">
                <Select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  disabled={disabled}
                >
                  <option value="">Select type</option>
                  {BUSINESS_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Website" optional>
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://"
                  disabled={disabled}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Location(s)" subtitle="Add every site your team trains from.">
            <div className="grid gap-3.5">
              {locations.map((loc, i) => (
                <div
                  key={i}
                  className="relative rounded-lg border border-surface-border p-4"
                >
                  {i > 0 && !disabled && (
                    <button
                      type="button"
                      onClick={() => setLocations((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute right-3.5 top-3 text-xs text-[#9ca3af] hover:text-danger-fg"
                    >
                      Remove
                    </button>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      className="sm:col-span-2"
                      value={loc.street}
                      onChange={(e) => updateLocation(i, 'street', e.target.value)}
                      placeholder="Street address"
                      disabled={disabled}
                    />
                    <Input
                      value={loc.city}
                      onChange={(e) => updateLocation(i, 'city', e.target.value)}
                      placeholder="City"
                      disabled={disabled}
                    />
                    <Input
                      value={loc.region}
                      onChange={(e) => updateLocation(i, 'region', e.target.value)}
                      placeholder="State / Region"
                      disabled={disabled}
                    />
                    <Input
                      value={loc.country}
                      onChange={(e) => updateLocation(i, 'country', e.target.value)}
                      placeholder="Country"
                      disabled={disabled}
                    />
                  </div>
                </div>
              ))}
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => setLocations((prev) => [...prev, { ...EMPTY_LOCATION }])}
                className="mt-3.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--itutor-green)]"
              >
                + Add another location
              </button>
            )}
          </SectionCard>

          <SectionCard title="Contact">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Primary contact phone">
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 555 123 4567"
                  disabled={disabled}
                />
              </Field>
              <Field label="Preferred contact email">
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="May differ from your login email"
                  disabled={disabled}
                />
              </Field>
            </div>
          </SectionCard>

          {/* "Compliance & certifications" was here. Nobody is asked for their
              company's certificates in a job interview, and this screen is
              meant to read like one. business_certifications and the save
              path both remain — `certifications` is still submitted, unchanged
              — so nothing already entered is lost, and the section can come
              back without a migration. */}

          <SectionCard title="Training preferences">
            <Field label="Training language(s)">
              <MultiSelectCombobox
                options={STANDARD_LANGUAGES}
                selected={languages}
                onToggle={(lang) =>
                  setLanguages((prev) =>
                    prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
                  )
                }
                placeholder="Search languages…"
              />
              <div className="mt-2.5 flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <Chip
                    key={lang}
                    onRemove={
                      disabled
                        ? undefined
                        : () => setLanguages((prev) => prev.filter((l) => l !== lang))
                    }
                  >
                    {lang}
                  </Chip>
                ))}
              </div>
            </Field>

            <Field label="Timezone" className="mt-5">
              <Select
                className="max-w-[320px]"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                disabled={disabled}
              >
                <option value="">Select timezone</option>
                {TIMEZONE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            </Field>
          </SectionCard>

          {error && (
            <p className="rounded-md bg-danger-bg px-3 py-2 text-sm text-danger-fg">{error}</p>
          )}
        </div>

        <aside className="sticky top-[76px] grid gap-4">
          <ProfileStrength items={strengthItems} />
        </aside>
      </div>

      <StickyFooterBar
        left={
          saved
            ? 'Saved'
            : `${done}/${strengthItems.length} sections complete`
        }
      >
        <Button size="lg" loading={pending} disabled={!canEdit} onClick={handleSave}>
          {pending
            ? mode === 'onboarding'
              ? 'Finishing up…'
              : 'Saving…'
            : mode === 'onboarding'
              ? 'Finish Setup'
              : 'Save changes'}
        </Button>
      </StickyFooterBar>
    </>
  )
}
