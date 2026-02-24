import { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/middleware/auth'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { MessageService } from '@/services/message.service'

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult

    const result = await MessageService.getMessages(payload!.userId)
    return okResponse(result, 'Messages récupérés')
  } catch (error) {
    return handleError(error)
  }
}
