import { NextRequest } from 'next/server'
import { signupValidator } from '@/lib/validators'
import { createdResponse, badRequestResponse } from '@/lib/response'
import { handleError } from '@/utils/errors'
import { AuthService } from '@/services/auth.service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log(body)

    // Validate input
    const validated = signupValidator.parse(body)

    console.log("validateur : ",validated)
    // Create user and generate token
    const result = await AuthService.signup(validated.email, validated.password, validated.display_name)

    return createdResponse(result, 'Utilisateur créé avec succès')
  } catch (error) {
    return handleError(error)
  }
}
