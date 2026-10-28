import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import GoogleSignInButton from "./GoogleSignInButton";

export const metadata: Metadata = {
  title: "Sign In | AFA Platform",
};

const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "Something went wrong starting sign-in. Please try again.",
  auth_failed: "We couldn't sign you in. Please try again.",
  invalid_domain: "You need a UP Mail account (@up.edu.ph) to sign in. Please use your UP email address.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] ?? ERROR_MESSAGES.auth_failed : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col lg:flex-row">
        <div className="relative isolate min-h-[380px] overflow-hidden lg:min-h-0 lg:w-[36%]">
          <Image
            src="/images/signin-photo.jpg"
            alt="Students and faculty taking part in field activities"
            fill
            priority
            sizes="(min-width: 1024px) 36vw, 100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-navy/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />

          <p className="absolute inset-x-8 bottom-[8%] text-[clamp(28px,8vw,56px)] font-extrabold leading-[1.1] text-white lg:inset-x-12 lg:text-[clamp(36px,4.5vw,80px)]">
            Learning
            <br />
            beyond the
            <br />
            Classroom.
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-14 lg:px-16">
          <div className="w-full max-w-[589px]">
            <h1 className="text-[40px] font-extrabold leading-tight text-navy sm:text-[52px] lg:text-[60px]">
              Sign In
            </h1>
            <p className="mt-2 text-lg text-navy sm:text-[25px]">
              Use your UP email to sign in to AFA Platform.
            </p>

            {errorMessage && (
              <p
                role="alert"
                className="mt-6 rounded-control border border-status-returned-text/20 bg-status-returned-bg px-4 py-3 text-base text-status-returned-text"
              >
                {errorMessage}
              </p>
            )}

            <div className="mt-8">
              <GoogleSignInButton />
            </div>

            <p className="mt-6 max-w-[548px] text-base text-navy/50">
              You need a UP Mail account (<span className="font-bold">@up.edu.ph</span>) to use this
              platform. For help, email{" "}
              <a href="mailto:ofadiliman@up.edu.ph" className="underline hover:text-navy">
                ofadiliman@up.edu.ph
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <div className="border-t border-border-card bg-white">
        <p className="mx-auto max-w-[1440px] px-6 py-5 text-center text-base text-muted-text md:px-10">
          Copyright &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://ofa.upd.edu.ph/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-navy"
          >
            OFFICE OF FIELD ACTIVITIES
          </a>
          . All rights reserved. <Link href="/privacy-notice" className="underline hover:text-navy">
            Privacy Notice
          </Link>
        </p>
      </div>
    </div>
  );
}
