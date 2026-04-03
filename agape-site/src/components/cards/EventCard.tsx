"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CornerBrackets from "@/components/effects/CornerBrackets";
import GlitchText from "@/components/effects/GlitchText";
import FlickerButton from "@/components/effects/FlickerButton";

interface EventCardProps {
  title: string;
  date: string;
  venue: string;
  image: string;
  ticketUrl: string;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  anyHovered: boolean;
}

export default function EventCard({
  title,
  date,
  venue,
  image,
  ticketUrl,
  index,
  isHovered,
  onHover,
  onLeave,
  anyHovered,
}: EventCardProps) {
  // Vertical: hovered card expands height, neighbors compress
  const getHeight = () => {
    if (!anyHovered) return "25%";
    if (isHovered) return "52%";
    return "16%";
  };

  return (
    <motion.div
      className="event-card relative w-full cursor-pointer overflow-hidden"
      style={{
        borderBottom: index < 3 ? "1px dashed var(--color-tertiary-dark)" : "none",
      }}
      animate={{ height: getHeight() }}
      transition={{
        duration: 0.8,
        ease: [0.455, 0.03, 0.515, 0.955],
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <CornerBrackets
        className="h-full w-full"
        size={24}
        strokeWidth={1}
        color="var(--color-tertiary-dark)"
      >
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 1023px) 100vw, 1200px"
            className="object-cover"
            style={{
              filter: isHovered ? "brightness(0.6)" : "brightness(0.3)",
              transition: "filter 0.5s ease",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.3) 40%, rgba(5,5,5,0.1) 100%)",
            }}
          />
        </div>

        {/* Content — horizontal layout: info left, CTA right */}
        <div className="relative z-10 flex h-full items-end p-6 md:p-8">
          {/* Index number — top left */}
          <motion.span
            className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888] md:left-8 md:top-8"
            animate={{ opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          {/* Event info */}
          <div className="flex w-full items-end justify-between gap-6">
            <div>
              <motion.div
                animate={{ y: isHovered ? -8 : 0 }}
                transition={{ duration: 0.5, ease: [0.455, 0.03, 0.515, 0.955] }}
              >
                <h3 className="font-display text-xl font-bold uppercase tracking-[0.05em] text-[#fafafa] md:text-3xl">
                  <GlitchText text={title} />
                </h3>
              </motion.div>

              <motion.div
                className="mt-2 flex gap-6"
                animate={{
                  opacity: isHovered ? 1 : 0.7,
                  y: isHovered ? -4 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.455, 0.03, 0.515, 0.955] }}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#888888]">
                  {date}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#888888]">
                  {venue}
                </span>
              </motion.div>
            </div>

            {/* CTA — slides in on hover */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : 20,
              }}
              transition={{
                duration: 0.35,
                delay: isHovered ? 0.15 : 0,
                ease: [0.455, 0.03, 0.515, 0.955],
              }}
            >
              <a href={ticketUrl} target="_blank" rel="noopener noreferrer">
                <FlickerButton variant="outline" className="text-[11px] px-6 py-2 whitespace-nowrap">
                  Buy Tickets
                </FlickerButton>
              </a>
            </motion.div>
          </div>
        </div>
      </CornerBrackets>
    </motion.div>
  );
}
