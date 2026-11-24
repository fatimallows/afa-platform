import { createClient } from "@/lib/supabase/server";

export async function getUserInitial(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "U";

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();

  const displayName = profile?.full_name ?? "Faculty Member";
  return displayName.charAt(0).toUpperCase();
}
