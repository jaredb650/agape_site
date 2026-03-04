"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";
type RevealMode = "fade-slide" | "clip-wipe" | "fade-slide-clip";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  mode?: RevealMode;
  duration?: number;
  delay?: number;
  distance?: number;
  threshold?: number;
  once?: boolean;
  as?: React.ElementType;
}

const EASING: [number, number, number, number] = [0.455, 0.03, 0.515, 0.955];

function getTranslate(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
  }
}

function getClipPath(direction: Direction, state: "hidden" | "visible") {
  if (state === "visible") return "inset(0% 0% 0% 0%)";
  switch (direction) {
    case "up":
      return "inset(100% 0% 0% 0%)";
    case "down":
      return "inset(0% 0% 100% 0%)";
    case "left":
      return "inset(0% 0% 0% 100%)";
    case "right":
      return "inset(0% 100% 0% 0%)";
  }
}

function buildVariants(
  mode: RevealMode,
  direction: Direction,
  distance: number,
  duration: number,
  delay: number
): Variants {
  const translate = getTranslate(direction, distance);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hidden: any = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visible: any = {
    transition: {
      duration,
      delay,
      ease: EASING,
    },
  };

  if (mode === "fade-slide" || mode === "fade-slide-clip") {
    hidden.opacity = 0;
    hidden.x = translate.x;
    hidden.y = translate.y;
    visible.opacity = 1;
    visible.x = 0;
    visible.y = 0;
  }

  if (mode === "clip-wipe" || mode === "fade-slide-clip") {
    hidden.clipPath = getClipPath(direction, "hidden");
    visible.clipPath = getClipPath(direction, "visible");
    if (mode === "clip-wipe") {
      hidden.opacity = 1;
      visible.opacity = 1;
    }
  }

  return { hidden, visible };
}

export default function ScrollReveal({
  children,
  className = "",
  direction = "up",
  mode = "fade-slide",
  duration = 0.7,
  delay = 0,
  distance = 40,
  threshold = 0.2,
  once = true,
}: ScrollRevealProps) {
  const variants = buildVariants(mode, direction, distance, duration, delay);

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container — wraps children so they animate in sequence.
 * Each direct child should be a ScrollReveal (or any motion component).
 */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  threshold?: number;
  once?: boolean;
}

const containerVariants = (stagger: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0,
    },
  },
});

export function StaggerContainer({
  children,
  className = "",
  stagger = 0.075,
  threshold = 0.15,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants(stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
    >
      {children}
    </motion.div>
  );
}
