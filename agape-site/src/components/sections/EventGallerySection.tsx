"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { asset } from "@/lib/asset";
import { useMediaQuery } from "@/lib/useMediaQuery";
import GlitchText from "@/components/effects/GlitchText";

/* ─── Image data with layout hints ─── */
const GALLERY_IMAGES = [
  { src: "gallery-30.jpg", alt: "DJs behind the decks with massive crowd", span: "hero" as const },
  { src: "gallery-33.jpg", alt: "Blue and purple stage lighting rig", span: "wide" as const },
  { src: "gallery-35.jpg", alt: "Crowd dancing under green light", span: "tall" as const },
  { src: "gallery-28.jpg", alt: "Masked dancer in red jacket", span: "normal" as const },
  { src: "gallery-42.jpg", alt: "Silhouette with yellow light beams", span: "tall" as const },
  { src: "gallery-41.jpg", alt: "DJ working the decks", span: "wide" as const },
  { src: "gallery-36.jpg", alt: "DJ at Pioneer decks", span: "tall" as const },
  { src: "gallery-46.jpg", alt: "Silhouettes against stage lights", span: "normal" as const },
  { src: "gallery-25.jpg", alt: "DJ booth b2b session", span: "wide" as const },
  { src: "gallery-37.jpg", alt: "Blue-lit crowd silhouette", span: "normal" as const },
  { src: "gallery-38.jpg", alt: "Dancer under warm spotlight", span: "tall" as const },
  { src: "gallery-43.jpg", alt: "Dense crowd from above", span: "wide" as const },
  { src: "gallery-29.jpg", alt: "DJ booth low angle", span: "normal" as const },
];

const EASE_EXPO: [number, number, number, number] = [0.455, 0.03, 0.515, 0.955];

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

/* ── Idle character-scramble for the parallax text ── */
function GlitchLetters({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    let scrambleId: ReturnType<typeof setInterval> | null = null;

    const glitch = () => {
      const count = 1 + Math.floor(Math.random() * 3);
      const indices = new Set<number>();
      while (indices.size < count) indices.add(Math.floor(Math.random() * text.length));

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
          text.split("").map((ch, i) =>
            indices.has(i) ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : ch
          ).join("")
        );
      }, 60);
    };

    const interval = setInterval(glitch, 1500 + Math.random() * 3000);
    return () => {
      clearInterval(interval);
      if (scrambleId) clearInterval(scrambleId);
    };
  }, [text]);

  return <>{display}</>;
}

/* ── Single gallery image with reveal animation + hover effects ── */
function GalleryImage({
  src,
  alt,
  span,
  index,
}: {
  src: string;
  alt: string;
  span: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isHovered, setIsHovered] = useState(false);

  /* Stagger reveal delays based on position */
  const delay = (index % 4) * 0.12;

  const heightClass =
    span === "hero"
      ? "h-[50vh] md:h-[65vh]"
      : span === "tall"
        ? "h-[45vh] md:h-[55vh]"
        : span === "wide"
          ? "h-[30vh] md:h-[38vh]"
          : "h-[30vh] md:h-[35vh]";

  const content = (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden cursor-crosshair ${heightClass}`}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.97 }
      }
      transition={{
        duration: 0.7,
        delay,
        ease: EASE_EXPO,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with zoom on hover */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: isHovered ? 1.08 : 1,
          filter: isHovered ? "brightness(0.9) contrast(1.1)" : "brightness(0.7)",
        }}
        transition={{ duration: 0.6, ease: EASE_EXPO }}
      >
        <Image
          src={asset(`/images/gallery/${src}`)}
          alt={alt}
          fill
          sizes={span === "hero" ? "100vw" : span === "wide" ? "66vw" : "33vw"}
          className="object-cover"
        />
      </motion.div>

      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Bottom gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(5,5,5,0.8) 0%, rgba(5,5,5,0) 50%)",
        }}
      />

      {/* Hover: red accent line that slides in from left */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-[#c13243]"
        initial={{ width: "0%" }}
        animate={{ width: isHovered ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: EASE_EXPO }}
      />

      {/* Hover: index number reveal */}
      <motion.div
        className="absolute bottom-4 left-4 flex items-center gap-3"
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
        transition={{ duration: 0.3, ease: EASE_EXPO }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c13243]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="h-[1px] w-6 bg-[#c13243]/50" />
      </motion.div>

      {/* Hover: glitch flash effect — brief white overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{
          opacity: [0, 0.08, 0, 0.04, 0],
          transition: { duration: 0.3, times: [0, 0.1, 0.2, 0.25, 0.4] },
        }}
      />
    </motion.div>
  );

  return content;
}

/* ─── MAIN SECTION ─── */
export default function EventGallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");

  /* Parallax for the floating text */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], ["15%", "-25%"]);
  const textY2 = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.75)",
        paddingTop: "6rem",
        paddingBottom: "8rem",
      }}
    >
      {/* ── Floating parallax text — "CAPTURED" ── */}
      {!isMobile && (
        <>
          <motion.div
            className="pointer-events-none absolute left-0 right-0 z-[1] select-none"
            style={{ y: textY, top: "18%" }}
            aria-hidden="true"
          >
            <span
              className="block whitespace-nowrap uppercase tracking-[0.08em]"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(6rem, 18vw, 22rem)",
                WebkitTextStroke: "1px rgba(255,255,255,0.06)",
                color: "transparent",
                lineHeight: 0.85,
              }}
            >
              <GlitchLetters text="CAPTURED" />
            </span>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute left-0 right-0 z-[1] select-none text-right"
            style={{ y: textY2, bottom: "15%" }}
            aria-hidden="true"
          >
            <span
              className="inline-block whitespace-nowrap uppercase tracking-[0.08em]"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(5rem, 14vw, 18rem)",
                WebkitTextStroke: "1px rgba(255,255,255,0.04)",
                color: "transparent",
                lineHeight: 0.85,
              }}
            >
              <GlitchLetters text="MOMENTS" />
            </span>
          </motion.div>
        </>
      )}

      {/* ── Section header ── */}
      <div
        ref={headerRef}
        className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16"
      >
        <motion.div
          className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_EXPO }}
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                05
              </span>
              <div className="h-[1px] w-12 bg-[#363636]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                Gallery
              </span>
            </div>
            <h2
              className="font-bold uppercase text-[#fafafa]"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                letterSpacing: "0.03em",
              }}
            >
              <GlitchText text="Captured Moments" />
            </h2>
          </div>
          <motion.p
            className="max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.1em] text-[#666666]"
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_EXPO }}
          >
            Scenes from the dancefloor — Brooklyn, NYC
          </motion.p>
        </motion.div>
      </div>

      {/* ── Gallery grid — editorial bento layout ── */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 lg:px-16">
        {isMobile ? (
          /* ─ Mobile: stacked with alternating sizes ─ */
          <div className="flex flex-col gap-3">
            {GALLERY_IMAGES.map((img, i) => (
              <GalleryImage
                key={img.src}
                src={img.src}
                alt={img.alt}
                span={i === 0 ? "hero" : "normal"}
                index={i}
              />
            ))}
          </div>
        ) : (
          /* ─ Desktop: asymmetric bento grid ─ */
          <div className="flex flex-col gap-3">
            {/* Row 1: Hero shot — full width cinematic */}
            <GalleryImage
              src={GALLERY_IMAGES[0].src}
              alt={GALLERY_IMAGES[0].alt}
              span="hero"
              index={0}

            />

            {/* Row 2: Three columns — wide + tall + normal */}
            <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] gap-3">
              <GalleryImage {...GALLERY_IMAGES[1]} index={1} />
              <GalleryImage {...GALLERY_IMAGES[2]} index={2} />
              <GalleryImage {...GALLERY_IMAGES[3]} index={3} />
            </div>

            {/* Row 3: Two columns — tall portrait + wide landscape stacked */}
            <div className="grid grid-cols-[0.7fr_1.3fr] gap-3">
              <GalleryImage {...GALLERY_IMAGES[4]} index={4} />
              <div className="flex flex-col gap-3">
                <GalleryImage {...GALLERY_IMAGES[5]} index={5} />
                <GalleryImage {...GALLERY_IMAGES[6]} index={6} />
              </div>
            </div>

            {/* Row 4: Three columns — equal weight */}
            <div className="grid grid-cols-3 gap-3">
              <GalleryImage {...GALLERY_IMAGES[7]} index={7} />
              <GalleryImage {...GALLERY_IMAGES[8]} index={8} />
              <GalleryImage {...GALLERY_IMAGES[9]} index={9} />
            </div>

            {/* Row 5: Two columns — wide + tall */}
            <div className="grid grid-cols-[1.3fr_0.7fr] gap-3">
              <div className="flex flex-col gap-3">
                <GalleryImage {...GALLERY_IMAGES[11]} index={11} />
                <GalleryImage {...GALLERY_IMAGES[12]} index={12} />
              </div>
              <GalleryImage {...GALLERY_IMAGES[10]} index={10} />
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom decoration — counter + line ── */}
      <motion.div
        className="relative z-10 mx-auto mt-16 flex max-w-[1400px] items-center gap-4 px-6 md:px-10 lg:px-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555555]">
          {String(GALLERY_IMAGES.length).padStart(2, "0")} Frames
        </span>
        <div className="h-[1px] flex-1 bg-[#363636]/40" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555555]">
          Brooklyn, NY
        </span>
      </motion.div>
    </section>
  );
}
