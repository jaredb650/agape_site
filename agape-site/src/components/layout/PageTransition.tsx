"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<"borders" | "reveal" | "done">("borders");

  useEffect(() => {
    // Lock scroll during preloader
    document.body.style.overflow = "hidden";

    // Phase 1: Borders contract (0–1.5s)
    const t1 = setTimeout(() => setPhase("reveal"), 1500);

    // Phase 2: Content reveals (1.5–3.5s)
    // Phase 3: Done — unlock scroll (4s)
    const t2 = setTimeout(() => {
      setPhase("done");
      setIsLoading(false);
      document.body.style.overflow = "";
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.455, 0.03, 0.515, 0.955] }}
          >
            {/* Contracting border frame */}
            <motion.div
              className="absolute inset-0"
              initial={{ inset: 0 }}
              animate={
                phase === "borders" || phase === "reveal"
                  ? { inset: 0 }
                  : { inset: 0 }
              }
            >
              {/* Top border */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[1px] bg-[#363636]"
                initial={{ scaleX: 0, transformOrigin: "left" }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.455, 0.03, 0.515, 0.955] }}
              />
              {/* Bottom border */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#363636]"
                initial={{ scaleX: 0, transformOrigin: "right" }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.455, 0.03, 0.515, 0.955] }}
              />
              {/* Left border */}
              <motion.div
                className="absolute top-0 bottom-0 left-0 w-[1px] bg-[#363636]"
                initial={{ scaleY: 0, transformOrigin: "top" }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.455, 0.03, 0.515, 0.955] }}
              />
              {/* Right border */}
              <motion.div
                className="absolute top-0 bottom-0 right-0 w-[1px] bg-[#363636]"
                initial={{ scaleY: 0, transformOrigin: "bottom" }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.455, 0.03, 0.515, 0.955] }}
              />
            </motion.div>

            {/* Contracting inner frame */}
            <motion.div
              className="absolute border border-[#363636]/30"
              initial={{ inset: "50%" }}
              animate={
                phase === "borders"
                  ? { inset: "15%" }
                  : { inset: "5%" }
              }
              transition={{
                duration: 1.5,
                ease: [0.455, 0.03, 0.515, 0.955],
              }}
            />

            {/* Corner brackets — animated in */}
            <motion.div
              className="absolute"
              initial={{ inset: "30%", opacity: 0 }}
              animate={
                phase !== "borders"
                  ? { inset: "20%", opacity: 1 }
                  : { inset: "30%", opacity: 0 }
              }
              transition={{ duration: 0.8, ease: [0.455, 0.03, 0.515, 0.955] }}
            >
              {/* Top-left */}
              <div className="absolute top-0 left-0 h-5 w-5 border-t border-l border-[#f0f0f0]" />
              {/* Top-right */}
              <div className="absolute top-0 right-0 h-5 w-5 border-t border-r border-[#f0f0f0]" />
              {/* Bottom-left */}
              <div className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-[#f0f0f0]" />
              {/* Bottom-right */}
              <div className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-[#f0f0f0]" />
            </motion.div>

            {/* Center content — logo text */}
            <div className="relative flex flex-col items-center gap-4">
              <motion.h1
                className="font-display text-4xl font-bold uppercase tracking-[0.2em] text-[#f0f0f0] md:text-6xl"
                initial={{ opacity: 0, scale: 1.2 }}
                animate={
                  phase === "reveal" || phase === "done"
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 1.2 }
                }
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  ease: [0.455, 0.03, 0.515, 0.955],
                }}
              >
                ÄGAPĒ
              </motion.h1>

              {/* Subtitle with clip-path reveal */}
              <motion.p
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888888]"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={
                  phase === "reveal" || phase === "done"
                    ? { clipPath: "inset(0 0% 0 0)" }
                    : { clipPath: "inset(0 100% 0 0)" }
                }
                transition={{
                  duration: 0.6,
                  delay: 0.6,
                  ease: [0.455, 0.03, 0.515, 0.955],
                }}
              >
                Electronic Music — NYC Underground
              </motion.p>

              {/* Loading bar */}
              <motion.div
                className="mt-6 h-[1px] w-32 overflow-hidden bg-[#363636]/50"
              >
                <motion.div
                  className="h-full bg-[#a1f081]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 3.5,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </div>

            {/* Scan line effect */}
            <motion.div
              className="pointer-events-none absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div
                className="absolute left-0 right-0 h-[2px] bg-[#f0f0f0]"
                initial={{ top: "-2px" }}
                animate={{ top: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content — always visible in DOM; loading overlay covers it */}
      {children}
    </>
  );
}
