/**
 * The identification a learner provides before enrolling.
 *
 * This replaced the resume. A business putting someone on a jobsite needs to
 * know they are who they say they are; it does not need a work history it has
 * no way to verify. It is also a far smaller ask of a contractor filling this
 * in on a phone — photograph a card you already carry.
 */

export type IdDocumentType = 'national_id' | 'drivers_permit' | 'passport'

export const ID_DOCUMENT_OPTIONS: { value: IdDocumentType; label: string; hint: string }[] = [
  { value: 'national_id', label: 'National ID', hint: 'Your national identification card' },
  { value: 'drivers_permit', label: "Driver's permit", hint: 'Front of your licence' },
  { value: 'passport', label: 'Passport', hint: 'The photo page' },
]

export function idDocumentLabel(type: IdDocumentType | null | undefined): string {
  return ID_DOCUMENT_OPTIONS.find((o) => o.value === type)?.label ?? 'Identification'
}

/**
 * Accepted formats. Images lead the list because an ID is photographed far
 * more often than it is scanned; HEIC is there because that is what an iPhone
 * produces unless the owner has changed a setting they do not know exists.
 */
export const ID_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
] as const

export const ID_ACCEPT_ATTRIBUTE = '.png,.jpg,.jpeg,.webp,.heic,.heif,.pdf'

/** The bucket's own ceiling. A phone photo is comfortably under it. */
export const ID_MAX_BYTES = 10 * 1024 * 1024

export function isAcceptedIdFile(file: { type: string; name: string }): boolean {
  if ((ID_MIME_TYPES as readonly string[]).includes(file.type)) return true
  // Some browsers report an empty type for HEIC, so the extension decides.
  return /\.(png|jpe?g|webp|heic|heif|pdf)$/i.test(file.name)
}
