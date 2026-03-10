// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173'; // frontend Vite

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://quizz-p860.onrender.com",
  "https://quiz-next-js.vercel.app",
  "https://festi-view.vercel.app/",
  "https://www.quiwiz.duckdns.org",
];


export function middleware(req: NextRequest) {

  const origin = req.headers.get("origin") || "";
  console.log("Middleware: requête depuis", origin);

  console.log("origin : ",origin)

  // console.log("dans le Middleware Function, la route ", ALLOWED_ORIGIN)

  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  console.log("ORIGIN : ",allowedOrigin)

  // Headers CORS à renvoyer
  const headers = new Headers({
    "Access-Control-Allow-Origin": allowedOrigin,
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