import { NextRequest } from 'next/server'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { AuthService } from '@/services/auth.service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ publicKey: string }> }) {
  try {
    const { publicKey } = await params
    const profile = await AuthService.getPublicProfile(publicKey)
    return okResponse(profile, 'Profil public récupéré')
  } catch (error) {
    return handleError(error)
  }
}
