"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Button from "@/components/Button";
import TitleBand from "@/components/afa/TitleBand";
import ProgressStepper from "@/components/afa/ProgressStepper";
import { useSubmitFlow } from "@/app/submit/flow-context";
import { getAfaTypeLabel } from "@/components/afa/afa-types";

type FlowLayoutProps = {
  currentStep: 1 | 2 | 3 | 4;
  userInitial?: string;
  aside?: ReactNode;
  children: ReactNode;
};

export default function FlowLayout({ currentStep, userInitial, aside, children }: FlowLayoutProps) {
  const { applicationName, afaType, resetFlow } = useSubmitFlow();
  const typeLabel = getAfaTypeLabel(afaType);
  const router = useRouter();

  const subtitle =
    currentStep > 1 && (applicationName || typeLabel)
      ? [applicationName || "Untitled application", typeLabel].filter(Boolean).join(" · ")
      : null;

  function handleDiscard() {
    const ok = window.confirm("Discard this draft? Everything you've entered or uploaded will be cleared.");
    if (!ok) return;
    resetFlow();
    router.push("/dashboard");
  }

  return (
    <>
      <Header variant="authenticated" userInitial={userInitial} />
      <div className="min-h-screen bg-flow-page font-sans text-[17px] leading-[1.5] text-flow-text">
        <TitleBand
          breadcrumbLabel="Submit an AFA"
          title="Submit an Academic Field Activity"
          subtitle={subtitle}
          action={
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDiscard}
                className="h-12 rounded-flow-control border border-flow-help-border px-5 text-base text-white hover:bg-white/10"
              >
                Discard draft
              </button>
              <Button href="/dashboard" variant="flow-white">
                Save and exit
              </Button>
            </div>
          }
        />
        <main className="mx-auto max-w-[1280px] px-8 pb-16">
          <ProgressStepper currentStep={currentStep} />
          <div className="flex flex-wrap items-start gap-7">
            <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">{children}</div>
            {aside && <aside className="flex flex-1 basis-[300px] flex-col gap-5">{aside}</aside>}
          </div>
        </main>
        <footer className="border-t border-flow-border bg-white py-6 text-center text-[15px] text-flow-muted">
          Copyright © 2026 OFFICE OF FIELD ACTIVITIES. All rights reserved.
        </footer>
      </div>
    </>
  );
}
