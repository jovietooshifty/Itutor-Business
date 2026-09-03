import { callLlmForJson, type CallOptions } from './client'
import { buildRegeneratePrompt } from './prompts'
import { RegenerateResponseSchema, type Question } from './schema'

export type RegenerateOptions = CallOptions & {
  /* The other questions already in the quiz. Pass the full list when replacing
     one question in a set — otherwise the model only knows the question it is
     replacing and will happily reproduce one of its siblings. */
  avoid?: Question[]
}

export async function regenerateQuestion(
  sourceText: string,
  existingQuestion: Question,
  options: RegenerateOptions = {},
): Promise<Question> {
  if (sourceText.trim().length === 0) {
    throw new Error('sourceText is empty — nothing to generate a replacement question from')
  }

  const { avoid, ...callOptions } = options
  const prompt = buildRegeneratePrompt(sourceText, existingQuestion, avoid)
  const { question } = await callLlmForJson(prompt, RegenerateResponseSchema, callOptions)

  return question
}
