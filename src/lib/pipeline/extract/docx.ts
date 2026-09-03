import * as mammoth from 'mammoth'
import { ExtractionError, THIN_TEXT_CHARS, type ExtractedContent } from './types'

export async function extractFromDocx(filePath: string): Promise<ExtractedContent> {
  /* mammoth uses `export =` and does not export its Result interface, so the
     type is taken from the function itself. */
  let result: Awaited<ReturnType<typeof mammoth.extractRawText>>
  try {
    /* extractRawText rather than convertToHtml: the quiz prompt wants prose,
       and markup would just spend tokens. */
    result = await mammoth.extractRawText({ path: filePath })
  } catch (cause) {
    throw new ExtractionError('docx', `Could not read or parse .docx at ${filePath}`, { cause })
  }

  const text = result.value.replace(/[ \t]+/g, ' ').trim()
  const warnings = result.messages.map((message) => `mammoth: ${message.message}`)

  if (text.length === 0) {
    warnings.push('Document produced no extractable text — it may contain only images or embedded objects.')
  } else if (text.length < THIN_TEXT_CHARS) {
    warnings.push(`Only ${text.length} characters extracted — too thin to generate a meaningful quiz.`)
  }

  return { text, sourceType: 'docx', warnings }
}
