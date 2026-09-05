import 'server-only'
import { Resend } from 'resend'
import { renderEmail, type EmailContent } from '@/lib/email/template'

/**
 * Sending transactional mail.
 *
 * The governing rule is that **a failed email never fails the thing that
 * triggered it**. Enrolling and completing a course are the learner's actions;
 * if the notice to the admin bounces, or the key is missing, or Resend is
 * down, the enrolment still stands. Every path here resolves rather than
 * throws, and says what happened in the logs.
 */

export type SendResult =
  | { ok: true; id: string }
  | { ok: false; reason: 'not-configured' | 'no-recipient' | 'failed'; detail?: string }

/** Lazily constructed: importing this module must not require a key. */
let client: Resend | null = null
function resend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  client ??= new Resend(key)
  return client
}

/**
 * The From address. Must be on a domain verified in Resend — anything else is
 * rejected at the API, which is why this is configuration rather than a
 * constant.
 */
function from(): string {
  return process.env.EMAIL_FROM ?? 'iTutor Business <onboarding@resend.dev>'
}

export async function sendEmail({
  to,
  subject,
  content,
  replyTo,
}: {
  to: string | null | undefined
  subject: string
  content: EmailContent
  replyTo?: string | null
}): Promise<SendResult> {
  if (!to?.trim()) {
    console.warn('[email] skipped, no recipient', { subject })
    return { ok: false, reason: 'no-recipient' }
  }

  const api = resend()
  if (!api) {
    /* Not an error. Local development and preview deployments run without a
       key on purpose, and the alternative — throwing — would make enrolling
       fail on any environment that has not been given one. */
    console.warn('[email] skipped, RESEND_API_KEY is not set', { to, subject })
    return { ok: false, reason: 'not-configured' }
  }

  const { html, text } = renderEmail(content)

  try {
    const { data, error } = await api.emails.send({
      from: from(),
      to,
      subject,
      html,
      text,
      ...(replyTo ? { replyTo } : {}),
    })

    if (error) {
      console.error('[email] send failed', { to, subject, error: error.message })
      return { ok: false, reason: 'failed', detail: error.message }
    }
    return { ok: true, id: data?.id ?? '' }
  } catch (cause) {
    console.error('[email] send threw', { to, subject, cause })
    return { ok: false, reason: 'failed', detail: String(cause) }
  }
}

/** Absolute links, since an email has no origin to resolve against. */
export function siteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://itutor-business.vercel.app').replace(
    /\/$/,
    ''
  )
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
