'use client'

import * as React from 'react'

/**
 * Six single-character boxes with auto-advance, backspace-to-previous, arrow
 * keys and paste-the-whole-code support (the export only had auto-advance).
 */
export function OtpInput({
  value,
  onChange,
  idPrefix,
  disabled,
}: {
  value: string
  onChange: (next: string) => void
  idPrefix: string
  disabled?: boolean
}) {
  const refs = React.useRef<Array<HTMLInputElement | null>>([])
  const digits = React.useMemo(() => {
    const arr = value.split('')
    return Array.from({ length: 6 }, (_, i) => arr[i] ?? '')
  }, [value])

  const setDigit = (index: number, digit: string) => {
    const next = [...digits]
    next[index] = digit
    onChange(next.join('').replace(/\s/g, ''))
  }

  const handleChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, '')
    if (!cleaned) {
      setDigit(index, '')
      return
    }
    if (cleaned.length > 1) {
      // Pasted or fast-typed run of digits — spread across the boxes.
      const next = [...digits]
      for (let i = 0; i < cleaned.length && index + i < 6; i++) next[index + i] = cleaned[i]
      onChange(next.join(''))
      refs.current[Math.min(index + cleaned.length, 5)]?.focus()
      return
    }
    setDigit(index, cleaned)
    if (index < 5) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault()
      setDigit(index - 1, '')
      refs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      refs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault()
      refs.current[index + 1]?.focus()
    }
  }

  return (
    <div className="mb-3 flex justify-center gap-2">
      {digits.map((digit, i) => (
        <input
          key={i}
          id={`${idPrefix}-${i}`}
          ref={(el) => {
            refs.current[i] = el
          }}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${i + 1} of 6`}
          className="h-[52px] w-11 rounded-md border border-surface-border text-center font-sans text-xl font-bold text-ink outline-none focus:border-[color:var(--itutor-green)] disabled:bg-surface-inset"
        />
      ))}
    </div>
  )
}
