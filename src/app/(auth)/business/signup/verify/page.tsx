import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { VerifyCard } from '@/components/auth/verify-card'

export const metadata: Metadata = { title: 'Verify your email — iTutor Business' }

export default async function BusinessVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  if (!email) redirect('/business/signup')

  return (
    <VerifyCard
      accent="brand"
      email={email}
      nextHref="/business/signup/profile"
      idPrefix="org-code"
    />
  )
}
