// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173'; // frontend Vite


export function middleware(req: NextRequest) {

    console.log("dans le Middleware Function, la route ",ALLOWED_ORIGIN)
  // Headers CORS à renvoyer
  const headers = new Headers({
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  });

  // Gestion du preflight OPTIONS
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers });
  }

  // Pour toutes les autres requêtes
  return NextResponse.next({ headers });
}

// Applique à toutes les routes API
export const config = {
  matcher: "/api/:path*",
};