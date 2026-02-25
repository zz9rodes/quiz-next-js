import { NextRequest } from 'next/server'
import { verifyAdminToken } from '@/middleware/auth'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { AdminService } from '@/services/admin.service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ publicKey: string }> }) {
  try {
    const authResult = verifyAdminToken(request)
    if (authResult.error) return authResult.error

    const {publicKey}= await params

    const result = await AdminService.getAllUsers()
    return okResponse(result, 'Tous les utilisateurs')
  } catch (error) {
    return handleError(error)
  }
}
