import { type NextRequest, NextResponse } from "next/server";

/**
 * Clears auth cookies that can grow too large and trigger HTTP 431.
 * Visit /auth/clear once, then sign in again.
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));

  const cookies = request.cookies.getAll();
  for (const cookie of cookies) {
    if (
      cookie.name.startsWith("sb-") ||
      cookie.name.includes("supabase") ||
      cookie.name.includes("auth-token")
    ) {
      response.cookies.set(cookie.name, "", {
        path: "/",
        maxAge: 0,
      });
    }
  }

  return response;
}
