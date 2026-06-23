"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CornerBrackets from "@/components/effects/CornerBrackets";
import GlitchText from "@/components/effects/GlitchText";
import ScrollReveal, { StaggerContainer } from "@/components/effects/ScrollReveal";
import { asset } from "@/lib/asset";

/* ── Archive data — every clip is a "file" in the system ──────────────── */
type Tag = "CROWD" | "ROOM" | "FACES";

interface ArchiveFile {
  /** base filename (no extension) — used for /media/<file>.mp4 + .jpg */
  file: string;
  tag: Tag;
  /** displayed timecode label */
  timecode: string;
}

const FILES: ArchiveFile[] = [
  { file: "promo", tag: "ROOM", timecode: "00:24" },
  { file: "bts-1", tag: "ROOM", timecode: "00:09" },
  { file: "bts-5", tag: "CROWD", timecode: "00:06" },
  { file: "bts-7", tag: "CROWD", timecode: "00:05" },
  { file: "bts-9", tag: "ROOM", timecode: "00:07" },
  { file: "bts-10", tag: "CROWD", timecode: "00:08" },
  { file: "bts-12", tag: "CROWD", timecode: "00:04" },
  { file: "bts-13", tag: "CROWD", timecode: "00:05" },
  { file: "bts-15", tag: "FACES", timecode: "00:06" },
];

const FILTERS = ["ALL", "CROWD", "ROOM", "FACES"] as const;
type Filter = (typeof FILTERS)[number];

const EASE_EXPO: [number, number, number, number] = [
  0.455, 0.03, 0.515, 0.955,
];

/* Scanline overlay — mirrors the site's HUD texture */
const SCANLINES =
  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 3px)";

/* Red-duotone: kill color (grayscale) then push it warm-red via sepia+hue+saturate */
const DUOTONE_FILTER =
  "grayscale(1) brightness(0.85) sepia(0.55) hue-rotate(-32deg) saturate(3.2) contrast(1.05)";

/* zero-pad an index → REC_001 */
function recId(i: number) {
  return `REC_${String(i + 1).padStart(3, "0")}`;
}

/* ── Corner ticks — small HUD crop marks at each corner of a tile ─────── */
function CornerTicks({ color = "#ff2a2a" }: { color?: string }) {
  const base =
    "pointer-events-none absolute h-2.5 w-2.5 border-[#ff2a2a]/70";
  return (
    <>
      <span className={`${base} left-1.5 top-1.5 border-l border-t`} style={{ borderColor: color }} />
      <span className={`${base} right-1.5 top-1.5 border-r border-t`} style={{ borderColor: color }} />
      <span className={`${base} bottom-1.5 left-1.5 border-b border-l`} style={{ borderColor: color }} />
      <span className={`${base} bottom-1.5 right-1.5 border-b border-r`} style={{ borderColor: color }} />
    </>
  );
}

/* ── Blinking REC dot ─────────────────────────────────────────────────── */
function RecDot({ size = 6 }: { size?: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className="inline-block rounded-full bg-[#ff2a2a]"
      style={{ width: size, height: size, boxShadow: "0 0 6px rgba(255,42,42,0.9)" }}
      animate={{ opacity: [1, 1, 0.15, 1] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── Single archive tile (thumbnail) ─────────────────────────────────── */
function ArchiveTile({
  item,
  index,
  onOpen,
}: {
  item: ArchiveFile;
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: EASE_EXPO }}
      onClick={onOpen}
      aria-label={`Open archive file ${recId(index)} — ${item.file}, tag ${item.tag}`}
      className="group relative block w-full cursor-pointer overflow-hidden bg-black text-left outline-none"
    >
      <CornerBrackets size={16} strokeWidth={1} color="#363636" animate={false}>
        <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
          {/* Duotone poster */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(`/media/${item.file}.jpg`)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
            style={{ filter: DUOTONE_FILTER }}
          />

          {/* Red wash — multiply to deepen shadows toward blood-red */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 group-hover:opacity-80"
            style={{
              background:
                "linear-gradient(180deg, rgba(139,0,0,0.25) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.85) 100%)",
              mixBlendMode: "multiply",
            }}
          />

          {/* Scanline HUD texture */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: SCANLINES, mixBlendMode: "multiply" }}
          />

          {/* Bright-red hover tint */}
          <div className="pointer-events-none absolute inset-0 bg-[#ff2a2a]/0 transition-colors duration-300 group-hover:bg-[#8b0000]/20" />

          <CornerTicks />

          {/* Top metadata row: index + timecode */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-2.5">
            <span className="bg-black/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#fafafa]/90">
              {recId(index)}
            </span>
            <span className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#ff2a2a]">
              <RecDot size={4} />
              {item.timecode}
            </span>
          </div>

          {/* Bottom row: tag chip + open affordance */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-2.5">
            <span className="border border-[#8b0000] bg-[#8b0000]/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#fafafa]">
              {item.tag}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#fafafa]/0 transition-colors duration-300 group-hover:text-[#fafafa]/90">
              ▸ Open
            </span>
          </div>
        </div>
      </CornerBrackets>
    </motion.button>
  );
}

/* ── HUD modal — full-screen file viewer ─────────────────────────────── */
function ArchiveModal({
  item,
  index,
  onClose,
}: {
  item: ArchiveFile;
  index: number;
  onClose: () => void;
}) {
  // Escape to close + lock body scroll while open
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Archive viewer — ${item.file}`}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm md:p-8"
    >
      {/* Backdrop scanlines */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: SCANLINES, opacity: 0.5 }}
        aria-hidden="true"
      />

      {/* Close button — top right */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close archive viewer"
        className="absolute right-4 top-4 z-[130] flex h-10 w-10 items-center justify-center border border-[#363636] bg-black/70 font-mono text-[#fafafa] transition-colors duration-200 hover:border-[#ff2a2a] hover:bg-[#8b0000]/40 md:right-8 md:top-8"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M1 1 L15 15 M15 1 L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>

      {/* Stop propagation so clicking the viewer itself doesn't close it */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE_EXPO }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-[125] flex w-full max-w-[420px] flex-col gap-3"
      >
        {/* Top HUD chrome */}
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2 text-[#ff2a2a]">
            <RecDot /> REC
          </span>
          <span className="text-[#888888]">{recId(index)}</span>
        </div>

        {/* Vertical 9:16 video frame with brackets */}
        <CornerBrackets size={26} strokeWidth={1} color="#8b0000" animate={false}>
          <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              poster={asset(`/media/${item.file}.jpg`)}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
            >
              <source src={asset(`/media/${item.file}.mp4`)} type="video/mp4" />
            </video>

            {/* Scanline overlay on the video */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: SCANLINES, mixBlendMode: "multiply" }}
              aria-hidden="true"
            />

            <CornerTicks />

            {/* In-frame top label */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3">
              <span className="bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[#fafafa]/90">
                {item.file}.mp4
              </span>
              <span className="bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[#ff2a2a]">
                {item.timecode}
              </span>
            </div>
          </div>
        </CornerBrackets>

        {/* Bottom HUD chrome — filename + tag */}
        <div className="flex items-center justify-between gap-3 border border-[#363636] bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em]">
          <span className="truncate text-[#fafafa]">
            FILE://{item.file}.mp4
          </span>
          <span className="whitespace-nowrap border border-[#8b0000] bg-[#8b0000]/40 px-2 py-0.5 text-[#fafafa]">
            {item.tag}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────── */
export default function MediaArchive() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Keep stable global indices so REC_00x reads as a consistent file id
  const indexed = useMemo(
    () => FILES.map((item, index) => ({ item, index })),
    []
  );

  const visible = useMemo(
    () =>
      filter === "ALL"
        ? indexed
        : indexed.filter(({ item }) => item.tag === filter),
    [filter, indexed]
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const openItem = openIndex !== null ? FILES[openIndex] : null;

  return (
    <section
      id="archive"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingTop: "6rem",
        paddingBottom: "8rem",
      }}
    >
      {/* Faint section-wide scanlines for the terminal feel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: SCANLINES, opacity: 0.25 }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        {/* Section header */}
        <StaggerContainer className="mb-10 md:mb-14">
          <ScrollReveal>
            <div className="mb-4 flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]/70">
                05
              </span>
              <div className="h-[1px] w-12 bg-[#363636]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                Archive
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} distance={25}>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <h2
                className="chrome-text font-bold uppercase text-[#fafafa]"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  letterSpacing: "0.03em",
                }}
              >
                <GlitchText text="The Archive" />
              </h2>

              {/* REC + file count readout */}
              <div className="flex items-center gap-4 pb-1 font-mono text-[10px] uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2 text-[#ff2a2a]">
                  <RecDot /> REC
                </span>
                <span className="text-[#888888]">
                  [ {String(FILES.length).padStart(2, "0")} FILES ]
                </span>
              </div>
            </div>
          </ScrollReveal>
        </StaggerContainer>

        {/* Filter chips */}
        <ScrollReveal delay={0.15}>
          <div
            className="mb-8 flex flex-wrap items-center gap-2 md:mb-10"
            role="group"
            aria-label="Filter archive by category"
          >
            {FILTERS.map((f) => {
              const active = filter === f;
              const count =
                f === "ALL"
                  ? FILES.length
                  : FILES.filter((x) => x.tag === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  aria-label={`Show ${f} files (${count})`}
                  className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 ${
                    active
                      ? "border-[#8b0000] bg-[#8b0000] text-[#fafafa]"
                      : "border-[#363636] bg-transparent text-[#888888] hover:border-[#a00000] hover:text-[#fafafa]"
                  }`}
                >
                  {f}
                  <span className={active ? "text-[#fafafa]/70" : "text-[#888888]/60"}>
                    {" "}
                    {String(count).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Media wall — filterable grid with layout animation */}
        <motion.div
          layout
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visible.map(({ item, index }) => (
              <ArchiveTile
                key={item.file}
                item={item}
                index={index}
                onOpen={() => setOpenIndex(index)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* HUD modal */}
      <AnimatePresence>
        {openItem && openIndex !== null && (
          <ArchiveModal item={openItem} index={openIndex} onClose={close} />
        )}
      </AnimatePresence>
    </section>
  );
}
