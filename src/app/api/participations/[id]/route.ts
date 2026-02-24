import { NextRequest } from 'next/server'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { ParticipationService } from '@/services/participation.service'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const participation = await ParticipationService.getParticipation(id)
    return okResponse(participation, 'Participation récupérée')
  } catch (error) {
    return handleError(error)
  }
}
