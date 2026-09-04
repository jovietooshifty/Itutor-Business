import { Building2, Globe, Mail, MapPin, Phone, Users } from 'lucide-react'
import { OptionalImage } from '@/components/ui/image-upload'

export type CompanyPanelData = {
  name: string
  logoUrl: string | null
  coverUrl: string | null
  description: string | null
  tagline: string | null
  industry: string | null
  website: string | null
  contactEmail: string | null
  contactPhone: string | null
  location: string | null
  courseCount: number
  learnerCount: number
}

/**
 * Who is asking you to join.
 *
 * Both join surfaces used to print the business name and stop there, which put
 * a learner in the position of handing over a resume and a phone number to a
 * string. This is the same information a company would expect to give a
 * candidate about itself before an interview.
 *
 * Contact details here are the business's own `contact_email` and
 * `contact_phone`, not an admin's personal number — see company_for_join().
 */
export function CompanyPanel({ company }: { company: CompanyPanelData }) {
  const contacts = [
    company.location && { icon: MapPin, text: company.location, href: null },
    company.contactEmail && {
      icon: Mail,
      text: company.contactEmail,
      href: `mailto:${company.contactEmail}`,
    },
    company.contactPhone && {
      icon: Phone,
      text: company.contactPhone,
      href: `tel:${company.contactPhone.replace(/[^\d+]/g, '')}`,
    },
    company.website && {
      icon: Globe,
      text: company.website.replace(/^https?:\/\//, ''),
      href: company.website.startsWith('http') ? company.website : `https://${company.website}`,
    },
  ].filter(Boolean) as { icon: typeof MapPin; text: string; href: string | null }[]

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white">
      {company.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={company.coverUrl} alt="" className="h-[120px] w-full object-cover" />
      )}

      <div className="p-6 md:p-7">
        <div className={company.coverUrl ? '-mt-12 flex items-end gap-4' : 'flex items-center gap-4'}>
          {company.logoUrl ? (
            <span className="shrink-0 rounded-full bg-white p-1 shadow-sm">
              <OptionalImage src={company.logoUrl} alt={company.name} width={64} height={64} />
            </span>
          ) : (
            <span
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-light text-[var(--itutor-green)]"
              aria-hidden
            >
              <Building2 size={26} />
            </span>
          )}
          <div className="min-w-0 pb-1">
            <h2 className="m-0 font-display text-lg font-bold text-ink">{company.name}</h2>
            {company.industry && (
              <p className="m-0 mt-0.5 text-sm text-ink-muted">{company.industry}</p>
            )}
          </div>
        </div>

        {company.tagline && (
          <p className="m-0 mt-4 text-[15px] font-semibold text-ink">{company.tagline}</p>
        )}
        {company.description && (
          <p className="m-0 mt-2.5 text-sm leading-relaxed text-ink-muted">
            {company.description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
            <Building2 size={14} className="text-[#9ca3af]" aria-hidden />
            {company.courseCount} {company.courseCount === 1 ? 'course' : 'courses'} offered
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
            <Users size={14} className="text-[#9ca3af]" aria-hidden />
            {company.learnerCount} {company.learnerCount === 1 ? 'learner' : 'learners'} enrolled
          </span>
        </div>

        {contacts.length > 0 && (
          <dl className="m-0 mt-4 grid gap-x-6 gap-y-2 border-t border-border pt-4 sm:grid-cols-2">
            {contacts.map((contact) => (
              <div key={contact.text} className="flex items-start gap-2">
                <contact.icon size={14} className="mt-1 shrink-0 text-[#9ca3af]" aria-hidden />
                <dd className="m-0 min-w-0 break-words text-sm text-ink">
                  {contact.href ? (
                    <a
                      href={contact.href}
                      target={contact.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      className="text-ink no-underline hover:underline"
                    >
                      {contact.text}
                    </a>
                  ) : (
                    contact.text
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
