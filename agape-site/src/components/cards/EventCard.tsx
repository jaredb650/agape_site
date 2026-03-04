"use client";

import { motion } from "framer-motion";
import CornerBrackets from "@/components/effects/CornerBrackets";
import GlitchText from "@/components/effects/GlitchText";
import FlickerButton from "@/components/effects/FlickerButton";

interface EventCardProps {
  title: string;
  date: string;
  venue: string;
  image: string;
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
  index,
  isHovered,
  onHover,
  onLeave,
  anyHovered,
}: EventCardProps) {
  // Desktop: hovered card expands dramatically, neighbors compress
  const getWidth = () => {
    if (!anyHovered) return "25%";
    if (isHovered) return "46%";
    return "18%";
  };

  return (
    <motion.div
      className="event-card relative h-[500px] cursor-pointer overflow-hidden"
      style={{
        borderRight: index < 3 ? "1px dashed var(--color-tertiary-dark)" : "none",
      }}
      animate={{
        width: getWidth(),
      }}
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
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
            style={{
              filter: isHovered ? "brightness(0.6)" : "brightness(0.35)",
              transition: "filter 0.5s ease",
            }}
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.3) 40%, rgba(5,5,5,0.1) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
          {/* Index number */}
          <motion.span
            className="mb-auto font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]"
            animate={{ opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          {/* Event info */}
          <div className="mt-auto">
            <motion.div
              animate={{ y: isHovered ? -8 : 0 }}
              transition={{ duration: 0.5, ease: [0.455, 0.03, 0.515, 0.955] }}
            >
              <h3 className="font-display text-xl font-bold uppercase tracking-[0.05em] text-[#fafafa] md:text-2xl">
                <GlitchText text={title} />
              </h3>
            </motion.div>

            <motion.div
              className="mt-3 flex flex-col gap-1"
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

            {/* CTA — only visible on hover */}
            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10,
              }}
              transition={{
                duration: 0.35,
                delay: isHovered ? 0.15 : 0,
                ease: [0.455, 0.03, 0.515, 0.955],
              }}
            >
              <FlickerButton variant="outline" className="text-[11px] px-6 py-2">
                Notify Me
              </FlickerButton>
            </motion.div>
          </div>
        </div>
      </CornerBrackets>
    </motion.div>
  );
}
