import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import { ExtractionError, THIN_TEXT_CHARS, truncateForMessage, type ExtractedContent } from './types'

const FETCH_TIMEOUT_MS = 15_000

/* Sending a real browser UA is a pragmatic hedge: plenty of sites reject an
   absent or obviously-scripted User-Agent outright. It does nothing against
   real bot detection, which is handled by reporting the block clearly instead
   of trying to defeat it. */
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

/* Interstitials that return HTTP 200 with a challenge or app shell instead of
   the article. Matching these turns a confusing empty result into a clear
   "this needs a real browser" message. */
const BLOCK_SIGNALS = [
  'just a moment',
  'enable javascript and cookies to continue',
  'checking your browser before accessing',
  'verifying you are human',
  'attention required! | cloudflare',
]

export async function extractFromWebsite(url: string): Promise<ExtractedContent> {
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    throw new ExtractionError('website', `Not a valid URL: ${url}`)
  }
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new ExtractionError('website', `Unsupported protocol "${parsedUrl.protocol}" — only http and https`)
  }

  let response: Response
  try {
    response = await fetch(parsedUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
  } catch (cause) {
    const reason = cause instanceof Error && cause.name === 'TimeoutError'
      ? `No response within ${FETCH_TIMEOUT_MS / 1000}s`
      : 'Network request failed (DNS, connection refused, or TLS error)'
    throw new ExtractionError('website', `${reason}: ${parsedUrl.href}`, { cause })
  }

  if (!response.ok) {
    const blocked = response.status === 403 || response.status === 429
    throw new ExtractionError(
      'website',
      `Site returned HTTP ${response.status}${blocked ? ' — most likely blocking automated requests' : ''}: ${parsedUrl.href}`,
    )
  }

  const contentType = response.headers.get('content-type') ?? 'unknown'
  if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
    throw new ExtractionError(
      'website',
      `Expected HTML but the server returned "${contentType}" — this extractor only handles web pages`,
    )
  }

  const html = await response.text()
  const lowerHtml = html.slice(0, 4000).toLowerCase()
  const signal = BLOCK_SIGNALS.find((marker) => lowerHtml.includes(marker))
  if (signal) {
    throw new ExtractionError(
      'website',
      `Page served an anti-bot or JavaScript-required interstitial ("${signal}") rather than content: ${parsedUrl.href}`,
    )
  }

  let article: ReturnType<Readability['parse']>
  try {
    /* The url option matters: Readability needs a document base to resolve
       relative links and to run its own URL heuristics. jsdom does not execute
       scripts by default, which is what we want here. */
    const dom = new JSDOM(html, { url: parsedUrl.href })
    article = new Readability(dom.window.document).parse()
  } catch (cause) {
    throw new ExtractionError('website', `Could not parse the page HTML: ${parsedUrl.href}`, { cause })
  }

  const text = (article?.textContent ?? '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()

  /* Unlike a scanned PDF, which still hands back something to inspect, a
     Readability miss means there is no article text at all — nothing
     downstream could use, so this is a failure rather than a warning. Most
     often it means the page is client-rendered, which a plain fetch cannot
     see. */
  if (text.length === 0) {
    throw new ExtractionError(
      'website',
      `No readable article content found — the page is likely client-rendered or not an article: ${parsedUrl.href}`,
    )
  }

  const warnings: string[] = []
  if (text.length < THIN_TEXT_CHARS) {
    warnings.push(
      `Only ${text.length} characters of readable content extracted ("${truncateForMessage(text, 80)}") — ` +
        'too thin to generate a meaningful quiz.',
    )
  }

  return { text, sourceType: 'website', warnings }
}
