import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Check, CircleCheck, Lock } from 'lucide-react'
import { Badge, Button, Card, ProgressBar } from '@/components/ui'
import { EnrolButton } from '@/components/learner/enrol-button'
import { CompanyPanel } from '@/components/company-panel'
import { loadCompanyPanel } from '@/lib/company-panel'
import { blockTypeMeta, type BlockType } from '@/lib/course'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Course — iTutor' }

/**
 * The learner's course landing page. Shows the real block-by-block curriculum
 * rather than a summary line — handoff §7 calls out the summary version as a
 * known issue, and "What you'll learn" now has a real source behind it
 * (courses.what_you_will_learn, collected on builder step 1).
 *
 * Reaching this page at all is RLS's decision: public + published, enrolled,
 * or a member of the owning business.
 */
export default async function Page({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: course }, { data: blocks }, { data: enrollmentRows }] = await Promise.all([
    supabase
      .from('courses')
      .select(
        'id, business_id, title, description, tagline, duration_label, what_you_will_learn, businesses(name)'
      )
      .eq('id', courseId)
      .maybeSingle(),
    supabase
      .from('course_blocks')
      .select('id, type, title, position')
      .eq('course_id', courseId)
      .order('position'),
    // Highest cycle: a retake supersedes the completed enrolment before it.
    supabase
      .from('enrollments')
      .select('id, status')
      .eq('course_id', courseId)
      .eq('learner_id', user.id)
      .order('cycle', { ascending: false })
      .limit(1),
  ])

  if (!course) notFound()

  const enrollment = enrollmentRows?.[0]
  const lessons = blocks ?? []

  // Progress only exists once enrolled; the landing page is also the pre-enrol
  // pitch, so everything below tolerates its absence.
  const { data: progress } = enrollment
    ? await supabase
        .from('block_progress')
        .select('block_id, status')
        .eq('enrollment_id', enrollment.id)
    : { data: null }

  const progressByBlock = new Map((progress ?? []).map((p) => [p.block_id, p.status]))
  const completed = (progress ?? []).filter((p) => p.status === 'completed').length
  const percent = lessons.length ? Math.round((completed / lessons.length) * 100) : 0

  // Where "Continue" goes: the first lesson they have not finished.
  const nextBlock =
    lessons.find((b) => progressByBlock.get(b.id) !== 'completed') ?? lessons[0] ?? null

  const outcomes = course.what_you_will_learn ?? []
  const businessName = (course.businesses as { name: string } | null)?.name

  /* The full company panel, not just the name — this is the other surface
     where someone decides whether to join. */
  const company = await loadCompanyPanel(course.business_id)

  const courseComplete = enrollment?.status === 'completed'

  return (
    <main className="mx-auto max-w-[880px] p-6 md:p-10">
      {/*
        Who is running this, first — in place of the course banner that used to
        sit here. The banner was the course thumbnail, which on this page is
        the same artwork as the company cover and stretched to 220px tall, so
        it repeated the header below it and said nothing a learner needed. The
        company panel occupies that space instead: it was at the foot of the
        page, below the whole curriculum, where the person deciding whether to
        trust this employer would never scroll to find it.
      */}
      {company && (
        <div className="mb-5">
          <CompanyPanel company={company} />
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="p-7 md:p-9">
          {businessName && (
            <p className="m-0 text-sm font-semibold text-ink-muted">{businessName}</p>
          )}
          <h1 className="m-0 mt-1.5 font-display text-[30px] font-bold leading-tight text-ink">
            {course.title}
          </h1>
          {course.tagline && <p className="m-0 mt-2 text-base text-ink-muted">{course.tagline}</p>}

          <p className="m-0 mt-3 text-xs text-[#9ca3af]">
            {lessons.length === 0
              ? 'No lessons yet'
              : `${lessons.length} ${lessons.length === 1 ? 'lesson' : 'lessons'}`}
            {course.duration_label ? ` · ${course.duration_label}` : ''}
          </p>

          {course.description && (
            <p className="mt-5 text-[15px] leading-relaxed text-ink">{course.description}</p>
          )}

          <div className="mt-7">
            {!enrollment ? (
              <EnrolButton courseId={course.id} firstBlockId={lessons[0]?.id ?? null} />
            ) : (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-ink">
                    {completed} of {lessons.length} complete
                  </span>
                  <span className="text-sm text-ink-muted">{percent}%</span>
                </div>
                <ProgressBar value={percent} accent="coral" />

                {/* Finishing a course is the moment a portfolio first has
                    something in it — which is why the question of sharing one
                    is asked here rather than during signup, when a learner has
                    no idea what a portfolio is or what would be on it. */}
                {courseComplete ? (
                  <div className="mt-4 rounded-xl bg-brand-light px-4 py-4">
                    <p className="m-0 flex items-center gap-2 font-display text-base font-bold text-forest">
                      <CircleCheck size={18} aria-hidden /> Course completed
                    </p>
                    <p className="m-0 mt-1 text-sm text-forest/80">
                      Your certificate is on your portfolio — a page you can share with employers.
                    </p>
                    <div className="mt-3.5 flex flex-wrap gap-2.5">
                      <Link href="/my-portfolio" className="no-underline">
                        <Button accent="coral">View your portfolio</Button>
                      </Link>
                      {nextBlock && (
                        <Link href={`/learn/${course.id}/${nextBlock.id}`} className="no-underline">
                          <Button variant="secondary">Review the course</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  nextBlock && (
                    <div className="mt-4">
                      <Link href={`/learn/${course.id}/${nextBlock.id}`} className="no-underline">
                        <Button size="lg" accent="coral">
                          {completed === 0 ? 'Start course' : 'Continue'}
                        </Button>
                      </Link>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {outcomes.length > 0 && (
        <Card className="mt-5 p-7 md:p-9">
          <h2 className="m-0 mb-3.5 font-display text-lg font-bold text-ink">
            What you&apos;ll learn
          </h2>
          <ul className="m-0 grid list-none gap-2.5 p-0 sm:grid-cols-2">
            {outcomes.map((outcome, index) => (
              <li key={`${outcome}-${index}`} className="flex items-start gap-2.5 text-sm text-ink">
                <Check size={15} className="mt-0.5 shrink-0 text-coral" aria-hidden />
                {outcome}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="mt-5 p-7 md:p-9">
        <h2 className="m-0 mb-4 font-display text-lg font-bold text-ink">Course content</h2>
        {lessons.length === 0 ? (
          <p className="m-0 text-sm text-ink-muted">
            This course has no lessons yet. Check back soon.
          </p>
        ) : (
          <ol className="m-0 grid list-none gap-2 p-0">
            {lessons.map((block, index) => {
              const meta = blockTypeMeta(block.type as BlockType)
              const Icon = meta.icon
              const status = progressByBlock.get(block.id)
              const isDone = status === 'completed'
              const isOpen = Boolean(enrollment) && status !== 'locked'

              const row = (
                <>
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-md"
                    style={{ background: meta.iconBg, color: meta.iconColor }}
                  >
                    <Icon size={15} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">
                      {block.title?.trim() || `${meta.label} ${index + 1}`}
                    </span>
                    <span className="block text-xs text-[#9ca3af]">{meta.label}</span>
                  </span>
                  {isDone ? (
                    <CircleCheck size={17} className="shrink-0 text-[var(--itutor-green)]" />
                  ) : !isOpen ? (
                    <Lock size={14} className="shrink-0 text-[#9ca3af]" aria-hidden />
                  ) : (
                    <Badge tone="neutral">Next</Badge>
                  )}
                </>
              )

              return (
                <li key={block.id}>
                  {isOpen ? (
                    <Link
                      href={`/learn/${course.id}/${block.id}`}
                      className="flex items-center gap-3 rounded-lg border border-surface-border bg-white px-4 py-3 no-underline transition-colors duration-fast hover:border-coral"
                    >
                      {row}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 rounded-lg border border-surface-border bg-surface-inset px-4 py-3">
                      {row}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </Card>

    </main>
  )
}
