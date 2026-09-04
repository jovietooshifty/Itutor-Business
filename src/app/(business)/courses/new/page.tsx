import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CourseBasicsForm } from '@/components/business/course-basics-form'
import { getBusinessContext } from '@/lib/business'
import { loadCompanyGate } from '@/lib/company-gate'
import { emptyCourseBasics } from '@/lib/course'

export const metadata: Metadata = { title: 'Create a course — iTutor Business' }

/** Course Builder step 1 — a course that does not exist yet. */
export default async function Page() {
  const context = await getBusinessContext()
  if (!context) redirect('/login')
  // Auditors are read-only per the RLS matrix; no point rendering the form.
  if (context.role === 'auditor') redirect('/courses')

  /* The disabled buttons on the dashboard and the courses grid are the polite
     half of this gate; this is the half that holds when someone types the URL.
     /company-profile is where the work is, so that is where they land. */
  const gate = await loadCompanyGate(context.businessId)
  if (!gate.complete) redirect('/company-profile')

  return <CourseBasicsForm businessId={context.businessId} initial={emptyCourseBasics()} />
}
