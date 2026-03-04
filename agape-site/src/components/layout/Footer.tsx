"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import GlitchText from "@/components/effects/GlitchText";
import CornerBrackets from "@/components/effects/CornerBrackets";

const navLinks = [
  { href: "/events", label: "Events", num: "01" },
  { href: "/music", label: "Music", num: "02" },
  { href: "/news", label: "News", num: "03" },
  { href: "/about", label: "About", num: "04" },
  { href: "/contact", label: "Contact", num: "05" },
];

const socialLinks = [
  { href: "https://instagram.com/agapemusic.us", label: "Instagram" },
  { href: "https://soundcloud.com/agape-music-us", label: "SoundCloud" },
  { href: "https://ra.co/promoters/114558", label: "RA" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: integrate with Resend API
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative border-t border-[#363636]/50 bg-[#050505]">
      {/* Main footer content */}
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/">
              <Image
                src="/images/agape_logo_white.png"
                alt="AGAPE Music"
                width={120}
                height={60}
                className="h-10 w-auto"
              />
            </Link>
            <p className="font-body text-sm leading-relaxed text-[#888888]">
              Pushing the Limits of Electronic Music
              <br />
              in NYC&apos;s Underground.
            </p>
            <div className="flex items-center gap-2">
              <span className="h-[5px] w-[5px] bg-[#a1f081] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888888]">
                New York City
              </span>
            </div>
          </div>

          {/* Column 2 — Navigation */}
          <div className="flex flex-col gap-6">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
              Navigate
            </h4>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-baseline gap-3"
                >
                  <span className="font-mono text-[10px] text-[#888888] transition-colors duration-200 group-hover:text-[#a1f081]">
                    {link.num}
                  </span>
                  <span className="font-display text-sm uppercase tracking-[0.1em] text-[#f0f0f0]">
                    <GlitchText text={link.label} />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Social */}
          <div className="flex flex-col gap-6">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
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

          {/* Column 4 — Newsletter */}
          <div className="flex flex-col gap-6">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
              Stay Updated
            </h4>
            <p className="text-sm leading-relaxed text-[#888888]">
              Get notified about upcoming events and releases.
            </p>
            <CornerBrackets>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col gap-3 p-4"
              >
                {subscribed ? (
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#a1f081]">
                    Subscribed — stay tuned.
                  </p>
                ) : (
                  <>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full border-b border-[#363636] bg-transparent py-2 font-mono text-[12px] text-[#f0f0f0] placeholder-[#888888] outline-none transition-colors duration-200 focus:border-[#a1f081]"
                    />
                    <button
                      type="submit"
                      className="group self-start border border-[#363636] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[#f0f0f0] transition-all duration-300 hover:border-[#a1f081] hover:text-[#a1f081]"
                    >
                      <GlitchText text="Subscribe" />
                    </button>
                  </>
                )}
              </form>
            </CornerBrackets>
          </div>
        </div>
      </div>

      {/* Bottom bar — legal */}
      <div className="border-t border-[#363636]/30">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row md:px-10 lg:px-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888888]">
            &copy; {new Date().getFullYear()} AGAPE Music. All rights reserved.
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
