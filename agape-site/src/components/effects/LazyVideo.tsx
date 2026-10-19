"use client";

import { useRef, useState, useEffect } from "react";

interface LazyVideoProps {
  src: string;
  poster?: string;
  /** Landscape crop of the same clip, used when the viewport is wider than tall. */
  wideSrc?: string;
  widePoster?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * On mobile, defers video loading until the element scrolls into view.
 * On desktop, behaves like a normal autoplay video.
 */
export default function LazyVideo({ src, poster, wideSrc, widePoster, className, style }: LazyVideoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    // Picked once on mount — a portrait clip cropped to a landscape screen
    // wastes most of its pixels, so landscape screens get a pre-cropped encode.
    setWide(!!wideSrc && window.matchMedia("(min-aspect-ratio: 1/1)").matches);

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
  }, [wideSrc]);

  return (
    <div ref={ref} className={className} style={style}>
      {shouldLoad ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={wide ? widePoster ?? poster : poster}
          className="h-full w-full object-cover"
          style={style}
        >
          <source src={wide ? wideSrc : src} type="video/mp4" />
        </video>
      ) : (
        poster && (
          // Decorative background poster shown while the video is deferred on mobile
          <img
            src={poster}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={style}
          />
        )
      )}
    </div>
  );
}
