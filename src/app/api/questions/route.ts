import { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/middleware/auth'
import { createdResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { createQuestionValidator } from '@/lib/validators'
import { QuestionService } from '@/services/question.service'

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult
    const body = await request.json()

    const validated = createQuestionValidator.parse(body)
    const question = await QuestionService.createQuestion(
      "validated.quiz_id",
      payload!.userId,
      validated.question_text,
      validated.options,
      validated.correct_option_index
    )

    return createdResponse(question, 'Question créée avec succès')
  } catch (error) {
    return handleError(error)
  }
}
