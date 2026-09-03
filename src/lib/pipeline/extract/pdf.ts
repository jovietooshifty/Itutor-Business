import { createRequire } from 'node:module'
import path from 'node:path'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { toBuffer, type BinaryInput } from './source'
import { ExtractionError, THIN_TEXT_CHARS, type ExtractedContent } from './types'

/* pdfjs loads character maps and standard font metrics from disk on demand.
   Without these paths it warns and, for CID-keyed fonts (CJK and some embedded
   subsets), decodes text incorrectly — so this affects extraction accuracy,
   not just log noise. Resolved from the installed package so the paths hold
   wherever node_modules lives.

   Forward slashes and a trailing slash are both required by pdfjs's own url
   validation, which rejects a Windows backslash path outright. */
const pdfjsRoot = path
  .dirname(createRequire(__filename).resolve('pdfjs-dist/package.json'))
  .replace(/\\/g, '/')
const CMAP_URL = `${pdfjsRoot}/cmaps/`
const STANDARD_FONTS_URL = `${pdfjsRoot}/standard_fonts/`

/* A page of real body text extracts 1,500–3,000+ characters; a scanned page
   with no text layer yields near zero, sometimes a few characters of header
   artifact. 100 sits an order of magnitude below real text and above scan
   noise.

   The two error costs are asymmetric, so this leans deliberately low: a false
   positive (a title slide or diagram-heavy page flagged as scanned) only adds
   a non-fatal warning, while a false negative feeds near-empty text into quiz
   generation with no signal as to why the questions are nonsense. */
export const SCANNED_CHARS_PER_PAGE = 100

export type PdfExtraction = ExtractedContent & {
  isScanned: boolean
  pageCount: number
}

export async function extractFromPdf(input: BinaryInput): Promise<PdfExtraction> {
  const buffer = await toBuffer(input, 'pdf')
  const label = typeof input === 'string' ? input : 'the uploaded file'

  /* Checked before handing anything to pdfjs, because a mislabelled file is
     common in practice (a .docx saved as .pdf) and pdfjs only reports it as
     "Invalid PDF structure", which sends you looking for the wrong problem. */
  const misnamed = detectMisnamedFile(buffer)
  if (misnamed) {
    throw new ExtractionError('pdf', `${label} is not a PDF — it looks like ${misnamed}`)
  }

  /* pdfjs mutates the buffer it is handed, so it gets a copy — otherwise a
     caller reusing the same buffer sees it detached. */
  const loadingTask = getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    cMapUrl: CMAP_URL,
    cMapPacked: true,
    standardFontDataUrl: STANDARD_FONTS_URL,
  })

  let pageCount: number
  let text: string
  try {
    const doc = await loadingTask.promise

    pageCount = doc.numPages
    const pages: string[] = []
    for (let n = 1; n <= doc.numPages; n += 1) {
      const page = await doc.getPage(n)
      const content = await page.getTextContent()
      pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '))
    }
    text = pages.join('\n\n').replace(/[ \t]+/g, ' ').trim()
  } catch (cause) {
    /* pdfjs distinguishes password-protected from structurally broken; passing
       its own reason through is the difference between an actionable message
       and a shrug. */
    const name = (cause as { name?: string })?.name
    const detail =
      name === 'PasswordException'
        ? 'the PDF is password-protected'
        : name === 'InvalidPDFException'
          ? 'the file is not a structurally valid PDF'
          : ((cause as { message?: string })?.message ?? 'unknown error')
    throw new ExtractionError('pdf', `Could not parse PDF: ${detail} (${label})`, { cause })
  } finally {
    /* Releases the pdfjs worker. Without this the process keeps a live worker
       per document, which matters once this runs inside a long-lived server. */
    await loadingTask.destroy()
  }

  if (pageCount === 0) {
    throw new ExtractionError('pdf', 'PDF reports zero pages')
  }

  const warnings: string[] = []
  const charsPerPage = text.length / pageCount
  const isScanned = charsPerPage < SCANNED_CHARS_PER_PAGE

  if (isScanned) {
    warnings.push(
      `Little or no extractable text (${Math.round(charsPerPage)} chars/page across ${pageCount} pages) — ` +
        'this PDF is most likely scanned images and needs OCR, which this pipeline does not do yet.',
    )
  } else if (text.length < THIN_TEXT_CHARS) {
    warnings.push(`Only ${text.length} characters extracted — too thin to generate a meaningful quiz.`)
  }

  return { text, sourceType: 'pdf', warnings, isScanned, pageCount }
}

/* Magic-byte sniff for the file types most often handed over with a .pdf
   extension. Office formats are ZIP containers, so they are told apart by the
   part names inside. */
function detectMisnamedFile(buffer: Buffer): string | null {
  if (buffer.subarray(0, 5).toString('latin1') === '%PDF-') return null

  if (buffer.subarray(0, 2).toString('latin1') === 'PK') {
    /* A zip's central directory sits at the end of the file and names every
       entry, so both ends are checked — the leading local header alone often
       only shows _rels/.rels, which does not identify the format. */
    const window =
      buffer.subarray(0, 4096).toString('latin1') +
      buffer.subarray(Math.max(0, buffer.length - 65_536)).toString('latin1')
    if (window.includes('word/')) return 'a Word .docx file — use the docx path instead'
    if (window.includes('ppt/')) return 'a PowerPoint .pptx file, which this pipeline does not handle yet'
    if (window.includes('xl/')) return 'an Excel .xlsx file, which this pipeline does not handle yet'
    /* "Print to XPS" output renamed to .pdf. Its pages are fixed-layout
       markup, so it needs a conversion step rather than a PDF parser. */
    if (window.includes('FixedDocumentSequence.fdseq') || window.includes('.fpage')) {
      return 'an XPS document (Microsoft "print to XPS" output) renamed to .pdf — re-export it as a real PDF'
    }
    return 'a ZIP or Office file (its contents start with a ZIP header, not %PDF-)'
  }

  const signatures: Array<[string, string]> = [
    ['\x89PNG', 'a PNG image'],
    ['\xff\xd8\xff', 'a JPEG image'],
    ['GIF8', 'a GIF image'],
    ['{\\rtf', 'an RTF document'],
    ['<!DOC', 'an HTML page'],
    ['<html', 'an HTML page'],
  ]
  const head = buffer.subarray(0, 8).toString('latin1')
  for (const [signature, description] of signatures) {
    if (head.startsWith(signature)) return description
  }

  return 'not a PDF (its header does not begin with %PDF-)'
}
