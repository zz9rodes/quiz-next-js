import { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/middleware/auth'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { AuthService } from '@/services/auth.service'

export async function GET(request: NextRequest) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult

    const profile = await AuthService.getProfile(payload!.userId)
    return okResponse(profile, 'Profil récupéré')
  } catch (error) {
    return handleError(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult

    const body = await request.json()
    const updated = await AuthService.updateProfile(payload!.userId, body.display_name, body.avatar)
    return okResponse(updated, 'Profil mis à jour')
  } catch (error) {
    return handleError(error)
  }
}
