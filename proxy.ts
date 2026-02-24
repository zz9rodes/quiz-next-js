import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:5174').split(',').map(origin => origin.trim())

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
const ALLOWED_HEADERS = ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true
  return ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)
}

export async function proxy(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  const isAllowed = isOriginAllowed(origin)

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: isAllowed
        ? {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': ALLOWED_METHODS.join(', '),
            'Access-Control-Allow-Headers': ALLOWED_HEADERS.join(', '),
            'Access-Control-Max-Age': '86400',
            'Access-Control-Allow-Credentials': 'true',
          }
        : {},
    })
  }

  // Continue with the request and add CORS headers
  const response = NextResponse.next()

  if (isAllowed) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '))
    response.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '))
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
}

export const config = {
  matcher: '/api/:path*',
}
