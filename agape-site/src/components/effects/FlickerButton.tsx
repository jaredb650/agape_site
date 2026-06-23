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
          "flicker-btn",
          "border border-[var(--color-tertiary-dark)]",
          "text-sm tracking-[0.1em]",
          variant === "outline"
            ? "bg-transparent text-[var(--color-primary-light)] hover:bg-[var(--color-secondary-dark)]"
            : "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] hover:bg-[var(--color-secondary-light)]",
        ].join(" "),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = glitch ? (
    <GlitchText duration={350} interval={75}>
      {children}
    </GlitchText>
  ) : (
    children
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
