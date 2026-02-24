import { NextRequest } from 'next/server'
import { createdResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { createMessageValidator } from '@/lib/validators'
import { MessageService } from '@/services/message.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createMessageValidator.parse(body)

    const result = await MessageService.sendMessage(validated.public_key, validated.content)
    return createdResponse({ id: result.data?.id, created_at: result.data?.created_at }, result.message)
  } catch (error) {
    return handleError(error)
  }
}
