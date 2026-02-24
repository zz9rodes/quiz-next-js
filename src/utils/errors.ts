import { ZodError } from 'zod'
import { NextResponse } from 'next/server'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleValidationError(error: ZodError): NextResponse {
  const issues = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))

  return NextResponse.json(
    {
      success: false,
      message: 'Erreur de validation',
      code: 'VALIDATION_ERROR',
      details: issues,
    },
    { status: 400 }
  )
}

export function handleError(error: any): NextResponse {
  console.error('API Error:', error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof ZodError) {
    return handleValidationError(error)
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Erreur serveur',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  )
}
