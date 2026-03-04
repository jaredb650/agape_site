"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { asset } from "@/lib/asset";

const photos = [
  { src: asset("/images/DSC05585.jpeg"), alt: "Agape event moment", yRange: [-30, 30] as const },
  { src: asset("/images/DSC05632.jpeg"), alt: "Agape underground scene", yRange: [-30, 30] as const },
  { src: asset("/images/AGAPE_F5.jpeg"), alt: "Agape crowd energy", yRange: [-30, 30] as const },
];

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

/* ── Idle character-scramble glitch ── */
function GlitchLetters({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const glitch = () => {
      // Pick 1-3 random positions to scramble
      const count = 1 + Math.floor(Math.random() * 3);
      const indices = new Set<number>();
      while (indices.size < count) {
        indices.add(Math.floor(Math.random() * text.length));
      }

      // Rapid scramble: 4-6 frames of random chars then resolve
      let frame = 0;
      const totalFrames = 4 + Math.floor(Math.random() * 3);
      const scrambleInterval = setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
          clearInterval(scrambleInterval);
          setDisplay(text);
          return;
        }
        setDisplay(
          text
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

    const interval = setInterval(glitch, 1000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [text]);

  return <>{display}</>;
}

export default function PhotoBreakSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y0 = useTransform(scrollYProgress, [0, 1], [photos[0].yRange[0], photos[0].yRange[1]]);
  const y1 = useTransform(scrollYProgress, [0, 1], [photos[1].yRange[0], photos[1].yRange[1]]);
  const y2 = useTransform(scrollYProgress, [0, 1], [photos[2].yRange[0], photos[2].yRange[1]]);
  const yValues = [y0, y1, y2];

  return (
    <section
      ref={sectionRef}
      className="relative w-screen overflow-hidden border-t border-b border-dashed"
      style={{ borderColor: "#363636", marginLeft: "calc(-50vw + 50%)" }}
    >
      {/* Stroke text overlay — inverts colors of images behind it + idle glitch */}
      <div
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        style={{ mixBlendMode: "difference" }}
        aria-hidden="true"
      >
        <span
          className="select-none whitespace-nowrap font-display uppercase tracking-widest"
          style={{
            fontSize: "clamp(3rem, 12vw, 12rem)",
            WebkitTextStroke: "2px rgba(255,255,255,0.9)",
            color: "transparent",
            lineHeight: 1,
          }}
        >
          <GlitchLetters text="UNDERGROUND" />
        </span>
      </div>

      {/* Desktop: 3-column strip / Mobile: stacked — all same height */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1.3fr_1fr] md:gap-0">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.src}
            style={{ y: yValues[i] }}
            className="group relative h-[40vh] overflow-hidden md:h-[65vh]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-[filter] duration-500 group-hover:brightness-110"
            />
            {/* Dark bottom-heavy gradient overlay */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.7) 100%)",
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
