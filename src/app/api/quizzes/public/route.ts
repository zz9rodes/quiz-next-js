import { NextRequest } from 'next/server'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { QuizService } from '@/services/quiz.service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

    const result = await QuizService.getAllQuizzesPaginated(page)
    return okResponse(result, 'Quizzes récupérés')
  } catch (error) {
    return handleError(error)
  }
}
