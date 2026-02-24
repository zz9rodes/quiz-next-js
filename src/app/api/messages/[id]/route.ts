import { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/middleware/auth'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { MessageService } from '@/services/message.service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult
    const { id } = await params

    const result = await MessageService.getMessage(parseInt(id), payload!.userId)
    return okResponse(result.message, 'Message récupéré')
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

    const result = await MessageService.deleteMessage(parseInt(id), payload!.userId)
    return okResponse(result, 'Message supprimé')
  } catch (error) {
    return handleError(error)
  }
}
