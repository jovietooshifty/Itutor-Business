'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/components/ui'

/**
 * A named set of related options. Long lists — industries, course categories —
 * are unreadable as one flat scroll, and the heading is often what tells you
 * the list covers your kind of work at all.
 */
export type OptionGroup = { label: string; options: readonly string[] }

/** Every option across the groups, in order, for filtering and membership. */
export function flattenGroups(groups: readonly OptionGroup[]): string[] {
  return groups.flatMap((group) => [...group.options])
}

/**
 * Searchable single-select used for "Your role" / "Job title" and the company
 * industry. Picking the literal option "Other" reveals a free-text field,
 * matching the export.
 *
 * Pass either `options` (flat) or `groups` (headed sections).
 */
export function RoleCombobox({
  options,
  groups,
  query,
  onQueryChange,
  onPick,
  placeholder = 'Search or select your role…',
  invalid,
  id,
}: {
  options?: readonly string[]
  groups?: readonly OptionGroup[]
  query: string
  onQueryChange: (next: string) => void
  onPick: (role: string) => void
  placeholder?: string
  invalid?: boolean
  id?: string
}) {
  const [open, setOpen] = React.useState(false)
  const all = React.useMemo(
    () => options ?? (groups ? flattenGroups(groups) : []),
    [options, groups]
  )
  const matches = (o: string) => o.toLowerCase().includes(query.toLowerCase())
  const filtered = all.filter(matches)
  // Groups with nothing left after filtering are dropped along with their
  // heading, so a search never leaves a bare label over empty space.
  const filteredGroups = (groups ?? [])
    .map((group) => ({ label: group.label, options: group.options.filter(matches) }))
    .filter((group) => group.options.length > 0)

  // Offer the typed value unless it already IS one of the options, in which
  // case picking the option itself does the same thing.
  const typed = query.trim()
  const canUseTyped =
    typed.length > 0 && !all.some((o) => o.toLowerCase() === typed.toLowerCase())

  return (
    <div className="relative">
      <input
        id={id}
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          onQueryChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className={cn(
          'w-full rounded-md border bg-white px-3 py-2.5 text-sm font-sans text-ink outline-none',
          'placeholder:text-[#9ca3af] focus:border-[color:var(--itutor-green)]',
          invalid ? 'border-[#fca5a5]' : 'border-surface-border'
        )}
      />
      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[230px] overflow-y-auto rounded-md border border-surface-border bg-white shadow-md"
        >
          {groups
            ? filteredGroups.map((group) => (
                <div key={group.label}>
                  <p className="m-0 bg-surface-inset px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#9ca3af]">
                    {group.label}
                  </p>
                  {group.options.map((option) => (
                    <div
                      key={option}
                      role="option"
                      aria-selected={query === option}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        onPick(option)
                        setOpen(false)
                      }}
                      className="cursor-pointer px-3.5 py-2.5 text-sm text-ink hover:bg-surface-inset"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              ))
            : filtered.map((option) => (
                <div
                  key={option}
                  role="option"
                  aria-selected={query === option}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    onPick(option)
                    setOpen(false)
                  }}
                  className="cursor-pointer px-3.5 py-2.5 text-sm text-ink hover:bg-surface-inset"
                >
                  {option}
                </div>
              ))}

          {/*
            The list is suggestions, not a closed set — no list of job titles
            covers every business. Without this, typing a title that is not
            listed reached "No matches" and simply stopped, with no way to keep
            what you had already written.
          */}
          {canUseTyped && (
            <div
              role="option"
              aria-selected={false}
              onMouseDown={(e) => {
                e.preventDefault()
                onPick(typed)
                setOpen(false)
              }}
              className="cursor-pointer border-t border-surface-border px-3.5 py-2.5 text-sm text-ink hover:bg-surface-inset"
            >
              Use &ldquo;<span className="font-semibold">{typed}</span>&rdquo;
            </div>
          )}

          {filtered.length === 0 && !canUseTyped && (
            <div className="px-3.5 py-2.5 text-sm text-[#9ca3af]">
              Start typing to add your own
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Multi-select with checkmarks. Used for the Training language(s) picker and
 * for course categories.
 *
 * Pass `options` for a flat list or `groups` for headed sections. `max` caps
 * how many can be held at once, and `allowCustom` lets a typed value that is
 * not on the list be added — the seeded taxonomy is suggestions, not a closed
 * set, and no list of categories covers every trade.
 */
export function MultiSelectCombobox({
  options,
  groups,
  selected,
  onToggle,
  placeholder = 'Search…',
  id,
  max,
  allowCustom = false,
}: {
  options?: readonly string[]
  groups?: readonly OptionGroup[]
  selected: string[]
  onToggle: (value: string) => void
  placeholder?: string
  id?: string
  max?: number
  allowCustom?: boolean
}) {
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const all = React.useMemo(
    () => options ?? (groups ? flattenGroups(groups) : []),
    [options, groups]
  )
  const matches = (o: string) => o.toLowerCase().includes(query.toLowerCase())
  const filtered = all.filter(matches)
  const filteredGroups = (groups ?? [])
    .map((group) => ({ label: group.label, options: group.options.filter(matches) }))
    .filter((group) => group.options.length > 0)

  const atMax = max !== undefined && selected.length >= max
  const typed = query.trim()
  const canUseTyped =
    allowCustom &&
    !atMax &&
    typed.length > 0 &&
    !all.some((o) => o.toLowerCase() === typed.toLowerCase()) &&
    !selected.some((s) => s.toLowerCase() === typed.toLowerCase())

  /** Selected items stay pickable so they can be un-picked at the cap. */
  function pick(value: string) {
    if (atMax && !selected.includes(value)) return
    onToggle(value)
  }

  function Row({ option }: { option: string }) {
    const isSelected = selected.includes(option)
    return (
      <div
        onMouseDown={(e) => {
          e.preventDefault()
          pick(option)
        }}
        aria-selected={isSelected}
        className={cn(
          'flex items-center justify-between px-3.5 py-2.5 text-sm text-ink',
          atMax && !isSelected
            ? 'cursor-not-allowed opacity-40'
            : 'cursor-pointer hover:bg-surface-inset'
        )}
      >
        {option}
        {isSelected && <Check size={14} color="var(--itutor-green)" />}
      </div>
    )
  }

  return (
    <div className="relative">
      <input
        id={id}
        value={query}
        placeholder={atMax ? `${max} is the maximum — remove one to add another` : placeholder}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' || !canUseTyped) return
          e.preventDefault()
          onToggle(typed)
          setQuery('')
        }}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className="w-full rounded-md border border-surface-border bg-white px-3 py-2.5 text-sm font-sans text-ink outline-none placeholder:text-[#9ca3af] focus:border-[color:var(--itutor-green)]"
      />
      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[260px] overflow-y-auto rounded-md border border-surface-border bg-white shadow-md"
        >
          {groups
            ? filteredGroups.map((group) => (
                <div key={group.label}>
                  <p className="m-0 bg-surface-inset px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#9ca3af]">
                    {group.label}
                  </p>
                  {group.options.map((option) => (
                    <Row key={option} option={option} />
                  ))}
                </div>
              ))
            : filtered.map((option) => <Row key={option} option={option} />)}

          {canUseTyped && (
            <div
              onMouseDown={(e) => {
                e.preventDefault()
                onToggle(typed)
                setQuery('')
              }}
              className="cursor-pointer border-t border-surface-border px-3.5 py-2.5 text-sm text-ink hover:bg-surface-inset"
            >
              Add &ldquo;<span className="font-semibold">{typed}</span>&rdquo;
            </div>
          )}

          {filtered.length === 0 && !canUseTyped && (
            <div className="px-3.5 py-2.5 text-sm text-[#9ca3af]">
              {atMax ? `You have reached the maximum of ${max}.` : 'No matches'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
