"use client";

import { motion } from "framer-motion";
import CornerBrackets from "@/components/effects/CornerBrackets";
import GlitchText from "@/components/effects/GlitchText";
import ScrollReveal, { StaggerContainer } from "@/components/effects/ScrollReveal";
import { asset } from "@/lib/asset";

/* ── Ambient BTS tiles below the centerpiece reel ── */
const TILES = [
  { src: "bts-5", location: "AT THE BARRICADE" },
  { src: "bts-10", location: "THE COMMUNITY" },
  { src: "bts-15", location: "MAKING FRIENDS" },
] as const;

/* ── A single muted, autoplaying vertical ambient tile ── */
function AmbientTile({
  src,
  location,
}: {
  src: string;
  location: string;
}) {
  return (
    <ScrollReveal mode="fade-slide" distance={32}>
      <CornerBrackets size={16} strokeWidth={1} color="#363636">
        <div className="group relative aspect-[9/16] w-full overflow-hidden bg-black">
          <video
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            aria-label={`Ambient crowd footage — ${location.toLowerCase()}`}
            poster={asset(`/media/${src}.jpg`)}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.04]"
            style={{ filter: "grayscale(1) brightness(0.6)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "grayscale(0) brightness(1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "grayscale(1) brightness(0.6)";
            }}
          >
            <source src={asset(`/media/${src}.mp4`)} type="video/mp4" />
          </video>

          {/* Bottom legibility gradient */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
            style={{
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* Location caption */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
            <span className="h-[1px] w-4 bg-[#8b0000]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#888888] transition-colors duration-500 group-hover:text-[#fafafa]">
              {location}
            </span>
          </div>
        </div>
      </CornerBrackets>
    </ScrollReveal>
  );
}

export default function CinematicMedia() {

  return (
    <section
      id="reel"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        paddingTop: "6rem",
        paddingBottom: "8rem",
      }}
    >
      {/* ── Ambient blurred backdrop — promo as a moody color wash ── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <video
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster={asset("/media/promo.jpg")}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter: "blur(48px) brightness(0.28) saturate(1.1)",
            transform: "scale(1.2)",
          }}
        >
          <source src={asset("/media/promo.mp4")} type="video/mp4" />
        </video>
        {/* Vignette + black floor to keep things cinematic and dark */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 35%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.92) 100%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        {/* Section header */}
        <ScrollReveal>
          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]/70">
              01
            </span>
            <div className="h-[1px] w-12 bg-[#363636]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
              THE REEL
            </span>
          </div>
          <h2
            className="chrome-text font-bold uppercase text-[#fafafa]"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              letterSpacing: "0.03em",
            }}
          >
            <GlitchText text="AGAPE / IN MOTION" />
          </h2>
        </ScrollReveal>

        {/* ── Centerpiece reel ── */}
        <ScrollReveal mode="fade-slide" distance={48} delay={0.1}>
          <div className="mt-12 flex flex-col items-center gap-10 lg:mt-16 lg:flex-row lg:items-center lg:justify-center lg:gap-14">
            {/* Vertical 9:16 promo frame */}
            <motion.div
              className="relative w-full max-w-[clamp(260px,44vw,440px)] cursor-pointer"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.5, ease: [0.455, 0.03, 0.515, 0.955] }}
            >
              <CornerBrackets size={28} strokeWidth={1} color="#8b0000">
                <div
                  className="relative aspect-[9/16] w-full overflow-hidden bg-black"
                  style={{ maxHeight: "78vh" }}
                >
                  <video
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    aria-label="Agape official promo reel"
                    poster={asset("/media/promo.jpg")}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      filter: "brightness(0.95) contrast(1.05)",
                    }}
                  >
                    <source src={asset("/media/promo.mp4")} type="video/mp4" />
                  </video>

                  {/* Subtle edge darkening for the framed centerpiece */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      boxShadow: "inset 0 0 90px 12px rgba(0,0,0,0.65)",
                    }}
                  />

                </div>
              </CornerBrackets>
            </motion.div>

            {/* Headline / copy beside the reel */}
            <div className="w-full max-w-[420px] text-center lg:text-left">
              <ScrollReveal delay={0.2}>
                <div className="mb-4 flex items-center justify-center gap-3 lg:justify-start">
                  <span className="h-[1px] w-10 bg-[#8b0000]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]/70">
                    AGAPE FILM
                  </span>
                </div>
                <h3
                  className="font-display font-bold uppercase leading-[0.95] text-[#fafafa]"
                  style={{
                    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                    letterSpacing: "0.02em",
                  }}
                >
                  <GlitchText text="ENTER THE ROOM" />
                </h3>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                  720 × 1280 / SILENT LOOP
                </p>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Ambient BTS strip ── */}
        <ScrollReveal delay={0.15}>
          <div className="mb-6 mt-20 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a2a]/70">
              02
            </span>
            <div className="h-[1px] w-12 bg-[#363636]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
              FROM THE FLOOR
            </span>
            <span className="ml-1 flex items-center gap-1.5">
              <span className="h-[5px] w-[5px] rounded-full bg-[#ff2a2a]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#fafafa]/55">
                Hover for color
              </span>
            </span>
          </div>
        </ScrollReveal>

        <StaggerContainer
          className="grid grid-cols-3 gap-3 md:gap-5"
          stagger={0.1}
        >
          {TILES.map((tile) => (
            <AmbientTile
              key={tile.src}
              src={tile.src}
              location={tile.location}
            />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
