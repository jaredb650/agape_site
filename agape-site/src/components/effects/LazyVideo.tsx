"use client";

import { useRef, useState, useEffect } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * On mobile, defers video loading until the element scrolls into view.
 * On desktop, behaves like a normal autoplay video.
 */
export default function LazyVideo({ src, poster, className, style }: LazyVideoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Desktop: load immediately
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      setShouldLoad(true);
      return;
    }

    // Mobile: wait until in view
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={style}>
      {shouldLoad ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          className="h-full w-full object-cover"
          style={style}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        poster && (
          <img
            src={poster}
            alt=""
            className="h-full w-full object-cover"
            style={style}
          />
        )
      )}
    </div>
  );
}
