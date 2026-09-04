import type { MetadataRoute } from 'next'

/**
 * What crawlers may look at.
 *
 * `/p/` is the important one. A learner's portfolio is private by virtue of
 * having a link nobody can guess — there is no public/private switch any more
 * — and a secret URL that has been indexed is not a secret. The page also
 * carries `robots: { index: false }` in its own metadata, because a crawler
 * that ignores this file will still usually honour the tag.
 *
 * `/c/` (course share links) and `/verify/` follow for the same reason: both
 * are addressed by a token that is meant to be passed to a person, not found.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/p/', '/c/', '/verify/', '/api/', '/auth/'],
      },
    ],
  }
}
