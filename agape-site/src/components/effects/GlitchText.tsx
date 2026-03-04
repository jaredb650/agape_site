"use client";

import React, { useState, useCallback, useRef } from "react";

const GLITCH_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

interface GlitchTextProps {
  /** Text to display — pass as children or as `text` prop */
  children?: string;
  text?: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  interval?: number;
  /** If true, glitch plays on mount instead of hover */
  playOnMount?: boolean;
}

export default function GlitchText({
  children,
  text,
  as: Tag = "span",
  className = "",
  duration = 400,
  interval = 75,
  playOnMount = false,
}: GlitchTextProps) {
  const content = (children ?? text) as string;
  const [displayText, setDisplayText] = useState(content);
  const isAnimating = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasPlayedOnMount = useRef(false);

  const randomChar = () =>
    GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

  const startGlitch = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const original = content;
    const totalSteps = Math.ceil(duration / interval);
    const charsPerStep = Math.max(1, Math.ceil(original.length / totalSteps));
    let resolvedCount = 0;
    let step = 0;

    timerRef.current = setInterval(() => {
      step++;
      // Resolve characters left-to-right each step
      resolvedCount = Math.min(
        original.length,
        resolvedCount + charsPerStep
      );

      const result = original
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < resolvedCount) return original[i];
          return randomChar();
        })
        .join("");

      setDisplayText(result);

      if (resolvedCount >= original.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setDisplayText(original);
        isAnimating.current = false;
      }
    }, interval);
  }, [content, duration, interval]);

  const handleMouseEnter = useCallback(() => {
    startGlitch();
  }, [startGlitch]);

  // Play on mount once
  const mountRef = useCallback(
    (node: HTMLElement | null) => {
      if (node && playOnMount && !hasPlayedOnMount.current) {
        hasPlayedOnMount.current = true;
        // Small delay so initial paint is visible first
        requestAnimationFrame(() => startGlitch());
      }
    },
    [playOnMount, startGlitch]
  );

  const Component = Tag as any;

  return (
    <Component
      ref={mountRef}
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "pre",
      }}
    >
      {displayText}
    </Component>
  );
}
