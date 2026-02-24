import { NextRequest } from 'next/server'
import { loginValidator } from '@/lib/validators'
import { okResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { AuthService } from '@/services/auth.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validated = loginValidator.parse(body)

    // Authenticate and generate token
    const result = await AuthService.login(validated.email, validated.password)

    return okResponse(result, 'Connecté avec succès')
  } catch (error) {
    return handleError(error)
  }
}
