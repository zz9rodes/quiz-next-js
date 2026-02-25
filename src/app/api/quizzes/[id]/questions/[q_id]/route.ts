import { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/middleware/auth'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { updateQuestionValidator } from '@/lib/validators'
import { QuestionService } from '@/services/question.service'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ q_id: string }> }) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult
    const { q_id } = await params

    const body = await request.json()
    const validated = updateQuestionValidator.parse(body)
    const question = await QuestionService.updateQuestion(q_id, payload!.userId, validated.question_text, validated.options, validated.correct_option_index)
    return okResponse({question:question}, 'Question mise à jour')
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult
    const { id } = await params

    const result = await QuestionService.deleteQuestion(id, payload!.userId)
    return okResponse(result, 'Question supprimée')
  } catch (error) {
    return handleError(error)
  }
}
