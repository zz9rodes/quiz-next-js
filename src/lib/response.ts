import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  code?: string
}

export function createResponse<T>(
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  code?: string
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success,
      message,
      ...(data !== undefined && { data }),
      ...(code && { code }),
    },
    { status: statusCode }
  )
}

// Helper functions for common responses
export function okResponse<T>(data: T, message: string = 'Succès'): NextResponse<ApiResponse<T>> {
  return createResponse(200, true, message, data)
}

export function createdResponse<T>(data: T, message: string = 'Créé avec succès'): NextResponse<ApiResponse<T>> {
  return createResponse(201, true, message, data)
}

export function badRequestResponse(message: string, code?: string): NextResponse<ApiResponse> {
  return createResponse(400, false, message, undefined, code || 'VALIDATION_ERROR')
}

export function unauthorizedResponse(message: string = 'Non authentifié'): NextResponse<ApiResponse> {
  return createResponse(401, false, message, undefined, 'UNAUTHORIZED')
}

export function forbiddenResponse(message: string = 'Accès refusé'): NextResponse<ApiResponse> {
  return createResponse(403, false, message, undefined, 'FORBIDDEN')
}

export function notFoundResponse(message: string = 'Ressource non trouvée'): NextResponse<ApiResponse> {
  return createResponse(404, false, message, undefined, 'NOT_FOUND')
}

export function serverErrorResponse(message: string = 'Erreur serveur'): NextResponse<ApiResponse> {
  return createResponse(500, false, message, undefined, 'INTERNAL_ERROR')
}
