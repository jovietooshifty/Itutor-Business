'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, Building2, ExternalLink, Search, Settings, User, Users, X } from 'lucide-react'
import { Avatar, Badge, Button, Checkbox, cn, Field, Input, Select } from '@/components/ui'
import { LogoutButton } from '@/components/auth/logout-button'
import { TIMEZONE_OPTIONS } from '@/lib/constants'
import {
  changeMemberRole,
  inviteMember,
  removeMember,
  saveAccountSettings,
  saveGeneralSettings,
  saveNotificationPrefs,
} from '@/app/(business)/actions'
import type { MemberRole } from '@/lib/business'

export type SettingsInitial = {
  businessId: string
  businessName: string
  timezone: string
  email: string
  role: MemberRole
  team: Array<{
    id: string
    name: string
    email: string
    role: MemberRole
    isYou: boolean
    status: 'invited' | 'active'
  }>
  notifications: {
    notify_course_complete: boolean
    notify_signups: boolean
    notify_product_updates: boolean
  }
}

type TabId = 'general' | 'account' | 'team' | 'notifications'

const TABS: Array<{ id: TabId; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'account', label: 'Account', icon: User },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

const ROLE_LABEL: Record<MemberRole, string> = {
  admin: 'Admin',
  operator: 'Operator',
  auditor: 'Auditor',
}

export function SettingsModal({
  initial,
  onClose,
}: {
  initial: SettingsInitial
  onClose: () => void
}) {
  const router = useRouter()
  const [tab, setTab] = React.useState<TabId>('general')
  const [search, setSearch] = React.useState('')
  const isAdmin = initial.role === 'admin'

  // Escape closes; focus starts inside the dialog.
  const dialogRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const query = search.trim().toLowerCase()
  const visibleTabs = TABS.filter((t) => !query || t.label.toLowerCase().includes(query))
  const showOrgGroup = !query || 'company profile'.includes(query)

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 font-sans"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-[min(600px,85vh)] w-full max-w-[880px] overflow-hidden rounded-2xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] outline-none"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="absolute right-4 top-4 z-[5] grid h-7 w-7 place-items-center rounded-full bg-neutral-bg text-[#6b7280] hover:bg-[#e5e7eb]"
        >
          <X size={16} />
        </button>

        {/* Sidebar */}
        <div className="w-[230px] shrink-0 overflow-y-auto border-r border-border bg-surface-soft p-5">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search settings…"
              className="h-9 py-0 pl-8 text-xs"
            />
          </div>

          {visibleTabs.length > 0 && (
            <>
              <p className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#9ca3af]">
                Settings
              </p>
              <div className="grid gap-0.5">
                {visibleTabs.map((t) => {
                  const Icon = t.icon
                  const active = tab === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-left text-sm font-semibold',
                        active ? 'bg-white text-[var(--itutor-green)]' : 'text-ink hover:bg-white/60'
                      )}
                    >
                      <Icon size={15} />
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {showOrgGroup && (
            <>
              <p className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#9ca3af]">
                Organization
              </p>
              {/* Company Profile is its own routed page, not a tab in here. */}
              <Link
                href="/company-profile"
                onClick={onClose}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm font-semibold text-ink no-underline hover:bg-white/60"
              >
                <Building2 size={15} />
                <span className="flex-1">Company Profile</span>
                <ExternalLink size={13} className="text-[#9ca3af]" />
              </Link>
            </>
          )}
        </div>

        {/* Panel */}
        <div className="flex-1 overflow-y-auto p-8">
          {tab === 'general' && (
            <GeneralTab initial={initial} isAdmin={isAdmin} onSaved={() => router.refresh()} />
          )}
          {tab === 'account' && <AccountTab email={initial.email} />}
          {tab === 'team' && (
            <TeamTab
              businessId={initial.businessId}
              team={initial.team}
              isAdmin={isAdmin}
              onChanged={() => router.refresh()}
            />
          )}
          {tab === 'notifications' && (
            <NotificationsTab
              businessId={initial.businessId}
              initial={initial.notifications}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function PanelHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="m-0 font-display text-xl font-bold text-ink">{children}</h3>
}

function StatusLine({ state }: { state: { kind: 'idle' | 'ok' | 'error'; message?: string } }) {
  if (state.kind === 'idle') return null
  return (
    <p
      className={cn(
        'mt-3 text-sm',
        state.kind === 'ok' ? 'text-success-fg' : 'text-danger-fg'
      )}
    >
      {/* Falls back to "Saved." so the tabs that pass no message read as before. */}
      {state.kind === 'ok' ? (state.message ?? 'Saved.') : state.message}
    </p>
  )
}

function GeneralTab({
  initial,
  isAdmin,
  onSaved,
}: {
  initial: SettingsInitial
  isAdmin: boolean
  onSaved: () => void
}) {
  const [name, setName] = React.useState(initial.businessName)
  const [timezone, setTimezone] = React.useState(initial.timezone)
  const [pending, startTransition] = React.useTransition()
  const [state, setState] = React.useState<{ kind: 'idle' | 'ok' | 'error'; message?: string }>({
    kind: 'idle',
  })

  return (
    <>
      <PanelHeading>General</PanelHeading>
      <div className="mt-5 grid max-w-[380px] gap-4">
        <Field label="Company name">
          <Input value={name} onChange={(e) => setName(e.target.value)} disabled={!isAdmin} />
        </Field>
        <Field label="Timezone">
          <Select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            disabled={!isAdmin}
          >
            <option value="">Select timezone</option>
            {TIMEZONE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {!isAdmin && (
        <p className="mt-3 text-xs text-ink-muted">Only an Admin can change these.</p>
      )}
      <div className="mt-6">
        <Button
          loading={pending}
          disabled={!isAdmin}
          onClick={() =>
            startTransition(async () => {
              const result = await saveGeneralSettings(initial.businessId, { name, timezone })
              setState(result.ok ? { kind: 'ok' } : { kind: 'error', message: result.error })
              if (result.ok) onSaved()
            })
          }
        >
          Save changes
        </Button>
      </div>
      <StatusLine state={state} />
    </>
  )
}

function AccountTab({ email }: { email: string }) {
  const [nextEmail, setNextEmail] = React.useState(email)
  const [password, setPassword] = React.useState('')
  const [pending, startTransition] = React.useTransition()
  const [state, setState] = React.useState<{ kind: 'idle' | 'ok' | 'error'; message?: string }>({
    kind: 'idle',
  })

  return (
    <>
      <PanelHeading>Account</PanelHeading>
      <div className="mt-5 grid max-w-[380px] gap-4">
        <Field label="Login email">
          <Input
            type="email"
            value={nextEmail}
            onChange={(e) => setNextEmail(e.target.value)}
          />
        </Field>
        <Field label="New password">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
            autoComplete="new-password"
          />
        </Field>
      </div>
      <div className="mt-6">
        <Button
          loading={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await saveAccountSettings({ email: nextEmail, newPassword: password })
              setState(result.ok ? { kind: 'ok' } : { kind: 'error', message: result.error })
              if (result.ok) setPassword('')
            })
          }
        >
          Save changes
        </Button>
      </div>
      <StatusLine state={state} />
      <p className="mt-3 text-xs text-ink-muted">
        Changing your email sends a confirmation link to the new address.
      </p>

      <div className="mt-7 border-t border-border pt-5">
        <LogoutButton className="text-danger-fg hover:underline" />
        <p className="m-0 mt-1.5 text-xs text-ink-muted">
          Signs you out of this browser.
        </p>
      </div>
    </>
  )
}

function TeamTab({
  businessId,
  team,
  isAdmin,
  onChanged,
}: {
  businessId: string
  team: SettingsInitial['team']
  isAdmin: boolean
  onChanged: () => void
}) {
  const [inviting, setInviting] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [role, setRole] = React.useState<MemberRole>('operator')
  const [pending, startTransition] = React.useTransition()
  const [state, setState] = React.useState<{ kind: 'idle' | 'ok' | 'error'; message?: string }>({
    kind: 'idle',
  })

  function sendInvite() {
    setState({ kind: 'idle' })
    startTransition(async () => {
      const result = await inviteMember(businessId, { email, role })
      if (!result.ok) {
        setState({ kind: 'error', message: result.error })
        return
      }
      setEmail('')
      setInviting(false)
      setState({
        kind: 'ok',
        // An existing account gets no email — say so rather than implying one went out.
        message: result.data?.emailed
          ? 'Invite sent.'
          : 'Invite added. They get access the next time they sign in.',
      })
      onChanged()
    })
  }

  function mutate(run: () => Promise<{ ok: boolean; error?: string }>) {
    setState({ kind: 'idle' })
    startTransition(async () => {
      const result = await run()
      if (!result.ok) {
        setState({ kind: 'error', message: result.error })
        return
      }
      onChanged()
    })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <PanelHeading>Team</PanelHeading>
        <Button
          size="sm"
          disabled={!isAdmin || pending}
          title={isAdmin ? undefined : 'Admins only'}
          onClick={() => setInviting((v) => !v)}
        >
          {inviting ? 'Cancel' : 'Invite member'}
        </Button>
      </div>

      {inviting && (
        <div className="mt-4 rounded-lg border border-border bg-surface-inset p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px] flex-1">
              <Field label="Email address" htmlFor="invite-email">
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teammate@company.com"
                  autoComplete="off"
                />
              </Field>
            </div>
            <Field label="Role" htmlFor="invite-role">
              <Select
                id="invite-role"
                value={role}
                onChange={(e) => setRole(e.target.value as MemberRole)}
              >
                {(Object.keys(ROLE_LABEL) as MemberRole[]).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </Select>
            </Field>
            <Button loading={pending} disabled={!email.trim()} onClick={sendInvite}>
              Send invite
            </Button>
          </div>
          <p className="m-0 mt-2.5 text-xs text-ink-muted">
            Admins manage the team and company profile · Operators build and edit courses ·
            Auditors have read-only access.
          </p>
        </div>
      )}

      <StatusLine state={state} />

      <div className="mt-5 grid overflow-hidden rounded-lg border border-border">
        {team.map((m) => (
          <div
            key={m.id}
            className="flex flex-wrap items-center gap-3 border-b border-border bg-white px-4 py-3 last:border-b-0"
          >
            <Avatar name={m.name} size={36} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-ink">
                {m.name}
                {m.isYou && <span className="font-normal text-[#9ca3af]"> (you)</span>}
              </div>
              <div className="text-xs text-[#9ca3af]">{m.email}</div>
            </div>

            {m.status === 'invited' && <Badge tone="warning">Invited</Badge>}

            {isAdmin ? (
              <Select
                aria-label={`Role for ${m.name}`}
                value={m.role}
                disabled={pending}
                onChange={(e) =>
                  mutate(() => changeMemberRole(businessId, m.id, e.target.value as MemberRole))
                }
                className="w-[130px]"
              >
                {(Object.keys(ROLE_LABEL) as MemberRole[]).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </option>
                ))}
              </Select>
            ) : (
              <Badge tone="neutral">{ROLE_LABEL[m.role]}</Badge>
            )}

            {isAdmin && (
              <button
                type="button"
                disabled={pending}
                onClick={() => mutate(() => removeMember(businessId, m.id))}
                aria-label={
                  m.status === 'invited' ? `Revoke invite for ${m.name}` : `Remove ${m.name}`
                }
                title={m.status === 'invited' ? 'Revoke invite' : 'Remove from team'}
                className="shrink-0 text-[#9ca3af] transition-colors duration-fast hover:text-[var(--danger-fg)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X size={15} />
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

function NotificationsTab({
  businessId,
  initial,
}: {
  businessId: string
  initial: SettingsInitial['notifications']
}) {
  const [prefs, setPrefs] = React.useState(initial)
  const [state, setState] = React.useState<{ kind: 'idle' | 'ok' | 'error'; message?: string }>({
    kind: 'idle',
  })

  function update(key: keyof typeof prefs, value: boolean) {
    const next = { ...prefs, [key]: value }
    setPrefs(next)
    void saveNotificationPrefs(businessId, next).then((result) =>
      setState(result.ok ? { kind: 'ok' } : { kind: 'error', message: result.error })
    )
  }

  return (
    <>
      <PanelHeading>Notifications</PanelHeading>
      <div className="mt-5 grid gap-3.5">
        <Checkbox
          label="Email me when a course is completed"
          checked={prefs.notify_course_complete}
          onChange={(e) => update('notify_course_complete', e.target.checked)}
        />
        <Checkbox
          label="Email me about new sign-ups"
          checked={prefs.notify_signups}
          onChange={(e) => update('notify_signups', e.target.checked)}
        />
        <Checkbox
          label="Product updates and announcements"
          checked={prefs.notify_product_updates}
          onChange={(e) => update('notify_product_updates', e.target.checked)}
        />
      </div>
      <StatusLine state={state} />
    </>
  )
}
