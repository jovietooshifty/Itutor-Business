import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui'
import type { CompanyGate } from '@/lib/company-gate'

/**
 * Says what is blocking, and links straight at it. Shown wherever an action is
 * disabled by an incomplete company profile, so the disabled button is never
 * the only explanation on the page.
 */
export function CompanyGateBanner({
  gate,
  action,
  className,
}: {
  gate: CompanyGate
  /** What this page was going to let them do. */
  action: string
  className?: string
}) {
  if (gate.complete) return null

  return (
    <div
      className={
        'flex flex-wrap items-start gap-3.5 rounded-xl border border-[#fcd34d] bg-[#fffbeb] px-5 py-4 ' +
        (className ?? '')
      }
    >
      <AlertTriangle size={20} className="mt-0.5 shrink-0 text-[#b45309]" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="m-0 text-sm font-bold text-[#92400e]">
          Complete your company profile before you {action}
        </p>
        <p className="m-0 mt-0.5 text-sm text-[#92400e]/85">
          Learners see this when they decide whether to join. Still needed:{' '}
          {gate.missing.join(', ')}.
        </p>
      </div>
      <Link href="/company-profile" className="shrink-0 no-underline">
        <Button size="sm">Complete profile</Button>
      </Link>
    </div>
  )
}
