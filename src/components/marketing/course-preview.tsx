'use client'

import * as React from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { Badge, Input, Select } from '@/components/ui'
import {
  ALL_CATEGORIES,
  MARKETING_CATEGORIES,
  MARKETING_COURSES,
  filterMarketingCourses,
  type MarketingCourse,
} from '@/lib/marketing'

const GATE_BENEFITS = ['Track your training', 'Get certified', 'Learn from real businesses']

/**
 * The ungated marketplace preview from handoff flow 8: anyone can browse and
 * filter the sample catalogue, but acting on a course opens the signup gate.
 *
 * Filtering runs on a static in-memory list, so there is no request to debounce
 * and no loading state to design around.
 */
export function CoursePreview() {
  const [search, setSearch] = React.useState('')
  const [category, setCategory] = React.useState<string>(ALL_CATEGORIES)
  const [gateOpen, setGateOpen] = React.useState(false)

  const courses = React.useMemo(
    () => filterMarketingCourses(MARKETING_COURSES, search, category),
    [search, category]
  )

  return (
    <section id="courses" className="bg-white px-6 pb-[72px] pt-4">
      <div className="mx-auto max-w-content">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="m-0 mb-1.5 text-[clamp(26px,3vw,32px)] font-bold tracking-heading text-ink">
              Browse courses
            </h2>
            <p className="m-0 text-base text-ink-muted">
              A sample of what&apos;s live on the platform today — no account needed to look
              around.
            </p>
          </div>

          {/*
            `cn` is a plain joiner with no tailwind-merge, so a width passed
            through `className` would lose to the controls' own `w-full`
            depending on stylesheet order. Sizing the wrappers instead — which
            is what the design does — keeps that out of the equation.
          */}
          <div className="flex flex-wrap gap-2.5">
            <div className="w-[220px]">
              <Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses…"
                aria-label="Search courses"
              />
            </div>
            <div className="w-[200px]">
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value={ALL_CATEGORIES}>{ALL_CATEGORIES}</option>
                {MARKETING_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#9ca3af]">No courses match your search.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard
                key={course.title}
                course={course}
                onSelect={() => setGateOpen(true)}
              />
            ))}
          </div>
        )}
      </div>

      {gateOpen && <SignupGate onClose={() => setGateOpen(false)} />}
    </section>
  )
}

/**
 * The whole card is the control. The design draws a separate "Enroll" button
 * inside a clickable card, but a button inside a button is invalid markup — so
 * the affordance is rendered as a span and the card itself takes the click,
 * which keeps it reachable by keyboard with one tab stop instead of two.
 */
function CourseCard({ course, onSelect }: { course: MarketingCourse; onSelect: () => void }) {
  const Icon = course.icon

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group block cursor-pointer overflow-hidden rounded-card border border-[#e5e7eb] bg-white text-left transition-[transform,box-shadow] duration-slow ease-out hover:-translate-y-1 hover:shadow-hover-card focus-visible:-translate-y-1 focus-visible:shadow-hover-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--itutor-green)]"
    >
      <span
        className="flex h-[110px] items-center justify-center"
        style={{ background: course.iconBg }}
      >
        <Icon size={34} strokeWidth={1.6} color={course.iconColor} aria-hidden />
      </span>

      <span className="block p-4">
        <span className="mb-2 flex items-center justify-between gap-2">
          <Badge tone="neutral">{course.category}</Badge>
          <span className="text-[11px] text-[#9ca3af]">{course.durationLabel}</span>
        </span>

        <span className="mb-1.5 block text-[15px] font-bold leading-[1.3] text-ink">
          {course.title}
        </span>
        <span className="mb-2 block text-xs text-[#6b7280]">{course.provider}</span>
        <span className="mb-3.5 block text-xs leading-[1.5] text-[#6b7280]">
          {course.description}
        </span>

        <span className="block w-full rounded-lg bg-itutor-green px-4 py-2.5 text-center text-[13px] font-bold text-white transition-colors duration-fast group-hover:bg-brand-dark">
          Enroll
        </span>
      </span>
    </button>
  )
}

/**
 * Signup gate. The design shows Google and Apple buttons, but this app only
 * has email/password auth wired (see `(auth)/actions.ts`) — dead social buttons
 * on the front door would be a worse lie than not offering them, so the email
 * path is presented as the primary action until a provider is configured.
 */
function SignupGate({ onClose }: { onClose: () => void }) {
  const headingId = React.useId()

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5 font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92vh] w-full max-w-[860px] overflow-hidden rounded-2xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full text-ink-muted transition-colors duration-fast hover:bg-surface-inset"
        >
          <X size={18} aria-hidden />
        </button>

        <div className="hidden w-2/5 shrink-0 flex-col justify-between bg-auth p-9 text-white md:flex">
          <div>
            <p className="m-0 mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--itutor-green)]">
              iTutor Business
            </p>
            <h3 className="m-0 font-display text-[24px] font-bold leading-[1.25]">
              Everything you need to keep learning.
            </h3>
          </div>

          <ul className="m-0 grid list-none gap-2.5 p-0 text-[13px] text-white/85">
            {GATE_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5">
                <span className="mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[rgba(25,147,86,0.2)] text-[var(--itutor-green)]">
                  <Check size={10} strokeWidth={3} aria-hidden />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 overflow-y-auto p-9">
          <p className="m-0 mb-5 pr-8 text-right text-[13px] text-[#6b7280]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[var(--itutor-green)] underline">
              Sign in
            </Link>
          </p>

          <h2 id={headingId} className="m-0 font-display text-[24px] font-bold text-ink">
            Create a new account
          </h2>
          <p className="mb-6 mt-2 text-sm text-[#6b7280]">
            Sign up to enroll in this course and track your progress.
          </p>

          <div className="grid gap-3">
            <Link
              href="/learner/signup"
              className="flex items-center justify-center rounded-lg bg-itutor-green px-4 py-3 text-sm font-bold text-white no-underline transition-colors duration-fast hover:bg-brand-dark"
            >
              Sign up as a learner
            </Link>
            <Link
              href="/business/signup"
              className="flex items-center justify-center rounded-lg border border-surface-border bg-white px-4 py-3 text-sm font-semibold text-[#374151] no-underline transition-colors duration-fast hover:bg-surface-inset"
            >
              Create a business account
            </Link>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-[#9ca3af]">
            Learners enroll in courses and collect certificates. Businesses publish courses and
            assign them to their team.
          </p>
        </div>
      </div>
    </div>
  )
}
