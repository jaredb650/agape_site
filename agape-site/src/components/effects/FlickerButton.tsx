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
  /** Visual variant */
  variant?: "outline" | "solid";
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
  const baseStyles = [
    "flicker-btn",
    "relative inline-flex items-center justify-center",
    "px-8 py-3",
    "text-sm uppercase tracking-[0.1em]",
    "font-medium",
    "transition-colors duration-200",
    "border border-[var(--color-tertiary-dark)]",
    "cursor-pointer",
    "select-none",
    variant === "outline"
      ? "bg-transparent text-[var(--color-primary-light)] hover:bg-[var(--color-secondary-dark)]"
      : "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] hover:bg-[var(--color-secondary-light)]",
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
    const isInternal = href.startsWith("/") || href.startsWith("#");

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
