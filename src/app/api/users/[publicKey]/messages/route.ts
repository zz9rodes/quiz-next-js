import { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/middleware/auth'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { MessageService } from '@/services/message.service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ publicKey: string }> }) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult
    const { publicKey } = await params

    const result = await MessageService.getUserMessages(publicKey, payload!.userId, payload!.isAdmin)
    return okResponse(result, 'Messages de l\'utilisateur')
  } catch (error) {
    return handleError(error)
  }
}
