import { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/middleware/auth'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { QuizService } from '@/services/quiz.service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult
    const { id } = await params

    const stats = await QuizService.getQuizStats(id, payload!.userId)
    return okResponse(stats, 'Statistiques du quiz')
  } catch (error) {
    return handleError(error)
  }
}
