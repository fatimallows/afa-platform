"use client";

import type { ReactNode } from "react";
import Header from "@/components/Header";
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
  const { applicationName, afaType } = useSubmitFlow();
  const typeLabel = getAfaTypeLabel(afaType);

  const subtitle =
    currentStep > 1 && (applicationName || typeLabel)
      ? [applicationName || "Untitled application", typeLabel].filter(Boolean).join(" · ")
      : null;

  return (
    <>
      <Header variant="authenticated" userInitial={userInitial} />
      <div className="min-h-screen bg-flow-page font-sans text-[17px] leading-[1.5] text-flow-text">
        <TitleBand subtitle={subtitle} />
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
