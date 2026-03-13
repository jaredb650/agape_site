"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import GlitchText from "@/components/effects/GlitchText";
import { asset } from "@/lib/asset";

const navLinks = [
  { href: "#events", label: "Events", num: "01" },
  { href: "#about", label: "About", num: "02" },
  { href: "#residents", label: "Residents", num: "03" },
  { href: "#manifesto", label: "Manifesto", num: "04" },
  { href: "#contact", label: "Contact", num: "05" },
];

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_EXPO: [number, number, number, number] = [0.455, 0.03, 0.515, 0.955];

function smoothScrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  // Staggered clip-path reveal on mount
  useEffect(() => {
    const timer = setTimeout(() => setHasRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Scroll detection — switch navbars when hero scrolls out of view
  useEffect(() => {
    let rafId = 0;

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const hero = document.querySelector("section.h-screen, section[class*='h-screen']");
        if (hero) {
          const heroBottom = hero.getBoundingClientRect().bottom;
          setPastHero(heroBottom < 100);
        } else {
          setPastHero(window.scrollY > window.innerHeight * 0.8);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Lock body scroll when mobile menu is open (top nav full-screen overlay only)
  useEffect(() => {
    if (isOpen && !pastHero) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, pastHero]);

  // Close menu when switching between nav modes
  useEffect(() => {
    setIsOpen(false);
  }, [pastHero]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    // Small delay so menu closes before scroll
    setTimeout(() => smoothScrollTo(href), 50);
  }, []);

  return (
    <>
      {/* ===== TOP NAV — visible during hero, slides up when past hero ===== */}
      <AnimatePresence>
        {!pastHero && (
          <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="fixed top-0 left-0 right-0 z-50"
          >
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
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToTop(); }} className="relative z-50">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: EASE_EXPO }}
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
              </a>

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
                      ease: EASE_EXPO,
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
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
                    </a>
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

              {/* Mobile Burger Button (top nav) */}
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
          </motion.header>
        )}
      </AnimatePresence>

      {/* ===== FLOATING BOTTOM NAV — appears after scrolling past hero ===== */}
      <AnimatePresence>
        {pastHero && (
          <motion.nav
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="fixed bottom-5 left-4 right-4 z-50 sm:left-6 sm:right-6 lg:left-10 lg:right-10"
            role="navigation"
          >
            {/* Dropup menu — mobile only, expands upward from bottom bar */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="mb-2 flex justify-end overflow-hidden lg:hidden"
                >
                  <div
                    className="flex w-full flex-col items-center gap-5 border border-[#363636]/30 px-14 py-6"
                    style={{
                      backgroundColor: "rgba(5, 5, 5, 0.92)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                    }}
                  >
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + i * 0.06, duration: 0.3 }}
                      >
                        <a
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className="group flex items-baseline gap-3"
                        >
                          <span className="font-mono text-[10px] text-[#888888] transition-colors duration-200 group-hover:text-[#a1f081]">
                            {link.num}
                          </span>
                          <span className="font-display text-sm uppercase tracking-[0.15em] text-[#f0f0f0] transition-colors duration-200 group-hover:text-white">
                            <GlitchText text={link.label} />
                          </span>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main floating bar */}
            <div
              className="flex items-center justify-between border border-[#363636]/30 px-3 py-2.5 sm:px-5"
              style={{
                backgroundColor: "rgba(5, 5, 5, 0.85)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              {/* Left — Logo (click scrolls to top) */}
              <button
                onClick={scrollToTop}
                className="group relative z-10 flex items-center p-1"
                aria-label="Scroll to top"
              >
                <Image
                  src={asset("/images/agape_logo_white.png")}
                  alt="AGAPE Music"
                  width={80}
                  height={40}
                  className="h-7 w-auto opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                />
              </button>

              {/* Center — Desktop nav links (visible on lg+, replaces hamburger) */}
              <div className="hidden items-center gap-8 lg:flex">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="group flex items-baseline gap-2"
                  >
                    <span className="font-mono text-[9px] text-[#666666] transition-colors duration-200 group-hover:text-[#a1f081]">
                      {link.num}
                    </span>
                    <span className="font-display text-[12px] uppercase tracking-[0.12em] text-[#999999] transition-colors duration-200 group-hover:text-[#f0f0f0]">
                      <GlitchText text={link.label} />
                    </span>
                  </a>
                ))}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Live indicator (desktop only) */}
                <div className="hidden items-center gap-2 lg:flex">
                  <span className="h-[5px] w-[5px] bg-[#a1f081] animate-pulse" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#666666]">
                    NYC
                  </span>
                </div>

                {/* Hamburger — mobile/tablet only (hidden on lg+ where links are visible) */}
                {!isOpen && (
                  <button
                    onClick={() => setIsOpen(true)}
                    className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
                    aria-label="Open menu"
                    aria-expanded={false}
                  >
                    <span className="block h-[1px] w-5 bg-[#f0f0f0]" />
                    <span className="block h-[1px] w-5 bg-[#f0f0f0]" />
                  </button>
                )}

                {/* Close button — shown when dropup is open (mobile only) */}
                {isOpen && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
                    aria-label="Close menu"
                    aria-expanded={true}
                  >
                    <motion.span
                      className="block h-[1px] w-5 bg-[#f0f0f0]"
                      animate={{ rotate: 45, y: 3, width: 18 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                    <motion.span
                      className="block h-[1px] w-5 bg-[#f0f0f0]"
                      animate={{ rotate: -45, y: -3, width: 18 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </button>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Full-Screen Overlay — used by top nav only */}
      <AnimatePresence>
        {isOpen && !pastHero && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-start justify-center bg-[#050505] px-8 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: EASE_EXPO }}
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
                    ease: EASE_EXPO,
                  }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="group flex items-baseline gap-4"
                  >
                    <span className="font-mono text-sm text-[#888888] transition-colors duration-200 group-hover:text-[#a1f081]">
                      {link.num}
                    </span>
                    <span className="font-display text-4xl uppercase tracking-[0.08em] text-[#f0f0f0]">
                      <GlitchText text={link.label} />
                    </span>
                  </a>
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
    </>
  );
}
