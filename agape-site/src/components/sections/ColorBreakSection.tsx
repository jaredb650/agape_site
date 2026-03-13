"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { asset } from "@/lib/asset";

const GLITCH_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

/* ── Word with idle character-scramble glitch + hover glitch ── */
function GlitchWord({ word }: { word: string }) {
  const [display, setDisplay] = useState(word);
  const [isHovered, setIsHovered] = useState(false);

  // Idle glitch — random scramble
  useEffect(() => {
    // Skip idle glitch on mobile to reduce timer load
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let scrambleId: ReturnType<typeof setInterval> | null = null;

    const glitch = () => {
      const count = 1 + Math.floor(Math.random() * Math.min(3, word.length));
      const indices = new Set<number>();
      while (indices.size < count) {
        indices.add(Math.floor(Math.random() * word.length));
      }

      let frame = 0;
      const totalFrames = 4 + Math.floor(Math.random() * 3);
      if (scrambleId) clearInterval(scrambleId);
      scrambleId = setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
          if (scrambleId) clearInterval(scrambleId);
          scrambleId = null;
          setDisplay(word);
          return;
        }
        setDisplay(
          word
            .split("")
            .map((ch, i) =>
              indices.has(i)
                ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
                : ch
            )
            .join("")
        );
      }, 60);
    };

    // Stagger start so not all words glitch at once
    const delay = Math.random() * 3000;
    const timeout = setTimeout(() => {
      glitch();
      intervalId = setInterval(glitch, 2000 + Math.random() * 4000);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (intervalId) clearInterval(intervalId);
      if (scrambleId) clearInterval(scrambleId);
    };
  }, [word]);

  // Hover glitch — full word scramble then resolve
  const handleHover = () => {
    setIsHovered(true);
    let frame = 0;
    const totalFrames = 6;
    const interval = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplay(word);
        setIsHovered(false);
        return;
      }
      setDisplay(
        word
          .split("")
          .map((ch) =>
            ch === " "
              ? " "
              : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          )
          .join("")
      );
    }, 50);
  };

  return (
    <span
      className="inline-block cursor-default transition-transform duration-200"
      style={{
        transform: isHovered ? `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)` : "none",
      }}
      onMouseEnter={handleHover}
    >
      {display}
    </span>
  );
}

export default function ColorBreakSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const words =
    "No VIP. No velvet ropes. Just raw energy and relentless beats in the spaces where music sounds the way it was meant to.".split(
      " "
    );

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 md:py-32"
      style={{ contain: "paint" }}
    >
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          style={{ filter: "brightness(0.5) saturate(1.2)" }}
        >
          <source src={asset("/videos/red-strobes.mp4")} type="video/mp4" />
        </video>
        {/* Subtle dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.2) 50%, rgba(5,5,5,0.4) 100%)",
          }}
        />
      </div>

      {/* Grain overlay — SVG feTurbulence crashes mobile Safari, desktop only */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: 0.12 }}
        >
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="colorBreakNoise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#colorBreakNoise)" />
          </svg>
        </div>
      )}

      {/* Content — mix-blend-mode difference inverts against video */}
      <div
        className="relative z-10 mx-auto max-w-[1400px] px-6"
        style={{ mixBlendMode: "difference" }}
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-white/80"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          [ MANIFESTO ]
        </motion.p>

        {/* Main text — character-scramble glitch + hover + inverted colors */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="flex flex-wrap gap-x-[0.3em] gap-y-[0.05em] uppercase font-bold text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5.5vw, 5.5rem)",
            lineHeight: 0.95,
            letterSpacing: "0.02em",
          }}
        >
          {words.map((word, i) => (
            <GlitchWord key={i} word={word} />
          ))}
        </motion.h2>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-12 flex flex-wrap items-center gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-white/60"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span>Est. 2023</span>
          <span className="mx-4 hidden sm:inline text-white/30">---</span>
          <span className="mx-2 sm:hidden text-white/30">—</span>
          <span>NYC</span>
          <span className="mx-4 hidden sm:inline text-white/30">---</span>
          <span className="mx-2 sm:hidden text-white/30">—</span>
          <span>Underground</span>
        </motion.div>
      </div>
    </section>
  );
}
