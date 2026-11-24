import Image from "next/image";
import Button from "@/components/Button";

type TitleBandProps = {
  subtitle?: string | null;
};

export default function TitleBand({ subtitle }: TitleBandProps) {
  return (
    <div className="relative overflow-hidden bg-flow-navy text-white">
      <Image
        src="/images/dashboard-banner.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="object-cover opacity-20"
      />
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-4 px-8 pb-[84px] pt-7">
        <div>
          <div className="text-[15px] text-flow-banner-text-dim">
            <a href="/dashboard" className="text-white">
              Dashboard
            </a>{" "}
            › Submit an AFA
          </div>
          <h1 className="mb-1.5 mt-2 text-[36px] font-extrabold leading-[1.2]">Submit an Academic Field Activity</h1>
          {subtitle && <p className="m-0 text-[17px] text-flow-banner-text">{subtitle}</p>}
        </div>
        <Button href="/dashboard" variant="flow-white">
          Save and exit
        </Button>
      </div>
    </div>
  );
}
