import { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/middleware/auth'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { MessageService } from '@/services/message.service'
import { createdResponse } from '@/lib/response'
import { createMessageValidator } from '@/lib/validators'


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

export async function POST(request: NextRequest, { params }: { params: Promise<{ publicKey: string }> }) {
  try {
    const body = await request.json()
    const validated = createMessageValidator.parse(body)

    const {publicKey}= await params

    const result = await MessageService.sendMessage(publicKey, validated.content)
    return createdResponse({ id: result.data?.id, created_at: result.data?.created_at }, result.message)
  } catch (error) {
    return handleError(error)
  }
}

