"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconExternalLink, IconMenu2, IconX } from "@tabler/icons-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Internships", href: "/internships" },
  { label: "AFA Map", href: "/afa-map" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base hover:text-slate-navy ${
                link.href === "/" ? "font-bold text-navy" : "font-medium text-navy"
              }`}
            >
              {link.label}
            </Link>
          ))}
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
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="inline-flex items-center justify-center rounded-control p-2 text-navy lg:hidden"
        >
          {isMenuOpen ? <IconX size={26} stroke={2} /> : <IconMenu2 size={26} stroke={2} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border-card px-6 py-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`rounded-control px-2 py-3 text-base hover:bg-page-gray ${
                link.href === "/" ? "font-bold text-navy" : "font-medium text-navy"
              }`}
            >
              {link.label}
            </Link>
          ))}
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
        </nav>
      )}
    </header>
  );
}
