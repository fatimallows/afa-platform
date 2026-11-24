import type { ReactNode } from "react";
import Image from "next/image";

type TitleBandProps = {
  breadcrumbLabel: string;
  title: string;
  badge?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  bannerSrc?: string;
  bannerOpacity?: "full" | "dimmed";
};

export default function TitleBand({
  breadcrumbLabel,
  title,
  badge,
  subtitle,
  action,
  bannerSrc = "/images/dashboard-banner.jpg",
  bannerOpacity = "dimmed",
}: TitleBandProps) {
  return (
    <div className="relative overflow-hidden bg-flow-navy text-white">
      <Image
        src={bannerSrc}
        alt=""
        aria-hidden="true"
        fill
        priority
        className={`object-cover ${bannerOpacity === "dimmed" ? "opacity-20" : ""}`}
      />
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-4 px-8 pb-[84px] pt-7">
        <div>
          <div className="text-[15px] text-flow-banner-text-dim">
            <a href="/dashboard" className="text-white">
              Dashboard
            </a>{" "}
            › {breadcrumbLabel}
          </div>
          <div className="mb-1.5 mt-2 flex flex-wrap items-center gap-3.5">
            <h1 className="text-[36px] font-extrabold leading-[1.2]">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="m-0 text-[17px] text-flow-banner-text">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
