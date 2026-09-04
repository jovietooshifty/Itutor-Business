/**
 * Option lists lifted verbatim from the Claude Design export scripts so the
 * built screens offer exactly the choices the mockups do.
 * Sources: design-reference/Organization Sign-Up.dc.html and
 *          design-reference/Learner Sign-Up.dc.html (bottom <script> blocks).
 */

/**
 * Suggestions, not a closed set — the combobox accepts anything typed, so a
 * title that is not here is still a valid answer. Kept broad on purpose: the
 * original list was food-service only, which left whole categories of the
 * people who actually sign a company up (founders, finance, IT, executives)
 * with nothing to pick.
 */
export const ORG_ROLES = [
  // Ownership and executive
  'Owner / Founder',
  'Co-Founder',
  'Chief Executive Officer',
  'Chief Operating Officer',
  'Chief Financial Officer',
  'Chief Technical Officer',
  'Chief People Officer',
  'Managing Director',
  'Director',
  'Partner',
  // Management
  'General Manager',
  'Operations Manager',
  'Regional / District Manager',
  'Branch Manager',
  'Store Manager',
  'Assistant Manager',
  'Shift Supervisor',
  'Team Lead',
  'Project Manager',
  // People and training
  'HR Manager',
  'HR Officer',
  'Recruiter',
  'Training Coordinator',
  'Training Manager',
  'Learning & Development Lead',
  'Onboarding Specialist',
  // Compliance, safety and quality
  'Compliance / Food Safety Officer',
  'Health & Safety Officer',
  'Quality Assurance Manager',
  'Risk & Compliance Manager',
  'Auditor',
  // Food service and hospitality
  'Franchise Owner',
  'Executive Chef',
  'Head Chef',
  'Sous Chef',
  'Kitchen Manager',
  'Restaurant Manager',
  'Front of House Manager',
  'Bar Manager',
  'Catering Manager',
  // Retail, supply and logistics
  'Retail Manager',
  'Inventory Manager',
  'Warehouse Manager',
  'Supply Chain Manager',
  'Procurement Officer',
  'Logistics Coordinator',
  // Commercial and support
  'Marketing Manager',
  'Sales Manager',
  'Account Manager',
  'Customer Service Manager',
  'Finance Manager',
  'Accountant',
  'Office Manager',
  'Administrator',
  'Executive Assistant',
  'IT Manager',
  'Systems Administrator',
  'Consultant',
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

/**
 * Industries, grouped. The original list was eight options, seven of them
 * food — so a solar installer, a haulage firm or a security company signing up
 * had "Other" and nothing else, which is the same as not asking.
 *
 * Suggestions rather than a closed set, for the same reason ORG_ROLES is: the
 * combobox takes anything typed.
 */
export const INDUSTRY_GROUPS = [
  {
    label: 'Food & Beverage',
    options: [
      'Restaurant',
      'Catering',
      'Food Manufacturing',
      'Food Distribution',
      'Grocery & Retail',
      'Food Truck',
      'Hospitality & Hotel F&B',
    ],
  },
  {
    label: 'Energy & Resources',
    options: ['Solar & Renewable Energy', 'Oil & Gas', 'Mining & Extractives', 'Utilities'],
  },
  {
    label: 'Industrial',
    options: [
      'Manufacturing',
      'Engineering',
      'Construction',
      'Automotive',
      'Marine & Maritime',
    ],
  },
  {
    label: 'Logistics',
    options: [
      'Logistics & Supply Chain',
      'Transportation',
      'Warehousing & Distribution',
      'Aviation',
    ],
  },
  {
    label: 'Services',
    options: [
      'Security Services',
      'Facilities & Cleaning',
      'Waste Management',
      'Consulting & Professional Services',
    ],
  },
  {
    label: 'Commercial',
    options: [
      'Retail & E-commerce',
      'Wholesale',
      'Banking & Financial Services',
      'Insurance',
      'Property & Real Estate',
    ],
  },
  {
    label: 'Professional',
    options: [
      'Healthcare & Medical',
      'Education & Training',
      'Legal',
      'IT & Software',
      'Telecommunications',
      'Media & Creative',
    ],
  },
  {
    label: 'Other',
    options: [
      'Agriculture',
      'Tourism & Travel',
      'Government & Public Sector',
      'Non-profit & NGO',
      'Other',
    ],
  },
] as const

/** Flattened, for anything that needs membership rather than presentation. */
export const INDUSTRY_OPTIONS = INDUSTRY_GROUPS.flatMap((group) => group.options)

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

/**
 * Skills a LEARNER can claim. Deliberately its own list: this used to be the
 * same ten strings as the course-category suggestions, which conflated two
 * different questions — what a course teaches, and what a person can do.
 */
export const SKILL_GROUPS = [
  {
    label: 'Compliance & Safety',
    options: [
      'Food Safety',
      'HACCP',
      'Sanitation',
      'Allergen Awareness',
      'Workplace Safety',
      'First Aid',
      'Fire Safety',
      'Manual Handling',
      'Chemical Handling',
    ],
  },
  {
    label: 'Operations',
    options: [
      'Inventory Management',
      'Loss Prevention',
      'Quality Control',
      'Equipment Operation',
      'Maintenance',
      'Scheduling',
      'Stock Rotation',
    ],
  },
  {
    label: 'Customer & Sales',
    options: [
      'Customer Service',
      'Sales',
      'Upselling',
      'Complaint Handling',
      'Cash Handling',
      'POS Systems',
    ],
  },
  {
    label: 'People',
    options: [
      'Leadership',
      'Team Supervision',
      'Conflict Resolution',
      'Communication',
      'Time Management',
      'Teamwork',
      'Training Others',
    ],
  },
  {
    label: 'Technical & Trade',
    options: [
      'Installation',
      'Troubleshooting',
      'Blueprint Reading',
      'Welding',
      'Plumbing',
      'Electrical',
      'HVAC',
      'Solar Installation',
      'Driving / Heavy Vehicle',
      'Forklift Operation',
    ],
  },
  {
    label: 'Digital & Admin',
    options: [
      'Data Entry',
      'Spreadsheets',
      'Reporting',
      'Documentation',
      'Record Keeping',
    ],
  },
] as const

export const SUGGESTED_SKILLS = SKILL_GROUPS.flatMap((group) => group.options)

export const MEMBER_ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin', hint: 'Full control — profile, team, courses and learners.' },
  { value: 'operator', label: 'Operator', hint: 'Builds and runs training. Cannot change the company or team.' },
  { value: 'auditor', label: 'Auditor', hint: 'Read-only access to courses, learners and results.' },
] as const

/** Minimum word count the Company Profile description asks for. */
export const DESCRIPTION_MIN_WORDS = 100

/**
 * Hard caps on a learner bio, whichever is reached first.
 *
 * This was a *suggestion* of ~40 words with no upper bound at all, and a hint
 * that said outright "it's not required" — so a bio could be two words or two
 * thousand, and the admin reading it got whichever. Both limits are needed:
 * word count is the honest measure of length, but 60 one-letter words and 60
 * hyphenated compounds are not the same amount of text to read.
 */
export const LEARNER_BIO_MAX_WORDS = 60
export const LEARNER_BIO_MAX_CHARS = 400

export const TAGLINE_MAX_LENGTH = 80

export function countWords(text: string): number {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

/**
 * Whether `next` is a bio the field should accept.
 *
 * Rejects the keystroke rather than truncating: silently cutting a pasted
 * paragraph mid-word leaves someone staring at a sentence that stops, with no
 * indication anything was dropped. Deleting is always allowed, so a bio that
 * is already over the cap (typed before these limits, or pasted whole) can
 * still be edited back down.
 */
export function bioWithinLimits(next: string, previous: string): boolean {
  if (next.length <= previous.length) return true
  return next.length <= LEARNER_BIO_MAX_CHARS && countWords(next) <= LEARNER_BIO_MAX_WORDS
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
