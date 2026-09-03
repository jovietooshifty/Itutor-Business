import { z } from 'zod'

/* Field names mirror the quiz_questions table (src/lib/types/database.ts) so
   that wiring this into real inserts later is a direct mapping rather than a
   translation layer.

   Exactly four options is not arbitrary: the course player mockup
   (design-reference/Course Player.dc.html) hardcodes four option slots per
   question, so the UI already assumes it. */
export const OPTIONS_PER_QUESTION = 4

/* The most questions one generation call can produce, whether the count was
   asked for or left to the model. A cost and attention bound, not a technical
   one: past twenty, an admin is deleting questions rather than reviewing them. */
export const MAX_QUESTIONS = 20

export const QuestionSchema = z
  .object({
    question_text: z.string().trim().min(8),
    options: z.array(z.string().trim().min(1)).length(OPTIONS_PER_QUESTION),
    correct_option: z.number().int().min(0).max(OPTIONS_PER_QUESTION - 1),
    explanation: z.string().trim().min(1).nullable(),
  })
  .refine((question) => new Set(question.options).size === question.options.length, {
    message: 'options must be distinct',
    path: ['options'],
  })

export type Question = z.infer<typeof QuestionSchema>

/* Both response schemas are objects rather than bare arrays because DeepSeek's
   JSON output mode requires a JSON object at the root. */

/* The cap truncates instead of rejecting. With "no specific number" the model
   chooses the count, and an over-long set is not a malformed one — the
   questions are all valid, there are just more than anyone will review. A
   .max() here would instead reject the whole response and spend the client's
   single retry arguing about arithmetic. */
export const QuizResponseSchema = z.object({
  questions: z
    .array(QuestionSchema)
    .min(1)
    .transform((questions) => questions.slice(0, MAX_QUESTIONS)),
})

export const RegenerateResponseSchema = z.object({
  question: QuestionSchema,
})
