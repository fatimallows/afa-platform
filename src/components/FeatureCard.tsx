import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, type TablerIcon } from "@tabler/icons-react";

type FeatureCardVariant = "teal" | "deep-yellow" | "orange" | "periwinkle";

// Exact pastel wash colors from the Figma card fills (50% opacity tints).
const variantWash: Record<FeatureCardVariant, string> = {
  teal: "rgba(130, 232, 206, 0.5)",
  "deep-yellow": "rgba(254, 230, 174, 0.5)",
  orange: "rgba(249, 150, 150, 0.5)",
  periwinkle: "rgba(91, 79, 159, 0.5)",
};

type FeatureCardProps = {
  href: string;
  variant: FeatureCardVariant;
  icon: TablerIcon;
  image: string;
  imageClassName?: string;
  title: string;
  description: string;
};

export default function FeatureCard({
  href,
  variant,
  icon: Icon,
  image,
  imageClassName,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group relative block h-[250px] w-full overflow-hidden rounded-[10px] border border-border-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 1024px) 25vw, 50vw"
        className={`object-cover transition-transform duration-300 group-hover:scale-105 ${imageClassName ?? ""}`}
      />
      <div className="absolute inset-0" style={{ backgroundColor: variantWash[variant] }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />

      <div className="relative flex h-full flex-col p-5 pt-9 text-white">
        <Icon size={56} stroke={1.5} className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />

        <div className="mt-3 pr-6">
          <h3 className="text-[25px] font-bold leading-[1.1] drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
            {title}
          </h3>
          <p className="mt-1 text-base font-medium text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
            {description}
          </p>
        </div>

        <IconArrowRight
          size={24}
          stroke={2}
          className="absolute bottom-5 right-5 transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
