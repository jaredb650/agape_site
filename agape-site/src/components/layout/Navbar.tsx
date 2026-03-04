"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GlitchText from "@/components/effects/GlitchText";
import { asset } from "@/lib/asset";

const navLinks = [
  { href: "/events", label: "Events", num: "01" },
  { href: "/music", label: "Music", num: "02" },
  { href: "/news", label: "News", num: "03" },
  { href: "/about", label: "About", num: "04" },
  { href: "/contact", label: "Contact", num: "05" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  // Staggered clip-path reveal on mount
  useEffect(() => {
    const timer = setTimeout(() => setHasRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top border accent line */}
      <div className="h-[1px] w-full bg-[#363636]" />

      <nav
        role="navigation"
        className="flex items-center justify-between px-6 py-4 md:px-10 lg:px-16"
        style={{
          backgroundColor: "rgba(5, 5, 5, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.455, 0.03, 0.515, 0.955] }}
          >
            <Image
              src={asset("/images/agape_logo_white.png")}
              alt="AGAPE Music"
              width={120}
              height={60}
              priority
              className="h-10 w-auto"
            />
          </motion.div>
        </Link>

        {/* Desktop Nav Links — numbered, uppercase, clip-path reveal */}
        <div className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={hasRevealed ? { clipPath: "inset(0 0% 0 0)" } : {}}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.12,
                ease: [0.455, 0.03, 0.515, 0.955],
              }}
            >
              <Link
                href={link.href}
                className="group flex items-baseline gap-2"
              >
                <span
                  className="font-mono text-[10px] text-[#888888] transition-colors duration-200 group-hover:text-[#a1f081]"
                  style={{ letterSpacing: "0.05em" }}
                >
                  {link.num}
                </span>
                <span className="font-display text-[13px] uppercase tracking-[0.12em] text-[#f0f0f0]">
                  <GlitchText text={link.label} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop — subtle time/status indicator for HUD feel */}
        <motion.div
          className="hidden items-center gap-3 lg:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <span className="h-[6px] w-[6px] bg-[#a1f081] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#888888]">
            NYC
          </span>
        </motion.div>

        {/* Mobile Burger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[6px] lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <motion.span
            className="block h-[1px] w-6 bg-[#f0f0f0]"
            animate={
              isOpen
                ? { rotate: 45, y: 3.5, width: 20 }
                : { rotate: 0, y: 0, width: 24 }
            }
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.span
            className="block h-[1px] w-6 bg-[#f0f0f0]"
            animate={
              isOpen
                ? { rotate: -45, y: -3.5, width: 20 }
                : { rotate: 0, y: 0, width: 24 }
            }
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </button>
      </nav>

      {/* Bottom border line */}
      <div className="h-[1px] w-full bg-[#363636]/50" />

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-start justify-center bg-[#050505] px-8 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.455, 0.03, 0.515, 0.955] }}
          >
            {/* Corner brackets on mobile menu */}
            <div className="absolute top-6 left-6 h-6 w-6 border-t border-l border-[#363636]" />
            <div className="absolute top-6 right-6 h-6 w-6 border-t border-r border-[#363636]" />
            <div className="absolute bottom-6 left-6 h-6 w-6 border-b border-l border-[#363636]" />
            <div className="absolute bottom-6 right-6 h-6 w-6 border-b border-r border-[#363636]" />

            <div className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + i * 0.08,
                    ease: [0.455, 0.03, 0.515, 0.955],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-baseline gap-4"
                  >
                    <span className="font-mono text-sm text-[#888888] transition-colors duration-200 group-hover:text-[#a1f081]">
                      {link.num}
                    </span>
                    <span className="font-display text-4xl uppercase tracking-[0.08em] text-[#f0f0f0]">
                      <GlitchText text={link.label} />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom info on mobile overlay */}
            <motion.div
              className="absolute bottom-12 left-8 flex flex-col gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888888]">
                Pushing the Limits of Electronic Music
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#888888]">
                NYC Underground
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
