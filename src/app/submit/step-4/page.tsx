import FlowLayout from "@/components/afa/FlowLayout";
import NeedHelpCard from "@/components/afa/NeedHelpCard";
import { createClient } from "@/lib/supabase/server";
import Step4Client from "./Step4Client";

export default async function Step4Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("full_name, email").eq("id", user.id).single()
    : { data: null };

  const facultyName = profile?.full_name ?? "Faculty Member";
  const facultyEmail = profile?.email ?? user?.email ?? "";
  const userInitial = facultyName.charAt(0).toUpperCase();

  return (
    <FlowLayout currentStep={4} userInitial={userInitial} aside={<NeedHelpCard />}>
      <Step4Client facultyName={facultyName} facultyEmail={facultyEmail} />
    </FlowLayout>
  );
}
