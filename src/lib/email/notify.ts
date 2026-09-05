import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, siteUrl } from '@/lib/email/send'

/**
 * The two notices the product sends, and who gets them.
 *
 * These run with the service role. The trigger is always a LEARNER's action —
 * enrolling, finishing — and the recipients are the business's staff, whose
 * membership rows and notification preferences the learner cannot read
 * (business_notification_prefs is own-rows-only, business_members is
 * members-only). The same reasoning issueCertificate uses: the learner is not
 * the one asserting this happened, the server is.
 *
 * Nothing here throws. A bounced notice must never fail the enrolment that
 * caused it — see sendEmail.
 */

type Recipient = { email: string; name: string | null }

/**
 * Active staff of a business who want this kind of notice.
 *
 * Auditors are included deliberately: read-only access is exactly the role
 * that exists to watch what is happening. Invited-but-not-joined members are
 * not, since there is no account behind them yet.
 */
async function staffToNotify(
  businessId: string,
  pref: 'notify_signups' | 'notify_course_complete'
): Promise<Recipient[]> {
  const admin = createAdminClient()

  const { data: members } = await admin
    .from('business_members')
    .select('user_id, users(email, full_name)')
    .eq('business_id', businessId)
    .eq('status', 'active')
    .not('user_id', 'is', null)

  if (!members?.length) return []

  const userIds = members.map((m) => m.user_id).filter((id): id is string => Boolean(id))
  const { data: prefs } = await admin
    .from('business_notification_prefs')
    .select(`user_id, ${pref}`)
    .eq('business_id', businessId)
    .in('user_id', userIds)

  /* Absent row means default, and both columns default to true — so someone
     who has never opened the settings modal still gets told. Only an explicit
     false opts out. */
  const optedOut = new Set(
    (prefs ?? [])
      .filter((row) => (row as unknown as Record<string, boolean>)[pref] === false)
      .map((row) => (row as unknown as { user_id: string }).user_id)
  )

  return members
    .filter((m) => m.user_id && !optedOut.has(m.user_id))
    .map((m) => {
      const user = m.users as unknown as { email: string; full_name: string | null } | null
      return { email: user?.email ?? '', name: user?.full_name ?? null }
    })
    .filter((r) => Boolean(r.email))
}

/** Course, its business, and the learner — the shape both notices need. */
async function context(courseId: string, learnerId: string) {
  const admin = createAdminClient()
  const [{ data: course }, { data: learner }] = await Promise.all([
    admin
      .from('courses')
      .select('id, title, business_id, businesses(name)')
      .eq('id', courseId)
      .maybeSingle(),
    admin.from('users').select('full_name, email').eq('id', learnerId).maybeSingle(),
  ])

  if (!course) return null
  return {
    course,
    businessName: (course.businesses as unknown as { name: string } | null)?.name ?? 'your business',
    learnerName: learner?.full_name || learner?.email || 'A learner',
    learnerEmail: learner?.email ?? null,
  }
}

/** Someone joined a course. Goes to the business's staff. */
export async function notifyEnrolment(courseId: string, learnerId: string): Promise<void> {
  try {
    const ctx = await context(courseId, learnerId)
    if (!ctx) return

    const recipients = await staffToNotify(ctx.course.business_id, 'notify_signups')
    if (recipients.length === 0) return

    const link = siteUrl(`/courses/${courseId}/manage/learners/${learnerId}`)

    await Promise.all(
      recipients.map((to) =>
        sendEmail({
          to: to.email,
          subject: `${ctx.learnerName} joined ${ctx.course.title}`,
          replyTo: ctx.learnerEmail,
          content: {
            preheader: `${ctx.learnerName} enrolled in ${ctx.course.title}.`,
            heading: 'A new learner joined your course',
            body: [
              `${ctx.learnerName} has enrolled in ${ctx.course.title}.`,
              'Their profile has their identification and contact details on it, and their progress will appear there as they work through the material.',
            ],
            facts: [
              { label: 'Learner', value: ctx.learnerName },
              { label: 'Course', value: ctx.course.title },
            ],
            button: { label: 'View their profile', url: link },
            footnote: 'You can turn these off under Settings → Notifications.',
          },
        })
      )
    )
  } catch (cause) {
    // Never propagates: enrolling succeeded regardless of what happened here.
    console.error('[email] enrolment notice failed', { courseId, learnerId, cause })
  }
}

/**
 * Someone finished a course. Goes to the business's staff, and to the learner
 * — the certificate is the thing they were working towards, so it is the one
 * notice worth sending them directly.
 */
export async function notifyCompletion(courseId: string, learnerId: string): Promise<void> {
  try {
    const ctx = await context(courseId, learnerId)
    if (!ctx) return

    const recipients = await staffToNotify(ctx.course.business_id, 'notify_course_complete')

    await Promise.all([
      ...recipients.map((to) =>
        sendEmail({
          to: to.email,
          subject: `${ctx.learnerName} completed ${ctx.course.title}`,
          replyTo: ctx.learnerEmail,
          content: {
            preheader: `${ctx.learnerName} finished ${ctx.course.title}.`,
            heading: 'A learner completed your course',
            body: [
              `${ctx.learnerName} has finished ${ctx.course.title} and a certificate has been issued.`,
              'Their scores on every quiz, including each attempt, are on their profile.',
            ],
            facts: [
              { label: 'Learner', value: ctx.learnerName },
              { label: 'Course', value: ctx.course.title },
            ],
            button: {
              label: 'See their results',
              url: siteUrl(`/courses/${courseId}/manage/learners/${learnerId}`),
            },
            footnote: 'You can turn these off under Settings → Notifications.',
          },
        })
      ),

      sendEmail({
        to: ctx.learnerEmail,
        subject: `You completed ${ctx.course.title}`,
        content: {
          preheader: `Your certificate for ${ctx.course.title} is ready.`,
          heading: `You finished ${ctx.course.title}`,
          body: [
            `Well done — you have completed ${ctx.course.title} with ${ctx.businessName}.`,
            'Your certificate is on your portfolio, which is a page you can share with employers using a private link.',
          ],
          facts: [
            { label: 'Course', value: ctx.course.title },
            { label: 'Issued by', value: ctx.businessName },
          ],
          button: { label: 'View your portfolio', url: siteUrl('/my-portfolio') },
        },
      }),
    ])
  } catch (cause) {
    console.error('[email] completion notice failed', { courseId, learnerId, cause })
  }
}
