import { NextRequest } from 'next/server'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { QuizService } from '@/services/quiz.service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const quiz = await QuizService.getQuizForPlay(id)
    return okResponse(quiz, 'Quiz récupéré')
  } catch (error) {
    return handleError(error)
  }
}
