"use client";

import { useState } from "react";
import CornerBrackets from "@/components/effects/CornerBrackets";
import GlitchText from "@/components/effects/GlitchText";
import ScrollReveal, { StaggerContainer } from "@/components/effects/ScrollReveal";

/* Recorded sets — handpicked. id = YouTube video id. */
const VIDEOS = [
  { id: "UReaV6W7AhA", title: "Clara Cuvé", venue: "99 Scott — Brooklyn" },
  { id: "oAfvbf5d2O0", title: "David Löhlein", venue: "Chinatown — NYC" },
];

/* ── Single video — custom facade that swaps to the real player on click ── */
function VideoFrame({ video }: { video: (typeof VIDEOS)[number] }) {
  const [playing, setPlaying] = useState(false);

  return (
    <CornerBrackets size={22} strokeWidth={1} color="#363636">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={`${video.title} — live set`}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${video.title} set at ${video.venue}`}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* Thumbnail — maxres with hq fallback (static export, unoptimized images) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.src.endsWith("hqdefault.jpg")) {
                  img.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
                }
              }}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ filter: "brightness(0.5)" }}
            />

            {/* Darkening gradient for legibility */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.35) 100%)",
              }}
            />

            {/* Scan-line overlay — HUD texture to match residents/gallery */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
                mixBlendMode: "multiply",
              }}
            />

            {/* Custom play affordance — red ring + glow, in site style */}
            <span
              className="absolute left-1/2 top-1/2 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#ff2a2a]/70 bg-[#8b0000]/30 backdrop-blur-[2px] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#a00000]/55"
              style={{ boxShadow: "0 0 18px rgba(200,0,0,0.35)" }}
            >
              <svg
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
                className="ml-[3px]"
                aria-hidden="true"
              >
                <path d="M0 0 L20 11 L0 22 Z" fill="#fafafa" />
              </svg>
            </span>

            {/* Caption */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
              <div className="text-left">
                <h3 className="font-display text-lg font-bold uppercase tracking-[0.05em] text-[#fafafa] md:text-xl">
                  <GlitchText text={video.title} wrap />
                </h3>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                  {video.venue}
                </span>
              </div>
              <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]/80">
                ▶ Watch
              </span>
            </div>
          </button>
        )}
      </div>
    </CornerBrackets>
  );
}

export default function VideosSection() {
  return (
    <section
      id="videos"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingTop: "6rem",
        paddingBottom: "8rem",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        {/* Section header — matches Events/Residents pattern */}
        <StaggerContainer className="mb-12 md:mb-16">
          <ScrollReveal>
            <div className="mb-4 flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]/70">
                04
              </span>
              <div className="h-[1px] w-12 bg-[#363636]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                Watch
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1} distance={25}>
            <h2
              className="chrome-text font-bold uppercase text-[#fafafa]"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                letterSpacing: "0.03em",
              }}
            >
              <GlitchText text="Live Sets" />
            </h2>
          </ScrollReveal>
        </StaggerContainer>

        {/* Video grid */}
        <ScrollReveal delay={0.15}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {VIDEOS.map((video) => (
              <VideoFrame key={video.id} video={video} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
