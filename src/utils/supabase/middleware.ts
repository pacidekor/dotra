import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
  return to;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return copyCookies(supabaseResponse, NextResponse.redirect(url));
  }

  if (user && isAuthPage) {
    const { data: profile } = await supabase
      .from("dotra_profiles")
      .select("onboarding_completed_at")
      .eq("id", user.id)
      .maybeSingle();

    const url = request.nextUrl.clone();
    url.pathname = profile?.onboarding_completed_at
      ? "/dashboard"
      : "/onboarding";
    return copyCookies(supabaseResponse, NextResponse.redirect(url));
  }

  if (user && pathname.startsWith("/dashboard")) {
    const { data: profile, error } = await supabase
      .from("dotra_profiles")
      .select("onboarding_completed_at")
      .eq("id", user.id)
      .maybeSingle();

    if (!error && !profile?.onboarding_completed_at) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return copyCookies(supabaseResponse, NextResponse.redirect(url));
    }
  }

  if (user && pathname.startsWith("/onboarding")) {
    const { data: profile, error } = await supabase
      .from("dotra_profiles")
      .select("onboarding_completed_at")
      .eq("id", user.id)
      .maybeSingle();

    if (!error && profile?.onboarding_completed_at) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return copyCookies(supabaseResponse, NextResponse.redirect(url));
    }
  }

  return supabaseResponse;
}
