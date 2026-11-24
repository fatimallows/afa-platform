import FlowLayout from "@/components/afa/FlowLayout";
import { createClient } from "@/lib/supabase/server";
import { getUserInitial } from "@/app/submit/get-user-initial";
import Step3Client from "./Step3Client";
import Step3Aside from "./Step3Aside";

export default async function Step3Page() {
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
    <FlowLayout currentStep={3} userInitial={userInitial} aside={<Step3Aside />}>
      <Step3Client facultyName={facultyName} facultyEmail={facultyEmail} />
    </FlowLayout>
  );
}
