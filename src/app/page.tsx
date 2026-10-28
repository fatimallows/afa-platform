import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import FeatureCard from "@/components/FeatureCard";
import { createClient } from "@/lib/supabase/server";
import { IconBriefcase, IconFileUpload, IconMap, IconProgressCheck } from "@tabler/icons-react";

const features = [
  {
    href: "/sign-in",
    variant: "teal" as const,
    icon: IconFileUpload,
    image: "/images/card-submit-afas.jpg",
    title: "Submit AFAs",
    description: "Send requests online, with optional AI autofill",
  },
  {
    href: "/sign-in",
    variant: "deep-yellow" as const,
    icon: IconProgressCheck,
    image: "/images/card-track-applications.jpg",
    title: "Track Applications",
    description: "Follow your AFA application at every step",
  },
  {
    href: "/sign-in",
    variant: "orange" as const,
    icon: IconBriefcase,
    image: "/images/card-find-internships.png",
    imageClassName: "scale-125 object-[center_35%]",
    title: "Find Internships",
    description: "Browse internship opportunities",
  },
  {
    href: "/sign-in",
    variant: "periwinkle" as const,
    icon: IconMap,
    image: "/images/card-view-map.jpg",
    title: "View the AFA Map",
    description: "See where field activities are happening",
  },
];

export default async function Home() {
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

  const ctaHref = user ? "/dashboard" : "/sign-in";

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header variant={user ? "authenticated" : "guest"} userInitial={userInitial} />

        <main className="flex flex-1 flex-col">
          <section className="relative isolate flex min-h-[360px] flex-1 items-center overflow-hidden">
            <Image
              src="/images/hero-bg.png"
              alt="Faculty and students taking part in a field activity"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/60" />

            <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center gap-10 px-6 py-10 text-center md:px-10 lg:py-12">
              <div className="text-white">
                <p className="text-[20px] font-extrabold tracking-wide sm:text-[24px] lg:text-[28px]">
                  WELCOME TO THE NEW
                </p>
                <h1 className="mt-2 text-[52px] font-extrabold leading-[1.05] sm:text-[76px] lg:text-[96px]">
                  AFA PLATFORM
                </h1>
                <p className="mx-auto mt-5 max-w-[640px] text-base font-medium leading-[1.5] sm:text-[18px] sm:leading-[1.6]">
                  A simpler way for faculty and students to submit and track academic field activities and
                  find internship opportunities, all in one place.
                </p>
              </div>

              <div className="flex w-full max-w-[300px] flex-col gap-[16px] sm:max-w-none sm:flex-row sm:justify-center sm:gap-[40px]">
                <Button href={ctaHref} variant="primary">
                  Submit an AFA
                </Button>
                <Button href={ctaHref} variant="outline-light">
                  Browse Internships
                </Button>
              </div>
            </div>
          </section>

          <section className="shrink-0 bg-page-gray px-6 py-8 md:px-10">
            <div className="mx-auto w-full max-w-[1440px]">
              <h2 className="text-center text-[28px] font-bold text-navy">What&apos;s inside the AFA Platform</h2>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-[32px] lg:grid-cols-4">
                {features.map((feature) => (
                  <FeatureCard key={feature.title} {...feature} href={ctaHref} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
