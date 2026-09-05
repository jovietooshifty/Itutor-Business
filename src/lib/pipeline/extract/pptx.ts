import JSZip from 'jszip'
import { toBuffer, type BinaryInput } from './source'
import { ExtractionError, THIN_TEXT_CHARS, type ExtractedContent } from './types'

/**
 * Pulls the words out of a PowerPoint deck.
 *
 * A .pptx is a zip of XML. Each slide is ppt/slides/slideN.xml, and the text
 * lives in <a:t> elements — one per run, which is why a single sentence
 * arrives split across several of them whenever the author bolded a word or
 * the spell-checker touched it.
 *
 * There is no pptx parser in the dependency tree and adding a heavyweight one
 * to read a handful of tags would be a poor trade, so this reads the XML
 * directly. That is defensible precisely because the target is narrow: this
 * extracts text for quiz generation and nothing else — no layout, no shapes,
 * no images. It never renders anything.
 */
export async function extractFromPptx(input: BinaryInput): Promise<ExtractedContent> {
  const buffer = await toBuffer(input, 'pptx')

  let zip: JSZip
  try {
    zip = await JSZip.loadAsync(buffer)
  } catch (cause) {
    const label = typeof input === 'string' ? input : 'the uploaded file'
    throw new ExtractionError('pptx', `Could not open .pptx (${label}) — it may not be a valid deck`, {
      cause,
    })
  }

  /* Numeric order, not the zip's. "slide10" sorts before "slide2" as a string,
     which would hand the quiz generator the deck out of order. */
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => slideNumber(a) - slideNumber(b))

  if (slideFiles.length === 0) {
    return {
      text: '',
      sourceType: 'pptx',
      warnings: ['No slides were found in that file — it may not be a PowerPoint deck.'],
    }
  }

  const warnings: string[] = []
  const slides: string[] = []

  for (const name of slideFiles) {
    const xml = await zip.file(name)?.async('string')
    if (!xml) continue

    const body = slideText(xml)
    /* Notes are where the actual script often lives — a slide reading
       "Lockout/Tagout" with three paragraphs of explanation beneath it. Worth
       far more to a quiz than the heading.

       Built from the slide's number, not by rewriting its path: the notes file
       is notesSlideN.xml, so a string swap on the directory produces
       "notesSlideslide1.xml" and silently finds nothing. */
    const notesName = `ppt/notesSlides/notesSlide${slideNumber(name)}.xml`
    const notesXml = await zip.file(notesName)?.async('string')
    const notes = notesXml ? slideText(notesXml) : ''

    const combined = [body, notes].filter(Boolean).join('\n')
    if (combined.trim()) slides.push(`Slide ${slides.length + 1}\n${combined.trim()}`)
  }

  const text = slides.join('\n\n').replace(/[ \t]+/g, ' ').trim()

  if (text.length === 0) {
    warnings.push(
      'No readable text came out of that deck — the slides may be images, which needs OCR.'
    )
  } else if (text.length < THIN_TEXT_CHARS) {
    warnings.push(
      `Only ${text.length} characters extracted from ${slideFiles.length} slide${slideFiles.length === 1 ? '' : 's'} — too thin to generate a meaningful quiz.`
    )
  }

  return { text, sourceType: 'pptx', warnings }
}

function slideNumber(path: string): number {
  return Number(path.match(/slide(\d+)\.xml$/)?.[1] ?? 0)
}

/**
 * The text of one slide's XML.
 *
 * `<a:p>` is a paragraph and `<a:t>` a run within it, so runs are joined
 * without a separator and paragraphs with a newline — otherwise a bolded word
 * mid-sentence comes back as its own line.
 */
function slideText(xml: string): string {
  const paragraphs = xml.match(/<a:p\b[\s\S]*?<\/a:p>/g) ?? []

  return paragraphs
    .map((paragraph) => {
      const runs = paragraph.match(/<a:t\b[^>]*>([\s\S]*?)<\/a:t>/g) ?? []
      return runs
        .map((run) => decodeXml(run.replace(/<[^>]+>/g, '')))
        .join('')
        .trim()
    })
    .filter(Boolean)
    .join('\n')
}

/** The five predefined XML entities, plus numeric escapes. */
function decodeXml(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    // Last, so an escaped ampersand cannot re-form another entity.
    .replace(/&amp;/g, '&')
}
