import type { Metadata } from 'next'
import { RolePickerTrigger } from '@/components/marketing/role-picker-modal'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building,
  Check,
  Factory,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  ShoppingBag,
  Store,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'
import { CoursePreview } from '@/components/marketing/course-preview'
import { SiteFooter } from '@/components/marketing/site-footer'
import { SiteHeader } from '@/components/marketing/site-header'

export const metadata: Metadata = {
  title: 'iTutor Business — Train your team. Track every course.',
  description:
    'One platform for businesses to onboard and train their teams, and for individuals to build verified, job-ready skills.',
}

/**
 * Marketing landing page — handoff flow 8 ("Landing Page.dc.html"), including
 * the ungated marketplace preview.
 *
 * The design offers two hero treatments, `photo` and `gradient-icon`. There is
 * no hero photograph in the repo, so this uses the gradient treatment (the
 * design's own sanctioned alternative) inside the photo treatment's layout,
 * which is what carries the floating onboarding-checklist card. Drop a real
 * image in and the card keeps working over it unchanged.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      {/*
        A light green ground for the whole page. Sections that need to sit
        apart — the course preview, the closing band — set their own
        background over it, so this reads as a tint rather than flattening
        the page into one colour.
      */}
      <main className="bg-mint-wash">
        <Hero />
        <CoursePreview />
        <HowItWorks />
        <Stats />
        <TrustStrip />
        <Features />
        <CtaBand />
      </main>
      <SiteFooter />
    </>
  )
}

/* ── Hero ──────────────────────────────────────────────────────────────── */

const ONBOARDING_STEPS = [
  { label: 'Account created', done: true },
  { label: 'Team invited', done: true },
  { label: 'First course assigned', done: false },
]

function Hero() {
  return (
    <section className="relative overflow-hidden bg-mint-wash px-6 pb-10 pt-[52px]">
      <div
        aria-hidden
        className="animate-blob pointer-events-none absolute -left-32 top-[60px] h-[280px] w-[280px] rounded-full bg-[color:color-mix(in_oklab,var(--brand)_20%,transparent)] blur-[64px]"
      />
      <div
        aria-hidden
        className="animate-blob pointer-events-none absolute right-0 top-[20%] h-[320px] w-[320px] rounded-full bg-[color:color-mix(in_oklab,var(--coral)_15%,transparent)] blur-[64px] [animation-delay:-6s]"
      />

      <div className="relative mx-auto grid max-w-content items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--brand)_30%,transparent)] bg-white/70 px-4 py-1.5 text-sm font-medium text-forest backdrop-blur-[8px]">
            <span className="h-2 w-2 rounded-full bg-brand" />
            Training software for growing teams
          </div>

          <h1 className="mb-0 mt-6 text-[clamp(2.5rem,6vw,var(--text-hero))] font-bold leading-[1.02] tracking-display text-ink">
            Train your team.
            <br />
            <span className="text-itutor-green">Track every course.</span>
          </h1>

          <p className="mt-7 max-w-[480px] text-lg leading-relaxed text-ink-muted">
            One platform for businesses to onboard and train their teams, and for individuals to
            build verified, job-ready skills.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <RolePickerTrigger className="inline-flex h-[52px] cursor-pointer items-center justify-center rounded-lg bg-[image:var(--gradient-brand)] px-9 text-base font-bold text-white shadow-button-green transition-[filter] duration-fast hover:brightness-110">
              Get Started
            </RolePickerTrigger>
          </div>
        </div>

        <div className="relative min-w-0 pb-8 lg:pb-0">
          <div className="grid h-[320px] place-items-center overflow-hidden rounded-3xl bg-[image:var(--gradient-brand)] shadow-pop outline outline-1 outline-[rgba(17,24,39,0.05)]">
            <LayoutDashboard size={96} strokeWidth={1.2} color="rgba(255,255,255,0.9)" aria-hidden />
          </div>

          <div className="absolute -bottom-7 left-0 max-w-[230px] rounded-2xl bg-white p-4 shadow-card outline outline-1 outline-[rgba(17,24,39,0.05)] lg:-left-7">
            <p className="m-0 mb-2.5 text-2xs font-bold uppercase tracking-[0.06em] text-ink-muted">
              Onboarding checklist
            </p>
            <div className="grid gap-2">
              {ONBOARDING_STEPS.map((step) => (
                <div key={step.label} className="flex items-center gap-2 text-sm text-ink">
                  <span
                    className={
                      step.done
                        ? 'grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-[rgba(25,147,86,0.15)] text-[var(--itutor-green)]'
                        : 'grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-neutral-bg text-[#9ca3af]'
                    }
                  >
                    <Check size={11} strokeWidth={3} aria-hidden />
                  </span>
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── How it works ──────────────────────────────────────────────────────── */

const STEPS = [
  {
    number: '01',
    title: 'Create your account',
    description: 'Sign up as a business or an individual learner in just a few minutes.',
    icon: UserPlus,
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
  },
  {
    number: '02',
    title: 'Add your team, or browse courses',
    description:
      'Businesses invite contractors and assign training. Learners explore the course catalog.',
    icon: LayoutGrid,
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
  },
  {
    number: '03',
    title: 'Learn and track progress',
    description: 'Complete courses on any device, and follow completions on a live dashboard.',
    icon: TrendingUp,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-soft px-6 py-20">
      <div className="mb-14 text-center">
        <h2 className="m-0 mb-3 text-[clamp(32px,4vw,44px)] font-bold tracking-heading text-ink">
          How It Works
        </h2>
        <p className="mx-auto my-0 max-w-[480px] text-lg text-ink-muted">
          From sign-up to certified, in three steps.
        </p>
      </div>

      <div className="mx-auto grid max-w-content gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={step.number} className="relative">
              <div className="h-full rounded-2xl border border-[#f3f4f6] bg-white p-8 shadow-sm">
                <span
                  className="mb-5 grid h-12 w-12 place-items-center rounded-lg"
                  style={{ background: step.iconBg, color: step.iconColor }}
                >
                  <Icon size={22} aria-hidden />
                </span>
                <p className="m-0 mb-2 text-2xs font-bold tracking-[0.08em] text-ink-muted">
                  {step.number}
                </p>
                <h3 className="m-0 mb-2 text-[18px] font-bold text-ink">{step.title}</h3>
                <p className="m-0 text-sm leading-relaxed text-ink-muted">{step.description}</p>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="absolute -right-3.5 top-16 z-10 hidden w-6 border-t-2 border-dashed border-[#86efac] md:block"
                />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ── Stats ─────────────────────────────────────────────────────────────── */

const STATS = [
  { value: '3,200+', label: 'Courses completed', className: 'text-brand' },
  { value: '410+', label: 'Organizations onboarded', className: 'text-coral' },
  { value: '40+', label: 'Course categories', className: 'text-brand-deep' },
  { value: '97%', label: 'Completion rate', className: 'text-coral' },
]

function Stats() {
  return (
    <section className="bg-surface-soft px-6 py-20">
      <div className="mx-auto grid max-w-[1024px] gap-px overflow-hidden rounded-3xl bg-border shadow-card sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white p-8 text-center">
            <div
              className={`text-[44px] font-bold tabular-nums tracking-heading ${stat.className}`}
            >
              {stat.value}
            </div>
            <p className="mb-0 mt-2 text-sm text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Trust strip ───────────────────────────────────────────────────────── */

const TRUST_ICONS = [Building, Store, Factory, Briefcase, ShoppingBag]

function TrustStrip() {
  return (
    <section className="bg-white px-6 py-16 text-center">
      <p className="m-0 mb-8 text-sm font-semibold uppercase tracking-[0.08em] text-ink-muted">
        Trusted by teams across industries
      </p>
      <div className="mx-auto flex max-w-content flex-wrap justify-center gap-5">
        {TRUST_ICONS.map((Icon, index) => (
          <div
            key={index}
            className="grid h-12 w-32 place-items-center rounded-md bg-neutral-bg text-[#9ca3af]"
          >
            <Icon size={22} aria-hidden />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Features ──────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Users,
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
    title: 'Role-based team management',
    description: 'Give owners, managers and contractors exactly the access they need.',
  },
  {
    icon: Layers,
    iconBg: 'var(--sky)',
    iconColor: '#2563eb',
    title: 'Any course format',
    description: 'Mix video, live sessions, documents and quizzes within a single course.',
  },
  {
    icon: BarChart3,
    iconBg: 'var(--peach)',
    iconColor: '#ea580c',
    title: 'Progress dashboards',
    description: 'See completion and certification status across your whole team at a glance.',
  },
]

function Features() {
  return (
    <section className="bg-surface-soft px-6 py-20">
      <div className="mx-auto max-w-content">
        <div className="mb-12 text-center">
          <h2 className="m-0 mb-3 text-[clamp(32px,4vw,40px)] font-bold tracking-heading text-ink">
            Everything your team needs
          </h2>
          <p className="m-0 text-lg text-ink-muted">
            From onboarding to certification, manage it all in one platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#f3f4f6] bg-white p-8 shadow-sm"
              >
                <span
                  className="mb-5 grid h-12 w-12 place-items-center rounded-lg"
                  style={{ background: feature.iconBg, color: feature.iconColor }}
                >
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="m-0 mb-2 text-[18px] font-bold text-ink">{feature.title}</h3>
                <p className="m-0 text-sm leading-relaxed text-ink-muted">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── Closing CTA ───────────────────────────────────────────────────────── */

function CtaBand() {
  return (
    <section className="bg-white px-6 pt-16">
      <div className="relative mx-auto max-w-content overflow-hidden rounded-band bg-cta-band p-14 text-center shadow-pop">
        <div
          aria-hidden
          className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-[64px]"
        />
        <h2 className="relative m-0 text-[clamp(28px,4vw,40px)] font-bold leading-[1.1] text-white">
          Ready to get your team started?
        </h2>
        <p className="relative mx-auto mb-0 mt-4 max-w-[480px] text-white/85">
          Sign up in minutes — no approval wait, no setup fees.
        </p>
        <div className="relative mt-7">
          <RolePickerTrigger className="inline-flex h-[52px] cursor-pointer items-center justify-center rounded-lg bg-white px-9 text-base font-bold text-forest transition-colors duration-fast hover:bg-white/90">
            Sign up
          </RolePickerTrigger>
        </div>
      </div>
    </section>
  )
}
