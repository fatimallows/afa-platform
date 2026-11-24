"use client";

import Link from "next/link";
import Button from "@/components/Button";
import AfaTypeCard from "@/components/afa/AfaTypeCard";
import { AFA_TYPES } from "@/components/afa/afa-types";
import { useSubmitFlow } from "@/app/submit/flow-context";

export default function Step1Client() {
  const { afaType, setAfaType } = useSubmitFlow();

  return (
    <section className="rounded-flow-card border border-flow-border bg-white p-8">
      <h2 className="text-[26px] font-bold text-flow-navy">Select AFA type</h2>

      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {AFA_TYPES.map((type) => (
          <AfaTypeCard
            key={type.id}
            type={type}
            selected={afaType === type.id}
            onSelect={() => setAfaType(type.id)}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-flow-border pt-6">
        {afaType ? (
          <Button href="/submit/step-2" variant="flow-yellow">
            Continue to upload documents →
          </Button>
        ) : (
          <span
            aria-disabled="true"
            className="flex h-14 cursor-not-allowed items-center rounded-flow-control bg-flow-track px-8 text-lg font-bold text-flow-muted"
          >
            Continue to upload documents →
          </span>
        )}
      </div>

      <div className="mt-5 text-base text-flow-muted">
        <Link href="/dashboard" className="font-semibold">
          Reuse a past AFA
        </Link>
      </div>
    </section>
  );
}
