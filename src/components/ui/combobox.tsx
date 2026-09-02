'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/components/ui'

/**
 * Searchable single-select used for "Your role" / "Job title". Picking the
 * literal option "Other" reveals a free-text field, matching the export.
 */
export function RoleCombobox({
  options,
  query,
  onQueryChange,
  onPick,
  placeholder = 'Search or select your role…',
  invalid,
  id,
}: {
  options: readonly string[]
  query: string
  onQueryChange: (next: string) => void
  onPick: (role: string) => void
  placeholder?: string
  invalid?: boolean
  id?: string
}) {
  const [open, setOpen] = React.useState(false)
  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))

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
          {filtered.map((option) => (
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
          {filtered.length === 0 && (
            <div className="px-3.5 py-2.5 text-sm text-[#9ca3af]">No matches</div>
          )}
        </div>
      )}
    </div>
  )
}

/** Multi-select with checkmarks, used for the Training language(s) picker. */
export function MultiSelectCombobox({
  options,
  selected,
  onToggle,
  placeholder = 'Search…',
  id,
}: {
  options: readonly string[]
  selected: string[]
  onToggle: (value: string) => void
  placeholder?: string
  id?: string
}) {
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="relative">
      <input
        id={id}
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-md border border-surface-border bg-white px-3 py-2.5 text-sm font-sans text-ink outline-none placeholder:text-[#9ca3af] focus:border-[color:var(--itutor-green)]"
      />
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[230px] overflow-y-auto rounded-md border border-surface-border bg-white shadow-md">
          {filtered.map((option) => (
            <div
              key={option}
              onMouseDown={(e) => {
                e.preventDefault()
                onToggle(option)
              }}
              className="flex cursor-pointer items-center justify-between px-3.5 py-2.5 text-sm text-ink hover:bg-surface-inset"
            >
              {option}
              {selected.includes(option) && (
                <Check size={14} color="var(--itutor-green)" />
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-3.5 py-2.5 text-sm text-[#9ca3af]">No matches</div>
          )}
        </div>
      )}
    </div>
  )
}
