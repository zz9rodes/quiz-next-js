import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import { unauthorizedResponse, forbiddenResponse } from '@/lib/response'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    isAdmin: boolean
  }
}

// Helper function to extract and verify JWT token
export function getAuthPayload(request: NextRequest) {
  const token = extractTokenFromHeader(request.headers.get('authorization'))

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  return payload
}

// Verify token and return unauthorized if missing/invalid
export function verifyAuthToken(request: NextRequest) {
  const token = extractTokenFromHeader(request.headers.get('authorization'))

  if (!token) {
    return { error: unauthorizedResponse() }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return { error: unauthorizedResponse('Token invalide ou expiré') }
  }

  return { payload }
}

// Verify admin token and return unauthorized/forbidden if missing/invalid
export function verifyAdminToken(request: NextRequest) {
  const token = extractTokenFromHeader(request.headers.get('authorization'))

  if (!token) {
    return { error: unauthorizedResponse() }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return { error: unauthorizedResponse('Token invalide ou expiré') }
  }

  if (!payload.isAdmin) {
    return { error: forbiddenResponse('Accès réservé aux administrateurs') }
  }

  return { payload }
}
