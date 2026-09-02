/**
 * Option lists lifted verbatim from the Claude Design export scripts so the
 * built screens offer exactly the choices the mockups do.
 * Sources: design-reference/Organization Sign-Up.dc.html and
 *          design-reference/Learner Sign-Up.dc.html (bottom <script> blocks).
 */

export const ORG_ROLES = [
  'Owner / Founder',
  'General Manager',
  'Operations Manager',
  'Regional / District Manager',
  'Franchise Owner',
  'HR Manager',
  'Training Coordinator',
  'Compliance / Food Safety Officer',
  'Executive Chef',
  'Kitchen Manager',
  'Shift Supervisor',
  'Health & Safety Officer',
  'Other',
] as const

export const STANDARD_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'Portuguese',
  'Haitian Creole',
  'Mandarin Chinese',
  'German',
  'Italian',
  'Arabic',
  'Hindi',
  'Other',
] as const

export const LEARNER_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'Haitian Creole',
  'Portuguese',
  'Mandarin',
  'Other',
] as const

/** Trinidad & Tobago first — the export defaults phone country to +1 868. */
export const COUNTRY_CODES = [
  { name: 'Trinidad & Tobago', code: '+1 868' },
  { name: 'Jamaica', code: '+1 876' },
  { name: 'Barbados', code: '+1 246' },
  { name: 'Bahamas', code: '+1 242' },
  { name: 'Guyana', code: '+592' },
  { name: 'Saint Lucia', code: '+1 758' },
  { name: 'Grenada', code: '+1 473' },
  { name: 'Canada', code: '+1' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'United States', code: '+1' },
] as const

export const DEFAULT_PHONE_COUNTRY = '+1 868'

export const INDUSTRY_OPTIONS = [
  'Restaurant',
  'Catering',
  'Food Manufacturing',
  'Food Distribution',
  'Grocery/Retail',
  'Food Truck',
  'Hospitality/Hotel F&B',
  'Other',
] as const

export const COMPANY_SIZE_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '500+'] as const

/** Stored lowercase to match the business_type enum. */
export const BUSINESS_TYPE_OPTIONS = [
  { value: 'independent', label: 'Independent' },
  { value: 'franchise', label: 'Franchise' },
  { value: 'chain', label: 'Chain' },
] as const

export const TIMEZONE_OPTIONS = [
  'Eastern Time (ET)',
  'Central Time (CT)',
  'Mountain Time (MT)',
  'Pacific Time (PT)',
  'Atlantic Time (AT)',
  'GMT/UTC',
  'Other',
] as const

export const YEARS_EXPERIENCE_OPTIONS = ['<1 year', '1-3 years', '4-7 years', '8+ years'] as const

export const SUGGESTED_SKILLS = [
  'Food Safety',
  'Sanitation',
  'Allergen Awareness',
  'Customer Service',
  'Cash Handling',
  'Safety',
  'Inventory Management',
  'Leadership',
  'Loss Prevention',
  'Conflict Resolution',
] as const

export const MEMBER_ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin', hint: 'Full control — profile, team, courses and learners.' },
  { value: 'operator', label: 'Operator', hint: 'Builds and runs training. Cannot change the company or team.' },
  { value: 'auditor', label: 'Auditor', hint: 'Read-only access to courses, learners and results.' },
] as const

/** Minimum word count the Company Profile description asks for. */
export const DESCRIPTION_MIN_WORDS = 100
/** Suggested (not required) word count for a learner bio. */
export const LEARNER_BIO_TARGET_WORDS = 40
export const TAGLINE_MAX_LENGTH = 80

export function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

/** Password meter, matching the export's scoring exactly. */
export function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '#e5e7eb' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['#e5e7eb', '#dc2626', '#ea580c', '#ca8a04', '#199356']
  return { score, label: labels[score], color: colors[score] }
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
