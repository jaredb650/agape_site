"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CornerBrackets from "@/components/effects/CornerBrackets";
import GlitchText from "@/components/effects/GlitchText";
import ScrollReveal, { StaggerContainer } from "@/components/effects/ScrollReveal";
import { asset } from "@/lib/asset";

/* ──────────────────────────────────────────────────────────────────────────
   EDITORIAL CONTACT SHEET — media as curated content.
   8 vertical 9:16 BTS clips arranged in an asymmetric, type-driven grid.
   Poster .jpg by default → muted <video> fades in on hover (desktop).
   Click → inline lightbox with the vertical video + corner brackets.
   ────────────────────────────────────────────────────────────────────────── */

const EASE_EXPO: [number, number, number, number] = [0.455, 0.03, 0.515, 0.955];

type Tile = {
  /** base file name without extension, e.g. "bts-5" */
  slug: string;
  /** evocative caption line */
  caption: string;
  /** short locale / sub-label */
  note: string;
  /** layout weight — "tall" tiles span two rows for editorial rhythm */
  span: "tall" | "normal";
};

/* Order is intentional — composed for an asymmetric magazine column flow. */
const TILES: Tile[] = [
  { slug: "bts-10", caption: "Big windows, bigger room", note: "The venue", span: "tall" },
  { slug: "bts-5", caption: "Hands up, barricade", note: "Front row", span: "normal" },
  { slug: "bts-1", caption: "First red glow", note: "Doors open", span: "normal" },
  { slug: "bts-13", caption: "Under the mirrorball", note: "Peak hour", span: "tall" },
  { slug: "bts-7", caption: "Lost in the loop", note: "Dancefloor", span: "normal" },
  { slug: "bts-12", caption: "Mid-motion, no brakes", note: "Pure energy", span: "normal" },
  { slug: "bts-9", caption: "Blue hour silhouettes", note: "Comedown", span: "tall" },
  { slug: "bts-15", caption: "Between sets", note: "Off the floor", span: "normal" },
];

/* ── A single editorial tile ─────────────────────────────────────────────── */
function ContactTile({
  tile,
  index,
  onOpen,
}: {
  tile: Tile;
  index: number;
  onOpen: (index: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleEnter = useCallback(() => {
    setHovered(true);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(false);
    const v = videoRef.current;
    if (v) v.pause();
  }, []);

  const label = String(index + 1).padStart(2, "0");
  const rowSpanClass = tile.span === "tall" ? "md:row-span-2" : "md:row-span-1";

  return (
    <ScrollReveal
      delay={(index % 4) * 0.06}
      distance={28}
      className={`${rowSpanClass} self-start`}
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        aria-label={`Open clip ${label} — ${tile.caption}`}
        className="group relative block w-full cursor-pointer overflow-hidden bg-black text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ff2a2a]"
      >
        {/* Media frame — vertical 9:16 */}
        <div className="relative aspect-[9/16] w-full overflow-hidden">
          {/* Poster (default) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(`/media/${tile.slug}.jpg`)}
            alt={tile.caption}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.04]"
            style={{ filter: "grayscale(0.35) brightness(0.72) contrast(1.05)" }}
          />

          {/* Video — fades in on hover (desktop) */}
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster={asset(`/media/${tile.slug}.jpg`)}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            style={{ filter: "grayscale(0.1) brightness(0.85) contrast(1.05)" }}
          >
            <source src={asset(`/media/${tile.slug}.mp4`)} type="video/mp4" />
          </video>

          {/* Scanline texture — matches site HUD idiom */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
              mixBlendMode: "multiply",
            }}
          />

          {/* Legibility gradient — bottom + top */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.05) 42%, rgba(0,0,0,0.45) 100%)",
            }}
          />

          {/* Big editorial index numeral — top left */}
          <span
            className="pointer-events-none absolute left-3 top-3 select-none font-mono text-[11px] uppercase tracking-[0.2em] text-[#fafafa]/90"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
          >
            {label}
            <span className="text-[#ff2a2a]/80"> / 08</span>
          </span>

          {/* Expand affordance — top right, appears on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]/0 transition-colors duration-300 group-hover:text-[#ff2a2a]/90"
          >
            ⤢ View
          </span>

          {/* Red hairline that draws in on hover (left → right) */}
          <span className="pointer-events-none absolute bottom-0 left-0 z-10 block h-[2px] w-0 bg-[#ff2a2a] transition-[width] duration-500 ease-out group-hover:w-full" />

          {/* Caption block — bottom */}
          <div className="absolute inset-x-0 bottom-0 z-[5] p-4 md:p-5">
            <div className="mb-2 h-[1px] w-full bg-[#363636]" />
            <h3 className="font-display text-[13px] font-bold uppercase leading-tight tracking-[0.04em] text-[#fafafa] md:text-sm">
              <GlitchText text={tile.caption} wrap />
            </h3>
            <span className="mt-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-[#888888]">
              {tile.note}
            </span>
          </div>
        </div>
      </button>
    </ScrollReveal>
  );
}

/* ── Lightbox overlay ────────────────────────────────────────────────────── */
function Lightbox({
  tile,
  index,
  total,
  onClose,
}: {
  tile: Tile;
  index: number;
  total: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const label = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE_EXPO }}
      role="dialog"
      aria-modal="true"
      aria-label={`Clip ${label} — ${tile.caption}`}
    >
      {/* Backdrop — click to close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close clip"
        className="absolute inset-0 h-full w-full cursor-default bg-black/85 backdrop-blur-[3px]"
      />

      {/* Close button — top right of viewport */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close clip"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-[#363636] bg-black/60 text-[#fafafa] transition-colors duration-200 hover:border-[#ff2a2a] hover:text-[#ff2a2a] md:right-6 md:top-6"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M1 1 L15 15 M15 1 L1 15" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      </button>

      {/* Vertical player */}
      <motion.div
        className="relative z-[5] w-full max-w-[min(92vw,460px)]"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.35, ease: EASE_EXPO }}
      >
        <CornerBrackets size={26} strokeWidth={1} color="#ff2a2a" animate={false}>
          <div className="relative aspect-[9/16] max-h-[82vh] w-full overflow-hidden bg-black">
            <video
              key={tile.slug}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              poster={asset(`/media/${tile.slug}.jpg`)}
              className="h-full w-full object-contain"
            >
              <source src={asset(`/media/${tile.slug}.mp4`)} type="video/mp4" />
            </video>

            {/* Scanline overlay for texture */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
                mixBlendMode: "multiply",
              }}
            />
          </div>
        </CornerBrackets>

        {/* Caption rail beneath player */}
        <div className="mt-4 flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]/80">
            {label} / {String(total).padStart(2, "0")}
          </span>
          <div className="h-[1px] flex-1 bg-[#363636]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
            {tile.note}
          </span>
        </div>
        <h3
          className="mt-2 font-display text-sm font-bold uppercase tracking-[0.04em] text-[#fafafa]"
        >
          {tile.caption}
        </h3>
      </motion.div>
    </motion.div>
  );
}

/* ── MAIN SECTION ────────────────────────────────────────────────────────── */
export default function MediaContactSheet() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleOpen = useCallback((i: number) => setOpenIndex(i), []);
  const handleClose = useCallback(() => setOpenIndex(null), []);

  return (
    <section
      id="media"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingTop: "6rem",
        paddingBottom: "8rem",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        {/* ── Section header ── */}
        <StaggerContainer className="mb-12 md:mb-16">
          <ScrollReveal>
            <div className="mb-4 flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]/70">
                06
              </span>
              <div className="h-[1px] w-12 bg-[#363636]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                Contact Sheet
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1} distance={25}>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2
                className="chrome-text font-bold uppercase text-[#fafafa]"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  letterSpacing: "0.03em",
                }}
              >
                <GlitchText text="On Film" />
              </h2>
              <p className="max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.1em] text-[#666666]">
                Eight frames, one night — hover to roll, click to expand
              </p>
            </div>
          </ScrollReveal>
        </StaggerContainer>

        {/* ── Editorial asymmetric grid ──
            Mobile: single column. md+: 3 columns w/ dense flow so the
            "tall" (row-span-2) tiles interlock for a contact-sheet rhythm. */}
        <StaggerContainer
          stagger={0.06}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[minmax(0,_1fr)] md:grid-flow-row-dense md:grid-cols-3 md:gap-5"
        >
          {TILES.map((tile, i) => (
            <ContactTile key={tile.slug} tile={tile} index={i} onOpen={handleOpen} />
          ))}
        </StaggerContainer>

        {/* ── Bottom rail — counter + locale ── */}
        <motion.div
          className="mt-16 flex items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555555]">
            {String(TILES.length).padStart(2, "0")} Clips
          </span>
          <div className="h-[1px] flex-1 bg-[#363636]/40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555555]">
            Field Notes — Brooklyn, NY
          </span>
        </motion.div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox
            tile={TILES[openIndex]}
            index={openIndex}
            total={TILES.length}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
