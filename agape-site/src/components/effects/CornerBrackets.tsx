"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface CornerBracketsProps {
  children: ReactNode;
  className?: string;
  /** Length of each bracket arm in px */
  size?: number;
  /** Stroke width in px */
  strokeWidth?: number;
  /** Stroke color — defaults to border color */
  color?: string;
  /** Offset from container edge in px */
  offset?: number;
  /** Whether to animate stroke-dasharray on scroll reveal */
  animate?: boolean;
}

const DRAW_VARIANTS = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.8, ease: [0.455, 0.03, 0.515, 0.955] as [number, number, number, number] },
      opacity: { duration: 0.2 },
    },
  },
};

function BracketCorner({
  position,
  size,
  strokeWidth,
  color,
  animate,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size: number;
  strokeWidth: number;
  color: string;
  animate: boolean;
}) {
  // Each bracket is an L-shaped path
  const paths: Record<string, string> = {
    "top-left": `M ${strokeWidth / 2} ${size} L ${strokeWidth / 2} ${strokeWidth / 2} L ${size} ${strokeWidth / 2}`,
    "top-right": `M ${size - strokeWidth / 2 - size + strokeWidth} ${strokeWidth / 2} L ${size - strokeWidth / 2} ${strokeWidth / 2} L ${size - strokeWidth / 2} ${size}`,
    "bottom-left": `M ${strokeWidth / 2} ${strokeWidth / 2} L ${strokeWidth / 2} ${size - strokeWidth / 2} L ${size} ${size - strokeWidth / 2}`,
    "bottom-right": `M ${strokeWidth / 2} ${size - strokeWidth / 2} L ${size - strokeWidth / 2} ${size - strokeWidth / 2} L ${size - strokeWidth / 2} ${strokeWidth / 2}`,
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    "top-left": { top: 0, left: 0 },
    "top-right": { top: 0, right: 0 },
    "bottom-left": { bottom: 0, left: 0 },
    "bottom-right": { bottom: 0, right: 0 },
  };

  const MotionPath = motion.path;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className="absolute pointer-events-none"
      style={positionStyles[position]}
      aria-hidden="true"
    >
      {animate ? (
        <MotionPath
          d={paths[position]}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
          variants={DRAW_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        />
      ) : (
        <path
          d={paths[position]}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
      )}
    </svg>
  );
}

export default function CornerBrackets({
  children,
  className = "",
  size = 20,
  strokeWidth = 1,
  color = "var(--color-tertiary-dark)",
  offset = 0,
  animate = true,
}: CornerBracketsProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{ padding: offset > 0 ? offset : undefined }}
    >
      <BracketCorner
        position="top-left"
        size={size}
        strokeWidth={strokeWidth}
        color={color}
        animate={animate}
      />
      <BracketCorner
        position="top-right"
        size={size}
        strokeWidth={strokeWidth}
        color={color}
        animate={animate}
      />
      <BracketCorner
        position="bottom-left"
        size={size}
        strokeWidth={strokeWidth}
        color={color}
        animate={animate}
      />
      <BracketCorner
        position="bottom-right"
        size={size}
        strokeWidth={strokeWidth}
        color={color}
        animate={animate}
      />
      {children}
    </div>
  );
}
