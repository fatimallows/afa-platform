import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Privacy Notice | AFA Platform",
};

export default async function PrivacyNoticePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userInitial: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    userInitial = (profile?.full_name ?? user.email ?? "U").charAt(0).toUpperCase();
  }

  return (
    <>
      <Header variant={user ? "authenticated" : "guest"} userInitial={userInitial} />
      <main className="bg-page-gray px-6 py-12 md:px-10 lg:py-16">
        <div className="mx-auto max-w-[760px] rounded-card border border-border-card bg-white p-8 md:p-12">
          <h1 className="text-[28px] font-bold text-navy sm:text-[34px]">Privacy Notice</h1>
          <p className="mt-2 text-sm text-muted-text">Last updated November 2026</p>

          <div className="mt-8 space-y-6 text-base leading-[1.7] text-[#272727]">
            <p>
              The AFA Platform is a pilot system built for the UP Diliman Office of Field Activities (OFA) to
              let faculty submit and track Academic Field Activity (AFA) applications online. This notice
              explains what information the platform collects and how it is used.
            </p>

            <section>
              <h2 className="text-lg font-semibold text-navy">What we collect</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Your name and UP Mail address, provided by Google when you sign in.</li>
                <li>
                  Information you enter while submitting an AFA application, such as course details, activity
                  dates, venue, and uploaded supporting documents.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-navy">How it is used</h2>
              <p className="mt-2">
                Account information is used to identify you within the platform and show your own
                applications. Sign-in is restricted to <strong>@up.edu.ph</strong> accounts. Application data
                you submit is used solely to process your AFA request through OFA&apos;s review and approval
                process.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-navy">Where it is stored</h2>
              <p className="mt-2">
                Data is stored with Supabase, a hosted database provider. Access is limited to the platform&apos;s
                developers and authorized OFA staff. As this platform is still in development, some screens
                currently display sample data rather than live submissions.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-navy">Sharing</h2>
              <p className="mt-2">
                We do not sell or share your information with third parties. Information is only used to
                operate the AFA Platform and to process AFA applications within OFA and the relevant approving
                units (e.g. Department Chair).
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-navy">Contact</h2>
              <p className="mt-2">
                Questions about this notice can be sent to{" "}
                <a href="mailto:ofadiliman@up.edu.ph" className="text-navy underline">
                  ofadiliman@up.edu.ph
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
