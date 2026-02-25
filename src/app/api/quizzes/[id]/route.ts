import { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/middleware/auth'











// NEXT_PUBLIC_API_URL="http://localhost:3000"# API ConfigurationNODE_ENV="development"# Node EnvironmentJWT_SECRET="your_secret_key_here_change_in_production_$(date +%s)"# JWT ConfigurationDATABASE_PROVIDER="mysql"import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { updateQuizValidator } from '@/lib/validators'
import { QuizService } from '@/services/quiz.service'
import { okResponse } from '@/lib/response'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult
    const { id } = await params

    const quiz = await QuizService.getQuizById(id, payload!.userId)
    return okResponse({quiz:quiz}, 'Quiz récupéré')
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult
    const { id } = await params

    const body = await request.json()
    const validated = updateQuizValidator.parse(body)
    const quiz = await QuizService.updateQuiz(id, payload!.userId, validated.title??'Unknow')
    return okResponse(quiz, 'Quiz mis à jour')
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

    const result = await QuizService.deleteQuiz(id, payload!.userId)
    return okResponse(result, 'Quiz supprimé')
  } catch (error) {
    return handleError(error)
  }
}
