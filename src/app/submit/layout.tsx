import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubmitFlowProvider } from "./flow-context";

export default async function SubmitLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <SubmitFlowProvider>{children}</SubmitFlowProvider>;
}
