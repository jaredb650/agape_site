"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/music", label: "Music" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        role="navigation"
        className="flex items-center justify-between px-6 py-4 md:px-10"
      >
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <Image
            src="/images/agape_logo_white.png"
            alt="AGAPE Music"
            width={120}
            height={60}
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-sm uppercase tracking-widest text-primary-light transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Burger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <span
            className={`block h-[2px] w-6 bg-primary-light transition-all duration-300 ${
              isOpen ? "translate-y-[5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-6 bg-primary-light transition-all duration-300 ${
              isOpen ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-body transition-all duration-500 md:hidden ${
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-display text-3xl uppercase tracking-widest text-primary-light transition-colors hover:text-accent"
                style={{
                  transitionDelay: isOpen ? `${i * 75}ms` : "0ms",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(20px)",
                  transition:
                    "opacity 0.4s ease, transform 0.4s ease, color 0.2s ease",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
