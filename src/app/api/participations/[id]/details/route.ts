import { NextRequest } from 'next/server'
import { verifyAuthToken } from '@/middleware/auth'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { ParticipationService } from '@/services/participation.service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = verifyAuthToken(request)
    if (authResult.error) return authResult.error
    const { payload } = authResult
    const { id } = await params

    const participation = await ParticipationService.getParticipationDetails(id, payload!.userId)
    return okResponse(participation, 'Détails de la participation')
  } catch (error) {
    return handleError(error)
  }
}
