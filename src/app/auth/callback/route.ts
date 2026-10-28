import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_EMAIL_DOMAIN = "up.edu.ph";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
  }

  const email = data.user?.email ?? "";
  const isAllowedDomain = email.toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`);

  if (!isAllowedDomain) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/sign-in?error=invalid_domain`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
