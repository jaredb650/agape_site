"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { organizationSchema } from "@/lib/seo";
import PixelDisplacement from "@/components/effects/PixelDisplacement";
import GlitchText from "@/components/effects/GlitchText";
import CornerBrackets from "@/components/effects/CornerBrackets";
import ScrollReveal, { StaggerContainer } from "@/components/effects/ScrollReveal";
import FlickerButton from "@/components/effects/FlickerButton";
import EventCard from "@/components/cards/EventCard";
import InfiniteMarquee from "@/components/effects/InfiniteMarquee";
import PhotoBreakSection from "@/components/sections/PhotoBreakSection";
import ColorBreakSection from "@/components/sections/ColorBreakSection";
import { asset } from "@/lib/asset";

// Lazy-load Three.js wireform — keeps it out of the main bundle for mobile
const ParallaxField = dynamic(
  () => import("@/components/effects/ParallaxField"),
  { ssr: false },
);

/* ──────────────────────────────────────────────
   PLACEHOLDER DATA
   ────────────────────────────────────────────── */
const EVENTS = [
  {
    title: "Subliminal Frequencies",
    date: "Mar 22, 2026",
    venue: "Basement NYC",
    image: asset("/images/DSC05585.jpeg"),
  },
  {
    title: "Nocturnal Transmission",
    date: "Apr 05, 2026",
    venue: "Knockdown Center",
    image: asset("/images/DSC05632.jpeg"),
  },
  {
    title: "Raw Signal",
    date: "Apr 19, 2026",
    venue: "Elsewhere Zone 1",
    image: asset("/images/AGAPE_F5.jpeg"),
  },
  {
    title: "Under the Surface",
    date: "May 10, 2026",
    venue: "Good Room",
    image: asset("/images/1D3A9620-2.jpeg"),
  },
];

/* ──────────────────────────────────────────────
   HERO
   ────────────────────────────────────────────── */
function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.05]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background image with WebGL displacement */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <PixelDisplacement
          src={asset("/images/1D3A9267.jpg")}
          alt="Agape event — underground crowd"
          className="h-full w-full"
          intensity={1.2}
        />
        {/* Deep dark overlay for text legibility (pointer-events-none so mouse reaches WebGL) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.6) 50%, rgba(5,5,5,0.92) 100%)",
          }}
        />
      </motion.div>

      {/* Hero content — corner brackets frame (pointer-events-none so mouse reaches WebGL canvas) */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6">
        <CornerBrackets
          className="flex flex-col items-center gap-6 p-10 md:p-16"
          size={32}
          strokeWidth={1}
          color="#363636"
        >
          <motion.div style={{ y: textY }}>
            <StaggerContainer className="flex flex-col items-center gap-5" stagger={0.12}>
              {/* Pre-title label */}
              <ScrollReveal delay={0.1} distance={20}>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888888]">
                  NYC Underground
                </span>
              </ScrollReveal>

              {/* Main headline — MASSIVE */}
              <ScrollReveal delay={0.2} distance={30}>
                <h1
                  className="pointer-events-auto font-display font-bold uppercase text-[#fafafa] text-center leading-[0.9]"
                  style={{
                    fontSize: "clamp(3rem, 8vw, 8rem)",
                    letterSpacing: "0.04em",
                    mixBlendMode: "exclusion",
                  }}
                >
                  <GlitchText text="ÄGAPĒ" playOnMount duration={600} />
                </h1>
              </ScrollReveal>

              {/* Divider line */}
              <ScrollReveal delay={0.35}>
                <motion.div
                  className="h-[1px] bg-[#363636]"
                  initial={{ width: 0 }}
                  animate={{ width: 120 }}
                  transition={{ duration: 1, delay: 0.8, ease: [0.455, 0.03, 0.515, 0.955] }}
                />
              </ScrollReveal>

              {/* Tagline */}
              <ScrollReveal delay={0.5} distance={20}>
                <p
                  className="max-w-md text-center font-body text-sm tracking-[0.06em] text-[#888888] md:text-base"
                  style={{ lineHeight: 1.6 }}
                >
                  Pushing the Limits of Electronic Music
                  <br />
                  in NYC&apos;s Underground
                </p>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal delay={0.65} distance={15}>
                <FlickerButton href="/events" variant="outline" className="pointer-events-auto mt-2">
                  Explore Events
                </FlickerButton>
              </ScrollReveal>
            </StaggerContainer>
          </motion.div>
        </CornerBrackets>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#888888]">
          Scroll
        </span>
        <motion.div
          className="relative h-8 w-[1px] overflow-hidden"
        >
          <motion.div
            className="absolute left-0 top-0 h-4 w-[1px] bg-[#f0f0f0]"
            animate={{ y: [0, 32] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
        {/* Glow dot */}
        <motion.div
          className="h-1 w-1 bg-[var(--color-accent)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   ABOUT / NARRATIVE
   ────────────────────────────────────────────── */
function NarrativeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.55)",
        paddingTop: "8rem",
        paddingBottom: "8rem",
      }}
    >
      {/* Subtle parallax background texture line */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: bgY }}
      >
        <div
          className="absolute left-[10%] top-[20%] h-[1px] w-[30%] opacity-[0.06]"
          style={{ background: "linear-gradient(90deg, transparent, #363636, transparent)" }}
        />
        <div
          className="absolute right-[15%] top-[60%] h-[1px] w-[20%] opacity-[0.05]"
          style={{ background: "linear-gradient(90deg, transparent, #363636, transparent)" }}
        />
        <div
          className="absolute left-[5%] top-[80%] h-[1px] w-[25%] opacity-[0.04]"
          style={{ background: "linear-gradient(90deg, transparent, #363636, transparent)" }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-[900px] px-6 md:px-10 lg:px-16">
        <StaggerContainer className="flex flex-col gap-12 md:gap-16" stagger={0.1}>
          {/* Section label */}
          <ScrollReveal>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                01
              </span>
              <div className="h-[1px] w-12 bg-[#363636]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                About
              </span>
            </div>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal delay={0.1} distance={30}>
            <CornerBrackets size={28} strokeWidth={1} color="#363636" className="inline-block">
              <h2
                className="font-bold uppercase text-[#fafafa] px-8 py-6"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 4vw, 3.5rem)", letterSpacing: "0.03em", lineHeight: 1.1 }}
              >
                Born from the
                <br />
                <span className="text-[#f0f0f0]">
                  <GlitchText text="Underground" />
                </span>
              </h2>
            </CornerBrackets>
          </ScrollReveal>

          {/* Body text — two column on desktop */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
            <ScrollReveal delay={0.2}>
              <p
                className="font-body text-base leading-[1.8] text-[#888888]"
              >
                Agape is more than an events company. We are a collective of
                artists, DJs, and creators dedicated to pushing electronic music
                forward in New York City. Every night we curate is an experiment
                in sound, space, and connection.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <p
                className="font-body text-base leading-[1.8] text-[#888888]"
              >
                From warehouse raves to intimate basement sets, we build
                experiences that blur the line between performer and audience.
                No VIP. No velvet ropes. Just raw energy and relentless beats
                in the spaces where music sounds the way it was meant to.
              </p>
            </ScrollReveal>
          </div>

          {/* Stats row */}
          <ScrollReveal delay={0.35}>
            <div
              className="flex flex-wrap gap-0 border-t border-b border-dashed border-[#363636] py-0"
            >
              {[
                { number: "50+", label: "Events Hosted" },
                { number: "120+", label: "Artists Featured" },
                { number: "10K+", label: "Community Members" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex flex-1 flex-col items-center gap-2 py-8"
                  style={{
                    borderRight:
                      i < 2
                        ? "1px dashed var(--color-tertiary-dark)"
                        : "none",
                    minWidth: "140px",
                  }}
                >
                  <span
                    className="font-display text-3xl font-bold text-[#fafafa] md:text-4xl"
                  >
                    <GlitchText text={stat.number} />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   EVENTS CAROUSEL
   ────────────────────────────────────────────── */
function EventsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [layout, setLayout] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 768) setLayout("mobile");
      else if (w < 1024) setLayout("tablet");
      else setLayout("desktop");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#0a0a0a",
        paddingTop: "6rem",
        paddingBottom: "8rem",
      }}
    >
      {/* Section header */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <StaggerContainer className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                  02
                </span>
                <div className="h-[1px] w-12 bg-[#363636]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                  Upcoming
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1} distance={25}>
              <h2
                className="font-bold uppercase text-[#fafafa]"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "0.03em" }}
              >
                <GlitchText text="Events" />
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2}>
            <FlickerButton href="/events" variant="outline" className="self-start md:self-auto">
              View All
            </FlickerButton>
          </ScrollReveal>
        </StaggerContainer>
      </div>

      {/* Cards — Desktop: horizontal row with hover expansion, Tablet: 2-col grid, Mobile: stacked */}
      <ScrollReveal delay={0.15}>
        {layout === "mobile" ? (
          /* Mobile: stacked vertical */
          <div className="flex flex-col gap-4 px-6">
            {EVENTS.map((event, i) => (
              <CornerBrackets key={event.title} size={20} color="var(--color-tertiary-dark)">
                <div className="relative h-[320px] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                    style={{ filter: "brightness(0.55)" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(5,5,5,0.9) 0%, rgba(5,5,5,0.15) 100%)",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl font-bold uppercase tracking-[0.05em] text-[#fafafa]">
                      <GlitchText text={event.title} />
                    </h3>
                    <div className="mt-2 flex flex-col gap-1">
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#888888]">
                        {event.date}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#888888]">
                        {event.venue}
                      </span>
                    </div>
                    <div className="mt-4">
                      <FlickerButton variant="outline" className="text-[11px] px-6 py-2">
                        Notify Me
                      </FlickerButton>
                    </div>
                  </div>
                </div>
              </CornerBrackets>
            ))}
          </div>
        ) : layout === "tablet" ? (
          /* Tablet: 2-column grid */
          <div className="grid grid-cols-2 gap-4 px-6">
            {EVENTS.map((event, i) => (
              <CornerBrackets key={event.title} size={22} color="var(--color-tertiary-dark)">
                <div className="relative h-[380px] overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                    style={{ filter: "brightness(0.5)" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.2) 100%)",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-bold uppercase tracking-[0.05em] text-[#fafafa]">
                      <GlitchText text={event.title} />
                    </h3>
                    <div className="mt-2 flex flex-col gap-1">
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#888888]">
                        {event.date}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#888888]">
                        {event.venue}
                      </span>
                    </div>
                    <div className="mt-4">
                      <FlickerButton variant="outline" className="text-[11px] px-6 py-2">
                        Notify Me
                      </FlickerButton>
                    </div>
                  </div>
                </div>
              </CornerBrackets>
            ))}
          </div>
        ) : (
          /* Desktop: vertical stack with hover expansion */
          <div className="mx-auto flex w-full max-w-[1200px] flex-col px-6 md:px-10 lg:px-16" style={{ height: 600 }}>
            {EVENTS.map((event, i) => (
              <EventCard
                key={event.title}
                title={event.title}
                date={event.date}
                venue={event.venue}
                image={event.image}
                index={i}
                isHovered={hoveredIndex === i}
                anyHovered={hoveredIndex !== null}
                onHover={() => setHoveredIndex(i)}
                onLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>
        )}
      </ScrollReveal>
    </section>
  );
}

/* ──────────────────────────────────────────────
   CTA / FINAL SECTION
   ────────────────────────────────────────────── */
function CTASection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgba(17, 17, 17, 0.55)",
        paddingTop: "8rem",
        paddingBottom: "8rem",
      }}
    >
      {/* Decorative corner brackets — large-scale framing */}
      <div className="pointer-events-none absolute inset-8 md:inset-16">
        <div className="absolute left-0 top-0 h-12 w-12 border-l border-t border-[#363636]/30" />
        <div className="absolute right-0 top-0 h-12 w-12 border-r border-t border-[#363636]/30" />
        <div className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-[#363636]/30" />
        <div className="absolute bottom-0 right-0 h-12 w-12 border-b border-r border-[#363636]/30" />
      </div>

      <div className="relative mx-auto flex max-w-[800px] flex-col items-center gap-8 px-6 text-center md:px-10">
        <ScrollReveal>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
              03
            </span>
            <div className="h-[1px] w-12 bg-[#363636]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
              Join
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} distance={30}>
          <h2
            className="font-bold uppercase text-[#fafafa]"
            style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "0.03em", lineHeight: 1.1 }}
          >
            Experience the
            <br />
            <GlitchText text="Underground" />
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="max-w-lg font-body text-base leading-[1.8] text-[#888888]">
            Stay connected with the movement. Get early access to events,
            exclusive releases, and invitations to private sessions.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <FlickerButton href="/events" variant="outline">
              Upcoming Events
            </FlickerButton>
            <FlickerButton href="/contact" variant="outline">
              Get In Touch
            </FlickerButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   HOMEPAGE COMPOSITION
   ────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      {/* Fixed Three.js terrain — visible behind semi-transparent sections */}
      <ParallaxField />

      <div className="relative" style={{ zIndex: 1 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />

        <HeroSection />

        {/* Ghost marquee — background texture behind narrative */}
        <div style={{ backgroundColor: "rgba(10, 10, 10, 0.55)" }}>
          <InfiniteMarquee text="ÄGAPĒ" variant="ghost" speed={25} className="py-4" />
        </div>

        <NarrativeSection />

        {/* Full-width immersive photo strip */}
        <PhotoBreakSection />

        {/* Filled marquee ticker — transitional element */}
        <div className="overflow-hidden border-t border-b border-dashed border-[#363636] bg-[#0a0a0a] py-5">
          <InfiniteMarquee
            text="UPCOMING"
            variant="filled"
            speed={20}
            separator={<span className="mx-[0.6em] text-[#363636]">///</span>}
          />
        </div>

        <EventsSection />

        {/* Color explosion — manifesto section */}
        <ColorBreakSection />

        <div className="h-[1px] w-full border-t border-dashed border-[#363636]" />

        <CTASection />
      </div>
    </>
  );
}
