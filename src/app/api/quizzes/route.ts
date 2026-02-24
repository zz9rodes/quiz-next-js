import { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/middleware/auth'
import { okResponse, createdResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { createQuizValidator } from '@/lib/validators'
import { QuizService } from '@/services/quiz.service'

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult

    const quizzes = await QuizService.getUserQuizzes(payload!.userId)
    return okResponse(quizzes, 'Quizzes récupérés')
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult

    const body = await request.json()
    const validated = createQuizValidator.parse(body)
    const quiz = await QuizService.createQuiz(payload!.userId, validated.title)
    return createdResponse(quiz, 'Quiz créé avec succès')
  } catch (error) {
    return handleError(error)
  }
}
