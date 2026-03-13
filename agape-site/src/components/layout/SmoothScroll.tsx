"use client";

import { useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";
import { useMediaQuery } from "@/lib/useMediaQuery";

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    if (isMobile) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.7,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isMobile]);

  return <>{children}</>;
}
