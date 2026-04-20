"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { asset } from "@/lib/asset";

const photos = [
  { src: asset("/images/underground/strip-1.jpg"), alt: "Crowd at the barrier", yRange: [-30, 30] as const },
  { src: asset("/images/underground/strip-2.jpg"), alt: "Underground fashion and lights", yRange: [-30, 30] as const },
  { src: asset("/images/rave-shots/dj-red-light.jpg"), alt: "DJ under red and green lights", yRange: [-30, 30] as const },
];

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

/* ── Idle character-scramble glitch ── */
function GlitchLetters({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    // Skip on mobile
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    let scrambleId: ReturnType<typeof setInterval> | null = null;

    const glitch = () => {
      const count = 1 + Math.floor(Math.random() * 3);
      const indices = new Set<number>();
      while (indices.size < count) {
        indices.add(Math.floor(Math.random() * text.length));
      }

      let frame = 0;
      const totalFrames = 4 + Math.floor(Math.random() * 3);
      if (scrambleId) clearInterval(scrambleId);
      scrambleId = setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
          if (scrambleId) clearInterval(scrambleId);
          scrambleId = null;
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
    return () => {
      clearInterval(interval);
      if (scrambleId) clearInterval(scrambleId);
    };
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
          className="select-none whitespace-nowrap uppercase tracking-[0.15em]"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(3rem, 12vw, 12rem)",
            WebkitTextStroke: "1px rgba(255,255,255,0.7)",
            color: "transparent",
            lineHeight: 1,
          }}
        >
          <GlitchLetters text="DANCEFLOOR" />
        </span>
      </div>

      {/* Always 3-column strip — thin banner style */}
      <div className="grid grid-cols-[1fr_1.3fr_1fr] gap-0">
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            className="group relative h-[25vh] overflow-hidden md:h-[35vh]"
          >
            {/* Parallax on the image itself, scaled up to cover shift */}
            <motion.div
              className="absolute inset-[-30px] z-0"
              style={{ y: yValues[i] }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="34vw"
                className="object-cover transition-[filter] duration-500 group-hover:brightness-110"
              />
            </motion.div>
            {/* Dark bottom-heavy gradient overlay */}
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.7) 100%)",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
