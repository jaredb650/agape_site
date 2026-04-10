"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/lib/useMediaQuery";

const EASE_EXPO: [number, number, number, number] = [0.455, 0.03, 0.515, 0.955];
const EASE_OUT_EXPO: [number, number, number, number] = [0.76, 0, 0.24, 1];

export function PageTransition({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<
    "borders" | "reveal" | "expand" | "done"
  >("borders");

  useEffect(() => {
    // Lock scroll during preloader
    document.body.style.overflow = "hidden";

    if (isMobile) {
      const t1 = setTimeout(() => setPhase("reveal"), 400);
      const t2 = setTimeout(() => setPhase("expand"), 1300);
      const t3 = setTimeout(() => {
        setPhase("done");
        setIsLoading(false);
        document.body.style.overflow = "";
      }, 1800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        document.body.style.overflow = "";
      };
    }

    const t1 = setTimeout(() => setPhase("reveal"), 900);
    const t2 = setTimeout(() => setPhase("expand"), 2200);
    const t3 = setTimeout(() => {
      setPhase("done");
      setIsLoading(false);
      document.body.style.overflow = "";
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = "";
    };
  }, [isMobile]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            {isMobile ? (
              /* ───── MOBILE ───── */
              <>
                {/* Solid black background — slides up to reveal page */}
                <motion.div
                  className="absolute inset-0 bg-[#050505] flex items-center justify-center"
                  animate={
                    phase === "expand"
                      ? { y: "-100%" }
                      : { y: "0%" }
                  }
                  transition={
                    phase === "expand"
                      ? { duration: 0.5, ease: EASE_OUT_EXPO }
                      : { duration: 0 }
                  }
                >
                  {/* Logo + loading bar */}
                  <motion.div
                    className="flex flex-col items-center gap-4"
                    animate={
                      phase === "expand"
                        ? { opacity: 0, y: -20 }
                        : { opacity: 1, y: 0 }
                    }
                    transition={{ duration: 0.25, ease: EASE_EXPO }}
                  >
                    <motion.h1
                      className="font-display text-4xl font-bold uppercase tracking-[0.2em] text-[#f0f0f0]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      ÄGAPĒ
                    </motion.h1>
                    <motion.div className="h-[1px] w-24 overflow-hidden bg-[#363636]/50">
                      <motion.div
                        className="h-full bg-[#c13243]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.0, ease: "linear" }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </>
            ) : (
              /* ───── DESKTOP ───── */
              <>
                {/*
                  Split-panel background: two solid halves that slide apart
                  during "expand" to reveal the page. During borders/reveal
                  they sit flush, covering the full viewport.
                */}
                <motion.div
                  className="absolute top-0 left-0 right-0 bg-[#050505]"
                  style={{ height: "50.5%" }}
                  animate={
                    phase === "expand"
                      ? { y: "-100%" }
                      : { y: "0%" }
                  }
                  transition={
                    phase === "expand"
                      ? { duration: 0.8, ease: EASE_OUT_EXPO }
                      : { duration: 0 }
                  }
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-[#050505]"
                  style={{ height: "50.5%" }}
                  animate={
                    phase === "expand"
                      ? { y: "100%" }
                      : { y: "0%" }
                  }
                  transition={
                    phase === "expand"
                      ? { duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.05 }
                      : { duration: 0 }
                  }
                />

                {/* Noise grain texture */}
                <motion.div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    backgroundSize: "128px 128px",
                    animation: "noise-animation 0.3s steps(3) infinite",
                  }}
                  animate={phase === "expand" ? { opacity: 0 } : { opacity: 0.04 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Outer border frame — draws in, flies outward on expand */}
                <motion.div
                  className="absolute"
                  initial={{ inset: 0 }}
                  animate={
                    phase === "expand"
                      ? { inset: "-5%", opacity: 0 }
                      : { inset: 0, opacity: 1 }
                  }
                  transition={
                    phase === "expand"
                      ? { duration: 0.5, ease: EASE_OUT_EXPO }
                      : { duration: 0.3 }
                  }
                >
                  {/* Top */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[1px] bg-[#363636]"
                    initial={{ scaleX: 0, transformOrigin: "left" }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: EASE_EXPO }}
                  />
                  {/* Bottom */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#363636]"
                    initial={{ scaleX: 0, transformOrigin: "right" }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: EASE_EXPO }}
                  />
                  {/* Left */}
                  <motion.div
                    className="absolute top-0 bottom-0 left-0 w-[1px] bg-[#363636]"
                    initial={{ scaleY: 0, transformOrigin: "top" }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1.2, delay: 0.4, ease: EASE_EXPO }}
                  />
                  {/* Right */}
                  <motion.div
                    className="absolute top-0 bottom-0 right-0 w-[1px] bg-[#363636]"
                    initial={{ scaleY: 0, transformOrigin: "bottom" }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: EASE_EXPO }}
                  />
                </motion.div>

                {/* Contracting inner frame — expands outward on "expand" */}
                <motion.div
                  className="absolute border border-[#363636]/30"
                  initial={{ inset: "50%" }}
                  animate={
                    phase === "borders"
                      ? { inset: "15%", opacity: 1 }
                      : phase === "reveal"
                        ? { inset: "5%", opacity: 1 }
                        : { inset: "-2%", opacity: 0 }
                  }
                  transition={{
                    duration: phase === "expand" ? 0.6 : 1.5,
                    ease: phase === "expand" ? EASE_OUT_EXPO : EASE_EXPO,
                  }}
                />

                {/* Corner brackets — fly outward on expand */}
                <motion.div
                  className="absolute"
                  initial={{ inset: "30%", opacity: 0 }}
                  animate={
                    phase === "borders"
                      ? { inset: "30%", opacity: 0 }
                      : phase === "reveal"
                        ? { inset: "20%", opacity: 1 }
                        : { inset: "10%", opacity: 0 }
                  }
                  transition={{
                    duration: phase === "expand" ? 0.4 : 0.8,
                    ease: EASE_EXPO,
                  }}
                >
                  <div className="absolute top-0 left-0 h-5 w-5 border-t border-l border-[#f0f0f0]" />
                  <div className="absolute top-0 right-0 h-5 w-5 border-t border-r border-[#f0f0f0]" />
                  <div className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-[#f0f0f0]" />
                  <div className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-[#f0f0f0]" />
                </motion.div>

                {/* Center content — logo, tagline, loading bar */}
                <div className="relative z-10 flex h-full w-full items-center justify-center">
                  <motion.div
                    className="flex flex-col items-center gap-4"
                    animate={
                      phase === "expand"
                        ? { opacity: 0, scale: 0.85, y: -30 }
                        : { opacity: 1, scale: 1, y: 0 }
                    }
                    transition={
                      phase === "expand"
                        ? { duration: 0.3, ease: EASE_EXPO }
                        : { duration: 0.3 }
                    }
                  >
                    <motion.h1
                      className="font-display text-4xl font-bold uppercase tracking-[0.2em] text-[#f0f0f0] md:text-6xl"
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={
                        phase !== "borders"
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 1.2 }
                      }
                      transition={{
                        duration: 0.8,
                        delay: phase === "reveal" ? 0.2 : 0,
                        ease: EASE_EXPO,
                      }}
                    >
                      ÄGAPĒ
                    </motion.h1>

                    <motion.p
                      className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888888]"
                      initial={{ clipPath: "inset(0 100% 0 0)" }}
                      animate={
                        phase !== "borders"
                          ? { clipPath: "inset(0 0% 0 0)" }
                          : { clipPath: "inset(0 100% 0 0)" }
                      }
                      transition={{
                        duration: 0.6,
                        delay: phase === "reveal" ? 0.6 : 0,
                        ease: EASE_EXPO,
                      }}
                    >
                      Electronic Music — NYC
                    </motion.p>

                    <motion.div className="mt-6 h-[1px] w-32 overflow-hidden bg-[#363636]/50">
                      <motion.div
                        className="h-full bg-[#c13243]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3.5, ease: "linear" }}
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Scan line effect */}
                <motion.div
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={phase === "expand" ? { opacity: 0 } : { opacity: 0.03 }}
                  transition={{ delay: phase === "expand" ? 0 : 0.5, duration: 0.3 }}
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </>
  );
}
