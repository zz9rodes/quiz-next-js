import { NextRequest } from 'next/server'
import { createdResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { participateValidator } from '@/lib/validators'
import { ParticipationService } from '@/services/participation.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = participateValidator.parse(body)

    const result = await ParticipationService.submitParticipation(
      'jhkh',
      validated.participant_name,
      validated.answers
    )

    return createdResponse(result, 'Participation enregistrée')
  } catch (error) {
    return handleError(error)
  }
}
