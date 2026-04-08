"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import GlitchText from "@/components/effects/GlitchText";
import FlickerButton from "@/components/effects/FlickerButton";
import ScrollReveal from "@/components/effects/ScrollReveal";
import { asset } from "@/lib/asset";
import LazyVideo from "@/components/effects/LazyVideo";

export default function FestivalBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.05]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: "clamp(280px, 35vh, 420px)" }}
    >
      {/* Looping video background */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <LazyVideo
          src={asset("/videos/festival-flyer.mp4")}
          className="h-full w-full"
          style={{ filter: "brightness(0.4)" }}
        />
      </motion.div>

      {/* Dark overlays for legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0.85) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,1) 0%, transparent 15%, transparent 85%, rgba(10,10,10,1) 100%)",
        }}
      />

      {/* Top & bottom border lines */}
      <div className="absolute inset-x-0 top-0 h-[1px] border-t border-dashed border-[#363636]" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] border-b border-dashed border-[#363636]" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-6">
        <ScrollReveal>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888888]">
            Standout Event
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1} distance={20}>
          <h2
            className="text-center font-bold uppercase text-[#fafafa]"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            <GlitchText text="Agape Festival" />
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="max-w-md text-center font-body text-sm tracking-[0.04em] text-[#888888]">
            Our flagship outdoor experience — one stage, one tribe, one night.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3} distance={10}>
          <FlickerButton href="https://agape-festival.com/" variant="outline">
            Get Tickets
          </FlickerButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
