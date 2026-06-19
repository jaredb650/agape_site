"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Full-width 1px gradient hairline that wipes in on scroll (scaleX 0→1).
 * Ported from the Agape Festival site for cross-site cohesion.
 */
export default function MetallicDivider({ className = "" }: { className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`h-[1px] w-full origin-left ${className}`}
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)",
      }}
    />
  );
}
