"use client";

import Link from "next/link";
import { type ButtonHTMLAttributes } from "react";
import GlitchText from "./GlitchText";

interface FlickerButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  /** Render as anchor tag instead of button */
  href?: string;
  /** Show glitch text on hover (default: true) */
  glitch?: boolean;
  /** Visual variant. `ticket` = solid red purchase CTA (festival style). */
  variant?: "outline" | "solid" | "ticket";
  className?: string;
}

export default function FlickerButton({
  children,
  href,
  glitch = true,
  variant = "outline",
  className = "",
  ...props
}: FlickerButtonProps) {
  const isTicket = variant === "ticket";

  const baseStyles = [
    "relative inline-flex items-center justify-center",
    "px-8 py-3",
    "uppercase font-medium",
    "transition-colors duration-200",
    "cursor-pointer",
    "select-none",
    isTicket
      ? // Solid red purchase CTA — glow + pulse from .ticket-btn, white mono label
        "ticket-btn border-0 bg-[var(--accent-red)] text-white hover:bg-[var(--accent-red-hover)] font-mono text-sm tracking-[0.3em]"
      : [
          // Bracket-framed utility button — corner ticks, mono label
          "group/btn",
          "flicker-btn",
          "font-mono text-[12px] tracking-[0.25em]",
          variant === "outline"
            ? "bg-transparent text-[var(--color-primary-light)] hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
            : "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] hover:bg-[var(--color-secondary-light)]",
        ].join(" "),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Corner tick marks — teletech-style bracket frame on non-ticket buttons
  const brackets = !isTicket && (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-[#6d6d6d] transition-all duration-300 group-hover/btn:h-3.5 group-hover/btn:w-3.5 group-hover/btn:border-[#f0f0f0]" />
      <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-[#6d6d6d] transition-all duration-300 group-hover/btn:h-3.5 group-hover/btn:w-3.5 group-hover/btn:border-[#f0f0f0]" />
      <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-[#6d6d6d] transition-all duration-300 group-hover/btn:h-3.5 group-hover/btn:w-3.5 group-hover/btn:border-[#f0f0f0]" />
      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-[#6d6d6d] transition-all duration-300 group-hover/btn:h-3.5 group-hover/btn:w-3.5 group-hover/btn:border-[#f0f0f0]" />
    </span>
  );

  const inner = (
    <>
      {brackets}
      {glitch ? (
        <GlitchText duration={350} interval={75}>
          {children}
        </GlitchText>
      ) : (
        children
      )}
    </>
  );

  if (href) {
    const isHash = href.startsWith("#");
    const isInternal = href.startsWith("/") || isHash;

    if (isHash) {
      return (
        <a href={href} className={baseStyles}>
          {inner}
        </a>
      );
    }

    if (isInternal) {
      return (
        <Link href={href} className={baseStyles}>
          {inner}
        </Link>
      );
    }

    return (
      <a href={href} className={baseStyles} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }

  return (
    <button className={baseStyles} {...props}>
      {inner}
    </button>
  );
}
