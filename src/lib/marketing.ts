import {
  CreditCard,
  MessageCircle,
  Package,
  ShieldAlert,
  ShieldCheck,
  Smile,
  Users,
  Utensils,
  type LucideIcon,
} from 'lucide-react'

/**
 * Sample catalogue shown in the landing page's ungated course preview
 * (handoff flow 8, "Landing Page.dc.html" → MARKET_COURSES).
 *
 * This is marketing copy, not data: the real catalogue lives in `courses` and
 * is only reachable once a visitor has an account. Keeping it static means the
 * landing page stays a static prerender with no database round-trip, and an
 * empty `courses` table can never leave the marketing page looking broken.
 */
export type MarketingCourse = {
  title: string
  provider: string
  category: MarketingCategory
  durationLabel: string
  description: string
  icon: LucideIcon
  /** Card header wash + icon colour, straight from the design export. */
  iconBg: string
  iconColor: string
}

export const MARKETING_CATEGORIES = [
  'Food & Beverage',
  'Retail',
  'Logistics',
  'Professional Development',
  'Hospitality',
] as const

export type MarketingCategory = (typeof MARKETING_CATEGORIES)[number]

/** Sentinel for "no category filter" — also the select's default option. */
export const ALL_CATEGORIES = 'All categories'

export const MARKETING_COURSES: MarketingCourse[] = [
  {
    title: 'Food Safety & Sanitation Basics',
    provider: 'Northshore Culinary Group',
    category: 'Food & Beverage',
    durationLabel: '2 hrs',
    description: 'Core food handling, storage and sanitation practices for commercial kitchens.',
    icon: Utensils,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
  {
    title: 'Allergen Awareness for Frontline Staff',
    provider: 'Northshore Culinary Group',
    category: 'Food & Beverage',
    durationLabel: '45 min',
    description: 'Spot the most common allergens and respond correctly when a guest asks.',
    icon: ShieldAlert,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
  {
    title: 'Point of Sale & Payment Handling',
    provider: 'Northshore Culinary Group',
    category: 'Retail',
    durationLabel: '1 hr',
    description: 'Running a register, processing payments, and handling refunds accurately.',
    icon: CreditCard,
    iconBg: '#fce7f3',
    iconColor: '#db2777',
  },
  {
    title: 'Customer Service Excellence',
    provider: 'Bright Path Retail',
    category: 'Retail',
    durationLabel: '1.5 hrs',
    description: 'Practical scripts and techniques for handling everyday customer interactions.',
    icon: Smile,
    iconBg: '#fce7f3',
    iconColor: '#db2777',
  },
  {
    title: 'Warehouse Safety Fundamentals',
    provider: 'Anchor Logistics',
    category: 'Logistics',
    durationLabel: '2.5 hrs',
    description: 'Safe lifting, equipment use and hazard awareness for warehouse floors.',
    icon: Package,
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
  },
  {
    title: 'Leadership for New Supervisors',
    provider: 'Elevate Training Co.',
    category: 'Professional Development',
    durationLabel: '3 hrs',
    description: 'Delegation, feedback and scheduling skills for first-time supervisors.',
    icon: Users,
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
  },
  {
    title: 'Cash Handling & Loss Prevention',
    provider: 'Bright Path Retail',
    category: 'Retail',
    durationLabel: '1 hr',
    description: 'Till procedures and everyday loss-prevention habits for retail staff.',
    icon: ShieldCheck,
    iconBg: '#fce7f3',
    iconColor: '#db2777',
  },
  {
    title: 'De-escalation & Conflict Resolution',
    provider: 'Elevate Training Co.',
    category: 'Hospitality',
    durationLabel: '1.5 hrs',
    description: 'Staying calm and defusing tension with upset customers or guests.',
    icon: MessageCircle,
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
  },
]

/** Search matches title or provider, mirroring the design's filter logic. */
export function filterMarketingCourses(
  courses: MarketingCourse[],
  search: string,
  category: string
): MarketingCourse[] {
  const q = search.trim().toLowerCase()
  return courses.filter((course) => {
    if (category !== ALL_CATEGORIES && course.category !== category) return false
    if (!q) return true
    return (
      course.title.toLowerCase().includes(q) || course.provider.toLowerCase().includes(q)
    )
  })
}
