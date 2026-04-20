"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { organizationSchema } from "@/lib/seo";
import Image from "next/image";
import GlitchText from "@/components/effects/GlitchText";
import CornerBrackets from "@/components/effects/CornerBrackets";
import ScrollReveal, { StaggerContainer } from "@/components/effects/ScrollReveal";
import FlickerButton from "@/components/effects/FlickerButton";
import EventCard from "@/components/cards/EventCard";
import InfiniteMarquee from "@/components/effects/InfiniteMarquee";
import PhotoBreakSection from "@/components/sections/PhotoBreakSection";
import ColorBreakSection from "@/components/sections/ColorBreakSection";
import EventGallerySection from "@/components/sections/EventGallerySection";
import LazyVideo from "@/components/effects/LazyVideo";
import { asset } from "@/lib/asset";
import { useMediaQuery } from "@/lib/useMediaQuery";

// Lazy-load Three.js wireform — keeps it out of the main bundle for mobile
// COMMENTED OUT: client wants to see plain black background
// const ParallaxField = dynamic(
//   () => import("@/components/effects/ParallaxField"),
//   { ssr: false },
// );

/* ──────────────────────────────────────────────
   PLACEHOLDER DATA
   ────────────────────────────────────────────── */
const EVENTS = [
  // {
  //   title: "Kloud + Aphotic",
  //   date: "Mar 14, 2026",
  //   venue: "255 Randolph St.",
  //   image: asset("/images/events/kloud-aphotic.png"),
  //   ticketUrl: "https://posh.vip/e/agap-presents-kloud-aphtic",
  // },
  // {
  //   title: "David Löhlein",
  //   date: "Mar 27, 2026",
  //   venue: "70 Scott Ave",
  //   image: asset("/images/events/david-lohlein.png"),
  //   ticketUrl: "https://posh.vip/e/agap-presents-david-lhlein",
  // },
  // {
  //   title: "Aiden — All Night Long",
  //   date: "Apr 03, 2026",
  //   venue: "70 Scott Ave",
  //   image: asset("/images/events/aiden.png"),
  //   ticketUrl: "https://posh.vip/e/agape-presents-aiden-all-night-long",
  // },
  {
    title: "Raw Showcase @ Refuge",
    date: "Apr 24, 2026",
    venue: "366 Ten Eyck, BKLYN",
    image: asset("/images/events/refuge.jpg"),
    ticketUrl: "https://www.eventbrite.com/e/refuge-fridays-w-bours-the-chronics-tigerhead-junkfile-and-more-tickets-1985490074260",
  },
  {
    title: "LESSSS",
    date: "Apr 24, 2026",
    venue: "774 Myrtle Ave, Brooklyn",
    image: asset("/images/events/lessss.jpg"),
    ticketUrl: "https://posh.vip/e/agap-presents-lessss",
  },
  {
    title: "Nikolina + Kander + Byorn",
    date: "May 15, 2026",
    venue: "255 Randolph St, Brooklyn",
    image: asset("/images/events/nikolina-kander-byorn.webp"),
    ticketUrl: "https://posh.vip/e/agap-presents-nikolina-kander-byorn",
  },
  {
    title: "Intercell — NYC",
    date: "May 30, 2026",
    venue: "99 Scott Ave",
    image: asset("/images/events/intercell.webp"),
    ticketUrl: "https://posh.vip/e/intercell-nyc",
  },
  {
    title: "Sara Landry",
    date: "Aug 01, 2026",
    venue: "Under the K Bridge Park, BK",
    image: asset("/images/events/sara-landry.jpg"),
    ticketUrl: "https://www.axs.com/events/1322106/sara-landry-tickets",
  },
  {
    title: "Serafina — All Night Long",
    date: "Dec 05, 2026",
    venue: "TBA — Brooklyn, NY",
    image: asset("/images/events/serafina.webp"),
    ticketUrl: "https://posh.vip/e/agap-presents-serafina-all-night-long",
  },
];

const RESIDENTS = [
  {
    name: "Andrés Garcil",
    role: "Resident DJ",
    image: asset("/images/residents/andres-garcil-placeholder.webp"),
    bio: "Hailing from the capital of Colombia, Andres Garcil was immersed at an early age into the world of electronic music. Now based in Brooklyn, and at only 21, he's proven that what he lacks in years, he makes up for with his masterful poise when navigating the decks for his ever-growing, high-bpm desiring crowds, stealing the show at several of our events already. His signature style is captivating, blending hard techno, hard dance, and industrial sounds. With big plans already underway in the Big Apple, playing closing out already some of Agape's biggest shows, and many national plays yet to be announced, Andres is set to become one of the leading forces in Brooklyn's underground scene and beyond.",
  },
  {
    name: "@nimal",
    role: "Resident DJ",
    image: asset("/images/residents/animal-placeholder.webp"),
    bio: "@nimal, (pronounced 'animal'), is an American trance music producer making noise in New York's underground techno scene. Inspired by industrial EBM and 80's new wave as well as drawing influence from his background in the genre of gothic synthwave, his retro production style puts a unique spin on the trance genre and gives his work an instantly recognizable blend of nostalgia, aggression, and emotional introspection. As a resident artist for the techno event platform, Ägapē, @nimal has performed numerous supporting sets for DJs such as Somewhen, Rouge, VCL, and Afem Syko. He continues to captivate ravers with his candid and engaging presence behind the decks.",
  },
  {
    name: "Diossa",
    role: "Resident DJ",
    image: asset("/images/residents/diossa-placeholder.jpg"),
    bio: "DIOSSA is a Colombian-born, New York City\u2013based techno DJ and producer operating at the intersection of groove, hypnosis, and velocity. As a new resident of Agape, she represents the next wave of artists shaping the city's underground with discipline, clarity of vision, and uncompromising energy. Her sound is fast, driving, and immersive, built on hypnotic loops, layered percussion, and textured atmospheres that balance physical impact with mental focus. DIOSSA constructs her sets as continuous journeys, locking dance floors into a trance state while maintaining relentless forward motion. With roots in Colombia's underground and a growing international presence, she has performed at Baum Festival, H\u00F6r Berlin, ADE, Elements Music & Arts Festival, and clubs across the US, Europe, and South America. She has shared lineups with Vladimir Dubyshkin, Chl\u00E4r, Anetha, and Lacchesi, while her H\u00F6r Berlin set has surpassed 93,000 streams. As a producer, DIOSSA is building a distinct sonic identity. Her debut EP Oberon on Infrablack Records reached the Top 20 on Beatport's Hypnotic Techno chart, followed by releases on Therefore Records. She now launches Obsidia Records, a platform dedicated to bold, rhythm-driven techno rooted in introspection and impact.",
  },
  {
    name: "Saint Velez",
    role: "Resident DJ",
    image: asset("/images/residents/saint-velez.jpg"),
    bio: "Saint Velez has built this record the same way he built his name: by staying inside the rooms that matter rather than chasing the ones that are easier to reach. Over the better part of a decade, the Brooklyn-born producer developed a sound in the warehouses of Bushwick and Bed Stuy that is raw, physically driven, and shaped entirely by those spaces. Industrial textures, cinematic weight, a groove that works on you before you consciously register it. 'Truth Be Told' is the full articulation of where that path leads.\n\nAs founder of Illegal Rhythm and a resident of the Agape Music collective, Saint Velez occupies a position in American techno that very few artists reach by staying underground rather than leaving it. The co-signs reflect that. Richie Hawtin opened his 2025 Boiler Room set with a Saint Velez track. Sara Landry brought him on as direct support three separate times. He held the room for I Hate Models at Knockdown Center.\n\nLive, Saint Velez brings the same seriousness. Multiple appearances at Basement alongside the likes of Francois X and LOLSNAKE, plus sets at H0L0, Lot Radio, Signal, and Avant Gardner have established him as someone whose presence behind the decks carries genuine authority. The rooms he plays remember him.",
  },
  {
    name: "Johannes Schuster",
    role: "Resident DJ",
    image: asset("/images/residents/johannes-schuster.webp"),
    bio: "Johannes Schuster is a standout force in electronic music, a pioneer in the current hard dance wave, and a key part of Agape as an Agape resident. Also a resident at respected German brand Unreal, Johannes has built a reputation through high-impact sets that blend dark grooves, acid, and driving energy.\n\nWith releases on labels including Green Fetish, Soma, NineTimesNine, Varnox, RND Records, and Märked, he continues to push his sound while bringing his signature intensity to dancefloors worldwide.",
  },
  {
    name: "Junkfile",
    role: "Founder / DJ",
    image: asset("/images/residents/junk-file-placeholder.jpg"),
    bio: "Junkfile moved to NYC five years ago, where he launched his career as a DJ, producer, and promoter. He is the founder of Agape and Agape Records, playing a key role in shaping the city's current techno landscape. He has performed at some of NYC's most respected venues, including H0L0, Elsewhere, Bossa Nova Civic Club, and 99 Scott, building a reputation for driving, groove-focused sets. Sharing stages with artists like Grace Dahl, SHDW, Vladimir Dubyshkin, Hadone, and others, Junkfile continues to establish himself as a consistent presence in the scene. In early 2026, he released on BCCO, marking a strong step forward in his production career. Alongside previous releases on So-Tight Records and ongoing output through his own Brooklyn-based label, his sound continues to evolve with a clear focus on high-energy, forward-leaning techno.",
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
      {/* Background video — looping crowd moment with parallax scale on scroll */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <LazyVideo
          src={asset("/videos/hero-loop.mp4")}
          poster={asset("/images/hero-crowd-wide-compressed.jpg")}
          className="h-full w-full"
          style={{ filter: "brightness(0.45)" }}
        />
        {/* Deep dark overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,5,5,0.35) 0%, rgba(5,5,5,0.5) 50%, rgba(5,5,5,0.9) 100%)",
          }}
        />
      </motion.div>

      {/* Hero content — corner brackets frame */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        <CornerBrackets
          className="flex flex-col items-center gap-6 p-10 md:p-16"
          size={32}
          strokeWidth={1}
          color="#363636"
        >
          <motion.div style={{ y: textY }}>
            <StaggerContainer className="flex flex-col items-center gap-5" stagger={0.12}>
              {/* Agape logo mark */}
              <ScrollReveal delay={0.15} distance={25}>
                <Image
                  src={asset("/images/agape_logo_white.png")}
                  alt="Agape"
                  width={72}
                  height={72}
                  className="opacity-90"
                />
              </ScrollReveal>

              {/* Main headline */}
              <ScrollReveal delay={0.2} distance={30}>
                <h1
                  className="font-display font-bold uppercase text-[#fafafa] text-center leading-[0.9]"
                  style={{
                    fontSize: "clamp(3rem, 8vw, 8rem)",
                    letterSpacing: "0.04em",
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
                  in NYC&apos;s Dance Scene
                </p>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal delay={0.65} distance={15}>
                <FlickerButton href="#events" variant="outline" className="mt-2">
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
          className="h-1 w-1 bg-[#c13243]"
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
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.75)",
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
                02
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
                  <GlitchText text="Dancefloor" />
                </span>
              </h2>
            </CornerBrackets>
          </ScrollReveal>

          {/* Body text */}
          <ScrollReveal delay={0.2}>
            <p
              className="max-w-2xl font-body text-base leading-[1.8] text-[#888888]"
            >
              Agapē is a New York based event platform and record label
              dedicated to underground electronic music. Through events and
              releases we bring artists and community together.
            </p>
          </ScrollReveal>

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
   FESTIVAL BANNER (inline, full-bleed)
   ────────────────────────────────────────────── */
function FestivalBannerInline() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href="https://agape-festival.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative block w-full cursor-pointer overflow-hidden"
      style={{ borderTop: "1px dashed var(--color-tertiary-dark)", borderBottom: "1px dashed var(--color-tertiary-dark)" }}
      animate={{ height: hovered ? 340 : 220 }}
      transition={{ duration: 0.8, ease: [0.455, 0.03, 0.515, 0.955] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Looping video background */}
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        poster={asset("/images/events/festival-flyer-poster.jpg")}
        className="absolute inset-0 h-full w-full object-cover"
        animate={{ filter: hovered ? "brightness(0.5)" : "brightness(0.25)", scale: hovered ? 1.03 : 1 }}
        transition={{ duration: 0.7, ease: [0.455, 0.03, 0.515, 0.955] }}
      >
        <source src={asset("/videos/festival-flyer.mp4")} type="video/mp4" />
      </motion.video>

      {/* Overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,5,5,0.75) 0%, rgba(5,5,5,0.2) 50%, rgba(5,5,5,0.75) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.7) 0%, transparent 30%, transparent 70%, rgba(10,10,10,0.7) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end p-6 md:p-8">
        {/* Top-left label */}
        <motion.span
          className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888] md:left-8 md:top-8"
          animate={{ opacity: hovered ? 1 : 0.6 }}
          transition={{ duration: 0.3 }}
        >
          Featured Event
        </motion.span>

        {/* Info + CTA row */}
        <div className="flex w-full items-end justify-between gap-6">
          <div>
            <motion.div
              animate={{ y: hovered ? -8 : 0 }}
              transition={{ duration: 0.5, ease: [0.455, 0.03, 0.515, 0.955] }}
            >
              <h3 className="font-display text-2xl font-bold uppercase tracking-[0.05em] text-[#fafafa] md:text-4xl">
                <GlitchText text="Agape Festival" />
              </h3>
            </motion.div>
            <motion.div
              className="mt-2 flex gap-6"
              animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? -4 : 0 }}
              transition={{ duration: 0.4, ease: [0.455, 0.03, 0.515, 0.955] }}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#888888]">
                Summer 2026
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#888888]">
                agape-festival.com
              </span>
            </motion.div>
          </div>

          {/* CTA — slides in on hover */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 20 }}
            transition={{ duration: 0.35, delay: hovered ? 0.15 : 0, ease: [0.455, 0.03, 0.515, 0.955] }}
          >
            <FlickerButton variant="outline" className="text-[11px] px-6 py-2 whitespace-nowrap pointer-events-none">
              Get Tickets
            </FlickerButton>
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
}

/* ──────────────────────────────────────────────
   EVENTS CAROUSEL
   ────────────────────────────────────────────── */
function EventsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const layout = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  return (
    <section
      id="events"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.75)",
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
                  01
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
            <FlickerButton href="https://posh.vip/g/agape" variant="outline" className="self-start md:self-auto">
              View All
            </FlickerButton>
          </ScrollReveal>
        </StaggerContainer>
      </div>

      {/* Featured event — Festival full-bleed banner */}
      <div className="mb-12 md:mb-16">
        <ScrollReveal>
          <FestivalBannerInline />
        </ScrollReveal>
      </div>

      {/* Cards — Desktop: horizontal row with hover expansion, Tablet: 2-col grid, Mobile: stacked */}
      <ScrollReveal delay={0.15}>
        {layout === "mobile" ? (
          /* Mobile: stacked vertical */
          <div className="flex flex-col gap-4 px-6">
            {EVENTS.map((event, i) => (
              <CornerBrackets key={event.title} size={20} color="var(--color-tertiary-dark)">
                <div className="relative h-[320px] overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
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
                    {event.ticketUrl && (
                      <div className="mt-4">
                        <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                          <FlickerButton variant="outline" className="text-[11px] px-6 py-2">
                            Buy Tickets
                          </FlickerButton>
                        </a>
                      </div>
                    )}
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
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="50vw"
                    className="object-cover"
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
                    {event.ticketUrl && (
                      <div className="mt-4">
                        <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                          <FlickerButton variant="outline" className="text-[11px] px-6 py-2">
                            Buy Tickets
                          </FlickerButton>
                        </a>
                      </div>
                    )}
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
                ticketUrl={event.ticketUrl}
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
   RESIDENTS
   ────────────────────────────────────────────── */

function ResidentPanel({
  resident,
  index,
  isHovered,
  anyHovered,
  onHover,
  onLeave,
}: {
  resident: (typeof RESIDENTS)[0];
  index: number;
  isHovered: boolean;
  anyHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasBio = resident.bio.length > 0;

  return (
    <motion.div
      className="relative cursor-pointer overflow-hidden"
      style={{ flex: isHovered ? 2.2 : anyHovered ? 0.7 : 1 }}
      onMouseEnter={onHover}
      onMouseLeave={() => {
        onLeave();
        setIsExpanded(false);
      }}
      onClick={() => hasBio && setIsExpanded((prev) => !prev)}
      animate={{
        flex: isHovered ? 2.2 : anyHovered ? 0.7 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.455, 0.03, 0.515, 0.955] }}
    >
      <CornerBrackets size={24} strokeWidth={1} color="#363636" className="h-full">
        {/* Image */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="h-full w-full"
            animate={{
              filter: isHovered
                ? isExpanded
                  ? "brightness(0.25)"
                  : "brightness(0.65)"
                : "brightness(0.3)",
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.6, ease: [0.455, 0.03, 0.515, 0.955] }}
          >
            <Image
              src={resident.image}
              alt={resident.name}
              fill
              sizes="(max-width: 1023px) 100vw, 33vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Scan-line overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
            mixBlendMode: "multiply",
          }}
        />

        {/* Gradient overlay — stronger when expanded */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{
            background: isExpanded
              ? "linear-gradient(0deg, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.85) 60%, rgba(5,5,5,0.6) 100%)"
              : "linear-gradient(0deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.4) 40%, rgba(5,5,5,0.15) 100%)",
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-6">
          {/* Index number top-left */}
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555555]">
            {String(index + 1).padStart(2, "0")}
          </span>

          {/* Bottom info */}
          <div className="flex flex-col gap-2">
            {/* Role label */}
            <motion.span
              className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#666666]"
              animate={{ opacity: isHovered ? 1 : 0.6 }}
              transition={{ duration: 0.3 }}
            >
              {resident.role}
            </motion.span>

            {/* Name with glitch */}
            <h3
              className="font-display text-lg font-bold uppercase tracking-[0.05em] text-[#fafafa] md:text-xl"
              style={{ lineHeight: 1.1 }}
            >
              <GlitchText text={resident.name} wrap />
            </h3>

            {/* Bio — truncated on hover, full on click */}
            {hasBio && (
              <motion.div
                className="overflow-hidden"
                animate={{
                  height: isExpanded ? "auto" : isHovered ? 22 : 0,
                  opacity: isHovered ? 1 : 0,
                }}
                initial={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.455, 0.03, 0.515, 0.955] }}
              >
                <div
                  className={isExpanded ? "max-h-[40vh] overflow-y-auto" : ""}
                  style={isExpanded ? { scrollbarWidth: "thin", scrollbarColor: "#c13243 transparent" } : {}}
                >
                  <p
                    className="pt-1 font-body text-[12px] leading-[1.7] text-[#888888] md:text-[13px]"
                    style={
                      isExpanded
                        ? {}
                        : {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }
                    }
                  >
                    {resident.bio}
                  </p>
                </div>
              </motion.div>
            )}

            {/* "Read more" hint on hover, "Click to close" when expanded */}
            {hasBio && (
              <motion.span
                className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#c13243]"
                animate={{ opacity: isHovered ? 0.8 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isExpanded ? "[ Click to close ]" : "[ Click to read ]"}
              </motion.span>
            )}

            {/* Decorative line */}
            <motion.div
              className="h-[1px] bg-[#363636]"
              animate={{ width: isHovered ? "100%" : "30px" }}
              transition={{ duration: 0.5, ease: [0.455, 0.03, 0.515, 0.955] }}
              style={{ originX: 0 }}
            />
          </div>
        </div>
      </CornerBrackets>
    </motion.div>
  );
}

function ResidentCard({
  resident,
  index,
  height,
  sizes,
  bracketSize,
  nameSize = "text-lg",
}: {
  resident: (typeof RESIDENTS)[0];
  index: number;
  height: number;
  sizes: string;
  bracketSize: number;
  nameSize?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasBio = resident.bio.length > 0;

  return (
    <CornerBrackets size={bracketSize} color="#363636">
      <motion.div
        className="relative overflow-hidden cursor-pointer"
        style={{ height }}
        animate={{ height: isExpanded ? height + 120 : height }}
        transition={{ duration: 0.4, ease: [0.455, 0.03, 0.515, 0.955] }}
        onClick={() => hasBio && setIsExpanded((prev) => !prev)}
      >
        <Image
          src={resident.image}
          alt={resident.name}
          fill
          sizes={sizes}
          className="object-cover"
          style={{ filter: isExpanded ? "brightness(0.2)" : "brightness(0.4)" }}
        />
        {/* Scan-lines */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isExpanded
              ? "linear-gradient(0deg, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.8) 60%, rgba(5,5,5,0.4) 100%)"
              : "linear-gradient(0deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.2) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555555]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.25em] text-[#666666]">
              {resident.role}
            </span>
            <h3 className={`font-display ${nameSize} font-bold uppercase tracking-[0.05em] text-[#fafafa]`}>
              <GlitchText text={resident.name} wrap />
            </h3>
            {hasBio && (
              <motion.div
                className="overflow-hidden"
                animate={{ height: isExpanded ? "auto" : 20 }}
                transition={{ duration: 0.4, ease: [0.455, 0.03, 0.515, 0.955] }}
              >
                <div
                  className={isExpanded ? "max-h-[35vh] overflow-y-auto" : ""}
                  style={isExpanded ? { scrollbarWidth: "thin", scrollbarColor: "#c13243 transparent" } : {}}
                >
                  <p
                    className="mt-2 font-body text-[12px] leading-[1.7] text-[#888888]"
                    style={
                      isExpanded
                        ? {}
                        : {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }
                    }
                  >
                    {resident.bio}
                  </p>
                </div>
              </motion.div>
            )}
            {hasBio && (
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.15em] text-[#c13243] opacity-80">
                {isExpanded ? "[ Tap to close ]" : "[ Tap to read ]"}
              </span>
            )}
            <div className="mt-3 h-[1px] w-8 bg-[#363636]" />
          </div>
        </div>
      </motion.div>
    </CornerBrackets>
  );
}

function ResidentsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const layout = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  return (
    <section
      id="residents"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.75)",
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
                  03
                </span>
                <div className="h-[1px] w-12 bg-[#363636]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                  Residents
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1} distance={25}>
              <h2
                className="font-bold uppercase text-[#fafafa]"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  letterSpacing: "0.03em",
                }}
              >
                <GlitchText text="Residents" />
              </h2>
            </ScrollReveal>
          </div>
        </StaggerContainer>
      </div>

      {/* Panels */}
      <ScrollReveal delay={0.15}>
        {layout === "desktop" ? (
          /* Desktop: horizontal accordion panels — wider than other
             sections to give each resting panel room for long names */
          <div
            className="mx-auto flex w-full max-w-[1600px] gap-[2px] px-6 md:px-10 lg:px-16"
            style={{ height: 520 }}
          >
            {RESIDENTS.map((resident, i) => (
              <ResidentPanel
                key={resident.name}
                resident={resident}
                index={i}
                isHovered={hoveredIndex === i}
                anyHovered={hoveredIndex !== null}
                onHover={() => setHoveredIndex(i)}
                onLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>
        ) : layout === "tablet" ? (
          /* Tablet: 2x2 grid */
          <div className="grid grid-cols-2 gap-3 px-6">
            {RESIDENTS.map((resident, i) => (
              <ResidentCard key={resident.name} resident={resident} index={i} height={360} sizes="50vw" bracketSize={22} />
            ))}
          </div>
        ) : (
          /* Mobile: stacked vertical cards */
          <div className="flex flex-col gap-3 px-6">
            {RESIDENTS.map((resident, i) => (
              <ResidentCard key={resident.name} resident={resident} index={i} height={300} sizes="100vw" bracketSize={20} nameSize="text-xl" />
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
      id="contact"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "rgba(17, 17, 17, 0.75)",
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
              04
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
            <GlitchText text="Movement" />
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
            <FlickerButton href="https://posh.vip/g/agape" variant="outline">
              Upcoming Events
            </FlickerButton>
            <FlickerButton href="mailto:bookings@agapemusic.us" variant="outline">
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
      {/* <ParallaxField /> */}

      <div className="relative" style={{ zIndex: 1 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />

        <HeroSection />

        {/* Filled marquee ticker — attached to hero bottom edge */}
        <div className="overflow-hidden border-t border-b border-dashed border-[#363636] bg-[#0a0a0a] py-5">
          <InfiniteMarquee
            text="UPCOMING"
            variant="filled"
            speed={20}
            separator={<span className="mx-[0.6em] text-[#363636]">{"///"}</span>}
          />
        </div>

        <EventsSection />

        {/* Full-width immersive photo strip */}
        <PhotoBreakSection />

        <NarrativeSection />

        {/* Residents — the collective */}
        <ResidentsSection />

        {/* Event gallery — editorial photo spread */}
        <EventGallerySection />

        {/* Color explosion — manifesto section */}
        <ColorBreakSection />

        <div className="h-[1px] w-full border-t border-dashed border-[#363636]" />

        <CTASection />
      </div>
    </>
  );
}
