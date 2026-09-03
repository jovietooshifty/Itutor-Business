import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CourseSetupForm } from '@/components/business/course-setup-form'
import { getBusinessContext } from '@/lib/business'
import { emptyCourseSetup } from '@/lib/course'

export const metadata: Metadata = { title: 'Create a course — iTutor Business' }

/** Course Builder screen 1. */
export default async function Page() {
  const context = await getBusinessContext()
  if (!context) redirect('/login')
  // Auditors are read-only per the RLS matrix; no point rendering the form.
  if (context.role === 'auditor') redirect('/courses')

  return <CourseSetupForm initial={emptyCourseSetup(context.businessId)} />
}
