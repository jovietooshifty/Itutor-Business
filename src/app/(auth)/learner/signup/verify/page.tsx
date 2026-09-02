import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { VerifyCard } from '@/components/auth/verify-card'

export const metadata: Metadata = { title: 'Verify your email — iTutor Business' }

export default async function LearnerVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  if (!email) redirect('/learner/signup')

  return (
    <VerifyCard
      accent="coral"
      email={email}
      nextHref="/learner/signup/profile"
      idPrefix="learner-code"
    />
  )
}
