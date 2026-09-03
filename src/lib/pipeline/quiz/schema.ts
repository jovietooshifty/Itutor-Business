import { z } from 'zod'

/* Field names mirror the quiz_questions table (src/lib/types/database.ts) so
   that wiring this into real inserts later is a direct mapping rather than a
   translation layer.

   Exactly four options is not arbitrary: the course player mockup
   (design-reference/Course Player.dc.html) hardcodes four option slots per
   question, so the UI already assumes it. */
export const OPTIONS_PER_QUESTION = 4

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
export const QuizResponseSchema = z.object({
  questions: z.array(QuestionSchema).min(1),
})

export const RegenerateResponseSchema = z.object({
  question: QuestionSchema,
})
