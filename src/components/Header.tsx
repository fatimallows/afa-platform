"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconBell, IconExternalLink, IconMenu2, IconX } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";

// `match` is the link's real page, used only to decide the bold "active" state.
// Links without a real page yet (Internships, AFA Map) omit it, so they never
// show as active just because they're temporarily routed to a placeholder page.
const guestNavLinks = [
  { label: "Home", href: "/", match: "/" },
  { label: "Internships", href: "/sign-in" },
  { label: "AFA Map", href: "/sign-in" },
];

const authenticatedNavLinks = [
  { label: "Home", href: "/", match: "/" },
  { label: "Dashboard", href: "/dashboard", match: "/dashboard" },
  { label: "Internships", href: "/dashboard" },
  { label: "AFA Map", href: "/dashboard" },
];

type HeaderProps = {
  variant?: "guest" | "authenticated";
  userInitial?: string;
};

export default function Header({ variant = "guest", userInitial }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isMobileAvatarMenuOpen, setIsMobileAvatarMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const navLinks = variant === "authenticated" ? authenticatedNavLinks : guestNavLinks;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsAvatarMenuOpen(false);
    setIsMobileAvatarMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border-card bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-6 py-4 md:px-10">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/ofa-logo-lockup.png"
            alt="University of the Philippines Diliman — Office of Field Activities"
            width={2048}
            height={273}
            priority
            className="h-11 w-auto md:h-[52px]"
          />
        </Link>

        {/* Desktop nav — unchanged from before this round of mobile-specific edits */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-base hover:text-slate-navy ${
                pathname === link.match ? "font-bold text-navy" : "font-medium text-navy"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {variant === "authenticated" ? (
            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-page-gray"
            >
              <IconBell size={22} stroke={1.75} />
            </button>
          ) : (
            <>
              <a
                href="https://ofa.upd.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-base font-medium text-navy hover:text-slate-navy"
              >
                OFA Website
                <IconExternalLink size={18} stroke={2} />
              </a>
              <Link href="/sign-in" className="text-base font-medium text-navy underline hover:text-slate-navy">
                Sign In
              </Link>
            </>
          )}

          {variant === "authenticated" && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAvatarMenuOpen((open) => !open)}
                aria-label="Account menu"
                aria-expanded={isAvatarMenuOpen}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-navy text-base font-semibold text-white"
              >
                {userInitial ?? "U"}
              </button>
              {isAvatarMenuOpen && (
                <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-control border border-border-card bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-base text-navy hover:bg-page-gray"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile-only cluster: hamburger, notifications, avatar grouped together */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="inline-flex items-center justify-center rounded-control p-2 text-navy"
          >
            {isMenuOpen ? <IconX size={26} stroke={2} /> : <IconMenu2 size={26} stroke={2} />}
          </button>

          {variant === "authenticated" && (
            <>
              <button
                type="button"
                aria-label="Notifications"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-navy hover:bg-page-gray"
              >
                <IconBell size={22} stroke={1.75} />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMobileAvatarMenuOpen((open) => !open)}
                  aria-label="Account menu"
                  aria-expanded={isMobileAvatarMenuOpen}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white"
                >
                  {userInitial ?? "U"}
                </button>
                {isMobileAvatarMenuOpen && (
                  <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-control border border-border-card bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-base text-navy hover:bg-page-gray"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border-card px-6 py-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`rounded-control px-2 py-3 text-base hover:bg-page-gray ${
                pathname === link.match ? "font-bold text-navy" : "font-medium text-navy"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {variant === "guest" && (
            <>
              <a
                href="https://ofa.upd.edu.ph/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-control px-2 py-3 text-base font-medium text-navy hover:bg-page-gray"
              >
                OFA Website
                <IconExternalLink size={16} stroke={2} />
              </a>
              <Link
                href="/sign-in"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-control px-2 py-3 text-base font-medium text-navy underline hover:bg-page-gray"
              >
                Sign In
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
