/**
 * The shell every transactional email is rendered into.
 *
 * Email is not the web. Everything here is deliberately old-fashioned — a
 * table for the frame, inline styles on each element, no flexbox, no CSS
 * variables, no external stylesheet — because Outlook and several Android
 * clients strip or ignore all of the modern equivalents, and a message that
 * collapses into unstyled text is worse than a plain one.
 *
 * Colours are the product's, restated as literals for the same reason: the
 * design tokens in globals.css do not exist inside an inbox.
 */

const BRAND = '#199356'
const INK = '#111827'
const INK_MUTED = '#4b5563'
const MUTED = '#9ca3af'
const BORDER = '#e5e7eb'
const CANVAS = '#f0f7f2'

export type EmailButton = { label: string; url: string }

export type EmailContent = {
  /** Shown in the inbox list beside the subject; never rendered in the body. */
  preheader: string
  heading: string
  /** Each string is one paragraph. Plain text — no markup. */
  body: string[]
  button?: EmailButton
  /** Label/value rows shown in a bordered panel, e.g. course and learner. */
  facts?: { label: string; value: string }[]
  /** Small print under the button. */
  footnote?: string
}

/** Everything interpolated into the HTML goes through this first. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderEmail(content: EmailContent): { html: string; text: string } {
  const paragraphs = content.body
    .map(
      (line) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${INK_MUTED};">${escapeHtml(line)}</p>`
    )
    .join('')

  const facts = content.facts?.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0;border:1px solid ${BORDER};border-radius:10px;">
         ${content.facts
           .map(
             (fact, i) => `<tr>
               <td style="padding:12px 16px;${i ? `border-top:1px solid ${BORDER};` : ''}font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:${MUTED};width:42%;">${escapeHtml(fact.label)}</td>
               <td style="padding:12px 16px;${i ? `border-top:1px solid ${BORDER};` : ''}font-size:14px;color:${INK};">${escapeHtml(fact.value)}</td>
             </tr>`
           )
           .join('')}
       </table>`
    : ''

  /* A table-wrapped anchor, not a styled <button>. Outlook renders the anchor
     and ignores the rest, which is exactly the fallback we want. */
  const button = content.button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
         <tr><td style="border-radius:8px;background:${BRAND};">
           <a href="${escapeHtml(content.button.url)}" style="display:inline-block;padding:12px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">${escapeHtml(content.button.label)}</a>
         </td></tr>
       </table>`
    : ''

  const footnote = content.footnote
    ? `<p style="margin:8px 0 0;font-size:12px;line-height:1.5;color:${MUTED};">${escapeHtml(content.footnote)}</p>`
    : ''

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only">
<title>${escapeHtml(content.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};font-family:Arial,Helvetica,sans-serif;">
<!-- Sits in the inbox preview line, invisible in the message itself. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(content.preheader)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${CANVAS};">
 <tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border:1px solid ${BORDER};border-radius:14px;">
   <tr><td style="padding:22px 28px;border-bottom:1px solid ${BORDER};">
     <span style="font-size:17px;font-weight:700;color:${INK};">iTutor</span>
     <span style="font-size:17px;color:${MUTED};"> Business</span>
   </td></tr>
   <tr><td style="padding:28px;">
     <h1 style="margin:0 0 14px;font-size:21px;line-height:1.3;color:${INK};">${escapeHtml(content.heading)}</h1>
     ${paragraphs}${facts}${button}${footnote}
   </td></tr>
   <tr><td style="padding:18px 28px;border-top:1px solid ${BORDER};">
     <p style="margin:0;font-size:12px;line-height:1.5;color:${MUTED};">
       You are receiving this because of activity on your iTutor Business account.
     </p>
   </td></tr>
  </table>
 </td></tr>
</table>
</body></html>`

  /* A real text alternative, not a stripped copy. Some clients show only this,
     and spam filters treat a missing one as a signal. */
  const text = [
    content.heading,
    '',
    ...content.body,
    ...(content.facts?.length
      ? ['', ...content.facts.map((f) => `${f.label}: ${f.value}`)]
      : []),
    ...(content.button ? ['', `${content.button.label}: ${content.button.url}`] : []),
    ...(content.footnote ? ['', content.footnote] : []),
    '',
    '— iTutor Business',
  ].join('\n')

  return { html, text }
}
