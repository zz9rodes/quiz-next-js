import { NextRequest } from 'next/server'
import { participateValidator } from '@/lib/validators'
import { createdResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { ParticipationService } from '@/services/participation.service'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await params
    const body = await request.json()

    // Validate input
    const validated = participateValidator.parse(body)

    // Submit participation and calculate score
    const result = await ParticipationService.submitParticipation(
      quizId,
      validated.participant_name,
      validated.answers
    )

    return createdResponse({participation:result}, 'Participation soumise avec succès')
  } catch (error) {
    return handleError(error)
  }
}
