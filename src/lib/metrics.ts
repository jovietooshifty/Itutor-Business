import { createClient } from '@/lib/supabase/server'

/**
 * A fresh enrolment is not a failure to complete — it is someone who has not
 * started yet. Counting a batch of invites sent this morning against the
 * denominator makes the number swing on hiring, not on training, so the first
 * day of every enrolment is excluded.
 */
const SETTLING_HOURS = 24

export type CompletionRate = {
  /** 0-100, or null when there is nothing to measure. */
  pct: number | null
  completed: number
  total: number
}

/**
 * Completion rate across a business's published courses.
 *
 * The dashboard tile has never shown a number — it was a hardcoded em dash, so
 * there was nothing to remove and nothing to trust. Every input existed
 * already; this is the arithmetic.
 *
 * Draft courses are excluded: nobody can enrol in one, so they can only ever
 * contribute zeroes.
 */
export async function loadCompletionRate(businessId: string): Promise<CompletionRate> {
  const supabase = await createClient()

  const { data: published } = await supabase
    .from('courses')
    .select('id')
    .eq('business_id', businessId)
    .eq('status', 'published')

  const courseIds = (published ?? []).map((c) => c.id)
  if (courseIds.length === 0) return { pct: null, completed: 0, total: 0 }

  const cutoff = new Date(Date.now() - SETTLING_HOURS * 3_600_000).toISOString()

  /* Rows rather than two counts, because the unit here is a PERSON on a
     COURSE, not an enrolment row. A retake is a second row for the same pair
     (see 20260904000600), so counting rows would have one learner drag the
     figure down twice — and "latest cycle per pair" is not something the count
     API can express. */
  const { data: rows } = await supabase
    .from('enrollments')
    .select('course_id, learner_id, status, cycle')
    .in('course_id', courseIds)
    .lt('enrolled_at', cutoff)

  const current = new Map<string, { status: string; cycle: number }>()
  for (const row of rows ?? []) {
    const key = `${row.course_id}:${row.learner_id}`
    const held = current.get(key)
    if (!held || row.cycle > held.cycle) current.set(key, { status: row.status, cycle: row.cycle })
  }

  const denominator = current.size
  // Never 0% on an empty denominator: "nobody has finished" and "nobody has
  // enrolled" are different facts, and only one of them is about the training.
  if (denominator === 0) return { pct: null, completed: 0, total: 0 }

  let completed = 0
  for (const entry of current.values()) {
    if (entry.status === 'completed') completed += 1
  }

  return {
    pct: Math.round((completed / denominator) * 100),
    completed,
    total: denominator,
  }
}
