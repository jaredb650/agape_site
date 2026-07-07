"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Boot sequence — plays once per session before the hero.
   A mono status line types on over black with a red block cursor,
   then the whole plate wipes upward to reveal the page. Total ~1.6s,
   click-to-skip, skipped entirely for reduced motion. */

const BOOT_LINE = "AGAPE // BROOKLYN NY — SIGNAL LOCKED";
const TYPE_SPEED_MS = 26;
const HOLD_MS = 450;

export default function BootIntro({ onDone }: { onDone?: () => void }) {
  // "idle" = undecided (matches prerendered HTML), then play or skip
  const [phase, setPhase] = useState<"idle" | "typing" | "done">("idle");
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // ?noboot skips the sequence — handy for QA/screenshot tooling
    const skip =
      reduceMotion ||
      sessionStorage.getItem("agape-boot") === "1" ||
      new URLSearchParams(window.location.search).has("noboot");
    if (skip) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("agape-boot", "1");
    setPhase("typing");
  }, []);

  useEffect(() => {
    if (phase === "done") onDone?.();
    if (phase !== "typing") return;
    if (chars < BOOT_LINE.length) {
      const t = setTimeout(() => setChars((c) => c + 1), TYPE_SPEED_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("done"), HOLD_MS);
    return () => clearTimeout(t);
  }, [phase, chars, onDone]);

  return (
    <AnimatePresence>
      {phase === "typing" && (
        <motion.div
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[#050505]"
          onClick={() => setPhase("done")}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: [0.83, 0, 0.17, 1] }}
          aria-hidden="true"
        >
          <div className="px-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8a8a8a] md:text-[13px]">
              {BOOT_LINE.slice(0, chars)}
            </span>
            <span className="block-cursor ml-2" />
          </div>
          {/* corner ticks */}
          <div className="pointer-events-none absolute inset-6">
            <div className="absolute left-0 top-0 h-4 w-4 border-l border-t border-[#363636]" />
            <div className="absolute right-0 top-0 h-4 w-4 border-r border-t border-[#363636]" />
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-[#363636]" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-[#363636]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
