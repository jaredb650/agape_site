'use client';

import React from 'react';

interface InfiniteMarqueeProps {
  text: string;
  speed?: number;
  className?: string;
  separator?: React.ReactNode;
  variant?: 'ghost' | 'filled';
}

const REPEAT_COUNT = 8;

export default function InfiniteMarquee({
  text,
  speed = 30,
  className = '',
  separator,
  variant = 'ghost',
}: InfiniteMarqueeProps) {
  const defaultSeparator = <span className="mx-[0.4em]">&bull;</span>;
  const sep = separator ?? defaultSeparator;

  const items = Array.from({ length: REPEAT_COUNT }, (_, i) => (
    <React.Fragment key={i}>
      <span>{text}</span>
      {sep}
    </React.Fragment>
  ));

  const isGhost = variant === 'ghost';

  const trackStyle: React.CSSProperties = isGhost
    ? {
        fontFamily: 'var(--font-display, "Oswald", sans-serif)',
        textTransform: 'uppercase' as const,
        fontSize: 'clamp(4rem, 10vw, 10rem)',
        WebkitTextStroke: '1px rgba(255,255,255,0.15)',
        color: 'transparent',
        opacity: 0.07,
      }
    : {
        fontFamily: 'var(--font-display, "Oswald", sans-serif)',
        textTransform: 'uppercase' as const,
        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        letterSpacing: '0.2em',
        color: '#fafafa',
      };

  return (
    <div
      className={`overflow-hidden whitespace-nowrap pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex"
        style={{
          animation: `marquee-scroll ${speed}s linear infinite`,
          willChange: 'transform',
          ...trackStyle,
        }}
      >
        <div className="flex shrink-0 items-center">{items}</div>
        <div className="flex shrink-0 items-center">{items}</div>
      </div>
    </div>
  );
}
