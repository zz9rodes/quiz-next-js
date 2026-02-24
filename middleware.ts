import { NextRequest, NextResponse } from 'next/server'

// CORS configuration - allow all origins by default in development
const getAllowedOrigins = () => {
  const envOrigins = process.env.ALLOWED_ORIGINS
  if (envOrigins) {
    return envOrigins.split(',').map(origin => origin.trim())
  }
  // Default origins for development
  return ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174']
}

const ALLOWED_ORIGINS = getAllowedOrigins()
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
const ALLOWED_HEADERS = ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true
  return ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)
}

export function middleware(request: NextRequest) {
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

  // For actual requests, add CORS headers
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
