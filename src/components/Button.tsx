import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "outline-light"
  | "flow-yellow"
  | "flow-navy"
  | "flow-outline-navy"
  | "flow-white"
  | "flow-outline-white";

const sharedClasses =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

// The original two variants share one fixed size (homepage CTA buttons); the
// "flow-" variants belong to the "Submit an AFA" flow (src/app/submit), whose
// buttons vary in height/width by context, so they carry their own sizing.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "h-[54px] w-full max-w-[300px] rounded-[15px] px-6 text-[20px] bg-ofa-yellow text-navy hover:bg-yellow-hover focus-visible:ring-ofa-yellow",
  "outline-light":
    "h-[54px] w-full max-w-[300px] rounded-[15px] px-6 text-[20px] bg-transparent text-white border-[3px] border-white hover:bg-white/10 focus-visible:ring-white",
  "flow-yellow":
    "h-14 rounded-flow-control px-8 text-lg font-bold bg-flow-yellow text-flow-navy hover:brightness-95 focus-visible:ring-flow-yellow",
  "flow-navy":
    "h-[52px] rounded-flow-control px-7 text-[17px] font-semibold bg-flow-navy text-white hover:bg-flow-navy/90 focus-visible:ring-flow-navy",
  "flow-outline-navy":
    "h-14 rounded-flow-control border-2 border-flow-navy px-6 text-base bg-white text-flow-navy hover:bg-flow-page focus-visible:ring-flow-navy",
  "flow-white":
    "h-12 rounded-flow-control px-5 text-base bg-white text-flow-navy hover:bg-white/90 focus-visible:ring-flow-navy",
  "flow-outline-white":
    "h-12 rounded-flow-control border border-flow-help-border px-5 text-base text-white hover:bg-white/10 focus-visible:ring-white",
};

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

type ButtonProps = LinkButtonProps | NativeButtonProps;

export default function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const classes = `${sharedClasses} ${variantClasses[variant]} ${className}`;

  if (props.href) {
    const { href, ...anchorProps } = props as LinkButtonProps;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { ...buttonProps } = props as NativeButtonProps;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
