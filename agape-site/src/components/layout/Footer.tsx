"use client";

import Link from "next/link";
import Image from "next/image";
import GlitchText from "@/components/effects/GlitchText";
import { asset } from "@/lib/asset";

const navLinks = [
  { href: "/#events", label: "Events", num: "01" },
  { href: "https://soundcloud.com/agape-513401947", label: "Music", num: "02" },
  { href: "https://instagram.com/agapemusic.us", label: "News", num: "03" },
  { href: "/#about", label: "About", num: "04" },
  { href: "mailto:bookings@agapemusic.us", label: "Contact", num: "05" },
];

const socialLinks = [
  { href: "https://instagram.com/agapemusic.us", label: "Instagram" },
  { href: "https://soundcloud.com/agape-513401947", label: "SoundCloud" },
  { href: "https://posh.vip/g/agape", label: "Posh" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[#363636]/50 bg-[#050505]">
      {/* Main footer content */}
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/">
              <Image
                src={asset("/images/agape_logo_white.png")}
                alt="AGAPE Music"
                width={120}
                height={60}
                className="h-10 w-auto"
              />
            </Link>
            <p className="font-body text-sm leading-relaxed text-[#888888]">
              Pushing the Limits of Electronic Music
              <br />
              in NYC&apos;s Dance Scene.
            </p>
            <div className="flex items-center gap-2">
              <span className="h-[5px] w-[5px] bg-[#c13243] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888888]">
                New York City
              </span>
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#888888]" style={{ fontFamily: "var(--font-heading)" }}>
              Navigate
            </h4>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {navLinks.map((link) => {
                const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto:");
                const Tag = isExternal ? "a" : Link;
                const extraProps = isExternal && link.href.startsWith("http") ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
                return (
                  <Tag
                    key={link.href}
                    href={link.href}
                    className="group flex items-baseline gap-3"
                    {...extraProps}
                  >
                    <span className="font-mono text-[10px] text-[#888888] transition-colors duration-200 group-hover:text-[#a1f081]">
                      {link.num}
                    </span>
                    <span className="font-display text-sm uppercase tracking-[0.1em] text-[#f0f0f0]">
                      <GlitchText text={link.label} />
                    </span>
                  </Tag>
                );
              })}
            </nav>
          </div>

          {/* Column 3 — Social */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#888888]" style={{ fontFamily: "var(--font-heading)" }}>
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-sm uppercase tracking-[0.1em] text-[#f0f0f0]"
                >
                  <GlitchText text={link.label} />
                </a>
              ))}
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <a
                href="mailto:andres@agapemusic.us"
                className="font-mono text-[11px] text-[#888888] transition-colors duration-200 hover:text-[#f0f0f0]"
              >
                andres@agapemusic.us
              </a>
              <a
                href="mailto:bookings@agapemusic.us"
                className="font-mono text-[11px] text-[#888888] transition-colors duration-200 hover:text-[#f0f0f0]"
              >
                bookings@agapemusic.us
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar — legal */}
      <div className="border-t border-[#363636]/30">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row md:px-10 lg:px-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888888]" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} ÄGAPĒ Music. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888888] transition-colors duration-200 hover:text-[#f0f0f0]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888888] transition-colors duration-200 hover:text-[#f0f0f0]"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
