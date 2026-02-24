import { NextRequest } from 'next/server'
import { verifyAdminToken } from '@/middleware/auth'
import { okResponse, notFoundResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { AdminService } from '@/services/admin.service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = verifyAdminToken(request)
    if (authResult.error) return authResult.error
    const { id } = await params

    const result = await AdminService.getQuizDetails(id)
    
    if (!result) {
      return notFoundResponse('Quiz non trouvé')
    }

    return okResponse(result, 'Détails du quiz')
  } catch (error) {
    return handleError(error)
  }
}
